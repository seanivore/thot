# Thot v2.0 "First Thots" — Executable Implementation Plan

**Version**: 2.0.0_first-thots
**Date**: February 9, 2026
**Branch**: `v2-first-thots`

---

## Executive Summary

**What we're building**: A web-based markdown scratchpad with IDE-like syntax highlighting, auto-save, and PWA capability for cross-platform use.

**Why web**: After extensive research and a failed native macOS implementation (see `docs/archive/OvercomeChallenges.md`), we determined that:
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
│  │  ├─ main.ts          — App initialization               ││
│  │  ├─ editor.ts        — CodeMirror setup & config        ││
│  │  ├─ persistence.ts   — localStorage/IndexedDB storage   ││
│  │  ├─ theme.ts         — Thot dark theme for CodeMirror   ││
│  │  └─ state.ts         — Cursor, scroll, preferences      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  CodeMirror 6                                           ││
│  │  ├─ @codemirror/lang-markdown   — Markdown parsing      ││
│  │  ├─ @codemirror/view            — Editor view           ││
│  │  ├─ @codemirror/state           — Editor state          ││
│  │  └─ @lezer/highlight            — Syntax highlighting   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Component    | Choice                          | Rationale                                               |
| ------------ | ------------------------------- | ------------------------------------------------------- |
| **Language** | TypeScript                      | Type safety, excellent tooling                          |
| **Editor**   | CodeMirror 6                    | Purpose-built, handles 100K+ lines, incremental parsing |
| **Build**    | Vite                            | Fast dev server, optimized production builds            |
| **Styling**  | CSS (vanilla)                   | No framework needed for single-page app                 |
| **Storage**  | localStorage + IndexedDB        | localStorage for state, IndexedDB for large documents   |
| **PWA**      | Vite PWA plugin                 | Simple PWA setup                                        |
| **Hosting**  | Vercel / Netlify / GitHub Pages | Static hosting, free tier sufficient                    |

---

## File Structure

```
thot/
├── index.html                    # Entry point
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config with PWA
├── public/
│   ├── favicon.ico               # From AppIcon (16x16)
│   ├── apple-touch-icon.png      # From AppIcon (180x180)
│   └── manifest.json             # PWA manifest
├── src/
│   ├── main.ts                   # App entry, initializes editor
│   ├── editor.ts                 # CodeMirror setup
│   ├── theme.ts                  # Thot dark theme
│   ├── persistence.ts            # Save/load content
│   ├── state.ts                  # Cursor/scroll state
│   ├── styles/
│   │   └── main.css              # Global styles, dark theme
│   ├── assets/
│   │   ├── fonts/                # JetBrains Mono (4 variants)
│   │   └── icons/                # App icons (various sizes)
│   └── types/
│       └── index.d.ts            # Type definitions
├── docs/
│   ├── YOUR_THOTS.md             # This document (living spec)
│   ├── archive/                  # v1 documentation for reference
│   │   ├── OvercomeChallenges.md
│   │   ├── v1_BUILD_RESEARCHED.md
│   │   ├── IMPL_v1_DESKPAD.md
│   │   ├── ARCHITECTURE_OVERVIEW.md
│   │   └── TextMateRules.md
│   └── images/                   # UI reference images
├── README.md                     # Updated for v2
└── LICENSE                       # MIT
```

---

## Implementation Phases

### Phase 0: Project Setup
**Status**: 
  - [x] Complete

**Tasks**:
  - [x] 1. Clean up Swift/Xcode files from repository (already done in pivot)
  - [x] 2. Initialize npm project with `package.json`
  - [x] 3. Configure TypeScript (`tsconfig.json`)
  - [x] 4. Configure Vite (`vite.config.ts`)
  - [x] 5. Create basic `index.html`
  - [x] 6. Set up CSS with dark theme base
  - [x] 7. Configure JetBrains Mono as web font

**Dependencies to install**:
```bash
npm init -y
npm install codemirror @codemirror/lang-markdown @codemirror/view @codemirror/state @codemirror/commands @lezer/highlight
npm install -D typescript vite vite-plugin-pwa
```

**Verification**: `npm run dev` starts dev server, shows empty dark page

---

### Phase 1: Basic CodeMirror Editor
**Status**: 
  - [x] Complete

**Tasks**:
  - [x] 1. Create `src/main.ts` with CodeMirror initialization
  - [x] 2. Create `src/editor.ts` with editor configuration
  - [x] 3. Enable markdown language support
  - [x] 4. Configure basic keybindings (Cmd+Z, Cmd+Shift+Z, Cmd+A, etc.)
  - [x] 5. Set JetBrains Mono as editor font

**Key code pattern** (`src/editor.ts`):
```typescript
import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'

export function createEditor(parent: HTMLElement): EditorView {
  return new EditorView({
    extensions: [
      basicSetup,
      markdown(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      history(),
      EditorView.theme({
        '&': { height: '100vh' },
        '.cm-scroller': { fontFamily: 'JetBrains Mono NL, monospace' }
      })
    ],
    parent
  })
}
```

