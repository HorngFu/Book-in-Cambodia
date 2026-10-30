"use client";

import { useMemo, useState, type ReactNode } from "react";
import { chipClasses } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

export type FilterItem = { key: string; tags: Record<string, string>; content: ReactNode };
export type FilterGroup = {
  name: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
  /** "select" for long lists (provinces on a book page), "chips" for short ones. */
  control: "select" | "chips";
};

/**
 * Client-side filtering of server-rendered items. Without JavaScript every item
 * is shown, so the page still works.
 */
export function FilterableList({
  groups,
  items,
  emptyText,
  countLabel,
  listClassName,
  controlsClassName,
}: {
  groups: FilterGroup[];
  items: FilterItem[];
  emptyText: string;
  /** e.g. { one: "Showing 1 place", other: "Showing {count} places" } */
  countLabel?: { one: string; other: string };
  listClassName?: string;
  controlsClassName?: string;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const visible = useMemo(
    () =>
      items.filter((item) =>
        Object.entries(selected).every(([group, value]) => !value || item.tags[group] === value),
      ),
    [items, selected],
  );

  const set = (group: string, value: string) => setSelected((s) => ({ ...s, [group]: value }));

  return (
    <>
      <div className={controlsClassName}>
        {groups.map((group) =>
          group.control === "select" ? (
            <label key={group.name} className="flex items-center gap-2.5">
              {group.label}
              <select
                value={selected[group.name] ?? ""}
                onChange={(e) => set(group.name, e.target.value)}
                className="min-h-12 rounded-sm border border-line-input bg-white px-3.5 text-ink"
              >
                <option value="">{group.allLabel}</option>
                {group.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div
              key={group.name}
              role="group"
              aria-label={group.label}
              className="flex flex-wrap items-center gap-2.5"
            >
              <span className="min-w-21 font-semibold text-ink">{group.label}</span>
              {[{ value: "", label: group.allLabel }, ...group.options].map((o) => {
                const active = (selected[group.name] ?? "") === o.value;
                return (
                  <button
                    key={o.value || "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => set(group.name, o.value)}
                    className={chipClasses(active)}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          ),
        )}
      </div>
      {countLabel ? (
        <p className="mb-6 mt-8" aria-live="polite">
          {visible.length === 1
            ? countLabel.one
            : countLabel.other.replace("{count}", String(visible.length))}
        </p>
      ) : null}
      {visible.length > 0 ? (
        <div className={cn(listClassName)}>
          {visible.map((item) => (
            <div key={item.key} className="contents">
              {item.content}
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-surface px-6 py-10 text-center">{emptyText}</p>
      )}
    </>
  );
}
