"use client";

import { useEffect, useState } from "react";
import { subscribeDemo, isDemoActive, demoNow } from "./demoClock";

/**
 * Ticking "now" that is null until mounted. Returning null on the first render
 * keeps server and client markup identical (no hydration mismatch); the
 * countdown fills in after mount and updates on the interval. When the demo
 * clock is active it returns the time-shifted "now" and re-renders on toggle.
 */
export function useNow(intervalMs = 30000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const read = () => (isDemoActive() ? demoNow() : new Date());
    // First value comes from a timer callback (the allowed "subscribe" pattern),
    // not a synchronous setState in the effect body.
    const first = setTimeout(() => setNow(read()), 0);
    const id = setInterval(() => setNow(read()), intervalMs);
    const unsub = subscribeDemo(() => setNow(read()));
    return () => {
      clearTimeout(first);
      clearInterval(id);
      unsub();
    };
  }, [intervalMs]);
  return now;
}
