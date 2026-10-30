import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClubCard } from "@/components/community/ClubCard";
import { Breadcrumbs, Container, PagePanel } from "@/components/layout/PageHero";
import { VerifiedLine } from "@/components/listings/ListingCard";
import { localized } from "@/i18n/config";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllBookClubs, getBookClub } from "@/lib/content";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllBookClubs()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await pageContext(params as LocaleParams);
  const club = await getBookClub((await params).slug);
  if (!club) return {};
  return {
    title: localized(locale, club.name, club.nameKm),
    description: localized(locale, club.description, club.descriptionKm) || undefined,
    alternates: { canonical: href(locale, paths.bookClub(club.slug)) },
  };
}

export default async function BookClubPage({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const club = await getBookClub((await params).slug);
  if (!club) notFound();
  const name = localized(locale, club.name, club.nameKm);
  const description = localized(locale, club.description, club.descriptionKm);

  return (
    <>
      <PagePanel className="flex flex-col items-center gap-4 px-4 py-12 text-center md:px-6 md:py-16">
        <Breadcrumbs
          label={dict.nav.breadcrumb}
          items={[
            { label: dict.nav.home, href: href(locale) },
            { label: dict.nav.community, href: href(locale, paths.community) },
            {
              label: `${dict.clubs.titleStart} ${dict.clubs.titleAccent}`,
              href: href(locale, paths.bookClubs),
            },
            { label: name },
          ]}
        />
        <h1 className="text-[34px] leading-[1.1] tracking-tightest md:text-[56px]">{name}</h1>
        {description ? (
          <p className="max-w-2xl text-body-strong md:text-lg">{description}</p>
        ) : null}
      </PagePanel>
      <Container className="flex max-w-[640px] flex-col gap-4 pt-12">
        <ClubCard club={club} locale={locale} dict={dict} />
        {club.where ? (
          <p>
            <strong className="text-ink">{dict.clubs.where}:</strong> {club.where}
          </p>
        ) : null}
        <VerifiedLine date={club.lastVerified} locale={locale} dict={dict} />
        {club.sampleData ? <p className="text-sm">{dict.listing.sampleNote}</p> : null}
      </Container>
    </>
  );
}
