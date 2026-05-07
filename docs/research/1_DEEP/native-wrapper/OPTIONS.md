# Native Wrapper Options for Thot (Apple Platforms)

**Created**: 2026-05-06
**Version**: v1.0
**Status**: Research Phase — Phase 1 (`1_DEEP/`)
**Bucket**: `native-wrapper/`
**Research note on sourcing**: Live web fetch and search were unavailable in the session that produced this draft. Findings synthesize from agent training knowledge (cutoff January 2026) plus the project's own prior research notes (`docs/archive/v4_0/v4_0_0_CLARITY.md`). Claims that depend on shipped-version specifics — plugin versions, exact entitlement availability, PWABuilder iOS template state — are flagged inline as **[VERIFY]** and listed in *Open Research Items*. Phase 2 should re-fetch the cited docs and confirm before any architecture decision.

---

## 1. Frame

Thot is a Vite + TypeScript + CodeMirror 6 markdown PWA, deployed at `thots.august.style`, persisting to `localStorage` (`thot:content:<id>`, `thot:state:<id>`). The PWA is the canonical product. Native wrappers are bonus distribution, but the product wants real native capability — not just a chrome around the website.

Wants the wrapper must satisfy somewhere on the spectrum (hard requirement → nice-to-have):

- **macOS** — full feature parity with PWA (essentially: a windowed wrapper)
- **iOS / iPadOS — Live Activities + Dynamic Island** (tap-to-jot, geo-tagged metadata)
- **iPadOS — Apple Pencil annotation mode** (red ink overlay on docs, handwriting → text via OCR)
- **WatchOS — voice-to-text dictation** (Whisper-style transcription, syncs back to phone)
- **Lock-screen widgets** (post-it style note previews)
- **App Intents / Shortcuts integration** (Siri "add to my Thot", "read my last note")

The two questions that pre-empt the wrapper choice:

> **Q1.** Does WatchOS realistically work via PWA wrapper at all?
> **Q2.** Does Apple Pencil work well enough through `WKWebView` events, or does it need native rendering?

Both answers turn out to push the architecture toward a **hybrid model** rather than a pure wrapper. Section 7 settles them.

---

## 2. The Candidate Set

Five options realistically worth evaluating in 2026:

1. **Capacitor (Ionic)** — the industry default for "PWA in a native shell" with a JS bridge to native plugins.
2. **PWABuilder (Microsoft)** — Microsoft-published generator that produces a Swift/Xcode iOS shell from a PWA URL. Lower ceiling than Capacitor but lower-friction.
3. **Custom WKWebView shell (SwiftUI/UIKit + Swift)** — write the host app yourself; full native API access; most code.
4. **Tauri 2.0 Mobile (Rust)** — Tauri reached stable 2.0 with mobile (iOS/Android) in late 2024. Newer, smaller plugin ecosystem, but real iOS support exists. **[VERIFY current state]**
5. **Hybrid: Capacitor (or custom shell) for iPhone/iPad/Mac + native SwiftUI for WatchOS + native PencilKit overlay** — not a single tool but a pattern. The realistic shipping shape, as Section 7 argues.

Out of scope for serious consideration in 2026:

- **Cordova** — superseded by Capacitor; the Ionic team itself directs new projects to Capacitor.
- **React Native / Flutter** — these are app frameworks, not PWA wrappers. Adopting them means rewriting Thot, which contradicts "PWA is single source of truth."
- **Trusted Web Activity (TWA)** — Android-only (Chrome Custom Tab spec). Not applicable to Apple platforms.

---

## 3. Capability Matrix

What each option can plausibly deliver for Thot's want list.

