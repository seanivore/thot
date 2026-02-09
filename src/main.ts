// Thot v2 - Main Entry Point
import './styles/main.css'
import { createEditor } from './editor'

// Sample markdown to show off the editor
const sampleMarkdown = `# Welcome to Thot

A **markdown scratchpad** with *IDE-like* syntax highlighting.

## Features

- Instant syntax highlighting
- Auto-save (coming in Phase 3)
- Works offline as a PWA

### Code Example

\`\`\`typescript
const greeting = "Hello, Thot!";
console.log(greeting);
\`\`\`

> This is a blockquote for your thoughts.

Here's some \`inline code\` and a [link](https://example.com).

---

1. First item
2. Second item
3. Third item

- [ ] Task one
- [x] Task two (done!)

| Column 1 | Column 2 |
|----------|----------|
| Data A   | Data B   |

Start typing to replace this sample text...
`

function init() {
  const editorElement = document.getElementById('editor')

  if (!editorElement) {
    console.error('Editor element not found')
    return
  }

  const view = createEditor({
    parent: editorElement,
    initialContent: sampleMarkdown,
    onChange: (content) => {
      // Will hook up persistence in Phase 3
      console.log('Content changed:', content.length, 'chars')
    }
  })

  // Focus the editor
  view.focus()

  console.log('Thot v2 initialized')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
