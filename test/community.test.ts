import { describe, expect, it } from "vitest";
import { getAllAuthors, getAllBookClubs, getAllDonationPlaces, getAllEvents } from "@/lib/content";
import { eventEnd, eventStart } from "@/lib/events";

describe("community content", () => {
  it("reads events with valid dates and times", async () => {
    const events = await getAllEvents();
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(Number.isNaN(eventStart(event).getTime()), `${event.slug} start`).toBe(false);
      expect(eventEnd(event).getTime(), `${event.slug} ends after it starts`).toBeGreaterThan(
        eventStart(event).getTime(),
      );
    }
  });

  it("sorts events soonest first", async () => {
    const dates = (await getAllEvents()).map((e) => e.startDate);
    expect(dates).toEqual([...dates].sort());
  });

  it("reads book clubs and donation places", async () => {
    expect((await getAllBookClubs()).length).toBeGreaterThan(0);
    expect((await getAllDonationPlaces()).length).toBeGreaterThan(0);
  });

  it("has Cambodian authors for the spotlight", async () => {
    expect((await getAllAuthors()).some((a) => a.cambodian)).toBe(true);
  });
});
