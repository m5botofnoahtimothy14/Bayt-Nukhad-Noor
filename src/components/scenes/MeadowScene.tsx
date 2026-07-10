import { useMemo } from "react";
import { useMemories, type Memory } from "@/components/world/memories";
import { type Season } from "@/hooks/useSeason";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

/* ── Season palette ── */
const P: Record<
  Season,
  {
    skyTop: string;
    skyMid: string;
    skyBot: string;
    grassFar: string;
    grassMid: string;
    grassNear: string;
    grassAccent: string;
    hillFar: string;
    hillMid: string;
    hillNear: string;
    treeSilhouette: string;
    treeTrunk: string;
    fogA: string;
    fogB: string;
    fogC: string;
    puddle: string;
    puddleShine: string;
    rainColor: string;
    rainFar: string;
    umbrella: string;
    umbrellaHighlight: string;
    horizonGlow: string;
    cloudFill: string;
    leafA: string;
    leafB: string;
    snow: string;
    flowerA: string;
    flowerB: string;
    grassBlade: string;
  }
> = {
  spring: {
    skyTop: "oklch(0.22 0.07 260)",
    skyMid: "oklch(0.30 0.06 200)",
    skyBot: "oklch(0.45 0.08 160)",
    grassFar: "oklch(0.42 0.12 148)",
    grassMid: "oklch(0.48 0.14 145)",
    grassNear: "oklch(0.38 0.13 150)",
    grassAccent: "oklch(0.55 0.15 140)",
    hillFar: "oklch(0.35 0.06 200)",
    hillMid: "oklch(0.38 0.08 180)",
    hillNear: "oklch(0.40 0.10 160)",
    treeSilhouette: "oklch(0.22 0.04 170)",
    treeTrunk: "oklch(0.18 0.03 60)",
    fogA: "oklch(0.78 0.04 200 / 6%)",
    fogB: "oklch(0.75 0.03 180 / 8%)",
    fogC: "oklch(0.72 0.04 160 / 5%)",
    puddle: "oklch(0.35 0.06 240 / 35%)",
    puddleShine: "oklch(0.65 0.06 220 / 30%)",
    rainColor: "oklch(0.82 0.04 240 / 55%)",
    rainFar: "oklch(0.80 0.03 240 / 30%)",
    umbrella: "oklch(0.55 0.18 12)",
    umbrellaHighlight: "oklch(0.62 0.20 12)",
    horizonGlow: "oklch(0.60 0.08 90 / 8%)",
    cloudFill: "oklch(0.28 0.04 260)",
    leafA: "oklch(0.55 0.14 150)",
    leafB: "oklch(0.62 0.16 140)",
    snow: "oklch(0 0 0 / 0%)",
    flowerA: "oklch(0.78 0.16 350)",
    flowerB: "oklch(0.82 0.14 55)",
    grassBlade: "oklch(0.50 0.14 145)",
  },
  summer: {
    skyTop: "oklch(0.18 0.05 250)",
    skyMid: "oklch(0.25 0.05 200)",
    skyBot: "oklch(0.38 0.06 170)",
    grassFar: "oklch(0.38 0.10 150)",
    grassMid: "oklch(0.44 0.12 148)",
    grassNear: "oklch(0.34 0.11 152)",
    grassAccent: "oklch(0.52 0.14 142)",
    hillFar: "oklch(0.30 0.05 200)",
    hillMid: "oklch(0.34 0.07 180)",
    hillNear: "oklch(0.36 0.09 160)",
    treeSilhouette: "oklch(0.20 0.03 175)",
    treeTrunk: "oklch(0.16 0.02 55)",
    fogA: "oklch(0.80 0.06 90 / 5%)",
    fogB: "oklch(0.78 0.05 90 / 7%)",
    fogC: "oklch(0.75 0.04 90 / 4%)",
    puddle: "oklch(0.32 0.05 230 / 30%)",
    puddleShine: "oklch(0.60 0.06 210 / 25%)",
    rainColor: "oklch(0.84 0.03 240 / 50%)",
    rainFar: "oklch(0.82 0.02 240 / 25%)",
    umbrella: "oklch(0.58 0.16 10)",
    umbrellaHighlight: "oklch(0.65 0.18 10)",
    horizonGlow: "oklch(0.70 0.12 80 / 10%)",
    cloudFill: "oklch(0.25 0.03 250)",
    leafA: "oklch(0.45 0.12 152)",
    leafB: "oklch(0.50 0.13 148)",
    snow: "oklch(0 0 0 / 0%)",
    flowerA: "oklch(0.85 0.14 55)",
    flowerB: "oklch(0.80 0.12 100)",
    grassBlade: "oklch(0.46 0.12 148)",
  },
  autumn: {
    skyTop: "oklch(0.20 0.05 270)",
    skyMid: "oklch(0.28 0.06 40)",
    skyBot: "oklch(0.38 0.08 60)",
    grassFar: "oklch(0.42 0.08 80)",
    grassMid: "oklch(0.46 0.10 65)",
    grassNear: "oklch(0.36 0.09 75)",
    grassAccent: "oklch(0.50 0.12 55)",
    hillFar: "oklch(0.32 0.05 50)",
    hillMid: "oklch(0.36 0.07 45)",
    hillNear: "oklch(0.38 0.08 40)",
    treeSilhouette: "oklch(0.20 0.04 50)",
    treeTrunk: "oklch(0.18 0.03 40)",
    fogA: "oklch(0.75 0.05 55 / 7%)",
    fogB: "oklch(0.72 0.04 45 / 9%)",
    fogC: "oklch(0.70 0.04 55 / 6%)",
    puddle: "oklch(0.30 0.04 60 / 30%)",
    puddleShine: "oklch(0.55 0.05 50 / 25%)",
    rainColor: "oklch(0.80 0.04 60 / 50%)",
    rainFar: "oklch(0.78 0.03 60 / 28%)",
    umbrella: "oklch(0.50 0.16 35)",
    umbrellaHighlight: "oklch(0.58 0.18 35)",
    horizonGlow: "oklch(0.60 0.10 55 / 10%)",
    cloudFill: "oklch(0.24 0.04 40)",
    leafA: "oklch(0.55 0.16 40)",
    leafB: "oklch(0.50 0.14 60)",
    snow: "oklch(0 0 0 / 0%)",
    flowerA: "oklch(0 0 0 / 0%)",
    flowerB: "oklch(0 0 0 / 0%)",
    grassBlade: "oklch(0.44 0.10 70)",
  },
  winter: {
    skyTop: "oklch(0.22 0.03 240)",
    skyMid: "oklch(0.28 0.03 230)",
    skyBot: "oklch(0.40 0.04 220)",
    grassFar: "oklch(0.45 0.03 200)",
    grassMid: "oklch(0.50 0.04 200)",
    grassNear: "oklch(0.40 0.03 210)",
    grassAccent: "oklch(0.55 0.04 195)",
    hillFar: "oklch(0.42 0.03 220)",
    hillMid: "oklch(0.46 0.03 215)",
    hillNear: "oklch(0.48 0.04 210)",
    treeSilhouette: "oklch(0.20 0.02 210)",
    treeTrunk: "oklch(0.16 0.02 220)",
    fogA: "oklch(0.80 0.02 220 / 10%)",
    fogB: "oklch(0.78 0.02 220 / 12%)",
    fogC: "oklch(0.75 0.02 220 / 8%)",
    puddle: "oklch(0.55 0.04 210 / 40%)",
    puddleShine: "oklch(0.75 0.03 200 / 30%)",
    rainColor: "oklch(0.88 0.02 240 / 45%)",
    rainFar: "oklch(0.86 0.01 240 / 22%)",
    umbrella: "oklch(0.48 0.14 260)",
    umbrellaHighlight: "oklch(0.55 0.16 260)",
    horizonGlow: "oklch(0.55 0.06 220 / 6%)",
    cloudFill: "oklch(0.30 0.03 240)",
    leafA: "oklch(0.30 0.03 200)",
    leafB: "oklch(0.28 0.02 210)",
    snow: "oklch(0.95 0.01 220)",
    flowerA: "oklch(0 0 0 / 0%)",
    flowerB: "oklch(0 0 0 / 0%)",
    grassBlade: "oklch(0.48 0.04 200)",
  },
};

