import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onBack: () => void };

type Inspectable = {
  id: string;
  emoji: string;
  label: string;
  clue: string;
  detail: string;
  rotation?: number;
  zoom?: number;
};

const OBJECTS: Inspectable[] = [
  { id: "suitcase", emoji: "🧳", label: "A small suitcase", clue: "packed for two", detail: "Two passports inside. One is yours.", rotation: -5 },
  { id: "ticket", emoji: "🎫", label: "A golden ticket", clue: "destination: unknown", detail: "The destination field is left blank. On purpose.", zoom: 1.2 },
  { id: "passport", emoji: "🛂", label: "A passport", clue: "stamped with hope", detail: "Fresh stamps from a place neither of us has been.", rotation: 3 },
  { id: "map", emoji: "🗺️", label: "A folded map", clue: "marked with a heart", detail: "A tiny heart drawn on a coastal town.", zoom: 1.15 },
  { id: "compass", emoji: "🧭", label: "An old compass", clue: "points to you", detail: "The needle always finds its way.", rotation: -8 },
  { id: "calendar", emoji: "📅", label: "A circled date", clue: "one day is circled", detail: "A date marked in red. No year. Just 'someday.'", zoom: 1.1 },
];

const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  delay: (i * 0.6) % 6,
  duration: 2.5 + (i % 4) * 0.8,
  size: 1.5 + (i % 3),
}));

