import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "ok" | "warn" | "library" | "neutral" | "white";

const tones: Record<BadgeTone, string> = {
  ok: "bg-ok-bg text-ok",
  warn: "bg-warn-bg text-warn",
  library: "bg-primary-tint text-primary-hover",
  neutral: "bg-surface text-ink",
  white: "bg-white text-ink",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-[13px] font-semibold leading-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
