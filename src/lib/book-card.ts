/** Plain data a BookCard renders. Shared by server pages and the client-side search. */
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
