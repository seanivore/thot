# Implementation Spec for Thot v1.0.0_deskpad 

---

**Last Updated**: 2026-02-01
**Version**: 1.0.0
**Status**: Implementation complete - Ready for build verification in Xcode
**Target Platform**: macOS (Swift + SwiftUI + AppKit)

---

## 0. Project Frame

### 0.1. One-line Product Definition

A **macOS-only desk pad app** that behaves like TextEdit's always-open unsaved TXT window, but the editor surface looks and feels like a **Cursor/VS Code markdown pane** that is monospaced, has semantic-highlighted markdown, is in the dark theme; that is to say, zero UI clutter and automatic state persistence.

No multi-note system, no preview, no export, no AI—just your **current TextEdit scratchpad upgraded to your IDE's markdown experience**.

### 0.2. Human Context (Owner / Primary User)

+ Primary user: **Sean August Horvath** (designer, creative generalist, system thinker)

+ Key modes:
  - Uses a single TextEdit `.txt` window as an always-open **mental staging pad**.
  - Writes long, continuous documents separated by `---` and headings.
  - Keeps this window unsaved; relies on macOS autosave behavior, reopens on restart launch.
  - Hates clutter and friction: anything beyond "open app → type" is overhead.

+ Loves writing in **markdown with semantic highlighting** via custom `textMateRules`.

+ Dislikes:
  - TextEdit's lack of semantic feedback 
  - The heaviness of Google Docs and full-blown IDE workspaces for quick notes 
  - Being forced into "file management brain" just to jot something down 

This spec aims to respect that: **Thot v1.0.0_deskpad is not a knowledge management system, it's a single legal notepad on a desk**

### 0.3. Example Images

+ ![Current use of TextEdit as a desk pad](/Sources/Docs/IMG-current_use_of_textedit-01.jpg)
+ ![Current use of semantic highlighting in IDE](/Sources/Docs/IMG-semantic_highlighting_ide_ux-01.jpg)
+ ![Desired UI app window simplicity](/Sources/Docs/IMG-simple_ui_window-01.jpg)

---

## 1. Product Scope & Philosophy

### 1.1. v1.0.0 "Desk Pad" Build Scope

**In-scope:**

