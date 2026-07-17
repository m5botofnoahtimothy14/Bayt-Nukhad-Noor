import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AtriumScene } from "./AtriumScene";
import { DreamsChamber } from "./DreamsChamber";
import { LittleFamilyChamber } from "./LittleFamilyChamber";
import BucketListChamber from "./BucketListChamber";
import { MemoryBoothChamber } from "./MemoryBoothChamber";
import HiddenSurpriseChamber from "./HiddenSurpriseChamber";
import ReservedHome from "./ReservedHome";
import { ObservatoryChamber } from "./ObservatoryChamber";
import { useFamilyChamberMusic } from "@/hooks/useFamilyChamberMusic";
import { stopAll } from "@/lib/audioEngine";

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
        return <LittleFamilyChamber onBack={goBack} />;
      case "bucket-list":
        return <BucketListChamber onBack={goBack} />;
      case "memory-booth":
        return <MemoryBoothChamber onBack={goBack} />;
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
    </div>
  );
}
