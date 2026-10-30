"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import { BookCover } from "@/components/books/BookCover";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { searchBooks } from "@/lib/search/core";
import { docToCard, useBookSearch, type CardLabels } from "@/lib/search/client";

export type SearchBoxLabels = {
  label: string;
  placeholder: string;
  button: string;
  loading: string;
  seeAll: string;
  suggestions: string;
  card: CardLabels;
};

const MAX_SUGGESTIONS = 6;

/**
 * Search form with instant suggestions. The index loads on first focus. Without
 * JavaScript it is a plain form that submits to the search page.
 */
export function SearchBox({
  locale,
  action,
  labels,
  className,
}: {
  locale: "en" | "km";
  action: string;
  labels: SearchBoxLabels;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [wantIndex, setWantIndex] = useState(false);
  const [active, setActive] = useState(-1);
  const { search } = useBookSearch(wantIndex);
  const listId = useId();
  const inputId = useId();
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const suggestions = useMemo(
    () => (search && query.trim() ? searchBooks(search, query).slice(0, MAX_SUGGESTIONS) : []),
    [search, query],
  );
  const open = focused && query.trim().length > 0;
  const bookHref = (slug: string) => `/${locale}/books/${slug}`;
  const resultsHref = `${action}?q=${encodeURIComponent(query.trim())}`;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setFocused(false);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      router.push(bookHref(suggestions[active].id));
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <form
        role="search"
        action={action}
        onSubmit={(e) => {
          e.preventDefault();
          router.push(resultsHref);
        }}
        className="flex w-full flex-col gap-2 rounded-[12px] bg-white p-2 shadow-float sm:flex-row"
      >
        <label htmlFor={inputId} className="sr-only">
          {labels.label}
        </label>
        <input
          id={inputId}
          name="q"
          type="search"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
          }}
          onFocus={() => {
            clearTimeout(blurTimer.current);
            setFocused(true);
            setWantIndex(true);
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setFocused(false), 150);
          }}
          onKeyDown={onKeyDown}
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

      {open ? (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-[12px] bg-white text-left shadow-float">
          {!search ? (
            <p className="px-5 py-4 text-sm">{labels.loading}</p>
          ) : (
            <>
              {suggestions.length > 0 ? (
                <ul id={listId} role="listbox" aria-label={labels.suggestions}>
                  {suggestions.map((doc, i) => {
                    const card = docToCard(doc, locale, labels.card);
                    return (
                      <li
                        key={doc.id}
                        id={`${listId}-${i}`}
                        role="option"
                        aria-selected={i === active}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => router.push(bookHref(doc.id))}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 px-4 py-2.5",
                          i === active ? "bg-primary-tint" : "hover:bg-surface",
                        )}
                      >
                        <BookCover
                          slug={doc.id}
                          title={card.title}
                          author=""
                          cover={doc.cover}
                          alt=""
                          size="xs"
                          className="w-9!"
                        />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-semibold text-ink">{card.title}</span>
                          <span className="truncate text-sm">{card.authorNames}</span>
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-xs font-semibold",
                            doc.available ? "text-ok" : "text-warn",
                          )}
                        >
                          {card.badge}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              <a
                href={resultsHref}
                onMouseDown={(e) => e.preventDefault()}
                className="block border-t border-line-divider px-5 py-3.5 font-semibold"
              >
                {format(labels.seeAll, { q: query.trim() })} →
              </a>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
