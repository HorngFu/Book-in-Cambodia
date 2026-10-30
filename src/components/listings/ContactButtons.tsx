import { MapPin, Phone, Send } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries";
import { format } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { mapsUrl, phoneHref, telegramUrl } from "@/lib/links";

type Contact = {
  name: string;
  address?: string;
  telegram?: string;
  phone?: string;
  mapsUrl?: string | null;
  sample?: boolean;
  /** Online sellers have no map. */
  showMap?: boolean;
};

const icon = { size: 18, strokeWidth: 2, "aria-hidden": true } as const;

/**
 * Telegram (primary) + call + map. Sample (made-up) entries render the same
 * buttons disabled, so the layout is real but nobody is sent to a fake contact.
 */
export function ContactButtons({
  contact,
  dict,
  layout = "row",
}: {
  contact: Contact;
  dict: Dictionary;
  layout?: "row" | "grid";
}) {
  const { name, sample } = contact;
  const disabled = "pointer-events-none opacity-50";
  const iconButton = cn(buttonClasses("soft", "md"), "w-12 px-0");

  const items: React.ReactNode[] = [];

  if (contact.telegram) {
    const cls = cn(
      buttonClasses("dark", "md"),
      "px-5",
      layout === "grid" && "flex-1",
      sample && disabled,
    );
    items.push(
      sample ? (
        <span key="tg" aria-disabled="true" className={cls}>
          <Send {...icon} />
          {dict.listing.telegram}
        </span>
      ) : (
        <a
          key="tg"
          href={telegramUrl(contact.telegram)}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
        >
          <Send {...icon} />
          {dict.listing.telegram}
        </a>
      ),
    );
  }

  if (contact.phone) {
    const label = format(dict.listing.callName, { name });
    items.push(
      sample ? (
        <span
          key="call"
          aria-disabled="true"
          aria-label={label}
          className={cn(iconButton, disabled)}
        >
          <Phone {...icon} />
        </span>
      ) : (
        <a key="call" href={phoneHref(contact.phone)} aria-label={label} className={iconButton}>
          <Phone {...icon} />
        </a>
      ),
    );
  }

  if (contact.showMap !== false) {
    const label = format(dict.listing.mapName, { name });
    const href = mapsUrl(name, contact.address ?? "", contact.mapsUrl);
    items.push(
      sample ? (
        <span
          key="map"
          aria-disabled="true"
          aria-label={label}
          className={cn(iconButton, disabled)}
        >
          <MapPin {...icon} />
        </span>
      ) : (
        <a
          key="map"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={iconButton}
        >
          <MapPin {...icon} />
        </a>
      ),
    );
  }

  if (items.length === 0) return null;
  return <div className={cn("flex flex-wrap gap-2", layout === "grid" && "w-full")}>{items}</div>;
}
