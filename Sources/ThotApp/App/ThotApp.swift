import SwiftUI

@main
struct ThotApp: App {
    @StateObject private var viewModel = EditorViewModel()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup("Thot") {
            EditorView()
                .environmentObject(viewModel)
                .frame(minWidth: 400, minHeight: 300)
        }
        .windowStyle(.automatic)
        .windowToolbarStyle(.unified(showsTitle: true))
        .defaultSize(width: 800, height: 600)
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase == .background || newPhase == .inactive {
                Task {
                    await viewModel.forceSave()
                }
            }
        }
        .commands {
            // File menu
            CommandGroup(replacing: .newItem) {
                Button("New Desk Pad") {
                    viewModel.showClearConfirmation = true
                }
                .keyboardShortcut("n", modifiers: .command)
            }

            // View menu - spellcheck toggle
            CommandGroup(after: .toolbar) {
                Toggle("Check Spelling While Typing", isOn: $viewModel.spellCheckEnabled)
                    .keyboardShortcut(":", modifiers: [.command, .shift])
            }
        }

        #if os(macOS)
        Settings {
            PreferencesView()
        }
        #endif
    }
}
