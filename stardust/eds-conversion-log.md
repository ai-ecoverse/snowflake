# Stardust → EDS conversion log

## 2026-05-11 — home-cinematic-proposed.html → /content/home.html

Source prototype: `stardust/prototypes/home-cinematic-proposed.html` (v3 cinematic variant of the Semrush home page; verbatim copy carried from v2, motion choreography from `designs/hub/`).

### Decisions locked

1. **Animation** — Initially stripped, then restored on user direction. The full v3 cinematic engine (GSAP 3.12.5 + ScrollTrigger + Lenis 1.0.42 via CDN) ships through `scripts/cinematic.js`, lazy-imported from `scripts/lazy.js` post-LCP. Patterns wired: hero mosaic-converge (220vh pin), text scrub line-reveal (`[data-ta-group]`), stories horizontal scrub (200vh pin, desktop only), pillar-router scroll-driven activation (200vh pin, desktop only), section-entrance fades on `.perks-grid` / `.free-tools` / `.resources` / `.closing-cta` / `.avi`, and footer wordmark clip-reveal. Every timeline gated behind `prefers-reduced-motion: no-preference`. This reverses the earlier "strip" decision per user direction; the trade-off is 3 CDN deps (~80 KB combined) loading lazily after LCP.

2. **Fonts** — Self-hosted **Source Sans 3 Variable** woff2 in `styles/fonts/` (`source-sans-3-variable.woff2`, `source-sans-3-italic-variable.woff2`, ~28 KB each) as the OFL fallback for the prototype's proprietary `Adobe Clean Display`. Adobe Clean stays first in the font stack but will not render (no Typekit kit configured here). Arial gets a renamed metric-override `@font-face` (`size-adjust: 102%`, `ascent-override: 98%`, `descent-override: 27%`) so the initial `body { arial }` paint matches Source Sans 3's metrics and `body.session` can swap to the brand stack with negligible CLS. The metric values are approximations — the `@fontsource-variable/source-sans-3` package doesn't publish a calibrated fallback face, so they were computed from the font's x-height / ascent / descent ratios against Arial's. Pixel-perfect zero-CLS would require Capsize-derived values.

3. **Sticky CTA + modal** — **Skipped.** The sticky-cta + cta-modal pair is a global overlay outside `<main>` and isn't authorable content. Deferred until there's a real use case. The home page works without it.

### Block inventory

One block per prototype `<section>`. No abstraction, no variants, no shared utility modules. Naming follows the prototype's section class names.

| Block | Path | Authoring rows |
|---|---|---|
| `hero` | `blocks/hero/` | eyebrow / h1 (with `**word**` accent) / body / search-cta / CTAs |
| `semrush-one-promo` | `blocks/semrush-one-promo/` | cover-eyebrow / h2 / body / CTA / aside-eyebrow / aside-body |
| `pillar-router` | `blocks/pillar-router/` | eyebrow / h2 / 5× (label \| tagline \| cta-text) |
| `perks-grid` | `blocks/perks-grid/` | 4× (label \| tagline \| cta-text) |
| `stats` | `blocks/stats/` | eyebrow / h2 / 5× (figure \| label \| sub) / CTA |
| `avi` | `blocks/avi/` | h2 / body / CTA / caption / meta / N× (rank \| brand \| pct) |
| `stories` | `blocks/stories/` | eyebrow / h2 / N× (logo \| quote \| name \| role \| figure \| sub) |
| `enterprise-band` | `blocks/enterprise-band/` | eyebrow / h2 (gradient text) / body / CTA |
| `free-tools` | `blocks/free-tools/` | eyebrow / h2 / N× tool-name (linkable) |
| `resources` | `blocks/resources/` | eyebrow / h2 / N× (tag \| title \| excerpt \| link) — first card is featured |
| `closing-cta` | `blocks/closing-cta/` | h2 (with `**word**` accent) / body / CTA |

### Foundation

