import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onBack: () => void };

type Track = { title: string; artist: string; duration: string; url: string };

const PLAYLIST: Track[] = [
  { title: "Clair de Lune", artist: "Debussy", duration: "5:02", url: "https://www.youtube.com/watch?v=CvFH_6PNRC8" },
  { title: "The Night We Met", artist: "Lord Huron", duration: "3:28", url: "https://www.youtube.com/watch?v=KJx7qyaipKw" },
  { title: "Bloom", artist: "The Paper Kites", duration: "3:45", url: "https://www.youtube.com/watch?v=apS1vU6pVxc" },
  { title: "Saturn", artist: "Sleeping at Last", duration: "4:03", url: "https://www.youtube.com/watch?v=FqDq4Q8aGcQ" },
  { title: "Holocene", artist: "Bon Iver", duration: "5:36", url: "https://www.youtube.com/watch?v=twQKWoIeY04" },
  { title: "Experience", artist: "Ludovico Einaudi", duration: "5:15", url: "https://www.youtube.com/watch?v=RhVc2EqKfjA" },
  { title: "Nuvole Bianche", artist: "Ludovico Einaudi", duration: "5:57", url: "https://www.youtube.com/watch?v=4VRKZ5YAYWw" },
  { title: "Comptine d'un autre été", artist: "Yann Tiersen", duration: "2:20", url: "https://www.youtube.com/watch?v=H2-1u8xvk54" },
];

const LOVE_MESSAGES = [
  "I LOVE U KHADIJA",
  "You are my peace",
  "Forever yours",
  "Noah + Khadija",
  "My heart is yours",
  "Insha'Allah, always",
  "You are my home",
  "Allahummabarak",
  "My forever person",
  "You complete me",
  "One day, insha'Allah",
  "You are my dunya & akhirah",
];

const STARS = Array.from({ length: 120 }).map((_, i) => ({
  id: i,
  size: 0.8 + (i % 5) * 0.5,
  left: `${(i * 0.83) % 100}%`,
  top: `${(i * 0.67) % 70}%`,
  delay: (i * 0.2) % 10,
  duration: 1.5 + (i % 6) * 0.7,
  brightness: 0.5 + (i % 4) * 0.15,
}));

const HEARTS = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: `${10 + (i * 6.5) % 80}%`,
  delay: (i * 0.3) % 4,
  size: 8 + (i % 4) * 4,
}));

