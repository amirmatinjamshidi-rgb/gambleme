import { randomInt, randomUUID } from "node:crypto";

import { START_BALANCE } from "@/lib/constants";
import type { HistoryEntry } from "@/lib/schemas";

export type ActiveCrashRound = {
  roundId: string;
  amount: number;
  crashPoint: number;
  serverSeed: string;
  serverSeedHash: string;
};

export type UserState = {
  balance: number;
  history: HistoryEntry[];
  activeCrash: ActiveCrashRound | null;
  alias: string;
};

const sessions = new Map<string, UserState>();

function createAlias(): string {
  return `Player-${randomInt(1000, 9999)}`;
}

function createDefaultState(): UserState {
  return {
    balance: START_BALANCE,
    history: [],
    activeCrash: null,
    alias: createAlias(),
  };
}

export function getUserState(sessionId: string): UserState {
  let state = sessions.get(sessionId);
  if (!state) {
    state = createDefaultState();
    sessions.set(sessionId, state);
  }
  return state;
}

export function depositCredits(sessionId: string, amount: number): UserState {
  const state = getUserState(sessionId);
  state.balance += amount;
  return state;
}

export function deductBalance(sessionId: string, amount: number): boolean {
  const state = getUserState(sessionId);
  if (state.balance < amount) return false;
  state.balance -= amount;
  return true;
}

export function creditBalance(sessionId: string, amount: number): UserState {
  const state = getUserState(sessionId);
  state.balance += amount;
  return state;
}

export function appendHistory(
  sessionId: string,
  entry: Omit<HistoryEntry, "id" | "timestamp">,
): HistoryEntry {
  const state = getUserState(sessionId);
  const record: HistoryEntry = {
    ...entry,
    id: randomUUID(),
    timestamp: Date.now(),
  };
  state.history.unshift(record);
  if (state.history.length > 500) {
    state.history.length = 500;
  }
  return record;
}

export function setActiveCrash(
  sessionId: string,
  round: ActiveCrashRound,
): void {
  getUserState(sessionId).activeCrash = round;
}

export function clearActiveCrash(sessionId: string): void {
  getUserState(sessionId).activeCrash = null;
}

export function getActiveCrash(sessionId: string): ActiveCrashRound | null {
  return getUserState(sessionId).activeCrash;
}

export function resetUserState(sessionId: string): UserState {
  const state = createDefaultState();
  sessions.set(sessionId, state);
  return state;
}

export type LeaderboardRow = {
  sessionId: string;
  alias: string;
  balance: number;
};

export function getLeaderboard(limit = 50): LeaderboardRow[] {
  return Array.from(sessions.entries())
    .map(([sessionId, state]) => ({
      sessionId,
      alias: state.alias,
      balance: state.balance,
    }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit);
}
