# v4.0.0 Build Packet — Round-out-the-basics polish

**Source**: extracted from `v4_1_0_IMPLEMENT.md` § *Milestone v4.0.x*
**Branch**: `feat/v4-basics` from `dev`
**Required reading first**:
  - `docs/THOT_APP.md`
  - This BUILD doc only — do NOT read prior IMPLEMENTs, BUGS, or BUILD_REPORTs

This BUILD ships 10 fixes plus a paste handler under one branch and tags `v4.0.0`. Phase 0 is a 5-minute DevTools spike (the only investigative step in the packet); every other phase is exclusively executable.

---

## Pre-flight Checklist

- On `dev`, working tree clean.
- Cut feature branch: `git checkout -b feat/v4-basics`
- `npm install` completed; `npm run build` succeeds.
- Vercel deploy block was resolved by making the GitHub repo public; preview deploys should work.

`package.json` version is currently `2.1.4` — out of sync since v3. The bump to `4.0.0` happens in Phase 10 as part of the ship commit (NOT during pre-flight).

---

## Phase 0 — DevTools spike for line-wrap bug (do FIRST)

`EditorView.lineWrapping` is unconditional at `src/editor.ts:303`, but at viewports under ~1040px text overflows horizontally. Static inspection of `src/styles/main.css` and `src/theme.ts` shows no `white-space` or `min-width` rules that override wrap. The culprit is likely a third-party CodeMirror extension's bundled CSS, a media query in a less-obvious file, or a Vite minification artifact.

**Steps:**
1. `npm run dev` and open the local URL.
2. Open DevTools, narrow the window to ~900px.
3. Type a long line (>120 chars without spaces is fastest to repro).
4. Inspect `.cm-scroller`, `.cm-content`, `.cm-line` in the Elements panel and find which rule is overriding `white-space: pre-wrap`.
5. Pick one of the two fix paths:
   - **If the rule is in our code** (theme.ts or main.css): fix it in place. Note location in the BUILD_REPORT.
   - **If the rule is in a node_modules CSS file**: add the override at the end of `thotEditorTheme` in `src/theme.ts`:
     ```ts
     '@media (max-width: 1039px)': {
       '.cm-scroller': {
         whiteSpace: 'pre-wrap !important',
       }
     }
     ```
6. Reload, re-narrow window, confirm wrap engages below 1040px.

If the spike runs longer than 15 minutes, stop and surface to Sean. Don't continue blocking the rest of the BUILD on this — the other 9 fixes are independent.

---

## Phase 1 — Autocorrect: add `->` → `→`

**File**: `src/autocorrect.ts`

The current last entry of `AUTOCORRECT_DICTIONARY` at `:130` is `"(tm)": "™"` with no trailing comma; `:131` closes the dictionary with `}`. Add the trailing comma to `(tm)` and append `->` as the new last entry:

```ts
  "(c)": "©",
  "(r)": "®",
  "(tm)": "™",
  "->": "→"
}
```

**Verify**: type `->` followed by a space; the arrow should appear with normal CMD+Z undo behavior. The existing `transactionFilter` + `updateListener` pattern in `customAutocorrect()` picks it up — `->` matches the `[a-zA-Z0-9_:-]+` word-boundary regex at `autocorrect.ts:247`.

---

## Phase 2 — Line-numbers width tokenized to CSS var

**Files**: `src/theme.ts`, `src/styles/main.css`

`theme.ts:66–69` currently:
```ts
'.cm-lineNumbers .cm-gutterElement': {
  width: '16px',
  alignContent: 'flex-end',
},
```

Replace with:
```ts
'.cm-lineNumbers .cm-gutterElement': {
  width: 'var(--thot-line-number-width, 16px)',
  alignContent: 'flex-end',
},
```

`src/styles/main.css` has no `:root` block today. Add one immediately after the `@font-face` declarations (after line 74, before the `/* Reset & Base */` block on line 76):
```css
:root {
  --thot-line-number-width: 16px;
}
```

**Verify**: line numbers render identically to before in the dev server. Override the CSS var via DevTools console and confirm width changes live.

---

## Phase 3 — Frontmatter mid-doc mis-tagging

**File**: `src/editor.ts`

Bug repro (per `v4_0_1_FEEDBACK.md` lines 137–152, screenshots `docs/archive/images/frontmatter-random-list-item-insert-{1..6}.jpg`): in a numbered list, hit return for sub-bullet → delete auto-number → type `-` and space → the hyphen renders in the orange/bold frontmatter style. Root cause: `@codemirror/lang-markdown` over-permissively assigns `tags.documentMeta` to bare hyphen lines in list-derived contexts; the parser does not anchor frontmatter to line 1 only.

Fix: remap `documentMeta` away from `colors.frontmatter` in the styleTags override block. The `processingInstruction` tag has its own color (`#6767fc`) and gives mis-tagged hyphen lines a less-jarring rendering until v5's scope rebuild adds proper line-1 anchoring.

