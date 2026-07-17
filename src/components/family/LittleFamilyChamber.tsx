import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onBack: () => void;
  catName: string | null;
  onAdopt: (name: string) => void;
};

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

// Meow sound - using Web Audio API
function playMeow() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {}
}

function playPurr() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(25, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch {}
}

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

export function LittleFamilyChamber({ onBack, catName, onAdopt }: Props) {
  const [adoptionPhase, setAdoptionPhase] = useState<"ask" | "naming" | "certificate" | "done">(catName ? "done" : "ask");
  const [catInputName, setCatInputName] = useState("");
  const [catAction, setCatAction] = useState<CatAction>("idle");
  const [catMessage, setCatMessage] = useState("");
  const [feedingType, setFeedingType] = useState<string | null>(null);
  const [activeToy, setActiveToy] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adoptionPhase === "naming" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adoptionPhase]);

  const confirmAdoption = useCallback(() => {
    if (!catInputName.trim()) return;
    playMeow();
    setAdoptionPhase("certificate");
    setTimeout(() => {
      onAdopt(catInputName.trim());
    }, 100);
  }, [catInputName, onAdopt]);

  const petCat = useCallback(() => {
    setCatAction("pet");
    setCatMessage("She leans into your hand...");
    playPurr();
    setTimeout(() => { setCatAction("idle"); setCatMessage(""); }, 3000);
  }, []);

  const feedCat = useCallback((type: string) => {
    setCatAction("feeding");
    setFeedingType(type);
    playMeow();
    setCatMessage(type === "treat" ? "*crunch crunch*" : "*lap lap*");
    setTimeout(() => { setCatAction("idle"); setFeedingType(null); setCatMessage(""); }, 3000);
  }, []);

  const playWithCat = useCallback((toy: string) => {
    setCatAction("playing");
    setActiveToy(toy);
    playMeow();
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

  // Adoption flow screens
  if (adoptionPhase === "ask") {
    return (
      <div className="h-full w-full overflow-y-auto relative flex items-center justify-center" style={{ background: "oklch(0.14 0.04 60)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, oklch(0.25 0.08 90 / 20%) 0%, transparent 60%)" }} />
        <motion.div className="relative z-10 text-center max-w-md px-6"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <span className="text-8xl block mb-6 select-none" style={{ filter: "drop-shadow(0 0 30px oklch(0.70 0.10 90 / 30%))" }}>🐈</span>
          </motion.div>
          <h2 className="serif text-2xl italic mb-3" style={{ color: "oklch(0.82 0.10 90)" }}>A little soul is waiting...</h2>
          <p className="serif text-sm italic mb-8 leading-relaxed" style={{ color: "oklch(0.60 0.06 90 / 60%)" }}>
            Someone warm and soft wants to be part of our family.
            <br />Will you adopt her?
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button onClick={() => setAdoptionPhase("naming")}
              className="serif rounded-full px-8 py-3 text-sm transition-all"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px oklch(0.70 0.12 90 / 25%)" }}
              whileTap={{ scale: 0.95 }}
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.12 90), oklch(0.50 0.10 55))", color: "oklch(0.95 0.03 90)" }}>
              ♥ Yes, let's adopt her
            </motion.button>
            <motion.button onClick={onBack}
              className="serif rounded-full px-6 py-3 text-sm transition-all"
              whileHover={{ scale: 1.03 }}
              style={{ color: "oklch(0.55 0.05 60 / 50%)", border: "1px solid oklch(0.35 0.04 60 / 20%)" }}>
              not yet
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (adoptionPhase === "naming") {
    return (
      <div className="h-full w-full overflow-y-auto relative flex items-center justify-center" style={{ background: "oklch(0.14 0.04 60)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, oklch(0.25 0.08 90 / 20%) 0%, transparent 60%)" }} />
        <motion.div className="relative z-10 text-center max-w-md px-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <motion.span className="text-6xl block mb-4" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🐱</motion.span>
          <h2 className="serif text-xl italic mb-2" style={{ color: "oklch(0.82 0.10 90)" }}>What shall we call her?</h2>
          <p className="serif text-xs italic mb-6" style={{ color: "oklch(0.55 0.05 60 / 50%)" }}>Every name is a promise of love.</p>
          <input ref={inputRef} type="text" value={catInputName}
            onChange={(e) => setCatInputName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmAdoption()}
            placeholder="her name..."
            className="w-full max-w-xs mx-auto block bg-transparent serif text-lg italic text-center px-4 py-3 rounded-xl outline-none mb-6 placeholder:text-muted-foreground/25"
            style={{ color: "oklch(0.85 0.08 90)", border: "1px solid oklch(0.40 0.08 90 / 25%)", background: "oklch(0.18 0.04 60 / 40%)" }} />
          <div className="flex gap-3 justify-center">
            <motion.button onClick={confirmAdoption}
              className="serif rounded-full px-6 py-2.5 text-sm transition-all"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              disabled={!catInputName.trim()}
              style={{ background: catInputName.trim() ? "linear-gradient(135deg, oklch(0.55 0.12 90), oklch(0.50 0.10 55))" : "oklch(0.20 0.03 60 / 40%)",
                color: catInputName.trim() ? "oklch(0.95 0.03 90)" : "oklch(0.40 0.04 60 / 40%)", opacity: catInputName.trim() ? 1 : 0.5 }}>
              Name Her ♥
            </motion.button>
            <motion.button onClick={() => setAdoptionPhase("ask")}
              className="serif rounded-full px-5 py-2.5 text-xs transition-all"
              style={{ color: "oklch(0.50 0.04 60 / 40%)" }}>
              back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (adoptionPhase === "certificate" || (adoptionPhase === "done" && showCertificate)) {
    const name = catName || catInputName;
    return (
      <div className="h-full w-full overflow-y-auto relative flex items-center justify-center" style={{ background: "oklch(0.14 0.04 60)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, oklch(0.30 0.10 55 / 25%) 0%, transparent 55%)" }} />
        <motion.div className="relative z-10 text-center max-w-md px-4"
          initial={{ opacity: 0, scale: 0.85, rotateY: -10 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="rounded-2xl p-8 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, oklch(0.92 0.02 75 / 95%), oklch(0.88 0.03 85 / 98%))",
              border: "2px solid oklch(0.70 0.10 55 / 30%)", boxShadow: "0 0 60px oklch(0.70 0.12 55 / 15%), 0 20px 40px oklch(0.10 0.02 60 / 30%)" }}>
            {/* Corner flourishes */}
            <div className="absolute top-3 left-3 text-lg" style={{ color: "oklch(0.70 0.10 55 / 30%)" }}>✦</div>
            <div className="absolute top-3 right-3 text-lg" style={{ color: "oklch(0.70 0.10 55 / 30%)" }}>✦</div>
            <div className="absolute bottom-3 left-3 text-lg" style={{ color: "oklch(0.70 0.10 55 / 30%)" }}>✦</div>
            <div className="absolute bottom-3 right-3 text-lg" style={{ color: "oklch(0.70 0.10 55 / 30%)" }}>✦</div>

            <p className="text-[9px] uppercase tracking-[0.5em] serif mb-2" style={{ color: "oklch(0.60 0.08 55 / 60%)" }}>Certificate of Adoption</p>
            <div className="w-16 h-px mx-auto mb-4" style={{ background: "oklch(0.70 0.10 55 / 30%)" }} />
            <motion.span className="text-5xl block mb-4"
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              🐈
            </motion.span>
            <p className="serif text-[10px] italic mb-1" style={{ color: "oklch(0.50 0.05 55 / 60%)" }}>this certifies that</p>
            <p className="serif text-xl italic mb-3" style={{ color: "oklch(0.30 0.04 55)", textShadow: "0 0 10px oklch(0.60 0.08 55 / 10%)" }}>
              {name}
            </p>
            <p className="serif text-[10px] italic mb-3" style={{ color: "oklch(0.50 0.05 55 / 60%)" }}>has been lovingly adopted into</p>
            <p className="serif text-lg italic mb-1" style={{ color: "oklch(0.30 0.04 55)" }}>Bayt Nūkhad Nūr</p>
            <div className="w-20 h-px mx-auto my-3" style={{ background: "oklch(0.70 0.10 55 / 25%)" }} />
            <p className="serif text-[10px] italic mb-1" style={{ color: "oklch(0.50 0.05 55 / 60%)" }}>adopted by</p>
            <p className="serif text-base italic" style={{ color: "oklch(0.30 0.04 55)" }}>Noah & Khadija</p>
            <p className="text-[9px] serif italic mt-3" style={{ color: "oklch(0.55 0.06 55 / 40%)" }}>
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-[8px] serif italic mt-1" style={{ color: "oklch(0.50 0.05 55 / 35%)" }}>
              "And God created every living creature..." — Quran 42:29
            </p>
          </div>

          {adoptionPhase === "certificate" && (
            <motion.button onClick={() => { setAdoptionPhase("done"); setShowCertificate(false); }}
              className="mt-6 serif rounded-full px-8 py-3 text-sm transition-all"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.12 90), oklch(0.50 0.10 55))", color: "oklch(0.95 0.03 90)" }}>
              Meet {name} ♥
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // Main chamber (after adoption)
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
          <div className="absolute inset-0 -m-12 rounded-full"
            style={{ background: `radial-gradient(circle, oklch(0.70 0.10 90 / ${catAction === "pet" ? "20%" : "12%"}) 0%, oklch(0.70 0.10 90 / 4%) 40%, transparent 70%)`,
              animation: "breathe 6s ease-in-out infinite", transition: "background 0.5s" }} />

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

          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(0.75 0.12 90 / 40%)", top: "50%", left: "50%" }}
              animate={{ rotate: [i * 120, i * 120 + 360], x: [0, 90 + i * 10, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }} />
          ))}

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

        {/* Cat name label */}
        <motion.p className="serif italic text-sm mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ color: "oklch(0.65 0.08 90 / 50%)" }}>
          {catName}
        </motion.p>

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
          <motion.button onClick={() => playMeow()}
            className="serif rounded-full px-5 py-2 text-xs transition-all"
            style={{ background: "oklch(0.25 0.06 55 / 60%)", border: "1px solid oklch(0.45 0.08 55 / 30%)", color: "oklch(0.75 0.08 55)" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            🔊 Meow
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-12 relative z-10">
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

        {/* Adoption certificate display */}
        <motion.div className="w-full max-w-sm mb-12 relative z-10"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <motion.button onClick={() => setShowCertificate(!showCertificate)}
            className="w-full serif rounded-xl p-4 text-center transition-all"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ background: "oklch(0.88 0.02 75 / 70%)", border: "1px solid oklch(0.70 0.08 55 / 25%)",
              boxShadow: "0 2px 12px oklch(0.10 0.02 60 / 8%)" }}>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "oklch(0.55 0.06 55 / 60%)" }}>
              📜 Adoption Certificate
            </p>
          </motion.button>
        </motion.div>

        <motion.p className="serif italic text-sm text-muted-foreground/30 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}>
          Our little family. Already so full of love.
        </motion.p>
      </div>
    </div>
  );
}
