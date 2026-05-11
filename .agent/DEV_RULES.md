# Development Protocols

**Version**: v3.4.0
**Last Updated**: 2026-05-10
**Changes Made**: Replaced the old `DEV_PLANNING` / `SESSION_DEV` / `UPDATE` lifecycle with the four-file taxonomy (IMPLEMENT / SESSION / BUILD / BUGS). Killed the `IMPLEMENT_MASTER.md` concept — each version's `vX_Y_Z_IMPLEMENT.md` is itself the living roadmap. Added BUILD.md and `BUILD_REPORT_vX_Y_Z.md` to the Implementation Plans + Gap-Finding Loop sections, including the strict no-pass-through-between-tracks rule. Distinguished basic implementation research from the formal `RESEARCH_PROTOCOL.md` framework.
**Purpose**: Inform agents on our standardized project structure, documentation and development workflows.
**Syncing**: Sync any updates to all `.agent/DEV_RULES.md` files using `filemgmt` (see § *Syncing This Document*).

---

## Protocols That Make The Team Effective

  1. Agents **maintain lifespan documents** by actively building out archives for future reference
  2. Agents **follow standards** that maintain organization and consistency
  3. Agents support each other by taking initiative to **correct protocol drift** they encounter
     - When creating your session plan, integrate a cleanup step for the drift you observed. 
     - This is done whether or not you created the drift. 
     - If you discover issues while following your session plan, give human a heads up to make sure it is drift, then fix. 

**Your assistance in maintaining these protocols is greatly appreciated.**

---

## Development Philosophy

### Agentic Coding in 2026

| Activity | Time |
| -------- | ---- |
| Planning | 90%  |
| Building | 10%  |

### Maintain 9:1 Planning-to-Building Ratio

  - Start with the big-picture
  - Do full project planning: write the MASTER implementation plan
  - Always be thinking about where things are headed 
  - Take turns reviewing, have clean context agents review, always identifying gaps in the plan 
  - Iterate, identify gaps, research -> repeat this loop -> more times than we're historically comfortable with 

### Smart Session Track Creation

Knowing enough of the MASTER plan leads to smart session track creation. Tracks can run in parallel, setting each other up for success. Sequential tracks can pause if they find bugs or need to alter the plan so that an updated next track plan can be created. 

  * **Concurrent Documentation**: Documentation is being created for multiple features simultaneously. 

  * **Parallel Development**: Becoming aware of exactly what must be done before acting allows for more work in parallel, which is certainly not something much training data accounts for. 

### Beware Dated Agent Training Data 

Recognize that today's tools encourage a different, more modern workflow, contrary to the stream of consciousness, build-as-you-go approach; that method is outdated.

  * **The Challenge**: By design, LLMs expect answers come during active work. This stream of thought can blind one from recognizing gaps in knowledge, or considering if training data might now be out of date.

  * **The Solution**: This can be a strength, if handled during planning. Move "finding solutions" thinking out of active building, and into planning where there is opportunity for revisions and review.

  * **Why This Matters**: Even with extensive planning, something will fall through the cracks. This minimizes those instances helping to prevent time spent debugging later in the process. 

Implementation guide planning should involve:

  - Clear and concise documentation
  - Thorough research ensuring no assumptions 
  - Proving all knowledge is up to date 
  - Breaking down details into actual code
  - Many instances/eyes on implementation plans finding gaps 
  - Revision loops, closing gaps until plans are solid 

### Core Principle 

**Loop until the plan becomes EXCLUSIVELY EXECUTABLE**

Project implementation guide preparation occurs in a research and planning loop, ensuring that the orchestrating *agent following the plan to build requires no prior context*, *no guessing or looking anything up*. If something needed to be figured out, it should all have been accounted for during planning. 

