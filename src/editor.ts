// Thot v2 - CodeMirror Editor Setup
import { EditorView, ViewPlugin, ViewUpdate, Decoration, DecorationSet, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view'
import { EditorState, RangeSetBuilder } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { syntaxTree } from '@codemirror/language'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { styleTags, tags } from '@lezer/highlight'
import { thotTheme } from './theme'
import { hangingIndentPlugin } from './hanging-indent'
import { forceSave } from './persistence'
import {
  colors,
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

// ═══════════════════════════════════════════════════════════════════
// Targeted ViewPlugin for context-dependent marker highlighting
//
// WHY THIS IS NEEDED:
// Lezer's ruleNodeProp.combine() merges base parser rules with
// extension rules sorted by depth (lower depth first). getStyleTags()
// returns the first matching rule. The base parser's no-context
// depth=0 rules (e.g. ListMark → processingInstruction) always match
// before our context-dependent rules can be evaluated.
//
// This ViewPlugin handles ONLY the 3 cases where we need to
// differentiate a marker by its parent context:
//   1. ListMark inside BulletList → gold
//   2. ListMark inside OrderedList → red
//   3. CodeMark inside InlineCode → red-orange
//
// Everything else works through styleTags + HighlightStyle cascade.
// ═══════════════════════════════════════════════════════════════════

// Inline styles guarantee these override any HighlightStyle CSS class,
// since inline style attributes have the highest CSS specificity.
const bulletMarkDeco = Decoration.mark({ attributes: { style: `color: ${colors.bulletMarker}; font-weight: 700` } })
const numberMarkDeco = Decoration.mark({ attributes: { style: `color: ${colors.numberedMarker}; font-weight: 700` } })
const inlineCodeMarkDeco = Decoration.mark({ attributes: { style: `color: ${colors.inlineCode}` } })

function buildMarkerDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>()
  const tree = syntaxTree(view.state)
  const decos: { from: number; to: number; deco: Decoration }[] = []

  for (const { from, to } of view.visibleRanges) {
    // Stack-based context tracking — avoids .node.parent which can fail
    // on Lezer buffer nodes. enter/leave callbacks track which list type
    // we're currently inside, so ListMark just checks the stack.
    const listStack: string[] = []

    tree.iterate({
      from,
      to,
      enter(node) {
        // Track list context via stack
        if (node.name === 'BulletList') { listStack.push('bullet'); return }
        if (node.name === 'OrderedList') { listStack.push('ordered'); return }

        // List markers — use stack to determine bullet vs numbered
        if (node.name === 'ListMark' && listStack.length > 0) {
          const listType = listStack[listStack.length - 1]
          if (listType === 'bullet') {
            decos.push({ from: node.from, to: node.to, deco: bulletMarkDeco })
          } else {
            decos.push({ from: node.from, to: node.to, deco: numberMarkDeco })
          }
          return
        }

        // Inline code marks — backticks should match code text color
        // CodeMark inside InlineCode → red-orange; inside FencedCode → stays blue-purple
        if (node.name === 'CodeMark') {
          let parent = node.node.parent
          while (parent) {
            if (parent.name === 'InlineCode') {
              decos.push({ from: node.from, to: node.to, deco: inlineCodeMarkDeco })
              return
            }
            if (parent.name === 'FencedCode') {
              return
            }
            parent = parent.parent
          }
        }
      },
      leave(node) {
        if (node.name === 'BulletList' || node.name === 'OrderedList') {
          listStack.pop()
        }
      }
    })
  }

  decos.sort((a, b) => a.from - b.from || a.to - b.to)
  for (const { from, to, deco } of decos) {
    if (from < to) builder.add(from, to, deco)
  }
  return builder.finish()
}

const markerDecorations = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet
    constructor(view: EditorView) {
      this.decorations = buildMarkerDecorations(view)
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildMarkerDecorations(update.view)
      }
    }
  },
  { decorations: (v) => v.decorations }
)

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

  // styleTags overrides for markdown parser
  //
  // HOW THESE WORK:
  // - Simple name overrides (HeaderMark, QuoteMark, etc.) work because at
  //   depth=0, the extension's rule is placed BEFORE the base parser's rule
  //   by combine(), so getStyleTags() returns the extension rule first.
  // - Inherit rules (BulletList/..., OrderedList/..., Table/...) work because
  //   at depth=0, the extension's inherit rule replaces the base's inherit rule.
  // - Context-based overrides (InlineCode/CodeMark, etc.) are BLOCKED by
  //   combine() — the base parser's depth=0 no-context rule always matches
  //   first. These cases are handled by the ViewPlugin above instead.
  const markdownStyleOverrides = {
    props: [
      styleTags({
        // ═══ MARKER OVERRIDES (depth=0, same depth as base → extension wins) ═══

        // Heading # markers → same color as heading text
        HeaderMark: tags.heading,

        // Blockquote > markers → same color as blockquote text
        QuoteMark: tags.quote,

        // Strikethrough ~~ markers → same as strikethrough text
        StrikethroughMark: tags.strikethrough,

        // Link []() markers → same color as link text
        LinkMark: tags.link,

        // Superscript ^ markers
        SuperscriptMark: tags.special(tags.content),

        // Subscript ~ markers
        SubscriptMark: tags.special(tags.content),

        // Horizontal rule --- → mint
        HorizontalRule: tags.contentSeparator,

        // ═══ CONTENT OVERRIDES (inherit mode, depth=0 → extension wins) ═══

        // Bullet list content → cyan
        'BulletList/...': bulletContentTag,

        // Ordered list content → pink
        'OrderedList/...': orderedContentTag,

        // Table content → lime
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

      // Context-dependent marker decorations (list markers, inline code marks)
      markerDecorations,

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
