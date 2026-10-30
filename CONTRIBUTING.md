# Contributing to Book in Cambodia

Thank you for helping readers in Cambodia find books. There are two ways to help.

## 1. Add or fix content (no coding)

Books, stores, import services and categories live as small files in [`content/`](content/). You can:

- **Use the editor:** run the site locally (below) and open <http://localhost:3000/keystatic>. Online editing at `bookincambodia.org/keystatic` comes in Phase 5.
- **Open an issue** describing what's missing or wrong, and a maintainer will add it.

Please only add information you have checked yourself, and fill in the "last verified" date.

## 2. Improve the website (code)

1. Fork the repo and create a branch.
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
3. Before opening a pull request, run:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
4. Open a pull request describing what you changed and why.

Read [`docs/DEVELOPMENT_PHASES.md`](docs/DEVELOPMENT_PHASES.md) for the roadmap and [`docs/DESIGN.md`](docs/DESIGN.md) for the visual style.

## Ground rules

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Respect the [non-profit principles](docs/DEVELOPMENT_PHASES.md#non-profit-principles): no ads, no paid placement, no affiliate links.
- Code is MIT licensed; content is CC BY-SA 4.0. By contributing you agree to license your contribution the same way.

A fuller guide (labels, review process, translations) comes in Phase 6.
