// Thot v2 - Main Entry Point
import './styles/main.css'
import { createEditor, getContent, getCursorPos, getScrollTop, setCursorPos, setScrollTop } from './editor'
import { saveContent, loadContent, forceSave, hasSavedContent } from './persistence'
import { saveState, loadState, forceSaveState } from './state'

// Welcome content for first-time users
const welcomeContent = `# Welcome to Thot

A **markdown scratchpad** with *IDE-like* syntax highlighting.

## Features

- Instant syntax highlighting
- Auto-save to browser storage
- Works offline as a PWA

## Try it out

Start typing to replace this text. Your content auto-saves as you type.

> "The best ideas come when you least expect them."

### Markdown Examples

**Bold text** and *italic text* and \`inline code\`

\`\`\`javascript
const greeting = "Hello, Thot!";
console.log(greeting);
\`\`\`

---

1. First item
2. Second item
3. Third item

- Bullet one
- Bullet two
- Bullet three

- [ ] Todo item
- [x] Done item

| Column A | Column B |
|----------|----------|
| Data 1   | Data 2   |

[Link example](https://example.com)

---

*Start writing your thots below...*
`

function init() {
  const editorElement = document.getElementById('editor')

  if (!editorElement) {
    console.error('Editor element not found')
    return
  }

  // Load saved content, or show welcome for first-timers
  const savedContent = loadContent()
  const initialContent = hasSavedContent() ? savedContent : welcomeContent

  // Load saved state (cursor/scroll position)
  const savedState = loadState()

  const view = createEditor({
    parent: editorElement,
    initialContent,
    onChange: (content) => {
      // Auto-save content with debounce
      saveContent(content)
    },
    onStateChange: (cursorPos, scrollTop) => {
      // Auto-save state with debounce
      saveState({ cursorPos, scrollTop })
    }
  })

  // Restore cursor and scroll position after a brief delay
  // (allows the editor to fully render first)
  if (savedState && hasSavedContent()) {
    requestAnimationFrame(() => {
      setCursorPos(view, savedState.cursorPos)
      // Small delay for scroll to work after cursor is set
      setTimeout(() => {
        setScrollTop(view, savedState.scrollTop)
      }, 50)
    })
  }

  // Force save before page unload
  window.addEventListener('beforeunload', () => {
    forceSave(getContent(view))
    forceSaveState({
      cursorPos: getCursorPos(view),
      scrollTop: getScrollTop(view)
    })
  })

  // Also save on visibility change (switching tabs, minimizing)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      forceSave(getContent(view))
      forceSaveState({
        cursorPos: getCursorPos(view),
        scrollTop: getScrollTop(view)
      })
    }
  })

  // Focus the editor
  view.focus()

  console.log('Thot v2 initialized', hasSavedContent() ? '(restored session)' : '(first run)')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
