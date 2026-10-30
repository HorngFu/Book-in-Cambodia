import type { Metadata } from "next";
import { Container, PageHero } from "@/components/layout/PageHero";
import { FilterableList } from "@/components/listings/FilterableList";
import { StoreCard } from "@/components/stores/StoreCard";
import { ButtonAnchor } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/config/site";
import { optionLabel, provinces, storeTypes } from "@/data/options";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllBooks, getAllStores } from "@/lib/content";
import { issueUrl } from "@/lib/links";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: dict.nav.stores,
    description: dict.stores.lead,
    alternates: { canonical: href(locale, paths.stores) },
  };
}

export default async function StoresPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const [stores, books] = await Promise.all([getAllStores(), getAllBooks()]);

  const bookCount = new Map<string, number>();
  for (const book of books) {
    for (const slug of new Set(book.availability.map((l) => l.store))) {
      bookCount.set(slug, (bookCount.get(slug) ?? 0) + 1);
    }
  }

  // Only offer filters that match at least one store, in the canonical order.
  const usedProvinces = provinces.filter((p) => stores.some((s) => s.province === p.value));
  const usedTypes = storeTypes.filter((t) => stores.some((s) => s.type === t.value));

  return (
    <>
      <PageHero
        start={dict.stores.titleStart}
        accent={dict.stores.titleAccent}
        lead={dict.stores.lead}
      />
      <Container className="pt-10 md:pt-14">
        <FilterableList
          controlsClassName="flex flex-col gap-4 rounded-md bg-white p-5 shadow-float md:p-6"
          listClassName="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-6"
          emptyText={dict.stores.noMatches}
          countLabel={{ one: dict.stores.showingOne, other: dict.stores.showingOther }}
          groups={[
            {
              name: "province",
              label: dict.stores.province,
              allLabel: dict.stores.all,
              control: "chips",
              options: usedProvinces.map((p) => ({ value: p.value, label: p[locale] })),
            },
            {
              name: "type",
              label: dict.stores.type,
              allLabel: dict.stores.all,
              control: "chips",
              options: usedTypes.map((t) => ({
                value: t.value,
                label: optionLabel(storeTypes, t.value, locale),
              })),
            },
          ]}
          items={stores.map((store, i) => ({
            key: store.slug,
            tags: { province: store.province, type: store.type },
            content: (
              <StoreCard
                store={store}
                href={href(locale, paths.store(store.slug))}
                bookCount={bookCount.get(store.slug) ?? 0}
                seed={i}
                locale={locale}
                dict={dict}
              />
            ),
          }))}
        />
      </Container>
      <div className="pt-16 md:pt-24">
        <CtaBand title={dict.stores.ownStoreTitle} text={dict.stores.ownStoreText}>
          <ButtonAnchor
            href={issueUrl(
              site.repoUrl,
              "Add my store",
              "Store name: \nProvince: \nAddress: \nTelegram: \nPhone: \nOpening hours: ",
            )}
            variant="white"
            size="lg"
          >
            {dict.stores.addMyStore}
          </ButtonAnchor>
        </CtaBand>
      </div>
    </>
  );
}
