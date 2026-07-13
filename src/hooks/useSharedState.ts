import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * A tiny realtime shared key/value hook backed by public.shared_state.
 * Both accounts see live updates. Values are JSON-serializable.
 */
export function useSharedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const uidRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      uidRef.current = userRes.user?.id ?? null;

      const { data } = await supabase
        .from("shared_state")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (cancelled) return;
      if (data?.value !== undefined && data?.value !== null) {
        setValue(data.value as T);
      }
      setReady(true);
    })();

    const channel = supabase
      .channel(`shared_state:${key}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shared_state", filter: `key=eq.${key}` },
        (payload) => {
          const next = (payload.new as { value?: T } | null)?.value;
          if (next !== undefined) setValue(next);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [key]);

  const update = useCallback(
    async (next: T | ((prev: T) => T)) => {
      const uid = uidRef.current ?? (await supabase.auth.getUser()).data.user?.id ?? null;
      if (!uid) return;
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(value) : next;
      setValue(resolved);
      await supabase
        .from("shared_state")
        .upsert(
          { key, value: resolved as never, updated_by: uid, updated_at: new Date().toISOString() },
          { onConflict: "key" },
        );
    },
    [key, value],
  );

  return { value, setValue: update, ready } as { value: T; setValue: (next: T | ((prev: T) => T)) => Promise<void>; ready: boolean };
}
