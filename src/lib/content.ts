import "server-only";
import { createReader, type Entry } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

// All content is read from the files in content/ at build time. Pages must be
// statically generated: there is no filesystem on Cloudflare Workers at runtime.

const reader = createReader(process.cwd(), keystaticConfig);

type Collections = (typeof keystaticConfig)["collections"];

export type BookEntry = Entry<Collections["books"]>;
export type AuthorEntry = Entry<Collections["authors"]>;
export type CategoryEntry = Entry<Collections["categories"]>;
export type StoreEntry = Entry<Collections["stores"]>;
export type ImportServiceEntry = Entry<Collections["importServices"]>;

export type WithSlug<T> = T & { slug: string };
export type Author = WithSlug<AuthorEntry>;
export type Category = WithSlug<CategoryEntry>;
export type Store = WithSlug<StoreEntry>;
export type ImportService = WithSlug<ImportServiceEntry>;
export type Listing = BookEntry["availability"][number] & { store: string };
export type Book = WithSlug<Omit<BookEntry, "availability" | "authors" | "categories">> & {
  authors: string[];
  categories: string[];
  availability: Listing[];
};

const present = (value: string | null): value is string => !!value;

function memo<T>(load: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | undefined;
  return () => (promise ??= load());
}

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

export const getAllStores = memo(async (): Promise<Store[]> => {
  const all = await reader.collections.stores.all();
  return all.map(({ slug, entry }) => ({ ...entry, slug })).sort(byName);
});

export const getAllAuthors = memo(async (): Promise<Author[]> => {
  const all = await reader.collections.authors.all();
  return all.map(({ slug, entry }) => ({ ...entry, slug })).sort(byName);
});

export const getAllCategories = memo(async (): Promise<Category[]> => {
  const all = await reader.collections.categories.all();
  return all
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || byName(a, b));
});

export const getAllImportServices = memo(async (): Promise<ImportService[]> => {
  const all = await reader.collections.importServices.all();
  return all.map(({ slug, entry }) => ({ ...entry, slug })).sort(byName);
});

/** All books, newest first. Listings pointing at unknown stores are dropped. */
export const getAllBooks = memo(async (): Promise<Book[]> => {
  const [all, stores] = await Promise.all([reader.collections.books.all(), getAllStores()]);
  const storeSlugs = new Set(stores.map((s) => s.slug));
  return all
    .map(({ slug, entry }) => ({
      ...entry,
      slug,
      authors: entry.authors.filter(present),
      categories: entry.categories.filter(present),
      availability: entry.availability.filter(
        (listing): listing is Listing => !!listing.store && storeSlugs.has(listing.store),
      ),
    }))
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn) || a.title.localeCompare(b.title));
});

export async function getBook(slug: string) {
  return (await getAllBooks()).find((b) => b.slug === slug);
}

export async function getAuthor(slug: string) {
  return (await getAllAuthors()).find((a) => a.slug === slug);
}

export async function getCategory(slug: string) {
  return (await getAllCategories()).find((c) => c.slug === slug);
}

export async function getStore(slug: string) {
  return (await getAllStores()).find((s) => s.slug === slug);
}

export async function getImportService(slug: string) {
  return (await getAllImportServices()).find((s) => s.slug === slug);
}

export async function getBooksByAuthor(authorSlug: string) {
  return (await getAllBooks()).filter((b) => b.authors.includes(authorSlug));
}

export async function getBooksByCategory(categorySlug: string) {
  return (await getAllBooks()).filter((b) => b.categories.includes(categorySlug));
}

/** Books listed at a store, each with that store's listing. */
export async function getBooksAtStore(storeSlug: string) {
  const books = await getAllBooks();
  return books.flatMap((book) =>
    book.availability
      .filter((listing) => listing.store === storeSlug)
      .map((listing) => ({ book, listing })),
  );
}

export async function getStoresByProvince(province: string) {
  return (await getAllStores()).filter((s) => s.province === province);
}

/** Lookup maps for rendering (slug → entry). */
export async function getLookups() {
  const [authors, categories, stores] = await Promise.all([
    getAllAuthors(),
    getAllCategories(),
    getAllStores(),
  ]);
  return {
    authors: new Map(authors.map((a) => [a.slug, a])),
    categories: new Map(categories.map((c) => [c.slug, c])),
    stores: new Map(stores.map((s) => [s.slug, s])),
  };
}

export const getSiteSettings = memo(() => reader.singletons.siteSettings.readOrThrow());
export const getAboutPage = memo(() => reader.singletons.aboutPage.readOrThrow());

// ---------- Community (Phase 7) ----------

export type CommunityEvent = WithSlug<Entry<Collections["events"]>>;
export type BookClub = WithSlug<Entry<Collections["bookClubs"]>>;
export type DonationPlace = WithSlug<Entry<Collections["donationPlaces"]>>;

/** All events, soonest first. Use splitEvents() from src/lib/events.ts for upcoming/past. */
export const getAllEvents = memo(async (): Promise<CommunityEvent[]> => {
  const all = await reader.collections.events.all();
  return all
    .map(({ slug, entry }) => ({ ...entry, slug }))
    .sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate) ||
        (a.startTime ?? "").localeCompare(b.startTime ?? ""),
    );
});

export async function getEvent(slug: string) {
  return (await getAllEvents()).find((e) => e.slug === slug);
}

export const getAllBookClubs = memo(async (): Promise<BookClub[]> => {
  const all = await reader.collections.bookClubs.all();
  return all.map(({ slug, entry }) => ({ ...entry, slug })).sort(byName);
});

export async function getBookClub(slug: string) {
  return (await getAllBookClubs()).find((c) => c.slug === slug);
}

export const getAllDonationPlaces = memo(async (): Promise<DonationPlace[]> => {
  const all = await reader.collections.donationPlaces.all();
  return all.map(({ slug, entry }) => ({ ...entry, slug })).sort(byName);
});
