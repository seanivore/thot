# V3 Usability: Implementation Guide
**Branch**: `feat/v3-usability`
**Target**: `v3-rainbow-moat`

## Goal
Implement current build UX updates to improve fundamental text editor expectations and file management.

## Scope Definitions
### 1. Spellcheck & Autocorrect (Native Browser)
- **Implementation**: Enable browser's built-in spellcheck in CodeMirror 6.
- **Technical Specifics**: Use `EditorView.contentAttributes.of({spellcheck: "true"})`.
- **Toggle State**: Store user preference in `localStorage`. Toggle dynamically by reconfiguring the extension array with a `Compartment`.

### 2. Paired Delimiters Behavior
- **Behaviors**:
  - *Pair insertion*: Typing `(` inserts `()` with cursor between.
  - *Skip-over*: Typing `)` when cursor is before auto-inserted `)` moves past it.
  - *Wrap selection*: Highlight word, type `(`, wraps as `(word)`.
  - *Pair deletion*: Backspace on `(` deletes both if empty.
- **Supported Pairs**: `() [] {} '' "" ` ` `
- **Implementation**: Install `@codemirror/autocomplete` (`npm i @codemirror/autocomplete`). Import and add `closeBrackets()` to the CodeMirror extensions array in `src/editor.ts`.

### 3. File Operations
- **Behaviors**:
  - *Multiple windows*: CMD+N opens new window (not duplicate).
  - *Cross-Device Support*: Access Files app on mobile/tablet and OS system on desktop.
  - *Auto-save to file*: Auto-save to an opened file natively (not just localStorage).
  - *Save As*: CMD+Shift+S saves current content to new file name and location.
  - *Open File*: Browse and open existing `.md` files.
  - *File name*: Show open file name in title bar.
  - *Nuance*: Keep the persistent `untitled` document for scratchpad use until saved.
- **Technical Specifics**: 
  - *Browser Support*: `showOpenFilePicker` and `showSaveFilePicker` are NOT supported in Safari or iOS. 
  - *Primary Implementation (Mandatory Fallback)*: Use `<input type="file" accept=".md, .txt">` for opening files via memory, and `<a download="filename.md" href="blob:...">` for saving/exporting. 
  - *Progressive Enhancement*: Use `if ('showOpenFilePicker' in window)` for desktop Chrome/Edge users to allow direct save-backs to the loaded file handle.
  - *Multi-window Sync*: Store the current file content and title in a `localStorage` key. Use the `StorageEvent` listener or `BroadcastChannel` so that all windows are aware of current active content.

### 4. Mobile/Tablet UX Improvements
- **Issues to Fix**:
  - Predictive text bar appearing above keyboard.
  - Lack of share buttons on iPhone PWA.
  - Different PWA behavior between iOS and iPadOS.
  - Bottom padding when typing on last line (auto-grow buffer).
- **Technical Specifics**:
  - *Predictive Text Bar*: In iOS, this bar appears due to typing suggestions. We must disable it using `EditorView.contentAttributes.of({autocorrect: "off", autocapitalize: "off"})`.
  - *PWA Share Buttons*: Standalone PWAs on iOS do not have native UI. We must build a custom 'Share' button in our UI that calls the Web Share API: `navigator.share({ title: docTitle, text: docContent })`.
  - *Bottom Padding Auto-Grow*: Add `.cm-content { padding-bottom: 30vh !important; }` to CM6 theme to allow scrolling past the last line naturally.
  - *Line-number Padding*: Add a fixed width or `min-width: 40px` to the `.cm-gutters` container in the CM6 theme so layout doesn't jump at line 100.

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
