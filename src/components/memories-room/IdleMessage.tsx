import { useEffect, useState } from "react";

const IDLE_MESSAGES = [
  "Some moments deserve forever.",
  "Love leaves fingerprints on every room.",
  "Welcome home.",
  "The house remembers every smile.",
  "Thank you for adding another page to our story.",
  "Every memory makes this home warmer.",
  "The walls are smiling.",
  "Time passes. Love stays.",
  "This room grows with you.",
  "Forever starts in small moments.",
  "The fairy lights are dancing tonight.",
  "Even the dust particles are dancing.",
  "The candles are happy you're here.",
  "The house has been waiting for you.",
];

export function IdleMessage({ idleMs = 30000 }: { idleMs?: number }) {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let fadeTimer: ReturnType<typeof setTimeout>;

    const reset = () => {
      setMsg(null);
      clearTimeout(timer);
      clearTimeout(fadeTimer);
      timer = setTimeout(() => {
        setMsg(IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)]);
        fadeTimer = setTimeout(() => setMsg(null), 6000);
      }, idleMs);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
  }, [idleMs]);

  if (!msg) return null;

  return (
    <div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      style={{ animation: "fade-up 1s ease-out both" }}
    >
      <div className="rounded-2xl border border-amber-500/10 bg-black/30 px-6 py-3 backdrop-blur-md shadow-lg">
        <p className="serif italic text-sm text-amber-200/40 text-center">{msg}</p>
      </div>
    </div>
  );
}
