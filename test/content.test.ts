import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getAllAuthors,
  getAllBooks,
  getAllCategories,
  getAllStores,
  getAboutPage,
  getSiteSettings,
} from "@/lib/content";

// Guards the content in content/: every reference must point at a real entry,
// so a typo in a slug fails CI instead of silently hiding a listing.

describe("content", () => {
  it("reads every collection", async () => {
    const [books, authors, categories, stores] = await Promise.all([
      getAllBooks(),
      getAllAuthors(),
      getAllCategories(),
      getAllStores(),
    ]);
    expect(books.length).toBeGreaterThan(0);
    expect(authors.length).toBeGreaterThan(0);
    expect(categories.length).toBeGreaterThan(0);
    expect(stores.length).toBeGreaterThan(0);
  });

  it("books only reference existing authors and categories", async () => {
    const [books, authors, categories] = await Promise.all([
      getAllBooks(),
      getAllAuthors(),
      getAllCategories(),
    ]);
    const authorSlugs = new Set(authors.map((a) => a.slug));
    const categorySlugs = new Set(categories.map((c) => c.slug));
    for (const book of books) {
      expect(book.authors.length, `${book.slug} has no author`).toBeGreaterThan(0);
      for (const author of book.authors) {
        expect(authorSlugs.has(author ?? ""), `${book.slug} → unknown author "${author}"`).toBe(
          true,
        );
      }
      for (const category of book.categories) {
        expect(
          categorySlugs.has(category ?? ""),
          `${book.slug} → unknown category "${category}"`,
        ).toBe(true);
      }
    }
  });

  it("availability only references existing stores", () => {
    // Read the raw files: getAllBooks() drops unknown stores, so check before that.
    const stores = new Set(
      readdirSync(join(process.cwd(), "content/stores")).map((f) => f.replace(/\.yaml$/, "")),
    );
    const dir = join(process.cwd(), "content/books");
    for (const file of readdirSync(dir)) {
      const text = readFileSync(join(dir, file), "utf8");
      for (const match of text.matchAll(/^\s+- store: "?([\w-]+)"?/gm)) {
        expect(stores.has(match[1]), `${file} → unknown store "${match[1]}"`).toBe(true);
      }
    }
  });

  it("reads the singletons", async () => {
    const [settings, about] = await Promise.all([getSiteSettings(), getAboutPage()]);
    expect(settings.disclaimer).not.toBe("");
    expect(about.sections.length).toBeGreaterThan(0);
  });
});
