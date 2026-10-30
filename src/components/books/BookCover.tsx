import { cn } from "@/lib/cn";

const palette: Array<[string, string]> = [
  ["#7a2e2e", "#ffffff"],
  ["#2e2a5c", "#ffffff"],
  ["#b4475e", "#ffffff"],
  ["#1b1b1b", "#ffb547"],
  ["#ffb547", "#1b1b1b"],
  ["#ffffff", "#1b1b1b"],
  ["#6357e8", "#ffffff"],
  ["#0f5c4d", "#ffffff"],
  ["#ff8a65", "#1b1b1b"],
];

function colorsFor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

const sizes = {
  xs: { width: 52, title: "text-[0px]", author: "hidden", pad: "p-0" },
  sm: { width: 92, title: "text-[13px]", author: "text-[10px]", pad: "p-2" },
  md: { width: 120, title: "text-[17px]", author: "text-[11px]", pad: "px-2.5 py-3" },
  lg: { width: 220, title: "text-[28px]", author: "text-sm", pad: "px-[18px] py-[22px]" },
  xl: { width: 260, title: "text-[30px]", author: "text-sm", pad: "px-5 py-6" },
} as const;

export type CoverSize = keyof typeof sizes;

/** A real cover image when we have one, otherwise a colored placeholder with title and author. */
export function BookCover({
  slug,
  title,
  author,
  cover,
  alt,
  size = "md",
  className,
}: {
  slug: string;
  title: string;
  author: string;
  cover?: string | null;
  alt: string;
  size?: CoverSize;
  className?: string;
}) {
  const s = sizes[size];
  const shadow =
    size === "xs"
      ? "shadow-[0_4px_10px_rgb(27_27_27/0.15)]"
      : "shadow-[inset_6px_0_0_rgb(0_0_0/0.18),0_14px_28px_rgb(27_27_27/0.2)]";

  if (cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- covers are pre-optimized WebP; next/image optimization is off on Cloudflare
      <img
        src={cover}
        alt={alt}
        width={s.width}
        height={Math.round(s.width * 1.5)}
        loading="lazy"
        className={cn(
          "aspect-[2/3] shrink-0 rounded-[4px_10px_10px_4px] object-cover",
          shadow,
          className,
        )}
        style={{ width: s.width }}
      />
    );
  }

  const [bg, fg] = colorsFor(slug);
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "flex aspect-[2/3] shrink-0 flex-col justify-between overflow-hidden rounded-[4px_10px_10px_4px] text-left",
        s.pad,
        shadow,
        className,
      )}
      style={{ width: s.width, background: bg, color: fg }}
    >
      <span
        aria-hidden="true"
        className={cn("line-clamp-5 font-bold leading-[1.1] tracking-tighter", s.title)}
      >
        {title}
      </span>
      <span aria-hidden="true" className={cn("line-clamp-2 opacity-85", s.author)}>
        {author}
      </span>
    </div>
  );
}
