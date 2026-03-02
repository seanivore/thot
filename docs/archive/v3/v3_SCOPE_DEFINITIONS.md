****# Thot Scope Definitions — Master Specification

**Branch**: `v3-rainbow-moat`
**Status**: Design Phase — Awaiting Implementation
**Updated**: 2026-02-20
**Feeds**: `src/scopes.ts` (implementation), future Customization UI

---

## Philosophy

### The Toaster Principle

A toaster just works. You don't configure a toaster. You don't learn a toaster. You put bread in and toast comes out.

Thot's highlighting should work the same way. A normie opens the app, starts writing, and their text gets colored in a way that feels intelligent — not arbitrary. The app appears to *understand* what they're writing. No setup. No decisions. No markdown knowledge required.

**The magic moment**: "Why did my title turn orange?" → they didn't configure it → the app just knew → they trust it → they keep writing.

### The Bridge Strategy

Plain text patterns and markdown notation share the **same color palette**. A line that *looks like* a title gets the same orange as a line with explicit `# ` notation. This is intentional:

1. Normie writes, colors appear, feels understood (plain text patterns)
2. Normie discovers shortcut via UI ("Press ⌘1 to make it an official heading")
3. Normie types `# ` — **same orange** — color didn't change, just became explicit
4. Normie is now a markdown user who never felt a transition

The colors are the constant. Notation is optional elaboration on the same visual language.

### Cognitive Load Reduction

Semantic highlighting reduces cognitive load by letting the eye categorize before the brain reads. When structural/organizational text (titles, lists) is visually distinct from content text, skimming is effortless. This is especially valuable for longer documents, people with attention differences, and anyone revisiting notes they wrote weeks ago.

The goal: **scanning a page should feel like looking at a map, not reading a wall of text.**

---

## The Data Model

Every scope is defined by this interface. This is also the shape of user customization:

```typescript
interface Scope {
  // Identity
  name: string              // "inline.bold" — used in code
  displayName: string       // "Bold" — shown in UI
  description: string       // "Important text, wrapped in **double asterisks**"

  // Detection
  group: 'plain-text' | 'markdown' | 'code' | 'shared'
  patterns: RegExp[]        // one or more patterns that trigger this scope
  // For markdown scopes, patterns match the full syntax including notation
  // For plain-text scopes, patterns match the content directly

  // Visual Style (all user-customizable)
  color: string             // hex — the primary color
  fontWeight?: string       // '400' | '500' | '700' | '800'
  fontStyle?: 'italic'
  textDecoration?: 'line-through' | 'underline'

  // System
  priority: number          // higher = applied last = wins overlapping conflicts
  userCustomizable: boolean // whether the customization UI exposes this scope
  comboOf?: string[]        // for combo scopes: which scopes combine to produce this
}
```

### Priority Resolution

All patterns run over the visible document. All matches are collected. Where ranges overlap, they are rendered as nested spans — inner (shorter, more specific) span wins visually for color. Explicit `priority` number resolves ties where two matches start at the same position with the same length.

**Priority bands:**
- `0–19` — base/fallback text
- `20–39` — block-level structure (headings, lists, blockquotes)
- `40–59` — inline emphasis (bold, italic, strikethrough)
- `60–79` — high-specificity inline (code, links)
- `80–99` — combo scopes (bold+italic, etc.)
- `100+` — delimiters/marks (notation characters)

---

## Color Palette

Colors are not chosen arbitrarily. Each hue carries psychological weight that supports the scope's semantic role.

<div style="background:#1a1a1a;padding:16px;border-radius:8px;font-family:monospace;font-size:13px;line-height:2">

