# Thot Re-Orient → v3.4.0 Polish + v4.0.0 Research Stream

**Created**: 2026-04-27
**Project**: Thot (`/Users/seanivore/Development/thot`)
**Production**: v3.1.2 at thots.august.style
**Origin**: Saved from `~/.claude/plans/hello-the-other-zippy-reef.md` 
**Document type**: `DEV_PLANNING.md` (planning/research session, not a build/execution session)

---

## Context

Two days ago, a session captured the true state of Thot at v3.1.2, formalized the versioning convention (`.agent/DEV_RULES.md`), reconciled branches into `main` + `dev`, and added clean numeric tags. Sean has since renamed/moved a number of archive files to comply with that convention (everything under `docs/archive/v3_3/` and `docs/archive/v4_0/`).

Sean has now drafted `docs/archive/v4_0/UPDATE_v4_0_0.md` — a sweeping notes-and-feedback document spanning two distinct categories of work that weren't intentionally separated (the doc was started by a state-assessing agent, then Sean appended his own notes after):

1. **Visible polish + bug fixes** shippable in 1–2 sessions. Title-bar duplication, line-number CSS, list-formatting bugs, frontmatter color, paste behavior, line-wrap regression, PWA window-restore, multi-tab sessions, etc.
2. **Forward-thinking, AI-era product questions** that need real research before they can be planned: AI integrations (predictive completion, format-on-save), auth + user accounts, cross-device sync, live multi-user collab for markdown teams, SwiftUI native wrapper, monetization, business positioning, market research.

