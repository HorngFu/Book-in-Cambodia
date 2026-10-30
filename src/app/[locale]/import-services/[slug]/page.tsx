import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImportServiceCard } from "@/components/abroad/ImportServiceCard";
import { Breadcrumbs, Container, PagePanel } from "@/components/layout/PageHero";
import { localized } from "@/i18n/config";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllImportServices, getImportService } from "@/lib/content";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllImportServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await pageContext(params as LocaleParams);
  const service = await getImportService((await params).slug);
  if (!service) return {};
  return {
    title: localized(locale, service.name, service.nameKm),
    description: localized(locale, service.description, service.descriptionKm) || undefined,
    alternates: { canonical: href(locale, paths.importService(service.slug)) },
  };
}

export default async function ImportServicePage({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const { slug } = await params;
  const services = await getAllImportServices();
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const service = services[index];
  const name = localized(locale, service.name, service.nameKm);

  return (
    <>
      <PagePanel className="flex flex-col items-center gap-4 px-4 py-12 text-center md:px-6 md:py-16">
        <Breadcrumbs
          label={dict.nav.breadcrumb}
          items={[
            { label: dict.nav.home, href: href(locale) },
            { label: dict.nav.abroad, href: href(locale, paths.importServices) },
            { label: name },
          ]}
        />
        <h1 className="text-[34px] leading-[1.1] tracking-tightest md:text-[56px]">{name}</h1>
      </PagePanel>
      <Container className="max-w-[640px] pt-12">
        <ImportServiceCard
          service={service}
          index={index}
          href={href(locale, paths.importService(service.slug))}
          locale={locale}
          dict={dict}
        />
        <p className="mt-6 text-sm">{dict.abroad.disclaimer}</p>
      </Container>
    </>
  );
}
