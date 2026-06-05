"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check } from "@phosphor-icons/react";
import venuesData from "@/data/venues.json";
import playlistsData from "@/data/playlists.json";
import type { Venue } from "@/lib/types";
import { t, type Language } from "@/lib/i18n";
import SourceChip from "./SourceChip";

const venues = venuesData.venues as Venue[];
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
      <p className="mb-4 text-[10px] text-muted/80">
        {t("map", "legend", language)}
      </p>

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
                    className="shrink-0 rounded-full border border-line bg-card px-2.5 py-1 text-[10px] font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent"
                    title={playlist.title}
                  >
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
