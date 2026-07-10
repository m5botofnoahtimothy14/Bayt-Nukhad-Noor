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
    supabase.from("memories").select("*").eq("location", location).order("created_at", { ascending: false })
      .then(({ data }) => { if (alive) { setItems((data as Memory[]) ?? []); setLoading(false); } });
    const ch = supabase.channel(`mem-${location}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "memories", filter: `location=eq.${location}` }, (payload) => {
        setItems((prev) => {
          if (payload.eventType === "INSERT") return [payload.new as Memory, ...prev];
          if (payload.eventType === "DELETE") return prev.filter(m => m.id !== (payload.old as any).id);
          if (payload.eventType === "UPDATE") return prev.map(m => m.id === (payload.new as any).id ? payload.new as Memory : m);
          return prev;
        });
      })
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [location]);

  return { items, loading };
}

export function AddMemoryDialog({
  open, onClose, location, defaultKind = "memory", position,
}: {
  open: boolean; onClose: () => void; location: string;
  defaultKind?: "memory" | "letter" | "photo" | "song";
  position?: { x: number; y: number } | null;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) { setTitle(""); setBody(""); setDate(""); } }, [open]);

  if (!open) return null;

  const save = async () => {
    if (!title.trim()) return toast.error("Give it a small title");
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("memories").insert({
      created_by: user.id, location, kind: defaultKind,
      title: title.trim(), body: body.trim() || null,
      memory_date: date || null,
      x: position?.x ?? Math.random(), y: position?.y ?? 0.5 + Math.random() * 0.3,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved to the world.");
    onClose();
  };

  const kindLabel = { memory: "a memory", letter: "a letter", photo: "a photo", song: "a song" }[defaultKind];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-primary/20 bg-card/95 p-6 shadow-2xl">
        <h3 className="serif text-2xl italic">Leave {kindLabel}</h3>
        <p className="mt-1 text-xs text-muted-foreground">It will stay here for both of you.</p>
        <div className="mt-4 space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"
            className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary/60"/>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write something soft…" rows={4}
            className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm serif italic outline-none focus:border-primary/60"/>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary/60"/>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={save} disabled={busy} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
            {busy ? "…" : "Leave it here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ViewMemoryDialog({ memory, onClose }: { memory: Memory | null; onClose: () => void }) {
  if (!memory) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-primary/20 bg-card/95 p-6 shadow-2xl">
        {memory.memory_date && <p className="text-xs uppercase tracking-widest text-primary/70">{memory.memory_date}</p>}
        <h3 className="serif mt-1 text-2xl italic">{memory.title}</h3>
        {memory.body && <p className="mt-3 serif italic text-foreground/90 whitespace-pre-wrap leading-relaxed">{memory.body}</p>}
        <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">
          left {new Date(memory.created_at).toLocaleDateString()}
        </p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded-full bg-primary/20 px-4 py-1.5 text-sm hover:bg-primary/30">Close</button>
        </div>
      </div>
    </div>
  );
}
