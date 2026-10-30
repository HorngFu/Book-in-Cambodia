import type { Metadata } from "next";
import { ClubCard } from "@/components/community/ClubCard";
import { Container, PageHero } from "@/components/layout/PageHero";
import { FilterableList } from "@/components/listings/FilterableList";
import { ButtonAnchor } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { bookLanguages, provinces } from "@/data/options";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllBookClubs } from "@/lib/content";
import { forms } from "@/lib/contribute";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: `${dict.clubs.titleStart} ${dict.clubs.titleAccent}`,
    description: dict.clubs.lead,
    alternates: { canonical: href(locale, paths.bookClubs) },
  };
}

export default async function BookClubsPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const clubs = await getAllBookClubs();
  const usedProvinces = provinces.filter((p) => clubs.some((c) => c.province === p.value));
  const usedLanguages = bookLanguages.filter((l) =>
    clubs.some((c) => c.languages.includes(l.value)),
  );

  return (
    <>
      <PageHero
        start={dict.clubs.titleStart}
        accent={dict.clubs.titleAccent}
        lead={dict.clubs.lead}
      />
      <Container className="pt-12 md:pt-16">
        <FilterableList
          controlsClassName="flex flex-col gap-4 rounded-md bg-white p-5 shadow-float md:p-6"
          listClassName="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6"
          emptyText={dict.clubs.none}
          groups={[
            {
              name: "province",
              label: dict.stores.province,
              allLabel: dict.stores.all,
              control: "chips",
              options: usedProvinces.map((p) => ({ value: p.value, label: p[locale] })),
            },
            {
              name: "language",
              label: dict.events.languages,
              allLabel: dict.stores.all,
              control: "chips",
              options: usedLanguages.map((l) => ({ value: l.value, label: l[locale] })),
            },
          ]}
          items={clubs.map((club) => ({
            key: club.slug,
            tags: { province: club.province, language: [...club.languages] },
            content: <ClubCard club={club} locale={locale} dict={dict} />,
          }))}
        />
      </Container>
      <div className="pt-16 md:pt-24">
        <CtaBand title={dict.clubs.start} text={dict.clubs.startText}>
          <ButtonAnchor href={forms.addBookClub()} variant="white" size="lg">
            {dict.clubs.add}
          </ButtonAnchor>
        </CtaBand>
      </div>
    </>
  );
}
