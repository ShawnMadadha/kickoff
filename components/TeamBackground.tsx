"use client";

import { motion } from "motion/react";
import type { Country } from "./CountryPicker";

// National-color ambience. Subtle, drifting blurred blobs so the chosen
// country tints the whole app without hurting text/card readability.
const PALETTE: Record<Country, [string, string, string]> = {
  mexico: ["#006847", "#ce1126", "#0a8f5e"],
  portugal: ["#046a38", "#da291c", "#ffd24a"],
  usa: ["#2b50a0", "#b22234", "#3c3b6e"],
};

export default function TeamBackground({
  team,
}: {
  team: Country | "none" | null;
}) {
  if (!team || team === "none") return null;
  const c = PALETTE[team];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-24 -top-16 h-80 w-80 rounded-full blur-3xl"
        style={{ background: c[0], opacity: 0.38 }}
        animate={{ x: [0, 50, -10, 0], y: [0, 36, 70, 0], scale: [1, 1.25, 1.05, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-28 top-1/4 h-[22rem] w-[22rem] rounded-full blur-3xl"
        style={{ background: c[1], opacity: 0.34 }}
        animate={{ x: [0, -34, 12, 0], y: [0, 46, -24, 0], scale: [1, 1.18, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 left-1/5 h-72 w-72 rounded-full blur-3xl"
        style={{ background: c[2], opacity: 0.3 }}
        animate={{ x: [0, 28, -28, 0], y: [0, -28, 12, 0], scale: [1, 1.22, 1, 1] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
