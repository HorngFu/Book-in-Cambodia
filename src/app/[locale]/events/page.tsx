import type { Metadata } from "next";
import { EventCard } from "@/components/community/EventCard";
import { Container, PageHero } from "@/components/layout/PageHero";
import { FilterableList } from "@/components/listings/FilterableList";
import { ButtonAnchor } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/Heading";
import { provinces } from "@/data/options";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllEvents } from "@/lib/content";
import { forms } from "@/lib/contribute";
import { splitEvents } from "@/lib/events";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: `${dict.events.titleStart} ${dict.events.titleAccent}`,
    description: dict.events.lead,
    alternates: { canonical: href(locale, paths.events) },
  };
}

export default async function EventsPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const { upcoming, past } = splitEvents(await getAllEvents());
  const usedProvinces = provinces.filter((p) => upcoming.some((e) => e.province === p.value));

  return (
    <>
      <PageHero
        start={dict.events.titleStart}
        accent={dict.events.titleAccent}
        lead={dict.events.lead}
      >
        <ButtonAnchor href={forms.submitEvent()} size="lg" className="mt-2">
          {dict.events.submit}
        </ButtonAnchor>
      </PageHero>
      <Container className="pt-14 md:pt-20">
        <SectionHeader start={dict.events.upcomingStart} accent={dict.events.upcomingAccent} />
        {upcoming.length ? (
          <FilterableList
            controlsClassName="mb-6 flex"
            listClassName="grid grid-cols-[repeat(auto-fill,minmax(min(100%,480px),1fr))] gap-6"
            emptyText={dict.events.none}
            groups={
              usedProvinces.length > 1
                ? [
                    {
                      name: "province",
                      label: dict.stores.province,
                      allLabel: dict.stores.all,
                      control: "select",
                      options: usedProvinces.map((p) => ({ value: p.value, label: p[locale] })),
                    },
                  ]
                : []
            }
            items={upcoming.map((event) => ({
              key: event.slug,
              tags: { province: event.province },
              content: <EventCard event={event} locale={locale} dict={dict} />,
            }))}
          />
        ) : (
          <p className="rounded-lg bg-surface px-6 py-10 text-center">{dict.events.none}</p>
        )}
        <p className="mt-6">{dict.events.submitText}</p>

        {past.length ? (
          <details className="mt-14 rounded-md bg-surface px-6">
            <summary className="flex min-h-16 items-center text-lg font-semibold text-ink">
              {dict.events.past} ({past.length})
            </summary>
            <div className="grid gap-4 pb-6 opacity-80">
              {past.map((event) => (
                <EventCard
                  key={event.slug}
                  event={event}
                  locale={locale}
                  dict={dict}
                  hideWhenPast={false}
                />
              ))}
            </div>
          </details>
        ) : null}
      </Container>
    </>
  );
}
