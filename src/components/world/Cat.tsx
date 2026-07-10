import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MOODS = ["curious", "sleepy", "playful", "loafing", "watching birds", "dreaming"];

type CatPos = { x: number; y: number };

export function Cat({ location }: { location: string }) {
  const [pos, setPos] = useState<CatPos>({ x: 0.7, y: 0.75 });
  const [mood, setMood] = useState("curious");
  const [msg, setMsg] = useState<string | null>(null);
  const [facing, setFacing] = useState<1 | -1>(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wander = () => {
      const nx = 0.15 + Math.random() * 0.7;
      const ny = 0.6 + Math.random() * 0.3;
      setFacing(nx > pos.x ? 1 : -1);
      setPos({ x: nx, y: ny });
      const m = MOODS[Math.floor(Math.random() * MOODS.length)];
      setMood(m);
      timer.current = setTimeout(wander, 6000 + Math.random() * 8000);
    };
    timer.current = setTimeout(wander, 3000);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const pet = async () => {
    const options = [
      "*purrs softly*", "*blinks slowly at you*", "*head-bumps your hand*",
      "*rolls belly-up*", "*chirps*", "*flicks tail contentedly*"
    ];
    const line = options[Math.floor(Math.random() * options.length)];
    setMsg(line);
    setMood("loved");
    setTimeout(() => setMsg(null), 2600);
    try {
      await supabase.from("cat_state").update({
        mood: "loved", location, last_touched: new Date().toISOString()
      }).eq("id", 1);
    } catch { /* ignore */ }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className="pointer-events-auto absolute transition-all duration-[6000ms] ease-in-out"
        style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, transform: `translate(-50%,-50%) scaleX(${facing})` }}
      >
        <button onClick={pet} aria-label="Pet the cat" className="group relative block cursor-pointer">
          {/* Cat SVG - a small warm silhouette */}
          <svg width="72" height="52" viewBox="0 0 72 52" className="drop-shadow-lg">
            <defs>
              <radialGradient id="catFur" cx="50%" cy="40%">
                <stop offset="0%" stopColor="oklch(0.5 0.08 40)"/>
                <stop offset="100%" stopColor="oklch(0.28 0.05 30)"/>
              </radialGradient>
            </defs>
            {/* body */}
            <ellipse cx="34" cy="36" rx="22" ry="12" fill="url(#catFur)"/>
            {/* head */}
            <circle cx="52" cy="26" r="11" fill="url(#catFur)"/>
            {/* ears */}
            <path d="M45 18 L48 10 L52 20 Z" fill="oklch(0.3 0.05 30)"/>
            <path d="M56 18 L60 10 L62 22 Z" fill="oklch(0.3 0.05 30)"/>
            {/* tail */}
            <path d="M14 34 Q4 24 8 14" stroke="oklch(0.35 0.06 30)" strokeWidth="6" fill="none" strokeLinecap="round"
              style={{ transformOrigin: "14px 34px", animation: "sway 3s ease-in-out infinite" }}/>
            {/* eyes */}
            <circle cx="49" cy="25" r="1.4" fill="oklch(0.9 0.15 90)"/>
            <circle cx="55" cy="25" r="1.4" fill="oklch(0.9 0.15 90)"/>
            {/* nose */}
            <path d="M52 28 l-1 1 h2 z" fill="oklch(0.7 0.1 20)"/>
          </svg>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-widest text-primary/60 opacity-0 group-hover:opacity-100 transition" style={{ transform: `translateX(-50%) scaleX(${facing})` }}>
            mochi · {mood}
          </span>
        </button>
        {msg && (
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/90 px-3 py-1 text-xs italic text-foreground shadow serif"
            style={{ transform: `translateX(-50%) scaleX(${facing})`, animation: "float-up 2.6s ease-out forwards" }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