In `src/editor.ts`, inside `markdownStyleOverrides.props[0]` (the `styleTags({...})` block at `:162–199`), add a new entry — place it near the top of the styleTags object, alongside other tag remaps:

```ts
// Mid-doc DocumentMeta mis-tagging: route to processingInstruction
// so it doesn't collide with frontmatter color or bold marker styling.
// Proper line-1 anchor lives in v5 scope rebuild.
DocumentMeta: tags.processingInstruction,
```

**Verify**: reproduce Sean's bug (numbered list → enter → delete number → type `- `); the hyphen line should now render in `#6767fc` (the `processingInstruction` color), not orange/bold. Genuine line-1 frontmatter (`---\nkey: val\n---`) still renders in `colors.frontmatter` (`#BD93F9` purple).

**Note for BUILD_REPORT**: Sean has an open preference call on whether to *also* recolor `colors.frontmatter` (currently `#BD93F9`) to e.g. pale yellow `#F5F0B5` for genuine line-1 frontmatter. This is preference, not bug fix — flag in the report so he can decide post-ship.

---

## Phase 4 — Checked todo `[x]` distinct color

**Files**: `src/highlight-tags.ts`, `src/editor.ts`

Lezer's `@lezer/markdown` GFM extension emits a `TaskMarker` node for both `[ ]` and `[x]`, both styled as plain `tags.atom` (verified in `node_modules/@lezer/markdown/dist/index.js:2174–2175`). Pure `HighlightStyle` cannot differentiate checked vs unchecked — the fix extends the existing `markerDecorations` ViewPlugin in `editor.ts:55–129` (same plugin handling list-marker color-by-list-type and inline-code marks).

In `src/highlight-tags.ts`, near the existing `checkbox` color at `:62`:
```ts
checkbox: '#8BE9FD',         // Task list [ ] open marker
checkboxChecked: '#5A7DB8',  // Task list [x] completed marker — darker, reads as "done"
```

In `src/editor.ts`, add a decoration constant near the existing marker decos at `:51–53`:
```ts
const checkboxCheckedDeco = Decoration.mark({ attributes: { style: `color: ${colors.checkboxChecked}` } })
```

Extend `buildMarkerDecorations()` — inside the `tree.iterate` enter callback at `:69–99`, after the existing `CodeMark` branch (around `:99`), add:
```ts
// Checked task markers — TaskMarker spans `[ ]` or `[x]` (3 chars);
// only the checked variant gets the darker color
if (node.name === 'TaskMarker') {
  const text = view.state.sliceDoc(node.from, node.to)
  if (text === '[x]' || text === '[X]') {
    decos.push({ from: node.from, to: node.to, deco: checkboxCheckedDeco })
  }
  return
}
```

`colors` is already imported. Add `checkboxChecked` to the destructured `colors` import if you destructure (currently the file imports the whole `colors` object — no change needed there).

**Verify**: type these on consecutive lines:
```
- [ ] open task
- [x] done task
```
Open marker brackets should render in `#8BE9FD` (existing cyan); checked marker brackets should render in `#5A7DB8` (darker blue).

---

## Phase 5 — Paste-as-plain-text + smart-quote normalization

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

Wire into `src/editor.ts`. Add the import near the top (after the existing `customAutocorrect` import at `:15`):
```ts
import { pastePlainText } from './paste-handler'
```

In the extensions array, add `pastePlainText` after `closeBrackets()` (currently at `:223`):
```ts
closeBrackets(),
pastePlainText,
```

**Verify**:
1. Copy text containing curly quotes (e.g. `"hello" 'world'` from a Word doc or web page) and paste into the editor — output should have straight quotes only.
2. Copy a styled HTML snippet (any web text with bold/italic) — paste should drop the styling, only text remains.
3. Cmd+Z on a paste should undo the entire paste in one step.

---

## Phase 6 — PWA title-bar deduplication

**File**: `src/file-system.ts`

Three sites at `:24, :37, :66` currently set `document.title = "${file.name} - Thot"`. The PWA shell in standalone mode auto-appends the manifest `name`, producing `"filename - Thot - Thot"`. Strip the suffix from each assignment.

`file-system.ts:24` (Chrome path):
```ts
document.title = file.name;
```

`file-system.ts:37` (Safari path):
```ts
document.title = file.name;
```

`file-system.ts:66` (saveFileAs Chrome):
```ts
document.title = fileHandle.name;
```

Leave `index.html:20` `<title>Thot</title>` alone (bootstrap title before any file is loaded).

**Verify**: open a doc named `daily-planner.md`; window/tab title reads `Thot - daily-planner.md` (one suffix from the PWA shell, not two).

---

## Phase 7 — List formatting bleed onto next line(s)

**File**: `src/editor.ts`

Bug (per feedback lines 154–178): `- one\n- two\n\nThis should not be cyan.` and `- one\n- two\nThis line should not be cyan.` both render the trailing line in cyan. Root cause: at `editor.ts:191–194`, the styleTags use the deep-inherit `/...` operator:

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

