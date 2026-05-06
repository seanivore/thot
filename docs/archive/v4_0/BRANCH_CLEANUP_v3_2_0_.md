# Thot — Re-orient + Versioning Formalization + Branch Cleanup

## Context

Project paused ~one month ago mid-flight on the v3.2.0 URLs/anchors feature. An Anti-Gravity agent left confusing artifacts: a "Recovery Walkthrough" written *during* the work that read like a completion summary, and rapid-fire tag/retag activity around a v3.1.0 ship that was retracted because autocorrect's backspace-undo was broken in production. Sean fixed forward through v3.1.1 and v3.1.2, but the documentation never caught up with the actual outcome.

This session has three goals — all docs/git, no app code:

1. **Capture the true current state** in a single canonical document so the next session (potentially in a fresh context window) starts on solid ground.
2. **Formalize the versioning convention** Sean drafted in `UPDATE_DEV_RULES.md`, resolving its ambiguities so it can be applied consistently going forward and (eventually) sync'd across `~/Development/*` projects via script.
3. **Reconcile the messy branch state** into a simple `main` + `dev` model and replace the suffixed tags (`v3.1.2-single-draftpad`) with clean numeric tags (`v3.1.2`).

The bigger product questions Sean wrote about (modular SwiftUI wrapper, MacOS toolbar/notch jot pad, cross-device persistence, file hierarchy) are explicitly **next session**.

---

## What's actually true right now (state findings)

These are written into the new state doc, but flagging them up here because some contradict Sean's working memory:

- **Latest production tag is `v3.1.2-single-draftpad`** at commit `dd7407e` (Mar 3 2026). There is no plain `v3.1.2` tag. Same suffix issue on `v3.1.1-multi-window` (`fb425e9`) and `v3.1.0-usability` (`6181ea8`).
- **`main` is what's deployed to Vercel.** It has the v3.1.2 single-draftpad fix.
- **The repo's default PR base is `v2-first-thots`**, not `main` — that's a stale GitHub setting, unrelated to where prod is.
- **`feat/v3-urls-anchors` has no app code changes** vs `main`. Only docs commits + a merge of main back into it. Specifically: 3 new untracked files (Anti-Gravity transcripts) and 5 commits ahead, all docs.
- **The v3.2.0 URLs/anchors feature is spec-only.** `docs/archive/v3/v3_2_0_URLS_ANCHORS.md` describes the click-handler approach but no code was written.
- **v3.1 feedback items DO work in production** — Sean's correct that the live app is fine. The autocorrect regression that triggered the v3.1.0 retraction was fixed forward in subsequent commits before the multi-window work.
- **No `vercel.json` in repo.** The "Vercel wouldn't push from this branch" issue is a Vercel dashboard project setting (Production Branch is locked to `main`), not a repo-level config.
- **Local branches that may have stale unique docs:** `feat/v3-formatting`, `feat/v3-highlighting`, `dev`. Need to diff each against main before deleting.

---

## Plan

### Step 1 — Finalize the versioning convention

Rewrite `/Users/seanivore/Development/thot/.agent/UPDATE_DEV_RULES.md` cleanly. Hold structure where it works; resolve the seven ambiguities surfaced in research.

