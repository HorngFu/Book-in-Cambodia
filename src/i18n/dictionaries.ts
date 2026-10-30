import "server-only";
import type { Locale } from "./config";
import en from "./messages/en.json";
import km from "./messages/km.json";

export type Dictionary = typeof en;

// Khmer must have every key English has; the type check enforces it.
const dictionaries: Record<Locale, Dictionary> = { en, km };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** "In 1 store" / "In {count} stores" picked by count. */
export function plural(count: number, one: string, other: string): string {
  return count === 1 ? one : format(other, { count });
}

/** Replace {name} placeholders: format("In {count} stores", { count: 3 }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
