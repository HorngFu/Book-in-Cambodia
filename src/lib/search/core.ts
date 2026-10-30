// Search logic shared by the index build script, the browser and the tests.
// No server-only or browser-only imports here.

import MiniSearch, { type Options } from "minisearch";

export type SearchDoc = {
  id: string;
  title: string;
  titleKm: string;
  subtitle: string;
  authorsEn: string;
  authorsKm: string;
  /** Category names in both languages, for matching. */
  categoryNames: string;
  categories: string[];
  /** Normalized ISBN-13 and ISBN-10 values. */
  isbns: string[];
  language: string;
  available: boolean;
  provinces: string[];
  formats: string[];
  storeCount: number;
  /** Lowest paid price in USD, 0 when only free to read, null when unknown. */
  lowestPrice: number | null;
  cover: string | null;
  addedOn: string;
};

export type SearchIndexFile = { version: 1; generatedAt: string; docs: SearchDoc[] };

export type SearchFilters = {
  category?: string;
  language?: string;
  province?: string;
  format?: string;
  available?: boolean;
};

const KHMER = /[ក-៿᧠-᧿]/;

export function hasKhmer(text: string) {
  return KHMER.test(text);
}

/** Lowercase and strip Latin accents. Khmer marks are letters, so only U+0300–036F is removed. */
export function normalize(text: string) {
  return text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** "978-0-06-085626-7" → "9780060856267"; returns null if it isn't ISBN-shaped. */
export function normalizeIsbn(text: string): string | null {
  const s = text.replace(/[\s-]/g, "").toUpperCase();
  return /^\d{9}[\dX]$/.test(s) || /^97[89]\d{10}$/.test(s) ? s : null;
}

export function isbn10to13(isbn10: string): string {
  const core = `978${isbn10.slice(0, 9)}`;
  const sum = [...core].reduce((acc, d, i) => acc + Number(d) * (i % 2 ? 3 : 1), 0);
  return `${core}${(10 - (sum % 10)) % 10}`;
}

let segmenter: Intl.Segmenter | null | undefined;
function khmerSegmenter() {
  if (segmenter === undefined) {
    try {
      segmenter =
        typeof Intl !== "undefined" && "Segmenter" in Intl
          ? new Intl.Segmenter("km", { granularity: "word" })
          : null;
    } catch {
      segmenter = null;
    }
  }
  return segmenter;
}

/**
 * Split on spaces and punctuation. Khmer has no spaces between words, so each
 * Khmer run is kept whole and also split into words with Intl.Segmenter.
 */
export function tokenize(text: string): string[] {
  const tokens: string[] = [];
  for (const chunk of text.split(/[\s\p{P}\p{S}]+/u)) {
    if (!chunk) continue;
    tokens.push(chunk);
    if (hasKhmer(chunk)) {
      const seg = khmerSegmenter();
      if (!seg) continue;
      for (const part of seg.segment(chunk)) {
        if (part.isWordLike && part.segment !== chunk) tokens.push(part.segment);
      }
    }
  }
  return tokens;
}

type IndexedDoc = SearchDoc & { authors: string; isbn: string };

export const miniSearchOptions: Options<IndexedDoc> = {
  idField: "id",
  fields: ["title", "titleKm", "subtitle", "authors", "categoryNames", "isbn"],
  storeFields: [],
  tokenize,
  processTerm: (term) => normalize(term) || null,
  searchOptions: {
    boost: { title: 3, titleKm: 3, authors: 2, subtitle: 1, categoryNames: 1 },
    prefix: true,
    fuzzy: (term) => (hasKhmer(term) ? false : term.length > 3 ? 0.2 : false),
  },
};

export type BookSearch = {
  docs: SearchDoc[];
  byId: Map<string, SearchDoc>;
  index: MiniSearch<IndexedDoc>;
};

export function createBookSearch(docs: SearchDoc[]): BookSearch {
  const index = new MiniSearch<IndexedDoc>(miniSearchOptions);
  index.addAll(
    docs.map((d) => ({
      ...d,
      authors: `${d.authorsEn} ${d.authorsKm}`,
      isbn: d.isbns.join(" "),
    })),
  );
  return { docs, byId: new Map(docs.map((d) => [d.id, d])), index };
}

const compact = (text: string) => normalize(text).replace(/\s+/g, "");

/** Matching books, best first. An empty query returns every book, newest first. */
export function searchBooks(search: BookSearch, query: string): SearchDoc[] {
  const q = query.trim();
  if (!q) return [...search.docs].sort((a, b) => b.addedOn.localeCompare(a.addedOn));

  const isbn = normalizeIsbn(q);
  if (isbn) {
    const wanted = new Set([isbn, isbn.length === 10 ? isbn10to13(isbn) : isbn]);
    const exact = search.docs.filter((d) => d.isbns.some((i) => wanted.has(i)));
    if (exact.length) return exact;
  }

  const ids = search.index.search(q).map((r) => String(r.id));

  // Khmer word splitting isn't perfect (names especially), so also match Khmer
  // text as a plain substring and append anything the index missed.
  if (hasKhmer(q)) {
    const needle = compact(q);
    const seen = new Set(ids);
    for (const doc of search.docs) {
      if (seen.has(doc.id)) continue;
      const haystack = compact(`${doc.titleKm} ${doc.authorsKm} ${doc.categoryNames}`);
      if (haystack.includes(needle)) ids.push(doc.id);
    }
  }

  return ids.map((id) => search.byId.get(id)).filter((d): d is SearchDoc => !!d);
}

export function applyFilters(docs: SearchDoc[], filters: SearchFilters): SearchDoc[] {
  return docs.filter(
    (d) =>
      (!filters.category || d.categories.includes(filters.category)) &&
      (!filters.language || d.language === filters.language) &&
      (!filters.province || d.provinces.includes(filters.province)) &&
      (!filters.format || d.formats.includes(filters.format)) &&
      (!filters.available || d.available),
  );
}
