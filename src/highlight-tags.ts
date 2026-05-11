// Thot v2 - Custom Highlight Tags & Color Definitions
// Single source of truth for all highlighting colors and custom Lezer tags
import { Tag } from '@lezer/highlight'

// ═══ Custom Tags ═══
// For elements that need unique colors beyond built-in Lezer tags

// List markers (need different colors for bullet vs ordered)
export const bulletMarkTag = Tag.define()     // Bullet list markers: -, *, +
export const orderedMarkTag = Tag.define()    // Ordered list markers: 1., 2., 3.

// List content (need different colors for bullet vs ordered)
export const bulletContentTag = Tag.define()  // Text in bullet list items
export const orderedContentTag = Tag.define() // Text in ordered list items

// Table (all parts unified to one color)
export const tableTag = Tag.define()          // Table pipes, headers, cells, delimiters

// ═══ Complete Color Palette ═══
// Every highlightable element in the app, organized by category

export const colors = {
  // ─── Editor Chrome ───
  bg: '#1a1a1a',                  // Editor background
  fg: '#e6e6e6',                  // Default text / foreground
  selection: '#44475a',           // Selected text background
  cursor: '#e6e6e6',              // Cursor color
  gutter: '#6272a4',              // Line number gutter

  // ─── Headings ───
  heading: '#FF9D00',             // Heading text and # markers (all levels)

  // ─── Text Emphasis ───
  bold: '#FFD866',                // **bold text** and ** markers
  italic: '#BF437F',              // *italic text* and * markers
  strikethrough: '#6272A4',       // ~~strikethrough~~ text and ~~ markers

  // ─── Code ───
  inlineCode: '#F34D3E',          // `inline code` text and ` delimiters
  fencedCodeDelimiter: '#6767fc', // ``` markers on fenced code blocks
  codeBlockContent: '#8989e3',    // Fallback color for plain code block text
  codeLanguage: '#F1FA8C',        // Language identifier after ``` (e.g. "javascript")

  // ─── Links ───
  linkText: '#AB9DF2',         // [link text] and []() markers
  linkUrl: '#8BE9FD',          // (https://url) destination
  linkTitle: '#AB9DF2',        // "title" in [text](url "title")
  referenceLink: '#50FA7B',    // [ref]: url definitions

  // ─── Images ───
  imageAltText: '#AB9DF2',     // ![alt text] description
  imageUrl: '#8BE9FD',         // (image.jpg) source URL

  // ─── Autolinks ───
  autolink: '#8BE9FD',         // <http://auto.detected.url>

  // ─── Lists ───
  bulletMarker: '#dfc532',     // Bullet markers: -, *, +
  bulletContent: '#8aeefb',    // Text content in bullet list items
  numberedMarker: '#ff6b6b',   // Ordered markers: 1., 2., 3.
  numberedContent: '#f8a5c2',  // Text content in ordered list items
  checkbox: '#8BE9FD',         // Task list [ ] open marker
  checkboxChecked: '#5A7DB8',  // Task list [x] completed marker — darker, reads as "done"

  // ─── Block Elements ───
  blockquote: '#E6DB74',       // > markers and blockquote content
  horizontalRule: '#93f9c6',   // --- horizontal dividers
  table: '#e2ff79',            // | pipes, headers, cells, delimiters

  // ─── Special Syntax ───
  htmlTag: '#FF79C6',          // <div>, </span>, HTML tag brackets
  htmlAttribute: '#FFD866',    // HTML attribute names (class=, id=, etc.)
  htmlAttrValue: '#F34D3E',    // HTML attribute values ("value")
  comment: '#6272A4',          // <!-- comments -->
  escapeChar: '#FF79C6',       // Backslash escapes: \* \[ etc.
  entity: '#FF79C6',           // HTML entities &amp; &lt; &gt; etc.
  emoji: '#FFB86C',            // :emoji: shortcodes
  math: '#8BE9FD',             // $inline$ and $$block$$ math
  footnote: '#8BE9FD',         // [^1] footnote references
  superscript: '#8BE9FD',      // ^superscript^
  subscript: '#8BE9FD',        // ~subscript~
  hardBreak: '#6272A4',        // Trailing spaces / backslash line breaks

  // ─── YAML / Front Matter ───
  frontmatter: '#BD93F9',      // --- front matter --- blocks

  // ─── Brackets & Delimiters (standalone, outside links) ───
  parentheses: '#ff9e64',      // (parenthesized text)
  squareBrackets: '#7dcfff',   // [bracketed text]
  quotedText: '#c792ea',       // "quoted text"

  // ─── Diff (inside code blocks or diff-formatted content) ───
  diffAddition: '#50FA7B',     // Added lines
  diffDeletion: '#FF5555',     // Removed lines
  diffChange: '#FFB86C',       // Changed lines

  // ─── Code Block Language Tokens (inside fenced code blocks) ───

  // -- Keywords --
  codeKeyword: '#FF79C6',           // General keywords: if, else, return, etc.
  codeControlKeyword: '#FF79C6',    // Control flow: if, while, for, switch, try, catch
  codeDefinitionKeyword: '#FF79C6', // Definitions: function, class, let, var, const, def
  codeModuleKeyword: '#FF79C6',     // Modules: import, export, from, require
  codeOperatorKeyword: '#e6e6e6',   // Keyword operators: typeof, instanceof, in, of, is, not
  codeSelf: '#FF79C6',              // Self-reference: this, self, super
  codeModifier: '#e6e6e6',          // Modifiers: async, static, get, set, public, private

  // -- Names & Identifiers --
  codeVariable: '#e6e6e6',          // Variable names
  codeVariableDef: '#FFD866',       // Variable definitions (where declared)
  codeFunction: '#AB9DF2',          // Function names (where called)
  codeFunctionDef: '#AB9DF2',       // Function definitions (where declared)
  codeProperty: '#BF437F',          // Object property names
  codePropertyDef: '#BF437F',       // Property definitions
  codePrivateProperty: '#BF437F',   // Private properties (#field, __field)
  codeType: '#FF9D00',              // Type names: String, Number, interface, etc.
  codeTypeDef: '#FF9D00',           // Type definitions
  codeClass: '#FF9D00',             // Class names
  codeClassDef: '#FF9D00',          // Class definitions
  codeNamespace: '#e6e6e6',         // Namespace/module names
  codeMacro: '#e6e6e6',             // Macro names
  codeLabel: '#F1FA8C',             // Labels (goto labels, switch cases)
  codeConstant: '#e6e6e6',          // Constant names (UPPER_CASE)
  codeStandard: '#e6e6e6',          // Standard library names
  codeLocal: '#e6e6e6',             // Local-scoped variables

  // -- Literals --
  codeString: '#F34D3E',            // String literals: "hello", 'world'
  codeDocString: '#F34D3E',         // Documentation strings: Python """ docstrings """
  codeTemplateString: '#F34D3E',    // Template literals: `hello ${name}`
  codeNumber: '#8BE9FD',            // Numeric literals (general)
  codeInteger: '#8BE9FD',           // Integer literals: 42, 0xFF
  codeFloat: '#8BE9FD',             // Float literals: 3.14, 1e10
  codeBool: '#8BE9FD',              // Boolean literals: true, false
  codeNull: '#6272A4',              // Null literals: null, undefined, None, nil
  codeAtom: '#8BE9FD',              // Atomic values: super, special constants
  codeRegexp: '#e6e6e6',            // Regular expressions: /pattern/flags
  codeEscape: '#FF79C6',            // Escape sequences: \n, \t, \xFF
  codeColor: '#e6e6e6',             // CSS color literals: #fff, rgb(), hsl()
  codeUrl: '#8BE9FD',               // URL literals in code
  codeUnit: '#e6e6e6',              // CSS units: px, em, %, rem, vw

  // -- Operators --
  codeOperator: '#BF437F',          // General operators: =, +, -, !, etc.
  codeArithmeticOp: '#BF437F',      // Arithmetic: +, -, *, /, %
  codeLogicOp: '#BF437F',           // Logical: &&, ||, !, and, or
  codeBitwiseOp: '#BF437F',         // Bitwise: &, |, ^, ~, <<, >>
  codeCompareOp: '#BF437F',         // Comparison: ==, !=, <, >, <=, >=
  codeUpdateOp: '#BF437F',          // Update: ++, --, +=, -=
  codeDefinitionOp: '#BF437F',      // Assignment: =, :=, =>
  codeTypeOp: '#BF437F',            // Type operators: as, satisfies
  codeControlOp: '#BF437F',         // Control: ?, :, ??
  codeDeref: '#e6e6e6',             // Dereference: . (member access)

  // -- Comments --
  codeLineComment: '#6272A4',       // Line comments: // comment
  codeBlockComment: '#6272A4',      // Block comments: /* comment */
  codeDocComment: '#6272A4',        // Doc comments: /** @param ... */

  // -- Punctuation & Brackets --
  codePunctuation: '#e6e6e6',       // General punctuation
  codeSeparator: '#e6e6e6',         // Separators: , ; :
  codeParen: '#ff9e64',             // Parentheses: ( )
  codeSquareBracket: '#7dcfff',     // Square brackets: [ ]
  codeBrace: '#e6e6e6',             // Curly braces: { }
  codeAngleBracket: '#FF79C6',      // Angle brackets: < > (generics, JSX)

  // -- Meta & Annotations --
  codeMeta: '#e6e6e6',              // Meta information
  codeAnnotation: '#e6e6e6',        // Decorators/annotations: @decorator
  codeProcessingInstruction: '#6767fc', // Preprocessor directives

  // -- HTML/JSX in Code --
  codeTagName: '#FF79C6',           // HTML/JSX tag names: div, span
  codeStdTagName: '#FF79C6',        // Standard HTML element names
  codeAttributeName: '#FFD866',     // HTML/JSX attribute names
  codeAttributeValue: '#F34D3E',    // HTML/JSX attribute values

  // -- Errors --
  codeInvalid: '#FF5555',           // Syntax errors and invalid tokens

  // ─── Future Markdown Extensions (shown as foreground for now) ───
  highlightedText: '#e6e6e6',       // ==highlighted== (needs parser extension)
  definitionList: '#e6e6e6',        // Term\n: Definition (needs parser extension)
  abbreviation: '#e6e6e6',          // *[abbr]: explanation (needs parser extension)
  criticMarkupAdd: '#e6e6e6',       // {++addition++} (needs parser extension)
  criticMarkupDel: '#e6e6e6',       // {--deletion--} (needs parser extension)
  criticMarkupSub: '#e6e6e6',       // {~~old~>new~~} (needs parser extension)
  criticMarkupComment: '#e6e6e6',   // {>>comment<<} (needs parser extension)
  criticMarkupHighlight: '#e6e6e6', // {==highlight==} (needs parser extension)
  admonition: '#e6e6e6',            // !!! note / !!! warning (needs parser extension)
  citation: '#e6e6e6',              // [@citation] (needs parser extension)
  allCaps: '#e6e6e6',               // ALL CAPS TEXT (needs custom grammar)
  keyboardKey: '#e6e6e6',           // <kbd>Ctrl</kbd> (parsed as HTML)
  markdownAttribute: '#e6e6e6',     // {#id .class key=value} (needs parser extension)
  wikiLink: '#e6e6e6',              // [[wiki-style links]] (needs parser extension)
  footnoteDefinition: '#e6e6e6',    // [^1]: footnote text (needs parser extension)
  taskListText: '#e6e6e6',          // Text after - [x] checkbox (inherits list content)
  diagramBlock: '#e6e6e6',          // ```mermaid / ```graphviz (uses code block highlighting)
}
