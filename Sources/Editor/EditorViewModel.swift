import SwiftUI
import Combine

/// Main view model for the editor.
/// Holds the authoritative text state and coordinates persistence.
@MainActor
final class EditorViewModel: ObservableObject {
    /// The current text content of the editor
    @Published var text: String = ""

    /// Whether spell checking is enabled
    @Published var spellCheckEnabled: Bool = true

    /// Whether to show the clear confirmation dialog
    @Published var showClearConfirmation: Bool = false

    /// Caret position for state restoration
    @Published var caretPosition: Int = 0

    /// Scroll offset for state restoration
    @Published var scrollOffset: CGFloat = 0

    /// Storage actors
    private let scratchpadStorage = ScratchpadStorage()
    private let stateStorage = StateStorage()

    /// Debounce task for autosave
    private var saveTask: Task<Void, Never>?

    /// Flag to track if content has been modified since last save
    private var isDirty: Bool = false

    init() {
        Task {
            await loadContent()
        }
    }

    /// Load content from storage
    private func loadContent() async {
        let content = await scratchpadStorage.load()
        self.text = content

        if let state = await stateStorage.load() {
            self.caretPosition = state.caretPosition
            self.scrollOffset = CGFloat(state.scrollOffset)
        }

        // Start observing changes after initial load
        observeTextChanges()
    }

    /// Set up observation for text changes to trigger autosave
    private func observeTextChanges() {
        // We'll call textDidChange from the view when text changes
    }

    /// Called when text changes - schedules a debounced save
    func textDidChange() {
        isDirty = true

        saveTask?.cancel()
        saveTask = Task {
            try? await Task.sleep(for: .milliseconds(AppConfig.autosaveDebounceMs))
            guard !Task.isCancelled else { return }
            await save()
        }
    }

    /// Save content to storage
    private func save() async {
        guard isDirty else { return }

        await scratchpadStorage.save(text)
        await stateStorage.save(EditorState(
            caretPosition: caretPosition,
            scrollOffset: Double(scrollOffset)
        ))

        isDirty = false
    }

    /// Force an immediate save (called on app background/quit)
    func forceSave() async {
        saveTask?.cancel()
        isDirty = true // Force save even if not dirty
        await save()
    }

    /// Clear the editor content (New Desk Pad)
    func clearContent() {
        text = ""
        caretPosition = 0
        scrollOffset = 0
        textDidChange()
    }
}
