import { useCallback, useEffect, useRef, useState } from "react";

const TRACK_URLS = [
  "https://cdn.pixabay.com/audio/2024/11/28/audio_3a3b8b8b8b.mp3",
  "https://cdn.pixabay.com/audio/2024/10/15/audio_7b8c9d0e1f.mp3",
  "https://cdn.pixabay.com/audio/2024/09/22/audio_f6a5b7c8d9.mp3",
  "https://cdn.pixabay.com/audio/2024/08/12/audio_e1f2a3b4c5.mp3",
  "https://cdn.pixabay.com/audio/2024/07/03/audio_d9e8f7a6b5.mp3",
  "https://cdn.pixabay.com/audio/2024/06/14/audio_c5d4e3f2a1.mp3",
];

export function useVinylAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(
    (idx: number) => {
      const url = TRACK_URLS[idx % TRACK_URLS.length];
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.volume = 0.3;
        audioRef.current.loop = true;
      }
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
      setTrackIdx(idx);
    },
    [],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
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
