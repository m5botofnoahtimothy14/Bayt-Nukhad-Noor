import { useMemo } from "react";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

const CONSTELLATIONS = [
  [12, 18, 18, 25],
  [18, 25, 25, 22],
  [25, 22, 30, 28],
  [55, 15, 60, 22],
  [60, 22, 68, 18],
  [68, 18, 65, 28],
  [78, 35, 82, 40],
  [82, 40, 88, 38],
  [88, 38, 85, 45],
  [40, 50, 45, 55],
  [45, 55, 50, 52],
  [50, 52, 48, 48],
];

export function ObservatoryScene({ onAdd, onView }: Props) {
  const { items } = useMemories("observatory");

  const stars = useMemo(
    () =>
      Array.from({ length: 350 }, (_, i) => ({
        x: (i * 3.7 + ((i * 13) % 100)) % 100,
        y: (i * 2.9 + ((i * 7) % 100)) % 95,
        s: 0.3 + ((i * 11) % 10) * 0.22,
        d: 2 + ((i * 7) % 5),
        delay: (i * 0.03) % 3,
        bright: 0.25 + ((i * 17) % 10) * 0.08,
      })),
    [],
  );

  const shootingStar = useMemo(
    () => ({
      left: 15 + Math.random() * 65,
      top: 5 + Math.random() * 35,
      delay: 8 + Math.random() * 25,
    }),
    [],
  );

  return (
    <div
      className="scene scene-container vignette-soft scene-3d"
      style={{
        background:
          "radial-gradient(ellipse at 50% 100%, oklch(0.25 0.08 280) 0%, oklch(0.10 0.04 270) 50%, oklch(0.04 0.02 260) 100%)",
      }}
    >
      {/* Nebula wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
          radial-gradient(ellipse at 20% 25%, oklch(0.3 0.12 300 / 12%), transparent 40%),
          radial-gradient(ellipse at 75% 18%, oklch(0.25 0.10 340 / 10%), transparent 35%),
          radial-gradient(ellipse at 50% 65%, oklch(0.22 0.08 200 / 8%), transparent 50%),
          radial-gradient(ellipse at 85% 60%, oklch(0.28 0.10 15 / 6%), transparent 30%)
        `,
        }}
      />

      {/* === DEPTH: Background stars === */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{ animation: "parallax-sway-x 40s ease-in-out infinite" }}
      >
        {stars.slice(0, 180).map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s * 0.7,
              height: s.s * 0.7,
              opacity: s.bright * 0.6,
              animation: `twinkle ${s.d + 1}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === DEPTH: Mid stars === */}
      <div
        className="depth-layer depth-mid absolute inset-0"
        style={{ animation: "parallax-sway-x 30s ease-in-out infinite reverse" }}
      >
        {stars.slice(180, 280).map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              opacity: s.bright * 0.8,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === DEPTH: Foreground stars === */}
      <div className="depth-layer depth-near absolute inset-0">
        {stars.slice(280).map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s * 1.3,
              height: s.s * 1.3,
              opacity: s.bright,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Constellation lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {CONSTELLATIONS.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke="oklch(0.8 0.06 20 / 12%)"
            strokeWidth="0.12"
          />
        ))}
      </svg>

      {/* Shooting star trail */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${shootingStar.left}%`,
          top: `${shootingStar.top}%`,
          width: 3,
          height: 3,
          background: "white",
          borderRadius: "50%",
          boxShadow:
            "0 0 8px 3px oklch(0.95 0.06 20 / 80%), -50px 25px 25px oklch(0.95 0.06 20 / 0%)",
          animation: `shooting-star 5s linear ${shootingStar.delay}s infinite`,
        }}
      />

      {/* Moon with depth */}
      <div
        className="depth-layer depth-near absolute right-[10%] top-[10%] h-32 w-32 rounded-full"
        style={{
          animation: "depth-pulse 18s ease-in-out infinite",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, oklch(0.98 0.03 20), oklch(0.88 0.05 20) 70%)",
            boxShadow: `
            0 0 45px oklch(0.92 0.05 20 / 40%),
            0 0 90px oklch(0.88 0.05 20 / 20%),
            0 0 140px oklch(0.85 0.04 20 / 10%)
          `,
          }}
        />
        <div
          className="absolute top-[22%] left-[28%] w-5 h-5 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 25%)" }}
        />
        <div
          className="absolute top-[52%] left-[55%] w-3.5 h-3.5 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 18%)" }}
        />
        <div
          className="absolute top-[38%] left-[62%] w-2.5 h-2.5 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 22%)" }}
        />
      </div>

      {/* Memory stars */}
      {items.map((m) => (
        <button
          key={m.id}
          onClick={() => onView(m)}
          title={m.title}
          className="depth-layer depth-near group absolute"
          style={{
            left: `${(m.x ?? 0.5) * 100}%`,
            top: `${(m.y ?? 0.5) * 100}%`,
            transform: "translate(-50%, -50%)",
            animation: "star-appear 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <span
            className="block text-3xl transition-all duration-300 group-hover:scale-150"
            style={{
              color: "oklch(0.95 0.16 15)",
              animation: "twinkle 3s ease-in-out infinite",
              filter: "drop-shadow(0 0 10px oklch(0.9 0.16 15 / 70%))",
            }}
          >
            ✦
          </span>
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}

      {/* Horizon silhouette */}
      <div className="depth-layer depth-near absolute inset-x-0 bottom-0" style={{ height: "24%" }}>
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120 Q150 80 300 100 Q400 110 500 90 Q600 70 700 95 Q800 110 900 85 Q1000 60 1100 80 Q1200 95 1300 75 Q1400 90 1440 100 L1440 200 L0 200 Z"
            fill="oklch(0.05 0.02 270)"
          />
          {[100, 250, 420, 680, 900, 1100, 1350].map((x, i) => (
            <ellipse
              key={i}
              cx={x}
              cy={85 + (i % 3) * 8}
              rx={14 + (i % 2) * 7}
              ry={20 + (i % 3) * 5}
              fill="oklch(0.04 0.02 270)"
            />
          ))}
        </svg>
      </div>

      {/* Click to name */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        className="absolute inset-x-0 top-[8%] bottom-[28%] cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        click the sky to name a star
      </p>
    </div>
  );
}
