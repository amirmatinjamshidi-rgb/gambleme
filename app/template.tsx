"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useAnime } from "@/hooks/useAnime";

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { animate, reducedMotion } = useAnime();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    animate(el, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 420,
      ease: "outExpo",
    });
  }, [children, animate, reducedMotion]);

  return (
    <div ref={ref} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
