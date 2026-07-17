import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const LazyFamilyWorld = lazy(() =>
  import("@/components/family/FamilyWorld").then((m) => ({ default: m.FamilyWorld })),
);

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
  component: FamilyPage,
});

function FamilyPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-[oklch(0.15_0.04_265)]">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <p className="serif italic text-lg text-muted-foreground/70">
              opening the family chapter…
            </p>
          </div>
        }
      >
        <LazyFamilyWorld onExit={() => navigate({ to: "/chapter" })} />
      </Suspense>
    </div>
  );
}