| Swatch                                                                                                                                             | Name               | Hex       | Role                        | Feeling                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- | --------------------------- | ------------------------- |
| <span style="display:inline-block;width:18px;height:18px;background:#FF9D00;border-radius:3px;vertical-align:middle"></span>                       | Title Orange       | `#FF9D00` | Heading / structure         | Warm, draws the eye first |
| <span style="display:inline-block;width:18px;height:18px;background:#FFD866;border-radius:3px;vertical-align:middle"></span>                       | Bold Gold          | `#FFD866` | Strong emphasis             | Precious, most important  |
| <span style="display:inline-block;width:18px;height:18px;background:#BF437F;border-radius:3px;vertical-align:middle"></span>                       | Italic Pink        | `#BF437F` | Soft emphasis               | Subtle, expressive        |
| <span style="display:inline-block;width:18px;height:18px;background:#6272A4;border-radius:3px;vertical-align:middle"></span>                       | Muted              | `#6272A4` | Strike / delimiters / notes | Quiet, receding           |
| <span style="display:inline-block;width:18px;height:18px;background:#8AEEFB;border-radius:3px;vertical-align:middle"></span>                       | List Cyan          | `#8AEEFB` | Unordered list items        | Cool, structured          |
| <span style="display:inline-block;width:18px;height:18px;background:#DFC532;border-radius:3px;vertical-align:middle"></span>                       | Bullet Gold        | `#DFC532` | Bullet markers (-, *, +)    | Hierarchical indicator    |
| <span style="display:inline-block;width:18px;height:18px;background:#F8A5C2;border-radius:3px;vertical-align:middle"></span>                       | Ordered Blush      | `#F8A5C2` | Numbered list items         | Ordered, gentle           |
| <span style="display:inline-block;width:18px;height:18px;background:#FF6B6B;border-radius:3px;vertical-align:middle"></span>                       | Number Red         | `#FF6B6B` | Numbered markers (1., 2.)   | Warm, sequential          |
| <span style="display:inline-block;width:18px;height:18px;background:#F34D3E;border-radius:3px;vertical-align:middle"></span>                       | Code Red           | `#F34D3E` | Technical / exact strings   | Precision, attention      |
| <span style="display:inline-block;width:18px;height:18px;background:#AB9DF2;border-radius:3px;vertical-align:middle"></span>                       | Link Violet        | `#AB9DF2` | References / hyperlinks     | Mysterious, connects      |
| <span style="display:inline-block;width:18px;height:18px;background:#8BE9FD;border-radius:3px;vertical-align:middle"></span>                       | URL Aqua           | `#8BE9FD` | Destination URLs            | Open, outward-pointing    |
| <span style="display:inline-block;width:18px;height:18px;background:#E6DB74;border-radius:3px;vertical-align:middle"></span>                       | Quote Yellow       | `#E6DB74` | Attribution / quotes        | Warm, historical          |
| <span style="display:inline-block;width:18px;height:18px;background:#E2FF79;border-radius:3px;vertical-align:middle"></span>                       | Table Lime         | `#E2FF79` | Tabular data                | Sharp, structured         |
| <span style="display:inline-block;width:18px;height:18px;background:#BD93F9;border-radius:3px;vertical-align:middle"></span>                       | Frontmatter Purple | `#BD93F9` | Metadata                    | Behind-the-scenes         |
| <span style="display:inline-block;width:18px;height:18px;background:#6767FC;border-radius:3px;vertical-align:middle"></span>                       | Fence Purple       | `#6767FC` | Code fence delimiters       | Boundary, enclosure       |
| <span style="display:inline-block;width:18px;height:18px;background:#8989E3;border-radius:3px;vertical-align:middle"></span>                       | Code Body Blue     | `#8989E3` | Code block body text        | Calm, technical           |
| <span style="display:inline-block;width:18px;height:18px;background:#F1FA8C;border-radius:3px;vertical-align:middle"></span>                       | Code Lang Yellow   | `#F1FA8C` | Language identifier         | Label, classifier         |
| <span style="display:inline-block;width:18px;height:18px;background:#93F9C6;border-radius:3px;vertical-align:middle"></span>                       | Divider Mint       | `#93F9C6` | Horizontal rules            | Clean break               |
| <span style="display:inline-block;width:18px;height:18px;background:#50FA7B;border-radius:3px;vertical-align:middle"></span>                       | Reference Green    | `#50FA7B` | Reference link defs         | Defined, anchored         |
| <span style="display:inline-block;width:18px;height:18px;background:#E6E6E6;border-radius:3px;vertical-align:middle"></span>                       | Foreground         | `#E6E6E6` | Default text                | Neutral, readable         |
| <span style="display:inline-block;width:18px;height:18px;background:#1A1A1A;border:1px solid #444;border-radius:3px;vertical-align:middle"></span> | Background         | `#1A1A1A` | Editor background           | Dark, focused             |

</div>

**Design principle**: Notation characters (markers, delimiters) intentionally match their parent scope's color so they *recede* — content speaks, punctuation supports. Bold `**` markers are gold so they blend with bold text rather than competing with it.

---

## Visual Reference

*How each scope appears in the editor. Background matches the actual editor dark theme.*

<div style="background:#1a1a1a;color:#e6e6e6;padding:20px 24px;border-radius:8px;font-family:'JetBrains Mono NL',monospace;font-size:13px;line-height:2.2;margin:16px 0">

### Plain Text Scopes

| Scope            | Renders As                                                                                         | Swatch                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `text.title`     | <span style="color:#FF9D00;font-weight:800">My Document Title</span>                               | <span style="display:inline-block;width:14px;height:14px;background:#FF9D00;border-radius:2px;vertical-align:middle"></span> `#FF9D00` |
| `text.section`   | <span style="color:#FF9D00;font-weight:700">Section Label:</span>                                  | <span style="display:inline-block;width:14px;height:14px;background:#FF9D00;border-radius:2px;vertical-align:middle"></span> `#FF9D00` |
| `text.list.item` | <span style="color:#8AEEFB">- This is a list item</span>                                           | <span style="display:inline-block;width:14px;height:14px;background:#8AEEFB;border-radius:2px;vertical-align:middle"></span> `#8AEEFB` |
| `text.question`  | <span style="color:#AB9DF2;font-style:italic">What are we building here?</span>                    | <span style="display:inline-block;width:14px;height:14px;background:#AB9DF2;border-radius:2px;vertical-align:middle"></span> `#AB9DF2` |
| `text.quoted`    | <span style="color:#E6DB74;font-style:italic;font-weight:100">"She said this was important"</span> | <span style="display:inline-block;width:14px;height:14px;background:#E6DB74;border-radius:2px;vertical-align:middle"></span> `#E6DB74` |
| `text.note`      | <span style="color:#6272A4;font-style:italic">(a parenthetical aside here)</span>                  | <span style="display:inline-block;width:14px;height:14px;background:#6272A4;border-radius:2px;vertical-align:middle"></span> `#6272A4` |
| `text.emphasis`  | <span style="color:#FFD866;font-weight:800">IMPORTANT</span>                                       | <span style="display:inline-block;width:14px;height:14px;background:#FFD866;border-radius:2px;vertical-align:middle"></span> `#FFD866` |
| `text.code`      | <span style="color:#F34D3E">camelCase / https://url.com</span>                                     | <span style="display:inline-block;width:14px;height:14px;background:#F34D3E;border-radius:2px;vertical-align:middle"></span> `#F34D3E` |

### Block Scopes (Markdown)

