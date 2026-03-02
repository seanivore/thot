// Thot Highlighting Scopes
// One source of truth for all highlighting colors, styles, and priorities.
//
// FORMAT
//   name         — internal key (code only, users never see this)
//   displayName  — what users see in the settings UI
//   example      — what it looks like in the editor (in the comment above each scope)
//   color        — hex (install naumovs.color-highlight to see swatches inline)
//   fontWeight   — 100 Thin · 400 Regular · 500 Medium · 700 Bold · 800 Extra Bold
//   fontStyle    — 'normal' | 'italic'
//   textDecoration — 'none' | 'line-through'
//   fontSize     — 'inherit' | '1.1em' | '1.2em' etc.
//   priority     — higher number wins when two scopes overlap; marks always 100+
//
// PRIORITY BANDS
//   100+  Notation marks (the * ** ` # etc. characters)
//   80–99 Combo scopes (bold+italic, bold+strike, etc.)
//   60–79 Code and links
//   40–59 Inline emphasis (bold, italic, strike)
//   20–39 Block structure (headings, lists, blockquote)
//   0–19  Base / fallback text
//
// GROUPS
//   'emphasis'   Bold, italic, strikethrough and their combinations
//   'structure'  Headings, lists, blockquote, divider, table, frontmatter
//   'code'       Inline code, code blocks, language tokens inside blocks
//   'link'       Links, images, footnotes, references
//   'auto'       Plain text mode — detected from writing patterns, no notation needed
//   'mark'       The actual notation characters (*, **, #, >, etc.)
//   'base'       Default / fallback

export interface Scope {
  name: string
  displayName: string
  group: 'emphasis' | 'structure' | 'code' | 'link' | 'auto' | 'mark' | 'base'
  color: string
  fontWeight: '100' | '400' | '500' | '700' | '800'
  fontStyle: 'normal' | 'italic'
  textDecoration: 'none' | 'line-through'
  fontSize: 'inherit' | string
  priority: number
  userCustomizable: boolean
}

