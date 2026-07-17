import { motion } from "framer-motion";

type Props = {
  onBack: () => void;
};

const DREAMS = [
  {
    icon: "&#127968;",
    title: "Our future home",
    description: "A little house with a garden door and warm lights",
    color: "oklch(0.65 0.12 55)",
    glow: "oklch(0.65 0.12 55 / 15%)",
  },
  {
    icon: "&#9992;",
    title: "Travelling together",
    description: "New cities, old streets, our footsteps side by side",
    color: "oklch(0.60 0.10 200)",
    glow: "oklch(0.60 0.10 200 / 15%)",
  },
  {
    icon: "&#127859;",
    title: "Cooking together",
    description: "Flour on your nose, laughter in the kitchen",
    color: "oklch(0.70 0.10 90)",
    glow: "oklch(0.70 0.10 90 / 15%)",
  },
  {
    icon: "&#127749;",
    title: "Watching sunsets",
    description: "Two silhouettes, one horizon",
    color: "oklch(0.60 0.14 15)",
    glow: "oklch(0.60 0.14 15 / 15%)",
  },
  {
    icon: "&#128143;",
    title: "Growing old together",
    description: "Wrinkled hands, still holding tight",
    color: "oklch(0.55 0.12 350)",
    glow: "oklch(0.55 0.12 350 / 15%)",
  },
  {
    icon: "&#128367;",
    title: "Quiet evenings",
    description: "Just us, a blanket, and silence that speaks",
    color: "oklch(0.50 0.08 260)",
    glow: "oklch(0.50 0.08 260 / 15%)",
  },
  {
    icon: "&#127876;",
    title: "Building traditions",
    description: "Our own holidays, our own recipes, our own way",
    color: "oklch(0.55 0.15 150)",
    glow: "oklch(0.55 0.15 150 / 15%)",
  },
];

export function DreamsChamber({ onBack }: Props) {
  return (
    <div className="h-full flex flex-col items-center px-6 py-20 overflow-y-auto">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, oklch(0.70 0.10 55 / 5%) 0%, transparent 60%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* Title */}
      <motion.div
        className="text-center mb-14 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="proposal-text text-[10px] uppercase tracking-[0.5em] mb-4"
          style={{ color: "oklch(0.65 0.12 55 / 40%)" }}
        >
          If God wills... one day...
        </p>
        <h1
          className="serif text-5xl md:text-6xl italic text-foreground"
          style={{
            textShadow: "0 0 60px oklch(0.72 0.14 55 / 12%)",
          }}
        >
          Our Dreams
        </h1>
        <p className="serif italic text-sm text-muted-foreground/50 mt-4 max-w-sm mx-auto leading-relaxed">
          Not plans. Not promises. Just quiet hopes we carry together.
        </p>
      </motion.div>

      {/* Dream cards */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DREAMS.map((dream, i) => (
            <motion.article
              key={dream.title}
              className="group relative rounded-2xl p-6 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{
                background: "oklch(0.18 0.03 265 / 60%)",
                border: "1px solid oklch(0.30 0.04 265 / 30%)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${dream.glow}, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <span
                className="text-3xl mb-3 block transition-transform duration-500 group-hover:scale-110"
                dangerouslySetInnerHTML={{ __html: dream.icon }}
              />

              {/* Title */}
              <h3
                className="serif italic text-lg mb-1 relative z-10"
                style={{ color: dream.color }}
              >
                {dream.title}
              </h3>

              {/* Description */}
              <p className="proposal-text text-xs text-muted-foreground/50 relative z-10 leading-relaxed">
                {dream.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <motion.p
        className="serif italic text-[11px] text-muted-foreground/25 mt-16 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        These aren't promises. They're prayers.
      </motion.p>
    </div>
  );
}