| Scope                | Renders As                                                                                  | Swatch                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `block.heading.1`    | <span style="color:#FF9D00;font-weight:800"># Heading One</span>                            | <span style="display:inline-block;width:14px;height:14px;background:#FF9D00;border-radius:2px;vertical-align:middle"></span> `#FF9D00` |
| `block.heading.2`    | <span style="color:#FF9D00;font-weight:800">## Heading Two</span>                           | <span style="display:inline-block;width:14px;height:14px;background:#FF9D00;border-radius:2px;vertical-align:middle"></span> `#FF9D00` |
| `block.list.bullet`  | <span style="color:#8AEEFB">- Bullet list item content</span>                               | <span style="display:inline-block;width:14px;height:14px;background:#8AEEFB;border-radius:2px;vertical-align:middle"></span> `#8AEEFB` |
| `block.list.ordered` | <span style="color:#F8A5C2">1. Ordered list item content</span>                             | <span style="display:inline-block;width:14px;height:14px;background:#F8A5C2;border-radius:2px;vertical-align:middle"></span> `#F8A5C2` |
| `block.list.task`    | <span style="color:#8BE9FD">- [x] Completed task item</span>                                | <span style="display:inline-block;width:14px;height:14px;background:#8BE9FD;border-radius:2px;vertical-align:middle"></span> `#8BE9FD` |
| `block.quote`        | <span style="color:#E6DB74;font-style:italic;font-weight:100">> This is a blockquote</span> | <span style="display:inline-block;width:14px;height:14px;background:#E6DB74;border-radius:2px;vertical-align:middle"></span> `#E6DB74` |
| `block.code.fenced`  | <span style="color:#8989E3">code block body text</span>                                     | <span style="display:inline-block;width:14px;height:14px;background:#8989E3;border-radius:2px;vertical-align:middle"></span> `#8989E3` |
| `block.table`        | <span style="color:#E2FF79">                                                                | Table                                                                                                                                  | Content | </span> | <span style="display:inline-block;width:14px;height:14px;background:#E2FF79;border-radius:2px;vertical-align:middle"></span> `#E2FF79` |
| `block.divider`      | <span style="color:#93F9C6">---</span>                                                      | <span style="display:inline-block;width:14px;height:14px;background:#93F9C6;border-radius:2px;vertical-align:middle"></span> `#93F9C6` |
| `block.frontmatter`  | <span style="color:#BD93F9">--- title: My Note ---</span>                                   | <span style="display:inline-block;width:14px;height:14px;background:#BD93F9;border-radius:2px;vertical-align:middle"></span> `#BD93F9` |

### Inline Scopes (Markdown)

