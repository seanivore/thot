import AppKit

/// v1 implementation of SyntaxHighlightingEngine using regex-based pattern matching.
///
/// This engine:
/// - Prioritizes startup time and zero external dependencies
/// - Uses TextMate-compatible scope names for future migration compatibility
/// - Processes patterns in specificity order (fenced code first, etc.)
/// - Re-highlights the entire document on each change (acceptable for v1)
///
/// Future considerations:
/// - For large documents, consider incremental highlighting
/// - Could be swapped for TextMateHighlightingEngine or TreeSitterHighlightingEngine
final class RegexMarkdownHighlightingEngine: SyntaxHighlightingEngine {
    /// The TextMate rule set for mapping scopes to attributes
    private let ruleSet: TextMateRuleSet

    /// All patterns to match, in order
    private let patterns: [MarkdownPattern]

    /// Ranges that should be excluded from further highlighting (e.g., inside code blocks)
    private var excludedRanges: [NSRange] = []

    init() {
        self.ruleSet = TextMateRuleSet()
        self.patterns = MarkdownPatterns.all
    }

    /// For testing: inject custom rule set
    init(ruleSet: TextMateRuleSet) {
        self.ruleSet = ruleSet
        self.patterns = MarkdownPatterns.all
    }

    func styledRanges(for text: String) -> [StyledRange] {
        guard !text.isEmpty else { return [] }

        var results: [StyledRange] = []
        let fullRange = NSRange(location: 0, length: text.utf16.count)

        // Reset excluded ranges for this pass
        excludedRanges = []

        // Process each pattern in order
        for pattern in patterns {
            let matches = pattern.regex.matches(in: text, options: [], range: fullRange)

            for match in matches {
                let range: NSRange
                if pattern.captureGroup > 0 && pattern.captureGroup < match.numberOfRanges {
                    range = match.range(at: pattern.captureGroup)
                } else {
                    range = match.range
                }

                // Skip if this range is inside an excluded region
                guard range.location != NSNotFound && !isExcluded(range) else { continue }

                // Get attributes for this scope
                var attributes = ruleSet.attributes(for: pattern.scope)

                // Ensure we always have a font set
                if attributes[.font] == nil {
                    attributes[.font] = AppConfig.defaultFont
                }

                // Add to results
                results.append(StyledRange(
                    range: range,
                    scope: pattern.scope,
                    attributes: attributes
                ))

                // If this is a code block, exclude its content from further processing
                if pattern.scope.contains("fenced_code") || pattern.scope.contains("raw.block") {
                    excludedRanges.append(range)
                }
            }
        }

        return results
    }

    /// Check if a range overlaps with any excluded range.
    private func isExcluded(_ range: NSRange) -> Bool {
        for excluded in excludedRanges {
            // Check if ranges overlap
            let start = max(range.location, excluded.location)
            let end = min(range.location + range.length, excluded.location + excluded.length)
            if start < end {
                return true
            }
        }
        return false
    }
}
