import { randomInt } from "node:crypto";

import { SLOT_SYMBOLS, type SlotSymbol } from "@/lib/constants";

/** Uniform integer in [min, max) — same semantics as `crypto.randomInt`. */
export function randomIntInRange(min: number, max: number): number {
  return randomInt(min, max);
}

/** Uniform float in [0, 1). */
export function randomFloat(): number {
  return randomInt(0, 1_000_000) / 1_000_000;
}

/** Pick one item uniformly from a non-empty array. */
export function pickOne<T>(items: readonly [T, ...T[]]): T;
export function pickOne<T>(items: readonly T[]): T | undefined;
export function pickOne<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[randomInt(0, items.length)];
}

/** Pick one item using integer weights (must sum > 0). */
export function pickWeighted<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) {
    throw new Error("pickWeighted: items must not be empty");
  }
  if (items.length !== weights.length) {
    throw new Error("pickWeighted: items and weights length mismatch");
  }

  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) {
    throw new Error("pickWeighted: weights must sum to a positive number");
  }

  let roll = randomInt(0, total);
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i]!;
    if (roll < 0) return items[i]!;
  }

  return items[items.length - 1]!;
}

/** Rarer symbols have lower weight (higher paytable multiplier). */
export const SLOT_SYMBOL_WEIGHTS: Record<SlotSymbol, number> = {
  cherry: 30,
  grape: 25,
  bell: 20,
  watermelon: 15,
  seven: 7,
  diamond: 3,
};

const SLOT_WEIGHT_LIST = SLOT_SYMBOLS.map((symbol) => SLOT_SYMBOL_WEIGHTS[symbol]);

export function pickSlotSymbol(): SlotSymbol {
  return pickWeighted(SLOT_SYMBOLS, SLOT_WEIGHT_LIST);
}

/** Dice result with two decimal places in [0, 100]. */
export function rollDiceResult(): number {
  return randomInt(0, 10_001) / 100;
}

/** Crash-style multiplier in [1, max] with two decimal places (demo curve). */
export function rollCrashPoint(max = 100): number {
  const cap = Math.max(101, Math.floor(max * 100) + 1);
  const raw = randomInt(101, cap);
  return raw / 100;
}
