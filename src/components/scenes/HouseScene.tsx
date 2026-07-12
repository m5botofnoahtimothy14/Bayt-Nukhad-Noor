import { useEffect, useMemo, useState } from "react";
import { useTimeOfDay, SKY, type TimePhase } from "@/hooks/useTimeOfDay";
import { useMemories, type Memory } from "@/components/world/memories";
import { SceneModelOverlay, VinylPlayerModel, HouseplantModel } from "@/components/models";
import { useSharedState } from "@/hooks/useSharedState";
import { Flame, Music2, Plus } from "lucide-react";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

const BOOK_COLORS = Array.from({ length: 35 }, (_, i) => ({
  bg: `oklch(${0.32 + ((i * 7) % 10) * 0.04} ${0.08 + ((i * 3) % 5) * 0.02} ${(350 + i * 17) % 360})`,
  h: 55 + ((i * 13) % 45),
}));

const TRACKS = [
  { title: "La Vie en Rose", artist: "Édith Piaf" },
  { title: "Moon River", artist: "Audrey Hepburn" },
  { title: "Kaze no Tōrimichi", artist: "Joe Hisaishi" },
  { title: "Nuvole Bianche", artist: "Ludovico Einaudi" },
  { title: "Fann Ya Gharam", artist: "Fairuz" },
  { title: "Clair de Lune", artist: "Debussy" },
];

type FireplaceState = { warmth: number; lastLogAt: string };
type VinylState = { trackIdx: number; playing: boolean; startedAt: string };

