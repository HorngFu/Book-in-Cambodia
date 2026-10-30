# Book in Cambodia — Design Guide

The visual style for the website. Phase 1 turns this into Tailwind tokens and base components; every later phase builds pages from them.

- **Mockups:** [Book in Cambodia UI canvas](https://claude.ai/artifact/SQdJm9yci7hRWTV8MQwd2F) (private to the owner; share it from its Share menu). Screens: Home, Search results, Book (available in Cambodia), Book (not available locally), Stores, Community, Mobile home, Mobile book.
- **Inspiration:** the look of the Homix Webflow template (clean, rounded, purple accent). We recreate the style in our own code; we don't copy its markup, images or text.
- **Sample data:** stores, prices, phone numbers, services, events and clubs in the mockups are made up.

---

## Principles

1. **Search first.** The search box is the biggest thing on the home page and is one tap away everywhere.
2. **Mobile first.** Most visitors are on phones. Every layout must work at 360 px wide with no sideways scrolling.
3. **One meaning per color.** Purple is "action / our brand". Green, amber and lavender are only used for availability status (see [Status colors](#status-colors)).
4. **Contact in one tap.** Telegram is the primary contact button, then call and map.
5. **Show freshness.** Every listing shows when it was last checked.
6. **Bilingual.** Every page works in English and Khmer; Khmer text must never look like an afterthought.

---

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1B1B1B` | Headings, dark buttons, primary text on light backgrounds |
| `body` | `#6B6B6B` | Body text (5.3:1 on white) |
| `body-strong` | `#4D4D4D` | Lead paragraphs, secondary text that needs more weight |
| `primary` | `#6357E8` | Brand, primary buttons, links, highlighted heading words |
| `primary-hover` | `#4B3FD6` | Hover/pressed for primary; text on `primary-tint` |
| `primary-tint` | `#F1F0FE` | Hero panels, cover panels, secondary buttons, chips |
| `primary-soft` | `#C6C1F9` | Decorative only (logo, illustrations) |
| `surface` | `#F7F7F7` | Neutral cards (FAQ items, province tiles, donation cards) |
| `control` | `#F4F4F4` | Language switch track, icon buttons on mobile |
| `border` | `#E8E8E8` | Outlined cards |
| `border-input` | `#E0E0E0` | Inputs and selects |
| `divider` | `#EDEDED` | Lines inside cards |
| `white` | `#FFFFFF` | Page background, cards |

**Contrast rules**
- White text is allowed on `primary` (5.2:1) and `ink`. Don't use the lighter Homix purple `#7065F0` for text or buttons; it fails contrast (4.4:1).
- On `primary` backgrounds, secondary text uses `primary-tint` (`#F1F0FE`).
- Don't use `body` gray for text smaller than 14 px.

### Status colors

| Status | Background | Text | Example |
|---|---|---|---|
| Available / in stock | `#E8F7EE` | `#18794E` | "In 3 stores", "In stock" |
| Order from abroad / ask the store | `#FFF4E0` | `#8A5300` | "Not in Cambodia yet", "Ask the store" |
| Library / free to read | `#F1F0FE` | `#4B3FD6` | "Borrow on site" |
| Possibly outdated | — | `#B42318` | "Checked 10 Mar 2026 · may be outdated" |

---

## Typography

| | Font | Notes |
|---|---|---|
| Latin | **Epilogue** (400, 500, 600, 700) | Google Fonts, self-host with `next/font` |
| Khmer | **Kantumruy Pro** (400, 500, 600, 700) | Epilogue has no Khmer glyphs, so the stack falls back to it automatically |

Font stack: `'Epilogue', 'Kantumruy Pro', system-ui, sans-serif`. Body letter-spacing `-0.02em`.

| Style | Desktop | Mobile | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Display (hero h1) | 64 px | 38 px | 600 | -0.05em | 1.1 |
| Page title (h1) | 56 px | 30 px | 600 | -0.05em | 1.05–1.1 |
| Section title (h2) | 48 px | 30 px | 600 | -0.05em | 1.1 |
| Card title (h3) | 22–24 px | 18 px | 600 | -0.04em | 1.2 |
| Lead | 18 px | 16 px | 400 | -0.02em | 1.6 |
| Body | 16 px | 16 px | 400 | -0.02em | 1.6 |
| Small / meta | 14–15 px | 13–14 px | 400–600 | -0.02em | 1.5 |

**Two-tone headings:** section titles put the last words in `primary`, e.g. "Find the category <span>for you</span>". Use once per heading.

**Khmer:** don't apply negative letter-spacing to Khmer text (`:lang(km) { letter-spacing: 0 }`), and give Khmer body text line-height 1.7 so stacked vowels and subscripts don't clip.

---

## Shape, spacing, elevation

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 10 px | Buttons, inputs |
| `radius-md` | 16 px | Small cards, FAQ items, panels inside cards |
| `radius-lg` | 20 px | Cards, hero panels, CTA bands |
| `radius-pill` | 9999 px | Chips, badges, language switch, icon circles |
| `shadow-card` | `0 10px 40px rgba(27,27,27,0.08)` | Raised cards (books, listings, services) |
| `shadow-float` | `0 16px 48px rgba(27,27,27,0.10)` | Search bar over the hero, filter panel |

- Content width: `max-width: 1200px`, side padding 24 px (16 px on mobile).
- Full-bleed panels (hero, purple CTA band): `max-width: 1408px`, 16 px from the screen edge, `radius-lg`.
- Vertical rhythm: 120 px between home sections, 88–112 px on inner pages, 48 px on mobile.
- Touch targets: at least 44 px tall; main buttons 48–56 px.

---

## Components

| Component | Spec |
|---|---|
| **Header** | Logo left (book icon + `bookincambodia` wordmark in `primary`, 700, -0.06em), nav links centered (16 px, 500, `ink`; current page `primary`), right: language pill switch + black **Contribute** button. Wraps on small screens; mobile uses the bottom tab bar instead. |
| **Primary button** | `primary` bg, white text, 600, `radius-sm`, height 56 (hero) / 48 (default). |
| **Dark button** | `ink` bg, white text. Used for Telegram contact, Details, Contribute. |
| **Outline button** | 1 px `ink` border, `ink` text, transparent bg. "See all" style links. |
| **Soft button** | `primary-tint` bg, `primary-hover` text. Secondary actions (Call, Directions, Add to calendar). |
| **Search bar** | White, `radius-sm` + 8 px padding, `shadow-float`, input height 56, purple Search button inside. |
| **Chip** | Pill, height 40–52, `primary-tint` bg / `ink` text; selected = `primary` bg / white text. Use `aria-pressed`. |
| **Badge** | Pill, 13 px, 600, status colors above. |
| **Book card** | `shadow-card`, `radius-lg`, top panel `primary-tint` 230 px tall with the cover centered and a status badge top-left; body: title (20 px, 600), author, divider, language + price row. |
| **Listing card** (where to get it) | `shadow-card`, store name + type badge, place, "Checked <date>", price block, Telegram (dark) + Call/Map (soft icon buttons). |
| **Section header** | Left-aligned two-tone h2 with an outline button on the right, or centered h2 + lead for "story" sections. |
| **Icon circle** | 56–64 px pill, `primary-tint` bg, `primary` stroke icon. |
| **CTA band** | Full-bleed `primary` panel, centered white heading, white + outline-white buttons. |
| **FAQ** | Native `<details>`/`<summary>` items, `surface` bg, `radius-md`, summary 72 px tall. |
| **Date block** | `primary` square, `radius-md`, month (small, 600) over day (large, 700). |
| **Mobile tab bar** | 5 tabs: Home, Search, Stores, Abroad, Community. Icon 22 px + label 12 px; active = `primary`. |
| **Book spine shelf** | Decorative row of colored rectangles (`primary`, `ink`, `primary-soft`, `#FFB547`, `#FF8A65`, `#2E2A5C`, white) at the bottom of the hero and on store cards. `aria-hidden`. Replaces stock photos. |

**Icons:** simple 2 px stroke icons (Lucide is a good match). Never emoji.

**Book covers:** use real cover images when we have them (WebP, max 600 px). Until then, render a colored placeholder cover with the title and author, as in the mockups.

---

## Accessibility checklist

- Text contrast at least 4.5:1 (3:1 for 24 px+). Tokens above already pass when used as specified.
- Visible focus ring: `outline: 3px solid #6357E8; outline-offset: 2px`.
- Real `<button>`, `<a href>`, `<input>` with `<label>`; icon-only buttons get `aria-label`.
- Status is never color-only: badges always have text.
- `lang="km"` on Khmer content so screen readers and fonts switch correctly.

---

## Tailwind mapping (for Phase 1)

```ts
// tailwind.config.ts (excerpt)
theme: {
  extend: {
    colors: {
      ink: '#1B1B1B',
      body: { DEFAULT: '#6B6B6B', strong: '#4D4D4D' },
      primary: { DEFAULT: '#6357E8', hover: '#4B3FD6', tint: '#F1F0FE', soft: '#C6C1F9' },
      surface: '#F7F7F7',
      control: '#F4F4F4',
      line: { DEFAULT: '#E8E8E8', input: '#E0E0E0', divider: '#EDEDED' },
      status: {
        'ok-bg': '#E8F7EE', ok: '#18794E',
        'warn-bg': '#FFF4E0', warn: '#8A5300',
        stale: '#B42318',
      },
    },
    fontFamily: {
      sans: ['var(--font-epilogue)', 'var(--font-kantumruy)', 'system-ui', 'sans-serif'],
    },
    borderRadius: { sm: '10px', md: '16px', lg: '20px' },
    boxShadow: {
      card: '0 10px 40px rgba(27,27,27,0.08)',
      float: '0 16px 48px rgba(27,27,27,0.10)',
    },
    letterSpacing: { tightest: '-0.05em', tighter: '-0.04em', tight: '-0.02em' },
  },
}
```

If Phase 1 uses Tailwind v4 (CSS-first config), put the same values in `@theme` in `globals.css` instead.
