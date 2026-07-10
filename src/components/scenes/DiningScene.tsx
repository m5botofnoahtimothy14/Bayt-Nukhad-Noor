import { useMemo } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

const DUST_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: 8 + ((i * 7) % 84),
  top: 20 + ((i * 11) % 55),
  dx: -20 + ((i * 13) % 40),
  dy: -40 - ((i * 5) % 50),
  dur: 6 + ((i * 3) % 8),
  delay: (i * 0.8) % 10,
  size: 1 + (i % 3) * 0.5,
}));

export function DiningScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("dining");

  const candleGlow = phase === "night" ? 0.95 : phase === "dusk" ? 0.75 : phase === "dawn" ? 0.5 : 0.3;
  const windowLight = phase === "day" ? 0.6 : phase === "dawn" ? 0.55 : phase === "dusk" ? 0.45 : 0.15;
  const wallTint = phase === "night" || phase === "dusk" ? 0.85 : 0.5;

  const windowStars = useMemo(
    () =>
      phase === "night"
        ? Array.from({ length: 20 }, (_, i) => ({
            left: 5 + ((i * 4.1) % 90),
            top: 5 + ((i * 3.7) % 70),
            size: 0.8 + (i % 3) * 0.4,
            dur: 2 + ((i * 1.3) % 3),
            delay: (i * 0.25) % 3,
          }))
        : [],
    [phase],
  );

  return (
    <div
      className="scene scene-container scene-3d"
      style={{
        background: `linear-gradient(180deg, oklch(0.16 0.04 350) 0%, oklch(0.12 0.03 355) 60%, oklch(0.10 0.02 5) 100%)`,
      }}
    >
      {/* ========== WALL ========== */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(90deg, oklch(0.24 0.05 355) 0 120px, oklch(0.22 0.04 355) 120px 121px),
            repeating-linear-gradient(0deg, oklch(0.24 0.05 355) 0 80px, oklch(0.23 0.04 355) 80px 81px),
            radial-gradient(ellipse at 50% 45%, oklch(0.72 0.14 15 / ${wallTint * 0.12}) 0%, transparent 60%)
          `,
        }}
      />

      {/* Wall wainscoting (lower panel) */}
      <div
        className="depth-layer depth-farthest absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "38%",
          background: `
            linear-gradient(0deg, oklch(0.20 0.04 350) 0%, oklch(0.22 0.04 355) 100%),
            repeating-linear-gradient(90deg, oklch(0.21 0.04 352) 0 100px, oklch(0.19 0.04 350) 100px 101px)
          `,
          borderTop: "3px solid oklch(0.28 0.05 355 / 50%)",
        }}
      />

      {/* Wainscoting chair rail */}
      <div
        className="depth-layer depth-farthest absolute inset-x-0 pointer-events-none"
        style={{
          top: "62%",
          height: 4,
          background: "linear-gradient(90deg, oklch(0.30 0.05 355 / 40%), oklch(0.32 0.06 355 / 60%), oklch(0.30 0.05 355 / 40%))",
        }}
      />

      {/* ========== WINDOW with curtains ========== */}
      <button
        onClick={() => onOpen("photo")}
        title="the dining window"
        className="depth-layer depth-mid group absolute left-[10%] top-[8%] h-56 w-44 overflow-hidden rounded-t-2xl border-4 border-[oklch(0.26_0.04_350)] shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_40px_oklch(0.72_0.14_15_/_18%)]"
        style={{ animation: "depth-pulse 14s ease-in-out infinite" }}
      >
        {/* Sky through window */}
        <div
          className="absolute inset-0"
          style={{
            background: SKY[phase],
            animation: "slow-pan 60s ease-in-out infinite alternate",
          }}
        />
        {/* Night stars */}
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
        {/* Window cross frame */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 47%, oklch(0.26 0.04 350) 47% 53%, transparent 53%), linear-gradient(0deg, transparent 47%, oklch(0.26 0.04 350) 47% 53%, transparent 53%)",
          }}
        />
        {/* Left curtain */}
        <div
          className="absolute left-0 top-0 h-full w-10"
          style={{
            background: "linear-gradient(90deg, oklch(0.48 0.08 355), oklch(0.32 0.06 355 / 80%), oklch(0.25 0.04 355 / 0%))",
            animation: "sway 7s ease-in-out infinite",
            transformOrigin: "top left",
          }}
        />
        {/* Right curtain */}
        <div
          className="absolute right-0 top-0 h-full w-10"
          style={{
            background: "linear-gradient(-90deg, oklch(0.48 0.08 355), oklch(0.32 0.06 355 / 80%), oklch(0.25 0.04 355 / 0%))",
            animation: "sway 8.5s ease-in-out infinite",
            transformOrigin: "top right",
          }}
        />
        {/* Valance / curtain rod */}
        <div
          className="absolute -top-1 left-0 right-0 h-3 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, oklch(0.30 0.04 350), oklch(0.26 0.04 350))",
            borderRadius: "0 0 4px 4px",
          }}
        />
        {/* Window sill */}
        <div
          className="absolute -bottom-1 -left-1 -right-1 h-2"
          style={{ background: "oklch(0.24 0.04 350)" }}
        />
        {/* Day light spill into room */}
        {phase === "day" && (
          <div
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              background: "radial-gradient(ellipse at center, oklch(0.9 0.06 80 / 10%), transparent 80%)",
            }}
          />
        )}
      </button>

      {/* Light spill from window onto floor */}
      {(phase === "day" || phase === "dawn") && (
        <div
          className="depth-layer depth-near absolute pointer-events-none"
          style={{
            left: "5%",
            top: "50%",
            width: "35%",
            height: "50%",
            background: `linear-gradient(135deg, oklch(0.90 0.06 80 / ${windowLight * 0.12}) 0%, transparent 70%)`,
            filter: "blur(20px)",
            transform: "skewX(-15deg)",
          }}
        />
      )}

      {/* ========== CHANDELIER ========== */}
      <div className="depth-layer depth-farthest absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
        {/* Chain / rod */}
        <div
          className="mx-auto w-px h-16"
          style={{ background: "linear-gradient(180deg, oklch(0.35 0.04 55 / 60%), oklch(0.45 0.06 55 / 40%))" }}
        />
        <svg width="140" height="60" viewBox="0 0 140 60" className="-mt-1">
          {/* Central body */}
          <ellipse cx="70" cy="25" rx="18" ry="10" fill="oklch(0.38 0.06 55)" stroke="oklch(0.50 0.08 55 / 50%)" strokeWidth="1" />
          {/* Arms */}
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const ex = 70 + Math.cos(rad) * 55;
            const ey = 30 + Math.sin(rad) * 12;
            return (
              <g key={a}>
                <path
                  d={`M70 25 Q${70 + Math.cos(rad) * 28} ${25 + Math.sin(rad) * 5} ${ex} ${ey}`}
                  stroke="oklch(0.45 0.06 55 / 60%)"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* Candle cup */}
                <rect x={ex - 4} y={ey - 2} width="8" height="5" rx="1" fill="oklch(0.42 0.06 55)" />
                {/* Flame glow */}
                <circle
                  cx={ex}
                  cy={ey - 8}
                  r={5 + candleGlow * 2}
                  fill={`oklch(0.92 0.14 55 / ${candleGlow * 0.25})`}
                  style={{ animation: `flicker ${2.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
                />
                <ellipse
                  cx={ex}
                  cy={ey - 8}
                  rx="2"
                  ry="3.5"
                  fill={`oklch(0.95 0.16 55 / ${candleGlow * 0.9})`}
                  style={{ animation: `flicker ${2 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                />
              </g>
            );
          })}
          {/* Crystal droplets */}
          {[-35, -18, 0, 18, 35].map((x, i) => (
            <ellipse
              key={i}
              cx={70 + x}
              cy={52}
              rx="1.2"
              ry="3"
              fill="oklch(0.90 0.04 240 / 35%)"
              style={{ animation: `gentle-bob ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>
        {/* Warm chandelier glow */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center top, oklch(0.88 0.12 55 / ${candleGlow * 0.15}), transparent 70%)`,
            animation: "flicker 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* ========== DINING TABLE ========== */}
      <div
        className="depth-layer depth-near absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "18%", width: "52%", transform: "translateX(-50%) translateZ(30px)" }}
      >
        {/* Table top — dark wood with grain */}
        <div
          className="relative w-full rounded-sm shadow-2xl"
          style={{
            height: 18,
            background: `
              repeating-linear-gradient(90deg, oklch(0.22 0.04 25) 0 18px, oklch(0.20 0.04 20) 18px 19px, oklch(0.23 0.05 30) 19px 38px, oklch(0.21 0.04 22) 38px 39px),
              linear-gradient(180deg, oklch(0.24 0.05 25), oklch(0.20 0.04 20))
            `,
            borderTop: "2px solid oklch(0.30 0.05 30 / 40%)",
            borderLeft: "2px solid oklch(0.26 0.04 25 / 30%)",
            borderRight: "2px solid oklch(0.18 0.03 20 / 30%)",
          }}
        >
          {/* Candlelight reflection on table */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: 0,
              background: `radial-gradient(ellipse at 50% 50%, oklch(0.80 0.12 55 / ${candleGlow * 0.08}), transparent 60%)`,
              animation: "flicker 2.8s ease-in-out infinite",
            }}
          />
        </div>

        {/* Table legs */}
        <div className="absolute -bottom-28 left-[8%] w-2 h-28 rounded-b" style={{ background: "linear-gradient(180deg, oklch(0.20 0.04 22), oklch(0.16 0.03 18))" }} />
        <div className="absolute -bottom-28 right-[8%] w-2 h-28 rounded-b" style={{ background: "linear-gradient(180deg, oklch(0.20 0.04 22), oklch(0.16 0.03 18))" }} />
        {/* Decorative table edge molding */}
        <div className="absolute -bottom-1 left-0 right-0 h-1" style={{ background: "oklch(0.28 0.05 28 / 40%)" }} />

        {/* ---- TABLE CENTERPIECE: Candelabra ---- */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 pointer-events-none">
          <svg width="80" height="60" viewBox="0 0 80 60">
            {/* Base */}
            <ellipse cx="40" cy="58" rx="16" ry="3" fill="oklch(0.42 0.06 55)" />
            {/* Stem */}
            <rect x="38" y="20" width="4" height="38" rx="2" fill="oklch(0.40 0.06 55)" />
            {/* Left arm */}
            <path d="M40 22 Q20 18 12 12" stroke="oklch(0.42 0.06 55)" strokeWidth="2" fill="none" />
            {/* Right arm */}
            <path d="M40 22 Q60 18 68 12" stroke="oklch(0.42 0.06 55)" strokeWidth="2" fill="none" />
            {/* Center candle */}
            <rect x="37" y="8" width="6" height="14" rx="1" fill="oklch(0.92 0.04 80)" />
            <ellipse cx="40" cy="5" rx="2.5" ry="4" fill={`oklch(0.95 0.16 55 / ${candleGlow})`} style={{ animation: "flicker 2s ease-in-out infinite" }} />
            {/* Left candle */}
            <rect x="9" y="2" width="6" height="12" rx="1" fill="oklch(0.90 0.04 80)" />
            <ellipse cx="12" cy="0" rx="2" ry="3.5" fill={`oklch(0.95 0.14 55 / ${candleGlow})`} style={{ animation: "flicker 2.3s ease-in-out infinite", animationDelay: "0.4s" }} />
            {/* Right candle */}
            <rect x="65" y="2" width="6" height="12" rx="1" fill="oklch(0.90 0.04 80)" />
            <ellipse cx="68" cy="0" rx="2" ry="3.5" fill={`oklch(0.95 0.14 55 / ${candleGlow})`} style={{ animation: "flicker 1.8s ease-in-out infinite", animationDelay: "0.7s" }} />
          </svg>
          {/* Warm light pool around candelabra */}
          <div
            className="absolute -inset-16 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, oklch(0.85 0.14 55 / ${candleGlow * 0.18}), transparent 65%)`,
              animation: "flicker 3s ease-in-out infinite",
            }}
          />
        </div>

        {/* ---- PLATE: left (for Noah) ---- */}
        <div className="absolute -top-3 left-[18%]" style={{ transform: "translateZ(10px)" }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <ellipse cx="24" cy="24" rx="22" ry="18" fill="oklch(0.88 0.02 80)" stroke="oklch(0.75 0.02 80 / 40%)" strokeWidth="1" />
            <ellipse cx="24" cy="24" rx="16" ry="13" fill="none" stroke="oklch(0.70 0.02 80 / 30%)" strokeWidth="0.5" />
            <ellipse cx="24" cy="24" rx="10" ry="8" fill="oklch(0.90 0.02 80 / 30%)" />
          </svg>
        </div>

        {/* ---- PLATE: right (for Khadija) ---- */}
        <div className="absolute -top-3 right-[18%]" style={{ transform: "translateZ(10px)" }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <ellipse cx="24" cy="24" rx="22" ry="18" fill="oklch(0.88 0.02 80)" stroke="oklch(0.75 0.02 80 / 40%)" strokeWidth="1" />
            <ellipse cx="24" cy="24" rx="16" ry="13" fill="none" stroke="oklch(0.70 0.02 80 / 30%)" strokeWidth="0.5" />
            <ellipse cx="24" cy="24" rx="10" ry="8" fill="oklch(0.90 0.02 80 / 30%)" />
          </svg>
        </div>

        {/* ---- GLASS: left ---- */}
        <div className="absolute -top-10 left-[28%]">
          <svg width="20" height="32" viewBox="0 0 20 32">
            <path d="M5 2 Q6 12 10 14 Q14 12 15 2 Z" fill="oklch(0.92 0.06 280 / 15%)" stroke="oklch(0.90 0.04 240 / 25%)" strokeWidth="0.5" />
            <rect x="9" y="14" width="2" height="10" fill="oklch(0.85 0.03 240 / 20%)" />
            <ellipse cx="10" cy="26" rx="5" ry="2" fill="oklch(0.85 0.03 240 / 15%)" />
            {/* Wine */}
            <path d="M6 5 Q7 10 10 12 Q13 10 14 5 Z" fill="oklch(0.45 0.14 10 / 70%)" />
          </svg>
        </div>

        {/* ---- GLASS: right ---- */}
        <div className="absolute -top-10 right-[28%]">
          <svg width="20" height="32" viewBox="0 0 20 32">
            <path d="M5 2 Q6 12 10 14 Q14 12 15 2 Z" fill="oklch(0.92 0.06 280 / 15%)" stroke="oklch(0.90 0.04 240 / 25%)" strokeWidth="0.5" />
            <rect x="9" y="14" width="2" height="10" fill="oklch(0.85 0.03 240 / 20%)" />
            <ellipse cx="10" cy="26" rx="5" ry="2" fill="oklch(0.85 0.03 240 / 15%)" />
            <path d="M6 5 Q7 10 10 12 Q13 10 14 5 Z" fill="oklch(0.45 0.14 10 / 70%)" />
          </svg>
        </div>

        {/* ---- WINE BOTTLE ---- */}
        <div className="absolute -top-20 left-[38%]">
          <svg width="24" height="52" viewBox="0 0 24 52" style={{ animation: "gentle-bob 5s ease-in-out infinite" }}>
            {/* Body */}
            <rect x="5" y="20" width="14" height="28" rx="3" fill="oklch(0.18 0.04 155)" stroke="oklch(0.25 0.05 155 / 40%)" strokeWidth="0.5" />
            {/* Neck */}
            <rect x="8" y="6" width="8" height="16" rx="3" fill="oklch(0.18 0.04 155)" />
            {/* Cork / cap */}
            <rect x="9" y="2" width="6" height="6" rx="1" fill="oklch(0.40 0.06 55)" />
            {/* Label */}
            <rect x="7" y="28" width="10" height="8" rx="1" fill="oklch(0.88 0.04 80 / 80%)" />
            <line x1="9" y1="31" x2="15" y2="31" stroke="oklch(0.30 0.04 350 / 40%)" strokeWidth="0.5" />
            <line x1="9" y1="33" x2="13" y2="33" stroke="oklch(0.30 0.04 350 / 30%)" strokeWidth="0.5" />
            {/* Glass reflection */}
            <rect x="7" y="22" width="2" height="18" rx="1" fill="oklch(0.90 0.04 240 / 8%)" />
          </svg>
        </div>

        {/* ---- FLOWERS IN VASE ---- */}
        <div
          className="absolute -top-28 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ animation: "sway 5s ease-in-out infinite", transformOrigin: "center bottom" }}
        >
          <svg width="50" height="60" viewBox="0 0 50 60">
            {/* Vase */}
            <path d="M17 40 Q15 48 18 56 L32 56 Q35 48 33 40 Z" fill="oklch(0.55 0.10 355)" stroke="oklch(0.60 0.12 355 / 50%)" strokeWidth="0.5" />
            <ellipse cx="25" cy="40" rx="8" ry="3" fill="oklch(0.58 0.10 355)" />
            {/* Stems */}
            <path d="M25 40 Q22 30 15 18" stroke="oklch(0.42 0.12 155)" strokeWidth="1.5" fill="none" />
            <path d="M25 40 Q28 28 35 16" stroke="oklch(0.40 0.12 150)" strokeWidth="1.5" fill="none" />
            <path d="M25 40 Q25 28 25 14" stroke="oklch(0.44 0.12 152)" strokeWidth="1.5" fill="none" />
            {/* Flowers — roses in warm tones */}
            {[
              { cx: 15, cy: 16, hue: 350, r: 5 },
              { cx: 35, cy: 14, hue: 10, r: 5.5 },
              { cx: 25, cy: 12, hue: 355, r: 6 },
              { cx: 18, cy: 22, hue: 5, r: 4 },
              { cx: 32, cy: 20, hue: 345, r: 4.5 },
            ].map((f, i) => (
              <g key={i} style={{ animation: `sway ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s`, transformOrigin: `${f.cx}px ${f.cy + 5}px` }}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse
                    key={a}
                    cx={f.cx}
                    cy={f.cy - f.r * 0.6}
                    rx={f.r * 0.5}
                    ry={f.r}
                    fill={`oklch(0.72 0.14 ${f.hue})`}
                    transform={`rotate(${a} ${f.cx} ${f.cy})`}
                  />
                ))}
                <circle cx={f.cx} cy={f.cy} r={f.r * 0.4} fill={`oklch(0.80 0.12 ${f.hue})`} />
              </g>
            ))}
            {/* Small leaves */}
            <ellipse cx="12" cy="28" rx="4" ry="2" fill="oklch(0.40 0.10 150)" transform="rotate(-30 12 28)" />
            <ellipse cx="38" cy="26" rx="4" ry="2" fill="oklch(0.42 0.10 148)" transform="rotate(25 38 26)" />
          </svg>
        </div>

        {/* ---- SMALL BREAD PLATE ---- */}
        <div className="absolute -top-1 left-[48%]">
          <svg width="24" height="16" viewBox="0 0 24 16">
            <ellipse cx="12" cy="8" rx="11" ry="7" fill="oklch(0.82 0.03 80)" stroke="oklch(0.70 0.02 80 / 30%)" strokeWidth="0.5" />
            <ellipse cx="12" cy="7" rx="6" ry="3" fill="oklch(0.75 0.08 55 / 60%)" />
          </svg>
        </div>
      </div>

      {/* ========== CHAIR: left (Noah's) ========== */}
      <div
        className="depth-layer depth-near absolute"
        style={{ bottom: "22%", left: "16%", transform: "translateZ(40px)" }}
      >
        <svg width="70" height="100" viewBox="0 0 70 100">
          {/* Chair back */}
          <rect x="10" y="0" width="50" height="55" rx="6" fill="oklch(0.22 0.04 355)" stroke="oklch(0.28 0.05 355 / 40%)" strokeWidth="1" />
          {/* Back cushion */}
          <rect x="14" y="4" width="42" height="48" rx="4" fill="oklch(0.48 0.10 350)" opacity="0.85" />
          {/* Cushion quilting lines */}
          <line x1="35" y1="8" x2="35" y2="48" stroke="oklch(0.44 0.10 350 / 50%)" strokeWidth="0.5" />
          <line x1="18" y1="26" x2="52" y2="26" stroke="oklch(0.44 0.10 350 / 50%)" strokeWidth="0.5" />
          {/* Seat */}
          <rect x="5" y="50" width="60" height="14" rx="3" fill="oklch(0.25 0.04 355)" />
          {/* Seat cushion */}
          <rect x="8" y="48" width="54" height="10" rx="5" fill="oklch(0.50 0.10 345)" opacity="0.8" />
          {/* Arm rests */}
          <rect x="0" y="30" width="8" height="35" rx="4" fill="oklch(0.24 0.04 355)" />
          <rect x="62" y="30" width="8" height="35" rx="4" fill="oklch(0.24 0.04 355)" />
          {/* Legs */}
          <line x1="12" y1="64" x2="8" y2="98" stroke="oklch(0.18 0.03 350)" strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="64" x2="62" y2="98" stroke="oklch(0.18 0.03 350)" strokeWidth="3" strokeLinecap="round" />
          {/* Decorative leg carving */}
          <circle cx="10" cy="82" r="2" fill="oklch(0.22 0.04 355 / 60%)" />
          <circle cx="60" cy="82" r="2" fill="oklch(0.22 0.04 355 / 60%)" />
        </svg>
      </div>

      {/* ========== CHAIR: right (Khadija's) ========== */}
      <div
        className="depth-layer depth-near absolute"
        style={{ bottom: "22%", right: "16%", transform: "translateZ(40px)" }}
      >
        <svg width="70" height="100" viewBox="0 0 70 100">
          <rect x="10" y="0" width="50" height="55" rx="6" fill="oklch(0.22 0.04 355)" stroke="oklch(0.28 0.05 355 / 40%)" strokeWidth="1" />
          <rect x="14" y="4" width="42" height="48" rx="4" fill="oklch(0.52 0.10 10)" opacity="0.85" />
          <line x1="35" y1="8" x2="35" y2="48" stroke="oklch(0.48 0.10 10 / 50%)" strokeWidth="0.5" />
          <line x1="18" y1="26" x2="52" y2="26" stroke="oklch(0.48 0.10 10 / 50%)" strokeWidth="0.5" />
          <rect x="5" y="50" width="60" height="14" rx="3" fill="oklch(0.25 0.04 355)" />
          <rect x="8" y="48" width="54" height="10" rx="5" fill="oklch(0.55 0.10 5)" opacity="0.8" />
          <rect x="0" y="30" width="8" height="35" rx="4" fill="oklch(0.24 0.04 355)" />
          <rect x="62" y="30" width="8" height="35" rx="4" fill="oklch(0.24 0.04 355)" />
          <line x1="12" y1="64" x2="8" y2="98" stroke="oklch(0.18 0.03 350)" strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="64" x2="62" y2="98" stroke="oklch(0.18 0.03 350)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="10" cy="82" r="2" fill="oklch(0.22 0.04 355 / 60%)" />
          <circle cx="60" cy="82" r="2" fill="oklch(0.22 0.04 355 / 60%)" />
        </svg>
      </div>

      {/* ========== SIDEBOARD / BUFFET ========== */}
      <button
        onClick={() => onOpen("letter")}
        title="sideboard — leave a letter"
        className="depth-layer depth-mid group absolute right-[5%] bottom-[12%] w-56 h-32 rounded-sm shadow-2xl transition-all duration-500 hover:brightness-110 hover:scale-[1.02]"
        style={{
          background: "linear-gradient(180deg, oklch(0.24 0.05 25), oklch(0.19 0.04 20))",
          transform: "translateZ(20px)",
        }}
      >
        {/* Top surface */}
        <div
          className="absolute inset-x-0 top-0 h-3 rounded-t-sm"
          style={{
            background: "linear-gradient(180deg, oklch(0.30 0.05 30), oklch(0.26 0.05 25))",
          }}
        />
        {/* Drawer lines */}
        <div className="absolute left-3 right-3 top-10 h-px" style={{ background: "oklch(0.30 0.05 25 / 40%)" }} />
        <div className="absolute left-3 right-3 top-20 h-px" style={{ background: "oklch(0.30 0.05 25 / 40%)" }} />
        {/* Drawer knobs */}
        <div className="absolute left-1/2 -translate-x-1/2 top-7 w-2 h-2 rounded-full" style={{ background: "oklch(0.50 0.08 55 / 60%)" }} />
        <div className="absolute left-1/2 -translate-x-1/2 top-16 w-2 h-2 rounded-full" style={{ background: "oklch(0.50 0.08 55 / 60%)" }} />
        <div className="absolute left-1/2 -translate-x-1/2 top-[72px] w-2 h-2 rounded-full" style={{ background: "oklch(0.50 0.08 55 / 60%)" }} />
        {/* Legs */}
        <div className="absolute -bottom-4 left-2 w-1.5 h-4 rounded-b" style={{ background: "oklch(0.18 0.04 22)" }} />
        <div className="absolute -bottom-4 right-2 w-1.5 h-4 rounded-b" style={{ background: "oklch(0.18 0.04 22)" }} />
        {/* Decorative items on top */}
        {/* Decanter */}
        <svg className="absolute -top-8 left-4" width="20" height="24" viewBox="0 0 20 24">
          <path d="M7 8 Q6 16 5 18 L15 18 Q14 16 13 8 Z" fill="oklch(0.20 0.04 250 / 40%)" stroke="oklch(0.80 0.03 240 / 20%)" strokeWidth="0.5" />
          <rect x="8" y="2" width="4" height="8" rx="2" fill="oklch(0.20 0.04 250 / 30%)" />
          <path d="M7 12 Q8 14 10 15 Q12 14 13 12 Z" fill="oklch(0.45 0.14 10 / 50%)" />
        </svg>
        {/* Small book */}
        <div
          className="absolute -top-3 right-4 w-8 h-5 rounded-sm"
          style={{ background: "oklch(0.45 0.10 350)", transform: "rotate(-5deg)" }}
        />
      </button>

      {/* ========== FRAMED MEMORIES ON WALL ========== */}
      <div className="depth-layer depth-mid absolute left-[32%] top-[10%] flex gap-5">
        {items.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            onClick={() => onView(m)}
            title={m.title}
            className="group relative h-24 w-20 rounded-sm border-2 border-[oklch(0.40_0.06_55)] shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-[0_0_25px_oklch(0.88_0.10_55_/_25%)]"
            style={{
              background: `linear-gradient(135deg, oklch(${0.38 + (i % 3) * 0.06} 0.10 ${350 + i * 18}), oklch(0.28 0.06 10))`,
              transform: `perspective(600px) rotateY(${i % 2 ? -3 : 3}deg) rotateX(1.5deg)`,
              animation: `card-3d-hover ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            {/* Inner mat / frame highlight */}
            <div className="absolute inset-1.5 rounded-sm border border-white/[0.06]" />
            <span className="absolute inset-0 flex items-center justify-center text-foreground/50 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ✦
            </span>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] italic text-foreground/60 opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow">
              {m.title}
            </span>
          </button>
        ))}
        {items.length === 0 && (
          <div className="h-24 w-56 flex items-center justify-center rounded-sm border border-dashed border-primary/20 text-xs italic text-muted-foreground/50 serif">
            click anywhere to leave a memory of our meals together
          </div>
        )}
      </div>

      {/* ========== FLOATING DUST PARTICLES ========== */}
      <div
        className="pointer-events-none absolute inset-0 depth-layer depth-mid"
        style={{ animation: "parallax-sway-x 28s ease-in-out infinite" }}
      >
        {DUST_PARTICLES.map((p, i) => (
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
                    ? `oklch(0.85 0.12 55 / ${candleGlow * 45}%)`
                    : i % 3 === 1
                      ? `oklch(0.80 0.10 25 / ${candleGlow * 35}%)`
                      : `oklch(0.78 0.08 15 / ${candleGlow * 30}%)`,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animation: `dust-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ========== CANDELABRA ON SIDEBOARD ========== */}
      <div
        className="depth-layer depth-near absolute pointer-events-none"
        style={{ right: "8%", bottom: "28%", transform: "translateZ(25px)" }}
      >
        <svg width="36" height="50" viewBox="0 0 36 50">
          {/* Base */}
          <ellipse cx="18" cy="48" rx="10" ry="2.5" fill="oklch(0.40 0.06 55)" />
          {/* Stem */}
          <rect x="16.5" y="18" width="3" height="30" rx="1.5" fill="oklch(0.38 0.06 55)" />
          {/* Left arm */}
          <path d="M18 20 Q8 16 4 10" stroke="oklch(0.40 0.06 55)" strokeWidth="1.5" fill="none" />
          {/* Right arm */}
          <path d="M18 20 Q28 16 32 10" stroke="oklch(0.40 0.06 55)" strokeWidth="1.5" fill="none" />
          {/* Center candle */}
          <rect x="16" y="8" width="4" height="12" rx="1" fill="oklch(0.90 0.04 80)" />
          <ellipse cx="18" cy="5" rx="2" ry="3.5" fill={`oklch(0.95 0.16 55 / ${candleGlow})`} style={{ animation: "flicker 2s ease-in-out infinite" }} />
          {/* Left candle */}
          <rect x="2" y="4" width="4" height="8" rx="1" fill="oklch(0.88 0.04 80)" />
          <ellipse cx="4" cy="2" rx="1.5" ry="3" fill={`oklch(0.95 0.14 55 / ${candleGlow})`} style={{ animation: "flicker 2.2s ease-in-out infinite", animationDelay: "0.5s" }} />
          {/* Right candle */}
          <rect x="30" y="4" width="4" height="8" rx="1" fill="oklch(0.88 0.04 80)" />
          <ellipse cx="32" cy="2" rx="1.5" ry="3" fill={`oklch(0.95 0.14 55 / ${candleGlow})`} style={{ animation: "flicker 1.9s ease-in-out infinite", animationDelay: "0.8s" }} />
        </svg>
      </div>

      {/* ========== CANDLELIGHT WARM POOLS ON WALL ========== */}
      <div
        className="depth-layer depth-farthest absolute pointer-events-none"
        style={{
          left: "30%",
          top: "15%",
          width: 300,
          height: 300,
          background: `radial-gradient(circle, oklch(0.85 0.14 55 / ${candleGlow * 0.06}), transparent 60%)`,
          animation: "flicker 3.5s ease-in-out infinite",
        }}
      />
      <div
        className="depth-layer depth-farthest absolute pointer-events-none"
        style={{
          right: "20%",
          top: "20%",
          width: 250,
          height: 250,
          background: `radial-gradient(circle, oklch(0.80 0.12 55 / ${candleGlow * 0.05}), transparent 55%)`,
          animation: "flicker 4s ease-in-out 1s infinite",
        }}
      />

      {/* ========== FLOOR ========== */}
      <div
        className="depth-layer depth-near absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "16%",
          background: `
            linear-gradient(0deg, oklch(0.14 0.03 350) 0%, oklch(0.18 0.04 350) 50%, oklch(0.20 0.04 355) 100%)
          `,
        }}
      />
      {/* Floor wood planks */}
      <div
        className="depth-layer depth-near absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "16%",
          background: `repeating-linear-gradient(90deg, oklch(0.16 0.03 350) 0 80px, oklch(0.14 0.03 348) 80px 81px)`,
          opacity: 0.5,
        }}
      />
      {/* Table shadow on floor */}
      <div
        className="depth-layer depth-near absolute pointer-events-none"
        style={{
          bottom: "4%",
          left: "22%",
          width: "56%",
          height: 8,
          background: `radial-gradient(ellipse, oklch(0 0 0 / 35%), transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(6px)",
        }}
      />

      {/* ========== RUG / CARPET ========== */}
      <div
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "60%",
          height: 18,
          background: "linear-gradient(90deg, transparent 5%, oklch(0.35 0.06 355 / 35%) 20%, oklch(0.40 0.08 10 / 45%) 50%, oklch(0.35 0.06 355 / 35%) 80%, transparent 95%)",
          borderRadius: "50%",
          filter: "blur(3px)",
        }}
      />

      {/* ========== CLICK TO ADD MEMORY ========== */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          if (y < 0.82) onOpen("memory");
        }}
        className="absolute inset-0 cursor-crosshair z-10"
      />

      {/* ========== BOTTOM PROMPT ========== */}
      <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center serif text-sm italic text-foreground/60 drop-shadow-lg" style={{ animation: "breathe 5s ease-in-out infinite" }}>
        click anywhere to leave a memory of our meals together
      </p>
    </div>
  );
}
