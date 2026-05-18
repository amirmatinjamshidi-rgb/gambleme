"use client";

import { useCallback, useEffect } from "react";

import { getSessionStateAction } from "@/lib/server/actions";
import { useAppStore } from "@/state/store";

export function useSession() {
  const balance = useAppStore((state) => state.balance);
  const alias = useAppStore((state) => state.alias);
  const isLoading = useAppStore((state) => state.isBalanceLoading);
  const setBalance = useAppStore((state) => state.setBalance);
  const setAlias = useAppStore((state) => state.setAlias);
  const setBalanceLoading = useAppStore((state) => state.setBalanceLoading);
  const pushToast = useAppStore((state) => state.pushToast);

  const refresh = useCallback(async () => {
    setBalanceLoading(true);
    const result = await getSessionStateAction();
    setBalanceLoading(false);

    if (result.ok) {
      setBalance(result.data.balance);
      setAlias(result.data.alias);
      return result.data;
    }

    pushToast(result.error, "error");
    return null;
  }, [pushToast, setAlias, setBalance, setBalanceLoading]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    balance,
    alias,
    isLoading,
    refresh,
  };
}
