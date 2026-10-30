// String helpers usable on the server and in the browser.

/** Replace {name} placeholders: format("In {count} stores", { count: 3 }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** "In 1 store" / "In {count} stores" picked by count. */
export function plural(count: number, one: string, other: string): string {
  return count === 1 ? one : format(other, { count });
}
