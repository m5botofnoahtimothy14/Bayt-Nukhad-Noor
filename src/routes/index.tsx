import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Portal,
});

function Portal() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"waiting" | "opening" | "entered">("waiting");
  const [checked, setChecked] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: (i * 3.1 + (i * 7) % 100) % 100,
        y: (i * 2.7 + (i * 11) % 100) % 100,
        size: 0.5 + ((i * 3) % 5) * 0.3,
        dur: 6 + ((i * 5) % 8),
        delay: (i * 0.4) % 10,
        dx: -30 + ((i * 13) % 60),
        dy: -50 - ((i * 7) % 80),
      })),
    [],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/world", replace: true });
      else setChecked(true);
    });
  }, [navigate]);

  const openDoors = useCallback(() => {
    if (phase !== "waiting") return;
    setPhase("opening");
    setTimeout(() => setPhase("entered"), 3200);
  }, [phase]);

  return (
    <div className="scene scene-3d overflow-hidden">
      {/* Deep dark background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.12 0.03 350), oklch(0.04 0.01 10) 70%, oklch(0.02 0.01 350) 100%)",
        }}
      />

      {/* Ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background:
                i % 3 === 0
                  ? "oklch(0.85 0.12 15 / 50%)"
                  : i % 3 === 1
                    ? "oklch(0.80 0.10 55 / 40%)"
                    : "oklch(0.82 0.08 350 / 35%)",
              boxShadow:
                i % 3 === 0
                  ? "0 0 6px oklch(0.85 0.12 15 / 40%)"
                  : "none",
              animation: `dust-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Warm light spilling from behind doors */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "400px",
          height: "600px",
          background:
            "radial-gradient(ellipse, oklch(0.72 0.14 15 / 0.15), transparent 70%)",
          animation: phase === "opening" ? "flicker 2s ease-in-out infinite" : "none",
          opacity: phase === "opening" ? 1 : 0.3,
          transition: "opacity 2s ease-out",
        }}
      />

      {/* === DOORS === */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        onClick={openDoors}
        style={{ perspective: "1200px", width: "440px", height: "520px" }}
      >
        {/* Door frame */}
        <div
          className="absolute inset-0 rounded-t-3xl"
          style={{
            background: "oklch(0.12 0.03 20)",
            boxShadow:
              "inset 0 0 30px oklch(0 0 0 / 50%), 0 0 80px oklch(0 0 0 / 40%)",
            border: "3px solid oklch(0.20 0.04 30)",
          }}
        />

        {/* Arch detail */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-[110%] h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.18 0.04 30), oklch(0.12 0.03 20))",
            borderRadius: "50% 50% 0 0",
            border: "3px solid oklch(0.20 0.04 30)",
            borderBottom: "none",
          }}
        />

        {/* Left door */}
        <div
          className="absolute left-[3px] top-[3px] bottom-0 w-1/2 overflow-hidden origin-left"
          style={{
            borderRadius: "12px 0 0 0",
            transition: "transform 2.8s cubic-bezier(0.22, 1, 0.36, 1)",
            transform:
              phase === "opening" || phase === "entered"
                ? "perspective(800px) rotateY(-75deg)"
                : "perspective(800px) rotateY(0deg)",
          }}
        >
          {/* Wood texture */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg,
                  oklch(0.28 0.06 25) 0%,
                  oklch(0.25 0.05 22) 30%,
                  oklch(0.22 0.05 20) 60%,
                  oklch(0.25 0.06 25) 100%
                )`,
            }}
          />
          {/* Wood grain lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                left: `${10 + i * 12}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background: `linear-gradient(180deg, transparent, oklch(0.30 0.05 25 / 40%), transparent)`,
              }}
            />
          ))}
          {/* Carved panel */}
          <div
            className="absolute inset-x-6 top-12 bottom-16 rounded-lg border border-white/[0.06]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.04 25 / 60%), oklch(0.16 0.03 20 / 80%))",
            }}
          />
          {/* Noah symbol - crescent & star */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 opacity-30">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <path
                d="M30 5 A20 20 0 1 0 30 45 A14 14 0 1 1 30 5"
                fill="oklch(0.72 0.10 55)"
                opacity="0.6"
              />
              <circle cx="38" cy="12" r="2" fill="oklch(0.80 0.10 55 / 50%)" />
            </svg>
          </div>
          {/* Handle */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-14 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.65 0.08 55), oklch(0.50 0.06 50), oklch(0.65 0.08 55))",
              boxShadow: "0 0 10px oklch(0 0 0 / 30%), inset 0 1px 0 oklch(1 0 0 / 20%)",
            }}
          />
          {/* Bottom metal plate */}
          <div
            className="absolute inset-x-8 bottom-4 h-2 rounded"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.45 0.06 55 / 40%), oklch(0.55 0.08 55 / 50%), oklch(0.45 0.06 55 / 40%))",
            }}
          />
        </div>

        {/* Right door */}
        <div
          className="absolute right-[3px] top-[3px] bottom-0 w-1/2 overflow-hidden origin-right"
          style={{
            borderRadius: "0 12px 0 0",
            transition: "transform 2.8s cubic-bezier(0.22, 1, 0.36, 1)",
            transform:
              phase === "opening" || phase === "entered"
                ? "perspective(800px) rotateY(75deg)"
                : "perspective(800px) rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg,
                  oklch(0.28 0.06 25) 0%,
                  oklch(0.25 0.05 22) 30%,
                  oklch(0.22 0.05 20) 60%,
                  oklch(0.25 0.06 25) 100%
                )`,
            }}
          />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                left: `${10 + i * 12}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background: `linear-gradient(180deg, transparent, oklch(0.30 0.05 25 / 40%), transparent)`,
              }}
            />
          ))}
          <div
            className="absolute inset-x-6 top-12 bottom-16 rounded-lg border border-white/[0.06]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.04 25 / 60%), oklch(0.16 0.03 20 / 80%))",
            }}
          />
          {/* Khadija symbol - diamond/flame */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 opacity-30">
            <svg width="40" height="50" viewBox="0 0 40 50">
              <path
                d="M20 2 L38 25 L20 48 L2 25 Z"
                fill="none"
                stroke="oklch(0.72 0.14 15)"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M20 10 L30 25 L20 40 L10 25 Z"
                fill="oklch(0.72 0.14 15 / 30%)"
              />
            </svg>
          </div>
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-14 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.65 0.08 55), oklch(0.50 0.06 50), oklch(0.65 0.08 55))",
              boxShadow: "0 0 10px oklch(0 0 0 / 30%), inset 0 1px 0 oklch(1 0 0 / 20%)",
            }}
          />
          <div
            className="absolute inset-x-8 bottom-4 h-2 rounded"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.45 0.06 55 / 40%), oklch(0.55 0.08 55 / 50%), oklch(0.45 0.06 55 / 40%))",
            }}
          />
        </div>

        {/* Light leaking through center crack */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.72 0.14 15 / 0.0), oklch(0.72 0.14 15 / 0.3), oklch(0.72 0.14 15 / 0.0))",
            opacity: phase === "opening" ? 0 : 0.5,
            transition: "opacity 1.5s ease-out",
          }}
        />
      </div>

      {/* Light flooding in during opening */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.72 0.14 15 / 0.08), oklch(0.60 0.12 25 / 0.04) 40%, transparent 70%)",
          opacity: phase === "opening" ? 1 : 0,
          transitionDuration: "2s",
        }}
      />

      {/* Text content */}
      {checked && phase === "waiting" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <p
            className="text-sm uppercase tracking-[0.5em] serif"
            style={{
              color: "oklch(0.60 0.08 55 / 60%)",
              animation: "fade-in 2s ease-out 1s both",
            }}
          >
            Bayt Nūkhad Noor
          </p>
          <h1
            className="serif mt-4 text-5xl md:text-7xl italic"
            style={{
              color: "oklch(0.92 0.03 20)",
              textShadow: "0 0 60px oklch(0.72 0.14 15 / 15%)",
              animation: "fade-in 2.5s ease-out 1.5s both",
            }}
          >
            Come Home
          </h1>
          <p
            className="serif mt-4 max-w-sm text-center text-sm italic"
            style={{
              color: "oklch(0.65 0.04 20 / 60%)",
              animation: "fade-in 2.5s ease-out 2.5s both",
            }}
          >
            The doors are open for you.
          </p>
          <p
            className="serif mt-8 text-xs tracking-widest uppercase"
            style={{
              color: "oklch(0.55 0.06 15 / 40%)",
              animation: "fade-in 2s ease-out 3.5s both",
            }}
          >
            tap the doors
          </p>
        </div>
      )}

      {/* Transition to auth after doors open */}
      {phase === "entered" && checked && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ animation: "fade-in 1s ease-out both" }}
        >
          <Link
            to="/auth"
            className="rounded-full px-10 py-3.5 text-sm serif italic tracking-wider"
            style={{
              color: "oklch(0.92 0.03 20)",
              background:
                "linear-gradient(135deg, oklch(0.72 0.14 15 / 20%), oklch(0.60 0.12 25 / 15%))",
              border: "1px solid oklch(0.72 0.14 15 / 20%)",
              boxShadow: "0 0 40px oklch(0.72 0.14 15 / 10%)",
              animation: "fade-up 1s ease-out 0.3s both",
            }}
          >
            Enter Bayt Nūkhad Noor →
          </Link>
        </div>
      )}
    </div>
  );
}
