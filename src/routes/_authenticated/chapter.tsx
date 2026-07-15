import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/chapter")({
  head: () => ({
    meta: [
      { title: "Choose a chapter · Bayt Nūkhad Noor" },
      {
        name: "description",
        content:
          "Two doors, two chapters — the home that waits, and the family that begins here.",
      },
    ],
  }),
  component: ChapterSelect,
});

function ChapterSelect() {
  return (
    <div
      className="scene vignette relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.04 25) 0%, oklch(0.09 0.03 350) 60%, oklch(0.06 0.02 350) 100%)",
      }}
    >
      {/* Ambient warm glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.55 0.14 25 / 12%), transparent 65%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <motion.p
          className="serif text-[10px] uppercase tracking-[0.6em]"
          style={{ color: "oklch(0.75 0.08 25 / 55%)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
        >
          Bayt Nūkhad Noor
        </motion.p>
        <motion.h1
          className="serif mt-4 italic leading-tight"
          style={{
            fontSize: "clamp(2rem, 5.5vw, 3.6rem)",
            color: "oklch(0.95 0.03 30)",
            textShadow: "0 0 60px oklch(0.72 0.14 15 / 30%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.4 }}
        >
          Where would you like to be?
        </motion.h1>
        <motion.p
          className="serif mt-4 max-w-md text-sm italic"
          style={{ color: "oklch(0.85 0.04 25 / 70%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.4 }}
        >
          Some rooms wait for their time.
          <br />
          Others are already ours.
        </motion.p>

        <div className="mt-14 grid w-full max-w-3xl gap-6 md:grid-cols-2">
          <ChapterCard
            to="/home-doors"
            eyebrow="Our future"
            title="The house is reserved."
            body="A home waits quietly for us. Its lights are warm, its doors are closed — for now."
            delay={2.2}
          />
          <ChapterCard
            to="/family"
            eyebrow="Right now"
            title="Family begins here."
            body="Dreams, our little cat, a photo booth, and the stars we'll watch together."
            delay={2.6}
          />
        </div>
      </div>
    </div>
  );
}

function ChapterCard({
  to,
  eyebrow,
  title,
  body,
  delay,
}: {
  to: "/home-doors" | "/family";
  eyebrow: string;
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay }}
    >
      <Link
        to={to}
        className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-left transition-all duration-500 hover:border-white/25 hover:bg-white/[0.06]"
        style={{
          boxShadow: "0 20px 50px oklch(0 0 0 / 40%)",
        }}
      >
        <p
          className="serif text-[10px] uppercase tracking-[0.5em]"
          style={{ color: "oklch(0.75 0.10 25 / 60%)" }}
        >
          {eyebrow}
        </p>
        <h2
          className="serif mt-3 italic"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            color: "oklch(0.95 0.03 30)",
          }}
        >
          {title}
        </h2>
        <p
          className="serif mt-4 text-sm leading-relaxed"
          style={{ color: "oklch(0.82 0.04 25 / 75%)" }}
        >
          {body}
        </p>
        <p
          className="serif mt-8 text-[10px] uppercase tracking-[0.5em] opacity-60 transition-opacity group-hover:opacity-100"
          style={{ color: "oklch(0.75 0.10 25)" }}
        >
          enter →
        </p>
      </Link>
    </motion.div>
  );
}
