import Link from "next/link";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href, paths } from "@/i18n/routes";
import { ReportLink } from "./ReportLink";

const linkClass = "text-body no-underline hover:text-primary";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const contribute = href(locale, paths.contribute);
  return (
    <footer className="mx-auto max-w-[1200px] px-4 pb-10 pt-16 md:px-6 md:pt-22">
      <div className="flex flex-wrap justify-between gap-12 border-b border-line pb-12">
        <div className="flex max-w-[400px] flex-[1_1_320px] flex-col gap-3.5">
          <span lang="en" className="text-[22px] font-bold tracking-[-0.06em] text-primary">
            bookincambodia
          </span>
          <p>{dict.footer.about}</p>
        </div>
        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-lg">{dict.footer.explore}</h2>
            <Link className={linkClass} href={href(locale, paths.books)}>
              {dict.nav.books}
            </Link>
            <Link className={linkClass} href={href(locale, paths.stores)}>
              {dict.nav.stores}
            </Link>
            <Link className={linkClass} href={href(locale, paths.authors)}>
              {dict.authors.titleStart}
            </Link>
            <Link className={linkClass} href={href(locale, paths.about)}>
              {dict.nav.about}
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <h2 className="text-lg">{dict.footer.contribute}</h2>
            <Link className={linkClass} href={contribute}>
              {dict.nav.contributeLong}
            </Link>
            <Link className={linkClass} href={`${contribute}#store`}>
              {dict.footer.addBookOrStore}
            </Link>
            <Link className={linkClass} href={`${contribute}#report`}>
              {dict.footer.reportWrongInfo}
            </Link>
            <a className={linkClass} href={site.repoUrl}>
              {dict.footer.github}
            </a>
          </div>
          <div className="flex flex-col gap-2.5">
            <h2 className="text-lg">{dict.footer.nonProfit}</h2>
            <Link className={linkClass} href={href(locale, paths.community)}>
              {dict.nav.community}
            </Link>
            <Link className={linkClass} href={href(locale, paths.getInvolved)}>
              {dict.community.volunteer}
            </Link>
            <a className={linkClass} href={`mailto:${site.email}`}>
              {dict.footer.contact}
            </a>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-between gap-4 text-sm">
        <p>{dict.footer.license}</p>
        <ReportLink label={dict.contribute.reportPage} />
      </div>
    </footer>
  );
}
