import AppKit

/// A single TextMate rule mapping scopes to style settings.
struct TextMateRule: Codable {
    let name: String?
    let scope: ScopeValue
    let settings: TextMateSettings

    enum ScopeValue: Codable {
        case single(String)
        case multiple([String])

        init(from decoder: Decoder) throws {
            let container = try decoder.singleValueContainer()
            if let single = try? container.decode(String.self) {
                self = .single(single)
            } else if let multiple = try? container.decode([String].self) {
                self = .multiple(multiple)
            } else {
                throw DecodingError.typeMismatch(
                    ScopeValue.self,
                    DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Expected String or [String]")
                )
            }
        }

        func encode(to encoder: Encoder) throws {
            var container = encoder.singleValueContainer()
            switch self {
            case .single(let s):
                try container.encode(s)
            case .multiple(let arr):
                try container.encode(arr)
            }
        }

        var scopes: [String] {
            switch self {
            case .single(let s): return [s]
            case .multiple(let arr): return arr
            }
        }
    }
}

/// Style settings from a TextMate rule.
struct TextMateSettings: Codable {
    let foreground: String?
    let background: String?
    let fontStyle: String?
}

/// Loads and manages TextMate theme rules, providing attribute lookups by scope.
final class TextMateRuleSet {
    /// All rules loaded from the theme JSON
    private let rules: [TextMateRule]

    /// Cache of scope -> attributes for fast lookup
    private var attributeCache: [String: [NSAttributedString.Key: Any]] = [:]

    /// Initialize with rules loaded from the bundle.
    init() {
        self.rules = TextMateRuleSet.loadRulesFromBundle()
    }

    /// Initialize with custom rules (for testing).
    init(rules: [TextMateRule]) {
        self.rules = rules
    }

    /// Get attributes for a given TextMate scope.
    ///
    /// - Parameter scope: The TextMate scope name (e.g., "markup.heading")
    /// - Returns: Dictionary of NSAttributedString attributes
    func attributes(for scope: String) -> [NSAttributedString.Key: Any] {
        // Check cache first
        if let cached = attributeCache[scope] {
            return cached
        }

        // Find matching rule
        var attrs: [NSAttributedString.Key: Any] = [:]

        for rule in rules {
            if rule.scope.scopes.contains(where: { scopeMatches($0, target: scope) }) {
                // Apply settings
                if let fg = rule.settings.foreground, let color = NSColor(hex: fg) {
                    attrs[.foregroundColor] = color
                }
                if let bg = rule.settings.background, let color = NSColor(hex: bg) {
                    attrs[.backgroundColor] = color
                }
                if let fontStyle = rule.settings.fontStyle {
                    attrs[.font] = fontForStyle(fontStyle)
                }
                break // First match wins
            }
        }

        // Cache the result
        attributeCache[scope] = attrs
        return attrs
    }

    /// Check if a rule scope matches a target scope.
    /// Supports partial matching (e.g., "markup" matches "markup.heading")
    private func scopeMatches(_ ruleScope: String, target: String) -> Bool {
        return target == ruleScope || target.hasPrefix(ruleScope + ".")
    }

    /// Get the appropriate font for a fontStyle string.
    private func fontForStyle(_ style: String) -> NSFont {
        let styles = style.lowercased().split(separator: " ").map(String.init)
        let isBold = styles.contains("bold")
        let isItalic = styles.contains("italic")

        if isBold && isItalic {
            return AppConfig.boldItalicFont
        } else if isBold {
            return AppConfig.boldFont
        } else if isItalic {
            return AppConfig.italicFont
        } else {
            return AppConfig.defaultFont
        }
    }

    /// Load rules from the bundled ThotMarkdownTheme.json file.
    private static func loadRulesFromBundle() -> [TextMateRule] {
        guard let url = Bundle.main.url(forResource: "ThotMarkdownTheme", withExtension: "json"),
              let data = try? Data(contentsOf: url) else {
            print("Warning: Could not load ThotMarkdownTheme.json from bundle")
            return []
        }

        do {
            let rules = try JSONDecoder().decode([TextMateRule].self, from: data)
            return rules
        } catch {
            print("Warning: Could not parse ThotMarkdownTheme.json: \(error)")
            return []
        }
    }
}

// MARK: - NSColor Hex Extension

extension NSColor {
    /// Initialize NSColor from a hex string (e.g., "#FF9D00" or "FF9D00")
    convenience init?(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

        var rgb: UInt64 = 0
        guard Scanner(string: hexSanitized).scanHexInt64(&rgb) else { return nil }

        let length = hexSanitized.count
        let r, g, b, a: CGFloat

        switch length {
        case 6: // RGB
            r = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
            g = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
            b = CGFloat(rgb & 0x0000FF) / 255.0
            a = 1.0
        case 8: // RGBA
            r = CGFloat((rgb & 0xFF000000) >> 24) / 255.0
            g = CGFloat((rgb & 0x00FF0000) >> 16) / 255.0
            b = CGFloat((rgb & 0x0000FF00) >> 8) / 255.0
            a = CGFloat(rgb & 0x000000FF) / 255.0
        default:
            return nil
        }

        self.init(red: r, green: g, blue: b, alpha: a)
    }
}
