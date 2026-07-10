import { useMemo } from "react";
import { useMemories, type Memory } from "@/components/world/memories";
import { type TimePhase } from "@/hooks/useTimeOfDay";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

/* ─── derived palette per phase ─── */
const PHASE_LIGHT: Record<
  TimePhase,
  { wallTop: string; wallBot: string; ambient: string; windowTint: string; stoveGlow: number; candleGlow: number }
> = {
  dawn: {
    wallTop: "oklch(0.22 0.05 355)",
    wallBot: "oklch(0.17 0.04 5)",
    ambient: "oklch(0.80 0.12 45 / 6%)",
    windowTint: "oklch(0.90 0.08 50 / 4%)",
    stoveGlow: 0,
    candleGlow: 0.15,
  },
  day: {
    wallTop: "oklch(0.24 0.05 355)",
    wallBot: "oklch(0.18 0.04 5)",
    ambient: "oklch(0.95 0.06 90 / 10%)",
    windowTint: "oklch(0.95 0.06 90 / 6%)",
    stoveGlow: 0,
    candleGlow: 0,
  },
  dusk: {
    wallTop: "oklch(0.21 0.06 15)",
    wallBot: "oklch(0.15 0.04 10)",
    ambient: "oklch(0.78 0.16 30 / 10%)",
    windowTint: "oklch(0.70 0.14 30 / 6%)",
    stoveGlow: 0.35,
    candleGlow: 0.5,
  },
  night: {
    wallTop: "oklch(0.16 0.04 355)",
    wallBot: "oklch(0.11 0.03 5)",
    ambient: "oklch(0.72 0.14 15 / 14%)",
    windowTint: "oklch(0.10 0.04 260 / 8%)",
    stoveGlow: 0.5,
    candleGlow: 0.85,
  },
};

