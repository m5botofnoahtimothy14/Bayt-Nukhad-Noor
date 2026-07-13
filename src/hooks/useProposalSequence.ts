import { useCallback, useEffect, useRef, useState } from "react";

export type ProposalPhase =
  | "darkness"
  | "first-candle"
  | "candle-walk"
  | "room-awakens"
  | "stage-reveal"
  | "scroll-idle"
  | "scroll-opening"
  | "proposal-text"
  | "final-question"
  | "choice"
  | "yes-path"
  | "time-path"
  | "welcome-text"
  | "enter-house";

type SequenceState = {
  phase: ProposalPhase;
  walkProgress: number;
  candlesLit: number;
  spotlightOn: boolean;
  particlesActive: boolean;
  blossomsActive: boolean;
  heartsActive: boolean;
  cameraShake: number;
  brightness: number;
};

const PHASE_DURATIONS: Record<ProposalPhase, number> = {
  darkness: 3000,
  "first-candle": 3000,
  "candle-walk": 9000,
  "room-awakens": 4000,
  "stage-reveal": 3000,
  "scroll-idle": 0, // waits for click
  "scroll-opening": 2000,
  "proposal-text": 0, // waits for text animation
  "final-question": 0, // waits for text animation
  choice: 0, // waits for user
  "yes-path": 5000,
  "time-path": 5000,
  "welcome-text": 5000,
  "enter-house": 2000,
};

const PHASE_ORDER: ProposalPhase[] = [
  "darkness",
  "first-candle",
  "candle-walk",
  "room-awakens",
  "stage-reveal",
  "scroll-idle",
  "scroll-opening",
  "proposal-text",
  "final-question",
  "choice",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}

export function useProposalSequence(onEnterHouse: () => void) {
  const [state, setState] = useState<SequenceState>({
    phase: "darkness",
    walkProgress: 0,
    candlesLit: 0,
    spotlightOn: false,
    particlesActive: false,
    blossomsActive: false,
    heartsActive: false,
    cameraShake: 0,
    brightness: 0,
  });

  const phaseIndex = useRef(0);
  const walkAnimRef = useRef<number | null>(null);
  const candleAnimRef = useRef<number | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const advancePhase = useCallback(() => {
    phaseIndex.current += 1;
    if (phaseIndex.current >= PHASE_ORDER.length) return;
    const nextPhase = PHASE_ORDER[phaseIndex.current];
    const duration = PHASE_DURATIONS[nextPhase];

    setState((s) => ({ ...s, phase: nextPhase }));

    // Animate walk progress during candle-walk
    if (nextPhase === "candle-walk") {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / PHASE_DURATIONS["candle-walk"], 1);
        setState((s) => ({
          ...s,
          walkProgress: lerp(0, 0.7, progress),
          candlesLit: Math.floor(progress * 24),
          cameraShake: 0.3 + progress * 0.3,
          brightness: progress * 0.08,
        }));
        if (progress < 1) {
          walkAnimRef.current = requestAnimationFrame(animate);
        } else {
          // Auto-advance after walk
          const t = setTimeout(advancePhase, 500);
          timeoutsRef.current.push(t);
        }
      };
      walkAnimRef.current = requestAnimationFrame(animate);
    }

    // Room awakens — race candles forward, spotlight, particles
    if (nextPhase === "room-awakens") {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / PHASE_DURATIONS["room-awakens"], 1);
        setState((s) => ({
          ...s,
          walkProgress: lerp(0.7, 1, progress),
          candlesLit: 24,
          spotlightOn: progress > 0.3,
          particlesActive: progress > 0.4,
          blossomsActive: progress > 0.5,
          brightness: lerp(0.08, 0.25, progress),
        }));
        if (progress < 1) {
          walkAnimRef.current = requestAnimationFrame(animate);
        } else {
          const t = setTimeout(advancePhase, 500);
          timeoutsRef.current.push(t);
        }
      };
      walkAnimRef.current = requestAnimationFrame(animate);
    }

    // Stage reveal — hearts appear
    if (nextPhase === "stage-reveal") {
      setState((s) => ({
        ...s,
        heartsActive: true,
        brightness: 0.3,
        cameraShake: 0.15,
      }));
      const t = setTimeout(advancePhase, PHASE_DURATIONS["stage-reveal"]);
      timeoutsRef.current.push(t);
    }

    // Auto-advance through timed phases
    if (duration > 0 && !["candle-walk", "room-awakens", "stage-reveal"].includes(nextPhase)) {
      const t = setTimeout(advancePhase, duration);
      timeoutsRef.current.push(t);
    }
  }, []);

  const handleScrollClick = useCallback(() => {
    if (state.phase === "scroll-idle") {
      setState((s) => ({ ...s, phase: "scroll-opening" }));
      const t1 = setTimeout(() => {
        setState((s) => ({ ...s, phase: "proposal-text" }));
      }, 2000);
      timeoutsRef.current.push(t1);
    }
  }, [state.phase]);

  const handleProposalComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: "final-question" }));
  }, []);

  const handleFinalQuestionComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: "choice" }));
  }, []);

  const handleChoice = useCallback(
    (accepted: boolean) => {
      clearTimeouts();
      if (walkAnimRef.current) cancelAnimationFrame(walkAnimRef.current);
      if (candleAnimRef.current) cancelAnimationFrame(candleAnimRef.current);

      if (accepted) {
        setState((s) => ({
          ...s,
          phase: "yes-path",
          brightness: 0.45,
          heartsActive: true,
          blossomsActive: true,
          particlesActive: true,
        }));
        const t1 = setTimeout(() => {
          setState((s) => ({ ...s, phase: "welcome-text" }));
        }, 3000);
        const t2 = setTimeout(() => {
          setState((s) => ({ ...s, phase: "enter-house" }));
        }, 8000);
        const t3 = setTimeout(() => {
          onEnterHouse();
        }, 10000);
        timeoutsRef.current.push(t1, t2, t3);
      } else {
        setState((s) => ({ ...s, phase: "time-path" }));
        const t1 = setTimeout(() => {
          setState((s) => ({ ...s, phase: "welcome-text" }));
        }, 4000);
        const t2 = setTimeout(() => {
          setState((s) => ({ ...s, phase: "enter-house" }));
        }, 9000);
        const t3 = setTimeout(() => {
          onEnterHouse();
        }, 11000);
        timeoutsRef.current.push(t1, t2, t3);
      }
    },
    [onEnterHouse, clearTimeouts],
  );

  // Start the sequence
  useEffect(() => {
    const t = setTimeout(advancePhase, 500);
    timeoutsRef.current.push(t);
    return () => {
      clearTimeouts();
      if (walkAnimRef.current) cancelAnimationFrame(walkAnimRef.current);
      if (candleAnimRef.current) cancelAnimationFrame(candleAnimRef.current);
    };
  }, [advancePhase, clearTimeouts]);

  return {
    ...state,
    handleScrollClick,
    handleProposalComplete,
    handleFinalQuestionComplete,
    handleChoice,
  };
}
