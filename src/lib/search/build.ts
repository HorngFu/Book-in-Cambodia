// Builds the search documents from content. Used by scripts/build-search-index.ts
// and the tests; runs in Node only.

import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../../keystatic.config";
import { normalizeIsbn, type SearchDoc } from "./core";

export async function buildSearchDocs(root = process.cwd()): Promise<SearchDoc[]> {
  const reader = createReader(root, keystaticConfig);
  const [books, authors, categories, stores] = await Promise.all([
    reader.collections.books.all(),
    reader.collections.authors.all(),
    reader.collections.categories.all(),
    reader.collections.stores.all(),
  ]);
  const authorBySlug = new Map(authors.map((a) => [a.slug, a.entry]));
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.entry]));
  const storeBySlug = new Map(stores.map((s) => [s.slug, s.entry]));

  return books.map(({ slug, entry: book }) => {
    const bookAuthors = book.authors.flatMap((s) => (s && authorBySlug.get(s)) || []);
    const bookCategories = book.categories.filter((s): s is string => !!s && categoryBySlug.has(s));
    const listings = book.availability.filter((l) => l.store && storeBySlug.has(l.store));
    const listingStores = listings.map((l) => storeBySlug.get(l.store!)!);
    const prices = listings
      .map((l) => l.priceUsd)
      .filter((p): p is number => typeof p === "number");
    const paid = prices.filter((p) => p > 0);
    const isbns = [book.isbn13, book.isbn10]
      .map((i) => (i ? normalizeIsbn(i) : null))
      .filter((i): i is string => !!i);

    return {
      id: slug,
      title: book.title,
      titleKm: book.titleKm,
      subtitle: book.subtitle,
      authorsEn: bookAuthors.map((a) => a.name).join(", "),
      authorsKm: bookAuthors.map((a) => a.nameKm || a.name).join(", "),
      categoryNames: bookCategories
        .map((c) => `${categoryBySlug.get(c)!.name} ${categoryBySlug.get(c)!.nameKm}`)
        .join(" "),
      categories: bookCategories,
      isbns,
      language: book.language,
      available: listings.length > 0,
      provinces: [...new Set(listingStores.map((s) => s.province))],
      formats: [...new Set(listings.map((l) => l.format))],
      storeCount: new Set(listings.map((l) => l.store)).size,
      lowestPrice: paid.length ? Math.min(...paid) : prices.length ? 0 : null,
      cover: book.cover,
      addedOn: book.addedOn,
    } satisfies SearchDoc;
  });
}
