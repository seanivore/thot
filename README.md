# Thot

A macOS desk pad app that behaves like TextEdit's always-open unsaved TXT window, but with IDE-like markdown editing.

## Features

- **Single continuous writing surface** - No file management, no note lists, just your thoughts
- **Semantic markdown highlighting** - Headings, bold, italic, code, links, lists all visually differentiated
- **IDE-like paired delimiters** - Auto-pairing for `() [] {} '' "" ``` ``
- **Dark theme** - Monospaced JetBrains Mono font on a dark background
- **Automatic persistence** - Your content is always saved, restored exactly as you left it
- **Zero friction** - Launch, type, close. No save dialogs, no prompts.

## Requirements

- macOS 13.0+
- Xcode 15.0+ (for building)

## Building

1. Open `Thot.xcodeproj` in Xcode
2. Select the "Thot" scheme
3. Build and run (Cmd+R)

## Architecture

Thot uses a hybrid SwiftUI + AppKit architecture:

- **SwiftUI** for app lifecycle, window management, and menus
- **AppKit NSTextView** (via NSViewRepresentable) for the editor surface

This provides the mature text editing capabilities of NSTextView while leveraging SwiftUI's declarative approach for the app shell.

### Key Components

- `ThotApp` - SwiftUI app entry point
- `EditorViewModel` - Holds text state, coordinates persistence and highlighting
- `EditorView` - SwiftUI container for the editor
- `MarkdownTextView` - NSViewRepresentable wrapping NSTextView
- `RegexMarkdownHighlightingEngine` - Syntax highlighting using TextMate-compatible scopes
- `ScratchpadStorage` - File I/O for the desk pad content

## Data Storage

Your desk pad content is stored at:
```
~/Library/Application Support/Thot/deskpad.md
```

This is a plain markdown file that you can back up, sync, or edit with other tools.

## Philosophy

Thot v1 is intentionally minimal. It's a **desk pad**, not a note-taking system. Think of it as the digital equivalent of a legal pad that never leaves your desk.

See [IMPL_v1_DESKPAD.md](Sources/Docs/IMPL_v1_DESKPAD.md) for the full product specification.

## License

MIT License - Copyright (c) 2026 Sean August Horvath

See [LICENSE](LICENSE) for details.
