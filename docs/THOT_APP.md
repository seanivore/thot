# Thot — Project Reference
`thots.august.style`

**Last Updated**: 2026-02-13
**Version**: v2.0.8
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

### 2026-02-13 — v2.0.8: Complete Highlighting System

* **Highlighting Architecture Rewrite** (replaces previous ViewPlugin approach)

  + Root cause analysis revealed 3 systemic issues: Lezer styleTags depth mismatch, missing GFM parser, and reversed CSS cascade order
  + All highlighting now handled through `styleTags` overrides + `HighlightStyle` cascade — no more ViewPlugin decorations
  + Created `src/highlight-tags.ts` as single source of truth for all colors (~100 entries) and custom Lezer tags
  + Deleted `src/markdown-decorations.ts` (ViewPlugin) — replaced by path-based styleTags at depth=1
  + Moved `src/theme-reference.ts` to `docs/archive/v2/` — superseded by `highlight-tags.ts`

* **8 Bugs Fixed** (see `docs/archive/v2/v2_0_8_BUG_LOG.md`)

  + Bold/italic markers now match their content color (depth=1 path overrides)
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
  4. **Custom Lezer tags + path-based styleTags** — Built-in Lezer tags can't differentiate bullet vs ordered lists. Custom `Tag.define()` creates unique tags; path-based styleTags (`'BulletList/ListItem/ListMark'`) override at depth=1, beating the default depth=0 processingInstruction tag
  5. **CSS cascade ordering for priority** — `HighlightStyle.define` generates CSS rules in array order. When two classes land on one span (e.g. bold text inside a list), the LATER CSS rule wins. Low priority items go first; high priority items go last

### How It Actually Works

* **Extension ordering in `editor.ts`**

  The extensions array is ordered by priority (lowest first):

  ```
  hangingIndentPlugin         // Line decorations (lowest priority)
  markdown({                  // Language parser with:
    base: markdownLanguage,   //   GFM + extensions (Table, Strikethrough, etc.)
    codeLanguages: languages, //   Language-specific code block highlighting
    extensions: [overrides],  //   Path-based styleTags (custom tags for lists, tables)
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
  editor.ts → styleTags overrides assign tags to markdown nodes
       ↓
  theme.ts → HighlightStyle maps tags to CSS (cascade order = priority)
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
  + Comprehensive `styleTags` overrides using path-based matches for all marker/content pairs
  + Uses `base: markdownLanguage` to enable GFM (Tables, Strikethrough, TaskList) + Subscript, Superscript, Emoji
  + Imports custom tags from `highlight-tags.ts` for bullet/ordered list and table differentiation
  + CMD+S keymap to intercept browser save and trigger `forceSave()`
  + Exports helper functions: `getContent`, `setContent`, `getCursorPos`, `setCursorPos`, `getScrollTop`, `setScrollTop`

**`src/highlight-tags.ts`** — Custom tags + color definitions (single source of truth)
  + 5 custom Lezer `Tag.define()` tags: `bulletMarkTag`, `orderedMarkTag`, `bulletContentTag`, `orderedContentTag`, `tableTag`
  + Complete `colors` object (~100 entries) organized by category: Editor Chrome, Headings, Emphasis, Code, Links, Lists, Block Elements, Special Syntax, Code Block Tokens, Future Extensions
  + Designed as data source for a future user-customizable theme UI

**`src/theme.ts`** — Visual styling
  + `thotEditorTheme` — Editor chrome (background, cursor, gutters, selection)
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

| Element                        | Color   | Font Weight               |
| ------------------------------ | ------- | ------------------------- |
| Background                     | #1a1a1a | —                         |
| Foreground (base text)         | #e6e6e6 | Medium (500)              |
| Headings (marker + content)    | #FF9D00 | ExtraBold (800)           |
| Bold (marker + content)        | #FFD866 | ExtraBold (800)           |
| Italic (marker + content)      | #BF437F | ExtraBoldItalic (800i)    |
| Strikethrough                  | #6272A4 | Thin (100) + line-through |
| Inline code + delimiter        | #F34D3E | Regular (400)             |
| Fenced code delimiter (```)    | #6767fc | Regular (400)             |
| Code block content (fallback)  | #8989e3 | Regular (400)             |
| Code language ID               | #F1FA8C | —                         |
| Bullet marker                  | #dfc532 | Bold (700)                |
| Bullet content                 | #8aeefb | Regular (400)             |
| Numbered marker                | #ff6b6b | Bold (700)                |
| Numbered content               | #f8a5c2 | Regular (400)             |
| Checkbox                       | #8BE9FD | Regular (400)             |
| Blockquote (marker + content)  | #E6DB74 | ThinItalic (100i)         |
| Table (marker + content)       | #e2ff79 | Regular (400)             |
| Horizontal rule                | #93f9c6 | Regular (400)             |
| Link text + markers            | #AB9DF2 | Bold (700)                |
| Link URL                       | #8BE9FD | Regular (400)             |
| Comment                        | #6272A4 | Thin (100) + italic       |

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
  + Line height: 1.0
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
  + **styleTags path depth matters in `editor.ts`** — path-based overrides like `'BulletList/ListItem/ListMark'` (depth=1+) beat the default `processingInstruction` (depth=0); this is how markers get colored correctly

### Performance Considerations

  + `hanging-indent.ts` only processes visible lines (`view.visibleRanges`)
  + Highlighting is handled entirely by Lezer's built-in styleTags system — no custom syntax tree walking needed
  + `@codemirror/language-data` loads language parsers lazily (on demand) via dynamic imports

---

## Deployment

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

---

## Quick Reference

### CLI Commands

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR                       |
| `npm run build`   | TypeScript check + production build to `dist/`       |
| `npm run preview` | Serve `dist/` locally (must build first)             |

### localStorage Keys

| Key             | Contents                         |
| --------------- | -------------------------------- |
| `thot:content`  | The markdown document text       |
| `thot:state`    | JSON: `{ cursorPos, scrollTop }` |

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

## Related Documentation

- **Build Log & Roadmap**: `docs/archive/v2/v2_0_0_UPDATES.md`
- **Testing Feedback**: `docs/archive/v2/v2_0_0_FEEDBACK.md`
- **v2.0.8 Bug Report**: `docs/archive/v2/v2_0_8_BUG_REPORT.md`
- **v2.0.8 Bug Log (fixes)**: `docs/archive/v2/v2_0_8_BUG_LOG.md`
- **Color Reference (single source of truth)**: `src/highlight-tags.ts`
- **Archived Color Reference**: `docs/archive/v2/old-highlight-theme-references.ts`
- **v1 Challenges**: `docs/archive/v1/OvercomeChallenges.md`

---
*This is the single source of truth for Thot development. Update it when making non-trivial changes.*