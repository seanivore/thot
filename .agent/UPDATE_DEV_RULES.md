# Versioning & Documentation Naming Convention

**Purpose**: One canonical convention for version numbers, archive filenames, and the lifecycle of planning/implementation/build-log docs. Drops into `.agent/DEV_RULES.md` as a new section. Designed to be sync'd across `~/Development/*` projects.

**Why this exists**: Without an enforced convention, archive files don't sort chronologically, version numbers drift between docs and tags, and "feedback on version N" gets confused with "feedback driving version N+1." This doc resolves those ambiguities once.

---

## 1. Version Number Format

Three-part semantic version: `vMAJOR.MINOR.PATCH` (e.g., `v3.1.2`).

| Position | Bumps when | Examples |
|---|---|---|
| **MAJOR** (first) | Architectural rewrite, deployment-target change, breaking external change | SwiftUI → Web rewrite; PWA → native shell |
| **MINOR** (second) | New feature, capability shift, breaking-but-internal change | URL/anchor click handling; multi-window persistence |
| **PATCH** (third) | Bug fix, doc-only update, micro-tweak that doesn't change feature surface | Single CSS fix; correcting a typo in `THOT_APP.md` |

**Bumping a higher position resets lower positions to zero.** `v3.1.5` → next minor is `v3.2.0`, not `v3.2.5`.

**A patch bump is justified for docs-only changes** when those changes constitute a release artifact (e.g., a state snapshot, a feedback round closing). Trivial commit-message-level doc edits don't need a bump.

---

## 2. Delimiters — The One Rule That Matters

| Where | Delimiter | Example |
|---|---|---|
| Version strings (prose, headers, package.json, READMEs) | `.` (dot) | `v3.1.2` |
| Git tags | `.` (dot) | `git tag v3.1.2` |
| Commit messages | `.` (dot) | `fix(persistence): … [v3.1.2]` |
| **Filenames only** | `_` (underscore) | `v3_1_2_IMPLEMENT.md` |

**Why filenames are different**: Dots in filenames have caused git/tooling issues historically. Underscores are the necessary exception, and *only* in filenames.

---

## 3. Git Tags — Clean Numeric Only

**Tags are pure version numbers.** No suffixes.

✅ `v3.1.2`
❌ `v3.1.2-single-draftpad`
❌ `v3.1.2-fix`

Human-readable release labels go in:
- The **commit message body** (`feat: … [v3.1.2]\n\nSingle persistent main draftpad fallback`)
- The **GitHub Release** description (created from the tag, optional)

If a tag needs to be re-pointed (e.g., a release was retracted and re-issued at a new commit), delete the old tag and recreate it at the new commit. Never create `v3.1.2-v2` or similar.

---

## 4. Directory Structure

```
docs/
├── PROJECT_NAME.md          ← master architecture/state doc (living)
├── UPDATE_MAP.md            ← strategic roadmap (high-level only)
├── archive/
│   ├── v1/                  ← all v1.x.y artifacts
│   ├── v2/                  ← all v2.x.y artifacts
│   ├── v3/                  ← all v3.x.y artifacts
│   └── v4/                  ← in-progress + future v4.x.y artifacts
└── images/                  ← screenshots, diagrams (project-wide)
```

**One archive subdirectory per MAJOR version.** Per-minor subdirectories (e.g., `v3/v3_1/`) are **optional** — adopt only when a single minor version generates more than ~5 archive files and the directory becomes hard to scan.

The `docs/` path is canonical. Older drafts that referenced `assets/docs/` were inaccurate to actual repo structure.

---

## 5. Archive Filenames

Two categories: **informal** (Sean writes these) and **formal** (agent-generated).

The version prefix (`v3_1_2_…` or `…_v3_1_2.md`) determines sort order. The chosen pattern below puts **formal docs first by version number** so a directory `ls` reads like a chronological build log.

### Informal (Sean's notes)

| Filename pattern | Purpose |
|---|---|
| `UPDATE_v3_2_0.md` | Idea capture / planning notes for an upcoming version |
| `FEEDBACK_v3_2_0.md` | Feedback **received against v3.2.0** (drives the next patch or minor) |
| `v3_2_0_BUGS.md` | Bug list discovered in v3.2.0 (drives v3.2.1) |

**Read the FEEDBACK suffix as "about" not "for"**: `FEEDBACK_v3_2_0.md` is *feedback about v3.2.0*. The agent's response lives in a new doc named for the version that *responds* (e.g., `v3_2_1_DEV_PLANNING.md`).

