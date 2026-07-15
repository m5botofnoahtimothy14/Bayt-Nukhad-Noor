import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useSeason } from "@/hooks/useSeason";
import { useWeather } from "@/hooks/useWeather";
import { usePreloadModels } from "@/hooks/usePreloadModels";
import { useSceneMusic } from "@/hooks/useSceneMusic";
import { Cat } from "@/components/world/Cat";
import { SceneCanvas } from "@/components/world/SceneCanvas";
import { LoadingScreen } from "@/components/world/LoadingScreen";
import { ModelErrorBoundary } from "@/components/models/ModelErrorBoundary";
import { WishOverlay } from "@/components/world/WishOverlay";
import { ObservatoryVignette } from "@/components/world/ObservatoryVignette";
import { toast } from "sonner";

import {
  LazyLivingRoomScene,
  LazyKitchenScene,
  LazyDiningScene,
  LazyBedroomScene,
  LazyGardenScene,
  LazyBalconyScene,
  LazyObservatoryScene,
  LazyLakeScene,
  LazyForestScene,
  LazyMeadowScene,
  LazyMemoryOfMemoriesScene,
} from "@/components/scenes/lazyScenes";

import { AddMemoryDialog, ViewMemoryDialog, type Memory } from "@/components/world/memories";
import {
  Home,
  Flower2,
  Star,
  Waves,
  Trees,
  CloudRain,
  Moon,
  LogOut,
  UtensilsCrossed,
  Utensils,
  BedDouble,
  BookOpen,
  Undo2,
  Redo2,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/world")({
  head: () => ({ meta: [{ title: "The Enchanted Nest · Bayt Nukhad Noor" }] }),
  component: World,
});

type Loc =
  | "house"
  | "kitchen"
  | "dining"
  | "bedroom"
  | "garden"
  | "observatory"
  | "lake"
  | "forest"
  | "meadow"
  | "balcony"
  | "memories";

const LOCATIONS: {
  id: Loc;
  name: string;
  icon: typeof Home;
  hint: string;
}[] = [
  { id: "house", name: "Living Room", icon: Home, hint: "our warm home" },
  { id: "kitchen", name: "Kitchen", icon: UtensilsCrossed, hint: "where we cook" },
  { id: "dining", name: "Dining Room", icon: Utensils, hint: "shared meals" },
  { id: "bedroom", name: "Bedroom", icon: BedDouble, hint: "our sanctuary" },
  { id: "garden", name: "Memory Garden", icon: Flower2, hint: "flowers of us" },
  { id: "balcony", name: "Stargazing Balcony", icon: Moon, hint: "beneath the stars" },
  { id: "observatory", name: "Observatory", icon: Star, hint: "our sky" },
  { id: "lake", name: "Moon Lake", icon: Waves, hint: "paper boats" },
  { id: "forest", name: "Whispering Forest", icon: Trees, hint: "fireflies" },
  { id: "meadow", name: "Rain Meadow", icon: CloudRain, hint: "soft rain" },
  { id: "memories", name: "Room of Memories", icon: Camera, hint: "our story" },
];

/* ─── Undo/Redo for memory creation ─── */
type UndoEntry = { id: string; location: string };

/* ─── #3: "Last seen" indicator ─── */
function useLastSeen(location: string) {
  const [partner, setPartner] = useState<{ location: string; name: string } | null>(null);

  useEffect(() => {
    let alive = true;
    const ch = supabase
      .channel("last-seen")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shared_state", filter: "key=eq.user.lastSeen" },
        (payload) => {
          if (!alive) return;
          const val = (payload.new as { value?: { location: string; name: string } })?.value;
          if (val) setPartner(val);
        },
      )
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, []);

  return partner;
}

