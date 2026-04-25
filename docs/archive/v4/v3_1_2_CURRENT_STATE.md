# Thot — Current State Snapshot at v3.1.2

**Date written**: 2026-04-25
**Production tag**: `v3.1.2-single-draftpad` → commit `dd7407e` (deployed at `thots.august.style`)
**Purpose**: Single canonical document a fresh agent (or Sean returning after a break) can read to understand exactly where the project stands.

If anything here conflicts with `docs/THOT_APP.md`, this doc was written more recently — but THOT_APP is the living source of truth and will be updated next.

---

## TL;DR

- **Live app works.** v3.1.2 is the deployed production version. All v3.1 feedback items (autocorrect UX, paired delimiters, native spellcheck, mobile spacing) are live and verified by Sean.
- **Persistence model**: single persistent main draftpad at URL `?id=main`. CMD+N spawns ephemeral `?id=temp-xyz` windows that don't collide with the main pad.
- **One feature spec exists but is unimplemented**: `docs/archive/v3/v3_2_0_URLS_ANCHORS.md` — clickable URLs and anchor jumps. No code written yet. This is the natural next-session feature.
- **No app code is mid-flight.** The only "in progress" artifacts are docs, all reconciled in this session.

---

## What Ships in v3.1.2 (Verified Live)

### Core editor (unchanged from v2.x)
- Full markdown syntax highlighting via CodeMirror 6 + Lezer parser
- ~100 color tokens defined in `src/highlight-tags.ts`
- Custom Lezer tags for bullet/ordered list differentiation, table content, inline code marks
- Hanging indent for wrapped lines
- JetBrains Mono NL font (9 weight variants)
- Auto-save to `localStorage` with 500ms debounce
- Cursor + scroll position restoration

### Usability (v3.1.0 → fixed forward through v3.1.2)
- **Native browser spellcheck** enabled via `spellcheck: "true"` on the editor
- **Paired delimiters** via `@codemirror/autocomplete` `closeBrackets()` — auto-closes brackets/quotes, skip over auto-inserted, wraps selection
- **Custom Autocorrect Engine** with these UX behaviors (per `docs/archive/v3/v3_1_FEEDBACK_2.md`):
  1. Type trigger character → autocorrect applies
  2. Immediate Backspace on the trigger → reverts the correction *and* ignores the next attempt
  3. CMD+Z → undoes the correction but keeps the trigger character
  4. Delete the corrected word and retype → does not re-trigger autocorrect
  5. Delete a character the autocorrect added → ignores subsequent triggers on that word
- Autocorrect is **suppressed inside**: `InlineCode`, `FencedCode`, `URL`, `Link` syntax nodes (detected via `syntaxTree`)
- Auto-Capitalization on sentence starts
- Mobile spacing fixes (30vh bottom padding, line-number column adjustment, share button)

### Persistence (v3.1.1 → v3.1.2)
- **Single persistent main draftpad**: on first load with no `?id=` URL parameter, the app sets `?id=main` via `history.replaceState()` and uses `localStorage` key `thot:content:main`.
- **Legacy migration**: if old `thot:content` (no partition) exists, it's silently moved into `thot:content:main` on first boot, and the legacy key is deleted.
- **Ephemeral temp windows**: CMD+N opens a new tab with `?id=temp-xyz123` (random 6-char). These do not collide with `main`. Closing them doesn't affect the main pad. Implemented in `src/file-system.ts:newWindow()`.

### File System (baseline)
- `openFile()` — File System Access API where supported (Chrome/Edge), falls back to `<input type="file">` for Safari/iOS
- `saveFileAs()` — `showSaveFilePicker` with download fallback
- `shareDocument()` — `navigator.share` for PWA share sheet, alert fallback

---

## What's NOT in Production (Spec-Only)

### v3.2.0 URLs & Anchors — `docs/archive/v3/v3_2_0_URLS_ANCHORS.md`

**Status**: Implementation guide is written, no code exists. The doc specifies:

