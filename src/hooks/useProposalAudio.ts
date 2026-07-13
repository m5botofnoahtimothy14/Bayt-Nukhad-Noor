import { useCallback } from "react";
import {
  playSong,
  stopAll,
  setMasterVolume as setEngineVolume,
  getCurrentAudio,
} from "@/lib/audioEngine";
import { SONGS, PROPOSAL_MUSIC } from "@/lib/musicCatalog";

type AudioChannel = "ambience" | "piano" | "strings" | "footsteps" | "candles";

export function useProposalAudio() {
  const playAmbience = useCallback(() => {
    // Dreamy background — "My Love Mine All Mine"
    playSong(SONGS[PROPOSAL_MUSIC.ambience], {
      fadeInMs: 4000,
      volume: PROPOSAL_MUSIC.volume,
      loop: true,
    });
  }, []);

  const playPiano = useCallback(() => {
    // Elegant piano — "Clair de Lune"
    playSong(SONGS[PROPOSAL_MUSIC.piano], {
      fadeInMs: 3000,
      volume: PROPOSAL_MUSIC.volume * 0.9,
      loop: true,
    });
  }, []);

  const playStrings = useCallback(() => {
    // Strings / orchestral layer — Canon in D (cello & piano)
    playSong(SONGS[PROPOSAL_MUSIC.strings], {
      fadeInMs: 5000,
      volume: PROPOSAL_MUSIC.volume * 1.1,
      loop: true,
    });
  }, []);

  const playFootsteps = useCallback(() => {
    // No separate footsteps — they're part of the cinematic
  }, []);

  const playCandleCrackle = useCallback(() => {
    // No separate candle sound — ambient music covers it
  }, []);

  const playClimax = useCallback(() => {
    // Climax song — "Kesariya" — the romantic Bollywood moment
    playSong(SONGS[PROPOSAL_MUSIC.climax], {
      fadeInMs: 3000,
      volume: PROPOSAL_MUSIC.volume * 1.2,
      loop: true,
    });
  }, []);

  const fadeAll = useCallback((duration: number) => {
    stopAll(duration);
  }, []);

  const setVolume = useCallback((v: number) => {
    setEngineVolume(v);
  }, []);

  return {
    playAmbience,
    playPiano,
    playStrings,
    playFootsteps,
    playCandleCrackle,
    playClimax,
    fadeAll,
    setMasterVolume: setVolume,
  };
}
