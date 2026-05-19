"use client";

import { useEffect, useRef } from "react";

import { useAnime } from "@/hooks/useAnime";
import { cn } from "@/lib/utils";

export type Dice3DProps = {
  className?: string;
  size?: number;
};

export function Dice3D({ className, size = 120 }: Dice3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { animate, reducedMotion } = useAnime();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reducedMotion) return;

    animate(wrap, {
      rotate: [0, 360],
      duration: 14000,
      ease: "linear",
      loop: true,
    });
  }, [animate, reducedMotion]);

  return (
    <div
      ref={wrapRef}
      className="inline-flex"
      style={{ perspective: 400 }}
    >
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-[0_0_20px_rgb(245_196_81/0.45)]", className)}
      aria-hidden
      style={{ transformStyle: "preserve-3d" }}
    >
      <defs>
        <linearGradient id="dice-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f5c451" />
        </linearGradient>
        <linearGradient id="dice-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a03a" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="dice-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c451" />
          <stop offset="100%" stopColor="#a67c00" />
        </linearGradient>
        <filter id="dice-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#dice-glow)">
        {/* Isometric cube faces */}
        <polygon
          points="60,18 95,38 60,58 25,38"
          fill="url(#dice-top)"
          stroke="#fff8e7"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        <polygon
          points="25,38 60,58 60,98 25,78"
          fill="url(#dice-left)"
          stroke="#f5c451"
          strokeWidth="1"
          strokeOpacity="0.25"
        />
        <polygon
          points="60,58 95,38 95,78 60,98"
          fill="url(#dice-right)"
          stroke="#fff8e7"
          strokeWidth="1"
          strokeOpacity="0.2"
        />

        {/* Pips — top face (5) */}
        {[
          [48, 32],
          [72, 32],
          [60, 42],
          [48, 50],
          [72, 50],
        ].map(([cx, cy], i) => (
          <circle key={`t-${i}`} cx={cx} cy={cy} r="4" fill="#1a1208" />
        ))}

        {/* Left face (3) */}
        {[
          [38, 52],
          [38, 68],
          [38, 84],
        ].map(([cx, cy], i) => (
          <circle key={`l-${i}`} cx={cx} cy={cy} r="3.5" fill="#0c0804" />
        ))}

        {/* Right face (2) */}
        {[
          [78, 52],
          [78, 84],
        ].map(([cx, cy], i) => (
          <circle key={`r-${i}`} cx={cx} cy={cy} r="3.5" fill="#0c0804" />
        ))}
      </g>
    </svg>
    </div>
  );
}
