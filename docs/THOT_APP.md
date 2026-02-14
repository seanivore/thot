# Thot — Project Reference
`thots.august.style`

**Last Updated**: 2026-02-13
**Version**: v2.1.4
**Status**: Active development on `v2-first-thots` branch

---

## Executive Summary

  + **Purpose**: This document provides everything a new AI instance needs to understand and work on this project effectively; it also serves as comprehensive technical documentation
  + **Use**: Read this first before making any changes

---

## Table of Contents

  1. [Project Overview](#project-overview)
  2. [Recent Changes](#recent-changes)
  3. [Architecture Explained](#architecture-explained)
  4. [How to Run & Test Locally](#how-to-run--test-locally)
  5. [File Structure & Key Files](#file-structure--key-files)
  6. [Design System & Styling](#design-system--styling)
  7. [Common Pitfalls & Important Notes](#common-pitfalls--important-notes)
  8. [Deployment](#deployment)
  9. [Changing Colors & Fonts](#changing-colors--fonts)

---

## Project Overview

### What This Is

* **A markdown scratchpad with IDE-like syntax highlighting, designed as a persistent, always-on writing tool**

  + Full markdown syntax highlighting with carefully tuned colors and font weights
  + Auto-saves to browser localStorage with cursor and scroll position
  + Works offline as a PWA — installable on desktop and mobile
  + Built on CodeMirror 6 for performance (handles 100K+ lines)

### The Core Innovation

* **Markdown written like code, not like a document**

  + Text is treated like code in an IDE — monospace font, syntax-colored, line-numbered
  + Not a WYSIWYG renderer; you see the raw markdown with rich highlighting
  + Designed for people who write markdown all day (notes, planning, documentation)
  + The highlight hierarchy is carefully designed so formatting always looks intentional (bold inside a list keeps bold color, inline code overrides everything, etc.)

### Message & Purpose

* **Problem**: Existing markdown editors are either too simple (no highlighting) or too complex (full IDEs with irrelevant features)
* **Solution**: A single-purpose scratchpad that opens instantly, highlights beautifully, and never loses your work

  + Open the app, start typing, see instant highlighting
  + Close the browser, come back later, everything is exactly where you left it
  + Install as a PWA for an app-like experience without the App Store

---

## Recent Changes

### 2026-02-13 — v2.1.4: Context-Dependent Marker Fix

* **ViewPlugin reintroduced for 3 specific marker cases** (in `editor.ts`)

  + Discovery: Lezer's `ruleNodeProp.combine()` places lower-depth rules first; `getStyleTags()` returns the first match. This means the base parser's no-context depth=0 rules (e.g. `ListMark → processingInstruction`) always block context-dependent depth>0 extension rules.
  + Targeted ViewPlugin walks the parent tree for only 3 cases: ListMark in BulletList (gold), ListMark in OrderedList (red), CodeMark in InlineCode (red-orange)
  + CSS classes (`.thot-bullet-mark`, `.thot-number-mark`, `.thot-inline-code-mark`) in `thotEditorTheme` provide higher specificity than HighlightStyle-generated classes
  + Link URL differentiation fixed: `tags.url` entry placed after `tags.link` in HighlightStyle cascade so URL color wins when both classes appear on a span

* **Typography adjustments**

  + Line height: 1.0 → 1.5 (less cramped)
  + Base text weight confirmed as Medium (500)

### 2026-02-13 — v2.0.8: Complete Highlighting System

* **Highlighting architecture rewrite**

  + Root cause analysis revealed 3 systemic issues: Lezer styleTags depth mismatch, missing GFM parser, and reversed CSS cascade order
  + Created `src/highlight-tags.ts` as single source of truth for all colors (~100 entries) and custom Lezer tags
  + Deleted `src/markdown-decorations.ts` (old full-scope ViewPlugin) — replaced by styleTags + targeted ViewPlugin
  + Moved `src/theme-reference.ts` to `docs/archive/v2/` — superseded by `highlight-tags.ts`

* **8 Bugs Fixed** (see `docs/archive/v2/v2_0_8_BUG_LOG.md`)

  + Bold/italic markers now match their content color
  + Bullet and ordered list markers/content now correctly differentiated via custom tags
  + Blockquote content now highlighted (CSS cascade fix)
  + Bold in list items now properly overrides list color (priority ordering)
  + Tables now fully highlighted (GFM enabled via `base: markdownLanguage`)
  + Inline code delimiters now match inline code color

* **GFM + Extensions Enabled**

  + `markdown({ base: markdownLanguage })` enables Table, Strikethrough, TaskList, Subscript, Superscript, Emoji
  + All 87 built-in Lezer highlight tags explicitly mapped to colors
  + 50+ code block token types individually colored for language-specific highlighting

### Previous — v2.0.0: Initial Web Rewrite

* CodeMirror 6 replacing SwiftUI + NSTextStorage
* `src/hanging-indent.ts` — ViewPlugin for wrapped line indentation
* 9 font weight variants, CMD+S save intercept, language-specific code blocks

---

## Architecture Explained

### High-Level Overview

```
┌───────────────────────────────────────────────────────────────┐
│  Browser / PWA Shell                                          │
│  ├─ Service Worker (offline caching via Workbox)              │
│  └─ Web App Manifest (installable PWA)                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Thot App (TypeScript)                                   │ │
│  │  ├─ main.ts                 — App init, event wiring     │ │
│  │  ├─ editor.ts               — CodeMirror setup           │ │
│  │  ├─ persistence.ts          — Content auto-save          │ │
│  │  ├─ state.ts                — Cursor/scroll persistence  │ │
│  │  ├─ highlight-tags.ts       — Custom tags + colors       │ │
│  │  ├─ theme.ts                — HighlightStyle + chrome    │ │
│  │  └─ hanging-indent.ts       — Wrapped line indentation   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  CodeMirror 6                                            │ │
│  │  ├─ @codemirror/lang-markdown    — Markdown parser       │ │
│  │  ├─ @codemirror/language-data    — Code block languages  │ │
│  │  ├─ @codemirror/view             — Editor view layer     │ │
│  │  ├─ @codemirror/state            — Editor state mgmt     │ │
│  │  └─ @lezer/highlight             — Token styling         │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

  1. **CodeMirror 6 over custom editor** — Incremental Lezer parser handles syntax highlighting without full-document scans; virtual scrolling renders only visible lines; battle-tested on massive files
  2. **Web over native** — v1 used SwiftUI + NSTextStorage which flickered at 88+ lines due to reactive re-rendering; web technologies (what VS Code uses) solve this natively
  3. **localStorage over IndexedDB** — Synchronous, simple, fast; sufficient for single-document scratchpad; no permissions needed
  4. **Custom Lezer tags + hybrid styleTags/ViewPlugin** — Built-in Lezer tags can't differentiate bullet vs ordered lists. Custom `Tag.define()` creates unique tags. Simple depth=0 overrides and inherit rules work via styleTags; context-dependent markers (3 cases) use a targeted ViewPlugin because Lezer's `combine()` blocks depth>0 context overrides
  5. **CSS cascade ordering for priority** — `HighlightStyle.define` generates CSS rules in array order. When two classes land on one span (e.g. bold text inside a list), the LATER CSS rule wins. Low priority items go first; high priority items go last

### How It Actually Works

* **Extension ordering in `editor.ts`**

  The extensions array is ordered by priority (lowest first):

  ```
  hangingIndentPlugin         // Line decorations (lowest priority)
  markerDecorations           // ViewPlugin: list markers + inline code marks (3 cases)
  markdown({                  // Language parser with:
    base: markdownLanguage,   //   GFM + extensions (Table, Strikethrough, etc.)
    codeLanguages: languages, //   Language-specific code block highlighting
    extensions: [overrides],  //   styleTags (custom tags for lists, tables, markers)
  })
  keymap.of([...])            // Key bindings including CMD+S
  EditorView.lineWrapping     // Soft wrap at window edge
  thotTheme                   // Theme + HighlightStyle (highest priority)
  updateListener              // Change/state callbacks
  ```

* **Highlighting data flow**

  ```
  highlight-tags.ts → defines custom Tags + colors object (single source of truth)
       ↓
  editor.ts → styleTags assign tags to nodes (depth=0 overrides + inherit rules)
            → ViewPlugin adds CSS classes for 3 context-dependent markers
       ↓
  theme.ts → HighlightStyle maps tags to CSS (cascade order = priority)
           → EditorView.theme defines .thot-* classes (higher specificity)
  ```

* **Save flow**

  ```
  User types → onChange callback → saveContent() (500ms debounce) → localStorage
  User closes tab → beforeunload → forceSave() (immediate) → localStorage
  User switches tab → visibilitychange → forceSave() (immediate) → localStorage
  User presses CMD+S → keymap intercept → forceSave() (immediate) → localStorage
  ```

---

## How to Run & Test Locally

### Prerequisites

  + Node.js (v18+)
  + npm

### Development (daily workflow)

  ```bash
  npm run dev
  ```

  + Vite dev server with Hot Module Replacement
  + Source changes appear instantly in the browser
  + **Use this while editing code**

### Production Build

  ```bash
  npm run build
  ```

  + Runs TypeScript check (`tsc`) then Vite production build
  + Outputs to `dist/` — bundled, minified, with PWA service worker
  + **Must run before `npm run preview`**

### Production Preview

  ```bash
  npm run preview
  ```

  + Serves `dist/` as a static site locally
  + Shows exactly what production deployment will look like
  + **Requires `npm run build` first** — only serves already-built files

### Workflow

  ```
  Edit code → npm run dev (instant feedback)
  Ready to test production? → npm run build && npm run preview
  Service worker caching issues? → Incognito window or Cmd+Shift+R
  ```

---

## File Structure & Key Files

  ```text
  ~/Development/thot/
  ├── index.html                       # Entry point (loads main.ts)
  ├── package.json                     # Dependencies & scripts
  ├── tsconfig.json                    # TypeScript config
  ├── vite.config.ts                   # Vite + PWA plugin config
  │
  ├── src/
  │   ├── main.ts                      # App init, welcome content, event wiring
  │   ├── editor.ts                    # CodeMirror setup, styleTags, extensions
  │   ├── highlight-tags.ts            # Custom Lezer tags + color palette (source of truth)
  │   ├── theme.ts                     # HighlightStyle cascade + editor chrome
  │   ├── persistence.ts               # Content save/load with debounce
  │   ├── state.ts                     # Cursor/scroll save/load
  │   ├── hanging-indent.ts            # ViewPlugin: wrapped line indentation
  │   │
  │   ├── styles/
  │   │   └── main.css                 # @font-face declarations, CSS reset
  │   │
  │   ├── assets/
  │   │   ├── fonts/                   # JetBrains Mono NL (9 variants)
  │   │   └── icons/                   # App icons (various sizes)
  │   │
  │   └── types/
  │       └── index.d.ts               # Type definitions
  │
  ├── public/
  │   └── icons/                       # PWA icons (192, 512, etc.)
  │
  ├── docs/
  │   ├── THOT_APP.md                  # THIS FILE — project reference
  │   ├── archive/
  │   │   ├── v1/                      # v1 SwiftUI documentation
  │   │   └── v2/
  │   │       ├── v2_0_0_UPDATES.md    # Build log & forward-looking roadmap
  │   │       ├── v2_0_0_FEEDBACK.md   # Detailed testing feedback
  │   │       ├── v2_0_8_BUG_REPORT.md # Bug report that triggered v2.0.8
  │   │       ├── v2_0_8_BUG_LOG.md    # Bug-by-bug fix documentation
  │   │       ├── v2_1_4_BUG_REPORT.md # Remaining bugs after v2.0.8
  │   │       └── old-theme-ref.ts     # Archived color reference
  │   ├── images/                      # Reference screenshots
  │   └── favicon-and-other-icons/     # Favicon batches (to be consolidated)
  │
  ├── dist/                            # Build output (gitignored)
  ├── README.md
  └── LICENSE                          # MIT
  ```

### Key Source Files

**`src/main.ts`** — App initialization
  + Loads saved content (or welcome content for first-timers)
  + Creates the CodeMirror editor instance
  + Restores cursor and scroll position
  + Wires up `beforeunload` and `visibilitychange` for force-save

**`src/editor.ts`** — CodeMirror configuration
  + Assembles the extensions array (parser, keymap, theme)
  + `styleTags` overrides: depth=0 marker overrides (HeaderMark, QuoteMark, etc.) and inherit rules (BulletList/..., OrderedList/..., Table/...)
  + Targeted ViewPlugin for 3 context-dependent markers: ListMark in BulletList → gold, ListMark in OrderedList → red, CodeMark in InlineCode → red-orange
  + Uses `base: markdownLanguage` to enable GFM (Tables, Strikethrough, TaskList) + Subscript, Superscript, Emoji
  + CMD+S keymap to intercept browser save and trigger `forceSave()`
  + Exports helper functions: `getContent`, `setContent`, `getCursorPos`, `setCursorPos`, `getScrollTop`, `setScrollTop`

**`src/highlight-tags.ts`** — Custom tags + color definitions (single source of truth)
  + 5 custom Lezer `Tag.define()` tags: `bulletMarkTag`, `orderedMarkTag`, `bulletContentTag`, `orderedContentTag`, `tableTag`
  + Complete `colors` object (~100 entries) organized by category: Editor Chrome, Headings, Emphasis, Code, Links, Lists, Block Elements, Special Syntax, Code Block Tokens, Future Extensions
  + Designed as data source for a future user-customizable theme UI

**`src/theme.ts`** — Visual styling
  + `thotEditorTheme` — Editor chrome (background, cursor, gutters, selection) + `.thot-*` CSS classes for ViewPlugin markers (higher specificity than HighlightStyle)
  + `thotHighlightStyle` — All 87+ Lezer tags mapped to colors, ordered by CSS cascade priority (low priority first, high priority last)
  + Imports all colors and custom tags from `highlight-tags.ts`
  + Exports `thotTheme` (combined array of both)

**`src/hanging-indent.ts`** — Wrapped line indentation
  + ViewPlugin that calculates indent width per visible line
  + Applies `padding-left` / `text-indent` via `Decoration.line()` using `ch` units
  + Handles bullets (`- `), numbers (`1. `), blockquotes (`> `), and plain whitespace

**`src/persistence.ts`** — Content storage
  + `saveContent()` — debounced (500ms) write to `localStorage` key `thot:content`
  + `loadContent()` — synchronous read
  + `forceSave()` — immediate write (for beforeunload, CMD+S)

**`src/state.ts`** — Editor state storage
  + Saves/loads cursor position and scroll offset to `localStorage` key `thot:state`
  + Same debounce/force pattern as persistence

---

## Design System & Styling

### Color Palette

| Element                       | Color   | Font Weight               |
| ----------------------------- | ------- | ------------------------- |
| Background                    | #1a1a1a | —                         |
| Foreground (base text)        | #e6e6e6 | Medium (500)              |
| Headings (marker + content)   | #FF9D00 | ExtraBold (800)           |
| Bold (marker + content)       | #FFD866 | ExtraBold (800)           |
| Italic (marker + content)     | #BF437F | ExtraBoldItalic (800i)    |
| Strikethrough                 | #6272A4 | Thin (100) + line-through |
| Inline code + delimiter       | #F34D3E | Regular (400)             |
| Fenced code delimiter (```)   | #6767fc | Regular (400)             |
| Code block content (fallback) | #8989e3 | Regular (400)             |
| Code language ID              | #F1FA8C | —                         |
| Bullet marker                 | #dfc532 | Bold (700)                |
| Bullet content                | #8aeefb | Regular (400)             |
| Numbered marker               | #ff6b6b | Bold (700)                |
| Numbered content              | #f8a5c2 | Regular (400)             |
| Checkbox                      | #8BE9FD | Regular (400)             |
| Blockquote (marker + content) | #E6DB74 | ThinItalic (100i)         |
| Table (marker + content)      | #e2ff79 | Regular (400)             |
| Horizontal rule               | #93f9c6 | Regular (400)             |
| Link text + markers           | #AB9DF2 | Bold (700)                |
| Link URL                      | #8BE9FD | Regular (400)             |
| Comment                       | #6272A4 | Thin (100) + italic       |

  The full color palette (~100 entries including code block tokens) is defined in `src/highlight-tags.ts`.

### Highlight Hierarchy (Priority Order)

  1. **Strikethrough** — BLEND (applies color + line-through, inherits weight from underlying element)
  2. **Inline code** — FULL (overrides all styling)
  3. **Code block content, checkbox** — BLEND
  4. **Bold, italic** — FULL
  5. **Table** — FULL
  6. **Heading** — FULL
  7. **List content** — FULL
  8. **Blockquote** — FULL
  9. **Foreground** — fallback

### Typography

  + Font family: JetBrains Mono NL (no-ligature variant)
  + Font size: 12px
  + Line height: 1.5
  + Base text weight: Medium (500) — set via `.cm-content { fontWeight: '500' }` in `src/theme.ts`
  + 9 weight variants loaded via @font-face in `src/styles/main.css`

---

## Common Pitfalls & Important Notes

### Things That Look Like Bugs But Aren't

  1. **Indented text (4+ spaces) turns code-block color**
     - This is correct per CommonMark spec — 4 spaces of indent creates a code block
     - With correct code block color (#8989e3 light purple), it looks intentional

  2. **Headings are the same font size as body text**
     - Intentional design choice by the user — headings distinguished by color and weight, not size

### Common Mistakes to Avoid

* **Don't change colors in `theme.ts` — edit `src/highlight-tags.ts` instead**

  + `highlight-tags.ts` is the single source of truth for all colors
  + `theme.ts` imports from it — never define colors directly in `theme.ts`
  + Both `editor.ts` and `theme.ts` import custom tags from `highlight-tags.ts`

* **Don't use `npm run preview` without `npm run build` first**

  + `preview` serves the `dist/` folder — it doesn't build anything
  + Changes won't appear until you rebuild

* **Don't add `@font-face` declarations in `theme.ts`**

  + Font faces go in `src/styles/main.css`
  + `theme.ts` only references font weights by number (100, 400, 500, 700, 800)

### Important Conventions

  + **Extension ordering matters in `editor.ts`** — lowest priority first, theme last
  + **HighlightStyle cascade order matters in `theme.ts`** — later CSS rules win; low priority items first, high priority items last (strikethrough is defined last so it always wins)
  + **styleTags only work at depth=0** — Lezer's `ruleNodeProp.combine()` merges base parser rules with extensions, and the base parser's no-context depth=0 rules always match first, blocking context-based depth>0 overrides. Simple name overrides (e.g. `HeaderMark: tags.heading`) work because at depth=0 the extension replaces the base rule.
  + **ViewPlugin needed for context-dependent markers** — List markers (bullet vs ordered) and inline code marks require walking the parent tree. These are the ONLY cases handled by the ViewPlugin in `editor.ts`; everything else uses styleTags + HighlightStyle.

### Performance Considerations

  + `hanging-indent.ts` and the marker ViewPlugin only process visible lines (`view.visibleRanges`)
  + Most highlighting is handled by Lezer's built-in styleTags system — only 3 marker types need custom tree walking
  + `@codemirror/language-data` loads language parsers lazily (on demand) via dynamic imports

---

## Deployment

**Git branching protocol**
   - `main` — protected, no direct commits, only fast-forward merges
   - `v2-first-thots` — primary dev branch
   - Feature branches: `feat/spell-check`, `feat/counter`, `fix/whatever`
   - Semantic tags: `v2.0.0`, `v2.1.0` once stable
   - Future major phases: `v3-organization`, `v4-ai-customization`

**Documentation discipline**
  - Non-trivial changes should update `docs/THOT_APP.md`
  - Create `docs/CHANGELOG.md` for tracking changes over time
  - Version-specific update docs stay in `docs/archive/v2/`

### Build Process

  ```bash
  npm run build          # TypeScript check + Vite production build
  # Output in dist/
  ```

### Hosting Configuration

  + **Custom domain**: `thots.august.style` (DNS configured)
  + **Platform**: TBD — Vercel (free tier, private repo OK) or GitHub Pages (requires public repo)
  + **Build source**: `dist/` directory from `npm run build`

### Post-Deploy Verification

  1. All markdown elements display correct colors per `src/highlight-tags.ts`
  2. Auto-save works (type, refresh, content persists)
  3. PWA installable (browser shows install prompt)
  4. Works offline after initial load

### Future Updates To New Feature Branches 

* **Use this when `main` exists and you want to fast-forward it to a new branch**

```bash 
git merge --ff-only 
git push origin main v1-project-name # pushes both branches in one command
```

---

## Quick Reference

### CLI Commands

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR                 |
| `npm run build`   | TypeScript check + production build to `dist/` |
| `npm run preview` | Serve `dist/` locally (must build first)       |

### localStorage Keys

| Key            | Contents                         |
| -------------- | -------------------------------- |
| `thot:content` | The markdown document text       |
| `thot:state`   | JSON: `{ cursorPos, scrollTop }` |

### Dependencies

| Package                       | Purpose                            |
| ----------------------------- | ---------------------------------- |
| `codemirror`                  | Base editor                        |
| `@codemirror/lang-markdown`   | Markdown parser                    |
| `@codemirror/language-data`   | Code block language support        |
| `@codemirror/language`        | Syntax highlighting infrastructure |
| `@codemirror/view`            | Editor view layer                  |
| `@codemirror/state`           | Editor state management            |
| `@codemirror/commands`        | Keybindings, history, indent       |
| `@lezer/highlight`            | Token tagging and styling          |
| `@codemirror/lang-javascript` | JS/TS highlighting in code blocks  |
| `@codemirror/lang-html`       | HTML highlighting in code blocks   |
| `@codemirror/lang-css`        | CSS highlighting in code blocks    |
| `@codemirror/lang-python`     | Python highlighting in code blocks |
| `@codemirror/lang-json`       | JSON highlighting in code blocks   |

---

## Changing Colors & Fonts

### How to change a color

All colors live in the `colors` object in `src/highlight-tags.ts`. Find the key for the element you want to change and update its hex value.

**Example**: Change bullet markers from gold to green:
```ts
// src/highlight-tags.ts
bulletMarker: '#50FA7B',   // was '#dfc532'
```

### How to change a font weight or style

Font weights and styles are set in the `HighlightStyle.define()` array in `src/theme.ts`. Find the entry for the tag you want to change.

**Example**: Make blockquote text Regular weight instead of Thin Italic:
```ts
// src/theme.ts — find the blockquote entry in thotHighlightStyle
{ tag: tags.quote, color: colors.blockquote, fontWeight: '400' },
// remove fontStyle: 'italic' and change fontWeight from '100' to '400'
```

### Where to find each element

| Want to change?     | File                    | What to look for                                                               |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| Any color value     | `src/highlight-tags.ts` | `colors.___` key name                                                          |
| Font weight & style | `src/theme.ts`          | Entry in `thotHighlightStyle` array                                            |
| *Marker color       | `src/highlight-tags.ts` | `bulletMarker`, `numberedMarker`, `inlineCode`                                 |
| *Marker font weight | `src/theme.ts`          | `thotEditorTheme` `.thot-...` `bullet-mark`, `number-mark`, `inline-code-mark` |
| Base text size      | `src/theme.ts`          | `fontSize` in `thotEditorTheme` `'&'` rule                                     |
| Line height         | `src/theme.ts`          | `lineHeight` in `thotEditorTheme` `.cm-scroller` rule                          |
| Font family         | `src/theme.ts`          | `fontFamily` in `thotEditorTheme` `.cm-scroller` rule                          |
| Font declarations   | `src/styles/main.css`   | `@font-face` blocks                                                            |

    *Bullet/ordered/inline-code 

### Available font weights

| Weight | Name       | Example usage                       |
| ------ | ---------- | ----------------------------------- |
| 100    | Thin       | Strikethrough, blockquote, comments |
| 200    | ExtraLight | —                                   |
| 300    | Light      | —                                   |
| 400    | Regular    | Most elements (default)             |
| 500    | Medium     | Base text (foreground)              |
| 600    | SemiBold   | —                                   |
| 700    | Bold       | List markers, link text             |
| 800    | ExtraBold  | Headings, bold, italic              |
| 900    | Black      | —                                   |

---

## Related Documentation

- **Build Log & Roadmap**: `docs/archive/v2/v2_0_0_UPDATES.md`
- **Testing Feedback**: `docs/archive/v2/v2_0_0_FEEDBACK.md`
- **v2.0.8 Bug Report**: `docs/archive/v2/v2_0_8_BUG_REPORT.md`
- **v2.0.8 Bug Log (fixes)**: `docs/archive/v2/v2_0_8_BUG_LOG.md`
- **v2.1.4 Bug Report**: `docs/archive/v2/v2_1_4_BUG_REPORT.md`
- **Color Reference (single source of truth)**: `src/highlight-tags.ts`
- **Archived Color Reference**: `docs/archive/v2/old-highlight-theme-references.ts`
- **v1 Challenges**: `docs/archive/v1/OvercomeChallenges.md`

---
*This is the single source of truth for Thot development. Update it when making non-trivial changes.*