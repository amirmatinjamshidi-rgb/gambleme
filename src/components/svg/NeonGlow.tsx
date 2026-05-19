"use client";

import { cn } from "@/lib/utils";

export type NeonGlowProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function NeonGlow({
  className,
  width = 200,
  height = 80,
}: NeonGlowProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="neon-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="65%" stopColor="#f5c451" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <filter id="neon-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur">
            <animate
              attributeName="stdDeviation"
              values="3;8;3"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M 10 50 Q 50 10, 100 45 T 190 35"
        stroke="url(#neon-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter="url(#neon-blur)"
        opacity="0.9"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="400"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dasharray"
          values="0 400;200 200;400 0"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      <path
        d="M 20 55 Q 70 70, 120 40 T 180 50"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        filter="url(#neon-blur)"
      >
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      <circle cx="100" cy="42" r="6" fill="#f5c451" filter="url(#neon-blur)">
        <animate
          attributeName="r"
          values="4;8;4"
          dur="2.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
