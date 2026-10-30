# Content model

All content lives in [`content/`](../content) as YAML files, one file per entry, edited through Keystatic (`/keystatic`). The schema is defined in [`keystatic.config.ts`](../keystatic.config.ts); shared option lists (provinces, store types, languages, formats, stock states) are in [`src/data/options.ts`](../src/data/options.ts).

Pages never read files directly. They use the typed helpers in [`src/lib/content.ts`](../src/lib/content.ts) (`getAllBooks()`, `getBook()`, `getBooksAtStore()`, …), and only at build time.

Any field ending in `Km` is the optional Khmer version. Khmer pages fall back to the English value when it is empty.

## Collections

### Books — `content/books/<slug>.yaml`

| Field | Type | Notes |
|---|---|---|
| `title` | text (file name = slug) | Required. Original or romanized title. |
| `titleKm` | text | Khmer title. For Khmer books, the title in Khmer script. |
| `subtitle` | text | |
| `authors` | list of → authors | At least one. |
| `language` | `km` · `en` · `fr` · `zh` · `other` | |
| `categories` | list of → categories | |
| `isbn13`, `isbn10` | text | Validated format; hyphens allowed. |
| `publisher`, `publishedYear` | text, integer | `publishedYear` = first published. |
| `cover` | image | Stored in `public/covers/`. Run `npm run images` after uploading. |
| `description`, `descriptionKm` | text | Short summary. |
| `availability` | list of listings | Where to get it in Cambodia (below). Empty = "Not in Cambodia yet". |
| `importNotes` | text | Tip for ordering from abroad. |
| `addedOn` | date | Sorts "Recently added". |

**Listing** (one item in `availability`):

| Field | Type | Notes |
|---|---|---|
| `store` | → stores | Required. |
| `format` | `paperback` · `hardcover` · `used` · `ebook` · `library` | |
| `priceUsd` | number | Optional. `0` = free (libraries). |
| `priceRiel` | integer | Optional. |
| `stock` | `in-stock` · `ask` · `out-of-stock` | |
| `lastVerified` | date | Required. Older than ~6 months shows "may be outdated". |
| `link` | URL | Optional link to the book on the seller's site. |

### Authors — `content/authors/<slug>.yaml`

`name`, `nameKm`, `photo` (`public/authors/`), `bio`, `bioKm`, `links` (list of URLs).

### Categories — `content/categories/<slug>.yaml`

`name`, `nameKm`, `order` (lower shows first).

### Stores and libraries — `content/stores/<slug>.yaml`

| Field | Type | Notes |
|---|---|---|
| `name`, `nameKm` | text | |
| `type` | `bookstore` · `second-hand` · `library` · `online` · `publisher` | |
| `province` | one of 25 provinces, or `online` | |
| `address`, `addressKm`, `mapsUrl` | text, text, URL | |
| `telegram` | text | Username without `@`; main contact button. |
| `phone`, `facebook`, `website` | text, URL, URL | |
| `hours`, `photo`, `notes` | text, image, text | |
| `lastVerified` | date | Required. |
| `sampleData` | checkbox | Made-up example entry: shows a "Sample" label, contact buttons disabled. |

### Import services — `content/import-services/<slug>.yaml`

`name`, `nameKm`, `logo`, `basedIn` (province), `deliversNationwide`, `description`, `descriptionKm`, `sources` (list, e.g. "Amazon US"), `deliveryTime`, `fees`, contact fields (as stores), `lastVerified`, `sampleData`.

### Events — `content/events/<slug>.yaml` (Phase 7)

`title`, `titleKm`, `type` (book fair, reading club, author talk, book swap, workshop, kids, other), `startDate` (required), `startTime` / `endTime` (24-hour Cambodia time, e.g. `09:00`; no start time = all-day), `endDate` (multi-day events), `venue`, `province` (or `online`), `address`, `mapsUrl`, `onlineUrl`, `organizer`, `telegram`, `facebook`, `isFree`, `price`, `languages`, `description` (+ Khmer), `cover`, `sampleData`.

Past events leave the upcoming list automatically (daily rebuild, and in the browser as soon as they end).

### Book clubs — `content/book-clubs/<slug>.yaml`

`name`, `nameKm`, `province` (or `online`), `languages`, `meets` (+ Khmer), `where`, `reads` (+ Khmer), `joinUrl`, `telegram`, `description` (+ Khmer), `lastVerified`, `sampleData`.

### Places that accept books — `content/donation-places/<slug>.yaml`

`name`, `nameKm`, `type` (community library, school, NGO, book drive), `province`, `address`, `mapsUrl`, `needs` (Khmer children's books, Khmer books, English learning, dictionaries, textbooks, novels, any), `needsNotes`, `notAccepted`, `howToGive` (+ Khmer), `until` (book drives; hidden after this day), contact fields, `lastVerified`, `sampleData`.

Authors also have a `cambodian` checkbox for the Cambodian authors spotlight.

## Singletons

- **Site settings** — `content/settings/site.yaml`: `tagline`, `telegram` and `contactFormUrl` (non-GitHub contribution options on the Contribute page), `facebook`, `disclaimer` (+ Khmer).
- **About page** — `content/pages/about.yaml`: `intro` and a list of `sections` (`heading`, `body`, + Khmer).

## Sample data

The books, authors and categories in the seed are real. **All stores, import services, events, book clubs and donation places are made up** and marked `sampleData: true`, as are their prices and dates. Replace them with verified listings before launch (Phase 8).

## Checks

`npm test` reads every entry and fails if a book points at an author, category or store that doesn't exist.
