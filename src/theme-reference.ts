/**
 * Thot Theme Color Reference
 *
 * This file documents the color mappings from the original TextMate theme
 * (ThotMarkdownTheme.json) to CodeMirror 6 highlight styles.
 *
 * Use this as a reference when implementing src/theme.ts
 */

export const THOT_COLORS = {
  // Background and base colors
  background: '#1a1a1a',
  foreground: '#e6e6e6',
  selection: '#44475a',
  cursor: '#e6e6e6',

  // Headings (all levels)
  heading: '#FF9D00',        // Orange, bold

  // Emphasis
  bold: '#FFD866',           // Yellow, bold
  italic: '#8aeefb',         // Cyan, italic
  strikethrough: '#6272A4',  // Gray, strikethrough

  // Code
  inlineCode: '#78de8c',     // Green
  fencedCodeDelimiter: '#6767fc',  // Blue-purple
  codeBlockContent: '#8989e3',     // Light purple
  codeLanguage: '#F1FA8C',   // Yellow

  // Links
  linkText: '#AB9DF2',       // Purple
  linkUrl: '#8BE9FD',        // Cyan
  referenceLink: '#50FA7B',  // Green

  // Lists
  bulletMarker: '#dfc532',   // Gold, bold
  numberedMarker: '#ff6b6b', // Red, bold
  bulletContent: '#5feda4',  // Mint green
  numberedContent: '#f8a5c2', // Pink
  checkbox: '#50faad',       // Bright green, bold

  // Block elements
  blockquote: '#E6DB74',     // Yellow, italic
  horizontalRule: '#93f9c6', // Mint
  table: '#e2ff79',          // Lime

  // Special syntax
  htmlTag: '#FF79C6',        // Pink
  comment: '#6272A4',        // Gray, italic
  escapeChar: '#FF79C6',     // Pink
  emoji: '#FFB86C',          // Orange
  math: '#8BE9FD',           // Cyan
  footnote: '#8BE9FD',       // Cyan, italic

  // YAML/Front matter
  frontmatter: '#BD93F9',    // Purple

  // Brackets and delimiters
  parentheses: '#ff9e64',    // Orange
  squareBrackets: '#7dcfff', // Light blue
  quotedText: '#c792ea',     // Purple

  // Diff
  diffAddition: '#50FA7B',   // Green
  diffDeletion: '#FF5555',   // Red
  diffChange: '#FFB86C',     // Orange
} as const

/**
 * Font configuration
 */
export const THOT_FONTS = {
  family: '"JetBrains Mono NL", "JetBrains Mono", monospace',
  size: '12px',
  lineHeight: 1.5,
} as const