Specific guide on [The Gap-Finding Loop](#the-gap-finding-loop) near the bottom of this document.

### AI's Struggles With Historic Processes

Historically code was given an extremely high-value for how time consuming and exhaustive the cognitive work was. The way most people learned to debug is based very specifically on this premise. We must question these workflows given the capabilities of current agents and learn to reassign value where it makes sense to do so. 

Agents today can write thousands of lines of code in minutes, often creating functional applications on a first build. One limitation is that LLMs can 'go down the wrong path' when producing output. This means that whole rewrites of features or functions can be more effective than the historic methods of debugging. 

Finally, we have to consider context windows. When bugs are 'patched' it is the code that is actually patched together. It can create a functioning application, but with a codebase that wasn't explicitly planned and never effectively documented. Consider what this mean for agents who work best from specifics where accuracy regarding the smallest details matter. 

### The Agentic Orchestration Paradox

The larger and more complex a task becomes, the more an AI naturally tries to shrink its scope to stay within its comfort zone — they manage context windows, rate limits, and fear losing the thread.

**This Is A Critical Paradox**: The only way to actually execute massive, complex projects is to force the AI to act as a high-level *orchestrator* that aggressively delegates to *subagents*.

If you do not explicitly enforce this hierarchy, an agent will attempt to complete an entire massive plan in one breath—inevitably dropping context, writing buggy code, or getting rate-limited. Complex plans must be decoupled into independent tracks, and execution must rely on Orchestrator Agents assigning deterministic, tightly scoped tasks to fresh subagents.

**Modern tools require modern workflows.**

---

## Versioning & Naming Conventions

### 1. Standard Version Number Format

A three-part semantic version is used: `vMAJOR.MINOR.PATCH` (e.g., `v3.1.2`). This is used throughout the life of the project, versioning from the first implementation guide document, updating it with each revision of the guide document, and then continuing the version numbers with the codebase itself, allowing future feature updates to continue smoothly.

| Position           | Bumps when                                                                |
| ------------------ | ------------------------------------------------------------------------- |
| **MAJOR** (first)  | Architectural rewrite, deployment-target change, breaking external change |
| **MINOR** (second) | New feature, capability shift, breaking-but-internal change               |
| **PATCH** (third)  | Bug fix, doc-only update, micro-tweak that doesn't change feature surface |

**Bumping a higher position resets lower positions to zero.** `v3.1.5` → next minor is `v3.2.0`, not `v3.2.5`.

A patch or minor bump is justified for docs-only changes if the changes were substantial and constitute a new artifact (e.g., a state snapshot, a feedback round closing). Trivial commit-message-level doc edits don't need a bump.

Updating docs-only examples: 

  * **Major**: Changing architecture (SwiftUI → PWA) 
  * **Minor**: Adjusting a feature (local only -> synched across devices)
  * **Patch**: Expanding implementation details (general steps -> production-ready code snippets) or (referencing a service -> actual API documentation or SDK usage)

Development example: 

  * **Major**: SwiftUI → Web rewrite; PWA → native shell
  * **Minor**: URL/anchor click handling; multi-window persistence
  * **Patch**: Single CSS fix for proper line numbering; correcting a typo in `THOT_APP.md`

### 2. Writing Version Delimiters

**Important**: Filenames are the only place that use underscores. Dots in filenames have caused git/tooling issues historically. Underscores are the necessary exception, and *only* in filenames.

| Where                                                   | Delimiter        | Example                      |
| ------------------------------------------------------- | ---------------- | ---------------------------- |
| Version strings (prose, headers, package.json, READMEs) | `.` (dot)        | `v3.1.2`                     |
| Git tags                                                | `.` (dot)        | `git tag v3.1.2`             |
| Commit messages                                         | `.` (dot)        | `fix(persistence): [v3.1.2]` |
| **Filenames only**                                      | `_` (underscore) | `v3_1_2_IMPLEMENT.md`        |

### 3. Git Tags

**Git tags use pure version numbers only. No suffixes. No extra labels for context.**

  - ✅ `v3.1.2`
  - ❌ `v3.1.2-single-draftpad`
  - ❌ `v3.1.2-fix`

Human-readable release labels go in:

  - The **commit message body** (`feat: … [v3.1.2]\n\nSingle persistent main draftpad fallback`)
  - The **GitHub Release** description (created from the tag, optional)

**Important**: If a tag needs to be re-pointed (a release was retracted and re-issued at a new commit), **never create `v3.1.2-v2` or similar**. Instead, delete the old tag and recreate it at the new commit.

### 4. Canonical Directory Structure

All planning documentation is created, updated, and remains forever in the `docs/archive`. The active feature plans or current and up-to-date implementation plan will always be the highest numbered version in the `docs/archive/vX_X` directory. This minimizes future document shuffling breaking any internal or external links to implementation plans, referenced paths, etc. 

**MUST have one subdirectory per MINOR versions, created based on needs and quantity of documents and revisions.** 

```plaintext
docs/
├── archive/
│   ├── images/                ← screenshots, diagrams (project-wide)
│   ├── resources/             ← reference, like tech docs used in a planning session
│   ├── v1_0/                  ← all v1.0.x artifacts
│   ├── v1_1/                  ← all v1.1.x artifacts
│   ├── v2_0/                  ← all v2.0.x artifacts
│   └── v3_0/                  ← all v3.0.x artifacts
├── research/                  ← (optional) only if active research is required — see Non-Archive Doc Directories below
├── planning/                  ← (optional) only if active non-implementation planning is required — see Non-Archive Doc Directories below
└── PROJECT_NAME.md            ← master architecture/state doc (living)
```

The roadmap is **not** a separate file — the highest-numbered `vX_Y_Z_IMPLEMENT.md` in `docs/archive/vX_Y/` is the living roadmap for the project. There is no `IMPLEMENT_MASTER.md`. See § *Master Documents* below.

**Note**: The `docs/` path is canonical. Older drafts that referenced `assets/docs/` were inaccurate to actual repo structure.

#### Non-Archive Doc Directories

Only create `docs/research` or `docs/planning` if there is active, ongoing research or planning that the project requires (e.g., a business plan needing market data). Move older rounds to `docs/archive/research/` (or equivalent) as work consolidates. When the work is done, the final result moves to a permanent home (`docs/BUSINESS_PLAN.md`, `docs/BRAND.md`) and the working directory is emptied. API or service references pulled in during planning move to `docs/archive/resources/` and stay there.

### 5. The Four File Types

Every artifact in `docs/archive/vX_Y/` is one of four types. Filenames are constructed so that an alphabetical `ls` of a version directory reads like the version's chronological lifecycle (`B` before `I` before `S`; `BUGS` sorts where the patch bump puts it).

#### `vX_Y_Z_IMPLEMENT.md` — the living roadmap

One per version, built up over many sessions. Holds the *entire* project roadmap, not just the next chunk — every milestone from the immediate polish work all the way out to vNext strategy. Sections detail their respective milestones with as much specificity as a real BUILD would need; un-investigated bugs and features are not allowed in IMPLEMENT (do the investigation, write the result).

As chunks are promoted to BUILD and shipped, the corresponding section in IMPLEMENT is marked built, condensed to a short summary, and the fine architectural detail is migrated into `docs/PROJECT_NAME.md`. The newest IMPLEMENT for a project is always the authoritative roadmap.

#### `vX_Y_Z_SESSION.md` — the session log

What an actual session did. Can include planning, research, AND informal dev work — there is no separation between "planning sessions" and "build sessions" except by intent. Filename uses the version the session *started under*; if the session drives a version bump, the banner inside declares "Driving vX.Y.Z → vX.Y.(Z+1)" and the next IMPLEMENT bears the new number. Sessions are marked off live as work completes, not written as a report at the end.

#### `vX_Y_Z_BUILD.md` — the execution-ready chunk

Created only when a chunk of IMPLEMENT has been judged ready to ship: investigated, exclusively executable, no decision-shaped questions remaining. Handed to an orchestrator agent who treats it as the entire job. The orchestrator returns a `BUILD_REPORT_vX_Y_Z.md` in the same directory capturing what changed, what gaps were found, and any bugs surfaced (see § *Implementation Plans Must Haves — BUILD.md and the BUILD_REPORT*).

#### `vX_Y_Z_BUGS.md` — bug tracking

A bug log, by patch version. Either the human files it after testing, or the agent creates it during a session when bugs surface. Subsequent fixes are planned in IMPLEMENT and executed via BUILD like any other work — bugs are not a different kind of artifact, only a different *origin*.

#### Unversioned sketch files

Anything in `docs/archive/vX_Y/` without a version prefix is a sketch/note: `FEAT_SETTINGS_UI.md`, `UPDATE.md`, `COOKIES_RESEARCH.md`, `REGROUP.md`. These inform planning; their actionable content migrates into the next IMPLEMENT and they remain as historical record (move to `processed/` once folded in).

#### Other supporting documents

`vX_Y_Z_FEEDBACK.md` from the human (review of an IMPLEMENT round) is supported but not required as a separate type — it is functionally a sketch file with a version prefix, and its content gets folded into the next IMPLEMENT.

### 6. Working Chronological Example

Sean files files into directories; agents file their own outputs only when explicitly told to. Otherwise agents receive paths to relevant documents at session start.

```
docs/
├── archive/
│   ├── v3_3/
│   │   ├── v3_3_0_IMPLEMENT.md      # Roadmap at v3.3.0
│   │   ├── v3_3_0_SESSION.md        # Session that shipped v3.3.0
│   │   └── v3_3_1_BUGS.md           # Human's post-ship bug report → drove v3.3.0 → v3.3.1
│   └── v4_0/
│       ├── v3_3_1_FEEDBACK.md       # Human's notes on v3.3.1 that opened v4 scope
│       ├── v4_0_0_BUILD.md          # The first executable chunk pulled off v4_0_0_IMPLEMENT
│       ├── BUILD_REPORT_v4_0_0.md   # Orchestrator's post-execution report
│       ├── v4_0_0_IMPLEMENT.md      # The living v4 roadmap
│       ├── v4_0_0_SESSION.md        # Session that ran the BUILD and reconciled the report into IMPLEMENT
│       └── v4_0_1_FEEDBACK.md       # Human review of v4.0.0 IMPLEMENT/BUILD → drives v4.0.0 → v4.0.1
└── PROJECT_NAME.md                  # Master architecture/state doc (living)
```

Note: `B` before `I` before `S` alphabetically, so a typical version directory reads in execution order. BUGS sorts at the patch bump that addresses them.

**Nothing is deleted.** Superseded plans stay in the archive as historical record — including the ones that turned out wrong. Future agents need to see the dead ends to understand the live decisions.

### 7. Master Documents

Two master documents live outside the archive. Each has a single, explicit role.

| Doc                       | Role                                                              | Updated when                          |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| `docs/PROJECT_NAME.md`    | Architecture, current state, design system, pitfalls — the living tech doc | Every non-trivial change ships        |
| `.agent/DEV_RULES.md`     | Rules of engagement; this document                                | When a convention is added or changed |

**The roadmap is not a master document.** The current `vX_Y_Z_IMPLEMENT.md` is the roadmap and lives in the version directory; there is no `IMPLEMENT_MASTER.md`. Architecture detail flows from IMPLEMENT into PROJECT_NAME as chunks ship, keeping IMPLEMENT focused on what's still ahead.

#### Conflict resolution

- A fact in a **past** version's IMPLEMENT that conflicts with `PROJECT_NAME.md`: **`PROJECT_NAME.md` wins**. It's living; past IMPLEMENTs are frozen snapshots.
- A fact in the **current** version's IMPLEMENT that conflicts with `PROJECT_NAME.md`: **IMPLEMENT wins**. PROJECT_NAME.md was likely neglected after planning; update it.

#### Session document behavior

A `vX_Y_Z_SESSION.md` is the live working document for the session — checkboxes marked **as work completes**, not at the end. If something unexpected changes the plan, note it inline at that step. If a step turns out wrong enough that a new plan is needed, **stop and start a new session** with a new SESSION doc; don't silently patch IMPLEMENT mid-build.

At session close, append three footer sections to the SESSION doc:

- **`## Session Notes`** — surprises, undocumented findings, things that ought to be in `PROJECT_NAME.md` or IMPLEMENT but weren't.
- **`## Picked Up From / Stopped At`** — exact resumption pointer: file:line, branch state, what's tested vs untested.
- **`## Open Threads For Next Session`** — deferred work, questions, things the human or next agent needs to act on.

These footers replace what other systems call "post-session walkthroughs" or "completion reports."

---

## Git Branching Merging Protocol

We use a persistent `dev` branch for ongoing development integration, testing, and debugging.

We use `main` branch as strictly reserved for **production-ready, tagged releases**, that were **tested, are bug-free**, and ready for the **public to download** the application and use the digital product.

### Branch Structure

  - `main` — Production-ready code only. No direct commits; only fast-forward merges from stable releases.
  - `dev` — The primary integration branch for all ongoing development.
  - `feat/*` or `fix/*` — Temporary branches for specific features or bugfixes. Deleted after merge.

### 0. Initializing a New Project

The basics create your project directory in the ~/Developments/ directory and populate the new directory with the basics we have prepared as a template for any new project. 

```bash 
# 1. Make sure you're in our Development directory
cd ~/Development
# 2. Create your project directory and move into it
mkdir <new-project> 
cd <new-project> 
# 3. Copy the repository skeleton into your new project
cp -R /Users/seanivore/Development/_git_init/. .
```

Then setup git and the GitHub repo for your new project. You must create the `main` branch first before setting up the `dev` environment:

```bash
# 1. Initialize git and make the first commit
git init
git add .
git commit -m "chore: initial commit"

# 2. Assign the primary branch as main (if not default)
git branch -M main

# 3. Create GitHub repository for project
gh repo create <new-project> --public --source=. --remote=origin

# 4. Push main branch to GitHub 
git push -u origin main

# 5. Create and switch to the development branch
git checkout -b dev
```

### 1. Starting a New Feature

Always branch off the latest `main` to ensure a clean slate:

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

### 2. Ready To Ship Updates Merged To Main

#### Pre-flight checklist (before any of the steps below)

  1. All tests passing.
  2. `docs/PROJECT_NAME.md` reflects current architecture (per § *Master Documents*).
  3. `vX_Y_Z_SESSION.md` complete with footer sections (per § *Master Documents → Session document behavior*).
  4. The `BUILD_REPORT_vX_Y_Z.md` for the chunk that just shipped exists and its findings have been folded back into IMPLEMENT (per § *Implementation Plans Must Haves — BUILD.md and the BUILD_REPORT*).
  5. Version bumped in `package.json` if applicable.
  6. Build succeeds (`npm run build` or equivalent).

When the checklist is clean and the feature is tested, use this 5-step process to keep tags and remote repositories perfectly synced. **Tag is clean numeric only** — no suffixes (see § *Versioning § 3*):

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

## Implementation Plans Must Haves

Details from our **development philosophy**: plan Exclusively Executable guides.

### Requirements for Every Update Document

#### 1. Research Phase Complete

  - All APIs/libraries documented with current best practices
  - Always find API documentation that is current; tech is moving faster than ever
  - Browser/platform compatibility confirmed
  - Performance implications understood
  - Alternative approaches evaluated
  - **Critical**: Don't presume you know how something works; verify with documentation and show proof in document 

#### 2. Architecture Decisions Documented

  - Why this approach over alternatives
  - What trade-offs were made
  - What constraints influenced the decision
  - Future update map considerations: work smarter not harder, this isn't a race

#### 3. Implementation Details Specified

  - Exact file changes needed 
  - Use production ready code snippets, NEVER PLACEHOLDERS, we have no hygiene policy 
  - Dependencies to add with their specific versions
  - Configuration changes required are finely detailed 
  - Test cases defined, planned, documented 
  - Edge cases identified, planned, documented 

#### 4. Common Pitfalls Identified

  - Known issues with this approach
  - Edge cases to handle
  - Rollback strategy if needed
  - Performance considerations
  - Write what a new instance with no context must know 
  - What might you have changed if you didn't know how development progressed 

#### 5. Confirmed Decisions Only

The `vX_Y_Z_IMPLEMENT.md` the executing agent reads contains **only confirmed decisions**. Nothing is up for re-evaluation during execution.

  - No decision framing, no alternatives, no "we could X or Y", no "Decision Dn" markers, no "TBD".
  - Everything has been discussed, researched, and locked in earlier sessions (`SESSION.md` or upstream `FEEDBACK.md`).
  - A `BUILD.md` is even stricter: it is a chunk extracted from IMPLEMENT once that chunk is judged exclusively executable. If something still reads like a decision in the BUILD, it belongs back in IMPLEMENT — not in front of the executing orchestrator.
  - If a subagent surfaces a decision-shaped question during execution, that is a real bug in the plan. Stop, surface to the human, fix the plan, then continue. **Never decide on the agent's own.**

This is what makes "exclusively executable" mechanically true: the agent has nothing to decide, so it cannot accidentally decide wrong.

#### 6. No Mixed Truth

Never feed an executing agent both a known-wrong fact and the right one at the same time. LLMs cannot be trusted to consistently pick the right one when both are present in their context. Mixing wrong with right is a setup for the model acting on the wrong one.

  - "Wrong truth" examples that must be removed or fixed *before* the agent sees the plan: stale endpoint paths, superseded decisions, bugs noted but not yet patched, "carry forward from `vX_Y_Z`" redirects, "Phase 0 fixes the following bugs" sections folded into forward spec.
  - Code-level bug fixes happen in a **prep session** before the executing agent gets the plan. Only the post-fix world enters the next version's IMPLEMENT.md.
  - Closeout reports, session reports, bug reports, and pre-flight findings are *historical artifacts*. Their content folds into the next IMPLEMENT.md as standing behavior, not as references the agent must reconcile.
  - The executing agent's required-reads list never includes a closeout, bug report, or earlier-version IMPLEMENT.md. The highest-version IMPLEMENT.md is the current truth; everything else is archive.

The mechanical rule: **fix or remove, then execute.** Do not ask an LLM to debug your own context.

#### 7. Parallel-Workflow Groundwork (The Orchestrator's Blueprint)

IMPLEMENT.md gives the executing orchestrator an explicit starting point for parallel work. Don't make them design the parallel structure cold. This is the operational layer of combating the Agentic Orchestration Paradox.

  - **Subagent Groupings:** Per phase, propose explicit subagent groupings. Define which deliverables can run in parallel, which dependencies sequence them, and what context specifically needs to be passed to each subagent. 
  - **Boundaries of Delegation:** Explicitly state what the orchestrator does NOT delegate (e.g., gate decisions, branch state, commit cadence, escalation calls, verification reads). The orchestrator manages the pipeline; the subagents do the typing.
  - **Placeholders as Decouplers:** Use strict placeholder conventions (`<!-- PLACEHOLDER: ... -->`) to sever dependencies between teams (e.g., allowing frontend UI subagents to build in parallel with backend API subagents).
  - Treat the groupings as a *starting point*, not a contract — the orchestrator may refine them during execution. The plan's job is to remove the cold-start design problem so the agent can spend its context on orchestration, not architecture.
  - This is also a quiet form of best-practice modeling: every IMPLEMENT.md that mandates subagent delegation reinforces the orchestration habit across future projects.

### BUILD.md and the BUILD_REPORT

IMPLEMENT is a *living roadmap*. BUILD is a *frozen execution chunk*. The two play different roles and the boundary between them is strict.

#### When to create a BUILD

A `vX_Y_Z_BUILD.md` is created only when a chunk in IMPLEMENT has cleared the gap-finding loop and is judged exclusively executable: every fact verified, every decision made, every code change spelled out file:line. If you find yourself promoting an under-specified chunk to BUILD just to "get moving," stop — the right move is more planning, not earlier execution.

#### What a BUILD contains

A BUILD is a self-contained packet handed to one orchestrator. It contains:
- The exact scope of work (which files, which functions, which lines).
- Production-ready code snippets (not pseudocode, not placeholders).
- The verification plan for this chunk (how the orchestrator confirms each change worked).
- Subagent groupings for parallel work within the chunk (per § *Parallel-Workflow Groundwork*).
- Pre-flight + rollback steps for the chunk specifically.

A BUILD does **not** contain forward-looking roadmap, milestone framing, or content not directly executable. Reference content stays in `PROJECT_NAME.md` and `archive/resources/`.

#### What the orchestrator returns: `BUILD_REPORT_vX_Y_Z.md`

After execution, the orchestrator writes a `BUILD_REPORT_vX_Y_Z.md` in the same version directory. The report captures:
- **What changed** — every file modified, with one-line summaries (not a `git diff` paste; a human-readable summary).
- **What deviated from the BUILD** — anything the orchestrator decided differently and why. Ideally empty; non-empty entries are signal that the BUILD was under-specified.
- **Gaps and bugs surfaced during execution** — anything the orchestrator hit that wasn't anticipated. These do not get fixed inside the BUILD itself; see the next subsection.
- **Verification results** — what passed, what failed, what's still untested.

The report's findings are then folded back into the next planning round and into IMPLEMENT.

#### The strict no-pass-through rule

When a BUILD surfaces a gap or bug — even one that affects a *sequential* track planned right after this one — **do not patch the next BUILD inline**. Do not add "also fix X" to the next orchestrator's packet.

Instead:
1. The current BUILD finishes its declared scope (and reports the issue).
2. A planning session updates IMPLEMENT to reflect the gap.
3. A new `vX_Y_Z+1_BUILD.md` is created for the next track *with the gap already resolved* — the next orchestrator never sees the conflict.

The reason: an LLM orchestrator handed a BUILD with both correct and corrected information present cannot be trusted to consistently pick the right one. We never feed an executing agent mixed truth (see § *Implementation Plans Must Haves — 6. No Mixed Truth*). Pass-through fixes are exactly that — mixed truth — and they erase the value of the planning loop.

### The Gap-Finding Loop

The point of "Exclusively Executable" is that the plan can be built without further clarification. The only way to *know* it's there is to have many cold sets of eyes try to find gaps before any code is written.

This is the operational layer of the *Planning takes 10× implementation* philosophy. Without it, the philosophy stays aspirational and agents revert to "this seems fine, let me code." With it, the philosophy becomes a process.

#### Process

  1. **Orchestrator** (the Claude instance you're working with directly) drafts or extends `vX_Y_Z_IMPLEMENT.md`. The IMPLEMENT is *living* — sessions add to it, refine it, reorganize it. There is no separate "draft DEV_PLANNING" artifact; the SESSION doc is the working log of what the session did to IMPLEMENT.

  2. Orchestrator spawns review subagents in alternating modes:

     - **Steered review** — orchestrator picks 3–5 categories specific to the project type (examples: "auth flow edge cases, payment failure modes, schema migration safety, file-system permission boundaries"). The subagent receives the chunk under review plus those categories and reports gaps within them.
     - **Cold review** — subagent receives the chunk with no categories, only the instruction *"find every gap, ambiguity, contradiction, or unverified claim."* The cold reviewer often finds things the steered ones miss.

     **Why both:** Steered reviews go deep on known risk areas. Cold reviews catch the unknown unknowns. We have observed non-Claude reviewers (e.g., a human's ChatGPT instance during product planning) catch significant gaps that focused passes had glossed over. Both kinds of pass have value.

  3. Orchestrator integrates real findings directly into IMPLEMENT and notes the integration in the SESSION log.

  4. Repeat — alternate steered and cold passes, **fresh subagent each pass** (no context contamination from prior reviewers).

  5. **Stop conditions** (any one):
     - Two consecutive passes return only nitpicks (define "nitpick" as: orchestrator can resolve without research).
     - An architecture-level decision surfaces — pause, surface to human, wait for direction.
     - Token / time budget reached — pause, ask human whether to continue.

  6. When a chunk passes the loop, human reviews and approves promotion to a `vX_Y_Z_BUILD.md`. **No code is written before this gate.** A BUILD is created from the cleared chunk; the orchestrator who runs the BUILD writes a `BUILD_REPORT_vX_Y_Z.md`; findings from the report flow back into IMPLEMENT for the next round.

#### Why Fresh Subagents Matter

A reviewer who has already seen draft v1 of the plan unconsciously fills in gaps from memory rather than catching them. The cold-read reaction is the reviewer's whole value. **Always spawn a new instance per pass.**

#### Orchestrator's Role During Loops

Maintain context. The orchestrator is the one who notices when a reviewer's "gap" is actually an architecture-level decision masquerading as a detail (and therefore needs human input, not more research). The orchestrator also prevents *plan drift* — fresh reviewers don't know what the plan was for, only what it says, so they sometimes propose changes that subtly reshape the architecture. Steer them back, or surface to human.

### Template Structure

The IMPLEMENT template below is intentionally lean. Reference content does **not** live in IMPLEMENT — it lives in `docs/PROJECT_NAME.md` (architecture, glossary, current state) and `docs/archive/resources/` (API specs, schemas, integration docs pulled from external sources during planning).

This is a deliberate forcing function: by sending the reader *out* of IMPLEMENT for context, we keep `PROJECT_NAME.md` honest and updated.

#### IMPLEMENT.md template (the living roadmap)

```markdown
# v[X.Y.Z] Implementation Plan

**Date opened**: [start date]
**Status**: [in active build / planning / superseded]
**Required reading first**:
  - `docs/PROJECT_NAME.md`
  - `README.md`
  - [other archive/resources/* docs as applicable]

**If you find missing context as you read this**: `PROJECT_NAME.md` is meant to be living. Confirm with the human and update it; don't paper over the gap inside this document.

---

## Roadmap Overview
[Milestone-level table of what this version is and what comes after — every milestone from immediate work to vNext strategy. Brief.]

## Milestone vX.Y.Z — [name]
[Detailed plan for the immediate work. Phases, file:line specifics, production-ready snippets, verification, rollback. When a chunk here is judged exclusively executable, it is promoted to its own `vX_Y_Z_BUILD.md`.]

## Milestone vX.(Y+1) — [name]
[Less detail than the immediate work but enough to set direction. Sketch becomes plan as it approaches the build queue.]

## Milestone vX.(Y+2) — [name]
[…]

## vNext — strategy phase
[Direction, not commitment. Bulleted, not detailed.]

---

## Cross-references — NOT IN THIS DOC, find here:

- Tech stack summary, glossary, architecture diagrams → `docs/PROJECT_NAME.md`
- API schemas, integration docs, third-party service references → `docs/archive/resources/`
- Branch / merge / tag protocol → `.agent/DEV_RULES.md` § Git Branching
- Versioning, file naming → `.agent/DEV_RULES.md` § Versioning & Naming Conventions
- Session document behavior → `.agent/DEV_RULES.md` § Master Documents → Session document behavior
```

#### BUILD.md template (the executable chunk)

```markdown
# v[X.Y.Z] Build Packet — [chunk name]

**Source**: extracted from `vX_Y_Z_IMPLEMENT.md` § [section]
**Branch**: [feat/fix branch name]
**Required reading first**:
  - `docs/PROJECT_NAME.md`
  - This BUILD doc only — do NOT read prior IMPLEMENTs, BUGS, or BUILD_REPORTs

---

## Pre-flight Checklist
[Branch cut, deps installed, env vars set, services up]

## Phase 0: Setup
[Concrete commands and file changes to prep]

## Phase 1: [first executable chunk]
[Step-by-step. Each step file:line specific. Code snippets are production-ready, no placeholders.]

## Phase N: [final integration / wire-up]

## Verification
[How to confirm each phase worked — end-to-end and per-phase. The orchestrator records the actual results in BUILD_REPORT.]

## Rollback
[Per-phase rollback strategy]

## Subagent Groupings (for parallel execution)
[Per § Parallel-Workflow Groundwork]

---

## What to write to BUILD_REPORT_vX_Y_Z.md when done

- What changed (file-by-file, one-line summaries)
- What deviated from this BUILD (anything you decided differently and why; ideally empty)
- Gaps and bugs surfaced (do not patch into a sequential BUILD — see § BUILD.md and the BUILD_REPORT)
- Verification results (passed / failed / untested)
```

If you find yourself wanting to embed a tech-stack summary, schema, or glossary in either doc because "the reader will want it here" — they will, but the right move is to put it in `PROJECT_NAME.md` and link to it. That keeps the system honest.

---

## Context Management Strategy

**Problem**: Agents working on specific features don't need the entire roadmap in their context because it's noise and wastes tokens. This is why we create exclusively executable implementation plans; it avoids any need to attempt to understand the build in entirety. That happens during planning only.

**Solution**:

  1. The roadmap is the highest-numbered `vX_Y_Z_IMPLEMENT.md` in `docs/archive/vX_Y/`. Planning sessions update it; nothing about it is master/separate.
  2. The orchestrator running a build does **not** read IMPLEMENT — they read only the focused `vX_Y_Z_BUILD.md` extracted for them. This is the context-budget guarantee.
  3. In-flight work in any session is logged in `docs/archive/vX_Y/vX_Y_Z_SESSION.md` (see § *Master Documents → Session document behavior*).
  4. Agents read `docs/PROJECT_NAME.md` and `README.md` at session start. They read nothing else unless referenced in the current BUILD or SESSION.
  5. **Do not** read past IMPLEMENTs, BUGS reports, FEEDBACK, or BUILD_REPORTs during execution. Those are historical artifacts; their content has already been folded into the current IMPLEMENT and (if applicable) the current BUILD.
  6. Mark SESSION checkboxes as work is completed — live, not at the end (see § *Master Documents → Session document behavior*).
  7. After completion create detailed `commit` messages.
     - These should encompass the same grouping and wording as the BUILD chunks they implement.
     - This ensures that we can look back and easily find and fix any bugs or necessary changes.

---

## Parallel Development Workflow

### Enterprise Company Best Practices 

This is how they do it and how we can too. This section is for context only; it does not need to be memorized, it should be used when creating implementation plans, where the actual parallel tracks need to be clearly defined. 

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

Each orchestrator's `BUILD_REPORT_vX_Y_Z.md` documents:

  - What changed (file-by-file)
  - Why it changed (or why it deviated from the BUILD)
  - Git diff confirmation
  - Test results
  - Any unexpected discoveries (gaps for the next planning round, never patched into a sequential BUILD)

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

  4. **Confirm changes via `git diff`** before marking complete
     - Review every changed line
     - Verify no unintended changes
     - Check for debug code or comments left behind

  5. **Update master architecture doc** if architecture changes
     - Keep `docs/PROJECT_NAME.md` current
     - Document new patterns or conventions
     - Update architecture diagrams if needed

  6. **Append session footers to `SESSION.md`** before closing the session
     - `## Session Notes` — surprises, undocumented findings, things that ought to be in PROJECT_NAME.md
     - `## Picked Up From / Stopped At` — resumption pointer
     - `## Open Threads For Next Session` — deferred work, questions
     - See § *Master Documents → Session document behavior* for full protocol.

---

## Research Phase Best Practices

> **Two tiers of research; pick the right one:**
>
> - **Implementation research (this section)** is the lightweight, inline kind that lives within IMPLEMENT planning: verifying an API's current shape, comparing 2–3 viable approaches, sketching integration points. It happens during normal planning sessions, output goes into IMPLEMENT, and it does not need its own directory structure.
> - **Formal research (`.agent/RESEARCH_PROTOCOL.md`)** is the heavy framework — `research/{1_DEEP, 2_FOCUS, 3_FINAL}` directory structure, multi-round consolidation, often spanning sessions. Reserve this for business-planning depth: market positioning, competition analysis, monetization modeling. If you reach for it during normal feature planning, ask whether the project actually needs business-plan-grade research or whether a lighter inline pass is enough.
>
> If a feature investigation balloons in scope and starts looking formal, that is a signal to stop and ask whether a parallel business-planning track should open — not to retrofit the formal protocol into IMPLEMENT.

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

**Why**: Training data ages fast. Verify before you build.

### 2. Skipping Research Phase

- ❌ "This seems simple, I'll just implement it"
- ✅ "Let me research best practices first, even if it seems simple"

**Why**: Simple features often have hidden complexity. 30 minutes of research can save hours of debugging.

### 3. Not Documenting Decisions

- ❌ Implement feature, merge, move on
- ✅ Document why you chose this approach over alternatives

**Why**: Future developers (including future agents) need to understand the reasoning to maintain or extend the feature.

### 4. Ignoring Edge Cases

- ❌ "It works for the happy path"
- ✅ "I've tested error states, empty inputs, edge cases"

**Why**: Edge cases cause bugs in production. Handle them upfront.

### 5. Not Confirming Changes

- ❌ "I made the changes, should be good"
- ✅ "Let me review the git diff to confirm every change is intentional"

**Why**: Unintended changes cause subtle bugs. Always review diffs.

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

## Syncing This Document

This file is intended to be the same across projects. To propagate updates from one canonical copy out to every other project:

```bash
filemgmt -f ~/Development -r /path/to/canonical/.agent/DEV_RULES.md
```

`filemgmt` (Bulk Directory File Management) is globally available as a custom command. Run `filemgmt -h` for full help. The same script can be used to explicitly add files to all project `.agent` folders via the `-a` flag (e.g. `filemgmt -f ~/Development/*/.agent -a /path/to/canonical/.agent/RESEARCH_PROTOCOL.md`).

**Note**: Project-specific learnings live in `.agent/PROJECT_LESSONS.md`, which is **not** synced — every project keeps its own incident history.

---

## Agent Quickstart

The minimum protocol for any session, in order. If something here is unclear, that means this document failed — flag it.

### Read first (no exceptions)

  1. `docs/PROJECT_NAME.md` — context primer
  2. `README.md` — project status, deploy URL, commands
  3. Your assigned doc — usually `vX_Y_Z_BUILD.md` (if you're executing) or the highest-numbered `vX_Y_Z_IMPLEMENT.md` (if you're planning)
  4. `.agent/PROJECT_LESSONS.md` — incidents that shaped this project's protocols (skim)

### As you work

  5. Mark `SESSION.md` checkboxes live, not at the end.
  6. If the BUILD or IMPLEMENT is wrong: stop, surface to the human, start a new SESSION. Don't silently patch.
  7. Confirm changes via `git diff` before commit. Every line intentional.

### Before closing the session

  8. Append `## Session Notes`, `## Picked Up From / Stopped At`, `## Open Threads For Next Session` to `SESSION.md`.
  9. If you ran a BUILD: write `BUILD_REPORT_vX_Y_Z.md` (per § *BUILD.md and the BUILD_REPORT*).
  10. If architecture changed: update `docs/PROJECT_NAME.md`. Future you depends on this.
  11. Commit with a message matching the BUILD's chunk grouping (see § *Commit Message Standards*).

### What you do NOT do

  - Don't read past IMPLEMENTs, BUGS, FEEDBACK, or BUILD_REPORTs during execution. Their content has already been folded into the current BUILD.
  - Don't edit `vX_Y_Z_IMPLEMENT.md` mid-build. Surface the issue and start a new SESSION instead.
  - Don't write a separate "completion" or "walkthrough" file. Footers go in `SESSION.md`; orchestrator findings go in `BUILD_REPORT_vX_Y_Z.md`.
  - Don't create archive directories at the major-version level only (no `archive/v3/` — only `archive/v3_0/`, `archive/v3_1/`, etc.).
  - Don't write IMPLEMENT or BUILD reference content (schemas, glossaries, architecture diagrams). Send the reader to `PROJECT_NAME.md` or `archive/resources/`.
  - Don't file `~/.claude/plans/<name>.md` into `docs/archive/`. The human handles that — they choose the version and filing path.
  - Don't pass-through fixes between sequential build tracks. Surface the gap to planning; the next BUILD is created with the gap already resolved.

If you do these eleven things and avoid those seven, the protocol is satisfied.