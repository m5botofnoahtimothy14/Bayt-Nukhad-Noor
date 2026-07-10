import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { Cat } from "@/components/world/Cat";
import { AddMemoryDialog, ViewMemoryDialog, useMemories, type Memory } from "@/components/world/memories";
import { Home, Flower2, Star, Waves, Trees, CloudRain, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/world")({
  head: () => ({ meta: [{ title: "Our Universe" }] }),
  component: World,
});

type Loc = "house" | "garden" | "observatory" | "lake" | "forest" | "meadow";

const LOCATIONS: { id: Loc; name: string; icon: any; hint: string }[] = [
  { id: "house",       name: "The House",         icon: Home,      hint: "our warm cabin" },
  { id: "garden",      name: "Memory Garden",     icon: Flower2,   hint: "flowers of us" },
  { id: "observatory", name: "Observatory",       icon: Star,      hint: "our sky" },
  { id: "lake",        name: "Moon Lake",         icon: Waves,     hint: "paper boats" },
  { id: "forest",      name: "Whispering Forest", icon: Trees,     hint: "fireflies" },
  { id: "meadow",      name: "Rain Meadow",       icon: CloudRain, hint: "soft rain" },
];

function World() {
  const [loc, setLoc] = useState<Loc>("house");
  const phase = useTimeOfDay();
  const navigate = useNavigate();

  const [addOpen, setAddOpen] = useState<{ kind: "memory" | "letter" | "photo" | "song"; pos?: { x: number; y: number } | null } | null>(null);
  const [viewing, setViewing] = useState<Memory | null>(null);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="scene">
      {/* Scene */}
      {loc === "house"       && <HouseScene phase={phase} onOpen={(k) => setAddOpen({ kind: k })} onView={setViewing} />}
      {loc === "garden"      && <GardenScene phase={phase} onAdd={(p) => setAddOpen({ kind: "memory", pos: p })} onView={setViewing} />}
      {loc === "observatory" && <ObservatoryScene onAdd={(p) => setAddOpen({ kind: "memory", pos: p })} onView={setViewing} />}
      {loc === "lake"        && <LakeScene phase={phase} onAdd={(p) => setAddOpen({ kind: "letter", pos: p })} onView={setViewing} />}
      {loc === "forest"      && <ForestScene onAdd={(p) => setAddOpen({ kind: "memory", pos: p })} onView={setViewing} />}
      {loc === "meadow"      && <MeadowScene onAdd={(p) => setAddOpen({ kind: "memory", pos: p })} onView={setViewing} />}

      <Cat location={loc} />

      {/* Location badge */}
      <div className="pointer-events-none absolute left-1/2 top-6 z-40 -translate-x-1/2 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/60">{phase}</p>
        <h2 className="serif mt-1 text-2xl italic text-foreground/95 drop-shadow">{LOCATIONS.find(l => l.id === loc)!.name}</h2>
        <p className="serif text-xs italic text-muted-foreground">{LOCATIONS.find(l => l.id === loc)!.hint}</p>
      </div>

      {/* Sign out */}
      <button onClick={signOut} className="absolute right-4 top-4 z-40 rounded-full border border-border bg-card/40 p-2 text-muted-foreground backdrop-blur hover:text-foreground" aria-label="Sign out">
        <LogOut size={16}/>
      </button>

      {/* Navigation constellation */}
      <nav className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-primary/25 bg-card/70 p-1.5 shadow-2xl backdrop-blur-md">
          {LOCATIONS.map(l => {
            const Icon = l.icon;
            const active = l.id === loc;
            return (
              <button key={l.id} onClick={() => setLoc(l.id)} aria-label={l.name}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition ${active ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"}`}>
                <Icon size={18} />
                <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-full bg-card/95 px-2 py-0.5 text-[10px] text-foreground opacity-0 group-hover:opacity-100 transition">{l.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AddMemoryDialog open={!!addOpen} onClose={() => setAddOpen(null)} location={loc}
        defaultKind={addOpen?.kind ?? "memory"} position={addOpen?.pos ?? null}/>
      <ViewMemoryDialog memory={viewing} onClose={() => setViewing(null)}/>
    </div>
  );
}

/* ==================== HOUSE ==================== */
function HouseScene({ phase, onOpen, onView }: { phase: TimePhase; onOpen: (k: "memory"|"letter"|"photo"|"song") => void; onView: (m: Memory) => void }) {
  const { items } = useMemories("house");
  const wallGlow = phase === "night" || phase === "dusk" ? 0.9 : 0.4;

  return (
    <div className="scene" style={{ background: "linear-gradient(180deg, oklch(0.2 0.03 30) 0%, oklch(0.15 0.02 25) 100%)" }}>
      {/* wooden wall */}
      <div className="absolute inset-0" style={{
        background: `repeating-linear-gradient(90deg, oklch(0.28 0.05 40) 0 90px, oklch(0.25 0.05 40) 90px 91px), radial-gradient(ellipse at 30% 40%, oklch(0.78 0.19 55 / ${wallGlow * 0.4}) 0%, transparent 50%)`,
      }}/>

      {/* Window - shows sky/weather */}
      <button onClick={() => onOpen("photo")} title="the window" className="group absolute right-[10%] top-[15%] h-40 w-56 overflow-hidden rounded-lg border-4 border-[oklch(0.3_0.05_35)] shadow-2xl">
        <div className="absolute inset-0" style={{ background: SKY[phase], animation: "slow-pan 40s ease-in-out infinite alternate" }}/>
        {phase === "night" && Array.from({ length: 20 }).map((_,i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{
            width: 1.5, height: 1.5, left: `${Math.random()*100}%`, top: `${Math.random()*70}%`,
            animation: `twinkle ${2+Math.random()*3}s ease-in-out infinite`,
          }}/>
        ))}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 48%, oklch(0.3 0.05 35) 48% 52%, transparent 52%), linear-gradient(0deg, transparent 48%, oklch(0.3 0.05 35) 48% 52%, transparent 52%)" }}/>
        {/* curtain */}
        <div className="absolute left-0 top-0 h-full w-6" style={{ background: "linear-gradient(90deg, oklch(0.5 0.08 30), oklch(0.35 0.06 30))", animation: "sway 6s ease-in-out infinite", transformOrigin: "top" }}/>
        <div className="absolute right-0 top-0 h-full w-6" style={{ background: "linear-gradient(-90deg, oklch(0.5 0.08 30), oklch(0.35 0.06 30))", animation: "sway 7s ease-in-out infinite", transformOrigin: "top" }}/>
      </button>

      {/* Bookshelf */}
      <button onClick={() => onOpen("memory")} title="bookshelf — leave a memory" className="group absolute left-[6%] top-[18%] h-52 w-40 rounded-sm shadow-2xl transition hover:brightness-110" style={{
        background: "linear-gradient(180deg, oklch(0.32 0.05 35), oklch(0.22 0.04 30))",
      }}>
        {[0,1,2,3].map(row => (
          <div key={row} className="absolute left-1 right-1 flex items-end gap-0.5" style={{ bottom: row * 46 + 8, height: 38 }}>
            {Array.from({ length: 7 }).map((_,i) => (
              <span key={i} className="flex-1 rounded-sm" style={{
                background: `oklch(${0.4 + Math.random()*0.3} ${0.08+Math.random()*0.1} ${20+Math.random()*280})`,
                height: `${70 + Math.random()*30}%`,
              }}/>
            ))}
          </div>
        ))}
      </button>

      {/* Fireplace */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-56">
        <div className="absolute inset-x-0 bottom-0 h-56 rounded-t-2xl" style={{
          background: "linear-gradient(180deg, oklch(0.32 0.04 30), oklch(0.22 0.03 25))",
        }}/>
        <div className="absolute inset-x-8 bottom-6 top-10 rounded-t-xl overflow-hidden" style={{ background: "oklch(0.1 0.02 20)" }}>
          {/* fire */}
          <div className="absolute inset-x-4 bottom-0 h-24" style={{
            background: "radial-gradient(ellipse at center bottom, oklch(0.95 0.2 90), oklch(0.75 0.22 50) 40%, oklch(0.5 0.2 30) 70%, transparent 100%)",
            filter: "blur(4px)", animation: "flicker 1.2s ease-in-out infinite",
          }}/>
          <div className="absolute inset-x-8 bottom-0 h-16" style={{
            background: "radial-gradient(ellipse at center bottom, oklch(1 0.2 90), oklch(0.85 0.22 60) 60%, transparent 100%)",
            animation: "flicker 0.8s ease-in-out infinite reverse",
          }}/>
          {/* logs */}
          <div className="absolute bottom-1 left-4 right-4 h-3 rounded-full" style={{ background: "oklch(0.25 0.04 30)" }}/>
        </div>
        {/* mantle */}
        <div className="absolute inset-x-0 top-6 h-3 rounded" style={{ background: "oklch(0.35 0.05 35)" }}/>
        {/* glow spill */}
        <div className="absolute -inset-32 -z-10 rounded-full" style={{
          background: "radial-gradient(circle, oklch(0.78 0.19 50 / 40%), transparent 60%)",
          animation: "flicker 2s ease-in-out infinite",
        }}/>
      </div>

      {/* Sofa silhouette */}
      <div className="absolute bottom-8 right-[8%] h-24 w-64 rounded-2xl shadow-2xl" style={{
        background: "linear-gradient(180deg, oklch(0.45 0.08 25), oklch(0.3 0.06 25))",
      }}>
        <div className="absolute -top-4 left-4 right-4 h-8 rounded-xl" style={{ background: "oklch(0.5 0.09 25)" }}/>
      </div>

      {/* Record player */}
      <button onClick={() => onOpen("song")} title="record player — leave a song" className="group absolute bottom-10 left-[8%] flex h-20 w-28 items-center justify-center rounded-md shadow-lg transition hover:brightness-110" style={{
        background: "oklch(0.3 0.04 30)",
      }}>
        <div className="h-14 w-14 rounded-full" style={{
          background: "radial-gradient(circle, oklch(0.65 0.15 55) 20%, oklch(0.15 0.02 20) 22%, oklch(0.15 0.02 20) 100%)",
          animation: "spin 8s linear infinite",
        }}/>
      </button>

      {/* Photos on wall */}
      <div className="absolute left-1/2 top-[18%] flex -translate-x-1/2 gap-3">
        {items.slice(0, 4).map((m, i) => (
          <button key={m.id} onClick={() => onView(m)} title={m.title}
            className="h-16 w-14 rounded-sm border-2 border-[oklch(0.5_0.06_35)] shadow-lg transition hover:scale-110" style={{
              background: `linear-gradient(135deg, oklch(${0.5 + (i%3)*0.1} 0.1 ${20 + i*50}), oklch(0.35 0.08 40))`,
              transform: `rotate(${(i%2? -1:1) * (2+i)}deg)`,
            }}/>
        ))}
        {items.length === 0 && (
          <div className="h-16 w-40 flex items-center justify-center rounded-sm border border-dashed border-primary/30 text-[10px] italic text-muted-foreground serif">
            click the bookshelf to leave a memory
          </div>
        )}
      </div>

      {/* Ember particles */}
      <div className="pointer-events-none absolute bottom-32 left-1/2 -translate-x-1/2">
        {Array.from({ length: 8 }).map((_,i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-[oklch(0.85_0.2_60)]" style={{
            left: (i-4)*8, bottom: 0, animation: `float-up ${3+Math.random()*2}s ease-out ${i*0.4}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ==================== GARDEN ==================== */
function GardenScene({ phase, onAdd, onView }: { phase: TimePhase; onAdd: (p: {x:number;y:number}) => void; onView: (m: Memory) => void }) {
  const { items } = useMemories("garden");
  return (
    <div className="scene" style={{ background: SKY[phase] }}>
      {/* rolling hills */}
      <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 1440 500" preserveAspectRatio="none" style={{ height: "70%" }}>
        <path d="M0 300 Q400 200 720 260 T1440 240 L1440 500 L0 500 Z" fill="oklch(0.45 0.09 140)"/>
        <path d="M0 380 Q360 300 720 350 T1440 340 L1440 500 L0 500 Z" fill="oklch(0.35 0.09 145)"/>
        <path d="M0 460 Q500 420 900 450 T1440 450 L1440 500 L0 500 Z" fill="oklch(0.28 0.07 150)"/>
      </svg>

      {/* butterflies */}
      {Array.from({ length: 4 }).map((_,i) => (
        <span key={i} className="absolute text-2xl" style={{
          left: `${10+i*20}%`, top: `${30+i*5}%`,
          animation: `drift ${8+i}s ease-in-out ${i}s infinite alternate`,
        }}>🦋</span>
      ))}

      {/* flowers = memories */}
      <div className="absolute inset-0">
        {items.map((m) => (
          <button key={m.id} onClick={() => onView(m)} title={m.title}
            className="group absolute" style={{ left: `${(m.x ?? 0.5) * 100}%`, top: `${(m.y ?? 0.7) * 100}%`, transform: "translate(-50%,-50%)" }}>
            <Flower/>
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] italic text-foreground/90 opacity-0 group-hover:opacity-100 transition serif">{m.title}</span>
          </button>
        ))}
      </div>

      {/* click grass to plant */}
      <button onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onAdd({ x: (e.clientX - r.left)/r.width, y: (e.clientY - r.top)/r.height });
      }} className="absolute inset-x-0 bottom-0 top-[45%] cursor-crosshair"/>

      <p className="pointer-events-none absolute inset-x-0 bottom-24 text-center serif text-sm italic text-foreground/70">
        click the meadow to plant a memory
      </p>
    </div>
  );
}
function Flower() {
  const hue = 20 + Math.floor(Math.random() * 320);
  return (
    <svg width="36" height="46" viewBox="0 0 36 46" className="drop-shadow transition group-hover:scale-125">
      <line x1="18" y1="46" x2="18" y2="20" stroke="oklch(0.4 0.1 145)" strokeWidth="2"/>
      <g style={{ transformOrigin: "18px 16px", animation: "sway 4s ease-in-out infinite" }}>
        {[0,72,144,216,288].map(a => (
          <ellipse key={a} cx="18" cy="8" rx="4" ry="7" fill={`oklch(0.75 0.18 ${hue})`} transform={`rotate(${a} 18 16)`}/>
        ))}
        <circle cx="18" cy="16" r="3" fill="oklch(0.9 0.15 85)"/>
      </g>
    </svg>
  );
}

/* ==================== OBSERVATORY ==================== */
function ObservatoryScene({ onAdd, onView }: { onAdd: (p: {x:number;y:number}) => void; onView: (m: Memory) => void }) {
  const { items } = useMemories("observatory");
  const stars = useMemo(() => Array.from({ length: 220 }, () => ({
    x: Math.random()*100, y: Math.random()*100,
    s: Math.random()*2 + 0.4, d: Math.random()*4 + 2,
  })), []);

  return (
    <div className="scene" style={{
      background: "radial-gradient(ellipse at 50% 100%, oklch(0.28 0.08 260) 0%, oklch(0.12 0.04 250) 60%, oklch(0.05 0.02 250) 100%)",
    }}>
      {stars.map((s, i) => (
        <span key={i} className="absolute rounded-full bg-white" style={{
          left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s,
          animation: `twinkle ${s.d}s ease-in-out infinite`, animationDelay: `${i*0.03}s`,
        }}/>
      ))}
      {/* moon */}
      <div className="absolute right-[15%] top-[15%] h-24 w-24 rounded-full" style={{
        background: "radial-gradient(circle at 30% 30%, oklch(0.98 0.02 90), oklch(0.85 0.05 250) 70%)",
        boxShadow: "0 0 60px oklch(0.85 0.05 250 / 60%)",
      }}/>

      {/* Memory stars */}
      {items.map((m) => (
        <button key={m.id} onClick={() => onView(m)} title={m.title}
          className="group absolute" style={{ left: `${(m.x ?? 0.5)*100}%`, top: `${(m.y ?? 0.5)*100}%`, transform: "translate(-50%,-50%)" }}>
          <span className="block text-2xl drop-shadow-[0_0_10px_oklch(0.9_0.2_90)] transition group-hover:scale-150" style={{
            color: "oklch(0.95 0.18 85)", animation: "twinkle 3s ease-in-out infinite",
          }}>✦</span>
          <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] italic text-foreground opacity-0 group-hover:opacity-100 serif">{m.title}</span>
        </button>
      ))}

      {/* horizon silhouette */}
      <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 1440 180" preserveAspectRatio="none" style={{ height: "22%" }}>
        <path d="M0 100 Q300 40 600 80 T1200 60 T1440 90 L1440 180 L0 180 Z" fill="oklch(0.08 0.03 250)"/>
      </svg>

      <button onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onAdd({ x: (e.clientX - r.left)/r.width, y: (e.clientY - r.top)/r.height });
      }} className="absolute inset-x-0 top-[15%] bottom-[25%] cursor-crosshair"/>

      <p className="pointer-events-none absolute inset-x-0 bottom-24 text-center serif text-sm italic text-foreground/70">
        click the sky to name a star
      </p>
    </div>
  );
}

/* ==================== LAKE ==================== */
function LakeScene({ phase, onAdd, onView }: { phase: TimePhase; onAdd: (p: {x:number;y:number}) => void; onView: (m: Memory) => void }) {
  const { items } = useMemories("lake");
  return (
    <div className="scene" style={{ background: SKY[phase] }}>
      {/* mountains */}
      <svg className="absolute inset-x-0 top-[10%] w-full" viewBox="0 0 1440 250" preserveAspectRatio="none" style={{ height: "35%" }}>
        <path d="M0 250 L200 100 L400 200 L650 60 L900 180 L1150 90 L1440 220 L1440 250 Z" fill="oklch(0.3 0.05 250 / 70%)"/>
      </svg>
      {/* moon */}
      <div className="absolute left-1/2 top-[18%] h-16 w-16 -translate-x-1/2 rounded-full" style={{
        background: "oklch(0.95 0.03 90)", boxShadow: "0 0 40px oklch(0.9 0.05 80 / 70%)",
      }}/>
      {/* water */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] overflow-hidden" style={{
        background: "linear-gradient(180deg, oklch(0.35 0.06 240) 0%, oklch(0.18 0.04 240) 100%)",
      }}>
        {/* moon reflection */}
        <div className="absolute left-1/2 top-4 h-24 w-16 -translate-x-1/2 rounded-full opacity-40 blur-md" style={{ background: "oklch(0.95 0.03 90)" }}/>
        {/* ripples */}
        {Array.from({ length: 5 }).map((_,i) => (
          <span key={i} className="absolute rounded-full border border-white/20" style={{
            left: `${20+i*15}%`, top: `${30+i*10}%`, width: 40, height: 12,
            animation: `ripple ${4+i}s ease-out infinite`, animationDelay: `${i*0.7}s`,
          }}/>
        ))}
      </div>

      {/* Paper boats = letters */}
      {items.map((m, i) => (
        <button key={m.id} onClick={() => onView(m)} title={m.title}
          className="group absolute" style={{
            left: `${(m.x ?? 0.5) * 100}%`,
            top: `${55 + ((i*13)%30)}%`,
            animation: `drift ${10+i*2}s ease-in-out infinite alternate`,
            transform: "translate(-50%,-50%)",
          }}>
          <svg width="40" height="24" viewBox="0 0 40 24" className="drop-shadow transition group-hover:scale-125">
            <path d="M2 12 L38 12 L30 22 L10 22 Z" fill="oklch(0.95 0.02 80)"/>
            <path d="M20 4 L20 14 L32 12 Z" fill="oklch(0.9 0.03 70)"/>
          </svg>
          <span className="absolute left-1/2 -top-5 -translate-x-1/2 whitespace-nowrap text-[10px] italic text-foreground opacity-0 group-hover:opacity-100 serif">{m.title}</span>
        </button>
      ))}

      <button onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onAdd({ x: (e.clientX - r.left)/r.width, y: (e.clientY - r.top)/r.height });
      }} className="absolute inset-x-0 bottom-0 top-[55%] cursor-crosshair"/>

      <p className="pointer-events-none absolute inset-x-0 bottom-24 text-center serif text-sm italic text-foreground/80">
        click the water to send a paper boat
      </p>
    </div>
  );
}

/* ==================== FOREST ==================== */
function ForestScene({ onAdd, onView }: { onAdd: (p: {x:number;y:number}) => void; onView: (m: Memory) => void }) {
  const { items } = useMemories("forest");
  const fireflies = useMemo(() => Array.from({ length: 30 }, () => ({
    x: Math.random()*100, y: 30 + Math.random()*60, d: 5 + Math.random()*8, del: Math.random()*5,
  })), []);
  return (
    <div className="scene" style={{ background: "linear-gradient(180deg, oklch(0.15 0.04 200) 0%, oklch(0.08 0.03 180) 100%)" }}>
      {/* trees layered */}
      {[0.15, 0.25, 0.4, 0.55, 0.7, 0.85].map((x, i) => <Tree key={i} x={x} scale={0.6 + i*0.15} depth={i}/>)}

      {fireflies.map((f, i) => (
        <span key={i} className="absolute h-1.5 w-1.5 rounded-full" style={{
          left: `${f.x}%`, top: `${f.y}%`,
          background: "oklch(0.95 0.2 100)",
          boxShadow: "0 0 8px oklch(0.9 0.2 100), 0 0 16px oklch(0.8 0.2 90)",
          animation: `firefly ${f.d}s ease-in-out ${f.del}s infinite`,
        }}/>
      ))}

      {/* Hidden memory glows */}
      {items.map((m) => (
        <button key={m.id} onClick={() => onView(m)} title={m.title}
          className="group absolute" style={{ left: `${(m.x ?? 0.5)*100}%`, top: `${(m.y ?? 0.6)*100}%`, transform: "translate(-50%,-50%)" }}>
          <span className="block h-6 w-6 rounded-full" style={{
            background: "radial-gradient(circle, oklch(0.9 0.15 90), transparent 70%)",
            animation: "breathe 3s ease-in-out infinite",
          }}/>
          <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-[10px] italic text-foreground opacity-0 group-hover:opacity-100 serif">{m.title}</span>
        </button>
      ))}

      <button onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onAdd({ x: (e.clientX - r.left)/r.width, y: (e.clientY - r.top)/r.height });
      }} className="absolute inset-x-0 inset-y-0 cursor-crosshair"/>

      <p className="pointer-events-none absolute inset-x-0 bottom-24 text-center serif text-sm italic text-foreground/70">
        click anywhere to hide a memory among the trees
      </p>
    </div>
  );
}
function Tree({ x, scale, depth }: { x: number; scale: number; depth: number }) {
  const dark = 0.08 + depth * 0.03;
  return (
    <div className="absolute bottom-0" style={{ left: `${x*100}%`, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "bottom" }}>
      <svg width="180" height="360" viewBox="0 0 180 360">
        <rect x="82" y="220" width="16" height="140" fill={`oklch(${dark + 0.05} 0.03 30)`}/>
        <ellipse cx="90" cy="140" rx="80" ry="130" fill={`oklch(${dark} 0.06 155)`}/>
        <ellipse cx="60" cy="180" rx="55" ry="100" fill={`oklch(${dark+0.02} 0.07 155)`}/>
        <ellipse cx="120" cy="180" rx="55" ry="100" fill={`oklch(${dark+0.02} 0.07 155)`}/>
      </svg>
    </div>
  );
}

/* ==================== MEADOW (rain) ==================== */
function MeadowScene({ onAdd, onView }: { onAdd: (p: {x:number;y:number}) => void; onView: (m: Memory) => void }) {
  const { items } = useMemories("meadow");
  return (
    <div className="scene" style={{ background: "linear-gradient(180deg, oklch(0.28 0.03 240) 0%, oklch(0.35 0.05 230) 50%, oklch(0.4 0.06 150) 100%)" }}>
      {/* rain */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 120 }).map((_,i) => (
          <span key={i} className="absolute w-px" style={{
            left: `${Math.random()*100}%`,
            top: `-10%`,
            height: 12 + Math.random()*24,
            background: "linear-gradient(180deg, transparent, oklch(0.9 0.03 240 / 60%))",
            animation: `rain-fall ${0.6+Math.random()*0.8}s linear infinite`,
            animationDelay: `${Math.random()}s`,
          }}/>
        ))}
      </div>

      {/* meadow */}
      <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 1440 300" preserveAspectRatio="none" style={{ height: "45%" }}>
        <path d="M0 100 Q720 30 1440 90 L1440 300 L0 300 Z" fill="oklch(0.4 0.08 145)"/>
        <path d="M0 180 Q720 130 1440 170 L1440 300 L0 300 Z" fill="oklch(0.32 0.08 148)"/>
      </svg>

      {/* Umbrella - single warm spot */}
      <div className="absolute left-1/2 bottom-[22%] -translate-x-1/2">
        <svg width="80" height="90" viewBox="0 0 80 90">
          <path d="M4 40 Q40 -5 76 40 Z" fill="oklch(0.55 0.2 25)"/>
          <line x1="40" y1="40" x2="40" y2="82" stroke="oklch(0.3 0.03 30)" strokeWidth="2"/>
          <path d="M40 82 Q45 88 50 84" stroke="oklch(0.3 0.03 30)" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      {items.map((m) => (
        <button key={m.id} onClick={() => onView(m)} title={m.title}
          className="group absolute" style={{ left: `${(m.x ?? 0.5)*100}%`, top: `${(m.y ?? 0.7)*100}%`, transform: "translate(-50%,-50%)" }}>
          <span className="block text-2xl transition group-hover:scale-125">🌿</span>
          <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-[10px] italic text-foreground opacity-0 group-hover:opacity-100 serif">{m.title}</span>
        </button>
      ))}

      <button onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onAdd({ x: (e.clientX - r.left)/r.width, y: (e.clientY - r.top)/r.height });
      }} className="absolute inset-x-0 bottom-0 top-[35%] cursor-crosshair"/>

      <p className="pointer-events-none absolute inset-x-0 bottom-24 text-center serif text-sm italic text-foreground/80">
        click the meadow to leave a small thought in the rain
      </p>
    </div>
  );
}
