// Demo clock — lets the presenter jump "now" to match day so the honest
// countdown reads "leave in 12 min" live on stage instead of "in 19d".
// It still ticks forward from a real anchor (no frozen fake), so the spirit of
// the never-fabricated countdown holds: it's a real clock, just time-shifted.
type DemoState = { active: boolean; fakeNowMs: number; realStartMs: number };

let state: DemoState = { active: false, fakeNowMs: 0, realStartMs: 0 };
const subs = new Set<() => void>();

function emit() {
  for (const f of subs) f();
}

export function subscribeDemo(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function isDemoActive(): boolean {
  return state.active;
}

/** Current demo "now", advancing in real time from the jumped anchor. */
export function demoNow(): Date {
  return new Date(state.fakeNowMs + (Date.now() - state.realStartMs));
}

export function enterDemo(fakeNowMs: number): void {
  state = { active: true, fakeNowMs, realStartMs: Date.now() };
  emit();
}

export function exitDemo(): void {
  state = { active: false, fakeNowMs: 0, realStartMs: 0 };
  emit();
}
