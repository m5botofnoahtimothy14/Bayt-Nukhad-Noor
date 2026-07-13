import { useCallback, useRef } from "react";

type AudioChannel = "ambience" | "piano" | "strings" | "footsteps" | "candles";

type AudioHandle = {
  play: () => void;
  pause: () => void;
  setVolume: (v: number) => void;
  fadeIn: (duration: number) => void;
  fadeOut: (duration: number) => void;
};

function createSilentHandle(): AudioHandle {
  return {
    play: () => {},
    pause: () => {},
    setVolume: () => {},
    fadeIn: () => {},
    fadeOut: () => {},
  };
}

export function useProposalAudio() {
  const channels = useRef<Record<AudioChannel, AudioHandle>>({
    ambience: createSilentHandle(),
    piano: createSilentHandle(),
    strings: createSilentHandle(),
    footsteps: createSilentHandle(),
    candles: createSilentHandle(),
  });

  const playAmbience = useCallback(() => {
    channels.current.ambience.play();
  }, []);

  const playPiano = useCallback(() => {
    channels.current.piano.fadeIn(2);
  }, []);

  const playStrings = useCallback(() => {
    channels.current.strings.fadeIn(3);
  }, []);

  const playFootsteps = useCallback(() => {
    channels.current.footsteps.play();
  }, []);

  const playCandleCrackle = useCallback(() => {
    channels.current.candles.play();
  }, []);

  const fadeAll = useCallback((duration: number) => {
    Object.values(channels.current).forEach((ch) => ch.fadeOut(duration));
  }, []);

  const setMasterVolume = useCallback((v: number) => {
    Object.values(channels.current).forEach((ch) => ch.setVolume(v));
  }, []);

  return {
    playAmbience,
    playPiano,
    playStrings,
    playFootsteps,
    playCandleCrackle,
    fadeAll,
    setMasterVolume,
  };
}
