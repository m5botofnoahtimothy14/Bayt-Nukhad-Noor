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
              className="group relative rounded-full px-14 py-5 text-lg proposal-heading tracking-wider transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: "oklch(0.98 0.03 85)",
                background:
                  "linear-gradient(135deg, oklch(0.55 0.18 150 / 55%), oklch(0.48 0.18 25 / 50%))",
                border: "1.5px solid oklch(0.65 0.16 150 / 60%)",
                boxShadow:
                  "0 0 30px oklch(0.55 0.18 150 / 30%), 0 0 60px oklch(0.48 0.18 25 / 18%), inset 0 1px 0 oklch(1 0 0 / 15%)",
              }}
              whileHover={{
                boxShadow:
                  "0 0 50px oklch(0.55 0.18 150 / 45%), 0 0 100px oklch(0.48 0.18 25 / 30%), inset 0 1px 0 oklch(1 0 0 / 20%)",
                scale: 1.04,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mr-2">&#10084;</span>
              Yes... Always.
            </motion.button>

            {/* More time button */}
            <motion.button
              onClick={() => onChoice(false)}
              className="group rounded-full px-11 py-3.5 text-sm proposal-text tracking-wider transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: "oklch(0.45 0.06 30 / 85%)",
                background: "oklch(0.90 0.02 75 / 40%)",
                border: "1px solid oklch(0.60 0.05 60 / 30%)",
              }}
              whileHover={{
                color: "oklch(0.35 0.08 25 / 95%)",
                backgroundColor: "oklch(0.88 0.03 75 / 60%)",
                borderColor: "oklch(0.55 0.06 60 / 45%)",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="mr-2">&#129293;</span>
              I need a little more time.
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
