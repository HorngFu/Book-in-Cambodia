import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BookCardData } from "@/lib/book-card";
import { BookCover } from "./BookCover";

export function BookCard({
  book,
  href,
  coverAlt,
}: {
  book: BookCardData;
  href: string;
  coverAlt: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg bg-white text-body no-underline shadow-card transition-shadow hover:text-body hover:shadow-float"
    >
      <div className="relative flex h-[230px] items-center justify-center bg-primary-tint">
        <BookCover
          slug={book.slug}
          title={book.title}
          author={book.authorNames}
          cover={book.cover}
          alt={coverAlt}
          className="transition-transform group-hover:-translate-y-1"
        />
        <Badge tone={book.available ? "white" : "warn"} className="absolute left-4 top-4">
          <span className={book.available ? "text-ok" : undefined}>{book.badge}</span>
        </Badge>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <div className="mb-3 flex flex-col gap-1">
          <span className="text-xl font-semibold leading-tight tracking-tighter text-ink group-hover:text-primary">
            {book.title}
          </span>
          {book.altTitle ? (
            <span className="text-[15px] text-body-strong">{book.altTitle}</span>
          ) : null}
          <span className="text-[15px]">{book.authorNames}</span>
        </div>
        <span className="mt-auto flex justify-between gap-3 border-t border-line-divider pt-3.5 text-sm text-body-strong">
          <span>{book.language}</span>
          <span className="text-right font-semibold text-ink">{book.priceLabel}</span>
        </span>
      </div>
    </Link>
  );
}

export function BookGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-6">
      {children}
    </div>
  );
}
