"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

/** Links to the same page in the other language. */
export function LanguageSwitch({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|km)(?=\/|$)/, "");

  return (
    <div role="group" aria-label={label} className="flex rounded-full bg-control p-1">
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={`/${locale}${rest}`}
            hrefLang={locale}
            lang={locale}
            aria-current={active ? "true" : undefined}
            className={cn(
              "flex min-h-9 items-center rounded-full px-3.5 text-sm font-semibold no-underline",
              active
                ? "bg-white text-ink shadow-[0_1px_4px_rgb(27_27_27/0.1)]"
                : "text-body hover:text-ink",
            )}
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </div>
  );
}
