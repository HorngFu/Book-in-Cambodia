/** Listings not verified for this many days are shown as possibly outdated. */
export const STALE_AFTER_DAYS = 183;

/** `date` is an ISO day (YYYY-MM-DD). `now` defaults to the build time. */
export function isStale(date: string, now: Date = new Date()): boolean {
  const verified = new Date(`${date}T00:00:00Z`).getTime();
  return now.getTime() - verified > STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
}

export function formatDate(date: string, locale: "en" | "km"): string {
  return new Intl.DateTimeFormat(locale === "km" ? "km-KH" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
