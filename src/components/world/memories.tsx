import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Memory = {
  id: string;
  location: string;
  kind: string;
  title: string;
  body: string | null;
  image_url: string | null;
  memory_date: string | null;
  created_at: string;
  created_by: string;
  x: number | null;
  y: number | null;
};

export function useMemories(location: string) {
  const [items, setItems] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    supabase
      .from("memories")
      .select("*")
      .eq("location", location)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (alive) {
          setItems((data as Memory[]) ?? []);
          setLoading(false);
        }
      });
    const ch = supabase
      .channel(`mem-${location}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "memories", filter: `location=eq.${location}` },
        (payload) => {
          setItems((prev) => {
            if (payload.eventType === "INSERT") return [payload.new as Memory, ...prev];
            if (payload.eventType === "DELETE")
              return prev.filter((m) => m.id !== (payload.old as { id: string }).id);
            if (payload.eventType === "UPDATE")
              return prev.map((m) =>
                m.id === (payload.new as { id: string }).id ? (payload.new as Memory) : m,
              );
            return prev;
          });
        },
      )
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, [location]);

  return { items, loading };
}

export function AddMemoryDialog({
  open,
  onClose,
  location,
  defaultKind = "memory",
  position,
}: {
  open: boolean;
  onClose: () => void;
  location: string;
  defaultKind?: "memory" | "letter" | "photo" | "song";
  position?: { x: number; y: number } | null;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle("");
      setBody("");
      setDate("");
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!open) return null;

  const save = async () => {
    if (!title.trim()) return toast.error("Give it a small title");
    setBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("memories").insert({
      created_by: user.id,
      location,
      kind: defaultKind,
      title: title.trim(),
      body: body.trim() || null,
      memory_date: date || null,
      x: position?.x ?? Math.random(),
      y: position?.y ?? 0.5 + Math.random() * 0.3,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved to the world.");
    onClose();
  };

  const kindLabel = { memory: "a memory", letter: "a letter", photo: "a photo", song: "a song" }[
    defaultKind
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: "backdrop-enter 0.3s ease-out both" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[oklch(0.20_0.04_350)]/95 p-8 shadow-2xl backdrop-blur-xl"
        style={{
          animation: visible ? "modal-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
          boxShadow: "0 25px 60px oklch(0 0 0 / 40%), 0 0 40px oklch(0.72 0.14 15 / 8%)",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.14 15 / 15%), transparent 70%)",
          }}
        />

        <h3 className="serif text-3xl italic text-foreground">Leave {kindLabel}</h3>
        <p className="mt-1 text-xs text-muted-foreground serif italic">
          It will stay here for both of you.
        </p>

        <div className="mt-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/8 focus:shadow-[0_0_20px_oklch(0.72_0.14_15_/_10%)] placeholder:text-muted-foreground/40"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something soft..."
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm serif italic outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/8 focus:shadow-[0_0_20px_oklch(0.72_0.14_15_/_10%)] placeholder:text-muted-foreground/40 resize-none"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/8"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={busy}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
              boxShadow: "0 4px 15px oklch(0.65 0.14 15 / 25%)",
            }}
          >
            {busy ? "..." : "Leave it here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ViewMemoryDialog({
  memory,
  onClose,
}: {
  memory: Memory | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (memory) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [memory]);

  if (!memory) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: "backdrop-enter 0.3s ease-out both" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[oklch(0.20_0.04_350)]/95 p-8 shadow-2xl backdrop-blur-xl"
        style={{
          animation: visible ? "modal-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
          boxShadow: "0 25px 60px oklch(0 0 0 / 40%), 0 0 40px oklch(0.72 0.14 15 / 8%)",
        }}
      >
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.14 15 / 12%), transparent 70%)",
          }}
        />

        {memory.memory_date && (
          <p className="text-xs uppercase tracking-widest text-primary/70 serif">
            {memory.memory_date}
          </p>
        )}
        <h3 className="serif mt-1 text-3xl italic text-foreground">{memory.title}</h3>
        {memory.body && (
          <p className="mt-4 serif italic text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {memory.body}
          </p>
        )}
        <p className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">
          left {new Date(memory.created_at).toLocaleDateString()}
        </p>
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm transition-all duration-300 hover:bg-white/10"
            style={{ background: "oklch(0.72 0.14 15 / 15%)" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
