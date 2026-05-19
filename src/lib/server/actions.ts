"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import {
  actionError,
  actionSuccess,
  crashBetInputSchema,
  crashBustInputSchema,
  crashCashoutInputSchema,
  depositInputSchema,
  diceBetInputSchema,
  slotBetInputSchema,
  type ActionResult,
  type CrashSettleResult,
  type CrashStartResult,
  type DiceRollResult,
  type SlotSpinResult,
} from "@/lib/schemas";

import { createCrashRound, resolveCrashCashout } from "@/lib/server/games/crash";
import { resolveDiceRoll } from "@/lib/server/games/dice";
import {
  buildSlotSpin,
  calculateSlotWinnings,
  getSlotBetTotal,
} from "@/lib/server/games/slot";
import { rollDiceResult } from "@/lib/server/rng";
import { getOrCreateSessionId } from "@/lib/server/session";
import {
  appendHistory,
  clearActiveCrash,
  creditBalance,
  deductBalance,
  depositCredits,
  getActiveCrash,
  getUserState,
  resetUserState,
  setActiveCrash,
} from "@/lib/server/store";

function formatActionError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function depositAction(
  input: unknown,
): Promise<ActionResult<{ balance: number }>> {
  const parsed = depositInputSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid deposit amount";
    return actionError(message);
  }

  try {
    const sessionId = await getOrCreateSessionId();
    const state = depositCredits(sessionId, parsed.data.amount);
    revalidatePath("/history");
    revalidatePath("/leaderboard");
    return actionSuccess({ balance: state.balance });
  } catch (error) {
    return actionError(formatActionError(error, "Deposit failed"));
  }
}

export async function getSessionStateAction(): Promise<
  ActionResult<{ balance: number; alias: string }>
> {
  try {
    const sessionId = await getOrCreateSessionId();
    const state = getUserState(sessionId);
    return actionSuccess({ balance: state.balance, alias: state.alias });
  } catch (error) {
    return actionError(formatActionError(error, "Could not load session"));
  }
}

export async function spinSlotAction(
  input: unknown,
): Promise<ActionResult<SlotSpinResult>> {
  const parsed = slotBetInputSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid slot bet";
    return actionError(message);
  }

  try {
    const sessionId = await getOrCreateSessionId();
    const betTotal = getSlotBetTotal(parsed.data.betPerLine, parsed.data.lines);

    if (!deductBalance(sessionId, betTotal)) {
      return actionError("Insufficient balance for this bet");
    }

    const { reels, rows } = buildSlotSpin();
    const { winnings, winningRows } = calculateSlotWinnings(
      rows,
      parsed.data.betPerLine,
      parsed.data.lines,
    );

    if (winnings > 0) {
      creditBalance(sessionId, winnings);
    }

    const state = getUserState(sessionId);
    const net = winnings - betTotal;

    appendHistory(sessionId, {
      game: "slot",
      bet: betTotal,
      payout: winnings,
      net,
      summary:
        winnings > 0
          ? `Won ${winnings} on ${winningRows.length} line(s)`
          : "No winning lines",
    });

    revalidatePath("/history");
    revalidatePath("/leaderboard");

    return actionSuccess({
      spinId: randomUUID(),
      reels,
      rows,
      winnings,
      winningRows,
      betTotal,
      newBalance: state.balance,
    });
  } catch (error) {
    return actionError(formatActionError(error, "Slot spin failed"));
  }
}

export async function rollDiceAction(
  input: unknown,
): Promise<ActionResult<DiceRollResult>> {
  const parsed = diceBetInputSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid dice bet";
    return actionError(message);
  }

  try {
    const sessionId = await getOrCreateSessionId();
    const { amount, target, direction } = parsed.data;

    if (!deductBalance(sessionId, amount)) {
      return actionError("Insufficient balance for this bet");
    }

    const result = rollDiceResult();
    const { won, payout } = resolveDiceRoll(amount, target, direction, result);

    if (payout > 0) {
      creditBalance(sessionId, payout);
    }

    const state = getUserState(sessionId);
    const net = payout - amount;

    appendHistory(sessionId, {
      game: "dice",
      bet: amount,
      payout,
      net,
      summary: won
        ? `Rolled ${result.toFixed(2)} — won ${payout}`
        : `Rolled ${result.toFixed(2)} — lost`,
    });

    revalidatePath("/history");
    revalidatePath("/leaderboard");

    return actionSuccess({
      rollId: randomUUID(),
      result,
      target,
      direction,
      won,
      payout,
      newBalance: state.balance,
    });
  } catch (error) {
    return actionError(formatActionError(error, "Dice roll failed"));
  }
}

