# Thot — Project Reference
`thots.august.style`

**Last Updated**: 2026-02-13
**Version**: v2.0.0 "First Thots"
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

### 2026-02-13 — Phase 7 Feedback Fixes

* **Theme Rewrite**

  + Complete rewrite of `src/theme.ts` matching `src/theme-reference.ts`
  + All markdown markers now share color with their content (# same as heading, ** same as bold, etc.)
  + Bullet vs numbered lists now have distinct colors
  + Inline code ticks vs block code ticks now differentiated
  + Highlight hierarchy properly ordered (strikethrough → inlineCode → bold → italic → heading → list → blockquote → foreground)

* **New Plugins**

  + `src/markdown-decorations.ts` — ViewPlugin for context-aware CSS classes on list types, code types, tables, HRs, checkboxes
  + `src/hanging-indent.ts` — ViewPlugin for maintaining indentation on wrapped lines

* **Font & Input**

  + 9 font weight variants declared (Thin, Regular, Medium, Bold, ExtraBold + italics)
  + Font weights applied per element type (800 for headings/bold, 100 for strikethrough, etc.)
  + CMD+S now triggers auto-save instead of browser save dialog
  + Code blocks support language-specific highlighting via `@codemirror/language-data`

---

## Architecture Explained

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser / PWA Shell                                        │
│  ├─ Service Worker (offline caching via Workbox)            │
│  └─ Web App Manifest (installable PWA)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Thot App (TypeScript)                                  ││
│  │  ├─ main.ts                 — App init, event wiring    ││
│  │  ├─ editor.ts               — CodeMirror setup          ││
│  │  ├─ persistence.ts          — Content auto-save         ││
│  │  ├─ state.ts                — Cursor/scroll persistence ││
│  │  ├─ theme.ts                — Colors + font weights     ││
│  │  ├─ markdown-decorations.ts — Context-aware CSS classes ││
│  │  └─ hanging-indent.ts       — Wrapped line indentation  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  CodeMirror 6                                           ││
│  │  ├─ @codemirror/lang-markdown    — Markdown parser      ││
│  │  ├─ @codemirror/language-data    — Code block languages ││
│  │  ├─ @codemirror/view             — Editor view layer    ││
│  │  ├─ @codemirror/state            — Editor state mgmt    ││
│  │  └─ @lezer/highlight             — Token styling        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

  1. **CodeMirror 6 over custom editor** — Incremental Lezer parser handles syntax highlighting without full-document scans; virtual scrolling renders only visible lines; battle-tested on massive files
  2. **Web over native** — v1 used SwiftUI + NSTextStorage which flickered at 88+ lines due to reactive re-rendering; web technologies (what VS Code uses) solve this natively
  3. **localStorage over IndexedDB** — Synchronous, simple, fast; sufficient for single-document scratchpad; no permissions needed
  4. **ViewPlugin decorations for list/code context** — CodeMirror's `styleTags` can't differentiate bullet vs numbered lists or inline vs block code; a ViewPlugin walks the syntax tree and applies CSS classes that the theme styles
  5. **Highlight hierarchy via HighlightStyle ordering** — First-match-wins in `HighlightStyle.define`; bold/italic override list content colors; inline code overrides everything; strikethrough blends with existing weight

### How It Actually Works

* **Extension ordering in `editor.ts`**

  The extensions array is ordered by priority (lowest first):

  ```
  hangingIndentPlugin      // Line decorations (lowest priority)
  markdownDecorations      // Inline decorations (CSS classes)
  markdown({ ... })        // Language parser with styleTags overrides
  keymap.of([...])         // Key bindings including CMD+S
  EditorView.lineWrapping  // Soft wrap at window edge
  thotTheme                // Theme + HighlightStyle (highest priority)
  updateListener           // Change/state callbacks
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
  │   ├── editor.ts                    # CodeMirror setup, extensions, keymaps
  │   ├── theme.ts                     # Colors, font weights, CSS classes
  │   ├── theme-reference.ts           # Color reference (not imported at runtime)
  │   ├── persistence.ts               # Content save/load with debounce
  │   ├── state.ts                     # Cursor/scroll save/load
  │   ├── markdown-decorations.ts      # ViewPlugin: list/code/table CSS classes
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
  │   │       └── v2_0_0_FEEDBACK.md   # Detailed testing feedback
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
  + Assembles the extensions array (plugins, parser, keymap, theme)
  + Custom `styleTags` overrides: HeaderMark → heading, Emphasis → emphasis, StrongEmphasis → strong, QuoteMark → quote
  + Enables `codeLanguages` from `@codemirror/language-data` for fenced code blocks
  + CMD+S keymap to intercept browser save and trigger `forceSave()`
  + Exports helper functions: `getContent`, `setContent`, `getCursorPos`, `setCursorPos`, `getScrollTop`, `setScrollTop`

**`src/theme.ts`** — Visual styling
  + `thotEditorTheme` — Editor chrome (background, cursor, gutters, selection) + CSS classes for ViewPlugin decorations
  + `thotHighlightStyle` — Syntax token colors and font weights, ordered by hierarchy priority
  + Exports `thotTheme` (combined array of both)

**`src/markdown-decorations.ts`** — Context-aware highlighting
  + ViewPlugin that walks the Lezer syntax tree
  + Differentiates: bullet vs numbered list markers/content, inline vs block code marks, tables, HRs, checkboxes
  + Applies CSS classes (`.thot-bullet-mark`, `.thot-number-mark`, etc.) styled in the theme

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

### Reference File

**`src/theme-reference.ts`** — Color & font reference
  + Not imported at runtime; exists as documentation
  + Canonical source for the Thot color palette (ported from ThotMarkdownTheme.json)
  + `theme.ts` should always match this file's color values

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
| Block code delimiter + content | #8989e3 | Regular (400)             |
| Code language ID               | #F1FA8C | —                         |
| Bullet marker                  | #dfc532 | Regular (400)             |
| Bullet content                 | #8aeefb | Regular (400)             |
| Numbered marker                | #ff6b6b | Regular (400)             |
| Numbered content               | #f8a5c2 | Regular (400)             |
| Checkbox                       | #8BE9FD | Regular (400)             |
| Blockquote (marker + content)  | #E6DB74 | ThinItalic (100i)         |
| Table (marker + content)       | #e2ff79 | Regular (400)             |
| Horizontal rule                | #93f9c6 | Regular (400)             |
| Link text                      | #AB9DF2 | Bold (700)                |
| Link URL                       | #8BE9FD | Italic (400i)             |
| Comment                        | #6272A4 | Thin (100) + italic       |

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

* **Don't change theme colors without updating `src/theme-reference.ts` first**

  + `theme-reference.ts` is the canonical color source
  + `theme.ts` should always match it
  + Previous agents changed colors without updating the reference, causing drift

* **Don't use `npm run preview` without `npm run build` first**

  + `preview` serves the `dist/` folder — it doesn't build anything
  + Changes won't appear until you rebuild

* **Don't add `@font-face` declarations in `theme.ts`**

  + Font faces go in `src/styles/main.css`
  + `theme.ts` only references font weights by number (100, 400, 500, 700, 800)

### Important Conventions

  + **Extension ordering matters in `editor.ts`** — lowest priority first, theme last
  + **HighlightStyle ordering matters in `theme.ts`** — first match wins; higher priority elements go first
  + **ViewPlugin CSS classes** have lower specificity than HighlightStyle — this is intentional so that inline code, bold, etc. override list content colors

### Performance Considerations

  + `markdown-decorations.ts` and `hanging-indent.ts` only process visible lines (`view.visibleRanges`)
  + The syntax tree is walked once per update, not on every keystroke
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

  1. All markdown elements display correct colors per theme-reference.ts
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
- **Color Reference**: `src/theme-reference.ts`
- **v1 Challenges**: `docs/archive/v1/OvercomeChallenges.md`

---
*This is the single source of truth for Thot development. Update it when making non-trivial changes.*