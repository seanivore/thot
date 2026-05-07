# V3 Development Rollout Plan

This document serves as the master blueprint for the V3 updates. Per your request, **all technical details have been thoroughly researched and confirmed below**. There are zero outstanding decisions required before coding begins. We will execute these three tracks one by one on their respective feature branches matching off `v3-rainbow-moat`.

## User Review Required
Please review the verified technical specifications explicitly detailed below. If everything looks locked in exactly as you requested, I will begin implementing Track 1 (`feat/v3-usability`). 

---

## Proposed Changes (Track Descriptions)

### Track 1: Usability Updates 
**Branch**: `feat/v3-usability`

This track handles fundamental text editor expectations and file management.

#### 1. Native Browser Spellcheck
- **Confirmed Spec**: In CodeMirror 6, spellcheck is controlled natively. We will use `EditorView.contentAttributes.of({spellcheck: "true"})`.
- **User Customization**: We will store the toggle state in `localStorage` and expose a CM6 `Compartment` to reconfigure this setting dynamically without reloading the editor.

#### 2. Paired Delimiters Behavior
- **Confirmed Spec**: We will install the `@codemirror/autocomplete` package (`npm i @codemirror/autocomplete`).
- **Implementation**: We will import the `closeBrackets()` extension and add it directly to our CM6 `extensions` array in `editor.ts`. This natively handles pair insertion `()`, skip-over, wrap selection, and pair deletion automatically out-of-the-box.

#### 3. File System Access API
- **Confirmed Spec**: The modern `showOpenFilePicker`/`showSaveFilePicker` APIs are **NOT** supported on iOS or Mac Safari. 
- **Implementation (Mandatory Fallback)**: We will build an `<input type="file" accept=".md, .txt">` element for importing files into memory, and use an `<a download="filename.md" href="blob:...">` approach for exporting/saving. We will wrap this in a feature-detect `if ('showOpenFilePicker' in window)` to allow Chrome desktop users the luxury of saving directly back to their active file handles. 

#### 4. Mobile UX Fixes
- **Confirmed Spec (Predictive Text Bar)**: iOS triggers an unwanted autocorrect bar on `contenteditable` divs. We will disable this via `EditorView.contentAttributes.of({autocorrect: "off", autocapitalize: "off"})`.
- **Confirmed Spec (PWA Share)**: Since standalone iOS PWAs lose the native Safari share button, we will build a custom 'Share' UI button that calls the `navigator.share({ title, text, url })` Web Share API.
- **Confirmed Spec (Layout Polish)**: To fix bottom padding and line-number layout shift, we will append `.cm-content { padding-bottom: 30vh !important; }` and `.cm-gutters { min-width: 40px; }` to the CM6 theme `EditorView.theme()`.

---

### Track 2: Proprietary Highlighting System
**Branch**: `feat/v3-highlighting`

This track eliminates the insanely complex current system (styleTags + HighlightStyle + extra Views) and replaces it with a fully-owned, simplified pattern-matching engine priority list.

#### 1. Scope Definitions ([`src/scopes.ts`](/src/scopes.ts))
- **Confirmed Spec**: We will create a single source of truth mapping Lezer node names directly to styling objects (e.g. `StrongEmphasis: { color: colors.bold, fontWeight: '800' }`).
- **Plain Text Support**: We will include a `PLAIN_TEXT_SCOPES` array (`{ pattern: /regex/, style: ... }`) evaluated through standard Regex matching on visible ranges.

#### 2. Highlighting Engine (`src/highlighter.ts`)
- **Confirmed Spec**: We will delete all current `styleTags` and CSS cascade logic. Instead, we will construct a single `ViewPlugin`.
- **Tree Depth Priority Magic**: The plugin will run `syntaxTree(view.state).iterate()` over the viewport. For every node, it will generate a `Decoration.mark({ attributes: { style: ... } })` based on the scoped definitions. 
- Because Lezer naturally nests syntax trees (e.g. `Emphasis` inside `StrongEmphasis`), the inner decoration will cleanly render over the outer decoration visually in the browser, permanently resolving previous color bleeding conflicts without complex CSS specificity hacks.
- **Auto-Detection**: We will run a simple regex test (`/^#{1,6}\s/m`, `/\*\*/`, etc.) on document load to determine whether to parse utilizing the Markdown tree walk or the Plain Text regex search.

---

### Track 3: Intelligent Formatting UI
**Branch**: `feat/v3-formatting`

This track handles building a Dual-Mode visual formatting capability so users can style text without knowing Markdown.

#### 1. Notation Visibility Toggle
- **Confirmed Spec**: CodeMirror 6 can hide underlying document characters visually without deleting them. We will use `Decoration.replace({})` with an empty replacement over specifically parsed Markdown syntax nodes (like `EmphasisMark` or `HeaderMark`). This allows `**text**` to simply render as **text** in the viewport while mathematically remaining `**text**` under the hood for clean export.

#### 2. Visual Context Menu
- **Confirmed Spec**: We will build this using CodeMirror's `showTooltip` facet. 
- **Implementation**: We will attach a `StateField` that watches `view.state.selection`. When standard text is highlighted (`selection.main.empty === false`), it returns a `Tooltip` object containing our custom DOM elements (toolbar buttons mapped to formatting commands). This correctly links the popup to the active selection cursor viewport coordinates.

---

## Verification Plan

Because these are major architectural and UX changes, automation is limited. All tracks will be manually verified aggressively before getting merged into the master `v3-rainbow-moat`.

- **Usability**: Confirm [`THOT_APP.md`](/docs/THOT_APP.md) files can be loaded/saved interchangeably on iOS Safari and Desktop Chrome; verify auto-bracket pairs wrap selections correctly.
- **Highlighting**: Verify nested scopes (`**bold *italic inside***`) render correctly; verify list markers get marker colors independently of list body colors.
- **Formatting**: Verify applying Bold from the tooltip injects `**` under the hood; execute the notation visibility toggle and confirm `**` characters hide flawlessly and do not interfere with the cursor's ability to delete.
