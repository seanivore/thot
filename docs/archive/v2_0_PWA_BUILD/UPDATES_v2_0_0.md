# Thot v2.0.0 "First Thots" — Build & Updates Log

**Version**: 2.0.0 "First Thots"
**Created**: February 9, 2026
**Last Updated**: February 13, 2026

---

## Executive Summary

**What we built**: A web-based markdown scratchpad with IDE-like syntax highlighting, auto-save, and PWA capability for cross-platform use.

**Why web**: After extensive research and a failed native macOS implementation (see `docs/archive/v1/OvercomeChallenges.md`), we determined that:
  - SwiftUI + NSTextStorage is architecturally unsuited for responsive text editors
  - VS Code, Cursor, and modern editors use web technologies for exactly this reason
  - CodeMirror 6 solves our highlighting performance problem out of the box
  - PWA gives us "app-like" experience on all platforms from one codebase

**Core user experience**: Open the app → start typing markdown → see instant syntax highlighting → close browser → return later → text is exactly where you left it (including cursor position).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser / PWA Shell                                        │
│  ├─ Service Worker (offline support, caching)               │
│  └─ Web App Manifest (installable PWA)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Thot App (TypeScript)                                  ││
│  │  ├─ main.ts                 — App initialization        ││
│  │  ├─ editor.ts               — CodeMirror setup & config ││
│  │  ├─ persistence.ts          — localStorage storage      ││
│  │  ├─ state.ts                — Cursor/scroll state       ││
│  │  ├─ theme.ts                — Dark theme + highlighting ││
│  │  ├─ markdown-decorations.ts — Context-aware CSS classes ││
│  │  └─ hanging-indent.ts       — Wrapped line indentation  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  CodeMirror 6                                           ││
│  │  ├─ @codemirror/lang-markdown    — Markdown parsing     ││
│  │  ├─ @codemirror/language-data    — Code block languages ││
│  │  ├─ @codemirror/view             — Editor view          ││
│  │  ├─ @codemirror/state            — Editor state         ││
│  │  └─ @lezer/highlight             — Syntax highlighting  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Component    | Choice          | Rationale                                               |
| ------------ | --------------- | ------------------------------------------------------- |
| **Language** | TypeScript      | Type safety, excellent tooling                          |
| **Editor**   | CodeMirror 6    | Purpose-built, handles 100K+ lines, incremental parsing |
| **Build**    | Vite            | Fast dev server, optimized production builds            |
| **Styling**  | CSS (vanilla)   | No framework needed for single-page app                 |
| **Storage**  | localStorage    | Synchronous, fast, no permissions needed                |
| **PWA**      | Vite PWA plugin | Simple PWA setup with service worker                    |

---

## How to Run Locally

### Development (use this while working)

```bash
npm run dev
```

  + Starts Vite dev server with Hot Module Replacement (HMR)
  + Changes to source files appear instantly in the browser
  + No build step needed — Vite serves source files directly
  + **This is what you should use during development**

### Production Build (use to test the final product)

```bash
npm run build
```

  + Runs `tsc` (TypeScript type check) then `vite build`
  + Outputs optimized, bundled files to `dist/`
  + Generates the PWA service worker and manifest
  + **Run this before deploying or when testing PWA behavior**

### Production Preview (use to test the built output)

```bash
npm run preview
```

  + Serves the `dist/` folder as a local static server
  + Shows exactly what users will see in production
  + **Must run `npm run build` first** — preview only serves what's already in `dist/`
  + If you change source files, you must `npm run build` again before `npm run preview` will show the changes
  + The service worker can aggressively cache — use incognito or hard refresh (Cmd+Shift+R) if changes don't appear

### Common Gotcha

  + Changed a file but `npm run preview` shows the old version?
    - You forgot to `npm run build` first
    - Or the service worker cached the old version — try incognito window
  + **Workflow**: Edit code → see changes with `npm run dev` → when satisfied, `npm run build && npm run preview` to verify production

---

## Implementation Phases

