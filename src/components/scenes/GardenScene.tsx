import { useMemo } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";
import { SEASON_PALETTE, type Season } from "@/hooks/useSeason";
import { SceneModelOverlay, OutdoorCouchModel, PolytreeModel } from "@/components/models";

type Props = {
  phase: TimePhase;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
  season?: Season;
};

const FLOWER_HUES: Record<Season, [number, number]> = {
  spring: [330, 360],
  summer: [0, 30],
  autumn: [20, 50],
  winter: [200, 240],
};

const FLOWER_PETAL_COUNTS = [5, 6, 7];

function Flower({
  hue,
  season,
  title,
  delay,
}: {
  hue: number;
  season: Season;
  title: string;
  delay: number;
}) {
  const pal = SEASON_PALETTE[season];
  const petalCount = FLOWER_PETAL_COUNTS[hue % 3];
  const petalSize = season === "winter" ? 3.5 : 5;
  const centerR = season === "winter" ? 3 : 4;

  return (
    <svg
      width="44"
      height="56"
      viewBox="0 0 44 56"
      className="drop-shadow-lg"
      style={{
        animation: `flower-grow 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}s both, sway 4s ease-in-out ${delay}s infinite`,
        transformOrigin: "22px 56px",
      }}
    >
      {/* stem */}
      <line
        x1="22"
        y1="56"
        x2="22"
        y2="26"
        stroke={pal.grass}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={`M22 40 Q30 36 27 31`}
        stroke={pal.grassLight}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d={`M22 46 Q14 42 17 37`}
        stroke={pal.grassLight}
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      {/* petals */}
      <g
        style={{
          transformOrigin: "22px 18px",
        }}
      >
        {Array.from({ length: petalCount }, (_, i) => {
          const angle = (360 / petalCount) * i;
          return (
            <ellipse
              key={i}
              cx="22"
              cy={18 - petalSize}
              rx={petalSize * 0.6}
              ry={petalSize}
              fill={`oklch(0.78 0.16 ${hue})`}
              transform={`rotate(${angle} 22 18)`}
              style={{ filter: "saturate(1.15)" }}
            />
          );
        })}
        <circle cx="22" cy="18" r={centerR} fill="oklch(0.92 0.12 55)" />
        <circle cx="22" cy="18" r={centerR * 0.6} fill="oklch(0.95 0.10 60)" />
      </g>
    </svg>
  );
}

const BUTTERFLIES = [
  { x: 8, y: 22, hue: 350, size: 1, speed: 10 },
  { x: 22, y: 18, hue: 290, size: 0.9, speed: 12 },
  { x: 38, y: 26, hue: 20, size: 1.1, speed: 9 },
  { x: 55, y: 16, hue: 330, size: 0.85, speed: 14 },
  { x: 68, y: 24, hue: 40, size: 1, speed: 11 },
  { x: 82, y: 20, hue: 180, size: 0.95, speed: 13 },
  { x: 15, y: 30, hue: 260, size: 0.8, speed: 15 },
  { x: 90, y: 28, hue: 310, size: 0.9, speed: 10 },
];

const FALLING_LEAVES = Array.from({ length: 12 }, (_, i) => ({
  startX: 5 + ((i * 17) % 90),
  delay: (i * 1.3) % 8,
  duration: 6 + (i % 4) * 2,
  hue: 20 + ((i * 13) % 40),
  size: 8 + (i % 3) * 3,
  rotation: (i * 37) % 360,
}));

const SNOWFLAKES = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 4.2) % 100,
  delay: (i * 0.7) % 6,
  duration: 5 + (i % 5) * 1.5,
  size: 2 + (i % 3) * 1.5,
  opacity: 0.3 + (i % 4) * 0.15,
}));

