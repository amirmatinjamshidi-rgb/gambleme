import { createHash, randomBytes, randomUUID } from "node:crypto";

export type CrashRoundCommit = {
  roundId: string;
  serverSeed: string;
  serverSeedHash: string;
  crashPoint: number;
};

/** Derive demo crash multiplier from a SHA-256 hash (Stake-style curve). */
export function crashPointFromHash(hash: string): number {
  const slice = hash.slice(0, 13);
  const h = parseInt(slice, 16);
  const e = Math.pow(2, 52);
  const raw = (100 * e - h) / (e - h);
  const point = Math.max(1.01, Math.floor(raw * 100) / 100);
  return Math.min(point, 1000);
}

export function createCrashRound(): CrashRoundCommit {
  const serverSeed = randomBytes(32).toString("hex");
  const serverSeedHash = createHash("sha256").update(serverSeed).digest("hex");
  const crashPoint = crashPointFromHash(serverSeedHash);

  return {
    roundId: randomUUID(),
    serverSeed,
    serverSeedHash,
    crashPoint,
  };
}

export function resolveCrashCashout(
  amount: number,
  crashPoint: number,
  cashoutAt: number,
): { won: boolean; payout: number } {
  if (cashoutAt < 1.01) {
    return { won: false, payout: 0 };
  }

  if (cashoutAt >= crashPoint) {
    return { won: false, payout: 0 };
  }

  const payout = Math.floor(amount * cashoutAt * 100) / 100;
  return { won: true, payout };
}