export async function startCrashAction(
  input: unknown,
): Promise<ActionResult<CrashStartResult>> {
  const parsed = crashBetInputSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid crash bet";
    return actionError(message);
  }

  try {
    const sessionId = await getOrCreateSessionId();

    if (getActiveCrash(sessionId)) {
      return actionError("Finish or bust your current crash round first");
    }

    const { amount } = parsed.data;

    if (!deductBalance(sessionId, amount)) {
      return actionError("Insufficient balance for this bet");
    }

    const round = createCrashRound();
    setActiveCrash(sessionId, {
      roundId: round.roundId,
      amount,
      crashPoint: round.crashPoint,
      serverSeed: round.serverSeed,
      serverSeedHash: round.serverSeedHash,
    });

    const state = getUserState(sessionId);

    return actionSuccess({
      roundId: round.roundId,
      serverSeedHash: round.serverSeedHash,
      bet: amount,
      newBalance: state.balance,
    });
  } catch (error) {
    return actionError(formatActionError(error, "Could not start crash round"));
  }
}

export async function cashoutCrashAction(
  input: unknown,
): Promise<ActionResult<CrashSettleResult>> {
  const parsed = crashCashoutInputSchema.safeParse(input);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid crash cashout";
    return actionError(message);
  }

  try {
    const sessionId = await getOrCreateSessionId();
    const active = getActiveCrash(sessionId);

    if (!active || active.roundId !== parsed.data.roundId) {
      return actionError("No active crash round for this id");
    }

    const { won, payout } = resolveCrashCashout(
      active.amount,
      active.crashPoint,
      parsed.data.cashoutAt,
    );

    if (won && payout > 0) {
      creditBalance(sessionId, payout);
    }

    clearActiveCrash(sessionId);
    const state = getUserState(sessionId);
    const net = payout - active.amount;

    appendHistory(sessionId, {
      game: "crash",
      bet: active.amount,
      payout,
      net,
      summary: won
        ? `Cashed out at ${parsed.data.cashoutAt.toFixed(2)}x`
        : `Busted at ${parsed.data.cashoutAt.toFixed(2)}x (crash ${active.crashPoint.toFixed(2)}x)`,
    });

    revalidatePath("/history");
    revalidatePath("/leaderboard");

    return actionSuccess({
      roundId: active.roundId,
      crashPoint: active.crashPoint,
      cashedOutAt: won ? parsed.data.cashoutAt : undefined,
      won,
      payout,
      newBalance: state.balance,
      serverSeed: active.serverSeed,
      serverSeedHash: active.serverSeedHash,
    });
  } catch (error) {
    return actionError(formatActionError(error, "Crash cashout failed"));
  }
}

export async function bustCrashAction(
  input: unknown,
): Promise<ActionResult<CrashSettleResult>> {
  const parsed = crashBustInputSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid bust request";
    return actionError(message);
  }

  try {
    const sessionId = await getOrCreateSessionId();
    const active = getActiveCrash(sessionId);

    if (!active || active.roundId !== parsed.data.roundId) {
      return actionError("No active crash round for this id");
    }

    clearActiveCrash(sessionId);
    const state = getUserState(sessionId);

    appendHistory(sessionId, {
      game: "crash",
      bet: active.amount,
      payout: 0,
      net: -active.amount,
      summary: `Busted at ${active.crashPoint.toFixed(2)}x`,
    });

    revalidatePath("/history");
    revalidatePath("/leaderboard");

    return actionSuccess({
      roundId: active.roundId,
      crashPoint: active.crashPoint,
      won: false,
      payout: 0,
      newBalance: state.balance,
      serverSeed: active.serverSeed,
      serverSeedHash: active.serverSeedHash,
    });
  } catch (error) {
    return actionError(formatActionError(error, "Crash bust failed"));
  }
}

export async function resetAction(): Promise<
  ActionResult<{ balance: number }>
> {
  try {
    const sessionId = await getOrCreateSessionId();
    const state = resetUserState(sessionId);
    revalidatePath("/history");
    revalidatePath("/leaderboard");
    return actionSuccess({ balance: state.balance });
  } catch (error) {
    return actionError(formatActionError(error, "Reset failed"));
  }
}
