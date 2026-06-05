"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check, NavigationArrow } from "@phosphor-icons/react";
import venuesData from "@/data/venues.json";
import playlistsData from "@/data/playlists.json";
import matchesData from "@/data/matches.json";
import type { Venue } from "@/lib/types";
import { t, type Language } from "@/lib/i18n";
import { googleDir, appleDir } from "@/lib/directions";
import SourceChip from "./SourceChip";

const venues = venuesData.venues as Venue[];
const stadium = matchesData.venue;
const playlists = playlistsData.playlists as Record<
  string,
  { title: string; url: string; sourceKey: string }
>;
const NEIGHBORHOODS = ["All", ...new Set(venues.map((v) => v.neighborhood))];

const TYPE_LABEL: Record<string, string> = {
  fan_festival: "Fan festival",
  watch_party: "Watch party",
  fan_zone: "Fan zone",
};

// Leaflet touches `window`, so the map is client-only — never server-rendered.
const MapCanvas = dynamic(() => import("./map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center text-xs text-muted">
      Loading map…
    </div>
  ),
});

export default function MapView({ language }: { language: Language }) {
  const [hood, setHood] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [showHeat, setShowHeat] = useState(true);

  const filtered = useMemo(
    () =>
      venues.filter(
        (v) =>
          (hood === "All" || v.neighborhood === hood) &&
          (!freeOnly || v.free),
      ),
    [hood, freeOnly],
  );

  const byHood = useMemo(
    () =>
      filtered.reduce<Record<string, Venue[]>>((acc, v) => {
        (acc[v.neighborhood] ??= []).push(v);
        return acc;
      }, {}),
    [filtered],
  );

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("map", "title", language)}
        </h2>
        <p className="text-xs text-muted">
          {t("map", "subtitle", language)}
        </p>
      </div>

      {/* Neighborhood filter */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {NEIGHBORHOODS.map((n) => {
          const on = hood === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setHood(n)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                on
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line bg-card text-muted hover:text-ink"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Toggles */}
      <div className="mb-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => setFreeOnly((v) => !v)}
          aria-pressed={freeOnly}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            freeOnly
              ? "border-accent bg-accent/15 text-accent"
              : "border-line bg-card text-muted hover:text-ink"
          }`}
        >
          {freeOnly && <Check size={12} weight="bold" aria-hidden />}
          {t("map", "freeOnly", language)}
        </button>
        <button
          type="button"
          onClick={() => setShowHeat((v) => !v)}
          aria-pressed={showHeat}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            showHeat
              ? "border-accent bg-accent/15 text-accent"
              : "border-line bg-card text-muted hover:text-ink"
          }`}
        >
          {showHeat && <Check size={12} weight="bold" aria-hidden />}
          {t("map", "heat", language)}
        </button>
      </div>

      {/* Map */}
      <div className="mb-2 h-72 overflow-hidden rounded-xl border border-line">
        <MapCanvas venues={filtered} showHeat={showHeat} />
      </div>
      <p className="mb-2 text-[10px] text-muted/80">
        {t("map", "legend", language)}
      </p>

      {/* Turn-by-turn hand-off to the stadium */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2">
        <NavigationArrow size={16} weight="fill" className="shrink-0 text-accent" />
        <span className="text-xs font-semibold">Directions to Hard Rock Stadium</span>
        <div className="ml-auto flex gap-1.5">
          <a
            href={googleDir(stadium.lat, stadium.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line bg-card-2 px-2.5 py-1 text-[10px] font-semibold text-ink hover:border-accent/50"
          >
            Google
          </a>
          <a
            href={appleDir(stadium.lat, stadium.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line bg-card-2 px-2.5 py-1 text-[10px] font-semibold text-ink hover:border-accent/50"
          >
            Apple
          </a>
        </div>
      </div>

      {/* Filtered list — also the fallback if map tiles fail on venue wifi */}
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
          {t("map", "empty", language)}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(byHood).map(([h, list]) => {
            const playlist = playlists[h];
            return (
            <div key={h}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {h}
                </p>
                {playlist && (
                  <a
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-[10px] font-semibold text-muted transition-colors hover:border-[#1DB954]/60 hover:text-ink"
                    title={playlist.title}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="#1DB954" aria-hidden>
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    {t("map", "playlist", language)}
                  </a>
                )}
              </div>
              <ul className="flex flex-col gap-2">
                {list.map((v) => (
                  <li
                    key={v.name}
                    className="rounded-xl border border-line bg-card p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{v.name}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          v.free
                            ? "bg-accent/15 text-accent"
                            : "bg-card-2 text-muted"
                        }`}
                      >
                        {v.free
                          ? t("map", "free", language)
                          : t("map", "minSpend", language)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">
                      {TYPE_LABEL[v.type] ?? v.type} · {v.note}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px]">
                      <span className="text-muted/70">Directions:</span>
                      <a
                        href={googleDir(v.lat, v.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-accent hover:underline"
                      >
                        Google
                      </a>
                      <span className="text-line">·</span>
                      <a
                        href={appleDir(v.lat, v.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-accent hover:underline"
                      >
                        Apple
                      </a>
                    </div>
                    {playlist && (
                      <div className="mt-2">
                        <SourceChip k={playlist.sourceKey} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
