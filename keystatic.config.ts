import { collection, config, fields } from "@keystatic/core";

// Local mode in development (edits files on disk); GitHub mode in production
// (edits become commits). Switched with NEXT_PUBLIC_KEYSTATIC_STORAGE=github.
const storage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github"
    ? ({ kind: "github", repo: { owner: "HorngFu", name: "Book-in-Cambodia" } } as const)
    : ({ kind: "local" } as const);

export default config({
  storage,
  ui: {
    brand: { name: "Book in Cambodia" },
  },
  collections: {
    books: collection({
      label: "Books",
      slugField: "title",
      path: "content/books/*",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
      },
    }),
  },
});
