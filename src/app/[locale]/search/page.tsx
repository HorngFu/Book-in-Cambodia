import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container, PagePanel } from "@/components/layout/PageHero";
import { SearchApp } from "@/components/search/SearchApp";
import { TwoTone } from "@/components/ui/Heading";
import { bookFormats, bookLanguages, provinces } from "@/data/options";
import { localized } from "@/i18n/config";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { searchAppLabels } from "@/i18n/search-labels";
import { getAllBooks, getAllCategories, getLookups } from "@/lib/content";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: dict.search.title,
    alternates: { canonical: href(locale, paths.search) },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const [categories, books, { stores }] = await Promise.all([
    getAllCategories(),
    getAllBooks(),
    getLookups(),
  ]);

  // Only offer filter values that match at least one book.
  const usedProvinces = new Set(
    books.flatMap((b) => b.availability.map((l) => stores.get(l.store)?.province)),
  );
  const usedLanguages = new Set(books.map((b) => b.language));
  const usedFormats = new Set(books.flatMap((b) => b.availability.map((l) => l.format)));

  return (
    <>
      <PagePanel className="flex flex-col items-center gap-8 px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-center text-[34px] leading-[1.1] tracking-tightest md:text-5xl">
          <TwoTone start={dict.search.title} accent={dict.search.titleAccent} />
        </h1>
      </PagePanel>
      <Container className="-mt-15 pb-4 md:-mt-17">
        <Suspense
          fallback={
            <p className="rounded-lg bg-white px-6 py-10 text-center shadow-card">
              {dict.search.loading}
            </p>
          }
        >
          <SearchApp
            locale={locale}
            labels={searchAppLabels(locale, dict)}
            categories={categories.map((c) => ({
              value: c.slug,
              label: localized(locale, c.name, c.nameKm),
            }))}
            languages={bookLanguages
              .filter((l) => usedLanguages.has(l.value))
              .map((l) => ({ value: l.value, label: l[locale] }))}
            provinces={provinces
              .filter((p) => usedProvinces.has(p.value))
              .map((p) => ({ value: p.value, label: p[locale] }))}
            formats={bookFormats
              .filter((f) => usedFormats.has(f.value))
              .map((f) => ({ value: f.value, label: f[locale].split(" · ")[0] }))}
            contributeHref={`${href(locale, paths.contribute)}#request`}
          />
        </Suspense>
        <noscript>
          <p className="mt-6 text-center">
            {dict.search.noJs} <Link href={href(locale, paths.books)}>{dict.nav.books}</Link>
          </p>
        </noscript>
      </Container>
    </>
  );
}
