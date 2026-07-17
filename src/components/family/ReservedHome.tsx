import { motion } from "framer-motion";

type Props = { onBack: () => void };

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 1.5 + Math.random() * 2.5,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 6,
  opacity: 0.12 + Math.random() * 0.18,
}));

const curtainKeyframes = `
@keyframes curtainSway {
  0%, 100% { transform: skewX(0deg) translateX(0); }
  25% { transform: skewX(1.5deg) translateX(1px); }
  50% { transform: skewX(-1deg) translateX(-0.5px); }
  75% { transform: skewX(0.8deg) translateX(0.5px); }
}
@keyframes dustFloat {
  0% { transform: translateY(0) translateX(0); opacity: var(--dust-opacity); }
  25% { transform: translateY(-30vh) translateX(8px); opacity: calc(var(--dust-opacity) * 0.8); }
  50% { transform: translateY(-60vh) translateX(-5px); opacity: calc(var(--dust-opacity) * 0.5); }
  75% { transform: translateY(-80vh) translateX(3px); opacity: calc(var(--dust-opacity) * 0.2); }
  100% { transform: translateY(-100vh) translateX(0); opacity: 0; }
}
@keyframes warmPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.75; }
}
@keyframes underDoorGlow {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.7; }
}
`;

export default function ReservedHome({ onBack }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "oklch(0.18 0.02 50)" }}
    >
      <style>{curtainKeyframes}</style>

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.30 0.06 60 / 0.15) 0%, transparent 55%)",
        }}
      />

      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="serif absolute left-6 top-6 z-20 cursor-pointer text-sm tracking-widest uppercase sm:left-10 sm:top-10"
        style={{ color: "oklch(0.65 0.06 70)" }}
      >
        ← Return
      </motion.button>

      {/* Dust particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: "oklch(0.75 0.08 65)",
            opacity: p.opacity,
            ["--dust-opacity" as string]: p.opacity,
            animation: `dustFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Door assembly */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        {/* Ambient warmth behind door */}
        <div
          className="pointer-events-none absolute -inset-12 sm:-inset-16"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.45 0.10 60 / 0.18) 0%, oklch(0.35 0.06 55 / 0.08) 40%, transparent 70%)",
            animation: "warmPulse 6s ease-in-out infinite",
          }}
        />

        {/* Door frame */}
        <div
          className="relative rounded-sm p-3 sm:p-4"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.28 0.04 55) 0%, oklch(0.24 0.03 50) 100%)",
            boxShadow:
              "0 0 60px oklch(0.30 0.05 55 / 0.2), inset 0 0 30px oklch(0.15 0.02 45 / 0.4)",
          }}
        >
          {/* Inner frame bevel */}
          <div
            className="relative rounded-sm p-1.5 sm:p-2"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.32 0.04 50) 0%, oklch(0.26 0.03 48) 100%)",
            }}
          >
            {/* Door surface */}
            <div
              className="relative w-48 overflow-hidden rounded-sm sm:w-56"
              style={{
                height: "22rem",
                background: `
                  repeating-linear-gradient(
                    0deg,
                    oklch(0.32 0.05 55 / 0.6),
                    oklch(0.34 0.04 50 / 0.3) 3px,
                    oklch(0.30 0.04 52 / 0.5) 6px
                  ),
                  linear-gradient(
                    180deg,
                    oklch(0.35 0.06 55) 0%,
                    oklch(0.30 0.05 50) 40%,
                    oklch(0.28 0.04 48) 100%
                  )
                `,
                boxShadow:
                  "inset 0 2px 20px oklch(0.22 0.03 45 / 0.5), inset 0 -2px 15px oklch(0.18 0.02 40 / 0.3)",
              }}
            >
              {/* Wood grain highlights */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background: `
                    linear-gradient(90deg,
                      transparent 0%,
                      oklch(0.42 0.06 60 / 0.15) 20%,
                      transparent 22%,
                      oklch(0.40 0.05 58 / 0.1) 60%,
                      transparent 62%
                    )
                  `,
                }}
              />

              {/* Door window */}
              <div className="absolute left-1/2 top-10 -translate-x-1/2">
                <div
                  className="relative overflow-hidden rounded-t-lg"
                  style={{
                    width: "5.5rem",
                    height: "5rem",
                    boxShadow:
                      "0 0 20px oklch(0.55 0.10 65 / 0.3), inset 0 0 15px oklch(0.50 0.08 60 / 0.2)",
                  }}
                >
                  {/* Window glow */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 50%, oklch(0.65 0.12 65 / 0.9) 0%, oklch(0.55 0.10 60 / 0.7) 50%, oklch(0.40 0.08 55 / 0.4) 100%)",
                      animation: "warmPulse 5s ease-in-out infinite",
                    }}
                  />

                  {/* Window cross bars */}
                  <div
                    className="absolute left-1/2 top-0 h-full -translate-x-1/2"
                    style={{
                      width: "2px",
                      backgroundColor: "oklch(0.28 0.03 50 / 0.8)",
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-0 w-full -translate-y-1/2"
                    style={{
                      height: "2px",
                      backgroundColor: "oklch(0.28 0.03 50 / 0.8)",
                    }}
                  />

                  {/* Left curtain */}
                  <div
                    className="absolute top-0 left-0 h-full"
                    style={{
                      width: "1.6rem",
                      background:
                        "linear-gradient(90deg, oklch(0.45 0.08 15 / 0.7), oklch(0.50 0.09 20 / 0.3) 60%, transparent)",
                      transformOrigin: "top left",
                      animation: "curtainSway 6s ease-in-out infinite",
                    }}
                  />

                  {/* Right curtain */}
                  <div
                    className="absolute top-0 right-0 h-full"
                    style={{
                      width: "1.6rem",
                      background:
                        "linear-gradient(270deg, oklch(0.45 0.08 15 / 0.7), oklch(0.50 0.09 20 / 0.3) 60%, transparent)",
                      transformOrigin: "top right",
                      animation: "curtainSway 7s ease-in-out infinite reverse",
                    }}
                  />
                </div>
              </div>

              {/* Door handle */}
              <div
                className="absolute right-5 top-1/2 -translate-y-1/2"
                style={{
                  width: "8px",
                  height: "14px",
                  borderRadius: "3px",
                  background:
                    "linear-gradient(180deg, oklch(0.55 0.10 60), oklch(0.45 0.08 55))",
                  boxShadow:
                    "0 1px 4px oklch(0.20 0.02 40 / 0.5), inset 0 1px 2px oklch(0.65 0.08 65 / 0.3)",
                }}
              />

              {/* Bottom light seeping under door */}
              <div
                className="absolute bottom-0 left-0 w-full"
                style={{
                  height: "1.8rem",
                  background:
                    "linear-gradient(0deg, oklch(0.50 0.10 60 / 0.4) 0%, oklch(0.45 0.08 55 / 0.15) 40%, transparent 100%)",
                  animation: "underDoorGlow 4s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Handwritten note */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="serif relative z-10 mt-12 max-w-md px-6 text-center sm:mt-16"
      >
        <h2
          className="proposal-heading mb-6 text-3xl font-normal sm:text-4xl"
          style={{ color: "oklch(0.82 0.07 65)" }}
        >
          Our Home
        </h2>

        <div className="space-y-4 text-sm italic leading-relaxed sm:text-base" style={{ color: "oklch(0.72 0.05 60)" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            This door isn't closed.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            It's waiting.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
          >
            One day...<br />
            we'll unlock it together.
          </motion.p>

          <motion.p
            className="mt-6 text-xs tracking-wider sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 1.0 }}
            style={{ color: "oklch(0.62 0.04 55)" }}
          >
            Until then,<br />
            this home quietly waits for us.
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
}
