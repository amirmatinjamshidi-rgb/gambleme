"use client";

import { useState } from "react";

import { Counter } from "@/components/ui/Counter";
import { NeonButton } from "@/components/ui/NeonButton";
import { depositAction } from "@/lib/server/actions";
import { useBalance } from "@/hooks/useBalance";
import { useAppStore } from "@/state/store";

export function LobbyBalance() {
  const { balance, alias, isLoading, handleActionResult } = useBalance();
  const pushToast = useAppStore((s) => s.pushToast);
  const [depositing, setDepositing] = useState(false);

  const quickDeposit = async (amount: number) => {
    setDepositing(true);
    const result = await depositAction({ amount });
    setDepositing(false);
    handleActionResult(result, () => {
      pushToast(`Deposited ${amount} demo credits`, "success");
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {alias ? (
        <p className="text-sm text-foreground-muted">
          Playing as{" "}
          <span className="font-medium text-neon">{alias}</span>
        </p>
      ) : null}

      <Counter
        value={balance}
        loading={isLoading}
        size="hero"
        variant="gold"
      />

      <div className="flex flex-wrap justify-center gap-2">
        <NeonButton
          variant="neon"
          size="sm"
          loading={depositing}
          onClick={() => quickDeposit(500)}
        >
          +500 credits
        </NeonButton>
        <NeonButton
          variant="purple"
          size="sm"
          loading={depositing}
          onClick={() => quickDeposit(1000)}
        >
          +1,000 credits
        </NeonButton>
      </div>
    </div>
  );
}
