# v4.0.1 Session — Extract v4.0 / v4.1 BUILDs + lock v4.2.0 spec

**Driving**: v4.0.1 (no version bump — this is a planning session that produces BUILD packets, not a code ship)
**Date**: 2026-05-10
**Session type**: Planning (BUILD-packet extraction + v4.2.0 spec round)

---

## What this session does

Sean asked to push the v4.0 → v4.2 stretch into clean BUILD packets so future sessions can execute without re-deriving from messy planning prose. The plan archived at `~/.claude/plans/hello-i-m-hoping-you-jazzy-knuth.md` is the working contract; this SESSION is its live log.

Three deliverables:
1. `docs/archive/v4_0/v4_0_0_BUILD.md` — exclusively executable packet for the v4.0.x polish chunk.
2. `docs/archive/v4_0/v4_1_0_BUILD.md` — exclusively executable packet for v4.1.0 URL/anchor clickability.
3. `docs/archive/v4_0/v4_0_1_IMPLEMENT.md` § *Milestone v4.2.0* — rewritten as a locked, BUILD-ready spec.

No `src/` code touched.

---

## Phase A — Source verification deltas

Read every file:line ref in IMPLEMENT v4.0.x and v4.1.0 against current source on `dev`. Findings:

| § | IMPLEMENT claimed | Source actually shows | Resolution |
|---|---|---|---|
| v4.0.0.1 | Append after line 130 | `autocorrect.ts:130` is `"(tm)": "™"` (last entry, NO trailing comma); `:131` closes the dictionary | Snippet must convert `"(tm)": "™"` → `"(tm)": "™",` and add `"->": "→"` as the new last entry |
| v4.0.0.2 | width `25px`, `paddingRight: '5px'` | `theme.ts:67` is `width: '16px'`, no padding | Default value is `16px`; CSS var introduction stands |
| v4.0.0.2 | Set CSS var in `:root` of `main.css` | `main.css` has no `:root` block | Add a new `:root` block at the top of the post-`@font-face` section |
| v4.0.0.3 | `colors.frontmatter` is `#FF9D00` (heading orange) | `highlight-tags.ts:84` is `#BD93F9` (purple) | Re-frame: structural mis-tagging is the load-bearing bug; recoloring is a separate preference call. Sean confirms color preference before BUILD locks |
| v4.0.0.4 | `[x]` carries `tags.special(tags.atom)` under `Task` node | Lezer markdown emits `TaskMarker` styled as plain `tags.atom`; parser does NOT differentiate `[x]` vs `[ ]` via tags | Re-spec as ViewPlugin decoration that reads marker text — extends the existing `markerDecorations` plugin in `editor.ts:55–129` |
| v4.0.0.5 | New `paste-handler.ts` | OK | No change |
| v4.0.0.6 | 3 sites at `file-system.ts:24, 37, 66` | Confirmed exactly | No change |
| v4.0.0.7 | `editor.ts:191–194` BulletList/OrderedList styleTags | Confirmed | No change |
| v4.0.0.8 | List blank-line custom Enter handler | Confirmed; quirk #2 defer path documented | No change |
| v4.0.0.9 | Line wrap below 1040px | Requires DevTools spike inside BUILD (Phase 0) | No change |
| v4.0.0.10 | Bump `package.json` from `2.1.4` to `4.0.0` | Confirmed `2.1.4` | No change |
| v4.1.0 | Node names `URL`, `Link`, `LinkMark`, `LinkTitle`, `LinkLabel` | All verified present in `@lezer/markdown/dist/index.js` (lines 65–83) | No change |
| v4.1.0 | `node.name.includes('Heading')` | Lezer emits `ATXHeading1–6` and `SetextHeading1–2` — `.includes('Heading')` matches all | No change |

---

## Tasks

