# Book in Cambodia — Development Phases

> Name: **Book in Cambodia** · Domain: **[bookincambodia.org](https://bookincambodia.org)**

A **non-profit, open source hub for book lovers in Cambodia**: one central place for readers, bookstores, libraries, writers and volunteers. A visitor can:

1. **Find a book** by searching title, author, ISBN, or category (English and Khmer).
2. **See where to get it in Cambodia**: bookstores, second-hand sellers, libraries, and online sellers, with location and contact.
3. **Request a book** nobody lists yet, so stores and volunteers know people want it.
4. **Join the reading community**: book events and fairs, book clubs, places that accept donated books, and ways to volunteer.

The site does **not** sell books or take payments. It is a directory that points people to the right place.

### Non-profit principles

These apply to every phase. If a feature would break one of them, it doesn't get built.

| Principle | What it means in practice |
|---|---|
| **Free for everyone** | No accounts needed to use the site. No paywalls. |
| **Fair listings** | Every store and library is listed free and treated equally. No paid placement, no "featured" slots for money, no commissions or affiliate links. Ordering is by relevance, distance or name only. |
| **No ads, no tracking** | No advertising and no tracking cookies. Analytics are cookie-free and aggregate only. |
| **Open** | Code is open source (MIT). Catalog data is open (CC BY-SA 4.0) and downloadable, so it outlives the project. |
| **Transparent money** | Running costs and every donation received are published. Donations only cover running costs (domain, hosting when it becomes paid) and community activities. |
| **Community-run** | Content comes from volunteers, stores and readers. Decisions are made in the open (GitHub issues and discussions). |

---

## How to use this document

Each phase is a self-contained chunk of work that ends with something working and deployed. To build a phase, start a session and paste the phase's **"Ask Claude"** prompt, for example:

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 2. Tick the checkboxes as you finish tasks and update the status table when the phase is done.
```

Rules for every phase:

- Finish phases in order. Each one lists what it needs from earlier phases.
- A phase is done only when every item under **Done when** is true.
- When a phase is done, update the status table below and tick its tasks (`- [x]`).
- If a decision changes, record it under [Decision log](#decision-log) instead of silently editing old phases.

### Status

| Phase | Name | Cost | Status |
|---|---|---|---|
| 0 | Foundation and technical spike | Free | Done locally (deploy + GitHub login waiting on owner accounts) |
| 1 | Project scaffold, design system, auto-deploy | Free | Done (auto-deploy waits on Cloudflare secrets) |
| 2 | Content model in Keystatic | Free | Done |
| 3 | Public pages | Free | Done |
| 4 | Search and filters | Free | Done |
| 5 | Online editing (Keystatic GitHub mode) | Free | Built (switched on once the owner creates the GitHub App) |
| 6 | Contribution features: requests and reports | Free | Done (Telegram/form links waiting on owner) |
| 7 | Community hub: events, book clubs, donations, volunteers | Free | Done (sample data to replace) |
| 8 | Launch polish: SEO, performance, accessibility, transparency, domain | Domain ~$10–15/year | Not started |
| 9 | Scale and sustain (paid only when needed, donation-funded) | ~$5+/month | Not started |
| 10 | Future ideas (backlog) | Varies | Backlog |

---

## Architecture at a glance

```
 Editors / contributors                       Visitors
        |                                         |
        v                                         v
 /keystatic admin  ──commit──>  GitHub repo   Cloudflare Workers (free plan)
 (GitHub mode)                  (content as       serves pre-built pages
                                 YAML/Markdown)   + static assets + search index
                                     |                    ^
                                     └── GitHub Actions ──┘
                                         build & deploy on every push to main
```

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Requested; good static generation and SEO. |
| CMS | Keystatic, content stored in the Git repo | Requested; no database, edits are Git commits, fits open source. |
| Hosting | Cloudflare Workers via the OpenNext adapter (`@opennextjs/cloudflare`) | Cloudflare's supported path for Next.js. `next-on-pages` is deprecated. |
| CI/CD | GitHub Actions → `wrangler deploy` | Unlimited free minutes for public repos. |
| Styling | Tailwind CSS, tokens in [docs/DESIGN.md](DESIGN.md) | Fast to build, small CSS output. |
| Languages | English + Khmer (`/en`, `/km`) | Local audience. Fonts: Epilogue + Kantumruy Pro for Khmer. |
| Search | Build-time JSON index + client-side search (MiniSearch) | Zero server cost; works for thousands of books. |
| Images | Book covers in the repo, pre-resized to WebP | Avoids paid image optimization on the free plan. |
| Analytics | Cloudflare Web Analytics | Free, no cookies, no consent banner needed. |

### The most important rule: content is read at build time

Cloudflare Workers have no filesystem at runtime, and Keystatic content lives in files. So **every public page is statically generated at build time** (`generateStaticParams` + Keystatic's reader API). When an editor saves in Keystatic, it commits to GitHub, GitHub Actions rebuilds, and the new content goes live a few minutes later. Only `/keystatic` and `/api/keystatic/*` run on the server.

This is also what keeps hosting free: pre-built pages are cheap to serve and stay far below the free plan's CPU limit.

Time-based content (events) is handled the same way: a scheduled GitHub Actions job rebuilds the site once a day so past events drop off, and the page also hides past events in the browser in case a build is late.

---

## Cost plan: free first, paid later

### Free tier (Phases 0–8)

| Service | Free allowance (verify current limits before launch) | Our expected use |
|---|---|---|
| Cloudflare Workers Free | 100,000 requests/day, 10 ms CPU per request, 3 MB compressed Worker size | Static pages and assets. Plenty for launch. |
| Workers static assets | Requests for static files are free and not counted | JS, CSS, covers, search index |
| GitHub (public repo + Actions) | Free, unlimited Actions minutes for public repos | Code, content, CI |
| Keystatic (GitHub mode) | Free, open source | Editing UI |
| Cloudflare Web Analytics | Free | Traffic stats |
| Domain | `*.workers.dev` subdomain is free | Use for development and previews; production moves to `bookincambodia.org` in Phase 8 |
| Email | Cloudflare Email Routing is free | Forward `hello@bookincambodia.org` to a maintainer's inbox |

**Only cost before scaling:** the domain **bookincambodia.org**, about $10–15/year. Register it through Cloudflare Registrar (sells at cost, no markup, and DNS is already in Cloudflare). Buy it early so nobody else takes it, even though the site only moves there at launch. Turn on auto-renew so it never lapses.

### When to move to paid (Phase 9)

Upgrade only when one of these happens, and pay for it from donations (see [Non-profit principles](#non-profit-principles)):

| Trigger | Upgrade | Rough cost |
|---|---|---|
| Traffic approaches 100k requests/day | Workers Paid | $5/month, includes 10M requests |
| Worker bundle exceeds 3 MB compressed | Workers Paid (10 MB limit) | same $5/month |
| Requests hit the 10 ms CPU limit | Workers Paid | same $5/month |
| Repo grows large from cover images (> ~1 GB) | Move covers to Cloudflare R2 | 10 GB free, then cheap per GB |
| Catalog > ~5,000 books, search index too heavy | Server-side search with Cloudflare D1 (SQLite FTS) | D1 has a free tier |
| Book requests need a real inbox | D1 table + Turnstile-protected form | Free tier covers it |

---

## Phase 0 — Foundation and technical spike

**Goal:** Prove the risky part of the stack works on the free plan before building anything real, and set up the open source project basics.

**Needs:** A GitHub account and a Cloudflare account (free).

### Tasks

- [ ] Decide where the repo lives: personal account now, or create a GitHub Organization (free) and transfer the repo. *(Recommendation: create the org now so links don't change later.)* **Owner to do.**
- [x] Add `README.md` with the project mission, the site URL (bookincambodia.org) and how to run locally.
- [ ] Register **bookincambodia.org** in Cloudflare Registrar with auto-renew (owner does this; the site only moves there in Phase 8). **Owner to do.**
- [x] Add licenses: **MIT** for code (`LICENSE`), **CC BY-SA 4.0** for content/data (`content/LICENSE.md`).
- [x] Add `CODE_OF_CONDUCT.md` (Contributor Covenant) and a short `CONTRIBUTING.md` stub.
- [x] **Spike:** create a minimal Next.js app with Keystatic and build it for Cloudflare Workers with OpenNext on the free plan. Confirm:
  - [x] the public page builds statically and is served by the Worker (verified locally with `npm run cf:preview`; deploying to `*.workers.dev` needs the owner's Cloudflare login)
  - [ ] `/keystatic` loads and GitHub login works on the deployed site. *`/keystatic` loads in the local Worker; GitHub login needs a deploy and the Keystatic GitHub App (owner, Phase 5).*
  - [ ] saving an entry in Keystatic creates a commit in the repo. *Same: verified in Phase 5.*
  - [x] compressed Worker size is under 3 MB: **1.18 MB gzip** (`npm run cf:size`)
- [x] Record spike results in the [Decision log](#decision-log).

**If the spike fails** (Worker too big, or Keystatic's API route doesn't run on Workers), pick a fallback and log it:
- A. Keystatic in **local mode** only: contributors edit on their own machine and open PRs. Public site can then be a pure static export (fully free, no Worker limits).
- B. Pay $5/month for Workers Paid earlier than planned.

### Done when

- Spike app is reachable on `*.workers.dev` and Keystatic can commit to the repo, **or** a fallback is chosen and logged.
- License, README, and Code of Conduct are in the repo.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and do Phase 0. Start with the repo basics (README, licenses, code of conduct), then build the spike. Stop and tell me when you need me to do something in GitHub or Cloudflare (creating the Keystatic GitHub App, logging in to wrangler, etc.).
```

---

## Phase 1 — Project scaffold, design system, auto-deploy

**Goal:** A clean production-ready project skeleton that deploys automatically on every push to `main`.

**Needs:** Phase 0.

### Tasks

- [x] Next.js (App Router, TypeScript strict), ESLint, Prettier.
- [x] Tailwind CSS with the design tokens from [docs/DESIGN.md](DESIGN.md) (colors, radii, shadows, type scale). Tailwind v4: tokens live in `@theme` in `src/app/globals.css`.
- [x] Fonts: **Epilogue** (Latin) + **Kantumruy Pro** (Khmer), self-hosted via `next/font`.
- [x] i18n routing for `/en` and `/km` with UI strings in `src/i18n/messages/en.json` and `km.json`. No middleware and no i18n library: `[locale]` is a static route segment, `/` redirects to `/en`. Default locale: **English** (see Decision log). Khmer strings need review by a native speaker.
- [x] Base layout following DESIGN.md: header (logo, nav, language switch, Contribute button), footer (explore, contribute, non-profit links, license), mobile bottom tab bar.
- [x] Reusable UI components from DESIGN.md: Button (primary, dark, outline, soft, white), SearchBar, Chip, Badge, Card, SectionHeader/TwoTone, CtaBand, Input, Select, EmptyState, BookShelf. *BookCard is built in Phase 3 with the real book data.*
- [x] OpenNext + `wrangler.jsonc` config; `images.unoptimized = true` for now.
- [x] GitHub Actions:
  - [x] `ci.yml`: lint, type-check, format check, build on every PR and push to `main`
  - [x] `deploy.yml`: build and deploy on push to `main` (uses `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets; skips with a warning until they exist)
- [x] Placeholder home page in both languages.

**Owner to do:** push the repo, then add the `CLOUDFLARE_API_TOKEN` (template "Edit Cloudflare Workers") and `CLOUDFLARE_ACCOUNT_ID` repository secrets so `deploy.yml` can publish to `book-in-cambodia.<account>.workers.dev`.

### Done when

- Pushing to `main` deploys to `*.workers.dev` automatically.
- PRs show a passing CI check.
- Home page renders correctly in English and Khmer, on mobile and desktop.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and docs/DESIGN.md, then implement Phase 1. Reuse anything from the Phase 0 spike that is good enough; replace the rest. Tell me which GitHub secrets I need to add.
```

---

## Phase 2 — Content model in Keystatic

**Goal:** Define all content types in Keystatic and fill them with realistic sample data.

**Needs:** Phase 1.

### Content types

All content lives under `content/` as YAML/Markdoc files, one file per entry.

**`books`**
| Field | Type | Notes |
|---|---|---|
| title | text | Required. Original title. |
| titleKm | text | Optional Khmer title. |
| slug | slug | From title. |
| authors | relationship[] → authors | |
| isbn13 / isbn10 | text | Optional, validated format. |
| language | select | Khmer, English, French, Chinese, Other |
| categories | relationship[] → categories | |
| publisher, publishedYear, pages | text / integer | Optional. |
| cover | image | Stored in `public/covers/`. Max ~600 px wide, WebP. |
| description | Markdoc | Short summary. |
| availability | array of objects | See below. |
| importNotes | text | Optional tip for buying from abroad. |

`availability[]` item: `store` (relationship → stores), `format` (paperback, hardcover, ebook, used), `priceRiel` / `priceUsd` (optional), `inStock` (yes / no / ask), `lastVerified` (date, required), `link` (optional URL).

**`authors`**: name, nameKm, slug, photo (optional), bio, links.

**`stores`**: name, nameKm, slug, type (bookstore, second-hand, library, online seller, publisher), province (select: Phnom Penh + Cambodia's 24 provinces), address, Google Maps link, latitude/longitude (optional), phone, Telegram, Facebook, website, opening hours, photo, notes, `lastVerified`.

**`importServices`**: name, slug, logo, description, sources (e.g. Amazon, eBay, Kinokuniya), countries shipped from, Telegram, Facebook, phone, website, typical delivery time, fee notes, `lastVerified`.

**`categories`**: name, nameKm, slug, icon (optional).

**Singletons**: `siteSettings` (site name, tagline, social links, contact Telegram), `aboutPage` (Markdoc, both languages), `disclaimer`.

### Tasks

- [x] `keystatic.config.ts` with the collections and singletons above, using **local mode** for now. *Final field list: [docs/CONTENT_MODEL.md](CONTENT_MODEL.md). Changes from the draft above: descriptions are plain text (not Markdoc); `inStock` became `stock` (in stock / ask / out of stock); a `library` format and `addedOn` date were added; stores and import services got a `sampleData` flag; the disclaimer lives in site settings; lat/long left out until the map (Phase 10).*
- [x] Field validation (required fields, ISBN format, URL format, date for `lastVerified`).
- [x] Typed data helpers in `src/lib/content.ts` wrapping Keystatic's reader (`getAllBooks()`, `getBook()`, `getStoresByProvince()`, `getBooksAtStore()`, …), so pages never call the reader directly.
- [x] Seed data: 20 real books (incl. 4 Khmer classics), 19 authors, 9 categories, 9 stores in 4 provinces + online, 3 import services. **Stores and import services are made up** and flagged `sampleData: true`.
- [x] A script to resize/convert images to 600 px WebP and update content references (`npm run images`, using `sharp`).
- [x] Document the content model in `docs/CONTENT_MODEL.md`.
- [x] `npm test` (Vitest) checks every reference between books, authors, categories and stores; runs in CI.

### Done when

- `npm run dev` → `/keystatic` lets you create/edit every content type locally.
- The data helpers return typed seed data and `npm run build` passes.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 2. Before writing the Keystatic config, show me the final field list for each collection so I can adjust it.
```

---

## Phase 3 — Public pages

**Goal:** Everything a visitor needs to browse, all statically generated, in both languages.

**Needs:** Phase 2.

### Pages

| Route | Content |
|---|---|
| `/[locale]` | Home: hero search box, featured/new books, browse by category, "Can't find it? Request it" call-to-action. |
| `/[locale]/books` | All books, paginated grid. |
| `/[locale]/books/[slug]` | Book detail: cover, info, **"Where to get it in Cambodia"** list (store, province, format, price, stock, last verified, contact buttons). If no availability → **"Not in Cambodia yet"** with "Request this book" and "Add where to buy it". |
| `/[locale]/authors/[slug]` | Author bio + their books. |
| `/[locale]/categories/[slug]` | Books in a category. |
| `/[locale]/stores` | Stores grouped/filterable by province and type. |
| `/[locale]/stores/[slug]` | Store detail: map link, contact, hours, books listed there. |
| `/[locale]/about` | Mission, the non-profit principles, how it works, disclaimer, how to contribute. |
| `not-found` | Friendly 404 with search. |

### Tasks

- [x] All routes above with `generateStaticParams` (no runtime file reads): 134 static pages for the seed data. Book pagination is `/books/page/N` (24 per page). The 404 is a bilingual `app/global-not-found.tsx` (links home in both languages; search arrives in Phase 4).
- [x] Contact buttons that open Telegram (`https://t.me/...`), Facebook, phone (`tel:`), and Google Maps directly. Telegram first, since it is the most used in Cambodia. *Sample (made-up) entries show the same buttons disabled with a "Sample" label.*
- [x] "Last verified" shown on every availability and store entry; older than 6 months shows a "may be outdated" hint (computed at build time; Phase 7's daily rebuild keeps it current).
- [x] Book cards and lists reuse shared components (`BookCard`, `BookCover`, `ListingCard`, `StoreCard`, `ImportServiceCard`, `FilterableList`).
- [x] Fall back to the English field when a Khmer field is empty.
- [x] Mobile-first layouts (most visitors will be on phones).
- [x] Store directory and book-page listings filter by province/type in the browser; without JavaScript everything is shown.
- [x] "Request a book", "Report wrong info" and "Add my store" open a pre-filled GitHub issue for now (Phase 6 replaces them with issue forms and a non-GitHub option).

Worker size after Phase 3: **1.69 MB gzip** (limit 3 MB).

### Done when

- Every seed entry has a working page in `/en` and `/km`.
- A book with no local availability clearly says so and offers to request it.
- `npm run build` produces static pages for all routes and the deployed site works.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 3. Do the book detail page first and show it to me before building the rest.
```

---

## Phase 4 — Search and filters

**Goal:** A visitor can type a title, author, or ISBN in English or Khmer and find the book fast, at zero server cost.

**Needs:** Phase 3.

### Tasks

- [x] Build step that generates `public/search-index.json` from content (`npm run search-index`, runs automatically before `dev` and `build`). It is a static asset, so searching costs no Worker requests.
- [x] Client-side search with **MiniSearch**: prefix and fuzzy matching, field boosting (title > author > subtitle/category). Code in `src/lib/search/`.
- [x] **Khmer support:** Khmer runs are kept whole and also split with `Intl.Segmenter('km', { granularity: 'word' })` at index and query time. Because the segmenter splits some names oddly (e.g. សូផាត → សូ·ផា·ត), Khmer queries also fall back to a plain substring match on Khmer titles/authors. Tests use real Khmer titles and names (`test/search.test.ts`); 2 more Khmer books were added to the seed.
- [x] Exact ISBN match (strip hyphens/spaces; ISBN-10 is also matched against ISBN-13).
- [x] `/[locale]/search?q=` results page + instant results dropdown in the **home page search box** (combobox with keyboard support). The header has a search button (desktop) and the mobile tab bar a Search tab, both leading to the search page, instead of a second search box in the header.
- [x] Filters: category, language, province, "available in Cambodia only", format. Only values that match at least one book are offered.
- [x] Search state in the URL (`q`, `cat`, `lang`, `prov`, `fmt`, `avail`) so results can be shared and survive a reload.
- [x] "No results" state with two actions: **request this book** (pre-filled GitHub issue until Phase 6) and **order from abroad** (import services).
- [x] Load the index lazily (on first focus of the search box, or when the search page opens). Budget: build fails above 500 KB gzip; the size is printed in every build log (now 2.2 KB for 22 books, so roughly 5,000 books fit).

### Done when

- Searching by English title, Khmer title, author, and ISBN all return the right seed books.
- Filters combine correctly and survive a page reload.
- Search works with JavaScript loaded on a slow 3G profile in under ~2 seconds after focus.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 4. Add a few extra seed books with Khmer titles so we can test Khmer search properly.
```

---

## Phase 5 — Online editing (Keystatic GitHub mode)

**Goal:** Trusted volunteers and store owners can add and update content from the browser, without installing anything.

**Needs:** Phase 4 and a successful Phase 0 spike (or the logged fallback).

### Tasks

- [x] Switch Keystatic to **GitHub mode** in production, local mode in development. Production builds use GitHub mode when the repo variable `KEYSTATIC_STORAGE=github` is set; until then the live `/keystatic` shows "Online editing isn't switched on yet" and the API returns 404 (a local-mode editor can't save on Workers). The API handler is created on the first request, so the GitHub App secrets are only needed at runtime (verified: login redirects to GitHub with runtime credentials).
- [ ] Create the Keystatic GitHub App, then set `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` as Worker secrets and the repo variables `KEYSTATIC_STORAGE` / `KEYSTATIC_GITHUB_APP_SLUG`. **Owner to do** — step by step in [docs/EDITOR_GUIDE.md](EDITOR_GUIDE.md#for-maintainers-switching-on-online-editing).
- [x] Editing workflow: editors work on `content/…` branches (Keystatic `branchPrefix`) and open a PR; maintainers review and merge; the site redeploys. Decision: **no direct commits to `main` by editors** (see Decision log).
- [ ] Protect `main` with branch protection and required CI. *Not available for private repositories on the free GitHub plan; do it when the repo goes public.*
- [x] `docs/EDITOR_GUIDE.md` (English + Khmer): how to log in, branch, add a book, add a store, update availability, what "last verified" means, plus the maintainer setup. *Screenshots to add once the live editor is switched on.*
- [x] PR preview deployments: `.github/workflows/preview.yml` uploads each same-repo PR as a Worker preview version (`pr-N-book-in-cambodia.<subdomain>.workers.dev`) and comments the link.

### Done when

- A non-technical person with GitHub access can add a book on the live site, and after review/merge it appears on the site within ~5 minutes.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 5. Walk me step by step through the GitHub App and Cloudflare secret setup that I have to do myself.
```

---

## Phase 6 — Contribution features: requests and reports

**Goal:** People who are not editors can still help: request books, report wrong info, suggest stores. Still free.

**Needs:** Phase 5.

### Tasks

- [x] GitHub Issue Forms in `.github/ISSUE_TEMPLATE/`:
  - [x] **Request a book** (title, author, ISBN, language, province; no phone numbers on public issues)
  - [x] **Add / suggest a store or seller**
  - [x] **Say where to buy a book** (new: store, format, price, date seen)
  - [x] **Add an import service**
  - [x] **Report outdated or wrong information** (pre-filled with the page URL)
  - [x] Bug report and feature request; blank issues off, with a link to the Contribute page
- [x] "Request this book", "Report a problem", "Add a listing", "Add my store" and "Add an import service" buttons open the matching issue form with fields pre-filled from the page (`src/lib/contribute.ts`). Every page's footer has "Report a problem with this page".
- [x] Alternative for people without GitHub: `/[locale]/contribute` lists every action with GitHub, Telegram, online form and email options. Telegram and the form appear once their links are set in **Site settings** (Keystatic). **Owner to do:** create the Telegram group and/or form, set the links, and decide who watches them and `hello@bookincambodia.org`.
- [x] Full `CONTRIBUTING.md`: content rules, code contributions, translation help, labels, review process.
- [x] Labels (`request`, `listing`, `store`, `import-service`, `data-fix`, `needs-verification`, `translation`, `good first issue`) and starter issues #1–#4.
- [x] Stores page: "Own a bookstore? Get listed for free" section (since Phase 3).

**Note:** while the repository is **private**, only collaborators can open GitHub issues, so visitors must use Telegram, the form or email. Make the repo public before launch (Phase 8) so the GitHub options work for everyone.

### Done when

- Every page has a way to report a problem, and every no-results search has a way to request the book.
- A new contributor can follow `CONTRIBUTING.md` to make their first PR.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 6.
```

---

## Phase 7 — Community hub: events, book clubs, donations, volunteers

**Goal:** Make the site the central place for Cambodia's book lovers, not just a book finder: what's happening, who reads together, where books are needed, and how to help.

**Needs:** Phase 6.

### New content types (Keystatic)

**`events`**: title, titleKm, slug, type (book fair, reading club meetup, author talk, book swap, workshop, other), start/end date and time, venue name, province, address, Google Maps link, online link (optional), organizer, contact (Telegram/Facebook), free or price note, cover image, description, language(s).

**`bookClubs`**: name, nameKm, slug, province (or "online"), language(s), how often they meet, where, what they read (genres), how to join (Telegram/Facebook link), contact, `lastVerified`.

**`donationPlaces`**: name, slug, type (community library, school, NGO, book drive), province, address, what they accept (children's books, Khmer books, English learning, textbooks, any), what they don't accept, how to drop off or send, contact, `lastVerified`.

**`authors`** (extend): add a "Cambodian author" flag and a short Khmer bio, so Khmer writers can be featured.

### Pages

| Route | Content |
|---|---|
| `/[locale]/community` | Hub page: upcoming events, book clubs, donate books, get involved, the non-profit principles. |
| `/[locale]/events` and `/[locale]/events/[slug]` | Upcoming events by date, filter by province and type; event detail with map, contact and "Add to calendar" (`.ics` file generated at build). Past events in a collapsed archive. |
| `/[locale]/book-clubs` and `/[locale]/book-clubs/[slug]` | Clubs by province and language, with join links. |
| `/[locale]/donate-books` | Places that accept donated books, what each one needs, how to give. |
| `/[locale]/get-involved` | Volunteer roles: add books, verify store info, translate to Khmer, organize events, code on GitHub. |
| `/[locale]/authors?origin=cambodia` | Cambodian authors spotlight (static filter page). |

### Tasks

- [x] Add the new collections (`events`, `bookClubs`, `donationPlaces`, author `cambodian` flag) to `keystatic.config.ts` and data helpers in `src/lib/content.ts`. Event times are Cambodia time (UTC+7) in `src/lib/events.ts`.
- [x] Build the pages above (`/community`, `/events`, `/events/[slug]`, `/book-clubs`, `/book-clubs/[slug]`, `/donate-books`, `/get-involved`, `/authors` with the Cambodian authors spotlight at the top instead of a `?origin=` filter); add "Community" to the main navigation (also highlighted on its sub-pages) and a community section on the home page.
- [x] Daily scheduled rebuild at 05:00 Cambodia time (`deploy.yml` cron) so past events move to the archive and expired book drives disappear; past events are also hidden in the browser as soon as they end.
- [x] "Add to calendar" `.ics` download per event and language (`/[locale]/events/[slug]/event.ics`), generated at build time, RFC 5545 escaping and line folding (tested).
- [x] Issue Forms: **Submit an event**, **Add a book club**, **Add a place that accepts donated books**; also offered on the Contribute page with Telegram/form/email alternatives.
- [x] Mobile bottom tab bar gains a **Community** tab (5 tabs).
- [x] Seed data: 5 events, 3 book clubs, 3 donation places, all made up and flagged `sampleData`; 9 Cambodian authors marked.

### Done when

- An organizer can submit an event without a GitHub account (Telegram or form) and it appears on the site after review.
- The home page shows upcoming events and links to book clubs, donating books and volunteering.
- Past events disappear within a day without anyone editing the site.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 7. Use the Community page in the UI design as the reference for layout.
```

---

## Phase 8 — Launch polish: SEO, performance, accessibility, transparency

**Goal:** Ready for the public: discoverable on Google, fast on cheap phones, accessible, open about money, and with real data.

**Needs:** Phase 7.

### Tasks

- [ ] SEO: per-page metadata, Open Graph images, `hreflang` for en/km, `sitemap.xml`, `robots.txt`, canonical URLs.
- [ ] Structured data (JSON-LD): `Book` on book pages, `BookStore`/`LocalBusiness` on store pages, `Organization` site-wide.
- [ ] Performance: Lighthouse ≥ 90 on mobile for home, book, and search pages; lazy-load covers; check JS bundle sizes.
- [ ] Accessibility: keyboard navigation, focus states, color contrast, alt text for covers, `lang` attribute per locale.
- [ ] Cloudflare Web Analytics enabled.
- [ ] Error pages and basic uptime check (free monitor, e.g. GitHub Actions cron or UptimeRobot free).
- [ ] **Replace all sample data with real, verified data** (target at launch: 100+ books, 15+ stores).
- [ ] Disclaimer and privacy note (no tracking cookies, no accounts).
- [ ] `/[locale]/transparency` page: monthly running costs, donations received, and what they paid for (a simple Markdown table in Keystatic is enough).
- [ ] "Support us" link in the footer (GitHub Sponsors or Open Collective) that explains donations only cover running costs and community activities.
- [ ] Open data download: `/data/books.json` and `/data/stores.json` generated at build, with the CC BY-SA notice.
- [ ] Structured data: `Event` on event pages.
- [ ] Connect **bookincambodia.org** to the Worker as a custom domain; redirect `www.bookincambodia.org` and the `*.workers.dev` URL to it.
- [ ] Use `https://bookincambodia.org` as the canonical URL in metadata, sitemap, Open Graph and JSON-LD (one `SITE_URL` setting).
- [ ] Email Routing: `hello@bookincambodia.org` forwards to the maintainers; use it as the public contact address.
- [ ] Launch checklist + announcement post (Facebook groups, Telegram channels for book lovers in Cambodia).

### Done when

- Lighthouse targets met, sitemap submitted to Google Search Console, real data live.
- Tagged release `v1.0.0`.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 8, except the real data entry. Give me a checklist of what I need to do myself for launch.
```

---

## Phase 9 — Scale and sustain (paid only when needed, donation-funded)

**Goal:** Handle growth without rewriting the site, and keep the project funded and run fairly as a non-profit. Do only the scaling items whose trigger (see [Cost plan](#cost-plan-free-first-paid-later)) actually happened.

**Needs:** Launched site + a real trigger.

### Options (pick as needed)

- [ ] **Workers Paid ($5/month):** more requests, more CPU time per request, bigger Worker.
- [ ] **Covers to R2:** move images out of Git into an R2 bucket on a custom subdomain (e.g. `img.bookincambodia.org`); Keystatic image field stores the URL. Add Cloudflare Images or Next image loader if resizing is needed.
- [ ] **Server-side search with D1:** sync content into a D1 database on deploy, query with SQLite FTS5 from an API route. Keep the client-side index as fallback.
- [ ] **Book requests in D1:** form protected by Cloudflare Turnstile, stored in D1, simple admin view; notify maintainers via Telegram bot.
- [ ] **Incremental builds:** if full rebuilds get slow (thousands of pages), move high-churn data (availability) to D1 and render those parts at request time with caching.
- [ ] Error monitoring (Sentry free tier) if needed.

### Sustaining the non-profit

- [ ] Funding: GitHub Sponsors or Open Collective (a fiscal host can hold funds for projects that aren't a registered organization). Publish every income and expense on the transparency page.
- [ ] Governance: `GOVERNANCE.md` describing maintainers, how decisions are made, and how new maintainers join.
- [ ] Listing policy: `LISTING_POLICY.md` stating that listings are free and equal, what gets removed (fake stores, pirated books), and how disputes are handled.
- [ ] Legal form (when there is money or partners): decide whether to stay an informal open source project or register a non-profit association in Cambodia. Get local advice before registering; this plan does not cover the legal process.
- [ ] Partnerships: invite public and community libraries, schools, publishers and Khmer writers' groups to keep their own listings up to date.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md. Our site hit this trigger: <describe what happened, with numbers>. Recommend which Phase 9 items to do and implement them.
```

---

## Phase 10 — Future ideas (backlog)

Not planned yet. Promote an idea into its own phase when there is demand.

- Store owner self-service accounts to update their own stock.
- Price comparison across stores for the same book.
- Map view of stores (Leaflet + OpenStreetMap, free).
- Wishlists / "notify me when available" (needs accounts and email or Telegram).
- Telegram bot: send a title, get where to buy it.
- Book swap board: readers list books they want to give away or exchange (needs moderation).
- Reading challenges and recommended reading lists by volunteers.
- Barcode scanning on mobile to look up an ISBN.
- Import book metadata automatically from Open Library by ISBN.

---

## Decision log

Record decisions that change or confirm this plan.

| Date | Phase | Decision | Reason |
|---|---|---|---|
| 2026-10-30 | — | Next.js + Keystatic + Cloudflare Workers (OpenNext), free tier first | Initial plan |
| 2026-10-30 | All | The site is a non-profit, central hub for Cambodia's book lovers (added Phase 7 community hub and non-profit principles) | Owner's direction |
| 2026-10-30 | 1+ | Visual style recorded in docs/DESIGN.md: Homix-inspired, Epilogue + Kantumruy Pro, purple `#6357E8` accent | Owner chose the Homix look; accent darkened for contrast |
| 2026-10-30 | 0 | Spike passed locally: Next.js 16.4 + Keystatic 0.6 + OpenNext Cloudflare 1.20 builds; Worker is 1.18 MB gzip (limit 3 MB); prerendered pages served from static assets via `staticAssetsIncrementalCache` (no KV/R2). No middleware: `/` → `/en` is a `next.config` redirect. | Keeps everything on the free plan. Remote deploy and GitHub-mode login still to verify once accounts exist. |
| 2026-10-30 | 1 | Default language **English** (`/` → `/en`); Khmer at `/km`. Custom JSON dictionaries instead of `next-intl`. | Most catalog data starts in English; one constant (`defaultLocale`) to change later. No middleware keeps OpenNext simple and every page static. |
| 2026-10-30 | 4 | Search ships the book data (not a prebuilt index) as a static JSON file; the browser builds the MiniSearch index on first use. Khmer = segmenter words + substring fallback. | Smaller download, free to serve, and robust to imperfect Khmer word splitting. Revisit at ~5,000 books (Phase 9: D1 full-text search). |
| 2026-10-30 | 5 | Editors never commit to `main`: Keystatic saves to `content/…` branches and every change goes through a reviewed PR with a preview link. | Keeps listings trustworthy; a typo in a store's phone number reaches readers only after review. |
| 2026-11-01 | 3–7 | **Removed "order from abroad"**: the import-services pages, collection, sample data, issue form and all links. Books not in Cambodia now offer "Request this book" and "Add where to buy it". Earlier phase notes that mention import services are history. | Owner's decision; the site focuses on books available in Cambodia and on the reading community. |
| 2026-10-30 | 8 | Domain: **bookincambodia.org** (Cloudflare Registrar, Email Routing for `hello@`) | Owner's choice; `.org` fits a non-profit and is cheap to keep |

## Open questions

Answer these before or during the phase listed.

| Question | Needed by |
|---|---|
| Donations: GitHub Sponsors, Open Collective, or none until costs exist? | Phase 8 |
| Stay an informal open source project, or register a non-profit in Cambodia? | Phase 9 (only when there is money or partners) |
| GitHub Organization name? | Phase 0 |
| Default language: English or Khmer? | Phase 1 |
| Show prices, or only "in stock / ask"? Prices go stale fast. | Phase 2 |
| Can trusted editors publish directly, or must every change be reviewed? | Phase 5 |
| Who moderates requests and reports (GitHub, Telegram)? | Phase 6 |
| Who reviews submitted events and book clubs? | Phase 7 |
