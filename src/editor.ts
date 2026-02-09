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
}

export function createEditor(config: EditorConfig): EditorView {
  const { parent, initialContent = '', onChange } = config

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && onChange) {
      onChange(update.state.doc.toString())
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
