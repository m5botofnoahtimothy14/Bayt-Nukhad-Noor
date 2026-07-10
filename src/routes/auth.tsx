import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Come inside · Our Universe" }] }),
  component: AuthPage,
});

const VALID_USER = "Khadija Noah";
const VALID_PASS = "ipromisetobeyourman@noah";

function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/world", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (username === VALID_USER && password === VALID_PASS) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: "khadija@ouruniverse.love",
          password: "ipromisetobeyourman@noah",
        });
        if (error) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: "khadija@ouruniverse.love",
            password: "ipromisetobeyourman@noah",
            options: { data: { display_name: "Khadija Noah" } },
          });
          if (signUpError) throw signUpError;
          await supabase.auth.signInWithPassword({
            email: "khadija@ouruniverse.love",
            password: "ipromisetobeyourman@noah",
          });
        }
        navigate({ to: "/world", replace: true });
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
      className="scene vignette"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.20 0.05 350) 0%, oklch(0.14 0.04 5) 60%, oklch(0.10 0.03 350) 100%)",
      }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[15%] left-[20%] w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.14 15 / 12%), transparent 60%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[25%] right-[15%] w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.12 350 / 10%), transparent 55%)",
            animation: "breathe 10s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute top-[50%] left-[60%] w-48 h-48 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.60 0.10 55 / 8%), transparent 50%)",
            animation: "breathe 7s ease-in-out 4s infinite",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={
              {
                width: 1 + (i % 3) * 0.5,
                height: 1 + (i % 3) * 0.5,
                left: `${(i * 5.3) % 100}%`,
                top: `${(i * 4.7) % 100}%`,
                background:
                  i % 3 === 0
                    ? "oklch(0.8 0.12 15 / 40%)"
                    : i % 3 === 1
                      ? "oklch(0.75 0.10 350 / 30%)"
                      : "oklch(0.8 0.08 55 / 35%)",
                animation: `dust-float ${8 + ((i * 1.3) % 10)}s ease-in-out ${(i * 0.8) % 12}s infinite`,
                "--dx": `${-20 + ((i * 7) % 40)}px`,
                "--dy": `${-30 - ((i * 5) % 60)}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div
          className={`w-full max-w-md transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Glass card */}
          <div
            className="glass-panel p-10"
            style={{
              animation: mounted ? "tilt-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
            }}
          >
            {/* Lamp icon */}
            <div className="text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.14 15 / 20%), oklch(0.65 0.12 350 / 15%))",
                  boxShadow: "0 0 30px oklch(0.72 0.14 15 / 15%)",
                  animation: "breathe 4s ease-in-out infinite",
                }}
              >
                <span
                  className="text-3xl"
                  style={{ filter: "drop-shadow(0 0 8px oklch(0.8 0.15 15 / 60%))" }}
                >
                  🪔
                </span>
              </div>
              <h1 className="serif mt-5 text-4xl italic text-foreground">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground serif italic">
                The fire is still warm. Come inside.
              </p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground/70 mb-1.5 serif">
                  Name
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/8 focus:shadow-[0_0_20px_oklch(0.72_0.14_15_/_10%)] placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground/70 mb-1.5 serif">
                  Passphrase
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="The secret word"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/8 focus:shadow-[0_0_20px_oklch(0.72_0.14_15_/_10%)] placeholder:text-muted-foreground/40"
                />
              </div>
              <button
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
                  boxShadow: "0 4px 20px oklch(0.65 0.14 15 / 30%)",
                }}
              >
                {loading ? "..." : "Open the door"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