- **`styles/styles.css`** — `:root` tokens lifted verbatim from the prototype (palette, type scale, spacing, motion easing, composite gradients, noise SVG). Reset, EDS section scaffold, type-scale utility classes (`.t-title-1` through `.t-caption`), global button system (`a.btn`, `a.btn-primary`, `a.btn-secondary`, `a.btn-accent`, `a.btn-negative`, `a.btn-outline`, `.btn-group`). `body { arial }` initial paint, `body.session { var(--body-font-family) }` switch.
- **`fragments/header.html`** — Announcement banner + frosted gnav with logo + 4 nav anchors + Log In / Sign Up. Mega-nav was dropped (its open/close behavior requires JS we'd have to host in a fragment loader, and the underlying links survive as direct anchors). gnav always uses the frosted-glass treatment so it works over light + dark sections without a scroll-state handler.
- **`fragments/footer.html`** — Full site-footer with all 7 columns, link lists, giant Semrush wordmark, legal row.

### Anti-patterns avoided

- One block per section. No `hero` with `dark`/`light`/`with-wave` variants — there's just `hero`.
- No section-metadata style classes. Blocks paint their own surfaces (e.g. `.avi` and `.enterprise-band` ARE dark; the section element doesn't need a `.dark` modifier).
- No shared utility modules (waves, noise overlays, motion primitives). The noise SVG is a `:root` variable consumed by `--noise-svg-uri`; sections that need it reference it inline (`stats`, `enterprise-band`, `semrush-one-promo`).
- Block JS never manufactures button anchors. Authors wrap CTAs in `**strong**` (primary) or `*em*` (secondary) and `scripts/ak.js` → `decorateButton()` applies `.btn` + variant class. Blocks just clone the cell's child nodes into an `.actions` wrapper.
- `head.html` untouched. No font `<link>`, no `<script>`, no `<link rel="preload" as="font">`. All `@font-face` declarations live in `styles/styles.css`.

### Project cleanup folded into this migration

- **`scripts/utils/footer.js` deleted** + its import removed from `scripts/lazy.js`. Dead code from commit `a712bde feat: static header/footer fragments, remove chrome blocks`. The util called `loadBlock(footer)` which produced 404s on `blocks/footer/footer.{js,css}` because the chrome blocks were removed but the loader wasn't. `scripts/postlcp.js` is now the only thing that touches `<footer>` (via the static fragment load).
- **Orphaned Montserrat woff2s removed** from `styles/fonts/`. They were left behind by commit `1259322 fix: revert conversion artifacts` which reverted the awards page but skipped the font cleanup. Nothing in the codebase referenced them.
- **`styles/fonts/OFL.txt` copyright header updated** from Montserrat to Source Sans 3 (Adobe). The SIL OFL license body is unchanged; only the attribution line on top.
- **Dead `.section.dark` button override CSS removed** from `styles/styles.css`. The blocks paint their own dark surfaces (avi, enterprise-band, semrush-one-promo cover, resources featured card), so no section-level dark modifier was needed. Avoiding skill anti-pattern #2 — "section-metadata style classes that parallel block variants".

### What the next person should know

- The hero, stories, and pillar-router blocks each use the **outer-block-as-pin-spacer / inner `.{name}-sticky` viewport** pattern. The block element gets `height: 220vh` (or 200vh) with `position: relative`; the inner sticky element gets `position: sticky; top: 0; height: 100vh`. The GSAP timeline scrubs against the outer element. Adding `prefers-reduced-motion: reduce` collapses both heights to `auto` so the layout degrades to static. If you add a fourth pinned block in the future, follow this shape.
- **`data-ta-group` / `data-ta` / `data-ta-unit` attributes are the contract between block JS and the cinematic engine's text-reveal.** `[data-ta]` elements get split into per-line spans by `cinematic.js → wrapLines()`; `[data-ta-unit]` elements animate as a single unit (no line-splitting). Headlines containing `<span class="accent">` skip line-splitting automatically (the accent word would break the measurement).
- The hero's mosaic is decorative (3×5 grid of `.mosaic-card` gradient divs). At scroll start the cards are positioned by the engine via deltas lifted from `designs/hub/scripts/hero.js` (Figma node 7379:8963). They converge to (0,0) over the 220vh pin. Real images can be added by extending `buildMosaic()` in `blocks/hero/hero.js` to read picture cells from extra rows.
- The pillar-router's active card switches based on scroll progress (0..1 → index 0..4). Clicking a card overrides scroll for 1.2s so user intent wins.
- The stories block's horizontal scrub fires only at `window.innerWidth >= 1024`. Below that, native scroll-snap takes over (declared in `stories.css` `@media (max-width: 1023px)`).
- **CDN deps load post-LCP.** GSAP, ScrollTrigger, Lenis are injected as `<script>` tags by `cinematic.js`. If any fails to load, the engine bails silently — the page renders statically. The `setTimeout(() => ScrollTrigger.refresh(), 200)` at engine end gives the static footer fragment a tick to land before the wordmark trigger measures it.
- The `body.session` font-swap pattern means **on first navigation, type renders in Arial with metric-matched ascent/descent**. Subsequent sessions (`sessionStorage` flag set) render directly in Source Sans 3 Variable.
- "Adobe Clean Display" is the first family in every heading stack but will never load. To enable it: add a Typekit `<link>` to `head.html` and the cascade will pick it up automatically.
- The closing-cta + hero use `<strong>` inside the heading to mark the accent word. The block JS converts those to `<span class="accent">` so the global `decorateButton` (which fires on links inside `<strong>`) doesn't interfere — there's no link in those headings, so it's safe.
- `fragments/header.html` and `fragments/footer.html` ship as code via GitHub. They are NOT uploaded to DA. Only `content/home.html` goes to DA. Editing the header/footer means editing the fragment file and pushing a commit, not editing in DA.
- **Branch names with `/` cause partial AEM deploys on this project.** Use flat names (`feat-foo`, not `feat/foo`). Symptom: most files in the diff sync, but files unchanged from `main` return 404 from the code origin, breaking `head.html` injection. Fix is to rename the branch and re-trigger the code sync via `POST https://admin.hlx.page/code/<owner>/<repo>/<branch>/*`.