- New file `src/click-handlers.ts` exporting an `interactiveLinks()` extension
- `EditorView.domEventHandlers` intercepts `mousedown` events
- CMD/Ctrl+Click on a `URL` syntax node → `window.open()` in new tab
- CMD/Ctrl+Click on a markdown `Link` → checks if destination starts with `#` (anchor) or is a normal URL
- Anchor handling: slugify the heading text, iterate `syntaxTree` for matching `ATXHeading`/`SetextHeading`, dispatch `EditorView.scrollIntoView()`
- CSS: `cursor: pointer` on `.thot-url-link`

This is the natural next-session implementation target.

---

## Tag → Commit Map (Suffix Cleanup Needed)

| Existing legacy tag | Commit | Plan |
|---|---|---|
| `v3.1.0-usability` | `6181ea8` | Add clean tag `v3.1.0` pointing at same commit |
| `v3.1.1-multi-window` | `fb425e9` | Add clean tag `v3.1.1` pointing at same commit |
| `v3.1.2-single-draftpad` | `dd7407e` | Add clean tag `v3.1.2` pointing at same commit |
| `v2.1.4` | `ca9eeb9` | Already clean. No change. |

**Going forward**: clean numeric tags only (`vX.Y.Z`), no suffixes. See `.agent/UPDATE_DEV_RULES.md` § 3.

---

## What Was Attempted and Abandoned

This section exists because Anti-Gravity left documentation that describes mid-work as if final, which is misleading. Treat the following as authoritative over conflicting archive prose.

