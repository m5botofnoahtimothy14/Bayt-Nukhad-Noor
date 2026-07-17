import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Come inside · Bayt Nūkhad Noor" }] }),
  component: AuthPage,
});

const VALID_USER = import.meta.env.VITE_AUTH_USER as string;
const VALID_PASS = import.meta.env.VITE_AUTH_PASS as string;
const AUTH_EMAIL = import.meta.env.VITE_AUTH_EMAIL as string;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD as string;

function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/chapter", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (username === VALID_USER && password === VALID_PASS) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: AUTH_EMAIL,
          password: AUTH_PASSWORD,
        });
        if (error) {
          // If sign-in fails, try to create the account first
          await supabase.auth.signUp({
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD,
            options: { data: { display_name: username } },
          });
          // Now sign in (whether signUp succeeded or user already existed)
          await supabase.auth.signInWithPassword({
            email: AUTH_EMAIL,
            password: AUTH_PASSWORD,
          });
        }
        navigate({ to: "/chapter", replace: true });
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
        setLoading(false);
      }
    } else {
      toast.error("Those credentials don't match our world.");
      setLoading(false);
    }
  };

  return (
    <div
      className="scene vignette scene-3d"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.18 0.05 350) 0%, oklch(0.12 0.04 5) 50%, oklch(0.08 0.03 350) 100%)",
      }}
    >
      {/* Warm ambient light from behind */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] left-[15%] w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.14 15 / 10%), transparent 55%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.12 350 / 8%), transparent 50%)",
            animation: "breathe 10s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute top-[55%] left-[55%] w-56 h-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.60 0.10 55 / 6%), transparent 50%)",
            animation: "breathe 7s ease-in-out 4s infinite",
          }}
        />
      </div>

      {/* Floating light particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={
              {
                width: 0.8 + (i % 3) * 0.4,
                height: 0.8 + (i % 3) * 0.4,
                left: `${(i * 4.1) % 100}%`,
                top: `${(i * 3.7) % 100}%`,
                background:
                  i % 3 === 0
                    ? "oklch(0.8 0.12 15 / 45%)"
                    : i % 3 === 1
                      ? "oklch(0.75 0.10 350 / 35%)"
                      : "oklch(0.8 0.08 55 / 40%)",
                animation: `dust-float ${7 + ((i * 1.3) % 10)}s ease-in-out ${(i * 0.6) % 12}s infinite`,
                "--dx": `${-25 + ((i * 7) % 50)}px`,
                "--dy": `${-40 - ((i * 5) % 70)}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Door silhouette in background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
        <svg width="200" height="280" viewBox="0 0 200 280">
          <rect x="10" y="40" width="180" height="240" rx="4" fill="oklch(0.30 0.05 25)" />
          <path d="M10 40 L100 5 L190 40" fill="oklch(0.25 0.04 20)" />
          <rect x="70" y="120" width="60" height="160" rx="3" fill="oklch(0.20 0.04 15)" />
          <circle cx="120" cy="200" r="3" fill="oklch(0.6 0.08 55 / 40%)" />
          <rect x="30" y="70" width="40" height="30" rx="2" fill="oklch(0.72 0.14 15 / 10%)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div
          className={`w-full max-w-md transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div
            className="glass-panel p-10"
            style={{
              animation: mounted
                ? "tilt-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both"
                : "none",
              boxShadow:
                "0 25px 60px oklch(0 0 0 / 40%), 0 0 40px oklch(0.72 0.14 15 / 5%)",
            }}
          >
            {/* Decorative line */}
            <div className="mx-auto mb-6 h-px w-16" style={{
              background: "linear-gradient(90deg, transparent, oklch(0.72 0.14 15 / 40%), transparent)",
            }} />

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary/50 serif">
                Bayt Nūkhad Noor
              </p>
              <h1 className="serif mt-3 text-4xl italic text-foreground">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-muted-foreground serif italic">
                The fire is still warm. Come inside.
              </p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1.5 serif">
                  Name
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Who are you?"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/8 focus:shadow-[0_0_20px_oklch(0.72_0.14_15_/_8%)] placeholder:text-muted-foreground/30"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1.5 serif">
                  Passphrase
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="The secret word"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/8 focus:shadow-[0_0_20px_oklch(0.72_0.14_15_/_8%)] placeholder:text-muted-foreground/30"
                />
              </div>
              <button
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
                  boxShadow: "0 4px 20px oklch(0.65 0.14 15 / 25%)",
                }}
              >
                {loading ? "..." : "Open the door"}
              </button>
            </form>

            {/* Decorative line */}
            <div className="mx-auto mt-6 h-px w-16" style={{
              background: "linear-gradient(90deg, transparent, oklch(0.72 0.14 15 / 20%), transparent)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
