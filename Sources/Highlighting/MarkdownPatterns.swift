import Foundation

/// A markdown pattern with its regex and TextMate scope.
struct MarkdownPattern {
    /// The regex pattern to match
    let regex: NSRegularExpression

    /// The TextMate-compatible scope name
    let scope: String

    /// Optional: capture group to style (0 = entire match, 1+ = specific group)
    let captureGroup: Int

    init(_ pattern: String, scope: String, captureGroup: Int = 0, options: NSRegularExpression.Options = []) {
        do {
            self.regex = try NSRegularExpression(pattern: pattern, options: options)
        } catch {
            fatalError("Invalid regex pattern for scope \(scope): \(error)")
        }
        self.scope = scope
        self.captureGroup = captureGroup
    }
}

/// All markdown patterns in order of specificity (most specific first).
/// This ordering prevents conflicts (e.g., bold patterns won't match inside code blocks).
enum MarkdownPatterns {
    /// All patterns in processing order
    static let all: [MarkdownPattern] = [
        // FENCED CODE BLOCKS (```...```) - must be first to prevent inner content matching
        // Match the entire block including delimiters
        MarkdownPattern(
            "^```[\\s\\S]*?^```",
            scope: "markup.fenced_code.block.markdown",
            options: [.anchorsMatchLines]
        ),

        // HORIZONTAL RULES (---, ***, ___)
        MarkdownPattern(
            "^[ ]{0,3}([-*_])\\1{2,}[ ]*$",
            scope: "meta.separator.markdown",
            options: [.anchorsMatchLines]
        ),

        // HEADINGS (# through ######)
        MarkdownPattern(
            "^#{1,6}[ \\t]+.+$",
            scope: "markup.heading",
            options: [.anchorsMatchLines]
        ),

        // BLOCKQUOTES (> ...)
        MarkdownPattern(
            "^>[ ]?.+$",
            scope: "markup.quote.markdown",
            options: [.anchorsMatchLines]
        ),

        // TASK LIST CHECKBOXES (- [ ] or - [x])
        MarkdownPattern(
            "^[ ]*[-*+][ ]+\\[([ xX])\\]",
            scope: "markup.checkbox.markdown",
            options: [.anchorsMatchLines]
        ),

        // UNORDERED LIST MARKERS (-, *, +)
        MarkdownPattern(
            "^[ ]*[-*+][ ]+",
            scope: "punctuation.definition.list.begin.markdown",
            options: [.anchorsMatchLines]
        ),

        // ORDERED LIST MARKERS (1., 2., etc.)
        MarkdownPattern(
            "^[ ]*\\d+\\.[ ]+",
            scope: "punctuation.definition.list.number.markdown",
            options: [.anchorsMatchLines]
        ),

        // BOLD (**text** or __text__)
        MarkdownPattern(
            "(\\*\\*|__)(?=\\S)(.+?)(?<=\\S)\\1",
            scope: "markup.bold"
        ),

        // ITALIC (*text* or _text_) - more careful to not match inside words
        MarkdownPattern(
            "(?<![\\w*_])(\\*|_)(?=\\S)(.+?)(?<=\\S)\\1(?![\\w*_])",
            scope: "markup.italic"
        ),

        // STRIKETHROUGH (~~text~~)
        MarkdownPattern(
            "~~(?=\\S)(.+?)(?<=\\S)~~",
            scope: "markup.strikethrough"
        ),

        // INLINE CODE (`code`)
        MarkdownPattern(
            "`[^`\\n]+`",
            scope: "markup.inline.raw"
        ),

        // IMAGES ![alt](url)
        MarkdownPattern(
            "!\\[([^\\]]*)\\]\\(([^)]+)\\)",
            scope: "meta.image.inline.markdown"
        ),

        // LINKS [text](url)
        MarkdownPattern(
            "\\[([^\\]]*)\\]\\(([^)]+)\\)",
            scope: "markup.link"
        ),

        // REFERENCE LINKS [text][ref]
        MarkdownPattern(
            "\\[([^\\]]*)\\]\\[([^\\]]*)\\]",
            scope: "constant.other.reference.link.markdown"
        ),

        // LINK DEFINITIONS [ref]: url
        MarkdownPattern(
            "^\\[([^\\]]+)\\]:[ \\t]+(.+)$",
            scope: "meta.link.reference.def.markdown",
            options: [.anchorsMatchLines]
        ),

        // HTML COMMENTS (<!-- ... -->)
        MarkdownPattern(
            "<!--[\\s\\S]*?-->",
            scope: "comment.block.html"
        ),

        // FOOTNOTES [^1]
        MarkdownPattern(
            "\\[\\^[^\\]]+\\]",
            scope: "constant.other.reference.footnote.markdown"
        ),

        // TABLE SEPARATORS (|---|---|)
        MarkdownPattern(
            "^\\|?[ ]*:?-+:?[ ]*(\\|[ ]*:?-+:?[ ]*)+\\|?$",
            scope: "markup.table",
            options: [.anchorsMatchLines]
        ),

        // TABLE PIPES
        MarkdownPattern(
            "\\|",
            scope: "punctuation.definition.table.markdown"
        ),

        // ESCAPE CHARACTERS (\* \[ etc.)
        MarkdownPattern(
            "\\\\[\\\\`*_{}\\[\\]()#+\\-.!]",
            scope: "constant.character.escape.markdown"
        ),
    ]
}
