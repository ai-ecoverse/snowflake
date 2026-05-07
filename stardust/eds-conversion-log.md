# EDS Conversion Log — Enterprise Tech Provider

**Source prototype:** `stardust/prototypes/home-proposed-v09.html`
**Branch:** `etp-demo`
**DA target:** `ai-ecoverse/snowflake` at `/etp-demo`
**Conversion date:** 2026-05-07

## Block inventory

| Block | Sections | Notes |
|---|---|---|
| `publication-banner` | publication-banner | Dark ink identity band with brass hairline |
| `hero` | hero | Platinum bg + right-aligned lifestyle photo via CSS mask; 309px thumb; word-by-word h1 reveal |
| `mini-roster` | mini-roster | 3-col mini cards, 96×96 thumbs, fixed section head in JS |
| `reads` | reads | 2×2 roster grid, 200px thumbs, fixed section head in JS |
| `reels` | reels | Featured YouTube iframe (8fr) + 4-item sidebar (4fr); click-to-swap JS |
| `topic-band` | topic-band | Full-bleed ink band, 7-col topic grid; count tick-up delight |
| `departments` | departments | 3-col dept grid with topic labels; stretched-link hover; 6 departments |
| `engagement` | engagement | Centered newsletter sign-up with email form |

**Static fragments (code, not DA):**
- `fragments/header.html` — utility strip + sticky nav + mobile drawer
- `fragments/footer.html` — 4-col footer grid + legal + co-brand logos

**Total blocks:** 8
**Content pages:** 1 (`content/home.html`)

## Decisions locked

1. **Font stacks renamed** — prototype used `var(--display/editorial/ui/mono)`; EDS styles.css uses `var(--font-display/editorial/ui/mono)`. Block CSS uses the renamed tokens.
2. **Fonts self-hosted** — Manrope, Newsreader, Inter, IBM Plex Mono all downloaded to `styles/fonts/`. Google Fonts CDN removed.
3. **Metric-matched fallback** — Arial overridden with `size-adjust: 94%; ascent-override: 94%; descent-override: 26%` to match Manrope's metrics. Body defaults to `arial, sans-serif`; `body.session` switches to `var(--font-ui)`.
4. **Section heads baked into block JS** — `mini-roster` and `reads` have fixed headings ("What else partners are reading" / "This week's reads") since they don't vary; simpler authoring.
5. **Hero background via CSS** — the lifestyle photo (`etp-header-people-standing-short-e1489655.jpg`) is set in `hero.css` as a `::before` pseudo-element with mask gradient. No img element for it in the content page.
6. **Fragment isolation** — header/footer use `.etp-*` class prefixes to avoid collisions with block-level `.ds-*` utility classes.

## Anti-patterns avoided

- Did NOT put font `<link>` or `<style>` in `head.html`
- Did NOT manufacture button anchors with custom classes in block JS — the `ds-button-primary` class + `ds-btn-lab/arrow` structure is authored or built via innerHTML only for the two-tone button variant
- Did NOT redefine `:root` tokens in block CSS
- Did NOT create section-metadata style classes
- Did NOT collapse header/footer into block JS — static fragments injected verbatim via `postlcp.js`

## Known gaps

- Meta fields (date, read-time, author) in hero and card blocks are empty — will populate when CMS data is available
- Deck text for roster cards is absent (placeholders in prototype) — left as single-title display
