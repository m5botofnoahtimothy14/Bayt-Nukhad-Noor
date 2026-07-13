/* ═══════════════════════════════════════════════════════
   AudioEngine — crossfade audio system for The Enchanted Nest
   Two-element ping-pong: when one plays, the other fades out.
   ═══════════════════════════════════════════════════════ */

type AudioEngineState = {
  currentIdx: number;
  playing: boolean;
  volume: number;
};

let globalVolume = 0.35;
let elemA: HTMLAudioElement | null = null;
let elemB: HTMLAudioElement | null = null;
let active: "a" | "b" = "a";
let fadeTimers: ReturnType<typeof setTimeout>[] = [];
let currentSrc = "";
let onStateChange: (() => void) | null = null;
let state: AudioEngineState = { currentIdx: -1, playing: false, volume: 0.35 };

function getActive(): HTMLAudioElement {
  if (!elemA) {
    elemA = new Audio();
    elemA.preload = "auto";
    elemA.crossOrigin = "anonymous";
  }
  if (!elemB) {
    elemB = new Audio();
    elemB.preload = "auto";
    elemB.crossOrigin = "anonymous";
  }
  return active === "a" ? elemA : elemB;
}

function getInactive(): HTMLAudioElement {
  if (!elemA) {
    elemA = new Audio();
    elemA.preload = "auto";
    elemA.crossOrigin = "anonymous";
  }
  if (!elemB) {
    elemB = new Audio();
    elemB.preload = "auto";
    elemB.crossOrigin = "anonymous";
  }
  return active === "a" ? elemB : elemA;
}

function clearFadeTimers() {
  fadeTimers.forEach(clearTimeout);
  fadeTimers = [];
}

/** Smoothly ramp volume over `durationMs` using stepped intervals */
function rampVolume(
  el: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
  onDone?: () => void,
) {
  const steps = Math.max(Math.ceil(durationMs / 50), 2);
  const stepTime = durationMs / steps;
  let step = 0;

  const tick = () => {
    step++;
    const progress = step / steps;
    // Ease-in-out curve for cinematic feel
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    el.volume = from + (to - from) * eased;

    if (step < steps) {
      const timer = setTimeout(tick, stepTime);
      fadeTimers.push(timer);
    } else {
      el.volume = to;
      onDone?.();
    }
  };
  tick();
}

/** Play a song with optional cinematic fade-in */
export function playSong(
  src: string,
  opts: {
    fadeInMs?: number;
    volume?: number;
    loop?: boolean;
    startTime?: number;
  } = {},
) {
  const { fadeInMs = 2000, volume = globalVolume, loop = true, startTime = 0 } = opts;

  if (src === currentSrc && getActive().paused === false) return;

  clearFadeTimers();
  currentSrc = src;

  // Fade out the old track
  const old = getActive();
  const fresh = getInactive();

  // Crossfade: ramp old out while ramping new in
  const oldStartVol = old.volume;

  // Load and start new track
  fresh.src = src;
  fresh.currentTime = startTime;
  fresh.loop = loop;
  fresh.volume = 0;

  fresh.play().catch(() => {});

  // Crossfade
  rampVolume(fresh, 0, volume, fadeInMs);
  rampVolume(old, oldStartVol, 0, fadeInMs, () => {
    old.pause();
    old.currentTime = 0;
  });

  // Swap active
  active = active === "a" ? "b" : "a";

  state = { ...state, currentIdx: -1, playing: true, volume };
  onStateChange?.();
}

/** Stop all audio with fade-out */
export function stopAll(fadeOutMs = 1500) {
  clearFadeTimers();
  currentSrc = "";

  const a = elemA;
  const b = elemB;

  if (a && !a.paused) {
    rampVolume(a, a.volume, 0, fadeOutMs, () => a.pause());
  }
  if (b && !b.paused) {
    rampVolume(b, b.volume, 0, fadeOutMs, () => b.pause());
  }

  state = { ...state, playing: false };
  onStateChange?.();
}

/** Set master volume (ramps smoothly) */
export function setMasterVolume(v: number, durationMs = 500) {
  globalVolume = v;
  const current = getActive();
  if (!current.paused) {
    rampVolume(current, current.volume, v, durationMs);
  }
  state = { ...state, volume: v };
  onStateChange?.();
}

/** Get current state */
export function getAudioState() {
  return state;
}

/** Subscribe to state changes */
export function onAudioStateChange(cb: () => void) {
  onStateChange = cb;
  return () => { onStateChange = null; };
}

/** Check if currently playing */
export function isPlaying() {
  const a = elemA;
  const b = elemB;
  return (a && !a.paused) || (b && !b.paused);
}

/** Get the currently active audio element */
export function getCurrentAudio(): HTMLAudioElement | null {
  const el = getActive();
  return el.src ? el : null;
}

/** Get the currently playing audio element (for duration queries etc.) */
export function getActiveAudio(): HTMLAudioElement | null {
  if (!elemA && !elemB) return null;
  const el = active === "a" ? elemA : elemB;
  if (el && !el.paused) return el;
  // If active isn't playing, check the other
  const other = active === "a" ? elemB : elemA;
  if (other && !other.paused) return other;
  return null;
}

/** Destroy everything */
export function destroy() {
  clearFadeTimers();
  elemA?.pause();
  elemB?.pause();
  elemA = null;
  elemB = null;
  currentSrc = "";
  state = { currentIdx: -1, playing: false, volume: 0.35 };
}
