export const AUTOCORRECT_DICTIONARY: Record<string, string> = {
  // --- Common Misspellings ---
  "teh": "the",
  "taht": "that",
  "dont": "don't",
  "cant": "can't",
  "wont": "won't",
  "im": "I'm",
  "ive": "I've",
  "id": "I'd",
  "ill": "I'll",
  "doesnt": "doesn't",
  "didnt": "didn't",
  "isnt": "isn't",
  "arent": "aren't",
  "wasnt": "wasn't",
  "werent": "weren't",
  "hasnt": "hasn't",
  "havent": "haven't",
  "hadnt": "hadn't",
  "shouldnt": "shouldn't",
  "couldnt": "couldn't",
  "wouldnt": "wouldn't",
  "hes": "he's",
  "shes": "she's",
  "itll": "it'll",
  "its": "it's", // Contextual, often wrong
  "theyre": "they're",
  "youre": "you're",
  "youve": "you've",
  "youll": "you'll",
  "youid": "you'd",
  "weve": "we've",
  "well": "we'll",
  "wed": "we'd",
  "alot": "a lot",
  "thru": "through",
  "tho": "though",
  "definitely": "definitely",
  "definately": "definitely",
  "seperate": "separate",
  "accomodate": "accommodate",
  "recieve": "receive",
  "occured": "occurred",
  "occuring": "occurring",
  "untill": "until",
  "wierd": "weird",
  "belive": "believe",
  "tommorow": "tomorrow",
  "freind": "friend",
  "accross": "across",
  "agressive": "aggressive",
  "appearence": "appearance",
  "arguement": "argument",
  "assasin": "assassin",
  "basicly": "basically",
  "bizzarre": "bizarre",
  "collegue": "colleague",
  "commitee": "committee",
  "completly": "completely",
  "curiosty": "curiosity",
  "dissapear": "disappear",
  "disapoint": "disappoint",
  "enviroment": "environment",
  "existense": "existence",
  "familier": "familiar",
  "fourty": "forty",
  "goverment": "government",
  "happend": "happened",
  "harrass": "harass",
  "independant": "independent",
  "knowlege": "knowledge",
  "mispell": "misspell",
  "misterious": "mysterious",
  "neccessary": "necessary",
  "noticable": "noticeable",
  "ocassion": "occasion",
  "pavillion": "pavilion",
  "posession": "possession",
  "priviledge": "privilege",
  "publically": "publicly",
  "reccomend": "recommend",
  "restarant": "restaurant",
  "succesful": "successful",
  "surprise": "surprise",
  "tatoo": "tattoo",
  "tendancy": "tendency",
  "truely": "truly",
  "unforseen": "unforeseen",
  "vaccum": "vacuum",
  "weather": "whether", // Contextual
  "wether": "whether",

  // --- Emojis and Symbols ---
  ":smile:": "😊",
  ":sad:": "😞",
  ":laugh:": "😂",
  ":cry:": "😭",
  ":heart:": "❤️",
  ":star:": "⭐",
  ":fire:": "🔥",
  ":rocket:": "🚀",
  ":check:": "✅",
  ":cross:": "❌",
  ":warning:": "⚠️",
  ":info:": "ℹ️",
  ":question:": "❓",
  ":exclamation:": "❗",
  ":sun:": "☀️",
  ":moon:": "☽",
  ":saturn:": "♄",
  ":earth:": "🌍",
  ":thumbsup:": "👍",
  ":thumbsdown:": "👎",
  ":shrug:": "🤷",
  ":pray:": "🙏",
  ":party:": "🎉",
  ":tada:": "🎉",
  ":sparkles:": "✨",

  // --- Formatting and Punctuation (M-dash, fractions) ---
  "--": "—",
  "...": "…",
  "1/2": "½",
  "1/4": "¼",
  "3/4": "¾",
  "c/o": "℅",
  "(c)": "©",
  "(r)": "®",
  "(tm)": "™",
  "->": "→"
}

import { EditorState, Transaction, TransactionSpec, StateField, StateEffect } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { EditorView } from '@codemirror/view'

export const autocorrectApplied = StateEffect.define<{ from: number, to: number, original: string, triggerPos: number }>()
export const autocorrectIgnored = StateEffect.define<number>()

