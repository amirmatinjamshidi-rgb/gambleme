"use server";

import {
  actionError,
  actionSuccess,
  depositInputSchema,
  type ActionResult,
} from "@/lib/schemas";

import { getOrCreateSessionId } from "@/lib/server/session";
import { depositCredits, getUserState } from "@/lib/server/store";

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

    return actionSuccess({ balance: state.balance });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Deposit failed";
    return actionError(message);
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
    const message =
      error instanceof Error ? error.message : "Could not load session";
    return actionError(message);
  }
}