**Locked rules** (per Sean's stated preferences):

- **Underscores appear ONLY in filenames** (`v3_1_2_IMPLEMENT.md`). Reason: dots in filenames have caused git issues historically.
- **Dots everywhere else**: version strings in headers (`v3.1.2`), git tags (`v3.1.2`), package.json `version` field, commit messages, README mentions.
- **Tags are pure numeric**: no `-usability`, `-multi-window`, `-single-draftpad` suffixes going forward. Use the commit message body or a GitHub Release for the human-readable label.

**Ambiguities the rewrite will resolve:**

1. **Patch semantics.** Patch (third digit) = bug fixes, doc-only updates, micro-tweaks that don't change feature surface. Minor (second) = a feature, capability shift, or breaking-but-internal change. Major (first) = architectural rewrite, deployment-target change, or external breaking change.
2. **FEEDBACK file naming.** `FEEDBACK_v3_2_0.md` = feedback *received against* v3.2.0, written before v3.2.1 starts. The next plan doc that responds to it is `v3_2_1_DEV_PLANNING.md`. The `(+1)` notation is dropped — it caused the confusion.
3. **DEV_PLANNING vs IMPLEMENT vs SESSION_DEV lifecycle.** PLANNING = research/options/tradeoffs (mutable until IMPLEMENT is locked). IMPLEMENT = the agreed-on executable plan, frozen at start of build. SESSION_DEV = append-only build log written during execution. One IMPLEMENT per version; SESSION_DEV may span multiple agent sessions.
4. **Master document hierarchy.** `docs/THOT_APP.md` is the single source of truth for *current* state and architecture. `docs/UPDATE_MAP.md` is the strategic roadmap (what's next). `.agent/DEV_RULES.md` is the rules-of-engagement. Each archive doc is immutable once its version ships.
5. **Directory structure.** `docs/archive/v{X}/` per major version (existing convention). The proposal's per-minor subdirs (`v3_1/`, `v3_2/`) are noted as optional — adopt only when a minor version generates >5 archive files.
6. **Sync script.** Out of scope for this session. The plan documents *which* fields would be templated (delimiter rules, master doc paths, file-type definitions) and notes that a future script would live at `~/Development/_git_init/.agent/sync-dev-rules.sh`. Sean has a `_git_init` reference in the existing draft.
7. **Path correction.** Proposal references `./assets/docs/` — actual repo uses `./docs/`. The rewrite uses the actual path.

The rewrite produces a single revised `UPDATE_DEV_RULES.md`. Sean reviews. Once approved, it gets renamed to `DEV_RULES.md` (replacing the existing one) — separate small step, not part of this plan's writing phase.

**Critical files modified:**
- `.agent/UPDATE_DEV_RULES.md` (full rewrite)

---

### Step 2 — Write the canonical state document

Create `/Users/seanivore/Development/thot/docs/archive/v4/v3_1_2_CURRENT_STATE.md`.

(Note the path: under `v4/` per Sean's request, even though it documents v3.1.2 state. Treating `v4/` as the planning bucket for upcoming work.)

**Sections:**
- **What ships in v3.1.2** — prod features verified working: full markdown highlighting, autocorrect engine (with backspace-undo, CMD+Z, retype-without-retrigger, no-trigger-in-code-or-URLs), auto-capitalization, paired delimiters, native spellcheck, single persistent main draftpad with `?id=main` URL, CMD+N for ephemeral temp windows.
- **What's in flight / spec-only** — `v3_2_0_URLS_ANCHORS.md` is a spec, not code. Nothing else is mid-implementation.
- **What was attempted and abandoned** — original v3.1.0 ship → autocorrect backspace broken → reset → fixed forward. Multi-window URL partitioning (v3.1.1) → broke under Safari PWA restart → pivoted to single-draftpad (v3.1.2). The v3.1.1 multi-window implementation still exists in code as the CMD+N ephemeral window path.
- **Tags vs reality table** — `v3.1.0-usability` → `6181ea8`, `v3.1.1-multi-window` → `fb425e9`, `v3.1.2-single-draftpad` → `dd7407e`. Plan to add clean numeric tags pointing at same commits.
- **Anti-Gravity confusion archive** — explicit note that `v3_1_0_Recovery_Walkthrough.md` describes mid-work state as if final; treat with skepticism, prefer this state doc.
- **Open questions for next session** — modular SwiftUI wrapper feasibility, native-without-App-Store paths, cross-device persistence architecture, MacOS toolbar/notch jot pad integration, file hierarchy organization.
- **Branch state at session start** — current branch list, what each was for, what was deleted in cleanup (filled in after Step 4).

Files referenced as authoritative cross-checks (read but not modified):
- `docs/THOT_APP.md` (architecture)
- `docs/UPDATE_MAP.md` (roadmap targets)
- `docs/archive/v3/v3_1_FEEDBACK_2.md` (autocorrect UX behaviors that ARE live)
- `docs/archive/v3/v3_1_1_MULTI_WINDOW_PERSISTENCE_SAFETY.md` (the v3.1.1 → v3.1.2 pivot)
- `docs/archive/v3/v3_2_0_URLS_ANCHORS.md` (the unfinished spec)
- `src/main.ts`, `src/persistence.ts`, `src/file-system.ts` (verify single-draftpad code matches doc)

**Critical files created:**
- `docs/archive/v4/v3_1_2_CURRENT_STATE.md`

---

### Step 3 — Update `docs/THOT_APP.md`

Surgical update, not a rewrite. Targets:

- Header version: `**Version**: v3.1.0` → `**Version**: v3.1.2`
- Replace the v3.1.0 section content with v3.1.2 reality (autocorrect works, multi-window pivoted to single-draftpad, the URL `?id=main` partition mechanism)
- Add a one-line pointer at the bottom: "Most recent state snapshot: `docs/archive/v4/v3_1_2_CURRENT_STATE.md`"

`UPDATE_MAP.md` and `README.md` deferred — they touch product positioning Sean wants to think about next session.

**Critical files modified:**
- `docs/THOT_APP.md`

---

### Step 4 — Reconcile branches into `main` + `dev` only

Done as a sequence of safe, reversible git ops. Each step verified before the next.

**4a. Audit branches that might have unique docs.** For each of `feat/v3-formatting`, `feat/v3-highlighting`, `dev`, `feat/v3-multi-window`, `feat/v3-usability`, `fix/v3-pwa-state-restore`, `v2-first-thots`, `v1-deskpad`, `v1_deskpad_alt`: run `git log main..<branch> -- docs/ .agent/` to see if any unique doc commits exist. If yes, list them for Sean to decide. If no, branch is safe to delete.

**4b. Commit the 3 untracked Anti-Gravity docs onto current branch.** They're real artifacts of past work and should be in history.

**4c. Merge `feat/v3-urls-anchors` → `main`.** This brings the docs (Anti-Gravity files, Step 1 rules rewrite, Step 2 state doc, Step 3 THOT_APP update) into prod. Merge-only — no rebase, no force. Push to `origin/main`.

**4d. Add clean numeric tags.** `git tag v3.1.0 6181ea8 && git tag v3.1.1 fb425e9 && git tag v3.1.2 dd7407e && git push origin v3.1.0 v3.1.1 v3.1.2`. Leave the old suffixed tags in place for now (they're history) — Sean can delete on GitHub later if desired. Going forward, only clean numeric tags.

**4e. Recreate `dev` from `main`.** `git checkout main && git pull && git branch -D dev (if local) && git push origin --delete dev (if origin has it and we want fresh) && git checkout -b dev && git push -u origin dev`. *Confirm with Sean before deleting `origin/dev`* in case it has unique work — Step 4a checks this.

**4f. Delete merged branches.** Local + origin: `feat/v3-urls-anchors`, `feat/v3-multi-window`, `feat/v3-usability`, `fix/v3-pwa-state-restore`, `feat/v3-formatting`, `feat/v3-highlighting`. Leave `v2-first-thots`, `v1-deskpad`, `v1_deskpad_alt` alone (they're historical milestones, not feature branches — and `v2-first-thots` is the repo's default base; changing that is a GitHub web setting, separate task).

**4g. Update repo default base on GitHub.** Manual step Sean does in GitHub Settings → Branches: change default branch from `v2-first-thots` to `main`. Document in state doc.

**4h. Working state at end.** On `dev`, branched from `main`, clean tree, all of v3.1.2 docs/state captured, ready for v3.2.0 URLs/anchors implementation as the first work in next session.

**Files modified by this step:** none (git-only operations).

---

### Step 5 — Memory updates

Save four memories so a next-session-cold-start has the load-bearing facts:

1. **Project memory** — Thot is at v3.1.2 (single-draftpad). Next planned work is v3.2.0 URLs/anchors (spec exists at `docs/archive/v3/v3_2_0_URLS_ANCHORS.md`, no code). State doc lives at `docs/archive/v4/v3_1_2_CURRENT_STATE.md`. **Why:** Sean explicitly wants next session to pick up smoothly from a possibly-empty context.
2. **Project memory** — Branch model is `main` (prod, what Vercel deploys) + `dev` (active work). Tags are clean numeric only (`v3.1.2`, no suffixes). PRs go from feature branches → `dev` → `main`. **Why:** Sean asked to lock this in.
3. **Reference memory** — Versioning convention master is `.agent/DEV_RULES.md`. Underscores ONLY in filenames; dots everywhere else (versions, tags, prose). **Why:** Encoded preference that should not need re-explaining.
4. **Feedback memory** — Sean prefers proposing a coherent rewrite for review over question-by-question consensus when the input is well-specified but ambiguous. **Why:** Confirmed in this session's clarifying answer; saves round-trips.

Memory files written to `/Users/seanivore/.claude/projects/-Users-seanivore-Development-thot/memory/` per the auto memory system, with pointers added to `MEMORY.md`.

---

## Verification

End of session, the following should all be true:

- `git branch` shows `main` and `dev` (and historical `v1*`/`v2-first-thots`).
- `git tag --list 'v3.*'` shows clean `v3.1.0`, `v3.1.1`, `v3.1.2` (alongside legacy suffixed ones until manually cleared).
- `cat docs/THOT_APP.md | head -10` shows `v3.1.2`.
- `docs/archive/v4/v3_1_2_CURRENT_STATE.md` exists and reads cleanly cold.
- `.agent/UPDATE_DEV_RULES.md` is the rewritten version, ready to replace `DEV_RULES.md`.
- `MEMORY.md` has pointers to four new memory entries.
- Live app at the deployed URL (Sean tests by hand) still works — no app code touched, so this is a sanity check that nothing was inadvertently broken via the merge.

If anything in Step 4 fails or feels risky mid-flight, stop and check in. Step 4 is the only step that touches shared state (origin); everything else is local files.
