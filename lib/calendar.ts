// Builds a real .ics calendar event from a computed arrival option. The event
// starts at the engine-computed leave-by time (ET) and carries a VALARM that
// fires on match day — so the "leave by 4:10 PM" becomes an actual reminder.
import type { Match, Origin, ArrivalOption } from "./types";
import { leaveByClock } from "./arrivalEngine";
import sourcesData from "@/data/sources.json";

const sources = sourcesData as Record<
  string,
  { claim: string; label: string; url: string }
>;
const STADIUM = "Hard Rock Stadium, Miami Gardens FL";

const pad = (n: number) => String(n).padStart(2, "0");

function icsEscape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// RFC 5545: content lines SHOULD be folded at 75 octets; continuations
// start with a single space. Our fields are ASCII, so char length ≈ octets.
function fold(line: string): string {
  if (line.length <= 73) return line;
  const out = [line.slice(0, 73)];
  let rest = line.slice(73);
  while (rest.length > 72) {
    out.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  if (rest.length) out.push(" " + rest);
  return out.join("\r\n");
}

function utcStamp(d = new Date()): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Returns ICS text, or null when there's no kickoff time yet (knockouts). */
export function buildIcs(
  match: Match,
  origin: Origin,
  option: ArrivalOption,
): string | null {
  const clock = leaveByClock(match.kickoff, option.transitEstimateMin ?? 0);
  if (!clock) return null;

  const [y, m, d] = match.date.split("-").map(Number);
  const dateStr = `${y}${pad(m)}${pad(d)}`;
  const startT = `${pad(clock.hh)}${pad(clock.mm)}00`;
  const endTotal = clock.hh * 60 + clock.mm + 30; // 30-min "leave now" window
  const endT = `${pad(Math.floor(endTotal / 60) % 24)}${pad(endTotal % 60)}00`;

  const srcUrls = (option.sourceKeys ?? [])
    .map((k) => sources[k]?.url)
    .filter(Boolean);
  const description = icsEscape(
    `${option.method}${option.sub ? " — " + option.sub : ""}. ` +
      `Arrive ~75 min before the ${match.kickoff} ET kickoff for walk + security. ` +
      `No parking at the stadium — shuttle/transit only.` +
      (srcUrls.length ? ` Sources: ${srcUrls.join(" ")}` : ""),
  );

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kickoff//WC26 Miami//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:America/New_York",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0400",
    "TZNAME:EDT",
    "DTSTART:20260308T020000",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${dateStr}-${startT}-${origin.replace(/\s/g, "")}@kickoff`,
    `DTSTAMP:${utcStamp()}`,
    `DTSTART;TZID=America/New_York:${dateStr}T${startT}`,
    `DTEND;TZID=America/New_York:${dateStr}T${endT}`,
    `SUMMARY:${icsEscape(`Leave for ${match.fixture} (${option.method})`)}`,
    `LOCATION:${icsEscape(`${origin} -> ${STADIUM}`)}`,
    `DESCRIPTION:${description}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(`Time to leave for ${match.fixture}`)}`,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(fold).join("\r\n");
}

/** Triggers a client-side download of an .ics file. */
export function downloadIcs(filename: string, ics: string): void {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
