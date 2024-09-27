const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const constants = require('./constants.js');
const path = require('path');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.js'));
}); */

let clients = new Map();
let playerStates = {};
let gameSettings = {
    numPlayers: 2,
    numChips: 4,
    numShiftTokens: 3,
    shiftFormat: 'playerOwned',
    shiftTokens: {}
};

const starterSandDeck = [
    '1', '2', '3', '4', '5', '6', 'imposter',
    '1', '2', '3', '4', '5', '6', 'imposter',
    '1', '2', '3', '4', '5', '6', 'imposter',
    'sylop'];
const starterBloodDeck = [
    '1', '2', '3', '4', '5', '6', 'imposter',
    '1', '2', '3', '4', '5', '6', 'imposter',
    '1', '2', '3', '4', '5', '6', 'imposter',
    'sylop'];

let decks = {
    sand: starterSandDeck,
    blood: starterBloodDeck
};

let discardPiles = {
    sand: [],
    blood: []
};

function broadcast(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function shuffle(deck) {
    return deck.toSorted(() => Math.random() - 0.5);
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // on player join, add to list and broadcast
        if (data.action === 'join') {
            const username = data.username;

            if (Object.keys(playerStates).includes(username)) {
                ws.send(JSON.stringify({ action: 'error', message: 'Username is already taken' }));
            } else {
                clients.set(ws, username);
                playerStates[username] = { ready: false };
                broadcast({ action: 'updatePlayers', players: Object.keys(playerStates) });
            }

            // when anyone changes game settings, un-ready all players and broadcast state and options
        } else if (data.action === 'setOption') {
            try {
                const username = clients.get(ws);
            } catch (error) {
                console.log('Please sign up to play first');
            }

            // temp settings
            let tempSettings = gameSettings;

            // un-ready all players
            playerStates = setPlayerReadiness(constants.READINESS.NOT_READY);

            broadcast({ action: 'updateReady', players: playerStates });

            // updated game settings with change
            if (data.option == shiftTokens) {
                if (data.option.shiftTokens == username) {
                    if (Object.keys(data.option.shiftTokens.username).length > tempSettings.numShiftTokens) {
                        console.log('Please update the number of shift tokens first');
                    } else {
                        tempSettings.shiftTokens[username] = data.option.shiftTokens.username;
                    }
                } else {
                    console.log('You can\'t change other players\' shift tokens!');
                }
            } else {
                tempSettings[data.option] = data.value;
            }

            let settingStatus = validateSettings(tempSettings);
            if (settingStatus === constants.SETTINGS_VALIDATION_STATUS.VALID) {
                gameSettings = tempSettings;
                // TODO: add custom messages for each validation fail mode
            } else {
                console.log('invalid settings')
            }

            // compose new full settings message and broadcast
            updatedSettings = gameSettings;
            updatedSettings['action'] = 'setOption';
            broadcast(updatedSettings);

            // broadcast player readying up
        } else if (data.action === 'playerReady') {
            const username = clients.get(ws);
            playerStates[username].ready = data.readyStatus;
            broadcast({ action: 'updateReady', players: playerStates });

            const allReady = Object.values(playerStates).every(player => player.ready);
            if (allReady) {
                broadcast({ action: 'newGame', settings: gameSettings });
            }
        }
    });

    ws.on('close', () => {
        const username = clients.get(ws);
        if (username) {
            delete playerStates[username];
            clients.delete(ws);

            broadcast({ action: 'updatePlayers', players: Object.keys(playerStates) });
        }
        console.log(`Player '${username}' disconnected`);
    });
});

function setPlayerReadiness(isReady) {
    if () {

    }
}

function newGame() {

    newRound();
}

function newRound() {
    decks.sand = shuffle(starterSandDeck);
    decks.blood = shuffle(starterBloodDeck);
    discardPiles.sand = [];
    discardPiles.blood = [];
}

function validateSettings(settings) {
    // check each player's shift tokens to see if they're valid types
    function validateShiftTokens(shiftTokens) {
        shiftTokens.forEach(player => {
            player.forEach(token => {
                if (!constants.SHIFT_TOKEN_TYPES.includes(token)) {
                    return false;
                }
            });
        });
        return true;
    }

    if (settings.numPlayers < constants.MIN_PLAYERS) {
        return constants.SETTINGS_VALIDATION_STATUS.NUM_PLAYERS;

    } else if (settings.numChips < constants.MIN_STARTING_CHIPS) {
        return constants.SETTINGS_VALIDATION_STATUS.NUM_CHIPS;

    } else if (settings.numShiftTokens < constants.MIN_SHIFT_TOKENS) {
        return constants.SETTINGS_VALIDATION_STATUS.NUM_SHIFT_TOKENS;

        // invalid shift format
    } else if (!Objects.values(constants.SHIFT_FORMAT).includes(settings.shiftFormat)) {
        return constants.SETTINGS_VALIDATION_STATUS.SHIFT_FORMAT;

        // invalid shift tokens
    } else if (!validateShiftTokens(settings.shiftTokens)) {
        return constants.SETTINGS_VALIDATION_STATUS.SHIFT_TOKEN_TYPES;

    } else {
        return constants.SETTINGS_VALIDATION_STATUS.VALID;
    }
}


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});