**Strategic framing (per Sean's session note):** Thot's target market is **wider than developers**. The "little bits of magic" that markdown users get from IDE-style highlighting (instantly seeing structure without searching for it — reduced cognitive load) should be accessible to people who'd never voluntarily learn markdown. The pitch is a Word-processor replacement that happens to use markdown semantics — not a markdown editor that hopes mainstream writers convert. Adjacent strategic gap: there is no good real-time collaborative editor for teams writing markdown together (the way marketing teams use Google Docs); given how much modern work is "iterate on a doc with humans + AI," this is a market opportunity worth investigating, not just a feature.

The intent is to do both tracks in parallel: ship quick polish soon, and stand up a structured research stream for the bigger v4.0.0 vision modeled on the proven data-edger workflow (3-phase: `1_DEEP/` → `2_FOCUS/` → `3_FINAL/`) with explicit iterative review/gap-fill loops via subagents.

**Forward-compatibility constraint on Track A:** A near-future minor (likely **v3.5.0**) will introduce a **User Preferences UI** for theming/customization (color tokens, etc.) — useful for both markdown power-users and the wider non-markdown audience. Track A doesn't build that UI, but every visual change in Track A should land as a CSS custom property / centralized token so the eventual settings UI just swaps values rather than rewriting CSS.

This plan organizes both tracks and addresses the meta-tooling questions Sean raised (verifying `frdoc`, codifying a reusable research protocol).

---

## State verified at session start (2026-04-27)

Deltas from the 2-day-old project memories — verified against current code:

| Item                          | State                                                           | Action needed                          |
| ----------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| `main` branch                 | At v3.1.2 (`47f8b20`)                                           | None                                   |
| `dev` branch                  | 1 commit ahead (`dd6f27c` versioning note)                      | Continue work here                     |
| `package.json` `version`      | **`2.1.4`** ⚠️ stale                                             | Bump to `3.1.2`                        |
| Tags                          | Clean `v3.1.0/1/2` + legacy suffixed exist                      | None — convention locked               |
| `.agent/UPDATE_DEV_RULES.md`  | Removed (merged into `DEV_RULES.md`)                            | None                                   |
| `.agent/DEV_RULES.md`         | Current, references `frdoc`                                     | None                                   |
| `.agent/AGENTS.md`            | Next.js template residue (`BEGIN:nextjs-agent-rules`)           | Clean / replace with Thot-specific     |
| `frdoc` script                | Installed at `~/Development/scripts/frdoc/frdoc.sh`, documented | Test once in this repo to confirm      |
| `docs/THOT_APP.md`            | Current at v3.1.2                                               | Update again at next ship              |
| `docs/UPDATE_MAP.md`          | Stale at v3.1.0 (2026-03-02)                                    | Refresh after v3.4.0 ships             |
| `README.md`                   | No version, generally accurate                                  | Refresh scope at v4.0 milestone        |
| `src/click-handlers.ts`       | Does not exist                                                  | v3.4.0 URLs/Anchors still spec-only    |
| FORMATTING/HIGHLIGHTING specs | Spec-only, branches deleted                                     | Move into research stream              |
| Icon dirs                     | 4 locations, duplicates                                         | Consolidation deferred to polish sweep |
| `vercel.json`                 | None in repo                                                    | Vercel env split is a dashboard task   |

---

## Track A — v3.4.0 Polish Release (next 1–2 sessions of code work)

**Target**: ship a tightly-scoped release that drains the bulk of `UPDATE_v4_0_0.md`'s small visible items + the URLs/Anchors feature already spec'd. Tag as `v3.4.0`. Single focused branch off `dev`.

### A.0 — Trivial sync (5 min, do first on `dev`)

- Bump `package.json` `"version"` from `2.1.4` → `3.1.2` (corrective, separate small commit before any feature work). Final ship-time bump to `3.4.0` happens in A.6.

### A.1 — CSS / chrome polish (very low risk)

Source: `UPDATE_v4_0_0.md` §Styling & Design.

**Forward-compat note:** every color/dimension introduced or changed below lands as a CSS custom property (e.g. `--thot-color-frontmatter`, `--thot-color-todo-checked`, `--thot-line-number-width`) defined in a single `:root` block. The User Preferences UI in v3.5.0 will read/write these. No hardcoded values.

- **PWA title-bar**: remove the duplicated `- Thot` suffix. Currently shows `Thot - daily-planner.md - Thot`; want `Thot - daily-planner.md`. Inspect document title source — likely a manifest + dynamic `document.title` doubling up. Critical files: `index.html`, wherever title is set in `src/main.ts` or a persistence module.
- **Line numbers CSS** (exact CSS edits Sean dictated):
  - `.ͼ5 .cm-lineNumbers .cm-gutterElement`: `width: 18px` → `25px`; remove `align-content: flex-end`; add `padding-right: 5px`.
  - `.ͼ1 .cm-lineNumbers .cm-gutterElement`: remove `padding: 0 3px 0 5px`.
  - These are CodeMirror-generated class names; verify they're stable or use a more durable selector. Tokenize the width into `--thot-line-number-width`.
- **Frontmatter color**: pale yellow (not orange — currently same as headings). Only highlight as frontmatter when at the top of the document AND with the canonical `---` fence — single hyphen line should not trigger.
- **Checked todo `[x]`** color: switch to a darker blue distinct from bullet-blue.

### A.2 — Editor behavior fixes (medium risk)

Source: `UPDATE_v4_0_0.md` §Update Feedback + §Notes Collected.

- **Line wrap stops below 1040px viewport** — fix wrap to be unconditional. Inspect editor container CSS / CodeMirror `EditorView.lineWrapping`.
- **Always paste as plain text** — install a paste transformer that strips formatting on every paste.
- **Curly→straight quotes on paste** — extend the same paste transformer to normalize `“ ” ‘ ’` to `" '`.
- **List formatting bleeds onto next line** — when a line follows a list, it shouldn't inherit list styling. Likely a parser/styling continuation issue.
- **Line-break-inside-list propagates blank lines** — adjust the list-continuation helper so a manual blank line in a list does not insert blank lines before each new bullet.
- **Single hyphen triggering frontmatter color** — tighten frontmatter detection to require the canonical opening fence at line 1.
- **`->` → `→`** — autocorrect rule (matches the existing autocorrect engine pattern).

### A.3 — URLs & Anchors (the original v3.2.0 feature, now folded into v3.4.0)

Implement per `docs/archive/v3_2/v3_2_0_IMPLEMENT.md` (the spec keeps its v3.2.0 filename — that's frozen archive history; the feature ships under v3.4.0):

- New file `src/click-handlers.ts` exporting `interactiveLinks()` extension.
- `EditorView.domEventHandlers` mousedown interceptor for CMD/Ctrl+Click on `URL` / `Link` syntax-tree nodes.
- Anchor jumping: slugify heading text, walk syntax tree for `ATXHeading`/`SetextHeading`, dispatch `EditorView.scrollIntoView()`.
- CSS: `cursor: pointer` on `.thot-url-link`.
- **Mobile/iOS gap**: CMD+Click doesn't exist on touch. Spec doesn't cover this. Recommend long-press → context menu for v3.5+ polish (note in plan; do not block ship).

### A.4 — Persistence + window/tab restoration

Source: `UPDATE_v4_0_0.md` §Persistence + §Notes Collected ("App always reopens to all open windows and tabs", "Tab view on PWA with default setting option").

- **Auto-save for CMD+N temp windows**: ephemeral `?id=temp-xyz` windows currently lose state on close. Extend persistence to auto-save temp windows under `thot:content:temp-xyz` with the same 500ms debounce. Treat the temp ID as durable (don't expire).
- **PWA "always reopen all open windows"**: maintain a `thot:open-windows` registry in `localStorage` listing every active `?id=*` window. On app launch with no `?id=` URL parameter, re-open the registry's entries (the main pad + each surviving temp window) as separate PWA windows / tabs. Macros around macOS Safari's PWA launch-param stripping (the v3.1.1 lesson) apply: keep the registry as the source of truth, not URLs.
- **Browser multi-tab sessions**: in regular browser context, the same registry enables opening multiple sessions across tabs without ID collisions. Tab in browser ↔ window in PWA — same partition mechanism, both supported.

UI for managing/listing saved windows is **out of scope** for v3.4.0 — that's part of the file-management feature deferred to Track B. Here we only ensure no work is silently lost.

Critical files: `src/persistence.ts`, `src/file-system.ts:newWindow()`, `src/main.ts` boot logic.

### A.5 — Out of scope for v3.4.0 (deferred)

- **User Preferences UI** — slated for **v3.5.0**. Track A only lays the CSS-token groundwork (per A.1 forward-compat note).
- **Share-link redesign** — needs UX decisions tied to the eventual auth/collab work; punt to research stream.
- **File-management UI / Finder-column hierarchy** — major UX feature; in research stream.
- **Vercel env split (prod ↔ dev URL)** — dashboard-only manual task; capture as a checklist item Sean does in Vercel UI, not a code change.
- **Icon directory consolidation** — bundle into the v3.5.0 branch alongside the Preferences UI work; not blocking and risky to mix with editor fixes here.

### A.6 — Ship steps

1. Branch: `git checkout dev && git checkout -b feat/v3.4-polish-and-anchors`
2. Implement A.0 → A.4 in atomic commits (one commit per fix).
3. Test in dev preview.
4. Update `docs/THOT_APP.md` to v3.4.0; update `docs/UPDATE_MAP.md` to reflect what's done and what's still pending.
5. Bump `package.json` `"version"` to `3.4.0`.
6. Merge to `dev` → fast-forward to `main` → tag `v3.4.0` → push.
7. Verify Vercel prod deploy.

---

## Track A.5 — v3.5.0 User Preferences UI (next minor after v3.4.0)

This is between Track A and Track B in scope. Not part of the v3.4.0 ship, but called out explicitly here so Track A's CSS-token groundwork makes sense.

**Why now:** Sean's strategic frame is widening Thot's audience beyond markdown users. A Preferences UI that lets a writer change "bullet color" without touching CSS is exactly the kind of low-cognitive-load surface that makes the highlighting magic accessible to people who'd never voluntarily learn markdown. It also opens the door to color-customization features Sean has flagged repeatedly.

**Scope to plan separately, not here:**
- Settings panel UI (modal? sidebar? PWA-friendly?).
- Token coverage (which CSS variables are user-editable in v3.5 vs locked).
- Persistence of user prefs to `localStorage` (`thot:prefs`) and forward path to per-account sync once auth lands.
- Reset-to-defaults, presets / themes (light theme is one open thread from `UPDATE_MAP.md`).
- Bundle icon directory consolidation here too (it's a `public/` cleanup, low risk to ship alongside).

This is the natural follow-up plan after v3.4.0 ships. Don't elaborate further until v3.4.0 is in production.

---

## Track B — v4.0.0 Research Stream (parallel, multi-session)

**Target**: stand up a structured research workflow for the genuinely-uncertain v4 product questions, modeled on `data-edger/docs/research/`. The output is *not* code — it's a sequence of research → focus → final docs that produce defensible implementation plans + a business plan.

### B.1 — Codify the research protocol

Create `.agent/RESEARCH_PROTOCOL.md` based on the data-edger pattern:

- **Three-phase directory layout** (`1_DEEP/`, `2_FOCUS/`, `3_FINAL/`) with explicit purpose for each.
- **Gate documents** — `RESEARCH_FINALIZATION.md` and `FINAL_REVIEW_BEFORE_<NEXT>.md` patterns as transition checkpoints between phases.
- **Draft → final naming** — `*_draft-v1.md` → `*.md` once consolidated.
- **Open-items appendix** — flag unanswered questions in an explicit appendix; never hide them.
- **Standard final-doc structure** — 11-section business-plan template, executive-summary variants per audience.
- **Cross-reference pattern** — how phase-1 docs cite phase-2 answers.

This file is generic, written so it can later sync via `frdoc` to other `~/Development/*` projects. Reference: `data-edger/docs/research/2_FOCUS/RESEARCH_FINALIZATION.md` and `FINAL_REVIEW_BEFORE_SWARM.md` are the in-the-wild templates.

### B.2 — Initialize Thot's research directory

Create `docs/research/` with the three-phase scaffolding. Seed `1_DEEP/` with the actual research questions Sean's UPDATE doc surfaces, bucketed:

- **`market-positioning/`** — explicit thesis: Thot is a Word-processor replacement that uses markdown semantics, **not** a markdown editor pitched at devs. Research the wider audience: marketing teams, writers, students, anyone using Google Docs / Notion / Word today. Identify what cognitive-load wins they'd notice (color coding, structure-at-a-glance) without ever knowing it's markdown. Compare to Notion, Craft, Bear, Obsidian, Drafts — which ones already serve this audience and where the gaps are.
- **`collab-for-markdown/`** — *strategic priority bucket*. How do teams currently write markdown together? (Spoiler from Sean's note: nobody knows. Devs use git PRs on text docs, which is absurd.) Research: what real-time collab solutions exist for markdown (HedgeDoc, Etherpad, GitHub.dev, VS Code Live Share)? CRDT vs OT for plain-text editing. What would "Google Docs for markdown" look like as a product? This is potentially Thot's defining differentiator.
- **`ai-features/`** — predictive tab completion in normal prose (Cursor/Anti-Gravity style), format-on-save (chart cleanup), other ambient AI affordances Sean has noted in Dia / meeting recorders / etc. Provider/model choice, cost model, where AI lives (client-side vs server-side), latency budget.
- **`auth-and-accounts/`** — passkey vs Google vs Apple, sync implications, free vs paid tier gating, account-less local mode preserved as default.
- **`sync-and-cross-device/`** — cross-device persistence architecture (CRDT? hosted KV? Supabase? Cloudflare D1?), minimum viable sync for single-user multi-device first, then layered into collab.
- **`monetization/`** — subscription tier boundaries, Stripe AI billing for token usage, agent-payment article Sean mentioned, free-tier rules that don't kneecap the product.
- **`native-apps/`** — modular SwiftUI wrapper feasibility, App Store vs direct distribution, macOS toolbar/notch jot pad, "drop in updated PWA" architecture, "AI loves outdated SwiftUI code" — what's current as of 2026.
- **`feature-research/`** — items lifted from `docs/archive/resources/`: revisit `FORMATTING.md` (intelligent dual-mode), `HIGHLIGHTING.md` (custom proprietary engine for finer color/highlight control), `ICONS.md` (consolidation plan).

Each bucket gets a `1_REVIEW.md` and `1_REFINE.md` capturing initial questions and gaps. The research itself happens session-by-session, ideally with `Agent` subagents for parallelizable web research.

### B.3 — Sequence the research (rough cadence)

Order matters because some answers gate others:

1. **Market positioning + collab-for-markdown first** — these define *who Thot is for* and the differentiating wedge. Everything else flows from this.
2. **AI features + auth + sync + monetization** — second wave. These constrain technical architecture, but the answer depends on Wave 1 (e.g. AI cost model differs wildly if collab is the headline vs solo-writer).
3. **Native apps** — downstream of architecture.
4. **Feature-research items (highlighting, formatting, icons)** — can run in parallel any time; they're tactical, not strategic.

The protocol's gate documents enforce that synthesis happens at the right moments rather than research drifting forever in `1_DEEP/`.

### B.3.1 — Iterative review loop on the v4 plan itself

The output of Track B isn't just research docs — it's a defensible **v4.0.0 implementation plan** that survives subagent scrutiny. The data-edger pattern's gate documents (`RESEARCH_FINALIZATION.md`, `FINAL_REVIEW_BEFORE_<NEXT>.md`) are explicitly designed for this. Apply the same loop to Thot:

- After each `1_DEEP/` bucket consolidates, run an Explore agent (or general-purpose subagent) to find gaps and contradictions vs publicly available info — the landscape is moving fast (per Sean's session note: "common service apps are changing lately"). Capture findings in a `1_REVIEW.md` per bucket.
- At the `2_FOCUS/` boundary, run a `Plan` agent to draft a candidate v4.0.0 implementation plan from the consolidated research; have a second agent (or fresh session) red-team it.
- Iterate until gaps are closed or explicitly flagged as open. Then promote to `3_FINAL/`.

### B.4 — Business plan / roll-out

Once the strategic-bucket research consolidates into `2_FOCUS/`, draft a `BUSINESS_PLAN.md` and `EXECUTIVE_SUMMARY.md` in `3_FINAL/` using the data-edger 11-section template. This produces the artifact needed for monetization launch and any pitch / partnership work.

---

## Meta / housekeeping (do alongside Track A)

Small items not worth their own version bump but worth knocking out:

- **Rewrite `.agent/DEV_RULES.md` § *Versioning & Naming Conventions / Archive File Naming Protocol*** using the clearer framing in `~/Development/_git_init/.agent/ABOUT_VERSION_FILENAME.md` (which Sean wrote 2026-04-27). Key improvements to carry over:
  - Lead with the **core design principle**: alphabetical sort *is* the chronological lifecycle. Currently mentioned in passing; should be the thesis.
  - Spell out the **why** behind each filename's sort position: `UPDATE_v(X+1)_0_0.md` leads with U because it must top a new major-version directory regardless of version number; `FEEDBACK` uses the version-being-reviewed in its filename because that puts it at the top of the directory it ends up in; `BUGS` works naturally because "B" precedes "D"/"I"/"S".
  - Carry forward Sean's "System Design Criticism" honestly — the DEV_PLANNING/SESSION_DEV pair sorts D-before-I-before-S accidentally, not by design; flag this as an open thread rather than papering over it.
  - This is a docs rewrite — bump DEV_RULES.md to v3.2.0 (minor: clarification of an existing rule). Do this **before** the frdoc test below, so when the sync command works, it propagates the cleaner version.
- **Verify `frdoc` works in this repo**: the `frdoc` script lives at `~/Development/scripts/frdoc/frdoc.sh` but the `frdoc` shell command isn't on PATH (Sean confirmed it's unrecognized in terminal as of 2026-04-27). Run `~/Development/scripts/frdoc/install_frdoc_command.sh` first to install the command, then test by syncing the freshly-rewritten `.agent/DEV_RULES.md` to a sandbox target. Document the verified incantation in `.agent/DEV_RULES.md` § *Syncing This Document* if anything was missing.
- **Clean `.agent/AGENTS.md`**: strip Next.js template residue. Either delete (if `DEV_RULES.md` covers everything) or rewrite Thot-specific. Preserve the "BEGIN:about-human" Sean-context block.
- **`docs/archive/resources/` triage**: FORMATTING / HIGHLIGHTING / ICONS docs should be relocated into `docs/research/feature-research/` per B.2 to put them under the protocol, not floating as orphans.

---

## Critical files

**Track A (code):**
- `package.json` (version bump)
- `index.html`, `src/main.ts` (title-bar)
- `src/styles/main.css` (line-number CSS, frontmatter color, todo color)
- `src/editor.ts` (line wrapping, paste transformer install)
- `src/highlight-tags.ts` and/or `src/highlighter.ts` (frontmatter rule scope)
- `src/persistence.ts`, `src/file-system.ts` (auto-save for temp windows)
- `src/click-handlers.ts` (new — URLs/Anchors)
- Autocorrect engine module (`->` → `→` rule; quote normalization)

**Track A (docs):**
- `docs/THOT_APP.md` (bump to v3.4.0 at ship)
- `docs/UPDATE_MAP.md` (refresh roadmap)

**Track B (docs):**
- `.agent/RESEARCH_PROTOCOL.md` (new)
- `docs/research/{1_DEEP,2_FOCUS,3_FINAL}/...` (new tree)
- `.agent/AGENTS.md` (clean)

---

## Verification

**Track A:**
- `npm run dev` boots cleanly; `npm run build` succeeds.
- Manual smoke: type/edit, CMD+S → title bar shows `Thot - filename.md` (no duplicate). Line numbers display 3-digit numbers without clipping. List bullets behave per spec. Paste from Word/browser → plain text only, curly quotes normalized. `->` becomes `→`. Single hyphen line does not turn orange. CMD+Click on a URL opens new tab; CMD+Click on `[link](#heading)` jumps to heading. CMD+N → type → close → reopen the temp URL → content restored. Close PWA with N windows open → relaunch → all N windows reopen. Open multiple browser tabs → each maintains independent session.
- All new color/dimension changes are CSS custom properties in a single `:root` block (grep confirms no new hardcoded colors in changed selectors).
- `package.json` shows `"version": "3.4.0"` at ship; tag `v3.4.0` exists; Vercel deploy live.

**Track B:**
- `.agent/RESEARCH_PROTOCOL.md` exists and a fresh agent can read it cold and execute.
- `docs/research/1_DEEP/` has at least one populated bucket with real research questions captured.
- The protocol references `frdoc` for cross-project sync as a future step, not blocking.
