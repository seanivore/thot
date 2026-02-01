import SwiftUI

/// Preferences window view (stub for v1).
///
/// This view lives behind the macOS "Preferences..." menu.
/// For v1.0.0_deskpad, this is a simple "coming soon" placeholder.
struct PreferencesView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "gearshape")
                .font(.system(size: 48))
                .foregroundColor(.secondary)

            Text("Preferences")
                .font(.title)

            Text("Customization options coming in a future release.")
                .foregroundColor(.secondary)

            Text("For now, Thot uses system defaults for spelling and text behavior.")
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(width: 400, height: 250)
        .padding()
    }
}

#Preview {
    PreferencesView()
}
