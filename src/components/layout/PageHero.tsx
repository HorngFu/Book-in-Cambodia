import Link from "next/link";
import type { ReactNode } from "react";
import { TwoTone } from "@/components/ui/Heading";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="text-[15px]">
      <ol className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-1.5">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Lavender rounded panel at the top of inner pages. */
export function PagePanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className="px-2 md:px-4">
      <div className={cn("mx-auto max-w-[1408px] rounded-lg bg-primary-tint", className)}>
        {children}
      </div>
    </section>
  );
}

export function PageHero({
  start,
  accent,
  lead,
  children,
}: {
  start: ReactNode;
  accent?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <PagePanel className="flex flex-col items-center gap-4 px-4 py-12 text-center md:px-6 md:py-18">
      <h1 className="text-[34px] leading-[1.1] tracking-tightest md:text-[56px]">
        <TwoTone start={start} accent={accent} />
      </h1>
      {lead ? <p className="max-w-2xl text-body-strong md:text-lg">{lead}</p> : null}
      {children}
    </PagePanel>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-[1200px] px-4 md:px-6", className)}>{children}</div>;
}
