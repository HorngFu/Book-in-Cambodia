# Book in Cambodia

**[bookincambodia.org](https://bookincambodia.org)** · សៀវភៅនៅកម្ពុជា

A non-profit, open source hub for book lovers in Cambodia:

- **Find a book** by title, author or ISBN, in English or Khmer.
- **See where to get it in Cambodia**: bookstores, second-hand sellers, libraries and online sellers.
- **Request it** when no one in Cambodia lists it yet, so stores and volunteers know people want it.
- **Join the reading community**: events, book clubs, and places that welcome donated books.

We don't sell books, show ads or take commissions. Every store is listed free and equally.

## Tech

- [Next.js](https://nextjs.org) (App Router, TypeScript), every public page prerendered at build time
- [Keystatic](https://keystatic.com) CMS, with content stored as files in [`content/`](content/)
- [Cloudflare Workers](https://workers.cloudflare.com) via [OpenNext](https://opennext.js.org/cloudflare), on the free plan

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

- Website: <http://localhost:3000>
- Content editor: <http://localhost:3000/keystatic>

Test the Cloudflare Worker build locally:

```bash
npm run cf:preview
```

## Docs

- [Development phases](docs/DEVELOPMENT_PHASES.md): roadmap, phase by phase
- [Design guide](docs/DESIGN.md): colors, type and components
- [Contributing](CONTRIBUTING.md) · [Code of Conduct](CODE_OF_CONDUCT.md)

## License

Code: [MIT](LICENSE). Content in `content/`: [CC BY-SA 4.0](content/LICENSE.md).
