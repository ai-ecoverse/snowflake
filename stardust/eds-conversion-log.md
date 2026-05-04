# EDS Conversion Log — Clark County NV Homepage

## Conversion Date
2026-05-04

## Source
- Prototype: `stardust/prototypes/home-proposed.html`
- Branch: `53135b60`
- Repo: `ai-ecoverse/snowflake`

## Block Inventory

| Block | Description |
|-------|-------------|
| `hero` | Two-column split hero with eyebrow, headline, body, CTAs, and full-bleed image |
| `task-navigator` | 3x3 numbered tile grid linking to top citizen tasks |
| `featured-stories` | 3-column news card grid with images, badges, headlines, dates |
| `calendar` | 4-column event card strip with date, title, and "View Event" links |
| `featured-program` | Navy-background split section with gold/white CTAs and program image |
| `quick-links` | 4-column icon/link grid for department discovery |

**Chrome (not counted as blocks):**
- `header` — Brick-red sticky bar with logo, nav links, search, mobile hamburger
- `footer` — Two-tier: gray top (brand + contact + links) and brick-red bottom (copyright + accolade)

## Naming Decisions

- Section `data-section` values mapped 1:1 to block names (kebab-case): `hero`, `task-navigator`, `featured-stories`, `calendar`, `featured-program`, `quick-links`
- No cross-page reuse to resolve (single page conversion)
- Header/footer treated as chrome with fragment-based loading

## Font Licensing Note

**Neue Montreal** (Pangram Pangram foundry) is a commercial proprietary font. It is NOT available on Google Fonts, fontsource, or any open-source CDN. Self-hosting requires a commercial license purchase.

**Decision:** Use system fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`. This eliminates CLS entirely (no font swap) at the cost of not matching the exact brand typeface. When a license is procured, the font can be added to `styles/fonts/` with `@font-face` declarations in `styles/styles.css`.

## Anti-Patterns Avoided

1. **No abstracting sections into variant blocks** — Each prototype section maps to exactly one block. No `hero (dark)` / `hero (light)` variants.
2. **No section-metadata style classes** — All section styling owned by per-block CSS.
3. **No shared utility modules** — SVG icons are inline in each block's JS (e.g., quick-links icons, calendar chevrons).
4. **No manufactured button anchors** — Block JS clones cell child nodes into `.actions` wrappers. EDS `decorateButton()` applies `.btn` classes from `<strong><a>` / `<em><a>` wrapping.
5. **No class-based fragment detection** — Header/footer JS identifies elements structurally (first picture, first ul, etc.).
6. **No `<head>` element in content pages or fragments** — EDS injects project `head.html` at delivery.
7. **No touching `head.html`** — No font links, preloads, or scripts added.
8. **No generic placeholder image paths** — All image URLs are fully qualified from the prototype source.
9. **No per-block font-family declarations** — Font flows from body via inheritance.
10. **No over-applying button convention** — Tile cards (task-navigator, quick-links) and text links (event-link) are plain anchors styled per-block.

## Fragment Paths

- Navigation: `content/fragments/nav.html` → loaded via `getMetadata('header')` pointing at `/53135b60/fragments/nav`
- Footer: `content/fragments/footer.html` → loaded via `getMetadata('footer')` pointing at `/53135b60/fragments/footer`

## Notes for Future Work

- Event dates in the calendar block are placeholders ("MAY — DATE TBD") — source data did not include exact dates
- Quick-links descriptions are placeholder content from the prototype
- Newsletter signup in footer is simplified to a link structure (forms require additional EDS integration)
- When Neue Montreal license is acquired, add woff2 to `styles/fonts/` and update `--font-heading` / `--font-body` tokens
