import { useEffect, useRef } from "react";
import { playSong, stopAll } from "@/lib/audioEngine";
import { SONGS, OPENING_MUSIC } from "@/lib/musicCatalog";

/**
 * useOpeningMusic — plays sacred music during the Bayt Nukhad Noor intro.
 * Goodness Of God first, then crossfades into Canon in D.
 */
export function useOpeningMusic(active: boolean) {
  const started = useRef(false);
  const crossfadeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      if (!started.current) {
        started.current = true;
        // First song — Goodness Of God (sacred entrance)
        playSong(SONGS[OPENING_MUSIC.songs[0]], {
          fadeInMs: 6000,
          volume: OPENING_MUSIC.volume,
          loop: false,
        });

        // Crossfade to Canon in D after ~22s (let Goodness Of God breathe)
        crossfadeTimer.current = setTimeout(() => {
          playSong(SONGS[OPENING_MUSIC.songs[1]], {
            fadeInMs: OPENING_MUSIC.crossfadeMs,
            volume: OPENING_MUSIC.volume,
            loop: true,
          });
        }, 22000);
      }
    }, OPENING_MUSIC.entryDelayMs);

    return () => {
      clearTimeout(timer);
      if (crossfadeTimer.current) clearTimeout(crossfadeTimer.current);
    };
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
