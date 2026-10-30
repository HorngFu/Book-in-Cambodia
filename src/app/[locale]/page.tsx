import { MapPin, Package, Search } from "lucide-react";
import Link from "next/link";
import { BookCard, BookGrid } from "@/components/books/BookCard";
import { Container } from "@/components/layout/PageHero";
import { BookShelf } from "@/components/ui/BookShelf";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { ChipLink } from "@/components/ui/Chip";
import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeader } from "@/components/ui/Heading";
import { SearchBar } from "@/components/ui/SearchBar";
import { site } from "@/config/site";
import { provinces } from "@/data/options";
import { localized } from "@/i18n/config";
import { format, plural } from "@/i18n/dictionaries";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllBooks, getAllCategories, getAllStores, getLookups } from "@/lib/content";
import { issueUrl } from "@/lib/links";
import { toBookCard } from "@/lib/view";

export default async function HomePage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const [books, categories, stores, { authors }] = await Promise.all([
    getAllBooks(),
    getAllCategories(),
    getAllStores(),
    getLookups(),
  ]);
  const searchPath = href(locale, paths.search);
  const recent = books.slice(0, 6);

  const placesByProvince = provinces
    .filter((p) => p.value !== "online")
    .map((p) => ({ ...p, count: stores.filter((s) => s.province === p.value).length }))
    .filter((p) => p.count > 0);

  const icon = { size: 28, strokeWidth: 2, "aria-hidden": true } as const;
  const steps = [
    { icon: <Search {...icon} />, title: dict.home.step1Title, text: dict.home.step1Text },
    { icon: <MapPin {...icon} />, title: dict.home.step2Title, text: dict.home.step2Text },
    { icon: <Package {...icon} />, title: dict.home.step3Title, text: dict.home.step3Text },
  ];

  return (
    <>
      <section className="px-2 md:px-4">
        <div className="mx-auto flex max-w-[1408px] flex-col items-center overflow-hidden rounded-lg bg-primary-tint">
          <div className="flex max-w-[900px] flex-col items-center gap-5 px-4 pt-12 text-center md:px-6 md:pt-24">
            <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
              {dict.home.badge}
            </p>
            <h1 className="text-[38px] leading-[1.1] tracking-tightest md:text-[64px]">
              {dict.home.titleStart} <span className="text-primary">{dict.home.titleAccent}</span>
            </h1>
            <p className="max-w-xl text-body-strong md:text-lg">{dict.home.lead}</p>
          </div>
          <SearchBar
            action={searchPath}
            label={dict.search.label}
            placeholder={dict.search.placeholder}
            button={dict.search.button}
            id="hero-q"
            className="relative z-10 mx-4 mt-8 max-w-[760px] md:mt-10"
          />
          <p className="mt-4 px-4 text-sm text-body-strong">
            {dict.home.try} <Link href={`${searchPath}?q=Loung+Ung`}>Loung Ung</Link> ·{" "}
            <Link href={`${searchPath}?q=${encodeURIComponent("ផ្កាស្រពោន")}`}>ផ្កាស្រពោន</Link>
          </p>
          <BookShelf className="mt-6 w-full px-4 md:mt-10" height={180} />
        </div>
      </section>

      <Container className="pt-20 md:pt-30">
        <section aria-labelledby="how">
          <SectionHeader
            id="how"
            centered
            start={dict.home.howStart}
            accent={dict.home.howAccent}
            lead={dict.home.howLead}
          />
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6">
            {steps.map((step) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 rounded-lg border border-line p-8"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary">
                  {step.icon}
                </span>
                <h3 className="mt-2 text-2xl tracking-tighter">{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      <Container className="pt-20 md:pt-30">
        <section aria-labelledby="categories" className="text-center">
          <SectionHeader
            id="categories"
            centered
            start={dict.home.categoriesStart}
            accent={dict.home.categoriesAccent}
            lead={dict.home.categoriesLead}
          />
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((c, i) => (
              <ChipLink
                key={c.slug}
                href={href(locale, paths.category(c.slug))}
                selected={i === 0}
                size="lg"
              >
                {localized(locale, c.name, c.nameKm)}
                {locale === "en" && c.nameKm ? (
                  <span lang="km" className="font-normal opacity-75">
                    {c.nameKm}
                  </span>
                ) : null}
              </ChipLink>
            ))}
          </div>
        </section>
      </Container>

      <Container className="pt-20 md:pt-30">
        <section aria-labelledby="recent">
          <SectionHeader
            id="recent"
            start={dict.home.recentStart}
            accent={dict.home.recentAccent}
            action={
              <ButtonLink href={href(locale, paths.books)} variant="outline">
                {dict.home.seeAllBooks}
              </ButtonLink>
            }
          />
          <BookGrid>
            {recent.map((book) => {
              const card = toBookCard(book, authors, locale, dict);
              return (
                <BookCard
                  key={book.slug}
                  book={card}
                  href={href(locale, paths.book(book.slug))}
                  coverAlt={format(dict.book.coverOf, { title: card.title })}
                />
              );
            })}
          </BookGrid>
        </section>
      </Container>

      <Container className="pt-20 md:pt-30">
        <section aria-labelledby="provinces">
          <SectionHeader
            id="provinces"
            start={dict.home.provincesStart}
            accent={dict.home.provincesAccent}
            action={
              <ButtonLink href={href(locale, paths.stores)} variant="outline">
                {dict.home.allStores}
              </ButtonLink>
            }
          />
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,180px),1fr))] gap-4">
            {placesByProvince.map((p) => (
              <li key={p.value}>
                <Link
                  href={href(locale, paths.stores)}
                  className="flex flex-col gap-0.5 rounded-lg bg-surface p-6 no-underline hover:bg-primary-tint"
                >
                  <span className="text-xl font-semibold tracking-tighter text-ink">
                    {p[locale]}
                  </span>
                  <span className="text-[15px] text-body">
                    {locale === "en" ? `${p.km} · ` : null}
                    {plural(p.count, dict.home.placesCountOne, dict.home.placesCountOther)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <Container className="max-w-[860px] pt-20 md:pt-30">
        <section aria-labelledby="faq">
          <SectionHeader
            id="faq"
            centered
            start={dict.home.faqStart}
            accent={dict.home.faqAccent}
          />
          <div className="flex flex-col gap-3">
            {dict.home.faq.map((item) => (
              <details key={item.q} className="group rounded-md bg-surface px-6 md:px-7">
                <summary className="flex min-h-18 items-center justify-between gap-4 text-lg font-semibold tracking-tight text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-2xl font-normal text-primary transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Container>

      <div className="pt-20 md:pt-30">
        <CtaBand title={dict.home.ctaTitle} text={dict.home.ctaText}>
          <ButtonLink href={href(locale, paths.importServices)} variant="white" size="lg">
            {dict.book.orderFromAbroad}
          </ButtonLink>
          <ButtonAnchor
            href={issueUrl(
              site.repoUrl,
              "Book request: ",
              "Title: \nAuthor: \nISBN (optional): \nProvince: ",
            )}
            variant="outline-white"
            size="lg"
          >
            {dict.home.requestBook}
          </ButtonAnchor>
        </CtaBand>
      </div>
    </>
  );
}
