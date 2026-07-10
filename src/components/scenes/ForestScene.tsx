import { useMemo } from "react";
import { useMemories, type Memory } from "@/components/world/memories";
import { type Season } from "@/hooks/useSeason";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

/* ── colour helpers ── */
const seasonColors: Record<
  Season,
  {
    skyTop: string;
    skyMid: string;
    skyBot: string;
    canopy: string;
    canopyLight: string;
    trunk: string;
    ground: string;
    groundAccent: string;
    fogNear: string;
    fogMid: string;
    fogFar: string;
    pathFill: string;
    pathEdge: string;
    water: string;
    waterHighlight: string;
    sunBeam: string;
    flowerA: string;
    flowerB: string;
    snow: string;
    mushroomA: string;
    mushroomB: string;
    mushroomC: string;
  }
> = {
  spring: {
    skyTop: "oklch(0.22 0.08 210)",
    skyMid: "oklch(0.16 0.07 180)",
    skyBot: "oklch(0.10 0.05 160)",
    canopy: "oklch(0.35 0.14 155)",
    canopyLight: "oklch(0.45 0.16 140)",
    trunk: "oklch(0.22 0.04 350)",
    ground: "oklch(0.18 0.06 155)",
    groundAccent: "oklch(0.25 0.08 130)",
    fogNear: "oklch(0.80 0.06 155 / 8%)",
    fogMid: "oklch(0.75 0.05 170 / 10%)",
    fogFar: "oklch(0.70 0.04 180 / 6%)",
    pathFill: "oklch(0.28 0.04 60)",
    pathEdge: "oklch(0.22 0.03 50)",
    water: "oklch(0.55 0.08 220)",
    waterHighlight: "oklch(0.70 0.06 210 / 50%)",
    sunBeam: "oklch(0.92 0.10 95 / 10%)",
    flowerA: "oklch(0.75 0.16 330)",
    flowerB: "oklch(0.80 0.14 60)",
    snow: "oklch(0 0 0 / 0%)",
    mushroomA: "oklch(0.85 0.12 25)",
    mushroomB: "oklch(0.80 0.14 340)",
    mushroomC: "oklch(0.70 0.10 155)",
  },
  summer: {
    skyTop: "oklch(0.15 0.04 200)",
    skyMid: "oklch(0.10 0.04 175)",
    skyBot: "oklch(0.07 0.03 160)",
    canopy: "oklch(0.30 0.12 150)",
    canopyLight: "oklch(0.40 0.14 145)",
    trunk: "oklch(0.18 0.03 350)",
    ground: "oklch(0.14 0.05 150)",
    groundAccent: "oklch(0.20 0.06 140)",
    fogNear: "oklch(0.80 0.06 95 / 6%)",
    fogMid: "oklch(0.75 0.05 95 / 8%)",
    fogFar: "oklch(0.70 0.04 95 / 5%)",
    pathFill: "oklch(0.24 0.03 55)",
    pathEdge: "oklch(0.20 0.02 50)",
    water: "oklch(0.50 0.08 225)",
    waterHighlight: "oklch(0.65 0.06 215 / 50%)",
    sunBeam: "oklch(0.95 0.12 85 / 12%)",
    flowerA: "oklch(0.70 0.14 130)",
    flowerB: "oklch(0.80 0.10 90)",
    snow: "oklch(0 0 0 / 0%)",
    mushroomA: "oklch(0.80 0.14 20)",
    mushroomB: "oklch(0.75 0.12 330)",
    mushroomC: "oklch(0.60 0.10 145)",
  },
  autumn: {
    skyTop: "oklch(0.18 0.06 260)",
    skyMid: "oklch(0.14 0.06 40)",
    skyBot: "oklch(0.10 0.05 50)",
    canopy: "oklch(0.42 0.16 55)",
    canopyLight: "oklch(0.55 0.18 75)",
    trunk: "oklch(0.20 0.04 45)",
    ground: "oklch(0.16 0.05 50)",
    groundAccent: "oklch(0.22 0.07 35)",
    fogNear: "oklch(0.80 0.06 55 / 8%)",
    fogMid: "oklch(0.75 0.05 45 / 10%)",
    fogFar: "oklch(0.70 0.04 55 / 6%)",
    pathFill: "oklch(0.26 0.04 40)",
    pathEdge: "oklch(0.22 0.03 35)",
    water: "oklch(0.45 0.06 230)",
    waterHighlight: "oklch(0.60 0.05 220 / 50%)",
    sunBeam: "oklch(0.90 0.12 75 / 10%)",
    flowerA: "oklch(0.65 0.14 30)",
    flowerB: "oklch(0.70 0.12 60)",
    snow: "oklch(0 0 0 / 0%)",
    mushroomA: "oklch(0.85 0.10 35)",
    mushroomB: "oklch(0.75 0.12 50)",
    mushroomC: "oklch(0.55 0.08 140)",
  },
  winter: {
    skyTop: "oklch(0.20 0.03 230)",
    skyMid: "oklch(0.15 0.02 220)",
    skyBot: "oklch(0.12 0.02 210)",
    canopy: "oklch(0.18 0.02 200)",
    canopyLight: "oklch(0.22 0.03 190)",
    trunk: "oklch(0.16 0.02 260)",
    ground: "oklch(0.82 0.02 220)",
    groundAccent: "oklch(0.78 0.03 215)",
    fogNear: "oklch(0.85 0.02 220 / 12%)",
    fogMid: "oklch(0.80 0.02 220 / 14%)",
    fogFar: "oklch(0.75 0.02 220 / 10%)",
    pathFill: "oklch(0.72 0.02 210)",
    pathEdge: "oklch(0.68 0.02 205)",
    water: "oklch(0.40 0.06 235)",
    waterHighlight: "oklch(0.55 0.04 225 / 40%)",
    sunBeam: "oklch(0.85 0.04 210 / 8%)",
    flowerA: "oklch(0 0 0 / 0%)",
    flowerB: "oklch(0 0 0 / 0%)",
    snow: "oklch(0.95 0.01 220)",
    mushroomA: "oklch(0.20 0.03 200)",
    mushroomB: "oklch(0.18 0.02 210)",
    mushroomC: "oklch(0.16 0.02 190)",
  },
};