| Scope                   | Renders As                                                                                                         | Swatch                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inline.bold`           | <span style="color:#FFD866;font-weight:800">**Bold text here**</span>                                              | <span style="display:inline-block;width:14px;height:14px;background:#FFD866;border-radius:2px;vertical-align:middle"></span> `#FFD866`                                                                                                                                          |
| `inline.italic`         | <span style="color:#BF437F;font-style:italic;font-weight:800">*Italic text here*</span>                            | <span style="display:inline-block;width:14px;height:14px;background:#BF437F;border-radius:2px;vertical-align:middle"></span> `#BF437F`                                                                                                                                          |
| `inline.strike`         | <span style="color:#6272A4;text-decoration:line-through;font-weight:100">~~Struck through~~</span>                 | <span style="display:inline-block;width:14px;height:14px;background:#6272A4;border-radius:2px;vertical-align:middle"></span> `#6272A4`                                                                                                                                          |
| `inline.code`           | <span style="color:#F34D3E">`inline code here`</span>                                                              | <span style="display:inline-block;width:14px;height:14px;background:#F34D3E;border-radius:2px;vertical-align:middle"></span> `#F34D3E`                                                                                                                                          |
| `inline.link`           | <span style="color:#AB9DF2;font-weight:700">[link text]</span><span style="color:#8BE9FD">(https://url.com)</span> | <span style="display:inline-block;width:14px;height:14px;background:#AB9DF2;border-radius:2px;vertical-align:middle"></span> `#AB9DF2` / <span style="display:inline-block;width:14px;height:14px;background:#8BE9FD;border-radius:2px;vertical-align:middle"></span> `#8BE9FD` |
| `inline.image`          | <span style="color:#AB9DF2">![alt text]</span><span style="color:#8BE9FD">(image.jpg)</span>                       | <span style="display:inline-block;width:14px;height:14px;background:#AB9DF2;border-radius:2px;vertical-align:middle"></span> `#AB9DF2`                                                                                                                                          |
| `inline.footnote`       | <span style="color:#8BE9FD">[^1]</span>                                                                            | <span style="display:inline-block;width:14px;height:14px;background:#8BE9FD;border-radius:2px;vertical-align:middle"></span> `#8BE9FD`                                                                                                                                          |
| `inline.superscript`    | <span style="color:#8BE9FD">^superscript^</span>                                                                   | <span style="display:inline-block;width:14px;height:14px;background:#8BE9FD;border-radius:2px;vertical-align:middle"></span> `#8BE9FD`                                                                                                                                          |
| `inline.subscript`      | <span style="color:#8BE9FD">~subscript~</span>                                                                     | <span style="display:inline-block;width:14px;height:14px;background:#8BE9FD;border-radius:2px;vertical-align:middle"></span> `#8BE9FD`                                                                                                                                          |
| `inline.link.reference` | <span style="color:#50FA7B">[label]: https://url.com</span>                                                        | <span style="display:inline-block;width:14px;height:14px;background:#50FA7B;border-radius:2px;vertical-align:middle"></span> `#50FA7B`                                                                                                                                          |

### Notation Marks

*The syntax characters — they match their parent scope and recede visually*

| Scope               | Renders As                                            | Parent Scope         |
| ------------------- | ----------------------------------------------------- | -------------------- |
| `mark.heading`      | <span style="color:#FF9D00">#</span>                  | `block.heading`      |
| `mark.bold`         | <span style="color:#FFD866">**</span>                 | `inline.bold`        |
| `mark.italic`       | <span style="color:#BF437F">*</span>                  | `inline.italic`      |
| `mark.strike`       | <span style="color:#6272A4">~~</span>                 | `inline.strike`      |
| `mark.code.inline`  | <span style="color:#F34D3E">`</span>                  | `inline.code`        |
| `mark.code.fence`   | <span style="color:#6767FC">```</span>                | `block.code.fenced`  |
| `mark.list.bullet`  | <span style="color:#DFC532;font-weight:700">-</span>  | `block.list.bullet`  |
| `mark.list.ordered` | <span style="color:#FF6B6B;font-weight:700">1.</span> | `block.list.ordered` |
| `mark.quote`        | <span style="color:#E6DB74">></span>                  | `block.quote`        |
| `mark.link`         | <span style="color:#AB9DF2">[ ]( )</span>             | `inline.link`        |
| `mark.divider`      | <span style="color:#93F9C6">---</span>                | `block.divider`      |

### Combination Scopes

| Scope                 | Renders As                                                                                                   | Swatch                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `combo.bold.italic`   | <span style="color:#FFD866;font-weight:800;font-style:italic">***Bold and italic together***</span>          | <span style="display:inline-block;width:14px;height:14px;background:#FFD866;border-radius:2px;vertical-align:middle"></span> gold + italic       |
| `combo.bold.strike`   | <span style="color:#FFD866;font-weight:800;text-decoration:line-through">~~**Bold strikethrough**~~</span>   | <span style="display:inline-block;width:14px;height:14px;background:#FFD866;border-radius:2px;vertical-align:middle"></span> gold + line-through |
| `combo.italic.strike` | <span style="color:#BF437F;font-style:italic;text-decoration:line-through">~~*Italic strikethrough*~~</span> | <span style="display:inline-block;width:14px;height:14px;background:#BF437F;border-radius:2px;vertical-align:middle"></span> pink + line-through |
| `combo.code.link`     | <span style="color:#F34D3E;font-weight:700">[`code link`](url)</span>                                        | <span style="display:inline-block;width:14px;height:14px;background:#F34D3E;border-radius:2px;vertical-align:middle"></span> code red            |

### Code Block Language Tokens

| Scope               | Renders As                                                                | Swatch                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `code.keyword`      | <span style="color:#FF79C6">if else return function</span>                | <span style="display:inline-block;width:14px;height:14px;background:#FF79C6;border-radius:2px;vertical-align:middle"></span> `#FF79C6` |
| `code.string`       | <span style="color:#F34D3E">"string literal"</span>                       | <span style="display:inline-block;width:14px;height:14px;background:#F34D3E;border-radius:2px;vertical-align:middle"></span> `#F34D3E` |
| `code.number`       | <span style="color:#8BE9FD">42 3.14 0xFF</span>                           | <span style="display:inline-block;width:14px;height:14px;background:#8BE9FD;border-radius:2px;vertical-align:middle"></span> `#8BE9FD` |
| `code.comment`      | <span style="color:#6272A4;font-style:italic">// this is a comment</span> | <span style="display:inline-block;width:14px;height:14px;background:#6272A4;border-radius:2px;vertical-align:middle"></span> `#6272A4` |
| `code.function`     | <span style="color:#AB9DF2">functionName()</span>                         | <span style="display:inline-block;width:14px;height:14px;background:#AB9DF2;border-radius:2px;vertical-align:middle"></span> `#AB9DF2` |
| `code.variable.def` | <span style="color:#FFD866">const x</span>                                | <span style="display:inline-block;width:14px;height:14px;background:#FFD866;border-radius:2px;vertical-align:middle"></span> `#FFD866` |
| `code.variable`     | <span style="color:#E6E6E6">variableName</span>                           | <span style="display:inline-block;width:14px;height:14px;background:#E6E6E6;border-radius:2px;vertical-align:middle"></span> `#E6E6E6` |
| `code.type`         | <span style="color:#FF9D00">TypeName</span>                               | <span style="display:inline-block;width:14px;height:14px;background:#FF9D00;border-radius:2px;vertical-align:middle"></span> `#FF9D00` |
| `code.operator`     | <span style="color:#BF437F">= + - &&                                      |                                                                                                                                        | </span> | <span style="display:inline-block;width:14px;height:14px;background:#BF437F;border-radius:2px;vertical-align:middle"></span> `#BF437F` |
| `code.invalid`      | <span style="color:#FF5555">syntax error here</span>                      | <span style="display:inline-block;width:14px;height:14px;background:#FF5555;border-radius:2px;vertical-align:middle"></span> `#FF5555` |

</div>

---

## Plain Text Scopes

*These activate when the document does not contain markdown notation. They detect writing intent from universal writing conventions.*

### `text.title`

```
displayName:  "Title"
description:  "A line that stands out as the document title or a major section label"
group:        plain-text
priority:     25
userCustomizable: true
color:        #FF9D00  (Title Orange)
fontWeight:   800

Patterns:
  — First non-empty line of the document (if short, ≤ 80 chars)
  — Any line preceded AND followed by a blank line, ≤ 60 chars
  — Any line in ALL CAPS, ≤ 80 chars (see also text.allcaps for inline)

Rationale:
  Writers naturally put titles on their own line with space around them.
  This is a universal convention predating markdown, word processors,
  even typewriters. Detecting it requires no knowledge of notation.
```

### `text.section`

```
displayName:  "Section Label"
description:  "A line that introduces a section — typically short and ends with a colon"
group:        plain-text
priority:     22
userCustomizable: true
color:        #FF9D00  (Title Orange, slightly lighter in implementation via opacity)
fontWeight:   700

Patterns:
  — Line ending with : AND ≤ 60 chars AND preceded by a blank line
  — Line ending with : AND ≤ 40 chars (short label)

Rationale:
  "Ingredients:", "Next steps:", "TODO:" — this is a near-universal
  plain text convention for labeling sections. Common in email, notes,
  informal writing. No markdown knowledge needed.
```

### `text.list.item`

```
displayName:  "List Item"
description:  "A line that looks like a list entry — starts with a dash, bullet, or number"
group:        plain-text
priority:     20
userCustomizable: true
color:        #8AEEFB  (List Cyan)

Patterns:
  — /^[\s]*[-*•–—]\s+.+/m   (dash/bullet + space + content)
  — /^[\s]*\d+[.)]\s+.+/m   (number + period/paren + space + content)

Rationale:
  Dashes and bullets are the oldest list notation in the world. Anyone
  who has ever written a grocery list has used this format. Recognizing
  it requires zero markdown knowledge.
```

### `text.question`

```
displayName:  "Question"
description:  "A line or sentence ending with a question mark"
group:        plain-text
priority:     21
userCustomizable: true
color:        #AB9DF2  (Link Violet)
fontStyle:    italic

Patterns:
  — /^.+\?$/m                (full line ending with ?)
  — /[A-Z][^.!?]*\?/g        (sentence ending with ? mid-paragraph)

Rationale:
  Questions are semantically distinct from statements. In notes and
  planning documents, questions represent open items, uncertainties,
  things to investigate. Visually distinguishing them reduces cognitive
  load when reviewing: "which lines are still unresolved?"
  
  Violet/purple is associated with contemplation, the open-ended,
  the unanswered — a fitting pairing.
```

### `text.quoted`

```
displayName:  "Quoted Text"
description:  "Text in double quotes, or an indented block — indicating attribution or citation"
group:        plain-text
priority:     21
userCustomizable: true
color:        #E6DB74  (Quote Yellow)
fontStyle:    italic
fontWeight:   100

Patterns:
  — /"[^"]{3,}"/g             (double-quoted inline text, min 3 chars)
  — /^(?:  {4}|\t).+/m       (indented block — 4 spaces or tab)

Rationale:
  "He said, 'this matters'" — quoted speech is universal across all
  writing. Indented blocks are also a universal plain-text convention
  for setting apart quoted or referenced material. The warm yellow
  gives it the feeling of something retrieved, historical, attributed.
```

### `text.note`

```
displayName:  "Aside / Note"
description:  "Parenthetical content — supplementary information, asides, clarifications"
group:        plain-text
priority:     18
userCustomizable: true
color:        #6272A4  (Muted)
fontStyle:    italic

Patterns:
  — /\([^)]{5,}\)/g           (parenthesized text, min 5 chars to avoid abbrevs)

Rationale:
  Text in parentheses is conventionally optional, supplementary,
  "you can skip this if you know already." Muted color supports
  this — the aside visually recedes without disappearing.
```

### `text.emphasis`

```
displayName:  "Emphasis (ALL CAPS)"
description:  "A word or short phrase in ALL CAPS — conveying strong stress"
group:        plain-text
priority:     40
userCustomizable: true
color:        #FFD866  (Bold Gold)
fontWeight:   800

Patterns:
  — /\b[A-Z]{2,}(?:\s+[A-Z]{2,})*\b/g   (ALL CAPS word or phrase, min 2 chars)
  — Exclude: common abbreviations handled via exclusion list (USA, FBI, etc.) — future feature

Rationale:
  ALL CAPS is the oldest typographic emphasis available to plain text.
  It precedes bold, italic, and every other text decoration. When a
  normie writes "this is REALLY important," they expect it to look
  important. Gold is our "most important" color.
```

### `text.code`

```
displayName:  "Technical Term"
description:  "Text that looks technical — URLs, file paths, code-like identifiers"
group:        plain-text
priority:     35
userCustomizable: true
color:        #F34D3E  (Code Red)

Patterns:
  — /https?:\/\/\S+/g                     (URLs)
  — /[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*/g  (camelCase)
  — /[a-z_][a-z0-9_]+_[a-z0-9_]+/g        (snake_case)
  — /\/[a-zA-Z0-9._/-]{3,}/g              (file paths)
  — /\b[A-Z][A-Z0-9_]{2,}\b/g             (CONSTANTS, separate from ALL CAPS phrases)

Rationale:
  Technical identifiers have a distinct visual shape — they combine
  uppercase and lowercase in unusual ways, or contain slashes and dots
  in sequence. Highlighting them in code-red signals precision:
  "this exact string matters, don't paraphrase it."
```

---

## Markdown Scopes

*These activate when the document contains markdown notation. They recognize explicit syntax and color both the notation and the content together.*

### Block Structure

#### `block.heading.1` — `block.heading.6`

```
displayName:  "Heading 1" through "Heading 6"
description:  "A heading line — # for H1, ## for H2, etc."
group:        markdown
priority:     25
userCustomizable: true (color only; level names not user-editable)
color:        #FF9D00  (Title Orange)
fontWeight:   800

Patterns:
  block.heading.1:  /^#{1}\s+.+/m
  block.heading.2:  /^#{2}\s+.+/m
  block.heading.3:  /^#{3}\s+.+/m
  block.heading.4:  /^#{4}\s+.+/m
  block.heading.5:  /^#{5}\s+.+/m
  block.heading.6:  /^#{6}\s+.+/m

Note: mark.heading applies to the # characters (same color, slightly muted weight).
Same color as text.title — this is intentional. The bridge.
```

#### `block.list.bullet`

```
displayName:  "Bullet List"
description:  "An unordered list item — -, *, or + followed by content"
group:        markdown
priority:     20
userCustomizable: true
color:        #8AEEFB  (List Cyan)

Pattern:  /^[\s]*[-*+]\s+.+/m
Same color as text.list.item — the bridge.
```

#### `block.list.ordered`

```
displayName:  "Numbered List"
description:  "An ordered list item — number followed by . or ) and content"
group:        markdown
priority:     20
userCustomizable: true
color:        #F8A5C2  (Ordered Blush)

Pattern:  /^[\s]*\d+[.)]\s+.+/m
```

#### `block.list.task`

```
displayName:  "Task / Checkbox"
description:  "A task list item — - [ ] or - [x]"
group:        markdown
priority:     22
userCustomizable: true
color:        #8BE9FD  (URL Aqua)

Patterns:
  Unchecked:  /^[\s]*[-*+]\s+\[ \]\s+.+/m
  Checked:    /^[\s]*[-*+]\s+\[x\]\s+.+/mi
```

#### `block.quote`

```
displayName:  "Blockquote"
description:  "A quoted block — lines starting with >"
group:        markdown
priority:     20
userCustomizable: true
color:        #E6DB74  (Quote Yellow)
fontStyle:    italic
fontWeight:   100

Pattern:  /^>[\s]*.+/m
Same color family as text.quoted — the bridge.
```

#### `block.code.fenced`

```
displayName:  "Code Block"
description:  "A fenced code block — content between ``` markers"
group:        markdown
priority:     20
userCustomizable: true (color of delimiters; code content uses code.* scopes)
color:        #8989E3  (Code Body Blue)  ← body/content color
delimColor:   #6767FC  (Fence Purple)   ← the ``` markers

Pattern:  /^```[\s\S]*?^```/gm   (multiline)
```

#### `block.table`

```
displayName:  "Table"
description:  "A markdown table — rows of | separated columns"
group:        markdown
priority:     20
userCustomizable: true
color:        #E2FF79  (Table Lime)

Pattern:  /^\|.+\|$/m  (lines starting and ending with pipe)
```

#### `block.divider`

```
displayName:  "Divider"
description:  "A horizontal rule — three or more -, *, or _"
group:        markdown
priority:     20
userCustomizable: true
color:        #93F9C6  (Divider Mint)

Pattern:  /^[\s]*(?:[-*_][\s]*){3,}$/m
```

#### `block.frontmatter`

```
displayName:  "Front Matter"
description:  "YAML metadata block at the top of the document — between --- markers"
group:        markdown
priority:     25
userCustomizable: true
color:        #BD93F9  (Frontmatter Purple)

Pattern:  /^---[\s\S]*?^---/m  (must be at document start)
```

---

### Inline Emphasis

#### `inline.bold`

```
displayName:  "Bold"
description:  "Important text — wrap in **double asterisks** or __double underscores__"
group:        markdown
priority:     45
userCustomizable: true
color:        #FFD866  (Bold Gold)
fontWeight:   800

Patterns:
  /\*\*(?!\s)(?:[^*]|\*(?!\*))+(?<!\s)\*\*/g
  /__(?!\s)(?:[^_]|_(?!_))+(?<!\s)__/g

Note: Matches content AND the ** markers (marks styled via mark.bold).
Same color as text.emphasis ALL CAPS — the bridge.
```

#### `inline.italic`

```
displayName:  "Italic"
description:  "Emphasized text — wrap in *single asterisks* or _single underscores_"
group:        markdown
priority:     42
userCustomizable: true
color:        #BF437F  (Italic Pink)
fontStyle:    italic
fontWeight:   800

Patterns:
  /(?<!\*)\*(?!\s)(?:[^*])+(?<!\s)\*(?!\*)/g   (single * not adjacent to another *)
  /(?<!_)_(?!\s)(?:[^_])+(?<!\s)_(?!_)/g        (single _ not adjacent to another _)
```

#### `inline.strike`

```
displayName:  "Strikethrough"
description:  "Removed or deprecated text — wrap in ~~double tildes~~"
group:        markdown
priority:     44
userCustomizable: true
color:        #6272A4  (Strike Muted)
textDecoration: line-through
fontWeight:   100

Pattern:  /~~(?!\s)(?:[^~]|~(?!~))+(?<!\s)~~/g
```

#### `inline.code`

```
displayName:  "Inline Code"
description:  "A technical term, command, or exact string — wrap in `backticks`"
group:        markdown
priority:     60
userCustomizable: true
color:        #F34D3E  (Code Red)

Pattern:  /`[^`\n]+`/g

Note: Higher priority than emphasis — code beats bold/italic if they overlap.
The backtick marks are colored the same as the content (mark.code.inline).
Same color as text.code — the bridge.
```

