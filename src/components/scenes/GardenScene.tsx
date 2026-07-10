import { useMemo } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  phase: TimePhase;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

function Flower({ hue }: { hue: number }) {
  return (
    <svg
      width="38"
      height="50"
      viewBox="0 0 38 50"
      className="drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.3]"
    >
      <line
        x1="19"
        y1="50"
        x2="19"
        y2="24"
        stroke="oklch(0.42 0.12 155)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M19 36 Q26 31 23 27" stroke="oklch(0.48 0.14 148)" strokeWidth="1.5" fill="none" />
      <g style={{ transformOrigin: "19px 17px", animation: "sway 4s ease-in-out infinite" }}>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="19"
            cy="9"
            rx="5"
            ry="9"
            fill={`oklch(0.78 0.16 ${hue})`}
            transform={`rotate(${a} 19 17)`}
            style={{ filter: "saturate(1.15)" }}
          />
        ))}
        <circle cx="19" cy="17" r="4" fill="oklch(0.92 0.12 55)" />
        <circle cx="19" cy="17" r="2.5" fill="oklch(0.95 0.10 60)" />
      </g>
    </svg>
  );
}

const BUTTERFLIES = [
  { x: 10, y: 25, hue: 350 },
  { x: 33, y: 20, hue: 290 },
  { x: 58, y: 30, hue: 20 },
  { x: 80, y: 22, hue: 330 },
];

export function GardenScene({ phase, onAdd, onView }: Props) {
  const { items } = useMemories("garden");

  const grassBlades = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        left: (i * 2) % 100,
        height: 12 + ((i * 7) % 28),
        delay: (i * 0.25) % 5,
        hue: 140 + ((i * 3) % 30),
      })),
    [],
  );

  return (
    <div className="scene scene-container scene-3d" style={{ background: SKY[phase] }}>
      {/* Clouds */}
      {(phase === "day" || phase === "dawn") &&
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top: `${6 + i * 5}%`,
              width: 160 + i * 55,
              height: 32 + i * 8,
              background: `radial-gradient(ellipse, oklch(0.95 0.03 20 / ${0.25 + i * 0.04}), transparent 70%)`,
              animation: `cloud-drift ${32 + i * 15}s linear infinite`,
              animationDelay: `${i * -9}s`,
              left: `${-20 + i * 22}%`,
            }}
          />
        ))}

      {/* === DEPTH: Far hills === */}
      <div
        className="depth-layer depth-farthest absolute inset-x-0 bottom-0"
        style={{ height: "72%", animation: "parallax-sway-x 30s ease-in-out infinite" }}
      >
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
        >
          <path
            d="M0 260 Q200 200 400 240 Q600 280 800 230 Q1000 180 1200 220 Q1350 240 1440 230 L1440 500 L0 500 Z"
            fill="oklch(0.52 0.10 150)"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* === DEPTH: Mid hills === */}
      <div
        className="depth-layer depth-mid absolute inset-x-0 bottom-0"
        style={{ height: "72%", animation: "parallax-sway-x 22s ease-in-out infinite reverse" }}
      >
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
        >
          <path
            d="M0 310 Q300 250 600 290 Q900 330 1200 280 Q1350 270 1440 290 L1440 500 L0 500 Z"
            fill="oklch(0.45 0.11 148)"
          />
        </svg>
      </div>

      {/* === DEPTH: Near hills === */}
      <div className="depth-layer depth-near absolute inset-x-0 bottom-0" style={{ height: "72%" }}>
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
        >
          <path
            d="M0 370 Q360 300 720 350 Q1080 400 1440 340 L1440 500 L0 500 Z"
            fill="oklch(0.38 0.11 145)"
          />
          <path
            d="M0 440 Q500 410 900 435 Q1200 450 1440 430 L1440 500 L0 500 Z"
            fill="oklch(0.30 0.10 150)"
          />
        </svg>
      </div>

      {/* Grass blades with wind */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[28%] h-14 depth-layer depth-near">
        {grassBlades.map((g, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${g.left}%`,
              width: 2,
              height: g.height,
              background: `linear-gradient(0deg, oklch(0.35 0.10 150), oklch(0.55 0.14 ${g.hue}))`,
              transformOrigin: "bottom center",
              animation: `wind-sway ${3 + g.delay}s ease-in-out ${g.delay}s infinite`,
              borderRadius: "1px 1px 0 0",
            }}
          />
        ))}
      </div>

      {/* Butterflies */}
      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          className="depth-layer depth-mid pointer-events-none absolute"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            animation: `depth-drift ${9 + i * 2}s ease-in-out ${i}s infinite`,
          }}
        >
          <svg
            width="22"
            height="18"
            viewBox="0 0 22 18"
            style={{ animation: "breathe 2s ease-in-out infinite" }}
          >
            <ellipse
              cx="8"
              cy="9"
              rx="7"
              ry="8"
              fill={`oklch(0.72 0.18 ${b.hue})`}
              opacity="0.85"
              transform="rotate(-20 8 9)"
            />
            <ellipse
              cx="14"
              cy="9"
              rx="7"
              ry="8"
              fill={`oklch(0.72 0.18 ${b.hue})`}
              opacity="0.85"
              transform="rotate(20 14 9)"
            />
            <line x1="11" y1="3" x2="11" y2="15" stroke="oklch(0.2 0.02 350)" strokeWidth="0.6" />
          </svg>
        </div>
      ))}

      {/* Flower memories */}
      <div className="absolute inset-0 depth-layer">
        {items.map((m) => {
          const hue = 350 + ((m.id.charCodeAt(0) * 7 + m.id.charCodeAt(1) * 13) % 50);
          return (
            <button
              key={m.id}
              onClick={() => onView(m)}
              title={m.title}
              className="group absolute"
              style={{
                left: `${(m.x ?? 0.5) * 100}%`,
                top: `${(m.y ?? 0.7) * 100}%`,
                transform: "translate(-50%, -50%)",
                animation: `gentle-bob ${3 + (m.x ?? 0.5) * 2}s ease-in-out infinite`,
                animationDelay: `${(m.x ?? 0.5) * 3}s`,
              }}
            >
              <Flower hue={hue} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs italic text-foreground/90 opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
                {m.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Click to plant */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        className="absolute inset-x-0 bottom-0 top-[40%] cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        click the meadow to plant a memory
      </p>
    </div>
  );
}
