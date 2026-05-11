# BUILD_REPORT: v4.0.0

**Source BUILD**: `v4_0_0_BUILD.md`
**Shipped commit**: `92c1868` (dev → main → tag `v4.0.0`)
**Date**: 2026-05-11
**Branch lifecycle**: cut `feat/v4-basics` from `dev`, ff-merged to `dev`, ff to `main`, tagged.

---

## What changed (file-by-file)

| File | Change | Phase |
|---|---|---|
| `src/autocorrect.ts` | Added `"->": "→"` dictionary entry (regex fix to actually trigger it: skipped) | 1 (partial) |
| `src/theme.ts` | `.cm-lineNumbers .cm-gutterElement` — tokenized width to CSS var; `align-content: flex-start`; `min-width: 25px`; `padding: 0` | 2 + 2 follow-up fixes |
| `src/styles/main.css` | Added `:root { --thot-line-number-width: 16px; }` | 2 |
| `src/editor.ts` | Added `DocumentMeta: tags.processingInstruction` styleTag (inert — see deviations) | 3 |
| `src/editor.ts` | Added `TaskMarker` branch in `buildMarkerDecorations` (`[x]` → `checkboxCheckedDeco`) | 4 |
| `src/highlight-tags.ts` | Added `checkboxChecked: '#5A7DB8'` color | 4 |
| `src/paste-handler.ts` (new) | `pastePlainText` extension — strips HTML, normalizes smart quotes | 5 |
| `src/editor.ts` | Wired `pastePlainText` after `closeBrackets()` in extensions array | 5 |
| `src/file-system.ts` | Stripped ` - Thot` suffix at `:24`, `:37`, `:66` | 6 |
| `src/editor.ts` | `BulletList/...` → `BulletList/ListItem/Paragraph` (and OrderedList variant) | 7 |
| `src/editor.ts` | Custom Enter handler before `Mod-s` in keymap — exits empty list items | 8 |
| `package.json` | Version bump `2.1.4` → `4.0.0` | 9 |

Subagent groupings from the BUILD were collapsed into the orchestrator's own sequence — the work was tight enough that subagent overhead exceeded its value. No correctness impact.

---

## Deviations from the BUILD

**Phase 0 (DevTools spike)**: NOT executed live. Browser-permission for Claude-in-Chrome MCP was blocked in the orchestrator instance. Static analysis of `node_modules/@codemirror/view/dist/index.js:6608–6640` confirmed CM's `.cm-content.cm-lineWrapping { white-space: break-spaces; ... }` rule fires unconditionally — `EditorView.lineWrapping` in our extensions adds the class. No CSS override below 1040px exists in our code or CM base. **Conclusion**: the bug described in the BUILD does not reproduce on current code. No fix applied. Sean confirmed wrap works at narrow viewport on the dev preview.

**Phase 2 (line numbers) — TWO follow-up commits required**: BUILD spec only tokenized `width` to a CSS var. That alone left two regressions visible:
1. Wrapped-line numbers rendered on the SECOND visual row of a wrapped line because `align-content: flex-end` was anchoring to the bottom. **Fix (44c6529)**: changed to `align-content: flex-start`.
2. Column shifted at the 99→100 line boundary because CM's default `min-width: 20px` only holds 2 digits. **Fix (44c6529)**: set `min-width: 25px` on our rule.
3. With 25px column + CM base `padding: 0 3px 0 5px` (8px inline) + `text-align: right`, the third digit was clipped and visually centered. **Fix (92c1868)**: `padding: 0` on our rule.

**Phase 1 (`->` autocorrect)**: BUILD claim that `[a-zA-Z0-9_:-]+` regex captures `->` is wrong — `>` isn't in the character class. The dictionary entry was added but the regex fix was deliberately deferred at Sean's call (skip non-sure-wins; revisit in v4.0.1). The `->` token does not currently autocorrect.

