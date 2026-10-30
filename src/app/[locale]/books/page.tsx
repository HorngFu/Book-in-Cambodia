import type { Metadata } from "next";
import { BookList } from "@/components/books/BookList";
import { Container, PageHero } from "@/components/layout/PageHero";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllBooks } from "@/lib/content";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: dict.nav.books,
    description: dict.books.lead,
    alternates: { canonical: href(locale, paths.books) },
  };
}

export default async function BooksPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const books = await getAllBooks();
  return (
    <>
      <PageHero
        start={dict.books.titleStart}
        accent={dict.books.titleAccent}
        lead={dict.books.lead}
      />
      <Container className="pt-12 md:pt-16">
        <BookList books={books} locale={locale} dict={dict} basePath={paths.books} />
      </Container>
    </>
  );
}
