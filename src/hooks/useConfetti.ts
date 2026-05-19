"use client";

import { useCallback } from "react";
import type { Options as ConfettiOptions } from "canvas-confetti";

import { useReducedMotion } from "@/hooks/useReducedMotion";

async function loadConfetti() {
  const module = await import("canvas-confetti");
  return module.default;
}

export function useConfetti() {
  const reducedMotion = useReducedMotion();

  const fireWin = useCallback(
    async (options?: ConfettiOptions) => {
      if (reducedMotion) return;

      const confetti = await loadConfetti();
      void confetti({
        particleCount: 140,
        spread: 75,
        startVelocity: 42,
        origin: { y: 0.62 },
        ...options,
      });
    },
    [reducedMotion],
  );

  const fireBurst = useCallback(async () => {
    if (reducedMotion) return;

    const confetti = await loadConfetti();
    const duration = 900;
    const end = Date.now() + duration;

    const frame = () => {
      void confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
      });
      void confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [reducedMotion]);

  return {
    fireWin,
    fireBurst,
    reducedMotion,
  };
}
