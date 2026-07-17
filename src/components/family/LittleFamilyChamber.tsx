import { motion } from "framer-motion";

type Props = {
  onBack: () => void;
};

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

const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: 1.5 + (i % 4) * 0.8,
  left: `${(i * 5.7) % 100}%`,
  top: `${(i * 4.3 + 10) % 100}%`,
  delay: (i * 0.4) % 6,
  duration: 10 + (i % 5) * 3,
  color:
    i % 3 === 0
      ? "oklch(0.80 0.12 90 / 25%)"
      : i % 3 === 1
        ? "oklch(0.75 0.10 55 / 20%)"
        : "oklch(0.80 0.08 150 / 15%)",
  dx: -15 + ((i * 7) % 30),
  dy: -25 - ((i * 5) % 40),
}));

export function LittleFamilyChamber({ onBack }: Props) {
  return (
    <div
      className="h-full w-full overflow-y-auto relative"
      style={{ background: "oklch(0.14 0.04 60)" }}
    >
      {/* Floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              background: p.color,
              animation: `dust-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 flex flex-col items-center min-h-full">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary/40 serif mb-3">
            Chamber 02
          </p>
          <h1
            className="serif text-4xl md:text-5xl italic text-foreground"
            style={{ textShadow: "0 0 60px oklch(0.70 0.10 90 / 15%)" }}
          >
            Our Little Family
          </h1>
          <p className="serif italic text-sm text-muted-foreground/60 mt-3">
            the warmth we already have
          </p>
        </motion.div>

        {/* Central cat illustration */}
        <motion.div
          className="relative mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow ring behind cat */}
          <div
            className="absolute inset-0 -m-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.70 0.10 90 / 12%) 0%, oklch(0.70 0.10 90 / 4%) 40%, transparent 70%)",
              animation: "breathe 6s ease-in-out infinite",
            }}
          />

          {/* Cat circle */}
          <motion.div
            className="relative w-44 h-44 md:w-56 md:h-56 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.04 60 / 80%), oklch(0.18 0.05 90 / 90%))",
              border: "1px solid oklch(0.50 0.10 90 / 20%)",
              boxShadow:
                "0 0 80px oklch(0.70 0.10 90 / 10%), inset 0 0 40px oklch(0.15 0.03 60 / 50%)",
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-7xl md:text-8xl select-none" role="img" aria-label="cat">
              🐈
            </span>
          </motion.div>

          {/* Orbiting dot accents */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: "oklch(0.75 0.12 90 / 40%)",
                top: "50%",
                left: "50%",
              }}
              animate={{
                rotate: [i * 120, i * 120 + 360],
                x: [0, 90 + i * 10, 0],
                y: [0, 0, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>

        {/* Moments grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-16">
          {MOMENTS.map((m, i) => (
            <motion.div
              key={i}
              className="group relative rounded-2xl p-4 text-center overflow-hidden cursor-default"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3, scale: 1.03 }}
              style={{
                background: "oklch(0.18 0.03 90 / 50%)",
                border: "1px solid oklch(0.35 0.06 90 / 20%)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Warm glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, oklch(0.70 0.10 90 / 15%), transparent 70%)",
                }}
              />

              <span className="text-2xl mb-2 block relative z-10 select-none">{m.emoji}</span>
              <h3 className="serif italic text-xs text-foreground/90 mb-1 relative z-10 leading-snug">
                {m.label}
              </h3>
              <p className="text-[10px] text-muted-foreground/45 serif italic relative z-10 leading-snug">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="serif italic text-sm text-muted-foreground/30 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          Our little family. Already so full of love.
        </motion.p>
      </div>
    </div>
  );
}
