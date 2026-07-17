import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onBack: () => void };

type BucketItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "bayt.bucketlist";

const DEFAULT_ITEMS: Omit<BucketItem, "id" | "createdAt">[] = [
  { text: "Watch the sunrise together", completed: false },
  { text: "Travel to Japan", completed: false },
  { text: "Visit Makkah and Madinah", completed: false },
  { text: "Build our first home", completed: false },
  { text: "Adopt another cat", completed: false },
  { text: "Plant a tree together", completed: false },
  { text: "Watch meteor showers", completed: false },
  { text: "Travel without planning", completed: false },
  { text: "Grow old together", completed: false },
];

function loadItems(): BucketItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ITEMS.map((d, i) => ({
    ...d,
    id: `default-${i}`,
    createdAt: Date.now() + i,
  }));
}

function saveItems(items: BucketItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const STAMPS = ["✦", "❋", "✧", "♡", "⟡", "✿", "❀", "✧", "♡"];
const ROTATIONS = [-2.1, 1.4, -0.8, 2.7, -1.9, 0.5, -2.6, 1.8, -0.3];

export default function BucketListChamber({ onBack }: Props) {
  const [items, setItems] = useState<BucketItem[]>(loadItems);
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => { saveItems(items); }, [items]);

  const addItem = useCallback(() => {
    if (!newText.trim()) return;
    const item: BucketItem = {
      id: `item-${Date.now()}`,
      text: newText.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [item, ...prev]);
    setNewText("");
    setShowAdd(false);
  }, [newText]);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it))
    );
  }, []);

  const saveEdit = useCallback((id: string) => {
    if (!editText.trim()) return;
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, text: editText.trim() } : it))
    );
    setEditingId(null);
  }, [editText]);

  const completedCount = items.filter((it) => it.completed).length;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: "oklch(0.22 0.02 50)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.28 0.03 45 / 0.5) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, oklch(0.25 0.025 55 / 0.4) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="serif mb-10 cursor-pointer text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.65 0.06 70)" }}
        >
          ← Return
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1
            className="serif mb-3 text-4xl font-light tracking-wide sm:text-5xl"
            style={{ color: "oklch(0.82 0.06 70)" }}
          >
            Our Bucket List
          </h1>
          <p
            className="serif text-sm tracking-[0.3em] uppercase sm:text-base"
            style={{ color: "oklch(0.6 0.05 60)" }}
          >
            dreams waiting to happen
          </p>
          {completedCount > 0 && (
            <p className="serif mt-2 text-xs" style={{ color: "oklch(0.55 0.08 90)" }}>
              {completedCount} of {items.length} completed
            </p>
          )}
        </motion.div>

        {/* Add button */}
        <div className="flex justify-center mb-10">
          <motion.button
            onClick={() => setShowAdd(!showAdd)}
            className="serif rounded-full px-6 py-2.5 text-sm transition-all"
            style={{
              background: showAdd ? "oklch(0.25 0.03 50 / 80%)" : "oklch(0.30 0.04 55 / 60%)",
              border: "1px solid oklch(0.50 0.06 55 / 30%)",
              color: "oklch(0.80 0.06 60)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {showAdd ? "✕ Close" : "＋ Add a dream"}
          </motion.button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="mx-auto max-w-md flex gap-3">
                <input
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addItem(); }}
                  placeholder="Write a new dream..."
                  className="flex-1 rounded-xl px-5 py-3 text-sm serif italic outline-none"
                  style={{
                    background: "oklch(0.88 0.03 75 / 90%)",
                    color: "oklch(0.30 0.03 50)",
                    border: "1px solid oklch(0.70 0.04 70 / 40%)",
                  }}
                  autoFocus
                />
                <motion.button
                  onClick={addItem}
                  className="rounded-xl px-5 py-3 text-sm font-semibold serif"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.60 0.14 15), oklch(0.50 0.12 350))",
                    color: "oklch(0.95 0.02 30)",
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Add
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, rotate: ROTATIONS[i % ROTATIONS.length] + 4, y: 40 }}
              animate={{
                opacity: 1,
                rotate: ROTATIONS[i % ROTATIONS.length],
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{
                duration: 0.9,
                delay: 0.1 + (i % 6) * 0.08,
                ease: "easeOut",
              }}
              className="group relative"
              style={{ transformOrigin: "center center" }}
            >
              <div
                className="serif relative rounded-sm px-6 py-8 shadow-lg transition-all duration-500 group-hover:shadow-xl"
                style={{
                  backgroundColor: item.completed
                    ? "oklch(0.82 0.02 75 / 70%)"
                    : "oklch(0.88 0.03 75)",
                  backgroundImage: `repeating-linear-gradient(
                    0deg, transparent, transparent 28px,
                    oklch(0.8 0.02 70 / 0.15) 28px, oklch(0.8 0.02 70 / 0.15) 29px
                  )`,
                  boxShadow: item.completed
                    ? "0 1px 6px oklch(0.15 0.02 50 / 0.2)"
                    : "0 2px 12px oklch(0.15 0.02 50 / 0.3), inset 0 0 30px oklch(0.85 0.02 80 / 0.3)",
                  opacity: item.completed ? 0.65 : 1,
                }}
              >
                {/* Tape decoration */}
                <div
                  className="absolute top-0 left-6 h-2 w-12 -translate-y-1 rounded-sm"
                  style={{
                    background: "linear-gradient(180deg, oklch(0.82 0.04 80 / 0.7), oklch(0.78 0.04 80 / 0.5))",
                    borderLeft: "1px solid oklch(0.7 0.03 80 / 0.3)",
                  }}
                />

                {/* Stamp */}
                <div
                  className="absolute top-3 right-4 text-xs"
                  style={{ color: "oklch(0.65 0.08 60 / 0.4)" }}
                >
                  {STAMPS[i % STAMPS.length]}
                </div>

                {/* Completed stamp */}
                {item.completed && (
                  <div className="absolute top-3 left-4">
                    <span className="text-lg" style={{ filter: "sepia(0.3) hue-rotate(80deg)" }}>
                      &#10003;
                    </span>
                  </div>
                )}

                {/* Text */}
                {editingId === item.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={() => saveEdit(item.id)}
                    className="w-full bg-transparent text-center text-base italic leading-relaxed sm:text-lg outline-none"
                    style={{
                      color: "oklch(0.32 0.03 50)",
                      borderBottom: "1px dashed oklch(0.60 0.06 50 / 40%)",
                    }}
                    autoFocus
                  />
                ) : (
                  <p
                    className="serif relative text-center text-base italic leading-relaxed sm:text-lg cursor-pointer"
                    style={{
                      color: "oklch(0.32 0.03 50)",
                      textDecoration: item.completed ? "line-through" : "none",
                      textDecorationColor: "oklch(0.55 0.08 60 / 50%)",
                    }}
                    onDoubleClick={() => {
                      setEditingId(item.id);
                      setEditText(item.text);
                    }}
                  >
                    {item.text}
                  </p>
                )}

                {/* Action buttons — visible on hover */}
                <div className="absolute -bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="rounded-full px-3 py-1 text-[10px] serif transition-all hover:scale-105"
                    style={{
                      background: item.completed
                        ? "oklch(0.55 0.10 150 / 80%)"
                        : "oklch(0.50 0.08 55 / 80%)",
                      color: "oklch(0.95 0.02 30)",
                      boxShadow: "0 2px 8px oklch(0 0 0 / 20%)",
                    }}
                  >
                    {item.completed ? "Undo" : "✓ Done"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditText(item.text);
                    }}
                    className="rounded-full px-3 py-1 text-[10px] serif transition-all hover:scale-105"
                    style={{
                      background: "oklch(0.40 0.04 260 / 80%)",
                      color: "oklch(0.90 0.02 260)",
                      boxShadow: "0 2px 8px oklch(0 0 0 / 20%)",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="rounded-full px-3 py-1 text-[10px] serif transition-all hover:scale-105"
                    style={{
                      background: "oklch(0.40 0.10 25 / 80%)",
                      color: "oklch(0.95 0.02 25)",
                      boxShadow: "0 2px 8px oklch(0 0 0 / 20%)",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.2 }}
          className="serif mt-20 text-center text-sm tracking-[0.2em] sm:text-base"
          style={{ color: "oklch(0.55 0.05 65)" }}
        >
          Every item is a prayer. Every page is a hope.
        </motion.p>
      </div>
    </motion.section>
  );
}