/* ── Tree variant ── */
function Tree({
  x,
  scale,
  depth,
  season,
  variant,
}: {
  x: number;
  scale: number;
  depth: number;
  season: Season;
  variant: number;
}) {
  const c = seasonColors[season];
  const trunkDark = season === "winter" ? 0.14 : 0.06 + depth * 0.04;

  if (season === "winter") {
    return (
      <div
        className="absolute bottom-0"
        style={{
          left: `${x * 100}%`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "bottom",
        }}
      >
        <svg width="160" height="360" viewBox="0 0 160 360">
          <rect
            x="74"
            y="200"
            width="12"
            height="160"
            fill={c.trunk}
            rx="3"
          />
          {variant % 3 === 0 && (
            <>
              <line x1="80" y1="220" x2="50" y2="170" stroke={c.trunk} strokeWidth="4" strokeLinecap="round" />
              <line x1="80" y1="260" x2="110" y2="210" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="300" x2="55" y2="270" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {variant % 3 === 1 && (
            <>
              <line x1="80" y1="210" x2="115" y2="155" stroke={c.trunk} strokeWidth="4" strokeLinecap="round" />
              <line x1="80" y1="250" x2="48" y2="200" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="290" x2="105" y2="260" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {variant % 3 === 2 && (
            <>
              <line x1="80" y1="200" x2="42" y2="140" stroke={c.trunk} strokeWidth="4" strokeLinecap="round" />
              <line x1="80" y1="240" x2="118" y2="185" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="280" x2="52" y2="245" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          <circle cx="80" cy="120" r="55" fill={c.canopy} opacity="0.6" />
          <circle cx="60" cy="145" r="40" fill={c.canopyLight} opacity="0.3" />
          <circle cx="100" cy="140" r="38" fill={c.canopy} opacity="0.4" />
        </svg>
      </div>
    );
  }

  if (variant % 3 === 1) {
    return (
      <div
        className="absolute bottom-0"
        style={{
          left: `${x * 100}%`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "bottom",
        }}
      >
        <svg width="200" height="400" viewBox="0 0 200 400">
          <rect x="92" y="240" width="16" height="160" fill={c.trunk} rx="3" />
          <polygon points="100,40 40,200 160,200" fill={c.canopy} />
          <polygon points="100,80 55,195 145,195" fill={c.canopyLight} opacity="0.7" />
          <polygon points="100,120 65,190 135,190" fill={c.canopy} opacity="0.5" />
          <polygon points="100,60 48,185 152,185" fill={c.canopyLight} opacity="0.3" />
        </svg>
      </div>
    );
  }

  if (variant % 3 === 2) {
    return (
      <div
        className="absolute bottom-0"
        style={{
          left: `${x * 100}%`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "bottom",
        }}
      >
        <svg width="170" height="370" viewBox="0 0 170 370">
          <rect x="79" y="210" width="12" height="160" fill={c.trunk} rx="2" />
          <rect x="70" y="210" width="8" height="40" fill={c.trunk} rx="2" transform="rotate(-35 74 210)" />
          <rect x="92" y="220" width="8" height="35" fill={c.trunk} rx="2" transform="rotate(30 96 220)" />
          <ellipse cx="85" cy="130" rx="65" ry="100" fill={c.canopy} />
          <ellipse cx="60" cy="165" rx="48" ry="80" fill={c.canopyLight} opacity="0.6" />
          <ellipse cx="110" cy="160" rx="50" ry="85" fill={c.canopy} opacity="0.7" />
          <ellipse cx="85" cy="105" rx="35" ry="55" fill={c.canopyLight} opacity="0.5" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="absolute bottom-0"
      style={{
        left: `${x * 100}%`,
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: "bottom",
      }}
    >
      <svg width="180" height="380" viewBox="0 0 180 380">
        <rect x="82" y="230" width="16" height="150" fill={c.trunk} rx="3" />
        <ellipse cx="90" cy="145" rx="82" ry="135" fill={c.canopy} />
        <ellipse cx="58" cy="185" rx="58" ry="105" fill={c.canopyLight} opacity="0.6" />
        <ellipse cx="122" cy="185" rx="58" ry="105" fill={c.canopyLight} opacity="0.6" />
        <ellipse cx="90" cy="120" rx="45" ry="70" fill={c.canopy} opacity="0.7" />
      </svg>
    </div>
  );
}

/* ── Forest path (SVG) ── */
function ForestPath({ season }: { season: Season }) {
  const c = seasonColors[season];
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      height="55%"
      viewBox="0 0 1000 550"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.pathFill} stopOpacity="0" />
          <stop offset="30%" stopColor={c.pathFill} stopOpacity="0.4" />
          <stop offset="100%" stopColor={c.pathFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M 480 0 C 460 80, 420 140, 440 220 S 520 350, 500 430 S 460 500, 490 550"
        fill="none"
        stroke={c.pathEdge}
        strokeWidth="42"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 480 0 C 460 80, 420 140, 440 220 S 520 350, 500 430 S 460 500, 490 550"
        fill="none"
        stroke="url(#pathGrad)"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <path
        d="M 480 0 C 460 80, 420 140, 440 220 S 520 350, 500 430 S 460 500, 490 550"
        fill="none"
        stroke={c.pathFill}
        strokeWidth="2"
        strokeDasharray="4 12"
        opacity="0.25"
      />
    </svg>
  );
}

/* ── Stream ── */
function Stream({ season }: { season: Season }) {
  const c = seasonColors[season];
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      height="40%"
      viewBox="0 0 1000 400"
      preserveAspectRatio="none"
      style={{ opacity: 0.7 }}
    >
      <defs>
        <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.water} stopOpacity="0" />
          <stop offset="20%" stopColor={c.water} stopOpacity="0.6" />
          <stop offset="50%" stopColor={c.waterHighlight} stopOpacity="0.4" />
          <stop offset="80%" stopColor={c.water} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.water} stopOpacity="0" />
        </linearGradient>
        <filter id="streamRipple">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.08"
            numOctaves="3"
            seed="42"
          >
            <animate
              attributeName="baseFrequency"
              values="0.015 0.08;0.02 0.10;0.015 0.08"
              dur="8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="6" />
        </filter>
      </defs>
      <path
        d="M 380 0 C 400 60, 440 100, 430 160 S 380 250, 400 320 S 430 380, 420 400"
        fill="none"
        stroke="url(#streamGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        filter="url(#streamRipple)"
      />
      <path
        d="M 383 10 C 403 65, 442 105, 432 162 S 383 252, 403 322 S 432 382, 422 400"
        fill="none"
        stroke={c.waterHighlight}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      >
        <animate
          attributeName="d"
          values="M 383 10 C 403 65, 442 105, 432 162 S 383 252, 403 322 S 432 382, 422 400;M 385 10 C 400 65, 438 105, 428 162 S 380 252, 405 322 S 434 382, 425 400;M 383 10 C 403 65, 442 105, 432 162 S 383 252, 403 322 S 432 382, 422 400"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>
      <circle cx="390" cy="140" r="2" fill={c.waterHighlight} opacity="0.4">
        <animate attributeName="cx" values="388;395;388" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="415" cy="240" r="1.5" fill={c.waterHighlight} opacity="0.3">
        <animate attributeName="cx" values="413;420;413" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ── Sunlight beams ── */
function SunBeams({ season }: { season: Season }) {
  const c = seasonColors[season];
  if (season === "winter") return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.8 }}>
      {[
        { left: "15%", top: "0%", rotate: "28deg", width: "80px", height: "70%", delay: "0s" },
        { left: "35%", top: "-5%", rotate: "22deg", width: "60px", height: "65%", delay: "2s" },
        { left: "55%", top: "0%", rotate: "32deg", width: "90px", height: "75%", delay: "4s" },
        { left: "72%", top: "-3%", rotate: "25deg", width: "50px", height: "60%", delay: "1s" },
        { left: "88%", top: "0%", rotate: "30deg", width: "70px", height: "70%", delay: "3s" },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: b.left,
            top: b.top,
            width: b.width,
            height: b.height,
            transform: `rotate(${b.rotate})`,
            transformOrigin: "top center",
            background: `linear-gradient(180deg, ${c.sunBeam} 0%, transparent 100%)`,
            opacity: 0.4 + (i % 3) * 0.15,
            animation: `sunbeam-shift 12s ease-in-out ${b.delay} infinite alternate`,
            borderRadius: "0 0 50% 50%",
          }}
        />
      ))}
    </div>
  );
}

