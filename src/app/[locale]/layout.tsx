import { Home, MapPin, Package, Search } from "lucide-react";
import type { Metadata } from "next";
import { Epilogue, Kantumruy_Pro } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileTabBar, type NavItem } from "@/components/layout/NavLinks";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href, paths } from "@/i18n/routes";
import "../globals.css";

const epilogue = Epilogue({ subsets: ["latin", "latin-ext"], variable: "--font-epilogue" });
const kantumruy = Kantumruy_Pro({ subsets: ["khmer", "latin"], variable: "--font-kantumruy" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

type Params = Promise<{ locale: string }>;

async function getLocale(params: Params): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : "en";
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await getLocale(params);
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · ${dict.meta.title}` },
    description: dict.meta.description,
    alternates: {
      canonical: href(locale),
      languages: Object.fromEntries(locales.map((l) => [l, href(l)])),
    },
    openGraph: {
      siteName: site.name,
      locale: locale === "km" ? "km_KH" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const locale = await getLocale(params);
  const dict = getDictionary(locale);

  const navItems: NavItem[] = [
    { href: href(locale), label: dict.nav.home, exact: true },
    { href: href(locale, paths.books), label: dict.nav.books },
    { href: href(locale, paths.stores), label: dict.nav.stores },
    { href: href(locale, paths.importServices), label: dict.nav.abroad },
  ];

  const iconProps = { size: 22, strokeWidth: 2, "aria-hidden": true } as const;
  const tabItems: NavItem[] = [
    { href: href(locale), label: dict.nav.home, exact: true, icon: <Home {...iconProps} /> },
    { href: href(locale, paths.search), label: dict.nav.search, icon: <Search {...iconProps} /> },
    { href: href(locale, paths.stores), label: dict.nav.stores, icon: <MapPin {...iconProps} /> },
    {
      href: href(locale, paths.importServices),
      label: dict.nav.abroadShort,
      icon: <Package {...iconProps} />,
    },
  ];

  return (
    <html lang={locale} className={`${epilogue.variable} ${kantumruy.variable}`}>
      <body className="pb-24 lg:pb-0">
        <a
          href="#main"
          className="sr-only z-50 rounded-sm bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {dict.nav.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict} navItems={navItems} />
        <main id="main">{children}</main>
        <SiteFooter locale={locale} dict={dict} />
        <MobileTabBar items={tabItems} label={dict.nav.main} />
      </body>
    </html>
  );
}
