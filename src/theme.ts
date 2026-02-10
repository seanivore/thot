// Thot v2 - Dark Theme for CodeMirror 6
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

/**
 * Thot color palette - ported from ThotMarkdownTheme.json
 */
const colors = {
  // Base
  bg: '#1a1a1a',
  fg: '#e6e6e6',
  selection: '#44475a',
  cursor: '#e6e6e6',
  gutter: '#6272a4',

  // Syntax
  heading: '#FF9D00',      // Orange
  bold: '#FFD866',         // Yellow
  italic: '#8aeefb',       // Cyan
  strikethrough: '#6272A4', // Gray

  // Code
  inlineCode: '#F34D3E',   // Green
  codeDelimiter: '#6767fc', // Blue-purple
  codeContent: '#F34D3E',  // Light purple
  codeLanguage: '#F1FA8C', // Yellow

  // Links
  link: '#AB9DF2',         // Purple
  url: '#8BE9FD',          // Cyan

  // Lists
  listMarker: '#dfc532',   // Gold
  listContent: '#5feda4',  // Mint
  checkbox: '#50faad',     // Bright green

  // Blocks
  quote: '#E6DB74',        // Yellow
  hr: '#93f9c6',           // Mint
  table: '#e2ff79',        // Lime

  // Special
  html: '#FF79C6',         // Pink
  comment: '#6272A4',      // Gray
  escape: '#FF79C6',       // Pink
  emoji: '#FFB86C',        // Orange
  meta: '#BD93F9',         // Purple
}

/**
 * Editor chrome theme (gutters, cursor, selection, etc.)
 */
export const thotEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: colors.bg,
    color: colors.fg,
    height: '100%',
    fontSize: '14px',
  },
  '.cm-scroller': {
    fontFamily: '"JetBrains Mono NL", monospace',
    lineHeight: '1.6',
    padding: '16px',
  },
  '.cm-content': {
    caretColor: colors.cursor,
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: colors.cursor,
    borderLeftWidth: '2px',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: colors.selection,
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(68, 71, 90, 0.3)',
  },
  '.cm-gutters': {
    backgroundColor: colors.bg,
    color: colors.gutter,
    border: 'none',
    paddingRight: '8px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: colors.fg,
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 16px',
  },
  // Markdown-specific styling
  '.cm-line': {
    padding: '0 2px',
  },
}, { dark: true })

/**
 * Syntax highlighting styles
 */
export const thotHighlightStyle = HighlightStyle.define([
  // Headings - all levels get orange bold
  { tag: tags.heading, color: colors.heading, fontWeight: 'bold' },
  { tag: tags.heading1, color: colors.heading, fontWeight: 'bold' },
  { tag: tags.heading2, color: colors.heading, fontWeight: 'bold' },
  { tag: tags.heading3, color: colors.heading, fontWeight: 'bold' },
  { tag: tags.heading4, color: colors.heading, fontWeight: 'bold' },
  { tag: tags.heading5, color: colors.heading, fontWeight: 'bold' },
  { tag: tags.heading6, color: colors.heading, fontWeight: 'bold' },

  // Emphasis
  { tag: tags.strong, color: colors.bold, fontWeight: 'bold' },
  { tag: tags.emphasis, color: colors.italic, fontStyle: 'italic' },
  { tag: tags.strikethrough, color: colors.strikethrough, textDecoration: 'line-through' },

  // Code
  { tag: tags.monospace, color: colors.inlineCode, fontFamily: '"JetBrains Mono NL", monospace' },
  { tag: tags.processingInstruction, color: colors.codeDelimiter }, // ``` delimiters

  // Links
  { tag: tags.link, color: colors.link },
  { tag: tags.url, color: colors.url },

  // Quotes and meta
  { tag: tags.quote, color: colors.quote, fontStyle: 'italic' },
  { tag: tags.meta, color: colors.meta },

  // Lists - markers and content
  { tag: tags.list, color: colors.listContent },

  // Special characters and punctuation
  { tag: tags.contentSeparator, color: colors.hr }, // ---
  { tag: tags.separator, color: colors.hr },

  // Comments and HTML
  { tag: tags.comment, color: colors.comment, fontStyle: 'italic' },
  { tag: tags.angleBracket, color: colors.html },
  { tag: tags.tagName, color: colors.html },
  { tag: tags.attributeName, color: colors.bold },
  { tag: tags.attributeValue, color: colors.inlineCode },

  // Code block language identifier
  { tag: tags.labelName, color: colors.codeLanguage },

  // Special punctuation
  { tag: tags.punctuation, color: colors.fg },
  { tag: tags.paren, color: colors.link },
  { tag: tags.squareBracket, color: colors.url },

  // Escape characters
  { tag: tags.escape, color: colors.escape },

  // Content and literals
  { tag: tags.content, color: colors.fg },
  { tag: tags.string, color: colors.inlineCode },
  { tag: tags.number, color: colors.checkbox },
  { tag: tags.bool, color: colors.checkbox },
  { tag: tags.null, color: colors.strikethrough },

  // Operators and keywords (for code blocks)
  { tag: tags.keyword, color: colors.html },
  { tag: tags.operator, color: colors.italic },
  { tag: tags.definitionKeyword, color: colors.html },
  { tag: tags.controlKeyword, color: colors.html },

  // Variables and functions (for code blocks)
  { tag: tags.variableName, color: colors.fg },
  { tag: tags.definition(tags.variableName), color: colors.bold },
  { tag: tags.function(tags.variableName), color: colors.link },
  { tag: tags.propertyName, color: colors.italic },
  { tag: tags.typeName, color: colors.heading },
  { tag: tags.className, color: colors.heading },
])

/**
 * Combined theme extension for use in editor setup
 */
export const thotTheme = [
  thotEditorTheme,
  syntaxHighlighting(thotHighlightStyle),
]