### Formal (agent-generated)

| Filename pattern | Purpose | Mutability |
|---|---|---|
| `v3_2_0_DEV_PLANNING.md` | Research, options, tradeoffs — what could be done | Mutable until IMPLEMENT is locked |
| `v3_2_0_IMPLEMENT.md` | The agreed-on executable plan | **Frozen at start of build**; updates require a patch bump |
| `v3_2_0_SESSION_DEV.md` | Append-only build log (one entry per work session) | Append-only |

**One IMPLEMENT per version.** SESSION_DEV may span multiple agent sessions for the same version.

If mid-build you discover the IMPLEMENT plan is wrong, don't edit it — write a new `v3_2_1_DEV_PLANNING.md` that responds to the discovery, and bump the version when the new plan locks.

---

## 6. File Lifecycle

```
Sean writes UPDATE_v3_2_0.md or FEEDBACK_v3_1_x.md
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

---

## 7. Master Documents

Three master documents live outside the archive. Each has a single, explicit role.

| Doc | Role | Updated when |
|---|---|---|
| `docs/PROJECT_NAME.md` (`THOT_APP.md` for Thot) | Single source of truth for current architecture and state | Every non-trivial change ships |
| `docs/UPDATE_MAP.md` | Strategic roadmap — what's next, why, in what order | When direction shifts (not every patch) |
| `.agent/DEV_RULES.md` | Rules of engagement — this file's parent | When a convention is added or changed |

If a fact is in an archive doc and conflicts with `THOT_APP.md`, **`THOT_APP.md` wins** (it's living; archive is frozen).

---

## 8. Branch Model (Reference)

The full branching protocol is in `.agent/DEV_RULES.md` § *Git Branching & Merging Protocol*. Summary:

- `main` — production, only fast-forward merges from tested releases
- `dev` — primary integration branch
- `feat/*`, `fix/*` — temporary, deleted after merge

Tags are applied **on `main`**, after the fast-forward merge, in the form `vMAJOR.MINOR.PATCH` (clean, no suffix).

---

## 9. Concrete Example

A version cycle for v3.2.0 (URLs/anchors feature) might leave behind:

```
docs/archive/v3/
├── UPDATE_v3_2_0.md           ← Sean's initial idea
├── v3_2_0_DEV_PLANNING.md     ← Agent research: CodeMirror click handlers, syntax tree iteration
├── v3_2_0_IMPLEMENT.md        ← Locked plan
├── v3_2_0_SESSION_DEV.md      ← Build log
├── FEEDBACK_v3_2_0.md         ← Sean's testing feedback after ship
├── v3_2_1_DEV_PLANNING.md     ← Agent's response to feedback
├── v3_2_1_IMPLEMENT.md        ← Locked patch plan
└── v3_2_1_SESSION_DEV.md      ← Patch build log
```

Tags created during this cycle: `v3.2.0`, then `v3.2.1`. Both clean, both numeric.

---

## 10. Sync Script (Future)

Out of scope for this revision, but documented so it's not lost:

A script at `~/Development/_git_init/.agent/sync-dev-rules.sh` would:

1. Treat `~/Development/_git_init/.agent/DEV_RULES.md` as master.
2. Find every `~/Development/*/.agent/DEV_RULES.md` and overwrite it.
3. Skip projects that have a `.agent/DEV_RULES.local.md` override file (escape hatch for project-specific deviations).

Project-specific values that would NOT be templated (each project keeps its own):
- `PROJECT_NAME` references in master doc names
- Branch naming conventions if a project has historical exceptions

Project-wide values that WOULD be templated (master controls):
- Delimiter rules (§ 2)
- Tag format (§ 3)
- File lifecycle (§ 5–6)

---

## Migration Notes (One-Time)

When rolling this convention out to an existing project:

1. **Don't rename existing archive files retroactively** unless they actively conflict — historical filenames are part of the record.
2. **Add clean numeric tags pointing at existing suffixed-tag commits** (e.g., `git tag v3.1.2 dd7407e` if the legacy tag was `v3.1.2-single-draftpad`). Leave the suffixed tags in place.
3. **Going forward, all new tags are clean numeric.**
4. **Update master docs (`PROJECT_NAME.md`, `UPDATE_MAP.md`)** to use dot-delimited version strings everywhere.

---

*This section, once approved, replaces any prior versioning guidance in `DEV_RULES.md`.*
