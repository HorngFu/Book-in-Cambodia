import { ContactButtons } from "@/components/listings/ContactButtons";
import { SampleBadge, VerifiedLine } from "@/components/listings/ListingCard";
import { Badge } from "@/components/ui/Badge";
import { donationNeeds, donationPlaceTypes, optionLabel } from "@/data/options";
import { localized, type Locale } from "@/i18n/config";
import { format, type Dictionary } from "@/i18n/dictionaries";
import type { DonationPlace } from "@/lib/content";
import { formatDate, isDayOver } from "@/lib/dates";
import { provinceName } from "@/lib/view";

export function DonationCard({
  place,
  locale,
  dict,
}: {
  place: DonationPlace;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = localized(locale, place.name, place.nameKm);
  const ended = place.until ? isDayOver(place.until) : false;

  return (
    <article
      id={place.slug}
      className="flex scroll-mt-6 flex-col gap-2.5 rounded-lg bg-surface p-7 md:p-8"
    >
      <div className="flex flex-wrap gap-2">
        <Badge tone="white">{optionLabel(donationPlaceTypes, place.type, locale)}</Badge>
        {place.sampleData ? <SampleBadge dict={dict} /> : null}
      </div>
      <h3 className="mt-1.5 text-[22px] leading-tight tracking-tighter">{name}</h3>
      <p className="text-[15px]">
        {[place.address, provinceName(place.province, locale)].filter(Boolean).join(" · ")}
      </p>
      {place.needs.length ? (
        <div className="mt-1">
          <p className="mb-2 text-sm font-semibold text-ink">{dict.donate.needs}</p>
          <ul className="flex flex-wrap gap-2">
            {place.needs.map((n) => (
              <li key={n}>
                <Badge tone="ok">{optionLabel(donationNeeds, n, locale)}</Badge>
              </li>
            ))}
          </ul>
          {place.needsNotes ? <p className="mt-2 text-[15px]">{place.needsNotes}</p> : null}
        </div>
      ) : null}
      {place.notAccepted ? (
        <p className="text-[15px]">
          <strong className="text-ink">{dict.donate.notAccepted}:</strong> {place.notAccepted}
        </p>
      ) : null}
      {place.howToGive ? (
        <p className="whitespace-pre-line text-[15px] text-body-strong">
          <strong className="text-ink">{dict.donate.howToGive}:</strong>{" "}
          {localized(locale, place.howToGive, place.howToGiveKm)}
        </p>
      ) : null}
      {place.until ? (
        <p className={ended ? "text-sm text-stale" : "text-sm font-semibold text-ink"}>
          {format(dict.donate.until, { date: formatDate(place.until, locale) })}
        </p>
      ) : null}
      <VerifiedLine date={place.lastVerified} locale={locale} dict={dict} />
      <div className="mt-auto pt-2">
        <ContactButtons
          dict={dict}
          contact={{
            name,
            address: place.address,
            telegram: place.telegram,
            phone: place.phone,
            mapsUrl: place.mapsUrl,
            sample: place.sampleData,
          }}
        />
      </div>
    </article>
  );
}
