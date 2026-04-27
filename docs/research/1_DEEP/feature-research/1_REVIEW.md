# Feature Research — Phase 1 Review

**Created**: 2026-04-27
**Version**: v0.1 (seed)
**Status**: Research Phase — open
**Wave**: parallel anytime (tactical, not strategic)

---

## Bucket Purpose

Tactical feature research that doesn't gate strategic decisions but needs to happen before specific features can ship. Each item here has an existing draft document (in `docs/archive/resources/`) that gets relocated into this bucket as part of v3.4.0 housekeeping.

---

## Items in this bucket

### Intelligent Formatting (dual-mode UI)

- **Existing doc:** `FORMATTING.md` (relocating from `docs/archive/resources/`)
- **Goal:** Visual formatting mode that hides markdown notation while editing — toggleable with a "show markdown" mode. Floating context menu on text selection (B, I, H1–H6, list, link, code).
- **Status:** Spec-only, never shipped. Branch `feat/v3-formatting` was deleted in v3.3 cleanup.
- **Open questions:** Is dual-mode (toggle) better than hybrid (always show some notation, hide others)? What does cursor behavior look like over hidden ranges? Does this conflict with the upcoming User Preferences UI in v3.5.0?

### Custom Highlighting Engine

- **Existing doc:** `HIGHLIGHTING.md` (relocating)
- **Goal:** Replace CodeMirror's `styleTags + HighlightStyle + ViewPlugin` 3-layer system with a single tree-walker engine where inner nodes override outer (priority by tree depth).
- **Status:** Spec-only, never shipped. Branch `feat/v3-highlighting` was deleted.
- **Open questions:** Is the rewrite justified vs. incremental fixes to the existing system? What measurable improvement does it produce? Performance impact on large files? Does it block or enable the v3.5.0 Preferences UI's color-customization features?

### Icon Consolidation

- **Existing doc:** `ICONS.md` (relocating)
- **Goal:** Resolve the 3+ icon directory duplication (`public/icons/`, `src/assets/icons/`, `dist/icons/`, `docs/favicon-and-other-icons/`). Single source under `public/`, proper `manifest.json`, correct `index.html` favicon links.
- **Status:** Spec-only. Per Track A.5 plan, this work bundles with v3.5.0 (Preferences UI) since it's a `public/` cleanup with low risk.
- **Open questions:** Which icon batch is the canonical source? Does the manifest need re-generation for current PWA install behavior in 2026 browsers? Any iOS-specific icon sizes that the favicon-generator batch missed?

---

## Initial Research Questions (cross-cutting)

1. **Sequencing** — which of these three blocks the others? (Probably none. They're independent enough to parallelize.)
2. **Should any of these get folded into the User Preferences UI (v3.5.0) work?** Custom highlighting and intelligent formatting both touch theming. Maybe — investigate during v3.5.0 planning.
3. **What did past attempts learn?** The `feat/v3-formatting` and `feat/v3-highlighting` branches were deleted; what was tried before being abandoned? Recovery from git reflog or commit history if needed.

---

## Priors / Known Constraints

- These items are tactical — they ship as feature work, not as strategic decisions. They don't gate the v4.0.0 strategic story.
- Per `RESEARCH_PROTOCOL.md`, this bucket can be researched in parallel with the strategic Wave 1 / Wave 2 buckets without conflict.

---

## Source Pointers

- `docs/archive/resources/FORMATTING.md` (until relocated)
- `docs/archive/resources/HIGHLIGHTING.md` (until relocated)
- `docs/archive/resources/ICONS.md` (until relocated)
- `docs/UPDATE_MAP.md` — flags v2.2.0 icon consolidation as still-pending blocker

---

## Open Items

- All. Seed only.
