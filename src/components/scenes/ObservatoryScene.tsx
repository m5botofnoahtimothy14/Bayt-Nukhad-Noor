import { useMemo, useState } from "react";
import { useMemories, type Memory } from "@/components/world/memories";
import { type Season } from "@/hooks/useSeason";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

const CONSTELLATIONS: [number, number, number, number][] = [
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
  [15, 65, 22, 60],
  [22, 60, 30, 62],
  [30, 62, 28, 70],
  [28, 70, 15, 65],
  [65, 55, 72, 48],
  [72, 48, 80, 52],
  [80, 52, 75, 60],
  [75, 60, 65, 55],
  [45, 30, 52, 25],
  [52, 25, 58, 30],
  [58, 30, 50, 35],
  [50, 35, 45, 30],
];

const OUR_CONSTELLATION_STARS = [
  { x: 42, y: 38 },
  { x: 46, y: 32 },
  { x: 50, y: 34 },
  { x: 48, y: 40 },
  { x: 44, y: 44 },
  { x: 52, y: 42 },
];

const OUR_CONSTELLATION_LINES: [number, number, number, number][] = [
  [42, 38, 46, 32],
  [46, 32, 50, 34],
  [50, 34, 52, 42],
  [52, 42, 48, 40],
  [48, 40, 44, 44],
  [44, 44, 42, 38],
];

const POETIC_TEXTS = [
  "the night we met",
  "our first word",
  "the promise whispered",
  "that golden evening",
  "when time stood still",
  "the kiss under stars",
  "our forever began",
];

function seasonSky(season?: Season) {
  switch (season) {
    case "winter":
      return {
        bg: "radial-gradient(ellipse at 50% 100%, oklch(0.22 0.06 260) 0%, oklch(0.08 0.04 255) 50%, oklch(0.03 0.02 250) 100%)",
        nebula: `
          radial-gradient(ellipse at 20% 25%, oklch(0.3 0.08 260 / 10%), transparent 40%),
          radial-gradient(ellipse at 75% 18%, oklch(0.25 0.06 240 / 8%), transparent 35%),
          radial-gradient(ellipse at 50% 65%, oklch(0.22 0.05 280 / 6%), transparent 50%)
        `,
        starHue: 220,
        snow: true,
      };
    case "summer":
      return {
        bg: "radial-gradient(ellipse at 50% 100%, oklch(0.25 0.10 320) 0%, oklch(0.10 0.06 310) 50%, oklch(0.04 0.03 300) 100%)",
        nebula: `
          radial-gradient(ellipse at 20% 25%, oklch(0.35 0.14 340 / 14%), transparent 40%),
          radial-gradient(ellipse at 75% 18%, oklch(0.30 0.12 10 / 12%), transparent 35%),
          radial-gradient(ellipse at 50% 65%, oklch(0.28 0.10 30 / 10%), transparent 50%),
          radial-gradient(ellipse at 85% 60%, oklch(0.32 0.12 350 / 8%), transparent 30%)
        `,
        starHue: 30,
        snow: false,
      };
    case "spring":
      return {
        bg: "radial-gradient(ellipse at 50% 100%, oklch(0.25 0.09 180) 0%, oklch(0.10 0.05 170) 50%, oklch(0.04 0.02 160) 100%)",
        nebula: `
          radial-gradient(ellipse at 20% 25%, oklch(0.30 0.12 160 / 12%), transparent 40%),
          radial-gradient(ellipse at 75% 18%, oklch(0.28 0.10 190 / 10%), transparent 35%),
          radial-gradient(ellipse at 50% 65%, oklch(0.25 0.08 140 / 8%), transparent 50%),
          radial-gradient(ellipse at 30% 45%, oklch(0.30 0.14 130 / 10%), transparent 30%)
        `,
        starHue: 160,
        snow: false,
      };
    case "autumn":
    default:
      return {
        bg: "radial-gradient(ellipse at 50% 100%, oklch(0.25 0.08 280) 0%, oklch(0.10 0.04 270) 50%, oklch(0.04 0.02 260) 100%)",
        nebula: `
          radial-gradient(ellipse at 20% 25%, oklch(0.30 0.12 50 / 12%), transparent 40%),
          radial-gradient(ellipse at 75% 18%, oklch(0.25 0.10 30 / 10%), transparent 35%),
          radial-gradient(ellipse at 50% 65%, oklch(0.22 0.08 60 / 8%), transparent 50%),
          radial-gradient(ellipse at 85% 60%, oklch(0.28 0.10 15 / 6%), transparent 30%)
        `,
        starHue: 50,
        snow: false,
      };
  }
}

