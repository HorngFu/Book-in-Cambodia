import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "raised" | "outline" | "surface" | "tint";

const variants: Record<CardVariant, string> = {
  raised: "bg-white shadow-card",
  outline: "border border-line bg-white",
  surface: "bg-surface",
  tint: "bg-primary-tint",
};

export function cardClasses(variant: CardVariant = "raised") {
  return cn("rounded-lg", variants[variant]);
}

export function Card({
  variant,
  className,
  ...props
}: { variant?: CardVariant } & ComponentProps<"div">) {
  return <div className={cn(cardClasses(variant), className)} {...props} />;
}
