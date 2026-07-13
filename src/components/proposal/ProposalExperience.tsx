import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProposalSequence } from "@/hooks/useProposalSequence";
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
    cameraShake,
    brightness,
    handleScrollClick,
    handleProposalComplete,
    handleFinalQuestionComplete,
    handleChoice,
  } = useProposalSequence(onEnterHouse);

  const audio = useProposalAudio();

  // Music cues — cinematic music progression with proper crossfades
  useEffect(() => {
    if (phase === "darkness") {
      audio.playAmbience(); // My Love Mine All Mine — dreamy, carries through
    }
    if (phase === "candle-walk") {
      audio.playPiano(); // Clair de Lune — elegant piano for the walk
    }
    if (phase === "room-awakens") {
      audio.playStrings(); // Canon in D — orchestral swell
    }
    if (phase === "scroll-opening" || phase === "scroll-idle" || phase === "proposal-text") {
      audio.playReading(); // My Love Mine All Mine — back to dreamy for the letter
    }
    if (phase === "final-question" || phase === "choice") {
      audio.playEmotional(); // Jo Tum Mere Ho — emotional build before climax
    }
    if (phase === "yes-path" || phase === "welcome-text") {
      audio.playClimax(); // Kesariya — romantic Bollywood climax
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
      ? 0.5
      : phase === "time-path"
        ? 0.35
        : brightness;

  // 3D scroll opening + sparkles
  const scrollOpening = phase === "scroll-opening";
  const sparklesActive = phase === "stage-reveal" || phase === "scroll-idle" ||
    phase === "scroll-opening" || phase === "proposal-text" ||
    phase === "final-question" || phase === "choice" ||
    phase === "yes-path" || phase === "welcome-text";

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
        cameraShake={cameraShake}
        brightness={finalBrightness}
        scrollOpening={scrollOpening}
        sparklesActive={sparklesActive}
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
