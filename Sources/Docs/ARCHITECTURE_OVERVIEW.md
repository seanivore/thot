# Overview of Thot v1.0.0_deskpad.0.0_deskpad.0.0_deskpad.0.0 'Desk Pad' Build 

---

**Last Updated**: 2026-02-01
**Version**: 1.0.0
**Status**: v1 Architecture Locked

---

## 1. Conceptual Overview

* **Thot in initial release v1.0.0_deskpad, is a single-document macOS text editor:**

  - One window.
  - One markdown scratchpad.
  - No file management UI.
  - Autosaves to a single `.md` file.
  - Editor surface feels like a lightweight, always-open version of your IDE's markdown pane.

* **All future complexity (multi-note organization, Finder-style navigation, AI customization) will grow **around** this core, not inside it.**

---

## 2. High-Level Architecture

### 2.1. Layered Structure

* **Think in three vertical slices:**

1. App Shell (SwiftUI)
   - Owns the app lifecycle and window
   - Creates and wires view models
   - Presents the editor

2. Editor Layer (SwiftUI + AppKit)
   - SwiftUI `EditorView` wraps an AppKit `NSTextView`
   - Handles text input, selection, scrolling
   - Delegates highlighting and persistence to other layers

3. Service Layer (Pure Swift Modules)
   - `HighlightingEngine` Converts raw markdown text into styled ranges using TextMate rules
   - `ScratchpadStorage` Loads/saves the single scratchpad file
   - `StateStorage` Persists caret/scroll position and timestamps
   - `AppConfig/PreferencesModel` Constants and user-adjustable values

* **The golden rule:**

  - SwiftUI controls "what" is shown 
  - AppKit controls "how" text behaves
  - Service modules control "what it means"

---

## 3. Component Diagram (Textual)

### 3.1. Runtime Data Flow

  ```text
  +--------------------+        +------------------------+
  |     ThotApp        |        |     AppConfig          |
  |  (SwiftUI App)     |        |  (constants, paths)    |
  +---------+----------+        +-----------+------------+
            |                               |
            v                               v
  +--------------------+        +------------------------+
  |  EditorViewModel   | <----> |  ScratchpadStorage     |
  | (ObservableObject) |        |  StateStorage          |
  +---------+----------+        +------------------------+
            |
            v
  +--------------------+
  |    EditorView      |   (SwiftUI)
  +---------+----------+
            |
            v
  +-------------------------------+
  | MarkdownTextViewRepresentable |
  |   (NSViewRepresentable)       |
  +-------------------------------+
            |
            v
  +--------------------+     +---------------------------+
  |    NSTextView      | <-> |   HighlightingEngine      |
  | (AppKit editor)    |     | (TextMate grammar + rules)|
  +--------------------+     +---------------------------+
  ```

* **Narrative:**

+ `ThotApp` starts the app, creates a single `EditorViewModel`, and passes it into `EditorView`
+ `EditorViewModel` owns the current text and coordinates with `ScratchpadStorage` and `StateStorage`
+ `EditorView` embeds `MarkdownTextViewRepresentable`, which owns an `NSTextView`
+ When the user types:
  - `NSTextView` updates its `NSTextStorage`
  - Changes propagate to `EditorViewModel.text`
  - A debounced call triggers `HighlightingEngine` to recompute styled ranges
  - Styled attributes are applied back to `NSTextStorage`
  - `EditorViewModel` also debounces saving to disk via `ScratchpadStorage`

---

## 4. Modules and Responsibilities

### 4.1. App

* **Files:**

+ `ThotApp.swift`
+ `AppConfig.swift`

* **Responsibilities:**

+ Define the SwiftUI App entry:
  - Create `EditorViewModel`
  - Provide it via environment to `EditorView`
+ Centralize configuration:
  - Scratchpad path (`~/Library/Application Support/Thot/deskpad.md`)
  - Default font, base colors
  - Any global constants

* **Design notes:**

+ `AppConfig` must be **pure data** (no logic) so AI and humans can safely tweak it later

### 4.2. Editor

* **Files:**

  - `EditorViewModel.swift`
  - `EditorView.swift`
  - `MarkdownTextView.swift`
  - `MarkdownTextViewDelegate.swift` (or subclass of `NSTextView`)

* **EditorViewModel:**

+ `@Published var text: String`
+ Lifecycle:
  - On init: `ScratchpadStorage.load()` → set `text`
  - On `text` change: debounce `ScratchpadStorage.save(text)`
  - On app background/termination: force save
+ Future home for:
  - Spellcheck toggle state
  - Simple editor preferences (font size, etc.)

* **EditorView (SwiftUI):**

+ A thin container that:
  - Embeds `MarkdownTextViewRepresentable`
  - Observes scene phase for autosave triggers
  - Might host a status bar later (line/column, etc., but not in v1)

* **MarkdownTextViewRepresentable:**

+ Bridges SwiftUI and AppKit
+ Creates:
  - `NSScrollView`
  - `NSTextView` (inside scroll)
+ Configures:
  - Monospaced font
  - Dark background
  - Plain text mode (`isRichText = false`)
  - Spellcheck behavior
+ Delegates:
  - Text changes → update `EditorViewModel.text`
  - Key handling → `MarkdownTextViewDelegate` (paired delimiters)

