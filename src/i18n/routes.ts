import type { Locale } from "./config";

/** Build a locale-prefixed path: href("km", "/books") → "/km/books". */
export function href(locale: Locale, path = "/"): string {
  if (path === "/" || path === "") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export const paths = {
  home: "/",
  books: "/books",
  book: (slug: string) => `/books/${slug}`,
  search: "/search",
  stores: "/stores",
  store: (slug: string) => `/stores/${slug}`,
  importServices: "/import-services",
  importService: (slug: string) => `/import-services/${slug}`,
  authors: "/authors",
  author: (slug: string) => `/authors/${slug}`,
  categories: "/categories",
  category: (slug: string) => `/categories/${slug}`,
  about: "/about",
  contribute: "/contribute",
} as const;
