"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  SoccerBall,
  AppleLogo,
  GoogleLogo,
  ArrowRight,
} from "@phosphor-icons/react";

const WORD = "KICKOFF".split("");

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};
const letter: Variants = {
  hidden: { opacity: 0, y: 46, rotateX: -90 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 240, damping: 20 },
  },
};

// Precomputed so server and client render the same burst (no hydration drift).
const PARTICLES = [
  { x: -120, y: -90, r: 200, c: "var(--color-accent)" },
  { x: 110, y: -110, r: -160, c: "var(--color-rush)" },
  { x: -150, y: 40, r: 120, c: "#fff" },
  { x: 140, y: 70, r: -220, c: "var(--color-accent)" },
  { x: 0, y: -150, r: 90, c: "var(--color-rush)" },
  { x: -70, y: 130, r: -100, c: "#86c257" },
  { x: 80, y: 140, r: 180, c: "var(--color-accent)" },
  { x: 170, y: -30, r: -140, c: "#fff" },
  { x: -180, y: -20, r: 160, c: "var(--color-rush)" },
  { x: 30, y: 160, r: -90, c: "var(--color-accent)" },
];

export default function LoginScreen({ onEnter }: { onEnter: () => void }) {
  const reduce = useReducedMotion();
  const [bursting, setBursting] = useState(false);
  const [email, setEmail] = useState("");

  function enter() {
    if (bursting) return;
    setBursting(true);
    window.setTimeout(onEnter, reduce ? 0 : 620);
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-7"
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, oklch(28% 0.08 250) 0%, oklch(13% 0.03 255) 60%), var(--color-night)",
      }}
      initial={false}
      exit={{ opacity: 0, scale: 1.12, filter: "blur(14px)" }}
      transition={{ duration: 0.6, ease: [0.7, 0, 0.84, 0] }}
    >
      {/* aurora — drifting blurred blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-accent/30 blur-3xl"
        animate={{ x: [0, 40, -10, 0], y: [0, 30, 60, 0], scale: [1, 1.25, 1.05, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-rush/25 blur-3xl"
        animate={{ x: [0, -30, 10, 0], y: [0, 40, -20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 h-52 w-52 rounded-full bg-accent/20 blur-3xl"
        animate={{ x: [0, 25, -25, 0], y: [0, -25, 10, 0], scale: [1, 1.2, 1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* confetti burst on kick-off */}
      {bursting &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-[38%] h-2.5 w-2.5 rounded-[2px]"
            style={{ background: p.c }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3, rotate: p.r }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        ))}

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-[320px] flex-col items-center"
      >
        {/* mark with pulsing glow ring */}
        <motion.div variants={rise} className="relative mb-5">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-2xl bg-accent/40 blur-xl"
            animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.18, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative grid h-[68px] w-[68px] place-items-center rounded-2xl bg-gradient-to-br from-accent to-[oklch(70%_0.1_195)] text-accent-ink shadow-lg shadow-accent/30">
            <SoccerBall size={38} weight="fill" aria-hidden />
          </span>
        </motion.div>

        {/* KICKOFF wordmark — letters spring in */}
        <div
          className="mb-1.5 flex font-display text-[40px] font-black leading-none tracking-tight"
          style={{ perspective: 600 }}
          aria-label="Kickoff"
        >
          {WORD.map((ch, i) => (
            <motion.span key={i} variants={letter} className="inline-block">
              {ch}
            </motion.span>
          ))}
        </div>
        <motion.p variants={rise} className="mb-7 text-sm text-muted">
          Get to the match, not the traffic.
        </motion.p>

        {/* fake login */}
        <motion.button
          variants={rise}
          type="button"
          onClick={enter}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink font-medium text-night transition-transform active:scale-[0.98]"
        >
          <AppleLogo size={18} weight="fill" aria-hidden />
          Continue with Apple
        </motion.button>
        <motion.button
          variants={rise}
          type="button"
          onClick={enter}
          className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-card font-medium text-ink transition-colors hover:border-accent/50 active:scale-[0.98]"
        >
          <GoogleLogo size={18} weight="bold" aria-hidden />
          Continue with Google
        </motion.button>

        <motion.div variants={rise} className="my-4 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[11px] uppercase tracking-wider text-faint">or</span>
          <span className="h-px flex-1 bg-line" />
        </motion.div>

        <motion.form
          variants={rise}
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            enter();
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mb-2.5 h-12 w-full rounded-2xl border border-line bg-night-2 px-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
          />
          <motion.button
            type="submit"
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-accent py-3.5 font-display text-base font-bold text-accent-ink active:scale-[0.98]"
            animate={{
              boxShadow: [
                "0 0 0 0 oklch(82% 0.13 195 / 0)",
                "0 0 28px 3px oklch(82% 0.13 195 / 0.55)",
                "0 0 0 0 oklch(82% 0.13 195 / 0)",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* sheen sweep */}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/25 blur-md"
              initial={{ x: "-150%" }}
              animate={{ x: "350%" }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Kick off
              <ArrowRight size={18} weight="bold" aria-hidden />
            </span>
          </motion.button>
        </motion.form>

        <motion.p variants={rise} className="mt-5 text-center text-[11px] text-faint">
          Demo — no account needed. Any button kicks you in.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
