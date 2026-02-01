import Foundation

/// Actor responsible for reading and writing the scratchpad file.
/// Uses atomic writes to prevent data loss.
actor ScratchpadStorage {
    private let fileManager = FileManager.default

    /// Load the scratchpad content from disk.
    /// Returns an empty string if the file doesn't exist.
    func load() -> String {
        let path = AppConfig.scratchpadPath

        // Ensure the directory exists
        ensureDirectoryExists()

        // If file doesn't exist, return empty string
        guard fileManager.fileExists(atPath: path.path) else {
            return ""
        }

        do {
            let content = try String(contentsOf: path, encoding: .utf8)
            return content
        } catch {
            print("Error loading scratchpad: \(error)")
            return ""
        }
    }

    /// Save the scratchpad content to disk.
    /// Uses atomic write for safety.
    func save(_ content: String) {
        let path = AppConfig.scratchpadPath

        // Ensure the directory exists
        ensureDirectoryExists()

        do {
            try content.write(to: path, atomically: true, encoding: .utf8)
        } catch {
            print("Error saving scratchpad: \(error)")
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
