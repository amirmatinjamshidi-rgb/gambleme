"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useAnime } from "@/hooks/useAnime";
import { cn } from "@/lib/utils";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { animate, reducedMotion } = useAnime();
  const mounted = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      mounted.current = false;
      return;
    }

    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (reducedMotion) {
      backdrop.style.opacity = "1";
      panel.style.opacity = "1";
      panel.style.transform = "scale(1) translateY(0)";
      mounted.current = true;
      return;
    }

    animate(backdrop, {
      opacity: [0, 1],
      duration: 280,
      ease: "outQuad",
    });

    animate(panel, {
      opacity: [0, 1],
      scale: [0.88, 1],
      translateY: [20, 0],
      duration: 420,
      ease: "outElastic(1, 0.65)",
    });

    mounted.current = true;
  }, [open, animate, reducedMotion]);

  if (!open) return null;

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "glass-elevated glow-gold w-full max-w-md rounded-2xl border border-gold/25 p-6 shadow-2xl",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2
              id="modal-title"
              className="text-xl font-bold text-gold text-glow-gold"
            >
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="focus-neon rounded-lg px-2 py-1 text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
