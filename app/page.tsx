import { Dice3D } from "@/components/svg/Dice3D";
import { GoldChip } from "@/components/svg/GoldChip";
import { NeonGlow } from "@/components/svg/NeonGlow";
import { LobbyBalance } from "@/components/layout/LobbyBalance";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(139_92_246/0.18),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgb(245_196_81/0.1),transparent)]"
        aria-hidden
      />

      <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 py-16 sm:px-6 sm:py-24">
        <NeonGlow
          width={320}
          height={64}
          className="mb-6 opacity-90"
        />

        <div className="mb-8 flex items-center justify-center gap-6">
          <Dice3D size={140} />
          <GoldChip size={72} className="hidden sm:block" />
        </div>

        <h1 className="mb-3 text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-foreground">Welcome to </span>
          <span className="text-gold text-glow-gold">Gambleme</span>
        </h1>

        <p className="mb-10 max-w-lg text-center text-lg text-foreground-muted">
          Demo casino — virtual credits only. Spin slots, roll dice, or ride the
          crash curve.
        </p>

        <GlassCard variant="gold" className="mb-12 w-full max-w-md">
          <LobbyBalance />
        </GlassCard>

        <p className="text-center text-sm text-foreground-muted">
          Pick a game below to start playing.{" "}
          <span className="text-gold">Game cards coming next.</span>
        </p>
      </section>
    </main>
  );
}
