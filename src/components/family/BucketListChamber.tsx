import { motion } from "framer-motion";

type Props = { onBack: () => void };

const dreams = [
  "Watch the sunrise together",
  "Travel to Japan",
  "Visit Makkah and Madinah",
  "Build our first home",
  "Adopt another cat",
  "Plant a tree together",
  "Watch meteor showers",
  "Travel without planning",
  "Grow old together",
];

const rotations = [-2.1, 1.4, -0.8, 2.7, -1.9, 0.5, -2.6, 1.8, -0.3];

const decorativeTapes = ["border-l-amber-200/60", "border-l-orange-200/50", "border-l-yellow-200/55"];
const cornerStyles = ["top-2 left-2", "top-2 right-2", "bottom-2 right-2"];
const stampDeco = ["✦", "❋", "✧", "♡", "⟡", "✦", "❋", "✧", "♡"];

export default function BucketListChamber({ onBack }: Props) {
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
          className="mb-16 text-center"
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
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dreams.map((dream, i) => (
            <motion.div
              key={dream}
              initial={{ opacity: 0, rotate: rotations[i] + 4, y: 40 }}
              animate={{ opacity: 1, rotate: rotations[i], y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.5 + i * 0.12,
                ease: "easeOut",
              }}
              className="group relative cursor-default"
              style={{ transformOrigin: "center center" }}
            >
              <div
                className="serif relative rounded-sm px-6 py-8 shadow-lg transition-shadow duration-500 group-hover:shadow-xl"
                style={{
                  backgroundColor: "oklch(0.88 0.03 75)",
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 28px,
                    oklch(0.8 0.02 70 / 0.15) 28px,
                    oklch(0.8 0.02 70 / 0.15) 29px
                  ), repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 28px,
                    oklch(0.8 0.02 70 / 0.08) 28px,
                    oklch(0.8 0.02 70 / 0.08) 29px
                  )`,
                  boxShadow: "0 2px 12px oklch(0.15 0.02 50 / 0.3), inset 0 0 30px oklch(0.85 0.02 80 / 0.3)",
                }}
              >
                <div
                  className={`absolute ${cornerStyles[i % 3]} h-6 w-10 border-l-2 border-t-2`}
                  style={{
                    borderColor: "oklch(0.75 0.06 85 / 0.5)",
                    background: "linear-gradient(135deg, oklch(0.92 0.02 80 / 0.4), transparent)",
                  }}
                />

                <div
                  className="absolute top-3 right-4 text-xs"
                  style={{ color: "oklch(0.65 0.08 60 / 0.4)" }}
                >
                  {stampDeco[i]}
                </div>

                <div
                  className="absolute top-0 left-6 h-2 w-12 -translate-y-1 rounded-sm"
                  style={{
                    background: `linear-gradient(180deg, oklch(0.82 0.04 80 / 0.7), oklch(0.78 0.04 80 / 0.5))`,
                    borderLeft: `1px solid oklch(0.7 0.03 80 / 0.3)`,
                  }}
                />

                <p
                  className="serif relative text-center text-base italic leading-relaxed tracking-wide sm:text-lg"
                  style={{ color: "oklch(0.32 0.03 50)" }}
                >
                  {dream}
                </p>

                <div
                  className="absolute bottom-0 right-4 h-8 w-0.5 -translate-y-2"
                  style={{ backgroundColor: "oklch(0.7 0.04 60 / 0.2)" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.2 }}
          className="serif mt-16 text-center text-sm tracking-[0.2em] sm:text-base"
          style={{ color: "oklch(0.55 0.05 65)" }}
        >
          Every item is a prayer. Every page is a hope.
        </motion.p>
      </div>
    </motion.section>
  );
}
