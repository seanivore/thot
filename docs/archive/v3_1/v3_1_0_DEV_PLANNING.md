# V3.1.0 Usability & Autocorrect Completion Plan

This plan reconstructs our progress and outlines the exact steps needed to finish the `v3.1.0` Usability update, integrate the customized autocorrect engine refinement, merge the branches, and prepare the repository for the next development phase, exactly as requested in [PICKUP.md](file:///Users/seanivore/Development/thot/docs/archive/v3/PICKUP.md).

## User Review Required

Please review the proposed steps below. If they look correct, I will proceed to **EXECUTION** mode to implement the code changes, doc updates, and branch merges.

> [!WARNING]
> By merging `feat/v3-usability` into `v3-rainbow-moat` and then into `main`, we are officially dropping the `v3.1.0` release. Please confirm you are ready to ship these changes to `main`.

## Proposed Changes

### 1. Context & Documentation Reconciliation
We will update the existing documentation to reflect the Custom Autocorrect Engine work.
- **Rename**: [docs/archive/v3/v3_1_USABILITY.md](file:///Users/seanivore/Development/thot/docs/archive/v3/v3_1_USABILITY.md) -> `docs/archive/v3/v3_1_0_USABILITY.md` (Underscores only)
- **Modify**: Inject the Phase 1.5 (Custom Autocorrect Engine) specifications and features into this document so it represents the true scope of work completed.

### 2. Autocorrect Feedback Implementation (`feat/v3-usability`)
We will address the specific autocorrect UX improvements listed in [v3_1_FEEDBACK_2.md](file:///Users/seanivore/Development/thot/docs/archive/v3/v3_1_FEEDBACK_2.md) by modifying [src/autocorrect.ts](file:///Users/seanivore/Development/thot/src/autocorrect.ts).

#### [MODIFY] [src/autocorrect.ts](file:///Users/seanivore/Development/thot/src/autocorrect.ts)
We need to introduce a `StateField` to track the last autocorrect, enabling the precise backspace-revert flow, and use `syntaxTree` to disable autocorrect in specific syntax scopes.

1. **Import Requirements**: Import `StateField`, `StateEffect` from `@codemirror/state` and `syntaxTree` from `@codemirror/language`.
2. **Track Autocorrect State**: 
   - Create a `StateEffect` to dispatch when a correction happens: `const autocorrectApplied = StateEffect.define<{from: number, to: number, original: string}>()`
   - Create a `StateEffect` to mark an ignored position: `const autocorrectIgnored = StateEffect.define<number>()`
   - Create a `StateField` named `autocorrectState` to store the last correction and a `Set` of ignored positions.
3. **Extend [customAutocorrect](file:///Users/seanivore/Development/thot/src/autocorrect.ts#135-195)**:
   - Make [customAutocorrect()](file:///Users/seanivore/Development/thot/src/autocorrect.ts#135-195) return an array containing both the `transactionFilter` and the `autocorrectState` field.
4. **Implement Syntax Block Detection**:
   - In the filter, before checking the dictionary, run `const node = syntaxTree(tr.startState).resolveInner(fromA, -1)`.
   - If `node.name` matches `InlineCode`, `FencedCode`, `URL`, or `LinkMark`, return early (no autocorrect).
5. **Implement Undo Flow (`delete.backward`)**:
   - Intercept `tr.isUserEvent('delete.backward')`.
   - Read the previous state from our `autocorrectState` field.
   - If the user is deleting the trigger character (e.g., the space) exactly at the end of `lastCorrection.to`, we inject an additional change into the transaction: replace the corrected word back with `original`, and dispatch the `autocorrectIgnored` effect for the end position so that typing a space there again does not trigger another correction.

### 3. Branch Merging & Versioning
Following the [DEV_RULES.md](file:///Users/seanivore/Development/thot/.agent/DEV_RULES.md) protocol:
1. **Merge**: Check out `v3-rainbow-moat` and fast-forward merge `feat/v3-usability` into it.
2. **Merge**: Check out `main` and fast-forward merge `v3-rainbow-moat` into it (production-ready).
3. **Tag**: Run `git tag v3.1.0` to officially mark the robust usability and autocorrect release.

### 4. Updating Global Documentation
After the merge to `main`, we will update the primary project reference documents.

#### [MODIFY] [docs/THOT_APP.md](file:///Users/seanivore/Development/thot/docs/THOT_APP.md)
- Update version number to v3.1.0
- Add v3.1.0 to the "Recent Changes" section detailing the overarching updates.

#### [MODIFY] [docs/UPDATE_MAP.md](file:///Users/seanivore/Development/thot/docs/UPDATE_MAP.md)
- Mark v3.1.0 (formerly v3.0.0 in the roadmap) Usability updates as completed.

#### [MODIFY] [README.md](file:///Users/seanivore/Development/thot/README.md)
- Ensure the README correctly reflects the current v3.1.0 feature set.

### 5. Mini-Update Planning for v3.2.0 (URLs & Anchors)
We will create an **exclusively executable implementation guide** for the upcoming URLs and Anchors feature to be executed in the next sprint.

#### [NEW] [docs/archive/v3/v3_2_0_URLS_ANCHORS.md](file:///Users/seanivore/Development/thot/docs/archive/v3/v3_2_0_URLS_ANCHORS.md)
- File will outline exact steps to make URLs, File Paths, and page anchors clickable.
- Will detail how to register click event handlers on specific syntax nodes using CodeMirror's `EditorView.domEventHandlers`.
- Will explain how anchors map to heading DOM elements.

## Verification Plan

### Automated/Code Verification
- `npm run build` will verify that syntax tree additions in [src/autocorrect.ts](file:///Users/seanivore/Development/thot/src/autocorrect.ts) don't cause TS errors.

### Manual Verification
1. **Autocorrect Flow**: Type "well " -> changes to "we'll ". Press `Backspace` -> reverts to "well". Type space again, no correction should occur.
2. **Autocorrect Blocking**: Type "cant" inside `inline code` or a code block, add a space, verify it does not change to "can't". Type `www.cant.com`, verify no changes occur inside the URL string.
3. **Repository State**: Verify `main` branch includes all code from `v3.1.0`.
