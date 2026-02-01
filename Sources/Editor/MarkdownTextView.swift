import SwiftUI
import AppKit

/// NSViewRepresentable wrapper for NSTextView with markdown highlighting and paired delimiters.
struct MarkdownTextView: NSViewRepresentable {
    @Binding var text: String
    @Binding var caretPosition: Int
    @Binding var scrollOffset: CGFloat
    var spellCheckEnabled: Bool
    var onTextChange: () -> Void

    func makeNSView(context: Context) -> NSScrollView {
        let scrollView = NSScrollView()
        scrollView.hasVerticalScroller = true
        scrollView.hasHorizontalScroller = false
        scrollView.autohidesScrollers = true
        scrollView.borderType = .noBorder
        scrollView.drawsBackground = true
        scrollView.backgroundColor = AppConfig.backgroundColor

        let textView = PairedDelimiterTextView()
        textView.delegate = context.coordinator
        textView.allowsUndo = true
        textView.isRichText = false
        textView.usesFindPanel = true
        textView.usesFindBar = true
        textView.isIncrementalSearchingEnabled = true

        // Disable smart features
        textView.isAutomaticQuoteSubstitutionEnabled = false
        textView.isAutomaticDashSubstitutionEnabled = false
        textView.isAutomaticTextReplacementEnabled = false
        textView.isAutomaticSpellingCorrectionEnabled = false
        textView.isAutomaticLinkDetectionEnabled = false
        textView.isAutomaticDataDetectionEnabled = false

        // Spell checking
        textView.isContinuousSpellCheckingEnabled = spellCheckEnabled
        textView.isGrammarCheckingEnabled = false

        // Appearance
        textView.font = AppConfig.defaultFont
        textView.textColor = AppConfig.foregroundColor
        textView.backgroundColor = AppConfig.backgroundColor
        textView.insertionPointColor = AppConfig.insertionPointColor

        // Text container setup
        textView.textContainer?.widthTracksTextView = true
        textView.textContainer?.containerSize = NSSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude)
        textView.isHorizontallyResizable = false
        textView.isVerticallyResizable = true
        textView.autoresizingMask = [.width]

        // Allow selection colors
        textView.selectedTextAttributes = [
            .backgroundColor: AppConfig.selectionColor,
            .foregroundColor: AppConfig.foregroundColor
        ]

        // Set up scroll view
        scrollView.documentView = textView

        // Set initial text
        textView.string = text

        // Store references in coordinator
        context.coordinator.textView = textView
        context.coordinator.scrollView = scrollView

        // Apply initial highlighting
        context.coordinator.scheduleHighlighting()

        // Restore caret position after a brief delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            if caretPosition > 0 && caretPosition <= textView.string.count {
                textView.setSelectedRange(NSRange(location: caretPosition, length: 0))
            }
            textView.window?.makeFirstResponder(textView)
        }

        return scrollView
    }

    func updateNSView(_ scrollView: NSScrollView, context: Context) {
        guard let textView = scrollView.documentView as? NSTextView else { return }

        // Update spell checking if changed
        if textView.isContinuousSpellCheckingEnabled != spellCheckEnabled {
            textView.isContinuousSpellCheckingEnabled = spellCheckEnabled
        }

        // Only update text if it differs (avoid cursor jumping)
        if textView.string != text {
            let selectedRange = textView.selectedRange()
            textView.string = text
            // Try to restore selection
            if selectedRange.location <= text.count {
                textView.setSelectedRange(NSRange(location: min(selectedRange.location, text.count), length: 0))
            }
            context.coordinator.scheduleHighlighting()
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, NSTextViewDelegate {
        var parent: MarkdownTextView
        weak var textView: NSTextView?
        weak var scrollView: NSScrollView?

        private var highlightTask: Task<Void, Never>?
        private let highlightingEngine: SyntaxHighlightingEngine

        init(_ parent: MarkdownTextView) {
            self.parent = parent
            self.highlightingEngine = RegexMarkdownHighlightingEngine()
            super.init()
        }

        func textDidChange(_ notification: Notification) {
            guard let textView = notification.object as? NSTextView else { return }

            // Update binding
            let newText = textView.string
            if parent.text != newText {
                parent.text = newText
                parent.onTextChange()
            }

            // Update caret position
            parent.caretPosition = textView.selectedRange().location

            // Schedule highlighting
            scheduleHighlighting()
        }

        func textViewDidChangeSelection(_ notification: Notification) {
            guard let textView = notification.object as? NSTextView else { return }
            parent.caretPosition = textView.selectedRange().location
        }

        func scheduleHighlighting() {
            highlightTask?.cancel()
            highlightTask = Task { @MainActor in
                try? await Task.sleep(for: .milliseconds(AppConfig.highlightDebounceMs))
                guard !Task.isCancelled else { return }
                applyHighlighting()
            }
        }

        @MainActor
        private func applyHighlighting() {
            guard let textView = textView,
                  let textStorage = textView.textStorage else { return }

            let text = textView.string
            guard !text.isEmpty else { return }

            let fullRange = NSRange(location: 0, length: text.utf16.count)

            // Begin editing
            textStorage.beginEditing()

            // Reset to default attributes
            textStorage.setAttributes([
                .font: AppConfig.defaultFont,
                .foregroundColor: AppConfig.foregroundColor
            ], range: fullRange)

            // Get styled ranges from the highlighting engine
            let styledRanges = highlightingEngine.styledRanges(for: text)

            // Apply each styled range
            for styledRange in styledRanges {
                guard styledRange.range.location + styledRange.range.length <= text.utf16.count else { continue }
                textStorage.addAttributes(styledRange.attributes, range: styledRange.range)
            }

            // End editing
            textStorage.endEditing()
        }
    }
}
