import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProposalSequence, type ProposalPhase } from "@/hooks/useProposalSequence";
import { useProposalAudio } from "@/hooks/useProposalAudio";
import { ProposalScene } from "./ProposalScene";
import { ParchmentOverlay } from "./ParchmentOverlay";
import { ProposalChoice } from "./ProposalChoice";

type ProposalExperienceProps = {
  onEnterHouse: () => void;
};

function WelcomeOverlay({ text, visible }: { text: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <motion.p
            className="proposal-heading text-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
              color: "oklch(0.92 0.04 60 / 90%)",
              textShadow: "0 0 40px oklch(0.7 0.12 60 / 30%)",
              letterSpacing: "0.02em",
            }}
          >
            {text}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TimePathNote({ visible }: { visible: boolean }) {
  const noteText = `That's okay, my love.

Love should never be rushed.

I'll keep building this little home for us,
one memory at a time.

Whenever your heart is ready...
I'll still be here.

Now...

Come inside.

Welcome home.`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <div
            className="max-w-md mx-auto px-8 py-6 rounded-lg"
            style={{
              background: "oklch(0.92 0.03 80 / 85%)",
              boxShadow: "0 0 60px oklch(0.4 0.08 60 / 20%)",
            }}
          >
            <p
              className="proposal-text leading-[2.2] text-center whitespace-pre-line"
              style={{
                color: "oklch(0.3 0.08 30)",
                fontSize: "clamp(0.9rem, 2.4vw, 1.1rem)",
              }}
            >
              {noteText}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProposalExperience({ onEnterHouse }: ProposalExperienceProps) {
  const {
    phase,
    walkProgress,
    candlesLit,
    spotlightOn,
    particlesActive,
    blossomsActive,
    heartsActive,
    cameraShake,
    brightness,
    handleScrollClick,
    handleProposalComplete,
    handleFinalQuestionComplete,
    handleChoice,
  } = useProposalSequence(onEnterHouse);

  const audio = useProposalAudio();

  // Audio cues
  useEffect(() => {
    if (phase === "darkness") {
      audio.playAmbience();
    }
    if (phase === "first-candle") {
      audio.playCandleCrackle();
    }
    if (phase === "candle-walk") {
      audio.playPiano();
      audio.playFootsteps();
    }
    if (phase === "room-awakens") {
      audio.playStrings();
    }
  }, [phase, audio]);

  // Determine parchment state
  const parchmentVisible = ["opening", "writing", "final", "closed"].includes(
    phase,
  ) || phase === "scroll-opening" || phase === "proposal-text" || phase === "final-question";

  const parchmentPhase: "opening" | "writing" | "final" | "closed" =
    phase === "scroll-opening"
      ? "opening"
      : phase === "proposal-text"
        ? "writing"
        : phase === "final-question"
          ? "final"
          : phase === "choice" || phase === "yes-path" || phase === "time-path" || phase === "welcome-text" || phase === "enter-house"
            ? "closed"
            : "opening";

  const choiceVisible = phase === "choice";
  const welcomeVisible = phase === "welcome-text" || phase === "enter-house";
  const timePathVisible = phase === "time-path";
  const welcomeText =
    phase === "yes-path" || phase === "welcome-text" || phase === "enter-house"
      ? "Welcome home, Mrs. Khadija Noah."
      : "";

  // Scene brightness ramp during yes-path
  const finalBrightness =
    phase === "yes-path"
      ? 0.9
      : phase === "time-path"
        ? 0.7
        : brightness;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      {/* 3D scene */}
      <ProposalScene
        walkProgress={walkProgress}
        candlesLit={candlesLit}
        spotlightOn={spotlightOn}
        particlesActive={particlesActive}
        blossomsActive={blossomsActive}
        heartsActive={heartsActive}
        cameraShake={cameraShake}
        brightness={finalBrightness}
        onScrollClick={handleScrollClick}
      />

      {/* Scroll click hint */}
      {phase === "scroll-idle" && (
        <motion.div
          className="fixed bottom-[18vh] left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <p
            className="proposal-heading text-base text-center"
            style={{ color: "oklch(0.85 0.04 60 / 60%)" }}
          >
            click the scroll
          </p>
        </motion.div>
      )}

      {/* Parchment */}
      <ParchmentOverlay
        visible={parchmentVisible}
        phase={parchmentPhase}
        onWritingComplete={handleProposalComplete}
        onFinalComplete={handleFinalQuestionComplete}
      />

      {/* Choice buttons */}
      <ProposalChoice visible={choiceVisible} onChoice={handleChoice} />

      {/* Time path note */}
      <TimePathNote visible={timePathVisible} />

      {/* Welcome text */}
      <WelcomeOverlay text={welcomeText} visible={welcomeVisible} />
    </motion.div>
  );
}
