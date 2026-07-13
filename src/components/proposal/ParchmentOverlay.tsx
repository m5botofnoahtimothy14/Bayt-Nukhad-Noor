import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ParchmentOverlayProps = {
  visible: boolean;
  phase: "opening" | "writing" | "final" | "closed";
  onWritingComplete: () => void;
  onFinalComplete: () => void;
  onChoice: (accepted: boolean) => void;
};

let proposalText = "";

try {
  proposalText = await import("@/proposal/noah-to-khadija.md?raw").then(
    (m) => m.default,
  );
} catch {
  proposalText = "Your proposal text goes here.";
}

const lastIdx = proposalText.lastIndexOf("Khadija...");
const bodyText = lastIdx >= 0 ? proposalText.slice(0, lastIdx) : proposalText;
const questionText =
  lastIdx >= 0
    ? proposalText.slice(lastIdx)
    : "Khadija...\n\nWill u accept me...\n\nAs ur man.\n\nAs ur best friend.\n\nForever yours,\n\nNoah.";

function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
}

export function ParchmentOverlay({
  visible,
  phase,
  onWritingComplete,
  onFinalComplete,
  onChoice,
}: ParchmentOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isClosed = phase === "closed";
  const isOpening = phase === "opening";
  const isWriting = phase === "writing";
  const isFinal = phase === "final";

  const bodyParagraphs = useRef(splitIntoParagraphs(bodyText)).current;
  const questionParagraphs = useRef(splitIntoParagraphs(questionText)).current;

  const onCompleteRef = useRef(onWritingComplete);
  const onFinalRef = useRef(onFinalComplete);
  onCompleteRef.current = onWritingComplete;
  onFinalRef.current = onFinalComplete;

  useEffect(() => {
    if (isWriting) {
      const t = setTimeout(() => onCompleteRef.current?.(), 1200);
      return () => clearTimeout(t);
    }
  }, [isWriting]);

  useEffect(() => {
    if (isFinal) {
      const t = setTimeout(() => onFinalRef.current?.(), 1200);
      return () => clearTimeout(t);
    }
  }, [isFinal]);

  return (
    <AnimatePresence>
      {visible && !isClosed && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

          {/* Letter / Parchment */}
          <motion.div
            className="relative z-10"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: isOpening ? 1 : isWriting || isFinal ? 1 : 0,
              opacity: isOpening || isWriting || isFinal ? 1 : 0,
            }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center center" }}
          >
            <div
              ref={scrollRef}
              className="relative mx-auto overflow-y-auto"
              style={{
                width: "min(600px, 90vw)",
                maxHeight: "88vh",
                padding: "clamp(2rem, 5vw, 3.5rem) clamp(2.5rem, 6vw, 4rem)",
                background:
                  "linear-gradient(170deg, oklch(0.95 0.02 75), oklch(0.91 0.03 78) 40%, oklch(0.93 0.02 80) 70%, oklch(0.90 0.03 76))",
                boxShadow:
                  "0 0 100px oklch(0.35 0.06 60 / 25%), 0 20px 60px oklch(0.2 0.04 60 / 30%), inset 0 0 80px oklch(0.6 0.04 60 / 8%)",
                border: "1px solid oklch(0.78 0.03 70 / 35%)",
                borderRadius: "2px",
              }}
            >
              {/* Paper grain texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Aged edge vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 50px oklch(0.55 0.05 60 / 18%), inset 0 0 120px oklch(0.65 0.04 60 / 6%)",
                }}
              />

              {/* ── Ornate top border ── */}
              <div className="relative mb-6 text-center">
                <div
                  className="mx-auto"
                  style={{
                    width: "60%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, oklch(0.55 0.08 60 / 0.4), transparent)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4"
                  style={{ background: "oklch(0.93 0.02 80)" }}
                >
                  <span style={{ color: "oklch(0.5 0.08 60 / 0.5)", fontSize: "0.75rem", letterSpacing: "0.3em" }}>
                    &#10053; &#10053; &#10053;
                  </span>
                </div>
              </div>

              {/* ── Heading ── */}
              {(isWriting || isFinal) && (
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <span
                    className="proposal-heading"
                    style={{
                      fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
                      color: "oklch(0.25 0.1 25)",
                      display: "block",
                      marginBottom: "0.3em",
                    }}
                  >
                    My Dearest Khadija
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
                      color: "oklch(0.5 0.06 60 / 0.5)",
                      letterSpacing: "0.15em",
                      fontStyle: "italic",
                    }}
                  >
                    with all my heart
                  </span>
                </motion.div>
              )}

              {/* ── Body ── */}
              {(isWriting || isFinal) && (
                <div
                  className="proposal-text"
                  style={{
                    color: "oklch(0.22 0.06 30)",
                    fontSize: "clamp(0.88rem, 2.4vw, 1.05rem)",
                    lineHeight: "2",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                    letterSpacing: "0.01em",
                  }}
                >
                  {bodyParagraphs.map((para, i) => (
                    <p key={i} style={{ marginBottom: "1.2em", textIndent: "1.5em" }}>
                      {para.split("\n").map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < para.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              )}

              {/* ── Divider ── */}
              {isFinal && (
                <div className="my-8 text-center">
                  <div
                    className="mx-auto"
                    style={{
                      width: "40%",
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, oklch(0.5 0.08 60 / 0.35), transparent)",
                    }}
                  />
                </div>
              )}

              {/* ── Final question ── */}
              {isFinal && (
                <div
                  className="proposal-text"
                  style={{
                    color: "oklch(0.18 0.1 25)",
                    fontSize: "clamp(0.92rem, 2.6vw, 1.12rem)",
                    lineHeight: "2.1",
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                  }}
                >
                  {questionParagraphs.map((para, i) => (
                    <p key={i} style={{ marginBottom: "1.2em", textIndent: "1.5em" }}>
                      {para.split("\n").map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < para.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              )}

              {/* ── Signature ── */}
              {isFinal && (
                <div className="mt-10 text-right pr-4">
                  <span
                    className="proposal-heading block"
                    style={{
                      fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                      color: "oklch(0.25 0.1 25)",
                      marginBottom: "0.3em",
                    }}
                  >
                    Forever yours,
                  </span>
                  <span
                    className="proposal-heading"
                    style={{
                      fontSize: "clamp(1.4rem, 4vw, 2rem)",
                      color: "oklch(0.2 0.12 25)",
                    }}
                  >
                    Noah
                  </span>
                </div>
              )}

              {/* ── Wax seal ── */}
              {isFinal && (
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, oklch(0.45 0.15 20), oklch(0.3 0.12 15))",
                      boxShadow: "0 2px 12px oklch(0.2 0.08 20 / 40%), inset 0 1px 3px oklch(0.5 0.1 20 / 30%)",
                    }}
                  >
                    <span style={{ color: "oklch(0.85 0.04 60 / 0.7)", fontSize: "1.1rem" }}>
                      &#10084;
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ── Choice buttons — embedded inside the scroll ── */}
              {isFinal && (
                <motion.div
                  className="flex flex-col items-center gap-4 mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1.5 }}
                >
                  {/* Yes button */}
                  <motion.button
                    onClick={() => onChoice(true)}
                    className="group relative rounded-full px-12 py-4 text-base proposal-heading tracking-wider cursor-pointer transition-all duration-500"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2, ease: [0.22, 1, 0.36, 1] }}
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
                    <span className="mr-2">&#10084;</span>
                    Yes... Always.
                  </motion.button>

                  {/* No button */}
                  <motion.button
                    onClick={() => onChoice(false)}
                    className="group rounded-full px-10 py-3 text-sm proposal-text tracking-wider cursor-pointer transition-all duration-500"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
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
                    <span className="mr-2">&#129293;</span>
                    I need a little more time.
                  </motion.button>
                </motion.div>
              )}

              {/* ── Ornate bottom border ── */}
              {(isWriting || isFinal) && (
                <div className="relative mt-8 text-center">
                  <div
                    className="mx-auto"
                    style={{
                      width: "60%",
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, oklch(0.55 0.08 60 / 0.4), transparent)",
                    }}
                  />
                </div>
              )}

              {/* ── Corner flourishes ── */}
              {[
                { top: "12px", left: "12px", borderTop: true, borderLeft: true },
                { top: "12px", right: "12px", borderTop: true, borderRight: true },
                { bottom: "12px", left: "12px", borderBottom: true, borderLeft: true },
                { bottom: "12px", right: "12px", borderBottom: true, borderRight: true },
              ].map((corner, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    top: corner.top,
                    left: corner.left,
                    right: corner.right,
                    bottom: corner.bottom,
                    width: "28px",
                    height: "28px",
                    borderTop: corner.borderTop ? "1.5px solid oklch(0.5 0.08 60 / 0.3)" : "none",
                    borderBottom: corner.borderBottom ? "1.5px solid oklch(0.5 0.08 60 / 0.3)" : "none",
                    borderLeft: corner.borderLeft ? "1.5px solid oklch(0.5 0.08 60 / 0.3)" : "none",
                    borderRight: corner.borderRight ? "1.5px solid oklch(0.5 0.08 60 / 0.3)" : "none",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
