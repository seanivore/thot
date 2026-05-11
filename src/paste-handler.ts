import { EditorView } from '@codemirror/view'

const SMART_QUOTE_MAP: Record<string, string> = {
  '“': '"',  // left double
  '”': '"',  // right double
  '‘': "'",  // left single
  '’': "'",  // right single
}

function normalizeSmartQuotes(text: string): string {
  return text.replace(/[“”‘’]/g, (c) => SMART_QUOTE_MAP[c] || c)
}

export const pastePlainText = EditorView.domEventHandlers({
  paste(event, view) {
    if (!event.clipboardData) return false
    const text = event.clipboardData.getData('text/plain')
    if (!text) return false

    event.preventDefault()
    const normalized = normalizeSmartQuotes(text)
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: normalized },
      selection: { anchor: from + normalized.length },
      userEvent: 'input.paste',
    })
    return true
  }
})
