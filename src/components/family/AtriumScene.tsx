import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FamilyChamber } from "./FamilyWorld";

type AtriumProps = {
  onNavigate: (chamber: FamilyChamber) => void;
  onExit: () => void;
};

type BookEntry = { author: string; message: string; date: string };

const CHAMBERS = [
  { id: "dreams" as FamilyChamber, title: "Our Dreams", subtitle: "hopes for tomorrow", icon: "☆", color: "oklch(0.65 0.12 55)", glow: "oklch(0.65 0.12 55 / 20%)" },
  { id: "little-family" as FamilyChamber, title: "Our Little Family", subtitle: "the warmth we already have", icon: "🐈", color: "oklch(0.70 0.10 90)", glow: "oklch(0.70 0.10 90 / 20%)" },
  { id: "bucket-list" as FamilyChamber, title: "Our Bucket List", subtitle: "dreams waiting to happen", icon: "📖", color: "oklch(0.60 0.14 15)", glow: "oklch(0.60 0.14 15 / 20%)" },
  { id: "memory-booth" as FamilyChamber, title: "The Memory Booth", subtitle: "moments for forever", icon: "📷", color: "oklch(0.55 0.12 350)", glow: "oklch(0.55 0.12 350 / 20%)" },
  { id: "hidden-surprise" as FamilyChamber, title: "The Hidden Surprise", subtitle: "something is waiting...", icon: "🎁", color: "oklch(0.55 0.15 280)", glow: "oklch(0.55 0.15 280 / 20%)" },
  { id: "reserved-home" as FamilyChamber, title: "Our Home", subtitle: "this door isn't closed", icon: "🏠", color: "oklch(0.50 0.10 150)", glow: "oklch(0.50 0.10 150 / 20%)" },
  { id: "observatory" as FamilyChamber, title: "The Observatory", subtitle: "a place to simply be", icon: "🔭", color: "oklch(0.55 0.08 260)", glow: "oklch(0.55 0.08 260 / 20%)" },
];

const DEFAULT_ENTRIES: BookEntry[] = [
  { author: "A Cat", message: "The sunbeam on the floor is mine.", date: "just now" },
  { author: "The House", message: "Welcome home. The kettle is always warm.", date: "a while ago" },
  { author: "A Star", message: "I watched you from the observatory. You looked peaceful.", date: "last night" },
];

const CAT_PATHS = [
  { start: { x: -40, y: 75 }, end: { x: 105, y: 75 }, duration: 25, flip: false },
  { start: { x: 105, y: 82 }, end: { x: -40, y: 82 }, duration: 30, flip: true },
  { start: { x: 50, y: -30 }, end: { x: 50, y: 105 }, duration: 20, flip: false },
];

const PAWS = ["🐾", "🐾"];

