# TEAM.md — who builds what

Three parallel tracks. Core must work end-to-end before anyone polishes delight.

## Track A — Core  (owner: Shawn)
- [ ] App shell + tab nav (Schedule | Plan | Map | Voice)
- [ ] Schedule tab from `data/matches.json` — tap a match → Plan
- [ ] Port `lib/arrivalEngine.ts` into the app; wire origin picker → ranked plan
- [ ] Source chips on every fact (from `data/sources.json`), tap to open
- [ ] Drive = red hard-stop card
- [ ] Uber = deep link with destination prefilled (NOT the full API)

## Track B — Map
- [ ] Map tab (react-leaflet or Google Maps JS)
- [ ] Pin watch parties + restaurants from `data/venues.json` + Google Places
- [ ] Filter by neighborhood / team
- [ ] "Heat" overlay on busiest zones — SEEDED intensity, labeled modeled
- [ ] Cache all Places results (no live calls during the demo)

## Track C — Delight  (cut first if behind)
- [ ] EN / ES / PT toggle on the Plan + Map
- [ ] Voice: STT → translate → fill the SAME engine template (never regenerate the time)
- [ ] Spotify playlist embed per neighborhood/team, linked from map hot zones

## Shared
- [ ] Deploy to Vercel early; get the URL before "building" starts
- [ ] Record a fallback demo video by the 80% mark
- [ ] Rehearse the 2-min pitch (see docs/DEMO.md)
