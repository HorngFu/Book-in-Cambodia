# Book in Cambodia — Development Phases

> Working name: **Book in Cambodia**. Rename anytime; nothing in this plan depends on it.

An open source website for book lovers in Cambodia. A visitor can:

1. **Find a book** by searching title, author, ISBN, or category (English and Khmer).
2. **See where to get it in Cambodia**: bookstores, second-hand sellers, libraries, and online sellers, with location and contact.
3. **Contact a book-buying service** that orders from abroad when nobody in Cambodia has it.

The site does **not** sell books or take payments. It is a directory that points people to the right place.

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
| 0 | Foundation and technical spike | Free | Not started |
| 1 | Project scaffold, design system, auto-deploy | Free | Not started |
| 2 | Content model in Keystatic | Free | Not started |
| 3 | Public pages | Free | Not started |
| 4 | Search and filters | Free | Not started |
| 5 | Online editing (Keystatic GitHub mode) | Free | Not started |
| 6 | Community features | Free | Not started |
| 7 | Launch polish: SEO, performance, accessibility | Free (domain optional) | Not started |
| 8 | Scale up (paid, only when needed) | ~$5+/month | Not started |
| 9 | Future ideas (backlog) | Varies | Backlog |

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
| Styling | Tailwind CSS | Fast to build, small CSS output. |
| Languages | English + Khmer (`/en`, `/km`) | Local audience. Khmer font: Noto Sans Khmer or Kantumruy Pro. |
| Search | Build-time JSON index + client-side search (MiniSearch) | Zero server cost; works for thousands of books. |
| Images | Book covers in the repo, pre-resized to WebP | Avoids paid image optimization on the free plan. |
| Analytics | Cloudflare Web Analytics | Free, no cookies, no consent banner needed. |

### The most important rule: content is read at build time

