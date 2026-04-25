# Development Protocols

**Updated**: 2026-04-25
**Version**: v3.0.0

**Purpose**: Standardized development workflow for parallel feature development across any project.
**Use**: Copy to new projects in `_git_init/` directory. Sync updates with `frdoc` (see § *Syncing This Document*).

---

## How to Use This Document

These protocols work because the agents follow them — and because they *maintain* them. When you notice a project's organization, labeling, file naming, version-string format, or any other protocol aspect drifting from these standards, that is not just an observation. It is work to be done.

### Default behavior on protocol drift

- **A plan is active and the drift is in scope** — add the cleanup to the plan and complete it as part of the task.
- **A plan is active but the drift is out of scope** — surface it to the human ("I noticed `X` is inconsistent with §Y — fold into scope, defer, or skip?"). Let the human decide.
- **No plan is active** — raise it directly. You don't need permission to fix it, but flag it before you start, so the human can confirm it wasn't intentional and that token budget allows the cleanup.

### What this is NOT

- The human will not police your adherence to these protocols. Your work is not reviewed for compliance after the fact.
- Drift that you don't act on becomes drift the human inherits. The human has delegated this maintenance to you precisely so they can focus on strategy and creative work.
- "I'll mention it later" or "the user will catch it" is not acceptable. By the time it surfaces, the cleanup costs more.

### What this looks like in practice

- Filenames using dots instead of underscores → flag, fix in the current commit if cheap.
- An archive doc still in `docs/plans/` after its version shipped → flag and migrate to `docs/archive/v{X}/`.
- Tags with `-suffix` style hanging around when convention is clean numeric → flag and add a clean tag pointing at the same commit.
- Two sections of a doc covering the same content → flag and consolidate.
- A protocol step in this very document that has gone stale → propose an update; flag the inconsistency in the human's working copy.

You are responsible for protocol quality at the moment you encounter it. The human is responsible for the strategic and creative work that the protocols exist to protect.

---

## Core Philosophy

**Why This Matters**: LLMs often presume knowledge they don't have. Proper research upfront prevents wasted time debugging issues that could have been avoided with better planning.

**Core Principle**: Projects start with research and planning to the point of an exclusively executable implementation plan. No guessing, no "we'll figure it out when we get there."

---

## Versioning & Documentation Naming Convention

### 1. Version Number Format

Three-part semantic version: `vMAJOR.MINOR.PATCH` (e.g., `v3.1.2`).

| Position           | Bumps when                                                                | Examples                                            |
| ------------------ | ------------------------------------------------------------------------- | --------------------------------------------------- |
| **MAJOR** (first)  | Architectural rewrite, deployment-target change, breaking external change | SwiftUI → Web rewrite; PWA → native shell           |
| **MINOR** (second) | New feature, capability shift, breaking-but-internal change               | URL/anchor click handling; multi-window persistence |
| **PATCH** (third)  | Bug fix, doc-only update, micro-tweak that doesn't change feature surface | Single CSS fix; correcting a typo in `THOT_APP.md`  |

**Bumping a higher position resets lower positions to zero.** `v3.1.5` → next minor is `v3.2.0`, not `v3.2.5`.

A patch bump is justified for docs-only changes when those changes constitute a release artifact (e.g., a state snapshot, a feedback round closing). Trivial commit-message-level doc edits don't need a bump.

### 2. Delimiters — The One Rule That Matters

| Where                                                   | Delimiter        | Example                        |
| ------------------------------------------------------- | ---------------- | ------------------------------ |
| Version strings (prose, headers, package.json, READMEs) | `.` (dot)        | `v3.1.2`                       |
| Git tags                                                | `.` (dot)        | `git tag v3.1.2`               |
| Commit messages                                         | `.` (dot)        | `fix(persistence): … [v3.1.2]` |
| **Filenames only**                                      | `_` (underscore) | `v3_1_2_IMPLEMENT.md`          |