export function ObservatoryChamber({ onBack }: Props) {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [loveMsgIdx, setLoveMsgIdx] = useState(0);
  const [showLoveMsg, setShowLoveMsg] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [shootingStars, setShootingStars] = useState<{ id: number; top: number; left: number; angle: number }[]>([]);
  const shootingIdRef = useRef(0);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Periodic love message
  useEffect(() => {
    const interval = setInterval(() => {
      setLoveMsgIdx((i) => (i + 1) % LOVE_MESSAGES.length);
      setShowLoveMsg(true);
      setTimeout(() => setShowLoveMsg(false), 3500);
    }, 12000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, []);

  // Periodic heart shower
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 4000);
    }, 18000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, []);

  // Shooting stars
  useEffect(() => {
    const spawn = () => {
      const id = shootingIdRef.current++;
      const top = 5 + Math.random() * 35;
      const left = Math.random() * 60;
      const angle = 20 + Math.random() * 15;
      setShootingStars((prev) => [...prev, { id, top, left, angle }]);
      setTimeout(() => setShootingStars((prev) => prev.filter((s) => s.id !== id)), 1500);
    };
    const interval = setInterval(spawn, 4000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = useCallback((trackIndex: number) => {
    if (activeTrack === trackIndex && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveTrack(trackIndex);
      setIsPlaying(true);
      setElapsed(0);
    }
  }, [activeTrack, isPlaying]);

  const nextTrack = useCallback(() => {
    if (activeTrack === null) return;
    setActiveTrack((activeTrack + 1) % PLAYLIST.length);
    setElapsed(0);
  }, [activeTrack]);

  const prevTrack = useCallback(() => {
    if (activeTrack === null) return;
    setActiveTrack((activeTrack - 1 + PLAYLIST.length) % PLAYLIST.length);
    setElapsed(0);
  }, [activeTrack]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="h-full w-full overflow-hidden relative" style={{ background: "oklch(0.04 0.03 260)" }}>
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {STARS.map((s) => (
          <span key={s.id} className="absolute rounded-full"
            style={{ width: s.size, height: s.size, left: s.left, top: s.top,
              background: `oklch(0.95 0.02 260 / ${s.brightness})`,
              boxShadow: `0 0 ${s.size * 2}px oklch(0.90 0.03 260 / ${s.brightness * 0.4})`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      {/* Deep space gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, oklch(0.08 0.04 260 / 40%) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, oklch(0.06 0.03 280 / 20%) 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, oklch(0.06 0.02 300 / 15%) 0%, transparent 35%)" }} />

      {/* Shooting stars */}
      <AnimatePresence>
        {shootingStars.map((ss) => (
          <motion.div key={ss.id} className="absolute pointer-events-none z-10"
            style={{ top: `${ss.top}%`, left: `${ss.left}%`, transform: `rotate(${ss.angle}deg)` }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: [0, 1, 0], x: [0, 200, 350] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}>
            <div className="h-[1px] w-[120px]"
              style={{ background: "linear-gradient(90deg, oklch(0.95 0.02 260 / 95%), oklch(0.90 0.04 80 / 60%), transparent)" }} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Love message popup */}
      <AnimatePresence>
        {showLoveMsg && (
          <motion.div className="absolute top-[12%] left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="px-6 py-3 rounded-full serif italic text-sm md:text-base"
              style={{ background: "oklch(0.15 0.04 350 / 70%)", border: "1px solid oklch(0.50 0.12 350 / 30%)",
                color: "oklch(0.85 0.12 350)", boxShadow: "0 0 40px oklch(0.60 0.15 350 / 20%)",
                backdropFilter: "blur(8px)", textShadow: "0 0 20px oklch(0.70 0.15 350 / 40%)" }}>
              ✦ {LOVE_MESSAGES[loveMsgIdx]} ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart shower */}
      <AnimatePresence>
        {showHearts && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {HEARTS.map((h) => (
              <motion.span key={h.id} className="absolute"
                style={{ left: h.left, fontSize: h.size, top: -20 }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.8, 0.6, 0], y: [0, 300, 500, 700], rotate: [-10, 10, -5, 15] }}
                transition={{ duration: 3.5 + h.delay, delay: h.delay * 0.3, ease: "easeIn" }}>
                💕
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-0 overflow-y-auto">

        {/* Grassy hill with two silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[8]">
          {/* Hill shape */}
          <svg className="w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: "280px" }}>
            <defs>
              <linearGradient id="grass-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.25 0.08 140 / 90%)" />
                <stop offset="40%" stopColor="oklch(0.18 0.06 140 / 95%)" />
                <stop offset="100%" stopColor="oklch(0.12 0.04 140)" />
              </linearGradient>
            </defs>
            {/* Main hill */}
            <path d="M-50 300 Q200 120 400 160 Q550 190 600 150 Q700 100 850 140 Q1000 180 1250 300 Z"
              fill="url(#grass-grad)" />
            {/* Grass tufts */}
            {[100, 200, 320, 450, 550, 680, 780, 900, 1020, 1120].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${155 + Math.sin(i * 1.3) * 25})`}>
                <line x1="0" y1="0" x2="-3" y2="-12" stroke="oklch(0.30 0.08 140 / 50%)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="2" y1="0" x2="4" y2="-14" stroke="oklch(0.28 0.07 140 / 45%)" strokeWidth="1" strokeLinecap="round" />
                <line x1="5" y1="0" x2="3" y2="-10" stroke="oklch(0.32 0.06 140 / 40%)" strokeWidth="0.8" strokeLinecap="round" />
              </g>
            ))}
          </svg>

          {/* Two people silhouettes lying on the hill */}
          <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex items-end gap-1">
            {/* Person 1 - lying back */}
            <svg width="90" height="40" viewBox="0 0 90 40" className="opacity-70">
              {/* Head */}
              <circle cx="15" cy="18" r="8" fill="oklch(0.15 0.02 260)" />
              {/* Body lying */}
              <ellipse cx="45" cy="28" rx="28" ry="8" fill="oklch(0.15 0.02 260)" />
              {/* Legs */}
              <line x1="70" y1="28" x2="85" y2="35" stroke="oklch(0.15 0.02 260)" strokeWidth="5" strokeLinecap="round" />
            </svg>
            {/* Person 2 - lying beside */}
            <svg width="80" height="38" viewBox="0 0 80 38" className="opacity-65">
              {/* Head */}
              <circle cx="65" cy="16" r="7.5" fill="oklch(0.15 0.02 260)" />
              {/* Body */}
              <ellipse cx="35" cy="26" rx="26" ry="7.5" fill="oklch(0.15 0.02 260)" />
              {/* Legs */}
              <line x1="12" y1="26" x2="2" y2="33" stroke="oklch(0.15 0.02 260)" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Fireflies */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span key={i} className="absolute rounded-full"
              style={{ width: 3, height: 3, left: `${15 + i * 14}%`, bottom: `${80 + (i % 3) * 20}px`,
                background: "oklch(0.85 0.12 90 / 80%)", boxShadow: "0 0 8px oklch(0.85 0.12 90 / 50%)" }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -15, -5], x: [0, (i % 2 ? 8 : -8), 0] }}
              transition={{ duration: 3 + i * 0.5, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </div>

        {/* Title - floating above hill */}
        <motion.div className="text-center mb-6 pt-16 relative z-10"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] uppercase tracking-[0.5em] serif mb-3" style={{ color: "oklch(0.55 0.08 260 / 40%)" }}>Chamber 07</p>
          <h1 className="serif text-4xl md:text-5xl italic" style={{ color: "oklch(0.90 0.04 260)", textShadow: "0 0 60px oklch(0.55 0.08 260 / 30%)" }}>
            The Observatory
          </h1>
          <p className="serif italic text-xs mt-2" style={{ color: "oklch(0.55 0.06 260 / 50%)" }}>a place to simply be</p>
        </motion.div>

        {/* Playlist player - bottom bar */}
        <motion.div className="relative z-20 w-full max-w-lg mb-8 px-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
          {/* Mini player */}
          <div className="rounded-2xl p-4"
            style={{ background: "oklch(0.10 0.03 260 / 80%)", border: "1px solid oklch(0.25 0.05 260 / 25%)",
              backdropFilter: "blur(16px)", boxShadow: "0 -4px 30px oklch(0.04 0.02 260 / 40%)" }}>
            {/* Current track info */}
            <div className="flex items-center gap-3 mb-3">
              <motion.span className="text-lg" animate={isPlaying ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}>
                {isPlaying ? "🎵" : "🎶"}
              </motion.span>
              <div className="flex-1 min-w-0">
                <p className="serif text-sm truncate" style={{ color: "oklch(0.80 0.06 260)" }}>
                  {activeTrack !== null ? PLAYLIST[activeTrack].title : "Choose a song..."}
                </p>
                <p className="text-[10px] truncate" style={{ color: "oklch(0.45 0.04 260 / 60%)" }}>
                  {activeTrack !== null ? `${PLAYLIST[activeTrack].artist} • ${formatTime(elapsed)}` : `${PLAYLIST.length} songs for us`}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {activeTrack !== null && (
              <div className="h-[2px] rounded-full overflow-hidden mb-3" style={{ background: "oklch(0.20 0.04 260 / 40%)" }}>
                <motion.div className="h-full" style={{ background: "oklch(0.60 0.10 260 / 70%)" }}
                  animate={{ width: `${(elapsed / 300) * 100}%` }} />
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <motion.button onClick={prevTrack} className="text-lg opacity-50 hover:opacity-100 transition-opacity"
                whileTap={{ scale: 0.9 }}>⏮</motion.button>
              <motion.button onClick={() => activeTrack !== null && togglePlay(activeTrack)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                style={{ background: "oklch(0.25 0.06 260 / 60%)", border: "1px solid oklch(0.40 0.08 260 / 30%)" }}>
                {isPlaying ? "⏸" : "▶"}
              </motion.button>
              <motion.button onClick={nextTrack} className="text-lg opacity-50 hover:opacity-100 transition-opacity"
                whileTap={{ scale: 0.9 }}>⏭</motion.button>
              <motion.button onClick={() => setShowPlaylist(!showPlaylist)}
                className="text-sm opacity-50 hover:opacity-100 transition-opacity ml-2"
                whileTap={{ scale: 0.9 }}>
                {showPlaylist ? "▼" : "☰"}
              </motion.button>
            </div>
          </div>

          {/* Expanded playlist */}
          <AnimatePresence>
            {showPlaylist && (
              <motion.div className="mt-2 rounded-xl overflow-hidden"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: "oklch(0.08 0.03 260 / 85%)", border: "1px solid oklch(0.20 0.04 260 / 20%)",
                  backdropFilter: "blur(12px)" }}>
                <div className="p-2">
                  <p className="text-[9px] uppercase tracking-[0.3em] serif text-center py-2" style={{ color: "oklch(0.45 0.05 260 / 40%)" }}>
                    Our Songs
                  </p>
                  {PLAYLIST.map((track, i) => (
                    <motion.button key={i}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ background: "oklch(0.15 0.04 260 / 40%)" }}
                      onClick={() => togglePlay(i)}
                      style={{ background: activeTrack === i ? "oklch(0.18 0.05 260 / 40%)" : "transparent" }}>
                      <span className="text-xs w-5 text-center" style={{ color: activeTrack === i && isPlaying ? "oklch(0.65 0.10 260)" : "oklch(0.35 0.04 260 / 50%)" }}>
                        {activeTrack === i && isPlaying ? "♪" : `${i + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="serif text-xs truncate" style={{ color: activeTrack === i ? "oklch(0.80 0.08 260)" : "oklch(0.60 0.05 260 / 70%)" }}>
                          {track.title}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: "oklch(0.40 0.04 260 / 50%)" }}>{track.artist}</p>
                      </div>
                      <span className="text-[10px]" style={{ color: "oklch(0.30 0.03 260 / 40%)" }}>{track.duration}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
