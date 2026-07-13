import { useEffect, useRef } from "react";
import { playSong, stopAll } from "@/lib/audioEngine";
import { SONGS, OPENING_MUSIC } from "@/lib/musicCatalog";

/**
 * useOpeningMusic — plays sacred music during the Bayt Nukhad Noor intro.
 * Fades in slowly with the meaning reveal, continues into proposal.
 */
export function useOpeningMusic(active: boolean) {
  const started = useRef(false);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      if (!started.current) {
        started.current = true;
        playSong(SONGS[OPENING_MUSIC.songs[0]], {
          fadeInMs: 6000, // Very slow, sacred fade-in
          volume: OPENING_MUSIC.volume,
          loop: true,
        });
      }
    }, OPENING_MUSIC.entryDelayMs);

    return () => clearTimeout(timer);
  }, [active]);

  // Fade out when leaving opening
  useEffect(() => {
    return () => {
      if (started.current) {
        stopAll(3000);
        started.current = false;
      }
    };
  }, []);
}
