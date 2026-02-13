# Thot

A web-based markdown scratchpad with IDE-like syntax highlighting. Works in any browser, installable as a PWA.

## Features

- **Single continuous writing surface** - No file management, no note lists, just your thoughts
- **Semantic markdown highlighting** - Headings, bold, italic, code, links, lists all visually differentiated
- **Dark theme** - Monospaced JetBrains Mono font on a dark background
- **Automatic persistence** - Your content is always saved to browser storage, restored exactly as you left it
- **Zero friction** - Open, type, close. No save dialogs, no prompts.
- **Cross-platform** - Works on macOS, Windows, Linux, iOS, Android
- **Installable PWA** - Add to your dock/home screen for app-like experience
- **Offline capable** - Works without internet after first load

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Editor**: [CodeMirror 6](https://codemirror.net/) - High-performance text editor
- **Build**: [Vite](https://vitejs.dev/) - Fast build tool
- **Language**: TypeScript
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## Architecture

Thot v2 is a pure web application:

```
Browser/PWA
├── CodeMirror 6 (editor, highlighting, keybindings)
├── localStorage (content persistence)
└── Service Worker (offline support)
```

### Why Web?

Thot v1 was a native macOS app using SwiftUI + NSTextView. We discovered that this architecture has fundamental performance limitations for text editors (see `docs/archive/OvercomeChallenges.md`).

VS Code, Cursor, and modern editors use web technologies because:
- CodeMirror/Monaco handle incremental parsing efficiently
- Virtual scrolling works out of the box
- One codebase runs everywhere

## Data Storage

Your content is stored in browser localStorage:
- `thot:content` - Your markdown text
- `thot:state` - Cursor position and scroll state

To export your content, simply copy/paste or use the export feature (coming soon).

## Philosophy

Thot is intentionally minimal. It's a **desk pad**, not a note-taking system. Think of it as the digital equivalent of a legal pad that never leaves your desk.

See [docs/YOUR_THOTS.md](docs/archive/v2/v2_0_0_UPDATES.md) for the implementation specification.

## License

MIT License - Copyright (c) 2026 Sean August Horvath

See [LICENSE](LICENSE) for details.
