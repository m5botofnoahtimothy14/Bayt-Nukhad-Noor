import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onBack: () => void };

type CatAction = "idle" | "pet" | "feeding" | "playing" | "sleeping";

const MOMENTS = [
  { emoji: "😴", label: "Sleeping on cushions", desc: "curled up in a ball of warmth" },
  { emoji: "🧶", label: "Playing with toys", desc: "paws everywhere, tail high" },
  { emoji: "🦋", label: "Chasing butterflies", desc: "serious business, apparently" },
  { emoji: "🪟", label: "Watching birds", desc: "nature's television" },
  { emoji: "🫂", label: "Sitting beside you", desc: "the best kind of company" },
  { emoji: "☀️", label: "Stretching in sunlight", desc: "living the dream" },
  { emoji: "📚", label: "Exploring shelves", desc: "investigating everything" },
  { emoji: "🧐", label: "Curiously investigating", desc: "what's that? oh, everything." },
];

const TOYS = [
  { name: "Yarn Ball", emoji: "🧶", animation: "spin" },
  { name: "Feather Toy", emoji: "🪶", animation: "float" },
  { name: "Mouse Toy", emoji: "🐭", animation: "scurry" },
  { name: "Laser Pointer", emoji: "🔴", animation: "dash" },
];

const CAT_REACTIONS: Record<CatAction, { face: string; text: string; mood: string }> = {
  idle: { face: "🐈", text: "Purring softly...", mood: "content" },
  pet: { face: "😻", text: "Purrrr... *nuzzles hand*", mood: "loved" },
  feeding: { face: "🍖", text: "*munch munch* ...meow!", mood: "satisfied" },
  playing: { face: "😼", text: "*pounce* *wiggles tail*", mood: "playful" },
  sleeping: { face: "😴", text: "*gentle purring* ...zzz", mood: "dreaming" },
};

const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: 1.5 + (i % 4) * 0.8,
  left: `${(i * 5.7) % 100}%`,
  top: `${(i * 4.3 + 10) % 100}%`,
  delay: (i * 0.4) % 6,
  duration: 10 + (i % 5) * 3,
  color: i % 3 === 0 ? "oklch(0.80 0.12 90 / 25%)" : i % 3 === 1 ? "oklch(0.75 0.10 55 / 20%)" : "oklch(0.80 0.08 150 / 15%)",
  dx: -15 + ((i * 7) % 30),
  dy: -25 - ((i * 5) % 40),
}));