### Phase 0: Project Setup — Complete
  - [x] npm project initialized
  - [x] TypeScript configured
  - [x] Vite configured with PWA plugin
  - [x] Basic `index.html` entry point
  - [x] CSS with dark theme base
  - [x] JetBrains Mono NL web font

### Phase 1: Basic CodeMirror Editor — Complete
  - [x] CodeMirror 6 initialization
  - [x] Markdown language support
  - [x] Keybindings (Cmd+Z, Cmd+Shift+Z, etc.)
  - [x] Line numbers and gutter

### Phase 2: Thot Dark Theme — Complete (revised in Phase 7)
  - [x] Editor chrome (background, cursor, selection, gutters)
  - [x] Syntax highlighting via `HighlightStyle`

### Phase 3: Persistence — Complete
  - [x] Auto-save with 500ms debounce
  - [x] Load content on startup
  - [x] Welcome content for first-time users
  - [x] Force save on `beforeunload` and `visibilitychange`

### Phase 4: State Persistence — Complete
  - [x] Cursor position saved/restored
  - [x] Scroll position saved/restored

### Phase 5: PWA Configuration — Complete
  - [x] Web app manifest (via vite-plugin-pwa)
  - [x] Service worker for offline support
  - [x] App icons (192px, 512px)
  - [x] Installable on macOS/Chrome

### Phase 6: Testing & Feedback — Complete
  - [x] Test local host production build on desktop
  - [x] Detail feedback from testing
  - [x] Provide & discuss feedback with agent
  - [x] Integrate feedback tasks and fixes into next phase
  - Detailed results: `docs/archive/v2/v2_0_0_FEEDBACK.md`