**Verification**: Editor appears, can type markdown, undo/redo works

---

### Phase 2: Thot Dark Theme
**Status**: 
  - [x] Complete

**Tasks**:
  - [x] 1. Create `src/theme.ts` with CodeMirror theme
  - [x] 2. Convert TextMate colors to CodeMirror highlight styles
  - [x] 3. Apply dark background (#1a1a1a)
  - [x] 4. Style cursor, selection, gutters

**Color mapping** (from `ThotMarkdownTheme.json`):
| Element                 | Color            |
| ----------------------- | ---------------- |
| Background              | #1a1a1a          |
| Foreground              | #e6e6e6          |
| Headings                | #FF9D00 (bold)   |
| Bold                    | #FFD866          |
| Italic                  | #8aeefb          |
| Inline code             | #78de8c          |
| Fenced code             | #6767fc          |
| Links                   | #AB9DF2          |
| URLs                    | #8BE9FD          |
| Blockquotes             | #E6DB74 (italic) |
| List markers (bullet)   | #dfc532 (bold)   |
| List markers (numbered) | #ff6b6b (bold)   |
| List content (bullet)   | #5feda4          |
| List content (numbered) | #f8a5c2          |
| Checkboxes              | #50faad          |
| Strikethrough           | #6272A4          |
| Tables                  | #e2ff79          |
| Horizontal rules        | #93f9c6          |
| Comments                | #6272A4 (italic) |

**Key code pattern** (`src/theme.ts`):
```typescript
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const thotHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, color: '#FF9D00', fontWeight: 'bold' },
  { tag: tags.strong, color: '#FFD866', fontWeight: 'bold' },
  { tag: tags.emphasis, color: '#8aeefb', fontStyle: 'italic' },
  { tag: tags.monospace, color: '#78de8c' },
  { tag: tags.link, color: '#AB9DF2' },
  { tag: tags.url, color: '#8BE9FD' },
  { tag: tags.quote, color: '#E6DB74', fontStyle: 'italic' },
  // ... more mappings
])

export const thotTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1a1a1a',
    color: '#e6e6e6'
  },
  '.cm-cursor': { borderLeftColor: '#e6e6e6' },
  '.cm-selectionBackground': { backgroundColor: '#44475a' },
  // ... more styles
})
```

**Verification**: Markdown renders with correct colors matching v1 theme

---

### Phase 3: Persistence
**Status**: 
  - [x] Complete

**Tasks**:
  - [x] 1. Create `src/persistence.ts` for content storage
  - [x] 2. Implement auto-save with debounce (500ms)
  - [x] 3. Load content on startup
  - [x] 4. Handle first-run (welcome content)

**Storage strategy**:
  - **Small documents (<1MB)**: localStorage key `thot:content`
  - **Large documents (>1MB)**: IndexedDB (future enhancement)
  - **State (cursor, scroll)**: localStorage key `thot:state`

**Key code pattern** (`src/persistence.ts`):
```typescript
const CONTENT_KEY = 'thot:content'
const DEBOUNCE_MS = 500

let saveTimeout: number | null = null

export function saveContent(content: string): void {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = window.setTimeout(() => {
    localStorage.setItem(CONTENT_KEY, content)
  }, DEBOUNCE_MS)
}

export function loadContent(): string {
  return localStorage.getItem(CONTENT_KEY) ?? ''
}

export function forceSave(content: string): void {
  if (saveTimeout) clearTimeout(saveTimeout)
  localStorage.setItem(CONTENT_KEY, content)
}
```

**Verification**: Type text, refresh page, text persists

---

### Phase 4: State Persistence
**Status**: 
  - [x] Complete

**Tasks**:
  - [x] 1. Create `src/state.ts` for cursor/scroll state
  - [x] 2. Save cursor position on change
  - [x] 3. Save scroll position on scroll
  - [x] 4. Restore cursor and scroll on load

**Key code pattern** (`src/state.ts`):
```typescript
interface EditorState {
  cursorPos: number
  scrollTop: number
}

const STATE_KEY = 'thot:state'

export function saveState(state: EditorState): void {
  localStorage.setItem(STATE_KEY, JSON.stringify(state))
}

export function loadState(): EditorState | null {
  const saved = localStorage.getItem(STATE_KEY)
  return saved ? JSON.parse(saved) : null
}
```

**Integration with CodeMirror**:
```typescript
// In editor setup
EditorView.updateListener.of((update) => {
  if (update.selectionSet || update.geometryChanged) {
    saveState({
      cursorPos: update.state.selection.main.head,
      scrollTop: view.scrollDOM.scrollTop
    })
  }
})
```

**Verification**: Type at line 50, scroll down, refresh — cursor and scroll position restored

---

### Phase 5: PWA Configuration
**Status**: 
  - [x] Complete

**Tasks**:
  - [x] 1. Create `public/manifest.json` (via vite-plugin-pwa)
  - [x] 2. Configure Vite PWA plugin
  - [x] 3. Generate icons from existing assets (192px added)
  - [x] 4. Add service worker for offline support
  - [x] 5. Test installation on macOS/Chrome

**Manifest** (`public/manifest.json`):
```json
{
  "name": "Thot",
  "short_name": "Thot",
  "description": "A markdown scratchpad with IDE-like highlighting",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#1a1a1a",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Vite config** (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // We use public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2}']
      }
    })
  ]
})
```

**Verification**: Can install as PWA, works offline, appears in dock/Applications

---

### Phase 6: Polish
**Status**: 
  - [ ] Not Started

**Tasks**:
  - [ ] 1. Add keyboard shortcut hints (optional floating UI)
  - [ ] 2. Improve mobile responsiveness
  - [ ] 3. Add "clear content" confirmation dialog
  - [ ] 4. Add subtle save indicator (optional)
  - [ ] 5. Performance audit (Lighthouse)
  - [ ] 6. Final CSS polish

**Optional enhancements** (not blocking):
  - [ ] Word count display
  - [ ] Export to .md file
  - [ ] Import from .md file
  - [ ] Multiple scratchpads (future)

**Verification**: Lighthouse score >90, no console errors, smooth on all devices

---

## Deployment

### GitHub Pages (Free)
```bash
# In vite.config.ts, set base to repo name
# base: '/thot/'

npm run build
# Deploy dist/ to gh-pages branch
```

### Vercel (Free tier)
```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push to main
```

### Custom Domain
  - Point `thot.august.style` to hosting provider
  - Enable HTTPS (automatic on Vercel/Netlify) *must make GitHub repo public if hosting there*

---

## Migration Checklist

**Before starting implementation**:
  - [x] Create `v2-first-thots` branch
  - [x] Archive v1 documentation
  - [x] Copy salvageable assets (fonts, icons, images)
  - [x] Remove Swift source files
  - [x] Remove Xcode project files
  - [x] Update README.md for v2
  - [x] Update .gitignore for Node.js project

**Files to delete**:
```
Sources/Editor/*.swift
Sources/Highlighting/*.swift
Sources/Persistence/*.swift
Sources/Preferences/*.swift
Sources/ThotApp/**
Thot.xcodeproj/
project.yml
```

**Files to keep**:
```
README.md (update)
LICENSE
docs/**
src/assets/fonts/*.ttf
src/assets/icons/*.png
```

---

## Why This Will Work

  1. **CodeMirror 6 handles the hard problems**:
    - Incremental parsing (no full-document scans)
    - Virtual scrolling (only renders visible lines)
    - Efficient updates (minimal DOM manipulation)
    - Battle-tested on massive files

  2. **No framework coordination overhead**:
    - No SwiftUI ↔ AppKit bridging
    - No @Binding state synchronization
    - Direct DOM access when needed

  3. **Web storage is simpler**:
    - localStorage is synchronous and fast
    - No file system permissions needed
    - Works identically across platforms

  4. **One codebase, all platforms**:
    - Desktop: PWA installation
    - Mobile: Same PWA
    - Browser: Just visit the URL

---

## Lessons from v1 (Reference)

From `docs/archive/OvercomeChallenges.md`:

| v1 Problem                          | v2 Solution                         |
| ----------------------------------- | ----------------------------------- |
| NSTextStorage reactive re-rendering | CodeMirror incremental parsing      |
| SwiftUI @Binding coordination       | Direct state management             |
| Full-document regex on keystroke    | Lezer incremental tokenizer         |
| Flickering at 88+ lines             | Virtual viewport rendering          |
| Font caching complexity             | CSS @font-face (browser handles it) |

---

## Document Status

**Last updated**: February 9, 2026
**Author**: Claude (Opus 4.5)
**Status**: Ready for Phase 0

---

## Progress Log

_Update this section as phases complete:_

| Phase | Status      | Date        | Notes                                                |
| ----- | ----------- | ----------- | ---------------------------------------------------- |
| 0     | Complete    | Feb 8, 2026 | npm, Vite, TypeScript, CSS, fonts configured         |
| 1     | Complete    | Feb 8, 2026 | CodeMirror 6 + markdown + keybindings + line numbers |
| 2     | Complete    | Feb 8, 2026 | Full Thot color palette applied                      |
| 3     | Complete    | Feb 8, 2026 | localStorage with debounce + beforeunload save       |
| 4     | Complete    | Feb 8, 2026 | Cursor + scroll position saved/restored              |
| 5     | Complete    | Feb 8, 2026 | PWA manifest + service worker + offline caching      |
| 6     | Not Started | —           | —                                                    |

---

*This document is the source of truth for Thot v2 development. Update it as implementation progresses so it remains an accurate, executable specification.*