#### `inline.link`

```
displayName:  "Link"
description:  "A hyperlink — [link text](url)"
group:        markdown
priority:     58
userCustomizable: true
color:        #AB9DF2  (Link Violet)
fontWeight:   700

Pattern:  /\[(?:[^\[\]]*)\]\([^)]*\)/g   (full [text](url) match)
Sub-scopes:
  inline.link.text  → /(?<=\[)[^\[\]]+(?=\])/g  → #AB9DF2 (Link Violet)
  inline.link.url   → /(?<=\]\()[^)]+(?=\))/g    → #8BE9FD (URL Aqua)

Note: URL aqua "points outward" — the destination is a different color
from the label, distinguishing what you see from where you go.
```

#### `inline.link.reference`

```
displayName:  "Reference Link"
description:  "A reference-style link definition — [label]: url"
group:        markdown
priority:     56
userCustomizable: true
color:        #50FA7B  (Reference Green)

Pattern:  /^\[[^\]]+\]:\s+\S+/m
```

#### `inline.image`

```
displayName:  "Image"
description:  "An embedded image — ![alt text](url)"
group:        markdown
priority:     58
userCustomizable: true
color:        #AB9DF2  (Link Violet — same family as links)

Pattern:  /!\[(?:[^\[\]]*)\]\([^)]*\)/g
Sub-scopes:
  inline.image.alt  → /(?<=!\[)[^\[\]]+(?=\])/g  → #AB9DF2
  inline.image.url  → /(?<=\]\()[^)]+(?=\))/g     → #8BE9FD
```

