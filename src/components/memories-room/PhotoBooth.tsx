import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getRandomQuote, type MemoryStrip } from "./useMemoryStrips";

type PhotoBoothProps = {
  onCapture: (strip: MemoryStrip) => void;
  onClose: () => void;
};

type Filter = "natural" | "warm" | "dreamy";

const FILTERS: { id: Filter; label: string; css: string }[] = [
  { id: "natural", label: "Natural", css: "none" },
  { id: "warm", label: "Warm", css: "sepia(0.25) saturate(1.15) brightness(1.05)" },
  { id: "dreamy", label: "Dreamy", css: "brightness(1.1) contrast(0.95) saturate(1.2) blur(0.3px)" },
];

const CAPTURE_MESSAGES = [
  "Smile for future us.",
  "One more memory.",
  "Look at me.",
  "Don't laugh.",
  "Okay... now actually smile.",
  "This moment is ours.",
  "Hold that thought.",
  "Perfect as you are.",
  "You look like home.",
  "This is the one.",
  "For the collection of us.",
  "Breathe in. Smile.",
  "Stay beautiful.",
];

function getRandomMessage(): string {
  return CAPTURE_MESSAGES[Math.floor(Math.random() * CAPTURE_MESSAGES.length)];
}

export function PhotoBooth({ onCapture, onClose }: PhotoBoothProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"intro" | "loading" | "counting" | "flash" | "developing" | "done">("intro");
  const [countdown, setCountdown] = useState(3);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("natural");
  const [developProgress, setDevelopProgress] = useState(0);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    setPhase("loading");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setPhase("counting");
      startCountdown(s);
    } catch {
      setError("Camera access needed for the photo booth. Please allow camera access and try again.");
      setPhase("intro");
    }
  }, []);

  const startCountdown = (s: MediaStream) => {
    let count = 3;
    let photoIdx = 0;
    const captured: string[] = [];

    const doCount = () => {
      setMessage(getRandomMessage());
      setCountdown(count);
      setPhase("counting");

      const tick = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(tick);
          capturePhoto(s, photoIdx, captured);
        } else {
          setCountdown(count);
        }
      }, 1000);
    };

    const capturePhoto = (mediaStream: MediaStream, idx: number, acc: string[]) => {
      setPhase("flash");
      setTimeout(() => {
        if (videoRef.current && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d")!;
          canvasRef.current.width = 640;
          canvasRef.current.height = 480;
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.92);
          acc.push(dataUrl);
          setPhotos([...acc]);
          setCurrentPhoto(idx + 1);
        }

        if (idx + 1 < 4) {
          setTimeout(() => {
            count = 3;
            doCount();
          }, 1500);
        } else {
          mediaStream.getTracks().forEach((t) => t.stop());
          setPhase("developing");
          // Animated developing progress
          let progress = 0;
          const devInterval = setInterval(() => {
            progress += 2;
            setDevelopProgress(progress);
            if (progress >= 100) {
              clearInterval(devInterval);
              setPhase("done");
            }
          }, 60);
        }
      }, 350);
    };

    doCount();
  };

  const saveStrip = useCallback(async () => {
    const quote = getRandomQuote();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from("memory_strips" as never)
      .select("id", { count: "exact", head: true });

    const { data, error } = await supabase
      .from("memory_strips" as never)
      .insert({
        created_by: user.id,
        image_url: photos[0] || "",
        quote,
        memory_number: (count || 0) + 1,
        taken_at: new Date().toISOString(),
      } as never)
      .select()
      .single();

    if (error) return toast.error("Could not save");
    toast.success("Memory saved to the house");
    onCapture(data as unknown as MemoryStrip);
    onClose();
  }, [photos, onCapture, onClose]);

  const downloadStrip = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f5f0e8";
    ctx.fillRect(0, 0, 400, 1600);

    // Film border
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, 0, 15, 1600);
    ctx.fillRect(385, 0, 15, 1600);

    // Sprocket holes
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(2, 20 + i * 78, 8, 12);
      ctx.fillRect(387, 20 + i * 78, 8, 12);
    }

    photos.forEach((p, i) => {
      const img = new Image();
      img.src = p;
      img.onload = () => {
        ctx.drawImage(img, 20, 25 + i * 370, 360, 340);
        if (i === photos.length - 1) {
          // Branding
          ctx.fillStyle = "#8a7a6a";
          ctx.font = "italic 10px serif";
          ctx.textAlign = "center";
          ctx.fillText("Bayt Nukhad Noor", 200, 1530);
          ctx.font = "8px serif";
          ctx.fillStyle = "#aa9a8a";
          ctx.fillText("Noah \u2661 Khadija", 200, 1550);
          ctx.fillText(new Date().toLocaleDateString(), 200, 1568);

          const link = document.createElement("a");
          link.download = `bayt-memory-${Date.now()}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      };
    });
  }, [photos]);

  const filterCss = FILTERS.find((f) => f.id === filter)?.css ?? "none";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Film grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[61] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-[62] flex flex-col items-center gap-6 p-8">
        <AnimatePresence mode="wait">
          {/* Error */}
          {error && (
            <motion.div
              key="error"
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-red-400 serif italic mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setError(null); startCamera(); }}
                  className="rounded-full bg-white/10 px-6 py-2 text-sm text-foreground hover:bg-white/20 transition-all"
                >
                  Try Again
                </button>
                <button onClick={onClose} className="rounded-full bg-white/10 px-6 py-2 text-sm text-foreground hover:bg-white/20 transition-all">
                  Close
                </button>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {!error && phase === "loading" && (
            <motion.div
              key="loading"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground serif italic">Opening camera...</p>
            </motion.div>
          )}

          {/* Intro */}
          {!error && phase === "intro" && (
            <motion.div
              key="intro"
              className="text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Camera icon */}
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/15 flex items-center justify-center border border-amber-500/15 rotate-[-3deg]">
                <span className="text-3xl" style={{ filter: "sepia(0.3)" }}>&#128247;</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 serif mb-2">The Memory Camera</p>
              <h2 className="serif text-3xl italic text-foreground mb-2">Let's make a memory</h2>
              <p className="text-sm text-muted-foreground serif italic mb-2">
                Four shots. One strip. A moment for forever.
              </p>

              {/* Filter selection */}
              <div className="flex gap-2 justify-center mb-6">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`rounded-full px-4 py-1.5 text-[11px] serif italic transition-all duration-300 ${
                      filter === f.id
                        ? "bg-white/15 text-foreground border border-white/20"
                        : "text-muted-foreground/60 border border-transparent hover:text-muted-foreground hover:bg-white/5"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={startCamera}
                  className="rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))", boxShadow: "0 4px 20px oklch(0.65 0.14 15 / 30%)" }}
                >
                  Begin
                </button>
                <button onClick={onClose} className="rounded-full px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-all">
                  Not now
                </button>
              </div>
            </motion.div>
          )}

          {/* Counting / Flash */}
          {(phase === "counting" || phase === "flash") && (
            <motion.div
              key="counting"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Message */}
              <p className="text-sm text-muted-foreground serif italic mb-6 min-h-[1.5em]">{message}</p>

              {/* Countdown number or flash */}
              <AnimatePresence mode="wait">
                {phase === "flash" ? (
                  <motion.div
                    key="flash"
                    className="fixed inset-0 z-[70] bg-white"
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                ) : (
                  <motion.div
                    key={countdown}
                    className="text-8xl font-light text-foreground serif"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.3, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {countdown}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Photo progress dots */}
              <div className="flex gap-2 justify-center mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < currentPhoto
                        ? "bg-amber-400 scale-110"
                        : i === currentPhoto
                          ? "bg-amber-400/60 animate-pulse"
                          : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground/40 serif">
                {Math.min(currentPhoto + 1, 4)} of 4
              </p>
            </motion.div>
          )}

          {/* Developing */}
          {phase === "developing" && (
            <motion.div
              key="developing"
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-32 h-44 mx-auto rounded-lg overflow-hidden shadow-2xl"
                style={{ background: "linear-gradient(180deg, #f5f0e8, #e8e0d4)" }}
              >
                {/* Progressive reveal */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-amber-50/80 to-amber-100/80"
                  style={{
                    clipPath: `inset(0 0 ${developProgress}% 0)`,
                    transition: "clip-path 0.1s linear",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-amber-800/30 serif italic text-xs">developing...</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-32 h-0.5 mx-auto mt-4 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${developProgress}%`,
                    background: "linear-gradient(90deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Done — Photo strip */}
          {phase === "done" && photos.length > 0 && (
            <motion.div
              key="done"
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Film strip */}
              <div className="relative" style={{ perspective: "800px" }}>
                <motion.div
                  className="relative rounded-lg overflow-hidden shadow-2xl"
                  style={{
                    background: "#1a1a1a",
                    padding: "10px 18px",
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ rotateY: -8, rotateX: 3 }}
                  animate={{ rotateY: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Sprocket holes top */}
                  <div className="flex justify-between px-1 mb-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="w-2 h-1.5 rounded-sm bg-black/80 border border-white/5" />
                    ))}
                  </div>

                  {/* Photos */}
                  <div className="space-y-1">
                    {photos.map((p, i) => (
                      <motion.div
                        key={i}
                        className="relative overflow-hidden rounded"
                        style={{ filter: filterCss }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.4 }}
                      >
                        <img src={p} alt="" className="w-48 h-36 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        {/* Frame number */}
                        <span className="absolute top-1 right-1.5 text-[8px] text-white/30 font-mono">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sprocket holes bottom */}
                  <div className="flex justify-between px-1 mt-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="w-2 h-1.5 rounded-sm bg-black/80 border border-white/5" />
                    ))}
                  </div>

                  {/* Branding */}
                  <div className="text-center mt-2 pb-0.5">
                    <p className="text-[7px] uppercase tracking-[0.25em] text-white/40 serif">Bayt Nukhad Noor</p>
                    <p className="text-[6px] text-white/25 mt-0.5">Noah &#9825; Khadija</p>
                  </div>
                </motion.div>

                {/* Card shadow underneath */}
                <div
                  className="absolute -bottom-2 left-2 right-2 h-4 rounded-b-lg"
                  style={{
                    background: "radial-gradient(ellipse at center, oklch(0 0 0 / 25%), transparent 70%)",
                    filter: "blur(4px)",
                  }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={saveStrip}
                  className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  &#10084; Keep in Our House
                </motion.button>
                <motion.button
                  onClick={downloadStrip}
                  className="rounded-full px-5 py-2.5 text-sm text-muted-foreground border border-white/10 hover:bg-white/5 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  &#11015; Download
                </motion.button>
                <motion.button
                  onClick={() => { setPhotos([]); setCurrentPhoto(0); setDevelopProgress(0); setPhase("intro"); }}
                  className="rounded-full px-5 py-2.5 text-sm text-muted-foreground border border-white/10 hover:bg-white/5 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  &#128260; Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
