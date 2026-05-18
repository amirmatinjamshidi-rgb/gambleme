import { z } from "zod";

import {
  CRASH_MIN_CASHOUT,
  DICE_MAX_TARGET,
  DICE_MIN_TARGET,
  MAX_BET,
  MAX_DEPOSIT,
  MAX_LINES,
  MIN_BET,
  SLOT_SYMBOLS,
} from "./constants";

export const gameTypeSchema = z.enum(["slot", "dice", "crash"]);
export type GameType = z.infer<typeof gameTypeSchema>;

export const slotSymbolSchema = z.enum(SLOT_SYMBOLS);
export type SlotSymbol = z.infer<typeof slotSymbolSchema>;

export const depositInputSchema = z.object({
  amount: z
    .number()
    .int("Deposit must be a whole number of credits")
    .min(1, "Deposit must be at least 1 credit")
    .max(MAX_DEPOSIT, `Deposit cannot exceed ${MAX_DEPOSIT} credits`),
});
export type DepositInput = z.infer<typeof depositInputSchema>;

export const slotBetInputSchema = z.object({
  betPerLine: z
    .number()
    .int("Bet per line must be a whole number")
    .min(MIN_BET)
    .max(MAX_BET),
  lines: z
    .number()
    .int()
    .min(1, "At least 1 payline required")
    .max(MAX_LINES, `At most ${MAX_LINES} paylines`),
});
export type SlotBetInput = z.infer<typeof slotBetInputSchema>;

export const diceDirectionSchema = z.enum(["over", "under"]);
export type DiceDirection = z.infer<typeof diceDirectionSchema>;

export const diceBetInputSchema = z.object({
  amount: z.number().int().min(MIN_BET).max(MAX_BET),
  target: z
    .number()
    .min(DICE_MIN_TARGET)
    .max(DICE_MAX_TARGET),
  direction: diceDirectionSchema,
});
export type DiceBetInput = z.infer<typeof diceBetInputSchema>;

export const crashBetInputSchema = z.object({
  amount: z.number().int().min(MIN_BET).max(MAX_BET),
});
export type CrashBetInput = z.infer<typeof crashBetInputSchema>;

export const crashCashoutInputSchema = z.object({
  roundId: z.string().min(1),
  cashoutAt: z.number().min(CRASH_MIN_CASHOUT).max(1000),
});
export type CrashCashoutInput = z.infer<typeof crashCashoutInputSchema>;

export const crashBustInputSchema = z.object({
  roundId: z.string().min(1),
});
export type CrashBustInput = z.infer<typeof crashBustInputSchema>;

export const crashStartResultSchema = z.object({
  roundId: z.string(),
  serverSeedHash: z.string(),
  bet: z.number(),
  newBalance: z.number(),
});
export type CrashStartResult = z.infer<typeof crashStartResultSchema>;

export const slotSpinResultSchema = z.object({
  spinId: z.string(),
  reels: z.array(z.array(slotSymbolSchema)),
  rows: z.array(z.array(slotSymbolSchema)),
  winnings: z.number(),
  winningRows: z.array(z.number().int()),
  betTotal: z.number(),
  newBalance: z.number(),
});
export type SlotSpinResult = z.infer<typeof slotSpinResultSchema>;

export const diceRollResultSchema = z.object({
  rollId: z.string(),
  result: z.number(),
  target: z.number(),
  direction: diceDirectionSchema,
  won: z.boolean(),
  payout: z.number(),
  newBalance: z.number(),
});
export type DiceRollResult = z.infer<typeof diceRollResultSchema>;

export const crashRoundResultSchema = z.object({
  roundId: z.string(),
  crashPoint: z.number(),
  cashedOutAt: z.number().optional(),
  won: z.boolean(),
  payout: z.number(),
  newBalance: z.number(),
});
export type CrashRoundResult = z.infer<typeof crashRoundResultSchema>;

export const crashSettleResultSchema = crashRoundResultSchema.extend({
  serverSeed: z.string(),
  serverSeedHash: z.string(),
});
export type CrashSettleResult = z.infer<typeof crashSettleResultSchema>;

export const historyEntrySchema = z.object({
  id: z.string(),
  game: gameTypeSchema,
  timestamp: z.number(),
  bet: z.number(),
  payout: z.number(),
  net: z.number(),
  summary: z.string(),
});
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

export const sessionStateSchema = z.object({
  balance: z.number(),
  history: z.array(historyEntrySchema),
});
export type SessionState = z.infer<typeof sessionStateSchema>;

export function actionError(message: string) {
  return { ok: false as const, error: message };
}

export function actionSuccess<T>(data: T) {
  return { ok: true as const, data };
}

export type ActionResult<T> =
  | ReturnType<typeof actionSuccess<T>>
  | ReturnType<typeof actionError>;
