import { BookPlus, CalendarHeart, Code, Languages, PhoneCall } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { forms } from "@/lib/contribute";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: `${dict.involved.titleStart}${locale === "km" ? "" : " "}${dict.involved.titleAccent}`,
    description: dict.involved.lead,
    alternates: { canonical: href(locale, paths.getInvolved) },
  };
}

export default async function GetInvolvedPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const contribute = href(locale, paths.contribute);
  const icon = { size: 26, strokeWidth: 2, "aria-hidden": true } as const;
  const targets = [
    { icon: <BookPlus {...icon} />, href: `${contribute}#listing`, external: false },
    { icon: <PhoneCall {...icon} />, href: `${contribute}#report`, external: false },
    {
      icon: <Languages {...icon} />,
      href: `${site.repoUrl}/issues?q=is%3Aopen+label%3Atranslation`,
      external: true,
    },
    { icon: <CalendarHeart {...icon} />, href: forms.submitEvent(), external: true },
    { icon: <Code {...icon} />, href: `${site.repoUrl}/blob/main/CONTRIBUTING.md`, external: true },
  ];

  return (
    <>
      <PageHero
        start={dict.involved.titleStart}
        accent={dict.involved.titleAccent}
        lead={dict.involved.lead}
      />
      <Container className="pt-14 md:pt-20">
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {dict.involved.roles.map((role, i) => {
            const target = targets[i];
            const className =
              "flex h-full flex-col gap-2 rounded-lg bg-white p-8 text-body no-underline shadow-card hover:text-body hover:shadow-float";
            const content = (
              <>
                <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary-tint text-primary">
                  {target?.icon}
                </span>
                <span className="text-[22px] font-semibold tracking-tighter text-ink">
                  {role.title}
                </span>
                <span className="text-[15px]">{role.text}</span>
                <span className="mt-auto pt-3 font-semibold text-primary">{role.cta} →</span>
              </>
            );
            return (
              <li key={role.title}>
                {target?.external ? (
                  <a href={target.href} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link href={target?.href ?? contribute} className={className}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-10 text-center">
          <ButtonLink href={contribute} variant="outline">
            {dict.involved.waysTitle}
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
