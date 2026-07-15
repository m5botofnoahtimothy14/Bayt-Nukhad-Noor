import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Vignette = "hug" | "sit" | "kiss";

const VIGNETTES: Record<Vignette, { title: string; lines: string[] }> = {
  hug: {
    title: "Hug me.",
    lines: [
      "The room dims a little.",
      "You feel arms fold around you from behind.",
      "A slow breath. Warmth. No words.",
      "Then — gently — the room brightens again.",
    ],
  },
  sit: {
    title: "Sit with me.",
    lines: [
      "Two cushions appear on the observatory floor.",
      "The music quiets to almost nothing.",
      "You sit. He sits. Neither of you says anything.",
      "The stars keep moving. That's enough.",
    ],
  },
  kiss: {
    title: "Kiss.",
    lines: [
      "The lamp glow softens.",
      "A hand cups your face — so lightly.",
      "One quiet second where the whole sky waits.",
      "Then it lets you go, and the stars return.",
    ],
  },
};

const IDLE_MS = 30_000;

export function ObservatoryVignette() {
  const [notePhase, setNotePhase] = useState<"idle" | "note" | "choices" | "playing" | "done">("idle");
  const [chosen, setChosen] = useState<Vignette | null>(null);
  const [lineIdx, setLineIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle detector
  useEffect(() => {
    if (notePhase !== "idle") return;
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setNotePhase("note"), IDLE_MS);
    };
    reset();
    const evts = ["mousemove", "keydown", "wheel", "touchstart", "click"];
    evts.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      evts.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [notePhase]);

  // Auto-advance vignette lines
  useEffect(() => {
    if (notePhase !== "playing" || !chosen) return;
    const lines = VIGNETTES[chosen].lines;
    if (lineIdx >= lines.length) {
      const t = setTimeout(() => setNotePhase("done"), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIdx((i) => i + 1), 2600);
    return () => clearTimeout(t);
  }, [notePhase, chosen, lineIdx]);

  // Auto-fade "done" back to idle so room returns exactly as it was
  useEffect(() => {
    if (notePhase !== "done") return;
    const t = setTimeout(() => {
      setChosen(null);
      setLineIdx(0);
      setNotePhase("idle");
    }, 2500);
    return () => clearTimeout(t);
  }, [notePhase]);

  const dismiss = () => { setChosen(null); setLineIdx(0); setNotePhase("idle"); };

  return (
    <>
      {/* Desk-lamp glow when a note is present */}
      <AnimatePresence>
        {(notePhase === "note" || notePhase === "choices" || notePhase === "playing") && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
              background:
                "radial-gradient(ellipse at 20% 80%, oklch(0.78 0.14 65 / 22%), transparent 55%)",
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>

      {/* Vignette playing — soft darken over room */}
      <AnimatePresence>
        {notePhase === "playing" && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          />
        )}
      </AnimatePresence>

      {/* Folded note appears bottom-left */}
      <AnimatePresence>
        {notePhase === "note" && (
          <motion.button
            key="note"
            onClick={() => setNotePhase("choices")}
            className="absolute bottom-24 left-6 z-40 serif italic"
            initial={{ opacity: 0, y: 20, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1.4 }}
            style={{
              background: "linear-gradient(180deg, oklch(0.94 0.04 80), oklch(0.88 0.05 70))",
              color: "oklch(0.28 0.08 30)",
              padding: "14px 18px",
              borderRadius: 3,
              boxShadow: "0 20px 40px oklch(0 0 0 / 45%), 0 0 30px oklch(0.75 0.14 55 / 15%)",
              maxWidth: 220,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <p className="text-[9px] uppercase tracking-[0.4em] opacity-60">a folded note</p>
            <p className="mt-2 text-sm leading-snug">"You've been quiet a while. Open me."</p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Choices overlay */}
      <AnimatePresence>
        {notePhase === "choices" && (
          <motion.div
            key="choices"
            className="absolute inset-0 z-40 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="absolute inset-0"
              onClick={dismiss}
              style={{ background: "radial-gradient(ellipse at center, oklch(0 0 0 / 55%), oklch(0 0 0 / 75%))" }}
            />
            <motion.div
              className="relative max-w-md text-center"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.2 }}
            >
              <p className="serif text-[10px] uppercase tracking-[0.6em] text-amber-200/50">
                the note unfolds
              </p>
              <h3 className="serif mt-3 text-2xl italic text-amber-50">
                What do you need right now?
              </h3>
              <div className="mt-8 flex flex-col gap-3">
                {(["hug", "sit", "kiss"] as Vignette[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => { setChosen(v); setLineIdx(0); setNotePhase("playing"); }}
                    className="serif rounded-full border border-amber-200/20 bg-black/30 px-8 py-3 text-base italic text-amber-50 backdrop-blur-md transition-all hover:border-amber-200/50 hover:bg-black/50 hover:scale-[1.02]"
                  >
                    {VIGNETTES[v].title}
                  </button>
                ))}
              </div>
              <button
                onClick={dismiss}
                className="serif mt-6 text-[10px] uppercase tracking-[0.5em] text-amber-200/40 hover:text-amber-200/70"
              >
                not now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playing vignette — cinematic lines */}
      <AnimatePresence>
        {notePhase === "playing" && chosen && (
          <motion.div
            key="playing"
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="max-w-lg text-center">
              <motion.p
                key={`title-${chosen}`}
                className="serif text-[10px] uppercase tracking-[0.6em] text-amber-200/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4 }}
              >
                {VIGNETTES[chosen].title}
              </motion.p>
              <AnimatePresence mode="wait">
                {lineIdx < VIGNETTES[chosen].lines.length && (
                  <motion.p
                    key={lineIdx}
                    className="serif mt-6 text-xl italic text-amber-50/90 md:text-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 1.4 }}
                  >
                    {VIGNETTES[chosen].lines[lineIdx]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
