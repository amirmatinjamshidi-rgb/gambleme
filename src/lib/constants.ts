export const MIN_BET = 1;
export const MAX_BET = 10_000;
export const MAX_LINES = 3;
export const MAX_DEPOSIT = 100_000;
export const START_BALANCE = 0;

export const SLOT_SYMBOLS = [
  "cherry",
  "bell",
  "grape",
  "watermelon",
  "seven",
  "diamond",
] as const;

export type SlotSymbol = (typeof SLOT_SYMBOLS)[number];

/** Payout multiplier per line when all 3 symbols match */
export const SYMBOL_PAYTABLE: Record<SlotSymbol, number> = {
  cherry: 2,
  bell: 4,
  grape: 3,
  watermelon: 5,
  seven: 10,
  diamond: 15,
};

export const DICE_MIN_TARGET = 1.01;
export const DICE_MAX_TARGET = 99;
export const CRASH_MIN_CASHOUT = 1.01;
