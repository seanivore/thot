# v4.0.0 — Development Planning

**Created**: 2026-05-06
**Version**: v4.0.0
**Status**: Active — planning session in flight

---

## Why this session exists

`v4_0_0_CLARITY.md` consolidated three sessions of brain-dump work into one document, but it intermixes four different orders of work: scoped bug fixes, feature work needing UX writeups, moat-level work needing research, and long-horizon strategy. This session splits those into the structures `.agent/DEV_RULES.md` calls for, fixes Vercel so the build pipeline isn't lying to us, and seeds the research that unblocks v5.

**Key reframings made this session** (per chat with Sean):

1. The "build our own highlighter" question is genuine — research kicked off this session to compare staying on Lezer + scope layer rewrite, forking Lezer, or replacing entirely. Findings will land in `docs/research/1_DEEP/highlighter-architecture/`.
2. `src/scopes.ts` already exists as a fully drafted proprietary scope model (priority bands, plain-text-mode `auto.*` group, user-customizable flags). It's not wired in yet — that's part of the v5 work, not v4.
3. Strategic roadmap content is folding into `docs/THOT_APP.md` as a top-level "Strategic Roadmap" section, not into a separate `UPDATE_MAP.md`. Sean's preference; it does mean execution agents see roadmap context, which is acceptable as long as the section stays high-level.
4. Public release line is pinned: **don't take Thot public until it is a markdown AND normal-text editor with semantic highlighting** (i.e., not before v5.0.0, possibly later). v4.x ships internally and to early users only.

---

## Plan (this session)

### [x] Spawn three research agents in background
Highlighter architecture options, auth/sync/passkey stack, native wrapper choice. All write directly to `docs/research/1_DEEP/<bucket>/OPTIONS.md` per `RESEARCH_PROTOCOL`. Findings reviewed in this session's tail.

### [x] Move three docs to `docs/archive/v4_0/processed/`
- `v4_0_0_REGROUP.md`
- `RE_ORIENT_v3_4_0.md`
- `SNAPSHOT_v3_1_2_.md`

Their actionable content folds into the new docs below. They stay as historical record per `DEV_RULES` § "Nothing is deleted."

### [x] Update `docs/THOT_APP.md`
- Added top-level `## Strategic Roadmap` section laying out v4.x → v5.0 → v6.0 → vNext milestone shape, with the "no public release before v5.0 + semantic highlighting" line pinned at the top.
- Updated "Status" and "Last Updated" lines.

### [x] Write `v4_0_0_IMPLEMENT.md` for the v4.0.0 polish pass
Scope: the bug fixes from `CLARITY.md` §"Understand Current App State" items 6–10. Three items (PWA title dedup, frontmatter detection, line wrap below 1040px) get a Phase 0 investigation step before code changes. Rest are direct edits across `src/autocorrect.ts`, `src/theme.ts`, `src/highlight-tags.ts`, and a new `src/paste-handler.ts`. List-blank-line behavior carries an explicit "defer to v4.0.1 with a `BUGS.md`" off-ramp if it turns into a non-trivial parser-tree walk.

### [x] Scaffold the two missing UX writeups
Both written as fill-in scaffolds, not researched specs:
- `docs/research/1_DEEP/feature-research/FORMATTING_UX.md` — 9 lead-in prompts covering user persona, first contact, dual-mode definition, switching gestures, auto-detection rules, customization layer, what-it-isn't, free space.
- `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md` — 9 lead-in prompts covering layout, sticky-note definition, location/scoping, creation flow, AI-populated detail UX, use cases, lock-screen integration, what-it-isn't, free space.

These unblock v5 once Sean fills them in.

### [x] Diagnose Vercel deploy block — **ROOT CAUSE IDENTIFIED, RESOLUTION DEFERRED TO SEAN**

The commit author email is `horvathaugust@gmail.com`. The repo lives on the `seanivore` GitHub account. If `horvathaugust@gmail.com` is not a verified secondary email on the `seanivore` GitHub account, GitHub returns the commit author as an "unidentified user" → Vercel sees an external author → on Hobby + private repos, blocked.

**Resolution paths, in order of preference:**

