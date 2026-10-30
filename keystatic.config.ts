import { collection, config, fields, singleton } from "@keystatic/core";
import {
  bookFormats,
  bookLanguages,
  provinces,
  selectOptions,
  stockStates,
  storeTypes,
} from "./src/data/options";

// Local mode in development (edits files on disk); GitHub mode in production
// (edits become commits). Switched with NEXT_PUBLIC_KEYSTATIC_STORAGE=github.
// Editors work on "content/…" branches and open a pull request; maintainers merge.
export const keystaticStorageMode =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github" ? "github" : "local";

const storage =
  keystaticStorageMode === "github"
    ? ({
        kind: "github",
        repo: { owner: "HorngFu", name: "Book-in-Cambodia" },
        branchPrefix: "content/",
      } as const)
    : ({ kind: "local" } as const);

const lastVerified = fields.date({
  label: "Last verified",
  description:
    "The day someone last confirmed this information. Listings older than 6 months are marked as possibly outdated.",
  validation: { isRequired: true },
  defaultValue: { kind: "today" },
});

const sampleData = fields.checkbox({
  label: "Sample data",
  description:
    "Tick for made-up example entries. They show a 'Sample' label and their contact buttons are disabled. Replace before launch.",
  defaultValue: false,
});

const khmerText = (label: string, multiline = false) =>
  fields.text({
    label: `${label} (Khmer)`,
    multiline,
    description: "Optional. Shown on Khmer pages.",
  });

const contact = {
  telegram: fields.text({
    label: "Telegram username",
    description: "Without @, e.g. bookstore_pp. Used for the main contact button.",
  }),
  phone: fields.text({ label: "Phone", description: "International format, e.g. +855 12 345 678" }),
  facebook: fields.url({ label: "Facebook page URL" }),
  website: fields.url({ label: "Website" }),
};