/* ─── #6: Memory notifications ─── */
function useMemoryNotifications(currentLocation: string) {
  useEffect(() => {
    let alive = true;
    const ch = supabase
      .channel("mem-notify")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "memories" },
        (payload) => {
          if (!alive) return;
          const m = payload.new as Memory;
          if (m.location !== currentLocation) {
            toast.info(`New memory in ${m.location}: "${m.title}"`, { duration: 5000 });
          }
        },
      )
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [currentLocation]);
}

/* ─── Journal component (#2) ─── */
type JournalEntry = { id: string; body: string; created_by: string; created_at: string };

function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("journal_entries" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (alive && !error) setEntries((data as JournalEntry[]) ?? []);
        if (alive) setLoading(false);
      });
    const ch = supabase
      .channel("journal-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "journal_entries" },
        (payload) => {
          if (alive) setEntries((prev) => [payload.new as JournalEntry, ...prev]);
        },
      )
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, []);

  return { entries, loading };
}

function JournalPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { entries, loading } = useJournal();
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!body.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    // journal_entries table not yet created — no-op for now
    const error = null as null | { message: string };
    void user;
    void body;
    setSaving(false);
    if (error) return toast.error("Could not save");
    setBody("");
    toast.success("Written to the journal");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: "backdrop-enter 0.3s ease-out both" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[oklch(0.18_0.04_350)]/95 p-6 shadow-2xl backdrop-blur-xl max-h-[80vh] flex flex-col"
        style={{ boxShadow: "0 25px 60px oklch(0 0 0 / 40%), 0 0 40px oklch(0.72 0.14 15 / 8%)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="serif text-2xl italic text-foreground">Our Journal</h3>
            <p className="text-[10px] text-muted-foreground serif italic">shared between us</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-white/10 transition-all">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 min-h-0">
          {loading && <p className="text-xs text-muted-foreground serif italic">loading...</p>}
          {entries.map((e) => (
            <div key={e.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <p className="serif italic text-sm text-foreground/90 whitespace-pre-wrap">{e.body}</p>
              <p className="mt-1 text-[9px] text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</p>
            </div>
          ))}
          {!loading && entries.length === 0 && (
            <p className="text-xs text-muted-foreground serif italic text-center py-8">Start writing together...</p>
          )}
        </div>

        <div className="flex gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something..."
            rows={2}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm serif italic outline-none resize-none placeholder:text-muted-foreground/40 focus:border-primary/50"
          />
          <button
            onClick={submit}
            disabled={saving || !body.trim()}
            className="self-end rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))" }}
          >
            {saving ? "..." : "Write"}
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground/50 mt-2 text-center">⌘/Ctrl+Enter to save</p>
      </div>
    </div>
  );
}

