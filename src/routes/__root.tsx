import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, oklch(0.25 0.05 350), oklch(0.12 0.03 5))",
      }}
    >
      <div className="max-w-md text-center" style={{ animation: "fade-up 0.8s ease-out both" }}>
        <h1
          className="serif text-7xl italic text-foreground"
          style={{ textShadow: "0 0 40px oklch(0.72 0.14 15 / 20%)" }}
        >
          Lost in the woods
        </h1>
        <p className="mt-4 text-muted-foreground">This corner of the world doesn't exist yet.</p>
        <a
          href="/"
          className="mt-8 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
          }}
        >
          Return home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "root" });
  }, [error]);
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, oklch(0.25 0.05 350), oklch(0.12 0.03 5))",
      }}
    >
      <div className="max-w-md text-center" style={{ animation: "fade-up 0.8s ease-out both" }}>
        <h1 className="serif text-3xl italic text-foreground">The lantern went out</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something stirred in the dark. Let's try again.
        </p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, oklch(0.72 0.14 15), oklch(0.60 0.14 350))",
          }}
        >
          Relight
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bayt Nūkhad Noor — a shared home for two" },
      {
        name: "description",
        content:
          "A living digital home shared between Noah and Khadija. A cabin, a garden, a balcony beneath the stars, and a cat who is always waiting.",
      },
      { name: "theme-color", content: "#2a1520" },
      { property: "og:title", content: "Bayt Nūkhad Noor — a shared home for two" },
      {
        property: "og:description",
        content:
          "A living digital home shared between Noah and Khadija. A cabin, a garden, a balcony beneath the stars, and a cat who is always waiting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Bayt Nūkhad Noor — a shared home for two" },
      {
        name: "twitter:description",
        content:
          "A living digital home shared between Noah and Khadija. A cabin, a garden, a balcony beneath the stars, and a cat who is always waiting.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Nunito:wght@400;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.20 0.04 350 / 95%)",
            color: "oklch(0.95 0.02 20)",
            border: "1px solid oklch(0.35 0.05 350 / 30%)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 30px oklch(0 0 0 / 30%)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
