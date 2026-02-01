import AppKit

/// NSTextView subclass that implements IDE-like paired delimiter behavior.
///
/// Supported pairs: () [] {} '' "" ``
///
/// Behaviors:
/// 1. Type opening → inserts pair, cursor between
/// 2. Type closing when before existing closing → skip over
/// 3. Select text, type opening → wraps selection
/// 4. Backspace between empty pair → deletes both
/// 5. Quote/backtick mid-word → single character (for contractions)
final class PairedDelimiterTextView: NSTextView {
    /// Delimiter pairs: opening -> closing
    private let pairs: [Character: Character] = [
        "(": ")",
        "[": "]",
        "{": "}",
        "'": "'",
        "\"": "\"",
        "`": "`"
    ]

    /// Closing characters that can be skipped over
    private var closingChars: Set<Character> {
        Set(pairs.values)
    }

    /// Characters that indicate we're in the middle of a word (for quote handling)
    private let wordChars = CharacterSet.alphanumerics

    // MARK: - Text Insertion

    override func insertText(_ string: Any, replacementRange: NSRange) {
        guard let text = string as? String, text.count == 1,
              let char = text.first else {
            super.insertText(string, replacementRange: replacementRange)
            return
        }

        let selectedRange = self.selectedRange()
        let hasSelection = selectedRange.length > 0

        // Check if this is an opening delimiter
        if let closingChar = pairs[char] {
            if hasSelection {
                // Wrap selection with pair
                wrapSelection(opening: char, closing: closingChar, range: selectedRange)
                return
            }

            // Check if we should insert a pair or just the character
            if shouldInsertPair(for: char) {
                insertPair(opening: char, closing: closingChar)
                return
            }
        }

        // Check if this is a closing delimiter that we can skip over
        if closingChars.contains(char) && !hasSelection {
            if canSkipOver(char: char) {
                skipOver()
                return
            }
        }

        // Default behavior
        super.insertText(string, replacementRange: replacementRange)
    }

    // MARK: - Backward Delete

    override func deleteBackward(_ sender: Any?) {
        let selectedRange = self.selectedRange()

        // Only handle if no selection and we can delete
        guard selectedRange.length == 0, selectedRange.location > 0 else {
            super.deleteBackward(sender)
            return
        }

        // Check if we're between an empty pair
        if shouldDeletePair(at: selectedRange.location) {
            deletePair(at: selectedRange.location)
            return
        }

        super.deleteBackward(sender)
    }

    // MARK: - Helper Methods

    /// Check if we should insert a pair for this opening character.
    private func shouldInsertPair(for char: Character) -> Bool {
        // For quotes and backticks, don't pair if we're mid-word
        if char == "'" || char == "\"" || char == "`" {
            return !isInsideWord()
        }
        return true
    }

    /// Check if the cursor is inside a word (for smart quote handling).
    private func isInsideWord() -> Bool {
        let pos = selectedRange().location
        guard pos > 0, let textStorage = textStorage else { return false }

        let text = textStorage.string
        let index = text.index(text.startIndex, offsetBy: pos - 1, limitedBy: text.endIndex)

        if let index = index {
            let prevChar = text[index]
            if let scalar = prevChar.unicodeScalars.first {
                return wordChars.contains(scalar)
            }
        }
        return false
    }

    /// Insert a pair of delimiters with cursor between.
    private func insertPair(opening: Character, closing: Character) {
        let pos = selectedRange().location
        let pairString = String(opening) + String(closing)

        super.insertText(pairString, replacementRange: selectedRange())

        // Move cursor back between the pair
        setSelectedRange(NSRange(location: pos + 1, length: 0))
    }

    /// Wrap the selected text with delimiters.
    private func wrapSelection(opening: Character, closing: Character, range: NSRange) {
        guard let textStorage = textStorage else { return }

        let selectedText = (textStorage.string as NSString).substring(with: range)
        let wrappedText = String(opening) + selectedText + String(closing)

        // Replace selection with wrapped text
        if shouldChangeText(in: range, replacementString: wrappedText) {
            textStorage.replaceCharacters(in: range, with: wrappedText)
            didChangeText()

            // Select the wrapped content (excluding delimiters)
            setSelectedRange(NSRange(location: range.location + 1, length: selectedText.count))
        }
    }

    /// Check if we can skip over the closing character at cursor position.
    private func canSkipOver(char: Character) -> Bool {
        let pos = selectedRange().location
        guard let textStorage = textStorage else { return false }

        let text = textStorage.string
        guard pos < text.count else { return false }

        let index = text.index(text.startIndex, offsetBy: pos)
        return text[index] == char
    }

    /// Skip over the character at cursor position.
    private func skipOver() {
        let pos = selectedRange().location
        setSelectedRange(NSRange(location: pos + 1, length: 0))
    }

    /// Check if cursor is between an empty pair that should be deleted together.
    private func shouldDeletePair(at position: Int) -> Bool {
        guard let textStorage = textStorage else { return false }

        let text = textStorage.string
        guard position > 0 && position < text.count else { return false }

        let prevIndex = text.index(text.startIndex, offsetBy: position - 1)
        let nextIndex = text.index(text.startIndex, offsetBy: position)

        let prevChar = text[prevIndex]
        let nextChar = text[nextIndex]

        // Check if prevChar is an opening delimiter and nextChar is its closing pair
        if let expectedClosing = pairs[prevChar] {
            return nextChar == expectedClosing
        }

        return false
    }

    /// Delete both characters of an empty pair.
    private func deletePair(at position: Int) {
        guard let textStorage = textStorage else { return }

        let deleteRange = NSRange(location: position - 1, length: 2)
        if shouldChangeText(in: deleteRange, replacementString: "") {
            textStorage.replaceCharacters(in: deleteRange, with: "")
            didChangeText()
            setSelectedRange(NSRange(location: position - 1, length: 0))
        }
    }

    // MARK: - Tab Handling

    override func insertTab(_ sender: Any?) {
        // Insert spaces instead of tab
        let spaces = String(repeating: " ", count: AppConfig.tabWidth)
        super.insertText(spaces, replacementRange: selectedRange())
    }
}
