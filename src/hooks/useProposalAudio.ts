import { useCallback } from "react";
import {
  playSong,
  stopAll,
  setMasterVolume as setEngineVolume,
  getCurrentAudio,
} from "@/lib/audioEngine";
import { SONGS, PROPOSAL_MUSIC } from "@/lib/musicCatalog";

export function useProposalAudio() {
  const playAmbience = useCallback(() => {
    playSong(SONGS[PROPOSAL_MUSIC.ambience], {
      fadeInMs: 4000,
      volume: PROPOSAL_MUSIC.volume,
      loop: true,
    });
  }, []);

  const playPiano = useCallback(() => {
    playSong(SONGS[PROPOSAL_MUSIC.piano], {
      fadeInMs: 5000,
      volume: PROPOSAL_MUSIC.volume * 0.9,
      loop: true,
    });
  }, []);

  const playStrings = useCallback(() => {
    playSong(SONGS[PROPOSAL_MUSIC.strings], {
      fadeInMs: 5000,
      volume: PROPOSAL_MUSIC.volume * 1.1,
      loop: true,
    });
  }, []);

  const playReading = useCallback(() => {
    playSong(SONGS[PROPOSAL_MUSIC.reading], {
      fadeInMs: 4500,
      volume: PROPOSAL_MUSIC.volume * 0.85,
      loop: true,
    });
  }, []);

  const playEmotional = useCallback(() => {
    playSong(SONGS[PROPOSAL_MUSIC.emotional], {
      fadeInMs: 5000,
      volume: PROPOSAL_MUSIC.volume * 1.0,
      loop: true,
    });
  }, []);

  const playClimax = useCallback(() => {
    playSong(SONGS[PROPOSAL_MUSIC.climax], {
      fadeInMs: 4000,
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
    playReading,
    playEmotional,
    playClimax,
    fadeAll,
    setMasterVolume: setVolume,
  };
}
