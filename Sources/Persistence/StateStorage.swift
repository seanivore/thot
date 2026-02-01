import Foundation

/// Editor state for persistence (caret position, scroll offset)
struct EditorState: Codable {
    var caretPosition: Int
    var scrollOffset: Double
    var updatedAt: Date

    init(caretPosition: Int, scrollOffset: Double) {
        self.caretPosition = caretPosition
        self.scrollOffset = scrollOffset
        self.updatedAt = Date()
    }
}

/// Actor responsible for reading and writing the editor state file.
actor StateStorage {
    private let fileManager = FileManager.default
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    init() {
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        decoder.dateDecodingStrategy = .iso8601
    }

    /// Load the editor state from disk.
    /// Returns nil if the file doesn't exist or can't be parsed.
    func load() -> EditorState? {
        let path = AppConfig.statePath

        guard fileManager.fileExists(atPath: path.path) else {
            return nil
        }

        do {
            let data = try Data(contentsOf: path)
            let state = try decoder.decode(EditorState.self, from: data)
            return state
        } catch {
            print("Error loading state: \(error)")
            return nil
        }
    }

    /// Save the editor state to disk.
    func save(_ state: EditorState) {
        let path = AppConfig.statePath

        // Ensure the directory exists
        ensureDirectoryExists()

        do {
            let data = try encoder.encode(state)
            try data.write(to: path, options: .atomic)
        } catch {
            print("Error saving state: \(error)")
        }
    }

    /// Ensure the Application Support/Thot directory exists
    private func ensureDirectoryExists() {
        let directory = AppConfig.applicationSupportDirectory

        if !fileManager.fileExists(atPath: directory.path) {
            do {
                try fileManager.createDirectory(at: directory, withIntermediateDirectories: true)
            } catch {
                print("Error creating directory: \(error)")
            }
        }
    }
}
