module.exports = {
    MIN_PLAYERS: 2,

    STARTING_CHIPS: 8,
    MIN_STARTING_CHIPS: 4,

    STARTING_SHIFT_TOKENS: 2,
    MIN_SHIFT_TOKENS: 0,

    SHIFT_FORMAT: {
        RANDOM: "random",
        PLAYER_OWNED: "playerOwned"
    },

    SHIFT_TOKEN_TYPES: [
        "FREE DRAW",
        "REFUND",
        "GENERAL TARIFF",
        "TARGET TARIFF",
        "EMBARGO"],

    TURNS_PER_ROUND: 3,
    MIN_TURNS_PER_ROUND: 1,

    DRAW_COST: 1,
    MIN_DRAW_COST: 0,

    // valid options are "playerOwned" or "random"
    // "playerOwned": players bring owned shift tokens of their choice into the game
    // "random": players are randomly assigned shift tokens at the beginning of the game
    //SHIFT_TOKEN_FORMAT: "playerOwned",


    SETTINGS_VALIDATION_STATUS: {
        VALID: 0,
        NUM_PLAYERS: 1,
        NUM_CHIPS: 2,
        NUM_SHIFT_TOKENS: 3,
        SHIFT_FORMAT: 4,
        SHIFT_TOKEN_TYPES: 5,
        NUM_TURNS_PER_ROUND: 6,
        DRAW_COST: 7
    },
};