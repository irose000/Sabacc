import * as constants from './constants.js';


const players = [];
let numPlayers;
let startingChips;
let currentPlayerIndex = 0;

const setupForm = document.querySelector('.setupForm');
const playerOptions = document.getElementById('playerOptions');
const numPlayersSelector = document.getElementById('numPlayers');
const numShiftTokensInput = document.getElementById('numShiftTokens');
const playerShiftTokenSets = document.getElementById('playerShiftTokenSets');
let shiftTokenValues;
let selectedShiftFormat;
const newGameButton = document.querySelector(".newGameSubmit");

const gameBoard = document.querySelector('.gameBoard');
const drawSandDeckButton = document.querySelector("#drawSandDeck");
const drawBloodDeckButton = document.querySelector("#drawBloodDeck");
const standButton = document.querySelector("#standButton");

for (let d in decks) {
    let capitalizedDeck = d.charAt(0).toUpperCase() + d.slice(1);
    document.getElementById(`draw${capitalizedDeck}Deck`).addEventListener('click', () => {
        drawCard(d);
    })
}

/*
document.getElementById('drawSandDeck').addEventListener('click', () => {
    drawCard('sand');
});

document.getElementById('drawBloodDeck').addEventListener('click', () => {
    drawCard('blood');
});
*/

drawBloodDeckButton.addEventListener("click", drawBloodDeck);
drawSandDeckButton.addEventListener("click", drawSandDeck);
standButton.addEventListener("click", stand);

newGameButton.addEventListener("click", initializeGame);
numPlayersSelector.addEventListener('change', generateDropdownSets);
numShiftTokensInput.addEventListener('input', generateDropdownSets);

document.querySelectorAll('input[name="shiftFormat"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === 'playerOwned') {
            playerShiftTokenSets.style.display = 'block';
            generateDropdownSets();  // Initialize dropdowns based on current values
        } else {
            playerShiftTokenSets.style.display = 'none';
            // playerShiftTokenSets.innerHTML = '';  // Clear any dropdowns
        }
    });
});


// TODO
function takeTurn() {
    // OPTIONAL: play shift token
    // CHOOSE ONE: stand or draw
    // STAND: do nothing
    // DRAW: costs one chip. draw a single card from top of either face-down
    //   deck or top of either face-up discard pile. Then discard a card of 
    //   the same suit.
}

function initializeGame() {
    decks.sand = starterSandDeck;
    decks.blood = starterBloodDeck;
    shuffle(decks.sand);
    shuffle(decks.blood);
    discardPiles.sand = [];
    discardPiles.blood = [];

    numPlayers = parseInt(numPlayersSelector.value);
    startingChips = document.getElementById('numChips').value;

    selectedShiftFormat = document.querySelector('input[name="shiftFormat"]:checked').value;
    shiftTokenValues = fetchShiftTokenValues();

    for (let i = 1; i <= numPlayers; i++) {
        let player = {
            sandCard: decks.sand.pop(),
            bloodCard: decks.blood.pop(),
            shiftTokens: shiftTokenValues[`player${i}`],
            chips: startingChips
        };
        players.push(player);
    }
    discardPiles.sand.push(decks.sand.pop());
    discardPiles.blood.push(decks.blood.pop());

    displayGameBoard();
}

function displayGameBoard() {
    setupForm.style.display = 'none';
    gameBoard.style.display = 'block';

    let player1Cards = document.querySelectorAll('.player-hand #player1Cards .card');

    // TODO: fix display of cards and shift tokens
    player1Cards[0].textContent = players[0]['sandCard'];
    player1Cards[1].textContent = players[0]['bloodCard'];

    let player1ShiftTokensDisplay = document.querySelectorAll('.shift-tokens #player1ShiftTokens .shift-token');
    for (let i = 0; i < shiftTokenValues['player1'].length; i++) {
        player1ShiftTokensDisplay[i].value = shiftTokenValues['player1'][i];
    }
}

/*
// TODO
function drawSandDeck() {
    let newSandCard = decks.sand.pop();
    
    // Display the new card in the "drawnSandCard" div
    const drawnSandCardDiv = document.getElementById('drawnSandCard');
    drawnSandCardDiv.textContent = `New Sand Card: ${newSandCard}`;
    
    // Disable the draw and stand buttons
    document.getElementById('drawSandDeck').disabled = true;
    document.getElementById('standButton').disabled = true;

    // Show the "Keep" and "Discard" buttons
    document.getElementById('keepOrDiscardSand').style.display = 'block';

    // Add functionality for keeping or discarding the card
    handleKeepOrDiscard(newSandCard, "sand", currentPlayerIndex);
}

// TODO
function drawBloodDeck() {
    let newBloodCard = decks.blood.pop();
    
    // Display the new card in the "drawnSandCard" div
    const drawnBloodCardDiv = document.getElementById('drawnBloodCard');
    drawnBloodCardDiv.textContent = `New Blood Card: ${newBloodCard}`;
    
    // Disable the draw and stand buttons
    document.getElementById('drawBloodDeck').disabled = true;
    document.getElementById('standButton').disabled = true;

    // Show the "Keep" and "Discard" buttons
    document.getElementById('keepOrDiscardBlood').style.display = 'block';

    // Add functionality for keeping or discarding the card
    handleKeepOrDiscard(newBloodCard, "blood", currentPlayerIndex);
}
*/

