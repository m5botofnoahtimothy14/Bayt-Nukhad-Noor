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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="serif text-7xl text-foreground">Lost in the woods</h1>
        <p className="mt-4 text-muted-foreground">This corner of the world doesn't exist yet.</p>
        <a href="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-primary-foreground">Return home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="serif text-3xl text-foreground">The lantern went out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something stirred in the dark. Let's try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-primary-foreground"
        >Relight</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Our Universe — a shared home for two" },
      { name: "description", content: "A small living world for two people who are apart. A cabin, a garden, a lake, and a cat who is always waiting." },
      { name: "theme-color", content: "#3d2a1e" },
      { property: "og:title", content: "Our Universe — a shared home for two" },
      { property: "og:description", content: "A small living world for two people who are apart. A cabin, a garden, a lake, and a cat who is always waiting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Our Universe — a shared home for two" },
      { name: "twitter:description", content: "A small living world for two people who are apart. A cabin, a garden, a lake, and a cat who is always waiting." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46a9e606-4aae-459a-88ac-b4ef591da4e9/id-preview-b0573161--b7f555b4-3d27-42b3-822f-a792e403b595.lovable.app-1783698194558.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46a9e606-4aae-459a-88ac-b4ef591da4e9/id-preview-b0573161--b7f555b4-3d27-42b3-822f-a792e403b595.lovable.app-1783698194558.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Nunito:wght@400;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
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
    return () => { sub.subscription.unsubscribe(); };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-center" toastOptions={{ style: { background: "hsl(30 20% 15%)", color: "hsl(40 40% 92%)", border: "1px solid hsl(30 20% 30%)" } }} />
    </QueryClientProvider>
  );
}
