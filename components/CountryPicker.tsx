"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

export type Country = "mexico" | "portugal" | "usa";

type Entry = {
  id: Country;
  name: string;
  cheer: string;
  bg: string; // flag-color background
  colors: [string, string, string]; // confetti palette
};

const COUNTRIES: Entry[] = [
  {
    id: "mexico",
    name: "México",
    cheer: "¡Vamos México!",
    bg: "linear-gradient(90deg,#006847 0 33.33%,#ffffff 33.33% 66.66%,#ce1126 66.66%)",
    colors: ["#006847", "#ffffff", "#ce1126"],
  },
  {
    id: "portugal",
    name: "Portugal",
    cheer: "Força Portugal!",
    bg: "linear-gradient(90deg,#046a38 0 40%,#da291c 40%)",
    colors: ["#046a38", "#da291c", "#ffd24a"],
  },
  {
    id: "usa",
    name: "USA",
    cheer: "Let's go USA!",
    bg: "repeating-linear-gradient(#b22234 0 7px,#ffffff 7px 14px)",
    colors: ["#3c3b6e", "#b22234", "#ffffff"],
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};
const card: Variants = {
  hidden: { opacity: 0, x: -28, rotate: -2 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 180, damping: 18 },
  },
};

// 14 confetti chips, precomputed (no hydration drift).
const BURST = [
  { x: -130, y: -70, r: 200 },
  { x: 120, y: -100, r: -160 },
  { x: -150, y: 30, r: 120 },
  { x: 150, y: 60, r: -210 },
  { x: 0, y: -140, r: 80 },
  { x: -80, y: 120, r: -110 },
  { x: 90, y: 130, r: 170 },
  { x: 175, y: -20, r: -140 },
  { x: -180, y: -10, r: 150 },
  { x: 40, y: 150, r: -80 },
  { x: -40, y: -130, r: 110 },
  { x: 60, y: -90, r: -190 },
  { x: -110, y: 80, r: 140 },
  { x: 130, y: 20, r: -120 },
];

export default function CountryPicker({
  onPick,
}: {
  onPick: (c: Country | "none") => void;
}) {
  const reduce = useReducedMotion();
  const [burst, setBurst] = useState<Entry | null>(null);

  function pick(c: Entry) {
    if (burst) return;
    setBurst(c);
    window.setTimeout(() => onPick(c.id), reduce ? 0 : 680);
  }

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col justify-center overflow-hidden px-6"
      style={{
        background:
          "radial-gradient(120% 70% at 50% 0%, oklch(26% 0.07 250) 0%, oklch(13% 0.03 255) 60%), var(--color-night)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
      transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] }}
    >
      {/* confetti on pick, in the chosen country's colors */}
      {burst &&
        BURST.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-[2px]"
            style={{ background: burst.colors[i % 3] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3, rotate: p.r }}
            transition={{ duration: 0.68, ease: "easeOut" }}
          />
        ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full"
      >
        <motion.p
          variants={rise}
          className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
        >
          One more thing
        </motion.p>
        <motion.h2
          variants={rise}
          className="mt-1 font-display text-3xl font-black tracking-tight"
        >
          Who are you here for?
        </motion.h2>
        <motion.p variants={rise} className="mb-6 mt-1 text-sm text-muted">
          Pick your side — we&apos;ll make match day yours.
        </motion.p>

        <div className="flex flex-col gap-3">
          {COUNTRIES.map((c, i) => (
            <motion.button
              key={c.id}
              variants={card}
              type="button"
              onClick={() => pick(c)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative h-[88px] w-full overflow-hidden rounded-2xl border border-white/15 outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ background: c.bg }}
            >
              {/* USA blue canton with star-dots */}
              {c.id === "usa" && (
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-[55%] w-[42%]"
                  style={{
                    background: "#3c3b6e",
                    backgroundImage:
                      "radial-gradient(#fff 22%, transparent 24%)",
                    backgroundSize: "11px 11px",
                    backgroundPosition: "3px 3px",
                  }}
                />
              )}
              {/* Portugal armillary nod */}
              {c.id === "portugal" && (
                <span
                  aria-hidden
                  className="absolute left-[40%] top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ffd24a]"
                />
              )}

              {/* animated sheen sweep (the "wave") */}
              <motion.span
                aria-hidden
                className="absolute inset-y-0 w-1/4 -skew-x-12 bg-white/25 blur-md"
                initial={{ x: "-160%" }}
                animate={{ x: "520%" }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.6 + i * 0.35,
                }}
              />

              {/* readability scrim */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.05) 55%, transparent)",
                }}
              />

              <span className="absolute bottom-2.5 left-4 font-display text-2xl font-black text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                {c.name}
              </span>
              <span className="absolute bottom-3 right-12 text-xs font-semibold text-white/85">
                {c.cheer}
              </span>
              <span
                aria-hidden
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm"
              >
                <ArrowRight size={14} weight="bold" />
              </span>
            </motion.button>
          ))}
        </div>

        <motion.button
          variants={rise}
          type="button"
          onClick={() => onPick("none")}
          className="mx-auto mt-5 block text-xs font-medium text-faint underline-offset-2 hover:text-muted hover:underline"
        >
          Just here to get to the match
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
