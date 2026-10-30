import type { Metadata } from "next";
import { AbroadSteps } from "@/components/abroad/AbroadSteps";
import { ImportServiceCard } from "@/components/abroad/ImportServiceCard";
import { Container, PageHero } from "@/components/layout/PageHero";
import { ButtonAnchor } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/Heading";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllImportServices } from "@/lib/content";
import { forms } from "@/lib/contribute";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: dict.nav.abroad,
    description: dict.abroad.lead,
    alternates: { canonical: href(locale, paths.importServices) },
  };
}

export default async function ImportServicesPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const services = await getAllImportServices();

  return (
    <>
      <PageHero
        start={dict.abroad.titleStart}
        accent={dict.abroad.titleAccent}
        lead={dict.abroad.lead}
      />
      <Container className="pt-16 md:pt-24">
        <AbroadSteps dict={dict} />
      </Container>
      <Container className="pb-4 pt-16 md:pt-24">
        <section aria-labelledby="services-h">
          <SectionHeader
            id="services-h"
            start={dict.abroad.servicesStart}
            accent={dict.abroad.servicesAccent}
            action={
              <ButtonAnchor href={forms.addImportService()} variant="outline">
                {dict.abroad.runService}
              </ButtonAnchor>
            }
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
            {services.map((service, i) => (
              <ImportServiceCard
                key={service.slug}
                service={service}
                index={i}
                href={href(locale, paths.importService(service.slug))}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm">{dict.abroad.disclaimer}</p>
        </section>
      </Container>
    </>
  );
}
