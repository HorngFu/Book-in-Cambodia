import "server-only";
import { isLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

export type LocaleParams = Promise<{ locale: string }>;

/** Resolve the locale and dictionary for a page from its route params. */
export async function pageContext(params: Promise<{ locale: string }>) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return { locale, dict: getDictionary(locale) };
}
