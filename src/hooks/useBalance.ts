"use client";

import { useCallback } from "react";

import type { ActionResult } from "@/lib/schemas";
import { useSession } from "@/hooks/useSession";
import { useAppStore } from "@/state/store";

function extractBalance(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;

  if ("newBalance" in data && typeof data.newBalance === "number") {
    return data.newBalance;
  }

  if ("balance" in data && typeof data.balance === "number") {
    return data.balance;
  }

  return null;
}

export function useBalance() {
  const { balance, alias, isLoading, refresh } = useSession();
  const setBalance = useAppStore((state) => state.setBalance);
  const pushToast = useAppStore((state) => state.pushToast);

  const applyBalance = useCallback(
    (nextBalance: number) => {
      setBalance(nextBalance);
    },
    [setBalance],
  );

  const handleActionResult = useCallback(
    <T,>(result: ActionResult<T>, onSuccess?: (data: T) => void): result is {
      ok: true;
      data: T;
    } => {
      if (!result.ok) {
        pushToast(result.error, "error");
        return false;
      }

      const nextBalance = extractBalance(result.data);
      if (nextBalance !== null) {
        setBalance(nextBalance);
      }

      onSuccess?.(result.data);
      return true;
    },
    [pushToast, setBalance],
  );

  return {
    balance,
    alias,
    isLoading,
    refresh,
    applyBalance,
    handleActionResult,
  };
}
