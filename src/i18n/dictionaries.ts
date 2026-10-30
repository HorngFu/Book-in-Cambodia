import "server-only";
import type { Locale } from "./config";
import en from "./messages/en.json";
import km from "./messages/km.json";

export { format, plural } from "./format";

export type Dictionary = typeof en;

// Khmer must have every key English has; the type check enforces it.
const dictionaries: Record<Locale, Dictionary> = { en, km };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
