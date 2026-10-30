import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { SampleBadge } from "@/components/listings/ListingCard";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { bookLanguages, eventTypes, optionLabel } from "@/data/options";
import { localized, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href, paths } from "@/i18n/routes";
import { cn } from "@/lib/cn";
import type { CommunityEvent } from "@/lib/content";
import { dateBlock, eventEnd, formatEventWhen } from "@/lib/events";
import { provinceName } from "@/lib/view";
import { HideWhenPast } from "./HideWhenPast";

export function DateBlock({
  event,
  locale,
  size = "md",
}: {
  event: CommunityEvent;
  locale: Locale;
  size?: "sm" | "md";
}) {
  const { month, day } = dateBlock(event, locale);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-md bg-primary leading-[1.05] text-white",
        size === "sm" ? "h-14 w-14" : "h-24 w-22",
      )}
    >
      <span className={cn("font-semibold", size === "sm" ? "text-[11px]" : "text-sm")}>
        {month}
      </span>
      <span
        className={cn("font-bold tracking-tighter", size === "sm" ? "text-[22px]" : "text-4xl")}
      >
        {day}
      </span>
    </span>
  );
}

export function eventPlace(event: CommunityEvent, locale: Locale, dict: Dictionary) {
  if (event.province === "online") return dict.events.online;
  return [event.venue, provinceName(event.province, locale)].filter(Boolean).join(", ");
}

export function eventPrice(event: CommunityEvent, dict: Dictionary) {
  return event.price || (event.isFree ? dict.events.free : "");
}

export function EventCard({
  event,
  locale,
  dict,
  hideWhenPast = true,
}: {
  event: CommunityEvent;
  locale: Locale;
  dict: Dictionary;
  hideWhenPast?: boolean;
}) {
  const title = localized(locale, event.title, event.titleKm);
  const languages = event.languages.map((l) => optionLabel(bookLanguages, l, locale)).join(", ");
  const price = eventPrice(event, dict);

  const card = (
    <article className="flex gap-5 rounded-lg bg-white p-5 shadow-card md:gap-6 md:p-6">
      <DateBlock event={event} locale={locale} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap gap-2">
          <Badge tone="library">{optionLabel(eventTypes, event.type, locale)}</Badge>
          {event.sampleData ? <SampleBadge dict={dict} /> : null}
        </div>
        <h3 className="mt-1.5 text-[22px] leading-tight tracking-tighter">
          <Link
            href={href(locale, paths.event(event.slug))}
            className="text-ink no-underline hover:text-primary"
          >
            {title}
          </Link>
        </h3>
        <p className="text-[15px]">
          {formatEventWhen(event, locale)} · {eventPlace(event, locale, dict)}
        </p>
        <p className="text-[15px] text-body-strong">
          {[languages, price].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={href(locale, paths.event(event.slug))}
            className={buttonClasses("dark", "sm")}
          >
            {dict.events.details}
          </Link>
          <a
            href={href(locale, paths.eventIcs(event.slug))}
            download={`${event.slug}.ics`}
            className={buttonClasses("soft", "sm")}
          >
            <CalendarPlus size={18} aria-hidden="true" />
            {dict.events.addToCalendar}
          </a>
        </div>
      </div>
    </article>
  );

  return hideWhenPast ? (
    <HideWhenPast endsAt={eventEnd(event).toISOString()}>{card}</HideWhenPast>
  ) : (
    card
  );
}
