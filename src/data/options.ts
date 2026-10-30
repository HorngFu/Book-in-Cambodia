// Fixed option lists shared by the Keystatic config and the website.

export const provinces = [
  { value: "phnom-penh", en: "Phnom Penh", km: "ភ្នំពេញ" },
  { value: "banteay-meanchey", en: "Banteay Meanchey", km: "បន្ទាយមានជ័យ" },
  { value: "battambang", en: "Battambang", km: "បាត់ដំបង" },
  { value: "kampong-cham", en: "Kampong Cham", km: "កំពង់ចាម" },
  { value: "kampong-chhnang", en: "Kampong Chhnang", km: "កំពង់ឆ្នាំង" },
  { value: "kampong-speu", en: "Kampong Speu", km: "កំពង់ស្ពឺ" },
  { value: "kampong-thom", en: "Kampong Thom", km: "កំពង់ធំ" },
  { value: "kampot", en: "Kampot", km: "កំពត" },
  { value: "kandal", en: "Kandal", km: "កណ្ដាល" },
  { value: "kep", en: "Kep", km: "កែប" },
  { value: "koh-kong", en: "Koh Kong", km: "កោះកុង" },
  { value: "kratie", en: "Kratie", km: "ក្រចេះ" },
  { value: "mondulkiri", en: "Mondulkiri", km: "មណ្ឌលគិរី" },
  { value: "oddar-meanchey", en: "Oddar Meanchey", km: "ឧត្ដរមានជ័យ" },
  { value: "pailin", en: "Pailin", km: "ប៉ៃលិន" },
  { value: "preah-sihanouk", en: "Preah Sihanouk", km: "ព្រះសីហនុ" },
  { value: "preah-vihear", en: "Preah Vihear", km: "ព្រះវិហារ" },
  { value: "prey-veng", en: "Prey Veng", km: "ព្រៃវែង" },
  { value: "pursat", en: "Pursat", km: "ពោធិ៍សាត់" },
  { value: "ratanakiri", en: "Ratanakiri", km: "រតនគិរី" },
  { value: "siem-reap", en: "Siem Reap", km: "សៀមរាប" },
  { value: "stung-treng", en: "Stung Treng", km: "ស្ទឹងត្រែង" },
  { value: "svay-rieng", en: "Svay Rieng", km: "ស្វាយរៀង" },
  { value: "takeo", en: "Takeo", km: "តាកែវ" },
  { value: "tbong-khmum", en: "Tbong Khmum", km: "ត្បូងឃ្មុំ" },
  { value: "online", en: "Online / nationwide", km: "អនឡាញ / ទូទាំងប្រទេស" },
] as const;

export const storeTypes = [
  { value: "bookstore", en: "Bookstore", km: "បណ្ណាគារ" },
  { value: "second-hand", en: "Second-hand", km: "សៀវភៅជជុះ" },
  { value: "library", en: "Library", km: "បណ្ណាល័យ" },
  { value: "online", en: "Online seller", km: "អ្នកលក់អនឡាញ" },
  { value: "publisher", en: "Publisher", km: "គ្រឹះស្ថានបោះពុម្ព" },
] as const;

export const bookLanguages = [
  { value: "km", en: "Khmer", km: "ខ្មែរ" },
  { value: "en", en: "English", km: "អង់គ្លេស" },
  { value: "fr", en: "French", km: "បារាំង" },
  { value: "zh", en: "Chinese", km: "ចិន" },
  { value: "other", en: "Other", km: "ផ្សេងទៀត" },
] as const;

export const bookFormats = [
  { value: "paperback", en: "Paperback · new", km: "ក្របទន់ · ថ្មី" },
  { value: "hardcover", en: "Hardcover · new", km: "ក្របរឹង · ថ្មី" },
  { value: "used", en: "Used", km: "ជជុះ" },
  { value: "ebook", en: "Ebook", km: "សៀវភៅអេឡិចត្រូនិក" },
  { value: "library", en: "Read or borrow in the library", km: "អាន ឬខ្ចីនៅបណ្ណាល័យ" },
] as const;

export const stockStates = [
  { value: "in-stock", en: "In stock", km: "មានក្នុងស្តុក" },
  { value: "ask", en: "Ask the store", km: "សួរហាង" },
  { value: "out-of-stock", en: "Out of stock", km: "អស់ពីស្តុក" },
] as const;

type Option = { readonly value: string; readonly en: string; readonly km: string };

/** Keystatic select options from a shared list (English labels in the editor). */
export function selectOptions<T extends readonly Option[]>(list: T) {
  return list.map(({ value, en }) => ({ label: en, value })) as {
    label: string;
    value: T[number]["value"];
  }[];
}

export function optionLabel(list: readonly Option[], value: string, locale: "en" | "km"): string {
  const option = list.find((o) => o.value === value);
  return option ? option[locale] : value;
}

export type ProvinceValue = (typeof provinces)[number]["value"];
export type StoreTypeValue = (typeof storeTypes)[number]["value"];
export type BookLanguageValue = (typeof bookLanguages)[number]["value"];
export type BookFormatValue = (typeof bookFormats)[number]["value"];
export type StockValue = (typeof stockStates)[number]["value"];
