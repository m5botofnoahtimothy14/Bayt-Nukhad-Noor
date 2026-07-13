import { useState } from "react";
import type { MemoryStrip } from "./useMemoryStrips";

type Props = {
  strips: MemoryStrip[];
  onSelect: (strip: MemoryStrip) => void;
};

export function MemoryWall({ strips, onSelect }: Props) {
  if (strips.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center" style={{ animation: "fade-up 1s ease-out 0.5s both" }}>
          <p className="serif italic text-lg text-amber-200/30">The wall is waiting for us...</p>
          <p className="text-[10px] text-amber-200/20 mt-2 serif">Take a photo to start filling it</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        {strips.map((strip, i) => {
          const rotation = ((i * 37 + 13) % 25) - 12;
          const x = 10 + ((i * 31 + 7) % 80);
          const y = 8 + ((i * 23 + 11) % 75);
          const hasHiddenNote = i % 7 === 3;

          return (
            <div
              key={strip.id}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `rotate(${rotation}deg)`,
                animation: `fade-up 0.5s ease-out ${i * 0.08}s both`,
              }}
              onClick={() => onSelect(strip)}
            >
              {/* Pushpin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-md z-10" />

              {/* Photo strip card */}
              <div
                className="relative w-28 rounded-md overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:z-20"
                style={{
                  background: "linear-gradient(180deg, #f5f0e8, #e8e0d4)",
                  boxShadow: "2px 4px 12px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                {strip.image_url && (
                  <img
                    src={strip.image_url}
                    alt=""
                    className="w-full h-20 object-cover"
                    style={{ filter: "sepia(0.08) contrast(1.03)" }}
                  />
                )}
                <div className="px-1.5 py-1 text-center">
                  <p className="text-[6px] text-amber-900/50 serif">{strip.quote?.slice(0, 30)}{strip.quote && strip.quote.length > 30 ? "..." : ""}</p>
                </div>
              </div>

              {/* Hidden note indicator */}
              {hasHiddenNote && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity" title="This memory hides a note..." />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
