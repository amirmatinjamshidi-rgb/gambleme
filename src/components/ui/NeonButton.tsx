"use client";

import {
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import { useAnime } from "@/hooks/useAnime";
import { cn } from "@/lib/utils";

type NeonButtonVariant = "gold" | "purple" | "neon" | "danger" | "ghost";
type NeonButtonSize = "sm" | "md" | "lg";

export type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: NeonButtonVariant;
  size?: NeonButtonSize;
  loading?: boolean;
};

const variantStyles: Record<NeonButtonVariant, string> = {
  gold: "bg-gold/20 text-gold border-gold/40 hover:bg-gold/30 hover:glow-gold",
  purple:
    "bg-purple/20 text-purple border-purple/40 hover:bg-purple/30 hover:glow-purple",
  neon: "bg-neon/15 text-neon border-neon/40 hover:bg-neon/25 hover:glow-neon",
  danger:
    "bg-danger/20 text-danger border-danger/50 hover:bg-danger/30 hover:shadow-[0_0_24px_rgb(239_68_68/0.35)]",
  ghost:
    "bg-transparent text-foreground-muted border-border-subtle hover:bg-background-muted hover:text-foreground",
};

const sizeStyles: Record<NeonButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export function NeonButton({
  children,
  className,
  variant = "gold",
  size = "md",
  loading = false,
  disabled,
  onClick,
  type = "button",
  ...props
}: NeonButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { animate, reducedMotion } = useAnime();

  const isDisabled = disabled || loading;

  const spawnRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button || reducedMotion || isDisabled) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement("span");
    ripple.setAttribute("aria-hidden", "true");
    ripple.className =
      "pointer-events-none absolute rounded-full bg-white/35";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.marginLeft = `${-size / 2}px`;
    ripple.style.marginTop = `${-size / 2}px`;
    ripple.style.transform = "scale(0)";
    ripple.style.opacity = "0.6";

    button.appendChild(ripple);

    const animation = animate(ripple, {
      scale: [0, 1],
      opacity: [0.6, 0],
      duration: 550,
      ease: "outExpo" as const,
    });

    void animation.then(() => {
      ripple.remove();
    });
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    spawnRipple(event);
    onClick?.(event);
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden border font-semibold transition-colors duration-200",
        "neu-raised focus-neon disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : null}
      <span className={cn(loading && "opacity-70")}>{children}</span>
    </button>
  );
}