#### `inline.footnote`

```
displayName:  "Footnote Reference"
description:  "A footnote marker — [^1] or [^name]"
group:        markdown
priority:     55
userCustomizable: true
color:        #8BE9FD  (URL Aqua)

Pattern:  /\[\^[^\]]+\]/g
```

#### `inline.superscript`

```
displayName:  "Superscript"
description:  "Superscript text — ^text^"
group:        markdown
priority:     42
userCustomizable: true
color:        #8BE9FD

Pattern:  /\^[^\^\s]+\^/g
```

#### `inline.subscript`

```
displayName:  "Subscript"
description:  "Subscript text — ~text~ (single tilde)"
group:        markdown
priority:     42
userCustomizable: true
color:        #8BE9FD

Pattern:  /(?<!~)~(?!~)[^~\s]+(?<!~)~(?!~)/g
```

---

### Notation Marks (Delimiters)

*These apply to the actual syntax characters. They share color with their parent scope so notation blends with content rather than competing.*

#### `mark.heading`

```
displayName:  "Heading Markers"
description:  "The # symbols in headings"
priority:     100
userCustomizable: false
color:        #FF9D00  (matches block.heading)

Pattern:  /^#+(?=\s)/m
```

#### `mark.bold`

```
displayName:  "Bold Markers"
description:  "The ** or __ surrounding bold text"
priority:     100
userCustomizable: false
color:        #FFD866  (matches inline.bold)

Patterns:  /\*\*/g  |  /__/g  (only when adjacent to bold match)
```