function drawCard(deck) {
    let newCard = decks[`${deck}`].pop();
    let capitalizedDeck = deck.charAt(0).toUpperCase() + deck.slice(1);

    // show drawn card
    const drawnCardDiv = document.getElementById(`drawn${capitalizedDeck}Card`);
    drawnCardDiv.textContent = `New ${capitalizedDeck} card: ${newCard}`;
    // enable keep and discard buttons
    document.getElementById(`keepOrDiscard${capitalizedDeck}`).style.display = 'block';

    // disable draw buttons
    for (let d in decks) {
        let capitalizedDeck = d.charAt(0).toUpperCase() + d.slice(1);
        document.getElementById(`draw${capitalizedDeck}Deck`).disabled = true;
    }
    // disable stand button
    document.getElementById('standButton').disabled = true;

    handleKeepOrDiscard(newCard, deck, currentPlayerIndex);
}

function handleKeepOrDiscard(newCard, deck, playerIndex) {
    let keepButton;
    let discardButton;
    let capitalizedDeck = deck.charAt(0).toUpperCase() + deck.slice(1);
    keepButton = document.getElementById(`keep${capitalizedDeck}Card`);
    discardButton = document.getElementById(`discard${capitalizedDeck}Card`);

    // When the player chooses to keep the new card
    keepButton.addEventListener('click', function () {
        // Discard the old sand card and keep the new one
        discardPiles[deck].push(players[playerIndex][`${deck}Card`]);
        console.log(discardPiles[deck]);
        players[playerIndex][`${deck}Card`] = newCard;

        // update display
        let discardDisplay = document.querySelector(`.${deck}Discard`);
        discardDisplay.textContent = `${deck} discard (${discardPiles[deck].length} cards):\n` + discardPiles[deck][discardPiles[deck].length - 1];

        console.log(`Player ${playerIndex + 1} keeps new ${deck} card: ${newCard}`);

        // Hide the keep/discard buttons and re-enable draw/stand buttons
        resetAfterAction();
    });

    // When the player chooses to discard the new card
    discardButton.addEventListener('click', function () {
        // Keep the old sand card, discard the new one
        discardPiles[deck].push(newCard);
        console.log(`Player ${playerIndex + 1} discards new ${deck} card: ${newCard}`);

        // Hide the keep/discard buttons and re-enable draw/stand buttons
        resetAfterAction();
    });
}

// Function to reset after keeping or discarding the card
function resetAfterAction() {
    // Hide the "Keep" and "Discard" buttons
    document.getElementById('keepOrDiscardSand').style.display = 'none';
    document.getElementById('keepOrDiscardBlood').style.display = 'none';

    // Clear the drawn card display
    document.getElementById('drawnSandCard').textContent = '';
    document.getElementById('drawnBloodCard').textContent = '';

    // Re-enable the draw and stand buttons
    document.getElementById('drawSandDeck').disabled = false;
    document.getElementById('drawBloodDeck').disabled = false;
    document.getElementById('standButton').disabled = false;

    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
}

// TODO
function stand() {

}

function fetchShiftTokenValues() {
    const shiftTokenValues = {};

    // Loop through the players
    for (let i = 1; i <= numPlayers; i++) {
        shiftTokenValues[`player${i}`] = [];

        // Loop through the shift tokens for each player
        for (let j = 1; j <= numShiftTokens; j++) {
            if (selectedShiftFormat == constants.SHIFT_FORMAT.PLAYER_OWNED) {
                const selectElement = document.querySelector(`select[name="player${i}_shiftToken${j}"]`);
                const selectedValue = selectElement.value;
                shiftTokenValues[`player${i}`].push(selectedValue);
            } else {
                let tokenIndex = Math.floor(Math.random() * constants.SHIFT_TOKEN_TYPES.length) + 1;
                let randomToken = constants.SHIFT_TOKEN_TYPES[tokenIndex];
                shiftTokenValues[`player${i}`].push(randomToken);
            }
        }
    }
    return shiftTokenValues;
}

function generateDropdownSets() {
    const numPlayers = parseInt(numPlayersSelector.value);
    const numShiftTokens = parseInt(numShiftTokensInput.value);

    // Clear the existing dropdowns
    playerShiftTokenSets.innerHTML = '';

    // For each player
    for (let i = 1; i <= numPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.innerHTML = `<strong>Player ${i}</strong>`;

        // For each shift token
        for (let j = 1; j <= numShiftTokens; j++) {
            const select = document.createElement('select');

            select.name = `player${i}_shiftToken${j}`;

            constants.SHIFT_TOKEN_TYPES.forEach((tokenType) => {
                const option = document.createElement('option');
                option.value = tokenType;
                option.textContent = tokenType;
                select.appendChild(option);
            });

            playerDiv.appendChild(document.createTextNode(`Shift Token ${j}: `));
            playerDiv.appendChild(select);
        }
        playerShiftTokenSets.appendChild(playerDiv);
    }
}

// TODO
function dealNewRound() {

}