| Want                                   | Capacitor                      | PWABuilder iOS                                             | Custom WKWebView                     | Tauri 2.0 Mobile           |
| -------------------------------------- | ------------------------------ | ---------------------------------------------------------- | ------------------------------------ | -------------------------- |
| macOS shell (parity with PWA)          | Yes (Mac Catalyst)             | Limited (iPad-on-Mac path)                                 | Yes (AppKit or Catalyst)             | Yes (native, mature)       |
| iOS / iPadOS shell                     | Yes (mature)                   | Yes (auto-generated)                                       | Yes                                  | Yes (newer)                |
| Live Activities                        | Via custom plugin              | No (out of the box)                                        | Yes (direct ActivityKit)             | Custom plugin **[VERIFY]** |
| Dynamic Island                         | Via custom plugin              | No                                                         | Yes (ActivityKit, same as Live Acts) | Custom plugin **[VERIFY]** |
| App Intents / Shortcuts                | Via custom plugin              | No (community only)                                        | Yes                                  | Custom plugin **[VERIFY]** |
| Lock-screen / Home widgets (WidgetKit) | Via custom plugin **[VERIFY]** | No                                                         | Yes                                  | Custom plugin **[VERIFY]** |
| Apple Pencil (annotation overlay)      | Hybrid: native overlay         | No                                                         | Hybrid: native overlay               | Hybrid: native overlay     |
| WatchOS app                            | **No** (companion only)        | No                                                         | Companion native target              | **No**                     |
| Siri / dictation in WatchOS            | n/a                            | n/a                                                        | Yes (native Watch app)               | n/a                        |
| Live PWA reload (no rebuild required)  | Yes (Live Updates / Capgo)     | Yes (loads remote URL)                                     | Yes (load remote URL)                | Yes (config option)        |
| App Store review friction              | Low (well-trodden)             | Higher (apps that are "just a website" risk 4.2 rejection) | Lowest (acts like native app)        | Newer; **[VERIFY]**        |
| Maintenance burden (code volume)       | Low                            | Lowest                                                     | Highest                              | Medium                     |

**Key reading of the matrix:** No option ships Live Activities, Dynamic Island, App Intents, or WidgetKit "for free." Every wrapper requires a native-Swift plugin (or app extension target) to expose those frameworks to the web layer — because all four are *app extensions* that compile separately and run outside the WKWebView process. The wrapper choice doesn't determine *whether* you write Swift; it determines *how much* Swift glue you write and what shape the bridge takes.

---

## 4. Per-Option Analysis

### 4.1 Capacitor (Ionic)

A native runtime + JS-to-Swift bridge maintained by the Ionic team. Generates an Xcode project that hosts a `WKWebView`, loads either a bundled `dist/` build or a remote URL, and exposes a plugin API for calling Swift from JavaScript. The de facto standard "wrap a web app for iOS" tool in 2026.

**Drop-in workflow.** `npm i @capacitor/core @capacitor/cli @capacitor/ios` → `npx cap init` → `npx cap add ios` (generates Xcode project) → `npm run build && npx cap sync ios`. For live PWA updates: point `server.url` at `https://thots.august.style` (loads remote site, no rebuild) or use Capacitor Live Updates / open-source Capgo for OTA web-bundle deltas.

**Native API access.** Many official plugins (Camera, Filesystem, Geolocation, Haptics, Push, Share, Status Bar). The four frameworks Thot actually wants are *not* in the official set:

- **ActivityKit (Live Activities, Dynamic Island)** — no first-party plugin as of late 2025; community plugins are thin. **[VERIFY]**
- **App Intents** — a compile-time Xcode-target `AppIntent` struct, Siri/Spotlight-discoverable. Can be added to the Capacitor iOS target directly; the intent then calls the Capacitor bridge or deep-links the app.
- **WidgetKit** — separate SwiftUI app extension target reading from a shared App Group container. The web layer writes via a thin Capacitor plugin; the widget reads natively.
- **WatchOS** — not supported. Watch app is a separate Xcode target talking to the iPhone app via `WatchConnectivity` (see §7.1).

**App Store friction.** Low. Capacitor apps with at least one genuinely-native capability (push, share, widget, Live Activity) clear guideline 4.2 ("Minimum Functionality") consistently. Thot's planned scope is well past the bar.