const BOTTOM_TEXT: Record<Season, string> = {
  spring: "click the meadow to leave a small thought in the rain",
  summer: "click the meadow to leave a thought in the warm rain",
  autumn: "click the meadow to leave a thought among the falling leaves",
  winter: "click the meadow to leave a thought in the snow",
};

/* ── Distant tree line (horizon silhouette) ── */
function TreeLine({ season }: { season: Season }) {
  const c = P[season];
  const winterBare = season === "winter";
  return (
    <div
      className="depth-layer depth-farthest absolute inset-x-0 pointer-events-none"
      style={{ bottom: "52%", height: "18%", animation: "parallax-sway-x 30s ease-in-out infinite" }}
    >
      <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0 90 Q80 60 160 75 Q200 55 240 65 Q310 40 360 55 Q420 35 480 50 Q540 30 600 48 Q660 28 720 42 Q780 25 840 40 Q900 30 960 45 Q1020 35 1080 50 Q1140 40 1200 55 Q1260 45 1320 60 Q1380 50 1440 65 L1440 120 L0 120 Z"
          fill={c.treeSilhouette}
          opacity="0.7"
        />
        {!winterBare && (
          <>
            <ellipse cx="200" cy="45" rx="35" ry="28" fill={c.treeSilhouette} opacity="0.6" />
            <ellipse cx="400" cy="38" rx="40" ry="32" fill={c.treeSilhouette} opacity="0.55" />
            <ellipse cx="600" cy="42" rx="38" ry="30" fill={c.treeSilhouette} opacity="0.6" />
            <ellipse cx="800" cy="35" rx="42" ry="34" fill={c.treeSilhouette} opacity="0.5" />
            <ellipse cx="1000" cy="40" rx="36" ry="28" fill={c.treeSilhouette} opacity="0.55" />
            <ellipse cx="1200" cy="44" rx="34" ry="26" fill={c.treeSilhouette} opacity="0.6" />
          </>
        )}
        {winterBare && (
          <>
            <line x1="200" y1="60" x2="200" y2="38" stroke={c.treeSilhouette} strokeWidth="3" />
            <line x1="200" y1="45" x2="188" y2="35" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="200" y1="48" x2="214" y2="38" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="400" y1="55" x2="400" y2="30" stroke={c.treeSilhouette} strokeWidth="3" />
            <line x1="400" y1="42" x2="386" y2="32" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="400" y1="45" x2="416" y2="34" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="600" y1="58" x2="600" y2="33" stroke={c.treeSilhouette} strokeWidth="3" />
            <line x1="600" y1="44" x2="586" y2="34" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="800" y1="52" x2="800" y2="28" stroke={c.treeSilhouette} strokeWidth="3" />
            <line x1="800" y1="38" x2="788" y2="28" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="800" y1="40" x2="814" y2="30" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="1000" y1="56" x2="1000" y2="32" stroke={c.treeSilhouette} strokeWidth="3" />
            <line x1="1000" y1="42" x2="1014" y2="32" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="1200" y1="60" x2="1200" y2="36" stroke={c.treeSilhouette} strokeWidth="3" />
            <line x1="1200" y1="46" x2="1186" y2="36" stroke={c.treeSilhouette} strokeWidth="2" />
            <line x1="1200" y1="48" x2="1214" y2="38" stroke={c.treeSilhouette} strokeWidth="2" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ── Distant mountains/hills ── */
function Mountains({ season }: { season: Season }) {
  const c = P[season];
  return (
    <div
      className="depth-layer depth-farthest absolute inset-x-0 pointer-events-none"
      style={{ bottom: "55%", height: "22%", animation: "parallax-sway-x 35s ease-in-out infinite" }}
    >
      <svg className="w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path
          d="M0 130 Q200 60 360 90 Q500 30 650 70 Q800 15 950 55 Q1100 20 1250 65 Q1350 45 1440 80 L1440 160 L0 160 Z"
          fill={c.hillFar}
          opacity="0.45"
        />
        <path
          d="M0 145 Q180 80 340 110 Q500 55 660 85 Q820 40 980 75 Q1120 50 1300 90 Q1400 70 1440 95 L1440 160 L0 160 Z"
          fill={c.hillMid}
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

/* ── Cloud shapes ── */
function Clouds({ season }: { season: Season }) {
  const c = P[season];
  const clouds = useMemo(
    () => [
      { x: 8, y: 3, w: 180, h: 40, delay: "0s" },
      { x: 28, y: 5, w: 220, h: 35, delay: "4s" },
      { x: 55, y: 2, w: 160, h: 30, delay: "2s" },
      { x: 75, y: 6, w: 200, h: 38, delay: "6s" },
      { x: 92, y: 4, w: 140, h: 28, delay: "3s" },
    ],
    [],
  );
  return (
    <div className="depth-layer depth-farthest absolute inset-x-0 top-0 pointer-events-none" style={{ height: "18%" }}>
      {clouds.map((cl, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${cl.x}%`,
            top: `${cl.y}%`,
            width: cl.w,
            height: cl.h,
            animation: `parallax-sway-x 40s ease-in-out ${cl.delay} infinite`,
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
            <ellipse cx="100" cy="28" rx="90" ry="18" fill={c.cloudFill} opacity="0.35" />
            <ellipse cx="70" cy="22" rx="55" ry="15" fill={c.cloudFill} opacity="0.3" />
            <ellipse cx="130" cy="24" rx="60" ry="16" fill={c.cloudFill} opacity="0.28" />
            <ellipse cx="100" cy="20" rx="70" ry="12" fill={c.cloudFill} opacity="0.22" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ── Distant horizon light (town/house) ── */
function HorizonLight({ season }: { season: Season }) {
  const c = P[season];
  return (
    <div
      className="depth-layer depth-farthest absolute pointer-events-none"
      style={{
        left: "32%",
        bottom: "55%",
        width: 60,
        height: 40,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 80%, ${c.horizonGlow}, transparent 70%)`,
          animation: "breathe 6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ── 3-layer meadow grass ── */
function MeadowGrass({ season }: { season: Season }) {
  const c = P[season];
  return (
    <>
      {/* Far meadow */}
      <div
        className="depth-layer depth-farthest absolute inset-x-0 bottom-0"
        style={{ height: "46%", animation: "parallax-sway-x 28s ease-in-out infinite" }}
      >
        <svg className="absolute inset-x-0 bottom-0 w-full h-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d="M0 80 Q360 45 720 60 Q1080 40 1440 70 L1440 300 L0 300 Z" fill={c.grassFar} opacity="0.6" />
        </svg>
      </div>

      {/* Mid meadow */}
      <div
        className="depth-layer depth-mid absolute inset-x-0 bottom-0"
        style={{ height: "46%", animation: "parallax-sway-x 22s ease-in-out 2s infinite alternate" }}
      >
        <svg className="absolute inset-x-0 bottom-0 w-full h-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d="M0 95 Q360 55 720 75 Q1080 50 1440 85 L1440 300 L0 300 Z" fill={c.grassMid} opacity="0.7" />
          <path d="M0 140 Q360 110 720 125 Q1080 105 1440 135 L1440 300 L0 300 Z" fill={c.grassNear} opacity="0.65" />
        </svg>
      </div>

      {/* Near meadow */}
      <div className="depth-layer depth-near absolute inset-x-0 bottom-0" style={{ height: "46%" }}>
        <svg className="absolute inset-x-0 bottom-0 w-full h-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d="M0 105 Q360 65 720 85 Q1080 60 1440 95 L1440 300 L0 300 Z" fill={c.grassNear} />
          <path d="M0 170 Q360 130 720 150 Q1080 125 1440 165 L1440 300 L0 300 Z" fill={c.grassAccent} opacity="0.85" />
          <path d="M0 220 Q360 195 720 210 Q1080 190 1440 215 L1440 300 L0 300 Z" fill={c.grassNear} opacity="0.9" />
        </svg>
      </div>
    </>
  );
}

/* ── Wind-blown grass blades ── */
function GrassBlades({ season }: { season: Season }) {
  const c = P[season];
  const blades = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        x: 5 + (i * 3.2 + ((i * 7) % 20)) % 90,
        h: 18 + (i % 5) * 6,
        delay: (i * 0.3) % 4,
        dur: 2.5 + (i % 3) * 0.8,
        lean: (i % 2 === 0 ? 1 : -1) * (6 + (i % 4) * 3),
      })),
    [],
  );
  return (
    <div className="depth-layer depth-near absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "28%" }}>
      {blades.map((b, i) => (
        <svg
          key={i}
          className="absolute"
          width="4"
          height={b.h}
          viewBox={`0 0 4 ${b.h}`}
          style={{
            left: `${b.x}%`,
            bottom: `${8 + (i % 3) * 3}%`,
            transformOrigin: "bottom center",
            ["--lean" as string]: `${b.lean}deg`,
            animation: `grass-sway ${b.dur}s ease-in-out ${b.delay}s infinite alternate`,
          }}
        >
          <line
            x1="2"
            y1={b.h}
            x2="2"
            y2="0"
            stroke={c.grassBlade}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      ))}
    </div>
  );
}

/* ── Puddles with ripples ── */
function Puddles({ season }: { season: Season }) {
  const c = P[season];
  const frozen = season === "winter";
  const spots = useMemo(
    () => [
      { x: 15, y: 82, w: 60, h: 12 },
      { x: 55, y: 85, w: 45, h: 10 },
      { x: 78, y: 80, w: 50, h: 11 },
      { x: 35, y: 88, w: 35, h: 8 },
    ],
    [],
  );
  return (
    <div className="depth-layer depth-near absolute inset-0 pointer-events-none">
      {spots.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.w,
            height: p.h,
          }}
        >
          <svg className="w-full h-full" viewBox={`0 0 ${p.w} ${p.h}`} preserveAspectRatio="none">
            <ellipse
              cx={p.w / 2}
              cy={p.h / 2}
              rx={p.w / 2}
              ry={p.h / 2}
              fill={c.puddle}
              opacity={frozen ? 0.5 : 0.7}
            />
            {!frozen && (
              <ellipse
                cx={p.w / 2}
                cy={p.h / 2 - 1}
                rx={p.w / 3}
                ry={p.h / 4}
                fill={c.puddleShine}
                opacity="0.4"
              />
            )}
            {frozen && (
              <ellipse
                cx={p.w / 2}
                cy={p.h / 2}
                rx={p.w / 2 - 2}
                ry={p.h / 2 - 1}
                fill="none"
                stroke={c.puddleShine}
                strokeWidth="0.5"
                opacity="0.5"
              />
            )}
          </svg>
          {!frozen && (
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${p.w} ${p.h}`}
              preserveAspectRatio="none"
            >
              <ellipse
                cx={p.w / 2}
                cy={p.h / 2}
                rx="4"
                ry="2"
                fill="none"
                stroke={c.puddleShine}
                strokeWidth="0.5"
                opacity="0.3"
              >
                <animate attributeName="rx" values="2;8;2" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="ry" values="1;3;1" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
              </ellipse>
              <ellipse
                cx={p.w * 0.6}
                cy={p.h * 0.4}
                rx="3"
                ry="1.5"
                fill="none"
                stroke={c.puddleShine}
                strokeWidth="0.4"
                opacity="0.25"
              >
                <animate attributeName="rx" values="1;6;1" dur={`${4 + i * 0.3}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="ry" values="0.5;2;0.5" dur={`${4 + i * 0.3}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur={`${4 + i * 0.3}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" />
              </ellipse>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Umbrella with two figures ── */
function UmbrellaWithFigures({ season }: { season: Season }) {
  const c = P[season];
  return (
    <div
      className="depth-layer depth-near absolute left-1/2 bottom-[22%] -translate-x-1/2"
      style={{ animation: "depth-pulse 10s ease-in-out infinite" }}
    >
      <svg width="120" height="130" viewBox="0 0 120 130">
        {/* Umbrella canopy */}
        <path d="M10 52 Q60 -8 110 52 Z" fill={c.umbrella} />
        <path d="M10 52 Q60 18 110 52" fill={c.umbrellaHighlight} opacity="0.5" />
        <path
          d="M10 52 Q20 48 30 52 Q40 48 50 52 Q60 48 70 52 Q80 48 90 52 Q100 48 110 52"
          fill="none"
          stroke={c.umbrella}
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Umbrella handle */}
        <line
          x1="60" y1="52" x2="60" y2="118"
          stroke={c.treeTrunk} strokeWidth="2.5" strokeLinecap="round"
        />
        <path
          d="M60 118 Q68 125 74 118"
          stroke={c.treeTrunk} strokeWidth="2.5" fill="none" strokeLinecap="round"
        />

        {/* Figure 1 - Noah (slightly taller) */}
        <ellipse cx="48" cy="72" rx="6" ry="6.5" fill="oklch(0.18 0.03 60)" opacity="0.85" />
        <rect x="43" y="78" width="10" height="22" rx="4" fill="oklch(0.16 0.03 60)" opacity="0.8" />
        <line x1="48" y1="100" x2="44" y2="118" stroke="oklch(0.16 0.03 60)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="48" y1="100" x2="52" y2="118" stroke="oklch(0.16 0.03 60)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Figure 2 - Khadija (slightly shorter) */}
        <ellipse cx="72" cy="75" rx="5.5" ry="6" fill="oklch(0.16 0.03 280)" opacity="0.85" />
        <path d="M67 80 L77 80 L79 100 L65 100 Z" fill="oklch(0.14 0.04 280)" opacity="0.8" rx="3" />
        <line x1="72" y1="100" x2="68" y2="118" stroke="oklch(0.14 0.04 280)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="72" y1="100" x2="76" y2="118" stroke="oklch(0.14 0.04 280)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ── Rain layers ── */
function RainLayers({ season }: { season: Season }) {
  if (season === "winter") return null;
  const c = P[season];
  const intensity = season === "summer" ? 1.2 : season === "autumn" ? 1.0 : 0.85;
  const farCount = Math.round(70 * intensity);
  const nearCount = Math.round(80 * intensity);

  const farRain = useMemo(
    () =>
      Array.from({ length: farCount }, (_, i) => ({
        left: (i * 0.71) % 100,
        height: 12 + ((i * 1.7) % 20),
        dur: 0.6 + ((i * 0.007) % 0.8),
        delay: (i * 0.01) % 1.2,
        opacity: 0.2 + (i % 5) * 0.06,
      })),
    [farCount],
  );

  const nearRain = useMemo(
    () =>
      Array.from({ length: nearCount }, (_, i) => ({
        left: (i * 0.63) % 100,
        height: 16 + ((i * 1.9) % 28),
        dur: 0.45 + ((i * 0.008) % 0.9),
        delay: (i * 0.012) % 1.0,
        opacity: 0.3 + (i % 4) * 0.1,
      })),
    [nearCount],
  );

  const extraCount = Math.round(35 * intensity);
  const extraRain = useMemo(
    () =>
      Array.from({ length: extraCount }, (_, i) => ({
        left: (i * 1.1) % 100,
        height: 22 + ((i * 2.1) % 18),
        dur: 0.35 + ((i * 0.005) % 0.5),
        delay: (i * 0.008) % 0.8,
        opacity: 0.4 + (i % 3) * 0.12,
      })),
    [extraCount],
  );

  return (
    <>
      {/* Far rain */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden depth-layer depth-farthest"
        style={{ animation: "parallax-sway-x 20s ease-in-out infinite" }}
      >
        {farRain.map((r, i) => (
          <span
            key={i}
            className="absolute w-px"
            style={{
              left: `${r.left}%`,
              top: "-10%",
              height: r.height,
              background: `linear-gradient(180deg, transparent, ${c.rainFar})`,
              animation: `rain-fall ${r.dur + 0.3}s linear infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Mid rain */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden depth-layer depth-mid">
        {nearRain.map((r, i) => (
          <span
            key={i}
            className="absolute w-px"
            style={{
              left: `${r.left}%`,
              top: "-10%",
              height: r.height,
              background: `linear-gradient(180deg, transparent, ${c.rainColor})`,
              animation: `rain-fall ${r.dur}s linear infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Near rain (closest, most visible) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden depth-layer depth-near">
        {extraRain.map((r, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${r.left}%`,
              top: "-10%",
              height: r.height,
              width: 1.5,
              background: `linear-gradient(180deg, transparent, ${c.rainColor})`,
              opacity: r.opacity,
              animation: `rain-fall ${r.dur}s linear infinite`,
              animationDelay: `${r.delay}s`,
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ── Snow layers (winter) ── */
function SnowLayers() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        x: (i * 1.3 + ((i * 11) % 100)) % 100,
        size: 2 + (i % 4) * 0.8,
        dur: 10 + (i % 6) * 2.5,
        del: (i * 0.6) % 12,
        drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 12)),
        opacity: 0.5 + (i % 4) * 0.12,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${f.x}%`,
            top: "-3%",
            width: f.size,
            height: f.size,
            background: "oklch(0.95 0.01 220)",
            opacity: f.opacity,
            animation: `snowfall ${f.dur}s linear ${f.del}s infinite`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Falling leaves (autumn, mixed with rain) ── */
function FallingLeaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: (i * 5.1 + ((i * 13) % 100)) % 100,
        startY: -5 - (i * 3) % 15,
        size: 7 + (i % 4) * 2.5,
        dur: 9 + (i % 5) * 2,
        del: (i * 1.1) % 10,
        hue: [30, 45, 60, 15, 50][(i % 5)],
      })),
    [],
  );
  return (
    <>
      {leaves.map((l, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none"
          width={l.size}
          height={l.size}
          viewBox="0 0 12 12"
          style={{
            left: `${l.x}%`,
            top: `${l.startY}%`,
            animation: `leaf-fall ${l.dur}s ease-in ${l.del}s infinite`,
          }}
        >
          <path
            d="M 6 0 C 9 3, 11 6, 9 10 C 8 11, 6 12, 6 12 C 6 12, 4 11, 3 10 C 1 6, 3 3, 6 0 Z"
            fill={`oklch(0.55 0.16 ${l.hue})`}
            opacity="0.75"
          />
        </svg>
      ))}
    </>
  );
}

/* ── Spring flowers in grass ── */
function MeadowFlowers({ season }: { season: Season }) {
  const c = P[season];
  if (season !== "spring" && season !== "summer") return null;
  const positions = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: 8 + (i * 6.5 + ((i * 11) % 15)) % 84,
        y: 78 + (i % 4) * 3,
        scale: 0.4 + (i % 3) * 0.15,
        color: i % 2 === 0 ? c.flowerA : c.flowerB,
        delay: (i * 0.4) % 3,
      })),
    [c.flowerA, c.flowerB],
  );
  return (
    <>
      {positions.map((p, i) => (
        <div
          key={i}
          className="depth-layer depth-near absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `scale(${p.scale})`,
            animation: `breathe ${3 + p.delay}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="6"
                cy="3"
                rx="2"
                ry="2.5"
                fill={p.color}
                opacity="0.75"
                transform={`rotate(${angle} 6 6)`}
              />
            ))}
            <circle cx="6" cy="6" r="1.2" fill="oklch(0.90 0.12 85)" />
          </svg>
        </div>
      ))}
    </>
  );
}

/* ── Butterflies (summer) ── */
function Butterflies({ season }: { season: Season }) {
  if (season !== "summer") return null;
  const bugs = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        startX: 15 + i * 20,
        y: 30 + (i * 8) % 25,
        dur: 12 + (i % 3) * 3,
        del: i * 2.5,
        scale: 0.5 + (i % 2) * 0.2,
        color: i % 2 === 0 ? "oklch(0.85 0.14 55)" : "oklch(0.80 0.16 280)",
      })),
    [],
  );
  return (
    <>
      {bugs.map((b, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none"
          width="16"
          height="12"
          viewBox="0 0 16 12"
          style={{
            left: `${b.startX}%`,
            top: `${b.y}%`,
            transform: `scale(${b.scale})`,
            animation: `butterfly-fly ${b.dur}s ease-in-out ${b.del}s infinite`,
          }}
        >
          <ellipse cx="5" cy="5" rx="4" ry="3" fill={b.color} opacity="0.7">
            <animate attributeName="ry" values="3;1;3" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="11" cy="5" rx="4" ry="3" fill={b.color} opacity="0.7">
            <animate attributeName="ry" values="3;1;3" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          <line x1="8" y1="3" x2="8" y2="10" stroke="oklch(0.2 0.02 60)" strokeWidth="0.8" />
        </svg>
      ))}
    </>
  );
}

/* ── Birds (spring/summer/autumn) ── */
function Birds({ season }: { season: Season }) {
  if (season === "winter") return null;
  const count = season === "autumn" ? 3 : 4;
  const birds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        startX: -10 - i * 18,
        y: 6 + (i * 5) % 16,
        dur: 16 + (i % 3) * 4,
        del: i * 3,
        scale: 0.4 + (i % 3) * 0.15,
        flipDur: 0.4 + (i % 2) * 0.15,
      })),
    [count],
  );
  return (
    <>
      {birds.map((b, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none depth-layer depth-farthest"
          width="18"
          height="7"
          viewBox="0 0 20 8"
          style={{
            left: `${b.startX}%`,
            top: `${b.y}%`,
            transform: `scale(${b.scale})`,
            animation: `bird-fly ${b.dur}s linear ${b.del}s infinite`,
          }}
        >
          <path
            d="M 0 4 Q 5 0 10 4 Q 15 0 20 4"
            fill="none"
            stroke="oklch(0.15 0.02 260)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              values="M 0 4 Q 5 0 10 4 Q 15 0 20 4;M 0 4 Q 5 7 10 4 Q 15 7 20 4;M 0 4 Q 5 0 10 4 Q 15 0 20 4"
              dur={`${b.flipDur}s`}
              repeatCount="indefinite"
            />
          </path>
        </svg>
      ))}
    </>
  );
}

/* ── Fog layers ── */
function FogLayers({ season }: { season: Season }) {
  const c = P[season];
  return (
    <>
      <div
        className="depth-layer depth-farthest absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, ${c.fogA} 0%, transparent 30%, ${c.fogA} 100%)`,
          animation: "parallax-sway-x 28s ease-in-out infinite",
        }}
      />
      <div
        className="depth-layer depth-mid absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(15deg, transparent 25%, ${c.fogB} 55%, transparent 80%)`,
          animation: "parallax-sway-x 22s ease-in-out 3s infinite alternate",
          opacity: 0.7,
        }}
      />
      <div
        className="depth-layer depth-near absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(350deg, transparent 40%, ${c.fogC} 75%, transparent 95%)`,
          animation: "parallax-sway-x 18s ease-in-out 6s infinite alternate",
          opacity: 0.45,
        }}
      />
    </>
  );
}

/* ── Thunder flashes ── */
function ThunderFlash() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.95 0.02 240 / 12%) 0%, oklch(0.90 0.02 240 / 6%) 30%, transparent 50%)",
        animation: "thunder-flash 8s ease-in-out infinite",
        opacity: 0,
      }}
    />
  );
}

/* ── Memory leaves (season-aware) ── */
function MemoryLeaves({
  items,
  season,
  onView,
}: {
  items: Memory[];
  season: Season;
  onView: (m: Memory) => void;
}) {
  const leafEmojis: Record<Season, string> = {
    spring: "🌿",
    summer: "🍃",
    autumn: "🍂",
    winter: "❄️",
  };
  const glowColors: Record<Season, string> = {
    spring: "0 0 8px oklch(0.6 0.1 155 / 40%)",
    summer: "0 0 8px oklch(0.6 0.1 140 / 40%)",
    autumn: "0 0 8px oklch(0.6 0.12 45 / 40%)",
    winter: "0 0 10px oklch(0.8 0.04 220 / 50%)",
  };

  return (
    <>
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
            style={{ filter: `drop-shadow(${glowColors[season]})` }}
          >
            {leafEmojis[season]}
          </span>
          <span className="absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}
    </>
  );
}

/* ═══════════════════════ Main component ═══════════════════════ */
export function MeadowScene({ season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("meadow");
  const c = P[season];
  const isWinter = season === "winter";

  return (
    <div
      className="scene scene-container scene-3d"
      style={{
        background: `linear-gradient(180deg, ${c.skyTop} 0%, ${c.skyMid} 45%, ${c.skyBot} 100%)`,
      }}
    >
      {/* Clouds */}
      <Clouds season={season} />

      {/* Distant mountains */}
      <Mountains season={season} />

      {/* Distant horizon light */}
      <HorizonLight season={season} />

      {/* Fog layers (behind tree line) */}
      <FogLayers season={season} />

      {/* Tree line silhouette */}
      <TreeLine season={season} />

      {/* Atmospheric radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, oklch(0.5 0.04 240 / 6%), transparent 60%)`,
        }}
      />

      {/* Thunder flash */}
      <ThunderFlash />

      {/* Rain layers (or snow) */}
      {isWinter ? <SnowLayers /> : <RainLayers season={season} />}

      {/* Falling leaves (autumn) */}
      {season === "autumn" && <FallingLeaves />}

      {/* Meadow grass (3 layers) */}
      <MeadowGrass season={season} />

      {/* Puddles */}
      <Puddles season={season} />

      {/* Grass blades with wind */}
      <GrassBlades season={season} />

      {/* Flowers in grass */}
      <MeadowFlowers season={season} />

      {/* Butterflies */}
      <Butterflies season={season} />

      {/* Birds */}
      <Birds season={season} />

      {/* Umbrella with two figures */}
      <UmbrellaWithFigures season={season} />

      {/* Memory leaves */}
      <MemoryLeaves items={items} season={season} onView={onView} />

      {/* Click meadow */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({
            x: (e.clientX - r.left) / r.width,
            y: (e.clientY - r.top) / r.height,
          });
        }}
        className="absolute inset-x-0 bottom-0 top-[35%] cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/80 drop-shadow-lg">
        {BOTTOM_TEXT[season]}
      </p>
    </div>
  );
}