### Phase 7: Feedback Fixes — Complete
  - [x] **Theme rewrite** — colors and font weights now match `theme-reference.ts` and feedback hierarchy
  - [x] **Heading markers** — `#` markers now same color as heading text (via `styleTags` override)
  - [x] **Bold/italic markers** — `**`/`*` markers now same color as their content
  - [x] **Blockquote markers** — `>` markers now same color as blockquote text
  - [x] **List differentiation** — bullet markers (gold), numbered markers (red), bullet content (cyan), numbered content (pink)
  - [x] **Code delimiter split** — inline code ticks match inline code color, block code ticks match block code color
  - [x] **Code block language highlighting** — installed `@codemirror/language-data` + 5 language packages; `codeLanguages` enabled
  - [x] **Table highlighting** — tables now show in lime (#e2ff79) via ViewPlugin CSS class
  - [x] **Horizontal rule** — now shows in mint (#93f9c6) via ViewPlugin CSS class
  - [x] **Highlight hierarchy** — `HighlightStyle.define` ordered by priority (strikethrough → inlineCode → bold → italic → heading → list → blockquote → foreground)
  - [x] **Font weights** — 9 font variants declared; ExtraBold (800) for headings/bold, ExtraBoldItalic (800i) for italic, Thin (100) for strikethrough/comments, ThinItalic (100i) for blockquotes, Medium (500) for base text
  - [x] **Font size** — 12px applied
  - [x] **Wrapped line indentation** — `hanging-indent.ts` ViewPlugin maintains indent on wrapped lines
  - [x] **CMD+S intercept** — triggers `forceSave()` instead of opening browser save dialog
  - [x] **New files created**: `src/markdown-decorations.ts`, `src/hanging-indent.ts`

### Phase 8: Document Updates — In Progress
  - [x] This document updated to reflect Phase 7 fixes
  - [x] `docs/THOT_APP.md` filled out as one-stop-shop project reference
  - [ ] Forward-looking roadmap finalized below

---

## Known Limitation (Deferred)

  + **Indented text turning to code color**: Per CommonMark spec, 4+ spaces of indent creates a code block. This is parser behavior, not a theme bug. With correct code block colors (#8989e3 light purple), this will look intentional rather than broken. Deeper fix would require custom parser modification — can revisit in v2.1.0 if still bothersome.

---

## Forward-Looking Items

Everything below is captured from `v2_0_0_FEEDBACK.md` that was NOT addressed in Phase 7. Organized by planned version.

### v2.1.0 — Next Update (No UI Changes)

  1. **Spellcheck**
     - Need to add spellcheck urgently
     - Browser native spellcheck may be simplest (`spellcheck` attribute or CodeMirror extension)

  2. **Counter (Words, Characters, Tokens)**
     - Word count, character count (with spaces), token count
     - Consider placement: status bar, or a "Count" menu that shows all four at once
     - Clicking any count copies that number
     - Updates live

  3. **Auto-wrapping shortcuts**
     - Highlight a word, press `*` and it wraps both sides: `*word*`
     - Press again for `**word**`
     - Same behavior for: `'single quotes'`, `"double quotes"`, `(parentheses)`, `{brackets}`, `` `backticks` ``
     - "This is a feature I use CONSTANTLY"

  4. **CMD+N behavior**
     - Currently opens a new browser window showing duplicate text
     - Needs investigation — should it create a new scratchpad, or be disabled?

  5. **4-space indent code block color** (if still bothersome)
     - CommonMark spec issue, would need custom parser modification

### v2.x — Pre-UI Updates

  6. **Icons cleanup**
     - Duplicate icons in `public/icons/` and `src/assets/icons/`
     - Fresh favicon batch in `docs/favicon-and-other-icons/` (HTML package + Next.js package)
     - Need to consolidate, pick correct set, update `index.html` and manifest references
     - `manifest.json` file noted as missing from `public/`

  7. **Export to simple PDF**
     - Markdown rendered without markup notation
     - Solid text colors, different size for headers
     - No need for fancy spacing or font changes initially

  8. **Print functionality**
     - Print the markdown as you see it in the app
     - Start simple — just the rendered view

  9. **Mobile/iPad responsiveness**
     - No mobile test environment yet
     - iPad is WAY more important than phone
     - Defer until test environment exists

  10. **Clear content / Export / Import / Save / Open**
      - "Clear content" button feels weird
      - "Export" and "Import" are confusing without a save/open plan
      - May make more sense to use native file system tools in SwiftUI wrapper (v3)

### v3.0.0 — SwiftUI Wrapper & UI

  11. **macOS/iOS/iPadOS SwiftUI wrapper**
      - PWA embedded in native SwiftUI shell for App Store
      - Apple T&C allows PWAs if they aren't "clearly just a website"
      - We already have more than that, plus the original SwiftUI attempt proves intent
      - Native benefits: file system access, spellcheck, speech-to-text, haptics, Share sheet, Reminders integration, @date notation for notifications

  12. **Finder-style column navigation UI**
      - Drill-down column panes into notes
      - Configurable "post-it" preview snippets per note
      - Tags (#ProjectTag) for connecting content across notes
      - @mention linking between notes by title

  13. **Preferences UI for highlight colors**
      - User can customize highlight colors
      - "Project themes" — different color schemes per section
      - Would make different drill-down sections immediately recognizable

  14. **Light view / theme**
      - Light mode alternative to the dark theme

  15. **Standard RTF option**
      - For users who don't like markdown
      - Prominent keyboard shortcuts shown where RTF users would click
      - Context menu with formatting hints

  16. **Declarative AI customization**
      - Config files (JSON) defining layout, editor prefs, note metadata
      - AI layer translating natural language to config changes

### v3.0.0 — SwiftUI Wrapper & UI (Phase Breakdown)

The v3 line is a major step: wrapping the PWA in native SwiftUI for App Store distribution and building the multi-note column UI. Here's how the phases could break down logically:

  + **v3.0.0 — SwiftUI PWA Shell**
    - WKWebView wrapper that loads the PWA
    - Native window chrome (title bar, traffic lights)
    - File system access via SwiftUI (save/open .md files replaces localStorage-only model)
    - Native spellcheck integration (may make the v2.1.0 spellcheck implementation moot — worth considering whether to do spellcheck in v2.1.0 as a browser-native quick fix or wait for SwiftUI native)
    - App Store submission (one single-note scratchpad, but native)
    - Target platforms: macOS first, then iPad, then iPhone

  + **v3.1.0 — Multi-Note Foundation**
    - Data model: multiple notes with titles, metadata, tags
    - Storage migration: localStorage single-note → file system or CoreData multi-note
    - Sidebar or basic list view showing all notes
    - Create / delete / rename notes
    - CMD+N creates a new note (fixes the current duplicate-window behavior)

  + **v3.2.0 — Column Navigation UI**
    - Finder-style drill-down columns
    - Configurable "post-it" preview snippets per note
    - Note ordering, pinning, favorites

  + **v3.3.0 — Tags & Linking**
    - #ProjectTag for grouping notes
    - @mention linking between notes by title
    - Auto-generated tag sections in the column view
    - Search across all notes

  + **v3.4.0 — Native Integrations**
    - Share sheet (share to Mail, Messages, etc.)
    - @date notation → Reminders/notifications
    - Speech-to-text input
    - Haptic feedback (iPad)

  + **v3.5.0 — Preferences & Theming**
    - UI for changing highlight colors per element
    - "Project themes" — different color schemes per section/tag
    - Light mode theme
    - Font size / line height preferences

  + **v3.x.0 — RTF Mode**
    - Alternative to markdown for non-markdown users
    - Context menu with prominent keyboard shortcuts
    - Basically reinventing the formatting toolbar as keyboard-first

  + **v4.0.0 — AI Customization**
    - Config files (JSON) defining layout, editor prefs, note metadata
    - Natural language → config changes ("make headings blue", "show word count in the corner")

### Deployment

  17. **Hosting setup**
      - Custom domain DNS ready: `thots.august.style`
      - **Recommendation: Vercel** — free tier supports private repos, auto-deploys from GitHub on push, generous bandwidth, HTTPS automatic on custom domains
      - GitHub Pages requires making the repo public on free tier — not ideal if you're not ready for that
      - Netlify also supports private repos on free tier, but Vercel's DX is slightly better for Vite projects
      - **Bottom line**: Use Vercel, keep the repo private, deploy from `v2-first-thots` (or `main` once you fast-forward merge). No need to go public until you want to

  18. **Git branching protocol**
      - `main` — protected, no direct commits, only fast-forward merges
      - `v2-first-thots` — primary dev branch
      - Feature branches: `feat/spell-check`, `feat/counter`, `fix/whatever`
      - Semantic tags: `v2.0.0`, `v2.1.0` once stable
      - Future major phases: `v3-organization`, `v4-ai-customization`

  19. **Documentation discipline**
      - Non-trivial changes should update `docs/THOT_APP.md`
      - Create `docs/CHANGELOG.md` for tracking changes over time
      - Version-specific update docs stay in `docs/archive/v2/`

---

## Progress Log

| Phase | Status      | Date         | Notes                                                     |
| ----- | ----------- | ------------ | --------------------------------------------------------- |
| 0     | Complete    | Feb 8, 2026  | npm, Vite, TypeScript, CSS, fonts configured              |
| 1     | Complete    | Feb 8, 2026  | CodeMirror 6 + markdown + keybindings + line numbers      |
| 2     | Complete    | Feb 8, 2026  | Initial Thot color palette applied (revised in Phase 7)   |
| 3     | Complete    | Feb 8, 2026  | localStorage with debounce + beforeunload save            |
| 4     | Complete    | Feb 8, 2026  | Cursor + scroll position saved/restored                   |
| 5     | Complete    | Feb 8, 2026  | PWA manifest + service worker + offline caching           |
| 6     | Complete    | Feb 13, 2026 | Testing & feedback documented in v2_0_0_FEEDBACK.md       |
| 7     | Complete    | Feb 13, 2026 | Feedback fixes: theme rewrite, decorations, indent, CMD+S |
| 8     | In Progress | Feb 13, 2026 | Document updates                                          |

---

*This document is the build log for Thot v2.0.0. For the one-stop-shop project reference, see `docs/THOT_APP.md`.*
