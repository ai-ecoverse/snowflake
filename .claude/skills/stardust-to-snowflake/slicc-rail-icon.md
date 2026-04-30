# Pending slicc enhancement: custom rail icon for sprinkles

## Context

Today, every sprinkle in slicc's right rail (and the extension's tab bar) shows the default Lucide `Sparkles` icon. It's hardcoded in `packages/webapp/src/ui/layout.ts:64` as `SPRINKLE_DEFAULT_ICON`. The comment immediately above the constant already anticipates the convention this doc proposes:

> When sprinkles want a specific glyph, future work can wire up a `data-sprinkle-icon` attribute on the .shtml `<html>` element and surface that here.

The snowflake sprinkle (`.claude/skills/stardust-to-snowflake/snowflake.shtml`) already declares `data-sprinkle-icon='<svg …>…</svg>'` on its `<html>` element prospectively (alongside `data-sprinkle-autoopen`). It is inert until slicc implements the change below.

## Implementation plan

Four files, ~10 lines of production code, no new dependencies.

### 1. `packages/webapp/src/ui/sprinkle-discovery.ts`

- Add `icon?: string` to the `Sprinkle` interface.
- Add an exported `extractIcon(content: string): string | undefined` helper, mirroring the existing `extractTitle` / `extractAutoOpen` exports.
- In `scanDir`, call `extractIcon(content)` and include it when populating the map entry.

### 2. `packages/webapp/src/ui/sprinkle-manager.ts`

- Add an optional `icon?: string` parameter to the `addSprinkle(...)` callback in `SprinkleManagerCallbacks` (line 30).
- Pass `sprinkle.icon` at the call site (line 185).

### 3. `packages/webapp/src/ui/layout.ts`

- Add an optional `icon?: string` parameter to the `addSprinkle` method.
- Pass `icon ?? SPRINKLE_DEFAULT_ICON` where `SPRINKLE_DEFAULT_ICON` is currently used (lines 1025 and 1067).

### 4. `packages/webapp/src/ui/main.ts`

- Thread the new `icon` parameter through the two callback wrappers at lines 1168-1169 and 2590-2591.

## Critical detail — regex form

The existing attribute extractor in `sprinkle-discovery.ts:89` uses

```ts
const attrMatch = content.match(/data-sprinkle-title=["']([^"']+)["']/);
```

That pattern **cannot** be reused for `data-sprinkle-icon` because the value is SVG markup that contains *both* quote types. Use a single-quote-only matcher:

```ts
const m = content.match(/data-sprinkle-icon='([^']*)'/);
return m && m[1] ? m[1] : undefined;
```

Document the constraint in a code comment and in the user-facing sprinkles SKILL: the `data-sprinkle-icon` attribute **must** be single-quoted; the SVG payload uses double quotes for its own attributes.

## Tests (~30 lines)

`packages/webapp/tests/ui/sprinkle-discovery.test.ts` already has parallel `describe('extractTitle')` and `describe('extractAutoOpen')` blocks. Add a third:

```ts
describe('extractIcon', () => {
  it('extracts an inline SVG from data-sprinkle-icon', () => {
    const html = `<html data-sprinkle-icon='<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'>`;
    expect(extractIcon(html)).toContain('<svg');
  });

  it('returns undefined when the attribute is absent', () => {
    expect(extractIcon('<html>')).toBeUndefined();
  });

  it('returns undefined for empty value', () => {
    expect(extractIcon(`<html data-sprinkle-icon=''>`)).toBeUndefined();
  });
});
```

`sprinkle-manager.test.ts` likely needs no change — its mock callback can ignore the new optional param.

## Manual verification

1. Build slicc (`npm run build -w @slicc/webapp` plus the chrome-extension build for the extension float).
2. Run `sprinkle close snowflake && sprinkle open snowflake`.
3. Confirm the rail/tab icon shows the snowflake glyph instead of the default Sparkles.

## Effort

**~60-90 minutes total** for production code, tests, and verification.

| Phase | Estimate |
|-------|---------:|
| Production code (regex + callsite plumbing) | 30-40 min |
| Tests | 20-30 min |
| Rebuild + visual verification (CLI float and extension float) | 15-20 min |

## Risks

- **Type safety**: TypeScript should catch any missed callsite as the callback signature changes — low risk if `tsc --noEmit` runs in CI.
- **XSS via SVG `<script>`**: `btn.innerHTML = item.icon` (rail-zone.ts:303) will execute `<script>` tags embedded in the SVG. This matches the existing trust boundary — anyone with VFS write access can already do worse — but the rail code should grow a comment noting that sprinkle icons are trusted markup. No sanitization required for the trust model as it stands.
- **Backwards compatibility**: existing sprinkles without `data-sprinkle-icon` keep getting the default Sparkles icon. No migration needed.
