import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MemoryStrip = {
  id: string;
  created_by: string;
  image_url: string;
  quote: string | null;
  memory_number: number | null;
  taken_at: string;
  created_at: string;
};

const QUOTES = [
  "Home is wherever you are.",
  "Today's happiness has been archived.",
  "Another little forever.",
  "Distance couldn't stop this smile.",
  "One more memory for us.",
  "Some moments deserve forever.",
  "Love leaves fingerprints on every room.",
  "This is what happiness looks like.",
  "We were here. We were happy.",
  "A pocket full of sunsets.",
  "Every picture tells a love story.",
  "The world stopped for a second.",
  "This light will never fade.",
  "Forever looks a lot like today.",
  "We built this moment together.",
  "Time stood still and smiled.",
  "Between every heartbeat, a memory.",
  "This is our favorite chapter.",
  "The sun set beautifully that day.",
  "Even the stars were jealous.",
];

export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function useMemoryStrips() {
  const [strips, setStrips] = useState<MemoryStrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("memory_strips" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (alive && !error) setStrips((data as MemoryStrip[]) ?? []);
        if (alive) setLoading(false);
      });
    const ch = supabase
      .channel("strips-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "memory_strips" },
        (payload) => {
          if (alive) setStrips((prev) => [payload.new as MemoryStrip, ...prev]);
        },
      )
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, []);

  return { strips, loading };
}
