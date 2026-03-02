# V3 Usability: Implementation Guide
**Branch**: `feat/v3-usability`
**Target**: `v3-rainbow-moat`

## Goal
Implement current build UX updates to improve fundamental text editor expectations and file management.

## Scope Definitions
### 1. Spellcheck & Autocorrect (Native Browser)
- **Implementation**: Enable browser's built-in spellcheck (`spellcheck="true"` in CodeMirror).
- **Research Needed**: How to toggle on/off (via menu item or settings).

### 2. Paired Delimiters Behavior
- **Behaviors**:
  - *Pair insertion*: Typing `(` inserts `()` with cursor between.
  - *Skip-over*: Typing `)` when cursor is before auto-inserted `)` moves past it.
  - *Wrap selection*: Highlight word, type `(`, wraps as `(word)`.
  - *Pair deletion*: Backspace on `(` deletes both if empty.
- **Supported Pairs**: `() [] {} '' "" ` ` `
- **Implementation**: Modify `src/editor.ts` to include CodeMirror's `closeBrackets` extension.

### 3. File Operations
- **Behaviors**:
  - *Multiple windows*: CMD+N opens new window (not duplicate).
  - *Cross-Device Support*: Access Files app on mobile/tablet and OS system on desktop.
  - *Auto-save to file*: Auto-save to an opened file natively (not just localStorage).
  - *Save As*: CMD+Shift+S saves current content to new file name and location.
  - *Open File*: Browse and open existing `.md` files.
  - *File name*: Show open file name in title bar.
  - *Nuance*: Keep the persistent `untitled` document for scratchpad use until saved.
- **Research Needed**:
  - File System Access API capabilities (browser support, permissions, directory access).
  - Fallbacks (download/upload, localStorage).
  - Strategy for multi-window sync (BroadcastChannel, localStorage key).

### 4. Mobile/Tablet UX Improvements
- **Issues to Fix**:
  - Predictive text bar appearing above keyboard.
  - Lack of share buttons on iPhone PWA.
  - Different PWA behavior between iOS and iPadOS.
  - Bottom padding when typing on last line (auto-grow buffer).
- **Research Needed**: PWA display modes, iOS standalone mode customization.

### NOT In Scope
- Highlighting issues/bugs
- Icons Consolidation
- iPad/Mobile Viewport Issues
- YAML Highlighting Bug
- Undo/Redo Issue (iPad)

## Execution Plan
1. **Spike 1**: Research File System Access API & Mobile UX fixes. Document findings inside `docs/plans/research_file_system.md` and `research_pwa.md`.
2. **Step 1: Spellcheck**: Add `spellcheck="true"` to `src/editor.ts`.
3. **Step 2: Delimiters**: Wire the `closeBrackets` extension into the CodeMirror extensions list in `src/editor.ts`.
4. **Step 3: File System API**: Build file open/save dialog and write-back functionality.
5. **Step 4: Mobile/Tablet**: Apply CSS and PWA manifest changes based on research.

## Verification
- Test all Paired Delimiter scenarios on desktop Chrome/Safari.
- Test spellcheck toggling.
- Test File API in isolated browser environment.
- Access application through iPhone/iPad to verify keyboard, padding, and share buttons.
