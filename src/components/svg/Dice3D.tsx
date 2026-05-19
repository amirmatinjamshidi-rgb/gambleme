"use client";

import { useEffect, useId, useRef } from "react";

import { useAnime } from "@/hooks/useAnime";
import { cn } from "@/lib/utils";

export type Dice3DProps = {
  className?: string;
  size?: number;
};

/** Top face pips — 5 in quincunx (center + corners), tightened inset */
const TOP_PIPS: [number, number][] = [
  [60, 38],
  [46, 31],
  [74, 31],
  [46, 45],
  [74, 45],
];

/** Left face pips — 3 along diagonal */
const LEFT_PIPS: [number, number][] = [
  [35, 56],
  [42.5, 68],
  [50, 80],
];

/** Right face pips — 2 on opposite corners */
const RIGHT_PIPS: [number, number][] = [
  [85, 56],
  [70, 80],
];

export function Dice3D({ className, size = 120 }: Dice3DProps) {
  const uid = useId().replace(/:/g, "");
  const gTop = `dice-top-${uid}`;
  const gLeft = `dice-left-${uid}`;
  const gRight = `dice-right-${uid}`;
  const gPip = `dice-pip-${uid}`;

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
    <div ref={wrapRef} className={cn("inline-flex will-change-transform", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_28px_rgb(245_196_81/0.5)]"
        aria-hidden
      >
        <defs>
          <linearGradient id={gTop} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#fff5d6" />
            <stop offset="55%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f5c451" />
          </linearGradient>
          <linearGradient id={gLeft} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#c9a03a" />
            <stop offset="100%" stopColor="#5c4a0e" />
          </linearGradient>
          <linearGradient id={gRight} x1="1" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#f5c451" />
            <stop offset="100%" stopColor="#8b6914" />
          </linearGradient>

          <radialGradient id={gPip} cx="0.35" cy="0.3" r="0.85">
            <stop offset="0%" stopColor="#4a3318" />
            <stop offset="55%" stopColor="#1a1208" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>

        {/* Top face */}
        <polygon
          points="60,18 95,38 60,58 25,38"
          fill={`url(#${gTop})`}
          stroke="#fff8e7"
          strokeWidth="1.25"
          strokeOpacity="0.6"
          strokeLinejoin="round"
        />
        {/* Left face */}
        <polygon
          points="25,38 60,58 60,98 25,78"
          fill={`url(#${gLeft})`}
          stroke="#2a1d0c"
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeLinejoin="round"
        />
        {/* Right face */}
        <polygon
          points="60,58 95,38 95,78 60,98"
          fill={`url(#${gRight})`}
          stroke="#2a1d0c"
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeLinejoin="round"
        />

        {/* Edge highlights for depth */}
        <line
          x1="60"
          y1="58"
          x2="60"
          y2="98"
          stroke="#000"
          strokeOpacity="0.22"
          strokeWidth="0.6"
        />
        <line
          x1="25"
          y1="38"
          x2="60"
          y2="58"
          stroke="#fff8e7"
          strokeOpacity="0.2"
          strokeWidth="0.4"
        />
        <line
          x1="95"
          y1="38"
          x2="60"
          y2="58"
          stroke="#fff8e7"
          strokeOpacity="0.2"
          strokeWidth="0.4"
        />

        {/* Top pips — squashed ellipses to match the rhombus foreshortening */}
        {TOP_PIPS.map(([cx, cy], i) => (
          <ellipse
            key={`t-${i}`}
            cx={cx}
            cy={cy}
            rx="4"
            ry="2.3"
            fill={`url(#${gPip})`}
          />
        ))}

        {/* Left face pips — rotated ellipses follow face axis */}
        {LEFT_PIPS.map(([cx, cy], i) => (
          <ellipse
            key={`l-${i}`}
            cx={cx}
            cy={cy}
            rx="2.5"
            ry="3.4"
            fill={`url(#${gPip})`}
            transform={`rotate(-30 ${cx} ${cy})`}
          />
        ))}

        {/* Right face pips */}
        {RIGHT_PIPS.map(([cx, cy], i) => (
          <ellipse
            key={`r-${i}`}
            cx={cx}
            cy={cy}
            rx="2.5"
            ry="3.4"
            fill={`url(#${gPip})`}
            transform={`rotate(30 ${cx} ${cy})`}
          />
        ))}
      </svg>
    </div>
  );
}
