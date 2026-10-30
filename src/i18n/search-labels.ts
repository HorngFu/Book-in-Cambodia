import "server-only";
import type { SearchAppLabels } from "@/components/search/SearchApp";
import type { SearchBoxLabels } from "@/components/search/SearchBox";
import { bookLanguages } from "@/data/options";
import type { CardLabels } from "@/lib/search/client";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";

// Client components can't read the dictionary; pass them only the strings they need.

export function cardLabels(locale: Locale, dict: Dictionary): CardLabels {
  return {
    languages: Object.fromEntries(bookLanguages.map((l) => [l.value, l[locale]])),
    inStoresOne: dict.book.inStoresOne,
    inStoresOther: dict.book.inStoresOther,
    notInCambodia: dict.book.notInCambodia,
    orderFromAbroad: dict.book.orderFromAbroad,
    free: dict.book.free,
    from: dict.book.from,
  };
}

export function searchBoxLabels(locale: Locale, dict: Dictionary): SearchBoxLabels {
  return {
    label: dict.search.label,
    placeholder: dict.search.placeholder,
    button: dict.search.button,
    loading: dict.search.loading,
    seeAll: dict.search.seeAll,
    suggestions: dict.search.suggestions,
    card: cardLabels(locale, dict),
  };
}

export function searchAppLabels(locale: Locale, dict: Dictionary): SearchAppLabels {
  const s = dict.search;
  return {
    label: s.label,
    placeholder: s.placeholder,
    button: s.button,
    resultsOne: s.resultsOne,
    resultsOther: s.resultsOther,
    countOne: dict.books.countOne,
    countOther: dict.books.countOther,
    filters: s.filters,
    clearAll: s.clearAll,
    availableOnly: s.availableOnly,
    language: s.language,
    category: s.category,
    province: s.province,
    format: s.format,
    any: s.any,
    loading: s.loading,
    error: s.error,
    retry: s.retry,
    noResultsTitle: s.noResultsTitle,
    noResultsFiltered: s.noResultsFiltered,
    noResultsText: s.noResultsText,
    requestBook: s.requestBook,
    noGithub: dict.contribute.noGithub,
    orderAbroad: s.orderAbroad,
    coverOf: dict.book.coverOf,
    card: cardLabels(locale, dict),
  };
}
