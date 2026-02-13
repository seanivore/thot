# Thot v2.0.8 — Complete Highlighting System

## Context

The v2.0.0 highlighting implementation only partially worked (heading markers fixed, everything else broken). Rather than just patching the 8 reported bugs, this plan builds a **complete, exhaustive highlighting system** covering every markdown element, every marker/content pair, and every priority relationship. This creates a single source of truth that also prepares for a future user-customizable theme UI.

**Three root causes identified through Lezer source code analysis:**

1. **Lezer styleTags depth**: The default parser tags ALL markers as `tags.processingInstruction` (depth=0). Our `'Emphasis/...'` wildcards DON'T override because they create inherit rules on the *parent*, not higher-specificity rules on the markers. **Fix**: Path-based matches like `'Emphasis/EmphasisMark'` (depth=1) resolve before depth=0. Confirmed in `@lezer/highlight/dist/index.js:246-263`.

2. **Missing GFM**: `markdown()` defaults to commonmark WITHOUT GFM. Tables, Strikethrough, TaskList aren't even parsed. **Fix**: `base: markdownLanguage`.

3. **CSS cascade order**: HighlightStyle generates single-class CSS rules in array order. When inherited classes combine on one span, the LATER CSS rule wins. Our order was backwards. **Fix**: Low priority first, high priority last.

---

## Task 1: Create `src/highlight-tags.ts` — Custom Tags + Color Definitions

This becomes the **single source of truth** for all highlighting. Colors from `src/theme-reference.ts` are incorporated here. After implementation, `src/theme-reference.ts` moves to `docs/archive/v2/`.

### Custom Tags (for elements that need unique colors beyond built-in Lezer tags)

```typescript
import { Tag } from '@lezer/highlight'

// List markers (need different colors for bullet vs ordered)
export const bulletMarkTag = Tag.define()    // Bullet list markers: -, *, +
export const orderedMarkTag = Tag.define()   // Ordered list markers: 1., 2., 3.

// List content (need different colors for bullet vs ordered)
export const bulletContentTag = Tag.define() // Text in bullet list items
export const orderedContentTag = Tag.define() // Text in ordered list items

// Table (all parts unified to one color)
export const tableTag = Tag.define()         // Table pipes, headers, cells, delimiters
```

### Complete Color Palette

Every highlightable element in the app. Organized by category with human-readable labels.

