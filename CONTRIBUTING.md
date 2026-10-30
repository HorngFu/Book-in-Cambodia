# Contributing to Book in Cambodia

Thank you for helping readers in Cambodia find books. Everyone is welcome: readers, booksellers, librarians, translators, designers and developers. Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and the [non-profit principles](docs/DEVELOPMENT_PHASES.md#non-profit-principles) (no ads, no paid placement, no affiliate links).

## Ways to help

| I want to… | Do this |
|---|---|
| Ask for a book | [Request a book](../../issues/new?template=request-book.yml) |
| Say where a book is sold | [Where to buy a book](../../issues/new?template=add-listing.yml) |
| Add a bookstore or library | [Add a store](../../issues/new?template=add-store.yml) |
| Add an import service | [Add an import service](../../issues/new?template=add-import-service.yml) |
| Fix wrong information | [Report wrong information](../../issues/new?template=report-problem.yml), or use "Report a problem with this page" at the bottom of any page |
| Edit content myself | Become an editor (below) |
| Translate | Pick an issue labelled **translation** |
| Improve the website | Pick an issue labelled **good first issue** (below) |

No GitHub account? Use the options on the website's **Contribute** page (`/en/contribute`): Telegram, an online form or email.

## Content rules

- **Only add what you have checked yourself** (visited, phoned, or seen on the store's official page) and set **Last verified** to that date.
- **Only public contact details.** Never post private phone numbers.
- **Every listing is free and equal.** We don't accept payment, and we don't rank stores by anything but relevance, distance or name.
- **No pirated books** or links to them. Fake or duplicate stores are removed.
- Covers: use your own photo or the publisher's official cover image.

Content is licensed **CC BY-SA 4.0**; by contributing you agree to share it under that license.

## Becoming an editor

Regular contributors can edit books, stores and services in the browser with Keystatic. Ask a maintainer for access, then follow the [Editor guide](docs/EDITOR_GUIDE.md) (English and Khmer). Every edit goes through a pull request with a preview link and is reviewed before it goes live.

## Translating

UI text lives in [`src/i18n/messages/en.json`](src/i18n/messages/en.json) and [`km.json`](src/i18n/messages/km.json). Both files must have the same keys (the type check enforces it). Keep `{placeholders}` unchanged. Content translations are the `…Km` fields in Keystatic.

## Code contributions

Requirements: Node.js 20.9+.

```bash
npm install
npm run dev          # http://localhost:3000, editor at /keystatic
```

Before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run format:check   # npm run format to fix
npm test
npm run build
```

Guidelines:

- Read [`docs/DEVELOPMENT_PHASES.md`](docs/DEVELOPMENT_PHASES.md) (roadmap) and [`docs/DESIGN.md`](docs/DESIGN.md) (colors, type, components) first.
- **Every public page is static.** Read content only through `src/lib/content.ts` at build time; Cloudflare Workers have no filesystem at runtime.
- **Bilingual by default.** Any new text goes into both `en.json` and `km.json`.
- **Mobile first and accessible:** 44 px touch targets, real buttons and links, labels on inputs, text contrast of at least 4.5:1.
- Keep the Worker under the free plan's 3 MB (`npm run cf:size`) and the search index under 500 KB gzip (printed by every build).

## Labels

| Label | Meaning |
|---|---|
| `request` | Someone is looking for a book |
| `listing` | Where a book is sold (to add) |
| `store` / `import-service` | A new place or service to add |
| `data-fix` | Wrong or outdated information |
| `needs-verification` | Someone must confirm before it goes live |
| `translation` | Khmer/English text work |
| `good first issue` | Small, well-defined task for newcomers |
| `bug` / `enhancement` / `documentation` | Website work |

## Review process

1. Content issues (`request`, `listing`, `store`, …) are checked by a maintainer or editor, who adds the content and closes the issue with a link to the page.
2. Pull requests need a passing **CI** check. Same-repository pull requests also get a **preview link** in a comment.
3. A maintainer reviews and merges. The site redeploys automatically within a few minutes.
