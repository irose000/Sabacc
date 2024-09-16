export const STARTING_CHIPS = 8;
export const STARTING_SHIFT_TOKENS = 2;
export const TURNS_PER_ROUND = 3;
export const DRAW_COST = 1;
export const SHIFT_TOKEN_MAX = 3;
// valid options are "player" or "random"
// "player": players bring owned shift tokens of their choice into the game
// "random": players are randomly assigned shift tokens at the beginning of the game
export const SHIFT_TOKENS_SELECTION = "player";
export const SHIFT_TOKEN_TYPES = [
    "FREE DRAW",
    "REFUND",
    "GENERAL TARIFF",
    "TARGET TARIFF",
    "EMBARGO"];
export const SHIFT_FORMAT = {
    RANDOM: "random",
    PLAYER_OWNED: "playerOwned"
};