export const scopes: Scope[] = [

  // ─────────────────────────────────────────────────────────────────────
  // NOTATION MARKS  priority 100+
  // The actual syntax characters — styled to match their parent scope
  // so they blend with the content they surround rather than competing
  // ─────────────────────────────────────────────────────────────────────

  // # ## ### #### ##### ######
  {
    name: 'mark.heading',
    displayName: 'Heading Marks',
    group: 'mark',
    color: '#FF9D00',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // ** or __  (the asterisks/underscores around bold)
  {
    name: 'mark.bold',
    displayName: 'Bold Marks',
    group: 'mark',
    color: '#FFD866',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // * or _  (the asterisk/underscore around italic)
  {
    name: 'mark.italic',
    displayName: 'Italic Marks',
    group: 'mark',
    color: '#BF437F',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // ~~  (the double tildes around strikethrough)
  {
    name: 'mark.strike',
    displayName: 'Strikethrough Marks',
    group: 'mark',
    color: '#6272A4',
    fontWeight: '100',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // `  (the backtick around inline code)
  {
    name: 'mark.codeInline',
    displayName: 'Inline Code Backticks',
    group: 'mark',
    color: '#F34D3E',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // ```  (the triple backticks opening/closing a code block)
  {
    name: 'mark.codeFence',
    displayName: 'Code Fence Marks',
    group: 'mark',
    color: '#6767FC',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // -  or  *  or  +  (the dash/bullet before a bullet list item)
  {
    name: 'mark.bulletMarker',
    displayName: 'Bullet Marker',
    group: 'mark',
    color: '#DFC532',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // 1.  2.  3.  (the number before an ordered list item)
  {
    name: 'mark.numberMarker',
    displayName: 'Number Marker',
    group: 'mark',
    color: '#FF6B6B',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // >  (the greater-than before a blockquote line)
  {
    name: 'mark.blockquote',
    displayName: 'Blockquote Mark',
    group: 'mark',
    color: '#E6DB74',
    fontWeight: '100',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // [ ]( )  (the brackets and parens in a link)
  {
    name: 'mark.link',
    displayName: 'Link Marks',
    group: 'mark',
    color: '#AB9DF2',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 105,
    userCustomizable: false,
  },

  // ─────────────────────────────────────────────────────────────────────
  // COMBO SCOPES  priority 85–90
  // When two emphasis types overlap — bold inside italic, etc.
  // ─────────────────────────────────────────────────────────────────────

  // [`code`](url)  — a link whose label is code
  {
    name: 'combo.codeLink',
    displayName: 'Code Link',
    group: 'emphasis',
    color: '#F34D3E',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 88,
    userCustomizable: true,
  },

  // ***bold and italic***  or  **_mixed_**
  {
    name: 'combo.boldItalic',
    displayName: 'Bold + Italic',
    group: 'emphasis',
    color: '#FFD866',
    fontWeight: '800',
    fontStyle: 'italic',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 87,
    userCustomizable: true,
  },

  // ~~**bold and struck**~~
  {
    name: 'combo.boldStrike',
    displayName: 'Bold + Strikethrough',
    group: 'emphasis',
    color: '#FFD866',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'line-through',
    fontSize: 'inherit',
    priority: 86,
    userCustomizable: true,
  },

  // ~~*italic and struck*~~
  {
    name: 'combo.italicStrike',
    displayName: 'Italic + Strikethrough',
    group: 'emphasis',
    color: '#BF437F',
    fontWeight: '800',
    fontStyle: 'italic',
    textDecoration: 'line-through',
    fontSize: 'inherit',
    priority: 85,
    userCustomizable: true,
  },

  // ─────────────────────────────────────────────────────────────────────
  // CODE  priority 60–75
  // Inline code and code block — code beats emphasis if they overlap
  // ─────────────────────────────────────────────────────────────────────

  // `inline code`
  {
    name: 'code.inline',
    displayName: 'Inline Code',
    group: 'code',
    color: '#F34D3E',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 70,
    userCustomizable: true,
  },

  // ```javascript  — the language label after the opening fence
  {
    name: 'code.language',
    displayName: 'Code Language',
    group: 'code',
    color: '#F1FA8C',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 65,
    userCustomizable: true,
  },

  // the text content inside a ``` code block
  {
    name: 'code.block',
    displayName: 'Code Block',
    group: 'code',
    color: '#8989E3',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 62,
    userCustomizable: true,
  },

  // ─────────────────────────────────────────────────────────────────────
  // LINKS  priority 60–68
  // ─────────────────────────────────────────────────────────────────────

  // [link text](url)  — the display text part
  {
    name: 'link.text',
    displayName: 'Link',
    group: 'link',
    color: '#AB9DF2',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 68,
    userCustomizable: true,
  },

  // [link text](https://destination.com)  — the URL part
  {
    name: 'link.url',
    displayName: 'Link URL',
    group: 'link',
    color: '#8BE9FD',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 67,
    userCustomizable: true,
  },

  // ![alt text](image.jpg)
  {
    name: 'link.image',
    displayName: 'Image',
    group: 'link',
    color: '#AB9DF2',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 65,
    userCustomizable: true,
  },

  // [label]: https://url  — reference-style link definition
  {
    name: 'link.reference',
    displayName: 'Reference Link',
    group: 'link',
    color: '#50FA7B',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 62,
    userCustomizable: true,
  },

  // [^1]  — footnote reference
  {
    name: 'link.footnote',
    displayName: 'Footnote',
    group: 'link',
    color: '#8BE9FD',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 60,
    userCustomizable: true,
  },

  // ^superscript^
  {
    name: 'link.superscript',
    displayName: 'Superscript',
    group: 'link',
    color: '#8BE9FD',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 45,
    userCustomizable: true,
  },

  // ~subscript~  (single tilde — different from ~~strikethrough~~)
  {
    name: 'link.subscript',
    displayName: 'Subscript',
    group: 'link',
    color: '#8BE9FD',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 45,
    userCustomizable: true,
  },

  // ─────────────────────────────────────────────────────────────────────
  // EMPHASIS  priority 40–55
  // ─────────────────────────────────────────────────────────────────────

  // **bold text**
  {
    name: 'emphasis.bold',
    displayName: 'Bold',
    group: 'emphasis',
    color: '#FFD866',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 50,
    userCustomizable: true,
  },

  // *italic text*
  {
    name: 'emphasis.italic',
    displayName: 'Italic',
    group: 'emphasis',
    color: '#BF437F',
    fontWeight: '800',
    fontStyle: 'italic',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 48,
    userCustomizable: true,
  },

  // ~~struck through~~
  {
    name: 'emphasis.strike',
    displayName: 'Strikethrough',
    group: 'emphasis',
    color: '#6272A4',
    fontWeight: '100',
    fontStyle: 'normal',
    textDecoration: 'line-through',
    fontSize: 'inherit',
    priority: 46,
    userCustomizable: true,
  },

  // IMPORTANT  — ALL CAPS word or phrase (plain text mode)
  {
    name: 'emphasis.allCaps',
    displayName: 'All Caps Emphasis',
    group: 'auto',
    color: '#FFD866',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 42,
    userCustomizable: true,
  },

  // ─────────────────────────────────────────────────────────────────────
  // STRUCTURE  priority 22–35
  // ─────────────────────────────────────────────────────────────────────

  // # Heading One
  {
    name: 'structure.heading1',
    displayName: 'Heading 1',
    group: 'structure',
    color: '#FF9D00',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: '1.15em',
    priority: 32,
    userCustomizable: true,
  },

  // ## Heading Two
  {
    name: 'structure.heading2',
    displayName: 'Heading 2',
    group: 'structure',
    color: '#FF9D00',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: '1.05em',
    priority: 31,
    userCustomizable: true,
  },

  // ### Heading Three
  {
    name: 'structure.heading3',
    displayName: 'Heading 3',
    group: 'structure',
    color: '#FF9D00',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 30,
    userCustomizable: true,
  },

  // #### Heading Four
  {
    name: 'structure.heading4',
    displayName: 'Heading 4',
    group: 'structure',
    color: '#FF9D00',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 30,
    userCustomizable: true,
  },

  // ##### Heading Five
  {
    name: 'structure.heading5',
    displayName: 'Heading 5',
    group: 'structure',
    color: '#FF9D00',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 30,
    userCustomizable: true,
  },

  // ###### Heading Six
  {
    name: 'structure.heading6',
    displayName: 'Heading 6',
    group: 'structure',
    color: '#FF9D00',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 30,
    userCustomizable: true,
  },

  // --- yaml front matter ---  (metadata at top of document)
  {
    name: 'structure.frontmatter',
    displayName: 'Front Matter',
    group: 'structure',
    color: '#BD93F9',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 30,
    userCustomizable: true,
  },

  // - list item content  (the text after the bullet)
  {
    name: 'structure.bulletItem',
    displayName: 'Bullet List',
    group: 'structure',
    color: '#8AEEFB',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 27,
    userCustomizable: true,
  },

  // - [x] completed task  /  - [ ] open task
  {
    name: 'structure.taskItem',
    displayName: 'Task / Checkbox',
    group: 'structure',
    color: '#8BE9FD',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 27,
    userCustomizable: true,
  },

  // 1. list item content  (the text after the number)
  {
    name: 'structure.numberedItem',
    displayName: 'Numbered List',
    group: 'structure',
    color: '#F8A5C2',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 25,
    userCustomizable: true,
  },

  // > blockquote text
  {
    name: 'structure.blockquote',
    displayName: 'Blockquote',
    group: 'structure',
    color: '#E6DB74',
    fontWeight: '100',
    fontStyle: 'italic',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 25,
    userCustomizable: true,
  },

  // | table | content |
  {
    name: 'structure.table',
    displayName: 'Table',
    group: 'structure',
    color: '#E2FF79',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 25,
    userCustomizable: true,
  },

  // ---  horizontal rule / divider
  {
    name: 'structure.divider',
    displayName: 'Divider',
    group: 'structure',
    color: '#93F9C6',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 25,
    userCustomizable: true,
  },

  // ─────────────────────────────────────────────────────────────────────
  // AUTO-DETECT  priority 20–35
  // Plain text mode — no notation needed, detected from writing patterns
  // Same colors as their markdown counterparts: the visual bridge
  // ─────────────────────────────────────────────────────────────────────

  // A line that looks like a document title
  // — short, on its own line, or first line of document
  {
    name: 'auto.title',
    displayName: 'Title (auto)',
    group: 'auto',
    color: '#FF9D00',
    fontWeight: '800',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: '1.15em',
    priority: 28,
    userCustomizable: true,
  },

  // A short line ending with :  (like "Ingredients:" or "Next steps:")
  {
    name: 'auto.sectionLabel',
    displayName: 'Section Label (auto)',
    group: 'auto',
    color: '#FF9D00',
    fontWeight: '700',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 24,
    userCustomizable: true,
  },

  // A line starting with -  *  •  — without markdown mode active
  {
    name: 'auto.listItem',
    displayName: 'List Item (auto)',
    group: 'auto',
    color: '#8AEEFB',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 22,
    userCustomizable: true,
  },

  // A line ending with ?
  {
    name: 'auto.question',
    displayName: 'Question (auto)',
    group: 'auto',
    color: '#AB9DF2',
    fontWeight: '400',
    fontStyle: 'italic',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 23,
    userCustomizable: true,
  },

  // "text in double quotes"
  {
    name: 'auto.quoted',
    displayName: 'Quoted Text (auto)',
    group: 'auto',
    color: '#E6DB74',
    fontWeight: '100',
    fontStyle: 'italic',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 23,
    userCustomizable: true,
  },

  // (text in parentheses)
  {
    name: 'auto.aside',
    displayName: 'Aside / Note (auto)',
    group: 'auto',
    color: '#6272A4',
    fontWeight: '100',
    fontStyle: 'italic',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 20,
    userCustomizable: true,
  },

  // camelCase  snake_case  https://url  /file/path
  {
    name: 'auto.technical',
    displayName: 'Technical Term (auto)',
    group: 'auto',
    color: '#F34D3E',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 22,
    userCustomizable: true,
  },

  // ─────────────────────────────────────────────────────────────────────
  // CODE BLOCK LANGUAGE TOKENS  priority 50–60
  // Only active inside ``` fenced code blocks
  // These use a separate mechanism (HighlightStyle) — see theme.ts
  // ─────────────────────────────────────────────────────────────────────

  // if  else  return  function  class  const  let  var
  {
    name: 'token.keyword',
    displayName: 'Keyword',
    group: 'code',
    color: '#FF79C6',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 55,
    userCustomizable: true,
  },

  // "string literal"  'string'  `template`
  {
    name: 'token.string',
    displayName: 'String',
    group: 'code',
    color: '#F34D3E',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 52,
    userCustomizable: true,
  },

  // 42  3.14  0xFF
  {
    name: 'token.number',
    displayName: 'Number',
    group: 'code',
    color: '#8BE9FD',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 52,
    userCustomizable: true,
  },

  // // this is a comment  /* block comment */
  {
    name: 'token.comment',
    displayName: 'Comment',
    group: 'code',
    color: '#6272A4',
    fontWeight: '100',
    fontStyle: 'italic',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 52,
    userCustomizable: true,
  },

  // myFunction()  — function call or definition
  {
    name: 'token.function',
    displayName: 'Function',
    group: 'code',
    color: '#AB9DF2',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 52,
    userCustomizable: true,
  },

  // const x = ...  let y = ...  — the variable name at definition
  {
    name: 'token.variableDef',
    displayName: 'Variable (defined)',
    group: 'code',
    color: '#FFD866',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 52,
    userCustomizable: true,
  },

  // x  y  z  — variable usage (not definition)
  {
    name: 'token.variable',
    displayName: 'Variable',
    group: 'code',
    color: '#E6E6E6',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 50,
    userCustomizable: true,
  },

  // TypeName  ClassName  InterfaceName
  {
    name: 'token.type',
    displayName: 'Type',
    group: 'code',
    color: '#FF9D00',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 52,
    userCustomizable: true,
  },

  // =  +  -  *  /  &&  ||  !
  {
    name: 'token.operator',
    displayName: 'Operator',
    group: 'code',
    color: '#BF437F',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 50,
    userCustomizable: true,
  },

  // invalid syntax — parse error
  {
    name: 'token.error',
    displayName: 'Syntax Error',
    group: 'code',
    color: '#FF5555',
    fontWeight: '400',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 55,
    userCustomizable: false,
  },

  // ─────────────────────────────────────────────────────────────────────
  // BASE  priority 0
  // Everything else — the fallback
  // ─────────────────────────────────────────────────────────────────────

  // Normal body text — anything not matched by a scope above
  {
    name: 'base.body',
    displayName: 'Body Text',
    group: 'base',
    color: '#E6E6E6',
    fontWeight: '500',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: 'inherit',
    priority: 0,
    userCustomizable: true,
  },

]

// ─────────────────────────────────────────────────────────────────────
// EDITOR CHROME  (not scopes — these style the editor UI itself)
// ─────────────────────────────────────────────────────────────────────

export const chrome = {
  background:   '#1A1A1A',  // editor background
  foreground:   '#E6E6E6',  // default text
  selection:    '#44475A',  // selected text highlight
  cursor:       '#E6E6E6',  // cursor / caret
  gutter:       '#6272A4',  // line number color
  activeLine:   '#44475A',  // current line background (subtle)
}
