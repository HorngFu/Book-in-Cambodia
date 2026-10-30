import Link from "next/link";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { bookFormats, optionLabel, stockStates, storeTypes } from "@/data/options";
import { localized, type Locale } from "@/i18n/config";
import { format, type Dictionary } from "@/i18n/dictionaries";
import type { Listing, Store } from "@/lib/content";
import { formatDate, isStale } from "@/lib/dates";
import { formatRiel, formatUsd } from "@/lib/links";
import { provinceName } from "@/lib/view";
import { ContactButtons } from "./ContactButtons";

const stockTone: Record<string, BadgeTone> = {
  "in-stock": "ok",
  ask: "warn",
  "out-of-stock": "neutral",
};

export function VerifiedLine({
  date,
  locale,
  dict,
}: {
  date: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const stale = isStale(date);
  return (
    <p className={stale ? "text-sm text-stale" : "text-sm"}>
      {format(dict.listing.checked, { date: formatDate(date, locale) })}
      {stale ? ` · ${dict.listing.mayBeOutdated}` : null}
    </p>
  );
}

export function SampleBadge({ dict }: { dict: Dictionary }) {
  return (
    <span title={dict.listing.sampleNote}>
      <Badge tone="warn">{dict.listing.sample}</Badge>
    </span>
  );
}

/** One "where to get it" row on a book page. */
export function ListingCard({
  listing,
  store,
  storeHref,
  locale,
  dict,
}: {
  listing: Listing;
  store: Store;
  storeHref: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = localized(locale, store.name, store.nameKm);
  const isLibrary = listing.format === "library";
  const price =
    listing.priceUsd === 0 || (isLibrary && listing.priceUsd == null)
      ? dict.book.free
      : listing.priceUsd != null
        ? formatUsd(listing.priceUsd)
        : listing.priceRiel != null
          ? formatRiel(listing.priceRiel)
          : null;
  const stockLabel = isLibrary
    ? optionLabel(bookFormats, "library", locale)
    : optionLabel(stockStates, listing.stock, locale);
  const tone: BadgeTone = isLibrary ? "library" : (stockTone[listing.stock] ?? "neutral");

  return (
    <article className="flex flex-wrap items-center gap-x-7 gap-y-5 rounded-lg bg-white px-5 py-5 shadow-card md:px-7 md:py-6">
      <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-xl tracking-tighter">
            <Link href={storeHref} className="text-ink no-underline hover:text-primary">
              {name}
            </Link>
          </h3>
          <Badge tone="library">{optionLabel(storeTypes, store.type, locale)}</Badge>
          {store.sampleData ? <SampleBadge dict={dict} /> : null}
        </div>
        <p className="text-[15px]">
          {localized(locale, store.address, store.addressKm)}
          {store.province !== "online" ? ` · ${provinceName(store.province, locale)}` : null}
        </p>
        <VerifiedLine date={listing.lastVerified} locale={locale} dict={dict} />
      </div>
      <div className="flex flex-[0_1_180px] flex-col gap-1">
        {price ? (
          <span className="text-[26px] font-semibold leading-tight tracking-tighter text-ink">
            {price}
          </span>
        ) : null}
        {!isLibrary ? (
          <span className="text-sm">{optionLabel(bookFormats, listing.format, locale)}</span>
        ) : null}
        <Badge tone={tone}>{stockLabel}</Badge>
      </div>
      <ContactButtons
        dict={dict}
        contact={{
          name,
          address: store.address,
          telegram: store.telegram,
          phone: store.phone,
          mapsUrl: store.mapsUrl,
          sample: store.sampleData,
          showMap: store.type !== "online",
        }}
      />
    </article>
  );
}
