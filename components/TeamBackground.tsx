"use client";

import { motion } from "motion/react";
import type { Country } from "./CountryPicker";
import { TEAMS } from "@/lib/teams";

/**
 * The chosen country's flag, waving in the background of the whole app.
 * Pure CSS/motion (no SVG filter, so it always renders): the flag gradient
 * gently skews while a band of "fabric fold" light/shadow sweeps across it,
 * reading as a wave. A dark scrim keeps UI text readable over the white bands.
 */
export default function TeamBackground({
  team,
}: {
  team: Country | "none" | null;
}) {
  if (!team || team === "none") return null;
  const flag = TEAMS[team].flag;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* the flag, gently waving */}
      <motion.div
        className="absolute -inset-[8%]"
        style={{ background: flag, opacity: 0.5 }}
        animate={{ skewY: [-1.2, 1.2, -1.2], scaleY: [1, 1.04, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* moving fabric folds = the ripple */}
      <motion.div
        className="absolute -inset-[8%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.24) 46px, rgba(255,255,255,0.06) 80px, rgba(0,0,0,0) 122px)",
        }}
        animate={{ backgroundPositionX: ["0px", "244px"] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "linear" }}
      />

      {/* readability scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(13% 0.03 255 / 0.6), oklch(13% 0.03 255 / 0.66))",
        }}
      />
    </div>
  );
}
