import { useEffect, useState } from "react";

export type TimePhase = "dawn" | "day" | "dusk" | "night";

/** Real-time-of-day derived phase. Compresses a full day into 24h. */
export function useTimeOfDay() {
  const [phase, setPhase] = useState<TimePhase>(() => phaseFor(new Date()));
  useEffect(() => {
    const t = setInterval(() => setPhase(phaseFor(new Date())), 60_000);
    return () => clearInterval(t);
  }, []);
  return phase;
}

function phaseFor(d: Date): TimePhase {
  const h = d.getHours();
  if (h < 6) return "night";
  if (h < 9) return "dawn";
  if (h < 18) return "day";
  if (h < 20) return "dusk";
  return "night";
}

export const SKY: Record<TimePhase, string> = {
  dawn: "linear-gradient(180deg, oklch(0.7 0.09 30) 0%, oklch(0.75 0.11 50) 50%, oklch(0.55 0.08 70) 100%)",
  day: "linear-gradient(180deg, oklch(0.78 0.09 230) 0%, oklch(0.85 0.06 220) 60%, oklch(0.9 0.05 90) 100%)",
  dusk: "linear-gradient(180deg, oklch(0.4 0.08 300) 0%, oklch(0.55 0.15 30) 55%, oklch(0.6 0.18 60) 100%)",
  night:
    "linear-gradient(180deg, oklch(0.15 0.04 260) 0%, oklch(0.2 0.06 270) 60%, oklch(0.3 0.06 260) 100%)",
};
