import "server-only";
import { bookLanguages, optionLabel, provinces } from "@/data/options";
import { localized, type Locale } from "@/i18n/config";
import { format, plural, type Dictionary } from "@/i18n/dictionaries";
import type { Author, Book, Store } from "./content";
import { formatUsd } from "./links";

// Turns content entries into the plain data the cards render.

export type BookCardData = {
  slug: string;
  title: string;
  /** Title in the other script (Khmer title on English pages), if any. */
  altTitle?: string;
  authorNames: string;
  cover?: string | null;
  language: string;
  available: boolean;
  badge: string;
  priceLabel: string;
};

export function bookTitle(book: Book, locale: Locale) {
  return localized(locale, book.title, book.titleKm);
}

export function authorNames(book: Book, authors: Map<string, Author>, locale: Locale): string {
  return book.authors
    .map((slug) => authors.get(slug))
    .filter((a): a is Author => !!a)
    .map((a) => localized(locale, a.name, a.nameKm))
    .join(", ");
}

/**
 * Lowest price to buy the book, or 0 if it is only free to read (libraries),
 * or null if no price is known.
 */
export function lowestPrice(book: Book): number | null {
  const prices = book.availability
    .map((l) => l.priceUsd)
    .filter((p): p is number => typeof p === "number");
  const paid = prices.filter((p) => p > 0);
  if (paid.length) return Math.min(...paid);
  return prices.length ? 0 : null;
}

export function toBookCard(
  book: Book,
  authors: Map<string, Author>,
  locale: Locale,
  dict: Dictionary,
): BookCardData {
  const count = book.availability.length;
  const price = lowestPrice(book);
  const title = bookTitle(book, locale);
  // The title in the other script: Khmer under the romanized title, and vice versa.
  const altTitle = book.titleKm ? (locale === "km" ? book.title : book.titleKm) : undefined;
  return {
    slug: book.slug,
    title,
    altTitle,
    authorNames: authorNames(book, authors, locale),
    cover: book.cover,
    language: optionLabel(bookLanguages, book.language, locale),
    available: count > 0,
    badge:
      count > 0
        ? plural(count, dict.book.inStoresOne, dict.book.inStoresOther)
        : dict.book.notInCambodia,
    priceLabel:
      count === 0
        ? dict.book.orderFromAbroad
        : price === null
          ? ""
          : price === 0
            ? dict.book.free
            : format(dict.book.from, { price: formatUsd(price) }),
  };
}

export function provinceName(value: string, locale: Locale) {
  return optionLabel(provinces, value, locale);
}

export function storeName(store: Store, locale: Locale) {
  return localized(locale, store.name, store.nameKm);
}
