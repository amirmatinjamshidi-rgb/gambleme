import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  circle?: boolean;
};

export function Skeleton({
  className,
  circle = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative overflow-hidden bg-background-muted",
        circle ? "rounded-full" : "rounded-lg",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[skeleton-shimmer_1.6s_ease-in-out_infinite]",
        "before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "motion-reduce:before:animate-none",
        className,
      )}
      {...props}
    />
  );
}
