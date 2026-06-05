"use client";

import { LinkSimple } from "@phosphor-icons/react";
import sourcesData from "@/data/sources.json";

type Source = { claim: string; label: string; url: string };
const sources = sourcesData as Record<string, Source>;

/**
 * The judge-proof layer: every fact-bearing line carries a tappable source.
 * `k` is a key into data/sources.json. Unknown keys render nothing.
 */
export default function SourceChip({ k }: { k: string }) {
  const s = sources[k];
  if (!s) return null;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      title={s.claim}
      className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-2 py-0.5 text-[10px] font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      <LinkSimple size={11} weight="bold" aria-hidden />
      {s.label}
    </a>
  );
}
