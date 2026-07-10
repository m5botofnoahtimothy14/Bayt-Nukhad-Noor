import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { Cat } from "@/components/world/Cat";
import { AddMemoryDialog, ViewMemoryDialog, type Memory } from "@/components/world/memories";
import { HouseScene } from "@/components/scenes/HouseScene";
import { GardenScene } from "@/components/scenes/GardenScene";
import { ObservatoryScene } from "@/components/scenes/ObservatoryScene";
import { LakeScene } from "@/components/scenes/LakeScene";
import { ForestScene } from "@/components/scenes/ForestScene";
import { MeadowScene } from "@/components/scenes/MeadowScene";
import { Home, Flower2, Star, Waves, Trees, CloudRain, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/world")({
  head: () => ({ meta: [{ title: "Our Universe" }] }),
  component: World,
});

type Loc = "house" | "garden" | "observatory" | "lake" | "forest" | "meadow";

const LOCATIONS: { id: Loc; name: string; icon: typeof Home; hint: string }[] = [
  { id: "house", name: "The House", icon: Home, hint: "our warm cabin" },
  { id: "garden", name: "Memory Garden", icon: Flower2, hint: "flowers of us" },
  { id: "observatory", name: "Observatory", icon: Star, hint: "our sky" },
  { id: "lake", name: "Moon Lake", icon: Waves, hint: "paper boats" },
  { id: "forest", name: "Whispering Forest", icon: Trees, hint: "fireflies" },
  { id: "meadow", name: "Rain Meadow", icon: CloudRain, hint: "soft rain" },
];

function World() {
  const [loc, setLoc] = useState<Loc>("house");
  const [sceneKey, setSceneKey] = useState(0);
  const phase = useTimeOfDay();
  const navigate = useNavigate();

  const [addOpen, setAddOpen] = useState<{
    kind: "memory" | "letter" | "photo" | "song";
    pos?: { x: number; y: number } | null;
  } | null>(null);
  const [viewing, setViewing] = useState<Memory | null>(null);

  const switchScene = (newLoc: Loc) => {
    if (newLoc === loc) return;
    setLoc(newLoc);
    setSceneKey((k) => k + 1);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const currentLoc = LOCATIONS.find((l) => l.id === loc)!;

  return (
    <div className="scene">
      {/* Scene with key to force re-mount for animation */}
      <div key={sceneKey}>
        {loc === "house" && (
          <HouseScene phase={phase} onOpen={(k) => setAddOpen({ kind: k })} onView={setViewing} />
        )}
        {loc === "garden" && (
          <GardenScene
            phase={phase}
            onAdd={(p) => setAddOpen({ kind: "memory", pos: p })}
            onView={setViewing}
          />
        )}
        {loc === "observatory" && (
          <ObservatoryScene
            onAdd={(p) => setAddOpen({ kind: "memory", pos: p })}
            onView={setViewing}
          />
        )}
        {loc === "lake" && (
          <LakeScene
            phase={phase}
            onAdd={(p) => setAddOpen({ kind: "letter", pos: p })}
            onView={setViewing}
          />
        )}
        {loc === "forest" && (
          <ForestScene onAdd={(p) => setAddOpen({ kind: "memory", pos: p })} onView={setViewing} />
        )}
        {loc === "meadow" && (
          <MeadowScene onAdd={(p) => setAddOpen({ kind: "memory", pos: p })} onView={setViewing} />
        )}
      </div>

      <Cat location={loc} />

      {/* Location badge */}
      <div
        className="pointer-events-none absolute left-1/2 top-5 z-40 -translate-x-1/2 text-center"
        style={{ animation: "fade-up 0.6s ease-out both" }}
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/60 serif">{phase}</p>
        <h2 className="serif mt-1 text-2xl italic text-foreground drop-shadow-lg">
          {currentLoc.name}
        </h2>
        <p className="serif text-xs italic text-muted-foreground">{currentLoc.hint}</p>
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="absolute right-4 top-4 z-40 rounded-full border border-white/10 bg-black/20 p-2.5 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:text-foreground hover:bg-black/30 hover:scale-110"
        aria-label="Sign out"
      >
        <LogOut size={16} />
      </button>

      {/* Navigation bar */}
      <nav
        className="absolute bottom-5 left-1/2 z-40 -translate-x-1/2"
        style={{ animation: "fade-up 0.8s ease-out 0.2s both" }}
      >
        <div
          className="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1.5 shadow-2xl backdrop-blur-xl"
          style={{ boxShadow: "0 8px 40px oklch(0 0 0 / 30%), inset 0 1px 0 oklch(1 0 0 / 5%)" }}
        >
          {LOCATIONS.map((l) => {
            const Icon = l.icon;
            const active = l.id === loc;
            return (
              <button
                key={l.id}
                onClick={() => switchScene(l.id)}
                aria-label={l.name}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                style={active ? { boxShadow: "0 4px 20px oklch(0.72 0.14 15 / 30%)" } : {}}
              >
                <Icon size={18} />
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
    </div>
  );
}
