"use client";

import { useEffect, useRef, useState } from "react";

import { useAnime } from "@/hooks/useAnime";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 0.3;

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasVisible = useRef(false);
  const { animate, reducedMotion } = useAnime();

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setVisible(progress >= SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || reducedMotion) return;

    if (visible && !wasVisible.current) {
      animate(button, {
        opacity: [0, 1],
        scale: [0.6, 1],
        translateY: [12, 0],
        duration: 350,
        ease: "outElastic(1, 0.6)",
      });
    } else if (!visible && wasVisible.current) {
      animate(button, {
        opacity: [1, 0],
        scale: [1, 0.6],
        duration: 200,
        ease: "inQuad",
      });
    }

    wasVisible.current = visible;
  }, [visible, animate, reducedMotion]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        "focus-neon fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full",
        "border border-gold/40 bg-background-elevated/90 text-gold shadow-lg backdrop-blur-md",
        "glow-gold transition-opacity neu-raised",
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
