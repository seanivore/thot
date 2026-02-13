// Thot v2 - CodeMirror Editor Setup
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { styleTags, tags } from '@lezer/highlight'
import { thotTheme } from './theme'
import { hangingIndentPlugin } from './hanging-indent'
import { forceSave } from './persistence'
import {
  bulletMarkTag,
  orderedMarkTag,
  bulletContentTag,
  orderedContentTag,
  tableTag,
} from './highlight-tags'

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

  // Complete styleTags overrides for markdown parser
  // Path-based matches (depth>0) beat default processingInstruction (depth=0)
  const markdownStyleOverrides = {
    props: [
      styleTags({
        // ═══ MARKER OVERRIDES ═══

        // Heading # markers → same color as heading text
        HeaderMark: tags.heading,

        // Bold ** markers → same color as bold text
        'StrongEmphasis/EmphasisMark': tags.strong,

        // Italic * markers → same color as italic text
        'Emphasis/EmphasisMark': tags.emphasis,

        // Blockquote > markers → same color as blockquote text
        QuoteMark: tags.quote,

        // Inline code ` delimiters → same color as inline code
        'InlineCode/CodeMark': tags.monospace,
        // FencedCode/CodeMark stays processingInstruction → #6767fc

        // Bullet list markers (- * +) → gold
        'BulletList/ListItem/ListMark': bulletMarkTag,

        // Ordered list markers (1. 2. 3.) → red
        'OrderedList/ListItem/ListMark': orderedMarkTag,

        // Strikethrough ~~ markers → same as strikethrough text
        StrikethroughMark: tags.strikethrough,

        // Link []() markers → same color as link text
        LinkMark: tags.link,

        // Superscript ^ markers → same as superscript text
        SuperscriptMark: tags.special(tags.content),

        // Subscript ~ markers → same as subscript text
        SubscriptMark: tags.special(tags.content),

        // Horizontal rule --- → mint
        HorizontalRule: tags.contentSeparator,

        // ═══ CONTENT OVERRIDES ═══
        // Inherit mode (/...) propagates to all descendants

        // Bullet list content → cyan
        'BulletList/...': bulletContentTag,

        // Ordered list content → pink
        'OrderedList/...': orderedContentTag,

        // Table content → lime (overrides GFM defaults)
        'Table/...': tableTag,
      })
    ]
  }

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

      // Hanging indent (line decorations — lowest priority)
      hangingIndentPlugin,

      // Markdown language support with GFM base, custom style overrides, and code languages
      markdown({
        base: markdownLanguage,  // Enables GFM (Table, Strikethrough, TaskList) + Subscript, Superscript, Emoji
        codeLanguages: languages,
        extensions: [markdownStyleOverrides],
      }),

      // Keybindings
      keymap.of([
        // CMD+S intercept — prevent browser save dialog, trigger forceSave
        {
          key: 'Mod-s',
          run: (view: EditorView) => {
            forceSave(view.state.doc.toString())
            return true
          },
        },
        ...defaultKeymap,
        ...historyKeymap,
        indentWithTab
      ]),

      // Line wrapping at window edge
      EditorView.lineWrapping,

      // Thot dark theme (editor chrome + syntax highlighting — highest priority)
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
