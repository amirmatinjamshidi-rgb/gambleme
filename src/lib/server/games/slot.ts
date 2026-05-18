import { randomInt } from "node:crypto";

import {
  SYMBOL_PAYTABLE,
  SLOT_SYMBOLS,
  type SlotSymbol,
} from "@/lib/constants";
import { pickSlotSymbol } from "@/lib/server/rng";

const ROWS = 3;
const COLS = 3;
const SPIN_STRIP_LENGTH = 10;

function pickUniqueColumnSymbols(count: number): SlotSymbol[] {
  const pool = [...SLOT_SYMBOLS];
  const picked: SlotSymbol[] = [];

  for (let i = 0; i < count; i++) {
    const index = randomInt(0, pool.length);
    picked.push(pool[index]!);
    pool.splice(index, 1);
  }

  return picked;
}

function transposeFinalRows(reels: SlotSymbol[][]): SlotSymbol[][] {
  const rows: SlotSymbol[][] = [];

  for (let row = 0; row < ROWS; row++) {
    const line: SlotSymbol[] = [];
    for (let col = 0; col < COLS; col++) {
      line.push(reels[col]![reels[col]!.length - ROWS + row]!);
    }
    rows.push(line);
  }

  return rows;
}

export function buildSlotSpin(): {
  reels: SlotSymbol[][];
  rows: SlotSymbol[][];
} {
  const reels: SlotSymbol[][] = [];

  for (let col = 0; col < COLS; col++) {
    const strip: SlotSymbol[] = [];
    for (let i = 0; i < SPIN_STRIP_LENGTH; i++) {
      strip.push(pickSlotSymbol());
    }
    const finals = pickUniqueColumnSymbols(ROWS);
    reels.push([...strip, ...finals]);
  }

  return { reels, rows: transposeFinalRows(reels) };
}

export function calculateSlotWinnings(
  rows: SlotSymbol[][],
  betPerLine: number,
  lines: number,
): { winnings: number; winningRows: number[] } {
  let winnings = 0;
  const winningRows: number[] = [];

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    if (!symbols) continue;

    const first = symbols[0];
    if (first && symbols.every((symbol) => symbol === first)) {
      winnings += betPerLine * SYMBOL_PAYTABLE[first];
      winningRows.push(row);
    }
  }

  return { winnings, winningRows };
}

export function getSlotBetTotal(betPerLine: number, lines: number): number {
  return betPerLine * lines;
}
