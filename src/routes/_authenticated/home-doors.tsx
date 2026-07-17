import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/home-doors")({
  head: () => ({
    meta: [
      { title: "Our Home · Bayt Nūkhad Noor" },
      {
        name: "description",
        content: "A home that is not closed — only waiting. A note from Noah beside the door.",
      },
    ],
  }),
  component: HomeDoors,
});

function HomeDoors() {
  const [glow, setGlow] = useState(false);

  return (
    <div
      className="scene vignette relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.10 0.03 265) 0%, oklch(0.08 0.03 350) 60%, oklch(0.05 0.02 350) 100%)",
      }}
    >
      {/* Warm window glow behind doors */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, oklch(0.68 0.14 55 / 20%), transparent 55%)",
        }}
      />

      {/* Floating lantern flecks */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2,
              height: 2,
              left: `${(i * 5.3) % 100}%`,
              top: `${(i * 6.1) % 100}%`,
              background: "oklch(0.85 0.14 55 / 55%)",
              animation: `dust-float ${8 + (i % 5)}s ease-in-out ${i * 0.4}s infinite`,
              ["--dx" as string]: `${-30 + ((i * 9) % 60)}px`,
              ["--dy" as string]: `${-60 - ((i * 7) % 40)}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto]">
          {/* The closed doors */}
          <motion.button
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            onClick={() => setGlow(true)}
            className="relative mx-auto block h-[420px] w-[320px] cursor-pointer rounded-t-3xl md:h-[520px] md:w-[400px]"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.16 0.05 25), oklch(0.10 0.04 20))",
              border: "3px solid oklch(0.28 0.08 25)",
              boxShadow: glow
                ? "0 0 80px oklch(0.68 0.14 55 / 40%), inset 0 0 60px oklch(0 0 0 / 60%)"
                : "0 0 40px oklch(0.42 0.10 25 / 20%), inset 0 0 60px oklch(0 0 0 / 60%)",
              transition: "box-shadow 1.5s ease-out",
            }}
          >
            {/* Center seam */}
            <div
              className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2"
              style={{ background: "oklch(0.35 0.08 25 / 60%)" }}
            />
            {/* Handles */}
            {(["left", "right"] as const).map((side) => (
              <div
                key={side}
                className={`absolute top-1/2 ${side === "left" ? "right-[52%]" : "left-[52%]"} h-12 w-2 -translate-y-1/2 rounded-full`}
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.75 0.10 90), oklch(0.55 0.08 85))",
                  boxShadow: "0 0 8px oklch(0 0 0 / 50%)",
                }}
              />
            ))}
          </motion.button>

          {/* Noah's note */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 2, delay: 1 }}
            className="mx-auto max-w-xs px-8 py-8"
            style={{
              background: "oklch(0.92 0.04 80 / 92%)",
              color: "oklch(0.28 0.08 30)",
              boxShadow: "0 20px 40px oklch(0 0 0 / 40%), 0 0 30px oklch(0.68 0.14 55 / 15%)",
              borderRadius: "4px",
            }}
          >
            <p
              className="serif italic leading-[2] whitespace-pre-line"
              style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)" }}
            >
{`Our Home

This door isn't closed.
It's waiting.

One day…
we'll unlock it together.

Until then,
this home quietly waits for us.

— Noah`}
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
