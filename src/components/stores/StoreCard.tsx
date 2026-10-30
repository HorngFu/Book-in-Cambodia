import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { ContactButtons } from "@/components/listings/ContactButtons";
import { SampleBadge, VerifiedLine } from "@/components/listings/ListingCard";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { BookShelf } from "@/components/ui/BookShelf";
import { optionLabel, storeTypes } from "@/data/options";
import { localized, type Locale } from "@/i18n/config";
import { plural, type Dictionary } from "@/i18n/dictionaries";
import type { Store } from "@/lib/content";
import { provinceName } from "@/lib/view";

const typeTone: Record<string, BadgeTone> = {
  bookstore: "white",
  "second-hand": "warn",
  library: "library",
  online: "neutral",
  publisher: "white",
};

export function StoreCard({
  store,
  href,
  bookCount,
  seed,
  locale,
  dict,
}: {
  store: Store;
  href: string;
  bookCount: number;
  seed: number;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = localized(locale, store.name, store.nameKm);
  const address = localized(locale, store.address, store.addressKm);
  const icon = { size: 16, strokeWidth: 2, "aria-hidden": true } as const;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-card">
      <div className="relative h-[140px] bg-primary-tint">
        <BookShelf
          count={16}
          height={110}
          scale={0.6}
          seed={seed}
          className="absolute inset-x-6 bottom-0"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge tone={typeTone[store.type] ?? "white"}>
            {optionLabel(storeTypes, store.type, locale)}
          </Badge>
          {store.sampleData ? <SampleBadge dict={dict} /> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-6 pb-7 pt-6 md:px-7">
        <h2 className="text-[22px] tracking-tighter">
          <Link href={href} className="text-ink no-underline hover:text-primary">
            {name}
          </Link>
        </h2>
        {locale === "en" && store.nameKm ? (
          <span lang="km" className="text-[15px]">
            {store.nameKm}
          </span>
        ) : null}
        <p className="mt-1.5 flex gap-2.5 text-[15px] text-body-strong">
          <MapPin {...icon} className="mt-1 shrink-0 text-primary" />
          <span>
            {address}
            {store.province !== "online" ? ` · ${provinceName(store.province, locale)}` : null}
          </span>
        </p>
        {store.hours ? (
          <p className="flex gap-2.5 text-[15px] text-body-strong">
            <Clock {...icon} className="mt-1 shrink-0 text-primary" />
            {store.hours}
          </p>
        ) : null}
        <div className="mt-2.5 flex flex-wrap justify-between gap-2 border-t border-line-divider pt-4 text-sm">
          <span className="font-semibold text-ink">
            {plural(bookCount, dict.stores.booksListedOne, dict.stores.booksListedOther)}
          </span>
          <VerifiedLine date={store.lastVerified} locale={locale} dict={dict} />
        </div>
        <div className="mt-auto pt-2">
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
        </div>
      </div>
    </article>
  );
}
