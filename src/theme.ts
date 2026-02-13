// Thot v2 - Dark Theme for CodeMirror 6
// Complete rewrite matching theme-reference.ts and feedback hierarchy
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const colors = {
  bg: '#1a1a1a',
  fg: '#e6e6e6',
  selection: '#44475a',
  cursor: '#e6e6e6',
  gutter: '#6272a4',

  heading: '#FF9D00',
  bold: '#FFD866',
  italic: '#BF437F',
  strikethrough: '#6272A4',

  inlineCode: '#F34D3E',
  blockCodeDelimiter: '#8989e3',
  codeBlockContent: '#8989e3',
  codeLanguage: '#F1FA8C',

  linkText: '#AB9DF2',
  linkUrl: '#8BE9FD',

  bulletMarker: '#dfc532',
  bulletContent: '#8aeefb',
  numberedMarker: '#ff6b6b',
  numberedContent: '#f8a5c2',
  checkbox: '#8BE9FD',

  blockquote: '#E6DB74',
  hr: '#93f9c6',
  table: '#e2ff79',

  html: '#FF79C6',
  comment: '#6272A4',
  escape: '#FF79C6',
}

/**
 * Editor chrome theme (gutters, cursor, selection, scrollbar, etc.)
 * Also includes CSS classes for ViewPlugin decorations.
 */
export const thotEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: colors.bg,
    color: colors.fg,
    height: '100%',
    fontSize: '12px',
  },
  '.cm-scroller': {
    fontFamily: '"JetBrains Mono NL", monospace',
    lineHeight: '1.0',
    padding: '16px',
  },
  '.cm-content': {
    caretColor: colors.cursor,
    fontWeight: '500',
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
  '.cm-line': {
    padding: '0 2px',
  },

  // ViewPlugin decoration classes (lower specificity than HighlightStyle)
  '.thot-bullet-mark': {
    color: colors.bulletMarker,
  },
  '.thot-number-mark': {
    color: colors.numberedMarker,
  },
  '.thot-bullet-content': {
    color: colors.bulletContent,
  },
  '.thot-number-content': {
    color: colors.numberedContent,
  },
  '.thot-inline-code-mark': {
    color: colors.inlineCode,
  },
  '.thot-block-code-mark': {
    color: colors.blockCodeDelimiter,
  },
  '.thot-table': {
    color: colors.table,
  },
  '.thot-hr': {
    color: colors.hr,
  },
  '.thot-checkbox': {
    color: colors.checkbox,
  },
}, { dark: true })

/**
 * Syntax highlighting styles
 * Order matters: HighlightStyle.define uses first-match-wins.
 * Hierarchy: strikethrough → inlineCode → codeBlock → checkbox →
 *            bold → italic → table → heading → list → blockquote → foreground
 */
export const thotHighlightStyle = HighlightStyle.define([
  // 1. Strikethrough — BLEND (color + decoration, inherits weight)
  { tag: tags.strikethrough, color: colors.strikethrough, textDecoration: 'line-through', fontWeight: '100' },

  // 2. Inline code — FULL override
  { tag: tags.monospace, color: colors.inlineCode },

  // 3. Code block content — BLEND
  // (handled by language-specific tags + fallback)

  // 4. Bold — FULL
  { tag: tags.strong, color: colors.bold, fontWeight: '800' },

  // 5. Italic — FULL
  { tag: tags.emphasis, color: colors.italic, fontWeight: '800', fontStyle: 'italic' },

  // 6. Headings — FULL (all levels)
  { tag: tags.heading, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading1, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading2, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading3, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading4, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading5, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading6, color: colors.heading, fontWeight: '800' },

  // 7. Blockquote — FULL
  { tag: tags.quote, color: colors.blockquote, fontWeight: '100', fontStyle: 'italic' },

  // 8. Links
  { tag: tags.link, color: colors.linkText, fontWeight: '700' },
  { tag: tags.url, color: colors.linkUrl, fontStyle: 'italic' },

  // 9. Content separator (horizontal rule)
  { tag: tags.contentSeparator, color: colors.hr },
  { tag: tags.separator, color: colors.hr },

  // 10. Comments and HTML
  { tag: tags.comment, color: colors.comment, fontWeight: '100', fontStyle: 'italic' },
  { tag: tags.angleBracket, color: colors.html },
  { tag: tags.tagName, color: colors.html },
  { tag: tags.attributeName, color: colors.bold },
  { tag: tags.attributeValue, color: colors.inlineCode },

  // 11. Code block language identifier
  { tag: tags.labelName, color: colors.codeLanguage },

  // 12. processingInstruction — used by markdown parser for various delimiters
  // We override most with styleTags, but keep a fallback
  { tag: tags.processingInstruction, color: colors.blockCodeDelimiter },

  // 13. Escape characters
  { tag: tags.escape, color: colors.escape },

  // 14. Code block language-specific tokens
  { tag: tags.keyword, color: colors.html },
  { tag: tags.operator, color: colors.italic },
  { tag: tags.definitionKeyword, color: colors.html },
  { tag: tags.controlKeyword, color: colors.html },
  { tag: tags.variableName, color: colors.fg },
  { tag: tags.definition(tags.variableName), color: colors.bold },
  { tag: tags.function(tags.variableName), color: colors.linkText },
  { tag: tags.propertyName, color: colors.italic },
  { tag: tags.typeName, color: colors.heading },
  { tag: tags.className, color: colors.heading },
  { tag: tags.string, color: colors.inlineCode },
  { tag: tags.number, color: colors.checkbox },
  { tag: tags.bool, color: colors.checkbox },
  { tag: tags.null, color: colors.strikethrough },

  // 15. Brackets and punctuation
  { tag: tags.punctuation, color: colors.fg },
  { tag: tags.paren, color: colors.linkText },
  { tag: tags.squareBracket, color: colors.linkUrl },

  // 16. Lists (fallback — ViewPlugin classes handle most list styling)
  { tag: tags.list, color: colors.bulletContent },

  // 17. Base content — fallback
  { tag: tags.content, color: colors.fg, fontWeight: '500' },
])

/**
 * Combined theme extension
 */
export const thotTheme = [
  thotEditorTheme,
  syntaxHighlighting(thotHighlightStyle),
]