#### `mark.italic`

```
displayName:  "Italic Markers"
description:  "The * or _ surrounding italic text"
priority:     100
userCustomizable: false
color:        #BF437F  (matches inline.italic)
```

#### `mark.strike`

```
displayName:  "Strikethrough Markers"
description:  "The ~~ surrounding strikethrough text"
priority:     100
userCustomizable: false
color:        #6272A4  (matches inline.strike)
```

#### `mark.code.inline`

```
displayName:  "Inline Code Backticks"
description:  "The ` backtick characters around inline code"
priority:     100
userCustomizable: false
color:        #F34D3E  (matches inline.code — backticks same color as content)
```

#### `mark.code.fence`

```
displayName:  "Code Fence Markers"
description:  "The ``` opening and closing a code block"
priority:     100
userCustomizable: false
color:        #6767FC  (Fence Purple — distinct from code content)
```

#### `mark.list.bullet`

```
displayName:  "Bullet Markers"
description:  "The -, *, + characters that start bullet list items"
priority:     100
userCustomizable: false
color:        #DFC532  (Bullet Gold — distinct from content cyan, indicates hierarchy)
fontWeight:   700
```

#### `mark.list.ordered`

```
displayName:  "Number Markers"
description:  "The 1., 2., etc. that start ordered list items"
priority:     100
userCustomizable: false
color:        #FF6B6B  (Number Red — warm, ordered, distinct from content blush)
fontWeight:   700
```

#### `mark.quote`

```
displayName:  "Blockquote Marker"
description:  "The > character starting a blockquote line"
priority:     100
userCustomizable: false
color:        #E6DB74  (matches block.quote)
```

#### `mark.link`

```
displayName:  "Link Brackets"
description:  "The [ ] ( ) characters in link syntax"
priority:     100
userCustomizable: false
color:        #AB9DF2  (matches inline.link)
```

#### `mark.divider`

```
displayName:  "Divider Characters"
description:  "The ---, ***, or ___ making up a horizontal rule"
priority:     100
userCustomizable: false
color:        #93F9C6  (matches block.divider)
```

---

## Combination Scopes

*Defined explicitly for cases where two inline scopes overlap. The combo scope has its own priority (always high) and inherits styles from both parents.*

### `combo.bold.italic`

```
displayName:  "Bold Italic"
description:  "Both bold and italic — wrap in ***triple asterisks*** or **_mixed_**"
comboOf:      ["inline.bold", "inline.italic"]
priority:     82
userCustomizable: true
color:        #FFD866  (Bold Gold — bold wins for color)
fontWeight:   800
fontStyle:    italic

Patterns:
  /\*\*\*(?!\s)(?:[^*])+(?<!\s)\*\*\*/g   (triple asterisk)
  /\*\*_(?!\s)(?:[^_])+(?<!\s)_\*\*/g     (bold wrapping italic)
  /_\*\*(?!\s)(?:[^*])+(?<!\s)\*\*_/g     (italic wrapping bold)
