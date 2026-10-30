import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookCard, BookGrid } from "@/components/books/BookCard";
import { Breadcrumbs, Container, PagePanel } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/Heading";
import { localized } from "@/i18n/config";
import { format } from "@/i18n/dictionaries";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllAuthors, getAuthor, getBooksByAuthor, getLookups } from "@/lib/content";
import { toBookCard } from "@/lib/view";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllAuthors()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await pageContext(params as LocaleParams);
  const author = await getAuthor((await params).slug);
  if (!author) return {};
  return {
    title: localized(locale, author.name, author.nameKm),
    description: localized(locale, author.bio, author.bioKm) || undefined,
    alternates: { canonical: href(locale, paths.author(author.slug)) },
  };
}

export default async function AuthorPage({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const author = await getAuthor((await params).slug);
  if (!author) notFound();
  const [books, { authors }] = await Promise.all([getBooksByAuthor(author.slug), getLookups()]);
  const name = localized(locale, author.name, author.nameKm);
  const otherName = author.nameKm ? (locale === "km" ? author.name : author.nameKm) : null;
  const bio = localized(locale, author.bio, author.bioKm);

  return (
    <>
      <PagePanel className="flex flex-col items-center gap-4 px-4 py-12 text-center md:px-6 md:py-18">
        <Breadcrumbs
          label={dict.nav.breadcrumb}
          items={[{ label: dict.nav.home, href: href(locale) }, { label: name }]}
        />
        {author.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- pre-optimized upload
          <img
            src={author.photo}
            alt=""
            width={112}
            height={112}
            className="size-28 rounded-full object-cover"
          />
        ) : null}
        <h1 className="text-[34px] leading-[1.1] tracking-tightest md:text-[56px]">{name}</h1>
        {otherName ? <p className="text-xl text-body-strong">{otherName}</p> : null}
        {bio ? <p className="max-w-2xl text-body-strong md:text-lg">{bio}</p> : null}
        {author.links.length ? (
          <ul className="flex flex-wrap justify-center gap-4">
            {author.links.filter(Boolean).map((link) => (
              <li key={link}>
                <a href={link!} target="_blank" rel="noopener noreferrer">
                  {new URL(link!).hostname.replace(/^www\./, "")}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </PagePanel>
      <Container className="pt-12 md:pt-16">
        <SectionHeader start={dict.author.booksBy} accent={name} />
        <BookGrid>
          {books.map((book) => {
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
      </Container>
    </>
  );
}
