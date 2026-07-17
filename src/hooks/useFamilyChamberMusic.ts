import { useEffect, useRef, useCallback } from "react";
import {
  playSong,
  stopAll,
  getActiveAudio,
} from "@/lib/audioEngine";
import {
  SONGS,
  SCENE_MUSIC,
  type SceneMusicProfile,
} from "@/lib/musicCatalog";
import type { FamilyChamber } from "@/components/family/FamilyWorld";

const CHAMBER_TO_SCENE: Record<FamilyChamber, string> = {
  atrium: "family-atrium",
  dreams: "family-dreams",
  "little-family": "family-little-family",
  "bucket-list": "family-bucket-list",
  "memory-booth": "family-memory-booth",
  "hidden-surprise": "family-hidden-surprise",
  "reserved-home": "family-reserved-home",
  observatory: "family-observatory",
};

/**
 * useFamilyChamberMusic — plays per-chamber music for the family chapter.
 * Crossfades between songs in the chamber's profile.
 * Handles chamber navigation with smooth cinematic transitions.
 */
export function useFamilyChamberMusic(chamber: FamilyChamber) {
  const songIndex = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastChamber = useRef(chamber);
  const startedRef = useRef(false);

  const playNextSong = useCallback(
    (profile: SceneMusicProfile) => {
      const songKey = profile.songs[songIndex.current % profile.songs.length];
      const src = SONGS[songKey];

      playSong(src, {
        fadeInMs: profile.crossfadeMs,
        volume: profile.volume,
        loop: false,
      });

      if (intervalRef.current) clearTimeout(intervalRef.current);

      const checkDuration = () => {
        const audio = getActiveAudio();
        if (!audio || !audio.duration || isNaN(audio.duration)) {
          intervalRef.current = setTimeout(checkDuration, 1000);
          return;
        }

        const switchAt = Math.max(audio.duration - 4, 1) * 1000;
        intervalRef.current = setTimeout(() => {
          songIndex.current++;
          playNextSong(profile);
        }, switchAt);
      };

      intervalRef.current = setTimeout(checkDuration, 500);
    },
    [],
  );

  // On chamber change: fade out old, fade in new
  useEffect(() => {
    if (chamber === lastChamber.current && startedRef.current) return;
    lastChamber.current = chamber;

    const sceneKey = CHAMBER_TO_SCENE[chamber];
    const profile = SCENE_MUSIC[sceneKey];
    if (!profile) {
      stopAll(2000);
      startedRef.current = false;
      return;
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }

    songIndex.current = 0;

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
  }, [chamber, playNextSong]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);
}
