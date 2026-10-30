import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function chipClasses(selected = false, size: "sm" | "lg" = "sm") {
  return cn(
    "inline-flex items-center gap-2 rounded-full font-semibold no-underline transition-colors",
    size === "lg" ? "min-h-13 px-6" : "min-h-10 px-4 text-sm",
    selected
      ? "bg-primary text-white hover:bg-primary-hover hover:text-white"
      : "bg-primary-tint text-ink hover:bg-primary-soft hover:text-ink",
  );
}

export function ChipLink({
  selected,
  size,
  className,
  children,
  ...props
}: { selected?: boolean; size?: "sm" | "lg"; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={cn(chipClasses(selected, size), className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function ChipButton({
  selected = false,
  size,
  className,
  children,
  ...props
}: { selected?: boolean; size?: "sm" | "lg"; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(chipClasses(selected, size), className)}
      {...props}
    >
      {children}
    </button>
  );
}
