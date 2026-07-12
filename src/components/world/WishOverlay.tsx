import { useState } from "react";
import { useSharedState } from "@/hooks/useSharedState";
import { Sparkles, X } from "lucide-react";

type Wish = { id: string; x: number; y: number; text: string; by?: string; at: string };
type WishState = { list: Wish[] };

export function WishOverlay({ visible = true }: { visible?: boolean }) {
  const wishes = useSharedState<WishState>("sky.wishes", { list: [] });
  const [composing, setComposing] = useState<{ x: number; y: number } | null>(null);
  const [text, setText] = useState("");
  const [viewing, setViewing] = useState<Wish | null>(null);

  if (!visible) return null;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (y > 55) return; // only top of sky
    setComposing({ x, y });
    setText("");
  };

  const commit = () => {
    if (!composing || !text.trim()) return setComposing(null);
    const w: Wish = {
      id: crypto.randomUUID(),
      x: composing.x,
      y: composing.y,
      text: text.trim().slice(0, 140),
      at: new Date().toISOString(),
    };
    wishes.setValue({ list: [...wishes.value.list.slice(-99), w] });
    setComposing(null);
    setText("");
  };

  return (
    <>
      <div
        className="absolute inset-0 z-30"
        onClick={handleClick}
        style={{ cursor: "crosshair" }}
      >
        {wishes.value.list.map((w) => (
          <button
            key={w.id}
            onClick={(e) => {
              e.stopPropagation();
              setViewing(w);
            }}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${w.x}%`, top: `${w.y}%` }}
            title={w.text}
          >
            <span
              className="block h-2 w-2 rounded-full bg-white"
              style={{
                boxShadow:
                  "0 0 12px oklch(0.95 0.05 60 / 90%), 0 0 30px oklch(0.85 0.08 60 / 60%)",
                animation: "twinkle 2.4s ease-in-out infinite",
              }}
            />
          </button>
        ))}
      </div>

      {/* Hint chip */}
      <div className="pointer-events-none absolute top-20 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-muted-foreground backdrop-blur">
        <Sparkles size={10} className="inline mr-1 text-primary" />
        tap the sky to make a wish
      </div>

      {/* Compose */}
      {composing && (
        <div
          className="absolute z-50 -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: `${composing.x}%`, top: `${composing.y}%` }}
        >
          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/70 p-1.5 backdrop-blur-xl shadow-2xl">
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setComposing(null);
              }}
              placeholder="a wish…"
              maxLength={140}
              className="w-56 bg-transparent px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={commit}
              className="rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground hover:opacity-90"
            >
              wish
            </button>
            <button onClick={() => setComposing(null)} className="p-1 text-muted-foreground hover:text-foreground">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* View wish */}
      {viewing && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setViewing(null)}
        >
          <div
            className="max-w-sm rounded-3xl border border-white/10 bg-background/95 p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Sparkles size={20} className="mx-auto mb-3 text-primary" />
            <p className="serif italic text-lg text-foreground">"{viewing.text}"</p>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              wished on {new Date(viewing.at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
