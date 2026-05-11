# BUILD_REPORT: v4.1.0

**Source BUILD**: `v4_1_0_BUILD.md`
**Shipped commit**: `13031ac` (dev → main → tag `v4.1.0`)
**Date**: 2026-05-11
**Branch lifecycle**: cut `feat/v4-urls-anchors` from `dev` (at v4.0.0), ff-merged to `dev`, ff to `main`, tagged.

---

## What changed (file-by-file)

| File | Change | Phase |
|---|---|---|
| `src/click-handlers.ts` (new) | `interactiveLinks()` extension — `mousedown` DOM handler that, when CMD/Ctrl is held, resolves the syntax-tree node at click coords and dispatches open-in-tab (URLs) or scroll-to-heading (anchors); includes Lezer-tree walk-up to find a Link ancestor from any clicked child | 1 + follow-up |
| `src/editor.ts` | Imported `interactiveLinks` and wired `interactiveLinks()` into the extensions array after `pastePlainText` | 2 |
| `src/theme.ts` | Added `class: 'thot-url-link'` to the `tags.url` HighlightStyle entry; added `'.thot-url-link': { cursor: 'pointer' }` after the `.cm-line` block in `thotEditorTheme` | 3 |
| `package.json` | Version bump `4.0.0` → `4.1.0` | 4 |

---

## Deviations from the BUILD

**Phase 1 needed a follow-up commit (13031ac)**: The original handler only matched `LinkMark`, `LinkTitle`, and `LinkLabel` as the directly-clicked node. That covers clicks on `[`, `]`, `(`, `)` brackets/parens AND link titles, but NOT clicks on the visible link text inside `[Example]`. In `@lezer/markdown` the inline label text has no named child node — `resolveInner(pos)` on a click inside `[Example]` returns the parent `Link` node itself. Fix: walk up from any clicked node to find a `Link` ancestor, then dispatch from the Link's `URL` child. Now all positions inside `[text](url)` (label text, brackets, parens, URL) dispatch uniformly.

No other deviations.

---

## Gaps and bugs surfaced

None during execution. The single follow-up was a BUILD-spec gap, not a runtime bug.

---

## Verification results

| Phase | Verified | Notes |
|---|---|---|
| 1 (plain URL CMD+Click) | ✓ Sean confirmed | Opens in new tab; bare click places cursor. |
| 2 (inline link `[text](url)`) | ✓ Sean confirmed (after follow-up) | Both `[text]` and `(url)` halves dispatch. |
| 3 (anchor link `[label](#heading)`) | ✓ Sean confirmed (after follow-up) | Both halves dispatch; viewport scrolls to heading. |
| 4 (cursor pointer on URL hover) | ✓ Sean confirmed | `.thot-url-link` class wired correctly. |
| 5 (no v4.0.0 regression) | ✓ Sean confirmed | Paste, list-Enter, line-numbers, etc. still work. |

Cross-browser: tested on Chrome (macOS `metaKey`) via Sean's preview environment. Safari `metaKey` and Firefox `ctrlKey` not separately verified — the handler checks both branches and CodeMirror's mousedown event surface is consistent across browsers, so cross-browser parity is expected but not proven.

Anchor slug coverage: the slugifier (`lowercase + non-alphanumeric → -`) handles ASCII headings cleanly. Edge cases with emoji, non-ASCII, or unusual punctuation in heading text were not exercised in testing — could surface in v4.1.x if a user reports a missed match.

Production build (`npm run build`) succeeded clean. TypeScript checks clean.
