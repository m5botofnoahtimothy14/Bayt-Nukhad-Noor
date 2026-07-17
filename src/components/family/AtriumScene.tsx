import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FamilyChamber } from "./FamilyWorld";

type AtriumProps = {
  onNavigate: (chamber: FamilyChamber) => void;
  onExit: () => void;
};

type BookEntry = { author: string; message: string; date: string };

const CHAMBERS = [
  { id: "dreams" as FamilyChamber, title: "Our Dreams", subtitle: "hopes for tomorrow", icon: "☆", color: "oklch(0.65 0.12 55)", glow: "oklch(0.65 0.12 55 / 25%)" },
  { id: "little-family" as FamilyChamber, title: "Our Little Family", subtitle: "the warmth we already have", icon: "🐈", color: "oklch(0.70 0.10 90)", glow: "oklch(0.70 0.10 90 / 25%)" },
  { id: "bucket-list" as FamilyChamber, title: "Our Bucket List", subtitle: "dreams waiting to happen", icon: "📖", color: "oklch(0.60 0.14 15)", glow: "oklch(0.60 0.14 15 / 25%)" },
  { id: "memory-booth" as FamilyChamber, title: "The Memory Booth", subtitle: "moments for forever", icon: "📷", color: "oklch(0.55 0.12 350)", glow: "oklch(0.55 0.12 350 / 25%)" },
  { id: "hidden-surprise" as FamilyChamber, title: "The Hidden Surprise", subtitle: "something is waiting...", icon: "🎁", color: "oklch(0.55 0.15 280)", glow: "oklch(0.55 0.15 280 / 25%)" },
  { id: "reserved-home" as FamilyChamber, title: "Our Home", subtitle: "this door isn't closed", icon: "🏠", color: "oklch(0.50 0.10 150)", glow: "oklch(0.50 0.10 150 / 25%)" },
  { id: "observatory" as FamilyChamber, title: "The Observatory", subtitle: "a place to simply be", icon: "🔭", color: "oklch(0.55 0.08 260)", glow: "oklch(0.55 0.08 260 / 25%)" },
];

const DEFAULT_ENTRIES: BookEntry[] = [
  { author: "A Star", message: "I watched you from the observatory. You looked peaceful.", date: "last night" },
  { author: "The House", message: "Welcome home. The kettle is always warm.", date: "a while ago" },
  { author: "The Wind", message: "I carried a love letter through the garden today.", date: "this morning" },
];

const FLOATING_HEARTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  size: 6 + (i % 4) * 3,
  left: `${5 + (i * 8.5) % 90}%`,
  delay: (i * 1.2) % 8,
  duration: 8 + (i % 4) * 3,
  opacity: 0.08 + (i % 3) * 0.04,
}));

const SPARKLE_PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: 1 + (i % 3) * 0.5,
  left: `${(i * 5.3) % 100}%`,
  top: `${(i * 7.1) % 100}%`,
  delay: (i * 0.4) % 6,
  duration: 3 + (i % 4) * 1.5,
}));

