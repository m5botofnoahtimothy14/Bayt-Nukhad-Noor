import { useEffect, useRef, useState } from "react";
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
// (the proposal has multiple "Khadija..." — the final question starts at the last one)
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
  className = "",
  style,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [visibleLength, setVisibleLength] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const chars = [...text];

  useEffect(() => {
    setVisibleLength(0);
    let idx = 0;
    const tick = () => {
      idx++;
      setVisibleLength(idx);
      if (idx >= chars.length) {
        onComplete?.();
        return;
      }
      const ch = chars[idx];
      // Newlines render instantly, blank lines get a short pause
      const delay = ch === "\n" ? 20 : speed;
      timerRef.current = setTimeout(tick, delay);
    };
    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  }, [text, speed, onComplete]);

  const visibleText = [...text].slice(0, visibleLength).join("");
  const lines = visibleText.split("\n");

  return (
    <div className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
      {visibleLength < [...text].length && (
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
  const isClosed = phase === "closed";
  const isOpening = phase === "opening";
  const isWriting = phase === "writing";
  const isFinal = phase === "final";

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
              className="relative mx-auto max-h-[80vh] overflow-y-auto rounded-sm"
              style={{
                width: "min(520px, 88vw)",
                padding: "clamp(2rem, 5vw, 3.5rem)",
                background:
                  "linear-gradient(135deg, oklch(0.92 0.03 80), oklch(0.88 0.04 75) 30%, oklch(0.90 0.03 82) 70%, oklch(0.86 0.04 78))",
                boxShadow:
                  "0 0 80px oklch(0.4 0.08 60 / 30%), inset 0 0 60px oklch(0.5 0.06 60 / 10%)",
                border: "1px solid oklch(0.75 0.04 70 / 40%)",
              }}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 rounded-sm"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Aged edge effect */}
              <div
                className="absolute inset-0 pointer-events-none rounded-sm"
                style={{
                  boxShadow:
                    "inset 0 0 30px oklch(0.6 0.06 60 / 20%), inset 0 0 80px oklch(0.7 0.04 60 / 10%)",
                }}
              />

              {/* Body text */}
              {(isWriting || isFinal) && (
                <HandwrittenText
                  text={bodyText}
                  speed={18}
                  onComplete={onWritingComplete}
                  className="serif italic leading-[1.9] text-center whitespace-pre-line"
                  style={{
                    color: "oklch(0.3 0.08 30)",
                    fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)",
                    lineHeight: "1.9",
                  }}
                />
              )}

              {/* Final question */}
              {isFinal && (
                <div className="mt-8">
                  <HandwrittenText
                    text={questionText}
                    speed={40}
                    onComplete={onFinalComplete}
                    className="serif italic leading-[2.2] text-center whitespace-pre-line"
                    style={{
                      color: "oklch(0.25 0.1 25)",
                      fontSize: "clamp(0.95rem, 2.8vw, 1.25rem)",
                      lineHeight: "2.2",
                    }}
                  />
                </div>
              )}

              {/* Decorative corners */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t border-l opacity-30" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
              <div className="absolute top-3 right-3 w-8 h-8 border-t border-r opacity-30" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l opacity-30" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r opacity-30" style={{ borderColor: "oklch(0.5 0.08 60)" }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
