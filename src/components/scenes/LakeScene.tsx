import { useMemo } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";
import { type Season, SEASON_PALETTE } from "@/hooks/useSeason";

type Props = {
  phase: TimePhase;
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

const isNight = (p: TimePhase) => p === "night" || p === "dusk";

export function LakeScene({ phase, season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("lake");
  const pal = SEASON_PALETTE[season];
  const night = isNight(phase);

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: (i * 37 + 13) % 100,
        top: (i * 23 + 5) % 35,
        size: 1.5 + (i % 3),
        dur: 2 + (i % 4),
        delay: (i * 0.3) % 3,
      })),
    [],
  );

  const ripples = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        left: 10 + ((i * 13) % 80),
        top: 15 + ((i * 11) % 55),
        dur: 4 + (i % 3) * 1.5,
        delay: i * 0.7,
        width: 40 + (i % 3) * 15,
      })),
    [],
  );

  const lilyPads = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        left: 15 + ((i * 19) % 70),
        top: 20 + ((i * 14) % 45),
        size: 28 + (i % 3) * 8,
        dur: 5 + i,
        delay: i * 0.6,
        flower: season === "spring" || season === "summer",
      })),
    [season],
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: 5 + ((i * 17) % 55),
        top: 35 + ((i * 11) % 35),
        dur: 3 + (i % 4),
        delay: (i * 0.6) % 4,
        size: 3 + (i % 2),
      })),
    [],
  );

  const shoreFlowers = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        left: 5 + ((i * 13) % 90),
        size: 6 + (i % 3) * 3,
        color: i % 3 === 0 ? pal.flowerAccent : i % 3 === 1 ? "oklch(0.85 0.12 320)" : "oklch(0.90 0.10 80)",
      })),
    [pal],
  );

  const snowflakes = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        left: (i * 37 + 10) % 100,
        size: 3 + (i % 4),
        dur: 6 + (i % 5) * 2,
        delay: (i * 0.4) % 5,
        drift: 15 + (i % 6) * 5,
      })),
    [],
  );

  const autumnLeaves = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        left: 20 + ((i * 17) % 60),
        top: 10 + ((i * 13) % 30),
        dur: 7 + i * 2,
        delay: i * 1.2,
        size: 6 + (i % 3) * 2,
        color: i % 2 === 0 ? "oklch(0.60 0.15 35)" : "oklch(0.55 0.14 55)",
      })),
    [],
  );

  const treeLeft = useMemo(
    () => [
      { x: 3, h: 42, w: 38, trunk: 2.5 },
      { x: 8, h: 36, w: 32, trunk: 2 },
      { x: 14, h: 30, w: 26, trunk: 1.8 },
    ],
    [],
  );

  const treeRight = useMemo(
    () => [
      { x: 86, h: 40, w: 36, trunk: 2.5 },
      { x: 91, h: 34, w: 30, trunk: 2 },
      { x: 96, h: 28, w: 24, trunk: 1.8 },
    ],
    [],
  );

  const foliageColor = night
    ? season === "winter"
      ? "oklch(0.22 0.03 220)"
      : `color-mix(in oklch, ${pal.treeFoliage} 50%, oklch(0.15 0.04 260))`
    : pal.treeFoliage;

  const snowColor = "oklch(0.95 0.01 240)";
  const iceColor = "oklch(0.88 0.02 220 / 60%)";

  return (
    <div className="scene scene-container scene-3d" style={{ background: SKY[phase] }}>
      {/* === STARS (night only) === */}
      {night &&
        stars.map((s, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background: "oklch(0.98 0.01 250)",
              boxShadow: `0 0 ${s.size * 2}px oklch(0.95 0.02 250 / 70%)`,
              animation: `breathe ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

      {/* === DEPTH: Far mountains === */}
      <div
        className="depth-layer depth-farthest absolute inset-x-0 top-[8%] w-full"
        style={{ height: "38%", animation: "parallax-sway-x 35s ease-in-out infinite" }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 280" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtn-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.32 0.06 280)" />
              <stop offset="100%" stopColor="oklch(0.25 0.05 280)" />
            </linearGradient>
          </defs>
          <path
            d="M0 280 L80 180 L180 140 L320 190 L480 90 L620 150 L780 70 L920 130 L1060 95 L1200 155 L1340 100 L1440 170 L1440 280 Z"
            fill="url(#mtn-far)"
          />
          {season === "winter" && (
            <path
              d="M460 100 L480 90 L500 98 L490 95 Z M760 80 L780 70 L800 78 L790 75 Z M1040 105 L1060 95 L1080 103 L1070 100 Z"
              fill={snowColor}
              opacity="0.7"
            />
          )}
        </svg>
      </div>

      {/* === DEPTH: Near mountains === */}
      <div
        className="depth-layer depth-mid absolute inset-x-0 top-[12%] w-full"
        style={{ height: "35%", animation: "parallax-sway-x 25s ease-in-out infinite reverse" }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 250" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtn-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.26 0.06 300)" />
              <stop offset="100%" stopColor="oklch(0.20 0.05 300)" />
            </linearGradient>
          </defs>
          <path
            d="M0 250 L120 150 L280 110 L440 170 L620 65 L800 140 L960 90 L1120 150 L1300 100 L1440 180 L1440 250 Z"
            fill="url(#mtn-near)"
          />
          {season === "winter" && (
            <path
              d="M600 75 L620 65 L640 73 L630 70 Z M940 100 L960 90 L980 98 L970 95 Z M1280 110 L1300 100 L1320 108 L1310 105 Z"
              fill={snowColor}
              opacity="0.8"
            />
          )}
        </svg>
      </div>

      {/* Moon */}
      <div
        className="depth-layer depth-near absolute left-[55%] top-[10%] h-24 w-24 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, oklch(0.98 0.02 95), oklch(0.94 0.04 85))",
          boxShadow: [
            "0 0 40px oklch(0.95 0.05 90 / 50%)",
            "0 0 80px oklch(0.90 0.06 90 / 30%)",
            "0 0 140px oklch(0.85 0.04 90 / 15%)",
          ].join(", "),
          animation: "depth-pulse 14s ease-in-out infinite",
        }}
      >
        {/* Moon craters */}
        <div
          className="absolute rounded-full"
          style={{
            top: "30%", left: "25%", width: "18%", height: "18%",
            background: "oklch(0.88 0.03 85 / 40%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "50%", left: "55%", width: "12%", height: "12%",
            background: "oklch(0.86 0.03 85 / 35%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "22%", left: "58%", width: "10%", height: "10%",
            background: "oklch(0.87 0.02 85 / 30%)",
          }}
        />
      </div>

      {/* === TREES LEFT === */}
      {treeLeft.map((t, i) => (
        <div
          key={`tl-${i}`}
          className="depth-layer absolute"
          style={{
            left: `${t.x}%`,
            bottom: `${50 - t.h * 0.3}%`,
            width: t.w,
            height: t.h,
            animation: `wind-sway ${6 + i}s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 40 50" preserveAspectRatio="none">
            <rect x="18" y="28" width={t.trunk} height="22" rx="1" fill="oklch(0.30 0.06 50)" />
            <ellipse
              cx="20" cy="18" rx={14 + i * 2} ry={18 + i}
              fill={foliageColor}
            />
            {season === "winter" && (
              <ellipse
                cx="20" cy="14" rx={10 + i} ry={8}
                fill={snowColor}
                opacity="0.7"
              />
            )}
          </svg>
        </div>
      ))}

      {/* === TREES RIGHT === */}
      {treeRight.map((t, i) => (
        <div
          key={`tr-${i}`}
          className="depth-layer absolute"
          style={{
            left: `${t.x}%`,
            bottom: `${50 - t.h * 0.3}%`,
            width: t.w,
            height: t.h,
            animation: `wind-sway ${7 + i}s ease-in-out ${i * 0.7}s infinite`,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 40 50" preserveAspectRatio="none">
            <rect x="18" y="28" width={t.trunk} height="22" rx="1" fill="oklch(0.30 0.06 50)" />
            <ellipse
              cx="20" cy="18" rx={14 + i * 2} ry={18 + i}
              fill={foliageColor}
            />
            {season === "winter" && (
              <ellipse
                cx="20" cy="14" rx={10 + i} ry={8}
                fill={snowColor}
                opacity="0.7"
              />
            )}
          </svg>
        </div>
      ))}

      {/* === SHORE GROUND === */}
      <div
        className="absolute inset-x-0"
        style={{
          top: "48%",
          height: "6%",
          background: season === "winter"
            ? `linear-gradient(180deg, ${pal.grass} 0%, oklch(0.85 0.02 240) 60%, oklch(0.35 0.06 280) 100%)`
            : `linear-gradient(180deg, ${pal.grass} 0%, ${pal.grassLight} 60%, oklch(0.30 0.08 280) 100%)`,
          zIndex: 2,
        }}
      />

      {/* === SHORE FLOWERS (spring/summer) === */}
      {(season === "spring" || season === "summer") &&
        shoreFlowers.map((f, i) => (
          <div
            key={`flower-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${f.left}%`,
              top: "47%",
              zIndex: 3,
              animation: `gentle-bob ${4 + i}s ease-in-out ${i * 0.4}s infinite`,
            }}
          >
            <svg width={f.size} height={f.size + 4} viewBox="0 0 10 12">
              <line x1="5" y1="6" x2="5" y2="12" stroke="oklch(0.45 0.10 150)" strokeWidth="1" />
              <circle cx="5" cy="4" r="3" fill={f.color} opacity="0.85" />
              <circle cx="5" cy="4" r="1.2" fill="oklch(0.92 0.08 80)" />
            </svg>
          </div>
        ))}

      {/* === AUTUMN FALLING LEAVES === */}
      {season === "autumn" &&
        autumnLeaves.map((l, i) => (
          <div
            key={`aleaf-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${l.left}%`,
              top: `${l.top}%`,
              zIndex: 5,
              animation: `leaf-flutter ${l.dur}s ease-in-out ${l.delay}s infinite`,
            }}
          >
            <svg width={l.size} height={l.size} viewBox="0 0 8 8">
              <ellipse cx="4" cy="4" rx="3.5" ry="2" fill={l.color} opacity="0.8"
                transform={`rotate(${i * 35} 4 4)`}
              />
            </svg>
          </div>
        ))}

      {/* === WOODEN DOCK === */}
      <div
        className="depth-layer depth-near absolute pointer-events-none"
        style={{
          left: "42%",
          top: "44%",
          width: "16%",
          height: "38%",
          zIndex: 10,
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 120 200"
          preserveAspectRatio="none"
        >
          {/* Dock posts (in water) */}
          <rect x="8" y="60" width="5" height="140" rx="2" fill="oklch(0.32 0.06 55)" />
          <rect x="107" y="60" width="5" height="140" rx="2" fill="oklch(0.30 0.05 55)" />
          <rect x="8" y="100" width="5" height="100" rx="2" fill="oklch(0.28 0.05 55)" />
          <rect x="107" y="100" width="5" height="100" rx="2" fill="oklch(0.28 0.05 55)" />

          {/* Dock planks */}
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={`plank-${i}`}
              x="4"
              y={i * 14 + 2}
              width="112"
              height="11"
              rx="1"
              fill={i % 2 === 0 ? "oklch(0.38 0.06 55)" : "oklch(0.35 0.05 55)"}
              stroke="oklch(0.28 0.04 55)"
              strokeWidth="0.5"
            />
          ))}

          {/* Plank nail dots */}
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={`nail-${i}`}>
              <circle cx="15" cy={i * 14 + 7.5} r="0.8" fill="oklch(0.50 0.03 60)" />
              <circle cx="105" cy={i * 14 + 7.5} r="0.8" fill="oklch(0.50 0.03 60)" />
            </g>
          ))}

          {/* Dock edge trim */}
          <rect x="2" y="0" width="3" height="200" rx="1" fill="oklch(0.33 0.05 55)" />
          <rect x="115" y="0" width="3" height="200" rx="1" fill="oklch(0.33 0.05 55)" />
        </svg>
      </div>

      {/* === BENCH ON DOCK === */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "44%",
          top: "49%",
          width: "12%",
          height: "8%",
          zIndex: 11,
        }}
      >
        <svg viewBox="0 0 80 40" className="w-full h-full">
          {/* Bench seat */}
          <rect x="5" y="10" width="70" height="5" rx="1.5" fill="oklch(0.40 0.07 50)" />
          <rect x="5" y="16" width="70" height="4" rx="1" fill="oklch(0.37 0.06 50)" />
          {/* Bench back */}
          <rect x="8" y="2" width="64" height="4" rx="1" fill="oklch(0.42 0.07 50)" />
          <rect x="8" y="7" width="64" height="3" rx="1" fill="oklch(0.39 0.06 50)" />
          {/* Legs */}
          <rect x="12" y="20" width="3" height="18" rx="1" fill="oklch(0.32 0.05 50)" />
          <rect x="65" y="20" width="3" height="18" rx="1" fill="oklch(0.32 0.05 50)" />
          {/* Back supports */}
          <rect x="12" y="2" width="2.5" height="18" rx="1" fill="oklch(0.34 0.05 50)" />
          <rect x="65.5" y="2" width="2.5" height="18" rx="1" fill="oklch(0.34 0.05 50)" />
          {/* Armrest */}
          <rect x="5" y="9" width="70" height="2" rx="0.5" fill="oklch(0.44 0.08 50)" />
        </svg>
      </div>

      {/* === STRING LIGHTS === */}
      {[18, 50, 82].map((yOff, i) => (
        <div
          key={`light-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: "43.5%",
            top: `${45 + yOff * 0.01}%`,
            width: "13%",
            height: "1%",
            zIndex: 12,
          }}
        >
          {/* Wire */}
          <svg viewBox="0 0 100 10" className="w-full h-full" preserveAspectRatio="none">
            <path
              d={`M0 3 Q25 ${8 + i * 2} 50 5 Q75 ${2 + i} 100 3`}
              fill="none"
              stroke="oklch(0.30 0.02 60 / 50%)"
              strokeWidth="0.8"
            />
          </svg>
          {/* Light bulbs */}
          {[15, 35, 55, 75].map((x, j) => (
            <div
              key={j}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${30 + (j % 2) * 15}%`,
                width: 5,
                height: 5,
                background: "oklch(0.92 0.12 85)",
                boxShadow: [
                  "0 0 6px oklch(0.90 0.14 80 / 80%)",
                  "0 0 14px oklch(0.85 0.12 75 / 40%)",
                  "0 0 24px oklch(0.80 0.10 70 / 20%)",
                ].join(", "),
                animation: `breathe ${3 + j}s ease-in-out ${(i + j) * 0.5}s infinite`,
              }}
            />
          ))}
        </div>
      ))}

      {/* === WATER SURFACE === */}
      <div
        className="depth-layer depth-near absolute inset-x-0 bottom-0 overflow-hidden"
        style={{
          top: "50%",
          height: "50%",
          background: night
            ? `linear-gradient(180deg, oklch(0.22 0.08 270) 0%, oklch(0.16 0.06 275) 30%, oklch(0.10 0.05 280) 70%, oklch(0.08 0.04 285) 100%)`
            : `linear-gradient(180deg, oklch(0.42 0.10 240) 0%, oklch(0.32 0.08 260) 30%, oklch(0.22 0.06 270) 70%, oklch(0.16 0.05 275) 100%)`,
          animation: "water-reflect 8s ease-in-out infinite",
        }}
      >
        {/* Moon reflection */}
        <div
          className="absolute left-[55%] top-4 -translate-x-1/2"
          style={{
            width: 60,
            height: 100,
            background:
              "linear-gradient(180deg, oklch(0.90 0.05 90 / 35%) 0%, oklch(0.85 0.04 90 / 15%) 40%, transparent 100%)",
            filter: "blur(6px)",
            animation: "wave-sway 6s ease-in-out infinite",
          }}
        />

        {/* Stars reflection in water (night) */}
        {night &&
          stars.slice(0, 15).map((s, i) => (
            <div
              key={`sr-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${s.left}%`,
                top: `${5 + (i * 5) % 50}%`,
                width: s.size * 0.6,
                height: s.size * 0.6,
                background: "oklch(0.90 0.01 250 / 30%)",
                filter: "blur(1px)",
                animation: `breathe ${s.dur + 1}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}

        {/* Water light streaks */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`streak-${i}`}
            className="absolute h-px pointer-events-none"
            style={{
              left: `${5 + i * 10}%`,
              top: `${8 + ((i * 7) % 45)}%`,
              width: `${20 + ((i * 11) % 35)}%`,
              background: night
                ? "linear-gradient(90deg, transparent, oklch(0.85 0.06 90 / 10%), transparent)"
                : "linear-gradient(90deg, transparent, oklch(0.80 0.08 230 / 15%), transparent)",
              animation: `wave-sway ${5 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}

        {/* Lily pads */}
        {lilyPads.map((lp, i) => (
          <div
            key={`lily-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${lp.left}%`,
              top: `${lp.top}%`,
              animation: `gentle-bob ${lp.dur}s ease-in-out ${lp.delay}s infinite`,
            }}
          >
            <svg width={lp.size} height={lp.size * 0.6} viewBox="0 0 40 24">
              {/* Lily pad */}
              <ellipse
                cx="20" cy="12" rx="18" ry="10"
                fill={
                  season === "autumn"
                    ? "oklch(0.40 0.10 100)"
                    : season === "winter"
                      ? "oklch(0.35 0.04 160 / 50%)"
                      : "oklch(0.42 0.12 145)"
                }
                opacity={season === "winter" ? 0.4 : 0.8}
              />
              {/* Pad notch */}
              <path
                d="M20 12 L20 2 L24 8 Z"
                fill={
                  night
                    ? "oklch(0.18 0.06 270)"
                    : "oklch(0.35 0.08 240)"
                }
              />
              {/* Flower on pad (spring/summer) */}
              {lp.flower && (
                <g>
                  <circle cx="20" cy="8" r="4" fill="oklch(0.90 0.10 350)" opacity="0.9" />
                  <circle cx="20" cy="8" r="1.8" fill="oklch(0.92 0.08 80)" />
                </g>
              )}
            </svg>
          </div>
        ))}

        {/* Ripples */}
        {ripples.map((r, i) => (
          <span
            key={`ripple-${i}`}
            className="absolute rounded-full border pointer-events-none"
            style={{
              left: `${r.left}%`,
              top: `${r.top}%`,
              width: r.width,
              height: 12,
              borderColor: night
                ? "oklch(0.70 0.04 250 / 12%)"
                : "oklch(0.80 0.06 230 / 15%)",
              animation: `ripple ${r.dur}s ease-out infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}

        {/* Winter ice edges */}
        {season === "winter" && (
          <>
            <div
              className="absolute inset-x-0 top-0 h-[12%] pointer-events-none"
              style={{
                background: `linear-gradient(180deg, ${iceColor} 0%, transparent 100%)`,
              }}
            />
            <div
              className="absolute inset-x-0 left-0 top-0 h-full w-[8%] pointer-events-none"
              style={{
                background: `linear-gradient(90deg, ${iceColor} 0%, transparent 100%)`,
              }}
            />
            <div
              className="absolute inset-x-0 right-0 top-0 h-full w-[8%] pointer-events-none"
              style={{
                background: `linear-gradient(270deg, ${iceColor} 0%, transparent 100%)`,
              }}
            />
          </>
        )}
      </div>

      {/* === PAPER BOATS (memories) === */}
      {items.map((m, i) => (
        <button
          key={m.id}
          onClick={() => onView(m)}
          title={m.title}
          className="depth-layer depth-near group absolute"
          style={{
            left: `${(m.x ?? 0.5) * 100}%`,
            top: `${60 + ((i * 13) % 20)}%`,
            animation: `paper-float ${10 + i * 2}s ease-in-out infinite`,
            transform: "translate(-50%, -50%)",
            zIndex: 15,
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
            {/* Tiny fold line */}
            <line x1="22" y1="4" x2="22" y2="14" stroke="oklch(0.85 0.02 20)" strokeWidth="0.5" />
          </svg>
          <span className="absolute left-1/2 -top-6 -translate-x-1/2 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}

      {/* === FIREFLIES (night, summer/warm seasons) === */}
      {night && (season === "summer" || season === "spring") &&
        fireflies.map((ff, i) => (
          <div
            key={`ff-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${ff.left}%`,
              top: `${ff.top}%`,
              width: ff.size,
              height: ff.size,
              zIndex: 20,
              animation: `firefly ${ff.dur}s ease-in-out ${ff.delay}s infinite`,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: "oklch(0.85 0.18 120)",
                boxShadow: [
                  `0 0 ${ff.size * 2}px oklch(0.85 0.18 120 / 80%)`,
                  `0 0 ${ff.size * 4}px oklch(0.80 0.15 100 / 40%)`,
                ].join(", "),
              }}
            />
          </div>
        ))}

      {/* === WINTER SNOWFLAKES === */}
      {season === "winter" &&
        snowflakes.map((sf, i) => (
          <div
            key={`sf-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${sf.left}%`,
              top: "-3%",
              width: sf.size,
              height: sf.size,
              zIndex: 25,
              animation: `rain-fall ${sf.dur}s linear ${sf.delay}s infinite`,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: "oklch(0.95 0.01 240 / 80%)",
                filter: `blur(${sf.size > 5 ? 0.5 : 0}px)`,
              }}
            />
          </div>
        ))}

      {/* === CLICK WATER === */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        className="absolute inset-x-0 bottom-0 top-[50%] cursor-crosshair"
        style={{ zIndex: 30 }}
      />

      {/* === BOTTOM TEXT === */}
      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/80 drop-shadow-lg" style={{ zIndex: 30 }}>
        click the water to send a paper boat
      </p>
    </div>
  );
}
