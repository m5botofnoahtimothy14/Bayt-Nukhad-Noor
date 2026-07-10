import { useMemo } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  phase: TimePhase;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

export function LakeScene({ phase, onAdd, onView }: Props) {
  const { items } = useMemories("lake");

  const ripples = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        left: 15 + ((i * 14) % 70),
        top: 55 + ((i * 8) % 30),
        dur: 4 + i,
        delay: i * 0.8,
      })),
    [],
  );

  return (
    <div className="scene scene-container scene-3d" style={{ background: SKY[phase] }}>
      {/* === DEPTH: Far mountains === */}
      <div
        className="depth-layer depth-farthest absolute inset-x-0 top-[8%] w-full"
        style={{ height: "38%", animation: "parallax-sway-x 35s ease-in-out infinite" }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 280" preserveAspectRatio="none">
          <path
            d="M0 280 L150 130 L350 200 L550 80 L750 180 L950 100 L1150 160 L1350 90 L1440 170 L1440 280 Z"
            fill="oklch(0.28 0.06 280 / 60%)"
          />
        </svg>
      </div>

      {/* === DEPTH: Near mountains === */}
      <div
        className="depth-layer depth-mid absolute inset-x-0 top-[12%] w-full"
        style={{ height: "35%", animation: "parallax-sway-x 25s ease-in-out infinite reverse" }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 250" preserveAspectRatio="none">
          <path
            d="M0 250 L200 120 L400 190 L650 70 L900 170 L1150 100 L1440 210 L1440 250 Z"
            fill="oklch(0.22 0.06 350 / 80%)"
          />
        </svg>
      </div>

      {/* Moon */}
      <div
        className="depth-layer depth-near absolute left-1/2 top-[15%] h-20 w-20 -translate-x-1/2 rounded-full"
        style={{
          background: "oklch(0.96 0.03 20)",
          boxShadow: "0 0 50px oklch(0.92 0.06 20 / 60%), 0 0 100px oklch(0.88 0.05 20 / 25%)",
          animation: "depth-pulse 14s ease-in-out infinite",
        }}
      />

      {/* === DEPTH: Water surface === */}
      <div
        className="depth-layer depth-near absolute inset-x-0 bottom-0 h-[52%] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.30 0.08 280) 0%, oklch(0.18 0.06 280) 40%, oklch(0.12 0.05 350) 100%)",
          animation: "water-reflect 8s ease-in-out infinite",
        }}
      >
        {/* Moon reflection */}
        <div
          className="absolute left-1/2 top-6 h-28 w-20 -translate-x-1/2 rounded-full opacity-30 blur-lg"
          style={{
            background: "oklch(0.95 0.03 20)",
            animation: "wave-sway 6s ease-in-out infinite",
          }}
        />

        {/* Water light streaks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px pointer-events-none"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + ((i * 7) % 40)}%`,
              width: `${30 + ((i * 11) % 40)}%`,
              background:
                "linear-gradient(90deg, transparent, oklch(0.8 0.06 20 / 15%), transparent)",
              animation: `wave-sway ${5 + i}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}

        {/* Ripples */}
        {ripples.map((r, i) => (
          <span
            key={i}
            className="absolute rounded-full border border-white/15"
            style={{
              left: `${r.left}%`,
              top: `${r.top}%`,
              width: 50,
              height: 14,
              animation: `ripple ${r.dur}s ease-out infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Paper boats = letters */}
      {items.map((m, i) => (
        <button
          key={m.id}
          onClick={() => onView(m)}
          title={m.title}
          className="depth-layer depth-near group absolute"
          style={{
            left: `${(m.x ?? 0.5) * 100}%`,
            top: `${58 + ((i * 13) % 25)}%`,
            animation: `paper-float ${10 + i * 2}s ease-in-out infinite`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg
            width="44"
            height="26"
            viewBox="0 0 44 26"
            className="drop-shadow-lg transition-all duration-300 group-hover:scale-[1.2]"
          >
            <path d="M2 14 L42 14 L34 24 L10 24 Z" fill="oklch(0.96 0.02 20)" />
            <path d="M22 4 L22 16 L36 14 Z" fill="oklch(0.92 0.03 15)" />
          </svg>
          <span className="absolute left-1/2 -top-6 -translate-x-1/2 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}

      {/* Click water */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        className="absolute inset-x-0 bottom-0 top-[55%] cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/80 drop-shadow-lg">
        click the water to send a paper boat
      </p>
    </div>
  );
}
