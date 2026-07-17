import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onBack: () => void };

type Track = { title: string; artist: string; duration: string };

const PLAYLIST: Track[] = [
  { title: "Clair de Lune", artist: "Debussy", duration: "5:02" },
  { title: "The Night We Met", artist: "Lord Huron", duration: "3:28" },
  { title: "Bloom", artist: "The Paper Kites", duration: "3:45" },
  { title: "Saturn", artist: "Sleeping at Last", duration: "4:03" },
  { title: "Holocene", artist: "Bon Iver", duration: "5:36" },
  { title: "Experience", artist: "Ludovico Einaudi", duration: "5:15" },
];

const COMFORT_OPTIONS = [
  { label: "Hug Me", glow: "oklch(0.85 0.12 55 / 60%)", message: "A warm hug wraps around you like sunlight." },
  { label: "Sit With Me", glow: "oklch(0.55 0.08 260 / 50%)", message: "We sit together beneath the stars. No words needed." },
  { label: "Kiss", glow: "oklch(0.75 0.15 350 / 55%)", message: "A gentle kiss under a thousand stars." },
] as const;

const STARS = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  size: 1 + (i % 4) * 0.6,
  left: `${(i * 1.7) % 100}%`,
  top: `${(i * 1.3 + 5) % 100}%`,
  delay: (i * 0.3) % 8,
  duration: 2 + (i % 5) * 1.2,
}));

const TOP_STARS = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: 0.8 + (i % 3) * 0.5,
  left: `${(i * 3.4) % 100}%`,
  top: `${(i * 2.1) % 60}%`,
  delay: (i * 0.25) % 5,
  duration: 1.8 + (i % 4) * 0.8,
}));

const CONSTELLATIONS = [
  { name: "Ursa Major", lines: [[20, 25], [28, 22], [35, 20], [42, 24], [38, 30], [30, 33], [22, 30]], stars: [[20, 25], [28, 22], [35, 20], [42, 24], [38, 30], [30, 33], [22, 30]] },
  { name: "Orion", lines: [[55, 15], [60, 20], [65, 15], [60, 30], [55, 40], [60, 45], [65, 40]], stars: [[55, 15], [60, 20], [65, 15], [60, 30], [55, 40], [60, 45], [65, 40]] },
];