1. **Add `horvathaugust@gmail.com` as a verified secondary email on the `seanivore` GitHub account.** Free, takes 2 minutes (GitHub Settings → Emails → Add → click confirmation link). Once verified, the existing blocked commits will resolve as Sean's and Vercel will deploy them.
2. **Change git config locally** (`git config user.email <whichever email is already verified on seanivore>`). Future commits deploy; the old blocked commits stay blocked unless re-authored. Less ideal because it loses the existing-commits unlock.
3. **Make the repo public.** Vercel Hobby permits any author on public repos. Trade-off: code visible to the world.
4. **Upgrade Vercel to Pro** ($20/mo). Solves it but is wasteful for a single-developer project.

Recommend path 1 unless Sean has a reason `horvathaugust@gmail.com` shouldn't go on the `seanivore` GitHub account.

### [Partial] Wait for research agents, then write `final_recommendations.md` for each bucket
- **Auth/sync research** complete: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md`. Recommendation: **Clerk** (passkey-primary auth) + **Vercel Postgres / Neon** for v1 single-user device sync + **Yjs + Liveblocks** for v2 collab. 8 open items flagged. Caveat: WebSearch was unavailable to that subagent — vendor pricing/MAU claims tagged `**VERIFY**` for Phase 2 confirmation.
- **Highlighter architecture research** complete: `docs/research/1_DEEP/highlighter-architecture/OPTIONS.md`. Recommendation: **Option A + Option B2** — stay on Lezer; rewrite the scope/cascade layer cleanly (single ViewPlugin walking the syntax tree, flat scope table, tree-nesting for priority — replaces the current `combine()`-precedence + CSS-cascade-order trickery, folds in the sidecar ViewPlugin's three special cases). Add a separate regex-based prose-mode highlighter for content that doesn't look like markdown. Honest IP read: there's no moat in "ours instead of Lezer" — parsers and scope models are commodity. The defensible moat is the product layer above (dual-mode UX, editorial curation of which prose patterns map to which signals, trade dress around palette+typography, customization surface). Forking `@lezer/markdown` is unjustified; writing our own incremental parser would burn ~3 months for zero user-visible benefit. Caveat: WebSearch unavailable; external citations are in-tree `node_modules/@lezer/*` package files rather than live URLs.
- **Native wrapper research** complete: `docs/research/1_DEEP/native-wrapper/OPTIONS.md`. Recommendation: **Capacitor** as the host shell for iOS / iPadOS / macOS (Catalyst). **WatchOS as a separate native SwiftUI target** sharing an App Group with the Capacitor app — no wrapper hosts WatchOS structurally. **Apple Pencil annotation as a native PencilKit overlay above the WKWebView** — pointer events through web layer run ~60–120ms vs. PencilKit's ~9ms, unacceptable for real annotation. PWABuilder is too bare; Tauri Mobile too immature on iOS for a solo project; a pure custom shell costs more code for no extra capability. Phase order: A (PWA installable, already in flight) → B (Capacitor + App Intents + WidgetKit) → C (Live Activities + Dynamic Island, builds on B's App Group) → D (Pencil overlay, parallel with C) → E (WatchOS, gated on auth-and-sync bucket) → F (optional native Mac shell if Catalyst proves insufficient). Caveat: WebSearch unavailable; version-specific claims flagged `[VERIFY]` inline + in Open Research Items for Phase 2 re-fetch.

`final_recommendations.md` per bucket gets written once all three return — they're all in. Phase 2 follow-up (the `final_recommendations.md` synthesis + `[VERIFY]` re-fetches) is its own session, not part of v4_0_0_DEV_PLANNING.

---

## Critical files modified this session

- `docs/archive/v4_0/processed/` (new dir, three files moved in via `git mv`)
- `docs/THOT_APP.md` (Strategic Roadmap section added, status line updated)
- `docs/archive/v4_0/v4_0_0_DEV_PLANNING.md` (this file)
- `docs/archive/v4_0/v4_0_0_IMPLEMENT.md` (new, executable spec for v4.0.0)
- `docs/research/1_DEEP/feature-research/FORMATTING_UX.md` (new scaffold)
- `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md` (new scaffold)
- `docs/research/1_DEEP/highlighter-architecture/OPTIONS.md` (background agent)
- `docs/research/1_DEEP/auth-and-sync/OPTIONS.md` (background agent)
- `docs/research/1_DEEP/native-wrapper/OPTIONS.md` (background agent)

No source code changed this session.

---

## Session Notes

- `src/scopes.ts` is a fully drafted proprietary scope model (priority bands, `auto.*` plain-text-mode group, `userCustomizable` flags) but not yet wired into the runtime. `theme.ts` still uses a separate `HighlightStyle` keyed off `@lezer/highlight` tags. Wiring `scopes.ts` into a single ViewPlugin walking the syntax tree is the v5 work, *not* v4. The highlighter research recommends this exact path.
- `src/autocorrect.ts` is in good shape — `->` → `→` is one dictionary line.
- `index.html` line 20 has `<title>Thot</title>`. The PWA double-suffix bug (`Thot - daily-planner.md - Thot`) must come from a runtime mutation when a file is opened. Phase 0.1 of `v4_0_0_IMPLEMENT.md` traces where.
- Vercel deploy block is **not** a code issue — it's an account-side identity reconciliation problem. Resolution requires Sean's action on GitHub or Vercel; documented in this DEV_PLANNING § "Diagnose Vercel deploy block" with four resolution paths.
- All three research agents had WebSearch/WebFetch denied in this session, so vendor pricing/version-specific claims across all three OPTIONS.md docs carry `**VERIFY**` / `[VERIFY]` tags. The framing and recommendations are robust to expected drift; the specific facts may not be. Phase 2 of each bucket re-fetches.
- The "Strategic Roadmap" section was added to `THOT_APP.md` rather than created as a separate `UPDATE_MAP.md` per Sean's preference. Trade-off: execution-mode agents reading `THOT_APP.md` will see roadmap content. Acceptable as long as the section stays high-level — IMPLEMENT.md is still the source of truth for what to build *now*. The roadmap section closes with a "Don't read this section during execution" pointer.

## Picked Up From / Stopped At

**Branch state**: `dev`. No source code changed this session. Working tree dirty with documentation moves and additions only.

**Documentation state**: Reorganization complete. v4 active, v5 research scaffolded and partially completed (3/3 OPTIONS.md docs in place; `final_recommendations.md` synthesis pending). The two UX writeups (`FORMATTING_UX.md`, `COLUMNS_LAYOUT.md`) are scaffolds awaiting Sean's narrative fill-in.

**Next concrete actions, in order:**

1. **Sean**: Resolve Vercel block (recommended path: add `horvathaugust@gmail.com` as verified secondary email on `seanivore` GitHub account).
2. **Sean (when time/energy)**: Fill in `FORMATTING_UX.md` and `COLUMNS_LAYOUT.md` lead-in prompts. These unblock v5 spec.
3. **Next agent session**: Execute `v4_0_0_IMPLEMENT.md` on a `feat/v4-basics` branch. Phase 0 investigation first, then Phase 1 fixes, then verification, then ship.
4. **Concurrent or after**: Phase 2 synthesis of the three research buckets (re-fetch `[VERIFY]` items, write `final_recommendations.md` per bucket).

## Open Threads For Next Session

- **Vercel resolution path**: needs Sean's input before the next deploy attempt. Recommended path documented; awaiting confirmation.
- **`package.json` version is `2.1.4`** (out of sync since v3 work). v4.0.0 IMPLEMENT.md Phase 3 ships the bump.
- **The list-blank-line propagation fix** (Phase 1.8 in IMPLEMENT.md) has an explicit "defer to v4.0.1 with a `BUGS.md`" off-ramp if it requires a non-trivial parser-tree walk. Watch for that during execution.
- **Highlighter research recommends folding the existing 3-case sidecar ViewPlugin into the v5 scope walker.** Once v5 starts, the current `src/editor.ts` `markerDecorations` plugin gets retired, not extended.
- **Auth/sync research recommends Clerk** but flagged 8 open items including "confirm Clerk's vanilla-JS passkey UX parity with the React SDK" and "confirm Yjs binding compatibility with Thot's existing custom `styleTags` + `ViewPlugin` setup." Both must close before v6+/vNext auth work begins.
- **Native wrapper research recommends Capacitor + Pencil overlay above WKWebView**. Open question for vNext: does the Pencil overlay model interfere with the in-editor selection / scroll behavior? Answer needs a prototype, not more research.
- **Three documents under `docs/archive/v4_0/processed/`** are now historical. They should not be cited by future implementation plans.
