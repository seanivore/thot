// Thot v2 - Markdown Decoration Plugin
// Applies CSS classes based on syntax tree context for elements
// that styleTags alone can't differentiate (e.g. bullet vs numbered lists)
import { EditorView, ViewPlugin, ViewUpdate, Decoration, DecorationSet } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import { RangeSetBuilder } from '@codemirror/state'

const bulletMarkDeco = Decoration.mark({ class: 'thot-bullet-mark' })
const numberMarkDeco = Decoration.mark({ class: 'thot-number-mark' })
const bulletContentDeco = Decoration.mark({ class: 'thot-bullet-content' })
const numberContentDeco = Decoration.mark({ class: 'thot-number-content' })
const inlineCodeMarkDeco = Decoration.mark({ class: 'thot-inline-code-mark' })
const blockCodeMarkDeco = Decoration.mark({ class: 'thot-block-code-mark' })
const tableDeco = Decoration.mark({ class: 'thot-table' })
const hrDeco = Decoration.mark({ class: 'thot-hr' })
const checkboxDeco = Decoration.mark({ class: 'thot-checkbox' })

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>()
  const tree = syntaxTree(view.state)

  // Collect decorations, then sort by from position
  const decos: { from: number; to: number; deco: Decoration }[] = []

  for (const { from, to } of view.visibleRanges) {
    tree.iterate({
      from,
      to,
      enter(node) {
        const name = node.name

        // List markers - differentiate bullet vs numbered
        if (name === 'ListMark') {
          let parent = node.node.parent
          // Walk up to find BulletList or OrderedList
          while (parent) {
            if (parent.name === 'BulletList') {
              decos.push({ from: node.from, to: node.to, deco: bulletMarkDeco })
              return
            }
            if (parent.name === 'OrderedList') {
              decos.push({ from: node.from, to: node.to, deco: numberMarkDeco })
              return
            }
            parent = parent.parent
          }
        }

        // List item content - text inside list items (but NOT the marker)
        if (name === 'ListItem') {
          let listType: 'bullet' | 'ordered' | null = null
          let parent = node.node.parent
          while (parent) {
            if (parent.name === 'BulletList') { listType = 'bullet'; break }
            if (parent.name === 'OrderedList') { listType = 'ordered'; break }
            parent = parent.parent
          }
          if (!listType) return

          // Find content after the ListMark
          const cursor = node.node.cursor()
          if (cursor.firstChild()) {
            do {
              // Skip the ListMark itself, apply to other content
              if (cursor.name !== 'ListMark') {
                const contentDeco = listType === 'bullet' ? bulletContentDeco : numberContentDeco
                decos.push({ from: cursor.from, to: cursor.to, deco: contentDeco })
              }
            } while (cursor.nextSibling())
          }
        }

        // Code marks - differentiate inline vs fenced
        if (name === 'CodeMark') {
          let parent = node.node.parent
          while (parent) {
            if (parent.name === 'InlineCode') {
              decos.push({ from: node.from, to: node.to, deco: inlineCodeMarkDeco })
              return
            }
            if (parent.name === 'FencedCode') {
              decos.push({ from: node.from, to: node.to, deco: blockCodeMarkDeco })
              return
            }
            parent = parent.parent
          }
        }

        // Table elements
        if (name === 'TableHeader' || name === 'TableDelimiter' || name === 'TableRow' || name === 'TableCell') {
          decos.push({ from: node.from, to: node.to, deco: tableDeco })
        }

        // Horizontal rule
        if (name === 'HorizontalRule') {
          decos.push({ from: node.from, to: node.to, deco: hrDeco })
        }

        // Task list checkboxes
        if (name === 'TaskMarker') {
          decos.push({ from: node.from, to: node.to, deco: checkboxDeco })
        }
      }
    })
  }

  // Sort by position (required by RangeSetBuilder)
  decos.sort((a, b) => a.from - b.from || a.to - b.to)

  for (const { from, to, deco } of decos) {
    if (from < to) {
      builder.add(from, to, deco)
    }
  }

  return builder.finish()
}

export const markdownDecorations = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = buildDecorations(update.view)
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
)