**Verify** with both reproductions above; "This should not be cyan." must render in foreground (`#e6e6e6`) for both Case A and Case B.

---

## Phase 8 — List blank-line / empty-bullet exit

**File**: `src/editor.ts`

Quirks (feedback lines 179–209):
1. Single-bullet list: Enter creates next bullet; second Enter currently creates blank-line + new bullet. Should exit the list (delete marker, plain text below).
2. Multi-item list with manual blank lines: typing Enter after the second item auto-adds a blank line before the new bullet. Should not auto-propagate manual blanks.
3. Desired model: Enter after content = new bullet. Enter on empty bullet = exit list. Manual blanks don't persist as auto-spacing.

This BUILD ships **quirks 1 and 3** via a custom Enter handler. **Quirk 2 has a documented defer-to-BUGS off-ramp** (see end of phase).

In `src/editor.ts`, inside the `keymap.of([...])` block (currently starting at `:245`), add this binding **before** the existing `Mod-s` binding so it runs first:

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
    while (node) {
      if (node.name === 'ListItem') {
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
      const parent: any = (node as any).parent
      if (!parent) break
      node = parent
    }

    return false  // fall through to default Enter behavior (creates new bullet)
  }
},
```

`syntaxTree` is already imported from `@codemirror/language` at `:7`.

**Verify**:
- Type `- one`, hit Enter twice → second Enter strips the marker and leaves a plain line below.
- Type `1. one`, hit Enter twice → same exit behavior.
- Type `- one`, Enter, `- two`, Enter → new `- ` appears as expected (only empty bullets exit).

**Defer-to-BUGS off-ramp for quirk 2**: if Sean tests and the manual-blank auto-propagation behavior is still buggy, do NOT attempt to fix it inside this BUILD. The fix likely entangles with `indentOnInput` and may affect general indent UX. Instead:
1. File the symptom in a new `docs/archive/v4_0/v4_0_1_BUGS.md` (or v4.0.2 BUGS depending on shipping cadence).
2. Note in BUILD_REPORT that quirk 2 was deferred per the IMPLEMENT spec.
3. v4.0.0 still ships with quirks 1 and 3 fixed.

---

## Phase 9 — `package.json` version bump

Bump `package.json:3` from `"version": "2.1.4"` to `"version": "4.0.0"`.

This is the ship-commit step. Leave it as the last code edit before commit/tag.

---

## Phase 10 — Verification & ship

### Verification (run before commit)

1. `npm run dev` — manually exercise each phase's verify steps above.
2. `npm run build && npm run preview` — confirm production build works.
3. Regression sweep: open the welcome doc rendered by `src/main.ts`, tab through every markdown construct (headings, bullets, numbered lists, blockquotes, code blocks, tables, links, checkboxes); confirm colors and weights match `docs/THOT_APP.md` § Color Palette.
4. Vercel preview deploy from `feat/v4-basics`.

### Ship sequence

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

Then update `docs/THOT_APP.md`: bump "Last Updated" to today, "Version" to `v4.0.0`, add a Recent Changes entry summarizing the polish round.

---

## Rollback

Per-phase rollback: `git checkout -- <file>` for the affected file(s). For Phase 5 (new file): also `rm src/paste-handler.ts`. The branch can be discarded entirely with `git checkout dev && git branch -D feat/v4-basics` if catastrophic.

---

## Subagent Groupings (parallel-safe)

These three groups touch disjoint files and can run in parallel as separate subagents under one orchestrator:

- **Group A — single-file fixes** (subagent A): Phase 1 (autocorrect.ts), Phase 6 (file-system.ts), Phase 9 (package.json).
- **Group B — new-file + import** (subagent B): Phase 5 (creates paste-handler.ts; touches editor.ts only via one import + one extension-array entry).
- **Group C — theme + CSS var** (subagent C): Phase 2 (theme.ts widget block + main.css :root).

These four phases must serialize through a single subagent because they all edit `src/editor.ts`'s style/keymap regions:

- **Group D — editor.ts core (sequential, single subagent D)**: Phase 0 (DevTools spike, may require theme.ts edit), Phase 3 (markdownStyleOverrides), Phase 4 (markerDecorations + highlight-tags.ts), Phase 7 (markdownStyleOverrides), Phase 8 (keymap).

Phase 0 (DevTools spike) gates Group C only if its fix lands in `theme.ts`; Group A/B/D are independent.

Phase 10 (ship) is orchestrator-only — never delegated.

---

## What to write to `BUILD_REPORT_v4_0_0.md` when done

- **What changed** (file-by-file, one-line summaries).
- **What deviated from this BUILD** (anything decided differently and why; ideally empty).
- **Phase 0 outcome** — exact rule that was overriding `white-space`, and which fix path was chosen.
- **Quirk 2 status** — fixed in this BUILD, or deferred to v4.0.1 BUGS?
- **Sean's frontmatter color preference** — flagged for his decision (Phase 3 note).
- **Verification results** — which phases passed manual + production-build sweep, which (if any) untested.
