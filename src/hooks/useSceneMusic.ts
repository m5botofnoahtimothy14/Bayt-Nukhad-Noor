import { useEffect, useRef, useCallback } from "react";
import {
  playSong,
  stopAll,
  setMasterVolume,
  getActiveAudio,
} from "@/lib/audioEngine";
import {
  SONGS,
  SCENE_MUSIC,
  type SceneMusicProfile,
  type SongKey,
} from "@/lib/musicCatalog";

/**
 * useSceneMusic — plays music for the current scene.
 * Crossfades between 2 songs in the profile.
 * Handles scene changes with cinematic fade transitions.
 */
export function useSceneMusic(location: string) {
  const songIndex = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLocation = useRef(location);
  const startedRef = useRef(false);

  const playNextSong = useCallback(
    (profile: SceneMusicProfile) => {
      const songKey = profile.songs[songIndex.current % profile.songs.length];
      const src = SONGS[songKey];

      playSong(src, {
        fadeInMs: profile.crossfadeMs,
        volume: profile.volume,
        loop: false, // We handle looping manually for crossfade
      });

      // Schedule next song to play after current ends (with overlap for crossfade)
      if (intervalRef.current) clearTimeout(intervalRef.current);

      // Get audio duration from the engine, then schedule next
      const checkDuration = () => {
        const audio = getActiveAudio();
        if (!audio || !audio.duration || isNaN(audio.duration)) {
          intervalRef.current = setTimeout(checkDuration, 1000);
          return;
        }

        // Switch songs 4 seconds before end for smooth crossfade
        const switchAt = Math.max(audio.duration - 4, 1) * 1000;
        intervalRef.current = setTimeout(() => {
          songIndex.current++;
          playNextSong(profile);
        }, switchAt);
      };

      // Small delay to let audio load metadata
      intervalRef.current = setTimeout(checkDuration, 500);
    },
    [],
  );

  // On location change: fade out old, fade in new
  useEffect(() => {
    if (location === lastLocation.current && startedRef.current) return;
    lastLocation.current = location;

    const profile = SCENE_MUSIC[location];
    if (!profile) {
      // No music for this location — fade out
      stopAll(2000);
      startedRef.current = false;
      return;
    }

    // Clear any pending song switches
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset song index
    songIndex.current = 0;

    // Cinematic delay before starting new scene music
    const delayTimer = setTimeout(() => {
      startedRef.current = true;
      playNextSong(profile);
    }, profile.entryDelayMs);

    return () => {
      clearTimeout(delayTimer);
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [location, playNextSong]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);
}

/**
 * useSceneMusicControl — manual controls for scene music
 * (for pause/play/volume adjustments from UI)
 */
export function useSceneMusicControl() {
  const pause = useCallback(() => stopAll(1000), []);
  const resume = useCallback(() => {
    const audio = getActiveAudio();
    if (audio) {
      audio.play().catch(() => {});
    }
  }, []);
  const setVolume = useCallback((v: number) => setMasterVolume(v, 500), []);

  return { pause, resume, setVolume };
}
