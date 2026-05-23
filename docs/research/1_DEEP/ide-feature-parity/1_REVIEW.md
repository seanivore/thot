# IDE Feature Parity — Phase 1 Review

**Created**: 2026-05-20
**Version**: v0.1 (seed)
**Status**: Research Phase — open
**Wave**: 2 (depends on Wave 1 positioning)

---

## Bucket Purpose

Identify which features of today's popular IDEs (VS Code, Cursor, Antigravity) a markdown-focused tool must replicate in order to win IDE users over to Thot for their markdown work. The IDE-for-Markdown Replacement pillar states the goal plainly: a VS Code / Cursor / Antigravity user should be able to use Thot *instead of* their IDE when the task is editing markdown — READMEs, planning docs, implementation specs. This bucket frames that goal as concrete, answerable research questions rather than guesses.

The market signal underneath: Google's Antigravity now ships a *separate* IDE app alongside its agent-focused app — evidence that an IDE-adjacent-but-separate app is a real product category, which is the space Thot targets.

---

## Initial Research Questions

1. **File-explorer git-status indicators** — In an IDE file explorer, committed files render plain and modified-but-uncommitted files are marked (a color, an "M" suffix, etc.). What is the full vocabulary of state indicators IDEs show in the explorer (added, modified, untracked, staged, conflicted, ignored)? Which subset matters for a markdown workspace? How does VS Code render them vs. JetBrains vs. the VSC forks? This is the file-level analogue of Thot's already-spec'd line-number edit/add indicators — should the two share a visual language?
2. **Importing settings from VS Code / Cursor / VSC forks** — The forks expose a verbose four-way model ("Settings Default UI," "Settings Default JSON," "Settings User UI," "Settings User JSON"). Thot's simpler preferences design won't need that split — but it should support *importing* a VSC fork's settings so a migrating developer carries their config over. What is actually in a VSC settings export? Which keys map onto Thot preferences, which are irrelevant, which have no equivalent? How does this relate to the VSCode `textMateRules` highlighting-config paste/import path (see `highlighter-architecture/OPTIONS.md`)?
3. **Mount/open a repo from GitHub or a local directory** — Thot should let a user mount or open a whole repo, not just single files. Comparable apps: Claude Cowork prompts the user to mount a repo; claude.ai/code runs instances each linked to a GitHub repo; newer iPad/iOS coding apps increasingly use the same pattern. What does "mount a repo" require technically — GitHub OAuth + API for the remote case, File System Access API / native file pickers for the local case? How does it interact with Thot's persistence model and a future multi-note workspace? What is the smallest viable v1?
4. **The claude.ai/code-user market** — claude.ai/code users are a prime target: often on a device that can't or doesn't run a full IDE. With web Thot they could edit markdown without leaving the browser. The driving personal use case is editing markdown on an iPad in bed. How large is this audience? What is their actual workflow? What do they currently use for markdown editing on a no-IDE device, and what fails them?
5. **What broader IDE conveniences does a markdown editor actually need?** — Beyond the three above, study the IDE markdown-editing experience feature by feature: heading stacking / sticky scroll (already spec'd), command palette, quick-open / fuzzy file switcher, multi-cursor, find-across-files, diff view. Which are table-stakes for "use Thot instead of your IDE for markdown," which are out of scope?
6. **What NOT to replicate** — Thot is not becoming an IDE. No LSP, no code intelligence, no integrated terminal, no debugger. Where is the line between "IDE convenience a markdown writer benefits from" and "IDE feature that pulls Thot out of its lane"?

---

## Priors / Known Constraints

- Thot's editor is CodeMirror 6; the web app is the canonical product (PWA-first, native wrappers in vNext).
- The IDE-for-Markdown Replacement pillar frames the audience: developers whose work is shifting from coding to planning, iterating on markdown plans with humans and AI.
- Per `DEV_RULES.md`, training data ages fast; IDE feature research must check 2026 reality (VS Code / Cursor / Antigravity current behavior), not pre-training assumptions.
- Repo mounting forces decisions that touch auth (`auth-and-sync`), persistence, and the multi-note workspace (`feature-research/COLUMNS_LAYOUT.md`).
- The native apps must support the iPad-in-bed use case as well as the web app does — repo mounting and file-explorer state need a native-translation path (see the standing constraint in the IMPLEMENT doc's Strategic Pillars).

---

## Source Pointers

- `docs/archive/v5_0/v5_0_0_IMPLEMENT.md` § Strategic Pillars — "IDE-for-Markdown Replacement"
- `docs/archive/v5_0/v5_0_0_IMPLEMENT.md` § File Management & I/O — "IDE feature parity — items that win IDE users"
- `docs/archive/v4_0/thots.md` — Sean's session notes on Antigravity's separate IDE app, file-explorer git indicators, repo mounting, the claude.ai/code market

---

## Open Items

- All. Seed only.
