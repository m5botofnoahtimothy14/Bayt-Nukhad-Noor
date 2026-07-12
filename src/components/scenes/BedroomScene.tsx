import { useEffect, useState } from "react";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";
import { useSharedState } from "@/hooks/useSharedState";
import { Moon, BookHeart, Mail } from "lucide-react";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

type LampState = { noah: boolean; khadija: boolean };

export function BedroomScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("bedroom");
  const lamps = useSharedState<LampState>("bedroom.lamps", { noah: true, khadija: true });
  const bothOff = !lamps.value.noah && !lamps.value.khadija;

  // gentle breathing when both are "asleep"
  const [breath, setBreath] = useState(0);
  useEffect(() => {
    if (!bothOff) return;
    const id = setInterval(() => setBreath((b) => b + 1), 3000);
    return () => clearInterval(id);
  }, [bothOff]);

  const dreamJournal = items.filter((m) => m.kind === "memory");
  const letters = items.filter((m) => m.kind === "letter");
  const nightMood = phase === "night" || phase === "dusk" || bothOff;

  return (
    <div
      className="scene scene-container vignette-soft scene-3d"
      style={{
        background: bothOff
          ? "linear-gradient(180deg, oklch(0.08 0.03 270) 0%, oklch(0.05 0.02 280) 100%)"
          : nightMood
            ? "linear-gradient(180deg, oklch(0.15 0.04 285) 0%, oklch(0.11 0.03 300) 100%)"
            : "linear-gradient(180deg, oklch(0.28 0.05 320) 0%, oklch(0.20 0.04 305) 100%)",
        transition: "background 3s ease-out",
      }}
    >
      {/* Wall + wallpaper stripes */}
      <div
        className="depth-layer depth-farthest absolute inset-0 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 60px, oklch(1 0 0 / 3%) 60px 62px)",
        }}
      />

      {/* Moon through window */}
      <div className="depth-layer depth-farthest absolute right-[10%] top-[8%] h-40 w-52 overflow-hidden rounded-lg border-4 border-[oklch(0.20_0.04_290)] shadow-2xl">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.12 0.04 270), oklch(0.20 0.06 300))" }} />
        <div
          className="absolute right-6 top-6 h-16 w-16 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.95 0.02 280) 40%, oklch(0.75 0.05 280 / 60%) 70%, transparent)",
            boxShadow: "0 0 60px oklch(0.85 0.05 280 / 60%)",
            transform: bothOff ? "translateY(2px)" : "none",
            transition: "transform 4s ease-in-out",
          }}
        />
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 1 + (i % 3) * 0.4,
              height: 1 + (i % 3) * 0.4,
              left: `${(i * 13.7) % 100}%`,
              top: `${(i * 7.3) % 80}%`,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Bed */}
      <div className="depth-layer depth-near absolute bottom-4 left-1/2 -translate-x-1/2 w-[520px] h-56">
        {/* Headboard */}
        <div
          className="absolute inset-x-0 top-0 h-16 rounded-t-3xl shadow-inner"
          style={{ background: "linear-gradient(180deg, oklch(0.32 0.06 340), oklch(0.24 0.05 340))" }}
        />
        {/* Mattress */}
        <div
          className="absolute inset-x-2 top-12 bottom-6 rounded-2xl shadow-2xl"
          style={{
            background: "linear-gradient(180deg, oklch(0.62 0.04 30), oklch(0.48 0.05 20))",
            transform: bothOff ? `translateY(${Math.sin(breath) * 0.6}px)` : "none",
            transition: "transform 3s ease-in-out",
          }}
        >
          {/* Two pillows */}
          {(["noah", "khadija"] as const).map((who, i) => (
            <div
              key={who}
              className="absolute top-3 h-14 w-40 rounded-2xl shadow-lg"
              style={{
                left: i === 0 ? 22 : "auto",
                right: i === 1 ? 22 : "auto",
                background: "linear-gradient(180deg, oklch(0.92 0.02 30), oklch(0.82 0.03 30))",
              }}
            >
              {/* Pillow letter button */}
              <button
                onClick={() => nightMood && onOpen("letter")}
                disabled={!nightMood}
                title={nightMood ? "leave a pillow letter" : "letters open at dusk"}
                className="absolute -top-2 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/40 text-primary-foreground backdrop-blur transition-all hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
              >
                <Mail size={11} />
              </button>
              <p className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest text-muted-foreground serif">
                {who}
              </p>
            </div>
          ))}
          {/* Duvet fold */}
          <div className="absolute inset-x-0 bottom-0 h-12 rounded-b-2xl" style={{ background: "linear-gradient(180deg, oklch(0.42 0.05 15), oklch(0.32 0.05 15))" }} />
        </div>
      </div>

      {/* Nightstand — Noah (left) */}
      <NightLamp
        side="left"
        who="noah"
        on={lamps.value.noah}
        onToggle={() => lamps.setValue({ ...lamps.value, noah: !lamps.value.noah })}
      />
      {/* Nightstand — Khadija (right) */}
      <NightLamp
        side="right"
        who="khadija"
        on={lamps.value.khadija}
        onToggle={() => lamps.setValue({ ...lamps.value, khadija: !lamps.value.khadija })}
      />

      {/* Dream Journal on left nightstand */}
      <button
        onClick={() => onOpen("memory")}
        title="dream journal — write a dream"
        className="depth-layer depth-near absolute bottom-[110px] left-[12%] flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md transition-all hover:scale-105"
      >
        <BookHeart size={14} className="text-primary" />
        <div className="text-left">
          <p className="text-[9px] uppercase tracking-widest text-primary/70 serif">dream journal</p>
          <p className="text-[10px] text-foreground">{dreamJournal.length} dream{dreamJournal.length === 1 ? "" : "s"}</p>
        </div>
      </button>

      {/* Origami of dreams on nightstand */}
      <div className="depth-layer depth-near absolute bottom-[95px] left-[24%] flex gap-1.5">
        {dreamJournal.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            onClick={() => onView(m)}
            title={m.title}
            className="h-4 w-4 rotate-45 transition-all hover:scale-125"
            style={{
              background: `linear-gradient(135deg, oklch(0.7 0.14 ${20 + i * 40}), oklch(0.5 0.12 ${20 + i * 40}))`,
              boxShadow: "0 2px 6px oklch(0 0 0 / 40%)",
            }}
          />
        ))}
      </div>

      {/* Pillow letters as folded envelopes */}
      <div className="depth-layer depth-near absolute bottom-[95px] right-[24%] flex gap-1.5">
        {letters.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            onClick={() => onView(m)}
            title={m.title}
            className="h-4 w-5 transition-all hover:scale-125"
            style={{
              background: `linear-gradient(180deg, oklch(0.88 0.04 30), oklch(0.72 0.06 20))`,
              boxShadow: "0 2px 6px oklch(0 0 0 / 40%)",
              transform: `rotate(${(i - 2) * 4}deg)`,
            }}
          />
        ))}
      </div>

      {/* "we're both asleep" caption */}
      {bothOff && (
        <div className="absolute left-1/2 top-[68%] -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 backdrop-blur-md">
          <Moon size={12} className="text-primary" />
          <p className="serif text-xs italic text-foreground">we're both asleep</p>
        </div>
      )}

      {/* Floor */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: "linear-gradient(0deg, oklch(0.10 0.03 300), transparent)" }} />
    </div>
  );
}

