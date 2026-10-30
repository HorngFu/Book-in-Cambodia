import { Flag, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AbroadSteps } from "@/components/abroad/AbroadSteps";
import { ImportServiceCard } from "@/components/abroad/ImportServiceCard";
import { BookCover } from "@/components/books/BookCover";
import { Breadcrumbs, Container, PagePanel } from "@/components/layout/PageHero";
import { FilterableList } from "@/components/listings/FilterableList";
import { ListingCard } from "@/components/listings/ListingCard";
import { Badge } from "@/components/ui/Badge";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeader } from "@/components/ui/Heading";
import { site } from "@/config/site";
import { bookLanguages, optionLabel } from "@/data/options";
import { localized } from "@/i18n/config";
import { format, plural } from "@/i18n/dictionaries";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import {
  getAllBooks,
  getAllImportServices,
  getBook,
  getBooksByAuthor,
  getLookups,
} from "@/lib/content";
import { issueUrl } from "@/lib/links";
import { authorNames, bookTitle, provinceName, toBookCard } from "@/lib/view";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllBooks()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await pageContext(params as LocaleParams);
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return {};
  return {
    title: bookTitle(book, locale),
    description: localized(locale, book.description, book.descriptionKm) || undefined,
    alternates: { canonical: href(locale, paths.book(slug)) },
  };
}

