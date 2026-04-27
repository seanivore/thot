# V3 Proprietary Highlighting System: Implementation Guide
**Branch**: `feat/v3-highlighting`
**Target**: `v3-rainbow-moat`

## Goal
Build a custom, fully-owned pattern matching highlight engine for markdown and plain text, eliminating the current three-layer complexity (styleTags + HighlightStyle + ViewPlugin). The new paradigm uses explicit priority list: Pattern → Scope → Color → Priority.

## Current vs New Architecture
- **Current**: relies on Lezer styleTags, HighlightStyle CSS cascade and inline ViewPlugins. Complexity causes color bleeding bugs.
- **New**: Relies solely on a single ViewPlugin (generalizing the current `buildMarkerDecorations`) that leverages the nested tree structure for priority (inner node overrides outer node). 
- **The Magic of Tree Depth**: Instead of CSS cascades, we use the fact that `StrongEmphasis` inside `BulletList` automatically overrides because inner spans render over outer ones visually.

## Tasks & Execution
### 1. Define Highlighting Scopes
- Create `src/scopes.ts` 
- Transfer current color palette into `colors` object.
- Define `MARKDOWN_SCOPES` (mapping Lezer Node names to styling, e.g. `StrongEmphasis: { color: colors.bold, fontWeight: '800' }`).
- Define `PLAIN_TEXT_SCOPES` using Regex.

### 2. Implement Engine (`src/highlighter.ts`)
- Generalize `buildMarkerDecorations` to handle ALL markdown highlighting.
- Build single pass tree walker that reads visible ranges.
- Remove styleTags and HighlightStyles from original configuration.
- Add mode detection (Auto detect markdown vs plain text based on presence of `#`, `**`, `[]()`, ````, etc).

### 3. Replace & Clean Up (`src/editor.ts` & `src/theme.ts`)
- Swap the old ViewPlugin and extensions with `thotHighlighter`.
- Strip down `src/theme.ts` to only include editor chrome styles and minimal HighlightStyle needed for embedded Code Block parsing.
- Delete `src/highlight-tags.ts` post-verification.

## Verification
- Test complex nested scenarios: `**bold *italic inside***` and `*italic **bold inside***`.
- Ensure list markers get the correct marker colors (gold for bullet, red for number) without inheriting content colors.
- Ensure inline code backticks match inline code content color.
- Test plain-text fallback rules.
