# Session Log — 2026-05-06

## Context

First integration session for Snowflake on the Slicc platform. Goal: add DA (Document Authoring) storage support to the conversion flow and rework header/footer handling.

## Changes delivered

### 1. DA mount integration (`feat-da-integration`, merged as PR #2)

Replaced the `aem` CLI deploy pipeline (which isn't available in Slicc) with the `mount` command for DA storage.

**Flow:** `mount --source da://<org>/<repo> /mnt/da` → `write_file /mnt/da/...` → `mount refresh /mnt/da`

**Key decisions:**
- `daPath` defaults to `/<branch>` — isolates branch content from main
- Per-item `mount refresh` — guarantees each file landed before reporting success
- Live URL only (no separate preview URL) — DA content is live post-refresh
- Mount persists after deploy for ongoing bidirectional sync

**Sprinkle changes:**
- DA Space field (defaults to GitHub repo value)
- DA Path field (defaults to `/<branch>`)
- Deploy stages: Write → Refresh → Live (was Upload → Preview → Publish)
- Mount status indicator on Serve panel

### 2. Static header/footer fragments (`feat-static-header-footer`, PR #3)

Replaced the DA-authored fragment + block-JS-parser pattern with static fragments injected verbatim.

**Old:** Store flat content in DA → `blocks/header/header.js` parses structurally → rebuilds DOM
**New:** Extract prototype header/footer as-is (DOM + `<style>`) → commit to `fragments/` → `postlcp.js` fetches and injects via `innerHTML`

**Key decisions:**
- Removed `blocks/header/` and `blocks/footer/` entirely
- Inline `<style>` in fragment files (one fetch, no FOUC)
- Keep `header: off` / `footer: off` metadata support
- No branch logic needed — EDS CDN resolves relative paths to correct branch automatically

## Learnings

### Slicc environment constraints

1. **No `aem` CLI** — the previous deploy mechanism doesn't exist here. `mount` + `write_file` is the replacement.

2. **`node` in the VFS shell is limited** — `require('fs')` and ESM imports don't work in inline `node -e` commands. The shell's `node` is sandboxed. For file transforms like `sanitise.js`, either:
   - Read the file with `read_file`, transform in the agent's logic, write back
   - Or restructure the script to work as a pure stdin→stdout pipe

3. **`mount refresh` output format** — returns `Refreshed /mnt/da: +N -N ~N (N unchanged, 0 errors)`. Parse for `0 errors` to confirm success.

4. **Mount persists across conversations** — once mounted, `/mnt/da` stays active even after the agent restarts. Check `mount list` before re-mounting.

5. **Git push requires GitHub provider** — the Slicc fetch proxy handles git auth. Credentials are configured via the GitHub provider in Settings (not `secret set`). Use `oauth-token github` to get the token for API calls.

6. **`oauth-token github`** — returns a fresh GitHub OAuth token for API calls (PR creation, merging). The `gh` CLI isn't available, so use `curl` + GitHub REST API with this token.

### EDS architecture insights

1. **Branch isolation on EDS CDN** — pages served at `<branch>--<repo>--<org>.aem.live` automatically resolve relative paths to the branch. No special branch-routing logic needed in JS.

2. **`codeBase` in ak.js** — derived from `import.meta.url`, always points at the code origin. Static fragments fetched via `${codeBase}/fragments/header.html` resolve correctly across all environments (local, preview, live).

3. **`postlcp.js` timing** — runs after Largest Contentful Paint. Header/footer are not LCP-critical, so loading them post-LCP is correct. The fetch is same-origin and CDN-cached, so latency is negligible.

4. **Content vs code artifact routing:**
   - **Code** (blocks, scripts, styles, static fragments) → GitHub branch
   - **Content** (pages) → DA space via mount
   - This split means conversions commit code + push to GitHub, then deploy content pages to DA separately

### DA-specific learnings

1. **Non-ASCII corruption** — DA strips `<head>` and parses without charset declaration. All non-ASCII must be encoded to HTML entities before writing. The `tools/da/sanitise.js` script handles this, but since it can't run directly in the VFS shell, the agent must handle sanitisation manually (replace `·` → `&middot;`, `–` → `&ndash;`, etc.).

2. **DA Edit URL format** — `https://da.live/edit#/<org>/<repo>/<path>/<name>` (no `.html` extension)

3. **DA Live URL format** — `https://<branch>--<repo>--<org>.aem.live/<path>/<name>` (no `.html` extension, branch in hostname)

4. **Mount write paths include `.html`** — even though DA URLs don't show the extension, the mount expects it: `/mnt/da/<path>/<name>.html`

## Architecture diagram

```
┌─────────────────────────────────────────────────────────┐
│  Prototype (.html)                                       │
└────────┬──────────────────────────────────┬──────────────┘
         │                                  │
    ┌────▼────┐                       ┌─────▼─────┐
    │  Code   │                       │  Content  │
    │ (GitHub)│                       │   (DA)    │
    ├─────────┤                       ├───────────┤
    │ blocks/ │                       │ pages     │
    │ styles/ │                       │ (via mount│
    │ scripts/│                       │  + write) │
    │fragments/                       │           │
    │  header.html (static)           │           │
    │  footer.html (static)           │           │
    └────┬────┘                       └─────┬─────┘
         │ git push                         │ mount refresh
         │                                  │
    ┌────▼────────────────────────────┬─────▼─────┐
    │         EDS CDN                              │
    │  <branch>--<repo>--<org>.aem.live           │
    │                                              │
    │  Code from GitHub ←→ Content from DA         │
    └──────────────────────────────────────────────┘
```

## Open items for future sessions

1. **Scoop timeout on conversion** — the conversion scoop timed out at 120s during the awards.html conversion. For larger batches, either increase timeout or break work into smaller scoops per page archetype.

2. **`sanitise.js` in-shell execution** — need a workaround for the VFS node limitation. Options: rewrite as a simpler bash-compatible transform, or always sanitise manually in the agent.

3. **Sprinkle panel after static fragments** — the Serve panel no longer shows a Fragments section. Consider adding a "Committed to GitHub" confirmation card showing the static fragments were pushed.

4. **Multi-page conversion ordering** — Phase 1 (site setup) must complete before Phase 2 (per-file). When using scoops, ensure site setup runs in the cone or a single scoop before dispatching parallel per-page scoops.