```

### `combo.bold.strike`

```
displayName:  "Bold Strikethrough"
description:  "Bold text that is struck through"
comboOf:      ["inline.bold", "inline.strike"]
priority:     82
userCustomizable: true
color:        #FFD866  (Bold Gold)
fontWeight:   800
textDecoration: line-through

Patterns:
  /~~\*\*(?!\s)(?:[^*])+(?<!\s)\*\*~~/g
  /\*\*~~(?!\s)(?:[^~])+(?<!\s)~~\*\*/g
```

### `combo.italic.strike`

```
displayName:  "Italic Strikethrough"
description:  "Italic text that is struck through"
comboOf:      ["inline.italic", "inline.strike"]
priority:     82
userCustomizable: true
color:        #BF437F  (Italic Pink)
fontStyle:    italic
textDecoration: line-through

Patterns:
  /~~\*(?!\s)(?:[^*])+(?<!\s)\*~~/g
  /\*~~(?!\s)(?:[^~])+(?<!\s)~~\*/g
```

### `combo.code.link`

```
displayName:  "Code Link"
description:  "A link whose display text is code — [`code`](url)"
comboOf:      ["inline.code", "inline.link"]
priority:     85
userCustomizable: false
color:        #F34D3E  (Code Red — code wins over link for text color)
fontWeight:   700

Pattern:  /\[`[^`]+`\]\([^)]+\)/g
```

---

## Code Block Language Scopes

*These apply inside fenced code blocks and are determined by the embedded language parser. Separate from the markdown/plain-text scope system.*

```
code.keyword          #FF79C6  (Pink)      — if, else, return, function, class
code.string           #F34D3E  (Code Red)  — "string literals"
code.number           #8BE9FD  (URL Aqua)  — 42, 3.14, 0xFF
code.comment          #6272A4  (Muted)     — // comments, italic
code.function         #AB9DF2  (Link Violet) — function names (calls and definitions)
code.variable.def     #FFD866  (Bold Gold)  — variable definitions (const x = ...)
code.variable         #E6E6E6  (Foreground) — variable usage
code.type             #FF9D00  (Title Orange) — type names, classes, interfaces
code.operator         #BF437F  (Italic Pink)  — = + - * / && ||
code.punctuation      #E6E6E6  (Foreground)   — { } ; , .
code.invalid          #FF5555  (Error Red)    — syntax errors
```

*Note: Code block scopes use a minimal HighlightStyle in `theme.ts` (not the custom ViewPlugin), since they interact with embedded language parsers that produce their own tree. This is the one place we keep the existing mechanism because it genuinely works without the complexity problems.*

---

## Scope Groups & Activation

```
Mode              Active Scope Groups
─────────────────────────────────────────────────────
Plain Text Mode   plain-text, shared
Markdown Mode     markdown, shared, code (inside fenced blocks)
Auto (default)    detect from document content
  If document contains: # ## ** * `` [x](y) → markdown mode
  Otherwise → plain text mode
  Detection updates on each document open, not while typing
```

**Auto-detection heuristic:**

```typescript
function detectMode(doc: string): 'markdown' | 'plain-text' {
  const markdownSignals = [
    /^#{1,6}\s/m,          // headings
    /\*\*[^*]+\*\*/,       // bold
    /\[[^\]]+\]\([^)]+\)/, // links
    /^[-*+]\s/m,           // bullet lists (markdown-intent)
    /^```/m,               // fenced code
  ]
  const matches = markdownSignals.filter(p => p.test(doc)).length
  return matches >= 2 ? 'markdown' : 'plain-text'
}
```

Two or more markdown signals = markdown mode. Single signal could be accidental. User can always override via settings.

---

## Open Questions (For Iteration)

These are design decisions to revisit with user testing:

1. **Plain text list detection**: Should `- item` trigger `text.list.item` even in markdown mode? (Probably yes — it IS a list either way.)

2. **ALL CAPS edge cases**: Company names, acronyms (USA, HTML, etc.) will trigger `text.emphasis`. Build an exclusion list? Or accept the false positives as acceptable noise?

3. **text.title detection**: "First line of document" is a strong signal. But what if the first line is intentionally body text? Need a max-length threshold. Proposed: ≤ 80 chars for first-line detection.

4. **text.section vs block.heading**: In mixed documents (plain text with some markdown), does a line ending in `:` conflict with a `# Heading:`? Priority should resolve this (markdown headings win), but edge cases need testing.

5. **inline.subscript pattern conflict**: Single `~` is subscript. `~~` is strikethrough. The subscript pattern must not match inside strikethrough. Current patterns handle this with negative lookahead/lookbehind — needs thorough testing.

6. **User-defined patterns** (future feature): The architecture supports it — users can add new `Scope` objects to the array. The UI would let them write a regex, name it, pick a color. This is a power-user feature for a later version.

---

## Normie UX Notes

These are not implementation items — they're product design notes for when the formatting UI is built:

- **No mode label visible by default.** Users shouldn't know they're in "plain text mode." The app just highlights intelligently.
- **Hover tooltip on colored text**: "This looks like a [Title]. Press ⌘1 to make it an official heading." Only on first occurrence. Disappears after acknowledged.
- **Gradual discovery, never tutorial.** The floating action button is how users discover formatting intentionally. Highlighting just happens.
- **Color consistency is the trust mechanism.** Normie writes a title → it goes orange. They eventually use `# ` → still orange. They trust the colors because they're consistent, not because they understood why.

---

*This document is the source of truth for all scope definitions. Changes here propagate to `src/scopes.ts` (implementation) and future customization UI data models.*
