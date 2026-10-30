// Event times. All events are in Cambodia time (UTC+7, no daylight saving).
// Pure functions: used at build time, in the browser and in tests.

export const CAMBODIA_OFFSET = "+07:00";
const DEFAULT_LENGTH_HOURS = 2;
const HOUR = 3_600_000;

export type EventTimes = {
  startDate: string;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
};

function validTime(time?: string | null) {
  const t = time?.trim();
  return t && /^\d{1,2}:\d{2}$/.test(t) ? t.padStart(5, "0") : null;
}

export function isAllDay(e: EventTimes) {
  return !validTime(e.startTime);
}

export function eventStart(e: EventTimes): Date {
  return new Date(`${e.startDate}T${validTime(e.startTime) ?? "00:00"}:00${CAMBODIA_OFFSET}`);
}

/** End of the event; all-day events end at midnight after the last day. */
export function eventEnd(e: EventTimes): Date {
  const day = e.endDate || e.startDate;
  const end = validTime(e.endTime);
  if (end) return new Date(`${day}T${end}:00${CAMBODIA_OFFSET}`);
  if (!isAllDay(e) && !e.endDate) {
    return new Date(eventStart(e).getTime() + DEFAULT_LENGTH_HOURS * HOUR);
  }
  return new Date(new Date(`${day}T00:00:00${CAMBODIA_OFFSET}`).getTime() + 24 * HOUR);
}

export function isPast(e: EventTimes, now: Date = new Date()) {
  return eventEnd(e).getTime() < now.getTime();
}

/** Upcoming soonest first; past most recent first. */
export function splitEvents<T extends EventTimes>(events: T[], now: Date = new Date()) {
  return {
    upcoming: events.filter((e) => !isPast(e, now)),
    past: events.filter((e) => isPast(e, now)).reverse(),
  };
}

function formatter(locale: "en" | "km", options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale === "km" ? "km-KH" : "en-GB", {
    timeZone: "Asia/Phnom_Penh",
    ...options,
  });
}

/** Month and day for the date block, in Cambodia time. */
export function dateBlock(e: EventTimes, locale: "en" | "km") {
  const start = eventStart(e);
  const month = formatter(locale, { month: "short" }).format(start);
  return {
    month: locale === "en" ? month.toUpperCase() : month,
    day: formatter(locale, { day: "numeric" }).format(start),
  };
}

/** e.g. "Sat, 28 Nov 2026 · 14:00–16:00". */
export function formatEventWhen(e: EventTimes, locale: "en" | "km") {
  const date = formatter(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  let text = date.format(eventStart(e));
  if (e.endDate && e.endDate !== e.startDate) {
    text += ` – ${date.format(new Date(`${e.endDate}T00:00:00${CAMBODIA_OFFSET}`))}`;
  }
  const start = validTime(e.startTime);
  const end = validTime(e.endTime);
  if (start) text += ` · ${start}${end ? `–${end}` : ""}`;
  return text;
}

// ---------- iCalendar (RFC 5545) ----------

const encoder = new TextEncoder();
const icsDateTime = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const icsDay = (isoDay: string) => isoDay.replace(/-/g, "");

function icsEscape(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Lines longer than 75 octets are folded onto continuation lines that start with a space. */
function fold(line: string) {
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const n = encoder.encode(char).length;
    const limit = parts.length ? 74 : 75; // continuation lines lose one octet to the space
    if (size + n > limit) {
      parts.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += n;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function eventToIcs(
  e: EventTimes & {
    slug: string;
    title: string;
    description?: string;
    location?: string;
    url: string;
  },
  now: Date = new Date(),
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Book in Cambodia//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.slug}@bookincambodia.org`,
    `DTSTAMP:${icsDateTime(now)}`,
  ];
  if (isAllDay(e)) {
    // DTEND is exclusive: the day after the last day, as a Cambodian calendar date.
    const lastDay = new Date(`${e.endDate || e.startDate}T00:00:00Z`);
    const dayAfter = new Date(lastDay.getTime() + 24 * HOUR).toISOString().slice(0, 10);
    lines.push(`DTSTART;VALUE=DATE:${icsDay(e.startDate)}`, `DTEND;VALUE=DATE:${icsDay(dayAfter)}`);
  } else {
    lines.push(`DTSTART:${icsDateTime(eventStart(e))}`, `DTEND:${icsDateTime(eventEnd(e))}`);
  }
  lines.push(`SUMMARY:${icsEscape(e.title)}`);
  if (e.location) lines.push(`LOCATION:${icsEscape(e.location)}`);
  lines.push(`DESCRIPTION:${icsEscape([e.description, e.url].filter(Boolean).join("\n\n"))}`);
  lines.push(`URL:${e.url}`, "END:VEVENT", "END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