* **MarkdownTextViewDelegate / subclass:**

  - Overrides `keyDown(with:)`
  - Implements IDE-like paired delimiter behavior for `()[]{}''""\` `pairs`
  - May also centralize other editor-specific behaviors later

### 4.3. Highlighting

* **Files:**

  - `HighlightingEngine.swift`
  - `TextMateGrammarLoader.swift`
  - `TextMateRuleSet.swift`

* **HighlightingEngine:**

  - Input: `String` text
  - Output: `[StyledRange]` where:

  ```swift
  struct StyledRange {
      let range: NSRange
      let attributes: [NSAttributedString.Key: Any]
  }
  ``` 

* **Responsibilities:**

  - Tokenize markdown using a TextMate grammar
  - Map token scopes to styles using `TextMateRuleSet`
  - Return a coherent set of attributes for the editor to apply

* **TextMateGrammarLoader:**

  - Loads `markdown.tmLanguage.json` from `Resources/TextMate/`
  - Parses it into a structure the tokenizer can use

* **TextMateRuleSet:**

  - Loads `ThotMarkdownTheme.json` (your `textMateRules` converted to valid JSON)
  - Provides APIs like:

  ```swift
  func attributes(forScopes scopes: [String]) -> [NSAttributedString.Key: Any]
  ```

**Design notes:**

  - The highlighting module must be stateless: given text, output styles. No side effects
  - This makes it easier to test and to replace with another engine in future (e.g., tree-sitter)

### 4.4. Persistence

* **Files:**

  - `ScratchpadStorage.swift`
  - `StateStorage.swift`

* **ScratchpadStorage:**

  - Knows the full path to `deskpad.md`
  - API: 

  ```swift
  func load() -> String
  func save(_ text: String)
  ```

* **Responsibilities:**

  - Ensure the Application Support directory exists
  - Read/write UTF-8 safely
  - Handle empty/missing file gracefully

* **StateStorage (optional for v1, but planned):**

  - Stores small bits of UI state:

  ```json
  {
  "caretPosition": 324,
  "scrollOffset": 180.0,
  "createdAt": "...",
  "updatedAt": "..."
  }
  ```

  - API similar to:

  ```swift
  func loadState() -> EditorState?
  func saveState(_ state: EditorState)
  ```

* **Design notes:**

+ Persistence is strictly separated from the view model so you can later:

  - Swap file location strategies
  - Add multi-file workspaces without rewriting the editor logic

### 4.5. Preferences ￼

* **Files:**

  - `PreferencesModel.swift`
  - `PreferencesView.swift` (stub in v1)

* **PreferencesModel:**

+ In v1, can be minimal or empty.
+ Future home for:
  - Font size, line height, theme selection.
  - Behavior toggles (spellcheck, line numbers, etc.)

* **PreferencesView:**

  - SwiftUI view that will live behind the macOS "Preferences…" menu.
  - In v1, this can be a simple "coming soon" placeholder.

* **Design notes:**

  - This module is intended as the primary surface for AI-driven customization later.
  - Keeping it separate now makes that transition clean.

---

## 5. Filesystem & Resources

### 5.1. Scratchpad File

+ Location: `~/Library/Application Support/Thot/deskpad.md`
+ Format: plain UTF-8 markdown.
+ Owner: `ScratchpadStorage`.

### 5.2. Resource Files

+ `Resources/TextMate/markdown.tmLanguage.json`
  - The markdown grammar used by the highlighting engine

+ `Resources/TextMate/ThotMarkdownTheme.json`
  - Your TextMate rules subset – scope → color/style mapping

+ `Resources/Assets.xcassets`
  - App icon, accent colors

---

## 6. Why This Architecture

### 6.1. SwiftUI + AppKit Split

+ SwiftUI:
  - Handles app lifecycle and container layout
  - Easy to extend with future UI (sidebars, column layouts)

+ AppKit (`NSTextView`):
  - Mature, powerful text system
  - Fine-grained control over attributes, selection, and keyboard

+ Plays nicely with attributed strings and custom highlighting

+ This gives you a native-feeling Mac app that can grow into a more complex editor without repainting the foundation

### 6.2. Single Scratchpad, Open Data Model

* **A single `.md` file:**

+ Matches your current use of one TextEdit window
+ Is easy to back up, sync, and inspect
+ Future multi-note designs (Finder column view, surface vs depth) can
  - Treat this file as just "one note among many"
  - Reuse the exact same editor component for every note

### 6.3. AI-Ready Modularity

* **Core editor behaviors are isolated:**

  - Highlighting engine is a pure function over text
  - Preferences and config live in well-known files

* **Future AI agents can:**

  - Read `Docs/` to understand the constraints
  - Inspect `AppConfig` and `PreferencesModel` to adjust behavior
  - Extend the app by adding new files under `Sources/` without entangling the editor

---

## 7. Evolution Path (Non-Binding)

* **Without changing the core architecture:**

* **v2 – Organization:**

  - Add a `Workspace` module under `Sources/ThotApp/Workspace/`
  - Manage multiple `.md` files in a folder
  - Introduce a column-based navigation UI in SwiftUI
  - Reuse `EditorView` for all note content

* **v3 – Declarative AI Customization:**

  - Extend `PreferencesModel` to a richer config schema (layout, behaviors, styles)
  - Provide a small "config language" or JSON format for layout
  - Introduce an AI-facing API: natural language → config mutations

---
*Thot v1's architecture is deliberately conservative so those future layers can attach around the editor, not inside it.*