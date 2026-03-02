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
  "(tm)": "™"
}

import { EditorState, Transaction, TransactionSpec, StateField, StateEffect } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'

export const autocorrectApplied = StateEffect.define<{ from: number, to: number, original: string }>()
export const autocorrectIgnored = StateEffect.define<number>()

export const autocorrectState = StateField.define<{
  lastCorrection: { from: number, to: number, original: string } | null,
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
        to: tr.changes.mapPos(lastCorrection.to, 1),
        original: lastCorrection.original
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
        if (newSpec) return // Only handle one change per transaction

        const state = tr.startState.field(autocorrectState, false)

        // UNDO FLOW: If user hits backspace exactly after a correction
        if (tr.isUserEvent('delete.backward') && state?.lastCorrection) {
          if (fromA === state.lastCorrection.to && inserted.length === 0) {
            newSpec = {
              changes: { from: state.lastCorrection.from, to: toA, insert: state.lastCorrection.original },
              effects: autocorrectIgnored.of(state.lastCorrection.from + state.lastCorrection.original.length),
              userEvent: "delete.backward"
            }
          }
          return
        }

        if (!tr.isUserEvent('input.type')) return

        const insertedStr = inserted.toString()

        // SYNTAX BLOCK DETECTION: Disable inside code, URLs and links
        const node = syntaxTree(tr.startState).resolveInner(fromA, -1)
        if (
          node.name.includes("Code") ||
          node.name === "URL" ||
          node.name.includes("Link")
        ) {
          return
        }

        // IGNORE TRIGGER on manually reverted words
        if (state?.ignoredPositions.has(fromA)) {
          return
        }

        // AUTO-CAPITALIZATION: Capitalize first letter of new sentences
        if (insertedStr.length === 1 && /[a-z]/.test(insertedStr)) {
          const line = tr.startState.doc.lineAt(fromA)
          const textBefore = line.text.slice(0, fromA - line.from)

          // Match: start of line, OR [.!?] followed by a space
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

        // AUTOCORRECT DICTIONARY: Swap words on space/punctuation
        if (insertedStr.length === 1 && /^[\s.,!?;:\n]$/.test(insertedStr)) {
          const line = tr.startState.doc.lineAt(fromA)
          const textBefore = line.text.slice(0, fromA - line.from)

          // Match the last adjacent alphanumeric word or emoji colon syntax
          const match = textBefore.match(/([a-zA-Z0-9_:-]+)$/)
          if (match) {
            const word = match[1]
            if (AUTOCORRECT_DICTIONARY[word]) {
              const replacement = AUTOCORRECT_DICTIONARY[word]
              const wordStart = fromA - word.length

              newSpec = {
                changes: [
                  { from: wordStart, to: fromA, insert: replacement },
                  { from: fromA, to: toA, insert: insertedStr }
                ],
                // Set the cursor after the inserted space/punctuation
                selection: { anchor: wordStart + replacement.length + insertedStr.length },
                effects: autocorrectApplied.of({
                  from: wordStart,
                  to: wordStart + replacement.length + insertedStr.length,
                  original: word + insertedStr // Keep track of the inserted word
                }),
                userEvent: "input.type"
              }
              return
            }
          }
        }
      })

      return newSpec || tr
    })
  ]
}
