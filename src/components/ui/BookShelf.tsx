import { cn } from "@/lib/cn";

const colors = [
  "var(--color-primary)",
  "var(--color-ink)",
  "var(--color-primary-soft)",
  "var(--color-amber)",
  "#ffffff",
  "var(--color-lilac)",
  "var(--color-navy)",
  "var(--color-coral)",
  "var(--color-primary)",
  "#e0ddfc",
];
const heights = [0.75, 0.94, 0.65, 0.85, 1, 0.7, 0.9, 0.8, 0.6, 0.95];
const widths = [26, 34, 22, 30, 38, 24, 28, 32, 20, 36];

/** Deterministic pseudo-random index so the shelf doesn't visibly repeat. */
function pick(i: number, salt: number, length: number) {
  return (Math.imul(i * 31 + salt, 2654435761) >>> 0) % length;
}

/** Decorative row of book spines; replaces stock photos. */
export function BookShelf({
  count = 34,
  height = 160,
  scale = 1,
  seed = 0,
  className,
}: {
  count?: number;
  height?: number;
  scale?: number;
  seed?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-end justify-center gap-1.5 overflow-hidden", className)}
      style={{ height }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="shrink-0 rounded-t-[4px]"
          style={{
            width: Math.round(widths[pick(i, seed + 1, widths.length)] * scale),
            height: Math.round(height * heights[pick(i, seed + 7, heights.length)]),
            background: colors[pick(i, seed + 13, colors.length)],
            boxShadow: "inset 0 10px 0 rgb(255 255 255 / 0.18)",
          }}
        />
      ))}
    </div>
  );
}