function NightLamp({
  side,
  who,
  on,
  onToggle,
}: {
  side: "left" | "right";
  who: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`depth-layer depth-near absolute bottom-[85px] ${side === "left" ? "left-[6%]" : "right-[6%]"}`}
    >
      {/* Light halo */}
      <div
        className="absolute -inset-24 rounded-full pointer-events-none"
        style={{
          background: on
            ? "radial-gradient(circle, oklch(0.85 0.14 65 / 40%), transparent 60%)"
            : "transparent",
          transition: "background 1.5s ease-out",
        }}
      />
      <button
        onClick={onToggle}
        title={`${who}'s lamp — ${on ? "on" : "off"}`}
        className="relative flex flex-col items-center gap-1 transition-transform hover:scale-105"
      >
        {/* shade */}
        <div
          className="h-10 w-14 rounded-t-lg"
          style={{
            background: on
              ? "linear-gradient(180deg, oklch(0.85 0.14 65), oklch(0.72 0.12 55))"
              : "linear-gradient(180deg, oklch(0.30 0.04 300), oklch(0.22 0.03 300))",
            boxShadow: on ? "0 0 30px oklch(0.85 0.14 65 / 60%)" : "none",
            transition: "all 1.2s ease-out",
          }}
        />
        {/* stem */}
        <div className="h-8 w-1" style={{ background: "oklch(0.25 0.03 300)" }} />
        {/* base */}
        <div className="h-2 w-8 rounded-full" style={{ background: "oklch(0.20 0.03 300)" }} />
        <p className="mt-1 text-[8px] uppercase tracking-widest text-muted-foreground serif">
          {who}
        </p>
      </button>
    </div>
  );
}
