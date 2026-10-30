import Link from "next/link";
import { BookShelf } from "@/components/ui/BookShelf";
import { SearchBar } from "@/components/ui/SearchBar";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href, paths } from "@/i18n/routes";

export const dynamic = "force-static";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const searchPath = href(locale, paths.search);

  return (
    <section className="px-2 md:px-4">
      <div className="mx-auto flex max-w-[1408px] flex-col items-center overflow-hidden rounded-lg bg-primary-tint">
        <div className="flex max-w-[900px] flex-col items-center gap-5 px-4 pt-12 text-center md:px-6 md:pt-24">
          <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
            {dict.home.badge}
          </p>
          <h1 className="text-[38px] leading-[1.1] tracking-tightest md:text-[64px]">
            {dict.home.titleStart} <span className="text-primary">{dict.home.titleAccent}</span>
          </h1>
          <p className="max-w-xl text-body-strong md:text-lg">{dict.home.lead}</p>
        </div>
        <SearchBar
          action={searchPath}
          label={dict.search.label}
          placeholder={dict.search.placeholder}
          button={dict.search.button}
          id="hero-q"
          className="relative z-10 mx-4 mt-8 max-w-[760px] md:mt-10"
        />
        <p className="mt-4 px-4 text-sm text-body-strong">
          {dict.home.try} <Link href={`${searchPath}?q=Loung+Ung`}>Loung Ung</Link> ·{" "}
          <Link href={`${searchPath}?q=${encodeURIComponent("ផ្កាស្រពោន")}`}>ផ្កាស្រពោន</Link>
        </p>
        <BookShelf className="mt-6 w-full px-4 md:mt-10" height={180} />
      </div>
    </section>
  );
}
