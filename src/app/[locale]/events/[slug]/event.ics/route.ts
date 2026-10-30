import { site } from "@/config/site";
import { provinces } from "@/data/options";
import { isLocale, locales, localized } from "@/i18n/config";
import { href, paths } from "@/i18n/routes";
import { getAllEvents, getEvent } from "@/lib/content";
import { eventToIcs } from "@/lib/events";

// One .ics calendar file per event and language, generated at build time.

export const dynamic = "force-static";
export const dynamicParams = false;

// Route handlers don't inherit the [locale] layout's params, so list both here.
export async function generateStaticParams() {
  const events = await getAllEvents();
  return locales.flatMap((locale) => events.map((e) => ({ locale, slug: e.slug })));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const event = await getEvent(slug);
  if (!event) return new Response("Not found", { status: 404 });

  const province = provinces.find((p) => p.value === event.province);
  const location =
    event.province === "online"
      ? event.onlineUrl || "Online"
      : [event.venue, event.address, province?.en, "Cambodia"].filter(Boolean).join(", ");

  const body = eventToIcs({
    ...event,
    title: localized(locale, event.title, event.titleKm),
    description: localized(locale, event.description, event.descriptionKm),
    location,
    url: `${site.url}${href(locale, paths.event(slug))}`,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
    },
  });
}