export default function HiddenSurpriseChamber({ onBack }: Props) {
  const [inspecting, setInspecting] = useState<Inspectable | null>(null);
  const [collectedClues, setCollectedClues] = useState<Set<string>>(new Set());
  const [boardOpen, setBoardOpen] = useState(false);

  const inspect = useCallback((obj: Inspectable) => {
    setInspecting(obj);
    setCollectedClues((prev) => new Set(prev).add(obj.id));
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto relative" style={{ background: "oklch(0.14 0.03 40)" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 35% 25%, oklch(0.20 0.05 45 / 35%) 0%, transparent 55%), radial-gradient(ellipse at 70% 75%, oklch(0.17 0.04 55 / 25%) 0%, transparent 50%)" }} />

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {SPARKLES.map((s) => (
          <span key={s.id} className="absolute rounded-full"
            style={{ width: s.size, height: s.size, left: s.left, top: s.top,
              background: "oklch(0.90 0.04 80 / 50%)", boxShadow: `0 0 ${s.size * 3}px oklch(0.90 0.04 80 / 30%)`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 flex flex-col items-center min-h-full">

        {/* Title */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] uppercase tracking-[0.5em] serif mb-3" style={{ color: "oklch(0.55 0.05 50 / 40%)" }}>Chamber 05</p>
          <h1 className="serif text-4xl md:text-5xl italic" style={{ color: "oklch(0.82 0.08 55)", textShadow: "0 0 60px oklch(0.75 0.10 55 / 15%)" }}>
            The Hidden Surprise
          </h1>
          <p className="serif italic text-sm mt-3" style={{ color: "oklch(0.55 0.05 50 / 60%)" }}>something is waiting...</p>
        </motion.div>

        {/* Inspectable objects shelf */}
        <motion.div className="w-full max-w-3xl mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-center mb-6 serif" style={{ color: "oklch(0.50 0.04 55 / 50%)" }}>
            Tap an object to inspect it
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {OBJECTS.map((obj, i) => (
              <motion.button key={obj.id}
                className="group relative rounded-2xl p-4 text-center overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.08, y: -4, rotate: obj.rotation ?? 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => inspect(obj)}
                style={{ background: collectedClues.has(obj.id) ? "oklch(0.22 0.05 55 / 60%)" : "oklch(0.18 0.03 45 / 50%)",
                  border: `1px solid ${collectedClues.has(obj.id) ? "oklch(0.55 0.08 55 / 35%)" : "oklch(0.35 0.06 50 / 20%)"}` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 40%, oklch(0.70 0.10 55 / 15%), transparent 70%)" }} />
                <span className="text-3xl md:text-4xl block mb-2 relative z-10 select-none group-hover:scale-110 transition-transform">{obj.emoji}</span>
                <span className="text-[10px] serif italic relative z-10 leading-tight block" style={{ color: "oklch(0.65 0.06 55 / 70%)" }}>{obj.label}</span>
                {collectedClues.has(obj.id) && (
                  <span className="absolute top-1.5 right-1.5 text-[8px] rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ background: "oklch(0.60 0.10 55 / 40%)", color: "oklch(0.90 0.04 55)" }}>✓</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Clue board toggle */}
        <motion.button
          className="serif rounded-full px-6 py-2.5 text-xs tracking-wider transition-all mb-8"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setBoardOpen(!boardOpen)}
          style={{ background: "oklch(0.22 0.04 55 / 60%)", border: "1px solid oklch(0.45 0.07 55 / 25%)",
            color: "oklch(0.70 0.08 55 / 80%)" }}>
          📋 Clue Board ({collectedClues.size}/{OBJECTS.length})
        </motion.button>

        {/* Clue board */}
        <AnimatePresence>
          {boardOpen && (
            <motion.div
              className="w-full max-w-lg mb-10 rounded-2xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "oklch(0.18 0.03 45 / 70%)", border: "1px solid oklch(0.40 0.06 55 / 25%)",
                backdropFilter: "blur(12px)" }}>
              <p className="text-[10px] uppercase tracking-[0.3em] serif mb-4 text-center" style={{ color: "oklch(0.55 0.05 55 / 60%)" }}>
                Clues Discovered
              </p>
              {collectedClues.size === 0 ? (
                <p className="serif italic text-xs text-center py-4" style={{ color: "oklch(0.45 0.04 55 / 50%)" }}>
                  Tap objects above to discover clues...
                </p>
              ) : (
                <div className="space-y-2">
                  {OBJECTS.filter((obj) => collectedClues.has(obj.id)).map((obj, i) => (
                    <motion.div key={obj.id}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                      initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ background: "oklch(0.22 0.04 55 / 40%)", borderLeft: "2px solid oklch(0.60 0.10 55 / 40%)" }}>
                      <span className="text-lg">{obj.emoji}</span>
                      <div>
                        <p className="serif italic text-xs" style={{ color: "oklch(0.75 0.08 55 / 80%)" }}>{obj.clue}</p>
                        <p className="text-[10px] serif" style={{ color: "oklch(0.50 0.04 55 / 50%)" }}>{obj.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {collectedClues.size === OBJECTS.length && (
                <motion.p className="serif italic text-xs text-center mt-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  style={{ color: "oklch(0.70 0.10 55 / 70%)" }}>
                  The picture becomes clearer. A journey is taking shape.
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom mystery text */}
        <motion.p className="serif italic text-sm text-center mt-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}
          style={{ color: "oklch(0.45 0.04 55 / 40%)" }}>
          Some things are worth waiting for.
        </motion.p>
      </div>

      {/* Object inspect overlay */}
      <AnimatePresence>
        {inspecting && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setInspecting(null)}
            style={{ background: "oklch(0.10 0.02 40 / 90%)", backdropFilter: "blur(12px)" }}>
            <motion.div
              className="relative max-w-sm w-full rounded-3xl p-8 text-center cursor-pointer"
              initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.85, opacity: 0, rotateY: 15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "linear-gradient(135deg, oklch(0.22 0.05 55 / 90%), oklch(0.18 0.04 45 / 95%))",
                border: "1px solid oklch(0.50 0.08 55 / 25%)",
                boxShadow: "0 0 80px oklch(0.60 0.10 55 / 15%), 0 20px 60px oklch(0.10 0.02 40 / 50%)" }}>
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 30%, oklch(0.70 0.10 55 / 10%), transparent 60%)" }} />
              <span className="text-6xl block mb-4 relative z-10 select-none"
                style={{ transform: `scale(${inspecting.zoom ?? 1}) rotate(${inspecting.rotation ?? 0}deg)` }}>
                {inspecting.emoji}
              </span>
              <h3 className="serif text-lg italic mb-2 relative z-10" style={{ color: "oklch(0.85 0.08 55)" }}>{inspecting.label}</h3>
              <p className="serif italic text-xs mb-4 relative z-10" style={{ color: "oklch(0.65 0.08 55 / 70%)" }}>{inspecting.clue}</p>
              <div className="w-12 h-px mx-auto mb-4 relative z-10" style={{ background: "oklch(0.40 0.06 55 / 30%)" }} />
              <p className="serif text-sm italic leading-relaxed relative z-10" style={{ color: "oklch(0.75 0.06 55 / 60%)" }}>{inspecting.detail}</p>
              <motion.button
                className="mt-6 serif text-[10px] uppercase tracking-[0.3em] relative z-10 cursor-pointer"
                style={{ color: "oklch(0.50 0.05 55 / 50%)" }}
                whileHover={{ color: "oklch(0.70 0.08 55 / 80%)" }}
                onClick={() => setInspecting(null)}>
                close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
