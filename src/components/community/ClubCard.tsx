import { Send, Users } from "lucide-react";
import Link from "next/link";
import { SampleBadge } from "@/components/listings/ListingCard";
import { buttonClasses } from "@/components/ui/Button";
import { bookLanguages, optionLabel } from "@/data/options";
import { localized, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href, paths } from "@/i18n/routes";
import { cn } from "@/lib/cn";
import type { BookClub } from "@/lib/content";
import { telegramUrl } from "@/lib/links";
import { provinceName } from "@/lib/view";

export function clubJoinLink(club: BookClub) {
  if (club.joinUrl) return club.joinUrl;
  if (club.telegram) return telegramUrl(club.telegram);
  return null;
}

export function ClubCard({
  club,
  locale,
  dict,
}: {
  club: BookClub;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = localized(locale, club.name, club.nameKm);
  const languages = club.languages.map((l) => optionLabel(bookLanguages, l, locale)).join(", ");
  const join = clubJoinLink(club);
  const joinClass = cn(
    buttonClasses("primary", "md"),
    "mt-auto",
    club.sampleData && "pointer-events-none opacity-50",
  );

  return (
    <article className="flex flex-col gap-2.5 rounded-lg border border-line p-7 md:p-8">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary-tint text-primary">
          <Users size={26} aria-hidden="true" />
        </span>
        {club.sampleData ? <SampleBadge dict={dict} /> : null}
      </div>
      <h3 className="mt-2 text-[22px] leading-tight tracking-tighter">
        <Link
          href={href(locale, paths.bookClub(club.slug))}
          className="text-ink no-underline hover:text-primary"
        >
          {name}
        </Link>
      </h3>
      <p className="text-[15px]">
        {provinceName(club.province, locale)}
        {languages ? ` · ${languages}` : null}
      </p>
      {club.meets ? (
        <p className="text-[15px] text-body-strong">
          {localized(locale, club.meets, club.meetsKm)}
        </p>
      ) : null}
      {club.reads ? (
        <p className="mb-3 text-[15px] text-body-strong">
          {dict.clubs.reads}: {localized(locale, club.reads, club.readsKm)}
        </p>
      ) : null}
      {join ? (
        club.sampleData ? (
          <span aria-disabled="true" className={joinClass}>
            <Send size={18} aria-hidden="true" />
            {dict.clubs.join}
          </span>
        ) : (
          <a href={join} target="_blank" rel="noopener noreferrer" className={joinClass}>
            <Send size={18} aria-hidden="true" />
            {club.joinUrl ? dict.clubs.join : dict.clubs.joinTelegram}
          </a>
        )
      ) : null}
    </article>
  );
}
