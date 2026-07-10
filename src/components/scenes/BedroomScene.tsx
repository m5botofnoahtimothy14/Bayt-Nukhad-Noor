import { useMemo } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

const WALL: Record<TimePhase, string> = {
  dawn: "oklch(0.78 0.07 28)",
  day: "oklch(0.87 0.04 75)",
  dusk: "oklch(0.46 0.07 320)",
  night: "oklch(0.18 0.04 265)",
};

const FLOOR: Record<TimePhase, string> = {
  dawn: "oklch(0.46 0.06 40)",
  day: "oklch(0.54 0.05 50)",
  dusk: "oklch(0.30 0.04 330)",
  night: "oklch(0.13 0.03 270)",
};

const BLANKET: Record<TimePhase, string> = {
  dawn: "oklch(0.72 0.09 15)",
  day: "oklch(0.82 0.05 75)",
  dusk: "oklch(0.55 0.09 330)",
  night: "oklch(0.34 0.06 275)",
};

const HEADBOARD: Record<TimePhase, string> = {
  dawn: "oklch(0.42 0.05 35)",
  day: "oklch(0.50 0.06 40)",
  dusk: "oklch(0.32 0.04 340)",
  night: "oklch(0.22 0.03 280)",
};

const PILLOW: Record<TimePhase, string> = {
  dawn: "oklch(0.88 0.03 20)",
  day: "oklch(0.93 0.02 80)",
  dusk: "oklch(0.78 0.04 320)",
  night: "oklch(0.62 0.04 270)",
};

const WOOD: Record<TimePhase, string> = {
  dawn: "oklch(0.42 0.06 38)",
  day: "oklch(0.50 0.06 42)",
  dusk: "oklch(0.32 0.04 335)",
  night: "oklch(0.20 0.03 275)",
};

const RUG_COLOR: Record<TimePhase, string> = {
  dawn: "oklch(0.55 0.10 15)",
  day: "oklch(0.65 0.08 55)",
  dusk: "oklch(0.42 0.10 340)",
  night: "oklch(0.28 0.06 280)",
};

const CANOPY: Record<TimePhase, [string, string]> = {
  dawn: ["oklch(0.82 0.04 30 / 60%)", "oklch(0.85 0.03 40 / 40%)"],
  day: ["oklch(0.90 0.02 75 / 50%)", "oklch(0.88 0.03 80 / 35%)"],
  dusk: ["oklch(0.52 0.06 320 / 55%)", "oklch(0.48 0.05 315 / 40%)"],
  night: ["oklch(0.22 0.04 275 / 60%)", "oklch(0.20 0.03 280 / 40%)"],
};