export function AtriumScene({ onNavigate }: AtriumProps) {
  const [bookOpen, setBookOpen] = useState(false);
  const [entries, setEntries] = useState<BookEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("atrium-book") || "null") ?? DEFAULT_ENTRIES; }
    catch { return DEFAULT_ENTRIES; }
  });
  const [newEntry, setNewEntry] = useState("");
  const [catPath, setCatPath] = useState(0);
  const [catPaused, setCatPaused] = useState(false);

  const saveEntries = useCallback((e: BookEntry[]) => {
    setEntries(e);
    localStorage.setItem("atrium-book", JSON.stringify(e));
  }, []);

  const addEntry = useCallback(() => {
    if (!newEntry.trim()) return;
    const entry: BookEntry = { author: "You", message: newEntry.trim(), date: "just now" };
    saveEntries([entry, ...entries]);
    setNewEntry("");
  }, [newEntry, entries, saveEntries]);

  const cyclePath = useCallback(() => {
    setCatPath((p) => (p + 1) % CAT_PATHS.length);
  }, []);

  const currentPath = CAT_PATHS[catPath];

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-20 overflow-y-auto relative">
      {/* Skylight sunbeam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
          style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.85 0.10 55 / 6%) 0%, transparent 60%)",
            animation: "breathe 8s ease-in-out infinite" }} />
      </div>

      {/* Wandering cat */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={catPath}
            className="absolute text-2xl select-none"
            style={{ filter: currentPath.flip ? "scaleX(-1)" : "none" }}
            initial={{ left: `${currentPath.start.x}%`, top: `${currentPath.start.y}%`, opacity: 0 }}
            animate={{
              left: `${currentPath.end.x}%`,
              top: `${currentPath.end.y}%`,
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: currentPath.duration,
              ease: "linear",
            }}
            onAnimationComplete={cyclePath}
          >
            <span className="block" style={{ animation: "cat-walk 0.4s ease-in-out infinite" }}>
              {CAT_PATHS[catPath].flip ? "🐱‍👤" : "🐈"}
            </span>
          </motion.div>
        </AnimatePresence>
        {/* Paw prints */}
        {[0.25, 0.5, 0.75].map((t, i) => {
          const x = currentPath.start.x + (currentPath.end.x - currentPath.start.x) * t;
          const y = currentPath.start.y + (currentPath.end.y - currentPath.start.y) * t;
          return (
            <motion.span key={`${catPath}-${i}`}
              className="absolute text-[8px] pointer-events-none select-none"
              style={{ left: `${x}%`, top: `${y}%` }}
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.25, 0] }}
              transition={{ duration: 4, delay: currentPath.duration * t - 1 }} />
          );
        })}
      </div>

      {/* Title */}
      <motion.div className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/40 serif mb-3">if God wills...</p>
        <h1 className="serif text-5xl md:text-6xl italic text-foreground"
          style={{ textShadow: "0 0 60px oklch(0.72 0.14 15 / 15%)" }}>
          The Family
        </h1>
        <p className="serif italic text-sm text-muted-foreground/60 mt-4 max-w-md mx-auto leading-relaxed">
          One day... this is where our future lives.
          <br />
          <span className="text-[11px] text-muted-foreground/40">walk toward a room to enter</span>
        </p>
      </motion.div>

      {/* Chamber cards */}
      <div className="relative z-10 w-full max-w-4xl mb-10">
        {/* Neuron lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" viewBox="0 0 800 500">
          <line x1="400" y1="40" x2="150" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="400" y1="40" x2="400" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="400" y1="40" x2="650" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="150" y1="200" x2="250" y2="380" stroke="currentColor" strokeWidth="0.5" />
          <line x1="400" y1="200" x2="400" y2="380" stroke="currentColor" strokeWidth="0.5" />
          <line x1="650" y1="200" x2="550" y2="380" stroke="currentColor" strokeWidth="0.5" />
          <line x1="150" y1="200" x2="650" y2="200" stroke="currentColor" strokeWidth="0.3" />
          <line x1="250" y1="380" x2="550" y2="380" stroke="currentColor" strokeWidth="0.3" />
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHAMBERS.map((ch, i) => (
            <motion.button key={ch.id}
              onClick={() => onNavigate(ch.id)}
              className="group relative text-left rounded-2xl p-6 transition-all duration-500 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ background: "oklch(0.18 0.03 265 / 60%)", border: "1px solid oklch(0.30 0.04 265 / 30%)", backdropFilter: "blur(12px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${ch.glow}, transparent 70%)` }} />
              <span className="text-3xl mb-3 block transition-transform duration-500 group-hover:scale-110">{ch.icon}</span>
              <h3 className="serif text-lg italic text-foreground mb-1 relative z-10">{ch.title}</h3>
              <p className="text-xs text-muted-foreground/50 serif italic relative z-10">{ch.subtitle}</p>
              <div className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-60 transition-opacity duration-300 relative z-10"
                style={{ color: ch.color }}>
                <span>enter</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Welcome book */}
      <motion.div className="relative z-10 w-full max-w-md mb-8"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }}>
        <motion.button
          className="w-full serif rounded-2xl p-5 text-left transition-all"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => setBookOpen(!bookOpen)}
          style={{ background: "oklch(0.88 0.03 75 / 80%)", border: "1px solid oklch(0.75 0.05 75 / 30%)",
            boxShadow: "0 4px 20px oklch(0.10 0.02 60 / 10%)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📔</span>
              <div>
                <p className="text-xs" style={{ color: "oklch(0.35 0.04 60)" }}>Welcome Book</p>
                <p className="text-[10px]" style={{ color: "oklch(0.50 0.04 60 / 60%)" }}>{entries.length} {entries.length === 1 ? "note" : "notes"} left</p>
              </div>
            </div>
            <span className="text-[10px]" style={{ color: "oklch(0.45 0.04 60 / 50%)" }}>{bookOpen ? "▲" : "▼"}</span>
          </div>
        </motion.button>

        <AnimatePresence>
          {bookOpen && (
            <motion.div
              className="mt-2 rounded-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "oklch(0.90 0.02 75 / 85%)", border: "1px solid oklch(0.75 0.04 75 / 25%)",
                backdropFilter: "blur(12px)" }}>
              {/* Entries */}
              <div className="max-h-48 overflow-y-auto p-4 space-y-3">
                {entries.map((entry, i) => (
                  <motion.div key={i}
                    className="rounded-lg p-3"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ background: "oklch(0.92 0.02 75 / 60%)", borderLeft: "2px solid oklch(0.65 0.08 55 / 30%)" }}>
                    <p className="serif text-[11px] italic leading-relaxed" style={{ color: "oklch(0.30 0.03 60)" }}>"{entry.message}"</p>
                    <p className="text-[9px] mt-1" style={{ color: "oklch(0.50 0.04 60 / 50%)" }}>— {entry.author}, {entry.date}</p>
                  </motion.div>
                ))}
              </div>
              {/* Add entry */}
              <div className="border-t p-3 flex gap-2" style={{ borderColor: "oklch(0.75 0.04 75 / 20%)" }}>
                <input
                  type="text"
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEntry()}
                  placeholder="leave a note for us..."
                  className="flex-1 bg-transparent serif text-[11px] italic px-3 py-2 rounded-lg outline-none placeholder:text-muted-foreground/30"
                  style={{ color: "oklch(0.30 0.03 60)", border: "1px solid oklch(0.75 0.04 75 / 25%)" }} />
                <motion.button
                  onClick={addEntry}
                  className="serif text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg transition-all"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ background: "oklch(0.30 0.05 55 / 80%)", color: "oklch(0.88 0.03 75)" }}>
                  write
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom note */}
      <motion.p className="serif italic text-[11px] text-muted-foreground/25 mt-auto text-center relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
        "One day, Insha'Allah... every room will be full of laughter."
      </motion.p>
    </div>
  );
}
