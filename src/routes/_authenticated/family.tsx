import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PhotoBooth } from "@/components/memories-room/PhotoBooth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({
    meta: [
      { title: "The Family · Bayt Nūkhad Noor" },
      {
        name: "description",
        content:
          "The Family chapter — dreams, a bucket list, a memory booth, an album, and the observatory.",
      },
    ],
  }),
  component: FamilyChapter,
});

const dreams = [
  "If God wills… a small home with a warm kitchen and a garden.",
  "Maybe one day… mornings in Kyoto, evenings in Seville.",
  "I hope… we build small traditions no one else will understand.",
  "If God wills… a life where quiet is enough.",
  "Maybe one day… we'll grow old on the same porch.",
];

const bucket = [
  "Watch the sunrise together",
  "Cook breakfast, no phones",
  "Visit Japan in spring",
  "Build our first home",
  "Adopt another cat",
  "Plant a tree",
  "Watch a meteor shower",
  "Travel somewhere without a plan",
  "Grow old together",
];

type Strip = {
  id: string;
  image_url: string;
  quote: string | null;
  memory_number: number | null;
  taken_at: string;
};

function useAlbum(refreshKey: number) {
  const [strips, setStrips] = useState<Strip[]>([]);
  useEffect(() => {
    let alive = true;
    supabase
      .from("memory_strips" as never)
      .select("*")
      .order("taken_at", { ascending: false })
      .limit(48)
      .then(({ data }) => { if (alive) setStrips(((data as unknown) as Strip[]) ?? []); });
    const ch = supabase
      .channel("album-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "memory_strips" }, (p) => {
        if (alive) setStrips((prev) => [p.new as Strip, ...prev]);
      })
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [refreshKey]);
  return strips;
}

/* ── Hidden Surprise: clues revealed one visit at a time ── */
const CLUES = [
  { icon: "✈️", label: "A boarding pass with the destination blurred." },
  { icon: "📖", label: "A passport, page corner turned down." },
  { icon: "📅", label: "A calendar. One date circled in pencil." },
  { icon: "🗝️", label: "A brass key on a red ribbon. No lock in sight." },
  { icon: "🏨", label: "A hotel matchbook — the name half-faded." },
];

function useSurpriseProgress() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const raw = localStorage.getItem("bayt.surprise.step");
    const last = localStorage.getItem("bayt.surprise.last");
    const now = Date.now();
    let n = raw ? parseInt(raw, 10) : 0;
    // Only advance once per 6 hours so it feels earned across visits
    if (!last || now - parseInt(last, 10) > 6 * 60 * 60 * 1000) {
      n = Math.min(n + 1, CLUES.length);
      localStorage.setItem("bayt.surprise.step", String(n));
      localStorage.setItem("bayt.surprise.last", String(now));
    }
    setStep(n);
  }, []);
  return step;
}

