import { HeartHandshake } from "lucide-react";
import type { Metadata } from "next";
import { DonationCard } from "@/components/community/DonationCard";
import { Container, PageHero } from "@/components/layout/PageHero";
import { FilterableList } from "@/components/listings/FilterableList";
import { ButtonAnchor } from "@/components/ui/Button";
import { donationNeeds, provinces } from "@/data/options";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllDonationPlaces } from "@/lib/content";
import { forms } from "@/lib/contribute";
import { isDayOver } from "@/lib/dates";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: `${dict.donate.titleStart} ${dict.donate.titleAccent}`,
    description: dict.donate.lead,
    alternates: { canonical: href(locale, paths.donateBooks) },
  };
}

export default async function DonateBooksPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  // Book drives whose collection date has passed are left out.
  const places = (await getAllDonationPlaces()).filter((p) => !p.until || !isDayOver(p.until));
  const usedProvinces = provinces.filter((p) => places.some((d) => d.province === p.value));
  const usedNeeds = donationNeeds.filter((n) => places.some((d) => d.needs.includes(n.value)));

  return (
    <>
      <PageHero
        start={dict.donate.titleStart}
        accent={dict.donate.titleAccent}
        lead={dict.donate.lead}
      />
      <Container className="pt-12 md:pt-16">
        <section className="mb-10 flex gap-4 rounded-lg bg-primary-tint p-6 md:p-7">
          <HeartHandshake size={28} aria-hidden="true" className="shrink-0 text-primary" />
          <div>
            <h2 className="mb-2 text-xl tracking-tighter">{dict.donate.tipsTitle}</h2>
            <ul className="list-disc space-y-1 pl-5">
              {dict.donate.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>
        <FilterableList
          controlsClassName="flex flex-col gap-4 rounded-md bg-white p-5 shadow-float md:p-6"
          listClassName="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-6"
          emptyText={dict.donate.none}
          groups={[
            {
              name: "province",
              label: dict.stores.province,
              allLabel: dict.stores.all,
              control: "chips",
              options: usedProvinces.map((p) => ({ value: p.value, label: p[locale] })),
            },
            {
              name: "needs",
              label: dict.donate.needs,
              allLabel: dict.stores.all,
              control: "chips",
              options: usedNeeds.map((n) => ({ value: n.value, label: n[locale] })),
            },
          ]}
          items={places.map((place) => ({
            key: place.slug,
            tags: { province: place.province, needs: [...place.needs] },
            content: <DonationCard place={place} locale={locale} dict={dict} />,
          }))}
        />
        <div className="mt-10 text-center">
          <ButtonAnchor href={forms.addDonationPlace()} variant="outline">
            {dict.donate.add}
          </ButtonAnchor>
        </div>
      </Container>
    </>
  );
}
