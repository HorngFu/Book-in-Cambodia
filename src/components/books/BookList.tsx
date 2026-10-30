import Link from "next/link";
import { BookCard, BookGrid } from "@/components/books/BookCard";
import { ChipLink } from "@/components/ui/Chip";
import { localized, type Locale } from "@/i18n/config";
import { format, plural, type Dictionary } from "@/i18n/dictionaries";
import { href, paths } from "@/i18n/routes";
import { getAllCategories, getLookups, type Book } from "@/lib/content";
import { toBookCard } from "@/lib/view";

export const PAGE_SIZE = 24;

export function pageCount(total: number) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/** Category chips, a count and a grid of book cards, with optional pagination. */
export async function BookList({
  books,
  locale,
  dict,
  activeCategory,
  page = 1,
  basePath,
}: {
  books: Book[];
  locale: Locale;
  dict: Dictionary;
  activeCategory?: string;
  page?: number;
  /** Path of page 1, e.g. "/books"; later pages are basePath + "/page/N". */
  basePath?: string;
}) {
  const [{ authors }, categories] = await Promise.all([getLookups(), getAllCategories()]);
  const total = pageCount(books.length);
  const shown = basePath ? books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : books;
  const pageHref = (n: number) => href(locale, n === 1 ? basePath! : `${basePath}/page/${n}`);

  return (
    <>
      <nav aria-label={dict.home.categoriesStart} className="mb-8 flex flex-wrap gap-2.5">
        <ChipLink href={href(locale, paths.books)} selected={!activeCategory}>
          {dict.books.allCategories}
        </ChipLink>
        {categories.map((c) => (
          <ChipLink
            key={c.slug}
            href={href(locale, paths.category(c.slug))}
            selected={activeCategory === c.slug}
          >
            {localized(locale, c.name, c.nameKm)}
          </ChipLink>
        ))}
      </nav>
      <p className="mb-6">{plural(books.length, dict.books.countOne, dict.books.countOther)}</p>
      <BookGrid>
        {shown.map((book) => {
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
      {basePath && total > 1 ? (
        <nav
          aria-label={dict.books.pagination}
          className="mt-10 flex items-center justify-center gap-4"
        >
          {page > 1 ? <Link href={pageHref(page - 1)}>← {dict.books.previous}</Link> : null}
          <span>{format(dict.books.page, { page, total })}</span>
          {page < total ? <Link href={pageHref(page + 1)}>{dict.books.next} →</Link> : null}
        </nav>
      ) : null}
    </>
  );
}
