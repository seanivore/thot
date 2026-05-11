# v4.0.0 Session — Workflow reset + new master IMPLEMENT

**Driving**: v4.0.0 → v4.0.1
**Date**: 2026-05-10
**Session type**: Planning (procedural reset + master roadmap creation)

---

## What this session did

This session was the response to Sean's `v4_0_1_FEEDBACK.md`. Two things at once:

1. Brought `.agent/DEV_RULES.md` and the supporting templates into alignment with the new four-file taxonomy (IMPLEMENT / SESSION / BUILD / BUGS), killing the old `DEV_PLANNING` / `SESSION_DEV` / `IMPLEMENT_MASTER` lifecycle.
2. Used the aligned workflow to produce Thot's first proper master `v4_0_1_IMPLEMENT.md` — a single living roadmap covering v4.0.x polish through vNext strategy, plus a parallel business-plan kickoff track.

Per the new convention, this SESSION's filename uses the *old* version (v4.0.0); the banner above declares the bump to v4.0.1.

---

## Tasks (all complete)

- [x] **Rewrite `.agent/DEV_RULES.md` (v3.3.1 → v3.4.0)** — replaced the entire old lifecycle protocol (lines 191–249), rewrote the Master Documents section (no `IMPLEMENT_MASTER` concept), folded Session Document Handling into the new taxonomy, added a BUILD.md and BUILD_REPORT subsection with the strict no-pass-through rule, adjusted the Gap-Finding Loop to flow IMPLEMENT → cleared chunk → BUILD → REPORT → IMPLEMENT, added a research-tier callout distinguishing implementation research from the formal `RESEARCH_PROTOCOL.md` framework, updated all stale `SESSION_DEV` / `DEV_PLANNING` references throughout. **Lines 24–92 (Development Philosophy) untouched per Sean's request.**
- [x] **Update `.agent/PROJECT_NAME.md` template** — added a Strategic Roadmap section (modeled on `THOT_APP.md`'s), added a "How This Doc Relates to IMPLEMENT.md" section explaining the architecture-vs-roadmap split, added the `[spec-only]` callout convention so future projects can mirror Thot's clarity on shipped vs. planned.
- [x] **Patch `.agent/README.md` template** — fixed the broken `/assets/docs/PROJECT_NAME.md` path, added an Active Roadmap row pointing at the highest-numbered IMPLEMENT, added an Agent Protocols row pointing at `.agent/DEV_RULES.md`.
- [x] **Patch `.agent/AGENTS.md`** — added a Document Map section so new agents learn the four file types, the DEV_RULES vs. RESEARCH_PROTOCOL distinction, and the BUILD-only-context rule.
- [x] **Sync `.agent/` across projects via `filemgmt`** — synced DEV_RULES.md, PROJECT_NAME.md, README.md to all 9 projects under `~/Development/*/.agent/`. (AGENTS.md is per-project, not synced — same convention as PROJECT_LESSONS.md.)
- [x] **Write `docs/archive/v4_0/v4_0_1_IMPLEMENT.md`** — the master living roadmap. Folds in: full v4.0.x polish chunk with bug investigations completed (5 bugs root-caused with file:line specifics and exact replacement strings, ready to promote to BUILD); v4.1.0 URLs/Anchors spec verbatim from `FEAT_URLS_ANCHORS.md` adapted to v4 numbering; v4.2.0 Heading Stack UX spec with implementation framing; v5.0.0 highlighter rebuild + dual-mode (locked architecture from research); v6.0.0 Preferences UI from `FEAT_PREFERENCES.md` + scope system; vNext strategy (native, collab, AI, columns); Parallel Track for business-plan kickoff with scope statement, gap audit, and four concrete first-session outputs.
- [x] **Cleanup** — moved `v4_0_0_CLARITY.md`, `v4_0_0_DEV_PLANNING.md`, `v4_0_0_IMPLEMENT.md`, `FEAT_URLS_ANCHORS.md`, `FEAT_HEADING_STACK.md`, `FEAT_PREFERENCES.md` into `docs/archive/v4_0/processed/` via `git mv`. Added `docs/archive/research/README.md` clarifying that directory's archival role (the two research dirs are NOT duplicates — old sketch layer vs. active protocol-driven layer). Updated `docs/THOT_APP.md` Last Updated date, Status line, Strategic Roadmap section pointer, and the three milestone bullets that referenced the now-moved FEAT_* files.

---

## Subagent delegation log

Three Explore subagents in parallel during the planning phase, then one background Explore for bug root-cause analysis during execution:

1. **DEV_RULES audit** — produced the section-by-section line-mapping that drove the rewrite plan.
2. **`.agent/` template + filemgmt + CLAUDE.md audit** — confirmed templates need updating, confirmed filemgmt does what we need, answered the CLAUDE.md auto-load question (it works; modernization is cosmetic).
3. **v4_0 + research dir inventory** — produced the comprehensive inventory of every file's contents and status; flagged the two research dirs as NOT duplicates.
4. **Bug root-cause investigation (background)** — root-caused all 5 v4.0.x bugs with file:line specifics, exact replacement strings, and confidence levels. Findings folded directly into the new IMPLEMENT's v4.0.x chunk so it's exclusively executable.

This kept the orchestrator's context window focused on the master plan structure and the cross-document integration, not on file-by-file reading of large source files.

---

## Critical files modified this session

- `.agent/DEV_RULES.md` — major rewrite, v3.3.1 → v3.4.0
- `.agent/PROJECT_NAME.md` — Strategic Roadmap + IMPLEMENT-relationship section + spec-only callout
- `.agent/README.md` — broken paths fixed, new doc-map rows
- `.agent/AGENTS.md` — Document Map section added
- `docs/archive/v4_0/v4_0_1_IMPLEMENT.md` — NEW (master living roadmap)
- `docs/archive/v4_0/processed/` — six files moved in via `git mv`
- `docs/archive/research/README.md` — NEW (archival-role clarification)
- `docs/THOT_APP.md` — Last Updated, Status, Strategic Roadmap pointer, milestone bullet refs
- `~/Development/*/.agent/{DEV_RULES,PROJECT_NAME,README}.md` — synced via `filemgmt` to 9 projects

No source code under `src/` was changed.

---

## Session Notes

- The bug investigation subagent had access to the full codebase and produced concrete fixes for 4 of 5 bugs at high confidence. The remaining bug (0.3 line-wrap below 1040px) requires a 5-min DevTools spike that the BUILD orchestrator will do — flagged inline in IMPLEMENT.
- Bug 1.8 (list blank-line propagation) carries an explicit defer-to-BUGS off-ramp for quirk #2 (manual-blank auto-propagation) if it tangles with `indentOnInput` in ways that affect general indent UX. Quirks #1 and #3 (empty-bullet exit) ship in v4.0.0 regardless.
- Bug 0.2 (frontmatter detection) splits cleanly: the color collision is solved with a pale-yellow recoloring (low risk, ships in v4.0.0). The structural mis-tagging (parser assigning `documentMeta` to mid-doc hyphen lines) properly belongs in v5's scope rebuild — flagged that way in IMPLEMENT.
- The CLAUDE.md auto-load DOES work in current Claude Code — `.claude/CLAUDE.md` containing only `@.agent/AGENTS.md` is loaded automatically. The "more modern" alternative (settings.json `context` field) is cosmetic. Not changed; recommend leaving as-is.
- `filemgmt` worked smoothly on all sync operations. `rooted-joy/.agent/` was missing PROJECT_NAME.md and README.md — filemgmt added them via implicit-add, surfaced in output. Worth noting that project may need a fresh PROJECT_NAME fill-in.
- The `~/.claude/plans/hello-please-see-the-functional-otter.md` plan file was authored during plan mode and approved by Sean before execution. Per the standing convention, Sean files that file into the archive himself; agent does not.

---

## Picked Up From / Stopped At

**Branch state**: `dev`. Working tree dirty with documentation moves and additions only. No source code touched.

**Documentation state**: Workflow reset complete. Master `v4_0_1_IMPLEMENT.md` in place. Old v4_0_0 docs in `processed/`. Cross-project `.agent/` files synced.

**Next concrete actions, in order:**

1. **Sean**: review `v4_0_1_IMPLEMENT.md`. Provide feedback on any section. The v4.0.x chunk is ready to be promoted to `v4_0_0_BUILD.md` for the next session.
2. **Sean (if applicable)**: resolve Vercel block (recommended path: add `horvathaugust@gmail.com` as verified secondary email on `seanivore` GitHub account — see `processed/v4_0_0_DEV_PLANNING.md` § "Diagnose Vercel deploy block").
3. **Next session — option A (bug fixes)**: extract `v4_0_1_IMPLEMENT.md` § *Milestone v4.0.x* into a `v4_0_0_BUILD.md` packet, hand to an orchestrator. Orchestrator returns `BUILD_REPORT_v4_0_0.md`.
4. **Next session — option B (business plan kickoff)**: read `v4_0_1_IMPLEMENT.md` § *Parallel Track — Business Plan Kickoff* + `docs/archive/research/`; produce the four outputs documented there (scope statement, gap audit, research plan, `docs/BUSINESS_PLAN.md` skeleton).
5. **Sean (when time/energy)**: fill in `docs/research/1_DEEP/feature-research/FORMATTING_UX.md` and `COLUMNS_LAYOUT.md` — these unblock v5 spec drafting.

---

## Open Threads For Next Session

- **Vercel resolution**: still needs Sean's input before next deploy attempt. Doesn't block local build/merge work.
- **`package.json` version is `2.1.4`** — bumps to `4.0.0` as part of v4.0.0 ship commit (in IMPLEMENT § v4.0.0.10).
- **v4.0.0.9 line-wrap fix** — needs DevTools spike inside the BUILD; do not promote to BUILD without that 5-min note added.
- **Bug 1.8 quirk #2** — defer-to-BUGS path documented; flag if it shows up entangled.
- **`rooted-joy/.agent/` sync surfaced missing PROJECT_NAME.md and README.md** — filemgmt added them. Project may need a fresh fill-in pass when Sean is in that project next.
- **Research dirs**: kept both `docs/research/` (active protocol) and `docs/archive/research/` (older sketch layer). README in archive clarifies role. Business-plan kickoff session will mine the archive layer for reusable content.