export function BedroomScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("bedroom");

  const dust = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        x: (i * 3.7 + ((i * 13) % 100)) % 100,
        y: (i * 4.1 + ((i * 7) % 100)) % 100,
        size: 1.2 + (i % 4) * 0.7,
        delay: (i * 0.35) % 8,
        dur: 14 + (i % 6) * 3,
        opacity: 0.1 + (i % 5) * 0.04,
      })),
    [],
  );

  const windowStars = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: 10 + ((i * 5.7) % 80),
        y: 8 + ((i * 4.3) % 75),
        r: 0.8 + (i % 3) * 0.5,
        delay: (i * 0.25) % 4,
        dur: 2.5 + (i % 3) * 1.5,
      })),
    [],
  );

  const isNight = phase === "night";
  const [canopyA, canopyB] = CANOPY[phase];
  const floorDark = FLOOR[phase];

  return (
    <div className="scene scene-container scene-3d">
      {/* ── Wall ── */}
      <div className="absolute inset-0" style={{ background: WALL[phase] }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%, oklch(1 0 0 / 3%), transparent 55%),
            radial-gradient(ellipse at 18% 50%, oklch(1 0 0 / 2%), transparent 40%)
          `,
        }}
      />

      {/* ── Floor ── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "42%",
          background: `linear-gradient(180deg, ${floorDark} 0%, oklch(0.09 0.02 280) 100%)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "42%",
          background: `
            repeating-linear-gradient(90deg, oklch(1 0 0 / 1.5%) 0 90px, transparent 90px 91px),
            repeating-linear-gradient(0deg, oklch(1 0 0 / 0.5%) 0 22px, transparent 22px 23px)
          `,
        }}
      />

      {/* ── Baseboard ── */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: "58%",
          height: "1.8%",
          background: `linear-gradient(180deg, oklch(0.38 0.04 35), oklch(0.30 0.03 30))`,
        }}
      />

      {/* ── Canopy fabric ── */}
      <svg
        className="absolute inset-x-0 top-0 w-full pointer-events-none"
        viewBox="0 0 1000 110"
        preserveAspectRatio="none"
        style={{ height: "9%" }}
      >
        <path
          d="M0 0 L1000 0 L1000 28 Q780 62 560 34 Q340 6 120 42 Q60 52 0 24 Z"
          fill={canopyA}
          style={{ animation: "sway 9s ease-in-out infinite" }}
        />
        <path
          d="M0 8 Q240 50 480 18 Q720 -14 1000 22 L1000 0 L0 0 Z"
          fill={canopyB}
          style={{ animation: "sway 11s ease-in-out 2s infinite reverse" }}
        />
        <ellipse cx="500" cy="6" rx="28" ry="7" fill={canopyA} opacity="0.5" />
      </svg>

      {/* ── Window ── */}
      <div
        className="absolute depth-layer depth-mid"
        style={{ left: "4%", top: "10%", width: "22%", height: "42%" }}
      >
        {/* Sky through glass */}
        <div
          className="absolute rounded-sm overflow-hidden"
          style={{
            left: "5%",
            top: "4.5%",
            width: "88%",
            height: "91%",
            background: SKY[phase],
          }}
        >
          {/* Stars at night */}
          {isNight &&
            windowStars.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.r * 2,
                  height: s.r * 2,
                  animation: `twinkle ${s.dur}s ease-in-out infinite`,
                  animationDelay: `${s.delay}s`,
                }}
              />
            ))}

          {/* Moon at night */}
          {isNight && (
            <div
              className="absolute rounded-full"
              style={{
                right: "12%",
                top: "10%",
                width: "18%",
                height: "0",
                paddingBottom: "18%",
                background:
                  "radial-gradient(circle at 38% 38%, oklch(0.95 0.04 250), oklch(0.88 0.05 250) 70%)",
                boxShadow:
                  "0 0 18px oklch(0.90 0.05 250 / 50%), 0 0 40px oklch(0.85 0.04 250 / 20%)",
              }}
            />
          )}

          {/* Sun glow at day / dawn */}
          {(phase === "day" || phase === "dawn") && (
            <div
              className="absolute rounded-full"
              style={{
                left: phase === "dawn" ? "55%" : "35%",
                top: "8%",
                width: "22%",
                height: "0",
                paddingBottom: "22%",
                background: `radial-gradient(circle, ${
                  phase === "dawn" ? "oklch(0.94 0.10 55 / 70%)" : "oklch(0.96 0.08 85 / 60%)"
                }, transparent 70%)`,
              }}
            />
          )}
        </div>

        {/* Frame + crossbars */}
        <svg viewBox="0 0 200 280" className="absolute inset-0 w-full h-full pointer-events-none">
          <rect x="2" y="2" width="196" height="276" rx="6" fill="oklch(0.30 0.03 30)" />
          <rect x="8" y="8" width="184" height="264" rx="2" fill="none" />
          <rect x="10" y="135" width="180" height="3" fill="oklch(0.30 0.03 30)" />
          <rect x="98" y="10" width="3" height="260" fill="oklch(0.30 0.03 30)" />
        </svg>

        {/* Left curtain */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-12%",
            top: "-2%",
            width: "28%",
            height: "106%",
            animation: "sway 7s ease-in-out infinite",
            transformOrigin: "top center",
          }}
        >
          <svg viewBox="0 0 55 300" className="w-full h-full">
            <path
              d="M4 0 Q14 55 7 110 Q1 165 11 220 Q17 265 4 300 L0 300 L0 0 Z"
              fill={isNight ? "oklch(0.28 0.04 275 / 70%)" : "oklch(0.92 0.03 40 / 55%)"}
            />
            <path
              d="M18 0 Q28 65 20 130 Q13 195 23 255 Q30 285 18 300 L14 300 L14 0 Z"
              fill={isNight ? "oklch(0.24 0.03 280 / 45%)" : "oklch(0.90 0.03 35 / 40%)"}
            />
          </svg>
        </div>

        {/* Right curtain */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "-12%",
            top: "-2%",
            width: "28%",
            height: "106%",
            animation: "sway 7s ease-in-out 1.5s infinite reverse",
            transformOrigin: "top center",
          }}
        >
          <svg viewBox="0 0 55 300" className="w-full h-full">
            <path
              d="M51 0 Q41 55 48 110 Q54 165 44 220 Q38 265 51 300 L55 300 L55 0 Z"
              fill={isNight ? "oklch(0.28 0.04 275 / 70%)" : "oklch(0.92 0.03 40 / 55%)"}
            />
            <path
              d="M37 0 Q27 65 35 130 Q42 195 32 255 Q25 285 37 300 L41 300 L41 0 Z"
              fill={isNight ? "oklch(0.24 0.03 280 / 45%)" : "oklch(0.90 0.03 35 / 40%)"}
            />
          </svg>
        </div>
      </div>

      {/* ── Moonlight beam (night) ── */}
      {isNight && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: "14%",
            top: "38%",
            width: "42%",
            height: "58%",
            background:
              "linear-gradient(158deg, oklch(0.82 0.04 250 / 9%) 0%, oklch(0.78 0.03 250 / 4%) 35%, transparent 65%)",
            clipPath: "polygon(18% 0%, 48% 0%, 100% 100%, 0% 82%)",
            animation: "breathe 12s ease-in-out infinite",
          }}
        />
      )}

      {/* ── Left nightstand ── */}
      <div
        className="absolute depth-layer depth-near pointer-events-none"
        style={{ left: "5%", top: "46%", width: "16%", height: "24%" }}
      >
        <svg viewBox="0 0 140 120" className="w-full h-full">
          {/* Table top */}
          <rect x="5" y="18" width="130" height="8" rx="3" fill={WOOD[phase]} />
          {/* Body */}
          <rect
            x="12"
            y="25"
            width="116"
            height="42"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(0.9)" }}
          />
          {/* Drawer */}
          <rect
            x="20"
            y="32"
            width="100"
            height="16"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(1.08)" }}
          />
          <circle cx="70" cy="40" r="2.5" fill="oklch(0.55 0.06 55 / 50%)" />
          {/* Legs */}
          <rect
            x="14"
            y="65"
            width="6"
            height="26"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(0.8)" }}
          />
          <rect
            x="120"
            y="65"
            width="6"
            height="26"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(0.8)" }}
          />

          {/* Small vase + flower */}
          <rect x="14" y="5" width="8" height="13" rx="3" fill="oklch(0.58 0.08 280 / 65%)" />
          <line
            x1="18"
            y1="5"
            x2="15"
            y2="-2"
            stroke="oklch(0.44 0.12 155)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              animation: "sway 5s ease-in-out infinite",
              transformOrigin: "18px 8px",
            }}
          />
          <circle
            cx="15"
            cy="-3"
            r="3.5"
            fill="oklch(0.74 0.14 350 / 75%)"
            style={{
              animation: "sway 5s ease-in-out infinite",
              transformOrigin: "18px 8px",
            }}
          />

          {/* Second small flower */}
          <line
            x1="22"
            y1="5"
            x2="25"
            y2="-1"
            stroke="oklch(0.46 0.12 148)"
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{
              animation: "sway 5.5s ease-in-out 0.5s infinite",
              transformOrigin: "22px 8px",
            }}
          />
          <circle
            cx="25"
            cy="-2"
            r="2.8"
            fill="oklch(0.78 0.12 55 / 70%)"
            style={{
              animation: "sway 5.5s ease-in-out 0.5s infinite",
              transformOrigin: "22px 8px",
            }}
          />

          {/* Small book on left nightstand */}
          <rect x="70" y="6" width="28" height="4" rx="1" fill="oklch(0.50 0.08 280 / 70%)" />
        </svg>
      </div>

      {/* ── Bed ── */}
      <div
        className="absolute depth-layer depth-near"
        style={{ left: "24%", top: "28%", width: "52%", height: "42%" }}
      >
        <svg viewBox="0 0 520 250" className="w-full h-full">
          {/* Shadow */}
          <ellipse cx="260" cy="240" rx="230" ry="8" fill="oklch(0 0 0 / 12%)" />

          {/* ── Headboard ── */}
          <rect x="10" y="0" width="500" height="82" rx="10" fill={HEADBOARD[phase]} />
          {/* Inner panel */}
          <rect
            x="24"
            y="9"
            width="472"
            height="64"
            rx="5"
            fill={HEADBOARD[phase]}
            opacity="0.55"
            style={{ filter: "brightness(1.14)" }}
          />
          {/* Decorative horizontal line */}
          <line
            x1="44"
            y1="42"
            x2="476"
            y2="42"
            stroke={HEADBOARD[phase]}
            strokeWidth="1"
            opacity="0.3"
            style={{ filter: "brightness(1.3)" }}
          />

          {/* ── Bed frame ── */}
          <rect
            x="0"
            y="172"
            width="520"
            height="16"
            rx="4"
            fill={HEADBOARD[phase]}
            style={{ filter: "brightness(0.85)" }}
          />
          {/* Legs */}
          <rect
            x="14"
            y="185"
            width="12"
            height="40"
            rx="3"
            fill={HEADBOARD[phase]}
            style={{ filter: "brightness(0.72)" }}
          />
          <rect
            x="494"
            y="185"
            width="12"
            height="40"
            rx="3"
            fill={HEADBOARD[phase]}
            style={{ filter: "brightness(0.72)" }}
          />

          {/* ── Mattress ── */}
          <rect x="6" y="74" width="508" height="98" rx="12" fill="oklch(0.92 0.02 80)" />
          <rect
            x="10"
            y="78"
            width="500"
            height="90"
            rx="10"
            fill="oklch(0.94 0.01 85)"
            opacity="0.4"
          />

          {/* ── Pillow 1 (Noah) ── */}
          <ellipse cx="148" cy="92" rx="112" ry="24" fill={PILLOW[phase]} />
          <ellipse
            cx="148"
            cy="90"
            rx="106"
            ry="19"
            fill={PILLOW[phase]}
            opacity="0.65"
            style={{ filter: "brightness(1.1)" }}
          />
          {/* Pillow crease */}
          <path
            d="M60 92 Q148 86 236 92"
            fill="none"
            stroke={PILLOW[phase]}
            strokeWidth="0.8"
            opacity="0.25"
            style={{ filter: "brightness(1.15)" }}
          />

          {/* ── Pillow 2 (Khadija) ── */}
          <ellipse cx="372" cy="90" rx="112" ry="26" fill={PILLOW[phase]} />
          <ellipse
            cx="372"
            cy="88"
            rx="106"
            ry="21"
            fill={PILLOW[phase]}
            opacity="0.65"
            style={{ filter: "brightness(1.1)" }}
          />
          <path
            d="M284 90 Q372 84 460 90"
            fill="none"
            stroke={PILLOW[phase]}
            strokeWidth="0.8"
            opacity="0.25"
            style={{ filter: "brightness(1.15)" }}
          />

          {/* ── Blanket ── */}
          <path
            d={`M6 116 Q130 ${isNight ? 106 : 110} 260 114 Q390 ${isNight ? 122 : 118} 514 116 L514 180 Q390 187 260 183 Q130 179 6 183 Z`}
            fill={BLANKET[phase]}
          />
          {/* Top fold highlight */}
          <path
            d="M6 121 Q130 111 260 118 Q390 125 514 121"
            fill="none"
            stroke={BLANKET[phase]}
            strokeWidth="1.5"
            opacity="0.4"
            style={{ filter: "brightness(1.18)" }}
          />
          {/* Texture lines */}
          <path
            d="M6 138 Q130 130 260 136 Q390 142 514 138"
            fill="none"
            stroke={BLANKET[phase]}
            strokeWidth="0.7"
            opacity="0.18"
            style={{ filter: "brightness(1.12)" }}
          />
          <path
            d="M6 158 Q130 150 260 156 Q390 162 514 158"
            fill="none"
            stroke={BLANKET[phase]}
            strokeWidth="0.7"
            opacity="0.12"
            style={{ filter: "brightness(1.12)" }}
          />
          {/* Blanket bottom hem */}
          <path
            d="M6 180 Q130 174 260 178 Q390 182 514 180"
            fill="none"
            stroke={BLANKET[phase]}
            strokeWidth="1"
            opacity="0.2"
            style={{ filter: "brightness(0.85)" }}
          />
        </svg>
      </div>

      {/* ── Right nightstand (clickable) ── */}
      <button
        onClick={() => onOpen("letter")}
        className="absolute depth-layer depth-near group cursor-pointer"
        style={{ left: "78%", top: "46%", width: "16%", height: "24%" }}
        title="Leave a letter on the nightstand"
      >
        <svg viewBox="0 0 140 120" className="w-full h-full">
          {/* Table top */}
          <rect x="5" y="18" width="130" height="8" rx="3" fill={WOOD[phase]} />
          {/* Body */}
          <rect
            x="12"
            y="25"
            width="116"
            height="42"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(0.9)" }}
          />
          {/* Drawer */}
          <rect
            x="20"
            y="32"
            width="100"
            height="16"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(1.08)" }}
          />
          <circle cx="70" cy="40" r="2.5" fill="oklch(0.55 0.06 55 / 50%)" />
          {/* Legs */}
          <rect
            x="14"
            y="65"
            width="6"
            height="26"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(0.8)" }}
          />
          <rect
            x="120"
            y="65"
            width="6"
            height="26"
            rx="2"
            fill={WOOD[phase]}
            style={{ filter: "brightness(0.8)" }}
          />

          {/* ── Lamp ── */}
          <g>
            <ellipse cx="42" cy="18" rx="10" ry="3.5" fill="oklch(0.55 0.06 35 / 75%)" />
            <rect x="40" y="3" width="4" height="15" rx="2" fill="oklch(0.50 0.05 30 / 75%)" />
            <path d="M32 3 L38 -5 L46 -5 L52 3 Z" fill="oklch(0.85 0.05 75 / 80%)" />
            {isNight && (
              <>
                <circle
                  cx="42"
                  cy="-2"
                  r="28"
                  fill="oklch(0.90 0.12 55 / 10%)"
                  style={{ animation: "breathe 4s ease-in-out infinite" }}
                />
                <circle
                  cx="42"
                  cy="-2"
                  r="16"
                  fill="oklch(0.92 0.14 55 / 16%)"
                  style={{ animation: "breathe 4s ease-in-out infinite" }}
                />
              </>
            )}
          </g>

          {/* ── Book stack ── */}
          <g>
            <rect x="78" y="6" width="38" height="5" rx="1" fill="oklch(0.55 0.08 280 / 75%)" />
            <rect x="80" y="1" width="36" height="5" rx="1" fill="oklch(0.60 0.10 20 / 75%)" />
            <rect x="79" y="-4" width="37" height="5" rx="1" fill="oklch(0.50 0.08 155 / 75%)" />
          </g>

          {/* ── Letter envelope ── */}
          <rect x="84" y="10" width="22" height="15" rx="1.5" fill="oklch(0.90 0.04 75 / 88%)" />
          <path
            d="M84 10 L95 19 L106 10"
            fill="none"
            stroke="oklch(0.80 0.04 70 / 45%)"
            strokeWidth="0.8"
          />

          {/* ── Photo frame ── */}
          <rect x="12" y="1" width="14" height="17" rx="1.5" fill="oklch(0.45 0.04 30 / 85%)" />
          <rect x="14" y="3" width="10" height="11" rx="0.5" fill="oklch(0.62 0.08 20 / 55%)" />
        </svg>

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 24px oklch(0.72 0.14 15 / 10%)",
          }}
        />
      </button>

      {/* ── Rug ── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "28%", top: "73%", width: "44%", height: "16%" }}
      >
        <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
          <ellipse cx="200" cy="55" rx="190" ry="38" fill="oklch(0 0 0 / 7%)" />
          <ellipse cx="200" cy="50" rx="185" ry="36" fill={RUG_COLOR[phase]} />
          <ellipse
            cx="200"
            cy="50"
            rx="168"
            ry="30"
            fill="none"
            stroke={RUG_COLOR[phase]}
            strokeWidth="2.5"
            opacity="0.45"
            style={{ filter: "brightness(1.18)" }}
          />
          <ellipse
            cx="200"
            cy="50"
            rx="138"
            ry="22"
            fill="none"
            stroke={RUG_COLOR[phase]}
            strokeWidth="1.2"
            opacity="0.25"
            style={{ filter: "brightness(1.22)" }}
          />
          <path
            d="M200 30 L218 50 L200 70 L182 50 Z"
            fill={RUG_COLOR[phase]}
            opacity="0.35"
            style={{ filter: "brightness(1.2)" }}
          />
          {/* Fringe suggestion */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={i}
              x1={22 + i * 18}
              y1="86"
              x2={22 + i * 18}
              y2="92"
              stroke={RUG_COLOR[phase]}
              strokeWidth="0.8"
              opacity="0.2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      {/* ── Lamp warm glow on wall at night ── */}
      {isNight && (
        <div
          className="absolute pointer-events-none"
          style={{
            right: "12%",
            top: "32%",
            width: "28%",
            height: "30%",
            background:
              "radial-gradient(ellipse at 50% 60%, oklch(0.88 0.12 55 / 7%), transparent 65%)",
            animation: "breathe 5s ease-in-out infinite",
          }}
        />
      )}

      {/* ── Memory items ── */}
      {items.map((m) => {
        const isLetter = m.kind === "letter";
        const isPhoto = m.kind === "photo";
        return (
          <button
            key={m.id}
            onClick={() => onView(m)}
            title={m.title}
            className="group absolute depth-layer depth-near"
            style={{
              left: `${(m.x ?? 0.5) * 100}%`,
              top: `${(m.y ?? 0.55) * 100}%`,
              transform: "translate(-50%, -50%)",
              animation: `gentle-bob ${3 + (m.x ?? 0.5) * 2}s ease-in-out infinite`,
              animationDelay: `${(m.x ?? 0.5) * 3}s`,
            }}
          >
            {isPhoto ? (
              <svg width="30" height="26" viewBox="0 0 30 26">
                <rect x="1" y="1" width="28" height="24" rx="2" fill="oklch(0.40 0.04 30 / 90%)" />
                <rect x="3" y="3" width="24" height="18" rx="1" fill="oklch(0.60 0.08 20 / 50%)" />
                <circle cx="10" cy="10" r="2" fill="oklch(0.85 0.08 55 / 40%)" />
              </svg>
            ) : isLetter ? (
              <svg width="28" height="22" viewBox="0 0 28 22">
                <rect
                  x="1"
                  y="1"
                  width="26"
                  height="20"
                  rx="2"
                  fill="oklch(0.92 0.03 75 / 88%)"
                  stroke="oklch(0.80 0.04 70 / 35%)"
                  strokeWidth="0.5"
                />
                <path
                  d="M1 1 L14 12 L27 1"
                  fill="none"
                  stroke="oklch(0.80 0.04 70 / 25%)"
                  strokeWidth="0.7"
                />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 26 26">
                <rect
                  x="2"
                  y="1"
                  width="22"
                  height="24"
                  rx="2"
                  fill="oklch(0.90 0.03 80 / 85%)"
                  stroke="oklch(0.78 0.04 70 / 30%)"
                  strokeWidth="0.5"
                />
                <line
                  x1="6"
                  y1="7"
                  x2="20"
                  y2="7"
                  stroke="oklch(0.70 0.04 30 / 25%)"
                  strokeWidth="0.6"
                />
                <line
                  x1="6"
                  y1="11"
                  x2="18"
                  y2="11"
                  stroke="oklch(0.70 0.04 30 / 20%)"
                  strokeWidth="0.6"
                />
                <line
                  x1="6"
                  y1="15"
                  x2="16"
                  y2="15"
                  stroke="oklch(0.70 0.04 30 / 15%)"
                  strokeWidth="0.6"
                />
              </svg>
            )}
            <span className="absolute left-1/2 -top-6 -translate-x-1/2 whitespace-nowrap text-xs italic text-foreground/80 opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
              {m.title}
            </span>
          </button>
        );
      })}

      {/* ── Dust particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dust.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              background: isNight
                ? `oklch(0.82 0.04 250 / ${d.opacity})`
                : `oklch(0.95 0.02 80 / ${d.opacity})`,
              animation: `dust-float ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Night ambient wash ── */}
      {isNight && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 22% 38%, oklch(0.70 0.08 250 / 4%), transparent 45%),
              radial-gradient(ellipse at 82% 42%, oklch(0.85 0.12 55 / 3%), transparent 35%)
            `,
          }}
        />
      )}

      {/* ── Bottom prompt ── */}
      <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        {isNight
          ? "the stars are watching over us"
          : phase === "dawn"
            ? "a new morning, soft and golden"
            : phase === "dusk"
              ? "the day quiets, and we rest"
              : "click the nightstand to leave a letter"}
      </p>
    </div>
  );
}
