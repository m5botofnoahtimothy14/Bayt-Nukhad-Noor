import { motion } from "framer-motion";
import type { MemoryStrip } from "@/components/memories-room/useMemoryStrips";

type Props = {
  onBack: () => void;
  onOpenBooth?: () => void;
  strips?: MemoryStrip[];
};

export function MemoryBoothChamber({ onBack, onOpenBooth, strips = [] }: Props) {

  return (
    <div
      className="h-full flex flex-col items-center justify-center px-6 py-20 overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, oklch(0.16 0.03 350) 0%, oklch(0.12 0.04 15) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.12 350 / 8%), transparent 60%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* Title */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary/40 serif mb-3">
          Chamber 04
        </p>
        <h1 className="serif text-4xl md:text-5xl italic text-foreground mb-2">
          The Memory Booth
        </h1>
        <p className="serif italic text-sm text-muted-foreground/60">
          moments for forever
        </p>
      </motion.div>

      {/* Vintage Booth Illustration */}
      <motion.div
        className="relative z-10 mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div
          className="relative w-72 md:w-80 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, oklch(0.35 0.06 25) 0%, oklch(0.25 0.04 20) 100%)",
            border: "3px solid oklch(0.40 0.08 25 / 50%)",
            boxShadow: "0 20px 60px oklch(0 0 0 / 40%), inset 0 0 40px oklch(0.5 0.08 35 / 5%)",
          }}
        >
          {/* Curtain left */}
          <div
            className="absolute top-0 left-0 w-8 h-full"
            style={{
              background: "linear-gradient(180deg, oklch(0.35 0.10 350 / 60%), oklch(0.25 0.08 350 / 40%))",
              animation: "curtainSway 4s ease-in-out infinite",
              transformOrigin: "top left",
            }}
          />
          {/* Curtain right */}
          <div
            className="absolute top-0 right-0 w-8 h-full"
            style={{
              background: "linear-gradient(180deg, oklch(0.35 0.10 350 / 60%), oklch(0.25 0.08 350 / 40%))",
              animation: "curtainSway 4s ease-in-out infinite reverse",
              transformOrigin: "top right",
            }}
          />

          {/* Interior */}
          <div className="relative px-12 py-10 text-center">
            {/* Lamp glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none"
              style={{
                background: "radial-gradient(circle, oklch(0.85 0.12 55 / 12%), transparent 70%)",
              }}
            />

            {/* Camera icon */}
            <div className="text-5xl mb-4" style={{ filter: "sepia(0.2)" }}>
              &#128247;
            </div>

            {/* Countdown decoration */}
            <div className="flex items-center justify-center gap-3 mb-3">
              {["3", "2", "1"].map((n, i) => (
                <motion.span
                  key={n}
                  className="serif text-lg italic"
                  style={{ color: "oklch(0.70 0.08 55 / 40%)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                >
                  {n}
                </motion.span>
              ))}
            </div>

            {/* Flash text */}
            <p
              className="text-[10px] uppercase tracking-[0.3em] serif"
              style={{ color: "oklch(0.70 0.08 55 / 30%)" }}
            >
              flash
            </p>

            {/* Enter booth button */}
            <motion.button
              onClick={onOpenBooth}
              className="mt-6 rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground transition-all"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.12 350 / 70%), oklch(0.45 0.10 15 / 60%))",
                boxShadow: "0 4px 20px oklch(0.50 0.12 350 / 20%)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 6px 30px oklch(0.50 0.12 350 / 30%)" }}
              whileTap={{ scale: 0.97 }}
            >
              Enter the Booth
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Existing memory strips */}
      <motion.div
        className="relative z-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 serif mb-4 text-center">
          our strips
        </p>

        {strips.length === 0 ? (
          <p className="serif italic text-sm text-muted-foreground/40 text-center py-8">
            Our first strip is waiting to be taken.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 justify-center flex-wrap">
            {strips.slice(0, 8).map((strip, i) => (
              <motion.div
                key={strip.id}
                className="flex-shrink-0 rounded-xl overflow-hidden border border-white/5"
                style={{
                  background: "linear-gradient(180deg, #f5f0e8, #e8e0d4)",
                  boxShadow: "0 8px 30px oklch(0 0 0 / 30%)",
                }}
                initial={{ opacity: 0, y: 15, rotate: (i % 2 === 0 ? -2 : 2) }}
                animate={{ opacity: 1, y: 0, rotate: (i % 2 === 0 ? -1 : 1) }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <div className="w-24 h-32 overflow-hidden">
                  <img
                    src={strip.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: "sepia(0.1) contrast(1.05)" }}
                  />
                </div>
                {strip.quote && (
                  <p className="px-2 py-1.5 text-[7px] text-amber-900/50 serif italic text-center leading-tight">
                    {strip.quote}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom note */}
      <motion.p
        className="serif italic text-[11px] text-muted-foreground/25 mt-12 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Every photograph becomes part of our story.
      </motion.p>
    </div>
  );
}
