import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z" fill="#6357E8" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v4H6.5A2.5 2.5 0 0 1 4 20.5z" fill="#C6C1F9" />
    </svg>
  );
}

export function Logo({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1.5 text-primary no-underline hover:text-primary md:gap-2"
      aria-label="Book in Cambodia, home"
    >
      <span className="md:hidden">
        <LogoMark size={28} />
      </span>
      <span className="hidden md:block">
        <LogoMark size={34} />
      </span>
      <span lang="en" className={cn("text-[19px] font-bold tracking-[-0.06em] md:text-[22px]")}>
        bookincambodia
      </span>
    </Link>
  );
}
