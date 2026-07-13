import { motion, AnimatePresence } from "framer-motion";

type ProposalChoiceProps = {
  visible: boolean;
  onChoice: (accepted: boolean) => void;
};

export function ProposalChoice({ visible, onChoice }: ProposalChoiceProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center pb-[12vh] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <div className="flex flex-col items-center gap-5 pointer-events-auto">
            {/* Yes button */}
            <motion.button
              onClick={() => onChoice(true)}
              className="group relative rounded-full px-12 py-4 text-sm serif italic tracking-wider transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: "oklch(0.97 0.02 90)",
                background:
                  "linear-gradient(135deg, oklch(0.52 0.16 150 / 40%), oklch(0.42 0.17 25 / 35%))",
                border: "1px solid oklch(0.62 0.15 150 / 50%)",
                boxShadow:
                  "0 0 40px oklch(0.52 0.16 150 / 25%), 0 0 80px oklch(0.42 0.17 25 / 15%)",
              }}
              whileHover={{
                boxShadow:
                  "0 0 60px oklch(0.52 0.16 150 / 40%), 0 0 120px oklch(0.42 0.17 25 / 25%)",
                scale: 1.03,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">❤️</span>
              Yes... Always.
            </motion.button>

            {/* More time button */}
            <motion.button
              onClick={() => onChoice(false)}
              className="group rounded-full px-10 py-3 text-xs serif italic tracking-wider transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: "oklch(0.80 0.03 90 / 60%)",
                background: "transparent",
                border: "1px solid oklch(0.50 0.04 90 / 20%)",
              }}
              whileHover={{
                color: "oklch(0.85 0.04 90 / 80%)",
                borderColor: "oklch(0.55 0.05 90 / 35%)",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">🤍</span>
              I need a little more time.
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
