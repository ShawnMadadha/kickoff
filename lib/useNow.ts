"use client";

import { useEffect, useState } from "react";

/**
 * Ticking "now" that is null until mounted. Returning null on the first render
 * keeps server and client markup identical (no hydration mismatch); the
 * countdown fills in after mount and updates on the interval.
 */
export function useNow(intervalMs = 60000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // First value comes from a timer callback (the allowed "subscribe" pattern),
    // not a synchronous setState in the effect body. ~0ms after mount.
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}
