# v3.2.0 Interactive URLs & Anchors: Implementation Guide
**Branch**: `feat/v3-urls-anchors`
**Target**: `main`

## Goal
Implement a click handler that allows users to interact with Hyperlinks, File Paths, and Markdown Page Anchors directly from the CodeMirror editor.

## Scope Definitions

### 1. Clickable URLs & File Paths
- **Behavior**: Clicking a valid URL `https://...` or an absolute file path `/Users/...` opens it. 
  - If a URL, it opens in a new browser tab.
  - If a local file path (and supported by environment), it will attempt to handle it gracefully (e.g., if we build out an Electron/Native shell later, but for the web app, it will primarily focus on `http`/`https` URLs).
- **Implementation Mechanism**: We will use CodeMirror's `EditorView.domEventHandlers` to intercept `mousedown` events before they merely place the cursor.

### 2. Markdown Page Anchors
- **Behavior**: Clicking an anchor link like `[Go to Conclusion](#conclusion)` instantly scrolls the CodeMirror viewport to the heading `# Conclusion`.
- **Implementation Mechanism**: We will read the anchor text (`#conclusion`), iterate through the `syntaxTree` to locate a `ATXHeading` or `SetextHeading` node whose text content slugifies to `conclusion`, and dispatch a `view.dispatch({effects: EditorView.scrollIntoView(pos, {y: "start"})})` effect.

## Execution Plan (Exclusively Executable)

### Step 1: Create the Interceptor Extension
Create `src/click-handlers.ts`. This will export an extension containing the `EditorView.domEventHandlers`.

```typescript
import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

export const interactiveLinks = () => {
  return EditorView.domEventHandlers({
    mousedown(event, view) {
      // 1. Check if user holding modifier key (optional UX choice: CMD+Click vs normal Click)
      // Let's assume standard click for now, but maybe require CMD/Ctrl to avoid accidental clicks while editing
      if (!event.metaKey && !event.ctrlKey) return false;

      // 2. Find position of click
      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
      if (!pos) return false

      // 3. Resolve syntax node
      const node = syntaxTree(view.state).resolveInner(pos)

      // 4. Handle URLs
      if (node.name === "URL") {
        const urlText = view.state.sliceDoc(node.from, node.to)
        window.open(urlText, '_blank')
        event.preventDefault()
        return true
      }

      // 5. Handle Markdown Link Destinations (e.g., [text](destination))
      if (node.name === "LinkMark" || node.name === "LinkTitle") {
         // We might need to look at parent node `Link` to find the exact URL string
         const parent = node.parent
         if (parent && parent.name === "Link") {
            // Child nodes of Link: LinkMark `[`, ... `]`, LinkMark `(`, URL, LinkMark `)`
            const urlNode = parent.getChild("URL")
            if (urlNode) {
               const urlText = view.state.sliceDoc(urlNode.from, urlNode.to)
               
               // Is it an anchor?
               if (urlText.startsWith('#')) {
                 handleAnchorClick(urlText, view)
               } else {
                 window.open(urlText, '_blank')
               }
               event.preventDefault()
               return true
            }
         }
      }

      return false
    }
  })
}

// Helper to scroll to heading
function handleAnchorClick(anchor: string, view: EditorView) {
  const targetSlug = anchor.slice(1).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  let foundPos = -1

  // Iterate syntax tree to find headings
  syntaxTree(view.state).iterate({
    enter(node) {
      if (node.name.includes("Heading")) {
        const headingText = view.state.sliceDoc(node.from, node.to)
        // Strip markdown `#` markers and slugify
        const textOnly = headingText.replace(/^#+\s+/, '')
        const slug = textOnly.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        
        if (slug === targetSlug) {
          foundPos = node.from
          return false // Stop iteration
        }
      }
    }
  })

  // Scroll if found
  if (foundPos > -1) {
    view.dispatch({
      selection: { anchor: foundPos },
      effects: EditorView.scrollIntoView(foundPos, { y: "start" })
    })
  }
}
```

### Step 2: Inject Extension into Editor
Modify `src/editor.ts` to import `interactiveLinks` and append it to the `extensions` array.

```typescript
// inside src/editor.ts
import { interactiveLinks } from './click-handlers'

// down in extensions array:
interactiveLinks(),
```

### Step 3: Implement Visual Feedback (CSS)
We should give the user feedback that CMD/Ctrl+Clicking is available.
Modify `src/theme.ts`:
```typescript
'.cm-content': {
  // when holding cmd, make links show a pointer
  // Note: doing this pure CSS is tricky since it depends on keyboard state,
  // we might just make URLs cursor: pointer by default.
}
// Add to tags.url mapping:
{ tag: tags.url, class: 'thot-url-link', cursor: 'pointer' }
```

## Verification
- Hold CMD/Ctrl and click `https://google.com` - should open new tab.
- Hold CMD/Ctrl and click `[Example](https://example.com)` - should open new tab.
- Click `[Intro](#introduction)` - should snap viewport to the `# Introduction` heading in the current document.