/* ── Mushrooms ── */
function Mushrooms({ season }: { season: Season }) {
  const c = seasonColors[season];
  const positions = [
    { x: 8, y: 88, s: 0.6 },
    { x: 22, y: 90, s: 0.45 },
    { x: 78, y: 87, s: 0.5 },
    { x: 91, y: 89, s: 0.4 },
    { x: 45, y: 92, s: 0.35 },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `scale(${p.s})`,
            transformOrigin: "bottom center",
          }}
        >
          <svg width="24" height="28" viewBox="0 0 24 28">
            <rect x="10" y="16" width="4" height="12" rx="1.5" fill={c.mushroomC} />
            <ellipse
              cx="12"
              cy="14"
              rx="11"
              ry="10"
              fill={i % 3 === 0 ? c.mushroomA : i % 3 === 1 ? c.mushroomB : c.mushroomC}
            />
            <ellipse cx="8" cy="12" rx="2" ry="1.5" fill="oklch(1 0 0 / 15%)" />
            <ellipse cx="15" cy="11" rx="1.5" ry="1" fill="oklch(1 0 0 / 12%)" />
          </svg>
        </div>
      ))}
    </>
  );
}

/* ── Falling leaves (autumn) ── */
function FallingLeaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: (i * 6.3 + ((i * 17) % 100)) % 100,
        startY: -5 - (i * 4) % 20,
        size: 6 + (i % 4) * 3,
        dur: 8 + (i % 5) * 2,
        del: (i * 1.3) % 10,
        hue: [30, 45, 60, 15, 50][(i % 5)],
        rot: 360 + (i % 3) * 180,
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

