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
  const stars = useMemo(() => Array.from({ length: 80 }, () => ({
    w: Math.random() * 2 + 0.5,
    l: Math.random() * 100,
    t: Math.random() * 70,
    o: 0.2 + Math.random() * 0.6,
    d: 2 + Math.random() * 4,
    delay: Math.random() * 3,
  })), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/world", replace: true });
      else setChecked(true);
    });
  }, [navigate]);

  return (
    <div className="scene vignette" style={{
      background: "radial-gradient(ellipse at 50% 70%, oklch(0.35 0.06 55) 0%, oklch(0.18 0.03 50) 60%, oklch(0.1 0.02 45) 100%)",
    }}>
      {/* stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span key={i} className="absolute rounded-full bg-white"
            style={{
              width: s.w, height: s.w,
              left: `${s.l}%`, top: `${s.t}%`,
              opacity: s.o,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }} />
        ))}
      </div>

      {/* Distant cabin silhouette */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl">
        <svg viewBox="0 0 400 200" className="w-full">
          <path d="M0 200 L0 140 Q200 90 400 140 L400 200 Z" fill="oklch(0.15 0.03 140)" />
          <g transform="translate(160 90)">
            <path d="M0 60 L0 30 L40 5 L80 30 L80 60 Z" fill="oklch(0.2 0.04 40)" />
            <rect x="30" y="35" width="20" height="25" fill="oklch(0.78 0.19 60)" style={{ animation: "flicker 3s ease-in-out infinite" }}/>
            <path d="M-5 30 L40 -2 L85 30 L82 33 L40 3 L-2 33 Z" fill="oklch(0.14 0.03 30)"/>
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-primary/70">welcome home</p>
        <h1 className="serif mt-6 text-6xl md:text-8xl italic text-foreground drop-shadow-lg">Our Universe</h1>
        <p className="serif mt-6 max-w-md text-lg italic text-muted-foreground">
          Even when distance exists,<br/>there is one place where we are always together.
        </p>
        {checked && (
          <Link to="/auth" className="mt-12 rounded-full border border-primary/40 bg-primary/10 px-8 py-3 text-primary backdrop-blur-sm transition hover:bg-primary/20 hover:scale-105">
            Step inside →
          </Link>
        )}
      </div>
    </div>
  );
}
