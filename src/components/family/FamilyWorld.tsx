import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Settings } from "lucide-react";
import { AtriumScene } from "./AtriumScene";
import { DreamsChamber } from "./DreamsChamber";
import { LittleFamilyChamber } from "./LittleFamilyChamber";
import BucketListChamber from "./BucketListChamber";
import { MemoryBoothChamber } from "./MemoryBoothChamber";
import HiddenSurpriseChamber from "./HiddenSurpriseChamber";
import ReservedHome from "./ReservedHome";
import { ObservatoryChamber } from "./ObservatoryChamber";
import { PhotoBooth } from "@/components/memories-room/PhotoBooth";
import { useMemoryStrips, type MemoryStrip } from "@/components/memories-room/useMemoryStrips";
import { useFamilyChamberMusic } from "@/hooks/useFamilyChamberMusic";
import { stopAll } from "@/lib/audioEngine";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type FamilyChamber =
  | "atrium"
  | "dreams"
  | "little-family"
  | "bucket-list"
  | "memory-booth"
  | "hidden-surprise"
  | "reserved-home"
  | "observatory";

type FamilyWorldProps = {
  onExit: () => void;
};

const CHAMBER_NAMES: Record<FamilyChamber, string> = {
  atrium: "The Atrium",
  dreams: "Our Dreams",
  "little-family": "Our Little Family",
  "bucket-list": "Our Bucket List",
  "memory-booth": "The Memory Booth",
  "hidden-surprise": "The Hidden Surprise",
  "reserved-home": "Our Home",
  observatory: "The Observatory",
};

export function FamilyWorld({ onExit }: FamilyWorldProps) {
  const [chamber, setChamber] = useState<FamilyChamber>("atrium");
  const [direction, setDirection] = useState(1);
  const [boothOpen, setBoothOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const { strips } = useMemoryStrips();
  const [catName, setCatName] = useState<string | null>(() => {
    try { return localStorage.getItem("family-cat-name"); } catch { return null; }
  });
  const [showReset, setShowReset] = useState(false);

  // Per-chamber music with smooth crossfading
  useFamilyChamberMusic(chamber);

  // Stop family music when unmounting (user exits back to world)
  useEffect(() => {
    return () => {
      stopAll(1500);
    };
  }, []);

  const navigateTo = useCallback((target: FamilyChamber) => {
    setDirection(1);
    setChamber(target);
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setChamber("atrium");
  }, []);

  const handleCatAdopt = useCallback((name: string) => {
    setCatName(name);
    localStorage.setItem("family-cat-name", name);
  }, []);

  const resetCat = useCallback(() => {
    setCatName(null);
    localStorage.removeItem("family-cat-name");
    setShowReset(false);
    toast.success("Cat adoption reset");
  }, []);

  const resetMemoryBooth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("memory_strips" as never).delete().eq("created_by", user.id);
    }
    setShowReset(false);
    toast.success("Memory booth cleared");
    setRefreshKey((k) => k + 1);
  }, []);

  const exitToWorld = useCallback(() => {
    setDirection(-1);
    onExit();
  }, [onExit]);

  const renderChamber = () => {
    switch (chamber) {
      case "atrium":
        return <AtriumScene onNavigate={navigateTo} onExit={exitToWorld} />;
      case "dreams":
        return <DreamsChamber onBack={goBack} />;
      case "little-family":
        return <LittleFamilyChamber onBack={goBack} catName={catName} onAdopt={handleCatAdopt} />;
      case "bucket-list":
        return <BucketListChamber onBack={goBack} />;
      case "memory-booth":
        return <MemoryBoothChamber onBack={goBack} onOpenBooth={() => setBoothOpen(true)} strips={strips} />;
      case "hidden-surprise":
        return <HiddenSurpriseChamber onBack={goBack} />;
      case "reserved-home":
        return <ReservedHome onBack={goBack} />;
      case "observatory":
        return <ObservatoryChamber onBack={goBack} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, oklch(0.15 0.04 265) 0%, oklch(0.10 0.03 350) 100%)",
      }}
    >
      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + (i % 3) * 0.5,
              height: 1 + (i % 3) * 0.5,
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 5.1) % 100}%`,
              background: i % 3 === 0
                ? "oklch(0.8 0.12 55 / 30%)"
                : i % 3 === 1
                  ? "oklch(0.75 0.10 15 / 25%)"
                  : "oklch(0.8 0.08 150 / 20%)",
              animation: `dust-float ${8 + ((i * 1.3) % 10)}s ease-in-out ${(i * 0.6) % 8}s infinite`,
              "--dx": `${-20 + ((i * 5) % 40)}px`,
              "--dy": `${-30 - ((i * 4) % 50)}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Top bar — chamber name + back */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        {chamber !== "atrium" ? (
          <motion.button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
          >
            <ArrowLeft size={16} />
            <span className="serif italic">back</span>
          </motion.button>
        ) : (
          <motion.button
            onClick={exitToWorld}
            className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
          >
            <ArrowLeft size={16} />
            <span className="serif italic">Bayt Nukhad Noor</span>
          </motion.button>
        )}

        <motion.p
          key={chamber}
          className="text-[10px] uppercase tracking-[0.4em] text-primary/40 serif"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {CHAMBER_NAMES[chamber]}
        </motion.p>

        {chamber === "atrium" && (
          <motion.button onClick={() => setShowReset(!showReset)}
            className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            whileHover={{ rotate: 90 }} title="Settings">
            <Settings size={14} />
          </motion.button>
        )}
      </div>

      {/* Chamber content with transitions */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={chamber}
          className="absolute inset-0"
          custom={direction}
          initial={{ opacity: 0, x: direction * 60, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: direction * -60, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderChamber()}
        </motion.div>
      </AnimatePresence>

      {/* Photo Booth overlay */}
      {boothOpen && (
        <PhotoBooth
          onCapture={(strip: MemoryStrip) => {
            setBoothOpen(false);
            setRefreshKey((k) => k + 1);
          }}
          onClose={() => setBoothOpen(false)}
        />
      )}

      {/* Reset panel */}
      <AnimatePresence>
        {showReset && (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowReset(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div className="relative z-10 rounded-2xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "oklch(0.16 0.04 265 / 95%)", border: "1px solid oklch(0.30 0.04 265 / 30%)",
                boxShadow: "0 20px 60px oklch(0 0 0 / 50%)" }}>
              <p className="text-[10px] uppercase tracking-[0.3em] serif text-center mb-5" style={{ color: "oklch(0.55 0.06 265 / 50%)" }}>
                Reset Data
              </p>
              <div className="space-y-3">
                <button onClick={resetCat}
                  className="w-full text-left rounded-xl px-4 py-3 transition-all group"
                  style={{ background: "oklch(0.14 0.03 265 / 60%)", border: "1px solid oklch(0.25 0.04 265 / 20%)" }}>
                  <p className="serif text-xs text-foreground/80 group-hover:text-foreground transition-colors">Reset Cat Adoption</p>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5">Clear the cat name, re-adopt</p>
                </button>
                <button onClick={resetMemoryBooth}
                  className="w-full text-left rounded-xl px-4 py-3 transition-all group"
                  style={{ background: "oklch(0.14 0.03 265 / 60%)", border: "1px solid oklch(0.25 0.04 265 / 20%)" }}>
                  <p className="serif text-xs text-foreground/80 group-hover:text-foreground transition-colors">Clear Memory Booth</p>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5">Delete all photo strips</p>
                </button>
              </div>
              <button onClick={() => setShowReset(false)}
                className="mt-4 w-full text-center text-[10px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors serif">
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
