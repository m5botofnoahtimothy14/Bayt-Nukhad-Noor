import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Portal,
});

function Portal() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [entered, setEntered] = useState(false);

  const stars = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        w: 0.5 + ((i * 3.7) % 10) * 0.2,
        l: (i * 3.1 + ((i * 7) % 100)) % 100,
        t: (i * 2.3 + ((i * 11) % 75)) % 75,
        o: 0.15 + ((i * 13) % 10) * 0.07,
        d: 2 + ((i * 7) % 5),
        delay: (i * 0.3) % 4,
      })),
    [],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/world", replace: true });
      else {
        setChecked(true);
        requestAnimationFrame(() => setEntered(true));
      }
    });
  }, [navigate]);

  return (
    <div
      className="scene vignette scene-3d"
      style={{
        background:
          "radial-gradient(ellipse at 50% 70%, oklch(0.30 0.06 350) 0%, oklch(0.16 0.04 5) 55%, oklch(0.08 0.03 350) 100%)",
      }}
    >
      {/* Aurora / atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[40%] opacity-40"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.30 0.10 300 / 30%), oklch(0.25 0.08 350 / 15%), transparent)",
            animation: "aurora-shift 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[10%] left-[20%] w-96 h-48 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.40 0.12 350 / 15%), oklch(0.35 0.10 15 / 10%), transparent)",
            animation: "aurora-shift 20s ease-in-out 3s infinite",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Stars - multi-layered for depth */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.w,
              height: s.w,
              left: `${s.l}%`,
              top: `${s.t}%`,
              opacity: s.o,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Distant landscape silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none">
        <svg
          viewBox="0 0 1440 300"
          className="absolute inset-x-0 bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 300 L0 200 Q200 140 400 180 Q600 220 800 160 Q1000 120 1200 170 Q1350 190 1440 180 L1440 300 Z"
            fill="oklch(0.10 0.03 350)"
          />
          {/* Trees */}
          {[80, 200, 350, 500, 680, 850, 1020, 1180, 1350].map((x, i) => (
            <ellipse
              key={i}
              cx={x}
              cy={170 + (i % 3) * 15}
              rx={8 + (i % 3) * 4}
              ry={15 + (i % 2) * 8}
              fill="oklch(0.08 0.03 155)"
            />
          ))}
        </svg>

        {/* Cabin */}
        <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[50%] max-w-lg">
          <svg viewBox="0 0 400 200" className="w-full">
            {/* Ground */}
            <path d="M0 200 L0 160 Q200 120 400 160 L400 200 Z" fill="oklch(0.12 0.04 150)" />
            {/* Cabin body */}
            <g transform="translate(140 80)">
              <rect x="0" y="35" width="120" height="80" rx="2" fill="oklch(0.22 0.05 20)" />
              {/* Roof */}
              <path d="M-10 35 L60 5 L130 35 Z" fill="oklch(0.18 0.04 350)" />
              <path
                d="M-10 35 L60 5 L130 35"
                fill="none"
                stroke="oklch(0.15 0.03 350)"
                strokeWidth="2"
              />
              {/* Door */}
              <rect x="45" y="65" width="30" height="50" rx="2" fill="oklch(0.15 0.03 15)" />
              <circle cx="70" cy="92" r="1.5" fill="oklch(0.6 0.08 55)" />
              {/* Window */}
              <rect
                x="15"
                y="55"
                width="22"
                height="18"
                rx="1"
                fill="oklch(0.78 0.15 15)"
                style={{ animation: "flicker 3s ease-in-out infinite" }}
              />
              <line x1="26" y1="55" x2="26" y2="73" stroke="oklch(0.18 0.04 20)" strokeWidth="1" />
              <line x1="15" y1="64" x2="37" y2="64" stroke="oklch(0.18 0.04 20)" strokeWidth="1" />
              {/* Chimney */}
              <rect x="85" y="10" width="15" height="30" fill="oklch(0.20 0.04 15)" />
              {/* Smoke */}
              <circle
                cx="92"
                cy="0"
                r="4"
                fill="oklch(0.5 0.03 20 / 15%)"
                style={{ animation: "float-up 5s ease-out infinite" }}
              />
              <circle
                cx="88"
                cy="-8"
                r="3"
                fill="oklch(0.5 0.03 20 / 10%)"
                style={{ animation: "float-up 6s ease-out 1s infinite" }}
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div
          className={`transition-all duration-1000 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-primary/70 serif">welcome home</p>
          <h1
            className="serif mt-6 text-7xl md:text-9xl italic text-foreground drop-shadow-2xl"
            style={{ textShadow: "0 0 60px oklch(0.72 0.14 15 / 20%)" }}
          >
            Our Universe
          </h1>
          <p className="serif mt-6 max-w-md text-lg italic text-muted-foreground leading-relaxed">
            Even when distance exists,
            <br />
            there is one place where we are always together.
          </p>
        </div>

        {checked && (
          <div
            className={`transition-all duration-1000 delay-300 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link
              to="/auth"
              className="mt-14 inline-block rounded-full border border-primary/30 bg-primary/10 px-10 py-3.5 text-primary backdrop-blur-sm transition-all duration-500 hover:bg-primary/20 hover:scale-105 hover:shadow-[0_0_30px_oklch(0.72_0.14_15_/_20%)] active:scale-95"
            >
              Step inside →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
