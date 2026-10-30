import { describe, expect, it } from "vitest";
import {
  eventEnd,
  eventStart,
  eventToIcs,
  formatEventWhen,
  isPast,
  splitEvents,
} from "@/lib/events";

const talk = { startDate: "2026-11-28", startTime: "14:00", endTime: "16:00" };

describe("event times", () => {
  it("uses Cambodia time (UTC+7)", () => {
    expect(eventStart(talk).toISOString()).toBe("2026-11-28T07:00:00.000Z");
    expect(eventEnd(talk).toISOString()).toBe("2026-11-28T09:00:00.000Z");
  });

  it("defaults to two hours without an end time", () => {
    expect(eventEnd({ startDate: "2026-11-28", startTime: "14:00" }).toISOString()).toBe(
      "2026-11-28T09:00:00.000Z",
    );
  });

  it("treats events without a time as all-day", () => {
    const fair = { startDate: "2026-12-01", endDate: "2026-12-03" };
    expect(eventEnd(fair).toISOString()).toBe("2026-12-03T17:00:00.000Z");
    expect(isPast(fair, new Date("2026-12-03T16:00:00Z"))).toBe(false);
    expect(isPast(fair, new Date("2026-12-03T17:30:00Z"))).toBe(true);
  });

  it("splits upcoming and past", () => {
    const old = { startDate: "2026-10-01" };
    const { upcoming, past } = splitEvents([old, talk], new Date("2026-10-30T00:00:00Z"));
    expect(upcoming).toEqual([talk]);
    expect(past).toEqual([old]);
  });

  it("formats the date and time", () => {
    expect(formatEventWhen(talk, "en")).toBe("Sat, 28 Nov 2026 · 14:00–16:00");
  });
});

describe("eventToIcs", () => {
  const ics = eventToIcs(
    {
      ...talk,
      slug: "meet-khmer-writers",
      title: "Meet Khmer Writers, part 1",
      description: "Talk; questions after. ការពិភាក្សាជាមួយអ្នកនិពន្ធខ្មែរវ័យក្មេង អំពីការសរសេរ",
      location: "Capital Reading Library, Phnom Penh",
      url: "https://bookincambodia.org/en/events/meet-khmer-writers",
    },
    new Date("2026-10-30T00:00:00Z"),
  );

  it("produces a single-event calendar in UTC", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART:20261128T070000Z");
    expect(ics).toContain("DTEND:20261128T090000Z");
    expect(ics).toContain("UID:meet-khmer-writers@bookincambodia.org");
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });

  it("escapes commas and semicolons and folds long lines", () => {
    expect(ics).toContain("SUMMARY:Meet Khmer Writers\\, part 1");
    expect(ics).toContain("Talk\\; questions after");
    for (const line of ics.split("\r\n")) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });

  it("uses date values for all-day events", () => {
    const fair = eventToIcs({
      startDate: "2026-12-01",
      endDate: "2026-12-03",
      slug: "fair",
      title: "Book fair",
      url: "https://bookincambodia.org/en/events/fair",
    });
    expect(fair).toContain("DTSTART;VALUE=DATE:20261201");
    expect(fair).toContain("DTEND;VALUE=DATE:20261204");
  });
});
