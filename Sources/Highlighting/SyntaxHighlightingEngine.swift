import AppKit

/// A styled range with its TextMate-compatible scope name.
/// Used by highlighting engines to communicate styling decisions.
struct StyledRange {
    /// The range in the text (UTF-16 based, for NSRange compatibility)
    let range: NSRange

    /// TextMate-compatible scope name (e.g., "markup.heading", "markup.bold")
    let scope: String

    /// Pre-computed attributes to apply to NSTextStorage
    let attributes: [NSAttributedString.Key: Any]
}

/// Protocol for swappable syntax highlighting engines.
///
/// The highlighting system is designed with a protocol abstraction to allow
/// future engine swaps without changing the editor integration:
///
/// - v1: `RegexMarkdownHighlightingEngine` - Custom regex-based tokenizer
/// - Future: `TextMateHighlightingEngine` - Full TextMate grammar parsing
/// - Future: `TreeSitterHighlightingEngine` - Fast incremental parsing
///
/// All implementations must be stateless: given text, return styled ranges.
protocol SyntaxHighlightingEngine {
    /// Analyze text and return styled ranges.
    ///
    /// - Parameter text: The full document text to highlight
    /// - Returns: Array of styled ranges, potentially overlapping (later ranges take precedence)
    func styledRanges(for text: String) -> [StyledRange]
}
