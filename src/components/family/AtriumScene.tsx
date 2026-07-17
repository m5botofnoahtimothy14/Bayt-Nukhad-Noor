import { motion } from "framer-motion";
import type { FamilyChamber } from "./FamilyWorld";

type AtriumProps = {
  onNavigate: (chamber: FamilyChamber) => void;
  onExit: () => void;
};

const CHAMBERS = [
  {
    id: "dreams" as FamilyChamber,
    title: "Our Dreams",
    subtitle: "hopes for tomorrow",
    icon: "&#9734;",
    color: "oklch(0.65 0.12 55)",
    glow: "oklch(0.65 0.12 55 / 20%)",
  },
  {
    id: "little-family" as FamilyChamber,
    title: "Our Little Family",
    subtitle: "the warmth we already have",
    icon: "&#128049;",
    color: "oklch(0.70 0.10 90)",
    glow: "oklch(0.70 0.10 90 / 20%)",
  },
  {
    id: "bucket-list" as FamilyChamber,
    title: "Our Bucket List",
    subtitle: "dreams waiting to happen",
    icon: "&#128214;",
    color: "oklch(0.60 0.14 15)",
    glow: "oklch(0.60 0.14 15 / 20%)",
  },
  {
    id: "memory-booth" as FamilyChamber,
    title: "The Memory Booth",
    subtitle: "moments for forever",
    icon: "&#128247;",
    color: "oklch(0.55 0.12 350)",
    glow: "oklch(0.55 0.12 350 / 20%)",
  },
  {
    id: "hidden-surprise" as FamilyChamber,
    title: "The Hidden Surprise",
    subtitle: "something is waiting...",
    icon: "&#127873;",
    color: "oklch(0.55 0.15 280)",
    glow: "oklch(0.55 0.15 280 / 20%)",
  },
  {
    id: "reserved-home" as FamilyChamber,
    title: "Our Home",
    subtitle: "this door isn't closed",
    icon: "&#127968;",
    color: "oklch(0.50 0.10 150)",
    glow: "oklch(0.50 0.10 150 / 20%)",
  },
  {
    id: "observatory" as FamilyChamber,
    title: "The Observatory",
    subtitle: "a place to simply be",
    icon: "&#128301;",
    color: "oklch(0.55 0.08 260)",
    glow: "oklch(0.55 0.08 260 / 20%)",
  },
];

export function AtriumScene({ onNavigate }: AtriumProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-20 overflow-y-auto">
      {/* Skylight sunbeam effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, oklch(0.85 0.10 55 / 6%) 0%, transparent 60%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* Title */}
      <motion.div
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/40 serif mb-3">
          if God wills...
        </p>
        <h1
          className="serif text-5xl md:text-6xl italic text-foreground"
          style={{
            textShadow: "0 0 60px oklch(0.72 0.14 15 / 15%)",
          }}
        >
          The Family
        </h1>
        <p className="serif italic text-sm text-muted-foreground/60 mt-4 max-w-md mx-auto leading-relaxed">
          One day... this is where our future lives.
          <br />
          <span className="text-[11px] text-muted-foreground/40">walk toward a room to enter</span>
        </p>
      </motion.div>

      {/* Chamber cards — organic layout */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Decorative connecting lines (neurons) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
          viewBox="0 0 800 500"
        >
          <line x1="400" y1="40" x2="150" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="400" y1="40" x2="400" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="400" y1="40" x2="650" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="150" y1="200" x2="250" y2="380" stroke="currentColor" strokeWidth="0.5" />
          <line x1="400" y1="200" x2="400" y2="380" stroke="currentColor" strokeWidth="0.5" />
          <line x1="650" y1="200" x2="550" y2="380" stroke="currentColor" strokeWidth="0.5" />
          <line x1="150" y1="200" x2="650" y2="200" stroke="currentColor" strokeWidth="0.3" />
          <line x1="250" y1="380" x2="550" y2="380" stroke="currentColor" strokeWidth="0.3" />
        </svg>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHAMBERS.map((ch, i) => (
            <motion.button
              key={ch.id}
              onClick={() => onNavigate(ch.id)}
              className="group relative text-left rounded-2xl p-6 transition-all duration-500 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  background: `radial-gradient(circle at 50% 50%, ${ch.glow}, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <span
                className="text-3xl mb-3 block transition-transform duration-500 group-hover:scale-110"
                dangerouslySetInnerHTML={{ __html: ch.icon }}
              />

              {/* Text */}
              <h3 className="serif text-lg italic text-foreground mb-1 relative z-10">
                {ch.title}
              </h3>
              <p className="text-xs text-muted-foreground/50 serif italic relative z-10">
                {ch.subtitle}
              </p>

              {/* Enter hint */}
              <div className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-60 transition-opacity duration-300 relative z-10"
                style={{ color: ch.color }}
              >
                <span>enter</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom decorative note */}
      <motion.p
        className="serif italic text-[11px] text-muted-foreground/25 mt-16 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        "One day, Insha'Allah... every room will be full of laughter."
      </motion.p>
    </div>
  );
}
