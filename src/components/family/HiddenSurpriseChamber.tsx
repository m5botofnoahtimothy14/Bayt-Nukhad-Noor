import { motion } from "framer-motion";

type Props = { onBack: () => void };

const CLUES = [
  { icon: "🧳", label: "packed for two" },
  { icon: "🎫", label: "destination: unknown" },
  { icon: "🛂", label: "stamped with hope" },
  { icon: "🗺️", label: "marked with a heart" },
  { icon: "✈️", label: "wings of anticipation" },
  { icon: "📅", label: "one day is circled" },
];

const SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  delay: (i * 0.7) % 5,
  duration: 3 + (i % 4),
  size: 2 + (i % 3),
}));

export default function HiddenSurpriseChamber({ onBack }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: "oklch(0.15 0.02 30)" }}
    >
      {/* Deep ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 30%, oklch(0.22 0.04 40 / 0.4) 0%, transparent 55%), radial-gradient(ellipse at 65% 70%, oklch(0.18 0.03 55 / 0.3) 0%, transparent 50%)",
        }}
      />

      {/* Sparkle particles */}
      {SPARKLES.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: "oklch(0.9 0.04 80 / 0.5)",
            boxShadow: `0 0 ${s.size * 3}px oklch(0.9 0.04 80 / 0.3)`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-8">
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h1
            className="serif mb-3 text-4xl font-light tracking-wide italic sm:text-5xl"
            style={{
              color: "oklch(0.82 0.08 55)",
              textShadow: "0 0 60px oklch(0.75 0.10 55 / 15%)",
            }}
          >
            The Hidden Surprise
          </h1>
          <p
            className="serif text-sm tracking-[0.3em] uppercase sm:text-base"
            style={{ color: "oklch(0.55 0.05 50)" }}
          >
            something is waiting...
          </p>
        </motion.div>

        {/* Clue cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLUES.map((clue, i) => (
            <motion.div
              key={clue.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6 + i * 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative cursor-default"
            >
              <div
                className="serif relative rounded-xl px-6 py-8 text-center transition-all duration-500 group-hover:scale-105"
                style={{
                  backgroundColor: "oklch(0.20 0.03 40 / 60%)",
                  border: "1px solid oklch(0.40 0.06 55 / 20%)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 0 20px oklch(0.60 0.08 55 / 6%), inset 0 1px 0 oklch(0.50 0.06 55 / 10%)",
                }}
              >
                {/* Subtle glow on hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, oklch(0.65 0.10 55 / 10%), transparent 70%)",
                  }}
                />

                <span className="text-3xl mb-3 block transition-transform duration-500 group-hover:scale-110">
                  {clue.icon}
                </span>
                <p
                  className="serif italic text-sm relative z-10 tracking-wide"
                  style={{ color: "oklch(0.72 0.08 55 / 70%)" }}
                >
                  {clue.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mystery message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1.2 }}
          className="serif mt-14 text-center text-xs tracking-[0.15em] sm:text-sm leading-relaxed"
          style={{ color: "oklch(0.50 0.04 55 / 60%)" }}
        >
          Never reveal everything. Let curiosity build over time.
        </motion.p>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 1 }}
          className="serif italic mt-6 text-center text-[11px] tracking-widest"
          style={{ color: "oklch(0.45 0.04 50 / 40%)" }}
        >
          Some things are worth waiting for.
        </motion.p>
      </div>
    </motion.section>
  );
}
