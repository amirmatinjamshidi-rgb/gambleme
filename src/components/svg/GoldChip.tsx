"use client";

import { useEffect, useRef } from "react";

import { useAnime } from "@/hooks/useAnime";
import { cn } from "@/lib/utils";

export type GoldChipProps = {
  className?: string;
  size?: number;
};

export function GoldChip({ className, size = 80 }: GoldChipProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { animate, reducedMotion } = useAnime();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reducedMotion) return;

    animate(wrap, {
      rotateY: [0, 360],
      duration: 5500,
      ease: "linear",
      loop: true,
    });
  }, [animate, reducedMotion]);

  return (
    <div
      ref={wrapRef}
      className={cn("inline-flex will-change-transform", className)}
      style={{
        perspective: 800,
        transformStyle: "preserve-3d",
      }}
    >
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_16px_rgb(245_196_81/0.5)]"
      aria-hidden
      suppressHydrationWarning
    >
      <defs>
        <linearGradient id="chip-face" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="45%" stopColor="#f5c451" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <linearGradient id="chip-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#5c4a0e" />
        </linearGradient>
        <radialGradient id="chip-shine" cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="chip-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#chip-glow)">
        {/* Stack depth — back chips */}
        <ellipse
          cx="40"
          cy="48"
          rx="28"
          ry="10"
          fill="url(#chip-edge)"
          opacity="0.5"
        >
          <animate
            attributeName="cy"
            values="48;50;48"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx="40"
          cy="44"
          rx="30"
          ry="11"
          fill="url(#chip-edge)"
          opacity="0.7"
        >
          <animate
            attributeName="cy"
            values="44;46;44"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Main chip */}
        <ellipse cx="40" cy="38" rx="32" ry="12" fill="url(#chip-edge)" />
        <ellipse cx="40" cy="34" rx="32" ry="12" fill="url(#chip-face)" />
        <ellipse cx="40" cy="34" rx="32" ry="12" fill="url(#chip-shine)" />

        {/* Edge notches */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = 40 + Math.cos(angle) * 30;
          const y = 34 + Math.sin(angle) * 9;
          return (
            <rect
              key={i}
              x={x - 1.5}
              y={y - 1.5}
              width="3"
              height="3"
              fill="#8b6914"
              transform={`rotate(${(i / 12) * 360} ${x} ${y})`}
            />
          );
        })}

        {/* Center star */}
        <circle cx="40" cy="34" r="10" fill="none" stroke="#8b6914" strokeWidth="1.5" />
        <text
          x="40"
          y="38"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#5c4a0e"
          fontFamily="system-ui,sans-serif"
        >
          $
        </text>
      </g>
    </svg>
    </div>
  );
}
