import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookList } from "@/components/books/BookList";
import { Breadcrumbs, Container, PageHero } from "@/components/layout/PageHero";
import { localized } from "@/i18n/config";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllCategories, getBooksByCategory, getCategory } from "@/lib/content";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await pageContext(params as LocaleParams);
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return {
    title: localized(locale, category.name, category.nameKm),
    alternates: { canonical: href(locale, paths.category(category.slug)) },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { locale, dict } = await pageContext(params as LocaleParams);
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const name = localized(locale, category.name, category.nameKm);
  const books = await getBooksByCategory(category.slug);

  return (
    <>
      <PageHero start={name} accent={dict.category.titleAccent}>
        <Breadcrumbs
          label={dict.nav.breadcrumb}
          items={[
            { label: dict.nav.home, href: href(locale) },
            { label: dict.nav.books, href: href(locale, paths.books) },
            { label: name },
          ]}
        />
      </PageHero>
      <Container className="pt-12 md:pt-16">
        <BookList books={books} locale={locale} dict={dict} activeCategory={category.slug} />
      </Container>
    </>
  );
}
