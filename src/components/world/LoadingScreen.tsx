import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 400);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.15 0.05 350) 0%, oklch(0.08 0.03 350) 100%)",
        opacity: progress >= 100 ? 0 : 1,
        pointerEvents: progress >= 100 ? "none" : "auto",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-[20%] left-[30%] w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.14 15 / 10%), transparent 60%)",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />

      {/* Title */}
      <p className="text-[10px] uppercase tracking-[0.5em] text-primary/50 serif mb-3">
        Bayt Nukhad Noor
      </p>
      <h1 className="serif text-3xl italic text-foreground mb-8">
        Lighting the lanterns...
      </h1>

      {/* Progress bar */}
      <div className="w-48 h-0.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: "linear-gradient(90deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
          }}
        />
      </div>

      {/* Firefly particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${(i * 8.3) % 100}%`,
            top: `${(i * 6.7) % 100}%`,
            background: i % 2 === 0 ? "oklch(0.8 0.12 55 / 50%)" : "oklch(0.75 0.10 15 / 40%)",
            animation: `dust-float ${6 + ((i * 1.7) % 8)}s ease-in-out ${(i * 0.8) % 6}s infinite`,
            "--dx": `${-15 + ((i * 5) % 30)}px`,
            "--dy": `${-30 - ((i * 4) % 50)}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