Cloudflare Workers have no filesystem at runtime, and Keystatic content lives in files. So **every public page is statically generated at build time** (`generateStaticParams` + Keystatic's reader API). When an editor saves in Keystatic, it commits to GitHub, GitHub Actions rebuilds, and the new content goes live a few minutes later. Only `/keystatic` and `/api/keystatic/*` run on the server.

This is also what keeps hosting free: pre-built pages are cheap to serve and stay far below the free plan's CPU limit.

---

## Cost plan: free first, paid later

### Free tier (Phases 0–7)

| Service | Free allowance (verify current limits before launch) | Our expected use |
|---|---|---|
| Cloudflare Workers Free | 100,000 requests/day, 10 ms CPU per request, 3 MB compressed Worker size | Static pages and assets. Plenty for launch. |
| Workers static assets | Requests for static files are free and not counted | JS, CSS, covers, search index |
| GitHub (public repo + Actions) | Free, unlimited Actions minutes for public repos | Code, content, CI |
| Keystatic (GitHub mode) | Free, open source | Editing UI |
| Cloudflare Web Analytics | Free | Traffic stats |
| Domain | `*.workers.dev` subdomain is free | Use until launch |

**Only likely cost before scaling:** a custom domain (about $10–15/year for `.org`; `.com.kh` / `.org.kh` cost more and require local registration paperwork).

### When to move to paid (Phase 8)

Upgrade only when one of these happens:

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

- [ ] Decide where the repo lives: personal account now, or create a GitHub Organization (free) and transfer the repo. *(Recommendation: create the org now so links don't change later.)*
- [ ] Add `README.md` with the project mission and how to run locally.
- [ ] Add licenses: **MIT** for code (`LICENSE`), **CC BY-SA 4.0** for content/data (`content/LICENSE`).
- [ ] Add `CODE_OF_CONDUCT.md` (Contributor Covenant) and a short `CONTRIBUTING.md` stub.
- [ ] **Spike:** create a minimal Next.js app with Keystatic (GitHub mode) and deploy it to Cloudflare Workers with OpenNext on the free plan. Confirm:
  - [ ] the public page builds statically and loads from `*.workers.dev`
  - [ ] `/keystatic` loads and GitHub login works on the deployed site
  - [ ] saving an entry in Keystatic creates a commit in the repo
  - [ ] compressed Worker size is under 3 MB (check `wrangler deploy` output)
- [ ] Record spike results in the [Decision log](#decision-log).

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

- [ ] Next.js (App Router, TypeScript strict), ESLint, Prettier.
- [ ] Tailwind CSS with design tokens (colors, spacing, typography) and dark mode.
- [ ] Fonts: a Latin font + **Noto Sans Khmer** or **Kantumruy Pro**, self-hosted via `next/font`.
- [ ] i18n routing for `/en` and `/km` (e.g. `next-intl`), with UI strings in `messages/en.json` and `messages/km.json`. Default locale: decide in this phase.
- [ ] Base layout: header (logo, search box placeholder, language switcher), footer (about, contribute, GitHub link, license).
- [ ] Reusable UI components: Button, Card, Badge, Input, Select, EmptyState.
- [ ] OpenNext + `wrangler.jsonc` config; `images.unoptimized = true` for now.
- [ ] GitHub Actions:
  - [ ] `ci.yml`: lint, type-check, build on every PR
  - [ ] `deploy.yml`: build and `wrangler deploy` on push to `main` (uses `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets)
- [ ] Placeholder home page in both languages.

### Done when

- Pushing to `main` deploys to `*.workers.dev` automatically.
- PRs show a passing CI check.
- Home page renders correctly in English and Khmer, on mobile and desktop.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 1. Reuse anything from the Phase 0 spike that is good enough; replace the rest. Tell me which GitHub secrets I need to add.
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

- [ ] `keystatic.config.ts` with the collections and singletons above, using **local mode** for now.
- [ ] Field validation (required fields, ISBN format, URL format, date for `lastVerified`).
- [ ] Typed data helpers in `src/lib/content/` wrapping Keystatic's reader (e.g. `getAllBooks()`, `getBookBySlug()`, `getStoresByProvince()`), so pages never call the reader directly.
- [ ] Seed data: ~20 books, ~8 authors, ~8 stores across at least 3 provinces, ~3 import services, ~8 categories. Mark sample data clearly so it is replaced before launch.
- [ ] A script to resize/convert cover images to WebP (e.g. `npm run images`, using `sharp`).
- [ ] Document the content model in `docs/CONTENT_MODEL.md`.

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
| `/[locale]` | Home: hero search box, featured/new books, browse by category, "Can't find it? Order from abroad" call-to-action. |
| `/[locale]/books` | All books, paginated grid. |
| `/[locale]/books/[slug]` | Book detail: cover, info, **"Where to get it in Cambodia"** list (store, province, format, price, stock, last verified, contact buttons). If no availability → **"Not available locally"** panel listing import services. |
| `/[locale]/authors/[slug]` | Author bio + their books. |
| `/[locale]/categories/[slug]` | Books in a category. |
| `/[locale]/stores` | Stores grouped/filterable by province and type. |
| `/[locale]/stores/[slug]` | Store detail: map link, contact, hours, books listed there. |
| `/[locale]/import-services` | All buying-from-abroad services with how-it-works explanation. |
| `/[locale]/import-services/[slug]` | Service detail and contact. |
| `/[locale]/about` | Mission, how it works, disclaimer, how to contribute. |
| `not-found` | Friendly 404 with search. |

### Tasks

- [ ] All routes above with `generateStaticParams` (no runtime file reads).
- [ ] Contact buttons that open Telegram (`https://t.me/...`), Facebook, phone (`tel:`), and Google Maps directly. Telegram first, since it is the most used in Cambodia.
- [ ] "Last verified" shown on every availability and store entry; older than 6 months shows a "may be outdated" hint.
- [ ] Book cards and lists reuse shared components.
- [ ] Fall back to the English field when a Khmer field is empty.
- [ ] Mobile-first layouts (most visitors will be on phones).

### Done when

- Every seed entry has a working page in `/en` and `/km`.
- A book with no local availability clearly shows import services.
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

- [ ] Build step that generates `public/search-index.json` from content (title, titleKm, authors, ISBN, categories, language, available-in-Cambodia flag, slug, cover thumbnail).
- [ ] Client-side search with **MiniSearch**: prefix and fuzzy matching, field boosting (title > author > category).
- [ ] **Khmer support:** Khmer has no spaces between words. Tokenize with `Intl.Segmenter('km', { granularity: 'word' })` at index and query time; if results are poor, fall back to character n-grams for Khmer fields. Add tests with real Khmer titles.
- [ ] Exact ISBN match (strip hyphens/spaces; accept ISBN-10 and ISBN-13).
- [ ] `/[locale]/search?q=` results page + instant results dropdown in the header.
- [ ] Filters: category, language, province, "available in Cambodia only", format.
- [ ] Search state in the URL so results can be shared.
- [ ] "No results" state with two actions: **request this book** (Phase 6) and **order from abroad** (import services).
- [ ] Load the index lazily (only when the search box is focused); keep it under ~500 KB gzipped and record its size in CI.

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

- [ ] Switch Keystatic to **GitHub mode** in production, local mode in development (via env var).
- [ ] Create the Keystatic GitHub App (Keystatic's setup screen at `/keystatic` generates it), then set `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` as Cloudflare Worker secrets and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` as a build variable.
- [ ] Editing workflow: editors work on a branch and open a PR (Keystatic supports branches), maintainers review and merge, the site redeploys. Decide whether trusted editors may commit straight to `main`.
- [ ] Protect `main` with branch protection and required CI.
- [ ] `docs/EDITOR_GUIDE.md` (English + Khmer): how to log in, add a book, add a store, update availability, what "last verified" means. Include screenshots.
- [ ] Optional: PR preview deployments (Workers versions/preview URLs) so reviewers can see changes before merge.

### Done when

- A non-technical person with GitHub access can add a book on the live site, and after review/merge it appears on the site within ~5 minutes.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 5. Walk me step by step through the GitHub App and Cloudflare secret setup that I have to do myself.
```

---

## Phase 6 — Community features

**Goal:** People who are not editors can still help: request books, report wrong info, suggest stores. Still free.

**Needs:** Phase 5.

### Tasks

- [ ] GitHub Issue Forms in `.github/ISSUE_TEMPLATE/`:
  - [ ] **Request a book** (title, author, ISBN, contact optional)
  - [ ] **Add / suggest a store or seller**
  - [ ] **Add an import service**
  - [ ] **Report outdated or wrong information** (pre-filled with the page URL)
  - [ ] Bug report and feature request
- [ ] "Request this book", "Report a problem", and "Suggest a store" buttons on the site that open the matching issue form with fields pre-filled from the page.
- [ ] Alternative for people without GitHub: a Telegram link (group or bot) and/or a free Google Form. Document who watches it.
- [ ] Full `CONTRIBUTING.md`: code contributions, content contributions, translation help, labels, review process.
- [ ] "Good first issue" labels and a few starter issues.
- [ ] Stores page: "Are you a bookstore? Get listed for free" section.

### Done when

- Every page has a way to report a problem, and every no-results search has a way to request the book.
- A new contributor can follow `CONTRIBUTING.md` to make their first PR.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 6.
```

---

## Phase 7 — Launch polish: SEO, performance, accessibility

**Goal:** Ready for the public: discoverable on Google, fast on cheap phones, accessible, and with real data.

**Needs:** Phase 6.

### Tasks

- [ ] SEO: per-page metadata, Open Graph images, `hreflang` for en/km, `sitemap.xml`, `robots.txt`, canonical URLs.
- [ ] Structured data (JSON-LD): `Book` on book pages, `BookStore`/`LocalBusiness` on store pages, `Organization` site-wide.
- [ ] Performance: Lighthouse ≥ 90 on mobile for home, book, and search pages; lazy-load covers; check JS bundle sizes.
- [ ] Accessibility: keyboard navigation, focus states, color contrast, alt text for covers, `lang` attribute per locale.
- [ ] Cloudflare Web Analytics enabled.
- [ ] Error pages and basic uptime check (free monitor, e.g. GitHub Actions cron or UptimeRobot free).
- [ ] **Replace all sample data with real, verified data** (target at launch: 100+ books, 15+ stores, 3+ import services).
- [ ] Disclaimer and privacy note (no tracking cookies, no accounts).
- [ ] Optional: buy and connect a custom domain in Cloudflare.
- [ ] Launch checklist + announcement post (Facebook groups, Telegram channels for book lovers in Cambodia).

### Done when

- Lighthouse targets met, sitemap submitted to Google Search Console, real data live.
- Tagged release `v1.0.0`.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md and implement Phase 7, except the real data entry. Give me a checklist of what I need to do myself for launch.
```

---

## Phase 8 — Scale up (paid, only when needed)

**Goal:** Handle growth without rewriting the site. Do only the items whose trigger (see [Cost plan](#cost-plan-free-first-paid-later)) actually happened.

**Needs:** Launched site + a real trigger.

### Options (pick as needed)

- [ ] **Workers Paid ($5/month):** more requests, more CPU time per request, bigger Worker.
- [ ] **Covers to R2:** move images out of Git into an R2 bucket on a custom subdomain (e.g. `img.example.org`); Keystatic image field stores the URL. Add Cloudflare Images or Next image loader if resizing is needed.
- [ ] **Server-side search with D1:** sync content into a D1 database on deploy, query with SQLite FTS5 from an API route. Keep the client-side index as fallback.
- [ ] **Book requests in D1:** form protected by Cloudflare Turnstile, stored in D1, simple admin view; notify maintainers via Telegram bot.
- [ ] **Incremental builds:** if full rebuilds get slow (thousands of pages), move high-churn data (availability) to D1 and render those parts at request time with caching.
- [ ] Error monitoring (Sentry free tier) if needed.
- [ ] Funding: GitHub Sponsors / Open Collective to cover costs transparently.

### Ask Claude

```
Read docs/DEVELOPMENT_PHASES.md. Our site hit this trigger: <describe what happened, with numbers>. Recommend which Phase 8 items to do and implement them.
```

---

## Phase 9 — Future ideas (backlog)

Not planned yet. Promote an idea into its own phase when there is demand.

- Store owner self-service accounts to update their own stock.
- Price comparison across stores for the same book.
- Map view of stores (Leaflet + OpenStreetMap, free).
- Wishlists / "notify me when available" (needs accounts and email or Telegram).
- Telegram bot: send a title, get where to buy it.
- Book clubs, reading events, and library listings.
- Open data export (CSV/JSON) of the catalog under CC BY-SA.
- Barcode scanning on mobile to look up an ISBN.
- Import book metadata automatically from Open Library by ISBN.

---

## Decision log

Record decisions that change or confirm this plan.

| Date | Phase | Decision | Reason |
|---|---|---|---|
| 2026-10-30 | — | Next.js + Keystatic + Cloudflare Workers (OpenNext), free tier first | Initial plan |
| | | | |

## Open questions

Answer these before or during the phase listed.

| Question | Needed by |
|---|---|
| Final project name and domain? | Phase 7 (name can change anytime before) |
| GitHub Organization name? | Phase 0 |
| Default language: English or Khmer? | Phase 1 |
| Show prices, or only "in stock / ask"? Prices go stale fast. | Phase 2 |
| Can trusted editors publish directly, or must every change be reviewed? | Phase 5 |
| Who moderates requests and reports (GitHub, Telegram)? | Phase 6 |
| Are import services listed free and equally, or vetted first? | Phase 2 / 6 |