export function KitchenScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("kitchen");
  const L = PHASE_LIGHT[phase];
  const isNight = phase === "night" || phase === "dusk";

  /* deterministic dust particles */
  const dust = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: 8 + ((i * 7.3) % 84),
        top: 10 + ((i * 11.1) % 70),
        dx: -20 + ((i * 13) % 40),
        dy: -40 - ((i * 7) % 60),
        dur: 6 + ((i * 3) % 8),
        delay: (i * 1.3) % 10,
        size: 1 + (i % 3) * 0.5,
      })),
    [],
  );

  /* window stars (night only) */
  const windowStars = useMemo(
    () =>
      phase === "night"
        ? Array.from({ length: 22 }, (_, i) => ({
            left: 8 + ((i * 4.1) % 84),
            top: 6 + ((i * 5.2) % 70),
            size: 0.8 + (i % 3) * 0.5,
            dur: 2 + ((i * 1.7) % 3),
            delay: (i * 0.35) % 3,
          }))
        : [],
    [phase],
  );

  /* magnet memories on the fridge */
  const fridgeMemos = items.slice(0, 3);

  return (
    <div
      className="scene scene-container scene-3d vignette-soft"
      style={{
        background: `linear-gradient(180deg, ${L.wallTop} 0%, ${L.wallBot} 100%)`,
      }}
    >
      {/* ───────────────────── WALL TEXTURE ───────────────────── */}
      <div
        className="depth-layer depth-farthest absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(90deg, oklch(0 0 0 / 2.5%) 0 1px, transparent 1px 120px),
            repeating-linear-gradient(0deg, oklch(0 0 0 / 1%) 0 1px, transparent 1px 240px)
          `,
          animation: "gentle-rotate 28s ease-in-out infinite",
        }}
      />

      {/* ambient light wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 45% 35%, ${L.ambient}, transparent 65%)`,
          animation: "breathe 12s ease-in-out infinite",
        }}
      />

      {/* window light spill across floor */}
      {phase !== "night" && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "30%",
            right: "5%",
            width: "40%",
            height: "70%",
            background: `linear-gradient(220deg, ${L.windowTint}, transparent 60%)`,
            filter: "blur(40px)",
            animation: "breathe 15s ease-in-out infinite",
          }}
        />
      )}

      {/* ───────────────── UPPER CABINETS ───────────────── */}
      <div className="depth-layer depth-farthest absolute left-[3%] top-[8%] flex gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative h-32 w-28 rounded-sm shadow-xl"
            style={{
              background: `linear-gradient(180deg, oklch(${0.28 + i * 0.02} 0.05 25), oklch(${0.22 + i * 0.02} 0.04 20))`,
              backgroundImage:
                "repeating-linear-gradient(90deg, oklch(0 0 0 / 2%) 0 1px, transparent 1px 40px)",
              animation: `depth-pulse ${14 + i * 2}s ease-in-out infinite`,
            }}
          >
            {/* handle */}
            <div
              className="absolute right-2 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full"
              style={{ background: "oklch(0.65 0.08 55 / 60%)" }}
            />
            {/* subtle panel line */}
            <div
              className="absolute inset-2 rounded-sm border border-white/[0.04]"
              style={{ background: "oklch(0 0 0 / 5%)" }}
            />
          </div>
        ))}
      </div>

      {/* ───────────────── KITCHEN WINDOW ───────────────── */}
      <button
        onClick={() => onOpen("photo")}
        title="kitchen window"
        className="depth-layer depth-near group absolute right-[5%] top-[8%] h-52 w-72 overflow-hidden rounded-lg border-4 border-[oklch(0.25_0.04_20)] shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_50px_oklch(0.72_0.14_15_/_20%)]"
      >
        {/* sky */}
        <div
          className="absolute inset-0"
          style={{
            background: phase === "night"
              ? "linear-gradient(180deg, oklch(0.10 0.04 260) 0%, oklch(0.15 0.05 270) 70%, oklch(0.20 0.04 260) 100%)"
              : phase === "dawn"
                ? "linear-gradient(180deg, oklch(0.65 0.10 30) 0%, oklch(0.72 0.12 50) 50%, oklch(0.55 0.08 70) 100%)"
                : phase === "dusk"
                  ? "linear-gradient(180deg, oklch(0.35 0.10 300) 0%, oklch(0.55 0.16 30) 55%, oklch(0.60 0.18 55) 100%)"
                  : "linear-gradient(180deg, oklch(0.75 0.08 230) 0%, oklch(0.82 0.06 220) 60%, oklch(0.88 0.05 90) 100%)",
            animation: "slow-pan 60s ease-in-out infinite alternate",
          }}
        />
        {/* night stars */}
        {windowStars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.left}%`,
              top: `${s.top}%`,
              animation: `twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {/* day clouds */}
        {(phase === "day" || phase === "dawn") &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                top: `${15 + i * 18}%`,
                left: `${-20 + i * 28}%`,
                width: 120 + i * 40,
                height: 20 + i * 5,
                background: `radial-gradient(ellipse, oklch(0.95 0.03 20 / ${0.3 + i * 0.05}), transparent 70%)`,
                animation: `cloud-drift ${30 + i * 14}s linear infinite`,
                animationDelay: `${i * -9}s`,
              }}
            />
          ))}
        {/* dusk golden wash */}
        {phase === "dusk" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 80%, oklch(0.80 0.16 35 / 25%), transparent 65%)" }}
          />
        )}
        {/* rain droplets on glass */}
        {phase === "night" &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${12 + i * 18}%`,
                top: `${8 + ((i * 19) % 55)}%`,
                width: 2.5,
                height: 4.5,
                background: "oklch(0.88 0.04 240 / 35%)",
                animation: `droplet-slide ${2.5 + i * 0.6}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        {/* window frame cross */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 46%, oklch(0.25 0.04 20) 46% 54%, transparent 54%), linear-gradient(0deg, transparent 46%, oklch(0.25 0.04 20) 46% 54%, transparent 54%)",
          }}
        />
        {/* curtain left */}
        <div
          className="absolute left-0 top-0 h-full w-7"
          style={{
            background: "linear-gradient(90deg, oklch(0.52 0.08 355 / 70%), oklch(0.38 0.06 355 / 30%))",
            animation: "sway 7s ease-in-out infinite",
            transformOrigin: "top left",
          }}
        />
        {/* curtain right */}
        <div
          className="absolute right-0 top-0 h-full w-7"
          style={{
            background: "linear-gradient(-90deg, oklch(0.52 0.08 355 / 70%), oklch(0.38 0.06 355 / 30%))",
            animation: "sway 8.5s ease-in-out infinite",
            transformOrigin: "top right",
          }}
        />
        {/* windowsill */}
        <div
          className="absolute -bottom-2 -left-1 -right-1 h-4 rounded-sm"
          style={{ background: "oklch(0.32 0.05 20)" }}
        />
      </button>

      {/* ──────────── HERBS ON WINDOWSILL ──────────── */}
      <div className="depth-layer depth-near absolute right-[4%] top-[42%] pointer-events-none">
        <svg width="80" height="40" viewBox="0 0 80 40">
          {/* pot 1 — basil */}
          <rect x="4" y="24" width="18" height="16" rx="3" fill="oklch(0.38 0.07 15)" />
          <ellipse cx="13" cy="24" rx="10" ry="3" fill="oklch(0.35 0.06 15)" />
          <path
            d="M13 24 Q8 14 3 8"
            stroke="oklch(0.42 0.14 148)"
            strokeWidth="1.8"
            fill="none"
            style={{ animation: "sway 4.5s ease-in-out infinite" }}
          />
          <path
            d="M13 24 Q18 12 22 7"
            stroke="oklch(0.44 0.13 145)"
            strokeWidth="1.8"
            fill="none"
            style={{ animation: "sway 5s ease-in-out 0.5s infinite" }}
          />
          <ellipse
            cx="3"
            cy="7"
            rx="5"
            ry="3.5"
            fill="oklch(0.44 0.14 148)"
            style={{ animation: "sway 4.5s ease-in-out infinite", transformOrigin: "3px 11px" }}
          />
          <ellipse
            cx="22"
            cy="6"
            rx="5.5"
            ry="3.5"
            fill="oklch(0.46 0.13 145)"
            style={{ animation: "sway 5s ease-in-out 0.5s infinite", transformOrigin: "22px 10px" }}
          />
          <circle cx="8" cy="10" r="3" fill="oklch(0.48 0.15 150)" style={{ animation: "leaf-flutter 3s ease-in-out infinite" }} />
          <circle cx="18" cy="9" r="3.5" fill="oklch(0.50 0.14 148)" style={{ animation: "leaf-flutter 3.5s ease-in-out 0.8s infinite" }} />
          {/* pot 2 — rosemary */}
          <rect x="42" y="26" width="16" height="14" rx="2" fill="oklch(0.36 0.06 25)" />
          <ellipse cx="50" cy="26" rx="9" ry="3" fill="oklch(0.33 0.05 22)" />
          <path
            d="M50 26 Q48 18 44 12"
            stroke="oklch(0.38 0.12 158)"
            strokeWidth="1.5"
            fill="none"
            style={{ animation: "sway 5.5s ease-in-out 0.3s infinite" }}
          />
          <path
            d="M50 26 Q52 16 56 10"
            stroke="oklch(0.40 0.12 155)"
            strokeWidth="1.5"
            fill="none"
            style={{ animation: "sway 6s ease-in-out 1s infinite" }}
          />
          <path
            d="M50 26 Q50 15 50 8"
            stroke="oklch(0.36 0.10 152)"
            strokeWidth="1.5"
            fill="none"
            style={{ animation: "sway 4s ease-in-out 0.6s infinite" }}
          />
          <ellipse
            cx="44"
            cy="11"
            rx="4"
            ry="2.5"
            fill="oklch(0.40 0.12 158)"
            style={{ animation: "sway 5.5s ease-in-out 0.3s infinite", transformOrigin: "44px 14px" }}
          />
          <ellipse
            cx="56"
            cy="9"
            rx="4.5"
            ry="2.5"
            fill="oklch(0.42 0.12 155)"
            style={{ animation: "sway 6s ease-in-out 1s infinite", transformOrigin: "56px 12px" }}
          />
          <ellipse
            cx="50"
            cy="7"
            rx="3.5"
            ry="2.5"
            fill="oklch(0.38 0.10 152)"
            style={{ animation: "sway 4s ease-in-out 0.6s infinite", transformOrigin: "50px 10px" }}
          />
        </svg>
      </div>

      {/* ───────────────── REFRIGERATOR ───────────────── */}
      <button
        onClick={() => onOpen("memory")}
        title="refrigerator — leave a memory"
        className="depth-layer depth-near group absolute left-[3%] top-[14%] h-[48%] w-28 overflow-hidden rounded-lg shadow-2xl transition-all duration-500 hover:brightness-110 hover:scale-[1.02]"
        style={{
          background: `linear-gradient(180deg, oklch(0.42 0.02 220), oklch(0.36 0.02 220))`,
          border: "1px solid oklch(0.50 0.02 220 / 20%)",
          animation: "depth-pulse 18s ease-in-out infinite",
        }}
      >
        {/* stainless reflection streak */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, oklch(1 0 0 / 8%) 0%, transparent 35%, oklch(1 0 0 / 4%) 50%, transparent 70%)",
          }}
        />
        {/* freezer top section */}
        <div className="absolute inset-x-0 top-0 h-[35%] border-b border-white/[0.06]">
          <div
            className="absolute left-1/2 top-[40%] -translate-x-1/2 h-4 w-1 rounded-full"
            style={{ background: "oklch(0.55 0.03 220 / 50%)" }}
          />
        </div>
        {/* fridge bottom section handle */}
        <div
          className="absolute right-3 top-[45%] h-10 w-1 rounded-full"
          style={{ background: "oklch(0.55 0.03 220 / 45%)" }}
        />

        {/* ── MEMORY MAGNETS on fridge ── */}
        <div className="absolute inset-x-2 top-[38%] flex flex-col gap-2">
          {fridgeMemos.map((m, i) => (
            <button
              key={m.id}
              onClick={(e) => {
                e.stopPropagation();
                onView(m);
              }}
              title={m.title}
              className="group/mag relative w-full rounded-sm px-1.5 py-1 text-left transition-all duration-300 hover:scale-105 hover:brightness-125"
              style={{
                background: `linear-gradient(135deg, oklch(${0.65 + (i % 3) * 0.06} 0.12 ${350 + i * 25}), oklch(0.50 0.10 ${355 + i * 20}))`,
                boxShadow: `0 2px 8px oklch(0 0 0 / 25%), inset 0 1px 2px oklch(1 0 0 / 15%)`,
                transform: `rotate(${-2 + i * 2}deg)`,
                animation: `card-3d-hover ${7 + i}s ease-in-out infinite`,
                animationDelay: `${i * 1.2}s`,
              }}
            >
              {/* tiny magnet dot */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full shadow-sm"
                style={{ background: "oklch(0.60 0.14 15 / 80%)" }}
              />
              <span className="block truncate text-[8px] font-semibold leading-tight text-white/90 serif">
                {m.title}
              </span>
            </button>
          ))}
          {fridgeMemos.length === 0 && (
            <div
              className="rounded-sm border border-dashed px-1 py-3 text-center text-[7px] italic text-white/30 serif"
              style={{ borderColor: "oklch(0.55 0.03 220 / 25%)" }}
            >
              click to leave a note
            </div>
          )}
        </div>
      </button>

      {/* ───────────────── LOWER CABINETS ───────────────── */}
      <div className="depth-layer depth-mid absolute inset-x-0 bottom-[22%] flex justify-center gap-2 px-[18%]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="relative flex-1 rounded-sm shadow-lg"
            style={{
              height: 68,
              background: `linear-gradient(180deg, oklch(${0.25 + i * 0.015} 0.05 25), oklch(${0.20 + i * 0.015} 0.04 22))`,
              backgroundImage: "repeating-linear-gradient(90deg, oklch(0 0 0 / 2%) 0 1px, transparent 1px 35px)",
              animation: `depth-pulse ${16 + i}s ease-in-out infinite`,
            }}
          >
            {/* drawer line */}
            <div className="absolute inset-x-3 top-[48%] h-px" style={{ background: "oklch(0 0 0 / 12%)" }} />
            {/* handle */}
            <div
              className="absolute left-1/2 top-[22%] -translate-x-1/2 h-0.5 w-5 rounded-full"
              style={{ background: "oklch(0.62 0.06 55 / 50%)" }}
            />
            <div
              className="absolute left-1/2 top-[62%] -translate-x-1/2 h-0.5 w-5 rounded-full"
              style={{ background: "oklch(0.62 0.06 55 / 40%)" }}
            />
          </div>
        ))}
      </div>

      {/* ───────────────── STOVE / OVEN ───────────────── */}
      <div
        className="depth-layer depth-mid absolute right-[14%] bottom-[22%] h-24 w-40"
        style={{ animation: "depth-pulse 16s ease-in-out infinite" }}
      >
        {/* countertop surface */}
        <div
          className="absolute inset-x-0 top-0 h-3 rounded-t-sm"
          style={{
            background: "linear-gradient(180deg, oklch(0.34 0.04 30), oklch(0.28 0.03 25))",
          }}
        />
        {/* stove top — dark glass */}
        <div
          className="absolute inset-x-2 top-3 h-8 rounded-sm"
          style={{ background: "oklch(0.10 0.01 260)" }}
        >
          {/* burners */}
          {[0, 1, 2, 3].map((b) => (
            <div
              key={b}
              className="absolute rounded-full border"
              style={{
                width: 12 + (b % 2) * 2,
                height: 12 + (b % 2) * 2,
                left: b < 2 ? "22%" : "62%",
                top: b % 2 === 0 ? "15%" : "50%",
                transform: "translate(-50%, -50%)",
                borderColor: isNight ? "oklch(0.65 0.16 20 / 50%)" : "oklch(0.30 0.03 260 / 40%)",
                boxShadow: isNight
                  ? `0 0 ${6 + L.stoveGlow * 10}px oklch(0.80 0.18 20 / ${0.15 + L.stoveGlow * 0.3})`
                  : "none",
                transition: "all 1.5s ease-in-out",
              }}
            />
          ))}
          {/* stove glow overlay */}
          {isNight && (
            <div
              className="absolute inset-0 rounded-sm pointer-events-none"
              style={{
                background: `radial-gradient(circle at 30% 45%, oklch(0.85 0.18 15 / ${L.stoveGlow * 0.2}), transparent 60%)`,
                animation: "flicker 2.5s ease-in-out infinite",
              }}
            />
          )}
        </div>
        {/* oven body */}
        <div
          className="absolute inset-x-0 bottom-0 top-11 rounded-b-sm overflow-hidden"
          style={{ background: "linear-gradient(180deg, oklch(0.20 0.02 220), oklch(0.16 0.02 220))" }}
        >
          {/* oven door handle */}
          <div
            className="absolute inset-x-4 top-2 h-0.5 rounded-full"
            style={{ background: "oklch(0.50 0.03 220 / 40%)" }}
          />
          {/* oven window */}
          <div
            className="absolute inset-x-4 top-5 bottom-3 rounded-sm overflow-hidden"
            style={{
              background: isNight ? "oklch(0.08 0.02 20)" : "oklch(0.06 0.01 260)",
              border: "1px solid oklch(0 0 0 / 20%)",
            }}
          >
            {isNight && (
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at center bottom, oklch(0.85 0.2 15 / ${L.stoveGlow * 0.25}), transparent 70%)`,
                  animation: "flicker 1.8s ease-in-out infinite",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ──────── STOVE HOOD / RANGE HOOD ──────── */}
      <div
        className="depth-layer depth-farthest absolute right-[12%] top-[8%] w-44 h-10"
        style={{
          background: "linear-gradient(180deg, oklch(0.30 0.02 220), oklch(0.24 0.02 220))",
          borderRadius: "0 0 4px 4px",
        }}
      >
        <div
          className="absolute inset-x-6 bottom-0 h-3 rounded-b-full"
          style={{
            background: "oklch(0.14 0.01 220)",
            boxShadow: isNight ? `0 4px 20px oklch(0.80 0.15 15 / ${L.stoveGlow * 0.15})` : "none",
          }}
        />
      </div>

      {/* ───────────────── KITCHEN ISLAND ───────────────── */}
      <div
        className="depth-layer depth-near absolute left-1/2 bottom-[18%] -translate-x-1/2 w-[38%]"
        style={{ animation: "depth-pulse 20s ease-in-out infinite" }}
      >
        {/* island body */}
        <div
          className="relative h-16 w-full rounded-md shadow-2xl"
          style={{
            background: "linear-gradient(180deg, oklch(0.22 0.04 25), oklch(0.17 0.03 20))",
            backgroundImage: "repeating-linear-gradient(90deg, oklch(0 0 0 / 2%) 0 1px, transparent 1px 50px)",
          }}
        />
        {/* marble countertop */}
        <div
          className="absolute -top-3 -left-2 -right-2 h-4 rounded-md shadow-xl"
          style={{
            background: `
              linear-gradient(135deg, oklch(0.92 0.01 20 / 80%) 25%, oklch(0.88 0.01 25 / 75%) 50%, oklch(0.90 0.01 20 / 78%) 75%),
              repeating-linear-gradient(135deg, oklch(0.82 0.01 30 / 10%) 0 2px, transparent 2px 20px)
            `,
          }}
        >
          {/* marble veins */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 16" preserveAspectRatio="none">
            <path d="M0 6 Q40 3 80 8 Q120 12 160 5 Q180 3 200 7" stroke="oklch(0.60 0.02 200)" strokeWidth="0.5" fill="none" />
            <path d="M0 11 Q50 9 100 13 Q150 10 200 12" stroke="oklch(0.62 0.01 190)" strokeWidth="0.4" fill="none" />
          </svg>
        </div>

        {/* cutting board */}
        <div
          className="absolute -top-6 left-[15%] h-2.5 w-16 rounded-sm shadow-lg"
          style={{
            background: "linear-gradient(90deg, oklch(0.42 0.08 35), oklch(0.38 0.07 30))",
            transform: "rotate(-3deg)",
          }}
        >
          {/* grain lines */}
          <div className="absolute inset-x-1 top-0.5 h-px" style={{ background: "oklch(0 0 0 / 8%)" }} />
          <div className="absolute inset-x-2 top-1.5 h-px" style={{ background: "oklch(0 0 0 / 6%)" }} />
        </div>

        {/* bowl */}
        <div className="absolute -top-5 right-[18%]">
          <svg width="32" height="20" viewBox="0 0 32 20">
            <ellipse cx="16" cy="12" rx="14" ry="7" fill="oklch(0.88 0.06 20 / 80%)" />
            <ellipse cx="16" cy="10" rx="14" ry="7" fill="oklch(0.92 0.04 25 / 90%)" />
            <ellipse
              cx="16"
              cy="8"
              rx="10"
              ry="4"
              fill="oklch(0.55 0.14 15 / 40%)"
            />
            {/* bowl shadow */}
            <ellipse cx="16" cy="18" rx="12" ry="2" fill="oklch(0 0 0 / 10%)" />
          </svg>
        </div>
      </div>

      {/* ──────── HANGING POTS RACK ──────── */}
      <div
        className="depth-layer depth-near pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ top: "4%", width: "32%" }}
      >
        {/* rack bar */}
        <div className="relative mx-auto h-0.5 w-full rounded-full" style={{ background: "oklch(0.30 0.03 220 / 60%)" }} />
        {/* hooks and pots */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${12 + i * 25}%`,
              top: 2,
              animation: `sway ${4 + i * 0.8}s ease-in-out ${i * 0.4}s infinite`,
              transformOrigin: "top center",
            }}
          >
            {/* hook */}
            <div className="mx-auto h-4 w-px" style={{ background: "oklch(0.35 0.03 220 / 50%)" }} />
            {/* pot */}
            <svg width={18 + i * 4} height={16 + i * 3} viewBox="0 0 28 22" className="drop-shadow-md">
              <path
                d="M3 8 Q3 20 14 20 Q25 20 25 8"
                fill={`oklch(${0.28 + i * 0.03} 0.06 ${350 + i * 15})`}
                stroke={`oklch(${0.22 + i * 0.02} 0.04 ${350 + i * 15})`}
                strokeWidth="0.5"
              />
              {/* rim */}
              <ellipse
                cx="14"
                cy="8"
                rx="12"
                ry="3"
                fill={`oklch(${0.32 + i * 0.03} 0.06 ${350 + i * 15})`}
              />
              {/* copper reflection */}
              <ellipse
                cx="10"
                cy="12"
                rx="4"
                ry="5"
                fill="oklch(0.60 0.12 40 / 12%)"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* ──────────────── DINING TABLE ──────────────── */}
      <div
        className="depth-layer depth-near absolute bottom-[8%] left-[55%] translate-x-4"
        style={{ animation: "depth-pulse 22s ease-in-out infinite" }}
      >
        <svg width="120" height="80" viewBox="0 0 120 80">
          {/* table top */}
          <ellipse
            cx="60"
            cy="18"
            rx="56"
            ry="16"
            fill="oklch(0.30 0.05 25)"
            stroke="oklch(0.25 0.04 20)"
            strokeWidth="0.5"
          />
          <ellipse
            cx="60"
            cy="16"
            rx="56"
            ry="16"
            fill="oklch(0.34 0.05 28)"
          />
          {/* legs */}
          <line x1="25" y1="30" x2="20" y2="78" stroke="oklch(0.22 0.04 20)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="95" y1="30" x2="100" y2="78" stroke="oklch(0.22 0.04 20)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="55" y1="32" x2="55" y2="78" stroke="oklch(0.20 0.03 20)" strokeWidth="2" strokeLinecap="round" />
          {/* plate 1 */}
          <ellipse cx="38" cy="14" rx="12" ry="5" fill="oklch(0.88 0.02 25 / 70%)" stroke="oklch(0.70 0.02 30 / 30%)" strokeWidth="0.3" />
          <ellipse cx="38" cy="13" rx="8" ry="3.5" fill="oklch(0.92 0.01 20 / 60%)" />
          {/* plate 2 */}
          <ellipse cx="80" cy="14" rx="12" ry="5" fill="oklch(0.88 0.02 25 / 70%)" stroke="oklch(0.70 0.02 30 / 30%)" strokeWidth="0.3" />
          <ellipse cx="80" cy="13" rx="8" ry="3.5" fill="oklch(0.92 0.01 20 / 60%)" />
        </svg>

        {/* candles on table */}
        {isNight && (
          <>
            {/* candle 1 */}
            <div className="absolute -top-6 left-[28%]">
              <svg width="14" height="28" viewBox="0 0 14 28">
                {/* holder */}
                <ellipse cx="7" cy="24" rx="6" ry="3" fill="oklch(0.50 0.08 55 / 50%)" />
                {/* wax */}
                <rect x="5" y="12" width="4" height="12" rx="1" fill="oklch(0.92 0.06 55 / 70%)" />
                {/* flame */}
                <ellipse
                  cx="7"
                  cy="10"
                  rx="2.5"
                  ry="5"
                  fill="oklch(0.90 0.16 50 / 90%)"
                  style={{ animation: "candle-flame 1.5s ease-in-out infinite" }}
                />
                <ellipse
                  cx="7"
                  cy="9"
                  rx="1.5"
                  ry="3.5"
                  fill="oklch(0.98 0.12 60 / 95%)"
                  style={{ animation: "candle-flame 1.2s ease-in-out 0.3s infinite" }}
                />
              </svg>
              {/* glow */}
              <div
                className="absolute -inset-6 pointer-events-none rounded-full"
                style={{
                  background: `radial-gradient(circle, oklch(0.88 0.14 50 / ${L.candleGlow * 0.35}), transparent 70%)`,
                  animation: "flicker 2s ease-in-out infinite",
                }}
              />
            </div>
            {/* candle 2 */}
            <div className="absolute -top-6 right-[25%]">
              <svg width="14" height="28" viewBox="0 0 14 28">
                <ellipse cx="7" cy="24" rx="6" ry="3" fill="oklch(0.48 0.08 10 / 50%)" />
                <rect x="5" y="12" width="4" height="12" rx="1" fill="oklch(0.90 0.06 10 / 70%)" />
                <ellipse
                  cx="7"
                  cy="10"
                  rx="2.5"
                  ry="5"
                  fill="oklch(0.88 0.16 45 / 90%)"
                  style={{ animation: "candle-flame 1.7s ease-in-out 0.2s infinite" }}
                />
                <ellipse
                  cx="7"
                  cy="9"
                  rx="1.5"
                  ry="3.5"
                  fill="oklch(0.98 0.12 55 / 95%)"
                  style={{ animation: "candle-flame 1.3s ease-in-out 0.5s infinite" }}
                />
              </svg>
              <div
                className="absolute -inset-6 pointer-events-none rounded-full"
                style={{
                  background: `radial-gradient(circle, oklch(0.86 0.14 48 / ${L.candleGlow * 0.30}), transparent 70%)`,
                  animation: "flicker 2.3s ease-in-out 0.5s infinite",
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* ──────────────── WALL CLOCK ──────────────── */}
      <div className="depth-layer depth-farthest absolute left-[42%] top-[6%]">
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="20" fill="oklch(0.32 0.03 30)" stroke="oklch(0.28 0.03 25)" strokeWidth="1.5" />
          <circle cx="22" cy="22" r="17" fill="oklch(0.90 0.04 55 / 15%)" />
          {/* hour marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 22 + Math.sin(angle) * 14;
            const y1 = 22 - Math.cos(angle) * 14;
            const x2 = 22 + Math.sin(angle) * 16;
            const y2 = 22 - Math.cos(angle) * 16;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="oklch(0.70 0.06 55 / 50%)"
                strokeWidth={i % 3 === 0 ? "1" : "0.5"}
                strokeLinecap="round"
              />
            );
          })}
          {/* hands */}
          <line
            x1="22"
            y1="22"
            x2="22"
            y2="10"
            stroke="oklch(0.80 0.06 55 / 70%)"
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ transformOrigin: "22px 22px", transform: "rotate(65deg)" }}
          />
          <line
            x1="22"
            y1="22"
            x2="22"
            y2="7"
            stroke="oklch(0.75 0.05 55 / 60%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            style={{ transformOrigin: "22px 22px", transform: "rotate(210deg)" }}
          />
          <circle cx="22" cy="22" r="1.5" fill="oklch(0.60 0.10 15 / 70%)" />
        </svg>
      </div>

      {/* ──────── SMALL WALL ART ──────── */}
      <div className="depth-layer depth-farthest absolute left-[28%] top-[12%] pointer-events-none">
        <div
          className="h-14 w-10 rounded-sm shadow-lg"
          style={{
            background: `linear-gradient(135deg, oklch(0.55 0.12 10), oklch(0.40 0.10 350))`,
            border: "1.5px solid oklch(0.35 0.05 20 / 50%)",
            animation: "card-3d-hover 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* ──────── HANGING LIGHT / PENDANT ──────── */}
      <div className="depth-layer depth-near absolute left-[50%] -translate-x-1/2 top-[2%] pointer-events-none">
        {/* wire */}
        <div className="mx-auto h-10 w-px" style={{ background: "oklch(0.30 0.03 220 / 40%)" }} />
        {/* shade */}
        <svg width="40" height="28" viewBox="0 0 40 28" className="mx-auto">
          <path d="M10 0 L5 26 L35 26 L30 0 Z" fill="oklch(0.28 0.04 25)" stroke="oklch(0.22 0.03 20)" strokeWidth="0.5" />
          {/* inner glow */}
          <ellipse
            cx="20"
            cy="24"
            rx="12"
            ry="4"
            fill={isNight ? "oklch(0.88 0.14 50 / 40%)" : "oklch(0.85 0.10 55 / 15%)"}
            style={{ animation: isNight ? "breathe 3s ease-in-out infinite" : "none" }}
          />
        </svg>
        {/* light cone */}
        {isNight && (
          <div
            className="absolute left-1/2 -translate-x-1/2 top-12 pointer-events-none"
            style={{
              width: 120,
              height: 200,
              background: `linear-gradient(180deg, oklch(0.85 0.12 50 / ${L.candleGlow * 0.15}), transparent 100%)`,
              clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
              animation: "flicker 4s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* ──────── FLOOR ──────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[22%] pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, oklch(0.18 0.04 25) 0%, oklch(0.14 0.03 20) 100%),
            repeating-linear-gradient(90deg, oklch(0.16 0.03 22 / 60%) 0 80px, oklch(0.13 0.03 20 / 60%) 80px 81px)
          `,
          backgroundBlendMode: "overlay",
        }}
      >
        {/* floor tile grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(0 0 0 / 5%) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, oklch(0 0 0 / 5%) 0 1px, transparent 1px 40px)",
          }}
        />
      </div>

      {/* ──────── FLOATING DUST PARTICLES ──────── */}
      <div
        className="pointer-events-none absolute inset-0 depth-layer depth-mid"
        style={{ animation: "parallax-sway-x 28s ease-in-out infinite" }}
      >
        {dust.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={
              {
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                background:
                  i % 3 === 0
                    ? "oklch(0.82 0.12 355 / 45%)"
                    : i % 3 === 1
                      ? "oklch(0.85 0.10 30 / 35%)"
                      : "oklch(0.80 0.08 55 / 40%)",
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animation: `dust-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ──────── WARM STOVE/HEARTH AMBIENCE ──────── */}
      {isNight && (
        <div
          className="absolute bottom-0 right-[10%] w-80 h-64 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center bottom, oklch(0.72 0.14 15 / ${L.stoveGlow * 0.18}), transparent 65%)`,
            animation: "flicker 3s ease-in-out infinite",
          }}
        />
      )}

      {/* ──────── BOTTOM PROMPT ──────── */}
      <p className="pointer-events-none absolute inset-x-0 bottom-24 text-center serif text-sm italic text-foreground/60 drop-shadow-lg z-10">
        {isNight
          ? "the kitchen glows warmly — leave a memory on the fridge"
          : "sunlight fills the kitchen — click the fridge to leave a note"}
      </p>
    </div>
  );
}
