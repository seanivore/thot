// Thot v2 - Hanging Indent Plugin
// Ensures wrapped lines maintain indentation matching the first line's content start
import { EditorView, ViewPlugin, ViewUpdate, Decoration, DecorationSet } from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'

function getIndentWidth(lineText: string): number {
  // Count leading whitespace
  let spaces = 0
  for (const ch of lineText) {
    if (ch === ' ') spaces++
    else if (ch === '\t') spaces += 4
    else break
  }

  const trimmed = lineText.trimStart()

  // Bullet list markers: -, *, +
  const bulletMatch = trimmed.match(/^[-*+]\s/)
  if (bulletMatch) {
    return spaces + bulletMatch[0].length
  }

  // Numbered list markers: 1. 2. etc
  const numberMatch = trimmed.match(/^\d+[.)]\s/)
  if (numberMatch) {
    return spaces + numberMatch[0].length
  }

  // Blockquote markers: >
  const quoteMatch = trimmed.match(/^>+\s?/)
  if (quoteMatch) {
    return spaces + quoteMatch[0].length
  }

  // Default: just preserve leading whitespace indent
  return spaces
}

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>()

  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos)
      const indentChars = getIndentWidth(line.text)

      if (indentChars > 0) {
        builder.add(line.from, line.from, Decoration.line({
          attributes: {
            style: `padding-left: ${indentChars}ch; text-indent: -${indentChars}ch;`
          }
        }))
      }

      pos = line.to + 1
    }
  }

  return builder.finish()
}

export const hangingIndentPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.geometryChanged) {
        this.decorations = buildDecorations(update.view)
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
)
