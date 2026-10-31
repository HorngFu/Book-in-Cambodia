"use client";

import { useEffect, useState } from "react";
import type { BookCardData } from "@/lib/book-card";
import { format, plural } from "@/i18n/format";
import { createBookSearch, type BookSearch, type SearchDoc, type SearchIndexFile } from "./core";

let loading: Promise<BookSearch> | null = null;

/** Fetch the index once per page load; revalidated with the server (ETag) each time. */
export function loadBookSearch(): Promise<BookSearch> {
  loading ??= fetch("/search-index.json", { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error(`search index: HTTP ${res.status}`);
      return res.json() as Promise<SearchIndexFile>;
    })
    .then((file) => createBookSearch(file.docs))
    .catch((error) => {
      loading = null; // allow a retry
      throw error;
    });
  return loading;
}

/** Loads the index when `enabled` first becomes true (e.g. when the search box is focused). */
export function useBookSearch(enabled: boolean) {
  const [state, setState] = useState<{ search?: BookSearch; error?: boolean }>({});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || state.search) return;
    let live = true;
    loadBookSearch().then(
      (search) => live && setState({ search }),
      () => live && setState({ error: true }),
    );
    return () => {
      live = false;
    };
  }, [enabled, state.search, attempt]);

  return {
    ...state,
    retry: () => {
      setState({});
      setAttempt((n) => n + 1);
    },
  };
}

export type CardLabels = {
  languages: Record<string, string>;
  inStoresOne: string;
  inStoresOther: string;
  notInCambodia: string;
  requestIt: string;
  free: string;
  from: string;
};

export function docTitle(doc: SearchDoc, locale: "en" | "km") {
  return locale === "km" && doc.titleKm ? doc.titleKm : doc.title;
}

export function docToCard(doc: SearchDoc, locale: "en" | "km", labels: CardLabels): BookCardData {
  const price = doc.lowestPrice;
  return {
    slug: doc.id,
    title: docTitle(doc, locale),
    altTitle: doc.titleKm ? (locale === "km" ? doc.title : doc.titleKm) : undefined,
    authorNames: locale === "km" ? doc.authorsKm : doc.authorsEn,
    cover: doc.cover,
    language: labels.languages[doc.language] ?? doc.language,
    available: doc.available,
    badge: doc.available
      ? plural(doc.storeCount, labels.inStoresOne, labels.inStoresOther)
      : labels.notInCambodia,
    priceLabel: !doc.available
      ? labels.requestIt
      : price === null
        ? ""
        : price === 0
          ? labels.free
          : format(labels.from, {
              price: Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`,
            }),
  };
}