export default async function BookPage({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  const lookups = await getLookups();
  const title = bookTitle(book, locale);
  const altTitle = book.titleKm ? (locale === "km" ? book.title : book.titleKm) : null;
  const authors = authorNames(book, lookups.authors, locale);
  const available = book.availability.length > 0;
  const pageUrl = `${site.url}${href(locale, paths.book(slug))}`;
  const lookingForUrl = issueUrl(
    site.repoUrl,
    `Book request: ${book.title}`,
    `I'm looking for this book: ${pageUrl}\n\nProvince: \nContact (optional): `,
  );
  const addListingUrl = issueUrl(
    site.repoUrl,
    `Add listing: ${book.title}`,
    `Book: ${pageUrl}\n\nStore: \nPrice: \nFormat: `,
  );
  const reportUrl = issueUrl(
    site.repoUrl,
    `Wrong info: ${book.title}`,
    `Page: ${pageUrl}\n\nWhat is wrong: `,
  );

  const meta = [
    [dict.book.language, optionLabel(bookLanguages, book.language, locale)],
    [dict.book.firstPublished, book.publishedYear ? String(book.publishedYear) : ""],
    [dict.book.publisher, book.publisher],
    [dict.book.isbn13, book.isbn13],
    [dict.book.isbn10, book.isbn10],
  ].filter(([, value]) => value);

  const moreBy = (await Promise.all(book.authors.map((a) => getBooksByAuthor(a))))
    .flat()
    .filter((b, i, all) => b.slug !== slug && all.findIndex((x) => x.slug === b.slug) === i)
    .slice(0, 4);

  const listingProvinces = [
    ...new Set(book.availability.map((l) => lookups.stores.get(l.store)?.province).filter(Boolean)),
  ] as string[];

  const services = available ? [] : await getAllImportServices();

  return (
    <>
      <PagePanel className="px-4 pb-12 pt-8 md:px-6 md:pb-16 md:pt-12">
        <div className="mx-auto max-w-[1200px]">
          <Breadcrumbs
            label={dict.nav.breadcrumb}
            items={[
              { label: dict.nav.home, href: href(locale) },
              { label: dict.nav.books, href: href(locale, paths.books) },
              { label: title },
            ]}
          />
          <div className="mt-8 flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">
            <BookCover
              slug={book.slug}
              title={title}
              author={authors}
              cover={book.cover}
              alt={format(dict.book.coverOf, { title })}
              size="xl"
              className="max-md:w-[180px]!"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {book.categories.map((c) => {
                  const category = lookups.categories.get(c);
                  if (!category) return null;
                  return (
                    <Link
                      key={c}
                      href={href(locale, paths.category(c))}
                      className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink no-underline hover:text-primary"
                    >
                      {localized(locale, category.name, category.nameKm)}
                    </Link>
                  );
                })}
                <Badge tone={available ? "ok" : "warn"} className="px-3.5 py-1.5 text-sm">
                  {available
                    ? plural(
                        book.availability.length,
                        dict.book.inPlacesOne,
                        dict.book.inPlacesOther,
                      )
                    : dict.book.notInCambodia}
                </Badge>
              </div>
              <h1 className="text-[34px] leading-[1.05] tracking-tightest md:text-[56px]">
                {title}
              </h1>
              {altTitle ? <p className="-mt-2 text-xl text-body-strong">{altTitle}</p> : null}
              <p className="text-lg text-body-strong md:text-[19px]">
                {book.subtitle ? `${book.subtitle} · ` : null}
                {dict.book.by}{" "}
                {book.authors.map((a, i) => {
                  const author = lookups.authors.get(a);
                  if (!author) return null;
                  return (
                    <span key={a}>
                      {i > 0 ? ", " : null}
                      <Link href={href(locale, paths.author(a))} className="font-semibold">
                        {localized(locale, author.name, author.nameKm)}
                      </Link>
                    </span>
                  );
                })}
              </p>
              {book.description ? (
                <p className="max-w-2xl text-body-strong md:text-[17px]">
                  {localized(locale, book.description, book.descriptionKm)}
                </p>
              ) : null}
              {meta.length ? (
                <dl className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                  {meta.map(([label, value]) => (
                    <div key={label} className="rounded-md bg-white p-4">
                      <dt className="text-sm">{label}</dt>
                      <dd className="font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                {available ? (
                  <ButtonLink href="#where" size="lg">
                    {dict.book.seeWhere}
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink href="#services" size="lg">
                      {dict.book.compareServices}
                    </ButtonLink>
                    <ButtonAnchor href={lookingForUrl} variant="outline" size="lg">
                      {dict.book.lookingFor}
                    </ButtonAnchor>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </PagePanel>

      {available ? (
        <Container className="flex flex-wrap items-start gap-8 pt-16 md:pt-22">
          <section id="where" aria-labelledby="where-h" className="min-w-0 flex-[999_1_560px]">
            <SectionHeader
              id="where-h"
              start={dict.book.whereStart}
              accent={dict.book.whereAccent}
              lead={dict.book.whereLead}
              className="mb-6"
            />
            <FilterableList
              controlsClassName="mb-5 flex flex-wrap items-end justify-between gap-4 [&>label]:shrink-0"
              listClassName="flex flex-col gap-5"
              emptyText={dict.stores.noMatches}
              groups={
                listingProvinces.length > 1
                  ? [
                      {
                        name: "province",
                        label: dict.stores.province,
                        allLabel: dict.stores.all,
                        control: "select",
                        options: listingProvinces.map((p) => ({
                          value: p,
                          label: provinceName(p, locale),
                        })),
                      },
                    ]
                  : []
              }
              items={book.availability.flatMap((listing, i) => {
                const store = lookups.stores.get(listing.store);
                if (!store) return [];
                return [
                  {
                    key: `${listing.store}-${i}`,
                    tags: { province: store.province },
                    content: (
                      <ListingCard
                        listing={listing}
                        store={store}
                        storeHref={href(locale, paths.store(store.slug))}
                        locale={locale}
                        dict={dict}
                      />
                    ),
                  },
                ];
              })}
            />
            <a
              href={reportUrl}
              className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold"
            >
              <Flag size={18} aria-hidden="true" />
              {dict.book.reportWrong}
            </a>
          </section>

          <aside className="flex max-w-[360px] flex-[1_1_280px] flex-col gap-5">
            <div className="flex flex-col gap-3 rounded-lg bg-primary p-8 text-white">
              <h2 className="text-2xl tracking-tighter text-white">{dict.book.differentEdition}</h2>
              <p className="text-primary-tint">{dict.book.differentEditionText}</p>
              {book.importNotes ? (
                <p className="rounded-md bg-white/15 p-3 text-sm text-white">{book.importNotes}</p>
              ) : null}
              <ButtonLink
                href={href(locale, paths.importServices)}
                variant="white"
                className="mt-2"
              >
                {dict.book.seeImportServices}
              </ButtonLink>
            </div>
            <div className="flex flex-col gap-2.5 rounded-lg bg-surface p-8">
              <h2 className="text-[22px] tracking-tighter">{dict.book.sellThis}</h2>
              <p>{dict.book.sellThisText}</p>
              <a href={addListingUrl} className="font-semibold">
                {dict.book.addListing} →
              </a>
            </div>
          </aside>
        </Container>
      ) : (
        <>
          <Container className="pt-16 md:pt-24">
            <AbroadSteps dict={dict} />
          </Container>
          <Container className="pt-16 md:pt-24">
            <section id="services" aria-labelledby="services-h">
              <SectionHeader
                id="services-h"
                start={dict.abroad.servicesStart}
                accent={dict.abroad.servicesAccent}
              />
              {book.importNotes ? (
                <p className="mb-8 flex gap-3 rounded-lg bg-warn-bg p-5 text-warn">
                  <Package size={22} aria-hidden="true" className="shrink-0" />
                  <span>
                    <strong>{dict.book.importTip}:</strong> {book.importNotes}
                  </span>
                </p>
              ) : null}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
                {services.map((service, i) => (
                  <ImportServiceCard
                    key={service.slug}
                    service={service}
                    index={i}
                    href={href(locale, paths.importService(service.slug))}
                    locale={locale}
                    dict={dict}
                  />
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-sm">{dict.abroad.disclaimer}</p>
            </section>
          </Container>
        </>
      )}

      {moreBy.length ? (
        <Container className="pt-16 md:pt-22">
          <section aria-labelledby="more-h">
            <h2 id="more-h" className="mb-7 text-[28px] tracking-tightest md:text-[32px]">
              {dict.book.moreBy} <span className="text-primary">{authors}</span>
            </h2>
            <div className="flex flex-wrap gap-5">
              {moreBy.map((b) => {
                const card = toBookCard(b, lookups.authors, locale, dict);
                return (
                  <Link
                    key={b.slug}
                    href={href(locale, paths.book(b.slug))}
                    className="flex items-center gap-4 rounded-lg bg-white py-3.5 pl-3.5 pr-6 text-body no-underline shadow-card hover:text-body"
                  >
                    <BookCover
                      slug={b.slug}
                      title={card.title}
                      author={card.authorNames}
                      cover={b.cover}
                      alt=""
                      size="xs"
                    />
                    <span className="flex flex-col">
                      <span className="text-lg font-semibold text-ink">{card.title}</span>
                      <span className="text-sm">{card.badge}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </Container>
      ) : null}

      {!available ? (
        <div className="pt-16 md:pt-24">
          <CtaBand title={dict.book.seenInStore} text={dict.book.seenInStoreText}>
            <ButtonAnchor href={addListingUrl} variant="white" size="lg">
              {dict.book.addWhereToBuy}
            </ButtonAnchor>
          </CtaBand>
        </div>
      ) : null}
    </>
  );
}
