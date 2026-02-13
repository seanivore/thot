# v2.0.8 Bug Log — Highlighting System Fixes

## Root Causes (3 systemic issues)

### 1. Lezer styleTags Depth Mismatch
The default markdown parser tags ALL markers as `tags.processingInstruction` at depth=0. The previous `'Emphasis/...'` wildcard rules created inherit rules on the parent node, NOT higher-specificity rules on the markers themselves. Path-based matches like `'Emphasis/EmphasisMark'` resolve at depth=1, which beats depth=0.

**Source**: `@lezer/highlight/dist/index.js:246-263` — priority comparison logic.

### 2. Missing GFM Parser
`markdown()` with no `base` option defaults to CommonMark only. Tables, Strikethrough, and TaskList node types were never parsed — they simply didn't exist in the syntax tree.

**Fix**: `base: markdownLanguage` (exported from `@codemirror/lang-markdown`) includes GFM extensions plus Subscript, Superscript, and Emoji.

### 3. CSS Cascade Order Reversed
`HighlightStyle.define()` generates single-class CSS rules in array order. When the Lezer inherit mechanism places two CSS classes on the same `<span>`, the LATER CSS rule in the stylesheet wins. The previous order placed high-priority items first, meaning they lost to lower-priority items in the cascade.

**Fix**: Low priority first (earliest CSS rule), high priority last (latest CSS rule wins).

---

## Bug-by-Bug Resolution

### Bug 1: Bold Markers (\*\*) Showing Purple
- **Symptom**: `**` markers displayed as purple (`processingInstruction` color) instead of matching bold text color (#FFD866)
- **Root cause**: Depth mismatch (root cause #1). `'StrongEmphasis/...'` created an inherit rule, not a direct override on EmphasisMark nodes.
- **Fix**: `'StrongEmphasis/EmphasisMark': tags.strong` — path-based match at depth=1 overrides depth=0.

### Bug 2: Italic Markers (\*) Showing Purple
- **Symptom**: `*` markers displayed as purple instead of matching italic text color (#BF437F)
- **Root cause**: Same depth mismatch as Bug 1.
- **Fix**: `'Emphasis/EmphasisMark': tags.emphasis` — depth=1 override.

### Bug 3: Bullet List Markers Wrong Color, Content No Color
- **Symptom**: Bullet markers (`-`, `*`, `+`) showed cyan instead of gold (#dfc532). Bullet content had no highlighting (white).
- **Root cause**: No custom tags existed to differentiate bullet vs ordered list markers. The ViewPlugin approach (CSS class decorations) had lower specificity than HighlightStyle rules and was being overridden.
- **Fix**: Created custom `bulletMarkTag` and `bulletContentTag` Lezer Tags. Applied via `'BulletList/ListItem/ListMark': bulletMarkTag` and `'BulletList/...': bulletContentTag` inherit rules in styleTags.

### Bug 4: Numbered List Markers Wrong Color, Content No Color
- **Symptom**: Numbered markers (`1.`, `2.`) showed cyan instead of red (#ff6b6b). Numbered content had no highlighting.
- **Root cause**: Same as Bug 3 — no custom tags for ordered lists.
- **Fix**: Created `orderedMarkTag` and `orderedContentTag`. Applied via `'OrderedList/ListItem/ListMark': orderedMarkTag` and `'OrderedList/...': orderedContentTag`.

### Bug 5: Blockquote Content White (Only Marker Colored)
- **Symptom**: `>` marker showed yellow (#E6DB74) but the text after it was white.
- **Root cause**: CSS cascade order (root cause #3). `tags.content` (foreground white) was winning over `tags.quote` because it appeared later in the array.
- **Fix**: Reversed cascade order — `tags.content` now first (lowest priority), `tags.quote` after it (higher priority). The blockquote's inherited `tags.quote` class now wins.

### Bug 6: Bold in List Items Shows List Color Instead of Bold
- **Symptom**: Bold text inside a bullet list showed bullet content color instead of bold yellow (#FFD866).
- **Root cause**: CSS cascade order (root cause #3). List styling appeared after bold in the array, winning the cascade.
- **Fix**: `tags.strong` now appears after list tags in the array, giving it higher CSS priority.

### Bug 7: Tables Have Zero Highlighting
- **Symptom**: Table content (pipes, headers, cells) showed no highlighting at all — entirely white.
- **Root cause**: Missing GFM parser (root cause #2). Without `base: markdownLanguage`, the Table node type was never emitted. Additionally, no color mapping existed.
- **Fix**: Added `base: markdownLanguage` to enable GFM parsing. Created custom `tableTag` and applied via `'Table/...': tableTag` inherit rule with color #e2ff79.

### Bug 8: Inline Code Delimiters Showing Purple
- **Symptom**: Backtick (`` ` ``) delimiters on inline code showed purple instead of matching inline code red (#F34D3E).
- **Root cause**: Depth mismatch (root cause #1). `CodeMark` nodes defaulted to `processingInstruction` at depth=0, and no override existed specifically for inline code delimiters.
- **Fix**: `'InlineCode/CodeMark': tags.monospace` — depth=1 path match. Note: `FencedCode/CodeMark` intentionally stays as `processingInstruction` (#6767fc) for the ``` delimiter color.

---

## Additional Proactive Fixes

| Element | Issue | Fix |
|---------|-------|-----|
| StrikethroughMark | `~~` markers would show processingInstruction purple | `StrikethroughMark: tags.strikethrough` |
| LinkMark | `[]()` markers would show processingInstruction purple | `LinkMark: tags.link` |
| SuperscriptMark | `^` markers uncolored | `SuperscriptMark: tags.special(tags.content)` |
| SubscriptMark | `~` markers uncolored | `SubscriptMark: tags.special(tags.content)` |
| HorizontalRule | Inconsistent styling | `HorizontalRule: tags.contentSeparator` explicit override |
| Fenced code delimiter | Color was #8989e3 (content color) instead of #6767fc | `tags.processingInstruction` now maps to `colors.fencedCodeDelimiter` (#6767fc) |
| ViewPlugin decorations | Entire `markdown-decorations.ts` removed | All styling now handled by styleTags + HighlightStyle — simpler, no race conditions |
| theme-reference.ts | Duplicate color source | Moved to `docs/archive/v2/`. `highlight-tags.ts` is now single source of truth. |

---

## Architecture Change

**Before (v2.0.0)**: Three competing styling systems
1. `HighlightStyle.define()` — syntax tag → color mapping
2. `ViewPlugin` decorations — CSS class → color mapping (in `markdown-decorations.ts`)
3. `EditorView.theme()` — `.thot-*` CSS class definitions

**After (v2.0.8)**: One unified system
1. `HighlightStyle.define()` — all colors, correct cascade order
2. `styleTags()` overrides — path-based tag assignment for markers and content
3. Custom `Tag.define()` — for elements that need differentiation (bullet vs ordered lists, tables)

The ViewPlugin and `.thot-*` CSS classes are eliminated entirely.
