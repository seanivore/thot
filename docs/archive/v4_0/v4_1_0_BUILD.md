# v4.1.0 Build Packet — URL clickability + anchor links

**Source**: extracted from `v4_1_0_IMPLEMENT.md` § *Milestone v4.1.0*
**Branch**: `feat/v4-urls-anchors` from `dev` (cut AFTER `v4.0.0` ships and `dev` is rebased onto the new `main`)
**Required reading first**:
  - `docs/THOT_APP.md`
  - This BUILD doc only — do NOT read prior IMPLEMENTs, BUGS, or BUILD_REPORTs

CMD/Ctrl+Click on a hyperlink, file path, or markdown anchor link should act on it: URLs open in a new tab, anchor links scroll the editor to the matching heading. Local file paths are out of scope (deferred until/unless we ship a native shell that can resolve them).

---

## Pre-flight Checklist

- v4.0.0 has shipped, `main` is at `v4.0.0`, `dev` rebased onto new `main`.
- Working tree clean on `dev`.
- Cut feature branch: `git checkout -b feat/v4-urls-anchors`
- `npm install` already done (no new dependencies).

---

## Phase 1 — Create `src/click-handlers.ts`

Lezer node names verified against `node_modules/@lezer/markdown/dist/index.js` (lines 65–83): `URL`, `Link`, `LinkMark`, `LinkTitle`, `LinkLabel` all emitted. Heading nodes are `ATXHeading1–6` and `SetextHeading1–2`, all matched by `node.name.includes('Heading')`.

Create `src/click-handlers.ts`:
```ts
import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

export const interactiveLinks = () => {
  return EditorView.domEventHandlers({
    mousedown(event, view) {
      // Only act on CMD/Ctrl+Click; bare clicks place the cursor as normal
      if (!event.metaKey && !event.ctrlKey) return false

      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
      if (pos === null) return false

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

---

## Phase 2 — Wire into `src/editor.ts`

Add the import (after the existing `pastePlainText` import added in v4.0.0):
```ts
import { interactiveLinks } from './click-handlers'
```

In the extensions array, add `interactiveLinks()` near the other handlers. Place it after `pastePlainText` for consistency with the v4.0.0 ordering:
```ts
pastePlainText,
interactiveLinks(),
```

---

## Phase 3 — Visual feedback for clickable URLs

In `src/theme.ts`, locate the `tags.url` entry in `thotHighlightStyle` (currently at `:204`). Add the `class` attribute:
```ts
{ tag: tags.url, color: colors.linkUrl, class: 'thot-url-link' },
```

In the same file, add the cursor rule to `thotEditorTheme` (the `EditorView.theme({...})` block). Add it after the `.cm-line` block (currently at `:70–72`):
```ts
'.thot-url-link': { cursor: 'pointer' },
```

Note on UX: pure-CSS detection of "modifier key held" is not reliable — defaulting to pointer cursor on URLs (regardless of modifier) is acceptable given the modifier requirement only governs the click action, not the visual affordance.

---

## Phase 4 — `package.json` version bump

Bump `package.json` `version` from `4.0.0` to `4.1.0`.

---

## Phase 5 — Local verification, dev-deploy gate, then ship

Same three-step structure as v4.0.0: local verify → push to `dev` → 🛑 PAUSE for Sean to test the dev preview → only then ship to `main`.

### Step 5A — Local verification (orchestrator)

1. `npm run dev`. Open the welcome doc.
2. **Plain URL**: paste `https://google.com` on a line. CMD/Ctrl+Click → opens new tab. Plain click → places cursor.
3. **Inline link**: type `[Example](https://example.com)`. CMD/Ctrl+Click anywhere in `[Example]` → opens new tab.
4. **Anchor link**: in a doc with a heading like `# Introduction`, type `[Intro](#introduction)`. CMD/Ctrl+Click → editor scrolls so `# Introduction` is at top of viewport.
5. **Cursor visual**: hover any URL → cursor is `pointer`.
6. **Cross-browser**: confirm on Safari (`metaKey`) and Firefox (`ctrlKey`) in addition to Chrome.
7. `npm run build && npm run preview` → repeat steps 2–5 against the production build.

If anything fails, fix in place on `feat/v4-urls-anchors` and rerun. Do not proceed to 5B until local verification passes.

### Step 5B — Merge to `dev`, push, then PAUSE for Sean

```bash
git checkout dev
git merge --ff-only feat/v4-urls-anchors
git push origin dev
```

Vercel auto-deploys every push to `dev` to: **https://thot-git-dev-seanivores-projects.vercel.app**

(Same stable URL across pushes; latest commit each time.)

**🛑 STOP HERE. Notify Sean that v4.1.0 is live at `https://thot-git-dev-seanivores-projects.vercel.app` for testing, with a one-line summary (URL + anchor CMD-click). Do NOT continue to step 5C until Sean explicitly signs off.**

What Sean tests on the dev preview:
- All four interaction cases (plain URL, inline link, anchor link, cursor visual) on Mac (`metaKey`) and on a Windows browser if available (`ctrlKey`).
- No regression in v4.0.0 features that landed in the previous BUILD.

If Sean reports a bug: fix on `feat/v4-urls-anchors`, ff-merge to `dev` again, push, ping Sean.

### Step 5C — Ship to production (only after Sean signs off)

```bash
git checkout main
git merge --ff-only dev
git push origin main
git tag v4.1.0
git push origin v4.1.0
```

Vercel re-deploys `thots.august.style` from the new `main`. `dev` and `main` are now at the same commit.

### Step 5D — Update docs

Update `docs/THOT_APP.md`: bump "Last Updated" and "Version" to `v4.1.0`, add a Recent Changes entry. Then write `BUILD_REPORT_v4_1_0.md`.

---

## Rollback

`git checkout -- src/editor.ts src/theme.ts package.json && rm src/click-handlers.ts` reverts all three phases.

---

## Subagent Groupings

Single-orchestrator workload. The chunk is small and Phases 1–3 share `src/editor.ts` and `src/theme.ts`. No parallel value.

---

## Touch / mobile note (deferred to vNext)

iOS/touch has no concept of CMD+Click. Long-press → context menu with "Open Link" is the canonical mobile pattern. Out of scope for v4.1.0; capture in the vNext mobile UX bucket if not already there.

---

## What to write to `BUILD_REPORT_v4_1_0.md` when done

- **What changed** (file-by-file, one-line summaries).
- **What deviated from this BUILD** (anything decided differently and why; ideally empty).
- **Cross-browser results** — which browsers were verified, any modifier-key surprises.
- **Anchor slug coverage** — note if any heading-text edge cases (emoji, non-ASCII, punctuation) produced surprising slugs.
- **Verification results** — which phases passed, any untested.
