import { useMemo } from "react";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

function Tree({ x, scale, depth }: { x: number; scale: number; depth: number }) {
  const dark = 0.06 + depth * 0.04;
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
        <rect
          x="82"
          y="230"
          width="16"
          height="150"
          fill={`oklch(${dark + 0.04} 0.04 350)`}
          rx="3"
        />
        <ellipse cx="90" cy="145" rx="82" ry="135" fill={`oklch(${dark} 0.10 155)`} />
        <ellipse cx="58" cy="185" rx="58" ry="105" fill={`oklch(${dark + 0.02} 0.11 150)`} />
        <ellipse cx="122" cy="185" rx="58" ry="105" fill={`oklch(${dark + 0.02} 0.11 150)`} />
        <ellipse cx="90" cy="120" rx="45" ry="70" fill={`oklch(${dark + 0.03} 0.10 155)`} />
      </svg>
    </div>
  );
}

const TREE_POSITIONS = [
  { x: 0.08, scale: 0.55, depth: 5 },
  { x: 0.22, scale: 0.7, depth: 4 },
  { x: 0.38, scale: 0.85, depth: 3 },
  { x: 0.58, scale: 1.0, depth: 2 },
  { x: 0.75, scale: 0.9, depth: 3 },
  { x: 0.92, scale: 0.75, depth: 4 },
];

export function ForestScene({ onAdd, onView }: Props) {
  const { items } = useMemories("forest");

  const fireflies = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        x: (i * 2.8 + ((i * 11) % 100)) % 100,
        y: 25 + ((i * 4.3 + ((i * 7) % 60)) % 65),
        d: 5 + ((i * 3) % 8),
        del: (i * 0.7) % 6,
        size: 1.2 + (i % 3) * 0.4,
      })),
    [],
  );

  return (
    <div
      className="scene scene-container scene-3d"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.12 0.05 200) 0%, oklch(0.08 0.04 180) 50%, oklch(0.06 0.03 160) 100%)",
      }}
    >
      {/* Atmospheric fog layers */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, oklch(0.10 0.04 155 / 30%) 0%, transparent 40%, oklch(0.12 0.05 200 / 15%) 100%)",
          animation: "parallax-sway-x 25s ease-in-out infinite",
        }}
      />

      {/* === DEPTH: Background trees === */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{ animation: "parallax-sway-x 30s ease-in-out infinite" }}
      >
        {TREE_POSITIONS.filter((t) => t.depth >= 4).map((t, i) => (
          <Tree key={i} x={t.x} scale={t.scale * 0.8} depth={t.depth} />
        ))}
      </div>

      {/* === DEPTH: Mid trees === */}
      <div
        className="depth-layer depth-mid absolute inset-0"
        style={{ animation: "parallax-sway-x 22s ease-in-out infinite reverse" }}
      >
        {TREE_POSITIONS.filter((t) => t.depth === 3).map((t, i) => (
          <Tree key={i} x={t.x} scale={t.scale * 0.9} depth={t.depth} />
        ))}
      </div>

      {/* === DEPTH: Fireflies === */}
      <div className="depth-layer depth-near absolute inset-0">
        {fireflies.map((f, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: f.size,
              height: f.size,
              background:
                i % 4 === 0
                  ? "oklch(0.95 0.16 15)"
                  : i % 4 === 1
                    ? "oklch(0.90 0.14 55)"
                    : "oklch(0.92 0.12 100)",
              boxShadow:
                i % 4 === 0
                  ? "0 0 10px oklch(0.95 0.16 15), 0 0 20px oklch(0.90 0.14 15 / 50%)"
                  : i % 4 === 1
                    ? "0 0 10px oklch(0.90 0.14 55), 0 0 20px oklch(0.85 0.12 55 / 50%)"
                    : "0 0 10px oklch(0.92 0.12 100), 0 0 20px oklch(0.88 0.10 100 / 50%)",
              animation: `firefly ${f.d}s ease-in-out ${f.del}s infinite`,
            }}
          />
        ))}
      </div>

      {/* === DEPTH: Foreground trees === */}
      <div className="depth-layer depth-near absolute inset-0">
        {TREE_POSITIONS.filter((t) => t.depth <= 2).map((t, i) => (
          <Tree key={i} x={t.x} scale={t.scale} depth={t.depth} />
        ))}
      </div>

      {/* Memory glows hidden in the forest */}
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
                "radial-gradient(circle, oklch(0.9 0.14 15 / 80%), oklch(0.85 0.12 25 / 30%) 50%, transparent 70%)",
              animation: "breathe 3s ease-in-out infinite",
              boxShadow: "0 0 15px oklch(0.9 0.14 15 / 40%)",
            }}
          />
          <span className="absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap text-xs italic text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 serif drop-shadow-lg">
            {m.title}
          </span>
        </button>
      ))}

      {/* Click anywhere */}
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onAdd({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
        }}
        className="absolute inset-0 cursor-crosshair"
      />

      <p className="pointer-events-none absolute inset-x-0 bottom-20 text-center serif text-sm italic text-foreground/70 drop-shadow-lg">
        click anywhere to hide a memory among the trees
      </p>
    </div>
  );
}
