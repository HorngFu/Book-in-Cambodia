import { Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/books/BookCover";
import { Breadcrumbs, Container, PagePanel } from "@/components/layout/PageHero";
import { ContactButtons } from "@/components/listings/ContactButtons";
import { SampleBadge, VerifiedLine } from "@/components/listings/ListingCard";
import { Badge } from "@/components/ui/Badge";
import { ButtonAnchor } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/Heading";
import { site } from "@/config/site";
import { bookFormats, optionLabel, storeTypes } from "@/data/options";
import { localized } from "@/i18n/config";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllStores, getBooksAtStore, getLookups, getStore } from "@/lib/content";
import { forms } from "@/lib/contribute";
import { formatUsd } from "@/lib/links";
import { authorNames, bookTitle, provinceName } from "@/lib/view";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllStores()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await pageContext(params as LocaleParams);
  const store = await getStore((await params).slug);
  if (!store) return {};
  return {
    title: localized(locale, store.name, store.nameKm),
    alternates: { canonical: href(locale, paths.store(store.slug)) },
  };
}

export default async function StorePage({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const store = await getStore((await params).slug);
  if (!store) notFound();
  const [entries, { authors }] = await Promise.all([getBooksAtStore(store.slug), getLookups()]);
  const name = localized(locale, store.name, store.nameKm);
  const address = localized(locale, store.address, store.addressKm);
  const notes = store.notes;
  const pageUrl = `${site.url}${href(locale, paths.store(store.slug))}`;
  const icon = { size: 18, strokeWidth: 2, "aria-hidden": true } as const;

  return (
    <>
      <PagePanel className="px-4 pb-12 pt-8 md:px-6 md:pb-16 md:pt-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
          <Breadcrumbs
            label={dict.nav.breadcrumb}
            items={[
              { label: dict.nav.home, href: href(locale) },
              { label: dict.nav.stores, href: href(locale, paths.stores) },
              { label: name },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Badge tone="white">{optionLabel(storeTypes, store.type, locale)}</Badge>
            {store.sampleData ? <SampleBadge dict={dict} /> : null}
          </div>
          <h1 className="text-[34px] leading-[1.1] tracking-tightest md:text-[56px]">{name}</h1>
          {locale === "en" && store.nameKm ? (
            <p lang="km" className="-mt-2 text-xl text-body-strong">
              {store.nameKm}
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-md bg-white p-5">
              <p className="flex gap-2.5 text-body-strong">
                <MapPin {...icon} className="mt-1 shrink-0 text-primary" />
                <span>
                  <span className="sr-only">{dict.store.address}: </span>
                  {address}
                  {store.province !== "online"
                    ? ` · ${provinceName(store.province, locale)}`
                    : null}
                </span>
              </p>
              {store.hours ? (
                <p className="flex gap-2.5 text-body-strong">
                  <Clock {...icon} className="mt-1 shrink-0 text-primary" />
                  <span>
                    <span className="sr-only">{dict.store.hours}: </span>
                    {store.hours}
                  </span>
                </p>
              ) : null}
              <VerifiedLine date={store.lastVerified} locale={locale} dict={dict} />
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-md bg-white p-5">
              <h2 className="text-lg">{dict.store.contact}</h2>
              <ContactButtons
                dict={dict}
                contact={{
                  name,
                  address: store.address,
                  telegram: store.telegram,
                  phone: store.phone,
                  mapsUrl: store.mapsUrl,
                  sample: store.sampleData,
                  showMap: store.type !== "online",
                }}
              />
              {store.sampleData ? <p className="text-sm">{dict.listing.sampleNote}</p> : null}
            </div>
          </div>
          {notes ? (
            <p className="rounded-md bg-white p-5">
              <strong className="text-ink">{dict.store.notes}: </strong>
              {notes}
            </p>
          ) : null}
        </div>
      </PagePanel>

      <Container className="pt-16 md:pt-22">
        <SectionHeader start={dict.store.booksStart} accent={dict.store.booksAccent} />
        {entries.length ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
            {entries.map(({ book, listing }, i) => {
              const title = bookTitle(book, locale);
              const price =
                listing.priceUsd === 0
                  ? dict.book.free
                  : listing.priceUsd != null
                    ? formatUsd(listing.priceUsd)
                    : "";
              return (
                <li key={`${book.slug}-${i}`}>
                  <Link
                    href={href(locale, paths.book(book.slug))}
                    className="flex items-center gap-4 rounded-lg bg-white p-4 text-body no-underline shadow-card hover:text-body"
                  >
                    <BookCover
                      slug={book.slug}
                      title={title}
                      author=""
                      cover={book.cover}
                      alt=""
                      size="xs"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-lg font-semibold leading-snug text-ink">{title}</span>
                      <span className="text-sm">{authorNames(book, authors, locale)}</span>
                      <span className="mt-1 text-sm text-body-strong">
                        {optionLabel(bookFormats, listing.format, locale)}
                        {price ? ` · ${price}` : null}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title={dict.store.noBooks}>
            <ButtonAnchor
              href={forms.addListing({ title: `(books at ${store.name})`, url: pageUrl })}
              variant="outline"
            >
              {dict.store.addBooks}
            </ButtonAnchor>
          </EmptyState>
        )}
        <p className="mt-6">
          <a href={forms.reportProblem(pageUrl, store.name)}>{dict.footer.reportWrongInfo}</a>
        </p>
      </Container>
    </>
  );
}
