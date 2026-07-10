import { useMemo } from "react";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

export function MeadowScene({ onAdd, onView }: Props) {
  const { items } = useMemories("meadow");

  const raindrops = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        left: (i * 0.71) % 100,
        height: 14 + ((i * 1.7) % 24),
        dur: 0.55 + ((i * 0.007) % 0.9),
        delay: (i * 0.01) % 1.2,
        opacity: 0.3 + (i % 5) * 0.1,
      })),
    [],
  );

  return (
    <div
      className="scene scene-container scene-3d"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.25 0.04 260) 0%, oklch(0.30 0.05 240) 40%, oklch(0.35 0.06 160) 100%)",
      }}
    >
      {/* Foggy atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.5 0.04 240 / 8%), transparent 60%)",
        }}
      />

      {/* === DEPTH: Rain layer (far) === */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden depth-layer depth-farthest"
        style={{ animation: "parallax-sway-x 20s ease-in-out infinite" }}
      >
        {raindrops.slice(0, 70).map((r, i) => (
          <span
            key={i}
            className="absolute w-px"
            style={{
              left: `${r.left}%`,
              top: "-10%",
              height: r.height,
              background: `linear-gradient(180deg, transparent, oklch(0.8 0.04 240 / ${r.opacity * 0.6}))`,
              animation: `rain-fall ${r.dur + 0.3}s linear infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === DEPTH: Rain layer (near) === */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden depth-layer depth-near">
        {raindrops.slice(70).map((r, i) => (
          <span
            key={i}
            className="absolute w-px"
            style={{
              left: `${r.left}%`,
              top: "-10%",
              height: r.height,
              background: `linear-gradient(180deg, transparent, oklch(0.85 0.03 240 / ${r.opacity}))`,
              animation: `rain-fall ${r.dur}s linear infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === DEPTH: Far meadow === */}
      <div
        className="depth-layer depth-farthest absolute inset-x-0 bottom-0"
        style={{ height: "48%", animation: "parallax-sway-x 28s ease-in-out infinite" }}
      >
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80 Q720 20 1440 70 L1440 300 L0 300 Z"
            fill="oklch(0.38 0.09 155)"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* === DEPTH: Near meadow === */}
      <div className="depth-layer depth-near absolute inset-x-0 bottom-0" style={{ height: "48%" }}>
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <path d="M0 100 Q720 40 1440 90 L1440 300 L0 300 Z" fill="oklch(0.42 0.10 148)" />
          <path d="M0 180 Q720 130 1440 170 L1440 300 L0 300 Z" fill="oklch(0.34 0.10 150)" />
        </svg>
      </div>

      {/* Umbrella */}
      <div
        className="depth-layer depth-near absolute left-1/2 bottom-[20%] -translate-x-1/2"
        style={{
          animation: "depth-pulse 10s ease-in-out infinite",
        }}
      >
        <svg width="90" height="100" viewBox="0 0 90 100">
          <path d="M4 44 Q45 -5 86 44 Z" fill="oklch(0.50 0.18 10)" />
          <path d="M4 44 Q45 15 86 44" fill="oklch(0.55 0.20 10)" opacity="0.6" />
          <line
            x1="45"
            y1="44"
            x2="45"
            y2="92"
            stroke="oklch(0.28 0.04 350)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M45 92 Q52 98 58 92"
            stroke="oklch(0.28 0.04 350)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Memory leaves */}
      {items.map((m) => (
        <button
          key={m.id}
          onClick={() => onView(m)}
          title={m.title}
          className="depth-layer depth-near group absolute"
          style={{
            left: `${(m.x ?? 0.5) * 100}%`,
            top: `${(m.y ?? 0.7) * 100}%`,
            transform: "translate(-50%, -50%)",
            animation: `paper-float ${6 + (m.x ?? 0.5) * 4}s ease-in-out infinite`,
          }}
        >
          <span
            className="block text-3xl transition-all duration-300 group-hover:scale-[1.3]"
            style={{ filter: "drop-shadow(0 0 8px oklch(0.6 0.1 155 / 40%))" }}
          >
            🌿
          </span>
          <span className="absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}

      {/* Click meadow */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        className="absolute inset-x-0 bottom-0 top-[35%] cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/80 drop-shadow-lg">
        click the meadow to leave a small thought in the rain
      </p>
    </div>
  );
}
