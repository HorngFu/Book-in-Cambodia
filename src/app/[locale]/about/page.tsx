import type { Metadata } from "next";
import { Container, PageHero } from "@/components/layout/PageHero";
import { site } from "@/config/site";
import { localized } from "@/i18n/config";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAboutPage, getSiteSettings } from "@/lib/content";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  const about = await getAboutPage();
  return {
    title: dict.nav.about,
    description: localized(locale, about.intro, about.introKm),
    alternates: { canonical: href(locale, paths.about) },
  };
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const [about, settings] = await Promise.all([getAboutPage(), getSiteSettings()]);
  const [before, after] = dict.about.contactText.split("{email}");

  return (
    <>
      <PageHero
        start={dict.about.title}
        accent={dict.about.titleAccent}
        lead={localized(locale, about.intro, about.introKm)}
      />
      <Container className="max-w-[860px] pt-14 md:pt-20">
        <div className="flex flex-col gap-10">
          {about.sections.map((section, i) => (
            <section key={i} className="flex flex-col gap-3">
              <h2 className="text-[28px] leading-tight tracking-tightest md:text-[32px]">
                {localized(locale, section.heading, section.headingKm)}
              </h2>
              <p className="whitespace-pre-line text-lg">
                {localized(locale, section.body, section.bodyKm)}
              </p>
            </section>
          ))}
          <section className="flex flex-col gap-3 rounded-lg bg-surface p-7">
            <h2 className="text-2xl tracking-tighter">{dict.about.disclaimerTitle}</h2>
            <p>{localized(locale, settings.disclaimer, settings.disclaimerKm)}</p>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl tracking-tighter">{dict.about.contactTitle}</h2>
            <p>
              {before}
              <a href={`mailto:${site.email}`}>{site.email}</a>
              {after}
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