/* ── Flowers (spring) ── */
function Flowers({ season }: { season: Season }) {
  const c = seasonColors[season];
  if (season !== "spring" && season !== "summer") return null;
  const positions = [
    { x: 12, y: 91, color: c.flowerA },
    { x: 28, y: 93, color: c.flowerB },
    { x: 65, y: 92, color: c.flowerA },
    { x: 82, y: 90, color: c.flowerB },
    { x: 38, y: 94, color: c.flowerA },
    { x: 55, y: 93, color: c.flowerB },
    { x: 73, y: 91, color: c.flowerA },
    { x: 18, y: 95, color: c.flowerB },
    { x: 88, y: 93, color: c.flowerA },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `scale(${0.5 + (i % 3) * 0.15})`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="7"
                cy="3"
                rx="2.5"
                ry="3"
                fill={p.color}
                opacity="0.8"
                transform={`rotate(${angle} 7 7)`}
              />
            ))}
            <circle cx="7" cy="7" r="1.5" fill="oklch(0.90 0.12 85)" />
          </svg>
        </div>
      ))}
    </>
  );
}

/* ── Snow (winter) ── */
function Snow({ season }: { season: Season }) {
  if (season !== "winter") return null;
  const flakes = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => ({
        x: (i * 2.4 + ((i * 13) % 100)) % 100,
        size: 2 + (i % 4),
        dur: 10 + (i % 6) * 2,
        del: (i * 0.8) % 12,
        drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 15)),
      })),
    [],
  );
  return (
    <>
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
            opacity: 0.7 + (i % 3) * 0.1,
            animation: `snowfall ${f.dur}s linear ${f.del}s infinite`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </>
  );
}

