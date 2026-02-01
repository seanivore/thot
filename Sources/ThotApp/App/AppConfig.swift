import AppKit

/// Central configuration for the Thot app.
/// Contains paths, fonts, colors, and other constants.
enum AppConfig {
    // MARK: - Paths

    /// Application Support directory for Thot
    static var applicationSupportDirectory: URL {
        FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            .appendingPathComponent("Thot", isDirectory: true)
    }

    /// Path to the scratchpad file
    static var scratchpadPath: URL {
        applicationSupportDirectory.appendingPathComponent("deskpad.md")
    }

    /// Path to the state file (caret position, scroll offset)
    static var statePath: URL {
        applicationSupportDirectory.appendingPathComponent("state.json")
    }

    // MARK: - Fonts

    /// Default font size
    static let fontSize: CGFloat = 12

    /// Default editor font - JetBrains Mono NL Regular, with system monospace fallback
    static var defaultFont: NSFont {
        NSFont(name: "JetBrainsMonoNL-Regular", size: fontSize)
            ?? NSFont.monospacedSystemFont(ofSize: fontSize, weight: .regular)
    }

    /// Bold font variant
    static var boldFont: NSFont {
        NSFont(name: "JetBrainsMonoNL-Bold", size: fontSize)
            ?? NSFont.monospacedSystemFont(ofSize: fontSize, weight: .bold)
    }

    /// Italic font variant
    static var italicFont: NSFont {
        NSFont(name: "JetBrainsMonoNL-Italic", size: fontSize)
            ?? NSFont(descriptor: defaultFont.fontDescriptor.withSymbolicTraits(.italic), size: fontSize)
            ?? defaultFont
    }

    /// Bold italic font variant
    static var boldItalicFont: NSFont {
        NSFont(name: "JetBrainsMonoNL-BoldItalic", size: fontSize)
            ?? NSFont(descriptor: boldFont.fontDescriptor.withSymbolicTraits(.italic), size: fontSize)
            ?? boldFont
    }

    // MARK: - Colors

    /// Editor background color - dark theme
    static let backgroundColor = NSColor(red: 0.11, green: 0.11, blue: 0.12, alpha: 1.0) // #1c1c1e

    /// Default text color - off-white
    static let foregroundColor = NSColor(red: 0.95, green: 0.95, blue: 0.95, alpha: 1.0) // #f2f2f2

    /// Insertion point (caret) color
    static let insertionPointColor = NSColor(red: 0.95, green: 0.95, blue: 0.95, alpha: 1.0)

    /// Selection color
    static let selectionColor = NSColor(red: 0.25, green: 0.25, blue: 0.28, alpha: 1.0)

    // MARK: - Editor Settings

    /// Line height multiplier for comfortable reading
    static let lineHeightMultiple: CGFloat = 1.3

    /// Autosave debounce interval in milliseconds
    static let autosaveDebounceMs: UInt64 = 500

    /// Highlighting debounce interval in milliseconds
    static let highlightDebounceMs: UInt64 = 100

    /// Tab width in spaces
    static let tabWidth = 2
}
