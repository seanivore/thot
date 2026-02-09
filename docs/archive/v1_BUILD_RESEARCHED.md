# Thot v1.0.0_deskpad Implementation Plan

## Overview

**Product**: A macOS-only desk pad app that behaves like TextEdit's always-open unsaved TXT window, but with IDE-like markdown editing (semantic highlighting, paired delimiters, dark theme, JetBrains Mono font).

**Architecture**: SwiftUI app shell + AppKit NSTextView editor via NSViewRepresentable

**Primary spec**: `/Users/seanivore/Development/thot/Sources/Docs/IMPL_v1_DESKPAD.md`

---

## Xcode Project Setup (Manual with Explicit Guidance)

### Step-by-Step Xcode Creation

1. **Create New Project**:
   - Open Xcode → File → New → Project
   - Choose **macOS** → **App**
   - Product Name: `Thot`
   - Team: (your personal team)
   - Organization Identifier: `com.seanhorvath`
   - Bundle Identifier: `com.seanhorvath.thot`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - **Uncheck**: Include Tests (we'll add manually in correct location)
   - **Uncheck**: Use Core Data
   - Save in: `/Users/seanivore/Development/thot/` (choose existing folder)

2. **Delete Default Files Created by Xcode**:
   - Delete `Thot/ContentView.swift`
   - Delete `Thot/ThotApp.swift`
   - Delete `Thot/Assets.xcassets` (we have our own in Sources/Resources)
   - Delete `Thot/Preview Content` folder
   - Delete the `Thot/` group entirely

3. **Restructure Groups to Match Source Layout**:
   - In Xcode Navigator, right-click → Add Files to "Thot"
   - Add the entire `Sources/` folder with:
     - **Create groups** (not folder references)
     - **Copy items if needed**: UNCHECKED
     - Add to target: Thot

4. **Configure Target Build Settings**:
   - Select Thot target → Build Settings
   - Search "Info.plist" → Set to `Sources/ThotApp/Info.plist` (we'll create this)
   - Deployment Target: **macOS 13.0**

5. **Configure Asset Catalog**:
   - Target → General → App Icons and Launch Images
   - App Icon: Select `AppIcon` from `Sources/Resources/Assets.xcassets`

6. **Add Font Resources**:
   - Ensure `Sources/Resources/Fonts/` folder is added to target
   - In Info.plist, add: `ATSApplicationFontsPath` = `Fonts`
   - Copy Bundle Resources should include all .ttf files

7. **Add Test Target**:
   - File → New → Target → macOS Unit Testing Bundle
   - Product Name: `ThotTests`
   - Configure to use `Tests/ThotTests/` location

---

## Current Repository State

**Existing (complete)**:
- `Sources/Docs/ARCHITECTURE_OVERVIEW.md` - Architecture document
- `Sources/Docs/IMPL_v1_DESKPAD.md` - Full implementation spec
- `Sources/Docs/TextMateRules.md` - 40+ TextMate scope/style rules
- `Sources/Resources/Fonts/` - JetBrains Mono NL (4 variants)
- `.gitignore` - Basic ignores (needs Swift/Xcode entries)
- Root symlinks to docs

**Missing (to create)**:
- Xcode project (`Thot.xcodeproj/`)
- All Swift source files
- `README.md`, `LICENSE`, `.gitattributes`
- `Sources/Resources/TextMate/ThotMarkdownTheme.json` (converted from TextMateRules.md)

---

## Key Technical Decisions

### 1. Syntax Highlighting: Protocol-Based with Regex Engine for v1

**Architecture**: Abstract `SyntaxHighlightingEngine` protocol with `RegexMarkdownHighlightingEngine` implementation for v1.

```swift
protocol SyntaxHighlightingEngine {
    func styledRanges(for text: String) -> [StyledRange]
}

// v1 implementation
class RegexMarkdownHighlightingEngine: SyntaxHighlightingEngine {
    // Custom regex-based markdown tokenizer
}

// Future implementations (not in v1):
// - TextMateHighlightingEngine (uses real TextMate grammar parser)
// - TreeSitterHighlightingEngine (uses tree-sitter)
```

**Rationale**:
- v1 prioritizes startup time, zero dependencies, small implementation surface
- Markdown has finite, well-defined constructs
- Regex patterns use TextMate-compatible scope names (`markup.heading`, `markup.bold`, etc.)
- Future engine swap requires no changes to NSTextView integration

**Scope naming discipline**: Even with regex, use TextMate scope names so future migration is seamless

### 2. NSTextView Integration Pattern
- Apply highlighting via `NSTextViewDelegate.textDidChange()`, NOT `NSTextStorageDelegate.textStorageDidProcessEditing()` (avoids caret position bugs)
- Debounce highlighting (100ms)
- Use `beginEditing()`/`endEditing()` for batch attribute application

### 3. NSViewRepresentable Pattern
- Store `Binding<String>` in Coordinator (not parent reference)
- Handle text sync carefully to avoid cursor jumps

### 4. Paired Delimiters
- Subclass NSTextView, override `insertText(_:replacementRange:)` (not `keyDown`)
- Handles international keyboards correctly
- Implement: pair insertion, wrap-selection, skip-over, pair deletion

---

## Implementation Phases

### Phase 0: Repository Bootstrap (Remaining Items)

**Files to create**:

1. **`README.md`** - Project overview with build instructions
2. **`LICENSE`** - MIT License (copyright Sean August Horvath)
3. **`.gitattributes`** - Swift/markdown diff settings
4. **Update `.gitignore`** - Add Xcode/Swift entries:
   ```
   # Xcode
   build/
   DerivedData/
   *.xcuserstate
   xcuserdata/

   # Swift Package Manager
   .build/
   .swiftpm/
   Package.resolved
   ```
5. **`Sources/Resources/TextMate/ThotMarkdownTheme.json`** - Convert TextMateRules.md to valid JSON array

**Verification**: Git status shows new files, JSON validates

---

### Phase 1: Minimal App Shell

**Files to create**:

| File | Purpose |
|------|---------|
| `Thot.xcodeproj/` | Xcode project (macOS App, SwiftUI lifecycle, macOS 13.0+) |
| `Sources/ThotApp/App/ThotApp.swift` | @main App entry, creates EditorViewModel |
| `Sources/ThotApp/App/AppConfig.swift` | Paths, fonts, colors, constants |
| `Sources/Editor/EditorViewModel.swift` | @Published text, ObservableObject |
| `Sources/Editor/EditorView.swift` | SwiftUI view with temporary TextEditor |

**Key code patterns**:
```swift
// AppConfig.swift
enum AppConfig {
    static let scratchpadPath = FileManager.default.urls(
        for: .applicationSupportDirectory, in: .userDomainMask
    ).first!.appendingPathComponent("Thot/deskpad.md")

    static let defaultFont = NSFont(name: "JetBrainsMonoNL-Regular", size: 12)
        ?? NSFont.monospacedSystemFont(ofSize: 12, weight: .regular)

    static let backgroundColor = NSColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0)
    static let foregroundColor = NSColor(red: 0.9, green: 0.9, blue: 0.9, alpha: 1.0)
}
```

**Font registration**: Add `ATSApplicationFontsPath` = `Fonts` to Info.plist

**Verification**: App builds, window appears, can type text

---

### Phase 2: Scratchpad Persistence

**Files to create**:

| File | Purpose |
|------|---------|
| `Sources/Persistence/ScratchpadStorage.swift` | Actor for file I/O to deskpad.md |
| `Sources/Persistence/StateStorage.swift` | Actor for caret/scroll state JSON |

**Key behaviors**:
- `ScratchpadStorage.load()` - Creates directory if needed, returns empty string if no file
- `ScratchpadStorage.save(_:)` - Atomic write, UTF-8
- `EditorViewModel` debounces saves (500ms) via `Task.sleep`
- Force save on `scenePhase` change to `.background`/`.inactive`

**Verification**: Type, quit, relaunch - text persists. Check `~/Library/Application Support/Thot/deskpad.md` exists.

---

### Phase 3: AppKit-backed Editor

**Files to create**:

| File | Purpose |
|------|---------|
| `Sources/Editor/MarkdownTextView.swift` | NSViewRepresentable wrapping NSScrollView + NSTextView |

**NSTextView configuration**:
```swift
textView.isRichText = false
textView.allowsUndo = true
textView.usesFindPanel = true
textView.isAutomaticQuoteSubstitutionEnabled = false
textView.isAutomaticDashSubstitutionEnabled = false
textView.isAutomaticSpellingCorrectionEnabled = false
textView.isContinuousSpellCheckingEnabled = true
textView.font = AppConfig.defaultFont
textView.textColor = AppConfig.foregroundColor
textView.backgroundColor = AppConfig.backgroundColor
textView.insertionPointColor = AppConfig.foregroundColor
textView.textContainer?.widthTracksTextView = true
```

**Coordinator pattern**:
- Store `Binding<String>` in Coordinator
- `textDidChange()` updates binding and triggers highlighting

**Verification**: Dark background, JetBrains Mono, standard text operations work (Cmd+C/V/Z/A), Find panel (Cmd+F), text wraps, scrolling works

---

### Phase 4: Syntax Highlighting

**Files to create**:

| File | Purpose |
|------|---------|
| `Sources/Highlighting/SyntaxHighlightingEngine.swift` | Protocol definition for swappable engines |
| `Sources/Highlighting/RegexMarkdownHighlightingEngine.swift` | v1 regex-based implementation |
| `Sources/Highlighting/TextMateRuleSet.swift` | Parses ThotMarkdownTheme.json, maps scopes to attributes |
| `Sources/Highlighting/MarkdownPatterns.swift` | Regex patterns with TextMate-compatible scope names |
| `Sources/Tests/ThotTests/HighlightingEngineTests.swift` | Unit tests |

**Protocol definition**:
```swift
// SyntaxHighlightingEngine.swift
struct StyledRange {
    let range: NSRange
    let scope: String  // TextMate-compatible scope name
    let attributes: [NSAttributedString.Key: Any]
}

protocol SyntaxHighlightingEngine {
    func styledRanges(for text: String) -> [StyledRange]
}
```

**MarkdownPatterns order** (specific first):
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
11. Unordered list markers (- * +)
12. Ordered list markers (1. 2.)
13. Task checkboxes ([ ] [x])
14. HTML comments

**Highlighting integration**:
```swift
// In Coordinator
func textDidChange(_ notification: Notification) {
    // ... update binding
    scheduleHighlighting(for: textView)
}

private func scheduleHighlighting(for textView: NSTextView) {
    highlightTask?.cancel()
    highlightTask = Task { @MainActor in
        try? await Task.sleep(for: .milliseconds(100))
        guard !Task.isCancelled else { return }
        applyHighlighting(to: textView)
    }
}
```

**Verification**: Headings orange (#FF9D00), bold yellow (#FFD866), italic cyan (#8aeefb), inline code green (#78de8c), links purple (#AB9DF2), typing is responsive

---

### Phase 5: Paired Delimiters

**Files to create**:

| File | Purpose |
|------|---------|
| `Sources/Editor/PairedDelimiterTextView.swift` | NSTextView subclass with delimiter handling |
| `Sources/Tests/ThotTests/PairedDelimiterTests.swift` | Unit tests |

**Delimiter pairs**: `()` `[]` `{}` `''` `""` ``` `` ```

**Behaviors**:
1. Type opening → inserts pair, cursor between
2. Type closing when before existing closing → skip over
3. Select text, type opening → wraps selection
4. Backspace between empty pair → deletes both
5. Quote/backtick mid-word → single character (for contractions)

**Override method**: `insertText(_:replacementRange:)` and `deleteBackward(_:)`

**Verification**: All delimiter behaviors work as expected

---

### Phase 6: Polish & Menus

**Updates to existing files**:

| File | Changes |
|------|---------|
| `ThotApp.swift` | Add .commands { } for menus, window title "Thot" |
| `EditorViewModel.swift` | Add spellCheckEnabled, showClearConfirmation, clearContent() |
| `EditorView.swift` | Add confirmation alert for New Desk Pad |

**Files to create**:

| File | Purpose |
|------|---------|
| `Sources/Preferences/PreferencesView.swift` | Stub ("coming soon") |
| `Sources/Preferences/PreferencesModel.swift` | Empty placeholder |

**Menu structure**:
- **File**: New Desk Pad (with confirmation), Close Window
- **Edit**: Undo, Redo, Cut, Copy, Paste, Select All, Find
- **View**: Toggle spellcheck
- **Thot**: About, Preferences (stub), Quit

**Verification**: Window title "Thot", New Desk Pad shows confirmation, spellcheck toggles, About works

---

## File Manifest (Complete)

```
thot/
├── README.md                          # Phase 0
├── LICENSE                            # Phase 0
├── .gitattributes                     # Phase 0
├── .gitignore                         # Phase 0 (update)
├── Thot.xcodeproj/                    # Phase 1 (manual creation)
└── Sources/
    ├── ThotApp/
    │   ├── App/
    │   │   ├── ThotApp.swift          # Phase 1, update Phase 6
    │   │   └── AppConfig.swift        # Phase 1
    │   └── Info.plist                 # Phase 1
    ├── Editor/
    │   ├── EditorView.swift           # Phase 1, update Phase 3, 6
    │   ├── EditorViewModel.swift      # Phase 1, update Phase 2, 6
    │   ├── MarkdownTextView.swift     # Phase 3, update Phase 4
    │   └── PairedDelimiterTextView.swift  # Phase 5
    ├── Highlighting/
    │   ├── SyntaxHighlightingEngine.swift  # Phase 4 (protocol)
    │   ├── RegexMarkdownHighlightingEngine.swift  # Phase 4 (v1 impl)
    │   ├── TextMateRuleSet.swift      # Phase 4
    │   └── MarkdownPatterns.swift     # Phase 4
    ├── Persistence/
    │   ├── ScratchpadStorage.swift    # Phase 2
    │   └── StateStorage.swift         # Phase 2
    ├── Preferences/
    │   ├── PreferencesModel.swift     # Phase 6
    │   └── PreferencesView.swift      # Phase 6
    ├── Resources/
    │   ├── TextMate/
    │   │   └── ThotMarkdownTheme.json # Phase 0
    │   ├── Fonts/                     # Existing (4 JetBrains Mono variants)
    │   └── Assets.xcassets/
    │       └── AppIcon.appiconset/    # Existing (user-provided icons)
    ├── Tests/
    │   └── ThotTests/
    │       ├── HighlightingEngineTests.swift  # Phase 4
    │       └── PairedDelimiterTests.swift     # Phase 5
    └── Docs/                          # Existing, update throughout
        ├── IMPL_v1_DESKPAD.md         # Sync with implementation
        └── ARCHITECTURE_OVERVIEW.md   # Expand with technical details
```

---

## Potential Pitfalls & Mitigations

| Pitfall | Mitigation |
|---------|------------|
| NSTextStorage highlighting causes caret jump | Apply via `textDidChange` delegate, NOT `textStorageDidProcessEditing` |
| NSViewRepresentable parent reference invalidated | Store `Binding<String>` in Coordinator |
| Highlighting flickers | Debounce (100ms), batch with `beginEditing()`/`endEditing()` |
| JetBrains Mono not loading | Register via Info.plist `ATSApplicationFontsPath`, provide system fallback |
| Regex patterns conflict | Order carefully: bold before italic, fenced code first |
| Large documents lag | v1 accepts full-document re-highlight; future: incremental |
| Autosave race on quit | Force synchronous save on scene phase change |

---

## Documentation Sync Requirements (Critical)

**Goal**: Future agents should be able to read IMPL + ARCHITECTURE and get 90-100% of the context without redoing research.

### After Each Phase, Update:

1. **`Docs/IMPL_v1_DESKPAD.md`**:
   - Mark phase complete with date
   - Note any deviations from original spec
   - Add implementation notes for non-obvious decisions
   - Keep as "exclusively executable" backup of this plan

2. **`Docs/ARCHITECTURE_OVERVIEW.md`**:
   - Add new components as they're created
   - Document the `SyntaxHighlightingEngine` protocol abstraction
   - Document `RegexMarkdownHighlightingEngine` v1 implementation
   - Explain how future `TextMateHighlightingEngine` would plug in
   - Add data flow diagrams if helpful

### Specific Documentation Tasks:

| Phase | Documentation Update |
|-------|---------------------|
| 0 | Note regex engine choice, protocol abstraction in ARCHITECTURE |
| 1 | Document Xcode project structure, Info.plist settings |
| 2 | Document persistence layer, debounce strategy |
| 3 | Document NSViewRepresentable pattern, Coordinator design |
| 4 | Full `SyntaxHighlightingEngine` protocol docs, regex patterns reference |
| 5 | Document paired delimiter algorithm |
| 6 | Document menu structure, final UX behaviors |

### App Icon Documentation:
- v1 uses placeholder icon from `Sources/Resources/Assets.xcassets/AppIcon.appiconset`
- To swap: replace the `.appiconset` folder with new PNGs and matching `Contents.json`
- No code changes required for icon swap

---

## Verification Plan

| Phase | Test Method |
|-------|-------------|
| 0 | `git status`, `python -m json.tool ThotMarkdownTheme.json` |
| 1 | App launches, window appears, can type |
| 2 | Type, quit, relaunch - text persists |
| 3 | Dark theme, font correct, standard macOS text ops work |
| 4 | Markdown colors match TextMateRules.md, no typing lag |
| 5 | All delimiter pair behaviors work |
| 6 | Menus work, app feels complete |

**End-to-end**: Open Thot, write markdown with headings/bold/lists/code, see proper colors, use paired delimiters, quit, relaunch - everything preserved.