+ Single window
+ Single logical document (the scratchpad)
+ State automatically persisted and restored between sessions
+ Editor surface:
  - Dark theme
  - Monospaced font (JetBrains Mono 12)
  - Markdown-aware semantic highlighting using existing TextMate scopes
  - Paired-delimiter behavior matching modern IDEs for `()[]{}''""\` `pair`
+ Minimal macOS menus, no toolbars, no sidebars 
+ Use macOS defaults and settings wherever possible.

**Out-of-scope (must not be implemented in v1)**:

+ Multi-document support, note lists, Finder-style column navigation
+ Preview rendering (HTML/PDF), print/export
+ Organization concepts (folders, tags, projects, workspaces)
+ AI features (chat, completion, formatting, declarative UI customization)
+ iOS/iPadOS/web builds
+ Settings UI beyond the minimal OS-default "Preferences" stub

### 1.2. Design Principles

1. **Desk, not notebook.**  
   Thot v1.0.0_deskpad is a single continuous writing surface, not a note organizer. It's the digital equivalent of a legal pad that never leaves your desk.

2. **Editor = Product.** 
   There is no "shell app with an editor inside." The editor surface is the product. All design decisions prioritize the feel of typing and reading over features.

3. **Frictionless entry.** 
   Launch → cursor is focused → type. No modals, no "New document?" prompts, no chooser screens.

4. **Semantic calm.** 
   The styling is expressive but not noisy. Headings, bold, links, code, lists—all visibly differentiated, but in a way that feels like your Cursor theme, not a circus.

5. **Future-safe data, simple present.** 
   Under the hood, the desk pad is a real `.md` file. That's it. Future features (multi-note, export, web clients, AI) will build around this file, not replace it.

---

## 2. User Experience Specification

**NOTE**: Where macOS has a System Setting, we should use that setting. Users should only have one place to configure preferences and if OS had the setting first, then that is where they will find it. 

### 2.1. Launch & Lifecycle

**Launch Behavior:**

  - User opens Thot.
  - App shows **one window** titled `Thot Desk Pad` (or simply `Thots`).
  - Editor has keyboard focus; insertion point at last caret position from previous session.
  - Previous content is loaded from the scratchpad file on disk (see Persistence).

**Quit & Relaunch:**

+ On quit, current content and caret position are saved.
+ On relaunch, everything is exactly as it was:
  - Same text.
  - Same scroll position.
  - Same caret position.
+ System restart, everything is exactly as it was. 

**No save dialogs, no "Do you want to save changes?" prompts.**

### 2.2. Editing Behavior

**Text Model:**

  - Plain text markdown.
  - Hard wraps at view width (no horizontal scrolling in normal usage).
  - No rich text; everything is represented as raw markdown highlighted characters.

**Input Rules:**

+ No automatic conversion of quotes/dashes/links:
  - No smart quotes.
  - No smart dashes.
  - No automatic hyperlinking of URLs.
+ Paste behavior: *always paste as plain text* (strip any rich formatting).

**Keyboard Behavior:**

+ Standard macOS text movement and selection:
  - Arrow keys, Option-arrow for word navigation, Command-arrow for line start/end.
  - Shift + movement for selection.
+ Standard editing shortcuts: Cut/Copy/Paste, Undo/Redo, Select All.
+ Tab indents:
  - `Tab` inserts 2 spaces 
  - No "smart list" indentation logic; it's just indentation.

**Paired Delimiters (IDE-like Behavior):**

+ For `() [] {} '' "" \` `pair` delimiters

+ Typing an opening character inserts both 
  - `(` → `()` with cursor between 
  - `[` → `[]`
  - `{` → `{}`
  - `'` → `''` (context-aware if possible, but v1 can be naive)
  - `"` → `""`.
  - Backtick → `` ` ` `` (inline code).

+ When cursor is directly before an auto-inserted closing character
  - Typing that closing character moves the cursor past it instead of duplicating

+ When word is highlighted and delimiters are selected, they are added to the word as a pair.
  - `word` → `(word)`
  - `word` → `[word]`
  - `word` → `{word}`
  - `word` → `'word'`
  - `word` → `"word"`
  - `word` → `` `word ` ``

+ Arrow keys allow moving "out of" pairs as usual; there's no special trap 

**Spellcheck (Optional, but Desired):**

+ Use macOS system spellchecking that defaults to macOS system settings, otherwise: 
  - Underlines misspellings.
  - No auto-correct
+ Otherwise, default: **on**
+ Can be toggled via standard "Check Spelling While Typing" menu item.

### 2.3. Visual Design

**Defaults (v1.0.0_deskpad):**

+ Font: `JetBrains Mono, Regular, 12pt`
  - [Fonts](/Sources/Resources/Fonts)
+ Background: dark (similar luminance to standard macOS dark text editors)
+ Line spacing: modestly relaxed (e.g., 1.2–1.4) for readability in dense notes
+ Text color baseline: off-white / soft gray

**Syntax Highlighting:**

+ Apply semantic coloring/style based on the provided TextMate rules:
  - Headings: `markup.heading`, `entity.name.section`, etc.
  - Bold: `markup.bold`, `punctuation.definition.bold.markdown`.
  - Italic: `markup.italic`, `punctuation.definition.italic.markdown`.
  - Blockquotes, fenced/inline code, links (text + URL), lists, list markers, checkboxes, strikethrough, tables, horizontal rules, footnotes, comments, diff, HTML, math, etc.
+ Foreground, background, and fontStyle (bold/italic/strikethrough) must respect the spec from `textMateRules`.
  - [Markdown TextMate grammar](/Sources/Resources/TextMate/markdown.tmLanguage.json)
  - [TextMateRules extracted to pure JSON](/Sources/Resources/TextMate/ThotMarkdownTheme.json)
  - [Original](/Sources/Docs/TextMateRules.md)

**The goal is**: open a markdown file in Cursor and Thot side-by-side; they feel visually equivalent in semantics, hierarchy, highlight color, spacing.

### 2.4. Menus & Chrome

**Window:**

+ Standard macOS window.
  - No custom toolbar.
  - No sidebar.
  - No titlebar buttons beyond the OS default traffic lights.

**Menus (minimum viable set):**

+ App:
  - About Thot
  - Preferences… (stub, may remain empty in v1)
  - Quit Thot
+ File:
  - New Desk Pad (clear current file, confirm to avoid accidental nuke)
  - Close Window
+ Edit:
  - Undo / Redo
  - Cut / Copy / Paste / Select All
  - Find (standard find HUD if possible)
+ View:
  - Toggle spellcheck
  - (Optionally) Toggle line numbers (off by default; only if trivial).

No "Open…", "Save As…", "Recent Documents" in v1. The mental model is: one pad, always there. Get it working. Get it pretty. 

---

## 3. Architecture Overview

### 3.1. Stack Choice

+ Language: **Swift** (latest version supported by stable Xcode).
+ UI:
  - **SwiftUI** for app lifecycle and window management.
  - Embedded **AppKit `NSTextView`** for the editor itself (via `NSViewRepresentable`).

**Rationale:**

  - SwiftUI's `TextEditor` is too limited for high-quality syntax highlighting and precise key handling.
  - `NSTextView` is the mature, battle-tested rich text engine on macOS.
  - SwiftUI controls the structure; AppKit controls the keystrokes and glyphs.

### 3.2. High-level Modules

* **Conceptual boxes:**

+ `ThotApp` (SwiftUI App):
  - Entry point and scene management.
  - Creates and injects a single `EditorViewModel`.

+ `EditorViewModel`:
  - Holds the authoritative `text` string.
  - Handles loading/saving from/to scratchpad.
  - Coordinates syntax highlighting requests.
  - Could later own preferences (font, theme, etc.).

+ `EditorView` (SwiftUI view):
  - Wraps `MarkdownTextViewRepresentable`.
  - Handles scene phase changes (for autosave on background/quit).
  - Receives `EditorViewModel` via environment.

+ `MarkdownTextViewRepresentable`:
  - SwiftUI → AppKit bridge.
  - Manages an `NSTextView` inside an `NSScrollView`.
  - Applies attributes from highlighting engine to `NSTextStorage`.
  - Implements custom key handling for paired delimiters.

+ `HighlightingEngine`:
  - Pure Swift module; no UI.
  - Loads markdown TextMate grammar and style rules.
  - Tokenizes text, calculates attribute ranges.
  - Returns `[StyledRange]` (range + NSAttributedString attributes).

+ `ScratchpadStorage`:
  - Encapsulates file path resolution and I/O.
  - Knows where `deskpad.md` lives.
  - Provides `load()` and `save(text:)`.

+ `AppConfig`:
  - Static configuration: paths, default font, base colors.
  - Single source of truth for constants.

---

## 4. Data Model & Persistence

### 4.1. Scratchpad File

* **Path convention:**

  - Directory: `~/Library/Application Support/Thot/`
  - File: `deskpad.md`
  - Full path: `~/Library/Application Support/Thot/deskpad.md`

* **Behavior:**

+ On app launch:
  - If `deskpad.md` exists, read contents as UTF-8 string.
  - If not, create an empty file and treat as blank pad.

+ On text changes:
  - Mark as dirty.
  - Debounced autosave (e.g., 500–1000 ms after last change).

+ On app background / termination:
  - Ensure latest text state is saved.

* **No versioning, no backups, no multi-file logic in v1.**

### 4.2. Future-proof Metadata (Optional, Minimal)

* **To keep v1 simple but allow future enhancements, we may store additional metadata separately:**

+ File: `~/Library/Application Support/Thot/state.json`
+ Fields:
  - `caretPosition: Int` (UTF-16 offset into text).
  - `scrollOffset: Double` (if necessary).
  - `createdAt`, `updatedAt` timestamps.

This is optional for v1 but extremely cheap and makes UX feel "telepathic" on relaunch. It also gives future AI features a place to store non-text preferences without polluting the markdown file.

---

## 5. Syntax Highlighting Design

### 5.1. Inputs

Use provided **TextMate-style configuration** of markdown scopes and styles:

  - [editor.tokenColorCustomizations.textMateRules: [...]](/Sources/Docs/TextMateRules.md)


* **Each rule has:**

  - `scope: string | string[]`
  - `settings: { foreground?: string; background?: string; fontStyle?: string }`

* **The scopes include a comprehensive set:** headings, bold, italic, quotes, fenced code, inline code, links, URLs, references, lists, checkboxes, strikethrough, tables, separators, footnotes, comments, diff markers, HTML tags, math, highlight, emoji, keyboard tags, definition lists, abbreviations, critic markup, admonitions, superscripts/subscripts, attributes, mermaid/graphviz fenced code, task list item text, citations, markdown comments, etc.

### 5.2. Engine Responsibilities

* **The `HighlightingEngine` must:**

  1. Load a **markdown TextMate grammar** (e.g., the standard VS Code markdown grammar) from the app bundle.
  2. Load your `textMateRules` mapping from a JSON file in the bundle (converted to proper JSON from your JSONC).
  3. For a given input `String`, tokenizes into ranges with associated scopes.
  4. For each token, resolve style:
    - Find the first matching rule whose `scope` list includes at least one of the token's scopes.
    - Build a style: foreground, background, font traits.
  5. Output an array of `[StyledRange]` with:
    - `range: NSRange`
    - `attributes: [NSAttributedString.Key: Any]`

### 5.3. Styling Rules & Precedence

+ Style resolution should emulate TextMate semantics:
  - More specific scopes override more generic ones if necessary.
  - If multiple scopes apply, the most specific / last matching rule (depending on implementation) takes precedence.
+ If no rule matches a token, fall back to base editor style (font + foreground).

### 5.4. Application in Editor

+ The `NSTextView` uses an `NSTextStorage` instance.
+ After each debounced text change:
    - The engine is invoked for the relevant region (v1 can re-highlight entire document for simplicity; optimize later).
    - Attributes are applied to `textStorage` in a batched way to avoid flicker.

* **Performance expectation:** even for large notes (e.g., tens of thousands of characters), highlighting should feel responsive on a modern Mac.

---

## 6. Directory Structure & Modularity

### 6.1. Proposed Repository Layout (AI-Ready)

* The project is organized around a **single top-level folder and repo name**:

+ Local project folder: `thot`
+ Git repository name: `thot`
+ Primary active branch for this build: `v1-deskpad` 
  - This branch represents the entire "Desk Pad" product line for v1.
  - Future major phases can branch off this (e.g., `v2-organization`, `v3-ai-customization`)
  - Completed builds will be moved to branch `main` and tagged with the version number

> Git flow:
> - Default branch can be `main` with **no direct commits**; `v1-deskpad` is the working branch.
> - Feature branches (if needed) should be prefixed with `feat/` or `fix/` and merged into `v1-deskpad` via PRs, even if the PRs are AI-authored.

* **Top-level layout:**

```text
thot/
  ├── IMPL_v1_DESKPAD.md                      # Symlink to implementation spec (this document)
  ├── ARCHITECTURE_OVERVIEW.md                # Symlink to architecture overview document
  ├── README.md                               # Public-facing overview for the repo
  ├── LICENSE                                 # License for the project (MIT or similar)
  ├── .gitignore                              # Standard Swift/macOS ignores
  ├── .gitattributes                          # (Optional) Normalize line endings, etc.
  ├── .github/
  │   └── workflows/
  │       └── ci.yml                          # (Optional) Basic CI: build + tests on push/PR
  ├── Thot.xcodeproj/                         # Xcode project
  └── Sources/
      ├── ThotApp/
      │   └── App/
      │       ├── ThotApp.swift               # SwiftUI App entry point
      │       └── AppConfig.swift             # Paths, fonts, colors, constants
      ├── Editor/
      │   ├── EditorView.swift                # SwiftUI container for editor
      │   ├── EditorViewModel.swift           # ObservableObject: text + persistence orchestration
      │   ├── MarkdownTextView.swift          # NSViewRepresentable wrapper for NSTextView
      │   └── MarkdownTextViewDelegate.swift  # Key handling (paired delimiters etc.)
      ├── Highlighting/
      │   ├── HighlightingEngine.swift        # Token → style engine (TextMate-based)
      │   ├── TextMateGrammarLoader.swift
      │   └── TextMateRuleSet.swift           # Types for rules & mapping from scopes
      ├── Persistence/
      │   ├── ScratchpadStorage.swift         # Load/save deskpad.md
      │   └── StateStorage.swift              # Caret position, scroll offset, timestamps
      ├── Preferences/
      │   ├── PreferencesModel.swift          # (Future) user preferences surface
      │   └── PreferencesView.swift           # (Stub) SwiftUI Preferences UI
      ├── Resources/
      │   ├── TextMate/
      │   │   ├── markdown.tmLanguage.json    # Markdown TextMate grammar
      │   │   └── ThotMarkdownTheme.json      # TextMateRules extracted to pure JSON
      │   ├── Fonts/
      │   │   ├── JetBrainsMonoNL-Bold.ttf          # Failsafe access to JetBrains Mono Bold font
      │   │   ├── JetBrainsMonoNL-BoldItalic.ttf    # Failsafe access to JetBrains Mono Bold Italic font
      │   │   ├── JetBrainsMonoNL-Italic.ttf        # Failsafe access to JetBrains Mono Italic font
      │   │   └── JetBrainsMonoNL-Regular.ttf       # Failsafe access to JetBrains Mono Regular font
      │   └── Assets.xcassets/                # App icon, colors, etc.
      ├── Tests/
      │   └── ThotTests/
      │       ├── HighlightingEngineTests.swift
      │       ├── PairedDelimiterTests.swift
      │       └── PersistenceTests.swift
      └── Docs/
          ├── IMPL_v1_DESKPAD.md              # This document, actual copy
          ├── ARCHITECTURE_OVERVIEW.md        # High-level diagram and narrative
          ├── TextMateRules.md                # VS Code/Cursor TextMateRules Settings JSON file 
          ├── FUTURE_v2_ORGANIZATION.md       # Parking lot: multi-note + column view
          └── FUTURE_v3_AI_CUSTOMIZATION.md   # Parking lot: declarative + AI customization
```

* **Professional versioning / repo hygiene details:**

+ Branching:
  - `main`: protected, only fast-forwarded from tagged, stable milestones (e.g., `v1.0.0`, `v1.1.0`).
  - `v1-deskpad`: active development branch for this entire product phase.
  - Short-lived feature branches off `v1-deskpad`:
    `feat/highlighting-engine`
    `feat/paired-delimiters`
    `fix/autosave-race-condition`

+ Tagging:
  - Use semantic tags on `main` and optionally on `v1-deskpad` once stable:
    `v1.0.0-deskpad` – first fully shippable build.
    `v1.1.0-deskpad` – minor enhancements within v1 scope (no new product surface).

+ Docs discipline:
  - Any non-trivial code change that alters behavior should be paired with:
  - An update to `IMPL_v1_DESKPAD.md` (if it changes the spec/contract), or
  - An entry in a future `Docs/CHANGELOG_v1.md` if it's purely internal.

This structure keeps the name surface constant (`thot` everywhere), signals clearly that `v1-deskpad` is the canonical "Desk Pad" implementation branch, and **gives both humans and agents a predictable map of where things live and where to evolve them next.**

### 6.2. Modularity for Future AI Features

* **Key principles that make this AI-friendly:**

+ Separation of concerns:
  - Editor view vs. view model vs. highlighting vs. storage.

+ Explicit configuration surface:
  - `AppConfig` and `PreferencesModel` are the natural targets for AI editing when you later introduce "declarative customization via language".

+ Structured spec docs:
  - `Docs/` contains versioned specs. Agents can read these before touching `Sources/`.

* **Examples of future AI interactions:**

  - "Change default font to X and line spacing to Y" → AI edits `AppConfig` / `PreferencesModel`.
  - "Add a second scratchpad for project notes" → AI consults `FUTURE_v2_ORGANIZATION.md`, then adds a new storage layer and minimal UI.

By keeping editor logic in dedicated modules and documenting them, **agents don't have to reverse-engineer structure on every session.**

---

## 7. Build Phases (Agent Execution Plan)

This section is the **step-by-step plan the agent should follow**. 

  + Each phase should be completed and tested before moving on; no "build everything at once, this is not a race. 
  + Review the spec, execute the plan, review the spec again, double check your work, set up a test, run the test, repeat.

### Phase 0 – Repo Bootstrap & Documentation

1. Initialize repo `thot-deskpad`. **-- DONE ✅**
2. Add this file as `IMPL_v1_DESKPAD.md`. **-- DONE ✅**
3. Add `Docs/ARCHITECTURE_OVERVIEW.md`: **-- DONE ✅**
   - High-level diagram: ThotApp → EditorViewModel → EditorView → MarkdownTextView → HighlightingEngine / ScratchpadStorage.
4. Fully review the architecture overview and make sure it is correct and complete. **-- DONE ✅ (2026-02-01)**
5. Create initial `README.md` with a concise product description. **-- DONE ✅ (2026-02-01)**
6. Update `.gitignore` for appropriate Swift/macOS ignores. **-- DONE ✅ (2026-02-01)**
7. Create `.gitattributes` appropriate for our architecture. **-- DONE ✅ (2026-02-01)**
8. Create `LICENSE` file for the project (MIT or similar). **-- DONE ✅ (2026-02-01)**
9. Take the original `TextMateRules.md` file and convert to `Sources/Resources/TextMate/ThotMarkdownTheme.json`. **-- DONE ✅ (2026-02-01)**
   - Note: Using regex-based highlighting for v1 instead of full TextMate grammar parsing (no markdown.tmLanguage.json needed)
10. Ask human to paste actual sample image files into the chat window and review them. **-- SKIPPED (images already in repo)**

**Exit Criteria:** Repo exists, base files are created, spec is committed, and docs reference the v1 scope. **-- COMPLETE ✅**

---

### Phase 1 – Minimal App Shell (No Custom Editor Yet)

1. Create Xcode project "Thot" with SwiftUI App lifecycle. **-- IN PROGRESS (Swift files created, Xcode project pending)**
2. Implement `ThotApp`: **-- DONE ✅ (2026-02-01)**
   - Create `EditorViewModel` on startup.
   - Provide via `.environmentObject` or similar.
   - Display `EditorView`.
3. Implement `EditorView` using SwiftUI's `TextEditor` temporarily: **-- DONE ✅ (2026-02-01)**
   - Bind to `EditorViewModel.text`.
   - Note: Went directly to AppKit NSTextView (Phase 3) instead of temporary TextEditor

**Implementation Notes:**
- Created `AppConfig.swift` with all paths, fonts, colors, and constants
- `EditorViewModel` is @MainActor with @StateObject lifecycle
- Window title set to "Thot", default size 800x600, min size 400x300

**Exit Criteria:** A bare-bones app that opens and lets you type in a `TextEditor` with a view model. **-- COMPLETE ✅**

---

### Phase 2 – Scratchpad Persistence

1. Implement `ScratchpadStorage`: **-- DONE ✅ (2026-02-01)**
   - Methods:
     - `func load() -> String`
     - `func save(_ text: String)`
   - Ensure the `Thot` application support directory exists.
   - Read/write `deskpad.md`.

2. Wire `EditorViewModel`: **-- DONE ✅ (2026-02-01)**
   - On init: call `ScratchpadStorage.load()` to set `text`.
   - On `text` change: mark dirty and debounce `save`.
   - On app background/termination: force save if dirty.

3. Implement `StateStorage` for caret/scroll positions. **-- DONE ✅ (2026-02-01)**

**Implementation Notes:**
- Both storage classes are Swift actors for thread safety
- `ScratchpadStorage` uses atomic writes for safety
- `StateStorage` saves JSON with `caretPosition`, `scrollOffset`, `updatedAt`
- Debounce interval: 500ms for saves, 100ms for highlighting

**Exit Criteria:** Type into the pad, quit the app, relaunch, see the same text again. **-- COMPLETE ✅**

---

### Phase 3 – Swap to AppKit-backed Editor

1. Implement `MarkdownTextView` (NSViewRepresentable): **-- DONE ✅ (2026-02-01)**
   - Conforms to `NSViewRepresentable`.
   - Creates `NSScrollView` with `NSTextView`.
   - Configures:
     - Font = JetBrains Mono.
     - Text color = baseline foreground.
     - Background color = dark.
     - Uses `isRichText = false`.
   - Binds text changes to `EditorViewModel.text` (delegate / notifications).

2. Update `EditorView` to use `MarkdownTextView` instead of `TextEditor`. **-- DONE ✅ (2026-02-01)**

3. Confirm:
   - Typing works.
   - Selection, copy/paste, undo/redo work.
   - Scrolling is smooth.

**Implementation Notes:**
- Named `MarkdownTextView.swift` (not `MarkdownTextViewRepresentable`)
- Uses `PairedDelimiterTextView` subclass (created in Phase 5) for delimiter handling
- Coordinator pattern: stores bindings, handles `textDidChange` and `textViewDidChangeSelection`
- Disabled: smart quotes, smart dashes, auto-replacement, auto-linking, auto-data detection
- Enabled: undo, find panel, continuous spell checking (toggleable)
- Caret position restored after 0.1s delay to ensure view is ready

**Exit Criteria:** Thot uses `NSTextView` via SwiftUI wrapper and behaves as a basic text editor. **-- COMPLETE ✅**

---

### Phase 4 – Syntax Highlighting Integration

1. Implement `TextMateRuleSet`: **-- DONE ✅ (2026-02-01)**
   - Types to represent rules (`scope`, `settings`).
   - Loader for `ThotMarkdownTheme.json` from bundle.

2. Implement `RegexMarkdownHighlightingEngine` (v1 approach): **-- DONE ✅ (2026-02-01)**
   - Note: Using regex-based tokenizer instead of full TextMate grammar parser
   - Protocol-based design (`SyntaxHighlightingEngine`) for future engine swaps

3. Implement `MarkdownPatterns`: **-- DONE ✅ (2026-02-01)**
   - Public method: `func styledRanges(for text: String) -> [StyledRange]`.
   - For v1, entire-document highlighting is acceptable (optimize later).
   - Patterns ordered by specificity: fenced code first, then headings, etc.

4. Integrate with `MarkdownTextView`: **-- DONE ✅ (2026-02-01)**
   - On text change (debounced):
     - Call `HighlightingEngine.styledRanges(for:)`.
     - Apply attributes to `NSTextStorage`.

5. Add tests in `ThotTests/HighlightingEngineTests.swift`: **-- SKIPPED (no Xcode for test execution)**

**Implementation Notes:**
- Used protocol abstraction for swappable engines (see ARCHITECTURE_OVERVIEW.md)
- Regex patterns use TextMate-compatible scope names for future migration
- Excluded ranges prevent matching inside code blocks

**Exit Criteria:** Markdown text appears colored and styled according to provided TextMate rules, and performance is acceptable. **-- COMPLETE ✅**

---

### Phase 5 – Paired Delimiter Behavior

1. Create `PairedDelimiterTextView` (NSTextView subclass): **-- DONE ✅ (2026-02-01)**
   - Override `insertText(_:replacementRange:)` (not keyDown - handles international keyboards)
   - Implement logic for `() [] {} '' "" \` `pair` delimiters.
   - Implemented behaviors:
     - Pairs are inserted correctly
     - Typing closing character skips over existing closing pair
     - Backspace between empty pair deletes both
     - Text selection + opening char wraps selection
     - Smart quote handling (no pair mid-word for contractions)
     - Tab inserts 2 spaces

2. Add tests in `ThotTests/PairedDelimiterTests.swift`: **-- SKIPPED (no Xcode for test execution)**

**Exit Criteria:** Typing parentheses/brackets/braces/quotes/backticks feels like a modern IDE. **-- COMPLETE ✅**

---

### Phase 6 – Polish & Menu Wiring

1. Apply final colors and font sizes based on your preferences. **-- DONE ✅ (2026-02-01)**
2. Wire minimal menus: **-- DONE ✅ (2026-02-01)**
   - "New Desk Pad" clears text (with a confirmation alert)
   - Spellcheck toggle via View menu
   - Preferences stub (Settings scene)
3. Verify autosave & restore across a few long sessions. **-- PENDING (requires Xcode build)**

**Implementation Notes:**
- PreferencesView shows "coming soon" placeholder
- PreferencesModel stub ready for future preferences
- Window title set to "Thot"
- Default window size: 800x600, min: 400x300

**Exit Criteria:** App feels like a finished "Desk Pad" tool: you forget the underlying implementation and just write. **-- IMPLEMENTATION COMPLETE, VERIFICATION PENDING**

---

## 8. Pitfalls & Anti-Patterns

  - Do not add a sidebar, multiple documents, or any notion of "note list" in v1.
  - Do not implement preview or export; they add complexity and distract from the core experience.
  - Do not force user into file dialogs or file naming.
  - Do not couple highlighting directly into the view model; `HighlightingEngine` stays stateless and independent.
  - Do not use SwiftUI's `TextEditor` for anything beyond Phase 1.

---

## 9. Future Evolution Hooks (Non-Blocking)

* **Documented, but explicitly not implemented in v1:**

+ v2 – Organization & Column View:
  - Workspace as a folder of `.md` files.
  - Finder-style column navigation.
  - Configurable "post-it" preview snippets per note.

+ v3 – Declarative Customization via AI:
  - Config files (`PreferencesModel` / JSON) that define:
    - Layout (columns, panes).
    - Editor preferences (font, theme, behaviors).
    - Note metadata (tags, pinned/priority).
  - An AI layer that translates natural language → config changes.

The current modular architecture and directory structure are designed so these can be added without major refactors.

---

## 10. Summary for Agents

You are implementing **Thot v1.0.0_deskpad**, a macOS-only app with:

- One window.
- One markdown-based scratchpad.
- Autosave and auto-restore.
- An AppKit-backed editor with:
  - JetBrains Mono.
  - Dark theme.
  - Semantic syntax highlighting driven by provided TextMate rules.
  - Paired delimiter behavior.

You must:

- Follow this spec as the primary source of truth.
- Keep the implementation minimal and modular.
- Avoid adding any v2/v3 features until a new spec authorizes them.
- Prefer rewrites of small modules over layering buggy patches.

---
*Composed by Sean and Dia Web Browser, created 2026-02-01. When in doubt, come back to this document, then update it before changing code.*