export function ObservatoryScene({ season, onAdd, onView }: Props) {
  const { items } = useMemories("observatory");
  const [telescopeActive, setTelescopeActive] = useState(false);
  const [memoryRevealed, setMemoryRevealed] = useState<string | null>(null);

  const sky = seasonSky(season);

  const shootingStars = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        left: 10 + ((i * 23 + 17) % 70),
        top: 3 + ((i * 17 + 11) % 40),
        delay: 5 + i * 7,
        dur: 4 + (i % 3),
      })),
    [],
  );

  const poeticText = useMemo(
    () => POETIC_TEXTS[Math.floor(Math.random() * POETIC_TEXTS.length)],
    [],
  );

  const starCount = season === "winter" ? 480 : season === "summer" ? 380 : 420;

  const allStars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        x: (i * 3.7 + ((i * 13) % 100)) % 100,
        y: (i * 2.9 + ((i * 7) % 100)) % 95,
        s: 0.3 + ((i * 11) % 10) * 0.22,
        d: 2 + ((i * 7) % 5),
        delay: (i * 0.03) % 3,
        bright: 0.25 + ((i * 17) % 10) * 0.08,
        hue: (i * 19) % 360,
      })),
    [starCount],
  );

  const starColor = (hue: number, bright: number) =>
    `oklch(${0.85 + bright * 0.15} 0.04 ${sky.starHue + (hue % 60) - 30})`;

  return (
    <div
      className="scene scene-container vignette-soft scene-3d"
      style={{ background: sky.bg }}
    >
      {/* Nebula wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: sky.nebula }}
      />

      {/* Galaxy spiral */}
      <svg
        className="absolute pointer-events-none"
        style={{
          left: "60%",
          top: "8%",
          width: 220,
          height: 220,
          opacity: 0.06,
          transform: "rotate(-25deg)",
        }}
        viewBox="0 0 200 200"
      >
        <defs>
          <radialGradient id="galaxyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.9 0.08 280)" stopOpacity="1" />
            <stop offset="60%" stopColor="oklch(0.7 0.06 300)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.5 0.04 320)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M100 100 C100 60 130 30 160 40 C190 50 190 90 170 110 C150 130 110 130 90 115 C70 100 60 70 75 50 C90 30 120 25 140 35 C155 42 165 60 160 80 C155 95 135 105 115 100 C100 96 92 80 98 65 C104 52 120 48 130 55 C138 60 140 72 135 80"
          fill="none"
          stroke="url(#galaxyGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="4" fill="oklch(0.95 0.06 280 / 60%)" />
      </svg>

      {/* Aurora for spring */}
      {season === "spring" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 8}%`,
                left: `${15 + i * 15}%`,
                width: `${30 + i * 10}%`,
                height: 3,
                background: `linear-gradient(90deg, transparent, oklch(0.5 0.18 ${130 + i * 30} / 20%), oklch(0.5 0.16 ${160 + i * 20} / 15%), transparent)`,
                borderRadius: "50%",
                filter: "blur(12px)",
                animation: `aurora-shimmer ${6 + i * 2}s ease-in-out infinite alternate`,
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow for winter */}
      {sky.snow && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${(i * 4.1 + 3) % 100}%`,
                top: `${80 + (i * 3.7) % 20}%`,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                background: "oklch(0.95 0.01 250 / 30%)",
                animation: `snowfall ${8 + (i % 4) * 3}s linear infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* === DEPTH: Background stars === */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{ animation: "parallax-sway-x 40s ease-in-out infinite" }}
      >
        {allStars.slice(0, 200).map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s * 0.7,
              height: s.s * 0.7,
              background: starColor(s.hue ?? i, s.bright),
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
        {allStars.slice(200, 320).map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              background: starColor((s.hue ?? i) + 20, s.bright),
              opacity: s.bright * 0.8,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === DEPTH: Foreground stars === */}
      <div className="depth-layer depth-near absolute inset-0">
        {allStars.slice(320).map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s * 1.3,
              height: s.s * 1.3,
              background: starColor((s.hue ?? i) + 40, s.bright),
              opacity: s.bright,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Planets */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "22%", top: "14%", width: 10, height: 10 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, oklch(0.75 0.14 25), oklch(0.55 0.12 15))",
            boxShadow: "0 0 8px oklch(0.7 0.12 20 / 40%)",
          }}
        />
      </div>

      <div
        className="absolute pointer-events-none"
        style={{ left: "82%", top: "22%" }}
      >
        <div style={{ position: "relative", width: 18, height: 18 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 40% 35%, oklch(0.7 0.12 30), oklch(0.5 0.10 20))",
              boxShadow: "0 0 10px oklch(0.6 0.10 25 / 30%)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "40%",
              left: "-20%",
              width: "140%",
              height: 3,
              borderRadius: "50%",
              border: "1px solid oklch(0.75 0.08 35 / 40%)",
              transform: "rotateX(70deg) rotateZ(-15deg)",
            }}
          />
        </div>
      </div>

      <div
        className="absolute pointer-events-none"
        style={{ left: "58%", top: "8%", width: 6, height: 6 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, oklch(0.65 0.10 180), oklch(0.45 0.08 200))",
            boxShadow: "0 0 6px oklch(0.55 0.08 190 / 30%)",
          }}
        />
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
            stroke={`oklch(0.8 0.06 ${sky.starHue} / 12%)`}
            strokeWidth="0.12"
          />
        ))}
      </svg>

      {/* Shooting stars */}
      {shootingStars.map((ss, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${ss.left}%`,
            top: `${ss.top}%`,
            width: 3,
            height: 3,
            background: "white",
            borderRadius: "50%",
            boxShadow: `0 0 8px 3px oklch(0.95 0.06 ${sky.starHue} / 80%), -50px 25px 25px oklch(0.95 0.06 ${sky.starHue} / 0%)`,
            animation: `shooting-star ${ss.dur}s linear ${ss.delay}s infinite`,
          }}
        />
      ))}

      {/* Moon with enhanced craters */}
      <div
        className="depth-layer depth-near absolute right-[10%] top-[10%] h-32 w-32 rounded-full"
        style={{ animation: "depth-pulse 18s ease-in-out infinite" }}
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
        {/* Moon craters */}
        <div
          className="absolute top-[18%] left-[25%] w-6 h-6 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 20%)" }}
        />
        <div
          className="absolute top-[50%] left-[55%] w-4 h-4 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 15%)" }}
        />
        <div
          className="absolute top-[35%] left-[65%] w-3 h-3 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 18%)" }}
        />
        <div
          className="absolute top-[65%] left-[30%] w-5 h-5 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 12%)" }}
        />
        <div
          className="absolute top-[42%] left-[20%] w-2.5 h-2.5 rounded-full"
          style={{ background: "oklch(0.84 0.04 20 / 16%)" }}
        />
        {/* Moon terminator shadow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, oklch(0.1 0.02 260 / 40%) 100%)",
          }}
        />
      </div>

      {/* Memory stars */}
      {items.map((m) => {
        const isRevealed = memoryRevealed === m.id;
        return (
          <button
            key={m.id}
            onClick={() => {
              if (telescopeActive) {
                setMemoryRevealed(isRevealed ? null : m.id);
              } else {
                onView(m);
              }
            }}
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
                color: isRevealed
                  ? "oklch(0.98 0.20 80)"
                  : telescopeActive
                    ? "oklch(0.95 0.20 40)"
                    : "oklch(0.95 0.16 15)",
                animation: isRevealed ? "none" : "twinkle 3s ease-in-out infinite",
                filter: isRevealed
                  ? "drop-shadow(0 0 20px oklch(0.95 0.20 80 / 90%))"
                  : telescopeActive
                    ? "drop-shadow(0 0 14px oklch(0.9 0.20 40 / 80%))"
                    : "drop-shadow(0 0 10px oklch(0.9 0.16 15 / 70%))",
                transform: isRevealed ? "scale(2.5)" : undefined,
                transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {isRevealed ? "\u2605" : "\u2726"}
            </span>
            {isRevealed && (
              <span
                className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-sm italic text-foreground font-medium drop-shadow-lg"
                style={{ animation: "star-appear 0.5s ease-out both" }}
              >
                {m.title}
              </span>
            )}
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
              {m.title}
            </span>
          </button>
        );
      })}

      {/* Observatory structure: glass dome + floor */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 810"
        preserveAspectRatio="none"
      >
        {/* Dome arcs — glass structure */}
        <path
          d="M-20 300 Q720 -60 1460 300"
          fill="none"
          stroke="oklch(0.7 0.04 250 / 8%)"
          strokeWidth="2"
        />
        <path
          d="M80 260 Q720 -20 1360 260"
          fill="none"
          stroke="oklch(0.7 0.04 250 / 5%)"
          strokeWidth="1.5"
        />
        <path
          d="M200 230 Q720 20 1240 230"
          fill="none"
          stroke="oklch(0.7 0.04 250 / 4%)"
          strokeWidth="1"
        />
        {/* Dome ribs */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 160 + i * 140;
          const curveY = 180 + Math.abs(i - 4) * 20;
          return (
            <line
              key={`rib-${i}`}
              x1={x}
              y1={curveY}
              x2={x}
              y2={300}
              stroke="oklch(0.7 0.04 250 / 6%)"
              strokeWidth="1"
            />
          );
        })}
        {/* Glass reflection glints */}
        <ellipse
          cx="400"
          cy="200"
          rx="60"
          ry="15"
          fill="oklch(0.9 0.02 220 / 4%)"
          transform="rotate(-8 400 200)"
        />
        <ellipse
          cx="900"
          cy="170"
          rx="50"
          ry="10"
          fill="oklch(0.9 0.02 220 / 3%)"
          transform="rotate(5 900 170)"
        />

        {/* Observatory platform / curved floor */}
        <path
          d="M0 620 Q720 560 1440 620 L1440 810 L0 810 Z"
          fill="oklch(0.08 0.03 270)"
        />
        <path
          d="M0 620 Q720 560 1440 620"
          fill="none"
          stroke="oklch(0.25 0.04 280 / 30%)"
          strokeWidth="1.5"
        />
        {/* Railing posts */}
        {Array.from({ length: 13 }, (_, i) => {
          const x = 60 + i * 110;
          const railY = 610 + Math.sin((i / 12) * Math.PI) * -20;
          return (
            <g key={`rail-${i}`}>
              <line
                x1={x}
                y1={railY}
                x2={x}
                y2={railY + 35}
                stroke="oklch(0.35 0.03 280 / 40%)"
                strokeWidth="2"
              />
              {i < 12 && (
                <line
                  x1={x}
                  y1={railY + 10}
                  x2={x + 110}
                  y2={
                    610 + Math.sin(((i + 1) / 12) * Math.PI) * -20 + 10
                  }
                  stroke="oklch(0.35 0.03 280 / 25%)"
                  strokeWidth="1"
                />
              )}
            </g>
          );
        })}
        {/* Floor line details */}
        <path
          d="M100 660 Q720 630 1340 660"
          fill="none"
          stroke="oklch(0.20 0.03 280 / 15%)"
          strokeWidth="0.5"
        />
        <path
          d="M50 700 Q720 675 1390 700"
          fill="none"
          stroke="oklch(0.18 0.03 280 / 10%)"
          strokeWidth="0.5"
        />
      </svg>

      {/* Telescope */}
      <button
        onClick={() => setTelescopeActive(!telescopeActive)}
        className="absolute depth-layer depth-near cursor-pointer group"
        style={{
          left: "48%",
          bottom: "22%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
        title={telescopeActive ? "Click to close the telescope" : "Click to gaze at the stars"}
      >
        <svg
          width="100"
          height="140"
          viewBox="0 0 100 140"
          className="transition-transform duration-500"
          style={{
            transform: telescopeActive ? "rotate(-25deg)" : "rotate(-15deg)",
            filter: telescopeActive
              ? "drop-shadow(0 0 15px oklch(0.8 0.12 200 / 50%))"
              : "drop-shadow(0 0 6px oklch(0.3 0.03 280 / 40%))",
          }}
        >
          {/* Tripod legs */}
          <line
            x1="50"
            y1="95"
            x2="25"
            y2="138"
            stroke="oklch(0.4 0.03 280)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="95"
            x2="75"
            y2="138"
            stroke="oklch(0.4 0.03 280)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="95"
            x2="50"
            y2="140"
            stroke="oklch(0.4 0.03 280)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Mount / pivot */}
          <circle
            cx="50"
            cy="90"
            r="6"
            fill="oklch(0.45 0.04 280)"
            stroke="oklch(0.55 0.04 280)"
            strokeWidth="1.5"
          />
          {/* Telescope tube — main body */}
          <rect
            x="38"
            y="10"
            width="24"
            height="82"
            rx="5"
            fill="url(#tubeGrad)"
            stroke="oklch(0.5 0.04 260 / 60%)"
            strokeWidth="1"
          />
          {/* Tube rings / details */}
          <rect
            x="36"
            y="30"
            width="28"
            height="4"
            rx="2"
            fill="oklch(0.55 0.04 270 / 50%)"
          />
          <rect
            x="36"
            y="60"
            width="28"
            height="4"
            rx="2"
            fill="oklch(0.55 0.04 270 / 50%)"
          />
          {/* Lens / aperture end */}
          <ellipse
            cx="50"
            cy="12"
            rx="14"
            ry="5"
            fill="oklch(0.3 0.06 260)"
            stroke="oklch(0.6 0.06 240 / 60%)"
            strokeWidth="1.5"
          />
          {/* Lens glass */}
          <ellipse
            cx="50"
            cy="11"
            rx="10"
            ry="3.5"
            fill="oklch(0.5 0.08 240 / 40%)"
          />
          {telescopeActive && (
            <ellipse
              cx="50"
              cy="11"
              rx="8"
              ry="2.5"
              fill="oklch(0.7 0.12 200 / 30%)"
              className="animate-pulse"
            />
          )}
          {/* Eyepiece */}
          <rect
            x="42"
            y="86"
            width="16"
            height="10"
            rx="3"
            fill="oklch(0.35 0.04 280)"
            stroke="oklch(0.5 0.04 280 / 50%)"
            strokeWidth="1"
          />
          {/* Focus knob */}
          <circle
            cx="66"
            cy="50"
            r="4"
            fill="oklch(0.4 0.03 280)"
            stroke="oklch(0.5 0.04 280 / 50%)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="tubeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.38 0.05 270)" />
              <stop offset="40%" stopColor="oklch(0.5 0.05 275)" />
              <stop offset="100%" stopColor="oklch(0.35 0.04 270)" />
            </linearGradient>
          </defs>
        </svg>
      </button>

      {/* Telescope viewport overlay */}
      {telescopeActive && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 30 }}
        >
          <div
            className="relative"
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid oklch(0.5 0.04 270 / 60%)",
              boxShadow: `
                0 0 0 2px oklch(0.2 0.03 270 / 40%),
                0 0 40px oklch(0.4 0.06 240 / 20%),
                inset 0 0 60px oklch(0.05 0.02 260 / 50%)
              `,
              animation: "viewport-appear 0.6s ease-out both",
            }}
          >
            {/* Viewport background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.06 0.04 260), oklch(0.02 0.02 250))",
              }}
            />
            {/* Zoomed stars */}
            {Array.from({ length: 60 }, (_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${((i * 7.3 + 11) % 100)}%`,
                  top: `${((i * 5.7 + 19) % 100)}%`,
                  width: 2 + (i % 4),
                  height: 2 + (i % 4),
                  background: `oklch(0.9 0.04 ${sky.starHue + (i % 40)})`,
                  opacity: 0.5 + (i % 5) * 0.1,
                  animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.1) % 2}s`,
                }}
              />
            ))}
            {/* "Our Constellation" */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              {OUR_CONSTELLATION_LINES.map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="oklch(0.9 0.12 200 / 50%)"
                  strokeWidth="0.3"
                  strokeLinecap="round"
                />
              ))}
              {OUR_CONSTELLATION_STARS.map((s, i) => (
                <circle
                  key={i}
                  cx={`${s.x}%`}
                  cy={`${s.y}%`}
                  r="1.2"
                  fill="oklch(0.95 0.12 200)"
                  className="animate-pulse"
                />
              ))}
            </svg>
            {/* Poetic date text */}
            <div
              className="absolute bottom-8 inset-x-0 text-center"
              style={{
                color: "oklch(0.85 0.10 200 / 80%)",
                fontSize: 14,
                fontStyle: "italic",
                fontFamily: "serif",
                letterSpacing: "0.05em",
                textShadow: "0 0 10px oklch(0.5 0.10 200 / 50%)",
              }}
            >
              &ldquo;{poeticText}&rdquo;
            </div>
            {/* "Our Constellation" label */}
            <div
              className="absolute top-7 inset-x-0 text-center"
              style={{
                color: "oklch(0.8 0.08 200 / 60%)",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Our Constellation
            </div>
            {/* Vignette ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 55%, oklch(0.02 0.01 260 / 70%) 100%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Horizon silhouette */}
      <div
        className="depth-layer depth-near absolute inset-x-0 bottom-0"
        style={{ height: "24%" }}
      >
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

      {/* Click to name — only when telescope inactive */}
      {!telescopeActive && (
        <button
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            onAdd({
              x: (e.clientX - r.left) / r.width,
              y: (e.clientY - r.top) / r.height,
            });
          }}
          className="absolute inset-x-0 top-[8%] bottom-[28%] cursor-crosshair"
        />
      )}

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        {telescopeActive
          ? "click the telescope to close the view"
          : "click the sky to name a star"}
      </p>
    </div>
  );
}