function GardenTree({
  x,
  season,
  flip = false,
}: {
  x: number;
  season: Season;
  flip?: boolean;
}) {
  const pal = SEASON_PALETTE[season];
  const trunkColor = "oklch(0.35 0.08 60)";
  const w = flip ? -1 : 1;
  return (
    <div
      className="absolute bottom-[35%] pointer-events-none"
      style={{
        left: `${x}%`,
        transform: `translateX(-50%) scaleX(${w})`,
      }}
    >
      <svg width="120" height="180" viewBox="0 0 120 180">
        {/* trunk */}
        <rect
          x="52"
          y="90"
          width="16"
          height="90"
          rx="4"
          fill={trunkColor}
        />
        <rect
          x="55"
          y="95"
          width="4"
          height="80"
          rx="2"
          fill="oklch(0.40 0.06 65)"
          opacity="0.5"
        />
        {/* branch left */}
        <path
          d="M58 110 Q30 95 20 80"
          stroke={trunkColor}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* branch right */}
        <path
          d="M62 100 Q90 80 95 70"
          stroke={trunkColor}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* foliage clusters */}
        {season === "winter" ? (
          <>
            <circle cx="20" cy="72" r="18" fill={pal.treeFoliage} opacity="0.6" />
            <circle cx="60" cy="50" r="24" fill={pal.treeFoliage} opacity="0.5" />
            <circle cx="95" cy="62" r="16" fill={pal.treeFoliage} opacity="0.55" />
            <circle cx="60" cy="40" r="15" fill={pal.treeFoliage} opacity="0.4" />
            {/* frost highlight */}
            <circle cx="55" cy="38" r="4" fill="oklch(0.95 0.02 240)" opacity="0.5" />
            <circle cx="25" cy="68" r="3" fill="oklch(0.95 0.02 240)" opacity="0.4" />
          </>
        ) : (
          <>
            <circle cx="20" cy="72" r="20" fill={pal.treeFoliage} />
            <circle cx="60" cy="45" r="28" fill={pal.treeFoliage} />
            <circle cx="95" cy="60" r="18" fill={pal.treeFoliage} />
            <circle cx="40" cy="55" r="22" fill={pal.treeFoliage} opacity="0.85" />
            <circle cx="80" cy="48" r="20" fill={pal.treeFoliage} opacity="0.9" />
            <circle cx="60" cy="32" r="18" fill={pal.grassLight} opacity="0.6" />
            {/* spring blossoms */}
            {season === "spring" && (
              <>
                <circle cx="30" cy="65" r="3" fill="oklch(0.85 0.12 350)" opacity="0.7" />
                <circle cx="75" cy="42" r="2.5" fill="oklch(0.82 0.14 340)" opacity="0.6" />
                <circle cx="50" cy="35" r="2" fill="oklch(0.88 0.10 355)" opacity="0.7" />
                <circle cx="90" cy="55" r="2.5" fill="oklch(0.84 0.11 345)" opacity="0.5" />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

export function GardenScene({ phase, onAdd, onView, season = "spring" }: Props) {
  const { items } = useMemories("garden");
  const pal = SEASON_PALETTE[season];
  const [hueMin, hueMax] = FLOWER_HUES[season];

  const grassBlades = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: (i * 1.7) % 100,
        height: 12 + ((i * 7) % 28),
        delay: (i * 0.25) % 5,
        hue: 140 + ((i * 3) % 30),
      })),
    [],
  );

  const showButterflies = season === "spring" || season === "summer";
  const showLeaves = season === "autumn";
  const showSnow = season === "winter";

  return (
    <div className="scene scene-container scene-3d" style={{ background: SKY[phase] }}>
      {/* Season sky tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: pal.skyTint }}
      />

      {/* Clouds */}
      {(phase === "day" || phase === "dawn") &&
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`cloud-${i}`}
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
            fill={pal.treeFoliage}
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
            fill={pal.grass}
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
            fill={pal.grass}
          />
          <path
            d="M0 440 Q500 410 900 435 Q1200 450 1440 430 L1440 500 L0 500 Z"
            fill={pal.grassLight}
          />
        </svg>
      </div>

      {/* Garden fence */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[30%] h-20 depth-layer depth-mid">
        <svg
          className="absolute inset-x-0 bottom-0 w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ height: 60 }}
        >
          {/* horizontal rails */}
          <rect x="0" y="10" width="1440" height="3" rx="1.5" fill="oklch(0.55 0.06 70)" opacity="0.5" />
          <rect x="0" y="30" width="1440" height="3" rx="1.5" fill="oklch(0.55 0.06 70)" opacity="0.5" />
          {/* vertical pickets */}
          {Array.from({ length: 40 }, (_, i) => (
            <g key={`picket-${i}`}>
              <rect
                x={36 * i}
                y="0"
                width="4"
                height="50"
                rx="2"
                fill="oklch(0.58 0.05 65)"
                opacity="0.45"
              />
              <polygon
                points={`${36 * i},0 ${36 * i + 2},-6 ${36 * i + 4},0`}
                fill="oklch(0.58 0.05 65)"
                opacity="0.45"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Garden bench - 3D model */}
      <div className="pointer-events-none absolute bottom-[32%] left-[15%] depth-layer depth-mid">
        <SceneModelOverlay>
          <OutdoorCouchModel position={[0, -1, 0]} scale={0.3} rotation={[0, Math.PI / 8, 0]} />
        </SceneModelOverlay>
      </div>

      {/* Water feature / fountain */}
      <div className="pointer-events-none absolute bottom-[33%] right-[18%] depth-layer depth-mid">
        <svg width="80" height="70" viewBox="0 0 80 70">
          {/* basin */}
          <ellipse cx="40" cy="58" rx="36" ry="10" fill="oklch(0.50 0.08 220)" opacity="0.6" />
          <ellipse cx="40" cy="56" rx="34" ry="8" fill="oklch(0.55 0.10 230)" opacity="0.5" />
          {/* water surface */}
          <ellipse cx="40" cy="54" rx="30" ry="7" fill="oklch(0.65 0.10 240)" opacity="0.4" />
          {/* pillar */}
          <rect x="36" y="30" width="8" height="26" rx="3" fill="oklch(0.60 0.05 60)" opacity="0.5" />
          {/* top bowl */}
          <ellipse cx="40" cy="30" rx="12" ry="4" fill="oklch(0.55 0.06 60)" opacity="0.5" />
          <ellipse cx="40" cy="29" rx="10" ry="3" fill="oklch(0.60 0.08 230)" opacity="0.4" />
          {/* water drops */}
          <circle cx="38" cy="26" r="1.5" fill="oklch(0.70 0.10 240)" opacity="0.6">
            <animate
              attributeName="cy"
              values="26;50;26"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="25" r="1" fill="oklch(0.75 0.08 235)" opacity="0.5">
            <animate
              attributeName="cy"
              values="25;52;25"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="42" cy="27" r="1.2" fill="oklch(0.68 0.10 245)" opacity="0.55">
            <animate
              attributeName="cy"
              values="27;48;27"
              dur="1.8s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.55;0;0.55" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="36" cy="28" r="0.8" fill="oklch(0.72 0.09 238)" opacity="0.45">
            <animate
              attributeName="cy"
              values="28;46;28"
              dur="2.1s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.45;0;0.45" dur="2.1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Trees */}
      <GardenTree x={5} season={season} />
      <GardenTree x={95} season={season} flip />
      <GardenTree x={12} season={season} flip />
      <GardenTree x={88} season={season} />

      {/* 3D Polytree */}
      <div className="pointer-events-none absolute bottom-[35%] left-[45%] depth-layer depth-mid">
        <SceneModelOverlay>
          <PolytreeModel position={[0, -2, 0]} scale={0.6} />
        </SceneModelOverlay>
      </div>

      {/* Stone pathway */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10%] h-[25%] depth-layer depth-near">
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M600 200 Q620 160 650 130 Q700 90 740 60 Q780 30 820 0"
            stroke="oklch(0.62 0.04 60)"
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M600 200 Q620 160 650 130 Q700 90 740 60 Q780 30 820 0"
            stroke="oklch(0.68 0.03 55)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            opacity="0.25"
          />
          {/* stone texture dots */}
          {Array.from({ length: 14 }, (_, i) => {
            const t = i / 13;
            const sx = 600 + t * 220;
            const sy = 200 - t * 200;
            return (
              <circle
                key={`stone-${i}`}
                cx={sx + ((i * 7) % 12) - 6}
                cy={sy + ((i * 11) % 10) - 5}
                r={4 + (i % 3)}
                fill="oklch(0.58 0.03 65)"
                opacity={0.3 + (i % 3) * 0.08}
              />
            );
          })}
        </svg>
      </div>

      {/* Grass blades */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[28%] h-14 depth-layer depth-near">
        {grassBlades.map((g, i) => (
          <div
            key={`grass-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${g.left}%`,
              width: 2,
              height: g.height,
              background: `linear-gradient(0deg, ${pal.grass}, ${pal.grassLight})`,
              transformOrigin: "bottom center",
              animation: `wind-sway ${3 + g.delay}s ease-in-out ${g.delay}s infinite`,
              borderRadius: "1px 1px 0 0",
            }}
          />
        ))}
      </div>

      {/* Butterflies (spring/summer) */}
      {showButterflies &&
        BUTTERFLIES.map((b, i) => (
          <div
            key={`butterfly-${i}`}
            className="depth-layer depth-mid pointer-events-none absolute"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              animation: `depth-drift ${b.speed}s ease-in-out ${i * 0.8}s infinite`,
            }}
          >
            <svg
              width={22 * b.size}
              height={18 * b.size}
              viewBox="0 0 22 18"
              style={{ animation: "breathe 2s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}
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
              <ellipse
                cx="8"
                cy="9"
                rx="4"
                ry="5"
                fill={`oklch(0.80 0.14 ${b.hue})`}
                opacity="0.5"
                transform="rotate(-20 8 9)"
              />
              <ellipse
                cx="14"
                cy="9"
                rx="4"
                ry="5"
                fill={`oklch(0.80 0.14 ${b.hue})`}
                opacity="0.5"
                transform="rotate(20 14 9)"
              />
              <line x1="11" y1="3" x2="11" y2="15" stroke="oklch(0.2 0.02 350)" strokeWidth="0.6" />
            </svg>
          </div>
        ))}

      {/* Falling leaves (autumn) */}
      {showLeaves &&
        FALLING_LEAVES.map((l, i) => (
          <div
            key={`leaf-${i}`}
            className="pointer-events-none absolute"
            style={{
              left: `${l.startX}%`,
              top: "-5%",
              animation: `falling-leaf ${l.duration}s ease-in ${l.delay}s infinite`,
            }}
          >
            <svg
              width={l.size}
              height={l.size * 1.4}
              viewBox="0 0 12 17"
              style={{
                transform: `rotate(${l.rotation}deg)`,
                animation: `leaf-spin ${l.duration * 0.6}s linear infinite`,
              }}
            >
              <path
                d="M6 0 Q10 5 9 10 Q7 15 6 17 Q5 15 3 10 Q2 5 6 0 Z"
                fill={`oklch(0.60 0.14 ${l.hue})`}
                opacity="0.8"
              />
              <line x1="6" y1="1" x2="6" y2="16" stroke={`oklch(0.50 0.12 ${l.hue})`} strokeWidth="0.5" opacity="0.6" />
            </svg>
          </div>
        ))}

      {/* Snowflakes (winter) */}
      {showSnow &&
        SNOWFLAKES.map((s, i) => (
          <div
            key={`snow-${i}`}
            className="pointer-events-none absolute"
            style={{
              left: `${s.x}%`,
              top: "-3%",
              animation: `snowfall ${s.duration}s linear ${s.delay}s infinite`,
            }}
          >
            <svg
              width={s.size * 2}
              height={s.size * 2}
              viewBox="0 0 10 10"
              opacity={s.opacity}
            >
              <circle cx="5" cy="5" r="2.5" fill="oklch(0.95 0.01 240)" />
              <circle cx="5" cy="5" r="4" fill="none" stroke="oklch(0.90 0.01 240)" strokeWidth="0.3" opacity="0.5" />
            </svg>
          </div>
        ))}

      {/* Flower memories */}
      <div className="absolute inset-0 depth-layer">
        {items.map((m) => {
          const idHash =
            m.id.charCodeAt(0) * 7 + (m.id.charCodeAt(1) || 0) * 13;
          const hue = hueMin + (idHash % (hueMax - hueMin));
          const delay = (idHash % 5) * 0.15;
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
              <Flower hue={hue} season={season} title={m.title} delay={delay} />
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
          onAdd({
            x: (e.clientX - r.left) / r.width,
            y: (e.clientY - r.top) / r.height,
          });
        }}
        className="absolute inset-x-0 bottom-0 top-[40%] cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        click the meadow to plant a memory
      </p>
    </div>
  );
}
