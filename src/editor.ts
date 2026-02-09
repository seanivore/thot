// Thot v2 - CodeMirror Editor Setup
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { thotTheme } from './theme'

export interface EditorConfig {
  parent: HTMLElement
  initialContent?: string
  onChange?: (content: string) => void
  onStateChange?: (cursorPos: number, scrollTop: number) => void
}

export function createEditor(config: EditorConfig): EditorView {
  const { parent, initialContent = '', onChange, onStateChange } = config

  const updateListener = EditorView.updateListener.of((update) => {
    // Content changes
    if (update.docChanged && onChange) {
      onChange(update.state.doc.toString())
    }

    // Cursor or scroll changes
    if (onStateChange && (update.selectionSet || update.geometryChanged || update.viewportChanged)) {
      const cursorPos = update.state.selection.main.head
      const scrollTop = update.view.scrollDOM.scrollTop
      onStateChange(cursorPos, scrollTop)
    }
  })

  const state = EditorState.create({
    doc: initialContent,
    extensions: [
      // Line numbers and gutter
      lineNumbers(),
      highlightActiveLineGutter(),

      // Basic editor features
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      bracketMatching(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),

      // Markdown language support
      markdown(),

      // Keybindings
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        indentWithTab
      ]),

      // Line wrapping at window edge
      EditorView.lineWrapping,

      // Thot dark theme (editor chrome + syntax highlighting)
      thotTheme,

      // Change listener
      updateListener
    ]
  })

  const view = new EditorView({
    state,
    parent
  })

  return view
}

export function getContent(view: EditorView): string {
  return view.state.doc.toString()
}

export function setContent(view: EditorView, content: string): void {
  view.dispatch({
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: content
    }
  })
}

export function getCursorPos(view: EditorView): number {
  return view.state.selection.main.head
}

export function setCursorPos(view: EditorView, pos: number): void {
  // Clamp position to valid range
  const maxPos = view.state.doc.length
  const safePos = Math.min(Math.max(0, pos), maxPos)

  view.dispatch({
    selection: { anchor: safePos, head: safePos },
    scrollIntoView: true
  })
}

export function getScrollTop(view: EditorView): number {
  return view.scrollDOM.scrollTop
}

export function setScrollTop(view: EditorView, scrollTop: number): void {
  view.scrollDOM.scrollTop = scrollTop
}
