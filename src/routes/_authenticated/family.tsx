import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PhotoBooth } from "@/components/memories-room/PhotoBooth";


export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({
    meta: [
      { title: "The Family · Bayt Nūkhad Noor" },
      {
        name: "description",
        content:
          "The Family chapter — dreams, our little cat, a bucket list, a memory booth, and the observatory.",
      },
    ],
  }),
  component: FamilyChapter,
});

const dreams = [
  "If God wills… a small home with a warm kitchen and a garden.",
  "Maybe one day… mornings in Kyoto, evenings in Seville.",
  "I hope… we build small traditions no one else will understand.",
  "If God wills… a life where quiet is enough.",
  "Maybe one day… we'll grow old on the same porch.",
];

const bucket = [
  "Watch the sunrise together",
  "Cook breakfast, no phones",
  "Visit Japan in spring",
  "Build our first home",
  "Adopt another cat",
  "Plant a tree",
  "Watch a meteor shower",
  "Travel somewhere without a plan",
  "Grow old together",
];

function FamilyChapter() {
  return (
    <div
      className="scene relative min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.04 25) 0%, oklch(0.09 0.03 350) 100%)",
        color: "oklch(0.92 0.03 30)",
      }}
    >
      {/* Hero */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="serif text-[10px] uppercase tracking-[0.6em]"
          style={{ color: "oklch(0.75 0.08 25 / 55%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          Chapter one
        </motion.p>
        <motion.h1
          className="serif mt-4 italic leading-tight"
          style={{
            fontSize: "clamp(2.4rem, 7vw, 5rem)",
            textShadow: "0 0 60px oklch(0.72 0.14 15 / 30%)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, delay: 0.4 }}
        >
          The Family
        </motion.h1>
        <motion.p
          className="serif mt-6 max-w-lg text-base italic md:text-lg"
          style={{ color: "oklch(0.85 0.04 25 / 75%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.6 }}
        >
          A little life already exists between us.
          <br />
          Come sit with it a while.
        </motion.p>
      </section>

      {/* Our Dreams */}
      <Section eyebrow="I. Our Dreams" title="Dreams, not goals.">
        <div className="mx-auto max-w-2xl space-y-8">
          {dreams.map((d, i) => (
            <motion.p
              key={i}
              className="serif text-lg italic leading-relaxed md:text-xl"
              style={{ color: "oklch(0.88 0.04 25 / 85%)" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, delay: i * 0.15 }}
            >
              {d}
            </motion.p>
          ))}
        </div>
      </Section>

      {/* Our Little Family */}
      <Section eyebrow="II. Our Little Family" title="A cat, a shared quiet.">
        <div className="mx-auto max-w-xl text-center">
          <motion.div
            className="mx-auto mb-8 text-6xl"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
          >
            🐈
          </motion.div>
          <p
            className="serif text-base italic leading-relaxed md:text-lg"
            style={{ color: "oklch(0.85 0.04 25 / 80%)" }}
          >
            Mochi is the first member of our little family.
            She sleeps in the sunlight, watches butterflies,
            and — occasionally — decides we deserve her attention.
          </p>
        </div>
      </Section>

      {/* Bucket List */}
      <Section eyebrow="III. The Bucket List" title="Little dreams, torn from a notebook.">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bucket.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 24, rotate: (i % 2 === 0 ? -1 : 1) * 1.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1, delay: i * 0.08 }}
              className="serif px-6 py-8 italic"
              style={{
                background: "oklch(0.94 0.04 80 / 92%)",
                color: "oklch(0.28 0.08 30)",
                boxShadow: "0 15px 30px oklch(0 0 0 / 30%)",
                borderRadius: "2px",
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.5}deg)`,
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-50">
                Someday
              </p>
              <p className="mt-2 text-lg leading-snug">{item}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Memory Booth teaser */}
      <Section eyebrow="IV. The Memory Booth" title="Three… two… one.">
        <div className="mx-auto max-w-lg text-center">
          <p
            className="serif text-base italic leading-relaxed md:text-lg"
            style={{ color: "oklch(0.85 0.04 25 / 80%)" }}
          >
            A little wooden booth waits in the corner of the house.
            Soft curtains, a warm lamp, and a camera that develops photographs slowly —
            the way memories should form.
          </p>
          <p
            className="serif mt-6 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: "oklch(0.75 0.10 25 / 60%)" }}
          >
            coming soon to the album
          </p>
        </div>
      </Section>

      {/* Observatory teaser */}
      <Section eyebrow="V. The Observatory" title="The quietest room in the house.">
        <div className="mx-auto max-w-lg text-center">
          <p
            className="serif text-base italic leading-relaxed md:text-lg"
            style={{ color: "oklch(0.85 0.04 25 / 80%)" }}
          >
            Floor-to-ceiling windows. A telescope. A warm desk lamp.
            A cat sleeping nearby, and slow music that never asks to be turned up.
          </p>
          <p
            className="serif mt-6 text-[10px] uppercase tracking-[0.5em]"
            style={{ color: "oklch(0.75 0.10 25 / 60%)" }}
          >
            stay a while — she opens up when you're still
          </p>
        </div>
      </Section>

      <div className="flex justify-center py-16">
        <Link
          to="/chapter"
          className="serif text-[10px] uppercase tracking-[0.5em] opacity-60 hover:opacity-100"
          style={{ color: "oklch(0.85 0.05 25)" }}
        >
          ← back to the doors
        </Link>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <motion.p
        className="serif mb-3 text-center text-[10px] uppercase tracking-[0.6em]"
        style={{ color: "oklch(0.75 0.08 25 / 55%)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="serif mb-16 text-center italic"
        style={{
          fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
          color: "oklch(0.95 0.03 30)",
        }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      >
        {title}
      </motion.h2>
      {children}
    </section>
  );
}
