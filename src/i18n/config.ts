export const locales = ["en", "km"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "EN",
  km: "ខ្មែរ",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Pick the Khmer value on Khmer pages when it exists, otherwise the English one. */
export function localized(locale: Locale, en: string, km?: string | null): string {
  return locale === "km" && km ? km : en;
}