export default config({
  storage,
  ui: {
    brand: { name: "Book in Cambodia" },
    navigation: {
      Catalog: ["books", "authors", "categories"],
      "Where to get books": ["stores", "importServices"],
      Site: ["siteSettings", "aboutPage"],
    },
  },
  collections: {
    books: collection({
      label: "Books",
      slugField: "title",
      path: "content/books/*",
      format: { data: "yaml" },
      columns: ["title", "language"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { length: { min: 1 } } },
          slug: { label: "URL slug", description: "Used in the page address. Latin letters only." },
        }),
        titleKm: khmerText("Title"),
        subtitle: fields.text({ label: "Subtitle" }),
        authors: fields.array(fields.relationship({ label: "Author", collection: "authors" }), {
          label: "Authors",
          itemLabel: (props) => props.value ?? "Select an author",
        }),
        language: fields.select({
          label: "Language",
          options: selectOptions(bookLanguages),
          defaultValue: "en",
        }),
        categories: fields.array(
          fields.relationship({ label: "Category", collection: "categories" }),
          { label: "Categories", itemLabel: (props) => props.value ?? "Select a category" },
        ),
        isbn13: fields.text({
          label: "ISBN-13",
          description: "13 digits, hyphens allowed, e.g. 978-0-06-085626-7",
          validation: {
            pattern: {
              regex: /^$|^97[89][-\s]?(\d[-\s]?){9}\d$/,
              message: "Enter a 13-digit ISBN starting with 978 or 979",
            },
          },
        }),
        isbn10: fields.text({
          label: "ISBN-10",
          validation: {
            pattern: { regex: /^$|^(\d[-\s]?){9}[\dXx]$/, message: "Enter a 10-character ISBN" },
          },
        }),
        publisher: fields.text({ label: "Publisher" }),
        publishedYear: fields.integer({
          label: "First published (year)",
          validation: { min: 1000, max: 2100 },
        }),
        cover: fields.image({
          label: "Cover",
          description:
            "JPEG/PNG/WebP. Run `npm run images` to resize to 600 px WebP before committing.",
          directory: "public/covers",
          publicPath: "/covers/",
        }),
        description: fields.text({ label: "Short description", multiline: true }),
        descriptionKm: khmerText("Short description", true),
        availability: fields.array(
          fields.object({
            store: fields.relationship({
              label: "Store",
              collection: "stores",
              validation: { isRequired: true },
            }),
            format: fields.select({
              label: "Format",
              options: selectOptions(bookFormats),
              defaultValue: "paperback",
            }),
            priceUsd: fields.number({
              label: "Price (USD)",
              description: "Leave empty if unknown. 0 means free.",
              validation: { min: 0 },
            }),
            priceRiel: fields.integer({ label: "Price (riel)", validation: { min: 0 } }),
            stock: fields.select({
              label: "Stock",
              options: selectOptions(stockStates),
              defaultValue: "in-stock",
            }),
            lastVerified,
            link: fields.url({ label: "Link to this book on the seller's page" }),
          }),
          {
            label: "Where to get it in Cambodia",
            itemLabel: (props) =>
              `${props.fields.store.value ?? "Store"} · ${props.fields.format.value}`,
          },
        ),
        importNotes: fields.text({
          label: "Tips for ordering from abroad",
          multiline: true,
          description: "Optional, e.g. which edition to ask for.",
        }),
        addedOn: fields.date({
          label: "Added on",
          description: "Used for 'Recently added'.",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
      },
    }),

    authors: collection({
      label: "Authors",
      slugField: "name",
      path: "content/authors/*",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Name", validation: { length: { min: 1 } } } }),
        nameKm: khmerText("Name"),
        photo: fields.image({
          label: "Photo",
          directory: "public/authors",
          publicPath: "/authors/",
        }),
        bio: fields.text({ label: "Short bio", multiline: true }),
        bioKm: khmerText("Short bio", true),
        links: fields.array(fields.url({ label: "Link" }), {
          label: "Links",
          itemLabel: (props) => props.value ?? "Link",
        }),
      },
    }),

    categories: collection({
      label: "Categories",
      slugField: "name",
      path: "content/categories/*",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Name", validation: { length: { min: 1 } } } }),
        nameKm: khmerText("Name"),
        order: fields.integer({
          label: "Sort order",
          description: "Lower numbers are shown first.",
          defaultValue: 100,
        }),
      },
    }),

    stores: collection({
      label: "Stores and libraries",
      slugField: "name",
      path: "content/stores/*",
      format: { data: "yaml" },
      columns: ["name", "province"],
      schema: {
        name: fields.slug({ name: { label: "Name", validation: { length: { min: 1 } } } }),
        nameKm: khmerText("Name"),
        type: fields.select({
          label: "Type",
          options: selectOptions(storeTypes),
          defaultValue: "bookstore",
        }),
        province: fields.select({
          label: "Province",
          options: selectOptions(provinces),
          defaultValue: "phnom-penh",
        }),
        address: fields.text({ label: "Address", multiline: true }),
        addressKm: khmerText("Address", true),
        mapsUrl: fields.url({ label: "Google Maps link" }),
        ...contact,
        hours: fields.text({ label: "Opening hours", description: "e.g. Daily 8:00–20:00" }),
        photo: fields.image({ label: "Photo", directory: "public/stores", publicPath: "/stores/" }),
        notes: fields.text({ label: "Notes", multiline: true }),
        lastVerified,
        sampleData,
      },
    }),

    importServices: collection({
      label: "Import services",
      slugField: "name",
      path: "content/import-services/*",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Name", validation: { length: { min: 1 } } } }),
        nameKm: khmerText("Name"),
        logo: fields.image({
          label: "Logo",
          directory: "public/import-services",
          publicPath: "/import-services/",
        }),
        basedIn: fields.select({
          label: "Based in",
          options: selectOptions(provinces),
          defaultValue: "phnom-penh",
        }),
        deliversNationwide: fields.checkbox({ label: "Delivers nationwide", defaultValue: true }),
        description: fields.text({ label: "Description", multiline: true }),
        descriptionKm: khmerText("Description", true),
        sources: fields.array(fields.text({ label: "Source" }), {
          label: "Orders from",
          description: "Shops or countries, e.g. Amazon US, Kinokuniya Bangkok.",
          itemLabel: (props) => props.value || "Source",
        }),
        deliveryTime: fields.text({ label: "Usual delivery time", description: "e.g. 2–3 weeks" }),
        fees: fields.text({
          label: "Fees",
          description: "e.g. Quote per order, or 10% of book price",
        }),
        ...contact,
        lastVerified,
        sampleData,
      },
    }),
  },
  singletons: {
    siteSettings: singleton({
      label: "Site settings",
      path: "content/settings/site",
      format: { data: "yaml" },
      schema: {
        tagline: fields.text({ label: "Tagline" }),
        taglineKm: khmerText("Tagline"),
        telegram: fields.text({
          label: "Community Telegram username or group",
          description:
            "Shown on the Contribute page as a way to request books and report problems without a GitHub account. Without @.",
        }),
        contactFormUrl: fields.url({
          label: "Online form link",
          description:
            "Optional free form (e.g. Google Forms) for people without GitHub or Telegram.",
        }),
        facebook: fields.url({ label: "Facebook page" }),
        disclaimer: fields.text({ label: "Disclaimer", multiline: true }),
        disclaimerKm: khmerText("Disclaimer", true),
      },
    }),
    aboutPage: singleton({
      label: "About page",
      path: "content/pages/about",
      format: { data: "yaml" },
      schema: {
        intro: fields.text({ label: "Intro", multiline: true }),
        introKm: khmerText("Intro", true),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: "Heading" }),
            headingKm: khmerText("Heading"),
            body: fields.text({ label: "Body", multiline: true }),
            bodyKm: khmerText("Body", true),
          }),
          { label: "Sections", itemLabel: (props) => props.fields.heading.value || "Section" },
        ),
      },
    }),
  },
});
