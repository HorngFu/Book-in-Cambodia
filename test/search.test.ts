import { beforeAll, describe, expect, it } from "vitest";
import {
  applyFilters,
  createBookSearch,
  isbn10to13,
  normalizeIsbn,
  searchBooks,
  tokenize,
  type BookSearch,
} from "@/lib/search/core";
import { buildSearchDocs } from "@/lib/search/build";

let search: BookSearch;
const ids = (query: string) => searchBooks(search, query).map((d) => d.id);

beforeAll(async () => {
  search = createBookSearch(await buildSearchDocs());
});

describe("tokenize", () => {
  it("splits Khmer text into words and keeps the whole run", () => {
    const tokens = tokenize("ផ្កាស្រពោន");
    expect(tokens).toContain("ផ្កាស្រពោន");
    expect(tokens).toContain("ស្រពោន");
  });

  it("splits Latin text on spaces and punctuation", () => {
    expect(tokenize("Stay Alive, My Son")).toEqual(["Stay", "Alive", "My", "Son"]);
  });
});

describe("ISBN", () => {
  it("normalizes hyphenated ISBNs", () => {
    expect(normalizeIsbn("978-0-06-085626-7")).toBe("9780060856267");
    expect(normalizeIsbn("0-06-085626-6")).toBe("0060856266");
    expect(normalizeIsbn("first they killed")).toBeNull();
  });

  it("converts ISBN-10 to ISBN-13", () => {
    expect(isbn10to13("0060856266")).toBe("9780060856267");
  });
});

describe("searchBooks", () => {
  it("finds by English title, with typos and partial words", () => {
    expect(ids("first they killed")[0]).toBe("first-they-killed-my-father");
    expect(ids("sapiens")[0]).toBe("sapiens");
    expect(ids("atomik habbits")[0]).toBe("atomic-habits");
    expect(ids("harry pot")[0]).toBe("harry-potter-and-the-philosophers-stone");
  });

  it("finds by author", () => {
    const results = ids("Loung Ung");
    expect(results.slice(0, 3).sort()).toEqual(
      ["first-they-killed-my-father", "lucky-child", "lulu-in-the-sky"].sort(),
    );
  });

  it("ignores accents", () => {
    expect(ids("francois bizot")[0]).toBe("the-gate");
  });

  it("finds by ISBN-13 and ISBN-10, with or without hyphens", () => {
    expect(ids("9780060856267")).toEqual(["first-they-killed-my-father"]);
    expect(ids("978-0-06-085626-7")).toEqual(["first-they-killed-my-father"]);
    expect(ids("0-06-085626-6")).toEqual(["first-they-killed-my-father"]);
  });

  it("finds Khmer books by their full Khmer title", () => {
    expect(ids("ផ្កាស្រពោន")[0]).toBe("phka-srapon");
    expect(ids("កុលាបប៉ៃលិន")[0]).toBe("kolab-pailin");
    expect(ids("សូផាត")[0]).toBe("sophat");
    expect(ids("ទុំទាវ")[0]).toBe("tum-teav");
    expect(ids("ព្រះអាទិត្យថ្មីរះលើផែនដីចាស់")[0]).toBe("a-new-sun-rises-over-the-old-land");
  });

  it("finds Khmer books by a word or the start of a word inside the title", () => {
    expect(ids("ស្រពោន")).toContain("phka-srapon");
    expect(ids("ប៉ៃលិន")).toContain("kolab-pailin");
    expect(ids("ព្រះអាទិត្យ")).toContain("a-new-sun-rises-over-the-old-land");
    expect(ids("ក្រមង៉ុយ")).toContain("chbab-krom-ngoy");
  });

  it("finds by Khmer author name", () => {
    expect(ids("នូ ហាច")).toContain("phka-srapon");
    expect(ids("ញ៉ុក ថែម")).toContain("kolab-pailin");
  });

  it("finds by romanized Khmer title", () => {
    expect(ids("phka srapon")[0]).toBe("phka-srapon");
    expect(ids("kolab")[0]).toBe("kolab-pailin");
  });

  it("returns every book, newest first, for an empty query", () => {
    const all = searchBooks(search, "");
    expect(all.length).toBe(search.docs.length);
    expect(all[0].addedOn >= all[all.length - 1].addedOn).toBe(true);
  });

  it("returns nothing for nonsense", () => {
    expect(ids("zzzqqqxxx")).toEqual([]);
  });
});

describe("applyFilters", () => {
  it("combines filters", () => {
    const all = searchBooks(search, "");
    const khmerInPP = applyFilters(all, { language: "km", province: "phnom-penh" });
    expect(khmerInPP.length).toBeGreaterThan(0);
    for (const d of khmerInPP) {
      expect(d.language).toBe("km");
      expect(d.provinces).toContain("phnom-penh");
    }
    const availableOnly = applyFilters(all, { available: true });
    expect(availableOnly.every((d) => d.available)).toBe(true);
    expect(availableOnly.map((d) => d.id)).not.toContain("sapiens");
    const history = applyFilters(all, { category: "history", format: "library" });
    expect(
      history.every((d) => d.categories.includes("history") && d.formats.includes("library")),
    ).toBe(true);
  });
});
