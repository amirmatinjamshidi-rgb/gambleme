"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useAnime } from "@/hooks/useAnime";
import { cn } from "@/lib/utils";
import { useAppStore, type Toast, type ToastVariant } from "@/state/store";

const AUTO_DISMISS_MS = 4200;

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success/40 bg-success/10 text-foreground",
  error: "border-danger/50 bg-danger/10 text-foreground",
  info: "border-neon/35 bg-neon/10 text-foreground",
};

const variantIcon: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  info: "i",
};

function ToastItem({ toast }: { toast: Toast }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const dismissToast = useAppStore((s) => s.dismissToast);
  const { animate, reducedMotion } = useAnime();

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    if (!reducedMotion) {
      animate(el, {
        opacity: [0, 1],
        translateX: [24, 0],
        scale: [0.92, 1],
        duration: 380,
        ease: "outExpo",
      });
    }

    const timer = window.setTimeout(() => {
      if (!el || reducedMotion) {
        dismissToast(toast.id);
        return;
      }

      animate(el, {
        opacity: [1, 0],
        translateX: [0, 16],
        duration: 280,
        ease: "inExpo",
      }).then(() => dismissToast(toast.id));
    }, AUTO_DISMISS_MS);

    return () => window.clearTimeout(timer);
  }, [animate, dismissToast, reducedMotion, toast.id]);

  return (
    <div
      ref={itemRef}
      role="status"
      className={cn(
        "glass-elevated pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
        variantStyles[toast.variant],
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          toast.variant === "success" && "bg-success/25 text-success",
          toast.variant === "error" && "bg-danger/25 text-danger",
          toast.variant === "info" && "bg-neon/25 text-neon",
        )}
        aria-hidden
      >
        {variantIcon[toast.variant]}
      </span>
      <p className="flex-1 text-sm leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        className="focus-neon shrink-0 rounded-md px-1 text-foreground-muted transition-colors hover:text-foreground"
        aria-label="Dismiss notification"
      >
        close
      </button>
    </div>
  );
}

function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