### v3.1.0 retraction → fixed forward
- Original v3.1.0 ship merged to `main` and tagged. Sean tested live and found autocorrect's backspace-undo broken (typing `cant` → `can't`, then backspace, did nothing useful).
- Sean reset `main` and `v3-rainbow-moat` back, deleted the original tag.
- Fix landed in commit `9ebe5fc` ("feat(usability): finalize v3.1.0 custom autocorrect and docs"). Re-tagged as `v3.1.0-usability` at `6181ea8`.
- The "Recovery Walkthrough" doc (`docs/archive/v3/v3_1_0_Recovery_Walkthrough.md`) describes the *initial* successful merge as if it were the final outcome. It was written before testing. Don't trust it as a state report.

### v3.1.1 multi-window URL partitioning → pivoted
- Idea: every PWA window gets a unique `?id=xyz` URL parameter; `localStorage` keys partition by ID; multiple windows are isolated.
- Shipped at `fb425e9`, tagged `v3.1.1-multi-window`.
- Tested in production: macOS Safari strips dynamic PWA launch parameters and forces the manifest's base `/` start URL on restart. The bootloader generated infinite new IDs instead of restoring previous windows.
- See `docs/archive/v3/v3_1_1_MULTI_WINDOW_PERSISTENCE_SAFETY.md` for the detailed analysis.

### v3.1.2 single-draftpad pivot → ✅ live
- New approach: default `?id=main` always, migrate legacy data into it, and let CMD+N spawn ephemeral `?id=temp-*` windows for temporary scratch.
- This is the live implementation in `src/main.ts:64-98` and `src/file-system.ts:88-93`.

The v3.1.1 multi-window machinery is **still in the code** as the substrate for ephemeral temp windows. It wasn't ripped out — it was repurposed.

---

## Git State

### Branches at session start (2026-04-25)

| Branch | Local | Origin | Notes |
|---|---|---|---|
| `main` | ✅ | ✅ | Production. Vercel deploys from this. |
| `dev` | ✅ | ✅ | Stale; will be recreated from `main` in branch cleanup. |
| `feat/v3-urls-anchors` | ✅ | ✅ | Current. Docs only. To be merged to `main` then deleted. |
| `feat/v3-multi-window` | ✅ | ✅ | Merged into `main`. Safe to delete. |
| `feat/v3-usability` | ✅ | ✅ | Merged into `main`. Safe to delete. |
| `fix/v3-pwa-state-restore` | ✅ | — | Local-only, merged. Safe to delete. |
| `feat/v3-formatting` | ✅ | — | Local-only experimental. Audit before delete. |
| `feat/v3-highlighting` | ✅ | — | Local-only experimental. Audit before delete. |
| `v2-first-thots` | ✅ | ✅ | **Repo's GitHub default base** (stale setting; deploy is from `main`). Keep as historical reference, but change GitHub default branch to `main`. |
| `v1-deskpad`, `v1_deskpad_alt` | — | ✅ | Historical. Leave alone. |

### Repository default branch issue (manual fix on GitHub)
- GitHub repo Settings → Branches lists `v2-first-thots` as default. This is why PRs default to that base. Change to `main`.
- Deployment is unaffected; Vercel deploys from `main` regardless of the GitHub default.

### Vercel push restriction
- No `vercel.json` in the repo and no `.vercel/` config dir. The "Vercel didn't allow push from feat branch" symptom is almost certainly the Vercel project's "Production Branch" set to `main` in the dashboard — feature branches deploy as previews, not as prod. **This is normal and correct behavior**, not a misconfiguration.

---

## Going-Forward Branch Model (Locked This Session)

- `main` — production only, fast-forward merges from tested releases. Vercel deploys here.
- `dev` — primary integration branch. All ongoing work flows here.
- `feat/*`, `fix/*` — temporary, deleted after merge.

PR flow: `feat/*` → `dev` → (test) → fast-forward to `main` → tag `vX.Y.Z`.

---

## Open Questions for Next Session

These are Sean's bigger product/architecture questions, captured here so they don't get lost. None of them block v3.2.0 URLs/anchors implementation, which can proceed first.

1. **Modular SwiftUI wrapper** — is it possible to build a SwiftUI shell that "drops in" updated PWA versions over time, so the web app stays the source of truth and the native shell just re-skins?
2. **Native without App Store** — does every macOS app require App Store submission and a paid developer account, or can a SwiftUI wrapper be distributed outside the App Store (and what are the trade-offs)?
3. **Web app priority** — Sean wants the browser-deployed web app to remain top priority. PWA is lower priority than expected ("people just don't like them"); useful but not the headline.
4. **Cross-device persistence** — needs a real backend or sync layer. What's the minimum viable approach? (CRDT? Append-only log to a hosted KV? Auth choice?)
5. **MacOS toolbar/notch jot pad** — quick-capture surface accessible from the notch or menubar to "stay in flow." Likely requires a SwiftUI menubar app that talks to the same persistence layer.
6. **Save/Open + file hierarchy** — currently `openFile`/`saveFileAs` exist as one-shot actions. Does v4 introduce a real document model, a sidebar, a Finder-column-view-style organization?
7. **Architecture decision pending**: any of items 1, 4, 5, 6 may force decisions that affect the others.

---

## Anti-Gravity Confusion Archive

The following docs in `docs/archive/v3/` were written by an Anti-Gravity agent during a session that confused the user enough to pause the project. Read them with skepticism:

- `v3_1_0_Recovery_Walkthrough.md` — describes a successful merge that was almost immediately retracted because production testing failed. Reads like a victory log; isn't.
- `v3_1_1_MULTI_WINDOW_PERSISTENCE_SAFETY.md` — describes the v3.1.1 → v3.1.2 pivot. Generally accurate technically but mixes pre- and post-pivot state.
- `Restoring-Lost-Conversation-History.md` — the literal transcript of the last Anti-Gravity session. Useful for context, not for state.

This document supersedes them as the state authority.

---

## Cross-References

- **Architecture & code-level docs**: `docs/THOT_APP.md` (will be updated to reflect v3.1.2)
- **Strategic roadmap**: `docs/UPDATE_MAP.md` (will be updated next session when product questions resolve)
- **Versioning rules**: `.agent/UPDATE_DEV_RULES.md` (rewritten this session, ready to drop into `.agent/DEV_RULES.md`)
- **v3.1 feedback (live behaviors)**: `docs/archive/v3/v3_1_FEEDBACK_2.md`
- **v3.2.0 URLs/anchors spec**: `docs/archive/v3/v3_2_0_URLS_ANCHORS.md`
- **Auto-mirrored session plan**: `docs/archive/v4_0/v3_1_2_DEV_PLANNING.md` (created by hook from this session's plan; can be moved into `v4/` or left as-is)
