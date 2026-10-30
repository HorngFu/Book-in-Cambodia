import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const control =
  "min-h-12 w-full rounded-sm border border-line-input bg-white px-3.5 text-ink outline-none focus:border-primary";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, "pr-8", className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label className={cn("flex flex-col gap-2 font-semibold text-ink", className)} {...props} />
  );
}
