"use client";

import venuesData from "@/data/venues.json";

type Venue = {
  name: string;
  type: string;
  neighborhood: string;
  lat: number;
  lng: number;
  free: boolean;
  note: string;
};

const venues = venuesData.venues as Venue[];

// Group seeded venues by neighborhood for a quick scan.
const byHood = venues.reduce<Record<string, Venue[]>>((acc, v) => {
  (acc[v.neighborhood] ??= []).push(v);
  return acc;
}, {});

const TYPE_LABEL: Record<string, string> = {
  fan_festival: "Fan festival",
  watch_party: "Watch party",
  fan_zone: "Fan zone",
};

export default function MapView() {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">Watch parties</h2>
        <p className="text-xs text-muted">
          Where to catch the match around the city.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-dashed border-line bg-card px-4 py-3 text-xs text-muted">
        🗺️ Interactive heat map coming next. The venues below are seeded and
        verified at runtime via Google Places — &ldquo;hot zone&rdquo; intensity
        is <span className="font-medium text-ink">modeled</span>, labeled
        honestly.
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(byHood).map(([hood, list]) => (
          <div key={hood}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
              {hood}
            </p>
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
                      {v.free ? "Free" : "Min spend"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted">
                    {TYPE_LABEL[v.type] ?? v.type} · {v.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