export function AtriumScene({ onNavigate }: AtriumProps) {
  const [bookOpen, setBookOpen] = useState(false);
  const [entries, setEntries] = useState<BookEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("atrium-book") || "null") ?? DEFAULT_ENTRIES; }
    catch { return DEFAULT_ENTRIES; }
  });
  const [newEntry, setNewEntry] = useState("");
  const [heartBeat, setHeartBeat] = useState(false);

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

  // Arrange chambers in a circle around the heart
  const chamberPositions = useMemo(() => {
    const count = CHAMBERS.length;
    const radius = 180;
    return CHAMBERS.map((_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.6,
      };
    });
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-16 overflow-y-auto relative"
      style={{ background: "oklch(0.10 0.04 350)" }}>

      {/* Deep romantic gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, oklch(0.18 0.06 350 / 50%) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, oklch(0.15 0.05 10 / 30%) 0%, transparent 45%), radial-gradient(ellipse at 70% 60%, oklch(0.12 0.04 300 / 25%) 0%, transparent 40%)" }} />

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_HEARTS.map((h) => (
          <motion.span key={h.id} className="absolute"
            style={{ left: h.left, bottom: -20, fontSize: h.size, opacity: h.opacity }}
            animate={{ y: [0, -600, -800], x: [0, (h.id % 2 ? 15 : -15), 0], rotate: [0, (h.id % 2 ? 20 : -20), 0] }}
            transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeInOut" }}>
            ♥
          </motion.span>
        ))}
      </div>

      {/* Sparkle particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {SPARKLE_PARTICLES.map((s) => (
          <span key={s.id} className="absolute rounded-full"
            style={{ width: s.size, height: s.size, left: s.left, top: s.top,
              background: "oklch(0.90 0.08 350 / 40%)", boxShadow: `0 0 ${s.size * 3}px oklch(0.80 0.10 350 / 20%)`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      {/* Central heart glow */}
      <motion.div className="absolute pointer-events-none z-[1]"
        style={{ width: 400, height: 400, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.60 0.15 350 / 12%) 0%, oklch(0.50 0.10 350 / 5%) 40%, transparent 70%)" }} />
      </motion.div>

      {/* Central heart + names */}
      <motion.div className="relative z-10 mb-8 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>

        {/* Heart icon */}
        <motion.div className="cursor-pointer select-none"
          animate={heartBeat ? { scale: [1, 1.3, 1] } : { scale: [1, 1.08, 1] }}
          transition={{ duration: heartBeat ? 0.4 : 3, repeat: heartBeat ? 0 : Infinity, ease: "easeInOut" }}
          onClick={() => { setHeartBeat(true); setTimeout(() => setHeartBeat(false), 500); }}>
          <span className="text-6xl md:text-7xl block" style={{ filter: "drop-shadow(0 0 30px oklch(0.65 0.18 350 / 40%))" }}>
            ♥
          </span>
        </motion.div>

        {/* Names */}
        <div className="mt-4 flex items-center gap-3">
          <span className="serif text-2xl md:text-3xl italic" style={{ color: "oklch(0.85 0.08 260)", textShadow: "0 0 20px oklch(0.55 0.08 260 / 30%)" }}>
            Noah
          </span>
          <motion.span className="text-lg" style={{ color: "oklch(0.70 0.15 350 / 60%)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}>
            &
          </motion.span>
          <span className="serif text-2xl md:text-3xl italic" style={{ color: "oklch(0.85 0.12 350)", textShadow: "0 0 20px oklch(0.65 0.18 350 / 30%)" }}>
            Khadija
          </span>
        </div>

        {/* Subtitle */}
        <p className="serif italic text-xs mt-3 text-center" style={{ color: "oklch(0.60 0.08 350 / 50%)" }}>
          Bayt Nūkhad Nūr — our enchanted nest
        </p>

        <motion.p className="serif italic text-[11px] mt-4 text-center max-w-xs leading-relaxed"
          style={{ color: "oklch(0.55 0.06 350 / 40%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          Walk toward a room to enter. Each door holds a piece of us.
        </motion.p>
      </motion.div>

      {/* Chamber cards — circular arrangement */}
      <div className="relative z-10 w-full max-w-3xl mx-auto" style={{ height: 420 }}>
        {/* Connecting lines from center */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" viewBox="0 0 600 420">
          {chamberPositions.map((pos, i) => (
            <line key={i} x1="300" y1="180" x2={300 + pos.x} y2={180 + pos.y}
              stroke="oklch(0.65 0.12 350 / 40%)" strokeWidth="0.5" strokeDasharray="4 3" />
          ))}
        </svg>

        {/* Cards */}
        {CHAMBERS.map((ch, i) => {
          const pos = chamberPositions[i];
          return (
            <motion.button key={ch.id}
              onClick={() => onNavigate(ch.id)}
              className="group absolute text-left rounded-2xl p-4 transition-all duration-500 cursor-pointer overflow-hidden w-[140px] md:w-[160px]"
              style={{
                left: `calc(50% + ${pos.x}px - 80px)`,
                top: `calc(25% + ${pos.y}px)`,
                background: "oklch(0.15 0.04 350 / 60%)",
                border: "1px solid oklch(0.35 0.08 350 / 20%)",
                backdropFilter: "blur(12px)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.06 }}>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 50%, ${ch.glow}, transparent 70%)` }} />
              <span className="text-2xl mb-2 block transition-transform duration-500 group-hover:scale-110 relative z-10">{ch.icon}</span>
              <h3 className="serif text-sm italic text-foreground/90 mb-0.5 relative z-10 leading-tight">{ch.title}</h3>
              <p className="text-[10px] text-muted-foreground/45 serif italic relative z-10 leading-tight">{ch.subtitle}</p>
              <div className="mt-2 flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] opacity-0 group-hover:opacity-60 transition-opacity duration-300 relative z-10"
                style={{ color: ch.color }}>
                <span>enter</span><span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </motion.button>
          );
        })}

        {/* Center heart marker */}
        <div className="absolute left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <motion.div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.20 0.06 350 / 30%)", border: "1px solid oklch(0.40 0.10 350 / 20%)" }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <span className="text-sm" style={{ color: "oklch(0.70 0.15 350 / 60%)" }}>♥</span>
          </motion.div>
        </div>
      </div>

      {/* Welcome book */}
      <motion.div className="relative z-10 w-full max-w-md mt-4"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
        <motion.button
          className="w-full serif rounded-2xl p-4 text-left transition-all"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => setBookOpen(!bookOpen)}
          style={{ background: "oklch(0.16 0.05 350 / 60%)", border: "1px solid oklch(0.35 0.08 350 / 25%)",
            backdropFilter: "blur(8px)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">📔</span>
              <div>
                <p className="text-xs" style={{ color: "oklch(0.75 0.08 350 / 70%)" }}>Our Welcome Book</p>
                <p className="text-[10px]" style={{ color: "oklch(0.55 0.06 350 / 40%)" }}>{entries.length} {entries.length === 1 ? "note" : "notes"} left for us</p>
              </div>
            </div>
            <span className="text-[10px]" style={{ color: "oklch(0.50 0.06 350 / 40%)" }}>{bookOpen ? "▲" : "▼"}</span>
          </div>
        </motion.button>

        <AnimatePresence>
          {bookOpen && (
            <motion.div
              className="mt-2 rounded-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "oklch(0.14 0.04 350 / 70%)", border: "1px solid oklch(0.30 0.06 350 / 20%)",
                backdropFilter: "blur(12px)" }}>
              <div className="max-h-48 overflow-y-auto p-4 space-y-3">
                {entries.map((entry, i) => (
                  <motion.div key={i} className="rounded-lg p-3"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ background: "oklch(0.18 0.04 350 / 40%)", borderLeft: "2px solid oklch(0.60 0.12 350 / 30%)" }}>
                    <p className="serif text-[11px] italic leading-relaxed" style={{ color: "oklch(0.80 0.06 350 / 70%)" }}>"{entry.message}"</p>
                    <p className="text-[9px] mt-1" style={{ color: "oklch(0.50 0.05 350 / 40%)" }}>— {entry.author}, {entry.date}</p>
                  </motion.div>
                ))}
              </div>
              <div className="border-t p-3 flex gap-2" style={{ borderColor: "oklch(0.30 0.06 350 / 15%)" }}>
                <input type="text" value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEntry()}
                  placeholder="leave a love note..."
                  className="flex-1 bg-transparent serif text-[11px] italic px-3 py-2 rounded-lg outline-none placeholder:text-muted-foreground/25"
                  style={{ color: "oklch(0.80 0.06 350 / 80%)", border: "1px solid oklch(0.30 0.06 350 / 20%)" }} />
                <motion.button onClick={addEntry}
                  className="serif text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg transition-all"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ background: "oklch(0.55 0.12 350 / 60%)", color: "oklch(0.95 0.04 350)" }}>
                  write
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom quote */}
      <motion.p className="serif italic text-[11px] mt-6 text-center relative z-10"
        style={{ color: "oklch(0.50 0.06 350 / 30%)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>
        "And We created you in pairs." — Quran 78:8
      </motion.p>
    </div>
  );
}
