import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onBack: () => void };

type Dream = {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  glow: string;
  favourited: boolean;
  archived: boolean;
  createdAt: number;
};

const STORAGE_KEY = "bayt.dreams";

const DEFAULT_DREAMS: Omit<Dream, "id" | "favourited" | "archived" | "createdAt">[] = [
  { icon: "🏠", title: "Our future home", description: "A little house with a garden door and warm lights", color: "oklch(0.65 0.12 55)", glow: "oklch(0.65 0.12 55 / 15%)" },
  { icon: "✈️", title: "Travelling together", description: "New cities, old streets, our footsteps side by side", color: "oklch(0.60 0.10 200)", glow: "oklch(0.60 0.10 200 / 15%)" },
  { icon: "🍳", title: "Cooking together", description: "Flour on your nose, laughter in the kitchen", color: "oklch(0.70 0.10 90)", glow: "oklch(0.70 0.10 90 / 15%)" },
  { icon: "🌅", title: "Watching sunsets", description: "Two silhouettes, one horizon", color: "oklch(0.60 0.14 15)", glow: "oklch(0.60 0.14 15 / 15%)" },
  { icon: "💘", title: "Growing old together", description: "Wrinkled hands, still holding tight", color: "oklch(0.55 0.12 350)", glow: "oklch(0.55 0.12 350 / 15%)" },
  { icon: "🌙", title: "Quiet evenings", description: "Just us, a blanket, and silence that speaks", color: "oklch(0.50 0.08 260)", glow: "oklch(0.50 0.08 260 / 15%)" },
  { icon: "🎄", title: "Building traditions", description: "Our own holidays, our own recipes, our own way", color: "oklch(0.55 0.15 150)", glow: "oklch(0.55 0.15 150 / 15%)" },
];

const ICONS = ["🏠", "✈️", "🍳", "🌅", "💘", "🌙", "🎄", "📚", "🎨", "🎸", "🌊", "🌸", "⭐", "🎵", "🦋"];

function loadDreams(): Dream[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_DREAMS.map((d, i) => ({
    ...d,
    id: `default-${i}`,
    favourited: false,
    archived: false,
    createdAt: Date.now() + i,
  }));
}

