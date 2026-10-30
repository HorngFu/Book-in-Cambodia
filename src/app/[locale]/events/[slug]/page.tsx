import { CalendarPlus, Clock, Globe, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DateBlock, eventPlace, eventPrice } from "@/components/community/EventCard";
import { Breadcrumbs, Container, PagePanel } from "@/components/layout/PageHero";
import { ContactButtons } from "@/components/listings/ContactButtons";
import { SampleBadge } from "@/components/listings/ListingCard";
import { Badge } from "@/components/ui/Badge";
import { ButtonAnchor, buttonClasses } from "@/components/ui/Button";
import { bookLanguages, eventTypes, optionLabel } from "@/data/options";
import { localized } from "@/i18n/config";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllEvents, getEvent } from "@/lib/content";
import { formatEventWhen, isPast } from "@/lib/events";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await pageContext(params as LocaleParams);
  const event = await getEvent((await params).slug);
  if (!event) return {};
  return {
    title: localized(locale, event.title, event.titleKm),
    description: localized(locale, event.description, event.descriptionKm) || undefined,
    alternates: { canonical: href(locale, paths.event(event.slug)) },
  };
}

export default async function EventPage({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const event = await getEvent((await params).slug);
  if (!event) notFound();

  const title = localized(locale, event.title, event.titleKm);
  const languages = event.languages.map((l) => optionLabel(bookLanguages, l, locale)).join(", ");
  const price = eventPrice(event, dict);
  const over = isPast(event);
  const icon = { size: 20, strokeWidth: 2, "aria-hidden": true } as const;

  const facts = [
    { icon: <Clock {...icon} />, label: dict.events.when, value: formatEventWhen(event, locale) },
    {
      icon: event.province === "online" ? <Globe {...icon} /> : <MapPin {...icon} />,
      label: dict.events.where,
      value: [eventPlace(event, locale, dict), event.address].filter(Boolean).join(" · "),
    },
    { icon: <Users {...icon} />, label: dict.events.organizer, value: event.organizer },
    { icon: <Globe {...icon} />, label: dict.events.languages, value: languages },
  ].filter((f) => f.value);

  return (
    <>
      <PagePanel className="px-4 pb-12 pt-8 md:px-6 md:pb-16 md:pt-12">
        <div className="mx-auto flex max-w-[960px] flex-col gap-6">
          <Breadcrumbs
            label={dict.nav.breadcrumb}
            items={[
              { label: dict.nav.home, href: href(locale) },
              { label: dict.nav.community, href: href(locale, paths.community) },
              {
                label: dict.events.titleStart + " " + dict.events.titleAccent,
                href: href(locale, paths.events),
              },
              { label: title },
            ]}
          />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <DateBlock event={event} locale={locale} />
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge tone="white">{optionLabel(eventTypes, event.type, locale)}</Badge>
                {price ? <Badge tone="ok">{price}</Badge> : null}
                {over ? <Badge tone="neutral">{dict.events.past}</Badge> : null}
                {event.sampleData ? <SampleBadge dict={dict} /> : null}
              </div>
              <h1 className="text-[34px] leading-[1.1] tracking-tightest md:text-5xl">{title}</h1>
            </div>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="flex gap-3 rounded-md bg-white p-5">
                <span className="mt-0.5 text-primary">{f.icon}</span>
                <span>
                  <dt className="text-sm">{f.label}</dt>
                  <dd className="font-semibold text-ink">{f.value}</dd>
                </span>
              </div>
            ))}
          </dl>
          {!over ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={href(locale, paths.eventIcs(event.slug))}
                download={`${event.slug}.ics`}
                className={buttonClasses("primary", "lg")}
              >
                <CalendarPlus size={20} aria-hidden="true" />
                {dict.events.addToCalendar}
              </a>
              {event.onlineUrl && !event.sampleData ? (
                <ButtonAnchor
                  href={event.onlineUrl}
                  variant="outline"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dict.events.joinOnline}
                </ButtonAnchor>
              ) : null}
            </div>
          ) : null}
        </div>
      </PagePanel>

      <Container className="max-w-[960px] pt-12">
        {event.description ? (
          <p className="whitespace-pre-line text-lg">
            {localized(locale, event.description, event.descriptionKm)}
          </p>
        ) : null}
        {event.telegram || event.facebook || event.province !== "online" ? (
          <section className="mt-10 flex flex-col gap-3">
            <h2 className="text-2xl tracking-tighter">{dict.events.contactOrganizer}</h2>
            <ContactButtons
              dict={dict}
              contact={{
                name: event.venue || event.organizer || title,
                address: event.address,
                telegram: event.telegram,
                mapsUrl: event.mapsUrl,
                sample: event.sampleData,
                showMap: event.province !== "online",
              }}
            />
            {event.sampleData ? <p className="text-sm">{dict.listing.sampleNote}</p> : null}
          </section>
        ) : null}
      </Container>
    </>
  );
}