export const autocorrectState = StateField.define<{
  lastCorrection: { from: number, to: number, original: string, triggerPos: number } | null,
  ignoredPositions: Set<number>
}>({
  create() {
    return { lastCorrection: null, ignoredPositions: new Set() }
  },
  update(value, tr) {
    let lastCorrection = value.lastCorrection
    let ignoredPositions = new Set(value.ignoredPositions)

    if (lastCorrection && tr.docChanged) {
      lastCorrection = {
        from: tr.changes.mapPos(lastCorrection.from),
        to: tr.changes.mapPos(lastCorrection.to),
        original: lastCorrection.original,
        triggerPos: tr.changes.mapPos(lastCorrection.triggerPos)
      }
    }

    if (tr.docChanged && ignoredPositions.size > 0) {
      const newIgn = new Set<number>()
      for (const pos of ignoredPositions) {
        newIgn.add(tr.changes.mapPos(pos))
      }
      ignoredPositions = newIgn
    }

    for (const eff of tr.effects) {
      if (eff.is(autocorrectApplied)) {
        lastCorrection = eff.value
      } else if (eff.is(autocorrectIgnored)) {
        ignoredPositions.add(eff.value)
      }
    }

    return { lastCorrection, ignoredPositions }
  }
})

export const customAutocorrect = () => {
  return [
    autocorrectState,

    EditorState.transactionFilter.of((tr: Transaction) => {
      if (!tr.docChanged) return tr
      if (!tr.isUserEvent('input.type') && !tr.isUserEvent('delete.backward')) return tr

      let newSpec: TransactionSpec | null = null

      tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
        if (newSpec) return

        const state = tr.startState.field(autocorrectState, false)

        // FLOW 1: Backspace exactly after a correction
        if (tr.isUserEvent('delete.backward') && state?.lastCorrection) {
          if (fromA === state.lastCorrection.to && inserted.length === 0) {
            newSpec = {
              changes: [
                { from: state.lastCorrection.from, to: state.lastCorrection.to, insert: state.lastCorrection.original },
                { from: fromA, to: toA, insert: "" }
              ],
              effects: autocorrectIgnored.of(state.lastCorrection.from + state.lastCorrection.original.length),
              selection: { anchor: state.lastCorrection.from + state.lastCorrection.original.length },
              userEvent: "delete.backward"
            }
          }
          return
        }

        // AUTO-CAPITALIZATION
        if (tr.isUserEvent('input.type')) {
          const insertedStr = inserted.toString()
          if (insertedStr.length === 1 && /[a-z]/.test(insertedStr)) {
            const line = tr.startState.doc.lineAt(fromA)
            const textBefore = line.text.slice(0, fromA - line.from)
            const isStartOfSentence = /^$|([.!?]\s+)$/.test(textBefore)

            if (isStartOfSentence) {
              newSpec = {
                changes: { from: fromA, to: toA, insert: insertedStr.toUpperCase() },
                selection: { anchor: fromA + 1 },
                userEvent: "input.type"
              }
              return
            }
          }
        }
      })

      return newSpec || tr
    }),

    EditorView.updateListener.of((update) => {
      if (!update.docChanged) return

      const isInput = update.transactions.some(tr => tr.isUserEvent('input.type'))
      if (!isInput) return

      update.changes.iterChanges((_fromA, _toA, fromB, _toB, inserted) => {
        const insertedStr = inserted.toString()

        if (insertedStr.length === 1 && /^[\s.,!?;:\n]$/.test(insertedStr)) {
          const line = update.state.doc.lineAt(fromB)
          const textBefore = line.text.slice(0, fromB - line.from)

          const match = textBefore.match(/([a-zA-Z0-9_:-]+)$/)
          if (match) {
            const word = match[1]
            if (AUTOCORRECT_DICTIONARY[word]) {
              const replacement = AUTOCORRECT_DICTIONARY[word]
              const wordStart = fromB - word.length

              const node = syntaxTree(update.state).resolveInner(wordStart, 1)
              if (
                node.name.includes("Code") ||
                node.name === "URL" ||
                node.name.includes("Link")
              ) {
                return
              }

              const state = update.state.field(autocorrectState, false)
              if (state?.ignoredPositions.has(wordStart + word.length)) {
                return
              }

              update.view.dispatch({
                changes: { from: wordStart, to: fromB, insert: replacement },
                effects: autocorrectApplied.of({
                  from: wordStart,
                  to: wordStart + replacement.length,
                  original: word,
                  triggerPos: wordStart + replacement.length
                }),
                userEvent: "autocorrect"
              })
            }
          }
        }
      })
    })
  ]
}
