# v5.0.0 IMPLEMENT — Section Outline

Navigation map for `v5_0_0_IMPLEMENT.md` (this directory). Line numbers current as of 2026-05-20.

**Regenerate this file whenever the IMPLEMENT changes substantially** — section line numbers drift with every edit. It exists so an agent can jump straight to a section and see neighboring structure without grepping the 4k-line document.

---


## L18 · How This Document Works
Header — status-tag legend, required reading, how the roadmap is organized.

## L42 · Roadmap Overview
Header — milestone table (v4.0.x shipped → v5.0 public launch → vNext) and the research-status snapshot.
- L56 · Research status snapshot

## L76 · Strategic Pillars
The six high-level intents every feature decision traces back to.
- L80 · Web App Focused — With Drop-In Native Modularity
- L93 · IDE-for-Markdown Replacement
- L106 · Real-Time Collaboration
- L115 · Don't Block Out Non-Markdown Writers
- L124 · Bring the Best of Markdown to the Mainstream
- L131 · AI-First Designing

## L142 · Editor Foundation
The core editing surface — typography, dark theme, wrapping, paste, paired delimiters, autocorrect, spellcheck, keyboard shortcuts.
- L146 · Foundational Premise & Philosophy **(Shipped v4.1.0, evolving toward v5)**
- L165 · Typography
- L229 · Dark Theme Baseline
- L294 · Line Wrapping
- L333 · Paste Behavior — Paste-as-Plain-Text + Smart-Quote Normalization
- L394 · Paired Delimiters
- L452 · Autocorrect Engine
- L555 · Native Browser Spellcheck
- L588 · Destructive-Action Confirmation **(Spec'd, not shipped)**
- L592 · First-Run / Empty-State Content **(Shipped v4.1.0)**
- L596 · Box-Drawing Character Insertion **(Concept, needs research)**
- L600 · Keyboard Shortcuts

## L654 · List Item Behavior
Return/spacing behavior in lists, sub-list rejoining, marker-vs-content coloring, content-bleed bugs.
- L658 · Line-Spacing Variations — The Broken Return Behavior **(Shipped, with known gaps)**
- L713 · Exception: Rejoining Sub-Lists **(Shipped v4.1.0)**
- L733 · Paired-Delimiter Gap for Markdown Syntax Wrapping **(Spec'd, not shipped)**
- L737 · Bullet vs Numbered Marker Color Differentiation **(Shipped v4.1.0)**
- L750 · List Content Bleed Onto Following Lines **(Shipped v4.1.0, partial fix)**
- L774 · Frontmatter Mis-Tagging in List Contexts **(Cancelled — see v5 scope rebuild)**

## L780 · Line Number Column & Gutter
The gutter — digit-responsive spacing, padding, collapsing ranges, edit-state line indicators.
- L782 · Overview **(Shipped v4.1.0, polished in v4.0.0)**
- L788 · Selective Digit-Responsive Spacing Behavior **(Shipped v4.0.0)**
- L816 · Shipped Implementation **(Shipped v4.0.0)**
- L847 · Left & Right Padding **(Shipped v4.0.0)**
- L871 · Collapsing Range of Lines **(Spec'd, not shipped)**
- L886 · Colored Line Number Indicator — Edit/Add State **(Spec'd, not shipped)**

## L924 · Mobile-Specific UX
iPad-first mobile behavior — padding, viewport bugs, predictive-text suppression, share sheet, touch handling.
- L926 · Priority: iPad First, iPhone Second **(Shipped v4.1.0)**
- L932 · Bottom Padding — `padding-bottom: 30vh` **(Shipped v4.1.0)**
- L945 · iOS Safari Initial-Viewport Miscalculation **(Shipped, with known gaps)**
- L949 · iPad Undo Failure on Whole-Document Deletion **(Shipped, with known gaps)**
- L953 · iOS Predictive Text Disabled — `autocorrect: "off"`, `autocapitalize: "off"` **(Shipped v4.1.0, with backlash)**
- L982 · iOS Predictive Text Bar — The "Form-Field" Confusion **(Shipped, with known gaps)**
- L988 · Share Sheet — Web Share API + Custom Button **(Shipped v4.1.0)**
- L1012 · Touch Handlers — Cursor Placement & Highlighting **(Spec'd, not shipped)**
- L1028 · Cross-Window Sync on Mobile **(Cancelled — see v3.1.2 single persistent main draftpad)**
- L1034 · PWA Install Behavior **(Spec'd to be REMOVED)**
- L1038 · iPad-First Priority **(Shipped v4.1.0, ongoing focus)**

## L1051 · Counters & Productivity
Word/character/token counter, save indicator, print-to-PDF.
- L1055 · Word, Character, Token Counter **(Spec'd, not shipped)**
- L1095 · "Subtle Save Indicator" **(Spec'd, deferred)**
- L1101 · Print to Simple PDF **(Spec'd, not shipped)**
- L1115 · Counter Status by Version

## L1134 · Heading Stacking / Sticky Scroll
Sticky cascading headings while scrolling — v4.2.0, spec locked and BUILD-ready.
- L1138 · The Spec — Sean's Narrative (verbatim, full)
- L1148 · Expected Behaviors (extracted from Sean's narrative)
- L1161 · IDE-Standard Rationale (Why It's Table-Stakes)
- L1171 · Locked Decisions
- L1182 · Implementation Approach
- L1190 · Locked Files
- L1197 · Visual Model
- L1201 · Status Summary

## L1212 · Interactive Markdown (Links / Anchors / References)
Clickable URLs, anchor jumps, local-path resolution, @noteName / #ProjectTag link syntax.
- L1216 · Strategic frame
- L1222 · URL clickability — CMD/Ctrl+Click **(Shipped v4.1.0)**
- L1265 · Anchor link navigation — in-document jumps **(Shipped v4.1.0)**
- L1300 · Local file path resolution — `/Users/...`, relative paths **(Spec'd, not shipped — deferred to native shell)**
- L1315 · Touch / long-press context menu — mobile equivalent **(Spec'd, not shipped — deferred to vNext)**
- L1331 · `@noteName` cross-document links **(Concept, needs research)**
- L1352 · `#ProjectTag` auto-sectioning **(Concept, needs research)**
- L1373 · Cross-cutting note: where Interactive Markdown sits in the moat

## L1381 · Semantic Highlighting & Theme
The highlight system — the v4.1.0 tri-system, the full color palette, and the v5 proprietary scope-system rewrite (the moat).
- L1385 · Current Implementation — the Tri-System (Shipped v4.1.0)
- L1403 · Custom Lezer Tags (5 total)
- L1417 · Complete Color Palette
- L1579 · Marker ↔ Content Differentiation (Spec)
- L1601 · Priority Hierarchy / Cascade Spec
- L1655 · Extended Font Weights for Emphasis
- L1661 · Language-Specific Code-Block Highlighting (Shipped)
- L1667 · Frontmatter / DocumentMeta Workaround (v4.0.0.3)
- L1685 · Checked-Todo Differentiation (v4.0.0.4)
- L1708 · List-Containment styleTags Fix (v4.0.0.7)
- L1732 · Indentation-Color CommonMark Behavior (deferred, intentional)
- L1736 · v5 Scope-System Rewrite (Research locked; ready to plan)
- L1789 · Lezer vs Custom-Parser — the IP-Honest Read (Research locked)
- L1821 · TextMate-Rule Heritage (from v1, informs v5 scope naming)
- L1833 · VSCode-Compatible Scope Highlighting Config **(Concept, needs research)**
- L1847 · Highlighting "Themes" (Presets) **(Concept, needs research)**
- L1851 · Open Questions / Items Carried Forward

## L1864 · Intelligent Formatting / Dual-Mode UI
The non-markdown-writer experience — plain-text auto-detection, notation hiding, dual-mode vs hybrid, the formatting toolbar.
- L1870 · Vision and Market Rationale
- L1897 · Auto-Detect Plain-Text-Mode Heuristics (the `auto.*` scope group)
- L1937 · Notation Hiding via `Decoration.replace()` + Floating Context Menu
- L1952 · Dual-Mode (Option A) vs Hybrid Single-Mode (Option B) — Decision Open
- L1994 · RTF-Mode Toolbar (Legacy v2 Concept, Maps Forward)
- L2036 · Selection Auto-Wrap (relates to formatting UI)
- L2042 · Recipe Auto-Formatting (Legacy Concept, Future)
- L2060 · Declarative AI Customization (Legacy v1, Maps Forward)
- L2076 · Research Pointers and Open Work

## L2102 · Preferences UI
The v6 settings surface — preferences modal, the shared live-preview window, the full toggle list, theme presets.
- L2106 · Strategic frame
- L2135 · Right-click (context menu) extensions
- L2148 · Preferences modal — sections
- L2165 · Shared Live-Preview Window
- L2177 · Editor behavior toggles — full surface
- L2328 · Theme presets / theme switcher
- L2338 · Open work for v6 (before promoting to BUILD)
- L2344 · Cross-references to AI Integration

## L2352 · AI Integration (AI-First Design)
AI-first design — tab completion, format-on-save, model choice, declarative customization, @claude, speculative directions.
- L2356 · AI-first design philosophy
- L2370 · Predictive tab completion (Cursor / Anti-Gravity reference) **(Concept, needs research)**
- L2408 · Format-on-save (Anti-Gravity reference) **(Concept, needs research)**
- L2435 · Model choice (local vs hosted) **(Open — needs research)**
- L2458 · Cost / Stripe AI billing coupling **(Open — needs research)**
- L2473 · Declarative customization via AI — "Make headings blue" → config mutation **(Concept, needs research — Sean's pet idea from v1)**
- L2526 · `@claude` invocation points **(Concept, needs research)**
- L2551 · Speculative directions
- L2574 · What NOT to build
- L2585 · Market thesis — bring IDE AI tools to mainstream non-markdown users
- L2614 · Tab Groups auto-naming reference (Dia browser)
- L2627 · Subagent crawlers (background AI tasks)
- L2637 · The "single desk pad → AI organizes into a notebook" mental model

## L2643 · Persistence & State
How content is saved — the single persistent draftpad, temp windows, the cancelled multi-window history, the tabbed view.
- L2647 · Current shipping behavior **(Shipped v4.1.0)**
- L2708 · Tabbed-document view (PWA) **(Concept, needs research)**
- L2714 · Design rationale (why localStorage and not IndexedDB)
- L2720 · The multi-window history — CANCELLED, narrative preserved
- L2777 · v1-era macOS file-system model (preserved for posterity)
- L2808 · Recovery work — Anti-Gravity session loss
- L2816 · Service Worker / PWA cache (relevant to persistence UX)
- L2822 · Open Questions — Persistence & State

## L2831 · File Management & I/O
Open/Save-As, the File System Access API + fallbacks, IDE-feature-parity items, mobile constraints.
- L2835 · File-operation terminology — "Open" / "Save As", not "Import" / "Export" **(Shipped v3.1.0, with refinements)**
- L2843 · Current shipping behavior **(Shipped, with known gaps)**
- L2882 · Known gaps and testing results
- L2890 · Legacy concepts — potential future polish
- L2921 · IDE feature parity — items that win IDE users
- L2943 · Mobile / iOS file I/O constraints
- L2950 · Recorded decision — no backwards compatibility for the scratchpad → file-editor transition
- L2954 · Open Questions — File Management & I/O

## L2964 · Authentication & Accounts
Passkey-first auth — provider research, the locked Clerk recommendation, passkey UX, recovery.
- L2968 · The non-negotiable: passkey-first **(Sean's locked constraint)**
- L2976 · Current state **(Not implemented)**
- L2982 · What an account would store (from the research seed)
- L2990 · Provider options — comparative research
- L3007 · Option-by-option rationale (summary; see OPTIONS.md for full text)
- L3016 · Locked recommendation: Clerk
- L3027 · Stack at a glance
- L3038 · iOS Safari passkey behavior — critical platform note
- L3044 · Account recovery
- L3049 · Social / magic-link fallback stance
- L3054 · Passkey UX — the experience details **(Concept, needs research)**
- L3066 · Local-mode preservation for no-account users
- L3071 · Privacy posture (open)
- L3075 · What triggers a re-evaluation of Clerk
- L3083 · Open `VERIFY` items (from research, Phase 2 needed)
- L3094 · Open Questions — Authentication & Accounts

## L3108 · Cross-Device Sync
Editing the same document across devices — architecture options, the locked LWW→CRDT path, iOS constraints.
- L3112 · The desire (clear and unambiguous)
- L3117 · Current state **(Broken/blocked — no sync today)**
- L3123 · Architecture options (**Research locked; ready to plan**)
- L3132 · Sync option comparison (verbatim from research)
- L3140 · Locked recommendation
- L3162 · CRDT vs LWW — the open question
- L3171 · iOS Safari constraints (critical)
- L3178 · Recovery UX (open)
- L3183 · Dependency relationships
- L3193 · Existing-data migration
- L3197 · Open Questions — Cross-Device Sync

## L3207 · Real-Time Collaboration
Multi-user live editing — market pitch, competitive context, architecture shape, open research.
- L3211 · The market pitch **(Concept — strategic intent)**
- L3232 · Competitive context (from the research seed)
- L3248 · "Developers iterate on plans collaborating with humans and AI" — market thesis
- L3262 · Paywall stance — free tier must be useful
- L3266 · Architecture shape (from the locked research)
- L3275 · Research questions raised (seed bucket)
- L3287 · Priors and known constraints (verbatim)
- L3293 · What has been seeded (in the live research folder)
- L3297 · OPEN — needs research/spec
- L3303 · Open Questions — Real-Time Collaboration

## L3317 · Workspace & Multi-Note
Multi-note organization — Finder-style columns, post-it previews, AI-populated columns, tags/links, sticky-note layout.
- L3321 · Strategic frame
- L3334 · Note operations **(Concept, needs research)**
- L3344 · Finder-style column navigation **(Concept, needs research)**
- L3375 · Post-it preview snippets per note **(Concept, needs research)**
- L3409 · AI-populated detail in columns **(Concept, needs research)**
- L3439 · `#ProjectTag` auto-sections in columns **(Concept, needs research)**
- L3456 · `@noteName` inter-note links in columns **(Concept, needs research)**
- L3469 · Sticky-note layout (v3+ concept)
- L3482 · Columns mobile collapse **(Concept, needs research)**
- L3493 · Use cases for the workspace **(Concept, needs research)**
- L3499 · Relationship to lock-screen "always-available notepad"
- L3507 · What this is NOT **(Concept, needs research)**
- L3517 · Open Research Items from `COLUMNS_LAYOUT.md`
- L3525 · Persistence implications

## L3537 · Native Wrappers
macOS/iOS/iPadOS/WatchOS shells — the Capacitor decision, drop-in modularity, phases A–F, platform affordances.
- L3541 · Strategic frame
- L3559 · Locked architecture decision
- L3576 · Drop-in modularity goal
- L3599 · Full capability matrix (from `docs/research/1_DEEP/native-wrapper/OPTIONS.md` § 3)
- L3618 · Phase A — macOS PWA installable (current state)
- L3623 · Phase B — iOS/iPadOS via Capacitor + App Intents + Widgets **(Research locked; ready to plan)**
- L3635 · Phase C — Live Activities + Dynamic Island
- L3645 · Phase D — iPadOS Apple Pencil annotation
- L3665 · Phase E — WatchOS companion
- L3688 · Phase F — macOS native shell (optional)
- L3704 · iOS-specific affordances (full list)
- L3795 · visionOS — speculative future watching
- L3808 · Rich note metadata — speculative (context auto-enrichment)
- L3816 · Apple Wallet — speculative (LLM token purchases)
- L3825 · macOS-specific affordances
- L3840 · App distribution strategy
- L3857 · Open Research Items from `OPTIONS.md`
- L3873 · Build caution — verify SwiftUI against current docs
- L3877 · MCP Server Integration **(Concept, needs research)**
- L3881 · Why "hybrid" not "lite"
- L3894 · Cross-references

## L3904 · Monetization & Pricing Posture
Free-vs-paid posture and the Business-Plan Kickoff track — flagged as business research, not product spec.
- L3908 · Strategic frame
- L3927 · Seed questions awaiting business-plan research
- L3959 · Free-tier UX constraint
- L3978 · Trust / sovereignty posture
- L3993 · Stripe AI billing coupling
- L4004 · Competitive pricing context (placeholder)
- L4017 · Parallel track — Business Plan Kickoff
- L4028 · How this section interacts with product spec
- L4034 · Flag: needs business-plan research, not product spec work

## L4040 · Open Questions & Unresolved Designs
Appendix — roll-up of section-local open questions (to be compiled).
