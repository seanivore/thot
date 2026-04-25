# Thot — Project Lessons Learned

**Purpose**: Project-specific incidents and what we learned from them. NOT synced via `frdoc` (every project gets its own).

The general protocols in `.agent/DEV_RULES.md` exist because of the patterns these incidents revealed — read this file when you want to understand *why* a rule is the way it is, not just what it says.

---

## v2.0.8 Highlighting Rewrite (2026-02-13)

**What happened**: Implemented a markdown highlighting system based on assumptions about how CodeMirror's Lezer parser, styleTags, HighlightStyle cascade, and ViewPlugins interacted. Discovered three systemic issues mid-build (Lezer styleTags depth mismatch, missing GFM parser, reversed CSS cascade order) and had to completely rewrite the highlighting architecture.

**What we learned**:

  - Research the actual system architecture first; don't model it from intuition.
  - Don't guess how complex framework internals work — read the source or the docs.
  - 30 minutes of upfront research saves hours of debugging later.
  - Document the architecture decision *with reasoning* so the next agent doesn't repeat the same mistake.

**How this shaped the protocols**:

  - § Exclusively Executable Implementation Plans now requires verified-not-assumed API claims.
  - § Common Pitfalls #1 ("Presuming Knowledge") cites this incident directly.

---

## Parallel Development Attempts

**What happened**: When multiple feature branches touched the same files (`src/editor.ts` keymap section vs extensions array), merge conflicts compounded and the second feature had to be substantially rewritten on top of the first.

**What we learned**:

  - Map every file each feature will modify *before* starting parallel work.
  - Sequence work if overlaps exist; don't pretend a refactor will resolve them mid-build.
  - Communicate between agents via documentation (the IMPLEMENT.md plan), not via after-the-fact merge surgery.
  - Rebase frequently to surface conflicts early when they're cheap to fix.

**How this shaped the protocols**:

  - § Parallel Development Workflow § 2 (Merge Conflict Prevention) was written specifically against this pattern.
  - The Gap-Finding Loop steered-review categories should always include "files modified" as a comparison axis when multiple parallel features are planned.

---

## Anti-Gravity v3.1.0 Retraction (2026-03-02)

**What happened**: An Anti-Gravity agent merged v3.1.0 to `main`, tagged it, and wrote a "Recovery Walkthrough" describing the merge as final — all before the human had tested the build live. Live testing immediately revealed autocorrect's backspace-undo was broken (typing `cant` → `can't`, then Backspace, did nothing useful). The retraction required tag deletion, branch reset, and a fix-forward through v3.1.1 and v3.1.2.

A second compounding issue: tags carried suffixes (`v3.1.0-usability`, `v3.1.1-multi-window`, `v3.1.2-single-draftpad`). When the original v3.1.0 was retracted and re-issued, the suffix style added cognitive load: which version is current? what does the suffix mean? are the suffixes part of the version or labels?

**What we learned**:

  - Don't write "completion" or "recovery" docs before the human has tested live. Recovery walkthroughs and state docs must explicitly distinguish "I executed these git commands" from "the human verified the result."
  - Suffixed tags hurt under retraction. Clean numeric tags + commit-message labels would have made the retraction a 5-minute cleanup instead of an hour of "wait, which tag is which?"
  - The 5-step merge protocol exists in this exact order — push, then tag, **after testing** — because of this incident. Test before tag.

**How this shaped the protocols**:

  - § Versioning § 3 mandates clean numeric tags only — no suffixes.
  - § Git Branching § 2 puts tagging *after* the push for a reason; the protocol presumes you've tested before reaching step 4.
  - § Session Document Handling's "Picked Up From / Stopped At" footer section is the explicit antidote to "completion docs written before completion."

---

## How to add to this file

When something notable happens — a bug class that took longer than it should have, a process failure that revealed a missing rule, a recurring pain point — add an entry here following this shape:

```
## [Incident Name] (date)

**What happened**: …

**What we learned**: …

**How this shaped the protocols**: …
```

Don't sanitize. The point is to remember the actual mistake, not the principle.
