# v4.0.0 Implementation Plan

**Feature**: Round-out-the-basics polish pass (10 small bug fixes + UX patches)
**Date**: 2026-05-06
**Branches**: `feat/v4-basics` (cut from `dev`)
**Required reading first**:
  - `docs/THOT_APP.md` — architecture, state, roadmap
  - `README.md` — *needs update*
  - `docs/archive/v4_0/v4_0_0_CLARITY.md` § "Understand Current App State" items 6–10 (source for these fixes)

**Architecture decisions made in planning**: see `v4_0_0_DEV_PLANNING.md` (this directory).

**If you find missing context as you read this**: `THOT_APP.md` is meant to be living. Confirm with Sean and update it; don't paper over the gap inside this document.

**Scope boundary**: This is a polish patch, not a feature release. Any change that touches the highlighter scope model, the proprietary `src/scopes.ts` system, or the formatting UX belongs in v5, not here. If a fix surfaces architectural questions, stop and write `v4_0_1_DEV_PLANNING.md`.

---

## Pre-flight Checklist

Before starting:

- [ ] On `dev` branch, working tree clean.
- [ ] `npm install` completed; `npm run build` succeeds against current `dev`.
- [ ] Vercel deploy unblocked (separate prerequisite — see `v4_0_0_DEV_PLANNING.md` § Surface Vercel deploy block). If Vercel is still blocked, you can still execute and commit; but the preview-deploy verification step below will fail until the block is resolved.
- [ ] Cut working branch: `git checkout dev && git pull origin dev && git checkout -b feat/v4-basics`.

---

## Phase 0 — Pre-flight investigation (three items need root-cause confirmation before edits)

Three of the listed bugs need a 5-minute investigation each before the fix is exclusively executable. Do these first; if the investigation surfaces a different root cause than what's documented here, stop and update this plan.

### 0.1 PWA title-bar `- Thot` duplication
- Inspect: `index.html`, `src/main.ts`, `src/file-system.ts`, and any `document.title = …` assignments across `src/`.
- Confirm: who is appending the second `- Thot`? Likely either (a) `manifest.webmanifest` `name` field combined with PWA window-chrome behavior, or (b) `document.title` being set as `"${docName} - Thot"` while `index.html` already has `<title>Thot</title>` and PWA shell appends app name a second time.
- Output of investigation: a one-line note in this section identifying *the* offending source. Then 0.1 becomes a normal fix in Phase 1.

### 0.2 Frontmatter detection — single hyphen line should not trigger
- Inspect: `src/editor.ts` (line 188 region — `tags.documentMeta` mapping in `thotHighlightStyle`), and `@codemirror/lang-markdown`'s frontmatter parsing rules to confirm whether the parser already requires line-1 anchoring or whether we're inheriting a permissive rule.
- Confirm: is the bug actually the parser tagging single-hyphen lines as `documentMeta`, or is it our cascade picking up the wrong tag? Test with a markdown doc that has a `---` divider mid-document and see if it gets the frontmatter color.
- Decision: if the parser is correctly anchoring to line 1, the only fix needed is the color change in `theme.ts` (frontmatter color → pale yellow, distinct from heading orange `#FF9D00`). If the parser is over-eager, we need a custom override.

### 0.3 Line wrap stops below 1040px viewport
- Confirm: `src/editor.ts:303` already has `EditorView.lineWrapping`, which should make wrap unconditional. Inspect `src/styles/main.css` and any responsive CSS rules that could be setting a `min-width`, `width`, or `white-space: nowrap` on `.cm-content`, `.cm-line`, or `.cm-scroller` at narrow viewports.
- Likely culprit: a media query somewhere setting `white-space: pre` or a fixed width below 1040px. Find it.

---

## Phase 1 — Quick fixes (no investigation needed, ordered by file)

### 1.1 `src/autocorrect.ts` — add `->` → `→`
Append to `AUTOCORRECT_DICTIONARY` (after the existing punctuation block ending around line 130):
```ts
"->": "→",
```
The existing `transactionFilter` + `updateListener` pattern in `customAutocorrect()` will pick it up — `->` already matches the `[a-zA-Z0-9_:-]+` word-boundary regex on line 247 because it contains `-`. Verify by typing `->` followed by space and confirming the arrow appears with normal CMD+Z undo behavior.

### 1.2 `src/theme.ts` — line numbers CSS
Replace the `.cm-lineNumbers .cm-gutterElement` block at lines 66–69:
```ts
'.cm-lineNumbers .cm-gutterElement': {
  width: 'var(--thot-line-number-width, 25px)',
  paddingRight: '5px',
  // alignContent removed — was forcing flex-end which conflicted with the parent flex column
},
```
Sean's CLARITY note specified width 18→25px, remove `alignContent: flex-end`, add `padding-right: 5px`. Tokenize as `--thot-line-number-width` so a future preferences UI can adjust it. Set the CSS custom property default in `src/styles/main.css` `:root` block:
```css
:root {
  --thot-line-number-width: 25px;
}
```

### 1.3 `src/theme.ts` — frontmatter color → pale yellow
Find line 188 (currently `{ tag: tags.documentMeta, color: colors.frontmatter }`). The fix depends on Phase 0.2:
- If 0.2 confirmed the tag mapping is fine and only the color is wrong: update `colors.frontmatter` in `src/highlight-tags.ts` to a pale yellow distinct from heading orange. Suggested: `#F5F0B5` (pale yellow). Verify it's not too close to `colors.bold` (`#FFD866`).
- If 0.2 surfaced a parser issue: add a custom check in the targeted ViewPlugin in `editor.ts` instead, and gate frontmatter highlighting on `from === 0` (line 1 anchor).

