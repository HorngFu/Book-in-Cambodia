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
  authors: "/authors",
  author: (slug: string) => `/authors/${slug}`,
  categories: "/categories",
  category: (slug: string) => `/categories/${slug}`,
  about: "/about",
  contribute: "/contribute",
  community: "/community",
  events: "/events",
  event: (slug: string) => `/events/${slug}`,
  eventIcs: (slug: string) => `/events/${slug}/event.ics`,
  bookClubs: "/book-clubs",
  bookClub: (slug: string) => `/book-clubs/${slug}`,
  donateBooks: "/donate-books",
  getInvolved: "/get-involved",
} as const;
