# v4.1.0 Implementation Plan — Thot

**Date opened**: 2026-05-10
**Status**: Active living roadmap (supersedes `v4_0_1_IMPLEMENT.md`)
**Changes from v4.0.1**: Source-verification corrections to v4.0.x sections (autocorrect comma fix, line-numbers default value, frontmatter mis-tagging re-framed as structural bug, checked-todo re-spec'd as ViewPlugin extension since the parser doesn't tag-differentiate). v4.2.0 milestone rewritten from open-questions framing to a locked, BUILD-ready spec with all 6 design questions answered. Two BUILD packets extracted (`v4_0_0_BUILD.md`, `v4_1_0_BUILD.md`) and referenced by this IMPLEMENT.
**Required reading first**:
  - `docs/THOT_APP.md`
  - `README.md`
  - `.agent/DEV_RULES.md` § *Master Documents → Session document behavior* (only if you're new to the project)

**If you find missing context as you read this**: `docs/THOT_APP.md` is the living architecture/state doc. Confirm the gap with Sean and update `THOT_APP.md`; don't paper over the gap inside this document.

**This document is the entire roadmap for the project.** Each milestone below carries its own detail level. Immediate work (v4.0.x) is exclusively executable — chunks here can be promoted directly to `vX_Y_Z_BUILD.md` packets. Mid-horizon milestones (v4.1, v4.2, v5, v6) carry enough detail that their first session can begin without re-derivation. vNext is direction, not commitment.

---

## Roadmap Overview

| Version                      | Theme                                                  | Ship to            | Status                                     |
| ---------------------------- | ------------------------------------------------------ | ------------------ | ------------------------------------------ |
| **v4.0.x**                   | Round-out-the-basics polish (10 fixes + paste handler) | Internal           | BUILD packet extracted: `v4_0_0_BUILD.md`  |
| **v4.1.0**                   | URL clickability + anchor links                        | Internal           | BUILD packet extracted: `v4_1_0_BUILD.md`  |
| **v4.2.0**                   | Heading stacking (sticky-heading scroll)               | Internal           | Spec locked; ready to promote to BUILD     |
| **v5.0.0**                   | Proprietary highlight scope + dual-mode UI             | Public soft launch | Architecture researched; spec drafting     |
| **v6.0.0**                   | User preferences UI on the v5 scope system             | Public             | Planned                                    |
| **vNext**                    | Native wrappers, collab, AI, columns layout            | Public + App Store | Strategy phase, not promised               |
| **Parallel** *(non-version)* | Business plan kickoff                                  | Internal           | Research consolidated; first session ready |

**Public release line**: Thot does not ship publicly until v5.0 — the moment it becomes a markdown AND normal-text editor with semantic highlighting. v4.x is internal and early-user only.

---

## Milestone v4.0.x — Round-out-the-basics polish

**Branch convention**: cut `feat/v4-basics` from `dev` for the polish chunk.

**Pre-flight (universal):**
- On `dev`, working tree clean.
- `npm install` completed; `npm run build` succeeds.
- Vercel deploy block resolved before tagging (Sean: add `horvathaugust@gmail.com` as verified secondary email on `seanivore` GitHub account; see `processed/v4_0_0_DEV_PLANNING.md` § "Diagnose Vercel deploy block" for the four resolution paths). Local build / merge can proceed without this; only the preview-deploy verification step is gated. --> **NOTE: this was fixed by making the GitHub repo public instead of private, all should be good now**
- `package.json` version is currently `2.1.4` — out of sync since v3. Bump to `4.0.0` as part of the ship commit.

### v4.0.0 — Polish chunk (ready to promote to `v4_0_0_BUILD.md`)

The investigations below were completed in the v4.0.1 planning session (2026-05-10) so this chunk is exclusively executable: every fix has a confirmed root cause and a concrete edit. The two items still carrying confidence caveats (0.3 line-wrap, 1.8 list blank-line) are flagged inline.

#### v4.0.0.1 — Autocorrect: add `->` → `→`

**File**: `src/autocorrect.ts`

`AUTOCORRECT_DICTIONARY`'s current last entry at `:130` is `"(tm)": "™"` with no trailing comma; `:131` closes the dictionary with `}`. Add the trailing comma to `(tm)` and append the new entry. Resulting tail of `AUTOCORRECT_DICTIONARY`:
```ts
  "(c)": "©",
  "(r)": "®",
  "(tm)": "™",
  "->": "→"
}
```
The existing `transactionFilter` + `updateListener` pattern in `customAutocorrect()` picks it up — `->` already matches the `[a-zA-Z0-9_:-]+` word-boundary regex at `autocorrect.ts:247`. Verify by typing `->` followed by space; the arrow should appear with normal CMD+Z undo behavior.

#### v4.0.0.2 — Line-numbers CSS

**Files**: `src/theme.ts`, `src/styles/main.css`

Current state at `theme.ts:66–69`:
```ts
'.cm-lineNumbers .cm-gutterElement': {
  width: '16px',
  alignContent: 'flex-end',
},
```

Tokenize the width as a CSS custom property so the v6 preferences UI can adjust it. The default value stays at `16px` (the current production value):
```ts
'.cm-lineNumbers .cm-gutterElement': {
  width: 'var(--thot-line-number-width, 16px)',
  alignContent: 'flex-end',
},
```

`src/styles/main.css` has no `:root` block today. Add one immediately after the `@font-face` declarations (before the `/* Reset & Base */` block):
```css
:root {
  --thot-line-number-width: 16px;
}
```

#### v4.0.0.3 — Frontmatter triggers in wrong contexts (structural mis-tagging)

**Files**: `src/editor.ts` (markdownStyleOverrides block)

The bug is **structural**, not color-cascade. Per Sean's repro (see `v4_0_1_FEEDBACK.md` lines 137–152, screenshots in `docs/archive/images/frontmatter-random-list-item-insert-{1..6}.jpg`): in a numbered list, hit return for sub-bullet → delete auto-number → type `-` and space → the hyphen renders in the orange/bold frontmatter style. Root cause is `@codemirror/lang-markdown` over-permissively assigning `tags.documentMeta` to bare hyphen lines in list-derived contexts; the parser does NOT anchor frontmatter to line 1 only.

(Note for accuracy: `colors.frontmatter` is currently `#BD93F9` purple at `highlight-tags.ts:84`, not heading orange. The orange/bold visual Sean reports comes from cascade interactions when `documentMeta` mis-tags inside list contexts — *not* from the frontmatter color itself. Recoloring frontmatter would only mask the symptom in some scenarios and leave the structural bug in place.)

**Fix**: remap `documentMeta` away from `colors.frontmatter` entirely in `editor.ts`'s `markdownStyleOverrides` block. The `processingInstruction` tag has its own color (`#6767fc` per `theme.ts:185`) and gives mis-tagged hyphen lines a distinct, less-jarring rendering until the v5 scope rebuild adds proper line-1 anchoring.

In `src/editor.ts` `markdownStyleOverrides.props[0]` (the `styleTags({...})` block, currently at `:162–199`), add:
```ts
// Mid-doc DocumentMeta mis-tagging: route to processingInstruction
// so it doesn't collide with frontmatter color or bold marker styling.
// Proper line-1 anchor lives in v5 scope rebuild.
DocumentMeta: tags.processingInstruction,
```

**Open Sean call (BUILD does NOT block on this)**: Sean may *also* want to recolor `colors.frontmatter` itself for genuine line-1 frontmatter rendering (current `#BD93F9` purple is fine; some users prefer pale yellow `#F5F0B5` or similar). This is a preference, not a fix — flag it in the BUILD report if Sean wants to revisit.

#### v4.0.0.4 — Checked todo `[x]` color

**Files**: `src/highlight-tags.ts`, `src/editor.ts`

Lezer's `@lezer/markdown` GFM extension emits a `TaskMarker` node for `[ ]` and `[x]` alike, both styled as plain `tags.atom` (verified against `node_modules/@lezer/markdown/dist/index.js:2174–2175`). The parser does NOT differentiate checked vs unchecked at the tag level — so a pure `HighlightStyle` entry can't reach this distinction. The fix extends the existing context-dependent `markerDecorations` ViewPlugin in `editor.ts:55–129` (the same plugin that handles list-marker color-by-list-type and inline-code marks).

In `src/highlight-tags.ts`, add a checked-checkbox color near the existing `checkbox` entry at `:62`:
```ts
checkbox: '#8BE9FD',         // Task list [ ] open marker
checkboxChecked: '#5A7DB8',  // Task list [x] completed marker — darker, reads as "done"
```

In `src/editor.ts`, add a decoration constant near the existing marker decos at `:51–53`:
```ts
const checkboxCheckedDeco = Decoration.mark({ attributes: { style: `color: ${colors.checkboxChecked}` } })
```

Then extend `buildMarkerDecorations()` (in the `tree.iterate` enter callback at `:69–99`) with a `TaskMarker` branch that reads the marker's text and decorates only when the content matches `[x]` or `[X]`:
```ts
// Checked task markers — TaskMarker node spans `[ ]` or `[x]` (3 chars);
// only the checked variant gets the darker color
if (node.name === 'TaskMarker') {
  const text = view.state.sliceDoc(node.from, node.to)
  if (text === '[x]' || text === '[X]') {
    decos.push({ from: node.from, to: node.to, deco: checkboxCheckedDeco })
  }
  return
}
```

The open-checkbox `[ ]` continues to render with the existing `colors.checkbox` color via the standard `tags.atom` styleTag mapping (`theme.ts:143`).

**Verify**: type `- [ ] open task` and `- [x] done task` on consecutive lines; the marker brackets/text of the open one should be the existing cyan, the checked one should be the darker blue.

#### v4.0.0.5 — Paste-as-plain-text + smart-quote normalization

**New file**: `src/paste-handler.ts`
**Modified file**: `src/editor.ts`

Create `src/paste-handler.ts`:
```ts
import { EditorView } from '@codemirror/view'

const SMART_QUOTE_MAP: Record<string, string> = {
  '“': '"',  // left double
  '”': '"',  // right double
  '‘': "'",  // left single
  '’': "'",  // right single
}

function normalizeSmartQuotes(text: string): string {
  return text.replace(/[“”‘’]/g, (c) => SMART_QUOTE_MAP[c] || c)
}

export const pastePlainText = EditorView.domEventHandlers({
  paste(event, view) {
    if (!event.clipboardData) return false
    const text = event.clipboardData.getData('text/plain')
    if (!text) return false

    event.preventDefault()
    const normalized = normalizeSmartQuotes(text)
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: normalized },
      selection: { anchor: from + normalized.length },
      userEvent: 'input.paste',
    })
    return true
  }
})
```

Wire into `src/editor.ts`:
```ts
import { pastePlainText } from './paste-handler'
// ...
// in the extensions array, after closeBrackets():
pastePlainText,
```

#### v4.0.0.6 — PWA title-bar `- Thot` deduplication

**File**: `src/file-system.ts`

Root cause confirmed: `index.html` line 20 has `<title>Thot</title>`, and `src/file-system.ts` lines 24, 37, 66 each set `document.title = "${filename} - Thot"`. The PWA shell in standalone mode also auto-appends the manifest `name` field. Result: `"filename - Thot - Thot"`.

**Fix**: in `src/file-system.ts`, change all three assignments to set just the filename:
```ts
// Line 24 (Chrome path):
document.title = file.name
// Line 37 (Safari path):
document.title = file.name
// Line 66 (saveFileAs Chrome):
document.title = fileHandle.name
```
Leave `index.html` `<title>Thot</title>` alone (it's the bootstrap title before any file is loaded).

Verify: open a doc named `daily-planner.md`; window title bar should read `Thot - daily-planner.md` (one suffix, not two).

#### v4.0.0.7 — List formatting bleed onto next line(s)

**File**: `src/editor.ts`

Per Sean's clarified bug (feedback lines 154–178), BOTH cases render in cyan when they shouldn't:
- Case A: `- one\n- two\n\nThis should not be cyan.` → "This should not be cyan." colored cyan.
- Case B (immediate, no blank): `- one\n- two\nThis line should not be cyan.` → also cyan.

Root cause: in `editor.ts` lines 191–194, the styleTags use the deep-inherit `/...` operator:
```ts
'BulletList/...': bulletContentTag,
'OrderedList/...': orderedContentTag,
```
The `/...` operator matches all descendants. CommonMark's lazy continuation makes paragraphs sometimes children of the list node. Restrict to direct list-item paragraphs:

```ts
'BulletList/ListItem/Paragraph': bulletContentTag,
'OrderedList/ListItem/Paragraph': orderedContentTag,
```

Lines parsed as top-level `Paragraph` nodes won't match and will use foreground color.

**Verify** with the two reproductions above; both "This should not be cyan." lines must render in foreground.

#### v4.0.0.8 — List blank-line propagation (defer-able)

**File**: `src/editor.ts`

Per Sean's three quirks (feedback lines 179–209):
1. Single-bullet list: Enter creates next bullet; second Enter currently creates a blank-line + new bullet. Should exit the list (delete marker, plain text below).
2. Multi-item list with manual blank lines: typing Enter after the second item auto-adds a blank line before the new bullet. Should not auto-propagate manual blanks.
3. Desired model: Enter after content = new bullet. Enter on empty bullet = exit list. Manual blanks don't persist as auto-spacing.

Root cause: the markdown extension's bundled list keymap + `indentOnInput` together create the WYSIWYG-flavored continuation. No custom Enter handler exists in `src/editor.ts`.

**Concrete fix** — add an Enter keybinding in the `keymap.of([...])` block in `editor.ts`, before `...defaultKeymap`:
```ts
{
  key: 'Enter',
  run: (view: EditorView) => {
    const { state } = view
    const { head } = state.selection.main
    const line = state.doc.lineAt(head)
    const tree = syntaxTree(state)

    // Walk up to find ListItem context
    let node = tree.resolveInner(head, -1)
    let inListItem = false
    while (node) {
      if (node.name === 'ListItem') {
        inListItem = true
        // Check if list item line is empty (only marker + optional whitespace)
        const itemText = state.doc.sliceString(line.from, line.to).trim()
        if (/^[-*+]\s*$|^\d+\.\s*$/.test(itemText)) {
          // Empty list item — strip the marker, exit list
          view.dispatch({
            changes: { from: line.from, to: line.to, insert: '' },
          })
          return true
        }
        break
      }
      node = node.parent
    }

    return false  // fall through to default Enter behavior (creates new bullet)
  }
},
```

**Confidence**: medium. The custom handler addresses quirks 1 and 3 cleanly. Quirk 2 (multi-item list with manual blanks auto-propagating) may need a separate fix to disable the markdown extension's lazy-continuation behavior — possibly removing or rebinding `indentOnInput`. If that proves entangled with general indent UX, **defer-to-v4.0.1 BUGS off-ramp**: ship the empty-bullet exit (quirk 1+3) in v4.0.0; create `v4_0_1_BUGS.md` with quirk 2 for a follow-on session.

#### v4.0.0.9 — Line wrap stops below 1040px viewport (investigate-and-fix)

**Files**: `src/styles/main.css`, `src/theme.ts`, possibly other CSS sources

`EditorView.lineWrapping` is unconditional in `src/editor.ts:303`, but at viewports under ~1040px text overflows horizontally. Static inspection of `src/styles/main.css` and `src/theme.ts` shows no `white-space` or `min-width` rules that would override wrap. The culprit is likely:
- A media query in a less-obvious file, OR
- A third-party CodeMirror extension's bundled CSS, OR
- A Vite minification artifact.

**BUILD step**: open the dev server, narrow the window below 1040px, open DevTools on `.cm-scroller` / `.cm-content` / `.cm-line` and identify the offending rule. Fix at the source if possible; otherwise add to the end of `thotEditorTheme` in `src/theme.ts`:
```ts
'@media (max-width: 1039px)': {
  '.cm-scroller': {
    whiteSpace: 'pre-wrap !important',
  }
}
```

**Confidence**: 40% on root cause without runtime inspection. The investigate-then-fix is small enough to fit in the v4.0.0 BUILD; do not promote to BUILD without a 5-min DevTools spike noted in the BUILD doc.

#### v4.0.0.10 — `package.json` version bump

Bump `package.json` `version` from `2.1.4` to `4.0.0` as part of the ship commit.

#### v4.0.0 — Verification

For each fix:
- Manual test in `npm run dev` (HMR).
- Production build: `npm run build && npm run preview`.
- Vercel preview deploy from `feat/v4-basics` (requires Vercel block resolved).
- Regression sweep: open `src/main.ts`'s welcome doc, tab through every markdown construct (headings, bullets, numbered lists, blockquotes, code blocks, tables, links, checkboxes); confirm colors and weights match `THOT_APP.md` § Color Palette.

#### v4.0.0 — Ship

```bash
git checkout main
git merge --ff-only feat/v4-basics
git push origin main
git tag v4.0.0
git push origin v4.0.0
git checkout dev
git merge main
git push origin dev
```

Update `docs/THOT_APP.md` "Last Updated", "Version" to `v4.0.0`, and add a Recent Changes entry.

---

## Milestone v4.1.0 — URL clickability + anchor links

**Spec source**: folded in from `processed/FEAT_URLS_ANCHORS.md` (renamed from its draft `v3.2.0` numbering — this is v4.1.0 work).
**Branch convention**: `feat/v4-urls-anchors` from `dev`.
**Status**: spec is exclusively executable; ready to promote to `v4_1_0_BUILD.md` once v4.0.0 ships.

### Goal

CMD/Ctrl+Click on a hyperlink, file path, or markdown anchor link should act on it: URLs open in a new tab, anchor links scroll the editor to the matching heading.

### Scope

1. **Clickable URLs** — `https://...` URLs and complete `[text](https://...)` markdown links open in a new browser tab on CMD/Ctrl+Click. Plain unlinked URLs in text count.
2. **Markdown page anchors** — `[Go to Conclusion](#conclusion)` scrolls the viewport to the heading whose slugified text matches `conclusion`. Both `ATXHeading` (`#`) and `SetextHeading` (underline-style) are supported.
3. **Local file paths** — out of scope for v4.1.0 (deferred until/unless we ship a native shell that can resolve them).

### Implementation

#### v4.1.0.1 — Create `src/click-handlers.ts`

```ts
import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

export const interactiveLinks = () => {
  return EditorView.domEventHandlers({
    mousedown(event, view) {
      // Only act on CMD/Ctrl+Click; bare clicks place the cursor as normal
      if (!event.metaKey && !event.ctrlKey) return false

      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
      if (!pos) return false

      const node = syntaxTree(view.state).resolveInner(pos)

      // Plain URL token (autolink or bare URL)
      if (node.name === 'URL') {
        const urlText = view.state.sliceDoc(node.from, node.to)
        if (urlText.startsWith('#')) {
          handleAnchorClick(urlText, view)
        } else {
          window.open(urlText, '_blank')
        }
        event.preventDefault()
        return true
      }

      // [text](destination) — walk up to Link, find URL child
      if (node.name === 'LinkMark' || node.name === 'LinkTitle' || node.name === 'LinkLabel') {
        const parent = node.parent
        if (parent && parent.name === 'Link') {
          const urlNode = parent.getChild('URL')
          if (urlNode) {
            const urlText = view.state.sliceDoc(urlNode.from, urlNode.to)
            if (urlText.startsWith('#')) {
              handleAnchorClick(urlText, view)
            } else {
              window.open(urlText, '_blank')
            }
            event.preventDefault()
            return true
          }
        }
      }

      return false
    }
  })
}

function handleAnchorClick(anchor: string, view: EditorView) {
  const targetSlug = anchor.slice(1).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  let foundPos = -1

  syntaxTree(view.state).iterate({
    enter(node) {
      if (node.name.includes('Heading')) {
        const headingText = view.state.sliceDoc(node.from, node.to)
        const textOnly = headingText.replace(/^#+\s+/, '').replace(/[\r\n].*$/s, '')
        const slug = textOnly.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (slug === targetSlug) {
          foundPos = node.from
          return false  // stop iteration
        }
      }
    }
  })

  if (foundPos > -1) {
    view.dispatch({
      selection: { anchor: foundPos },
      effects: EditorView.scrollIntoView(foundPos, { y: 'start' })
    })
  }
}
```

#### v4.1.0.2 — Wire into `src/editor.ts`

```ts
import { interactiveLinks } from './click-handlers'
// ...
// in extensions array, near the keymap and other handlers:
interactiveLinks(),
```

#### v4.1.0.3 — Visual feedback (CSS)

In `src/theme.ts`, add a `.thot-url-link` class so URLs render with `cursor: pointer`. Note: pure-CSS detection of "modifier key held" is not reliable — defaulting to pointer cursor on URLs (regardless of modifier) is acceptable given the modifier requirement only governs the click action.

```ts
// in tags.url mapping:
{ tag: tags.url, class: 'thot-url-link' },
// in thotEditorTheme:
'.thot-url-link': { cursor: 'pointer' },
```

### Verification

- Hold CMD/Ctrl + click `https://google.com` → opens new tab.
- Hold CMD/Ctrl + click `[Example](https://example.com)` → opens new tab.
- CMD/Ctrl + click `[Intro](#introduction)` → editor scrolls so `# Introduction` is at top of viewport.
- Plain click on any of the above places the cursor as normal (no nav).
- Verify on Safari (where `metaKey` matters) and Firefox (where `ctrlKey` matters).

### Touch / mobile note (deferred to vNext)

iOS/touch has no concept of CMD+Click. Long-press → context menu with "Open Link" is the canonical mobile pattern. Out of scope for v4.1.0; capture in a `vNext` mobile UX bucket.

---

## Milestone v4.2.0 — Heading stacking (sticky-heading scroll)

**Spec source**: folded in from `processed/FEAT_HEADING_STACK.md` (Sean's narrative + 7 reference screenshots) and locked via the v4.0.1 planning session 2026-05-10.
**Branch convention**: `feat/v4-heading-stack` from `dev`.
**Status**: spec locked; ready to promote to `v4_2_0_BUILD.md`.

### Goal

Replicate the sticky-heading behavior every modern IDE markdown editor has. As the user scrolls down through a long document, the active H1 stays pinned at the top of the viewport. The active H2 stays just below it until replaced by the next H2. The cascade continues for H3 through H6. Result: glancing up always shows the section path you're currently in.

### Why this matters

Per Sean's framing in `FEAT_HEADING_STACK.md` (narrative) and his clarifications in this session: this is a must-have for moving developer-users away from their IDE-based markdown editing, AND it surfaces a UX convenience that non-developer writers don't even know to ask for. The visual model is "the page merges right into the toolbar" — H1 sits flush at the top like a natural extension of the chrome, H2 below it, and so on. Strong differentiator for both audiences.

Reference screenshots: `docs/archive/images/markdown-heading-stack-by-h-type-{1..7}.jpg`.

### Locked design decisions

| #   | Decision                                                                                                                                                                                                                                                                                                   | Source                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Q1  | **Render approach: pure DOM overlay**, appended to the editor's outer DOM, positioned absolutely over the scroller's top edge. NOT the Panel API (designed for static toolbars), NOT `Decoration.widget` (lives in document space and would scroll with content).                                          | This-session research |
| Q2  | **Heading tree maintenance: memoized sorted array**, invalidated only on `update.docChanged`. Per-scroll lookup via linear walk (or binary search) over an array of `{line, level, text, pos}` entries. NOT per-frame `syntaxTree.iterate` (O(N) on every scroll = unacceptable on 100K-line docs).        | This-session research |
| Q3  | **Smooth scroll, no jump.** When the next heading at level N approaches the pinned heading at level N, the pinned heading translates upward by the same delta as the scroll, sliding off-screen exactly as the new heading takes its place. Same trick IDEs use; the handoff looks like continuous scroll. | Sean (2026-05-10)     |
| Q4  | **Line-wrapped heading: show first line only.** The user only needs the section identifier, not the full heading text.                                                                                                                                                                                     | Sean (2026-05-10)     |
| Q5  | **Identical styling to in-document.** Same font, color, weight as the heading renders in the document body. Lines below scroll *under* the pinned overlay. The overlay needs an opaque background (`colors.bg` = `#1a1a1a`) so content sliding underneath is hidden.                                       | Sean (2026-05-10)     |
| Q6  | **60fps on 100K+ lines is non-negotiable.** If the implementation can't hold this, the architecture is wrong — there are heavier features (collab, AI) coming and the perf headroom matters. Profile on a 100K-line synthetic doc before declaring done.                                                   | Sean (2026-05-10)     |

### Files

- **NEW**: `src/sticky-headings.ts` — the `ViewPlugin` and overlay management.
- **MODIFIED**: `src/editor.ts` — one new import, one new entry in the extensions array.
- **MODIFIED**: `src/theme.ts` — overlay container styles in `thotEditorTheme`.
- **MODIFIED**: `src/click-handlers.ts` (from v4.1.0) — extend `interactiveLinks` to handle clicks on overlay headings, scrolling to their first occurrence (matches the anchor-link behavior shipped in v4.1.0). If preferred, the overlay click handler can dispatch the same `EditorView.scrollIntoView` directly without touching `click-handlers.ts`.

### Implementation spec

#### v4.2.0.1 — Create `src/sticky-headings.ts`

```ts
import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import { colors } from './highlight-tags'

type HeadingEntry = { pos: number; line: number; level: 1|2|3|4|5|6; text: string }

class StickyHeadingPlugin {
  headings: HeadingEntry[] = []
  overlay: HTMLDivElement
  view: EditorView

  constructor(view: EditorView) {
    this.view = view
    this.overlay = document.createElement('div')
    this.overlay.className = 'thot-sticky-headings'
    view.dom.appendChild(this.overlay)
    this.rebuildHeadings()
    this.updateStack()
  }

  update(u: ViewUpdate) {
    if (u.docChanged) this.rebuildHeadings()
    if (u.docChanged || u.geometryChanged || u.viewportChanged) this.updateStack()
  }

  destroy() {
    this.overlay.remove()
  }

  // Walk the syntax tree once. Lezer markdown emits ATXHeading1–6 and
  // SetextHeading1–2 (verified node names).
  rebuildHeadings() {
    const arr: HeadingEntry[] = []
    const doc = this.view.state.doc
    syntaxTree(this.view.state).iterate({
      enter: (node) => {
        const m = node.name.match(/^(?:ATX|Setext)Heading([1-6])$/)
        if (m) {
          const line = doc.lineAt(node.from)
          arr.push({
            pos: node.from,
            line: line.number,
            level: parseInt(m[1], 10) as 1|2|3|4|5|6,
            text: line.text.replace(/^#+\s*/, '').split('\n')[0],
          })
        }
      },
    })
    this.headings = arr
  }

  // Compute active heading per level given current scroll position;
  // render overlay; apply translate-Y for smooth handoff.
  updateStack() {
    const view = this.view
    const editorRect = view.dom.getBoundingClientRect()
    const topPos = view.posAtCoords({ x: editorRect.left + 10, y: editorRect.top + 1 })
    if (topPos === null) {
      this.overlay.replaceChildren()
      return
    }
    const topLine = view.state.doc.lineAt(topPos).number

    // Active per level (1..6); deeper levels reset when shallower advances.
    const active: (HeadingEntry | null)[] = [null, null, null, null, null, null]
    let nextSameLevel: (HeadingEntry | null)[] = [null, null, null, null, null, null]
    for (const h of this.headings) {
      if (h.line <= topLine) {
        active[h.level - 1] = h
        for (let i = h.level; i < 6; i++) active[i] = null
      } else {
        // Track the next heading per level for smooth-handoff calculation
        for (let lvl = 1; lvl <= 6; lvl++) {
          if (h.level <= lvl && nextSameLevel[lvl - 1] === null) nextSameLevel[lvl - 1] = h
        }
        // Once we have nextSameLevel[0] (the next H1 or shallower), no point continuing
        if (nextSameLevel[0] !== null) break
      }
    }

    // Render. Reuse existing children where possible to avoid layout thrash.
    this.overlay.replaceChildren()
    let yOffset = 0
    const overlayLineHeight = 22  // matches editor line-height; refined at impl time
    for (let lvl = 0; lvl < 6; lvl++) {
      const h = active[lvl]
      if (!h) continue
      const div = document.createElement('div')
      div.className = `thot-sticky-heading thot-sticky-h${h.level}`
      div.textContent = h.text
      div.style.top = `${yOffset}px`

      // Smooth-handoff: if the next heading of this level is approaching,
      // translate this overlay row upward by the overlap delta.
      const next = nextSameLevel[lvl]
      if (next) {
        const nextCoords = view.coordsAtPos(next.pos)
        if (nextCoords) {
          const nextTopRelative = nextCoords.top - editorRect.top
          const handoffPoint = yOffset + overlayLineHeight
          if (nextTopRelative < handoffPoint) {
            const delta = handoffPoint - nextTopRelative
            div.style.transform = `translateY(${-delta}px)`
          }
        }
      }

      div.addEventListener('mousedown', (e) => {
        e.preventDefault()
        view.dispatch({
          selection: { anchor: h.pos },
          effects: EditorView.scrollIntoView(h.pos, { y: 'start' }),
        })
        view.focus()
      })

      this.overlay.appendChild(div)
      yOffset += overlayLineHeight
    }
  }
}

export const stickyHeadings = ViewPlugin.fromClass(StickyHeadingPlugin)
```

#### v4.2.0.2 — Wire into `src/editor.ts`

Add the import:
```ts
import { stickyHeadings } from './sticky-headings'
```

In the extensions array, add after `interactiveLinks()` (the v4.1.0 entry):
```ts
interactiveLinks(),
stickyHeadings,
```

#### v4.2.0.3 — Theme styles in `src/theme.ts`

Add to `thotEditorTheme` (the `EditorView.theme({...})` block):
```ts
'.thot-sticky-headings': {
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  pointerEvents: 'none',
  zIndex: '5',
},
'.thot-sticky-heading': {
  position: 'absolute',
  left: '0',
  right: '0',
  padding: '0 18px',  // matches editor padding (16px) + small visual breathing room
  backgroundColor: colors.bg,
  fontFamily: '"JetBrains Mono NL", monospace',
  fontWeight: '800',
  color: colors.heading,  // #FF9D00 — same as in-document headings
  fontSize: '12px',
  lineHeight: '22px',  // matches editor line-height
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: 'pointer',
  pointerEvents: 'auto',
  willChange: 'transform',  // promote to its own compositor layer for smooth translateY
},
```

The container has `pointer-events: none` so clicks pass through except where individual heading rows re-enable it. `willChange: transform` keeps the smooth-handoff animation on the GPU.

#### v4.2.0.4 — Performance verification

This is the gate from Q6. Before declaring done:
1. Generate a synthetic 100K-line markdown doc with one heading per ~50 lines (= 2K headings).
2. Open in dev build, scroll continuously top-to-bottom for 30 seconds.
3. Chrome DevTools Performance tab — record. Confirm no scripting tasks > 16ms.
4. If `updateStack` shows up as >16ms tasks: convert the linear walk in `updateStack` to a binary search by `topLine`, and short-circuit the `nextSameLevel` loop earlier. If still slow, debounce `updateStack` to `requestAnimationFrame`.

If profiling shows the architecture cannot hold 60fps even after these optimizations, **stop and surface to Sean** — per Q6, the architecture is wrong if it can't.

### Verification

1. Scroll through a 1000+ line markdown file with H1→H4 nesting. Confirm sticky cascade matches the reference screenshots (`markdown-heading-stack-by-h-type-{1..7}.jpg`).
2. Confirm the smooth-handoff: as a new H1 approaches the pinned H1, the pinned one slides up smoothly; no visible jump.
3. Confirm wrapped headings show the first line only.
4. Confirm headings in the overlay match the in-document heading rendering exactly (color, weight, font).
5. Confirm content scrolls *under* the overlay (overlay has opaque `#1a1a1a` background).
6. Resize window to narrow widths; overlay should not break layout.
7. Click a stacked heading → editor scrolls to that heading's first occurrence.
8. Performance: scroll a 100K-line synthetic doc; record a Chrome Performance trace; confirm no scripting task > 16ms (60fps preserved). See § v4.2.0.4 for the optimization escalation path.

### Subagent groupings (for the v4.2.0 BUILD orchestrator)

This is a small chunk concentrated in `sticky-headings.ts` + `theme.ts` + `editor.ts`. Single orchestrator. The performance-tuning step (§ v4.2.0.4) is the only step that may require multiple iterations; treat it as a serial loop within the orchestrator.

---

## Milestone v5.0.0 — Proprietary highlight scope + Intelligent Formatting dual-mode 

**Spec source**: synthesized from `docs/research/1_DEEP/highlighter-architecture/OPTIONS.md` + `processed/v4_0_0_DEV_PLANNING.md` § Highlighter research.
**Branch convention**: TBD (long-running; likely `feat/v5-scope-rebuild`).
**Status**: architecture researched, recommendation locked; full BUILD spec drafting still ahead.

### The two features ship together because they share infrastructure

Both depend on `src/scopes.ts` (already drafted in the repo: priority bands, `auto.*` plain-text-mode group, `userCustomizable` flags) being wired into the runtime as the new highlight system.

### Architecture decision (locked from research)

**Stay on Lezer**; rewrite the scope/cascade layer cleanly. Do NOT fork `@lezer/markdown` and do NOT write a custom incremental parser — both burn ~3 months for zero user-visible benefit. The defensible moat is the product layer above (dual-mode UX, prose-mode regex highlighter, palette+typography trade dress, customization surface), not the parser underneath.

**Concrete shape:**
- A single `ViewPlugin` walks the syntax tree once per change. It produces decorations keyed off `src/scopes.ts` scope names, not Lezer tags.
- The current `theme.ts` tags-keyed `HighlightStyle` is replaced by a flat scope table; tree nesting handles priority cleanly without `combine()` / CSS-cascade-order trickery.
- The current sidecar ViewPlugin's three special cases (ListMark in BulletList, ListMark in OrderedList, CodeMark in InlineCode) fold into the same walker — they are no longer special.
- A separate **regex-based prose-mode highlighter** runs in parallel for content that doesn't look like markdown (no `#`, `-`, `>`, etc. — just paragraphs of prose). Different scope keys, same surface.

### Intelligent Formatting dual-mode UI

- **Markdown-visible mode** (current behavior): syntax notation visible, fully highlighted.
- **Visual mode**: notation hidden via `Decoration.replace()`; reappears when the cursor enters the region. (e.g., the `*` markers around bold text disappear; click into the bold span and they come back so you can edit them.)
- **Auto-detection layer** (the `auto.*` scope group in `scopes.ts`): ALL CAPS → emphasis, lines ending with `:` → section labels, parenthetical asides dimmed, etc.
- **Mode switching**: explicit (toggle in command palette / preferences) and gestural (TBD — needs research, likely a top-bar control).

### Semantic highlighting for non-markdown writers

This is the v5 pitch in `processed/v4_0_0_CLARITY.md` § Growth: bring IDE-style coloring to writers who never type `#` or `-`. Same scope system, regex-driven inputs.

### Open work before promoting to BUILD

- Sean's narrative in `docs/research/1_DEEP/feature-research/FORMATTING_UX.md` (currently 9 lead-in prompts awaiting fill-in). This is the UX spec input.
- Phase-2 verification of research items flagged `[VERIFY]` in `OPTIONS.md` (WebSearch was unavailable when those were written; vendor/version-specific facts need re-fetch).
- Concrete migration plan for `theme.ts` tags-keyed → scope-keyed (single coordinated swap, or staged with both running in parallel?).
- Test corpus: a documented set of markdown files exercising every Lezer construct + every `auto.*` regex pattern, used to assert visual parity between old and new systems.

---

## Milestone v6.0.0 — User preferences UI

**Spec source**: `processed/FEAT_PREFERENCES.md` (small skeleton) + the `userCustomizable: true/false` flag in `src/scopes.ts`.
**Status**: depends on v5 scope system shipping first.

### Goal

Once v5's scope system is in place, expose it. Full settings panel: pick the color, weight, and style of every scope. Toggle auto-detect rules on/off per scope. Live preview. The `userCustomizable: true/false` flag in `src/scopes.ts` gates which scopes are user-editable.

### Scope (initial spec)

- **Right-click context menu** (extends OS default):
  - Add word to dictionary
  - Create Autocorrect Rule → opens the preferences modal at the Autocorrect Rules section, pre-filling either field depending on whether the selection is in the dictionary.
- **Preferences modal**:
  - **Theme** — color/weight/style per `userCustomizable` scope.
  - **Autocorrect rules** — list with add/edit/delete; the "Type the word you want to autocorrect" / "Type the word you want to autocorrect to" two-field row.
  - **Editor behavior** — line-wrap toggle, line-number visibility, font-size, etc.
  - **Reset to defaults**, **Export/Import preferences**.
- **Persistence** — `localStorage` key `thot:prefs` per the existing window-id partition pattern.

### Open work before promoting to BUILD

- Full UX flow (modal layout, settings hierarchy, live preview surface).
- Decision: native `<dialog>` element vs. custom modal vs. CodeMirror panel.
- Theme preset library (light mode, dark mode, system, plus user themes).

---

## vNext — Strategy phase (not promised)

Direction, not commitment. Any of these may slip earlier or later as research closes.

- **Native wrappers** (macOS, iOS, iPadOS, watchOS) via Capacitor + per-platform features (App Intents, WidgetKit, Live Activities, Dynamic Island, PencilKit overlay above WKWebView for ~9ms ink latency, watchOS as separate native SwiftUI target). Research: `docs/research/1_DEEP/native-wrapper/OPTIONS.md`. Phase order A→B→C→D→E→F documented there.
- **Collaborative document editing** — Yjs + Liveblocks recommended. Auth: Clerk (passkey-first). v1 single-user device sync via Vercel Postgres / Neon, v2 multi-user collab. Research: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md`.
- **`@claude` AI integration** — inline LLM access (answer questions, sketch functions, content-aware suggestions, tab autocompletion, automatic format suggestions). Stripe billing-by-token model.
- **Columns + sticky-note layout** — workspace UI with multiple document columns and pinnable sticky notes (some AI-populated). Scaffold: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md` (awaiting Sean's narrative fill-in).

---

## Parallel Track — Business Plan Kickoff

This is **not a version milestone**; it's a parallel track that runs alongside the version pipeline. Promoting it from "kickoff" to "active" is a Sean-gated decision (see `v4_0_1_FEEDBACK.md` PART 2 — Sean explicitly raised business-plan as an alternative use of this session and a candidate for its own ongoing track).

### Why now

Thot is approaching the public-release line (v5.0). A real business plan — positioning, audience tiers, monetization model, competitive landscape, GTM — needs to be in place before the soft launch, not improvised at it. Sean has noted that the recent shift away from Cursor / Antigravity back to terminal-native AI coding has clarified Thot's positioning specifically, which is signal that the messaging surface is ready to be formalized.

### What exists already

The `docs/research/` and `docs/archive/research/` directories carry significant pre-work:

- **`docs/archive/research/1_DEEP/`** (Sean's original 2026-04 sketch layer, pre-RESEARCH_PROTOCOL): market positioning, collab-for-markdown, AI features, auth-and-accounts, sync-and-cross-device, monetization, native-apps, feature-research. Each bucket has a `1_REVIEW.md` carrying the research-cycle outputs.
- **`docs/research/1_DEEP/`** (current protocol-driven layer): three closed buckets (highlighter-architecture, auth-and-sync, native-wrapper) and two scaffold-awaiting buckets (FORMATTING_UX, COLUMNS_LAYOUT).

These are NOT duplicates — the archive layer is the older sketch material; the active layer is the protocol-driven research that has already been mined for v4–v5 architecture decisions.

### What the kickoff session produces

A first session against this track should produce:

1. A **scope statement** for what "the business plan" actually contains for Thot specifically (positioning, market sizing, audience tiers, monetization, GTM, runway, success metrics).
2. A **gap audit** — what content from the existing research is reusable, what's missing, what needs full RESEARCH_PROTOCOL passes (per `.agent/RESEARCH_PROTOCOL.md`).
3. A **research plan** identifying which buckets need fresh `1_DEEP` work, in what order. Likely candidates: market positioning refresh (post-Cursor/Antigravity shift), competitive analysis (focus on the "markdown editor for prose writers" gap), monetization modeling (free / pro tiers, Stripe billing surface for AI features).
4. A **`docs/BUSINESS_PLAN.md` skeleton** at `docs/` root (per `.agent/DEV_RULES.md` § Non-Archive Doc Directories: end-state business plan lives at `docs/BUSINESS_PLAN.md`, working drafts in `docs/research/`).

### How this track interacts with version work

Independent. The version pipeline (v4.0.x → v4.1 → v4.2 → v5.0) continues regardless. The business-plan track may produce signals that influence v5 messaging or v6 prefs UI ergonomics, but those land via normal IMPLEMENT updates — never as out-of-band patches to in-flight BUILDs.

### How to promote

When Sean is ready, a session can be activated against this track simply by reading this section + the existing research dirs, and starting with the four outputs above. No additional planning derivation needed.

---

## Cross-references — NOT IN THIS DOC, find here:

- Tech stack summary, glossary, architecture diagrams → `docs/THOT_APP.md`
- Color palette, font weights, design system → `docs/THOT_APP.md` § Design System & Styling
- Branch / merge / tag protocol → `.agent/DEV_RULES.md` § Git Branching
- Versioning, file naming, the four file types → `.agent/DEV_RULES.md` § Versioning & Naming Conventions
- BUILD.md role, BUILD_REPORT contract, no-pass-through rule → `.agent/DEV_RULES.md` § BUILD.md and the BUILD_REPORT
- Gap-Finding Loop → `.agent/DEV_RULES.md` § The Gap-Finding Loop
- Implementation research vs. formal research framework → `.agent/DEV_RULES.md` § Research Phase Best Practices and `.agent/RESEARCH_PROTOCOL.md`
- Vercel deploy block resolution paths → `processed/v4_0_0_DEV_PLANNING.md` § Diagnose Vercel deploy block
- v4.0 polish bug clarifications (screenshots and detailed repros) → `v4_0_1_FEEDBACK.md`
- v5 highlighter architecture options → `docs/research/1_DEEP/highlighter-architecture/OPTIONS.md`
- v5 dual-mode UX scaffold → `docs/research/1_DEEP/feature-research/FORMATTING_UX.md` (awaiting Sean's fill-in)
- vNext native wrapper research → `docs/research/1_DEEP/native-wrapper/OPTIONS.md`
- vNext auth/sync/collab research → `docs/research/1_DEEP/auth-and-sync/OPTIONS.md`
- vNext columns layout scaffold → `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md` (awaiting Sean's fill-in)
- Pre-RESEARCH_PROTOCOL business sketches → `docs/archive/research/1_DEEP/`
