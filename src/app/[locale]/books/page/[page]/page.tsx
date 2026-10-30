import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookList, pageCount } from "@/components/books/BookList";
import { Container, PageHero } from "@/components/layout/PageHero";
import { format } from "@/i18n/dictionaries";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { paths } from "@/i18n/routes";
import { getAllBooks } from "@/lib/content";

type Params = Promise<{ locale: string; page: string }>;

export const dynamicParams = false;

/** Page 1 lives at /books; this route renders /books/page/2 onwards. */
export async function generateStaticParams() {
  const total = pageCount((await getAllBooks()).length);
  const pages = Array.from({ length: total - 1 }, (_, i) => ({ page: String(i + 2) }));
  // Next needs at least one param set when dynamicParams is false; "2" 404s if there is no page 2.
  return pages.length ? pages : [{ page: "2" }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { dict } = await pageContext(params as LocaleParams);
  const { page } = await params;
  return { title: `${dict.nav.books} · ${page}`, robots: { index: false } };
}

export default async function BooksPageN({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const page = Number((await params).page);
  const books = await getAllBooks();
  const total = pageCount(books.length);
  if (!Number.isInteger(page) || page < 2 || page > total) notFound();
  return (
    <>
      <PageHero
        start={dict.books.titleStart}
        accent={dict.books.titleAccent}
        lead={format(dict.books.page, { page, total })}
      />
      <Container className="pt-12 md:pt-16">
        <BookList books={books} locale={locale} dict={dict} basePath={paths.books} page={page} />
      </Container>
    </>
  );
}
