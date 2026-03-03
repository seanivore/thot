// Thot v2 - Main Entry Point
import './styles/main.css'
import { createEditor, getContent, getCursorPos, getScrollTop, setCursorPos, setScrollTop } from './editor'
import { saveContent, loadContent, forceSave, hasSavedContent, setPersistenceId } from './persistence'
import { saveState, loadState, forceSaveState, setStateId } from './state'
import { shareDocument } from './file-system'

// Welcome content for first-time users
const welcomeContent = `# Thot

Add your current **thots** in markdown. The *syntax highlighting* feels like your favorite IDE. 

## Feature Overview

- Instant syntax highlighting
- Auto-save to browser storage
- Works offline as a PWA

### Workflow Friendly

  * **Add Thoughts Without Breaking Your Flow**

    + Your content auto-saves as you type
    + The contents are persistent
      - Leave the app open on your desktop 24/7
      - Restart the computer
      - Close and relaunch the app

> "The best ideas come when you least expect them."

### What Are Your Thots? 

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

*What are your thots?*
`

function init() {
  const editorElement = document.getElementById('editor')

  if (!editorElement) {
    console.error('Editor element not found')
    return
  }

  // --- Bootloader Orchestration ---
  const urlParams = new URLSearchParams(window.location.search)
  let windowId = urlParams.get('id')

  if (!windowId) {
    // Check for legacy data first before generating a new ID
    const legacyContent = localStorage.getItem('thot:content')
    const legacyState = localStorage.getItem('thot:state')

    // Default to the central 'main' draftpad
    windowId = 'main'

    // Update URL without refreshing the page
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('id', windowId)
    window.history.replaceState({ path: newUrl.href }, '', newUrl.href)

    // Migrate legacy data if it exists into this new partition
    if (legacyContent !== null) {
      localStorage.setItem(`thot:content:${windowId}`, legacyContent)
      localStorage.removeItem('thot:content') // Delete old to prevent collisions
    }
    if (legacyState !== null) {
      localStorage.setItem(`thot:state:${windowId}`, legacyState)
      localStorage.removeItem('thot:state')
    }
  }

  // Configure storage keys for all future saves in this window
  setPersistenceId(windowId)
  setStateId(windowId)

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

  // PWA Share Button Logic
  const shareBtn = document.getElementById('btn-share')
  if (shareBtn && 'share' in navigator) {
    shareBtn.classList.remove('hidden')
    shareBtn.addEventListener('click', () => {
      shareDocument(getContent(view))
    })
  }

  console.log('Thot v2 initialized', hasSavedContent() ? '(restored session)' : '(first run)')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
