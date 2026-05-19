"use client";

import { useEffect, useMemo, useRef } from "react";

import { useAnime } from "@/hooks/useAnime";
import { cn, formatMoney } from "@/lib/utils";

type CounterVariant = "gold" | "neon" | "purple";
type CounterSize = "sm" | "md" | "lg" | "hero";

export type CounterProps = {
  value: number | null;
  decimals?: number;
  prefix?: string;
  variant?: CounterVariant;
  size?: CounterSize;
  loading?: boolean;
  className?: string;
};

const variantStyles: Record<CounterVariant, string> = {
  gold: "text-gold text-glow-gold border-gold/25 shadow-[inset_0_0_48px_rgb(245_196_81/0.12)]",
  neon: "text-neon text-glow-neon border-neon/25 shadow-[inset_0_0_48px_rgb(34_211_238/0.12)]",
  purple:
    "text-purple text-glow-purple border-purple/25 shadow-[inset_0_0_48px_rgb(139_92_246/0.12)]",
};

const sizeStyles: Record<CounterSize, string> = {
  sm: "text-xl px-3 py-1.5 gap-0.5 [--digit-h:1.15em] [--digit-w:0.58em]",
  md: "text-3xl px-4 py-2 gap-0.5 [--digit-h:1.2em] [--digit-w:0.62em]",
  lg: "text-4xl px-5 py-3 gap-1 [--digit-h:1.25em] [--digit-w:0.65em]",
  hero: "text-5xl md:text-6xl px-6 py-4 gap-1 [--digit-h:1.28em] [--digit-w:0.68em]",
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function parseDisplayChars(formatted: string): Array<{ type: "digit"; d: number } | { type: "sep"; c: string }> {
  return [...formatted].map((char) => {
    if (char >= "0" && char <= "9") {
      return { type: "digit" as const, d: Number(char) };
    }
    return { type: "sep" as const, c: char };
  });
}

function DigitWheel({
  digit,
  index,
  skipAnimation,
}: {
  digit: number;
  index: number;
  skipAnimation: boolean;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const prevDigit = useRef(digit);
  const { animate, reducedMotion } = useAnime();

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const from = prevDigit.current;
    const to = digit;

    if (from === to) return;

    if (skipAnimation || reducedMotion) {
      strip.style.transform = `translateY(calc(-${to} * var(--digit-h)))`;
      prevDigit.current = to;
      return;
    }

    animate(strip, {
      translateY: [
        `calc(-${from} * var(--digit-h))`,
        `calc(-${to} * var(--digit-h))`,
      ],
      duration: 850 + index * 45,
      delay: index * 38,
      ease: "outExpo",
    });

    prevDigit.current = to;
  }, [digit, index, animate, reducedMotion, skipAnimation]);

  return (
    <span
      className="relative inline-block overflow-hidden align-middle"
      style={{ width: "var(--digit-w)", height: "var(--digit-h)" }}
      aria-hidden
    >
      <span
        ref={stripRef}
        className="flex flex-col will-change-transform"
        style={{ transform: `translateY(calc(-${digit} * var(--digit-h)))` }}
      >
        {DIGITS.map((n) => (
          <span
            key={n}
            className="flex shrink-0 items-center justify-center font-bold tabular-nums leading-none"
            style={{ height: "var(--digit-h)", width: "var(--digit-w)" }}
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Counter({
  value,
  decimals = 2,
  prefix = "$",
  variant = "gold",
  size = "lg",
  loading = false,
  className,
}: CounterProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef<number | null>(null);
  const mounted = useRef(false);
  const { animate, reducedMotion } = useAnime();

  const formatted = useMemo(() => {
    if (value === null || loading) return null;
    return formatMoney(value, decimals);
  }, [value, decimals, loading]);

  const chars = useMemo(
    () => (formatted ? parseDisplayChars(formatted) : []),
    [formatted],
  );

  let digitIndex = 0;

  useEffect(() => {
    if (value === null || loading) return;

    const shell = shellRef.current;
    const increased =
      prevValue.current !== null && value > prevValue.current;

    if (increased && shell && !reducedMotion && mounted.current) {
      animate(shell, {
        scale: [1, 1.06, 1],
        duration: 520,
        ease: "outElastic(1, 0.55)",
      });
    }

    prevValue.current = value;
    mounted.current = true;
  }, [value, loading, animate, reducedMotion]);

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-2xl border font-bold tracking-tight",
        "bg-background-elevated/90 backdrop-blur-sm neu-inset",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-linear-to-b before:from-white/10 before:via-transparent before:to-black/20",
        "font-mono tabular-nums select-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      aria-live="polite"
      aria-busy={loading}
    >
      <span className="relative z-10 inline-flex items-center">
      <span
        className={cn(
          "mr-1 shrink-0 opacity-90",
          size === "hero" ? "text-[0.55em]" : "text-[0.6em]",
        )}
      >
        {prefix}
      </span>

      {loading || value === null ? (
        <span className="inline-flex items-center gap-1 opacity-60">
          {Array.from({ length: 5 + decimals }).map((_, i) => (
            <span
              key={i}
              className="inline-block animate-pulse rounded-sm bg-current/25 motion-reduce:animate-none"
              style={{
                width: "var(--digit-w)",
                height: "var(--digit-h)",
              }}
            />
          ))}
        </span>
      ) : (
        <span className="inline-flex items-center">
          {chars.map((part, i) => {
            if (part.type === "sep") {
              return (
                <span
                  key={`sep-${i}-${part.c}`}
                  className="mx-px shrink-0 self-center text-[0.45em] font-normal opacity-50"
                >
                  {part.c}
                </span>
              );
            }

            const wheelIndex = digitIndex++;
            const skipAnimation = !mounted.current;

            return (
              <DigitWheel
                key={`d-${wheelIndex}-${i}`}
                digit={part.d}
                index={wheelIndex}
                skipAnimation={skipAnimation}
              />
            );
          })}
        </span>
      )}
      </span>
    </div>
  );
}
