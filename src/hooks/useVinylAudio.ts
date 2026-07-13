import { useCallback, useRef, useState } from "react";
import { VINYL_TRACKS, SONGS } from "@/lib/musicCatalog";
import { playSong, stopAll } from "@/lib/audioEngine";

export function useVinylAudio() {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const currentSrcRef = useRef("");

  const play = useCallback((idx: number) => {
    const track = VINYL_TRACKS[idx % VINYL_TRACKS.length];
    const src = SONGS[track.key];
    currentSrcRef.current = src;

    playSong(src, {
      fadeInMs: 1500,
      volume: 0.3,
      loop: true,
    });
    setPlaying(true);
    setTrackIdx(idx);
  }, []);

  const pause = useCallback(() => {
    stopAll(800);
    setPlaying(false);
  }, []);

  const toggle = useCallback(
    (idx: number) => {
      if (playing && trackIdx === idx) {
        pause();
      } else {
        play(idx);
      }
    },
    [playing, trackIdx, pause, play],
  );

  const nextTrack = useCallback(
    (total: number) => {
      const next = (trackIdx + 1) % total;
      play(next);
    },
    [trackIdx, play],
  );

  return { playing, trackIdx, play, pause, toggle, nextTrack };
}