export function ObservatoryChamber({ onBack }: Props) {
  const [noteVisible, setNoteVisible] = useState(false);
  const [noteOpened, setNoteOpened] = useState(false);
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const [shootingStar, setShootingStar] = useState(false);

  // Playlist state
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Telescope state
  const [telescopeActive, setTelescopeActive] = useState(false);
  const [activeConstellation, setActiveConstellation] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setNoteVisible(true), 25000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStar(true);
      setTimeout(() => setShootingStar(false), 1200);
    }, 8000 + Math.random() * 6000);
    return () => clearInterval(interval);
  }, []);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerOption = useCallback((index: number) => {
    setActiveOption(index);
    setTimeout(() => {
      setActiveOption(null);
      setNoteOpened(false);
    }, 4000);
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
    const next = (activeTrack + 1) % PLAYLIST.length;
    setActiveTrack(next);
    setElapsed(0);
  }, [activeTrack]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="h-full w-full overflow-y-auto relative" style={{ background: "oklch(0.08 0.04 260)" }}>
      {/* Deep ambient gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 20%, oklch(0.12 0.05 260 / 60%) 0%, transparent 60%), radial-gradient(ellipse at 50% 90%, oklch(0.10 0.03 280 / 30%) 0%, transparent 50%)" }} />

      {/* Top scattered stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {TOP_STARS.map((s) => (
          <span key={`top-${s.id}`} className="absolute rounded-full"
            style={{ width: s.size, height: s.size, left: s.left, top: s.top,
              background: "oklch(0.90 0.02 260 / 50%)",
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 flex flex-col items-center min-h-full">

        {/* Title */}
        <motion.div className="text-center mb-14 relative z-10"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] uppercase tracking-[0.5em] serif mb-4" style={{ color: "oklch(0.55 0.08 260 / 40%)" }}>Chamber 07</p>
          <h1 className="serif text-5xl md:text-6xl italic text-foreground"
            style={{ textShadow: "0 0 80px oklch(0.55 0.08 260 / 20%)" }}>
            The Observatory
          </h1>
          <p className="serif italic text-sm text-muted-foreground/50 mt-4 max-w-sm mx-auto leading-relaxed">a place to simply be</p>
        </motion.div>

        {/* Observatory window with stars */}
        <motion.div className="relative mb-12"
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          {/* Moon glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
            style={{ background: "radial-gradient(circle, oklch(0.85 0.06 240 / 8%) 0%, oklch(0.85 0.06 240 / 3%) 30%, transparent 60%)",
              animation: "breathe 10s ease-in-out infinite" }} />

          {/* Circular window */}
          <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden"
            style={{ border: "3px solid oklch(0.30 0.04 260 / 50%)",
              boxShadow: "0 0 60px oklch(0.20 0.06 260 / 30%), inset 0 0 40px oklch(0.06 0.03 260 / 80%)" }}>
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 30%, oklch(0.15 0.06 260) 0%, oklch(0.06 0.03 260) 100%)" }} />
            {/* Stars */}
            {STARS.map((s) => (
              <span key={s.id} className="absolute rounded-full"
                style={{ width: s.size, height: s.size, left: s.left, top: s.top,
                  background: "oklch(0.95 0.02 260 / 70%)",
                  animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
            ))}
            {/* Moon */}
            <div className="absolute top-[15%] right-[18%] w-10 h-10 md:w-14 md:h-14 rounded-full"
              style={{ background: "radial-gradient(circle at 40% 40%, oklch(0.92 0.04 90) 0%, oklch(0.80 0.05 80) 60%, oklch(0.60 0.04 70) 100%)",
                boxShadow: "0 0 30px oklch(0.85 0.06 85 / 30%), 0 0 60px oklch(0.85 0.06 85 / 10%)" }} />
            {/* Shooting star */}
            <AnimatePresence>
              {shootingStar && (
                <motion.div className="absolute h-[1px] origin-top-left"
                  style={{ background: "linear-gradient(90deg, oklch(0.95 0.02 260 / 90%), transparent)",
                    width: "120px", top: "20%", left: "15%", transform: "rotate(25deg)" }}
                  initial={{ opacity: 0, scaleX: 0, x: 0 }}
                  animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1], x: [0, 160, 280] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }} />
              )}
            </AnimatePresence>
            {/* Window bars */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2" style={{ background: "oklch(0.25 0.03 260 / 40%)" }} />
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2" style={{ background: "oklch(0.25 0.03 260 / 40%)" }} />
          </div>
        </motion.div>

        {/* Telescope button */}
        <motion.button
          className="serif rounded-full px-5 py-2 text-xs tracking-wider transition-all mb-12"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setTelescopeActive(!telescopeActive); setActiveConstellation(null); }}
          style={{ background: telescopeActive ? "oklch(0.25 0.06 260 / 70%)" : "oklch(0.18 0.04 260 / 50%)",
            border: `1px solid ${telescopeActive ? "oklch(0.50 0.08 260 / 40%)" : "oklch(0.35 0.05 260 / 25%)"}`,
            color: "oklch(0.65 0.06 260 / 80%)", boxShadow: telescopeActive ? "0 0 20px oklch(0.40 0.08 260 / 15%)" : "none" }}>
          🔭 {telescopeActive ? "Close Telescope" : "Look Through Telescope"}
        </motion.button>

        {/* Telescope constellation view */}
        <AnimatePresence>
          {telescopeActive && (
            <motion.div
              className="w-full max-w-lg mb-12 rounded-2xl overflow-hidden relative"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "oklch(0.06 0.03 260 / 90%)", border: "1px solid oklch(0.25 0.04 260 / 30%)",
                boxShadow: "inset 0 0 60px oklch(0.04 0.02 260 / 50%)" }}>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] serif text-center mb-4" style={{ color: "oklch(0.50 0.06 260 / 50%)" }}>
                  Constellation Map
                </p>
                <div className="flex gap-3 justify-center mb-4">
                  {CONSTELLATIONS.map((c, i) => (
                    <motion.button key={c.name}
                      className="serif text-[11px] px-3 py-1.5 rounded-full transition-all"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveConstellation(activeConstellation === i ? null : i)}
                      style={{ background: activeConstellation === i ? "oklch(0.25 0.06 260 / 60%)" : "oklch(0.15 0.03 260 / 40%)",
                        border: `1px solid ${activeConstellation === i ? "oklch(0.50 0.08 260 / 40%)" : "oklch(0.30 0.04 260 / 20%)"}`,
                        color: "oklch(0.70 0.06 260 / 70%)" }}>
                      {c.name}
                    </motion.button>
                  ))}
                </div>
                {activeConstellation !== null && (
                  <motion.div className="relative w-full h-48 rounded-xl overflow-hidden"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: "radial-gradient(ellipse at 50% 50%, oklch(0.10 0.04 260), oklch(0.05 0.02 260))" }}>
                    <svg className="w-full h-full" viewBox="0 0 100 60">
                      {/* Star dots */}
                      {CONSTELLATIONS[activeConstellation].stars.map(([x, y], i) => (
                        <motion.circle key={i} cx={x} cy={y} r="1.2"
                          fill="oklch(0.90 0.04 260 / 90%)"
                          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.4 }} />
                      ))}
                      {/* Lines */}
                      {CONSTELLATIONS[activeConstellation].lines.map(([x1, y1, x2, y2], i) => (
                        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="oklch(0.60 0.06 260 / 30%)" strokeWidth="0.3" strokeDasharray="2 1"
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }} />
                      ))}
                    </svg>
                    <p className="absolute bottom-2 left-1/2 -translate-x-1/2 serif italic text-[10px]"
                      style={{ color: "oklch(0.60 0.06 260 / 50%)" }}>
                      {CONSTELLATIONS[activeConstellation].name}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playlist player */}
        <motion.div className="w-full max-w-md mb-14 relative"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}>
          <motion.button
            className="w-full serif rounded-2xl p-5 text-left transition-all"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setPlaylistOpen(!playlistOpen)}
            style={{ background: "oklch(0.14 0.04 260 / 70%)", border: "1px solid oklch(0.30 0.05 260 / 25%)",
              backdropFilter: "blur(8px)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{isPlaying ? "🎵" : "🎶"}</span>
                <div>
                  <p className="text-xs" style={{ color: "oklch(0.65 0.06 260 / 70%)" }}>
                    {activeTrack !== null ? PLAYLIST[activeTrack].title : "Night Playlist"}
                  </p>
                  <p className="text-[10px]" style={{ color: "oklch(0.45 0.04 260 / 50%)" }}>
                    {activeTrack !== null ? `${PLAYLIST[activeTrack].artist} • ${formatTime(elapsed)}` : `${PLAYLIST.length} songs`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeTrack !== null && (
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); togglePlay(activeTrack); }}
                    style={{ background: "oklch(0.25 0.06 260 / 50%)", color: "oklch(0.70 0.06 260)" }}>
                    {isPlaying ? "⏸" : "▶"}
                  </motion.button>
                )}
                <span className="text-[10px]" style={{ color: "oklch(0.40 0.04 260 / 50%)" }}>
                  {playlistOpen ? "▲" : "▼"}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            {activeTrack !== null && isPlaying && (
              <div className="mt-3 h-[2px] rounded-full overflow-hidden" style={{ background: "oklch(0.25 0.04 260 / 40%)" }}>
                <motion.div className="h-full" style={{ background: "oklch(0.60 0.08 260 / 60%)" }}
                  animate={{ width: `${(elapsed / 300) * 100}%` }} />
              </div>
            )}
          </motion.button>

          <AnimatePresence>
            {playlistOpen && (
              <motion.div
                className="mt-2 rounded-xl overflow-hidden"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: "oklch(0.12 0.03 260 / 80%)", border: "1px solid oklch(0.25 0.04 260 / 20%)",
                  backdropFilter: "blur(12px)" }}>
                {PLAYLIST.map((track, i) => (
                  <motion.button key={i}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ background: "oklch(0.18 0.04 260 / 40%)" }}
                    onClick={() => togglePlay(i)}
                    style={{ borderBottom: i < PLAYLIST.length - 1 ? "1px solid oklch(0.20 0.03 260 / 15%)" : "none" }}>
                    <span className="text-sm w-5 text-center" style={{ color: activeTrack === i && isPlaying ? "oklch(0.65 0.08 260)" : "oklch(0.40 0.04 260 / 50%)" }}>
                      {activeTrack === i && isPlaying ? "♪" : `${i + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="serif text-xs truncate" style={{ color: activeTrack === i ? "oklch(0.80 0.06 260)" : "oklch(0.65 0.05 260 / 70%)" }}>
                        {track.title}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: "oklch(0.45 0.04 260 / 50%)" }}>{track.artist}</p>
                    </div>
                    <span className="text-[10px]" style={{ color: "oklch(0.35 0.03 260 / 50%)" }}>{track.duration}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Folded note (appears after 25s idle) */}
        <AnimatePresence>
          {noteVisible && activeOption === null && (
            <motion.div
              className="relative mb-12"
              initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
              <button onClick={() => setNoteOpened(true)}
                className="cursor-pointer relative px-8 py-5 rounded-sm serif italic text-sm transition-all duration-500"
                style={{ background: "oklch(0.88 0.03 75 / 90%)", color: "oklch(0.30 0.03 50)",
                  boxShadow: "0 0 20px oklch(0.80 0.08 55 / 15%), 0 4px 12px oklch(0.10 0.02 260 / 30%)",
                  animation: "noteGlow 4s ease-in-out infinite" }}>
                {noteOpened ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-5">
                    <p className="text-xs mb-1" style={{ color: "oklch(0.40 0.04 50)" }}>Need a little comfort?</p>
                    <div className="flex gap-4">
                      {COMFORT_OPTIONS.map((opt, i) => (
                        <motion.button key={opt.label}
                          onClick={(e) => { e.stopPropagation(); triggerOption(i); }}
                          className="px-4 py-2 rounded-full serif text-xs transition-all duration-300"
                          style={{ background: "oklch(0.20 0.03 260 / 70%)", color: "oklch(0.80 0.06 260 / 90%)",
                            border: "1px solid oklch(0.40 0.06 260 / 25%)" }}
                          whileHover={{ scale: 1.08, boxShadow: "0 0 16px oklch(0.60 0.08 260 / 20%)" }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}>
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <span style={{ color: "oklch(0.35 0.04 50)" }}>✉ a small note lies here...</span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comfort animation overlay */}
        <AnimatePresence>
          {activeOption !== null && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <motion.div className="absolute inset-0"
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, times: [0, 0.2, 0.7, 1] }}
                style={{ background: `radial-gradient(circle at 50% 50%, ${COMFORT_OPTIONS[activeOption].glow}, transparent 70%)` }} />
              <motion.p className="proposal-heading serif text-xl md:text-2xl italic text-center px-8 max-w-md relative z-10"
                style={{ color: "oklch(0.90 0.04 260)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
                transition={{ duration: 4, times: [0, 0.15, 0.75, 1] }}>
                {COMFORT_OPTIONS[activeOption].message}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom note */}
        <motion.p className="serif italic text-[11px] text-muted-foreground/25 mt-auto pt-10 text-center relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
          Peace is the most beautiful thing we can share.
        </motion.p>
      </div>
    </div>
  );
}