**Phase 3 (DocumentMeta remap)**: BUILD diagnosed the "hyphen-line-orange-bold" bug as `lang-markdown` over-permissively tagging `DocumentMeta`. Verified during execution: `@lezer/markdown` **does not emit `DocumentMeta` at all** — that tag only fires for HTML/XML `DoctypeDecl`. The styleTag entry we added is inert (does nothing for markdown content). The real root cause is SetextHeading2 — a `---` line after a paragraph promotes the paragraph to H2 per CommonMark. The styleTag entry was left in (inert) per Sean's call to "leave as-is, fix properly in v5."

**Phase 4 (checked-todo distinct color)**: Decoration code is structurally correct and follows the same inline-style pattern as the working bullet/number marks. Live test: `[x]` does not visibly render with the darker `#5A7DB8` color — likely `tags.atom` HighlightStyle rule cascading on top. Left in place per Sean's call to defer to v5.

**Phase 7 (list bleed)**: The `BulletList/ListItem/Paragraph` restriction correctly stops the trailing-line bleed (third line after a list no longer renders as list content). Side effect: tight lists (no blank lines between items) don't wrap inline content in `Paragraph`, so their list-item text lost the cyan/pink content tag. Sean's explicit call: **the bleed fix is the priority; the inline-color side effect is acceptable v5 work, do not revert.**

---

## Gaps and bugs surfaced (do not patch into the v4.1.0 BUILD — see DEV_RULES § no-pass-through)

These are v4.0.1 or v5 candidates, not Phase B fodder:

1. **`->` autocorrect regex** — deferred. Add `>` to trigger char class. Sure-win-but-skipped per Sean.
2. **Genuine SetextHeading2 misbehavior** — `---` after a paragraph promotes the paragraph to H2. This is CommonMark per spec, so the bug is really a UX preference: should Thot inhibit Setext promotion in favor of HorizontalRule? Belongs in v5 scope research.
3. **Checked-todo color cascade** — `[x]` doesn't darken because the inline-style decoration is out-specificity'd by `tags.atom` HighlightStyle. Either move to a `.thot-checkbox-checked` class technique, or wait for v5 scope system where this is a config knob.
4. **Tight-list content tagging** — list-item text in tight lists renders foreground white instead of cyan/pink. v5 scope rebuild handles this cleanly; the current `styleTags + HighlightStyle + ViewPlugin` tri-system can't express "list content (any descendant) but never bleed past list end" without one of these side effects.
5. **PWA install prompt should not be offered** — Sean wants Thot to be browser-only until native shells land in vNext. v4.0.1 candidate.

---

## Verification results

| Phase | Verified | Notes |
|---|---|---|
| 0 (line wrap) | ✓ (static analysis + Sean live) | Soft-wrap engages at narrow viewport. No fix needed. |
| 1 (`->` autocorrect) | ✗ broken | Regex fix deferred. Dictionary entry exists but never triggers. |
| 2 (line numbers) | ✓ (after 2 follow-ups) | Sean confirmed perfect across 99→100→101 boundary. |
| 3 (DocumentMeta) | inert | Doesn't fire for markdown. Bug Sean reported has different root cause. |
| 4 (checked todo color) | ✗ doesn't visibly apply | Cascade specificity. Deferred to v5. |
| 5 (paste plain text + smart quotes) | ✓ Sean confirmed | Curly → straight; HTML styling dropped. |
| 6 (PWA title dedup) | ✓ Sean confirmed | Title reads `<filename>` only, one suffix from PWA shell. |
| 7 (list bleed) | partial ✓ | Bleed fixed; tight-list content color regression accepted per Sean. |
| 8 (list Enter exit) | ✓ Sean confirmed | Empty bullet Enter strips marker. Quirk 2 not triggered in tests. |
| 9 (version bump) | ✓ | `package.json` at `4.0.0`. |

Production build (`npm run build`) succeeded clean throughout. TypeScript checks clean. No PWA service-worker regressions observed.
