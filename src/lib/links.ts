// Helpers that turn stored contact details into links.

export function telegramUrl(username: string): string {
  const clean = username
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/t\.me\//, "");
  return `https://t.me/${clean}`;
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapsUrl(name: string, address: string, explicit?: string | null): string {
  if (explicit) return explicit;
  const query = [name, address, "Cambodia"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Prefilled GitHub issue (Phase 6 replaces this with issue forms). */
export function issueUrl(repoUrl: string, title: string, body = ""): string {
  const params = new URLSearchParams({ title, body });
  return `${repoUrl}/issues/new?${params.toString()}`;
}

export function formatUsd(value: number): string {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

export function formatRiel(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)}៛`;
}