**Why filenames are different**: Dots in filenames have caused git/tooling issues historically. Underscores are the necessary exception, and *only* in filenames.

### 3. Git Tags — Clean Numeric Only

**Tags are pure version numbers. No suffixes.**

✅ `v3.1.2`
❌ `v3.1.2-single-draftpad`
❌ `v3.1.2-fix`

Human-readable release labels go in:

- The **commit message body** (`feat: … [v3.1.2]\n\nSingle persistent main draftpad fallback`)
- The **GitHub Release** description (created from the tag, optional)

If a tag needs to be re-pointed (a release was retracted and re-issued at a new commit), delete the old tag and recreate it at the new commit. Never create `v3.1.2-v2` or similar.

### 4. Directory Structure (canonical)

```
docs/
├── PROJECT_NAME.md          ← master architecture/state doc (living)
├── UPDATE_MAP.md            ← strategic roadmap (high-level only)
├── plans/                   ← active feature plans (in-flight only)
│   └── vX_Y_Z_feature.md
├── archive/
│   ├── v1/                  ← all v1.x.y artifacts
│   ├── v2/                  ← all v2.x.y artifacts
│   ├── v3/                  ← all v3.x.y artifacts
│   └── v4/                  ← in-progress + future v4.x.y artifacts
└── images/                  ← screenshots, diagrams (project-wide)
```

**One archive subdirectory per MAJOR version.** Per-minor subdirectories (e.g., `archive/v3/v3_1/`) are **optional** — adopt only when a single minor version generates more than ~5 archive files and the directory becomes hard to scan.

The `docs/` path is canonical. Older drafts that referenced `assets/docs/` were inaccurate to actual repo structure.

### 5. Archive Filenames

Two categories: **informal** (human writes these) and **formal** (agent-generated).

The version prefix (`v3_1_2_…` or `…_v3_1_2.md`) determines sort order. The chosen pattern below puts formal docs first by version number so a directory `ls` reads like a chronological build log.

