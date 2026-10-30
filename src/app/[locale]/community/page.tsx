import type { Metadata } from "next";
import Link from "next/link";
import { ClubCard } from "@/components/community/ClubCard";
import { DonationCard } from "@/components/community/DonationCard";
import { EventCard } from "@/components/community/EventCard";
import { Container } from "@/components/layout/PageHero";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/Heading";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllBookClubs, getAllDonationPlaces, getAllEvents } from "@/lib/content";
import { forms } from "@/lib/contribute";
import { isDayOver } from "@/lib/dates";
import { splitEvents } from "@/lib/events";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: dict.nav.community,
    description: dict.community.lead,
    alternates: { canonical: href(locale, paths.community) },
  };
}

export default async function CommunityPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const [events, clubs, places] = await Promise.all([
    getAllEvents(),
    getAllBookClubs(),
    getAllDonationPlaces(),
  ]);
  const { upcoming } = splitEvents(events);
  const openPlaces = places.filter((p) => !p.until || !isDayOver(p.until));
  const c = dict.community;
  const jump = [
    { id: "events", label: c.upcomingEvents },
    { id: "clubs", label: `${dict.clubs.titleStart} ${dict.clubs.titleAccent}` },
    { id: "donate", label: c.donateCardTitle },
    {
      id: "involved",
      label: `${dict.involved.titleStart}${locale === "km" ? "" : " "}${dict.involved.titleAccent}`,
    },
  ];

  return (
    <>
      <section className="px-2 md:px-4">
        <div className="mx-auto flex max-w-[1408px] flex-col items-center gap-5 rounded-lg bg-primary-tint px-4 py-14 text-center md:px-6 md:py-22">
          <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
            {c.badge}
          </p>
          <h1 className="max-w-4xl text-[38px] leading-[1.1] tracking-tightest md:text-[64px]">
            {c.titleStart} <span className="text-primary">{c.titleAccent}</span>
          </h1>
          <p className="max-w-2xl text-body-strong md:text-lg">{c.lead}</p>
          <div className="mt-2 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonAnchor href={forms.submitEvent()} size="lg">
              {c.submitEvent}
            </ButtonAnchor>
            <ButtonLink href={href(locale, paths.getInvolved)} variant="dark" size="lg">
              {c.volunteer}
            </ButtonLink>
          </div>
          <nav aria-label={c.onThisPage} className="mt-6 flex flex-wrap justify-center gap-2.5">
            {jump.map((j) => (
              <a
                key={j.id}
                href={`#${j.id}`}
                className="flex min-h-12 items-center rounded-full bg-white px-5 font-semibold text-ink no-underline hover:text-primary"
              >
                {j.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <Container className="pt-20 md:pt-28">
        <section id="events" aria-labelledby="events-h" className="scroll-mt-6">
          <SectionHeader
            id="events-h"
            start={dict.events.upcomingStart}
            accent={dict.events.upcomingAccent}
            action={
              <ButtonLink href={href(locale, paths.events)} variant="outline">
                {c.allEvents}
              </ButtonLink>
            }
          />
          {upcoming.length ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,480px),1fr))] gap-6">
              {upcoming.slice(0, 4).map((event) => (
                <EventCard key={event.slug} event={event} locale={locale} dict={dict} />
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-surface px-6 py-10 text-center">{dict.events.none}</p>
          )}
          <p className="mt-6">
            {dict.events.submitText} <a href={forms.submitEvent()}>{dict.events.submit} →</a>
          </p>
        </section>
      </Container>

      <Container className="pt-20 md:pt-28">
        <section id="clubs" aria-labelledby="clubs-h" className="scroll-mt-6">
          <SectionHeader
            id="clubs-h"
            start={dict.clubs.titleStart}
            accent={dict.clubs.titleAccent}
            action={
              <ButtonLink href={href(locale, paths.bookClubs)} variant="outline">
                {c.findClub}
              </ButtonLink>
            }
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
            {clubs.slice(0, 3).map((club) => (
              <ClubCard key={club.slug} club={club} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      </Container>

      <Container className="pt-20 md:pt-28">
        <section id="donate" aria-labelledby="donate-h" className="scroll-mt-6">
          <SectionHeader
            id="donate-h"
            centered
            start={dict.donate.titleStart}
            accent={dict.donate.titleAccent}
            lead={dict.donate.lead}
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
            {openPlaces.slice(0, 3).map((place) => (
              <DonationCard key={place.slug} place={place} locale={locale} dict={dict} />
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link href={href(locale, paths.donateBooks)} className="font-semibold">
              {c.whereToDonate} →
            </Link>
          </p>
        </section>
      </Container>

      <Container className="pt-20 md:pt-28">
        <section id="involved" aria-labelledby="involved-h" className="scroll-mt-6">
          <SectionHeader
            id="involved-h"
            centered
            start={dict.involved.titleStart}
            accent={dict.involved.titleAccent}
            lead={dict.involved.lead}
          />
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-5">
            {dict.involved.roles.slice(0, 4).map((role) => (
              <li key={role.title}>
                <Link
                  href={href(locale, paths.getInvolved)}
                  className="flex h-full flex-col gap-2 rounded-lg bg-white p-7 text-body no-underline shadow-card hover:text-body hover:shadow-float"
                >
                  <span className="text-xl font-semibold tracking-tighter text-ink">
                    {role.title}
                  </span>
                  <span className="text-[15px]">{role.text}</span>
                  <span className="mt-auto pt-2 font-semibold text-primary">{role.cta} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <section aria-labelledby="np-h" className="px-2 pt-20 md:px-4 md:pt-28">
        <div className="mx-auto max-w-[1408px] rounded-lg bg-primary px-5 py-14 text-white md:px-6 md:py-20">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 text-center">
            <div className="flex max-w-3xl flex-col gap-3">
              <p className="font-semibold text-primary-tint">{c.npBadge}</p>
              <h2
                id="np-h"
                className="text-[30px] leading-[1.1] tracking-tightest text-white md:text-5xl"
              >
                {c.npTitle}
              </h2>
            </div>
            <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 text-left">
              {c.principles.map((p) => (
                <li key={p.title} className="flex flex-col gap-1.5 rounded-md bg-white p-7">
                  <strong className="text-[19px] font-semibold tracking-tight text-ink">
                    {p.title}
                  </strong>
                  <span className="text-[15px]">{p.text}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href={href(locale, paths.about)} variant="white" size="lg">
              {c.aboutUs}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
