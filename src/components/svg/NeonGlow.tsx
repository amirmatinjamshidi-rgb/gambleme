"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export type NeonGlowProps = {
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Both lines use a fixed `stroke-dasharray` and animate `stroke-dashoffset`
 * by exactly one period — that gives a perfectly seamless marching loop
 * (no popping, no fade-in/out artifacts).
 */
export function NeonGlow({
  className,
  width = 200,
  height = 80,
}: NeonGlowProps) {
  const uid = useId().replace(/:/g, "");
  const grad1 = `neon-grad-a-${uid}`;
  const grad2 = `neon-grad-b-${uid}`;
  const blur = `neon-blur-${uid}`;

  const dash1 = "30 18";
  const period1 = 30 + 18;
  const dash2 = "20 14";
  const period2 = 20 + 14;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible", className)}
      aria-hidden
      suppressHydrationWarning
    >
      <defs>
        <linearGradient id={grad1} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="65%" stopColor="#f5c451" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={grad2} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <filter id={blur} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M 10 50 Q 50 10, 100 45 T 190 35"
        stroke={`url(#${grad1})`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter={`url(#${blur})`}
        strokeDasharray={dash1}
        opacity="0.95"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to={-period1}
          dur="2.4s"
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>

      <path
        d="M 20 55 Q 70 70, 120 40 T 180 50"
        stroke={`url(#${grad2})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        filter={`url(#${blur})`}
        strokeDasharray={dash2}
        opacity="0.7"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to={period2}
          dur="3.2s"
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>
    </svg>
  );
}
