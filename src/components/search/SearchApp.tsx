"use client";

import { SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { BookCard, BookGrid } from "@/components/books/BookCard";
import { buttonClasses } from "@/components/ui/Button";
import { chipClasses } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { format, plural } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { applyFilters, searchBooks, type SearchFilters } from "@/lib/search/core";
import { docToCard, useBookSearch, type CardLabels } from "@/lib/search/client";

type Option = { value: string; label: string };

export type SearchAppLabels = {
  label: string;
  placeholder: string;
  button: string;
  resultsOne: string;
  resultsOther: string;
  countOne: string;
  countOther: string;
  filters: string;
  clearAll: string;
  availableOnly: string;
  language: string;
  category: string;
  province: string;
  format: string;
  any: string;
  loading: string;
  error: string;
  retry: string;
  noResultsTitle: string;
  noResultsFiltered: string;
  noResultsText: string;
  requestBook: string;
  orderAbroad: string;
  coverOf: string;
  card: CardLabels;
};

// URL parameter names; the URL is the single source of truth so results can be shared.
const PARAMS = {
  q: "q",
  category: "cat",
  language: "lang",
  province: "prov",
  format: "fmt",
  available: "avail",
} as const;

export function SearchApp({
  locale,
  labels,
  categories,
  languages,
  provinces,
  formats,
  abroadHref,
  requestUrl,
}: {
  locale: "en" | "km";
  labels: SearchAppLabels;
  categories: Option[];
  languages: Option[];
  provinces: Option[];
  formats: Option[];
  abroadHref: string;
  /** GitHub new-issue URL; the query is appended as the title. */
  requestUrl: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const inputId = useId();

  const q = params.get(PARAMS.q) ?? "";
  const filters: SearchFilters = {
    category: params.get(PARAMS.category) ?? undefined,
    language: params.get(PARAMS.language) ?? undefined,
    province: params.get(PARAMS.province) ?? undefined,
    format: params.get(PARAMS.format) ?? undefined,
    available: params.get(PARAMS.available) === "1",
  };
  const hasFilters = Object.values(filters).some(Boolean);

  const [draft, setDraft] = useState(q);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { search, error, retry } = useBookSearch(true);

  // Keep the box in sync when the URL changes from outside (back button, links).
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setDraft(q);
  }

  function update(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => () => clearTimeout(debounce.current), []);

  const results = useMemo(
    () => (search ? applyFilters(searchBooks(search, q), filters) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filters is derived from params
    [search, q, params],
  );

  const select = (
    name: keyof typeof PARAMS,
    label: string,
    value: string | undefined,
    options: Option[],
  ) => (
    <label className="flex flex-col gap-2.5 font-semibold text-ink">
      {label}
      <select
        value={value ?? ""}
        onChange={(e) => update({ [PARAMS[name]]: e.target.value || undefined })}
        className="min-h-12 rounded-sm border border-line-input bg-white px-3.5 font-normal text-ink"
      >
        <option value="">{labels.any}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  const heading = q
    ? plural(results.length, labels.resultsOne, labels.resultsOther).replace("{q}", q)
    : plural(results.length, labels.countOne, labels.countOther);

  return (
    <div className="flex flex-col gap-8">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          clearTimeout(debounce.current);
          update({ [PARAMS.q]: draft.trim() || undefined });
        }}
        className="mx-auto flex w-full max-w-[760px] flex-col gap-2 rounded-[12px] bg-white p-2 shadow-float sm:flex-row"
      >
        <label htmlFor={inputId} className="sr-only">
          {labels.label}
        </label>
        <input
          id={inputId}
          type="search"
          name="q"
          value={draft}
          onChange={(e) => {
            const value = e.target.value;
            setDraft(value);
            clearTimeout(debounce.current);
            debounce.current = setTimeout(
              () => update({ [PARAMS.q]: value.trim() || undefined }),
              250,
            );
          }}
          placeholder={labels.placeholder}
          autoComplete="off"
          className="min-h-14 min-w-0 flex-1 bg-transparent px-4 text-ink outline-none placeholder:text-body"
        />
        <button
          type="submit"
          className="min-h-14 rounded-sm bg-primary px-9 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {labels.button}
        </button>
      </form>

      <div className="flex flex-wrap items-start gap-8">
        <aside
          aria-label={labels.filters}
          className="flex w-full flex-col gap-6 rounded-lg bg-white p-6 shadow-card lg:w-auto lg:max-w-[300px] lg:flex-[1_1_260px] lg:p-7"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] tracking-tighter">{labels.filters}</h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={() =>
                  update({
                    [PARAMS.category]: undefined,
                    [PARAMS.language]: undefined,
                    [PARAMS.province]: undefined,
                    [PARAMS.format]: undefined,
                    [PARAMS.available]: undefined,
                  })
                }
                className="min-h-11 font-semibold text-primary"
              >
                {labels.clearAll}
              </button>
            ) : null}
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-sm bg-primary-tint p-4 font-semibold text-ink">
            <input
              type="checkbox"
              checked={!!filters.available}
              onChange={(e) => update({ [PARAMS.available]: e.target.checked ? "1" : undefined })}
              className="size-5 accent-primary"
            />
            {labels.availableOnly}
          </label>
          {select("language", labels.language, filters.language, languages)}
          {select("category", labels.category, filters.category, categories)}
          {select("province", labels.province, filters.province, provinces)}
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 font-semibold text-ink">{labels.format}</legend>
            <div className="flex flex-wrap gap-2">
              {[{ value: "", label: labels.any }, ...formats].map((o) => {
                const on = (filters.format ?? "") === o.value;
                return (
                  <button
                    key={o.value || "any"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => update({ [PARAMS.format]: o.value || undefined })}
                    className={chipClasses(on)}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </aside>

        <section aria-live="polite" className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
          {error ? (
            <EmptyState title={labels.error}>
              <button type="button" onClick={retry} className={buttonClasses("outline")}>
                {labels.retry}
              </button>
            </EmptyState>
          ) : !search ? (
            <p className="rounded-lg bg-surface px-6 py-10 text-center">{labels.loading}</p>
          ) : results.length === 0 ? (
            <EmptyState
              icon={<SearchX size={28} aria-hidden="true" />}
              title={q ? format(labels.noResultsTitle, { q }) : labels.noResultsFiltered}
              text={labels.noResultsText}
            >
              <a
                href={`${requestUrl}&title=${encodeURIComponent(`Book request: ${q}`)}`}
                className={buttonClasses("outline")}
              >
                {labels.requestBook}
              </a>
              <a href={abroadHref} className={buttonClasses("dark")}>
                {labels.orderAbroad}
              </a>
            </EmptyState>
          ) : (
            <>
              <h2 className={cn("text-xl tracking-tighter")}>{heading}</h2>
              <BookGrid>
                {results.map((doc) => {
                  const card = docToCard(doc, locale, labels.card);
                  return (
                    <BookCard
                      key={doc.id}
                      book={card}
                      href={`/${locale}/books/${doc.id}`}
                      coverAlt={format(labels.coverOf, { title: card.title })}
                    />
                  );
                })}
              </BookGrid>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
