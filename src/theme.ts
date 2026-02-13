// Thot v2 - Dark Theme for CodeMirror 6
// All colors imported from highlight-tags.ts (single source of truth)
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import {
  colors,
  bulletMarkTag,
  orderedMarkTag,
  bulletContentTag,
  orderedContentTag,
  tableTag,
} from './highlight-tags'

/**
 * Editor chrome theme (gutters, cursor, selection, scrollbar, etc.)
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
}, { dark: true })

/**
 * Syntax highlighting styles
 *
 * CASCADE ORDER: LOW priority first → HIGH priority last.
 * When the Lezer inherit mechanism puts two CSS classes on one span,
 * the LATER CSS rule in the stylesheet wins. This ordering ensures
 * the desired priority hierarchy.
 *
 * Priority (highest wins):
 *   strikethrough → inlineCode → bold → italic → table →
 *   heading → list markers/content → blockquote → foreground
 */
export const thotHighlightStyle = HighlightStyle.define([
  // ╔══════════════════════════════════════════════════════════════╗
  // ║  LOWEST PRIORITY — defined first, CSS rule appears earliest ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ─── Base text fallback ───
  { tag: tags.content, color: colors.fg, fontWeight: '500' },

  // ─── Diff markers ───
  { tag: tags.inserted, color: colors.diffAddition },
  { tag: tags.deleted, color: colors.diffDeletion },
  { tag: tags.changed, color: colors.diffChange },

  // ─── Invalid / error tokens ───
  { tag: tags.invalid, color: colors.codeInvalid },

  // ─── Brackets and punctuation ───
  { tag: tags.punctuation, color: colors.codePunctuation },
  { tag: tags.separator, color: colors.codeSeparator },
  { tag: tags.bracket, color: colors.codePunctuation },
  { tag: tags.paren, color: colors.codeParen },
  { tag: tags.squareBracket, color: colors.codeSquareBracket },
  { tag: tags.brace, color: colors.codeBrace },
  { tag: tags.angleBracket, color: colors.codeAngleBracket },

  // ─── Code block: Names & Identifiers ───
  { tag: tags.name, color: colors.codeVariable },
  { tag: tags.variableName, color: colors.codeVariable },
  { tag: tags.definition(tags.variableName), color: colors.codeVariableDef },
  { tag: tags.function(tags.variableName), color: colors.codeFunction },
  { tag: tags.local(tags.variableName), color: colors.codeLocal },
  { tag: tags.constant(tags.variableName), color: colors.codeConstant },
  { tag: tags.standard(tags.variableName), color: colors.codeStandard },
  { tag: tags.propertyName, color: colors.codeProperty },
  { tag: tags.definition(tags.propertyName), color: colors.codePropertyDef },
  { tag: tags.function(tags.propertyName), color: colors.codeFunction },
  { tag: tags.special(tags.propertyName), color: colors.codePrivateProperty },
  { tag: tags.typeName, color: colors.codeType },
  { tag: tags.definition(tags.typeName), color: colors.codeTypeDef },
  { tag: tags.className, color: colors.codeClass },
  { tag: tags.definition(tags.className), color: colors.codeClassDef },
  { tag: tags.namespace, color: colors.codeNamespace },
  { tag: tags.macroName, color: colors.codeMacro },
  { tag: tags.labelName, color: colors.codeLabel },

  // ─── Code block: Literals ───
  { tag: tags.literal, color: colors.fg },
  { tag: tags.string, color: colors.codeString },
  { tag: tags.docString, color: colors.codeDocString },
  { tag: tags.special(tags.string), color: colors.codeTemplateString },
  { tag: tags.character, color: colors.emoji },
  { tag: tags.number, color: colors.codeNumber },
  { tag: tags.integer, color: colors.codeInteger },
  { tag: tags.float, color: colors.codeFloat },
  { tag: tags.bool, color: colors.codeBool },
  { tag: tags.null, color: colors.codeNull },
  { tag: tags.atom, color: colors.codeAtom },
  { tag: tags.regexp, color: colors.codeRegexp },
  { tag: tags.escape, color: colors.codeEscape },
  { tag: tags.color, color: colors.codeColor },
  { tag: tags.url, color: colors.codeUrl },
  { tag: tags.unit, color: colors.codeUnit },

  // ─── Code block: Keywords ───
  { tag: tags.keyword, color: colors.codeKeyword },
  { tag: tags.self, color: colors.codeSelf },
  { tag: tags.controlKeyword, color: colors.codeControlKeyword },
  { tag: tags.definitionKeyword, color: colors.codeDefinitionKeyword },
  { tag: tags.moduleKeyword, color: colors.codeModuleKeyword },
  { tag: tags.operatorKeyword, color: colors.codeOperatorKeyword },
  { tag: tags.modifier, color: colors.codeModifier },

  // ─── Code block: Operators ───
  { tag: tags.operator, color: colors.codeOperator },
  { tag: tags.derefOperator, color: colors.codeDeref },
  { tag: tags.arithmeticOperator, color: colors.codeArithmeticOp },
  { tag: tags.logicOperator, color: colors.codeLogicOp },
  { tag: tags.bitwiseOperator, color: colors.codeBitwiseOp },
  { tag: tags.compareOperator, color: colors.codeCompareOp },
  { tag: tags.updateOperator, color: colors.codeUpdateOp },
  { tag: tags.definitionOperator, color: colors.codeDefinitionOp },
  { tag: tags.typeOperator, color: colors.codeTypeOp },
  { tag: tags.controlOperator, color: colors.codeControlOp },

  // ─── Code block: Comments ───
  { tag: tags.lineComment, color: colors.codeLineComment, fontWeight: '100', fontStyle: 'italic' },
  { tag: tags.blockComment, color: colors.codeBlockComment, fontWeight: '100', fontStyle: 'italic' },
  { tag: tags.docComment, color: colors.codeDocComment, fontWeight: '100', fontStyle: 'italic' },

  // ─── Code block: HTML/JSX ───
  { tag: tags.tagName, color: colors.codeTagName },
  { tag: tags.standard(tags.tagName), color: colors.codeStdTagName },
  { tag: tags.attributeName, color: colors.codeAttributeName },
  { tag: tags.attributeValue, color: colors.codeAttributeValue },

  // ─── Code block: Meta ───
  { tag: tags.meta, color: colors.codeMeta },
  { tag: tags.annotation, color: colors.codeAnnotation },
  { tag: tags.processingInstruction, color: colors.fencedCodeDelimiter },

  // ─── Document metadata ───
  { tag: tags.documentMeta, color: colors.frontmatter },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  MARKDOWN ELEMENTS — priority increases downward             ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ─── Comments (markdown <!-- --> ) ───
  { tag: tags.comment, color: colors.comment, fontWeight: '100', fontStyle: 'italic' },

  // ─── Special content (superscript, subscript) ───
  { tag: tags.special(tags.content), color: colors.superscript },

  // ─── Links ───
  { tag: tags.link, color: colors.linkText, fontWeight: '700' },

  // ─── Content separator (horizontal rule) ───
  { tag: tags.contentSeparator, color: colors.horizontalRule },

  // ─── Blockquote ───
  { tag: tags.quote, color: colors.blockquote, fontWeight: '100', fontStyle: 'italic' },

  // ─── List content (custom tags) ───
  { tag: orderedContentTag, color: colors.numberedContent },
  { tag: bulletContentTag, color: colors.bulletContent },

  // ─── List markers (custom tags) ───
  { tag: orderedMarkTag, color: colors.numberedMarker, fontWeight: '700' },
  { tag: bulletMarkTag, color: colors.bulletMarker, fontWeight: '700' },

  // ─── Headings ───
  { tag: tags.heading, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading1, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading2, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading3, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading4, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading5, color: colors.heading, fontWeight: '800' },
  { tag: tags.heading6, color: colors.heading, fontWeight: '800' },

  // ─── Table (custom tag) ───
  { tag: tableTag, color: colors.table },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  HIGHEST PRIORITY — defined last, CSS rule wins cascade     ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ─── Emphasis ───
  { tag: tags.emphasis, color: colors.italic, fontWeight: '800', fontStyle: 'italic' },
  { tag: tags.strong, color: colors.bold, fontWeight: '800' },

  // ─── Inline code ───
  { tag: tags.monospace, color: colors.inlineCode },

  // ─── Strikethrough ───
  { tag: tags.strikethrough, color: colors.strikethrough, textDecoration: 'line-through', fontWeight: '100' },
])

/**
 * Combined theme extension
 */
export const thotTheme = [
  thotEditorTheme,
  syntaxHighlighting(thotHighlightStyle),
]
