# Thot App Technical Documentation

---

**Last Updated**: 2026-02-01
**Version**: 1.0.0 (v1.0.0_deskpad)
**Status**: Implementation complete - Ready for build verification in Xcode

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

  - `SyntaxHighlightingEngine.swift` - Protocol definition
  - `RegexMarkdownHighlightingEngine.swift` - v1 regex-based implementation
  - `TextMateRuleSet.swift` - Theme JSON parser
  - `MarkdownPatterns.swift` - Regex patterns with TextMate-compatible scope names

#### Protocol-Based Architecture

The highlighting system uses a **protocol abstraction** to allow future engine swaps:

```swift
/// A styled range with its TextMate-compatible scope name
struct StyledRange {
    let range: NSRange
    let scope: String  // TextMate-compatible scope name
    let attributes: [NSAttributedString.Key: Any]
}

/// Protocol for swappable syntax highlighting engines
protocol SyntaxHighlightingEngine {
    func styledRanges(for text: String) -> [StyledRange]
}
```

#### v1 Implementation: RegexMarkdownHighlightingEngine

For v1, we use a **custom regex-based tokenizer** that:
- Prioritizes startup time and zero external dependencies
- Uses TextMate-compatible scope names (e.g., `markup.heading`, `markup.bold`)
- Processes patterns in specificity order (fenced code first, then headings, etc.)

```swift
class RegexMarkdownHighlightingEngine: SyntaxHighlightingEngine {
    private let ruleSet: TextMateRuleSet
    private let patterns: [MarkdownPattern]

    func styledRanges(for text: String) -> [StyledRange] {
        // Apply patterns in order, map scopes to attributes via ruleSet
    }
}
```

**Pattern order** (most specific first):
1. Fenced code blocks (```...```)
2. Headings (# ## ### etc.)
3. Horizontal rules (---)
4. Bold (**text**)
5. Italic (*text*)
6. Strikethrough (~~text~~)
7. Inline code (`code`)
8. Links [text](url)
9. Images ![alt](url)
10. Blockquotes (>)
11. List markers (- * + 1.)
12. Checkboxes ([ ] [x])
13. HTML comments

#### TextMateRuleSet

Loads `ThotMarkdownTheme.json` and maps scopes to NSAttributedString attributes:

```swift
struct TextMateRuleSet {
    func attributes(for scope: String) -> [NSAttributedString.Key: Any]
}
```

#### Future Engine Implementations

The protocol design enables future upgrades without changing MarkdownTextView:

```swift
// Future: Full TextMate grammar parsing
class TextMateHighlightingEngine: SyntaxHighlightingEngine {
    // Uses oniguruma or similar for real TextMate grammar support
}

// Future: Tree-sitter for incremental parsing
class TreeSitterHighlightingEngine: SyntaxHighlightingEngine {
    // Uses tree-sitter-markdown for fast incremental updates
}
```

**To swap engines**: Change one line in MarkdownTextView.Coordinator:
```swift
// v1
private let highlightingEngine: SyntaxHighlightingEngine = RegexMarkdownHighlightingEngine()

// Future
private let highlightingEngine: SyntaxHighlightingEngine = TreeSitterHighlightingEngine()
```

**Design notes:**

  - The highlighting module is **stateless**: given text, output styles. No side effects
  - Scope names follow TextMate conventions for future compatibility
  - The protocol boundary isolates the editor from implementation details

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

* **StateStorage:**

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
  - `PreferencesView.swift` (stub in v1.0.0_deskpad)

* **PreferencesModel:**

+ In v1, can be minimal or empty.
+ Future home for:
  - Font size, line height, theme selection.
  - Behavior toggles (spellcheck, line numbers, etc.)

* **PreferencesView:**

  - SwiftUI view that will live behind the macOS "Preferences..." menu.
  - In v1.0.0_deskpad, this can be a simple "coming soon" placeholder.

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

+ `Sources/Resources/TextMate/markdown.tmLanguage.json`
  - The markdown grammar used by the highlighting engine

+ `Sources/Resources/TextMate/ThotMarkdownTheme.json`
  - Your TextMate rules subset – scope → color/style mapping

+ `Sources/Resources/Assets.xcassets`
  - App icon, accent colors

+ `Sources/Resources/Fonts/JetBrainsMonoNL-*.ttf`
  - Failsafe access to JetBrains Mono Regular, Bold, Bold Italic, and Italic font family for use in the app

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
*Thot v1.0.0_deskpad's architecture is deliberately conservative so those future layers can attach around the editor, not inside it.*