/* ── Birds ── */
function Birds({ season }: { season: Season }) {
  if (season === "winter") return null;
  const count = season === "autumn" ? 3 : 5;
  const birds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        startX: -10 - i * 15,
        y: 8 + (i * 6) % 20,
        dur: 14 + (i % 3) * 4,
        del: i * 3.5,
        scale: 0.5 + (i % 3) * 0.2,
        flipDur: 0.4 + (i % 2) * 0.15,
      })),
    [count],
  );
  return (
    <>
      {birds.map((b, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none"
          width="20"
          height="8"
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

/* ── Ground-level mist ── */
function GroundMist({ season }: { season: Season }) {
  const c = seasonColors[season];
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "35%" }}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(0deg, ${c.fogNear} 0%, transparent 100%)`,
          animation: "parallax-sway-x 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(20deg, transparent 20%, ${c.fogNear} 50%, transparent 80%)`,
          animation: "parallax-sway-x 30s ease-in-out 3s infinite alternate",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

/* ── tree layout data ── */
const TREE_LAYOUT: { x: number; scale: number; depth: number; variant: number }[] = [
  { x: 0.04, scale: 0.45, depth: 5, variant: 0 },
  { x: 0.12, scale: 0.6, depth: 4, variant: 1 },
  { x: 0.22, scale: 0.7, depth: 4, variant: 2 },
  { x: 0.32, scale: 0.8, depth: 3, variant: 0 },
  { x: 0.45, scale: 0.95, depth: 3, variant: 1 },
  { x: 0.58, scale: 1.0, depth: 2, variant: 2 },
  { x: 0.7, scale: 0.92, depth: 3, variant: 0 },
  { x: 0.8, scale: 0.85, depth: 3, variant: 1 },
  { x: 0.9, scale: 0.72, depth: 4, variant: 2 },
  { x: 0.96, scale: 0.5, depth: 5, variant: 0 },
];

/* ═══════════════════════ Main component ═══════════════════════ */
export function ForestScene({ season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("forest");
  const c = seasonColors[season];

  const fireflyCount = season === "winter" ? 10 : season === "summer" ? 45 : 35;
  const fireflies = useMemo(
    () =>
      Array.from({ length: fireflyCount }, (_, i) => ({
        x: (i * 2.8 + ((i * 11) % 100)) % 100,
        y: 25 + ((i * 4.3 + ((i * 7) % 60)) % 65),
        d: 4 + ((i * 3) % 8),
        del: (i * 0.7) % 6,
        size: 1.2 + (i % 3) * 0.4,
        color:
          i % 4 === 0
            ? "oklch(0.95 0.16 15)"
            : i % 4 === 1
              ? "oklch(0.90 0.14 55)"
              : i % 4 === 2
                ? "oklch(0.92 0.12 100)"
                : "oklch(0.88 0.15 80)",
        glow:
          i % 4 === 0
            ? "0 0 12px oklch(0.95 0.16 15), 0 0 28px oklch(0.90 0.14 15 / 60%)"
            : i % 4 === 1
              ? "0 0 12px oklch(0.90 0.14 55), 0 0 28px oklch(0.85 0.12 55 / 60%)"
              : i % 4 === 2
                ? "0 0 12px oklch(0.92 0.12 100), 0 0 28px oklch(0.88 0.10 100 / 60%)"
                : "0 0 12px oklch(0.88 0.15 80), 0 0 28px oklch(0.84 0.12 80 / 60%)",
      })),
    [fireflyCount],
  );

  return (
    <div
      className="scene scene-container scene-3d"
      style={{
        background: `linear-gradient(180deg, ${c.skyTop} 0%, ${c.skyMid} 50%, ${c.skyBot} 100%)`,
      }}
    >
      {/* ── Canopy (background) ── */}
      <div className="depth-layer depth-farthest absolute inset-0">
        <svg className="absolute top-0 left-0 w-full" height="35%" viewBox="0 0 1000 350" preserveAspectRatio="none">
          <ellipse cx="150" cy="100" rx="180" ry="120" fill={c.canopy} opacity="0.5" />
          <ellipse cx="400" cy="80" rx="200" ry="130" fill={c.canopyLight} opacity="0.35" />
          <ellipse cx="650" cy="90" rx="170" ry="115" fill={c.canopy} opacity="0.45" />
          <ellipse cx="880" cy="100" rx="190" ry="125" fill={c.canopyLight} opacity="0.3" />
          <ellipse cx="250" cy="140" rx="140" ry="90" fill={c.canopy} opacity="0.25" />
          <ellipse cx="520" cy="130" rx="160" ry="100" fill={c.canopy} opacity="0.2" />
          <ellipse cx="760" cy="150" rx="130" ry="80" fill={c.canopyLight} opacity="0.2" />
        </svg>
      </div>

      {/* ── Atmospheric fog layer (far) ── */}
      <div
        className="depth-layer depth-farthest absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, ${c.fogFar} 0%, transparent 40%, ${c.fogFar} 100%)`,
          animation: "parallax-sway-x 28s ease-in-out infinite",
        }}
      />

      {/* ── Sunlight beams ── */}
      <SunBeams season={season} />

      {/* ── Falling leaves (autumn) ── */}
      {season === "autumn" && <FallingLeaves />}

      {/* ── Snow (winter) ── */}
      <Snow season={season} />

      {/* ── Far background trees ── */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{ animation: "parallax-sway-x 30s ease-in-out infinite" }}
      >
        {TREE_LAYOUT.filter((t) => t.depth >= 4).map((t, i) => (
          <Tree key={i} x={t.x} scale={t.scale * 0.7} depth={t.depth} season={season} variant={t.variant} />
        ))}
      </div>

      {/* ── Fog layer (mid) ── */}
      <div
        className="depth-layer depth-mid absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(10deg, transparent 30%, ${c.fogMid} 60%, transparent 85%)`,
          animation: "parallax-sway-x 22s ease-in-out 2s infinite alternate",
        }}
      />

      {/* ── Stream ── */}
      <Stream season={season} />

      {/* ── Forest path ── */}
      <ForestPath season={season} />

      {/* ── Mid trees ── */}
      <div
        className="depth-layer depth-mid absolute inset-0"
        style={{ animation: "parallax-sway-x 22s ease-in-out infinite reverse" }}
      >
        {TREE_LAYOUT.filter((t) => t.depth === 3).map((t, i) => (
          <Tree key={i} x={t.x} scale={t.scale * 0.85} depth={t.depth} season={season} variant={t.variant} />
        ))}
      </div>

      {/* ── Flowers (spring/summer) ── */}
      <Flowers season={season} />

      {/* ── Mushrooms ── */}
      <Mushrooms season={season} />

      {/* ── Ground mist (near) ── */}
      <GroundMist season={season} />

      {/* ── Foreground trees ── */}
      <div className="depth-layer depth-near absolute inset-0">
        {TREE_LAYOUT.filter((t) => t.depth <= 2).map((t, i) => (
          <Tree key={i} x={t.x} scale={t.scale} depth={t.depth} season={season} variant={t.variant} />
        ))}
      </div>

      {/* ── Birds ── */}
      <Birds season={season} />

      {/* ── Fireflies ── */}
      <div className="depth-layer depth-near absolute inset-0 pointer-events-none">
        {fireflies.map((f, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: f.size,
              height: f.size,
              background: f.color,
              boxShadow: f.glow,
              animation: `firefly ${f.d}s ease-in-out ${f.del}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Fog layer (near, ground) ── */}
      <div
        className="depth-layer depth-near absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(350deg, transparent 50%, ${c.fogNear} 80%, transparent 95%)`,
          animation: "parallax-sway-x 18s ease-in-out 5s infinite alternate",
          opacity: 0.5,
        }}
      />

      {/* ── Memory glows ── */}
      {items.map((m) => (
        <button
          key={m.id}
          onClick={() => onView(m)}
          title={m.title}
          className="depth-layer depth-near group absolute"
          style={{
            left: `${(m.x ?? 0.5) * 100}%`,
            top: `${(m.y ?? 0.6) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            className="block h-8 w-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.9 0.14 15 / 85%), oklch(0.85 0.12 25 / 40%) 40%, oklch(0.90 0.10 50 / 10%) 65%, transparent 80%)",
              animation: "breathe 3s ease-in-out infinite",
              boxShadow:
                "0 0 18px oklch(0.9 0.14 15 / 50%), 0 0 40px oklch(0.90 0.10 50 / 25%), 0 0 60px oklch(0.85 0.08 80 / 10%)",
            }}
          />
          <span className="absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}

      {/* ── Click layer ── */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({
            x: (e.clientX - r.left) / r.width,
            y: (e.clientY - r.top) / r.height,
          });
        }}
        className="absolute inset-0 cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        click anywhere to hide a memory among the trees
      </p>
    </div>
  );
}
