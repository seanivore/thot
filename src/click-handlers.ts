import { EditorView } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'

export const interactiveLinks = () => {
  return EditorView.domEventHandlers({
    mousedown(event, view) {
      // Only act on CMD/Ctrl+Click; bare clicks place the cursor as normal
      if (!event.metaKey && !event.ctrlKey) return false

      const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
      if (pos === null) return false

      const node = syntaxTree(view.state).resolveInner(pos)

      // Plain URL token (autolink or bare URL)
      if (node.name === 'URL') {
        const urlText = view.state.sliceDoc(node.from, node.to)
        if (urlText.startsWith('#')) {
          handleAnchorClick(urlText, view)
        } else {
          window.open(urlText, '_blank')
        }
        event.preventDefault()
        return true
      }

      // [text](destination) — walk up from the clicked node to find a Link
      // ancestor. Covers clicks on LinkMark (brackets/parens), LinkTitle,
      // LinkLabel, AND the visible link text (which resolves to the Link
      // node itself because plain inline text has no named child).
      let cur: typeof node | null = node
      while (cur) {
        if (cur.name === 'Link') {
          const urlNode = cur.getChild('URL')
          if (urlNode) {
            const urlText = view.state.sliceDoc(urlNode.from, urlNode.to)
            if (urlText.startsWith('#')) {
              handleAnchorClick(urlText, view)
            } else {
              window.open(urlText, '_blank')
            }
            event.preventDefault()
            return true
          }
          break
        }
        cur = cur.parent
      }

      return false
    }
  })
}

function handleAnchorClick(anchor: string, view: EditorView) {
  const targetSlug = anchor.slice(1).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  let foundPos = -1

  syntaxTree(view.state).iterate({
    enter(node) {
      if (node.name.includes('Heading')) {
        const headingText = view.state.sliceDoc(node.from, node.to)
        const textOnly = headingText.replace(/^#+\s+/, '').replace(/[\r\n].*$/s, '')
        const slug = textOnly.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (slug === targetSlug) {
          foundPos = node.from
          return false  // stop iteration
        }
      }
    }
  })

  if (foundPos > -1) {
    view.dispatch({
      selection: { anchor: foundPos },
      effects: EditorView.scrollIntoView(foundPos, { y: 'start' })
    })
  }
}