### 1.4 `src/highlight-tags.ts` — checked todo `[x]` color
Currently the `tags.list` / task-item color isn't differentiated for completed vs open. Investigate which Lezer tag the `[x]` checkbox carries (it may be `tags.special(tags.atom)` or under the `Task` node). Add a custom tag if needed and a darker-blue color (suggested: `#5A7DB8` — darker than the current `#8BE9FD`). Wire into `theme.ts` `thotHighlightStyle` cascade after the existing checkbox entry.

### 1.5 Paste handler — paste-as-plain-text + smart-quote normalization
Create `src/paste-handler.ts`:
```ts
import { EditorView } from '@codemirror/view'

const SMART_QUOTE_MAP: Record<string, string> = {
  '“': '"',  // "
  '”': '"',  // "
  '‘': "'",  // '
  '’': "'",  // '
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
Wire into `src/editor.ts` extensions array. Position: anywhere before the keymap, after the basic editor features. Add to import block at top:
```ts
import { pastePlainText } from './paste-handler'
```
Insert in extensions array (e.g., after `closeBrackets()` and before `EditorState.languageData.of(...)`).

### 1.6 PWA title-bar deduplication
Implementation depends on Phase 0.1 root cause. Two likely fixes:
- If `document.title` is being set to `"${docName} - Thot"` somewhere: change to set just `docName`. The PWA shell will append the app name itself. (Apply where the assignment lives.)
- If the `manifest.webmanifest` is the second source: leave manifest alone, ensure `document.title` is just `docName`.

Either way, verify by opening a doc named `daily-planner.md` and confirming the window title bar reads `Thot - daily-planner.md` (one suffix, not two).

### 1.7 List formatting bleed onto next line
Investigate `@codemirror/lang-markdown` list-continuation behavior. The bug is: a line *following* a list item inherits list-marker color/weight when it shouldn't. Likely a styleTags `BulletList/...` or `OrderedList/...` inherit rule that's matching one node deeper than intended.

Check `src/editor.ts:191-196`:
```ts
'BulletList/...': bulletContentTag,
'OrderedList/...': orderedContentTag,
```
The `/...` operator matches all descendants. If a paragraph node ends up parsed as a child of `BulletList` (CommonMark allows lazy continuation), it will get the bullet color even if the user intended a new paragraph. Fix: change to `/Paragraph` or a more specific child path so we only style the bullet's text, not arbitrary descendants.

Add a regression test by typing:
```
- one
- two

This should not be cyan.
```
Confirm "This should not be cyan." renders in foreground color.

### 1.8 List blank-line propagation
In CodeMirror's default list-continuation behavior (probably from `indentOnInput` or a markdown-specific helper), pressing Enter on an empty list line currently inserts another bullet. Sean wants: blank line in a list shouldn't propagate the bullet to the next line.

Inspect: is there a custom `Mod-Enter` or `Enter` handler in `src/editor.ts`? If not, the behavior is coming from `@codemirror/lang-markdown`'s `markdownKeymap` (which we may not have explicitly imported). Add a custom Enter handler in the `keymap.of([...])` block in `src/editor.ts` that checks: if cursor is on an empty line that's a child of a list, exit the list (delete the bullet) instead of inserting a new bullet.

If this turns out to require a non-trivial parser-tree walk, defer to v4.0.1 with a `BUGS.md` log — don't ship a half-baked Enter handler.

---

## Phase 2 — Verification

For each fix:
- [ ] Manual test in `npm run dev` (HMR, fast feedback).
- [ ] Production build verifies: `npm run build && npm run preview`.
- [ ] Vercel preview deploy from `feat/v4-basics` (requires Vercel block resolved — see DEV_PLANNING).
- [ ] Confirm no regressions: open the welcome doc in `src/main.ts`, tab through every markdown construct (headings, bullets, numbered lists, blockquotes, code blocks, tables, links), confirm colors and weights match `THOT_APP.md` § Color Palette.

---

## Phase 3 — Ship

When verification passes:
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
Update `package.json` version field from current value to `4.0.0` before merging to main (currently shows `2.1.4` — has been out of sync since v3 work; fix as part of this commit).

Update `docs/THOT_APP.md`:
- "Last Updated" date.
- "Version" line to `v4.0.0`.
- "Recent Changes" section with v4.0.0 entry.

---

## Rollback

Each fix is independent and small. If one regresses:
- Revert the specific commit (each fix should be a separate commit per `Commit Message Standards` in `DEV_RULES`).
- If multiple fixes fail, `git revert` the merge commit on `main` and re-cut from `dev` after fixing.

No data migration, no schema changes — rollback is mechanical.

---

## Cross-references — NOT IN THIS DOC, find here:

- Tech stack summary, glossary, architecture diagrams → `docs/THOT_APP.md`
- Branch / merge / tag protocol → `.agent/DEV_RULES.md` § Git Branching Merging Protocol
- Versioning, file naming → `.agent/DEV_RULES.md` § Versioning & Naming Conventions
- Session document handling → `.agent/DEV_RULES.md` § Session Document Handling
- v5 work (highlighter rebuild, intelligent formatting UX, etc.) → `docs/THOT_APP.md` § Strategic Roadmap, plus `docs/research/1_DEEP/`