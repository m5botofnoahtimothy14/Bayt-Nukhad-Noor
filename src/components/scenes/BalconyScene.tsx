import { useMemo, useState } from "react";
import { useMemories, type Memory } from "@/components/world/memories";
import { SceneModelOverlay, TelescopeModel, LanternModel, HouseplantModel } from "@/components/models";

type Props = {
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

export function BalconyScene({ onAdd, onView }: Props) {
  const { items } = useMemories("balcony");
  const [telescopeActive, setTelescopeActive] = useState(false);

  const stars = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => ({
        x: (i * 3.7 + (i * 13) % 100) % 100,
        y: (i * 2.9 + (i * 7) % 100) % 85,
        s: 0.4 + ((i * 11) % 10) * 0.18,
        d: 2 + ((i * 7) % 5),
        delay: (i * 0.03) % 3,
        bright: 0.3 + ((i * 17) % 10) * 0.07,
      })),
    [],
  );

  const hangingLights = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        x: 8 + i * 12,
        y: 18 + ((i * 3) % 8),
        size: 4 + (i % 3) * 1.5,
        dur: 4 + ((i * 2) % 4),
      })),
    [],
  );

  return (
    <div className="scene scene-container scene-3d">
      {/* Night sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.18 0.06 270) 0%, oklch(0.06 0.03 260) 60%, oklch(0.03 0.02 250) 100%)",
        }}
      />

      {/* Nebula wash */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 25% 20%, oklch(0.25 0.10 300 / 10%), transparent 40%),
          radial-gradient(ellipse at 70% 15%, oklch(0.20 0.08 15 / 8%), transparent 35%),
          radial-gradient(ellipse at 50% 50%, oklch(0.15 0.05 220 / 6%), transparent 50%)
        `,
      }} />

      {/* Stars - 3 depth layers */}
      <div className="depth-layer depth-farthest absolute inset-0" style={{ animation: "parallax-sway-x 40s ease-in-out infinite" }}>
        {stars.slice(0, 100).map((s, i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.s * 0.7, height: s.s * 0.7,
            opacity: s.bright * 0.6,
            animation: `twinkle ${s.d + 1}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }} />
        ))}
      </div>
      <div className="depth-layer depth-mid absolute inset-0" style={{ animation: "parallax-sway-x 30s ease-in-out infinite reverse" }}>
        {stars.slice(100, 170).map((s, i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.s, height: s.s,
            opacity: s.bright * 0.8,
            animation: `twinkle ${s.d}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }} />
        ))}
      </div>
      <div className="depth-layer depth-near absolute inset-0">
        {stars.slice(170).map((s, i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.s * 1.2, height: s.s * 1.2,
            opacity: s.bright,
            animation: `twinkle ${s.d}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }} />
        ))}
      </div>

      {/* Moon */}
      <div className="depth-layer depth-near absolute right-[12%] top-[8%] h-24 w-24 rounded-full" style={{
        background: "radial-gradient(circle at 35% 35%, oklch(0.98 0.03 20), oklch(0.88 0.05 20) 70%)",
        boxShadow: "0 0 50px oklch(0.92 0.05 20 / 40%), 0 0 100px oklch(0.88 0.05 20 / 15%)",
        animation: "depth-pulse 18s ease-in-out infinite",
      }} />

      {/* Balcony floor */}
      <div className="depth-layer depth-near absolute inset-x-0 bottom-0" style={{ height: "55%" }}>
        {/* Floor planks */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(180deg, oklch(0.22 0.04 25) 0%, oklch(0.18 0.03 20) 100%),
            repeating-linear-gradient(90deg, oklch(0.20 0.04 22) 0 60px, oklch(0.17 0.03 20) 60px 61px)
          `,
          backgroundBlendMode: "overlay",
        }} />

        {/* Glass railing */}
        <div className="absolute inset-x-0 top-0 h-24" style={{
          background: "linear-gradient(180deg, oklch(0.85 0.02 200 / 6%), oklch(0.18 0.03 20 / 0%))",
          borderBottom: "2px solid oklch(0.85 0.02 200 / 10%)",
        }} />
        {/* Railing posts */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute top-0 h-24" style={{
            left: `${i * 9}%`,
            width: 2,
            background: "linear-gradient(180deg, oklch(0.80 0.02 200 / 12%), oklch(0.80 0.02 200 / 4%))",
          }} />
        ))}

        {/* Two chairs */}
        <div className="depth-layer depth-near absolute bottom-[30%] left-[25%]" style={{ animation: "parallax-sway-x 15s ease-in-out infinite" }}>
          <svg width="80" height="70" viewBox="0 0 80 70">
            {/* Chair back */}
            <rect x="5" y="0" width="30" height="45" rx="4" fill="oklch(0.30 0.04 20)" stroke="oklch(0.20 0.03 15)" strokeWidth="1" />
            {/* Seat */}
            <rect x="0" y="40" width="40" height="10" rx="3" fill="oklch(0.32 0.04 22)" />
            {/* Cushion */}
            <rect x="3" y="38" width="34" height="8" rx="4" fill="oklch(0.50 0.08 355)" opacity="0.7" />
            {/* Legs */}
            <line x1="5" y1="50" x2="3" y2="68" stroke="oklch(0.18 0.03 15)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="35" y1="50" x2="37" y2="68" stroke="oklch(0.18 0.03 15)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="depth-layer depth-near absolute bottom-[30%] right-[25%]" style={{ animation: "parallax-sway-x 15s ease-in-out 1s infinite reverse" }}>
          <svg width="80" height="70" viewBox="0 0 80 70">
            <rect x="5" y="0" width="30" height="45" rx="4" fill="oklch(0.30 0.04 20)" stroke="oklch(0.20 0.03 15)" strokeWidth="1" />
            <rect x="0" y="40" width="40" height="10" rx="3" fill="oklch(0.32 0.04 22)" />
            <rect x="3" y="38" width="34" height="8" rx="4" fill="oklch(0.50 0.08 10)" opacity="0.7" />
            <line x1="5" y1="50" x2="3" y2="68" stroke="oklch(0.18 0.03 15)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="35" y1="50" x2="37" y2="68" stroke="oklch(0.18 0.03 15)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Small table between chairs */}
        <div className="depth-layer depth-near absolute bottom-[28%] left-1/2 -translate-x-1/2">
          <svg width="60" height="40" viewBox="0 0 60 40">
            <ellipse cx="30" cy="10" rx="28" ry="10" fill="oklch(0.25 0.03 20)" stroke="oklch(0.35 0.04 55 / 30%)" strokeWidth="0.5" />
            <line x1="30" y1="18" x2="30" y2="38" stroke="oklch(0.20 0.03 15)" strokeWidth="2" />
            {/* Cup on table */}
            <rect x="22" y="2" width="8" height="7" rx="1" fill="oklch(0.55 0.06 350 / 50%)" />
          </svg>
        </div>

        {/* Telescope - 3D model */}
        <button
          onClick={() => setTelescopeActive(!telescopeActive)}
          className="depth-layer depth-near absolute bottom-[25%] right-[10%] transition-all duration-500 hover:scale-105 pointer-events-auto"
          title="Look through the telescope"
        >
          <SceneModelOverlay>
            <TelescopeModel position={[0, -1.5, 0]} scale={0.8} />
          </SceneModelOverlay>
        </button>

        {/* 3D Lanterns */}
        {hangingLights.map((l, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            left: `${l.x}%`, top: `${l.y}%`,
            animation: `lantern-float ${l.dur}s ease-in-out ${i * 0.5}s infinite`,
          }}>
            <SceneModelOverlay>
              <LanternModel position={[0, 0, 0]} scale={0.3 + (i % 3) * 0.1} />
            </SceneModelOverlay>
          </div>
        ))}

        {/* 3D Potted plants */}
        <div className="depth-layer depth-near absolute bottom-[15%] left-[8%] pointer-events-none">
          <SceneModelOverlay>
            <HouseplantModel position={[0, -1, 0]} scale={0.5} />
          </SceneModelOverlay>
        </div>

        <div className="depth-layer depth-near absolute bottom-[15%] right-[8%] pointer-events-none">
          <SceneModelOverlay>
            <HouseplantModel position={[0, -1, 0]} scale={0.4} rotation={[0, Math.PI / 4, 0]} />
          </SceneModelOverlay>
        </div>

        {/* Telescope view overlay when active */}
        {telescopeActive && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ animation: "fade-in 0.5s ease-out both" }}
          >
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white/10" style={{
              boxShadow: "0 0 60px oklch(0 0 0 / 60%), inset 0 0 40px oklch(0 0 0 / 30%)",
            }}>
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at 50% 40%, oklch(0.20 0.08 270), oklch(0.06 0.03 260))",
              }} />
              {/* Zoomed stars */}
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className="absolute rounded-full bg-white" style={{
                  width: 1.5 + (i % 4) * 0.5,
                  height: 1.5 + (i % 4) * 0.5,
                  left: `${(i * 2.5) % 100}%`,
                  top: `${(i * 3.1) % 100}%`,
                  animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
              {/* Constellation */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <line x1="30" y1="25" x2="45" y2="35" stroke="oklch(0.8 0.10 55 / 30%)" strokeWidth="0.3" />
                <line x1="45" y1="35" x2="55" y2="30" stroke="oklch(0.8 0.10 55 / 30%)" strokeWidth="0.3" />
                <line x1="55" y1="30" x2="65" y2="40" stroke="oklch(0.8 0.10 55 / 30%)" strokeWidth="0.3" />
                <circle cx="30" cy="25" r="1.5" fill="oklch(0.95 0.12 15)" />
                <circle cx="45" cy="35" r="1.2" fill="oklch(0.95 0.10 55)" />
                <circle cx="55" cy="30" r="1.8" fill="oklch(0.95 0.12 15)" />
                <circle cx="65" cy="40" r="1" fill="oklch(0.95 0.10 55)" />
              </svg>
              <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] serif italic text-white/50">
                Al-Nūkhad constellation
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Memory stars in the sky */}
      {items.map((m) => (
        <button key={m.id} onClick={() => onView(m)} title={m.title}
          className="depth-layer depth-near group absolute" style={{
            left: `${(m.x ?? 0.5) * 100}%`, top: `${(m.y ?? 0.3) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}>
          <span className="block text-2xl transition-all duration-300 group-hover:scale-150" style={{
            color: "oklch(0.95 0.14 15)",
            animation: "twinkle 3s ease-in-out infinite",
            filter: "drop-shadow(0 0 8px oklch(0.9 0.14 15 / 60%))",
          }}>✦</span>
          <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}

      {/* Click sky to name a star */}
      <button onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onAdd({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
      }} className="absolute inset-x-0 top-[5%] bottom-[50%] cursor-crosshair" />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        {telescopeActive ? "click the sky to name a star" : "click the telescope to gaze at the stars"}
      </p>
    </div>
  );
}