function saveDreams(dreams: Dream[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
}

const VISION_LOCATIONS = [
  { name: "Kyoto", emoji: "🇯🇵", note: "Cherry blossoms in spring" },
  { name: "Seville", emoji: "🇪🇸", note: "Evenings on a terraza" },
  { name: "Makkah", emoji: "🕌", note: "A pilgrimage of the heart" },
  { name: "Istanbul", emoji: "🇹🇷", note: "Where East meets West" },
  { name: "Maldives", emoji: "🏝️", note: "Just us and the ocean" },
  { name: "Swiss Alps", emoji: "🇨🇭", note: "Mountains and quiet mornings" },
  { name: "Paris", emoji: "🇫🇷", note: "Every corner, a story" },
  { name: "Bali", emoji: "🇮🇩", note: "Temples and rice fields" },
];

export function DreamsChamber({ onBack }: Props) {
  const [dreams, setDreams] = useState<Dream[]>(loadDreams);
  const [showAdd, setShowAdd] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [newIcon, setNewIcon] = useState("🏠");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => { saveDreams(dreams); }, [dreams]);

  const activeDreams = dreams.filter((d) => !d.archived);
  const archivedDreams = dreams.filter((d) => d.archived);

  const addDream = useCallback(() => {
    if (!newTitle.trim()) return;
    const dream: Dream = {
      id: `dream-${Date.now()}`,
      icon: newIcon,
      title: newTitle.trim(),
      description: newDesc.trim(),
      color: "oklch(0.60 0.10 55)",
      glow: "oklch(0.60 0.10 55 / 15%)",
      favourited: false,
      archived: false,
      createdAt: Date.now(),
    };
    setDreams((prev) => [dream, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setNewIcon("🏠");
    setShowAdd(false);
  }, [newTitle, newDesc, newIcon]);

  const toggleFavourite = useCallback((id: string) => {
    setDreams((prev) => prev.map((d) => d.id === id ? { ...d, favourited: !d.favourited } : d));
  }, []);

  const archiveDream = useCallback((id: string) => {
    setDreams((prev) => prev.map((d) => d.id === id ? { ...d, archived: true } : d));
  }, []);

  const unarchiveDream = useCallback((id: string) => {
    setDreams((prev) => prev.map((d) => d.id === id ? { ...d, archived: false } : d));
  }, []);

  const deleteDream = useCallback((id: string) => {
    setDreams((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const saveEdit = useCallback((id: string) => {
    setDreams((prev) => prev.map((d) => d.id === id ? { ...d, title: editTitle.trim() || d.title, description: editDesc.trim() || d.description } : d));
    setEditingId(null);
  }, [editTitle, editDesc]);

  return (
    <div className="h-full flex flex-col items-center px-6 py-20 overflow-y-auto">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
          style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.70 0.10 55 / 5%) 0%, transparent 60%)", animation: "breathe 8s ease-in-out infinite" }} />
      </div>

      {/* Title */}
      <motion.div className="text-center mb-10 relative z-10"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <p className="proposal-text text-[10px] uppercase tracking-[0.5em] mb-4" style={{ color: "oklch(0.65 0.12 55 / 40%)" }}>
          If God wills... one day...
        </p>
        <h1 className="serif text-5xl md:text-6xl italic text-foreground" style={{ textShadow: "0 0 60px oklch(0.72 0.14 55 / 12%)" }}>
          Our Dreams
        </h1>
        <p className="serif italic text-sm text-muted-foreground/50 mt-4 max-w-sm mx-auto leading-relaxed">
          Not plans. Not promises. Just quiet hopes we carry together.
        </p>
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-10 relative z-10 flex-wrap justify-center">
        <motion.button onClick={() => setShowAdd(!showAdd)}
          className="serif rounded-full px-5 py-2 text-xs transition-all"
          style={{ background: showAdd ? "oklch(0.25 0.03 55 / 80%)" : "oklch(0.30 0.04 55 / 60%)", border: "1px solid oklch(0.50 0.06 55 / 30%)", color: "oklch(0.80 0.06 60)" }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          {showAdd ? "✕ Close" : "＋ Add Dream"}
        </motion.button>
        <motion.button onClick={() => setShowGlobe(!showGlobe)}
          className="serif rounded-full px-5 py-2 text-xs transition-all"
          style={{ background: showGlobe ? "oklch(0.20 0.04 200 / 80%)" : "oklch(0.25 0.03 200 / 60%)", border: "1px solid oklch(0.50 0.06 200 / 30%)", color: "oklch(0.70 0.08 200)" }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          🌍 Vision Globe
        </motion.button>
        {archivedDreams.length > 0 && (
          <motion.button onClick={() => setShowArchived(!showArchived)}
            className="serif rounded-full px-5 py-2 text-xs transition-all"
            style={{ background: "oklch(0.25 0.02 260 / 60%)", border: "1px solid oklch(0.40 0.04 260 / 30%)", color: "oklch(0.60 0.06 260)" }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            📦 Archive ({archivedDreams.length})
          </motion.button>
        )}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8 w-full max-w-lg relative z-10">
            <div className="rounded-2xl p-6" style={{ background: "oklch(0.18 0.03 265 / 60%)", border: "1px solid oklch(0.30 0.04 265 / 30%)" }}>
              {/* Icon picker */}
              <div className="flex gap-2 mb-4 flex-wrap justify-center">
                {ICONS.map((ic) => (
                  <button key={ic} onClick={() => setNewIcon(ic)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${newIcon === ic ? "ring-2 ring-amber-400/50 scale-110" : "opacity-50 hover:opacity-80"}`}
                    style={{ background: "oklch(0.22 0.03 50 / 60%)" }}>
                    {ic}
                  </button>
                ))}
              </div>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Dream title..." autoFocus
                className="w-full rounded-xl px-4 py-2.5 text-sm serif italic mb-3 outline-none"
                style={{ background: "oklch(0.88 0.03 75 / 90%)", color: "oklch(0.30 0.03 50)", border: "1px solid oklch(0.70 0.04 70 / 40%)" }} />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe this dream..." rows={2}
                className="w-full rounded-xl px-4 py-2.5 text-sm serif italic mb-4 outline-none resize-none"
                style={{ background: "oklch(0.88 0.03 75 / 90%)", color: "oklch(0.30 0.03 50)", border: "1px solid oklch(0.70 0.04 70 / 40%)" }} />
              <div className="flex justify-center">
                <motion.button onClick={addDream}
                  className="rounded-full px-8 py-2.5 text-sm font-semibold serif"
                  style={{ background: "linear-gradient(135deg, oklch(0.65 0.12 55), oklch(0.55 0.10 50))", color: "oklch(0.95 0.02 30)" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Add this dream
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vision Globe */}
      <AnimatePresence>
        {showGlobe && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-10 w-full max-w-3xl relative z-10">
            <div className="rounded-2xl p-6" style={{ background: "oklch(0.15 0.04 200 / 60%)", border: "1px solid oklch(0.40 0.06 200 / 25%)" }}>
              <p className="text-[10px] uppercase tracking-[0.4em] text-center mb-6" style={{ color: "oklch(0.60 0.08 200 / 60%)" }}>
                places we dream of visiting
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {VISION_LOCATIONS.map((loc, i) => (
                  <motion.div key={loc.name}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="rounded-xl p-4 text-center cursor-default group"
                    style={{ background: "oklch(0.18 0.03 200 / 50%)", border: "1px solid oklch(0.35 0.05 200 / 20%)" }}>
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{loc.emoji}</span>
                    <p className="serif text-xs font-medium" style={{ color: "oklch(0.75 0.08 200)" }}>{loc.name}</p>
                    <p className="text-[10px] mt-1 italic" style={{ color: "oklch(0.55 0.05 200 / 60%)" }}>{loc.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Archived section */}
      <AnimatePresence>
        {showArchived && archivedDreams.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mb-10 w-full max-w-4xl relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-center mb-4" style={{ color: "oklch(0.50 0.04 260 / 50%)" }}>
              archived dreams
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedDreams.map((dream) => (
                <motion.div key={dream.id} layout
                  className="rounded-xl p-5 opacity-50" style={{ background: "oklch(0.18 0.02 265 / 40%)", border: "1px solid oklch(0.25 0.03 265 / 20%)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{dream.icon}</span>
                    <h3 className="serif text-sm italic" style={{ color: dream.color }}>{dream.title}</h3>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => unarchiveDream(dream.id)} className="text-[10px] serif px-3 py-1 rounded-full" style={{ background: "oklch(0.40 0.08 150 / 60%)", color: "oklch(0.90 0.02 30)" }}>
                      Restore
                    </button>
                    <button onClick={() => deleteDream(dream.id)} className="text-[10px] serif px-3 py-1 rounded-full" style={{ background: "oklch(0.40 0.10 25 / 60%)", color: "oklch(0.90 0.02 25)" }}>
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dream cards */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeDreams.map((dream, i) => (
            <motion.article key={dream.id} layout
              className="group relative rounded-2xl p-6 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + (i % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{ background: "oklch(0.18 0.03 265 / 60%)", border: "1px solid oklch(0.30 0.04 265 / 30%)", backdropFilter: "blur(12px)" }}>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${dream.glow}, transparent 70%)` }} />

              {/* Favourite star */}
              <button onClick={() => toggleFavourite(dream.id)}
                className="absolute top-3 right-3 text-sm z-10 transition-all hover:scale-125"
                style={{ color: dream.favourited ? "oklch(0.80 0.14 55)" : "oklch(0.40 0.04 260 / 40%)" }}>
                {dream.favourited ? "★" : "☆"}
              </button>

              {/* Icon */}
              <span className="text-3xl mb-3 block transition-transform duration-500 group-hover:scale-110 relative z-10">
                {dream.icon}
              </span>

              {/* Title */}
              {editingId === dream.id ? (
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(dream.id); if (e.key === "Escape") setEditingId(null); }}
                  className="w-full bg-transparent serif italic text-lg mb-1 outline-none relative z-10"
                  style={{ color: dream.color, borderBottom: "1px dashed oklch(0.50 0.06 55 / 40%)" }} autoFocus />
              ) : (
                <h3 className="serif italic text-lg mb-1 relative z-10" style={{ color: dream.color }}
                  onDoubleClick={() => { setEditingId(dream.id); setEditTitle(dream.title); setEditDesc(dream.description); }}>
                  {dream.title}
                </h3>
              )}

              {/* Description */}
              {editingId === dream.id ? (
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }}
                  className="w-full bg-transparent text-xs text-muted-foreground/50 relative z-10 leading-relaxed resize-none outline-none" rows={2} />
              ) : (
                <p className="proposal-text text-xs text-muted-foreground/50 relative z-10 leading-relaxed">
                  {dream.description}
                </p>
              )}

              {/* Action buttons */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => { setEditingId(dream.id); setEditTitle(dream.title); setEditDesc(dream.description); }}
                  className="text-[9px] serif px-2.5 py-1 rounded-full" style={{ background: "oklch(0.35 0.04 260 / 80%)", color: "oklch(0.85 0.02 260)" }}>
                  Edit
                </button>
                <button onClick={() => archiveDream(dream.id)}
                  className="text-[9px] serif px-2.5 py-1 rounded-full" style={{ background: "oklch(0.35 0.06 55 / 80%)", color: "oklch(0.90 0.02 55)" }}>
                  Archive
                </button>
                <button onClick={() => deleteDream(dream.id)}
                  className="text-[9px] serif px-2.5 py-1 rounded-full" style={{ background: "oklch(0.35 0.10 25 / 80%)", color: "oklch(0.90 0.02 25)" }}>
                  Delete
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <motion.p className="serif italic text-[11px] text-muted-foreground/25 mt-16 text-center relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
        These aren't promises. They're prayers.
      </motion.p>
    </div>
  );
}