function FamilyChapter() {
  const [boothOpen, setBoothOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const album = useAlbum(refreshKey);
  const surpriseStep = useSurpriseProgress();
  const cluesShown = CLUES.slice(0, surpriseStep);

  return (
    <div
      className="scene relative min-h-screen"
      style={{
        background: "linear-gradient(180deg, oklch(0.14 0.04 25) 0%, oklch(0.09 0.03 350) 100%)",
        color: "oklch(0.92 0.03 30)",
      }}
    >
      {boothOpen && (
        <PhotoBooth
          onCapture={() => { setBoothOpen(false); setRefreshKey((k) => k + 1); }}
          onClose={() => setBoothOpen(false)}
        />
      )}

      {/* Hero */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <motion.p className="serif text-[10px] uppercase tracking-[0.6em]"
          style={{ color: "oklch(0.75 0.08 25 / 55%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          Chapter one
        </motion.p>
        <motion.h1 className="serif mt-4 italic leading-tight"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", textShadow: "0 0 60px oklch(0.72 0.14 15 / 30%)" }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2.2, delay: 0.4 }}>
          The Family
        </motion.h1>
        <motion.p className="serif mt-6 max-w-lg text-base italic md:text-lg"
          style={{ color: "oklch(0.85 0.04 25 / 75%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1.6 }}>
          A little life already exists between us.<br />
          Come sit with it a while.
        </motion.p>
      </section>

      {/* I. Our Dreams */}
      <Section eyebrow="I. Our Dreams" title="Dreams, not goals.">
        <div className="mx-auto max-w-2xl space-y-8">
          {dreams.map((d, i) => (
            <motion.p key={i} className="serif text-lg italic leading-relaxed md:text-xl"
              style={{ color: "oklch(0.88 0.04 25 / 85%)" }}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.4, delay: i * 0.15 }}>
              {d}
            </motion.p>
          ))}
        </div>
      </Section>

      {/* II. Bucket List */}
      <Section eyebrow="II. The Bucket List" title="Little dreams, torn from a notebook.">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bucket.map((item, i) => (
            <motion.div key={item}
              initial={{ opacity: 0, y: 24, rotate: (i % 2 === 0 ? -1 : 1) * 1.5 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1, delay: i * 0.08 }}
              className="serif px-6 py-8 italic"
              style={{
                background: "oklch(0.94 0.04 80 / 92%)", color: "oklch(0.28 0.08 30)",
                boxShadow: "0 15px 30px oklch(0 0 0 / 30%)", borderRadius: "2px",
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.5}deg)`,
              }}>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-50">Someday</p>
              <p className="mt-2 text-lg leading-snug">{item}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* III. Memory Booth */}
      <Section eyebrow="III. The Memory Booth" title="Three… two… one.">
        <div className="mx-auto max-w-lg text-center">
          <p className="serif text-base italic leading-relaxed md:text-lg"
             style={{ color: "oklch(0.85 0.04 25 / 80%)" }}>
            A little wooden booth waits in the corner of the house. Soft curtains, a warm lamp, and a camera that develops photographs slowly — the way memories should form.
          </p>
          <button onClick={() => setBoothOpen(true)}
            className="serif mt-8 rounded-full px-8 py-3 text-sm italic text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
              boxShadow: "0 4px 20px oklch(0.65 0.14 15 / 30%)" }}>
            Step inside the booth
          </button>
        </div>

        {/* Album */}
        {album.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl">
            <p className="serif mb-6 text-center text-[10px] uppercase tracking-[0.5em]"
               style={{ color: "oklch(0.75 0.08 25 / 55%)" }}>
              Our album — {album.length} moment{album.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {album.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 12, rotate: ((i % 3) - 1) * 2 }}
                  whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: (i % 6) * 0.05 }}
                  className="overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #f5f0e8, #e8e0d4)",
                    padding: 6, borderRadius: 3,
                    boxShadow: "0 12px 24px oklch(0 0 0 / 40%)",
                    transform: `rotate(${((i % 3) - 1) * 2}deg)`,
                  }}>
                  <img src={s.image_url} alt="" className="aspect-square w-full object-cover"
                       style={{ filter: "sepia(0.1) contrast(1.05)" }} />
                  {s.quote && (
                    <p className="serif px-1 py-1 text-center text-[8px] italic"
                       style={{ color: "oklch(0.35 0.08 30)" }}>
                      {s.quote}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* IV. Observatory */}
      <Section eyebrow="IV. The Observatory" title="The quietest room in the house.">
        <div className="mx-auto max-w-lg text-center">
          <p className="serif text-base italic leading-relaxed md:text-lg"
             style={{ color: "oklch(0.85 0.04 25 / 80%)" }}>
            Floor-to-ceiling windows. A telescope. A warm desk lamp. Slow music that never asks to be turned up.
          </p>
          <p className="serif mt-6 text-[10px] uppercase tracking-[0.5em]"
             style={{ color: "oklch(0.75 0.10 25 / 60%)" }}>
            stay a while — it opens up when you're still
          </p>
          <Link to="/world"
            className="serif mt-8 inline-block rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 text-xs italic text-foreground/80 backdrop-blur-md transition-all hover:bg-white/[0.06] hover:scale-[1.02]">
            enter the observatory
          </Link>
        </div>
      </Section>

      <div className="flex justify-center py-16">
        <Link to="/chapter"
          className="serif text-[10px] uppercase tracking-[0.5em] opacity-60 hover:opacity-100"
          style={{ color: "oklch(0.85 0.05 25)" }}>
          ← back to the doors
        </Link>
      </div>

      {/* Hidden Surprise — suitcase in the bottom corner. Reveals a clue per visit. */}
      <motion.button
        onClick={() => setSurpriseOpen(true)}
        className="fixed bottom-6 right-6 z-40 text-2xl opacity-30 transition-opacity hover:opacity-100"
        title=""
        initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 3, duration: 3 }}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}>
        🧳
        {cluesShown.length > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                style={{ background: "oklch(0.72 0.14 55)", boxShadow: "0 0 8px oklch(0.72 0.14 55)" }} />
        )}
      </motion.button>

      <AnimatePresence>
        {surpriseOpen && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md"
                 onClick={() => setSurpriseOpen(false)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="relative max-w-md rounded-2xl border border-amber-200/10 p-8 text-center"
              style={{ background: "oklch(0.14 0.04 30 / 90%)" }}>
              <p className="serif text-[10px] uppercase tracking-[0.6em]"
                 style={{ color: "oklch(0.75 0.10 55 / 60%)" }}>
                Something is being planned.
              </p>
              <h3 className="serif mt-2 text-2xl italic" style={{ color: "oklch(0.92 0.05 55)" }}>
                Don't ask yet.
              </h3>
              <div className="mt-8 space-y-4 text-left">
                {cluesShown.length === 0 ? (
                  <p className="serif text-sm italic text-amber-100/50">
                    The suitcase is empty. Come back later.
                  </p>
                ) : (
                  cluesShown.map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.8 }}
                      className="flex items-start gap-3">
                      <span className="text-xl">{c.icon}</span>
                      <p className="serif text-sm italic text-amber-50/80">{c.label}</p>
                    </motion.div>
                  ))
                )}
              </div>
              {cluesShown.length < CLUES.length && (
                <p className="serif mt-8 text-[10px] uppercase tracking-[0.5em] text-amber-100/30">
                  {CLUES.length - cluesShown.length} more, another day
                </p>
              )}
              <button onClick={() => setSurpriseOpen(false)}
                className="serif mt-6 text-[10px] uppercase tracking-[0.5em] text-amber-100/50 hover:text-amber-100">
                close the case
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ eyebrow, title, children }: {
  eyebrow: string; title: string; children: React.ReactNode;
}) {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <motion.p className="serif mb-3 text-center text-[10px] uppercase tracking-[0.6em]"
        style={{ color: "oklch(0.75 0.08 25 / 55%)" }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.4 }}>
        {eyebrow}
      </motion.p>
      <motion.h2 className="serif mb-16 text-center italic"
        style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)", color: "oklch(0.95 0.03 30)" }}
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 1.6 }}>
        {title}
      </motion.h2>
      {children}
    </section>
  );
}
