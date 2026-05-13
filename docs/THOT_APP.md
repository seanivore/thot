# Thot — Project Reference
`thots.august.style`

**Last Updated**: 2026-05-11
**Version**: v4.1.0 (production); v4.2.0 next (heading stacking)
**Status**: Production deployed (v4.1.0 — URL/anchor CMD+Click). Active living roadmap: `docs/archive/v4_0/v4_0_1_IMPLEMENT.md` — covers v4.0.x polish through vNext strategy, plus a parallel business-plan kickoff track. Workflow at `.agent/DEV_RULES.md` v3.5.0 (four-file taxonomy + Two Operating Modes).

---

## Executive Summary

  + **Purpose**: This document provides everything a new AI instance needs to understand and work on this project effectively; it also serves as comprehensive technical documentation
  + **Use**: Read this first before making any changes, always update this after making changes

---

## Table of Contents

  1. [Project Overview](#project-overview)
  2. [Strategic Roadmap](#strategic-roadmap)
  3. [Recent Changes](#recent-changes)
  4. [Architecture Explained](#architecture-explained)
  5. [How to Run & Test Locally](#how-to-run--test-locally)
  6. [File Structure & Key Files](#file-structure--key-files)
  7. [Design System & Styling](#design-system--styling)
  8. [Common Pitfalls & Important Notes](#common-pitfalls--important-notes)
  9. [Deployment](#deployment)
  10. [Changing Colors & Fonts](#changing-colors--fonts)

---

## Project Overview

### Current State

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

* **Problem**: Existing markdown editors are either simple (no highlighting), expensive, or complex like a full IDEs with irrelevant features 
* **Solution**: A single-purpose scratchpad that opens instantly, highlights beautifully, and never loses your work

  + Open the app, start typing, see instant highlighting
  + Close the browser, come back later, everything is exactly where you left it
  + Install as a PWA for an app-like experience without the App Store

---

## Strategic Roadmap

This section is the high-level "where we're going." The full living roadmap with per-milestone detail lives in `docs/archive/v4_0/v4_0_1_IMPLEMENT.md` (the current master IMPLEMENT). This roadmap section exists so any agent can see the milestone shape without reading the full archive.

### v4.x — Round out the basics

User-experience expectations a modern editor should meet, plus polish on shipped features. No architectural changes.

- **v4.0.0** (in active build) — line-numbers CSS, frontmatter detection tightening, checked-todo color, line-wrap unconditional, paste-as-plain-text + smart-quote normalization, list-styling bleed fix, list-blank-line behavior, `->` → `→` autocorrect, PWA title-bar dedup. Spec: `docs/archive/v4_0/v4_0_1_IMPLEMENT.md` § *Milestone v4.0.x*.
- **v4.1.0** — URL clickability + anchor links. Spec: `docs/archive/v4_0/v4_0_1_IMPLEMENT.md` § *Milestone v4.1.0*.
- **v4.2.0** — Heading stacking feature (sticky-heading scroll behavior). Spec: `docs/archive/v4_0/v4_0_1_IMPLEMENT.md` § *Milestone v4.2.0*.

### v5.0 — Proprietary highlight scope + Intelligent Formatting dual-mode

The moat. Two features ship together because they share infrastructure (the proprietary scope system in `src/scopes.ts`).

- **Proprietary highlight scope rebuild.** Wire `src/scopes.ts` (priority bands, `auto.*` plain-text-mode group, `userCustomizable` flags) into the runtime. Replace the current `theme.ts`'s tags-keyed `HighlightStyle` with a scope-keyed system. Whether Lezer stays underneath as the parser is the open question — see research bucket below.
- **Intelligent Formatting dual-mode UI.** Markdown-visible mode (current) + visual mode (notation hidden via `Decoration.replace`, reappears when cursor enters region). Auto-detection layer: ALL CAPS → emphasis, `:` line endings → section labels, parenthetical asides dimmed, etc. (see `src/scopes.ts` `auto.*` group).
- **Semantic highlighting for non-markdown writers.** The pitch in `CLARITY.md` § Growth — bring IDE-style coloring to writers who never type `#` or `-`. Same scope system, different input shape.

**Research blockers** (active in `docs/research/1_DEEP/`):
- `highlighter-architecture/` — what does "fully ours" mean and what does it cost? (Background agent running.)
- `feature-research/FORMATTING_UX.md` — Sean's narrative description of the dual-mode interface (scaffolded; awaiting fill-in).

### v6.0 — User preferences UI

Once v5's scope system is in place, expose it. Full settings panel: pick the color, weight, and style of every scope. Toggle auto-detect rules on/off per scope. Live preview. The `userCustomizable: true/false` flag in `src/scopes.ts` is the gate.

This is the moment Thot becomes a tool a non-developer would actually customize, which is the prerequisite for the wider audience CLARITY § Growth describes.

### vNext — Strategy phase, not promised

Listed as direction, not commitment. Any of these may slip earlier or later as research closes:

- **Native wrappers** (macOS, iOS, iPadOS, WatchOS) using whichever wrapper approach the research recommends. PWA stays the canonical version; native shells add platform features (Live Activities, Dynamic Island, Apple Pencil annotation, WatchOS dictation, lock-screen widgets, App Intents). Research: `docs/research/1_DEEP/native-wrapper/`.
- **Collaborative document editing.** Multi-user editing on the web app first; OAuth/passkey-first auth. Research: `docs/research/1_DEEP/auth-and-sync/`.
- **`@claude` AI integration.** Inline LLM access — answer questions, sketch functions, confirm API doc currency, content-aware suggestions. Stripe billing-by-token model. Subtle integrations: tab autocompletion, automatic format suggestions, subagent-driven content surfacing.
- **Columns + sticky-note layout.** A workspace UI with multiple document columns and pinnable sticky notes (some AI-populated). Scaffold: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md` (awaiting fill-in).

### Roadmap rules of thumb

- **One IMPLEMENT.md per version** — this roadmap names versions; details live there.
- **Research before promotion** — anything in vNext stays in `docs/research/` until a `final_recommendations.md` closes the bucket.
- **Don't read this section during execution** — IMPLEMENT.md is the source of truth for what to build *now*. This section is for orientation.

---

## Recent Changes

### 2026-05-11 — v4.1.0: URL clickability + anchor links

* **CMD/Ctrl+Click on hyperlinks** — bare URLs and inline `[text](url)` links open in a new tab. Anchor links (`[label](#heading)`) scroll the editor so the matching heading is at the top of the viewport. Plain clicks still place the cursor as normal.
* **Visual affordance** — URLs render with `cursor: pointer` on hover via a new `.thot-url-link` class wired through the `tags.url` HighlightStyle entry.
* **Implementation** — new `src/click-handlers.ts` (`interactiveLinks()`); wired into `editor.ts` extensions array; theme rule added in `theme.ts`.
* **Deferred to vNext** — touch / long-press context menu for mobile; local file path resolution (needs native shell). Spec: `docs/archive/v4_0/v4_1_0_BUILD.md`. Report: `docs/archive/v4_0/BUILD_REPORT_v4_1_0.md`.

### 2026-05-11 — v4.0.0: Round-out-the-basics polish

* **Shipped polish chunk** — line numbers fixed (top-anchored on wrapped lines, 25px stable column for 3-digit line counts), paste-as-plain-text with smart-quote normalization, PWA title-bar deduplication, list Enter on empty bullet exits the list, `package.json` version bump to 4.0.0. Spec: `docs/archive/v4_0/v4_0_0_BUILD.md`. Report: `docs/archive/v4_0/BUILD_REPORT_v4_0_0.md`.

* **Highlight-system polish deferred to v5** — the BUILD attempted three highlight-system fixes (DocumentMeta remap, checked-todo distinct color, list bleed restriction). Investigation surfaced these as deeper symptoms of the current `styleTags + HighlightStyle + ViewPlugin` tri-system's expressiveness limits. Explicit decision: don't fight the current system; v5's proprietary scope rebuild handles all three cleanly. Deviations and side-effects documented in BUILD_REPORT.

* **`->` autocorrect deferred** — dictionary entry added but trigger regex still excludes `>`; the substitution doesn't fire. Filed as v4.0.1 candidate.

* **PWA install prompt** — flagged as v4.0.1 candidate to remove (Thot stays browser-only until native shells in vNext).

### 2026-03-03 — v3.1.2: Single Persistent Main Draftpad

* **Persistence model finalized**
  - On first load with no `?id=` URL parameter, the bootloader sets `?id=main` via `history.replaceState()` and uses `localStorage` key `thot:content:main`
  - Legacy data (old `thot:content` without partition) is silently migrated into `thot:content:main` on first boot, then the legacy key is deleted
  - **CMD+N** opens an ephemeral temp window with `?id=temp-xyz123` (random 6-char). Temp windows do not collide with `main` and closing them doesn't affect the main pad
  - Implementation in `src/main.ts` (bootloader) and `src/file-system.ts:newWindow()`

* **Why this design**: v3.1.1's full multi-window URL partitioning approach broke on macOS Safari, which strips dynamic PWA launch parameters and forces the manifest's base `/` URL on every restart — the bootloader generated infinite new IDs instead of restoring previous windows. The single-`main` default solves this; the partition mechanism is preserved for ephemeral temp windows.

### 2026-03-02 — v3.1.0/v3.1.1: Usability + Autocorrect Engine + Multi-Window Substrate

* **Native usability enhancements**
  - Enabled browser spellcheck via `spellcheck: "true"`
  - Integrated `@codemirror/autocomplete` for `closeBrackets()` paired delimiters
  - Added File System abstraction (`openFile`, `saveFileAs`, `shareDocument`)
  - Polished mobile spacing (bottom 30vh padding, line number fix, share button)

* **Custom Autocorrect Engine** (verified live behaviors per `docs/archive/v3/v3_1_FEEDBACK_2.md`)
  - Built on a `TransactionFilter` plus an async `EditorView.updateListener` that dispatches corrections as separate history events labeled `userEvent: "autocorrect"`, restoring native CMD+Z behavior
  - Local dictionary maps common typos and markdown symbols (`:moon:` → `☽`)
  - Tracks user corrections via a `StateField` so:
    - Immediate Backspace on the trigger char reverts the correction *and* ignores the next attempt
    - CMD+Z undoes the correction but keeps the trigger character
    - Deleting the corrected word and retyping does not re-trigger
    - Deleting an autocorrect-added character ignores subsequent triggers
  - Suppressed inside `InlineCode`, `FencedCode`, `URL`, and `Link` nodes (detected via `syntaxTree` resolution)
  - Auto-Capitalization on sentence starts

* **Multi-window substrate** (v3.1.1, repurposed in v3.1.2)
  - `setPersistenceId(id)` and `setStateId(id)` partition `localStorage` keys per window
  - Originally for full multi-window isolation; now supports the `main` default + temp window pattern

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
  Bootloader → resolves windowId from ?id= URL param (default 'main')
            → setPersistenceId(windowId) configures key 'thot:content:<id>'
            → setStateId(windowId) configures key 'thot:state:<id>'

  User types → onChange callback → saveContent() (500ms debounce) → localStorage
  User closes tab → beforeunload → forceSave() (immediate) → localStorage
  User switches tab → visibilitychange → forceSave() (immediate) → localStorage
  User presses CMD+S → keymap intercept → forceSave() (immediate) → localStorage
  User presses CMD+N → file-system.newWindow() → opens ?id=temp-xyz (ephemeral)
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
  + `setPersistenceId(id)` — configures the storage key as `thot:content:<id>`
  + `saveContent()` — debounced (500ms) write to the configured key
  + `loadContent()` — synchronous read
  + `forceSave()` — immediate write (for beforeunload, CMD+S)

**`src/state.ts`** — Editor state storage
  + `setStateId(id)` — configures the storage key as `thot:state:<id>`
  + Saves/loads cursor position and scroll offset to the configured key
  + Same debounce/force pattern as persistence

**`src/file-system.ts`** — File operations + window spawning
  + `openFile()` — File System Access API where supported, falls back to `<input type="file">` for Safari/iOS
  + `saveFileAs()` — `showSaveFilePicker` with download fallback
  + `newWindow()` — opens a new tab at `?id=temp-<random>` for ephemeral scratch
  + `shareDocument()` — `navigator.share` for PWA share sheet

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

### Git Branching & Merging Protocol

We use a persistent `dev` branch for ongoing development integration, and `main` is strictly reserved for production-ready, tagged releases. 

**Branch Structure:**
*   `main` — Production-ready code only. No direct commits; only fast-forward merges from stable releases.
*   `dev` — The primary integration branch for all ongoing development (replaces phase-specific branches like `v3-rainbow-moat` or `v2-first-thots`).
*   `feat/*` or `fix/*` — Temporary branches for specific features or bug fixes.

**1. Starting a New Feature**
Always branch off the latest `main` to ensure a clean slate:
```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

**2. Update Ready To Ship (Merging to Main)**
When a feature is tested and ready to go live, use this exact 5-step process to ensure tags and remote repositories stay perfectly synced:
```bash
# 1. Move to the production branch
git checkout main

# 2. Fast-forward main to your feature branch state
git merge --ff-only feat/your-feature-name

# 3. Push the clean update to remote main
git push origin main

# 4. Give the clean push a version tag
git tag vX.Y.Z-descriptive-name

# 5. Push the version tag to the remote
git push origin vX.Y.Z-descriptive-name
```

**3. Syncing the Development Branch**
After successfully releasing a feature to `main`, keep `dev` up to date with the latest production state so parallel features don't drift:
```bash
# 1. Switch to the persistent development branch
git checkout dev

# 2. Merge the latest production code into dev
git merge main

# 3. Push the updated dev branch to remote
git push origin dev
```

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

---

## Quick Reference

### CLI Commands

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR                 |
| `npm run build`   | TypeScript check + production build to `dist/` |
| `npm run preview` | Serve `dist/` locally (must build first)       |

### localStorage Keys

| Key                      | Contents                                 |
| ------------------------ | ---------------------------------------- |
| `thot:content:main`      | Main draftpad markdown text              |
| `thot:state:main`        | Main draftpad `{ cursorPos, scrollTop }` |
| `thot:content:temp-<id>` | Ephemeral temp-window text               |
| `thot:state:temp-<id>`   | Ephemeral temp-window state              |

Keys are partitioned by window ID. The default ID is `main` (set on first load if no `?id=` URL parameter). CMD+N spawns a window with `?id=temp-<random>` for ephemeral use.

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

**Most recent state snapshot**: `docs/archive/v4/v3_1_2_CURRENT_STATE.md` — read this for the canonical "where we are right now" view, including what's spec-only vs. shipped, the tag/branch state, and open product questions.

**Versioning convention**: `.agent/UPDATE_DEV_RULES.md` (rewrite ready to drop into `.agent/DEV_RULES.md`) — defines version semantics, filename rules, tag format, and file lifecycle.

---
*This is the single source of truth for Thot development. Update it when making non-trivial changes.*