- [x] Phase A — source verification pass (deltas above)
- [x] Phase B — corrections produced (initially edited `v4_0_1_IMPLEMENT.md` in place; Sean correctly flagged this as a protocol violation — corrections now live in the new `v4_1_0_IMPLEMENT.md` and `v4_0_1_IMPLEMENT.md` is reverted to its committed state per the "nothing is deleted" rule)
- [x] Phase C — open this SESSION doc
- [x] Phase D — extract `v4_0_0_BUILD.md` (now references `v4_1_0_IMPLEMENT.md` as Source)
- [x] Phase E — extract `v4_1_0_BUILD.md` (now references `v4_1_0_IMPLEMENT.md` as Source)
- [x] Phase F — v4.2.0 spec locked into the new `v4_1_0_IMPLEMENT.md` (Q1+Q2 resolved via reasoned analysis; Q3–Q6 from Sean's clarifications)

---

## Subagent delegation log

No subagents delegated this session. Q1+Q2 reasoning was small enough to handle inline; the file extractions were too dependent on the corrected IMPLEMENT to parallelize meaningfully.

---

## Session Notes

- **Protocol drift caught mid-session**: I edited `v4_0_1_IMPLEMENT.md` in place for the source-verification corrections and the v4.2.0 spec lock. Sean caught this and reminded that DEV_RULES § *Versioning § Working Chronological Example* is clear: substantial doc updates create a new version file (per the "nothing is deleted" + patch-bump-for-substantial-doc-changes rules). Recovered by `git checkout --` on `v4_0_1_IMPLEMENT.md` and copying the corrected state to `v4_1_0_IMPLEMENT.md` with a "Changes from v4.0.1" header summarizing the delta. Both BUILD packets now reference `v4_1_0_IMPLEMENT.md` as their Source.

- **v4.0.0.4 was a real spec bug**, not a value tweak. The original IMPLEMENT claimed `[x]` carries `tags.special(tags.atom)`, but Lezer markdown emits `TaskMarker` styled as plain `tags.atom` (verified `node_modules/@lezer/markdown/dist/index.js:2174–2175`). Pure HighlightStyle cannot reach the checked-vs-unchecked distinction. The corrected spec extends the existing `markerDecorations` ViewPlugin in `editor.ts:55–129` to read marker text and decorate only `[x]`/`[X]` — same pattern, no new architecture.

- **v4.0.0.3 frontmatter framing was wrong**. The original IMPLEMENT said `colors.frontmatter` was `#FF9D00` (heading orange) and recommended a pale-yellow recolor. Reality: `colors.frontmatter` is `#BD93F9` (purple); the orange/bold visual Sean reports comes from cascade interactions when `documentMeta` mis-tags inside list contexts, not from the frontmatter color itself. The corrected fix remaps `documentMeta` away from `colors.frontmatter` entirely (to `tags.processingInstruction` → `#6767fc`). The color recolor is now a *preference* call left for Sean post-ship, not a fix.

- **v4.2.0 Q1+Q2 reasoned answers**: Q1 = pure DOM overlay via `ViewPlugin` (Panel API and `Decoration.widget` both eliminated cleanly). Q2 = memoized sorted heading array, invalidate only on `docChanged`. The smooth-handoff trick — translateY the active overlay row by the next-heading delta — gets Sean's "no jump" requirement using GPU compositing.

- **v4.0.0.9 line-wrap spike** stayed inside the BUILD as Phase 0 (a 5-min DevTools investigation). The BUILD has an explicit 15-min timeout escalation if it stalls.

---

## Picked Up From / Stopped At

**Branch state**: `dev`. Working tree dirty with three untracked new files (`v4_0_0_BUILD.md`, `v4_1_0_BUILD.md`, `v4_1_0_IMPLEMENT.md`, this SESSION doc). `v4_0_1_IMPLEMENT.md` is unchanged from its committed state.

**No source code under `src/` touched.**

**Next concrete actions, in order:**

1. **Sean**: review `v4_1_0_IMPLEMENT.md` (especially the v4.2.0 spec lock at the bottom) and the two BUILD packets. Approve or send back for revision.
2. **Sean**: file the plan-mode plan (`~/.claude/plans/hello-i-m-hoping-you-jazzy-knuth.md`) into `docs/archive/v4_0/processed/` per standing convention.
3. **Sean**: when ready, commit the new docs (`v4_0_0_BUILD.md`, `v4_1_0_BUILD.md`, `v4_1_0_IMPLEMENT.md`, `v4_0_1_SESSION.md`).
4. **Next session**: run `v4_0_0_BUILD.md` through an orchestrator. The BUILD is exclusively executable — orchestrator returns `BUILD_REPORT_v4_0_0.md`. Then ship v4.0.0.
5. **Following session**: run `v4_1_0_BUILD.md` after v4.0.0 ships and `dev` rebases onto the new `main`.
6. **After v4.1.0 ships**: extract `v4_2_0_BUILD.md` from the locked spec in `v4_1_0_IMPLEMENT.md` § *Milestone v4.2.0*, with Sean as the gate per his standing review-before-promotion convention.

---

## Open Threads For Next Session

- **Frontmatter color preference** (Phase 3 of `v4_0_0_BUILD.md`): Sean's open call on whether to recolor `colors.frontmatter` from `#BD93F9` to e.g. `#F5F0B5`. Not a fix — preference. BUILD report should flag for his decision.
- **List blank-line quirk #2** (Phase 8 of `v4_0_0_BUILD.md`): documented defer-to-BUGS off-ramp if the manual-blank auto-propagation is still buggy after the empty-bullet exit fix lands.
- **v4.0.0.9 line-wrap spike outcome** is genuinely unknown — depends on what DevTools shows in Phase 0. The BUILD orchestrator records the actual rule + chosen fix path in BUILD_REPORT.
- **v4.2.0 perf gate** (§ v4.2.0.4): the orchestrator must profile on a 100K-line synthetic doc. If even after binary-search + rAF debouncing the architecture can't hold 60fps, escalate to Sean — per Q6, that means the architecture is wrong, not that we should ship a regression.
- **Process correction memory**: the protocol-drift incident this session (in-place IMPLEMENT edit) should inform future sessions — when correcting/extending an IMPLEMENT, always copy to a new versioned file first.

- **Ship-section clarification (post-Phase F)**: Sean noted that both BUILDs jumped from local verification straight to merging into `main`, with no explicit pause for him to test on a dev-branch preview deploy. Both BUILD ship sections were restructured into A→B→C→D steps with a 🛑 STOP gate after pushing to `dev` so the orchestrator must wait for Sean's sign-off on the Vercel dev preview URL before touching `main`. Production stays at `thots.august.style` from `main`; dev gets its own auto-deployed Vercel preview URL per push.
