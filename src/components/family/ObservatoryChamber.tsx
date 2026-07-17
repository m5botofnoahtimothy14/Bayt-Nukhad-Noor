import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onBack: () => void };

const STARS = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  size: 1 + (i % 4) * 0.6,
  left: `${(i * 1.7) % 100}%`,
  top: `${(i * 1.3 + 5) % 100}%`,
  delay: (i * 0.3) % 8,
  duration: 2 + (i % 5) * 1.2,
}));

const TOP_STARS = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: 0.8 + (i % 3) * 0.5,
  left: `${(i * 3.4) % 100}%`,
  top: `${(i * 2.1) % 60}%`,
  delay: (i * 0.25) % 5,
  duration: 1.8 + (i % 4) * 0.8,
}));

const COMFORT_OPTIONS = [
  { label: "Hug Me", glow: "oklch(0.85 0.12 55 / 60%)", message: "A warm hug wraps around you like sunlight." },
  { label: "Sit With Me", glow: "oklch(0.55 0.08 260 / 50%)", message: "We sit together beneath the stars. No words needed." },
  { label: "Kiss", glow: "oklch(0.75 0.15 350 / 55%)", message: "A gentle kiss under a thousand stars." },
] as const;

export function ObservatoryChamber({ onBack }: Props) {
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteOpened, setNoteOpened] = useState(false);
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const [shootingStar, setShootingStar] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setNoteVisible(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStar(true);
      setTimeout(() => setShootingStar(false), 1200);
    }, 8000 + Math.random() * 6000);
    return () => clearInterval(interval);
  }, []);

  const triggerOption = useCallback((index: number) => {
    setActiveOption(index);
    setTimeout(() => {
      setActiveOption(null);
      setNoteOpened(false);
    }, 4000);
  }, []);

  return (
    <div
      className="h-full w-full overflow-y-auto relative"
      style={{ backgroundColor: "oklch(0.08 0.04 260)" }}
    >
      {/* Deep ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, oklch(0.12 0.05 260 / 60%) 0%, transparent 60%), radial-gradient(ellipse at 50% 90%, oklch(0.10 0.03 280 / 30%) 0%, transparent 50%)",
        }}
      />

      {/* Top scattered stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {TOP_STARS.map((s) => (
          <span
            key={`top-${s.id}`}
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              left: s.left,
              top: s.top,
              background: "oklch(0.90 0.02 260 / 50%)",
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 flex flex-col items-center min-h-full">

        {/* Back button */}
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="serif mb-10 cursor-pointer text-sm tracking-widest uppercase self-start"
          style={{ color: "oklch(0.55 0.08 260 / 60%)" }}
        >
          &larr; Return
        </motion.button>

        {/* Title */}
        <motion.div
          className="text-center mb-14 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.5em] serif mb-4"
            style={{ color: "oklch(0.55 0.08 260 / 40%)" }}
          >
            Chamber 07
          </p>
          <h1
            className="serif text-5xl md:text-6xl italic text-foreground"
            style={{ textShadow: "0 0 80px oklch(0.55 0.08 260 / 20%)" }}
          >
            The Observatory
          </h1>
          <p className="serif italic text-sm text-muted-foreground/50 mt-4 max-w-sm mx-auto leading-relaxed">
            a place to simply be
          </p>
        </motion.div>

        {/* Observatory window */}
        <motion.div
          className="relative mb-16"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Moon glow behind window */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.85 0.06 240 / 8%) 0%, oklch(0.85 0.06 240 / 3%) 30%, transparent 60%)",
              animation: "breathe 10s ease-in-out infinite",
            }}
          />

          {/* Circular window frame */}
          <div
            className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden"
            style={{
              border: "3px solid oklch(0.30 0.04 260 / 50%)",
              boxShadow:
                "0 0 60px oklch(0.20 0.06 260 / 30%), inset 0 0 40px oklch(0.06 0.03 260 / 80%)",
            }}
          >
            {/* Inner sky gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, oklch(0.15 0.06 260) 0%, oklch(0.06 0.03 260) 100%)",
              }}
            />

            {/* Stars inside window */}
            {STARS.map((s) => (
              <span
                key={s.id}
                className="absolute rounded-full"
                style={{
                  width: s.size,
                  height: s.size,
                  left: s.left,
                  top: s.top,
                  background: "oklch(0.95 0.02 260 / 70%)",
                  animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}

            {/* Moon */}
            <div
              className="absolute top-[15%] right-[18%] w-10 h-10 md:w-14 md:h-14 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, oklch(0.92 0.04 90) 0%, oklch(0.80 0.05 80) 60%, oklch(0.60 0.04 70) 100%)",
                boxShadow:
                  "0 0 30px oklch(0.85 0.06 85 / 30%), 0 0 60px oklch(0.85 0.06 85 / 10%)",
              }}
            />

            {/* Shooting star */}
            <AnimatePresence>
              {shootingStar && (
                <motion.div
                  className="absolute h-[1px] origin-top-left"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.95 0.02 260 / 90%), transparent)",
                    width: "120px",
                    top: "20%",
                    left: "15%",
                    transform: "rotate(25deg)",
                  }}
                  initial={{ opacity: 0, scaleX: 0, x: 0 }}
                  animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1], x: [0, 160, 280] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Window frame cross bars */}
            <div
              className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2"
              style={{ background: "oklch(0.25 0.03 260 / 40%)" }}
            />
            <div
              className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
              style={{ background: "oklch(0.25 0.03 260 / 40%)" }}
            />
          </div>
        </motion.div>

        {/* Desk area */}
        <motion.div
          className="relative w-full max-w-lg mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex items-end justify-center gap-8">
            {/* Chair suggestion */}
            <div
              className="w-16 h-20 rounded-t-xl"
              style={{
                background: "linear-gradient(180deg, oklch(0.20 0.03 40), oklch(0.16 0.02 40))",
                border: "1px solid oklch(0.25 0.03 40 / 30%)",
              }}
            />

            {/* Desk */}
            <div className="relative">
              {/* Lamp */}
              <div className="absolute -top-12 left-4 z-10">
                {/* Lamp shade */}
                <div
                  className="w-10 h-6 mx-auto rounded-t-sm"
                  style={{
                    background: "linear-gradient(180deg, oklch(0.55 0.10 60), oklch(0.50 0.08 60))",
                    border: "1px solid oklch(0.45 0.08 60 / 40%)",
                  }}
                />
                {/* Lamp stem */}
                <div
                  className="w-[2px] h-6 mx-auto"
                  style={{ background: "oklch(0.30 0.04 60 / 50%)" }}
                />
                {/* Warm glow */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 -translate-y-4 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.80 0.12 55 / 12%) 0%, oklch(0.80 0.12 55 / 4%) 40%, transparent 70%)",
                    animation: "breathe 6s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Telescope silhouette */}
              <div className="absolute -top-8 right-4 z-10">
                <div
                  className="w-2 h-14 origin-bottom"
                  style={{
                    background: "oklch(0.18 0.03 260 / 80%)",
                    transform: "rotate(-30deg)",
                  }}
                />
                <div
                  className="absolute top-0 right-0 w-8 h-3 rounded-sm"
                  style={{
                    background: "oklch(0.15 0.03 260 / 90%)",
                    transform: "rotate(-30deg)",
                  }}
                />
              </div>

              {/* Desk surface */}
              <div
                className="w-56 h-6 rounded-sm"
                style={{
                  background: "linear-gradient(180deg, oklch(0.28 0.05 50), oklch(0.22 0.04 45))",
                  border: "1px solid oklch(0.30 0.04 50 / 30%)",
                  boxShadow: "0 4px 20px oklch(0.05 0.02 260 / 40%)",
                }}
              />
              {/* Desk legs */}
              <div className="flex justify-between px-3">
                <div
                  className="w-[2px] h-8"
                  style={{ background: "oklch(0.22 0.03 45 / 60%)" }}
                />
                <div
                  className="w-[2px] h-8"
                  style={{ background: "oklch(0.22 0.03 45 / 60%)" }}
                />
              </div>
            </div>

            {/* Chair right accent */}
            <div
              className="w-14 h-16 rounded-t-lg"
              style={{
                background: "linear-gradient(180deg, oklch(0.19 0.03 40), oklch(0.15 0.02 40))",
                border: "1px solid oklch(0.22 0.03 40 / 25%)",
              }}
            />
          </div>
        </motion.div>

        {/* Folded note (appears after 30s idle) */}
        <AnimatePresence>
          {noteVisible && activeOption === null && (
            <motion.div
              className="relative mb-12"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => setNoteOpened(true)}
                className="cursor-pointer relative px-8 py-5 rounded-sm serif italic text-sm transition-all duration-500"
                style={{
                  background: "oklch(0.88 0.03 75 / 90%)",
                  color: "oklch(0.30 0.03 50)",
                  boxShadow:
                    "0 0 20px oklch(0.80 0.08 55 / 15%), 0 4px 12px oklch(0.10 0.02 260 / 30%)",
                  animation: "noteGlow 4s ease-in-out infinite",
                }}
              >
                {noteOpened ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-5"
                  >
                    <p className="text-xs mb-1" style={{ color: "oklch(0.40 0.04 50)" }}>
                      Need a little comfort?
                    </p>
                    <div className="flex gap-4">
                      {COMFORT_OPTIONS.map((opt, i) => (
                        <motion.button
                          key={opt.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerOption(i);
                          }}
                          className="px-4 py-2 rounded-full serif text-xs transition-all duration-300"
                          style={{
                            background: "oklch(0.20 0.03 260 / 70%)",
                            color: "oklch(0.80 0.06 260 / 90%)",
                            border: "1px solid oklch(0.40 0.06 260 / 25%)",
                          }}
                          whileHover={{
                            scale: 1.08,
                            boxShadow: "0 0 16px oklch(0.60 0.08 260 / 20%)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                        >
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <span style={{ color: "oklch(0.35 0.04 50)" }}>
                    ✉ a small note lies here...
                  </span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comfort animation overlay */}
        <AnimatePresence>
          {activeOption !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Glow fill */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, times: [0, 0.2, 0.7, 1] }}
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${COMFORT_OPTIONS[activeOption].glow}, transparent 70%)`,
                }}
              />

              {/* Message text */}
              <motion.p
                className="proposal-heading serif text-xl md:text-2xl italic text-center px-8 max-w-md relative z-10"
                style={{ color: "oklch(0.90 0.04 260)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
                transition={{ duration: 4, times: [0, 0.15, 0.75, 1] }}
              >
                {COMFORT_OPTIONS[activeOption].message}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom note */}
        <motion.p
          className="serif italic text-[11px] text-muted-foreground/25 mt-auto pt-10 text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Peace is the most beautiful thing we can share.
        </motion.p>
      </div>
    </div>
  );
}
