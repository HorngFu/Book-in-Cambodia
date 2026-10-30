"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type NavItem = { href: string; label: string; icon?: ReactNode; exact?: boolean };

function isActive(pathname: string, item: NavItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="hidden flex-wrap gap-x-9 gap-y-1.5 font-medium lg:flex">
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn("no-underline", active ? "text-primary" : "text-ink hover:text-primary")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Bottom tab bar for phones (hidden from lg up). */
export function MobileTabBar({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-40 grid border-t border-line-divider bg-white px-1 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 lg:hidden"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs no-underline",
              active ? "font-semibold text-primary" : "font-medium text-body hover:text-primary",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
