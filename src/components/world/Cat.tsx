import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MOODS = ["curious", "sleepy", "playful", "loafing", "watching birds", "dreaming"];

type CatPos = { x: number; y: number };

export function Cat({ location }: { location: string }) {
  const [pos, setPos] = useState<CatPos>({ x: 0.7, y: 0.75 });
  const [mood, setMood] = useState("curious");
  const [msg, setMsg] = useState<string | null>(null);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [tailPhase, setTailPhase] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const eyes = useMemo(
    () => ({
      lx: 50,
      ly: 25,
      rx: 57,
      ry: 25,
    }),
    [],
  );

  useEffect(() => {
    const wander = () => {
      const nx = 0.12 + Math.random() * 0.76;
      const ny = 0.55 + Math.random() * 0.35;
      setFacing(nx > pos.x ? 1 : -1);
      setPos({ x: nx, y: ny });
      setMood(MOODS[Math.floor(Math.random() * MOODS.length)]);
      setTailPhase((p) => p + 1);
      timer.current = setTimeout(wander, 6000 + Math.random() * 8000);
    };
    timer.current = setTimeout(wander, 3000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [location]);

  const pet = async () => {
    const lines = [
      "*purrs softly*",
      "*blinks slowly at you*",
      "*head-bumps your hand*",
      "*rolls belly-up*",
      "*chirps happily*",
      "*flicks tail contentedly*",
      "*nuzzles your wrist*",
      "*stretches luxuriously*",
      "*closes eyes in bliss*",
    ];
    setMsg(lines[Math.floor(Math.random() * lines.length)]);
    setMood("loved");
    setTimeout(() => setMsg(null), 2800);
    try {
      await supabase
        .from("cat_state")
        .update({
          mood: "loved",
          location,
          last_touched: new Date().toISOString(),
        })
        .eq("id", 1);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className="pointer-events-auto absolute transition-all duration-[6000ms] ease-in-out"
        style={{
          left: `${pos.x * 100}%`,
          top: `${pos.y * 100}%`,
          transform: `translate(-50%, -50%) scaleX(${facing})`,
        }}
      >
        <button
          onClick={pet}
          aria-label="Pet the cat"
          className="group relative block cursor-pointer"
        >
          {/* Cat SVG - detailed */}
          <svg
            width="80"
            height="58"
            viewBox="0 0 80 58"
            className="drop-shadow-xl"
            style={{ transform: `scaleX(${1})` }}
          >
            <defs>
              <radialGradient id="catFur" cx="50%" cy="35%">
                <stop offset="0%" stopColor="oklch(0.52 0.08 20)" />
                <stop offset="60%" stopColor="oklch(0.35 0.06 15)" />
                <stop offset="100%" stopColor="oklch(0.22 0.04 10)" />
              </radialGradient>
              <radialGradient id="catBelly" cx="50%" cy="40%">
                <stop offset="0%" stopColor="oklch(0.58 0.08 20)" />
                <stop offset="100%" stopColor="oklch(0.45 0.06 18)" />
              </radialGradient>
            </defs>
            {/* Tail */}
            <path
              d={`M16 38 Q${4 + Math.sin(tailPhase * 0.7) * 4} ${22 + Math.cos(tailPhase * 0.5) * 3} ${10 + Math.sin(tailPhase * 0.3) * 3} ${14 + Math.cos(tailPhase * 0.4) * 2}`}
              stroke="oklch(0.32 0.06 15)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              style={{ animation: "sway 3s ease-in-out infinite" }}
            />
            {/* Body */}
            <ellipse cx="38" cy="40" rx="24" ry="14" fill="url(#catFur)" />
            {/* Belly patch */}
            <ellipse cx="38" cy="42" rx="14" ry="9" fill="url(#catBelly)" opacity="0.5" />
            {/* Front paws */}
            <ellipse cx="28" cy="52" rx="5" ry="3" fill="oklch(0.30 0.05 15)" />
            <ellipse cx="48" cy="52" rx="5" ry="3" fill="oklch(0.30 0.05 15)" />
            {/* Head */}
            <circle cx="58" cy="28" r="13" fill="url(#catFur)" />
            {/* Inner ears */}
            <path d="M49 18 L52 8 L56 20 Z" fill="oklch(0.28 0.05 15)" />
            <path d="M60 18 L64 8 L67 22 Z" fill="oklch(0.28 0.05 15)" />
            <path d="M51 17 L53 11 L55 19 Z" fill="oklch(0.55 0.10 15)" opacity="0.5" />
            <path d="M62 17 L64 11 L66 20 Z" fill="oklch(0.55 0.10 15)" opacity="0.5" />
            {/* Eyes */}
            <ellipse cx={eyes.lx} cy={eyes.ly} rx="2.5" ry="3" fill="oklch(0.88 0.15 90)" />
            <ellipse cx={eyes.rx} cy={eyes.ry} rx="2.5" ry="3" fill="oklch(0.88 0.15 90)" />
            <ellipse cx={eyes.lx} cy={eyes.ly} rx="1" ry="2.5" fill="oklch(0.1 0.01 20)" />
            <ellipse cx={eyes.rx} cy={eyes.ry} rx="1" ry="2.5" fill="oklch(0.1 0.01 20)" />
            {/* Eye shine */}
            <circle cx={eyes.lx + 0.8} cy={eyes.ly - 0.8} r="0.6" fill="white" />
            <circle cx={eyes.rx + 0.8} cy={eyes.ry - 0.8} r="0.6" fill="white" />
            {/* Nose */}
            <path d="M58 31 l-1.5 1.5 h3 z" fill="oklch(0.65 0.12 10)" />
            {/* Mouth */}
            <path
              d="M58 32.5 Q56 34 54 33"
              stroke="oklch(0.25 0.04 15)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M58 32.5 Q60 34 62 33"
              stroke="oklch(0.25 0.04 15)"
              strokeWidth="0.5"
              fill="none"
            />
            {/* Whiskers */}
            <line
              x1="44"
              y1="30"
              x2="32"
              y2="28"
              stroke="oklch(0.6 0.04 20 / 40%)"
              strokeWidth="0.4"
            />
            <line
              x1="44"
              y1="32"
              x2="30"
              y2="33"
              stroke="oklch(0.6 0.04 20 / 40%)"
              strokeWidth="0.4"
            />
            <line
              x1="72"
              y1="30"
              x2="84"
              y2="28"
              stroke="oklch(0.6 0.04 20 / 40%)"
              strokeWidth="0.4"
            />
            <line
              x1="72"
              y1="32"
              x2="86"
              y2="33"
              stroke="oklch(0.6 0.04 20 / 40%)"
              strokeWidth="0.4"
            />
          </svg>

          {/* Mood label */}
          <span
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-widest text-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ transform: `translateX(-50%) scaleX(${facing})` }}
          >
            mochi · {mood}
          </span>
        </button>

        {/* Speech bubble */}
        {msg && (
          <div
            className="absolute left-1/2 -top-10 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-card/90 px-4 py-1.5 text-xs italic text-foreground shadow-xl serif backdrop-blur-sm"
            style={{
              transform: `translateX(-50%) scaleX(${facing})`,
              animation: "float-up 2.8s ease-out forwards",
              boxShadow: "0 4px 20px oklch(0 0 0 / 20%)",
            }}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
