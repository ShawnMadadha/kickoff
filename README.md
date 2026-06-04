<div align="center">

# ⚽ Kickoff

### Get to the match, not the traffic.

**The match-day companion for the FIFA World Cup 26™ in Miami** — routes every fan to the right way into Hard Rock Stadium, in their language, and plugs them into the city's watch-party scene.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Built with Cursor](https://img.shields.io/badge/Built%20with-Cursor-5C5CFF)
![World Cup 26](https://img.shields.io/badge/FIFA%20World%20Cup-26™-1D9E75)

</div>

---

## 🚨 Why this matters

Getting 65,000 fans into Hard Rock Stadium is solved on paper and a disaster in practice. The **2024 Copa América final at this exact venue** ended in a dangerous crowd crush. Miami hosts **7 World Cup matches** (Jun 15 – Jul 18, 2026), the stadium sits in suburban Miami Gardens with no rail at the gates, **there's no stadium parking**, and the shuttle is **ticketholder-only**. Most fans won't know any of that until they're stuck.

**Kickoff fixes the first mile.**

## ✨ Features

| # | Feature | What it does | Status |
|---|---------|--------------|--------|
| 1 | **Schedule** | The 7 real Miami matches — tap one to start | 🟢 must-ship |
| 2 | **Arrival & Transport** | Where you're staying → ranked plan w/ a *computed* "leave by" time, shuttle/Metrorail/Uber, and a "no parking" hard stop | 🟢 must-ship |
| 3 | **Heat Map** | Watch parties + restaurants on one map, hottest zones highlighted | 🟡 high-priority |
| 4 | **Translation** | Spanish & Portuguese, incl. voice in → plan read back | 🔵 delight |
| 5 | **Music** | Spotify playlist per hot zone — the vibe by neighborhood | 🔵 delight |

> **Scope rule:** a polished 3-feature app beats a broken 5-feature one. Features 4–5 are sacrificial — cut first if we're behind. Never cut 1 or 2.

## 🧠 The one rule that keeps us honest

**Departure times are computed in code, never written by an LLM.** The model only translates and fills a template — it can never invent a wrong "leave by" time. Every fact (no parking, ticketholder-only shuttle, 3.5h pre to 1.5h post) ships with a **tappable source link**, so when a judge asks "is this real?", the proof is one tap away. The verified engine lives in [`reference/arrival_router.py`](reference/arrival_router.py) (tested) and is ported to [`lib/arrivalEngine.ts`](lib/arrivalEngine.ts).

## 🚀 Quickstart

```bash
# 1. scaffold the app (we build live at the event)
npx create-next-app@latest kickoff-app --ts --tailwind --app
cd kickoff-app

# 2. pull in the de-risked core + seed data from this repo
cp -r ../kickoff/lib ./lib
cp -r ../kickoff/data ./data

# 3. drop AGENTS.md in the root so Cursor inherits our rules
cp ../kickoff/AGENTS.md ./AGENTS.md

# 4. add your keys
echo "GOOGLE_MAPS_API_KEY=..." >> .env.local
npm run dev
```

## 🗂 Repo structure

```
kickoff/
├── README.md            ← you are here
├── AGENTS.md            ← Cursor project rules (drop in app root)
├── TEAM.md              ← who builds what + per-track task lists
├── data/
│   ├── matches.json     ← the 7 Miami matches (real, seeded)
│   ├── venues.json      ← known WC watch-party venues + coords
│   └── sources.json     ← citable sources for the judge-proof layer
├── lib/
│   ├── types.ts         ← shared types
│   └── arrivalEngine.ts ← deterministic routing core (port of the verified Python)
├── reference/
│   └── arrival_router.py← the tested reference engine
└── docs/
    └── DEMO.md          ← demo runbook + 2-min pitch
```

## 👥 How we work

Three parallel tracks — see [`TEAM.md`](TEAM.md) for task lists.

- **Core** — app shell, schedule, arrival engine, transport *(the demo spine, must work first)*
- **Map** — heat map, watch parties, restaurants *(Google Places + seeded venues)*
- **Delight** — translation/voice + music *(cut first if behind)*

## 🎤 Demo & pitch

Full runbook in [`docs/DEMO.md`](docs/DEMO.md). The arc: open on the Copa crush → live plan ("Brazil fan, Brickell, June 24" → leave by 4:10 PM) → tap a source → Portuguese voice wow → close on the Cursor build-speed time-lapse.

## ⬆️ Push this to GitHub

```bash
gh repo create kickoff --public --source=. --remote=origin --push
# or, manually:
# git remote add origin https://github.com/<you>/kickoff.git && git push -u origin main
```

<div align="center"><sub>Built at the Cursor Miami Hackathon · The DOCK, Wynwood</sub></div>