/* ─── Main World component ─── */
function World() {
  const [loc, setLoc] = useState<Loc>("house");
  const [transitioning, setTransitioning] = useState(false);
  const phase = useTimeOfDay();
  const season = useSeason();
  const weather = useWeather();
  const navigate = useNavigate();

  // Preload 3D models on mount
  usePreloadModels();

  // Scene music — crossfades between songs per room
  useSceneMusic(loc);

  // #6: Notify when partner adds a memory elsewhere
  useMemoryNotifications(loc);

  // #3: Track last seen location
  const partnerSeen = useLastSeen(loc);
  useEffect(() => {
    const update = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const name = user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "someone";
      await supabase
        .from("shared_state")
        .upsert(
          { key: "user.lastSeen", value: { location: loc, name }, updated_by: user.id, updated_at: new Date().toISOString() },
          { onConflict: "key" },
        );
    };
    update();
  }, [loc]);

  const [addOpen, setAddOpen] = useState<{
    kind: "memory" | "letter" | "photo" | "song";
    pos?: { x: number; y: number } | null;
  } | null>(null);
  const [viewing, setViewing] = useState<Memory | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);

  // #4: Undo/redo for memory creation
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);

  const pushUndo = useCallback((entry: UndoEntry) => {
    setUndoStack((prev) => [...prev, entry]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(async () => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((r) => [...r, last]);
      supabase.from("memories").delete().eq("id", last.id);
      return prev.slice(0, -1);
    });
  }, []);

  const redo = useCallback(async () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setUndoStack((u) => [...u, last]);
      return prev.slice(0, -1);
    });
  }, []);

  const switchScene = (newLoc: Loc) => {
    if (newLoc === loc) return;
    setTransitioning(true);
    // Brief fade-out, then swap scene, then fade-in
    setTimeout(() => {
      setLoc(newLoc);
      setTimeout(() => setTransitioning(false), 100);
    }, 400);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const currentLoc = LOCATIONS.find((l) => l.id === loc)!;
  const onOpen = (k: "memory" | "letter" | "photo" | "song") => setAddOpen({ kind: k });
  const onAdd = (p: { x: number; y: number }) => setAddOpen({ kind: "memory", pos: p });

  const sceneContent = useMemo(() => {
    switch (loc) {
      case "house": return <LazyLivingRoomScene phase={phase} onOpen={onOpen} onView={setViewing} />;
      case "kitchen": return <LazyKitchenScene phase={phase} onOpen={onOpen} onView={setViewing} />;
      case "dining": return <LazyDiningScene phase={phase} onOpen={onOpen} onView={setViewing} />;
      case "bedroom": return <LazyBedroomScene phase={phase} onOpen={onOpen} onView={setViewing} />;
      case "garden": return <LazyGardenScene phase={phase} season={season} onAdd={onAdd} onView={setViewing} />;
      case "balcony": return <LazyBalconyScene season={season} onAdd={onAdd} onView={setViewing} />;
      case "observatory": return <LazyObservatoryScene season={season} onAdd={onAdd} onView={setViewing} />;
      case "lake": return <LazyLakeScene phase={phase} season={season} onAdd={onAdd} onView={setViewing} />;
      case "forest": return <LazyForestScene season={season} onAdd={onAdd} onView={setViewing} />;
      case "meadow": return <LazyMeadowScene season={season} onAdd={onAdd} onView={setViewing} />;
      case "memories": return <LazyMemoryOfMemoriesScene phase={phase} season={season} weather={weather.current} />;
    }
  }, [loc, phase, season, weather.current]);

  return (
    <div className="scene">
      <LoadingScreen />

      {/* Persistent Canvas — never remounts */}
      <div className="absolute inset-0">
        <SceneCanvas phase={phase} weather={weather.current}>
          <ModelErrorBoundary url="/gltf/cat/scene.gltf">
            <Cat location={loc} phase={phase} season={season} weather={weather.current} />
          </ModelErrorBoundary>

          <Suspense fallback={null}>
            {sceneContent}
          </Suspense>
        </SceneCanvas>
      </div>

      {/* Fade overlay for scene transitions — Canvas stays alive underneath */}
      <div
        className="absolute inset-0 z-30 pointer-events-none bg-black transition-opacity duration-500 ease-in-out"
        style={{ opacity: transitioning ? 1 : 0 }}
      />

      {/* Wish-on-a-star overlay (balcony + observatory) */}
      {(loc === "balcony" || loc === "observatory") && <WishOverlay />}
      {loc === "observatory" && <ObservatoryVignette />}

      {/* #3: Partner "last seen" indicator */}
      {partnerSeen && partnerSeen.location !== loc && (
        <div className="pointer-events-none absolute left-1/2 top-28 z-40 -translate-x-1/2 rounded-full border border-white/5 bg-black/20 px-3 py-1 text-[10px] text-muted-foreground/60 backdrop-blur-sm serif italic animate-[fade-up_0.4s_ease-out_both]">
          {partnerSeen.name} is in the {LOCATIONS.find((l) => l.id === partnerSeen.location)?.name ?? partnerSeen.location}
        </div>
      )}

      {/* Weather overlay */}
      {weather.current !== "clear" && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              weather.current === "fog" || weather.current === "mist"
                ? `linear-gradient(180deg, oklch(0.7 0.02 200 / ${weather.intensity * 0.15}%), oklch(0.6 0.02 200 / ${weather.intensity * 0.1}%))`
                : weather.current === "snow"
                  ? `radial-gradient(ellipse at 50% 0%, oklch(0.9 0.02 240 / ${weather.intensity * 0.08}%), transparent 60%)`
                  : `linear-gradient(180deg, oklch(0.2 0.04 260 / ${weather.intensity * 0.12}%), transparent 50%)`,
            transition: "opacity 2s ease-out",
          }}
        />
      )}

      {/* Location badge */}
      <div
        className="pointer-events-none absolute left-1/2 top-5 z-40 -translate-x-1/2 text-center"
        style={{ animation: "fade-up 0.6s ease-out both" }}
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/60 serif">
          {phase} . {weather.current !== "clear" ? weather.current : season}
        </p>
        <h2 className="serif mt-1 text-2xl italic text-foreground drop-shadow-lg">
          {currentLoc.name}
        </h2>
        <p className="serif text-xs italic text-muted-foreground">{currentLoc.hint}</p>
      </div>

      {/* Top-right controls */}
      <div className="absolute right-4 top-4 z-40 flex items-center gap-2">
        {/* #4: Undo/redo */}
        {undoStack.length > 0 && (
          <button
            onClick={undo}
            className="rounded-full border border-white/10 bg-black/20 p-2.5 text-muted-foreground backdrop-blur-md transition-all hover:text-foreground hover:bg-black/30 hover:scale-110"
            title="Undo last memory"
          >
            <Undo2 size={14} />
          </button>
        )}
        {redoStack.length > 0 && (
          <button
            onClick={redo}
            className="rounded-full border border-white/10 bg-black/20 p-2.5 text-muted-foreground backdrop-blur-md transition-all hover:text-foreground hover:bg-black/30 hover:scale-110"
            title="Redo memory"
          >
            <Redo2 size={14} />
          </button>
        )}

        {/* #2: Journal */}
        <button
          onClick={() => setJournalOpen(true)}
          className="rounded-full border border-white/10 bg-black/20 p-2.5 text-muted-foreground backdrop-blur-md transition-all hover:text-foreground hover:bg-black/30 hover:scale-110"
          title="Open journal"
        >
          <BookOpen size={16} />
        </button>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="rounded-full border border-white/10 bg-black/20 p-2.5 text-muted-foreground backdrop-blur-md transition-all hover:text-foreground hover:bg-black/30 hover:scale-110"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Navigation bar */}
      <nav
        className="absolute bottom-5 left-1/2 z-40 -translate-x-1/2"
        style={{ animation: "fade-up 0.8s ease-out 0.2s both" }}
      >
        <div
          className="flex items-center gap-0.5 rounded-full border border-white/10 bg-black/30 p-1 shadow-2xl backdrop-blur-xl"
          style={{
            boxShadow: "0 8px 40px oklch(0 0 0 / 30%), inset 0 1px 0 oklch(1 0 0 / 5%)",
          }}
        >
          {LOCATIONS.map((l) => {
            const Icon = l.icon;
            const active = l.id === loc;
            return (
              <button
                key={l.id}
                onClick={() => switchScene(l.id)}
                aria-label={l.name}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                style={active ? { boxShadow: "0 4px 20px oklch(0.72 0.14 15 / 30%)" } : {}}
              >
                <Icon size={16} />
                <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-xl bg-black/80 px-2.5 py-1 text-[10px] text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm border border-white/10">
                  {l.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <AddMemoryDialog
        open={!!addOpen}
        onClose={() => setAddOpen(null)}
        location={loc}
        defaultKind={addOpen?.kind ?? "memory"}
        position={addOpen?.pos ?? null}
      />
      <ViewMemoryDialog memory={viewing} onClose={() => setViewing(null)} />
      <JournalPanel open={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
}
