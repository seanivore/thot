import SwiftUI

/// Main editor view - wraps the AppKit-backed text view
struct EditorView: View {
    @EnvironmentObject var viewModel: EditorViewModel

    var body: some View {
        MarkdownTextView(
            text: $viewModel.text,
            caretPosition: $viewModel.caretPosition,
            scrollOffset: $viewModel.scrollOffset,
            spellCheckEnabled: viewModel.spellCheckEnabled,
            onTextChange: {
                viewModel.textDidChange()
            }
        )
        .background(Color(nsColor: AppConfig.backgroundColor))
        .alert("Clear Desk Pad?", isPresented: $viewModel.showClearConfirmation) {
            Button("Cancel", role: .cancel) { }
            Button("Clear", role: .destructive) {
                viewModel.clearContent()
            }
        } message: {
            Text("This will clear all content from your desk pad. This action cannot be undone.")
        }
    }
}

#Preview {
    EditorView()
        .environmentObject(EditorViewModel())
        .frame(width: 800, height: 600)
}
