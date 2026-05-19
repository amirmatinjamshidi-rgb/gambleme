"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Counter } from "@/components/ui/Counter";
import { useBalance } from "@/hooks/useBalance";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Lobby" },
  { href: "/games/slot", label: "Slots" },
  { href: "/games/dice", label: "Dice" },
  { href: "/games/crash", label: "Crash" },
  { href: "/history", label: "History" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { balance, isLoading } = useBalance();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle glass-elevated">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="focus-neon flex shrink-0 items-center gap-3 rounded-lg"
        >
          <Image
            src="/Logo.png"
            alt="Gambleme"
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
          <span className="hidden text-lg font-bold text-gold text-glow-gold sm:inline">
            Gambleme
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "focus-neon rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-foreground-muted hover:bg-background-muted hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Counter
            value={balance}
            loading={isLoading}
            size="sm"
            variant="gold"
          />

          <nav
            className="flex items-center gap-1 md:hidden"
            aria-label="Mobile navigation"
          >
            <Link
              href="/games/slot"
              className="focus-neon rounded-lg px-2 py-1.5 text-xs text-foreground-muted hover:text-gold"
            >
              Play
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
