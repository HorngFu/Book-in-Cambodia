import Link from "next/link";
import { ContactButtons } from "@/components/listings/ContactButtons";
import { SampleBadge, VerifiedLine } from "@/components/listings/ListingCard";
import { ButtonAnchor } from "@/components/ui/Button";
import { localized, type Locale } from "@/i18n/config";
import { format, type Dictionary } from "@/i18n/dictionaries";
import type { ImportService } from "@/lib/content";
import { provinceName } from "@/lib/view";

const logoColors = [
  ["#6357e8", "#ffffff"],
  ["#1b1b1b", "#ffffff"],
  ["#ffb547", "#1b1b1b"],
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function ImportServiceCard({
  service,
  href,
  index,
  locale,
  dict,
}: {
  service: ImportService;
  href: string;
  index: number;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = localized(locale, service.name, service.nameKm);
  const [bg, fg] = logoColors[index % logoColors.length];
  const based =
    format(dict.abroad.basedIn, { place: provinceName(service.basedIn, locale) }) +
    (service.deliversNationwide ? ` · ${dict.abroad.deliversNationwide}` : "");

  return (
    <article className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-card md:p-8">
      <div className="flex items-center gap-3.5">
        {service.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- pre-optimized upload
          <img
            src={service.logo}
            alt=""
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            style={{ background: bg, color: fg }}
          >
            {initials(service.name)}
          </span>
        )}
        <div className="flex min-w-0 flex-col">
          <h3 className="text-[21px] tracking-tighter">
            <Link href={href} className="text-ink no-underline hover:text-primary">
              {name}
            </Link>
          </h3>
          <span className="text-sm">{based}</span>
        </div>
      </div>
      {service.sampleData ? <SampleBadge dict={dict} /> : null}
      <p className="text-[15px]">{localized(locale, service.description, service.descriptionKm)}</p>
      <dl className="flex flex-col gap-2.5 border-y border-line-divider py-4 text-[15px]">
        {service.sources.length ? (
          <div className="flex justify-between gap-3">
            <dt>{dict.abroad.ordersFrom}</dt>
            <dd className="text-right font-semibold text-ink">{service.sources.join(", ")}</dd>
          </div>
        ) : null}
        {service.deliveryTime ? (
          <div className="flex justify-between gap-3">
            <dt>{dict.abroad.usualDelivery}</dt>
            <dd className="text-right font-semibold text-ink">{service.deliveryTime}</dd>
          </div>
        ) : null}
        {service.fees ? (
          <div className="flex justify-between gap-3">
            <dt>{dict.abroad.fees}</dt>
            <dd className="text-right font-semibold text-ink">{service.fees}</dd>
          </div>
        ) : null}
      </dl>
      <VerifiedLine date={service.lastVerified} locale={locale} dict={dict} />
      <div className="mt-auto flex flex-wrap gap-2">
        <ContactButtons
          dict={dict}
          layout="grid"
          contact={{
            name,
            telegram: service.telegram,
            phone: service.phone,
            sample: service.sampleData,
            showMap: false,
          }}
        />
        {service.facebook && !service.sampleData ? (
          <ButtonAnchor
            href={service.facebook}
            variant="soft"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.listing.facebook}
          </ButtonAnchor>
        ) : null}
      </div>
    </article>
  );
}
