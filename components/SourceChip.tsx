"use client";

import { useState } from "react";
import { LinkSimple } from "@phosphor-icons/react";
import sourcesData from "@/data/sources.json";

type Source = { claim: string; label: string; url: string };
const sources = sourcesData as Record<string, Source>;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Official Spotify glyph (inline so it stays crisp + works offline).
function SpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="#1DB954" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/**
 * The judge-proof layer: every fact-bearing line carries a tappable source,
 * now badged with the source's REAL logo — Spotify's mark on playlist links,
 * the site's favicon on everything else, with a link-glyph fallback.
 */
export default function SourceChip({ k }: { k: string }) {
  const s = sources[k];
  const [faviconOk, setFaviconOk] = useState(true);
  if (!s) return null;

  const host = hostOf(s.url);
  const isSpotify = host.includes("spotify");

  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      title={s.claim}
      className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-2 py-0.5 text-[10px] font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      {isSpotify ? (
        <SpotifyMark />
      ) : faviconOk && host ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
          alt=""
          width={12}
          height={12}
          className="rounded-[2px]"
          onError={() => setFaviconOk(false)}
        />
      ) : (
        <LinkSimple size={11} weight="bold" aria-hidden />
      )}
      {s.label}
    </a>
  );
}
