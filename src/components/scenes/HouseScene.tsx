import { useMemo } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

const BOOK_COLORS = Array.from({ length: 28 }, (_, i) => ({
  bg: `oklch(${0.35 + ((i * 7) % 10) * 0.04} ${0.08 + ((i * 3) % 5) * 0.02} ${(350 + i * 17) % 360})`,
  h: 60 + ((i * 13) % 40),
}));

export function HouseScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("house");
  const wallGlow = phase === "night" || phase === "dusk" ? 0.9 : 0.4;

  const dust = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: 10 + ((i * 7) % 80),
        top: 15 + ((i * 11) % 65),
        dx: -25 + ((i * 13) % 50),
        dy: -50 - ((i * 7) % 70),
        dur: 7 + ((i * 3) % 9),
        delay: (i * 1.5) % 12,
        size: 1 + (i % 3) * 0.6,
      })),
    [],
  );

  return (
    <div
      className="scene scene-container vignette-soft scene-3d"
      style={{
        background: `linear-gradient(180deg, oklch(0.18 0.04 350) 0%, oklch(0.14 0.03 5) 100%)`,
      }}
    >
      {/* === DEPTH LAYER: Far wall === */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{
          background: `
          repeating-linear-gradient(90deg, oklch(0.26 0.05 355) 0 95px, oklch(0.23 0.05 355) 95px 96px),
          radial-gradient(ellipse at 35% 40%, oklch(0.72 0.14 15 / ${wallGlow * 0.35}) 0%, transparent 55%),
          radial-gradient(ellipse at 65% 55%, oklch(0.68 0.12 25 / ${wallGlow * 0.15}) 0%, transparent 40%)
        `,
          animation: "gentle-rotate 20s ease-in-out infinite",
        }}
      />

      {/* Warm ambient wash */}
      <div
        className="depth-layer depth-farthest absolute bottom-0 left-1/2 -translate-x-1/2 w-[650px] h-[450px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, oklch(0.72 0.14 15 / 14%), transparent 70%)",
          animation: "flicker 3.5s ease-in-out infinite",
        }}
      />

      {/* Floating dust in 3D */}
      <div
        className="pointer-events-none absolute inset-0 depth-layer depth-mid"
        style={{ animation: "parallax-sway-x 25s ease-in-out infinite" }}
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
                    ? "oklch(0.8 0.12 355 / 50%)"
                    : i % 3 === 1
                      ? "oklch(0.82 0.10 25 / 40%)"
                      : "oklch(0.78 0.08 15 / 35%)",
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animation: `dust-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* === DEPTH LAYER: Window === */}
      <button
        onClick={() => onOpen("photo")}
        title="the window"
        className="depth-layer depth-near group absolute right-[7%] top-[10%] h-48 w-64 overflow-hidden rounded-xl border-4 border-[oklch(0.28_0.05_350)] shadow-2xl transition-all duration-700 hover:scale-[1.04] hover:shadow-[0_0_50px_oklch(0.72_0.14_15_/_25%)]"
        style={{ animation: "depth-pulse 12s ease-in-out infinite" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: SKY[phase],
            animation: "slow-pan 55s ease-in-out infinite alternate",
          }}
        />
        {phase === "night" &&
          Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: 1 + (i % 3) * 0.5,
                height: 1 + (i % 3) * 0.5,
                left: `${5 + ((i * 3.7) % 90)}%`,
                top: `${5 + ((i * 4.3) % 65)}%`,
                animation: `twinkle ${2 + ((i * 1.3) % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.3) % 3}s`,
              }}
            />
          ))}
        {(phase === "dawn" || phase === "dusk") &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                top: `${18 + i * 16}%`,
                left: `${-20 + i * 30}%`,
                width: 130 + i * 45,
                height: 22 + i * 6,
                background: `radial-gradient(ellipse, oklch(0.9 0.06 ${phase === "dawn" ? 40 : 20} / 35%), transparent 70%)`,
                animation: `cloud-drift ${28 + i * 12}s linear infinite`,
                animationDelay: `${i * -10}s`,
              }}
            />
          ))}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 46%, oklch(0.28 0.05 350) 46% 54%, transparent 54%), linear-gradient(0deg, transparent 46%, oklch(0.28 0.05 350) 46% 54%, transparent 54%)",
          }}
        />
        <div
          className="absolute left-0 top-0 h-full w-8"
          style={{
            background: "linear-gradient(90deg, oklch(0.5 0.08 355), oklch(0.35 0.06 355))",
            animation: "sway 7s ease-in-out infinite",
            transformOrigin: "top left",
          }}
        />
        <div
          className="absolute right-0 top-0 h-full w-8"
          style={{
            background: "linear-gradient(-90deg, oklch(0.5 0.08 355), oklch(0.35 0.06 355))",
            animation: "sway 8.5s ease-in-out infinite",
            transformOrigin: "top right",
          }}
        />
      </button>

      {/* === DEPTH LAYER: Bookshelf === */}
      <button
        onClick={() => onOpen("memory")}
        title="bookshelf — leave a memory"
        className="depth-layer depth-near group absolute left-[4%] top-[13%] h-60 w-48 rounded-sm shadow-2xl transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
        style={{
          background: "linear-gradient(180deg, oklch(0.30 0.05 350), oklch(0.20 0.04 355))",
        }}
      >
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="absolute left-2 right-2 flex items-end gap-[3px]"
            style={{ bottom: row * 52 + 8, height: 44 }}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm transition-all duration-300 group-hover:scale-y-[1.03]"
                style={{
                  background: BOOK_COLORS[row * 7 + i]?.bg ?? "oklch(0.35 0.05 350)",
                  height: `${BOOK_COLORS[row * 7 + i]?.h ?? 80}%`,
                  transitionDelay: `${i * 25}ms`,
                  boxShadow: "inset -2px 0 4px oklch(0 0 0 / 20%)",
                }}
              />
            ))}
          </div>
        ))}
        <div
          className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(0deg, oklch(0.12 0.03 350), transparent)" }}
        />
      </button>

      {/* === DEPTH LAYER: Fireplace (near, central) === */}
      <div
        className="depth-layer absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-64"
        style={{ transform: "translateX(-50%) translateZ(50px)" }}
      >
        <div
          className="absolute inset-x-0 top-6 h-4 rounded"
          style={{ background: "oklch(0.32 0.05 350)" }}
        />
        <div
          className="absolute inset-x-8 bottom-0 top-12 rounded-t-2xl overflow-hidden"
          style={{ background: "oklch(0.07 0.02 350)" }}
        >
          <div
            className="absolute inset-x-4 bottom-0 h-28"
            style={{
              background:
                "radial-gradient(ellipse at center bottom, oklch(0.85 0.2 15), oklch(0.65 0.2 10) 35%, oklch(0.45 0.18 5) 65%, transparent 100%)",
              filter: "blur(5px)",
              animation: "flicker 1.2s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-x-10 bottom-0 h-20"
            style={{
              background:
                "radial-gradient(ellipse at center bottom, oklch(0.95 0.18 20), oklch(0.8 0.2 15) 55%, transparent 100%)",
              animation: "flicker 0.8s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute inset-x-14 bottom-0 h-12"
            style={{
              background:
                "radial-gradient(ellipse at center bottom, oklch(1 0.15 25), oklch(0.9 0.16 20) 50%, transparent 100%)",
              animation: "flicker 1.5s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-1 left-3 right-3 h-3.5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.18 0.03 350), oklch(0.25 0.04 5), oklch(0.18 0.03 350))",
            }}
          />
          <div
            className="absolute bottom-2 left-8 right-12 h-2.5 rounded-full rotate-6"
            style={{ background: "oklch(0.20 0.03 355)" }}
          />
        </div>
        <div className="absolute inset-x-6 bottom-0 top-10 rounded-t-xl border border-[oklch(0.16_0.03_350)] pointer-events-none" />
        <div
          className="absolute -inset-44 -z-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.14 15 / 35%), oklch(0.68 0.12 20 / 10%) 40%, transparent 65%)",
            animation: "flicker 2.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* === DEPTH LAYER: Sofa === */}
      <div
        className="depth-layer depth-near absolute bottom-5 right-[6%] h-28 w-72 rounded-3xl shadow-2xl"
        style={{
          background: "linear-gradient(180deg, oklch(0.42 0.08 355), oklch(0.28 0.06 355))",
          animation: "depth-pulse 15s ease-in-out infinite",
        }}
      >
        <div
          className="absolute -top-5 left-4 right-4 h-10 rounded-2xl"
          style={{ background: "oklch(0.46 0.09 355)" }}
        />
        <div className="absolute left-6 right-6 top-4 bottom-2 flex gap-2">
          <div className="flex-1 rounded-xl" style={{ background: "oklch(0.44 0.08 355)" }} />
          <div className="flex-1 rounded-xl" style={{ background: "oklch(0.40 0.08 355)" }} />
        </div>
      </div>

      {/* === DEPTH LAYER: Record player === */}
      <button
        onClick={() => onOpen("song")}
        title="record player — leave a song"
        className="depth-layer depth-near group absolute bottom-7 left-[6%] flex h-24 w-32 items-center justify-center rounded-xl shadow-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.06]"
        style={{
          background: "linear-gradient(135deg, oklch(0.28 0.04 350), oklch(0.22 0.04 355))",
        }}
      >
        <div
          className="h-16 w-16 rounded-full shadow-inner"
          style={{
            background:
              "radial-gradient(circle, oklch(0.60 0.14 25) 18%, oklch(0.10 0.02 350) 20%, oklch(0.13 0.02 355) 100%)",
            animation: "spin 5s linear infinite",
          }}
        />
        <div
          className="absolute top-2 right-3 w-0.5 h-8 origin-top"
          style={{ background: "oklch(0.45 0.04 350)", transform: "rotate(25deg)" }}
        />
      </button>

      {/* Wall photos with 3D tilt */}
      <div className="depth-layer depth-mid absolute left-[33%] top-[12%] flex gap-4">
        {items.slice(0, 4).map((m, i) => (
          <button
            key={m.id}
            onClick={() => onView(m)}
            title={m.title}
            className="h-20 w-16 rounded-sm border-2 border-[oklch(0.45_0.06_350)] shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-[0_0_25px_oklch(0.72_0.14_15_/_25%)]"
            style={{
              background: `linear-gradient(135deg, oklch(${0.42 + (i % 3) * 0.08} 0.12 ${350 + i * 20}), oklch(0.32 0.08 10))`,
              transform: `perspective(600px) rotateY(${i % 2 ? -3 : 3}deg) rotateX(2deg)`,
              animation: `card-3d-hover ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
        {items.length === 0 && (
          <div className="h-20 w-52 flex items-center justify-center rounded-sm border border-dashed border-primary/30 text-xs italic text-muted-foreground serif">
            click the bookshelf to leave a memory
          </div>
        )}
      </div>

      {/* Small rug */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-80 h-5 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.40 0.06 355 / 40%), oklch(0.45 0.08 10 / 50%), oklch(0.40 0.06 355 / 40%), transparent)",
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />

      {/* Embers rising in 3D */}
      <div className="pointer-events-none absolute bottom-40 left-1/2 -translate-x-1/2">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + (i % 3) * 0.5,
              height: 1 + (i % 3) * 0.5,
              left: (i - 6) * 6,
              bottom: 0,
              background:
                i % 3 === 0
                  ? "oklch(0.85 0.18 15)"
                  : i % 3 === 1
                    ? "oklch(0.80 0.16 5)"
                    : "oklch(0.75 0.14 25)",
              animation: `ember-rise ${3 + ((i * 0.6) % 2.5)}s ease-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floor gradient */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(0deg, oklch(0.15 0.03 350), transparent)",
        }}
      />
    </div>
  );
}
