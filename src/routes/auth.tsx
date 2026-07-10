import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Come inside · Our Universe" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/world", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Welcome home. Check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/world", replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally { setLoading(false); }
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error(result.error.message); setLoading(false); return; }
    if (result.redirected) return;
    navigate({ to: "/world", replace: true });
  };

  return (
    <div className="scene vignette" style={{
      background: "linear-gradient(180deg, oklch(0.3 0.05 40) 0%, oklch(0.18 0.03 45) 100%)",
    }}>
      {/* soft dust */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.78 0.15 60 / 40%), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.5 0.1 30 / 30%), transparent 50%)",
      }} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card/60 p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15" style={{ animation: "breathe 4s ease-in-out infinite" }}>
              <span className="text-2xl">🪔</span>
            </div>
            <h1 className="serif mt-4 text-3xl italic">{mode === "in" ? "Welcome back" : "Come inside"}</h1>
            <p className="mt-1 text-sm text-muted-foreground serif italic">
              {mode === "in" ? "The fire is still warm." : "The door is open for you."}
            </p>
          </div>

          <button onClick={google} disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background/40 py-2.5 text-sm hover:bg-background/70 transition">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .5 4.1 1.5L19 3.6C17.1 1.9 14.7 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.5 2.7C6 7.5 8.8 5 12 5z"/><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.4-1.1 2.6-2.4 3.4l3.7 2.9c2.2-2 3.5-5 3.5-8.5z"/><path fill="#FBBC05" d="M5.1 14.3c-.3-.8-.4-1.6-.4-2.3s.1-1.5.4-2.3L1.6 7c-.9 1.7-1.4 3.7-1.4 5.7s.5 4 1.4 5.7l3.5-2.7z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.7-2.9c-1 .7-2.3 1.1-3.6 1.1-3.2 0-5.9-2.5-6.9-5.7L1.6 16C3.5 20.4 7.4 23 12 23z"/></svg>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border"/>or<div className="h-px flex-1 bg-border"/>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "up" && (
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
                className="w-full rounded-lg border border-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60"/>
            )}
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
              className="w-full rounded-lg border border-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60"/>
            <input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"
              className="w-full rounded-lg border border-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60"/>
            <button disabled={loading} className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:brightness-110 transition disabled:opacity-60">
              {loading ? "…" : mode === "in" ? "Open the door" : "Move in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "in" ? "New here?" : "Already have a key?"}{" "}
            <button onClick={()=>setMode(m => m === "in" ? "up" : "in")} className="text-primary hover:underline">
              {mode === "in" ? "Create your world" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
