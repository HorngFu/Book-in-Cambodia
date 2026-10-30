import { ButtonAnchor } from "@/components/ui/Button";
import { contributeUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { NavLinks, type NavItem } from "./NavLinks";

export function SiteHeader({
  locale,
  dict,
  navItems,
}: {
  locale: Locale;
  dict: Dictionary;
  navItems: NavItem[];
}) {
  return (
    <header className="px-4 py-3 md:px-6 md:py-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-x-4 gap-y-3 lg:gap-x-8">
        <Logo href={href(locale)} />
        <NavLinks items={navItems} label={dict.nav.main} />
        <div className="flex items-center gap-3">
          <LanguageSwitch current={locale} label={dict.nav.language} />
          <span className="hidden sm:block">
            <ButtonAnchor href={contributeUrl} variant="dark">
              {dict.nav.contribute}
            </ButtonAnchor>
          </span>
        </div>
      </div>
    </header>
  );
}
