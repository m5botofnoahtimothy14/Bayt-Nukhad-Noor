import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CAT_NAME_KEY = "bayt-cat-name";

function getCatName(): string {
  try {
    return localStorage.getItem(CAT_NAME_KEY) || "Mochi";
  } catch {
    return "Mochi";
  }
}

function saveCatName(name: string) {
  try {
    localStorage.setItem(CAT_NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

const MOODS = ["curious", "sleepy", "playful", "loafing", "watching birds", "dreaming", "purring"];

const LOCATION_MOODS: Record<string, string[]> = {
  house: ["loafing by the fire", "sleepy on the sofa", "curious about the bookshelf"],
  garden: ["chasing butterflies", "watching birds", "napping in the sun"],
  balcony: ["stargazing", "watching clouds", "enjoying the breeze"],
  observatory: ["curious about the stars", "sleeping on the telescope", "dreaming"],
  lake: ["watching the water", "fishing for reflections", "napping by the shore"],
  forest: ["hunting fireflies", "exploring the paths", "napping in the undergrowth"],
  meadow: ["listening to the rain", "playing in puddles", "sheltering under leaves"],
  kitchen: ["begging for food", "sitting on the counter", "watching the fridge"],
  dining: ["waiting under the table", "napping on a chair", "sniffing the air"],
  bedroom: ["sleeping on the bed", "curling on the pillow", "watching the window"],
};

type CatPos = { x: number; y: number };

type CatProps = {
  location: string;
  phase?: string;
  season?: string;
  weather?: string;
};

export function Cat({ location, phase, season, weather }: CatProps) {
  const [pos, setPos] = useState<CatPos>({ x: 0.7, y: 0.75 });
  const [mood, setMood] = useState("curious");
  const [msg, setMsg] = useState<string | null>(null);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [tailPhase, setTailPhase] = useState(0);
  const [catName, setCatName] = useState(getCatName);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(catName);
  const [sleeping, setSleeping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setSleeping(phase === "night" && Math.random() > 0.4);
  }, [phase, location]);

  useEffect(() => {
    const moods = LOCATION_MOODS[location] || MOODS;
    const wander = () => {
      const nx = 0.12 + Math.random() * 0.76;
      const ny = 0.55 + Math.random() * 0.35;
      setFacing(nx > pos.x ? 1 : -1);
      setPos({ x: nx, y: ny });
      setMood(moods[Math.floor(Math.random() * moods.length)]);
      setTailPhase((p) => p + 1);
      setSleeping(phase === "night" && Math.random() > 0.5);
      timer.current = setTimeout(wander, 6000 + Math.random() * 8000);
    };
    timer.current = setTimeout(wander, 3000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [location, phase]);

  const pet = async () => {
    if (editingName) return;
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
      "*wiggles with joy*",
      `*${catName} loves you*`,
    ];
    setMsg(lines[Math.floor(Math.random() * lines.length)]);
    setMood("loved");
    setSleeping(false);
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

  const saveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== catName) {
      setCatName(trimmed);
      saveCatName(trimmed);
      setMsg(`*${trimmed} is happy with the new name*`);
      setTimeout(() => setMsg(null), 2800);
    }
    setEditingName(false);
  };

  useEffect(() => {
    if (editingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingName]);

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
          onDoubleClick={() => {
            setEditingName(true);
            setNameInput(catName);
          }}
          aria-label={`Pet ${catName}`}
          className="group relative block cursor-pointer"
        >
          {/* Snowflake particles for winter */}
          {season === "winter" && (
            <div className="absolute -inset-4 pointer-events-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 2,
                    height: 2,
                    left: `${20 + i * 15}%`,
                    top: -5,
                    background: "oklch(0.95 0.02 200 / 60%)",
                    animation: `rain-fall ${2 + i * 0.5}s linear infinite`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                />
              ))}
            </div>
          )}

          <svg width="80" height="58" viewBox="0 0 80 58" className="drop-shadow-xl">
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
              style={{ animation: sleeping ? "none" : "sway 3s ease-in-out infinite" }}
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
            {/* Eyes - closed when sleeping */}
            {sleeping ? (
              <>
                <line
                  x1={eyes.lx - 3}
                  y1={eyes.ly}
                  x2={eyes.lx + 3}
                  y2={eyes.ly}
                  stroke="oklch(0.15 0.02 20)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1={eyes.rx - 3}
                  y1={eyes.ry}
                  x2={eyes.rx + 3}
                  y2={eyes.ry}
                  stroke="oklch(0.15 0.02 20)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <ellipse cx={eyes.lx} cy={eyes.ly} rx="2.5" ry="3" fill="oklch(0.88 0.15 90)" />
                <ellipse cx={eyes.rx} cy={eyes.ry} rx="2.5" ry="3" fill="oklch(0.88 0.15 90)" />
                <ellipse cx={eyes.lx} cy={eyes.ly} rx="1" ry="2.5" fill="oklch(0.1 0.01 20)" />
                <ellipse cx={eyes.rx} cy={eyes.ry} rx="1" ry="2.5" fill="oklch(0.1 0.01 20)" />
                <circle cx={eyes.lx + 0.8} cy={eyes.ly - 0.8} r="0.6" fill="white" />
                <circle cx={eyes.rx + 0.8} cy={eyes.ry - 0.8} r="0.6" fill="white" />
              </>
            )}
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
            {catName} · {sleeping ? "sleeping" : mood}
          </span>
        </button>

        {/* Name tag - visible on hover when not editing */}
        {!editingName && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-auto cursor-pointer"
            style={{ transform: `translateX(-50%) scaleX(${facing})` }}
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                setEditingName(true);
                setNameInput(catName);
              }}
              className="whitespace-nowrap rounded-xl bg-black/40 px-3 py-1 text-[11px] text-foreground/70 serif italic backdrop-blur-sm border border-white/10 hover:bg-black/50 hover:text-foreground/90 transition-all duration-300"
            >
              {catName}
            </span>
          </div>
        )}

        {/* Name editor */}
        {editingName && (
          <div
            className="absolute -top-10 left-1/2 z-50 pointer-events-auto"
            style={{ transform: `translateX(-50%) scaleX(${facing})` }}
          >
            <input
              ref={inputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") setEditingName(false);
              }}
              className="w-28 rounded-xl border border-primary/30 bg-black/60 px-3 py-1.5 text-center text-[11px] text-foreground serif italic outline-none backdrop-blur-md focus:border-primary/60"
              placeholder="cat name"
            />
          </div>
        )}

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

        {/* Sleeping "zzz" */}
        {sleeping && (
          <div className="absolute -top-6 right-0 pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-primary/40 serif italic"
                style={
                  {
                    fontSize: 8 + i * 3,
                    right: i * 6,
                    top: -i * 10,
                    animation: `dust-float ${3 + i}s ease-in-out ${i * 0.8}s infinite`,
                    "--dx": `${5 + i * 3}px`,
                    "--dy": `${-15 - i * 8}px`,
                  } as React.CSSProperties
                }
              >
                z
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
