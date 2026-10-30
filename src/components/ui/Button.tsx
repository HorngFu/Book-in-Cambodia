import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "dark" | "outline" | "soft" | "white" | "outline-white";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover hover:text-white",
  dark: "bg-ink text-white hover:bg-black hover:text-white",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  soft: "bg-primary-tint text-primary-hover hover:bg-primary-soft hover:text-primary-hover",
  white: "bg-white text-ink hover:bg-primary-tint hover:text-ink",
  "outline-white": "border border-white text-white hover:bg-white hover:text-ink",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-[15px]",
  md: "min-h-12 px-6",
  lg: "min-h-14 px-8",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-semibold no-underline transition-colors",
    variants[variant],
    sizes[size],
  );
}

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return <button type={type} className={cn(buttonClasses(variant, size), className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={cn(buttonClasses(variant, size), className)} {...props} />;
}

/** For external links (Telegram, phone, maps). */
export function ButtonAnchor({ variant, size, className, ...props }: Common & ComponentProps<"a">) {
  return <a className={cn(buttonClasses(variant, size), className)} {...props} />;
}
