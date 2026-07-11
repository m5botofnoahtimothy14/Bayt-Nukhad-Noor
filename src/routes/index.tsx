import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PortalCanvas = lazy(() =>
  import("@/components/portal/PortalCanvas").then((m) => ({ default: m.PortalCanvas })),
);

export const Route = createFileRoute("/")({
  ssr: false,
  component: Portal,
});

type Phase = "intro-1" | "intro-2" | "intro-3" | "intro-4" | "waiting" | "opening" | "entered";

function Portal() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro-1");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/world", replace: true });
      else setChecked(true);
    });
  }, [navigate]);

  // Auto-advance intro
  useEffect(() => {
    if (phase === "intro-1") {
      const t = setTimeout(() => setPhase("intro-2"), 3800);
      return () => clearTimeout(t);
    }
    if (phase === "intro-2") {
      const t = setTimeout(() => setPhase("intro-3"), 5000);
      return () => clearTimeout(t);
    }
    if (phase === "intro-3") {
      const t = setTimeout(() => setPhase("intro-4"), 5500);
      return () => clearTimeout(t);
    }
    if (phase === "intro-4") {
      const t = setTimeout(() => setPhase("waiting"), 4200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const skip = useCallback(() => {
    if (phase.startsWith("intro")) setPhase("waiting");
  }, [phase]);

  const openDoors = useCallback(() => {
    if (phase !== "waiting") return;
    setPhase("opening");
    setTimeout(() => setPhase("entered"), 3200);
  }, [phase]);

  const introActive = phase.startsWith("intro");

  return (
    <div className="scene scene-3d overflow-hidden bg-black">
      {/* 3D canvas backdrop */}
      <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
        <PortalCanvas />
      </Suspense>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.02 0.01 350 / 70%) 100%)",
        }}
      />

      {/* ===== INTRO SEQUENCE ===== */}
      {introActive && checked && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 text-center cursor-pointer"
          onClick={skip}
        >
          {phase === "intro-1" && (
            <div style={{ animation: "intro-fade 3.8s ease-in-out both" }}>
              <p
                className="serif text-xs uppercase tracking-[0.7em] mb-6"
                style={{ color: "oklch(0.75 0.10 30 / 70%)" }}
              >
                A house of light
              </p>
              <h1
                className="serif italic leading-[1.05]"
                style={{
                  fontSize: "clamp(3rem, 9vw, 6.5rem)",
                  color: "oklch(0.96 0.03 30)",
                  textShadow:
                    "0 0 60px oklch(0.72 0.14 15 / 40%), 0 0 120px oklch(0.72 0.14 15 / 20%)",
                }}
              >
                Bayt Nūkhad Noor
              </h1>
              <p
                className="serif italic mt-8 text-lg md:text-xl"
                style={{
                  color: "oklch(0.85 0.05 30 / 75%)",
                  animation: "intro-fade 3.8s ease-in-out 1s both",
                }}
              >
                بيت نوخد نور
              </p>
            </div>
          )}

          {phase === "intro-2" && (
            <div
              style={{ animation: "intro-fade 5s ease-in-out both", maxWidth: "38rem" }}
            >
              <p
                className="serif italic text-xl md:text-2xl leading-relaxed"
                style={{ color: "oklch(0.90 0.04 25 / 85%)" }}
              >
                A name born from two souls
                <br />
                and one shared home.
              </p>
            </div>
          )}

          {phase === "intro-3" && (
            <div
              className="space-y-6"
              style={{ animation: "intro-fade 5.5s ease-in-out both", maxWidth: "34rem" }}
            >
              <IntroWord
                arabic="بيت"
                latin="Bayt"
                meaning="House — where memories are built, where hearts find peace."
                delay={0}
              />
              <IntroWord
                arabic="نوخد"
                latin="Nūkhad"
                meaning="A fusion of Nūḥ and Khadija — the two who created this world."
                delay={1.2}
              />
              <IntroWord
                arabic="نور"
                latin="Noor"
                meaning="Light — guidance, warmth, and hope across distance."
                delay={2.4}
              />
            </div>
          )}

          {phase === "intro-4" && (
            <div style={{ animation: "intro-fade 4.2s ease-in-out both", maxWidth: "36rem" }}>
              <p
                className="serif italic text-lg md:text-xl leading-relaxed"
                style={{ color: "oklch(0.90 0.04 25 / 90%)" }}
              >
                A home where memories live,
                <br />
                love grows,
                <br />
                and two hearts always have
                <br />
                a place to return to.
              </p>
            </div>
          )}

          <p
            className="serif absolute bottom-8 text-[10px] uppercase tracking-[0.5em]"
            style={{
              color: "oklch(0.70 0.05 30 / 40%)",
              animation: "fade-in 2s ease-out 2s both",
            }}
          >
            tap to continue
          </p>
        </div>
      )}

      {/* ===== DOORS ===== */}
      {(phase === "waiting" || phase === "opening" || phase === "entered") && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div
            className="relative cursor-pointer pointer-events-auto"
            onClick={openDoors}
            style={{
              perspective: "1400px",
              width: "min(440px, 78vw)",
              height: "min(520px, 68vh)",
              animation: "doors-fade 1.8s ease-out both",
            }}
          >
            {/* Door frame */}
            <div
              className="absolute inset-0 rounded-t-3xl"
              style={{
                background: "oklch(0.10 0.04 265)",
                boxShadow:
                  "inset 0 0 40px oklch(0 0 0 / 60%), 0 0 120px oklch(0.42 0.17 25 / 30%), 0 0 200px oklch(0.52 0.16 150 / 20%)",
                border: "3px solid oklch(0.24 0.06 265)",
              }}
            />
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-[110%] h-16 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, oklch(0.22 0.06 265), oklch(0.10 0.04 265))",
                borderRadius: "50% 50% 0 0",
                border: "3px solid oklch(0.24 0.06 265)",
                borderBottom: "none",
              }}
            />

            {(["left", "right"] as const).map((side) => (
              <div
                key={side}
                className={`absolute ${side === "left" ? "left-[3px]" : "right-[3px]"} top-[3px] bottom-0 w-1/2 overflow-hidden ${
                  side === "left" ? "origin-left" : "origin-right"
                }`}
                style={{
                  borderRadius: side === "left" ? "12px 0 0 0" : "0 12px 0 0",
                  transition: "transform 2.8s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform:
                    phase === "opening" || phase === "entered"
                      ? `perspective(800px) rotateY(${side === "left" ? -82 : 82}deg)`
                      : "perspective(800px) rotateY(0deg)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.32 0.10 150), oklch(0.22 0.08 155) 55%, oklch(0.28 0.10 150))",
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
                      background:
                        "linear-gradient(180deg, transparent, oklch(0.42 0.10 150 / 55%), transparent)",
                    }}
                  />
                ))}
                <div
                  className="absolute inset-x-6 top-12 bottom-16 rounded-lg border border-white/[0.08]"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.28 0.12 150 / 55%), oklch(0.18 0.08 155 / 80%))",
                    boxShadow: "inset 0 0 30px oklch(0.42 0.17 25 / 20%)",
                  }}
                />
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 opacity-50">
                  {side === "left" ? (
                    <svg width="50" height="50" viewBox="0 0 50 50">
                      <path
                        d="M30 5 A20 20 0 1 0 30 45 A14 14 0 1 1 30 5"
                        fill="oklch(0.85 0.10 90)"
                      />
                      <circle cx="38" cy="12" r="2" fill="oklch(0.90 0.10 90)" />
                    </svg>
                  ) : (
                    <svg width="40" height="50" viewBox="0 0 40 50">
                      <path
                        d="M20 2 L38 25 L20 48 L2 25 Z"
                        fill="none"
                        stroke="oklch(0.55 0.20 25)"
                        strokeWidth="1.5"
                      />
                      <path d="M20 10 L30 25 L20 40 L10 25 Z" fill="oklch(0.42 0.17 25 / 55%)" />
                    </svg>
                  )}
                </div>
                <div
                  className={`absolute ${side === "left" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-3 h-14 rounded-full`}
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.78 0.10 90), oklch(0.55 0.08 85), oklch(0.78 0.10 90))",
                    boxShadow:
                      "0 0 12px oklch(0 0 0 / 50%), inset 0 1px 0 oklch(1 0 0 / 30%)",
                  }}
                />
              </div>
            ))}

            <div
              className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent, oklch(0.75 0.18 150 / 70%), oklch(0.55 0.20 25 / 60%), transparent)",
                opacity: phase === "opening" ? 0 : 1,
                filter: "blur(1px)",
                transition: "opacity 1.5s ease-out",
              }}
            />
          </div>
        </div>
      )}


      {/* Waiting caption */}
      {phase === "waiting" && checked && (
        <div className="pointer-events-none absolute inset-x-0 bottom-14 z-30 flex flex-col items-center">
          <p
            className="serif italic text-sm"
            style={{
              color: "oklch(0.85 0.05 25 / 70%)",
              animation: "fade-in 1.5s ease-out both",
            }}
          >
            The doors are open for you.
          </p>
          <p
            className="serif mt-3 text-[10px] uppercase tracking-[0.5em]"
            style={{
              color: "oklch(0.60 0.06 15 / 50%)",
              animation: "fade-in 2s ease-out 0.6s both",
            }}
          >
            tap the doors
          </p>
        </div>
      )}

      {phase === "entered" && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ animation: "fade-in 1s ease-out both" }}
        >
          <button
            onClick={() => navigate({ to: "/auth" })}
            className="rounded-full px-10 py-3.5 text-sm serif italic tracking-wider"
            style={{
              color: "oklch(0.96 0.03 20)",
              background:
                "linear-gradient(135deg, oklch(0.72 0.14 15 / 25%), oklch(0.60 0.12 25 / 20%))",
              border: "1px solid oklch(0.72 0.14 15 / 30%)",
              boxShadow: "0 0 60px oklch(0.72 0.14 15 / 25%)",
              animation: "fade-up 1s ease-out 0.3s both",
            }}
          >
            Enter Bayt Nūkhad Noor →
          </button>
        </div>
      )}
    </div>
  );
}

function IntroWord({
  arabic,
  latin,
  meaning,
  delay,
}: {
  arabic: string;
  latin: string;
  meaning: string;
  delay: number;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{ animation: `intro-word 1.2s ease-out ${delay}s both` }}
    >
      <div className="flex items-baseline gap-4">
        <span
          className="serif italic text-2xl"
          style={{ color: "oklch(0.88 0.06 30 / 90%)" }}
        >
          {arabic}
        </span>
        <span
          className="serif italic text-3xl"
          style={{
            color: "oklch(0.95 0.04 20)",
            textShadow: "0 0 30px oklch(0.72 0.14 15 / 40%)",
          }}
        >
          {latin}
        </span>
      </div>
      <p
        className="serif italic text-sm max-w-md"
        style={{ color: "oklch(0.80 0.04 25 / 70%)" }}
      >
        {meaning}
      </p>
    </div>
  );
}