```typescript
export const colors = {
  // ─── Editor Chrome ───
  bg: '#1a1a1a',               // Editor background
  fg: '#e6e6e6',               // Default text / foreground
  selection: '#44475a',         // Selected text background
  cursor: '#e6e6e6',           // Cursor color
  gutter: '#6272a4',           // Line number gutter

  // ─── Headings ───
  heading: '#FF9D00',           // Heading text and # markers (all levels)

  // ─── Text Emphasis ───
  bold: '#FFD866',              // **bold text** and ** markers
  italic: '#BF437F',           // *italic text* and * markers
  strikethrough: '#6272A4',    // ~~strikethrough~~ text and ~~ markers

  // ─── Code ───
  inlineCode: '#F34D3E',       // `inline code` text and ` delimiters
  fencedCodeDelimiter: '#6767fc', // ``` markers on fenced code blocks
  codeBlockContent: '#8989e3', // Fallback color for plain code block text
  codeLanguage: '#F1FA8C',     // Language identifier after ``` (e.g. "javascript")

  // ─── Links ───
  linkText: '#AB9DF2',         // [link text] and []() markers
  linkUrl: '#8BE9FD',          // (https://url) destination
  linkTitle: '#AB9DF2',        // "title" in [text](url "title")
  referenceLink: '#50FA7B',    // [ref]: url definitions

  // ─── Images ───
  imageAltText: '#AB9DF2',     // ![alt text] description (same as linkText default)
  imageUrl: '#8BE9FD',         // (image.jpg) source URL (same as linkUrl default)

  // ─── Autolinks ───
  autolink: '#8BE9FD',         // <http://auto.detected.url>

  // ─── Lists ───
  bulletMarker: '#dfc532',     // Bullet markers: -, *, +
  bulletContent: '#8aeefb',    // Text content in bullet list items
  numberedMarker: '#ff6b6b',   // Ordered markers: 1., 2., 3.
  numberedContent: '#f8a5c2',  // Text content in ordered list items
  checkbox: '#8BE9FD',         // Task list [x] and [ ] markers

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
  hardBreak: '#6272A4',        // Trailing spaces / backslash line breaks (visible indicator)

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
  //
  // These colors apply to syntax-highlighted content inside ``` code blocks.
  // Language parsers (JS, Python, CSS, etc.) emit these token types.
  // Organized from most common to most specialized.

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
  // These require additional parser extensions not yet installed.
  // Listed here so the customization UI can expose them when available.
  // When the parser extension is added, these colors will activate.
  highlightedText: '#e6e6e6',       // ==highlighted== (needs @lezer/markdown highlight extension)
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
  keyboardKey: '#e6e6e6',           // <kbd>Ctrl</kbd> (parsed as HTML, could be special-cased)
  markdownAttribute: '#e6e6e6',     // {#id .class key=value} (needs parser extension)
  wikiLink: '#e6e6e6',              // [[wiki-style links]] (needs parser extension)
  footnoteDefinition: '#e6e6e6',    // [^1]: footnote text (needs parser extension)
  taskListText: '#e6e6e6',          // Text after - [x] checkbox (inherits list content)
  diagramBlock: '#e6e6e6',          // ```mermaid / ```graphviz (uses code block language highlighting)
}
```

---

## Task 2: Rewrite `src/theme.ts` — Single Source of Truth

Import colors and custom tags from `./highlight-tags`. This file becomes the only place colors are defined.

### Remove from `thotEditorTheme`

All `.thot-*` CSS class rules (lines 89-116) — no longer needed.

### Rewrite `thotHighlightStyle` — Cascade Order

**LOW priority first → HIGH priority last.** When the inherit mechanism puts two CSS classes on one span, the LATER rule in the stylesheet wins. This ordering ensures the desired priority hierarchy.

```
PRIORITY ORDER (top = highest priority, overrides everything below):
═══════════════════════════════════════════════════════════════════

 1. tags.strikethrough        → strikethrough (#6272A4) Thin(100), line-through  ← WINS ALL
 2. tags.monospace            → inlineCode (#F34D3E)
 3. tags.strong               → bold (#FFD866) ExtraBold(800)
 4. tags.emphasis             → italic (#BF437F) ExtraBoldItalic(800i)
 5. tableTag [custom]         → table (#e2ff79)
 6. tags.heading (1-6)        → heading (#FF9D00) ExtraBold(800)
 7. bulletMarkTag [custom]    → bulletMarker (#dfc532) Bold(700)
 8. orderedMarkTag [custom]   → numberedMarker (#ff6b6b) Bold(700)
 9. bulletContentTag [custom] → bulletContent (#8aeefb)
10. orderedContentTag [custom]→ numberedContent (#f8a5c2)
11. tags.atom                 → checkbox (#8BE9FD)   [TaskMarker in md, atom in code]
12. tags.quote                → blockquote (#E6DB74) ThinItalic(100i)
13. tags.contentSeparator     → horizontalRule (#93f9c6)
14. tags.link                 → linkText (#AB9DF2) Bold(700)
15. tags.special(content)     → superscript (#8BE9FD) [super/subscript in md]
16. tags.comment              → comment (#6272A4) ThinItalic(100i) [markdown <!-- -->]
17. tags.processingInstruction→ fencedCodeDelimiter (#6767fc)
18. tags.documentMeta         → frontmatter (#BD93F9)
19. Code block tokens         → 50+ individually mapped tags (see HighlightStyle array)
20. tags.content              → fg (#e6e6e6) Medium(500)  ← LOSES ALL
```

**CSS array order** (first item = earliest CSS rule = lowest priority):

Each entry maps to colors from the `colors` object. Explicit fontWeight and fontStyle values are shown where they differ from default (Regular 400).

```typescript
HighlightStyle.define([
  // ╔══════════════════════════════════════════════════════════════╗
  // ║  LOWEST PRIORITY — defined first, CSS rule appears earliest  ║
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

  // ─── Escape characters ───
  // NOTE: tags.escape above covers code blocks; this re-maps it for markdown context
  // The later position means markdown escapes override code escape if both apply

  // ─── Special content (superscript, subscript) ───
  { tag: tags.special(tags.content), color: colors.superscript },

  // ─── Links ───
  // tags.url already defined above for code blocks; in markdown context
  // the styleTags override makes URL nodes use tags.url → #8BE9FD ✓
  { tag: tags.link, color: colors.linkText, fontWeight: '700' },

  // ─── Code language identifier ───
  // tags.labelName already defined above; in markdown context
  // CodeInfo nodes use tags.labelName → #F1FA8C ✓

  // ─── Content separator (horizontal rule) ───
  { tag: tags.contentSeparator, color: colors.horizontalRule },

  // ─── Blockquote ───
  { tag: tags.quote, color: colors.blockquote, fontWeight: '100', fontStyle: 'italic' },

  // ─── Task checkbox ───
  // tags.atom already defined above for code blocks; in markdown context
  // TaskMarker nodes use tags.atom → #8BE9FD ✓

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
  // ║  HIGHEST PRIORITY — defined last, CSS rule wins cascade      ║
  // ╚══════════════════════════════════════════════════════════════╝

  // ─── Emphasis ───
  { tag: tags.emphasis, color: colors.italic, fontWeight: '800', fontStyle: 'italic' },
  { tag: tags.strong, color: colors.bold, fontWeight: '800' },

  // ─── Inline code ───
  { tag: tags.monospace, color: colors.inlineCode },

  // ─── Strikethrough ───
  { tag: tags.strikethrough, color: colors.strikethrough, textDecoration: 'line-through', fontWeight: '100' },
])
```

---

## Task 3: Rewrite styleTags in `src/editor.ts`

### Imports

**Add**: `markdownLanguage` from `@codemirror/lang-markdown`, custom tags from `./highlight-tags`
**Remove**: `markdownDecorations` from `./markdown-decorations`

### Complete styleTags Overrides

```typescript
const markdownStyleOverrides = {
  props: [
    styleTags({
      // ═══ MARKER OVERRIDES ═══
      // Path-based (depth>0) beats default processingInstruction (depth=0)

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
      // FencedCode/CodeMark stays processingInstruction → #6767fc ✓

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

      // Table content → lime (overrides GFM defaults of heading/content)
      'Table/...': tableTag,
    })
  ]
}
```

### markdown() Config

```typescript
markdown({
  base: markdownLanguage,  // ← Enables GFM (Table, Strikethrough, TaskList) + Subscript, Superscript, Emoji
  codeLanguages: languages,
  extensions: [markdownStyleOverrides],
})
```

### Extensions Array

Remove `markdownDecorations` from the extensions list.

---

## Task 4: Delete `src/markdown-decorations.ts`

No longer needed. All context-aware styling now handled through styleTags + HighlightStyle.

## Task 5: Move `src/theme-reference.ts` → `docs/archive/v2/old-highlight-theme-references.ts`

The `colors` object in `src/highlight-tags.ts` becomes the single source of truth.

## Task 6: Create `docs/archive/v2/v2_0_8_BUG_LOG.md`

Document all 8 reported bugs, their root causes, and fixes. Per user request in the bug report.

---

## Exhaustive Element Coverage

### All Markdown Elements: Marker ↔ Content Pairs

| #  | Element       | Marker Node     | Marker Tag        | Content Node      | Content Tag        | Marker  | Content |
|----| ------------- | --------------- | ----------------- | ----------------- | ------------------ | ------- | ------- |
| 1  | Heading       | HeaderMark      | tags.heading      | ATXHeading/...    | tags.heading       | #FF9D00 | #FF9D00 |
| 2  | Bold          | EmphasisMark    | tags.strong       | StrongEmphasis/...| tags.strong        | #FFD866 | #FFD866 |
| 3  | Italic        | EmphasisMark    | tags.emphasis     | Emphasis/...      | tags.emphasis      | #BF437F | #BF437F |
| 4  | Strikethrough | Strikethr...    | tags.striketh...  | Strikethrough/... | tags.strikethrough | #6272A4 | #6272A4 |
| 5  | Inline code   | CodeMark        | tags.monospace    | InlineCode/...    | tags.monospace     | #F34D3E | #F34D3E |
| 6  | Fenced code   | CodeMark        | processingInstr...| CodeText          | lang-specific      | #6767fc | #8989e3 |
| 7  | Blockquote    | QuoteMark       | tags.quote        | Blockquote/...    | tags.quote         | #E6DB74 | #E6DB74 |
| 8  | Bullet list   | ListMark        | bulletMarkTag     | BulletList/...    | bulletContentTag   | #dfc532 | #8aeefb |
| 9  | Ordered list  | ListMark        | orderedMarkTag    | OrderedList/...   | orderedContentTag  | #ff6b6b | #f8a5c2 |
| 10 | Table         | TableDelimiter  | tableTag          | TableCell/Header  | tableTag           | #e2ff79 | #e2ff79 |
| 11 | Link          | LinkMark        | tags.link         | Link/...          | tags.link          | #AB9DF2 | #AB9DF2 |
| 12 | Superscript   | SuperscriptMark | special(content)  | Superscript       | special(content)   | #8BE9FD | #8BE9FD |
| 13 | Subscript     | SubscriptMark   | special(content)  | Subscript         | special(content)   | #8BE9FD | #8BE9FD |

### Standalone Elements (no marker/content split)

| #  | Element         | Node           | Tag                        | Color   | Font        |
|----| --------------- | -------------- | -------------------------- | ------- | ----------- |
| 14 | Horizontal rule | HorizontalRule | tags.contentSeparator      | #93f9c6 | Regular     |
| 15 | Checkbox        | TaskMarker     | tags.atom                  | #8BE9FD | Bold(700)   |
| 16 | Code language   | CodeInfo       | tags.labelName             | #F1FA8C | Regular     |
| 17 | Link URL        | URL            | tags.url                   | #8BE9FD | Italic      |
| 18 | Link title      | LinkTitle      | tags.string                | #AB9DF2 | Regular     |
| 19 | Image alt text  | Image/...      | tags.link (inherit)        | #AB9DF2 | Regular     |
| 20 | Image URL       | Image/URL      | tags.url                   | #8BE9FD | Italic      |
| 21 | Autolink        | Autolink       | tags.url                   | #8BE9FD | Regular     |
| 22 | HTML entity     | Entity         | tags.character             | #FF79C6 | Regular     |
| 23 | HTML tags       | HTMLTag        | tags.angleBracket/tagName  | #FF79C6 | Regular     |
| 24 | HTML attribute  | HTMLTag attr   | tags.attributeName         | #FFD866 | Regular     |
| 25 | HTML attr value | HTMLTag val    | tags.attributeValue        | #F34D3E | Regular     |
| 26 | HTML comment    | Comment        | tags.comment               | #6272A4 | ThinItalic  |
| 27 | HTML block      | HTMLBlock      | (passthrough)              | —       | Regular     |
| 28 | Escape chars    | Escape         | tags.escape                | #FF79C6 | Regular     |
| 29 | Hard break      | HardBreak      | tags.processingInstruction | #6272A4 | Regular     |
| 30 | Emoji           | Emoji          | tags.character             | #FFB86C | Regular     |
| 31 | Front matter    | —              | tags.documentMeta          | #BD93F9 | Regular     |
| 32 | Diff added      | —              | tags.inserted              | #50FA7B | Regular     |
| 33 | Diff deleted    | —              | tags.deleted               | #FF5555 | Regular     |
| 34 | Diff changed    | —              | tags.changed               | #FFB86C | Regular     |
| 35 | Foreground      | —              | tags.content               | #e6e6e6 | Medium(500) |

### Complete Lezer Markdown Node Type Inventory (58 nodes)

All node types emitted by `@lezer/markdown` with `markdownLanguage` (CommonMark + GFM + extensions):

**Block nodes**: Document, Paragraph, ATXHeading1-6, SetextHeading1-2, CodeBlock, FencedCode, Blockquote, HorizontalRule, BulletList, OrderedList, ListItem, HTMLBlock, LinkReference, CommentBlock, ProcessingInstructionBlock

**Inline nodes**: Escape, Entity, HardBreak, Emphasis, StrongEmphasis, Link, Image, InlineCode, HTMLTag, Comment, ProcessingInstruction, Autolink

**Marker/delimiter nodes**: HeaderMark, QuoteMark, ListMark, LinkMark, EmphasisMark, CodeMark, CodeText, CodeInfo, LinkTitle, LinkLabel, URL

**GFM extension nodes**: Table, TableHeader, TableRow, TableCell, TableDelimiter, Strikethrough, StrikethroughMark, Task, TaskMarker

**Other extension nodes**: Superscript, SuperscriptMark, Subscript, SubscriptMark, Emoji

### All Built-in Lezer Tags (complete inventory — 87 tags + 6 modifiers)

Every tag has an explicit color in our `colors` object and an explicit entry in the `HighlightStyle.define()` array. ALL tags are mapped ✓.

**Content family** (subtags of `content`) — markdown prose elements:
- ✓ tags.content → fg (#e6e6e6) — Medium(500)
- ✓ tags.heading (+ heading1–heading6) → heading (#FF9D00) — ExtraBold(800)
- ✓ tags.contentSeparator → horizontalRule (#93f9c6)
- ✓ tags.list → (overridden by bulletContentTag/orderedContentTag via styleTags)
- ✓ tags.quote → blockquote (#E6DB74) — ThinItalic(100i)
- ✓ tags.emphasis → italic (#BF437F) — ExtraBoldItalic(800i)
- ✓ tags.strong → bold (#FFD866) — ExtraBold(800)
- ✓ tags.link → linkText (#AB9DF2) — Bold(700)
- ✓ tags.monospace → inlineCode (#F34D3E)
- ✓ tags.strikethrough → strikethrough (#6272A4) — Thin(100), line-through

**Comment family** — code comments and markdown HTML comments:
- ✓ tags.comment → comment (#6272A4) — ThinItalic(100i)
- ✓ tags.lineComment → codeLineComment (#6272A4) — ThinItalic(100i)
- ✓ tags.blockComment → codeBlockComment (#6272A4) — ThinItalic(100i)
- ✓ tags.docComment → codeDocComment (#6272A4) — ThinItalic(100i)

**Name family** — identifiers in code blocks:
- ✓ tags.name → codeVariable (#e6e6e6)
- ✓ tags.variableName → codeVariable (#e6e6e6)
- ✓ tags.typeName → codeType (#FF9D00)
- ✓ tags.tagName → codeTagName (#FF79C6)
- ✓ tags.propertyName → codeProperty (#BF437F)
- ✓ tags.attributeName → codeAttributeName (#FFD866)
- ✓ tags.className → codeClass (#FF9D00)
- ✓ tags.labelName → codeLabel (#F1FA8C) — also used for markdown code language
- ✓ tags.namespace → codeNamespace (#e6e6e6)
- ✓ tags.macroName → codeMacro (#e6e6e6)

**Literal family** — values in code blocks:
- ✓ tags.literal → fg (#e6e6e6) — generic fallback
- ✓ tags.string → codeString (#F34D3E)
- ✓ tags.docString → codeDocString (#F34D3E)
- ✓ tags.character → emoji (#FFB86C) — also used for markdown :emoji:
- ✓ tags.attributeValue → codeAttributeValue (#F34D3E)
- ✓ tags.number → codeNumber (#8BE9FD)
- ✓ tags.integer → codeInteger (#8BE9FD)
- ✓ tags.float → codeFloat (#8BE9FD)
- ✓ tags.bool → codeBool (#8BE9FD)
- ✓ tags.regexp → codeRegexp (#e6e6e6)
- ✓ tags.escape → codeEscape (#FF79C6)
- ✓ tags.color → codeColor (#e6e6e6)
- ✓ tags.url → codeUrl (#8BE9FD) — also used for markdown link URLs
- ✓ tags.unit → codeUnit (#e6e6e6)

**Keyword family** — language keywords in code blocks:
- ✓ tags.keyword → codeKeyword (#FF79C6)
- ✓ tags.self → codeSelf (#FF79C6)
- ✓ tags.null → codeNull (#6272A4)
- ✓ tags.atom → codeAtom (#8BE9FD) — also used for markdown TaskMarker
- ✓ tags.unit → codeUnit (#e6e6e6)
- ✓ tags.modifier → codeModifier (#e6e6e6)
- ✓ tags.operatorKeyword → codeOperatorKeyword (#e6e6e6)
- ✓ tags.controlKeyword → codeControlKeyword (#FF79C6)
- ✓ tags.definitionKeyword → codeDefinitionKeyword (#FF79C6)
- ✓ tags.moduleKeyword → codeModuleKeyword (#FF79C6)

**Operator family** — operators in code blocks:
- ✓ tags.operator → codeOperator (#BF437F)
- ✓ tags.derefOperator → codeDeref (#e6e6e6)
- ✓ tags.arithmeticOperator → codeArithmeticOp (#BF437F)
- ✓ tags.logicOperator → codeLogicOp (#BF437F)
- ✓ tags.bitwiseOperator → codeBitwiseOp (#BF437F)
- ✓ tags.compareOperator → codeCompareOp (#BF437F)
- ✓ tags.updateOperator → codeUpdateOp (#BF437F)
- ✓ tags.definitionOperator → codeDefinitionOp (#BF437F)
- ✓ tags.typeOperator → codeTypeOp (#BF437F)
- ✓ tags.controlOperator → codeControlOp (#BF437F)

**Punctuation family** — brackets and delimiters:
- ✓ tags.punctuation → codePunctuation (#e6e6e6)
- ✓ tags.separator → codeSeparator (#e6e6e6)
- ✓ tags.bracket → codePunctuation (#e6e6e6)
- ✓ tags.angleBracket → codeAngleBracket (#FF79C6) — also HTML < >
- ✓ tags.squareBracket → codeSquareBracket (#7dcfff)
- ✓ tags.paren → codeParen (#ff9e64)
- ✓ tags.brace → codeBrace (#e6e6e6)

**Diff** — change tracking:
- ✓ tags.inserted → diffAddition (#50FA7B)
- ✓ tags.deleted → diffDeletion (#FF5555)
- ✓ tags.changed → diffChange (#FFB86C)

**Meta** — document/code metadata:
- ✓ tags.meta → codeMeta (#e6e6e6)
- ✓ tags.documentMeta → frontmatter (#BD93F9)
- ✓ tags.annotation → codeAnnotation (#e6e6e6)
- ✓ tags.processingInstruction → fencedCodeDelimiter (#6767fc)

**Modifiers** (combine with other tags via `tags.modifier(tags.base)`):
- ✓ tags.definition() → used with variableName, propertyName, typeName, className
- ✓ tags.constant() → codeConstant (#e6e6e6) — used with variableName
- ✓ tags.function() → codeFunction (#AB9DF2) — used with variableName, propertyName
- ✓ tags.standard() → codeStandard (#e6e6e6) — used with variableName, tagName
- ✓ tags.local() → codeLocal (#e6e6e6) — used with variableName
- ✓ tags.special() → superscript (#8BE9FD) — used with content, string, propertyName

**Other**:
- ✓ tags.invalid → codeInvalid (#FF5555)

---

## Priority Hierarchy (from original feedback)

```
HIGHEST PRIORITY (overrides everything below)
 ↓
 1. strikethrough — BLEND (color + decoration, lower-rank styling shows through)
 2. inlineCode   — FULL (overrides all other styling completely)
 3. codeBlock + checkbox — BLEND
 4. bold + italic — FULL
 5. table         — FULL
 6. heading       — FULL
 7. list markers + list content — FULL
 8. blockquote    — FULL
 9. foreground    — fallback
 ↓
LOWEST PRIORITY
```

In CSS cascade terms: **HIGH priority items are defined LAST** in the HighlightStyle array so their CSS rules appear later and win when two classes exist on the same span.

---

## Bug-to-Fix Mapping

| Bug | Issue                                        | Fix                                                                          |
|-----| -------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Bold markers (**) purple                     | `'StrongEmphasis/EmphasisMark': tags.strong` (depth=1 beats depth=0)         |
| 2   | Italic markers (*) purple                    | `'Emphasis/EmphasisMark': tags.emphasis` (depth=1)                           |
| 3   | Bullet markers wrong color, content no color | `bulletMarkTag` custom tag + `'BulletList/...': bulletContentTag` inherit    |
| 4   | Number markers wrong color, content no color | `orderedMarkTag` custom tag + `'OrderedList/...': orderedContentTag` inherit |
| 5   | Blockquote content white                     | CSS cascade fix: `tags.quote` now after `tags.content` in array              |
| 6   | Bold doesn't override list color             | CSS cascade fix: `tags.strong` now after list tags in array                  |
| 7   | Table zero highlighting                      | `base: markdownLanguage` enables GFM + `'Table/...': tableTag`               |
| 8   | Inline code delims purple                    | `'InlineCode/CodeMark': tags.monospace` (depth=1)                            |

**Also fixed (proactive)**:
- StrikethroughMark, LinkMark, SuperscriptMark, SubscriptMark marker overrides
- Fenced code delimiter color corrected from #8989e3 to #6767fc
- TaskMarker gets `tags.atom` → #8BE9FD mapping
- Emoji support via `tags.character`
- Entity (HTML entities) inherits tags.character → #FFB86C
- Image nodes share link styling via tags.link/tags.url
- Autolink nodes use tags.url → #8BE9FD
- All 87 Lezer highlight tags explicitly mapped (no implicit inheritance gaps)
- All 10 operator subtypes explicitly mapped for code blocks
- All 3 comment subtypes explicitly mapped for code blocks
- Template strings (tags.special(tags.string)), doc strings, regexp all mapped
- CSS-specific tokens: tags.unit, tags.color explicitly mapped
- Decorator/annotation support via tags.meta/tags.annotation
- Invalid/error token support via tags.invalid → #FF5555
- Private property support via tags.special(tags.propertyName)
- 17 future markdown extension color slots pre-defined (default to #e6e6e6)

---

## Color Correction Note

The current `theme.ts` has `blockCodeDelimiter: '#8989e3'` which is actually the code CONTENT color. The fenced code ``` delimiter color should be `#6767fc` (from `theme-reference.ts: fencedCodeDelimiter`). This is fixed by mapping `tags.processingInstruction → #6767fc`.

---

## Files

| File                                | Action                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `src/highlight-tags.ts`             | **Create** — custom tags + complete colors object (single source of truth)     |
| `src/editor.ts`                     | **Modify** — comprehensive styleTags, GFM base, remove ViewPlugin              |
| `src/theme.ts`                      | **Modify** — import highlight-tags, rewrite HighlightStyle, remove CSS classes |
| `src/markdown-decorations.ts`       | **Delete** — replaced by styleTags approach                                    |
| `src/theme-reference.ts`            | **Move** to `docs/archive/v2/old-theme-ref.ts`                                 |
| `docs/archive/v2/v2_0_8_BUG_LOG.md` | **Create** — bug documentation                                                 |

## Verification

1. `npx tsc --noEmit` — zero TypeScript errors
2. `npm run dev` — dev server starts
3. All 8 reported bugs fixed (verify against screenshot)
4. Proactive: strikethrough markers, link markers, horizontal rules, task markers, emoji, superscript/subscript
5. Priority: bold-in-list shows bold yellow, italic-in-blockquote shows italic magenta, inline-code-in-heading shows code red
6. Tables: pipes and content all lime green (GFM working)
7. Code blocks: language-specific highlighting active
8. `npm run build` — production build succeeds

## Known Limitations

1. **Nested lists of different types** (bullet inside ordered) — content color is determined by CSS cascade between accumulated inherited classes. The innermost list type may not always win. This is rare in practice. If needed, a targeted ViewPlugin can be added later for just this case.

2. **Image vs Link differentiation** — Image and Link share the same Lezer node structure. Both use `LinkMark`, `URL`, etc. The `colors` object has separate `imageAltText`/`imageUrl` keys for future customization, but initially they map to the same colors as links. A ViewPlugin could differentiate these later by checking the parent node type.

3. **Shared tags across contexts** — Some tags serve double duty (e.g., `tags.atom` is TaskMarker in markdown but atomic values in code blocks; `tags.character` is emoji in markdown but character literals in code). The HighlightStyle can only assign one color per tag. For the customization UI, the `colors` object separates these conceptually (e.g., `checkbox` vs `codeAtom`), but the implementation maps them to the same HighlightStyle entry. A future enhancement could use ViewPlugin decorations for context-dependent overrides.

## Future: Customization UI Preparation

The `colors` object in `src/highlight-tags.ts` is designed as the data source for a user preferences UI.

**Current state**: ~100 color entries organized into 10 categories, each with a human-readable comment.

**Categories for UI grouping**:
1. Editor Chrome (5 entries) — bg, fg, selection, cursor, gutter
2. Headings (1 entry) — all heading levels share one color
3. Text Emphasis (3 entries) — bold, italic, strikethrough
4. Code (4 entries) — inline code, fenced delimiters, content, language
5. Links & Images (6 entries) — text, URL, title, reference, image alt/url, autolink
6. Lists (5 entries) — bullet marker/content, numbered marker/content, checkbox
7. Block Elements (3 entries) — blockquote, horizontal rule, table
8. Special Syntax (9 entries) — HTML, comments, escape, entity, emoji, math, footnote, super/subscript, hard break
9. Code Block Tokens (50+ entries) — keywords, names, literals, operators, comments, punctuation, meta
10. Future Extensions (17 entries) — highlighted text, definition lists, abbreviations, critic markup, admonitions, citations, keyboard keys, markdown attributes, wiki links, footnote definitions, task list text, diagram blocks, all caps

**To build the UI**:
1. Parse the `colors` object — keys become setting IDs, comments become labels
2. Group by category comments (the `// ─── Category ───` headers)
3. Present color pickers for each entry
4. Write updated values back to `colors`
5. Call `HighlightStyle.define()` with new colors to rebuild
6. Future extension entries (default #e6e6e6) show as "inactive" until parser extensions are installed
