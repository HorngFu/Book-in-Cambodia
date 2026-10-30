import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/Heading";
import { localized, type Locale } from "@/i18n/config";
import { plural, type Dictionary } from "@/i18n/dictionaries";
import { pageContext, type LocaleParams } from "@/i18n/page";
import { href, paths } from "@/i18n/routes";
import { getAllAuthors, getAllBooks, type Author } from "@/lib/content";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, dict } = await pageContext(params);
  return {
    title: dict.authors.titleStart,
    description: dict.authors.lead,
    alternates: { canonical: href(locale, paths.authors) },
  };
}

function AuthorTile({
  author,
  count,
  locale,
  dict,
  highlight,
}: {
  author: Author;
  count: number;
  locale: Locale;
  dict: Dictionary;
  highlight?: boolean;
}) {
  const name = localized(locale, author.name, author.nameKm);
  const other = author.nameKm ? (locale === "km" ? author.name : author.nameKm) : null;
  return (
    <li>
      <Link
        href={href(locale, paths.author(author.slug))}
        className={
          highlight
            ? "flex h-full flex-col gap-1 rounded-lg bg-primary-tint p-6 no-underline hover:bg-primary-soft"
            : "flex h-full flex-col gap-0.5 rounded-lg bg-surface p-5 no-underline hover:bg-primary-tint"
        }
      >
        <span className="text-xl font-semibold tracking-tighter text-ink">{name}</span>
        {other ? <span className="text-[15px] text-body-strong">{other}</span> : null}
        <span className="text-sm text-body">
          {plural(count, dict.authors.booksOne, dict.authors.booksOther)}
        </span>
        {highlight && author.bio ? (
          <span className="mt-2 line-clamp-3 text-sm text-body-strong">
            {localized(locale, author.bio, author.bioKm)}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

export default async function AuthorsPage({ params }: { params: LocaleParams }) {
  const { locale, dict } = await pageContext(params);
  const [authors, books] = await Promise.all([getAllAuthors(), getAllBooks()]);
  const counts = new Map<string, number>();
  for (const book of books) {
    for (const a of book.authors) counts.set(a, (counts.get(a) ?? 0) + 1);
  }
  const cambodian = authors.filter((a) => a.cambodian);

  return (
    <>
      <PageHero start={dict.authors.titleStart} lead={dict.authors.lead} />
      <Container className="pt-14 md:pt-20">
        {cambodian.length ? (
          <section aria-labelledby="cambodian" id="cambodian" className="mb-16 scroll-mt-6">
            <SectionHeader
              id="cambodian-h"
              start={dict.authors.cambodianStart}
              accent={dict.authors.cambodianAccent}
              lead={dict.authors.cambodianLead}
            />
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-5">
              {cambodian.map((a) => (
                <AuthorTile
                  key={a.slug}
                  author={a}
                  count={counts.get(a.slug) ?? 0}
                  locale={locale}
                  dict={dict}
                  highlight
                />
              ))}
            </ul>
          </section>
        ) : null}
        <section aria-labelledby="all-authors">
          <SectionHeader
            id="all-authors"
            start={dict.authors.allStart}
            accent={dict.authors.allAccent}
          />
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-4">
            {authors.map((a) => (
              <AuthorTile
                key={a.slug}
                author={a}
                count={counts.get(a.slug) ?? 0}
                locale={locale}
                dict={dict}
              />
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
