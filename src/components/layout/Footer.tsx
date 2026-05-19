import Link from "next/link";

import { NeonGlow } from "@/components/svg/NeonGlow";

const footerLinks = [
  { href: "/", label: "Lobby" },
  { href: "/games/slot", label: "Slots" },
  { href: "/history", label: "History" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-background-elevated/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:px-6">
        <NeonGlow width={280} height={48} className="opacity-80" />

        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          aria-label="Footer navigation"
        >
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-foreground-muted transition-colors hover:text-gold"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="max-w-xl text-center text-xs leading-relaxed text-foreground-muted">
          Gambleme is a demonstration project for educational purposes only. No
          real money, wagering, or prizes. Must be 18+ where applicable. Play
          responsibly.
        </p>

        <p className="text-xs text-foreground-muted/70">
          © {new Date().getFullYear()} Gambleme Demo Casino
        </p>
      </div>
    </footer>
  );
}
