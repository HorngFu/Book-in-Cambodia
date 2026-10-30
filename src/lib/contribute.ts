// Links that open a pre-filled GitHub issue form (.github/ISSUE_TEMPLATE/*.yml)
// or an email. Field keys match the `id`s in the issue forms. Usable on the
// server and in the browser.

import { site } from "@/config/site";

export type IssueForm =
  "request-book" | "add-listing" | "add-store" | "add-import-service" | "report-problem";

export function issueFormUrl(
  form: IssueForm,
  title: string,
  fields: Record<string, string | undefined> = {},
): string {
  const params = new URLSearchParams({ template: `${form}.yml`, title });
  for (const [key, value] of Object.entries(fields)) {
    if (value) params.set(key, value);
  }
  return `${site.repoUrl}/issues/new?${params.toString()}`;
}

export const forms = {
  requestBook: (book: { title?: string; author?: string; isbn?: string } = {}) =>
    issueFormUrl("request-book", `Book request: ${book.title ?? ""}`, {
      book_title: book.title,
      author: book.author,
      isbn: book.isbn,
    }),
  addListing: (book?: { title: string; url: string }) =>
    issueFormUrl("add-listing", `Where to buy: ${book?.title ?? ""}`, {
      book: book ? `${book.title} — ${book.url}` : undefined,
    }),
  addStore: (name?: string) => issueFormUrl("add-store", `Add store: ${name ?? ""}`),
  addImportService: () => issueFormUrl("add-import-service", "Add import service: "),
  reportProblem: (pageUrl: string, what?: string) =>
    issueFormUrl("report-problem", `Wrong info: ${what ?? ""}`, { page_url: pageUrl }),
};

export function mailtoUrl(subject: string, body = ""): string {
  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which mail apps show literally.
  return `mailto:${site.email}?${params.toString().replace(/\+/g, "%20")}`;
}
