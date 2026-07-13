import { useState } from "react";
import type { MemoryStrip } from "./useMemoryStrips";

type Props = {
  strip: MemoryStrip | null;
  onClose: () => void;
};

const HIDDEN_NOTES = [
  "I don't think you knew this... but this was one of my favorite days.",
  "I wish I could've hugged you after this picture.",
  "This is the moment I knew forever was real.",
  "You looked so beautiful here. I should've said it louder.",
  "If I could live in one photo, it would be this one.",
  "This smile cured something in me.",
];

export function MemoryViewer({ strip, onClose }: Props) {
  const [showNote, setShowNote] = useState(false);

  if (!strip) return null;

  const hiddenNote = HIDDEN_NOTES[parseInt(strip.id.slice(0, 8), 16) % HIDDEN_NOTES.length];

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: "backdrop-enter 0.4s ease-out both" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

      <div
        className="relative z-10 flex flex-col md:flex-row items-center gap-8 max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modal-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}
      >
        {/* Strip image */}
        <div className="relative flex-shrink-0">
          <div
            className="rounded-xl overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #f5f0e8, #e8e0d4)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            {strip.image_url && (
              <img
                src={strip.image_url}
                alt=""
                className="w-64 h-48 object-cover"
                style={{ filter: "sepia(0.05) contrast(1.02)" }}
              />
            )}
          </div>

          {/* Hidden note toggle */}
          <button
            onClick={() => setShowNote(!showNote)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors serif italic"
          >
            {showNote ? "hide note" : "peek behind..."}
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary/50 serif">Memory #{strip.memory_number}</p>
          {strip.quote && (
            <p className="mt-2 serif italic text-lg text-foreground/90 leading-relaxed">"{strip.quote}"</p>
          )}
          <div className="mt-4 space-y-1">
            <p className="text-[10px] text-muted-foreground">
              {new Date(strip.taken_at).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              {new Date(strip.taken_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          {showNote && (
            <div
              className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10"
              style={{ animation: "fade-up 0.4s ease-out both" }}
            >
              <p className="serif italic text-xs text-amber-200/60">{hiddenNote}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 rounded-full px-5 py-2 text-sm transition-all hover:bg-white/10"
            style={{ background: "oklch(0.72 0.14 15 / 15%)" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