export function HouseScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("house");

  // ── Shared realtime features ────────────────────────────────
  const fireplace = useSharedState<FireplaceState>("house.fireplace", {
    warmth: 40,
    lastLogAt: new Date().toISOString(),
  });
  const vinyl = useSharedState<VinylState>("house.vinyl", {
    trackIdx: 0,
    playing: false,
    startedAt: new Date().toISOString(),
  });

  // Warmth decays over real time (visual only; 1 point / 30s)
  const [warmthNow, setWarmthNow] = useState(fireplace.value.warmth);
  useEffect(() => {
    const tick = () => {
      const elapsedMin =
        (Date.now() - new Date(fireplace.value.lastLogAt).getTime()) / 60000;
      const decayed = Math.max(0, fireplace.value.warmth - elapsedMin * 2);
      setWarmthNow(decayed);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [fireplace.value]);

  const addLog = () =>
    fireplace.setValue({
      warmth: Math.min(100, warmthNow + 25),
      lastLogAt: new Date().toISOString(),
    });

  const nextTrack = () =>
    vinyl.setValue({
      trackIdx: (vinyl.value.trackIdx + 1) % TRACKS.length,
      playing: true,
      startedAt: new Date().toISOString(),
    });
  const toggleVinyl = () =>
    vinyl.setValue({ ...vinyl.value, playing: !vinyl.value.playing });

  const currentTrack = TRACKS[vinyl.value.trackIdx] ?? TRACKS[0];

  // Dual timezone clock
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  const noahTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const khadijaTZ =
    noahTZ === "Asia/Dubai" ? "Europe/London" : "Asia/Dubai";
  const fmt = (tz: string) =>
    now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });

  const wallGlow = phase === "night" || phase === "dusk" ? 0.9 : 0.4;
  const flameIntensity = 0.4 + (warmthNow / 100) * 0.8;

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

  const windowStars = useMemo(
    () =>
      phase === "night"
        ? Array.from({ length: 28 }, (_, i) => ({
            left: 5 + ((i * 3.7) % 90),
            top: 5 + ((i * 4.3) % 65),
            size: 1 + (i % 3) * 0.5,
            dur: 2 + ((i * 1.3) % 3),
            delay: (i * 0.3) % 3,
          }))
        : [],
    [phase],
  );

  return (
    <div
      className="scene scene-container vignette-soft scene-3d"
      style={{
        background: `linear-gradient(180deg, oklch(0.18 0.04 350) 0%, oklch(0.14 0.03 5) 100%)`,
      }}
    >
      {/* Far wall */}
      <div
        className="depth-layer depth-farthest absolute inset-0"
        style={{
          background: `
          repeating-linear-gradient(90deg, oklch(0.26 0.05 355) 0 95px, oklch(0.23 0.05 355) 95px 96px),
          radial-gradient(ellipse at 35% 40%, oklch(0.72 0.14 15 / ${wallGlow * flameIntensity * 0.4}) 0%, transparent 55%),
          radial-gradient(ellipse at 65% 55%, oklch(0.68 0.12 25 / ${wallGlow * flameIntensity * 0.2}) 0%, transparent 40%)
        `,
        }}
      />

      {/* Warm ambient wash from fireplace, scaled by warmth */}
      <div
        className="depth-layer depth-farthest absolute bottom-0 left-1/2 -translate-x-1/2 w-[650px] h-[450px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center bottom, oklch(0.72 0.14 15 / ${flameIntensity * 20}%), transparent 70%)`,
          animation: "flicker 3.5s ease-in-out infinite",
          opacity: 0.3 + flameIntensity * 0.7,
          transition: "opacity 2s ease-out",
        }}
      />

      {/* Dust */}
      <div className="pointer-events-none absolute inset-0 depth-layer depth-mid">
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
                background: "oklch(0.82 0.10 25 / 40%)",
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animation: `dust-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Window */}
      <button
        onClick={() => onOpen("photo")}
        title="the window"
        className="depth-layer depth-near group absolute right-[7%] top-[10%] h-48 w-64 overflow-hidden rounded-xl border-4 border-[oklch(0.28_0.05_350)] shadow-2xl transition-all duration-700 hover:scale-[1.04]"
      >
        <div className="absolute inset-0" style={{ background: SKY[phase] }} />
        {windowStars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.left}%`,
              top: `${s.top}%`,
              animation: `twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
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
      </button>

      {/* ── DUAL CLOCK on the mantel ────────────────────────── */}
      <div className="depth-layer depth-near absolute left-1/2 top-[42%] -translate-x-1/2 flex gap-6 rounded-2xl border border-white/10 bg-black/40 px-5 py-2.5 backdrop-blur-md shadow-2xl">
        {[
          { name: "Noah", tz: noahTZ },
          { name: "Khadija", tz: khadijaTZ },
        ].map((p) => (
          <div key={p.name} className="text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-primary/70 serif">
              {p.name}
            </p>
            <p className="serif text-xl italic text-foreground tabular-nums">
              {fmt(p.tz)}
            </p>
            <p className="text-[8px] text-muted-foreground">{p.tz.split("/")[1] ?? p.tz}</p>
          </div>
        ))}
      </div>

      {/* Bookshelf */}
      <button
        onClick={() => onOpen("memory")}
        title="bookshelf — leave a memory"
        className="depth-layer depth-near group absolute left-[4%] top-[13%] h-60 w-48 rounded-sm shadow-2xl transition-all duration-300 hover:brightness-110"
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
                className="flex-1 rounded-sm"
                style={{
                  background: BOOK_COLORS[row * 7 + i]?.bg ?? "oklch(0.35 0.05 350)",
                  height: `${BOOK_COLORS[row * 7 + i]?.h ?? 80}%`,
                  boxShadow: "inset -2px 0 4px oklch(0 0 0 / 20%)",
                }}
              />
            ))}
          </div>
        ))}
      </button>

      {/* ── FIREPLACE (interactive: click to add a log) ────── */}
      <button
        onClick={addLog}
        title="add a log to the fire"
        className="depth-layer group absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-64 focus:outline-none"
      >
        <div className="absolute inset-x-0 top-6 h-4 rounded" style={{ background: "oklch(0.32 0.05 350)" }} />
        <div className="absolute inset-x-8 bottom-0 top-12 rounded-t-2xl overflow-hidden" style={{ background: "oklch(0.07 0.02 350)" }}>
          <div
            className="absolute inset-x-4 bottom-0"
            style={{
              height: `${40 + flameIntensity * 90}px`,
              background:
                "radial-gradient(ellipse at center bottom, oklch(0.85 0.2 15), oklch(0.65 0.2 10) 35%, oklch(0.45 0.18 5) 65%, transparent 100%)",
              filter: "blur(5px)",
              animation: "flicker 1.2s ease-in-out infinite",
              opacity: 0.2 + flameIntensity,
              transition: "height 1.2s ease-out, opacity 1.2s ease-out",
            }}
          />
          <div
            className="absolute inset-x-10 bottom-0"
            style={{
              height: `${30 + flameIntensity * 60}px`,
              background:
                "radial-gradient(ellipse at center bottom, oklch(0.95 0.18 20), oklch(0.8 0.2 15) 55%, transparent 100%)",
              animation: "flicker 0.8s ease-in-out infinite reverse",
              opacity: 0.2 + flameIntensity,
              transition: "height 1.2s ease-out",
            }}
          />
          <div className="absolute bottom-1 left-3 right-3 h-3.5 rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.18 0.03 350), oklch(0.25 0.04 5), oklch(0.18 0.03 350))" }} />
        </div>
        {/* Warmth badge */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] backdrop-blur-md">
          <Flame size={11} className="text-primary" />
          <span className="text-foreground tabular-nums">{Math.round(warmthNow)}°</span>
          <Plus size={10} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
        </div>
      </button>

      {/* Sofa */}
      <div
        className="depth-layer depth-near absolute bottom-5 right-[6%] h-28 w-72 rounded-3xl shadow-2xl"
        style={{ background: "linear-gradient(180deg, oklch(0.42 0.08 355), oklch(0.28 0.06 355))" }}
      >
        <div className="absolute -top-5 left-4 right-4 h-10 rounded-2xl" style={{ background: "oklch(0.46 0.09 355)" }} />
      </div>

      {/* ── VINYL PLAYER (click record to play/pause, needle to next) ── */}
      <div className="depth-layer depth-near absolute bottom-6 left-[5%] flex flex-col items-start gap-2">
        <button
          onClick={() => onOpen("song")}
          title="record player — leave a song"
          className="group flex h-24 w-32 items-center justify-center rounded-xl shadow-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.06] pointer-events-auto relative"
        >
          <SceneModelOverlay>
            <VinylPlayerModel position={[0, -1.2, 0]} scale={0.4} rotation={[0, -Math.PI / 6, 0]} />
          </SceneModelOverlay>
        </button>
        <div className="min-w-[9rem] rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 backdrop-blur-md text-left">
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-primary/70">
            <Music2 size={9} />
            {vinyl.value.playing ? "now playing" : "paused"}
          </div>
          <p className="serif text-xs italic text-foreground truncate">{currentTrack.title}</p>
          <p className="text-[9px] text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Memory photos strip */}
      <div className="depth-layer depth-mid absolute left-[33%] top-[16%] flex gap-4">
        {items.slice(0, 4).map((m, i) => (
          <button
            key={m.id}
            onClick={() => onView(m)}
            title={m.title}
            className="h-20 w-16 rounded-sm border-2 border-[oklch(0.45_0.06_350)] shadow-xl transition-all duration-500 hover:scale-110"
            style={{
              background: `linear-gradient(135deg, oklch(${0.42 + (i % 3) * 0.08} 0.12 ${350 + i * 20}), oklch(0.32 0.08 10))`,
              transform: `perspective(600px) rotateY(${i % 2 ? -3 : 3}deg) rotateX(2deg)`,
            }}
          />
        ))}
        {items.length === 0 && (
          <div className="h-20 w-52 flex items-center justify-center rounded-sm border border-dashed border-primary/30 text-xs italic text-muted-foreground serif">
            click the bookshelf to leave a memory
          </div>
        )}
      </div>

      {/* === INDOOR PLANT - 3D model === */}
      <div className="depth-layer depth-near absolute bottom-0 right-[28%] pointer-events-none">
        <SceneModelOverlay>
          <HouseplantModel position={[0, -1.5, 0]} scale={0.5} />
        </SceneModelOverlay>
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

      {/* Embers scaled by warmth */}
      <div className="pointer-events-none absolute bottom-40 left-1/2 -translate-x-1/2" style={{ opacity: flameIntensity }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + (i % 3) * 0.5,
              height: 1 + (i % 3) * 0.5,
              left: (i - 6) * 6,
              bottom: 0,
              background: i % 2 ? "oklch(0.85 0.18 15)" : "oklch(0.80 0.16 5)",
              animation: `ember-rise ${3 + ((i * 0.6) % 2.5)}s ease-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floor gradient */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(0deg, oklch(0.15 0.03 350), transparent)" }}
      />
    </div>
  );
}