export function LittleFamilyChamber({ onBack }: Props) {
  const [catAction, setCatAction] = useState<CatAction>("idle");
  const [catMessage, setCatMessage] = useState("");
  const [feedingType, setFeedingType] = useState<string | null>(null);
  const [activeToy, setActiveToy] = useState<string | null>(null);

  const petCat = useCallback(() => {
    setCatAction("pet");
    setCatMessage("She leans into your hand...");
    setTimeout(() => { setCatAction("idle"); setCatMessage(""); }, 3000);
  }, []);

  const feedCat = useCallback((type: string) => {
    setCatAction("feeding");
    setFeedingType(type);
    setCatMessage(type === "treat" ? "*crunch crunch*" : "*lap lap*");
    setTimeout(() => { setCatAction("idle"); setFeedingType(null); setCatMessage(""); }, 3000);
  }, []);

  const playWithCat = useCallback((toy: string) => {
    setCatAction("playing");
    setActiveToy(toy);
    setCatMessage("*pounces enthusiastically*");
    setTimeout(() => { setCatAction("idle"); setActiveToy(null); setCatMessage(""); }, 3500);
  }, []);

  const sleepCat = useCallback(() => {
    setCatAction("sleeping");
    setCatMessage("*curls up* ...zzz");
    setTimeout(() => { setCatAction("idle"); setCatMessage(""); }, 5000);
  }, []);

  const currentFace = CAT_REACTIONS[catAction].face;
  const currentMood = CAT_REACTIONS[catAction].mood;

  return (
    <div className="h-full w-full overflow-y-auto relative" style={{ background: "oklch(0.14 0.04 60)" }}>
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {PARTICLES.map((p) => (
          <span key={p.id} className="absolute rounded-full"
            style={{ width: p.size, height: p.size, left: p.left, top: p.top, background: p.color,
              animation: `dust-float ${p.duration}s ease-in-out ${p.delay}s infinite`, "--dx": `${p.dx}px`, "--dy": `${p.dy}px` } as React.CSSProperties} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 flex flex-col items-center min-h-full">
        {/* Title */}
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary/40 serif mb-3">Chamber 03</p>
          <h1 className="serif text-4xl md:text-5xl italic text-foreground" style={{ textShadow: "0 0 60px oklch(0.70 0.10 90 / 15%)" }}>
            Our Little Family
          </h1>
          <p className="serif italic text-sm text-muted-foreground/60 mt-3">the warmth we already have</p>
        </motion.div>

        {/* Cat area */}
        <motion.div className="relative mb-12"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          {/* Glow ring */}
          <div className="absolute inset-0 -m-12 rounded-full"
            style={{ background: `radial-gradient(circle, oklch(0.70 0.10 90 / ${catAction === "pet" ? "20%" : "12%"}) 0%, oklch(0.70 0.10 90 / 4%) 40%, transparent 70%)`,
              animation: "breathe 6s ease-in-out infinite", transition: "background 0.5s" }} />

          {/* Cat circle */}
          <motion.div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center cursor-pointer"
            style={{ background: "linear-gradient(135deg, oklch(0.22 0.04 60 / 80%), oklch(0.18 0.05 90 / 90%))",
              border: "1px solid oklch(0.50 0.10 90 / 20%)", boxShadow: "0 0 80px oklch(0.70 0.10 90 / 10%), inset 0 0 40px oklch(0.15 0.03 60 / 50%)" }}
            animate={catAction === "sleeping" ? { y: [0, -2, 0] } : catAction === "playing" ? { rotate: [-3, 3, -3] } : { y: [0, -6, 0] }}
            transition={{ duration: catAction === "playing" ? 0.3 : 4, repeat: Infinity, ease: "easeInOut" }}
            onClick={petCat}>
            <motion.span className="text-7xl md:text-8xl select-none" role="img" aria-label="cat"
              animate={catAction === "pet" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}>
              {currentFace}
            </motion.span>
            <span className="text-[10px] serif italic mt-1" style={{ color: "oklch(0.65 0.08 90 / 60%)" }}>
              {currentMood}
            </span>
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(0.75 0.12 90 / 40%)", top: "50%", left: "50%" }}
              animate={{ rotate: [i * 120, i * 120 + 360], x: [0, 90 + i * 10, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }} />
          ))}

          {/* Cat message */}
          <AnimatePresence>
            {catMessage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] serif italic"
                style={{ background: "oklch(0.20 0.03 90 / 80%)", color: "oklch(0.80 0.08 90)", border: "1px solid oklch(0.40 0.06 90 / 20%)" }}>
                {catMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action buttons */}
        <motion.div className="flex gap-3 mb-12 flex-wrap justify-center relative z-10"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <motion.button onClick={petCat}
            className="serif rounded-full px-5 py-2 text-xs transition-all"
            style={{ background: "oklch(0.30 0.06 90 / 60%)", border: "1px solid oklch(0.50 0.08 90 / 30%)", color: "oklch(0.80 0.08 90)" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            🤲 Pet
          </motion.button>
          <motion.button onClick={sleepCat}
            className="serif rounded-full px-5 py-2 text-xs transition-all"
            style={{ background: "oklch(0.25 0.04 260 / 60%)", border: "1px solid oklch(0.40 0.06 260 / 30%)", color: "oklch(0.65 0.06 260)" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            😴 Sleep
          </motion.button>
        </motion.div>

        {/* Feeding Corner */}
        <motion.div className="w-full max-w-md mb-12 relative z-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-center mb-4" style={{ color: "oklch(0.65 0.08 90 / 50%)" }}>
            🍽 Feeding Corner
          </p>
          <div className="flex gap-3 justify-center">
            {[
              { type: "treat", emoji: "🍖", label: "Give Treats" },
              { type: "bowl", emoji: "🥣", label: "Fill Bowl" },
              { type: "water", emoji: "💧", label: "Fresh Water" },
            ].map((item) => (
              <motion.button key={item.type} onClick={() => feedCat(item.type)}
                className="rounded-xl px-4 py-3 text-center transition-all group"
                style={{ background: "oklch(0.18 0.03 90 / 50%)", border: "1px solid oklch(0.35 0.06 90 / 20%)" }}
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="text-[10px] serif" style={{ color: "oklch(0.60 0.06 90 / 70%)" }}>{item.label}</span>
              </motion.button>
            ))}
          </div>
          <p className="text-[9px] text-center mt-2 italic" style={{ color: "oklch(0.45 0.04 90 / 40%)" }}>
            No hunger mechanic. Just love.
          </p>
        </motion.div>

        {/* Toy Basket */}
        <motion.div className="w-full max-w-md mb-12 relative z-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-center mb-4" style={{ color: "oklch(0.65 0.08 90 / 50%)" }}>
            🧺 Toy Basket
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TOYS.map((toy) => (
              <motion.button key={toy.name} onClick={() => playWithCat(toy.name)}
                className="rounded-xl p-4 text-center transition-all group relative overflow-hidden"
                style={{ background: "oklch(0.18 0.03 90 / 50%)", border: `1px solid ${activeToy === toy.name ? "oklch(0.70 0.12 90 / 50%)" : "oklch(0.35 0.06 90 / 20%)"}` }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {activeToy === toy.name && (
                  <motion.div className="absolute inset-0"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: "radial-gradient(circle, oklch(0.70 0.10 90 / 15%), transparent 70%)" }} />
                )}
                <span className="text-3xl block mb-2 relative z-10 group-hover:scale-110 transition-transform">{toy.emoji}</span>
                <span className="text-xs serif relative z-10" style={{ color: "oklch(0.65 0.06 90)" }}>{toy.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Moments grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-16 relative z-10">
          {MOMENTS.map((m, i) => (
            <motion.div key={i}
              className="group relative rounded-2xl p-4 text-center overflow-hidden cursor-default"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, scale: 1.03 }}
              style={{ background: "oklch(0.18 0.03 90 / 50%)", border: "1px solid oklch(0.35 0.06 90 / 20%)", backdropFilter: "blur(8px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 40%, oklch(0.70 0.10 90 / 15%), transparent 70%)" }} />
              <span className="text-2xl mb-2 block relative z-10 select-none">{m.emoji}</span>
              <h3 className="serif italic text-xs text-foreground/90 mb-1 relative z-10 leading-snug">{m.label}</h3>
              <p className="text-[10px] text-muted-foreground/45 serif italic relative z-10 leading-snug">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p className="serif italic text-sm text-muted-foreground/30 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}>
          Our little family. Already so full of love.
        </motion.p>
      </div>
    </div>
  );
}
