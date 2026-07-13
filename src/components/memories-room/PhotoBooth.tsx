import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getRandomQuote, type MemoryStrip } from "./useMemoryStrips";

type PhotoBoothProps = {
  onCapture: (strip: MemoryStrip) => void;
  onClose: () => void;
};

const CAPTURE_MESSAGES = [
  "Smile for future us.",
  "One more memory.",
  "Look at me.",
  "Don't laugh.",
  "Okay... now actually smile.",
  "Today's happiness deserves to stay forever.",
  "This moment is ours.",
  "Hold that thought.",
  "Perfect as you are.",
  "Ready? This one's special.",
  "Breathe in. Smile.",
  "For the collection of us.",
  "You look like home.",
  "This is the one.",
  "Almost there... stay beautiful.",
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
          }, 1800);
        } else {
          mediaStream.getTracks().forEach((t) => t.stop());
          setPhase("developing");
          setTimeout(() => setPhase("done"), 3000);
        }
      }, 300);
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

    photos.forEach((p, i) => {
      const img = new Image();
      img.src = p;
      img.onload = () => {
        ctx.drawImage(img, 20, 20 + i * 380, 360, 360);
        if (i === photos.length - 1) {
          const link = document.createElement("a");
          link.download = `bayt-memory-${Date.now()}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      };
    });
  }, [photos]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ animation: "backdrop-enter 0.4s ease-out both" }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={onClose} />

      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-10 flex flex-col items-center gap-6 p-8">
        {error && (
          <div className="text-center">
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
          </div>
        )}

        {!error && phase === "loading" && (
          <div className="text-center" style={{ animation: "fade-up 0.3s ease-out both" }}>
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground serif italic">Opening camera...</p>
          </div>
        )}

        {!error && phase === "intro" && (
          <div className="text-center max-w-md" style={{ animation: "fade-up 0.6s ease-out both" }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/20">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 serif mb-2">The Memory Camera</p>
            <h2 className="serif text-3xl italic text-foreground mb-3">Let's make a memory</h2>
            <p className="text-sm text-muted-foreground serif italic mb-6">
              "Every picture we take today becomes tomorrow's memory."
            </p>
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
          </div>
        )}

        {(phase === "counting" || phase === "flash") && (
          <div className="text-center" style={{ animation: "fade-up 0.3s ease-out both" }}>
            <p className="text-sm text-muted-foreground serif italic mb-4 min-h-[1.5em]">{message}</p>
            {phase === "flash" ? (
              <div className="text-6xl font-light text-white animate-[breathe_0.3s_ease-out]">✨</div>
            ) : (
              <div className="text-6xl font-light text-foreground serif animate-[fade-up_0.3s_ease-out_both]">{countdown}</div>
            )}
            <p className="mt-4 text-[10px] text-muted-foreground/50">Photo {Math.min(currentPhoto + 1, 4)} of 4</p>
          </div>
        )}

        {phase === "developing" && (
          <div className="text-center" style={{ animation: "fade-up 0.5s ease-out both" }}>
            <div className="w-32 h-40 mx-auto rounded-lg bg-gradient-to-b from-amber-50 to-amber-100 animate-[breathe_2s_ease-in-out_infinite] shadow-lg" />
            <p className="mt-4 text-sm text-muted-foreground serif italic">developing...</p>
          </div>
        )}

        {phase === "done" && photos.length > 0 && (
          <div className="flex flex-col items-center gap-4" style={{ animation: "fade-up 0.6s ease-out both" }}>
            {/* Photo strip */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(180deg, #f5f0e8, #e8e0d4)" }}>
              <div className="p-3 space-y-1">
                {photos.map((p, i) => (
                  <div key={i} className="relative overflow-hidden rounded-md" style={{ filter: "sepia(0.1) contrast(1.05)" }}>
                    <img src={p} alt="" className="w-48 h-36 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3 text-center">
                <p className="text-[8px] uppercase tracking-[0.3em] text-amber-800/60 serif">Bayt Nukhad Noor</p>
                <p className="text-[7px] text-amber-800/40 mt-0.5">Noah ♡ Khadija</p>
                <p className="text-[7px] text-amber-800/40">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={saveStrip}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))" }}
              >
                ❤ Keep in Our House
              </button>
              <button
                onClick={downloadStrip}
                className="rounded-full px-5 py-2.5 text-sm text-muted-foreground border border-white/10 hover:bg-white/5 transition-all"
              >
                ⬇ Download
              </button>
              <button
                onClick={() => { setPhotos([]); setCurrentPhoto(0); setPhase("intro"); }}
                className="rounded-full px-5 py-2.5 text-sm text-muted-foreground border border-white/10 hover:bg-white/5 transition-all"
              >
                🔄 Take Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