**Maintenance.** Low for the wrapper plumbing; Swift plugin code for LAs/Widgets/App Intents is the same code you'd write under any host.

**Verdict.** Right default for iPhone/iPad/Mac (Catalyst). The bridge gives you a clean place to put the Swift you'll be writing anyway.

### 4.2 PWABuilder (Microsoft)

A Microsoft generator (web tool at `pwabuilder.com`) that takes a PWA URL and produces platform packages: Microsoft Store (MSIX), Play (TWA), and an iOS Xcode project template. The iOS template loads the manifest URL in a WKWebView with permissions wired up for camera/geolocation/notifications. The iOS path is community-maintained; **[VERIFY]** whether it's actively supported, in maintenance mode, or abandoned in 2026.

**Drop-in workflow.** Submit the URL, download generated Xcode project, sign, ship. Updates auto-pickup because the shell loads remote.

**Native API access.** Bare. Live Activities, App Intents, widgets, Pencil — none wired up. Editing the template to add them means forking it, at which point Capacitor's plugin model is a better abstraction.

**App Store friction.** Higher. A PWABuilder iOS app is structurally "load this website in a WKWebView" — exactly the 4.2 silhouette. Apps ship, but rejection risk is non-trivial without genuinely-native additions. **[VERIFY rejection trends]**

**Maintenance.** Lowest *if* the bare template suffices. Going beyond it is harder than Capacitor.

**Verdict.** Fine for "ship a PWA on iOS in a weekend." Bad fit for Thot's feature scope; outgrown the moment you want any serious native feature.

### 4.3 Custom WKWebView Shell (SwiftUI / UIKit + Swift)

Write the host yourself: a SwiftUI iOS app containing a `WKWebView`, brokering JS↔Swift through `WKScriptMessageHandler` and `evaluateJavaScript`.

**Native API access.** Total. Every Apple SDK is one `import` away. **App Store friction.** Same as Capacitor — reviewers don't see "Capacitor" as a label. **Maintenance.** Highest. You're writing the bridge, lifecycle hooks, `URLSchemeHandler` for offline assets, message-passing protocol — all of which Capacitor packages. For a one-developer project, that's real cost per feature.

**Verdict.** Right for Thot's *non-iPhone* surfaces — the WatchOS app and the iPadOS Pencil overlay — both of which sit outside any wrapper anyway. Wrong for the main iPhone/iPad shell.

### 4.4 Tauri 2.0 Mobile

Rust-based shell, traditionally praised for small binaries (uses OS web view, not bundled Chromium). Tauri 2.0 (stable late 2024) added iOS and Android. **[VERIFY 2026 maturity]**

**Workflow.** `cargo install tauri-cli` → `tauri init` → `tauri ios init` → `tauri ios dev`. Plugins are Rust + Swift glue via SPM.

**Native API access.** Smaller plugin ecosystem than Capacitor; iOS plugins are still expanding. **[VERIFY]** Live Activities, App Intents, WidgetKit — all need bespoke plugins.

**App Store friction.** No structural reason to be worse than Capacitor — still a WKWebView host. Smaller install base means less reviewer familiarity; modest early-adopter risk.

**Maintenance.** Medium. Rust is an asset for performance, a liability for project velocity if you're not comfortable in it. The plugin gap is the bigger cost.

**Verdict.** Track for the desktop story, where Tauri excels. Not the iOS choice in 2026 unless there's a strong Rust preference; marginal gains don't pay back marginal costs vs. Capacitor.

### 4.5 Hybrid (the realistic shipping shape)

A pure "one wrapper does everything" framing is wrong because three Thot wants — WatchOS, Apple Pencil annotation, and widget/extension targets — are *inherently native* and live outside the web layer regardless of host.

Realistic stack:

- **iPhone / iPad / Mac (Catalyst)**: Capacitor shell. Custom Capacitor plugin for ActivityKit. App Intents declared in iOS target. Widget extension reads from shared App Group; web layer writes to it via a thin plugin.
- **iPadOS Pencil annotation**: native PencilKit overlay above the WKWebView in the Capacitor shell. `PKDrawing` strokes, optional Vision OCR, results pushed back to web layer.
- **WatchOS**: separate SwiftUI Watch target. `WatchConnectivity` to phone; `SFSpeechRecognizer` for transcription (Apple's on-device model has improved meaningfully through 2024–2025).
- **macOS**: Mac Catalyst build of the Capacitor app. (Tauri or AppKit only if the desktop UX diverges far enough to justify a second codebase. Default: don't.)

This is "Capacitor for the web host, native Swift for the truly-native bits" — and it's the shape Apple's frameworks already enforce: ActivityKit, WidgetKit, App Intents, and WatchOS are separate compilation units regardless of wrapper.

---

## 5. Drop-in Workflow Comparison ("ship a PWA update → native picks it up")

| Strategy                                     | "Ship an update" workflow                               | Re-submit?                |
| -------------------------------------------- | ------------------------------------------------------- | ------------------------- |
| Capacitor, bundled dist                      | `npm run build && npx cap sync ios && Archive → upload` | Yes, every time           |
| Capacitor, remote URL (`server.url`)         | Push to Vercel; shell auto-loads on next launch         | No (until native changes) |
| Capacitor + Live Updates / Capgo             | Push web bundle via OTA service                         | No                        |
| PWABuilder, Custom WKWebView, Tauri (remote) | Push to Vercel                                          | No                        |
| Custom WKWebView (bundled offline)           | Rebuild + Archive + upload                              | Yes                       |

Apple's guideline 3.3.2 historically restricted dynamically-loaded *executable* code; the HTML/JS/CSS-in-WKWebView carve-out is well-established and many shipping Capacitor apps load remote content. **[VERIFY 2026 wording]**

**For Thot:** point Capacitor's `server.url` at `https://thots.august.style`. Re-submit the binary only when native plugins change. The App Store binary becomes a thin shell over the same website you already control — literal "PWA is canonical."

Caveat: pure remote-URL apps lose offline unless the WKWebView's Service Worker survives across cold starts. Service Workers run inside WKWebView since iOS 14, but lifecycle inside a native host is finicky. **[VERIFY]** If "open instantly on a plane" is mandatory, bundle a `dist/` snapshot as the offline fallback and use `server.url` only when network is up — Capacitor supports the pattern.

---

## 6. App Store Review Friction (summary)

Guideline 4.2 (Minimum Functionality): "elevate beyond a repackaged website." Industry pattern (2024–2025):

- Any genuinely-native capability beyond the WebView (push, share, widget, App Intent, Live Activity) clears 4.2.
- A pure "load this URL" wrapper is at meaningful risk; reviewer-mood variance is real.

All four options can ship if the binary carries at least one native feature. PWABuilder's bare template is most exposed; the rest are protected by the App Intents / widget / Live Activity work Thot wants anyway.

---

## 7. The Two Pinned Questions

### 7.1 Does WatchOS work via PWA wrapper?

**No, not realistically.** Three structural reasons:

1. WatchOS doesn't host WKWebView. Watch apps run in a constrained SwiftUI runtime; Apple has not exposed a general-purpose web view on the watch.
2. Wrappers don't cross targets. Capacitor/Tauri/PWABuilder all generate iOS app targets, never WatchOS.
3. The watch use case is voice + glance, not editor. CodeMirror on a watch screen wouldn't be useful even hypothetically; the watch wants a capture surface that ports to the phone.

**The shape that works:** a small native SwiftUI Watch target inside the same Xcode project as the iOS Capacitor shell. Watch handles voice capture (`SFSpeechRecognizer` live, or local-audio + on-phone transcription for higher quality), pushes transcript to phone over `WatchConnectivity`, phone app writes it into the App Group container the web layer reads. Bounded native scope — the Watch UI is one or two views; data flow is one-way (watch → phone) for the MVP.

### 7.2 Does Apple Pencil work through WKWebView?

**Partially, and not well enough for the proposed feature.**

WKWebView delivers `PointerEvent` data (since iOS 13, `pointerType: "pen"` indicates Pencil) with pressure, tilt, and azimuth. A web app can render strokes onto an HTML5 `<canvas>`. For *casual* annotation, this works.

Why it's insufficient for Thot:

- **Latency.** Native PencilKit uses Apple's predictive low-latency pipeline (~9ms perceived). WKWebView pointer events route through JS + DOM and land closer to 60–120ms. Users notice immediately; serious annotation feels broken.
- **Pencil Pro gestures.** Squeeze, double-tap, hover, barrel roll surface through native `UIPencilInteraction`. WKWebView exposes some via standardized pointer events; newer gestures are inconsistent. **[VERIFY 2026]**
- **Scribble.** Apple's Scribble (handwriting-to-text in *any* text input) works in WKWebView text fields. So Pencil-as-keyboard is free. But Thot wants *annotation overlay* — different feature.
- **Vision OCR** for handwriting → text requires processing strokes natively. You can capture in the web layer and forward to Swift, but at that point the web layer adds nothing.

**The shape that works:** a native `PKCanvasView` overlay above the WKWebView, bound to an "annotate mode" toggle. When on, WKWebView interaction disables; PencilKit captures strokes; Vision OCRs; results post back to the web layer as text edits or as a stored ink layer on the document. ~200–500 lines of Swift plus a small Capacitor plugin for the toggle/OCR mediation. Bounded, and dramatically better than fighting the event pipeline.

**Net:** Pencil does not work through the WebView for the feature Sean wants. Needs native rendering — but that rendering lives alongside the Capacitor wrapper, not instead of it.

---

## 8. Phasing Recommendation

Order by gradient from "highest leverage per Swift line written" to "highest Swift cost per delivered feature."

**Phase A — macOS PWA installable (already in flight).** Safari → Add to Dock. Zero-effort path; ship messaging that points Mac users here rather than waiting for a wrapper.

**Phase B — iOS/iPadOS via Capacitor + App Intents + Widgets.** First wrapped binary.
1. Capacitor shell loading `https://thots.august.style` with bundled offline fallback.
2. App Group container; web layer writes latest note + cursor state.
3. App Intents target: "Add to Thot," "Read my last note," "Open at draft X" — Siri/Shortcuts-discoverable.
4. WidgetKit target: lock-screen + home-screen "last note preview" reading from App Group.
5. Push subscription for cross-device sync once `auth-and-sync/` lands.

Unlocks the post-it-on-lock-screen and "Siri, add to Thot" features — the most distinctive differentiators for a markdown app.

**Phase C — Live Activities + Dynamic Island.** ActivityKit widget extension on the same Capacitor shell. Long-running Live Activity registered per "thinking session"; Dynamic Island compact view shows title + cursor indicator; tap opens at the current note (in-island editing isn't possible — Live Activities are read-only surfaces with limited button interactions). Geo-tag in `ActivityAttributes`. Ship after B because the App Group plumbing is shared.

**Phase D — iPadOS Apple Pencil annotation.** Native PencilKit overlay + Vision OCR (per §7.2). iPadOS-only "annotate mode" toggle inside the Capacitor shell. OCR'd handwriting flows into the doc as text; raw strokes persist as a separate ink layer alongside the markdown. Most code per feature, but a named differentiator — don't cut.

**Phase E — WatchOS companion.** Separate SwiftUI Watch target in the same Xcode project. Voice → transcription → `WatchConnectivity` → phone → App Group. MVP: tap-to-dictate, see in iPhone Thot. Stretch: complications, watch reading of recent notes. Ship last because sync infrastructure (App Group + cloud sync) is what makes a watch note useful.

**Phase F — macOS native shell (optional).** Only if Catalyst (free from B–E) proves insufficient for window management, multi-window, or menubar work. Tauri is a candidate; maintenance of a second codebase is real. Default: stick with Catalyst.

---

## 9. Recommendation

**Adopt Capacitor as the host shell for iOS, iPadOS, and macOS (Catalyst). Write WatchOS as a separate native SwiftUI target sharing the same App Group. Implement Apple Pencil annotation as a native PencilKit overlay inside the Capacitor shell.**

Rationale: Capacitor packages the WKWebView host plumbing you'd otherwise write from scratch. The features Sean cares about (Live Activities, App Intents, WidgetKit, Pencil) all require native Swift regardless of host — Capacitor just gives you a clean place to put it. WatchOS can't be hosted by any wrapper structurally. PWABuilder is too bare. Tauri is too immature on iOS for a one-developer project. A pure custom shell costs more code without delivering more capability than Capacitor + the same native plugins.

**Phase order:** A (current PWA) → B (Capacitor + App Intents + Widgets) → C (Live Activities) → D (Pencil) → E (WatchOS) → F (Mac native shell, optional).

**Unlocks per phase:**
- B requires App Group plumbing (~1 week) + iOS dev account.
- C reuses B's App Group plumbing; ActivityKit widget target is incremental.
- D is independent of B/C; can run parallel with C.
- E requires a sync story (`auth-and-sync/` bucket is a near-blocker for E being useful).
- F only if Catalyst proves insufficient.

---

## 10. Open Research Items

Phase 2 should target these directly.

1. **[VERIFY] Capacitor plugin status for ActivityKit, App Intents, WidgetKit** — community plugin maintenance, license, dependency profile. If none are usable, scope custom-plugin work explicitly.
2. **[VERIFY] PWABuilder iOS template in 2026** — officially supported, maintenance mode, or abandoned. If abandoned, drop from candidate set.
3. **[VERIFY] Tauri 2.0 iOS plugin ecosystem** — basics (Camera, Filesystem, Push, Haptics, Share) shipped or theoretical?
4. **[VERIFY] Guideline 4.2 rejection trends 2025–2026** — practitioner reports, updated rejection language.
5. **[VERIFY] Service Worker reliability in Capacitor's WKWebView on iOS 17/18** — lifecycle, storage quotas, cold-start persistence. Affects offline-on-airplane.
6. **[VERIFY] PencilKit + WKWebView coexistence in shipped apps** — real overlay examples, glitch rate, toggle UX.
7. **[VERIFY] On-device Watch transcription quality** — `SFSpeechRecognizer` adequate, or does audio need to round-trip to phone/server for Whisper-quality? Latency vs quality.
8. **[VERIFY] Pencil Pro gesture exposure through WKWebView pointer events** — how much of squeeze/barrel-roll is reachable without a native overlay. If most works, Pencil overlay scope shrinks.
9. **App Group container size + write-frequency limits.** iOS throttles widget refresh; informs how often the web layer should write "latest note."
10. **Sync architecture dependency.** WatchOS phase presumes a sync story; `auth-and-sync/` needs to land first or in parallel. Flag as cross-bucket dependency in Phase 1 `final_recommendations.md`.
11. **All cited sources need re-verification** — this draft was written without live web access. Phase 2 must re-fetch Capacitor, Apple Developer, and PWABuilder docs and add direct quotes / version numbers.

---

## 11. Sources Referenced (training-knowledge synthesis; URLs to re-verify in Phase 2)

- Apple Developer: `WKWebView` / `WKScriptMessageHandler`, `ActivityKit`, `WidgetKit`, `App Intents`, `PencilKit`, `WatchConnectivity`, `SFSpeechRecognizer`, App Store Review Guidelines §§3.3.2, 4.2
- Capacitor Documentation: iOS guide, plugin authoring, Live Updates / `server.url`
- Capgo: open-source Capacitor Live Updates alternative
- Microsoft PWABuilder: iOS package generator
- Tauri 2.0: Mobile guide (iOS prerequisites, plugin model)
- Project-internal: `docs/THOT_APP.md`, `docs/archive/v4_0/v4_0_0_CLARITY.md`

URLs deliberately omitted because the document was produced without live web verification. Phase 2 should add canonical URLs and quote-level citations.
