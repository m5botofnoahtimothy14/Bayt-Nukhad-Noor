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

function HandwrittenText({
  text,
  speed = 30,
  onComplete,
  onProgress,
  className = "",
  style,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
  onProgress?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [visibleLength, setVisibleLength] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const chars = useRef([...text]);

  useEffect(() => {
    setVisibleLength(0);
    let idx = 0;
    const tick = () => {
      idx++;
      setVisibleLength(idx);
      onProgress?.();
      if (idx >= chars.current.length) {
        onComplete?.();
        return;
      }
      const ch = chars.current[idx];
      // Newlines render instantly, blank lines get a short pause
      const delay = ch === "\n" ? 15 : speed;
      timerRef.current = setTimeout(tick, delay);
    };
    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, [text, speed, onComplete, onProgress]);

  const visibleText = chars.current.slice(0, visibleLength).join("");
  const lines = visibleText.split("\n");

  return (
    <div className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
      {visibleLength < chars.current.length && (
        <span
          className="inline-block w-[2px] h-[1em] ml-1 align-middle"
          style={{
            backgroundColor: "oklch(0.3 0.08 30)",
            animation: "blink-cursor 0.8s step-end infinite",
          }}
        />
      )}
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

  // Auto-scroll the parchment as new text appears
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Parchment */}
          <motion.div
            className="relative z-10 pointer-events-auto"
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
              className="relative mx-auto overflow-y-auto rounded-sm"
              style={{
                width: "min(640px, 92vw)",
                maxHeight: "85vh",
                padding: "clamp(2.5rem, 6vw, 4.5rem)",
                background:
                  "linear-gradient(135deg, oklch(0.93 0.03 80), oklch(0.89 0.04 75) 30%, oklch(0.91 0.03 82) 70%, oklch(0.87 0.04 78))",
                boxShadow:
                  "0 0 80px oklch(0.4 0.08 60 / 30%), inset 0 0 60px oklch(0.5 0.06 60 / 10%)",
                border: "1px solid oklch(0.75 0.04 70 / 40%)",
              }}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-15 rounded-sm"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Aged edge effect */}
              <div
                className="absolute inset-0 pointer-events-none rounded-sm"
                style={{
                  boxShadow:
                    "inset 0 0 40px oklch(0.6 0.06 60 / 20%), inset 0 0 100px oklch(0.7 0.04 60 / 8%)",
                }}
              />

              {/* Decorative header flourish */}
              <div className="text-center mb-4 opacity-30" style={{ color: "oklch(0.5 0.08 60)" }}>
                ✦ ✦ ✦
              </div>

              {/* Calligraphic "Khadija..." heading */}
              {(isWriting || isFinal) && (
                <div className="text-center mb-6">
                  <span
                    className="proposal-heading"
                    style={{
                      fontSize: "clamp(1.8rem, 5vw, 3rem)",
                      color: "oklch(0.3 0.1 25)",
                    }}
                  >
                    Khadija...
                  </span>
                </div>
              )}

              {/* Body text */}
              {(isWriting || isFinal) && (
                <HandwrittenText
                  text={bodyText}
                  speed={18}
                  onComplete={onWritingComplete}
                  onProgress={autoScroll}
                  className="proposal-text leading-[2.2] text-center whitespace-pre-line"
                  style={{
                    color: "oklch(0.28 0.08 30)",
                    fontSize: "clamp(0.95rem, 2.8vw, 1.2rem)",
                    lineHeight: "2.2",
                  }}
                />
              )}

              {/* Final question */}
              {isFinal && (
                <div className="mt-8">
                  <div className="text-center mb-4 opacity-25" style={{ color: "oklch(0.5 0.08 60)" }}>
                    — ✦ —
                  </div>
                  <HandwrittenText
                    text={questionText}
                    speed={40}
                    onComplete={onFinalComplete}
                    onProgress={autoScroll}
                    className="proposal-text leading-[2.4] text-center whitespace-pre-line"
                    style={{
                      color: "oklch(0.22 0.1 25)",
                      fontSize: "clamp(1rem, 3vw, 1.35rem)",
                      lineHeight: "2.4",
                      fontWeight: 500,
                    }}
                  />
                </div>
              )}

              {/* Decorative footer flourish */}
              {(isWriting || isFinal) && (
                <div className="text-center mt-8 opacity-20" style={{ color: "oklch(0.5 0.08 60)" }}>
                  ❦
                </div>
              )}

              {/* Decorative corners */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 opacity-25" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 opacity-25" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 opacity-25" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 opacity-25" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