**Informal (human's notes)**

| Filename pattern     | Purpose                                                               |
| -------------------- | --------------------------------------------------------------------- |
| `UPDATE_v3_2_0.md`   | Idea capture / planning notes for an upcoming version                 |
| `FEEDBACK_v3_2_0.md` | Feedback **received against v3.2.0** (drives the next patch or minor) |
| `v3_2_0_BUGS.md`     | Bug list discovered in v3.2.0 (drives v3.2.1)                         |

**Read the FEEDBACK suffix as "about" not "for"**: `FEEDBACK_v3_2_0.md` is *feedback about v3.2.0*. The agent's response lives in a new doc named for the version that *responds* (e.g., `v3_2_1_DEV_PLANNING.md`).

**Formal (agent-generated)**

| Filename pattern         | Purpose                                            | Mutability                                                 |
| ------------------------ | -------------------------------------------------- | ---------------------------------------------------------- |
| `v3_2_0_DEV_PLANNING.md` | Research, options, tradeoffs — what could be done  | Mutable until IMPLEMENT is locked                          |
| `v3_2_0_IMPLEMENT.md`    | The agreed-on executable plan                      | **Frozen at start of build**; updates require a patch bump |
| `v3_2_0_SESSION_DEV.md`  | Append-only build log (one entry per work session) | Append-only                                                |

**One IMPLEMENT per version.** SESSION_DEV may span multiple agent sessions for the same version.

If mid-build you discover the IMPLEMENT plan is wrong, don't edit it — write a new `v3_2_1_DEV_PLANNING.md` that responds to the discovery, and bump the version when the new plan locks.

### 6. File Lifecycle

```
Human writes UPDATE_v3_2_0.md or FEEDBACK_v3_1_x.md
   ↓
Agent writes v3_2_0_DEV_PLANNING.md  (research, options)
   ↓
Plan locks → v3_2_0_IMPLEMENT.md     (frozen, executable)
   ↓
Build begins → v3_2_0_SESSION_DEV.md  (append-only log)
   ↓
Build complete → tag v3.2.0, push to main
   ↓
Bugs surface → v3_2_0_BUGS.md or FEEDBACK_v3_2_0.md
   ↓
Next cycle starts as v3.2.1 (patch) or v3.3.0 (minor)
```

**Nothing is deleted.** Superseded plans stay in the archive as historical record.

### 7. Master Documents

Three master documents live outside the archive. Each has a single, explicit role.

| Doc                                                       | Role                                                      | Updated when                            |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------- |
| `docs/PROJECT_NAME.md` (e.g., `THOT_APP.md` for Thot)     | Single source of truth for current architecture and state | Every non-trivial change ships          |
| `docs/UPDATE_MAP.md`                                      | Strategic roadmap — what's next, why, in what order       | When direction shifts (not every patch) |
| `.agent/DEV_RULES.md`                                     | Rules of engagement — this document                       | When a convention is added or changed   |

If a fact is in an archive doc and conflicts with `PROJECT_NAME.md`, **`PROJECT_NAME.md` wins** (it's living; archive is frozen).

---

## Git Branching & Merging Protocol

We use a persistent `dev` branch for ongoing development integration, and `main` is strictly reserved for production-ready, tagged releases.

### Branch Structure

- `main` — Production-ready code only. No direct commits; only fast-forward merges from stable releases.
- `dev` — The primary integration branch for all ongoing development.
- `feat/*` or `fix/*` — Temporary branches for specific features or bugfixes. Deleted after merge.

### 0. Initializing a New Project

When starting a brand new repository, you must create the `main` branch first before setting up the `dev` environment:

```bash
# 1. Initialize git and make the first commit
git init
git add .
git commit -m "chore: initial commit"

# 2. Assign the primary branch as main (if not default)
git branch -M main

# 3. Create and switch to the development branch immediately
git checkout -b dev
```

### 1. Starting a New Feature

Always branch off the latest `main` to ensure a clean slate:

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

### 2. Update Ready To Ship (Merging to Main)

When a feature is tested and ready to go live, use this 5-step process to keep tags and remote repositories perfectly synced. **Tag is clean numeric only** — no suffixes (see § *Versioning § 3*):

```bash
# 1. Move to the production branch
git checkout main

# 2. Fast-forward main to your feature branch state
git merge --ff-only feat/your-feature-name

# 3. Push the clean update to remote main
git push origin main

# 4. Tag the release with a clean numeric version
git tag vX.Y.Z

# 5. Push the version tag to the remote
git push origin vX.Y.Z
```

### 3. Syncing the Development Branch

After successfully releasing a feature to `main`, keep `dev` up to date with the latest production state so parallel features don't drift:

```bash
git checkout dev
git merge main
git push origin dev
```

---

## Exclusively Executable Implementation Plans

### Requirements for Every Update Document

#### 1. Research Phase Complete

- All APIs/libraries documented with current best practices
- Browser/platform compatibility confirmed
- Performance implications understood
- Alternative approaches evaluated
- **Critical**: Don't presume you know how something works — verify with documentation

#### 2. Architecture Decisions Documented

- Why this approach over alternatives
- What trade-offs were made
- What constraints influenced the decision
- Future extensibility considerations

#### 3. Implementation Details Specified

- Exact file changes needed
- Dependencies to add (with specific versions)
- Configuration changes required
- Test cases defined
- Edge cases identified

#### 4. Common Pitfalls Identified

- Known issues with this approach
- Edge cases to handle
- Rollback strategy if needed
- Performance considerations

### Template Structure

```markdown
# [Feature Name] Implementation Plan

## Research Summary
[What we learned, what APIs/libraries we'll use, why]

## Architecture Decision
[Approach chosen, alternatives considered, trade-offs]

## Implementation Steps
[Detailed, sequential steps with file paths]

## Testing Strategy
[How to verify it works]

## Rollback Plan
[How to undo if it breaks]
```

---

## Context Management Strategy

**Problem**: Agents working on specific features don't need the entire roadmap in their context — it's noise and wastes tokens.

**Solution**:

1. High-level roadmap stays in `docs/UPDATE_MAP.md`.
2. Feature-specific plans go in `docs/plans/vX_Y_Z_feature_name.md` while in flight.
3. Agent instructions: *"Read `docs/plans/vX_Y_Z_feature_name.md` for your task. Do NOT read UPDATE_MAP.md."*
4. After completion: update roadmap with status, archive the plan to `docs/archive/v{X}/` (see § *Versioning § 4* for the canonical directory layout).

---

## Parallel Development Workflow

### How Companies Do This (and How We Can)

**1. Multiple Agents on Different Branches Simultaneously**

- Agent A: `feat/paired-delimiters` (v3.0.0)
- Agent B: `feat/file-operations` (v3.0.0)
- Agent C: `research/custom-highlighter` (future)

**2. Merge Conflict Prevention**

Before starting parallel work:

1. List all files each feature will modify.
2. Check for overlaps.
3. If overlap exists, sequence the work or refactor to separate concerns.

Example:
- Feature A modifies `src/editor.ts` (keymap section)
- Feature B modifies `src/editor.ts` (extensions array)
- Decision: Merge A first, B rebases and adds changes.

**3. Integration Protocol**

1. Complete feature A, merge to `dev`.
2. Feature B rebases on updated `dev`.
3. Resolve conflicts (should be minimal if planned well).
4. Run full test suite after each merge.
5. Update roadmap with completion status.

**4. Detailed Change Logs**

Each agent creates `docs/archive/vX/vX_Y_Z_SESSION_DEV.md` documenting:

- What changed (file-by-file)
- Why it changed
- Git diff confirmation
- Test results
- Any unexpected discoveries

### Best Practices

**During parallel work:**

- Each agent maintains a detailed change log.
- Test in isolation on the feature branch.
- Document any unexpected discoveries.
- Don't merge until fully tested.

**Merging finished updates:**

- Merge in order of completion.
- Second feature rebases before merging.
- Confirm no regressions.
- Update documentation.

---

## Agent Documentation Standards

Every agent working on an update must:

1. **Start with research** (even if it seems simple)
   - Read official documentation
   - Check current best practices
   - Verify browser/platform compatibility
   - Don't rely on training data alone

2. **Document assumptions** and verify them
   - "I assume X works this way" → verify with docs
   - "This should be compatible with Y" → test it
   - "Performance should be fine" → measure it

3. **Create before/after examples** for testing
   - What should work before the change
   - What should work after the change
   - Edge cases to test

4. **Confirm changes via git diff** before marking complete
   - Review every changed line
   - Verify no unintended changes
   - Check for debug code or comments left behind

5. **Update master technical doc** if architecture changes
   - Keep `docs/PROJECT_NAME.md` current
   - Document new patterns or conventions
   - Update architecture diagrams if needed

6. **Create archive document** in `docs/archive/v{X}/`
   - Full change log
   - Lessons learned
   - Known issues or limitations

---

## Research Phase Best Practices

### When Research Is Needed

- New API or library being introduced
- Unfamiliar technology or pattern
- Multiple implementation approaches possible
- Performance implications unclear
- Browser/platform compatibility unknown

### Research Deliverables

1. **API/Library Documentation Summary** — what it does, how to use it, browser/platform support, known issues
2. **Approach Comparison** — list 2–4 viable approaches; pros/cons; recommendation with reasoning
3. **Implementation Sketch** — rough code outline, key integration points, dependencies
4. **Risk Assessment** — what could go wrong, mitigation strategies, rollback plan

### Research Document Template

```markdown
# Research: [Topic]

## Question
[What we're trying to figure out]

## Findings
[What we learned from documentation, testing, research]

## Approaches Considered
### Approach A: [Name]
- Pros: ...
- Cons: ...
- Complexity: Low/Medium/High

### Approach B: [Name]
- Pros: ...
- Cons: ...
- Complexity: Low/Medium/High

## Recommendation
[Which approach and why]

## Implementation Sketch
[Rough code outline or integration points]

## Risks & Mitigation
[What could go wrong and how to handle it]
```

---

## Testing Standards

Before merging any feature:

1. **Functionality tests** — core feature works, edge cases handled, error states graceful
2. **Regression tests** — existing features still work, no unintended side effects, performance not degraded
3. **Cross-browser/platform tests** (if applicable) — Chrome, Safari, Firefox; desktop, tablet, mobile
4. **Documentation updated** — README if user-facing, technical docs if architecture changed, comments for complex logic

---

## Common Pitfalls to Avoid

### 1. Presuming Knowledge

- ❌ "This API probably works like this..."
- ✅ "Let me check the documentation to confirm..."

**Lesson**: The Thot v2.0.8 highlighting rewrite could have been avoided with proper upfront research.

### 2. Skipping Research Phase

- ❌ "This seems simple, I'll just implement it"
- ✅ "Let me research best practices first, even if it seems simple"

**Why**: Simple features often have hidden complexity. 30 minutes of research can save hours of debugging.

### 3. Not Documenting Decisions

- ❌ Implement feature, merge, move on
- ✅ Document why you chose this approach over alternatives

**Why**: Future developers (including AI agents) need to understand the reasoning to maintain or extend the feature.

### 4. Ignoring Edge Cases

- ❌ "It works for the happy path"
- ✅ "I've tested error states, empty inputs, edge cases"

**Why**: Edge cases cause bugs in production. Handle them upfront.

### 5. Not Confirming Changes

- ❌ "I made the changes, should be good"
- ✅ "Let me review the git diff to confirm every change is intentional"

**Why**: Unintended changes cause subtle bugs. Always review diffs.

---

## Code Structure

```
src/
├── main.ts                  # Entry point
├── [feature]/               # Feature-specific modules
│   ├── index.ts
│   ├── types.ts
│   └── utils.ts
├── styles/                  # Global styles
└── types/                   # Shared type definitions
```

(Directory structure for `docs/` lives in § *Versioning § 4* — single source of truth.)

---

## Commit Message Standards

### Format

```
type(scope): brief description

Longer explanation if needed.

- Bullet points for multiple changes
- Reference issues: Fixes #123
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring, no behavior change
- `test`: Adding tests
- `chore`: Maintenance (deps, config)

### Examples

```
feat(editor): add paired delimiter behavior

- Auto-insert closing brackets/quotes
- Skip over auto-inserted characters
- Wrap selection with delimiters
- Delete pairs when empty

Fixes #42
```

```
fix(highlighting): inline code markers now match content color

The tick marks for inline code were not adopting the red-orange
color. Fixed by adjusting CSS cascade order in theme.ts.

Fixes #38
```

---

## Pre-Deployment Checklist

(The merge-and-tag mechanics live in § *Git Branching & Merging Protocol § 2*. This is the higher-level checklist.)

1. All tests passing
2. Documentation updated (`PROJECT_NAME.md`, archive doc, etc.)
3. CHANGELOG entry (if the project keeps one)
4. Version bumped in `package.json` (if applicable)
5. Build successful (`npm run build` or equivalent)

After deploy:

1. Verify core functionality works.
2. Check error logs.
3. Monitor performance metrics.
4. Collect user feedback.

---

## Communication Standards

### When to Ask Questions

- Requirements are ambiguous
- Multiple valid approaches exist
- User preference needed
- Risk of breaking existing functionality

### How to Ask Questions

- Be specific about what you need to know.
- Provide context for why it matters.
- Suggest options if applicable.
- Don't ask questions you can answer through research.

### When to Make Decisions

- Best practice is clear from documentation.
- Technical constraint dictates approach.
- Previous patterns established in codebase.
- Low-risk change with easy rollback.

---

## Scaling Parallel Development

### Managing Multiple Projects

1. **Standardize structure** across projects — same directory layout, same documentation format, same git workflow.
2. **Reusable protocols** (this document) — copy to new projects, customize as needed, sync with `frdoc` (see below).
3. **Context boundaries** — each project has its own UPDATE_MAP, each feature has its own implementation plan, agents stay focused on their task.

### Maximizing AI Subscription Value

**Strategy**: Run multiple agents in parallel across projects.

- Claude Code: Project A, feature X
- Anti-Gravity: Project B, feature Y
- Cursor: Project A, feature Z

**Key**: Clear documentation and context management prevent agents from interfering with each other.

---

## Syncing This Document

This file is intended to be the same across projects. To propagate updates from one canonical copy out to every other project:

```bash
frdoc -n /path/to/canonical/.agent/DEV_RULES.md \
      -s ~/Development \
      -r .agent/DEV_RULES.md
```

`frdoc` (find-replace-doc) lives at `~/Development/scripts/frdoc`. Run `frdoc -h` for full help. The same script can be used to sync any canonical doc across projects (for example, a master `BRAND.md`).

---

## Lessons Learned

### From Thot v2.0.8 Highlighting Rewrite

**What happened**: Implemented highlighting system based on assumptions, discovered systemic issues, had to completely rewrite.

**What we learned**:

- Research the actual system architecture first.
- Don't guess at how complex systems work.
- 30 minutes of research saves hours of debugging.
- Document findings so future work doesn't repeat mistakes.

**How to prevent**:

- Always start with research phase.
- Verify assumptions with documentation.
- Test approach on small scale before full implementation.
- Document architecture decisions with reasoning.

### From Parallel Development Attempts

**What happened**: Multiple features touching the same files caused merge conflicts.

**What we learned**:

- Map file changes before starting parallel work.
- Sequence work if overlaps exist.
- Communicate between agents (via documentation).
- Rebase frequently to catch conflicts early.

**How to prevent**:

- List files each feature will modify in the implementation plan.
- Check for overlaps before starting.
- Merge frequently to minimize drift.

### From Anti-Gravity v3.1.0 Retraction (2026-03-02)

**What happened**: An agent merged v3.1.0 to `main`, tagged it, and wrote a "Recovery Walkthrough" describing the merge as final — all before the human had tested it. Live testing revealed autocorrect's backspace-undo was broken. The retraction required tag deletion, branch reset, and a fix-forward through v3.1.1 and v3.1.2.

**What we learned**:

- Don't write "completion" docs before live testing.
- Recovery walkthroughs and state docs must distinguish "I executed these git commands" from "the human verified the result."
- Suffixed tags (`v3.1.0-usability`, `v3.1.2-single-draftpad`) added cognitive load when retractions happened — clean numeric tags + commit-message labels would have been clearer.

**How to prevent**:

- Test live before tagging. The 5-step merge protocol (§ *Git Branching § 2*) puts the tag last for a reason.
- Use clean numeric tags only (§ *Versioning § 3*).
- Write state snapshots (`docs/archive/v{X}/v{X}_{Y}_{Z}_CURRENT_STATE.md`) only after the human has confirmed the deployed version works.

---

## Quick Reference

(These are mnemonic checklists. The authoritative steps live earlier in this document.)

### Starting a New Feature

1. Branch off `main` (§ *Git Branching § 1*).
2. Create implementation plan in `docs/plans/`.
3. Research phase if needed.
4. Implement with tests.
5. Review git diff.
6. Merge to `dev`.
7. Archive plan to `docs/archive/v{X}/`.

### Starting Research

1. Create research branch.
2. Document questions to answer.
3. Research and test.
4. Document findings.
5. Recommend approach.
6. Create implementation plan.

### Merging Features

1. Tests pass.
2. Review git diff.
3. Update documentation.
4. Merge to `dev`.
5. Delete feature branch.
6. Update roadmap status.
7. When ready to ship: fast-forward `main`, tag clean numeric, push (§ *Git Branching § 2*).

---

*This document should be copied to new projects and customized as needed. Maintain consistency across projects by syncing updates via `frdoc`.*
