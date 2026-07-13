import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ParchmentOverlayProps = {
  visible: boolean;
  phase: "opening" | "writing" | "final" | "closed";
  onWritingComplete: () => void;
  onFinalComplete: () => void;
};

let proposalText = "";

try {
  proposalText = await import("@/proposal/noah-to-khadija.md?raw").then(
    (m) => m.default,
  );
} catch {
  proposalText = "Your proposal text goes here.";
}

// Split into body and final question at the LAST "Khadija..." occurrence
const lastIdx = proposalText.lastIndexOf("Khadija...");
const bodyText = lastIdx >= 0 ? proposalText.slice(0, lastIdx) : proposalText;
const questionText =
  lastIdx >= 0
    ? proposalText.slice(lastIdx)
    : "Khadija...\n\nWill u accept me...\n\nAs ur man.\n\nAs ur best friend.\n\nForever yours,\n\nNoah.";

function splitIntoWords(text: string): string[] {
  // Preserve paragraph breaks as special markers
  const paragraphs = text.split(/\n{2,}/);
  const result: string[] = [];
  paragraphs.forEach((para, pIdx) => {
    const words = para.trim().split(/\s+/).filter((w) => w.length > 0);
    result.push(...words);
    if (pIdx < paragraphs.length - 1) {
      result.push("\n"); // paragraph break marker
    }
  });
  return result;
}

/* ── Word-by-word typewriter ── */
function WordReveal({
  words,
  wordDelay = 45,
  onComplete,
  onProgress,
  className = "",
  style,
}: {
  words: string[];
  wordDelay?: number;
  onComplete?: () => void;
  onProgress?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);
  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

  useEffect(() => {
    setVisibleCount(0);
    let idx = 0;

    const showNext = () => {
      idx++;
      setVisibleCount(idx);
      onProgressRef.current?.();

      if (idx >= words.length) {
        timerRef.current = setTimeout(() => {
          onCompleteRef.current?.();
        }, 800);
        return;
      }

      // Pause longer on paragraph breaks
      const isBreak = words[idx] === "\n";
      timerRef.current = setTimeout(showNext, isBreak ? wordDelay * 8 : wordDelay);
    };

    timerRef.current = setTimeout(showNext, 600);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [words, wordDelay]);

  // Group words back into paragraphs for rendering
  const paragraphs: string[][] = [[]];
  for (let i = 0; i < Math.min(visibleCount, words.length); i++) {
    if (words[i] === "\n") {
      paragraphs.push([]);
    } else {
      paragraphs[paragraphs.length - 1].push(words[i]);
    }
  }

  return (
    <div className={className} style={style}>
      {paragraphs.map((paraWords, pIdx) => {
        if (paraWords.length === 0 && pIdx === paragraphs.length - 1) return null;
        return (
          <p key={pIdx} style={{ marginBottom: "1.2em", textIndent: "1.5em" }}>
            {paraWords.map((word, wIdx) => (
              <span
                key={`${pIdx}-${wIdx}`}
                className="inline-block"
                style={{
                  animation: "wordFadeIn 0.4s ease-out forwards",
                  opacity: 0,
                  animationDelay: `${wIdx * 15}ms`,
                }}
              >
                {word}{" "}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function ParchmentOverlay({
  visible,
  phase,
  onWritingComplete,
  onFinalComplete,
}: ParchmentOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isClosed = phase === "closed";
  const isOpening = phase === "opening";
  const isWriting = phase === "writing";
  const isFinal = phase === "final";

  const bodyWords = useRef(splitIntoWords(bodyText)).current;
  const questionWords = useRef(splitIntoWords(questionText)).current;

  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  return (
    <>
      {/* Keyframe for word fade-in */}
      <style>{`
        @keyframes wordFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AnimatePresence>
        {visible && !isClosed && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Dark backdrop */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

            {/* Letter / Parchment */}
            <motion.div
              className="relative z-10 pointer-events-auto"
              initial={{ scaleY: 0, opacity: 0, rotateX: 10 }}
              animate={{
                scaleY: isOpening ? 1 : isWriting || isFinal ? 1 : 0,
                opacity: isOpening || isWriting || isFinal ? 1 : 0,
                rotateX: 0,
              }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "center center", perspective: 800 }}
            >
              <div
                ref={scrollRef}
                className="relative mx-auto overflow-y-auto"
                style={{
                  width: "min(600px, 90vw)",
                  maxHeight: "82vh",
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
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

                {/* ── Body — justified word-by-word ── */}
                {(isWriting || isFinal) && (
                  <WordReveal
                    words={bodyWords}
                    wordDelay={40}
                    onComplete={onWritingComplete}
                    onProgress={autoScroll}
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
                  />
                )}

                {/* ── Divider before final question ── */}
                {isFinal && (
                  <motion.div
                    className="my-8 text-center"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  >
                    <div
                      className="mx-auto"
                      style={{
                        width: "40%",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, oklch(0.5 0.08 60 / 0.35), transparent)",
                      }}
                    />
                  </motion.div>
                )}

                {/* ── Final question — justified word-by-word ── */}
                {isFinal && (
                  <WordReveal
                    words={questionWords}
                    wordDelay={55}
                    onComplete={onFinalComplete}
                    onProgress={autoScroll}
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
                  />
                )}

                {/* ── Signature ── */}
                {isFinal && (
                  <motion.div
                    className="mt-10 text-right pr-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  >
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
                  </motion.div>
                )}

                {/* ── Wax seal ── */}
                {isFinal && (
                  <motion.div
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, delay: 2, ease: [0.22, 1, 0.36, 1] }}
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

                {/* ── Decorative corner flourishes ── */}
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
    </>
  );
}
