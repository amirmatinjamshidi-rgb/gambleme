import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type GlassCardVariant = "default" | "elevated" | "gold";

export type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: GlassCardVariant;
  /** Subtle lift + gold glow on hover */
  hoverable?: boolean;
};

const variantClass: Record<GlassCardVariant, string> = {
  default: "glass",
  elevated: "glass-elevated",
  gold: "glass-gold",
};

export function GlassCard({
  children,
  className,
  variant = "default",
  hoverable = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 text-foreground transition-[transform,box-shadow] duration-300",
        variantClass[variant],
        hoverable &&
          "hover:-translate-y-1 hover:glow-gold motion-reduce:transform-none motion-reduce:hover:translate-y-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
