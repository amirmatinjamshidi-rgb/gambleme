import type { DiceDirection } from "@/lib/schemas";

const HOUSE_EDGE = 0.99;
const MIN_PROBABILITY = 0.01;

function winProbability(target: number, direction: DiceDirection): number {
  const probability =
    direction === "over" ? (100 - target) / 100 : target / 100;
  return Math.max(probability, MIN_PROBABILITY);
}

export function resolveDiceRoll(
  amount: number,
  target: number,
  direction: DiceDirection,
  result: number,
): { won: boolean; payout: number } {
  const won =
    direction === "over" ? result > target : result < target;

  if (!won) {
    return { won: false, payout: 0 };
  }

  const probability = winProbability(target, direction);
  const payout =
    Math.floor((amount * (HOUSE_EDGE / probability)) * 100) / 100;

  return { won: true, payout };
}
