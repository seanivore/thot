# Thot App Comprehensive Feature & Behavior Documentation

**Version**: 02 (working draft)
**Created**: 2026-05-13
**Updated**: 2026-05-18
**Status**: Planning — Pass 1 in flight
**Supersedes**: `docs/archive/v4_0/FEATURES_BEHAVIORS_01.md` (carried forward; do not delete)

---

## This Document's Purpose 

Single document to place all feature planning and UX/UI behavior breakdown. Agents are processing through all archive documents to gather every note of this information

### How to Read This Document

This file is the single living source of truth for Thot's full feature picture — current behavior, locked decisions, planned work, research-gated questions, and legacy concepts that were always meant to land somewhere. It exists because too many rich UI/UX write ups were getting lost between version-specific docs; this document holds the whole map in one place so nothing falls through the cracks and so cross-feature interactions become visible.

It is intentionally long, it needs to be, as this is where we drill down on all implementation planning working towards making it exclusively executable. A finished version will land in the 4–5k-line range. Don't optimize for concision on first reads. The structure will tighten in later passes as overlapping concerns get consolidated and well-trodden material is summarized.

### Conceptual Process

  1. The document begins sentence-and-paragraph heavy, with rough grouping, as detailed UI designs and UX expectations get pulled in from every prior doc.
  2. Described features should be better isolated and organized so they can then be given robust, implementation-ready detail.
  3. Areas that need research before locked-in decisions get a section that points to the relevant research docs (don't duplicate the research — link to it).
  4. Over time, sections and groupings get optimized; writing becomes more concise and bulleted where appropriate.
  5. The document must always offer the best understanding of the full picture to a clean-instance agent — by trimming fat or elaborating depending on what each section needs.
  6. Build-planning emerges naturally; don't try to start there.
  7. Feature planning must reach an exclusively-executable state before we consider building, which will happen in very few, large tracks (per `.agent/DEV_RULES.md`).
  8. Only when this map feels whole do we move back to the `vX_Y_Z_IMPLEMENT.md` document flow.

### High-Level Tasks

  1. Process through all prior documents and pull in every concept and design request.
  2. Delineate what needs research and take initiative to prep and plan for those research tasks.
  3. Keep architecture and tech docs (`docs/THOT_APP.md`) and `README.md` aligned with this document once it stabilizes.
  4. Treat documentation from this state forward as starting from a clean slate; downstream of FB stabilization, wipe and rewrite THOT_APP and README from this picture.
  5. Maintain a "Next Steps" section at the top so any agent or reader can pick up cold.

### Document Conventions

  - **Status tags** appear next to feature-level headings:
    - **(Shipped v4.1.0)** — behavior is live in production
    - **(Shipped, with known gaps)** — live but incomplete or buggy; gaps listed in-line
    - **(Partially shipped)** — some sub-behaviors live, others not
    - **(Spec'd, not shipped)** — written in detail, awaiting build
    - **(Research locked; ready to plan)** — research complete with a recommendation, awaiting IMPLEMENT planning
    - **(Concept, needs research)** — directional idea, requires research before specification
    - **(Cancelled — see X)** — attempted and abandoned; rationale preserved so it isn't re-litigated by accident
    - **(Speculative — future watching)** — long-horizon ideas worth keeping on the radar
  - **Source citations**: `(source: path:line-range)` so future audits can trace any claim back to where it was first written.
  - **Conflicts**: `**CONFLICT**:` flags disagreements between sources; resolved in later passes.
  - **Research links**: prefixed with `→ Research:` and pointing to a file in `docs/research/...` or `docs/archive/research/...`.
  - **Open questions** live in section-local `### Open Questions` subsections AND get rolled up into the final "Open Questions & Unresolved Designs" appendix.

---

## Next Steps / Active Work

This is the rolling todo list for FB consolidation and downstream phases. Updated as work progresses.

### Pass 1 — Complete (this session)

  - ✓ **Skeleton + Strategic Pillars** drafted directly.
  - ✓ **Verbatim bulk pull**: 4 parallel Writer agents mined v1/v2/v3/v4 archives + research docs and assembled into 22 H2 feature sections.
  - ✓ **Research-link verification**: every `docs/research/...` and `docs/archive/research/...` path cited in FB_02 confirmed to resolve.

### Awaiting Sean's Pass 1 review

The doc is ~3.9k lines. Suggested ways to skim:
  1. Read the "Strategic Pillars" (above) to confirm framing is right.
  2. Jump section-by-section via the H2 list; each section has status tags (**Shipped v4.1.0** / **Spec'd, not shipped** / **Research locked** / **Concept** / **Cancelled** / **Speculative**) so you can scan for what each is at a glance.
  3. Watch for **CONFLICT** markers — those are inconsistencies between sources that the writers surfaced for you to resolve in Pass 2.
  4. Note overlaps where the same idea lives in two sections (e.g., Preferences-related items are spread across Editor Foundation, Semantic Highlighting, Intelligent Formatting, Workspace, and Preferences UI). Pass 2 will colocate these where you want them.

### Queued for this session — Pass 2 (after Sean's review)

  - **Reorg per Sean's redirects** — restructure based on the feedback; colocate cross-feature concerns (Preferences surfaces, anything UI-toggle-able, etc.).
  - **Gap fill** — hunt for any deep UX prose Sean remembers that didn't surface in Pass 1 (likely candidates: counter UI sketches, more workspace narrative).
  - **Resolve CONFLICT markers** that Sean wants decided now.
  - **Refresh this Next Steps section** again at end of Pass 2.

### Queued — Pass 3+ (this session or next)

  - **Targeted depth on thinner sections**: Real-Time Collaboration (only architecture transport is locked; UX layer is open), AI Integration (philosophy is clear but specifics open), Preferences UI (all the dials are listed but the hierarchy/groupings need a UX pass).
  - **Compile final "Open Questions" appendix** from the per-section `### Open Questions` subsections.
  - **Build "Document Provenance & Source Map"** so future agents can audit which archive doc fed which section.

### Research status snapshot

Features with **active research that has reached a locked recommendation** (ready to move to IMPLEMENT planning whenever the build queue gets there):

  - **Highlighter scope-system rewrite (v5 moat)** → `docs/research/1_DEEP/highlighter-architecture/OPTIONS.md` — Option A (stay on Lezer, rewrite scope layer) + Option B2 (semantic prose-mode regex highlighter).
  - **Native wrappers** → `docs/research/1_DEEP/native-wrapper/OPTIONS.md` — Capacitor shell + native Swift for Live Activities / Pencil / WatchOS / widgets. Phasing A–F laid out.
  - **Auth + sync architecture** → `docs/research/1_DEEP/auth-and-sync/OPTIONS.md` — Clerk for auth, Postgres for v1 sync, Yjs + Liveblocks for v2 collaboration. `VERIFY` tags need a Phase 2 pass.

Features with **scaffolds awaiting Sean's narrative fill-in**:

  - **Intelligent formatting / dual-mode UX** → `docs/research/1_DEEP/feature-research/FORMATTING_UX.md`
  - **Columns + sticky-note layout** → `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md`

Features with **only seed questions** (research not yet started in the live folder):

  - **Real-time collaboration** → `docs/archive/research/1_DEEP/collab-for-markdown/1_REVIEW.md`
  - **AI features** → `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md`
  - **Monetization** → `docs/archive/research/1_DEEP/monetization/1_REVIEW.md` (business-track, not product-track)
  - **Market positioning** → `docs/archive/research/1_DEEP/market-positioning/1_REVIEW.md` (business-track)

The `docs/research/` folder is treated as a flat-ish space — no formal per-feature taxonomy required. Existing structure (1_DEEP/<feature>/...) is fine; we don't restructure it as part of FB work.

### Once FB feels whole

  - Replace `docs/archive/v4_0/FEATURES_BEHAVIORS.md` with the stabilized FB_02 content.
  - Rewrite `docs/THOT_APP.md` from this picture (clean slate per directive).
  - Rewrite `README.md` from this picture.
  - Spin off `vX_Y_Z_IMPLEMENT.md` tracks per feature group that has reached "exclusively-executable" status. Per current FB directive #7: large tracks, few in number.

---

## Strategic Pillars

These are the high-level intents that shape every feature decision. Each pillar has detailed feature sections later in the document; they should always trace back to one or more of these pillars. When a feature decision is uncertain, the answer is usually in which pillar it serves.

### Web App Focused — With Drop-In Native Modularity

Thot is primarily designed and developed as a web app. We do **not** want to promote the ability to install as a PWA, because we will be using native app wrappers to ship macOS and iOS apps with the same core functionality, only adding OS-specific features and behaviors that make sense for the platform.

The PWA-install prompt muddies the upgrade narrative: users who install a PWA will feel like they've already "got the app" and won't pick up the real native shells when they ship. Browser-only-until-native is the cleanest message.

**Drop-In Modularity for Native Updates** — Plan the PWA and the native wrapper such that the web app can update as frequently as we want and we essentially just "drop" the update into the wrapper with all the necessary connections still valid. This matters most where functionality must be translated to a native feature (e.g., settings/preferences mapped to native preference panes; file system access bridged to native APIs).

  - Lay out exactly what the architecture will be, end-to-end.
  - Review research findings (`docs/research/1_DEEP/native-wrapper/OPTIONS.md`), then document finalized approaches in this doc's Native Wrappers section.

### IDE-for-Markdown Replacement

Replicate as many of the core features of writing Markdown in today's popular IDEs as possible. Development is moving to terminals and further away from directly needing to edit code all the time — the bulk of programming work is shifting from coding to planning. These users are iterating on plans repeatedly, collaborating with humans and with AI. This denotes a market opportunity for an app that offers at minimum the same experience for developing a Markdown-based implementation plan, without having to open a full IDE.

  - Understand that many of the UX/UI feedback requests are not "Sean's quirks" — they are the norm across today's VSC-based IDEs (Cursor, VS Code, etc.).
  - There will be a number of items to address in the current live build that we've held off on because of upcoming development.

### Real-Time Collaboration

Allow real-time collaboration between users as they edit and iterate on plans. We want them to be able to log in on the web app using a passkey and interact with the document in a way that feels like Google Docs, but catered to developers.

  - This is core to the market opportunity visible in the rapidly growing developer scene.
  - Planning for this should be from the ground up, using the modern methods developers are used to.
  - **The bar is high**: Google Docs and Figma have set the expectation for collaborative features.
  - **The opportunities are also large**: many of the best collab features haven't been offered outside the IDE.

### Don't Block Out Non-Markdown Writers

We want it to be just as comfortable for those who don't write using markdown notation as those who do. Markdown usage shouldn't be the default experience or an unavoidable one. It should be optional and use intelligent behavior to recognize what the user is writing in. Ideally a user could switch back and forth in a single document and the writing experience would be seamless and intuitive.

  - It took Sean at least 5 years of knowing markdown existed before even attempting it.
  - Markdown is deceptively simple, so it is too easy to assume everyone will just try it.
  - Even after being forced to try it (via vibe coding), it took a while to understand.
  - **Important**: we aren't trying to convert users.

### Bring the Best of Markdown to the Mainstream

The amazing AI integration for tab completion, autocompletion, and auto-formatting in modern markdown editors is something non-IDE users have very little experience with. We also want to share the magic of having complete control over customizing semantic highlighting — it helps users, especially visual thinkers, manage and navigate their documents with a bit more cognitive ease.

  - What kept Sean engaged was consistently being in awe of learning features that are great for writing but exist nowhere else.
  - **Opportunity**: bring the magic of those markdown features to standard text writing.

### AI-First Designing

Many of the best IDE markdown tools require AI. This is called out specifically because the tendency is to push AI integration off until later stages of app version releases. AI must be integrated from the start to ensure the best UX.

  - Implementing AI from the ground up creates the best UX, but there are risks.
  - Must always find the most lightweight, best bang-for-buck AI usage.
  - Think of planning as **AI-first designing**.
  - Always ask: **Can we do this without AI?** Resist the temptation to put AI into everything.

---

<!-- ============================================================ -->
<!-- WRITER A OUTPUT — Editor Foundation, List Item Behavior,     -->
<!-- Line Number Column & Gutter, Mobile UX, Counters             -->
<!-- ============================================================ -->

## Editor Foundation

This section captures everything about Thot's core editing surface: the typography, the dark theme baseline, the line-wrap and hanging-indent behaviors, the paste pipeline, the paired-delimiter system, the autocorrect engine, auto-capitalization, the spellcheck toggle, and the keyboard shortcut layer. These are the substrate everything else (lists, line numbers, counters, mobile) sits on top of. Nothing here is novel in isolation — what makes Thot Thot is that all of it is *on* by default in a single-window, browser-hosted, IDE-grade markdown surface.

### Foundational Premise & Philosophy **(Shipped v4.1.0, evolving toward v5)**

> A markdown scratchpad with IDE-like syntax highlighting, designed as a persistent, always-on writing tool. Markdown written like code, not like a document. Text is treated like code in an IDE — monospace font, syntax-colored, line-numbered. Not a WYSIWYG renderer; you see the raw markdown with rich highlighting. Designed for people who write markdown all day (notes, planning, documentation). The highlight hierarchy is carefully designed so formatting always looks intentional (bold inside a list keeps bold color, inline code overrides everything, etc.). *(source: docs/THOT_APP.md:36-50)*

The v1 framing from the original Swift desk pad still governs the editor surface's UX intent even though the implementation has fully migrated to CodeMirror 6 on the web:

> A macOS-only desk pad app that behaves like TextEdit's always-open unsaved TXT window, but the editor surface looks and feels like a Cursor/VS Code markdown pane that is monospaced, has semantic-highlighted markdown, is in the dark theme; that is to say, zero UI clutter and automatic state persistence. *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:16)*

Five design principles carried forward intact from v1:

1. **Desk, not notebook.** Thot is a single continuous writing surface, not a note organizer. It's the digital equivalent of a legal pad that never leaves your desk.
2. **Editor = Product.** There is no "shell app with an editor inside." The editor surface is the product. All design decisions prioritize the feel of typing and reading over features.
3. **Frictionless entry.** Launch → cursor is focused → type. No modals, no "New document?" prompts, no chooser screens.
4. **Semantic calm.** The styling is expressive but not noisy. Headings, bold, links, code, lists — all visibly differentiated, but in a way that feels like your Cursor theme, not a circus.
5. **Future-safe data, simple present.** Under the hood, the scratchpad is a real `.md` document. That's it. Future features (multi-note, export, web clients, AI) will build around this file, not replace it.

*(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:75-90)*

The goal is concretely stated as: *open a markdown file in Cursor and Thot side-by-side; they feel visually equivalent in semantics, hierarchy, highlight color, spacing.* *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:197)*

### Typography

#### Font Family — JetBrains Mono NL **(Shipped v4.1.0)**

Thot ships with the **JetBrains Mono NL** (no-ligature) family loaded via `@font-face` in `src/styles/main.css`. The "NL" suffix matters — ligatures (e.g., `->` rendering as a single arrow glyph) actively interfere with markdown semantics, where the literal characters are part of the document content. The autocorrect engine performs glyph substitution at the source-text level when desired (e.g., the `->` → `→` dictionary entry, see Autocorrect Engine below).

**The full 9-weight family loaded** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:365-378)*:

| #   | Weight                 | Filename                                               |
| --- | ---------------------- | ------------------------------------------------------ |
| 1   | Bold (700)             | `src/assets/fonts/JetBrainsMonoNL-Bold.ttf`            |
| 2   | BoldItalic (700i)      | `src/assets/fonts/JetBrainsMonoNL-BoldItalic.ttf`      |
| 3   | ExtraBold (800)        | `src/assets/fonts/JetBrainsMonoNL-ExtraBold.ttf`       |
| 4   | ExtraBoldItalic (800i) | `src/assets/fonts/JetBrainsMonoNL-ExtraBoldItalic.ttf` |
| 5   | Italic (400i)          | `src/assets/fonts/JetBrainsMonoNL-Italic.ttf`          |
| 6   | Medium (500)           | `src/assets/fonts/JetBrainsMonoNL-Medium.ttf`          |
| 7   | Regular (400)          | `src/assets/fonts/JetBrainsMonoNL-Regular.ttf`         |
| 8   | Thin (100)             | `src/assets/fonts/JetBrainsMonoNL-Thin.ttf`            |
| 9   | ThinItalic (100i)      | `src/assets/fonts/JetBrainsMonoNL-ThinItalic.ttf`      |

**Per-element weight assignments** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:346-364, ratified into docs/THOT_APP.md:447-471)*:

- **BASICS**
  - Normal font uses Medium (`JetBrainsMonoNL-Medium.ttf`)
  - Standard bold uses ExtraBold (`JetBrainsMonoNL-ExtraBold.ttf`)
  - Standard italic uses ExtraBoldItalic (`JetBrainsMonoNL-ExtraBoldItalic.ttf`)
- **OTHER FORMATTING**
  - Blockquote uses ThinItalic
  - Strikethrough, comment, frontmatter use Thin
  - Standard `quotedText`, `math`, `linkURL` use (regular) Italic
  - Footnote, htmlTag, `bulletContent`, `numberedContent`, `numberedMarker`, `bulletMarker` all use Regular
  - `linkText` uses (regular) Bold
  - Anything remaining defaults to BoldItalic

#### Type Size, Weight & Line Height **(Shipped v4.1.0)**

| Setting       | Value                           | Source / Notes                                                                                                                                                       |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Font family   | JetBrains Mono NL (no-ligature) | `src/styles/main.css` `@font-face`; referenced in `src/theme.ts` `.cm-scroller` rule                                                                                 |
| Font size     | 12px                            | docs/THOT_APP.md:489. Set in `src/theme.ts` `'&'` rule. v1 originally pegged 12pt SwiftUI.                                                                           |
| Line height   | 1.5                             | docs/THOT_APP.md:490. Adjusted from initial 1.0 in v2.1.4 (less cramped). `src/theme.ts` `.cm-scroller` rule.                                                        |
| Base weight   | Medium (500)                    | docs/THOT_APP.md:491. Set via `.cm-content { fontWeight: '500' }` in `src/theme.ts`.                                                                                 |
| Headings size | Same as body                    | Intentional design choice; headings differentiated by color and weight, not size. *(source: docs/THOT_APP.md:504-505, docs/archive/v2_0/v2_0_0_FEEDBACK.md:321-324)* |

Sean's v1 framing held that line spacing should be *modestly relaxed (e.g., 1.2–1.4) for readability in dense notes* *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:182)*. The shipped value (1.5) lands slightly above that initial range — confirmed in v2.1.4 as the final pick after testing the original 1.0 felt cramped.

**Origin story of the 12pt size pick**: from v2.0.0 feedback — Sean tested 16pt and found it *HUGE*. The intent was *12pt or equivalent rem*. The journey to actually getting that to apply was a memorable HMR / preview-server odyssey:

> I changed the font size to 12pt. I ran `npm run preview` and hit refresh and it didn't work. Thinking maybe I just missed it, I changed it to 10pt and tried again. Used incognito window after `npm run preview` and nothing happened. A minute later I hit refresh again, and suddenly it all changed from 16pt to 10pt — IDK why the delay and inconsistency that follows. I went to change it back to 12pt, ran `npm run preview`, tried incognito, tried hard refresh and nothing. SO — it is still all TINY and I can't get it to change. *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:330-339)*

The root cause was service-worker caching plus `npm run preview` only serving `dist/` after a fresh `npm run build`. This is now codified in docs/THOT_APP.md § Common Mistakes ("Don't use `npm run preview` without `npm run build` first").

#### Heading Size Decision — "Headings stay body-sized" **(Shipped v4.1.0)**

A deliberate, repeated Sean-call. From v2.0.0 feedback:

> HEADINGS — I changed the headings so that they're the same size as the rest of the document. Please leave them this way. *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:322-324)*

Codified in docs/THOT_APP.md § Common Pitfalls:

> **Headings are the same font size as body text** — Intentional design choice by the user — headings distinguished by color and weight, not size. *(source: docs/THOT_APP.md:504-505)*

Heading prominence is carried entirely by color (`#FF9D00` orange) and weight (ExtraBold 800). The implication for v6 preferences UI: heading size is a customizable knob, but the default must remain "body-sized."

### Dark Theme Baseline

#### Color Palette Snapshot **(Shipped v4.1.0)** *(source: docs/THOT_APP.md:446-471)*

| Element                       | Color   | Font Weight               |
| ----------------------------- | ------- | ------------------------- |
| Background                    | #1a1a1a | —                         |
| Foreground (base text)        | #e6e6e6 | Medium (500)              |
| Headings (marker + content)   | #FF9D00 | ExtraBold (800)           |
| Bold (marker + content)       | #FFD866 | ExtraBold (800)           |
| Italic (marker + content)     | #BF437F | ExtraBoldItalic (800i)    |
| Strikethrough                 | #6272A4 | Thin (100) + line-through |
| Inline code + delimiter       | #F34D3E | Regular (400)             |
| Fenced code delimiter (```)   | #6767fc | Regular (400)             |
| Code block content (fallback) | #8989e3 | Regular (400)             |
| Code language ID              | #F1FA8C | —                         |
| Bullet marker                 | #dfc532 | Bold (700)                |
| Bullet content                | #8aeefb | Regular (400)             |
| Numbered marker               | #ff6b6b | Bold (700)                |
| Numbered content              | #f8a5c2 | Regular (400)             |
| Checkbox                      | #8BE9FD | Regular (400)             |
| Blockquote (marker + content) | #E6DB74 | ThinItalic (100i)         |
| Table (marker + content)      | #e2ff79 | Regular (400)             |
| Horizontal rule               | #93f9c6 | Regular (400)             |
| Link text + markers           | #AB9DF2 | Bold (700)                |
| Link URL                      | #8BE9FD | Regular (400)             |
| Comment                       | #6272A4 | Thin (100) + italic       |

The complete palette is ~100 entries (including code-block token colors per language), all defined in `src/highlight-tags.ts` as the single source of truth. `theme.ts` imports from it — colors are never literal in `theme.ts`. The intent of this discipline is that v6's preferences UI can pivot on a single data source.

#### Highlight Priority Hierarchy **(Shipped v4.1.0)** *(source: docs/THOT_APP.md:474-485, originated docs/archive/v2_0/v2_0_0_FEEDBACK.md:74-94)*

The hierarchy is "created from top to bottom, in order of priority" — items at the top overpower lower-ranked labels. Styling falls into two categories:

- **FULL** — applies its own style only, eliminating the lower ranking label's properties entirely (e.g., inline code in a heading drops the heading bold and uses inline code's full color + monospace).
- **BLEND** — applies its style but retains the lower ranking label's color/weight as appropriate (e.g., bold text that is crossed out keeps its bold font but adopts the strikethrough's color and adds the line-through).

The shipped hierarchy:

1. **Strikethrough** (`strikethroughMarker`, `strikethroughContent`) — **BLEND**
2. **Inline code** (`inlineCode`, `inlineCodeDelimiter`, `blockCodeDelimiter`) — **FULL**
3. **Code block content, checkbox** — **BLEND**
4. **Bold, italic** (`boldMarker`, `bold`, `italicMarker`, `italic`) — **FULL**
5. **Table** (`tableMarker`, `tableContents`) — **FULL**
6. **Heading** (`headingMarker`, `headingContent`) — **FULL**
7. **List content** (`bulletMarker`, `bulletContent`, `numberedMarker`, `numberedContent`) — **FULL**
8. **Blockquote** (`blockquoteMarker`, `blockquoteContent`) — **FULL**
9. **Foreground** — fallback

The mechanism that enforces this: `HighlightStyle.define()` generates single-class CSS rules in array order; when multiple classes land on the same `<span>`, the LATER CSS rule wins. So low-priority items appear first in the array and high-priority items appear last. Strikethrough is defined last so it always wins. *(source: docs/THOT_APP.md:528, docs/archive/v2_0/v2_0_8_DEV_PLANNING.md:15-18)*

#### Editor Chrome Colors **(Shipped v4.1.0)**

Beyond the syntax-highlight palette, the chrome (gutters, cursor, selection, background) is also part of the dark theme:

- Editor background: `#1a1a1a`
- Foreground base: `#e6e6e6`
- Defined in `src/theme.ts` `thotEditorTheme` block.

The selection-color call-out: Sean has flagged the current selection color as too transparent / hard to see on dark background, especially on mobile:

> Also, we should change the highlight color because it is this very transparent faded green on top of the charcoal background so when text is highlighted, it is very difficult to see if it highlighted the whole word or not on mobile especially. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:272)*

**(Spec'd, not shipped)** — Selection color is an outstanding usability tweak; tracked but not yet implemented.

### Line Wrapping

#### `EditorView.lineWrapping` **(Shipped v4.1.0)** *(source: docs/THOT_APP.md, src/editor.ts:303 per v4.0.0 BUILD)*

Soft-wrap is **unconditional** — `EditorView.lineWrapping` is included in the extensions array unconditionally at `src/editor.ts:303`. The Phase 0 v4.0.0 DevTools spike was to investigate a suspected "wrap stops below 1040px viewport" bug. Outcome from the BUILD_REPORT:

> Static analysis of `node_modules/@codemirror/view/dist/index.js:6608–6640` confirmed CM's `.cm-content.cm-lineWrapping { white-space: break-spaces; ... }` rule fires unconditionally — `EditorView.lineWrapping` in our extensions adds the class. No CSS override below 1040px exists in our code or CM base. Conclusion: the bug described in the BUILD does not reproduce on current code. No fix applied. Sean confirmed wrap works at narrow viewport on the dev preview. *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:33)*

So wrap is shipped and behaving correctly across viewport widths. The v1 framing — *Hard wraps at view width (no horizontal scrolling in normal usage)* *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:121)* — is honored.

#### Hanging Indent / Wrapped-Line Indentation **(Shipped v4.1.0)** *(source: src/hanging-indent.ts, docs/THOT_APP.md:421-424)*

**Rationale, from v2.0.0 feedback** (verbatim, this is Sean's voice):

> When typing in a block of text — standard paragraph or either types of lists with really long items that wrap — the wrapped next lines must adhere to the indentation at which the first line in the block of text started. Let me know if you need pictures of what I'm talking about. This is **NOT** how a normal word processor would work which is maybe why it doesn't, but since markdown is traditionally written in an IDE, the text is treated more like code. *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:50-53)*

This applies to:
- Plain text in a long paragraph
- An unordered list item that is long and wraps around
- An ordered list item that is long and wraps around

**Implementation**: `src/hanging-indent.ts` is a `ViewPlugin` that computes indent width per visible line and applies `padding-left` + `text-indent` via `Decoration.line()` using `ch` units. Handles:
- Bullets (`- `)
- Numbers (`1. `)
- Blockquotes (`> `)
- Plain whitespace prefixes (e.g., 2- and 4-space indents)

It only processes lines in `view.visibleRanges`, which keeps it cheap on 100K+ line documents.

#### Indent-color quirk that's NOT a bug **(Shipped, with known gaps)** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:58-64)*

When you tab/indent text past 4 spaces, CommonMark treats it as a code block:

> Traditionally in markdown, when you highlight a block of text, that could be a list of either kind or just a paragraph, it changes to the same color as 'plain text' in a code block, when you tab too far past the first line of text. In the app, the change to a solid color happens when you are AT the indent of the line or line with return in-between you and the line you are trying to indent. It is the wrong color, green like everything else wrong, but that is because of all the incorrect highlight colors in the next number. It needs to be able to tab over about two past the line above in case your creating a sublist. *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:60-64)*

Acknowledged in docs/THOT_APP.md as Pitfall #1 — "Indented text (4+ spaces) turns code-block color. This is correct per CommonMark spec — 4 spaces of indent creates a code block. With correct code block color (#8989e3 light purple), it looks intentional." *(source: docs/THOT_APP.md:500-502)*

**CONFLICT**: docs/archive/v2_0/v2_0_0_FEEDBACK.md:64 says "It needs to be able to tab over about two past the line above in case your creating a sublist." This implies the spec is to allow ~2 indent levels past the parent before triggering code-block coloring. docs/THOT_APP.md:500-502 frames this as a non-bug per CommonMark, accepting the 4-space threshold as-is. Net: defer to docs/THOT_APP.md (it's a deliberate v4-era stance), but v6 preferences UI should expose a "code block indent threshold" toggle if technically feasible — or v5 scope rebuild should reconsider the line.

### Paste Behavior — Paste-as-Plain-Text + Smart-Quote Normalization

#### Spec **(Shipped v4.1.0)** *(source: docs/archive/v4_0/v4_0_1_IMPLEMENT.md:116-161, docs/archive/v4_0/v4_0_0_BUILD.md:162-216)*

The v1 framing already required paste-as-plain-text:

> Paste behavior: *always paste as plain text* (strip any rich formatting). *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:130)*

That was deferred until v4.0.0 in the web build. Shipped behavior:

1. **Strip HTML / rich formatting** — paste any styled content (Google Docs, web page, Word), only plain text lands in the editor.
2. **Normalize smart quotes** — typographer's curly quotes (`"` `"` `'` `'`) converted to straight ASCII quotes (`"` and `'`) on paste.
3. **Single-undo paste** — the entire paste is a single transaction, so CMD+Z undoes it in one step.

**Implementation** is in `src/paste-handler.ts`:

```ts
import { EditorView } from '@codemirror/view'

const SMART_QUOTE_MAP: Record<string, string> = {
  '“': '"',  // left double
  '”': '"',  // right double
  '‘': "'",  // left single
  '’': "'",  // right single
}

function normalizeSmartQuotes(text: string): string {
  return text.replace(/[“”‘’]/g, (c) => SMART_QUOTE_MAP[c] || c)
}

export const pastePlainText = EditorView.domEventHandlers({
  paste(event, view) {
    if (!event.clipboardData) return false
    const text = event.clipboardData.getData('text/plain')
    if (!text) return false

    event.preventDefault()
    const normalized = normalizeSmartQuotes(text)
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: normalized },
      selection: { anchor: from + normalized.length },
      userEvent: 'input.paste',
    })
    return true
  }
})
```

Wired into `src/editor.ts` after `closeBrackets()` in the extensions array.

**Verification (per BUILD_REPORT)**: Sean confirmed curly → straight quote conversion works and HTML styling is dropped. *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:71)*

**Why smart-quote normalization matters**: A separate pain Sean reported during mobile testing was that auto-correction on iOS turns hyphens into em-dashes when typing — *annoyingly when i try to type a horizontal line it DOES auto correct and it turns my hyphen hyphen into one m-dash*. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:208-211)*. The paste handler is the desktop-side companion to keeping the editor's source text canonical regardless of clipboard origin.

#### What paste-as-plain-text deliberately does NOT do **(Spec'd, not shipped)**

- Does not normalize em-dashes / en-dashes back to hyphens. Some users want those preserved (e.g., literary writers).
- Does not strip Markdown formatting on paste (a Markdown→plain converter is a separate concept).
- Does not detect-and-warn on probable-image-paste. (Future: clipboard image handler would intercept image MIME types and either reject or stash as an asset reference.)

### Paired Delimiters

The paired-delimiter behavior is the single feature Sean has called out as *"a feature I use CONSTANTLY and would love it in this update."* *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:253)*

#### `closeBrackets` for type-an-opener **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_USABILITY_IMPL.md:20-27, docs/archive/v3_0/v3_THREE_TRACK_IMPL.md:21-23)*

The base layer is `@codemirror/autocomplete`'s `closeBrackets()` extension, added directly to the CM6 `extensions` array in `editor.ts`. It handles:

- **Pair insertion** — typing `(` inserts `()` with cursor between
- **Skip-over** — typing `)` when cursor is directly before an auto-inserted `)` moves past it instead of duplicating
- **Wrap selection** — highlight a word, type `(`, becomes `(word)`
- **Pair deletion** — backspace inside an empty pair deletes both characters

**Supported delimiter pairs**: `()`, `[]`, `{}`, `''`, `""`, `` ` `` (backtick).

This was specified back in v1 *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:142-166)* and was the v1 Swift implementation in `PairedDelimiterTextView`:

> Pairs are inserted correctly. Typing closing character skips over existing closing pair. Backspace between empty pair deletes both. Text selection + opening char wraps selection. Smart quote handling (no pair mid-word for contractions). Tab inserts 2 spaces. *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:630-636)*

Validated in v3 usability testing:

> Typing any delimiter creates both, like it should. Highlighting a word and then typing either `"` or `'` places the double or single quotes around the word, as expected. Highlighting a word and then typing `(` or `{` or `[` all places the set of delimiters around the word, as expected. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:77-83)*

#### Shift-Marker Wrapping — markdown syntax wrapping **(Spec'd, not shipped)** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:240-253, docs/archive/v3_0/v3_USABILITY_TESTING.md:85-87)*

Sean's verbatim spec:

> When you highlight a word in markdown and then hit SHIFT-* for example — it adds the * to both sides of the word automatically. Click a second * and it adds two to either side of highlighted region. It does this for all characters that have one on either side — you have to click the first of the two:
> - 'Single quotes'
> - "Double quotes"
> - (Parenthesis)
> - {Brackets and curly brackets}
> - `delimiter tick marks`
>
> This is a feature I use CONSTANTLY and would love it in this update. *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:240-253)*

The above was partially solved by `closeBrackets`. The **gap** identified in v3 usability testing:

> Adding delimiters to a highlighted word only half works. However, none of the other delimiters can be applied by highlighting and tapping the delimiter. This should also work for adding `inline code markers to a word`, *italics* and **bold** asterisks, `<carrots>`, or ~~strikeout~~. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:85-87)*

So the **shipped state** as of v4.1.0:
- `closeBrackets` handles paired ASCII delimiters: `()`, `[]`, `{}`, `''`, `""`, `` ` ``.
- Highlight a word + type `(` / `[` / `{` / `'` / `"` / `` ` `` correctly wraps.
- **DOES NOT wrap markdown-syntax-markers**: `*` (italic), `**` (bold) — but `**` is two characters; SHIFT-` * ` once should wrap with one `*` and second tap should expand to `**`. `~~` (strikethrough), `<>` (HTML-tag-style), `_` (underscore-italic) — none of these wrap on highlight + key currently.

**CONFLICT note for future**: v1 spec listed backtick as a supported `closeBrackets` pair. Sean's v3 gap-finding included "inline code markers to a word" as a missing wrap. So `` ` `` is *technically* wrapping (single backtick) but Sean is asking for the markdown-specific multi-char wrap behavior — wrap with `*`, second press promotes to `**`. This is a different feature from `closeBrackets`. The behavior needs to live in a new extension (likely `src/markdown-wrap-marker.ts`) that intercepts `*`, `_`, `~`, `<`, `>` when there's a non-empty selection and applies the markdown wrap (with first-press = single marker, second press = double marker for `*` / `_`).

**Spec for v5 or v4.0.1**:
- Highlight + `*` → `*word*` (italic). Second `*` press → `**word**` (bold). Third `*` press → `***word***` (bold+italic).
- Highlight + `_` → `_word_`. Second `_` press → `__word__`.
- Highlight + `~` → `~word~`. Second `~` press → `~~word~~` (strikethrough).
- Highlight + `<` → `<word>` (HTML tag wrap, single-pair).
- Highlight + `` ` `` → `` `word` ``. (Already partial via `closeBrackets`; second `` ` `` press would promote to triple-backtick fenced-code context, which is a much more involved spec.)

#### Suppression contexts for paired delimiters **(Concept, needs research)**

The original v1 spec noted *Smart quote handling (no pair mid-word for contractions)* *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:635)*. The web build's `closeBrackets` does NOT currently do mid-word suppression — typing `dont` then `'` between the t and end would auto-pair. This is acceptable for an IDE-style markdown editor (the autocorrect engine corrects `dont` → `don't` separately), but Sean has flagged context-aware quote pairing as desirable in the long run.

### Autocorrect Engine

The autocorrect engine is one of Thot's most user-noticeable behaviors and is implemented as a fully-proprietary system distinct from native browser autocorrect. The shipped behavior in v3.1.0+ is the result of an extensive set of refinements documented across `v3_AUTOCORRECT_COMPLETION.md` and the related feedback docs.

#### Architecture: StateField + Transaction Filter Pattern **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_USABILITY_IMPL.md:14-19, docs/archive/v3_0/v3_AUTOCORRECT_COMPLETION.md:14-39, src/autocorrect.ts)*

The engine is built on:

1. **`EditorState.transactionFilter`** — intercepts every transaction. When the user types a trigger character (space or punctuation), the filter looks backward from cursor for a word matching the dictionary and rewrites the transaction to include the replacement.
2. **Async `EditorView.updateListener`** — dispatches the actual correction as a SEPARATE transaction with `userEvent: "autocorrect"`. This is the key trick that makes the correction a distinct entry in the undo history — pressing CMD+Z undoes only the correction, leaving the trigger character in place.
3. **`StateField` (`autocorrectState`)** — tracks the last correction `{ from, to, original, triggerPos }` and a `Set<number>` of "ignored positions" so the engine knows when not to fire.
4. **`StateEffect`s** — `autocorrectApplied` and `autocorrectIgnored` are the dispatched effects that update the StateField.

```ts
export const autocorrectApplied = StateEffect.define<{
  from: number, to: number, original: string, triggerPos: number
}>()
export const autocorrectIgnored = StateEffect.define<number>()

export const autocorrectState = StateField.define<{
  lastCorrection: { from: number, to: number, original: string, triggerPos: number } | null,
  ignoredPositions: Set<number>
}>({
  create() {
    return { lastCorrection: null, ignoredPositions: new Set() }
  },
  update(value, tr) { /* ... */ }
})
```

`customAutocorrect()` returns an array containing both the `transactionFilter` and the `autocorrectState` field, plus the `updateListener` that drives the dispatch flow.

#### Backspace-Revert Behavior **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_AUTOCORRECT_COMPLETION.md:35-39, docs/THOT_APP.md:150-154)*

The single most-refined behavior. Required flow:

1. Type `well ` → space triggers autocorrect → `we'll ` appears.
2. Press Backspace → reverts the correction back to `well ` (the space stays).
3. Now if you type space again, it should NOT re-trigger the correction.

Implementation steps inside the transaction filter:
- Intercept `tr.isUserEvent('delete.backward')`.
- Read `lastCorrection` from `autocorrectState`.
- If the user is deleting the trigger character (the space) exactly at the end of `lastCorrection.to`, inject an additional change into the transaction: replace the corrected word back with `original`, and dispatch `autocorrectIgnored(triggerPos)` so re-typing the trigger at that position does not re-fire.

The full set of related behaviors, verbatim from docs/THOT_APP.md:

> Tracks user corrections via a `StateField` so:
> - Immediate Backspace on the trigger char reverts the correction *and* ignores the next attempt
> - CMD+Z undoes the correction but keeps the trigger character
> - Deleting the corrected word and retyping does not re-trigger
> - Deleting an autocorrect-added character ignores subsequent triggers *(source: docs/THOT_APP.md:150-154)*

#### Suppression Contexts (Syntax-aware) **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_AUTOCORRECT_COMPLETION.md:32-34, docs/THOT_APP.md:155)*

Autocorrect is **disabled inside** the following Lezer syntax-tree nodes, detected via `syntaxTree(tr.startState).resolveInner(fromA, -1)`:

- `InlineCode` — between `` ` `` markers
- `FencedCode` — inside ``` ```...``` ``` blocks
- `URL` — inside autolinked URLs
- `Link` (a.k.a. `LinkMark`) — inside markdown link syntax `[text](url)`

So typing `www.cant.com` doesn't get the `cant` → `can't` correction; typing `cant` inside ` ``` cant ``` ` doesn't trigger; the literal text inside `[cant](https://example.com)` doesn't get mangled.

#### CMD+Z Preserves Trigger Character **(Shipped v4.1.0)**

Because the correction is dispatched as a separate transaction labeled `userEvent: "autocorrect"`, CMD+Z undoes ONLY the correction step — the trigger character (typically a space) remains. This is the "do the right thing" undo: the user can correct a wrong correction without losing their space.

#### Word-Boundary Regex **(Shipped v4.1.0 — with one known gap)**

The trigger logic uses a `[a-zA-Z0-9_:-]+` regex at `src/autocorrect.ts:247` to look backward for the typed word.

**Known gap**: the `->` dictionary entry was added but the regex doesn't include `>` in its character class, so `->` never fires the substitution. From the v4.0.0 BUILD_REPORT:

> BUILD claim that `[a-zA-Z0-9_:-]+` regex captures `->` is wrong — `>` isn't in the character class. The dictionary entry was added but the regex fix was deliberately deferred at Sean's call (skip non-sure-wins; revisit in v4.0.1). The `->` token does not currently autocorrect. *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:40)*

**Fix candidate for v4.0.1**: extend the regex to `[a-zA-Z0-9_:-<>=/()]+` (or a more permissive token character class) so that arrow-style tokens, fraction tokens (`1/2`, `1/4`), and parenthesized symbols (`(c)`, `(r)`, `(tm)`) all consistently fire. The current class already covers most of those because they include `()` and `/` is not in the class — verify each entry.

#### Auto-Capitalization on Sentence Starts **(Shipped v4.1.0)** *(source: docs/THOT_APP.md:156)*

Sentence-start auto-capitalization is bundled into the same autocorrect engine. After a sentence terminator (`.`, `!`, `?`) followed by space(s), the next typed alphabetic character is capitalized. Same suppression rules apply (no capitalization inside code/URL/link contexts).

#### The Dictionary — Full Reference **(Shipped v4.1.0)** *(source: src/autocorrect.ts)*

The complete dictionary as it ships in v4.1.0. Categorized by section in the source file. (Reproduced verbatim in the source; the full table includes ~80 common-misspellings/contractions entries — `teh → the`, `dont → don't`, `cant → can't`, `im → I'm`, `ive → I've`, the full Strunk-ladder of common English typos and contractions — plus the emoji/symbol triggers `:smile: → 😊`, `:moon: → ☽`, `:saturn: → ♄`, the formatting symbols `-- → —`, `... → …`, `1/2 → ½`, `(c) → ©`, `(r) → ®`, `(tm) → ™`, and the `-> → →` arrow entry that doesn't currently fire due to the regex gap noted above.)

#### v6 Preferences-UI Integration **(Spec'd, not shipped — v6 target)** *(source: docs/archive/v4_0/v4_0_1_IMPLEMENT.md:521-538)*

The v6 preferences UI will expose:

- **Add word to dictionary** (right-click context menu extension over OS-default)
- **Create Autocorrect Rule** — right-click context menu item that opens the preferences modal at the Autocorrect Rules section. If the selection is already in the dictionary, the "Type the word you want to autocorrect" field is pre-filled with the trigger; otherwise the "Type the word you want to autocorrect to" field is pre-filled with the selection.
- List of all autocorrect rules with add/edit/delete affordances.
- Toggle individual rules on/off without deleting them.

This is the v6 work; v4.x dictionary is hardcoded in `src/autocorrect.ts`.

### Auto-Capitalization **(Shipped v4.1.0)**

Covered as part of the autocorrect engine. Sentence-start capitalization fires after `.`, `!`, `?` + whitespace. Suppressed in the same `InlineCode`, `FencedCode`, `URL`, `Link` contexts as word-level autocorrect.

Sean's mobile feedback flagged this as critical:

> most notable is of course the lack of the initial cap for a new sentence. maybe this is just turned off because it is a "code" editor and we just happen to be using it more specifically for word processing. regardless. very necessary. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:202-206)*

This is now shipped via the same custom autocorrect engine. The desktop / iOS native browser autocapitalize attributes are explicitly **off** (see Mobile-Specific UX § iOS Predictive Text Disabled) because they fight with the custom engine and trigger the iOS predictive-text bar.

### Native Browser Spellcheck

#### `spellcheck="true"` via `contentAttributes` **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_USABILITY_IMPL.md:9-13, docs/archive/v3_0/v3_THREE_TRACK_IMPL.md:17-20)*

The browser's built-in spellcheck (red-underline for misspellings, right-click for suggestions) is enabled by:

```ts
EditorView.contentAttributes.of({spellcheck: "true"})
```

It is wired through a `Compartment` so the user's toggle preference (stored in `localStorage`) can be applied dynamically without recreating the editor.

#### Toggle Shortcut — `Mod-Shift-c` **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:14-15)*

- Default state: `spellcheck: "true"` (enabled).
- Persisted in `localStorage`.
- Toggle via `CMD+Shift+C` (Mac) / `Ctrl+Shift+C` (others).
- Reconfigures the compartment on toggle.

Sean's test note:

> CMD+Shift+C works and the one case it did not work, I just changed the browser (Dia) shortcuts to make CMD+Shift+C available and now it works. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:72)*

The shortcut conflicts with some browser internal shortcuts (Dia's was one). This is a documented OS-level issue, not a Thot bug.

#### Known Mobile Gap **(Shipped, with known gaps)** *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:185-191)*

On iOS Safari, spellcheck underlines DO appear, but tapping them is awkward:

> it doesnt underline misspellings — but when i tap one i can change it — not that that is helpful unless it is an obvious misspelling. what we really need though is the autocorrect.

The native iOS predictive-text bar is disabled (see Mobile-Specific UX), which means iOS users lose the easy in-line correction suggestions they get elsewhere. The autocorrect engine partially compensates by handling the most common typos at the desktop level, but the mobile experience still has rougher edges. The long-term answer is the native iOS wrapper in vNext, where iOS native spellcheck/autocorrect can be wired in properly.

### Keyboard Shortcuts

#### Core Bindings **(Shipped v4.1.0)**

| Shortcut                                 | Action                                                          | Source                                                                               |
| ---------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `CMD/Ctrl+Z`                             | Undo (history)                                                  | CM6 default                                                                          |
| `CMD/Ctrl+Shift+Z`                       | Redo                                                            | CM6 default                                                                          |
| `CMD/Ctrl+X` / `C` / `V`                 | Cut / Copy / Paste                                              | CM6 default (Paste goes through `pastePlainText` handler)                            |
| `CMD/Ctrl+A`                             | Select All                                                      | CM6 default                                                                          |
| `CMD/Ctrl+F`                             | Find HUD                                                        | CM6 default                                                                          |
| `Tab`                                    | Insert 2 spaces (no smart-list logic)                           | v1 spec carried forward *(source: docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:138-140)* |
| `Arrow keys`                             | Move cursor; Option-arrow word jump; CMD-arrow line ends        | macOS-standard                                                                       |
| `Shift + movement`                       | Selection                                                       | macOS-standard                                                                       |
| `CMD+S`                                  | Force save (debounce override) — intercepts browser save dialog | `src/editor.ts` keymap                                                               |
| `CMD+Shift+S`                            | Save As (new file)                                              | `src/file-system.ts` via keymap                                                      |
| `CMD+O`                                  | Open file                                                       | `src/file-system.ts` via keymap                                                      |
| `CMD+N`                                  | New ephemeral temp window (`?id=temp-<random>`)                 | `src/file-system.ts` via keymap                                                      |
| `CMD+Shift+C`                            | Toggle spellcheck                                               | Compartment reconfigure                                                              |
| `Enter` on empty bullet                  | Exit list (strip marker)                                        | v4.0.0 custom Enter handler                                                          |
| `CMD/Ctrl+Click` on URL                  | Open link in new tab                                            | v4.1.0 `interactiveLinks()`                                                          |
| `CMD/Ctrl+Click` on anchor `[label](#h)` | Scroll editor to matching heading                               | v4.1.0 `interactiveLinks()`                                                          |

#### `Mod-s` Force-Save Intercept **(Shipped v4.1.0)** *(source: docs/THOT_APP.md:288-292, src/editor.ts)*

The default browser behavior on CMD+S is to open the browser's "Save Page As" dialog (offering HTML), which is useless for a scratchpad. Sean's complaint:

> Right now though it would be great if we could make it so that CMD + S just nudges a normal auto-save. Right now it opens a window more like save-as and you obviously can only save as HTML. My main reason for mentioning this is because I compulsively hit CMD + S and it opens a window every time. *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:298-300)*

Fixed in v2.0.x — the keymap intercepts `Mod-s` and calls `forceSave()` (immediate localStorage write, bypassing the 500ms debounce). No dialog. The compulsive save-press is now a no-op.

#### CMD+N — Ephemeral New Window **(Shipped v4.1.0)** *(source: docs/THOT_APP.md:135-138, docs/THOT_APP.md:288-292)*

CMD+N opens a new tab/window at `?id=temp-<6char-random>`. The persistence ID partitions `localStorage` so the new window has its own `thot:content:temp-xyz123` key — it does not collide with `main` and closing it doesn't affect the main pad. This addresses the v2.x bug where CMD+N opened a new browser window showing duplicate text *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:296)*.

#### CMD+O / CMD+Shift+S **(Shipped v4.1.0)** *(source: docs/THOT_APP.md:436-441, docs/archive/v3_0/v3_USABILITY_TESTING.md:89-97)*

`Mod-o` opens an existing markdown file; `Mod-Shift-s` saves the current document. Both:
- Use `showOpenFilePicker` / `showSaveFilePicker` on Chrome desktop (File System Access API)
- Fall back to `<input type="file" accept=".md, .txt">` for opening and `<a download="filename.md" href="blob:...">` for saving on Safari / iOS
- The polyfill fallback is the mandatory baseline; the progressive enhancement adds the file-handle round-trip on supported browsers.

#### Custom Enter Handler — Exit List on Empty Bullet **(Shipped v4.1.0, with documented quirk)** *(source: docs/archive/v4_0/v4_0_0_BUILD.md:270-326)*

A custom keybinding **before** the `Mod-s` binding in the keymap array. On Enter:

1. Resolve current syntax node, walk up to find a `ListItem` context.
2. If the line's trimmed text matches `^[-*+]\s*$|^\d+\.\s*$` (an empty bullet — marker only), dispatch a change that empties the line, exiting the list. Return `true` to consume the keypress.
3. Otherwise return `false` to fall through to default Enter behavior (which CM6 + lang-markdown handle as "new bullet on next line").

This was the v4.0.0 ship of quirks 1 and 3 from Sean's list-blank-line spec. Quirk 2 (multi-item list with manual blank lines auto-propagating blanks) was a documented defer-to-v4.0.1 BUGS gate — not addressed in v4.0.0. See **List Item Behavior** section for the full spec.

---

## List Item Behavior

This section captures the full spec for how Return / Enter should behave on list items, the sub-list-rejoin behavior, and the open question of how `closeBrackets` should interact with markdown-marker wrapping when the cursor or selection is inside a list.

### Line-Spacing Variations — The Broken Return Behavior **(Shipped, with known gaps)**

Sean's verbatim spec (this is the single most-referenced list-behavior writeup and should be carried forward intact):

> ### Line Spacing Variations
>
> - In various circumstances hitting return at end of list item adds double space
> - In other circumstances it adds single (good) but hitting return again moves list item bullet down a line (bad)
> - In every instance hitting return on the proposed auto next line of a list should remove bullet/number
> - It is unclear why these three behaviors occur in the various instances they do inconsistently
>
> 1. **List item end return adds single space**
>    - Preferred *every instance* behavior
>    - Return after any list item
>    - Bullet point or number is initially presented
>    - Hit return again and line changes to plain text
>    - This means the second return makes the bullet point/number disappears
>    - This means the second return doesn't move the cursor down a line
>    - *EXCEPTION* when it is an ongoing list and cursor is ending a sub-list item
> 2. **List item end return adds double space**
>    - There is *NO instance* where this should happen
>    - Hitting return at end of list item adds next bullet point/number with a line space between list items
>    - Don't add if it is only one list item and return is ending it
>    - Don't add even if there are double spaced lists in the document above
> 3. **List item end return adds single space, but subsequent return adds double**
>    - There is *NO instance* where this should happen
>    - Hitting return at end of list item adds next bullet point/number with no line space as expected
>    - Next return maintains the bullet point/number by adding a line space
>    - This is when expected behavior is that the icon disappears or downgrades if in a sublist

*(source: docs/archive/v4_0/FEATURES_BEHAVIORS.md:189-213, copied verbatim per spec)*

#### Desired Model

Boiled down (per the v4.0.0 IMPLEMENT framing):

> Desired model: Enter after content = new bullet. Enter on empty bullet = exit list. Manual blanks don't persist as auto-spacing. *(source: docs/archive/v4_0/v4_0_1_IMPLEMENT.md:213)*

#### Three Quirks Mapped to Implementation Status

| Quirk                                                                                                                                     | Status                                                                                                                                                    | Notes |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1. Single bullet → Enter twice should exit, currently creates blank + new bullet.                                                         | **Shipped v4.0.0** — custom Enter handler matches `^[-*+]\s*$\|^\d+\.\s*$` and strips marker.                                                             |
| 2. Multi-item list with manual blank lines: typing Enter after second item auto-adds blank before new bullet (should NOT auto-propagate). | **Spec'd, not shipped** — explicitly deferred to v4.0.1 BUGS off-ramp per BUILD spec. Likely entangled with `indentOnInput`; may need different fix path. |
| 3. Desired model fully enforced.                                                                                                          | **Partially shipped** — quirks 1 fix delivers most of model; quirk 2 fix delivers the rest.                                                               |

From the BUILD_REPORT v4.0.0:

> Empty bullet Enter strips marker. Quirk 2 not triggered in tests. *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:74)*

So the empty-bullet-exit ships and works. Quirk 2 (auto-propagating manual blank lines) was not reproduced during testing and was not fixed; it remains an open follow-on.

#### Root Cause Analysis (for future fix sessions) *(source: docs/archive/v4_0/v4_0_1_IMPLEMENT.md:215)*

> Root cause: the markdown extension's bundled list keymap + `indentOnInput` together create the WYSIWYG-flavored continuation. No custom Enter handler exists in `src/editor.ts`.

The v4.0.0 custom Enter handler addresses quirk 1 cleanly. For quirk 2, the fix likely requires either rebinding `indentOnInput` or replacing the markdown extension's continuation logic with a custom one — and that's where it tangles with general indent UX.

### Exception: Rejoining Sub-Lists **(Shipped v4.1.0)** *(source: docs/archive/v4_0/FEATURES_BEHAVIORS.md:215-224)*

> **NOTE**: This behavior is currently functional and should not be lost when adjusting behavior to accommodate the above line-spacing issue.
>
> - When creating lists with sub-lists that are each started on next line and a tab in from parent list
> - Hitting return to end a list item sub-list should downgrade hierarchy
> - Each downgrade to parent-lists change the indicator, bullet type or number, to match parent list
> - Behavior is that you are "rejoining" a parent list
> - Each time return demotes through hierarchy until top parent-list
> - Which is when the normal return list-end occurs

So with `- A\n  - B\n  - C` and the cursor at the end of `C`:

1. Press Enter → cursor on new sub-list line indented under `A`, with the same sub-list marker as `C`.
2. Press Enter on empty sub-list item → downgrade: the marker changes to the parent list's marker style and indent.
3. Continue Enter-ing → keeps walking up the hierarchy until the top parent list.
4. Final Enter on the empty top-level marker → exits the list entirely (normal return list-end).

This is the v4.0.0 custom Enter handler's "fall-through to default Enter" plus CM6 lang-markdown's continuation logic doing the right thing. **CRITICAL** that any future change to the empty-bullet exit logic preserve this behavior.

### Paired-Delimiter Gap for Markdown Syntax Wrapping **(Spec'd, not shipped)** *(cross-ref: Editor Foundation § Shift-Marker Wrapping)*

The bullet/number-list-item context is where Sean most often wants markdown wrap behavior to fire:

- Inside a list item, highlight a word and tap `*` → wrap with single `*` (italic).
- Tap `*` again → promote to `**word**` (bold).
- Highlight a word and tap `~` twice → strikethrough.

The current `closeBrackets` ships with `*`, `_`, `~` NOT in its delimiter set. This is partly intentional (those characters are also valid mid-word in non-list contexts and `closeBrackets` doesn't have a context-aware suppression layer), but the missing behavior is one of Sean's "I use this CONSTANTLY" features.

**Implementation pointer for v5 (or v4.0.1 if scoped tightly)**: a custom `EditorState.transactionFilter` that detects:
1. A non-empty selection.
2. The next typed character is one of `*`, `_`, `~`, `<` (not yet `` ` `` — that's already handled by `closeBrackets`).
3. The character pressed maps to a markdown wrap: insert the marker on both sides of the selection. If the selection is already wrapped in single-marker, promote to double-marker on the second press.

### Bullet vs Numbered Marker Color Differentiation **(Shipped v4.1.0)**

The visual differentiation between bullet and numbered lists is part of the foundation (carried in highlight palette), but worth restating in the list-behavior section:

| Element                       | Color                   | Weight        | Notes                                                                                                                                                            |
| ----------------------------- | ----------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bullet marker (`-`, `*`, `+`) | `#dfc532` (gold)        | Bold (700)    | v2.0.8 custom `bulletMarkTag`                                                                                                                                    |
| Bullet content                | `#8aeefb` (cyan)        | Regular (400) | Restricted in v4.0.0 to `BulletList/ListItem/Paragraph` only (no bleed)                                                                                          |
| Numbered marker (`1.`, `2.`)  | `#ff6b6b` (red)         | Bold (700)    | v2.0.8 custom `orderedMarkTag`                                                                                                                                   |
| Numbered content              | `#f8a5c2` (pink)        | Regular (400) | Same restriction as bullet content                                                                                                                               |
| Checkbox `[ ]` open           | `#8BE9FD` (cyan)        | Regular (400) |                                                                                                                                                                  |
| Checkbox `[x]` checked        | `#5A7DB8` (darker blue) | Regular (400) | **Spec'd in v4.0.0 — does NOT visibly render** due to cascade specificity. Deferred to v5 scope rebuild. *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:44)* |

### List Content Bleed Onto Following Lines **(Shipped v4.1.0, partial fix)** *(source: docs/archive/v4_0/v4_0_0_BUILD.md:246-267, docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:46)*

Bug: `- one\n- two\n\nThis should not be cyan.` rendered the trailing line in cyan.

Root cause: styleTags used the deep-inherit operator `BulletList/...` which matches ALL descendants — including paragraphs CommonMark's lazy continuation places under the list node.

Fix in v4.0.0: restrict to direct list-item paragraphs:

```ts
'BulletList/ListItem/Paragraph': bulletContentTag,
'OrderedList/ListItem/Paragraph': orderedContentTag,
```

**Side effect (accepted by Sean per BUILD_REPORT)**:

> Tight lists (no blank lines between items) don't wrap inline content in `Paragraph`, so their list-item text lost the cyan/pink content tag. Sean's explicit call: the bleed fix is the priority; the inline-color side effect is acceptable v5 work, do not revert. *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:46)*

So in v4.1.0:
- Bleed beyond list ✓ fixed
- Tight-list inline content color ✗ regressed (foreground white instead of cyan/pink)
- Both clean in v5 scope rebuild

### Frontmatter Mis-Tagging in List Contexts **(Cancelled — see v5 scope rebuild)** *(source: docs/archive/v4_0/v4_0_0_BUILD.md:98-117, docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:42)*

Bug repro: in a numbered list, hit return for sub-bullet → delete auto-number → type `-` and space → the hyphen renders in the orange/bold frontmatter style.

The v4.0.0 BUILD attempted a `DocumentMeta: tags.processingInstruction` remap, but BUILD_REPORT revealed:

> `@lezer/markdown` does not emit `DocumentMeta` at all — that tag only fires for HTML/XML `DoctypeDecl`. The styleTag entry we added is inert (does nothing for markdown content). The real root cause is SetextHeading2 — a `---` line after a paragraph promotes the paragraph to H2 per CommonMark. The styleTag entry was left in (inert) per Sean's call to "leave as-is, fix properly in v5." *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:42)*

So this is a CommonMark spec compliance issue: a paragraph followed by `---` becomes a Setext H2. The fix is a UX preference call — should Thot inhibit Setext promotion in favor of HorizontalRule? — and lives in v5 scope research.

---

## Line Number Column & Gutter

### Overview **(Shipped v4.1.0, polished in v4.0.0)**

The line-number column is the leftmost gutter, monospaced to match the editor surface, with its width and padding tuned to match what IDEs do. The shipped behavior is the result of an interesting journey across v3 and v4 where multiple CSS approaches were tried before landing on the current solution.

### Selective Digit-Responsive Spacing Behavior **(Shipped v4.0.0)**

Sean's spec, verbatim (carry forward intact):

> + **Static Spacing**
>   - For 1-digit, 2-digit, 3-digit line count numbers
>   - Maintain current width/display/behavior up to 3-digit line count
>   - The spacing is already there to accommodate 3-digit numbers
>   - The same spacing remains for 1-digit and 2-digit numbers
>
> + **Adaptive Spacing**
>   - For 3-digit or more line count numbers
>   - Each line count digit added after this point should nudge the width the column takes up wider
>   - This should push the text over to make room for all 4-digits and comma to be visible
>
> + **Logic Note**
>   - This is not the behavior we have now or want for line digit count through any 3-digit line count totals
>   - This shift is not a pleasant UX that we'd want to occur regularly
>   - Only when moving from 3-digit (999) to 4-digit (1,000), then 4-digit to 5-digit, etc. forever up higher
>   - These are infrequent UX instances due to the quantity of lines required
>   - Acceptably infrequent UX that is preferable to the alternative(s)
>   - Alternatives being either keeping a huge margin or text body shifting for every digit-wide count
>
> + **SEE SCREENSHOT**
>   - Shows current visibility of any line count number with 4 or more digits
>   - `docs/archive/images/4-digit-line-count-number.jpg`

*(source: docs/archive/v4_0/FEATURES_BEHAVIORS.md:107-130, carried forward verbatim)*

### Shipped Implementation **(Shipped v4.0.0)** *(source: docs/archive/v4_0/v4_0_0_BUILD.md:67-95, docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:36-39)*

Width tokenized to a CSS custom property so v6 preferences UI can adjust it without code changes.

**`src/styles/main.css`** — `:root` definition added immediately after `@font-face` declarations:

```css
:root {
  --thot-line-number-width: 16px;
}
```

**`src/theme.ts`** — `.cm-lineNumbers .cm-gutterElement` rule (final shipped form per BUILD_REPORT 44c6529 + 92c1868 follow-ups):

```ts
'.cm-lineNumbers .cm-gutterElement': {
  width: 'var(--thot-line-number-width, 16px)',
  minWidth: '25px',
  padding: '0',
  alignContent: 'flex-start',
},
```

The Phase 2 BUILD spec only tokenized `width`. Two regressions surfaced and were fixed in follow-up commits:

1. **Wrapped-line numbers rendered on the SECOND visual row** because `align-content: flex-end` was anchoring to the bottom. **Fix (44c6529)**: changed to `align-content: flex-start`.
2. **Column shifted at the 99→100 line boundary** because CM's default `min-width: 20px` only holds 2 digits. **Fix (44c6529)**: set `min-width: 25px` on our rule.
3. **With 25px column + CM base `padding: 0 3px 0 5px` (8px inline) + `text-align: right`, the third digit was clipped and visually centered**. **Fix (92c1868)**: `padding: 0` on our rule.

Per the BUILD_REPORT: *Sean confirmed perfect across 99→100→101 boundary.* *(source: docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:67)*

### Left & Right Padding **(Shipped v4.0.0)**

Sean's spec for padding behavior, verbatim:

> + **Left Padding**
>   - The spacing with padding behavior right now is perfect
>   - This is the space between 1, 2, 3-digit line count numbers
>   - When the above adaptive behavior occurs, this left padding stays the same
>   - Meaning the space for even 4-digit and wider line count numbers have same left padding
>   - This is referencing space all the way to the edge of the app container
>
> + **Right Padding**
>   - There is currently very little space between line numbers column and text editor column
>   - We should add about as much space as is maintained on the left of the line number column
>   - This space is maintained in higher 4+ digit line count number shifts that nudge editor over
>   - This space looks empty but upon hover at certain lines, an upside-down carrot v-shape dropdown opener
>
> + **SEE SCREENSHOT**
>   - Current padding in live app
>     `docs/archive/images/line-count-column-padding-1-current-space.jpg`
>   - Example of padding after change
>     `docs/archive/images/line-count-column-padding-2-desired-after-update.jpg`

*(source: docs/archive/v4_0/FEATURES_BEHAVIORS.md:132-151, carried verbatim)*

### Collapsing Range of Lines **(Spec'd, not shipped)** *(source: docs/archive/v4_0/FEATURES_BEHAVIORS.md:153-162, carried verbatim)*

Sean's spec:

> - On desktop, only appears when cursor hovers next to applicable line with range
> - Lines with range include headings or the list item of a parent-list with any number of sub-lists
> - Clicking the icon collapses the range, hiding it from view
> - Icon remains visible only for collapsed ranges
>
> + **SEE SCREENSHOTS**
>   - Shows different types of sublists with range, icon visible, and collapsed ranges
>   - `docs/archive/images/collapsing-range-of-lines-{1-7}.jpg`

CM6 provides `@codemirror/language` `foldGutter()` extension which renders fold markers in a dedicated gutter. The visual styling would need to be customized to match the spec (caret iconography, hover behavior, right-side placement). The fold ranges themselves come from the markdown parser — heading ranges are well-supported; list-item ranges may need a custom fold service. v4.3.0-ish candidate (or could be folded into v4.2.0 alongside heading stacking).

### Colored Line Number Indicator — Edit/Add State **(Spec'd, not shipped)** *(source: docs/archive/v4_0/FEATURES_BEHAVIORS.md:164-183, carried verbatim)*

Sean's spec:

> + IDE standard behaviors
>   - These are two of the various color and/or pattern indications that show up next to line number
>   - They both remain showing an edited or added line until a git push
>   - The editor in the IDE still auto-saves and if you close the app and reopen it, indicators persist
>
> + For our app
>   - We want these line indicators to show until a manual save
>   - Manual save should be defined as a save from the menu or command+S
>   - However, they should not persist after a fresh app re-open
>
> + Other indicators
>   - This example shows green for added lines and another color/pattern for edited lines
>   - Please research to see what other line indicators today's current IDEs use
>
> + **SEE SCREENSHOT**
>   - Arrow with a circled 1 points to green color indicator for added lines
>   - Arrow with a circled 2 points to blue striped indicator for editor lines
>   - `docs/archive/images/line-edit-color-indicator-example.jpg`

| Line State                                  | Indicator                        | Persistence                    | Cleared by              |
| ------------------------------------------- | -------------------------------- | ------------------------------ | ----------------------- |
| New line added since last manual save       | Green color bar/stripe in gutter | Until next CMD+S / File → Save | CMD+S or fresh app open |
| Existing line edited since last manual save | Blue striped pattern in gutter   | Until next CMD+S / File → Save | CMD+S or fresh app open |
| Line unchanged since last manual save       | No indicator                     | —                              | —                       |

Distinction from IDE behavior:
- **IDEs**: indicators persist across app re-opens (until git commit/push).
- **Thot**: indicators clear on fresh app re-open (no git concept yet; "manual save" is the equivalent boundary).
- **Thot's autosave is invisible**: continuous debounced localStorage write doesn't clear indicators. Only the explicit CMD+S / menu-Save resets them.

Research items called out in the spec: VSCode uses green vertical bar (added) and blue vertical bar (modified); JetBrains IDEs use green stripe (added), blue stripe (modified), gray stripe (removed). Recommendation: match VSCode (green/blue) for the v1 of this feature, with the v6 preferences UI exposing color customization.

---

## Mobile-Specific UX

### Priority: iPad First, iPhone Second **(Shipped v4.1.0)**

> We don't yet have a mobile test environment yet. Should note that iPad is way more important than mobile. *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:282-285)*

Mobile work in v3 was deliberately scoped to "make iOS PWAs not embarrassing" rather than "build a great mobile editor." The great mobile editor is a vNext concern that lands with the native iOS wrapper.

### Bottom Padding — `padding-bottom: 30vh` **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_USABILITY_IMPL.md:48-49)*

**Problem**: when the cursor reaches the last line of a document, the keyboard covers the bottom of the viewport.

**Fix**: 
```ts
'.cm-content': { paddingBottom: '30vh !important' }
```

`30vh` (30% of viewport height) gives enough buffer for the iOS keyboard's reasonable max height plus comfortable cursor headroom.

### Line-Number CSS — Mobile Layout Constraint **(Shipped v4.0.0)**

Originally flagged in v3 as a "mobile layout" issue, but Sean clarified:

> The issue with the numbered lines nudging over with each new number is ALL DEVICES. This is listed under the 'Mobile Layout Constraints' heading, but it is notable on desktop. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:62-66)*

See **Line Number Column & Gutter** section for full detail. Mobile and desktop share the exact same gutter behavior.

### iOS Predictive Text Disabled — `autocorrect: "off"`, `autocapitalize: "off"` **(Shipped v4.1.0, with backlash)**

#### What it does **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_USABILITY_IMPL.md:46-48)*

```ts
EditorView.contentAttributes.of({
  autocorrect: "off",
  autocapitalize: "off"
})
```

To prevent the iOS predictive text bar from appearing.

#### Sean's pushback **(Shipped, with known gaps)** *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:50-71, 184-208)*

Sean wanted **autocorrect and autocapitalize ON** on mobile, just NOT the iOS predictive-text bar:

> The update document detailed how *desperately* we need both of these on mobile and tablet, which you'll see in the notes below. We *also* want them *on* for the desktop app; in various settings (browsers, desktop app) the settings do not reflect actual settings. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:51-54)*

> there nott autocorrectting at all still on movilw. weird. it wants. it doesn't underline mispellings. but quen i tap one i can change it. not that that is helpful unless it is an obvious misspelling. what we really need though is the autocorrwct. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:181-194)*

> most notable is of course the lack of the initial cap for a new sentence. maybe this is just turned off because it is a "code" editor and we just happen to be using it more specifically for word processing. regardless. very necessary. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:198-206)*

The tradeoff:
- Setting `autocorrect: "off"` and `autocapitalize: "off"` is what suppresses the unwanted iOS predictive-text bar.
- BUT it ALSO suppresses iOS's native autocorrect and auto-capitalization.

The partial answer: the **custom autocorrect engine** covers the most common typos including contractions, so the user-perceived gap is narrowed. The remaining gap: long-tail typos that iOS native autocorrect would catch are NOT corrected on Thot mobile. **Long-term resolution**: the native iOS shell in vNext can use proper iOS autocorrect APIs without summoning the predictive-text bar inside a WKWebView.

### iOS Predictive Text Bar — The "Form-Field" Confusion **(Shipped, with known gaps)** *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:212-220)*

> srill got this weird bar above the predictive text options. it is usualy only for filling out FORMS — the up and down arrows on the left to choose between emails and the check mark to approve the form field text entered and move on. so iy seems like for some reason on mobile safari it thinks this text field is being treated like a form field.

iOS Safari quirk where `<form>`-adjacent `contenteditable` elements get the form navigation UI. Mitigation patterns: ensure editor's `contenteditable` is NOT inside a `<form>` element, use `inputmode="text"` on parent containers, apply ARIA `role="textbox"`. Unfixed in v4.1.0; candidate for v4.0.1 mobile polish or vNext native shell.

### Share Sheet — Web Share API + Custom Button **(Shipped v4.1.0)** *(source: docs/archive/v3_0/v3_USABILITY_IMPL.md:50-51)*

**Problem**: standalone iOS PWAs do NOT have Safari's native share button. A custom share button is required.

**Fix**: a floating "Share" button (top-right of viewport) that calls:

```ts
navigator.share({
  title: docTitle,
  text: docContent,
  url: window.location.href
})
```

#### Known gaps **(Shipped, with known gaps)** *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:232-247)*

1. **Mobile share sends only URL, not content**:

> I just tried using the share button from mobile Safari and AirDrop to my computer and it just opened the IP URL and it doesn't have any of the content that I was typing. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:226-228)*

The likely cause: iOS share sheet treats `url` + `text` differently per recipient app. AirDrop, Messages, and Mail prefer the URL when both are provided. To force content-sharing on mobile, the Share API call needs to either omit `url` entirely or use file-based sharing.

2. **Share button only visible on localhost, not on IP-preview** — dev-environment artifact. Production deploy at `thots.august.style` has the share button on mobile.

### Touch Handlers — Cursor Placement & Highlighting **(Spec'd, not shipped)** *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:262-272)*

Sean's mobile-cursor frustration:

> I don't know if there's anything we can do about this, but it is incredibly difficult to paste or even hold down and move the cursor on mobile. Every tap it responds by either entering in to edit text or exiting the text editing stance.

And:

> is it possible for us to change that so that you have to tap three times. I don't know if three times is the norm in other applications. I do know that I always tap it three times. or at least twice.

Mobile-touch UX needs: tap once focuses editor (stays in "navigate mode"); tap twice or two-finger places cursor; tap three times or long-press enters edit mode; standard iOS selection / context menu via long-press. Substantial mobile-UX rework not yet attempted. Filed for vNext native iOS shell consideration.

#### Selection visibility on mobile

> we should change the highlight color because it is this very transparent faded green on top of the charcoal background so when text is highlighted, it is very difficult to see if it highlighted the whole word or not on mobile especially. *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:272)*

**Spec for v4.0.1 or v5**: increase selection background opacity on mobile (and likely desktop too).

### Cross-Window Sync on Mobile **(Cancelled — see v3.1.2 single persistent main draftpad)**

Sean's direct quote on the desired model: *Syncing content in new tabs of the same browser or new windows of the desktop app was the previous behavior which has no use-case I can think of. Do not sync dynamically.* *(source: docs/archive/v3_0/v3_USABILITY_TESTING.md:55-58)*

Shipped model: one persistent `main` draftpad; CMD+N opens an ephemeral temp window at `?id=temp-<random>`; temp windows don't sync content with `main` and don't sync among themselves. Cross-device sync is deferred to vNext.

### PWA Install Behavior **(Spec'd to be REMOVED)**

Sean's call: do not promote PWA installation. The native shells in vNext are the canonical "installed" experience. Until those land, PWA install muddies the upgrade narrative. To remove: PWA install banner, "Install this app" button if present, the `beforeinstallprompt` event handler (or call `preventDefault()` and never re-prompt).

### iPad-First Priority **(Shipped v4.1.0, ongoing focus)**

iPad considerations distinct from iPhone:
- **Larger viewport** scales gutter, paddings, fonts more comfortably; the bottom-padding `30vh` is less obstructive.
- **Hardware keyboard usage** is much more common on iPad — CMD+S, CMD+O, CMD+Shift+S, CMD+N shortcuts all need to work with an external keyboard.
- **Touch + keyboard hybrid** — iPad users frequently switch between touch and keyboard.
- **iPadOS share sheet** — same Web Share API on iPad as iPhone, but the resulting UI is iPad-shaped.
- **Apple Pencil** — currently not handled. The vNext native iPadOS shell will offer PencilKit overlay for annotation.

No iPad-specific code branches today. The behavior is responsive-CSS-driven; the same `padding-bottom: 30vh`, `min-width: 25px` gutter, and content attributes apply on all touch surfaces.

---

## Counters & Productivity

Counters are the small-but-loved productivity nugget in Thot. They're not on the v4.1.0 ship list but are well-spec'd from v2.0.0.

### Word, Character, Token Counter **(Spec'd, not shipped)** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:255-276)*

Sean's full spec, verbatim:

> #### Counter for Words, Characters, Tokens
>
> * **This is important for my normal use**
>
>   + It should include:
>     - Word count
>     - Character count with spaces (I've never encountered a need for without though if weird to do one and not the other then add both)
>     - Token count (probably the most important these days)

Three numbers:

1. **Word count** — standard word count. A "word" is a sequence of non-whitespace characters separated by whitespace. Recommend stripping markdown syntax for word count; the count should reflect prose word count, not raw source word count.
2. **Character count with spaces** — total characters including spaces.
3. **Token count** — LLM-token count. Highest-value number for AI-era users. Implementation should use `tiktoken` (OpenAI's tokenizer) as the de facto standard for "approximate AI-token count" — runs in browser via WASM.

#### Placement — Consider Native vs Web *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:264-275)*

> Consider timing of means of adding based on PWA SwiftUI Wrapper note. I'm thinking we'll probably want to add the planned UI using SwiftUI because it add weight to our use of PWA — so we should either just add the functionality and keep it out of the way — or place it on status bar as things stand now. Out of way might look like a menu like "File" or "View". Could just be "Count". It would show all four count types at once nicely labeled and separated. Nothing else in that menu. Updates live so anytime User looks it would be accurate. Clicking on any one of the four counts would copy that number.

Placement options: status bar (always visible, low-friction glance), menu item ("Count" or "View → Count" opens a popover/dropdown), or both.

#### Live Updating & Click-to-Copy **(Spec'd)**

Numbers update as the user types via a CM6 `EditorView.updateListener` that recomputes on `update.docChanged`, throttled to ~150ms. Token count should debounce more aggressively (500ms+), and display a "stale" indicator (e.g., `~1,234` with the tilde) when there's been a recent edit and recompute hasn't completed. Clicking any of the three numbers copies that number to clipboard via `navigator.clipboard.writeText(count.toString())`.

#### Status Bar Considerations

If the counter lives in a status bar, the status bar would also be a natural home for:
- Current file name (when a file is open)
- Save status (saved / unsaved indicator)
- Cursor position (line, column)
- Spellcheck enabled/disabled indicator
- Mode (markdown / prose / plain) — relevant in v5+ when auto-detection lands

This implies the status bar is its own component to design, not just a counter container. **Spec status: needs UX design pass** before promoting to BUILD.

### "Subtle Save Indicator" **(Spec'd, deferred)** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:281)*

> "subtle save indicator" can be delayed for SwiftUI

Deferred because the autosave is instant (500ms debounce) — users rarely have meaningfully unsaved state.

### Print to Simple PDF **(Spec'd, not shipped)** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:303-307)*

> I want to start this off SUPER simple by basically making it the markdown without the markup notation, solid text colors, different size for headers. But otherwise we don't really need to mess with spacing or even the font.

Two print modes:
1. **As-displayed**: print the editor view with full highlighting (for code reference / debugging context).
2. **Clean prose**: strip markdown markers, render as a document.

Implementation: a print-only CSS stylesheet plus a small DOM transform that renders the markdown into a hidden print container that `@media print` styles target.

### Export / Import / Save / Open **(Shipped v3.1.0, with refinements)** *(source: docs/archive/v2_0/v2_0_0_FEEDBACK.md:289-301)*

Sean's original framing was strongly anti-"Export/Import" wording:

> I'm not a fan of 'clear content' — Feels weird to have a "clear content" button at all. "Export" and "Import" are just confusing and shouldn't be done until we plan save/open. Does it make more sense to use native file system tools in SwiftUI wrapper.

Shipped terminology uses **"Open"** and **"Save As"** — not "Import" / "Export". This is canon.

### Counter Status by Version

| Feature                           | Status                         | Target                        |
| --------------------------------- | ------------------------------ | ----------------------------- |
| Word count (live)                 | **Spec'd, not shipped**        | v4.0.x polish or v5           |
| Character count with spaces       | **Spec'd, not shipped**        | Same                          |
| Token count (via `tiktoken` WASM) | **Spec'd, not shipped**        | Same                          |
| Click-to-copy on any count        | **Spec'd, not shipped**        | Same                          |
| Status bar placement (vs menu)    | **Concept, needs design pass** | v5+                           |
| Subtle save indicator             | **Spec'd, deferred**           | v5+ or vNext                  |
| Print to simple PDF               | **Spec'd, not shipped**        | v4.x or v6                    |
| Cursor position indicator         | **Concept**                    | Bundled with status bar       |
| CSV → markdown table on paste     | **Concept**                    | v6+                           |
| Token-cost estimator              | **Concept**                    | vNext (alongside AI features) |

The counter set itself (word, char, token + copy) is the single highest-value v4.x candidate — small surface area, frequently-used, fits the "every IDE has this, Thot should too" framing.

<!-- ============================================================ -->
<!-- WRITER B OUTPUT — Semantic Highlighting & Theme,             -->
<!-- Intelligent Formatting, Heading Stacking                     -->
<!-- ============================================================ -->

## Semantic Highlighting & Theme

**Status overview**: Shipped as v4.1.0's tri-system (Lezer `styleTags` + `HighlightStyle` cascade + sidecar `ViewPlugin` for 3 context-dependent marker cases). v5 will replace this with a flat scope-keyed system on top of Lezer. The recommended path is locked: Option A (scope/cascade rewrite, stay on Lezer) + Option B2 (regex-driven prose-mode highlighter as second pass) per `docs/research/1_DEEP/highlighter-architecture/OPTIONS.md`.

### Current Implementation — the Tri-System (Shipped v4.1.0)

The runtime highlighter is three cooperating mechanisms, each papering over a limit of the others. The full architecture is captured in `docs/THOT_APP.md` § *Architecture Explained* and was forensically rebuilt during v2.0.8 (source: `docs/archive/v2_1/UPDATE_v2_1_0.md` and `docs/archive/v2_0/v2_0_8_DEV_PLANNING.md`).

**Three concerns:**

1. **`HighlightStyle.define()` in `src/theme.ts`** — the syntax-tag → CSS mapping. Generates single-class CSS rules in array order. **When the Lezer inherit mechanism places two CSS classes on the same `<span>`, the LATER CSS rule in the stylesheet wins**, so the array is ordered LOW priority first, HIGH priority last (`v2_0_8_DEV_PLANNING.md:13-18`).
2. **`styleTags()` overrides in `src/editor.ts`** — path-based tag assignment so markers and content can have distinct or matching colors. Uses two operators: exact (`'NodeName': tag`) and inherit-through-descendants (`'Parent/...': tag`).
3. **A targeted `ViewPlugin` (`markerDecorations` in `src/editor.ts:55-129`)** — handles three context-dependent marker cases that Lezer's tag system cannot express because the default parser pre-tags markers as `tags.processingInstruction` at depth=0, and `combine()` merges base + extension rules placing depth=0 rules first (`THOT_APP.md:166`, source-cited at `@lezer/highlight/dist/index.js:246-263`). The three cases:
   - `ListMark` inside `BulletList` → gold (`.thot-bullet-mark`)
   - `ListMark` inside `OrderedList` → red (`.thot-number-mark`)
   - `CodeMark` inside `InlineCode` → red-orange (`.thot-inline-code-mark`)
   - As of v4.0.0.4 a fourth case was added in the same plugin: `TaskMarker` containing `[x]` or `[X]` → darker checkbox color (decoration constant `checkboxCheckedDeco`). Source: `v4_0_0_BUILD.md:122-149`. **Note**: BUILD_REPORT v4.0.0 found this branch does not visibly apply — the inline-style decoration is out-specificity'd by the `tags.atom` HighlightStyle rule. Deferred to v5 (`BUILD_REPORT_v4_0_0.md:44, 56`).

**Why depth-1 path matches beat depth-0:** The default markdown parser tags ALL markers as `tags.processingInstruction` at depth=0. A wildcard like `'Emphasis/...'` creates inherit rules on the parent node, NOT higher-specificity rules on the markers themselves. Path-based matches like `'Emphasis/EmphasisMark'` resolve at depth=1, which beats depth=0. Source: `v2_0_8_DEV_PLANNING.md:6`.

**Single source of truth**: `src/highlight-tags.ts` carries the entire colors object (~100 entries) plus the custom Lezer tag definitions. After v2.0.8 the prior `src/theme-reference.ts` was moved to `docs/archive/v2/old-theme-ref.ts` to enforce this. Source: `UPDATE_v2_1_0.md:538`.

### Custom Lezer Tags (5 total)

The built-in Lezer tag vocabulary cannot differentiate bullet vs ordered lists, or table parts as a unified group. We define our own with `Tag.define()` from `@lezer/highlight`:

| Custom tag          | Purpose                                                    | Source                |
| ------------------- | ---------------------------------------------------------- | --------------------- |
| `bulletMarkTag`     | Bullet list markers `-`, `*`, `+`                          | `UPDATE_v2_1_0.md:25` |
| `orderedMarkTag`    | Ordered list markers `1.`, `2.`, `3.`                      | `UPDATE_v2_1_0.md:26` |
| `bulletContentTag`  | Text content inside bullet list items                      | `UPDATE_v2_1_0.md:29` |
| `orderedContentTag` | Text content inside ordered list items                     | `UPDATE_v2_1_0.md:30` |
| `tableTag`          | Unified table coloring (pipes, headers, cells, delimiters) | `UPDATE_v2_1_0.md:34` |

These are applied via `styleTags` inherit rules: `'BulletList/ListItem/ListMark': bulletMarkTag`, `'OrderedList/ListItem/ListMark': orderedMarkTag`, `'BulletList/ListItem/Paragraph': bulletContentTag` (after the v4.0.0.7 fix), `'OrderedList/ListItem/Paragraph': orderedContentTag`, `'Table/...': tableTag`.

### Complete Color Palette

The palette comes from three nested layers of history. **CONFLICTS exist between layers**; the canonical current values are in `src/highlight-tags.ts` per the v2.0.8 rewrite (`UPDATE_v2_1_0.md:43-227`). Sean's reference TS file `docs/archive/resources/old-theme-ref.ts` was the original "accurate colors" reference and is also cited in `v2_1_4_BUGS.md`.

#### Editor Chrome

| Role                             | Value     | Source                                       |
| -------------------------------- | --------- | -------------------------------------------- |
| `bg` (background)                | `#1a1a1a` | `UPDATE_v2_1_0.md:45`, `old-theme-ref.ts:12` |
| `fg` (foreground / default text) | `#e6e6e6` | `UPDATE_v2_1_0.md:46`, `old-theme-ref.ts:13` |
| `selection`                      | `#44475a` | `UPDATE_v2_1_0.md:47`, `old-theme-ref.ts:14` |
| `cursor`                         | `#e6e6e6` | `UPDATE_v2_1_0.md:48`, `old-theme-ref.ts:15` |
| `gutter` (line-number column)    | `#6272a4` | `UPDATE_v2_1_0.md:49`                        |

#### Headings

| Role                              | Value              | Source                                                                                           |
| --------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `heading` (all 6 levels + marker) | `#FF9D00` (orange) | `UPDATE_v2_1_0.md:52`, `old-theme-ref.ts:18`, `ThotMarkdownTheme.json:25`, `TextMateRules.md:34` |

Style: ExtraBold (800). Heading marker (`#`) and heading content render identical color and weight (`v2_0_0_FEEDBACK.md:111-118`). Sean's explicit note: "I changed the headings so that they're the same size as the rest of the document. Please leave them this way" (`v2_0_0_FEEDBACK.md:323-325`).

#### Text Emphasis

| Role            | Value                           | Source / Notes                                                            |
| --------------- | ------------------------------- | ------------------------------------------------------------------------- |
| `bold`          | `#FFD866` (yellow)              | `UPDATE_v2_1_0.md:55`, `old-theme-ref.ts:21`, `ThotMarkdownTheme.json:36` |
| `italic`        | `#BF437F` (magenta)             | `UPDATE_v2_1_0.md:56`, `old-theme-ref.ts:22`                              |
| `strikethrough` | `#6272A4` (gray) + line-through | `UPDATE_v2_1_0.md:57`, `old-theme-ref.ts:23`                              |

**CONFLICT**: `ThotMarkdownTheme.json:47` lists italic at `#8aeefb` (cyan), and `TextMateRules.md:58` matches that cyan. The current `highlight-tags.ts` and `old-theme-ref.ts` both use magenta `#BF437F`. The cyan TextMate value appears to be a stale earlier value; the magenta is current.

Style notes: bold → ExtraBold (800); italic → ExtraBoldItalic (800i); strikethrough → Thin (100) with `text-decoration: line-through` (`UPDATE_v2_1_0.md:443`).

#### Code

| Role                                                | Value                    | Source / Notes                               |
| --------------------------------------------------- | ------------------------ | -------------------------------------------- |
| `inlineCode` (text + ` delimiters)                  | `#F34D3E` (red-orange)   | `UPDATE_v2_1_0.md:60`, `old-theme-ref.ts:26` |
| `fencedCodeDelimiter` (``` markers)                 | `#6767fc` (blue-purple)  | `UPDATE_v2_1_0.md:61`, `old-theme-ref.ts:27` |
| `codeBlockContent` (plain code-block text fallback) | `#8989e3` (light purple) | `UPDATE_v2_1_0.md:62`, `old-theme-ref.ts:28` |
| `codeLanguage` (language identifier after ```)      | `#F1FA8C` (yellow)       | `UPDATE_v2_1_0.md:63`, `old-theme-ref.ts:29` |

**CONFLICT**: `ThotMarkdownTheme.json:103` lists inlineCode at `#78de8c` (mint-green) and `TextMateRules.md:115` matches that. Current canonical is `#F34D3E` red-orange per `UPDATE_v2_1_0.md` and `old-theme-ref.ts` — the JSON green is from an even older theme version. **Color-correction note from v2.0.8**: the prior `theme.ts` had `blockCodeDelimiter: '#8989e3'` which was actually the code CONTENT color; the fix mapped `tags.processingInstruction → #6767fc` so the fenced delimiter is now correctly blue-purple (`UPDATE_v2_1_0.md:771-773`).

#### Links

| Role                                             | Value                                | Source                                       |
| ------------------------------------------------ | ------------------------------------ | -------------------------------------------- |
| `linkText` (`[text]`)                            | `#AB9DF2` (purple)                   | `UPDATE_v2_1_0.md:66`, `old-theme-ref.ts:32` |
| `linkUrl` (`(https://…)`)                        | `#8BE9FD` (cyan)                     | `UPDATE_v2_1_0.md:67`, `old-theme-ref.ts:33` |
| `linkTitle` (`"title"` in `[text](url "title")`) | `#AB9DF2` (purple, same as linkText) | `UPDATE_v2_1_0.md:68`                        |
| `referenceLink` (`[ref]: url` definitions)       | `#50FA7B` (green)                    | `UPDATE_v2_1_0.md:69`, `old-theme-ref.ts:34` |

Style: linkText → Bold (700) (`UPDATE_v2_1_0.md:395`).

#### Images

| Role                       | Value                        | Source                |
| -------------------------- | ---------------------------- | --------------------- |
| `imageAltText` (`![alt]`)  | `#AB9DF2` (same as linkText) | `UPDATE_v2_1_0.md:72` |
| `imageUrl` (`(image.jpg)`) | `#8BE9FD` (same as linkUrl)  | `UPDATE_v2_1_0.md:73` |

Image and Link share the same Lezer node structure (both use `LinkMark`, `URL`). The colors object reserves separate keys for future customization but maps to identical values today; future differentiation would use a ViewPlugin checking the parent node type. Source: `UPDATE_v2_1_0.md:803`.

#### Lists

| Role                                  | Value                   | Source / Notes                                                  |
| ------------------------------------- | ----------------------- | --------------------------------------------------------------- |
| `bulletMarker` (`-`, `*`, `+`)        | `#dfc532` (gold)        | `UPDATE_v2_1_0.md:79`, `v2_0_0_FEEDBACK.md:138`                 |
| `bulletContent` (bullet item text)    | `#8aeefb` (cyan)        | `UPDATE_v2_1_0.md:80`, `v2_0_0_FEEDBACK.md:140`                 |
| `numberedMarker` (`1.`, `2.`, `3.`)   | `#ff6b6b` (red)         | `UPDATE_v2_1_0.md:81`, `v2_0_0_FEEDBACK.md:139`                 |
| `numberedContent` (ordered item text) | `#f8a5c2` (pink)        | `UPDATE_v2_1_0.md:82`, `v2_0_0_FEEDBACK.md:141`                 |
| `checkbox` (`[ ]` open)               | `#8BE9FD` (cyan)        | `UPDATE_v2_1_0.md:83`, `old-theme-ref.ts:41`                    |
| `checkboxChecked` (`[x]` complete)    | `#5A7DB8` (darker blue) | Added v4.0.0.4 (`v4_0_1_IMPLEMENT.md:106`). **Reads as "done"** |

**CONFLICT**: `ThotMarkdownTheme.json` and `TextMateRules.md` listed bullet content at `#5feda4` (mint) and checkbox at `#50faad`. Current canonical values are the `UPDATE_v2_1_0.md` `#8aeefb` cyan / `#8BE9FD` cyan pair.

#### Block Elements

| Role                             | Value              | Source                                       |
| -------------------------------- | ------------------ | -------------------------------------------- |
| `blockquote` (`>` marker + text) | `#E6DB74` (yellow) | `UPDATE_v2_1_0.md:86`, `old-theme-ref.ts:44` |
| `horizontalRule` (`---`)         | `#93f9c6` (mint)   | `UPDATE_v2_1_0.md:87`, `old-theme-ref.ts:45` |
| `table` (pipes, headers, cells)  | `#e2ff79` (lime)   | `UPDATE_v2_1_0.md:88`, `old-theme-ref.ts:46` |

Style: blockquote → ThinItalic (100i) (`UPDATE_v2_1_0.md:405`). Horizontal rule needs `---` minimum (4 hyphens `----` don't render the full bar per Sean's screenshot review — `v2_0_0_FEEDBACK.md:186-188`).

#### Special Syntax

| Role                                           | Value                  | Source                                       |
| ---------------------------------------------- | ---------------------- | -------------------------------------------- |
| `htmlTag` (`<div>`, `</span>`)                 | `#FF79C6` (pink)       | `UPDATE_v2_1_0.md:91`                        |
| `htmlAttribute` (`class=`, `id=`)              | `#FFD866` (gold)       | `UPDATE_v2_1_0.md:92`                        |
| `htmlAttrValue` (`"value"`)                    | `#F34D3E` (red-orange) | `UPDATE_v2_1_0.md:93`                        |
| `comment` (`<!-- ... -->`)                     | `#6272A4` (gray)       | `UPDATE_v2_1_0.md:94`, `old-theme-ref.ts:50` |
| `escapeChar` (`\*`, `\[`)                      | `#FF79C6` (pink)       | `UPDATE_v2_1_0.md:95`                        |
| `entity` (`&amp;`, `&lt;`)                     | `#FF79C6` (pink)       | `UPDATE_v2_1_0.md:96`                        |
| `emoji` (`:smile:`)                            | `#FFB86C` (orange)     | `UPDATE_v2_1_0.md:97`, `old-theme-ref.ts:52` |
| `math` (`$inline$`, `$$block$$`)               | `#8BE9FD` (cyan)       | `UPDATE_v2_1_0.md:98`                        |
| `footnote` (`[^1]`)                            | `#8BE9FD` (cyan)       | `UPDATE_v2_1_0.md:99`                        |
| `superscript` (`^text^`)                       | `#8BE9FD` (cyan)       | `UPDATE_v2_1_0.md:100`                       |
| `subscript` (`~text~`)                         | `#8BE9FD` (cyan)       | `UPDATE_v2_1_0.md:101`                       |
| `hardBreak` (trailing-space or `\` line break) | `#6272A4` (gray)       | `UPDATE_v2_1_0.md:102`                       |

Style: comment → ThinItalic (100i) (`UPDATE_v2_1_0.md:383`).

#### YAML Front Matter

**CONFLICT — full**: The v4.0.0.3 spec called for changing frontmatter from `#FF9D00` to `#F5F0B5` pale yellow to avoid a cascade collision with heading orange and bold marker styling. BUILD_REPORT v4.0.0 reports the actual implementation went a different route: `DocumentMeta: tags.processingInstruction` was added as a styleTag remap, but at runtime verification found `@lezer/markdown` **does not emit `DocumentMeta` at all** — that tag only fires for HTML/XML `DoctypeDecl`. The styleTag entry is inert. The real root cause of the "hyphen-line-orange-bold" bug Sean reported is **SetextHeading2** (a `---` line after a paragraph promotes the paragraph to H2 per CommonMark). The styleTag entry was left in (inert) per Sean's call to "leave as-is, fix properly in v5." Current shipped frontmatter color is therefore still whatever `colors.frontmatter` holds, NOT remapped by the inert styleTag. The pale-yellow change may or may not have landed — `THOT_APP.md` should be consulted as the canonical truth, and v5 owns the proper line-1 + canonical-`---` anchor fix.

#### Brackets & Delimiters (standalone, outside links)

| Role                     | Value                  | Source                                        |
| ------------------------ | ---------------------- | --------------------------------------------- |
| `parentheses` `(...)`    | `#ff9e64` (orange)     | `UPDATE_v2_1_0.md:108`, `old-theme-ref.ts:60` |
| `squareBrackets` `[...]` | `#7dcfff` (light blue) | `UPDATE_v2_1_0.md:109`                        |
| `quotedText` `"..."`     | `#c792ea` (purple)     | `UPDATE_v2_1_0.md:110`                        |

Style: quotedText → Italic (`v2_0_0_FEEDBACK.md:358`).

#### Diff

| Role           | Value              | Source                 |
| -------------- | ------------------ | ---------------------- |
| `diffAddition` | `#50FA7B` (green)  | `UPDATE_v2_1_0.md:113` |
| `diffDeletion` | `#FF5555` (red)    | `UPDATE_v2_1_0.md:114` |
| `diffChange`   | `#FFB86C` (orange) | `UPDATE_v2_1_0.md:115` |

#### Code Block Language Tokens (50+ inside fenced code blocks)

Verbatim from `UPDATE_v2_1_0.md:117-205`. Organized into 8 sub-groups; these apply inside ``` ``` ``` blocks when `codeLanguages: languages` from `@codemirror/language-data` resolves a parser. Categories: keywords, names & identifiers, literals, operators, comments (all ThinItalic), punctuation & brackets, meta & annotations, HTML/JSX in code, errors. See source file for the full ~50-entry table.

#### Future Markdown Extensions (slots pre-defined at `#e6e6e6` foreground until parser extension ships)

These show as foreground for now; require parser extensions not yet installed. Source: `UPDATE_v2_1_0.md:206-227`.

- `highlightedText` — `==highlighted==` (needs `@lezer/markdown` highlight extension)
- `definitionList`, `abbreviation` — `Term\n: Definition`, `*[abbr]: explanation`
- `criticMarkupAdd`/`Del`/`Sub`/`Comment`/`Highlight` — CriticMarkup notation
- `admonition` — `!!! note` / `!!! warning`
- `citation` — `[@citation]`
- `allCaps` — ALL CAPS TEXT (needs custom grammar; see Intelligent Formatting auto-detect)
- `keyboardKey` — `<kbd>Ctrl</kbd>` (parsed as HTML, could be special-cased)
- `markdownAttribute` — `{#id .class key=value}`
- `wikiLink` — `[[wiki-style links]]`
- `taskListText` — text after `- [x]` checkbox (inherits list content)
- `diagramBlock` — ```mermaid``` / ```graphviz``` (uses code-block language highlighting)

These slots exist specifically to be exposed in the future v6 user-preferences UI as "inactive" until the parser extensions ship.

### Marker ↔ Content Differentiation (Spec)

Sean's `v2_0_0_FEEDBACK.md` (lines 109-159) lays out the requirement explicitly: every markdown element with a "marker" character and a "content" portion needs both labeled separately, even if they share the same color, so users can later target either independently.

The full pair table (verbatim from `UPDATE_v2_1_0.md:552-566`):

| #   | Element       | Marker Node       | Marker Tag              | Content Node       | Content Tag          | Marker color | Content color |
| --- | ------------- | ----------------- | ----------------------- | ------------------ | -------------------- | ------------ | ------------- |
| 1   | Heading       | HeaderMark        | `tags.heading`          | ATXHeading/...     | `tags.heading`       | `#FF9D00`    | `#FF9D00`     |
| 2   | Bold          | EmphasisMark      | `tags.strong`           | StrongEmphasis/... | `tags.strong`        | `#FFD866`    | `#FFD866`     |
| 3   | Italic        | EmphasisMark      | `tags.emphasis`         | Emphasis/...       | `tags.emphasis`      | `#BF437F`    | `#BF437F`     |
| 4   | Strikethrough | StrikethroughMark | `tags.strikethrough`    | Strikethrough/...  | `tags.strikethrough` | `#6272A4`    | `#6272A4`     |
| 5   | Inline code   | CodeMark          | `tags.monospace`        | InlineCode/...     | `tags.monospace`     | `#F34D3E`    | `#F34D3E`     |
| 6   | Fenced code   | CodeMark          | `processingInstruction` | CodeText           | language-specific    | `#6767fc`    | `#8989e3`     |
| 7   | Blockquote    | QuoteMark         | `tags.quote`            | Blockquote/...     | `tags.quote`         | `#E6DB74`    | `#E6DB74`     |
| 8   | Bullet list   | ListMark          | `bulletMarkTag`         | BulletList/...     | `bulletContentTag`   | `#dfc532`    | `#8aeefb`     |
| 9   | Ordered list  | ListMark          | `orderedMarkTag`        | OrderedList/...    | `orderedContentTag`  | `#ff6b6b`    | `#f8a5c2`     |
| 10  | Table         | TableDelimiter    | `tableTag`              | TableCell/Header   | `tableTag`           | `#e2ff79`    | `#e2ff79`     |
| 11  | Link          | LinkMark          | `tags.link`             | Link/...           | `tags.link`          | `#AB9DF2`    | `#AB9DF2`     |
| 12  | Superscript   | SuperscriptMark   | `special(content)`      | Superscript        | `special(content)`   | `#8BE9FD`    | `#8BE9FD`     |
| 13  | Subscript     | SubscriptMark     | `special(content)`      | Subscript          | `special(content)`   | `#8BE9FD`    | `#8BE9FD`     |

### Priority Hierarchy / Cascade Spec

Sean's original priority spec from `v2_0_0_FEEDBACK.md:84-94` (verbatim, top to bottom = highest to lowest):

```
THIS IS THE LOGICAL HIERARCHY WE NEED TO APPLY TO THE APP HIGHLIGHTING

  1. strikethroughMarker, and strikethroughContent  BLENDS
  2. inlineCode, inlineCodeDelimiter, and blockCodeDelimiter  FULL 
  3. codeBlockContent and checkbox  BLENDS
  4. boldMarker, bold, italicMarker, and italic  FULL
  5. tableMarker and tableContents  FULL 
  6. headingMarker and headingContent  FULL
  7. bulletMarker, bulletContent, numberedMarker, and numberedContent  FULL
  8. blockquoteMarker and blockquoteContent  FULL
  9. foreground
```

**BLEND vs FULL semantics** (`v2_0_0_FEEDBACK.md:77-82`):
- **FULL**: overrides only showing the highest-priority style — e.g. "No matter where inline text is placed, even in a header that is also bold, the inline text eliminates the bold to apply both color and formatting of the inline code text only."
- **BLEND**: applies its style but retains the lower-rank label's color — e.g. "A bold text that is crossed out still maintains bold font but with the new color and additional new formatting applied."

**Implementation: CSS-cascade-order-as-priority**. The full priority ladder as built (lowest → highest, top → bottom = early-in-array → late-in-array):

```
PRIORITY ORDER (top = highest priority, overrides everything below):
═══════════════════════════════════════════════════════════════════

 1. tags.strikethrough        → strikethrough (#6272A4) Thin(100), line-through  ← WINS ALL
 2. tags.monospace            → inlineCode (#F34D3E)
 3. tags.strong               → bold (#FFD866) ExtraBold(800)
 4. tags.emphasis             → italic (#BF437F) ExtraBoldItalic(800i)
 5. tableTag [custom]         → table (#e2ff79)
 6. tags.heading (1-6)        → heading (#FF9D00) ExtraBold(800)
 7. bulletMarkTag [custom]    → bulletMarker (#dfc532) Bold(700)
 8. orderedMarkTag [custom]   → numberedMarker (#ff6b6b) Bold(700)
 9. bulletContentTag [custom] → bulletContent (#8aeefb)
10. orderedContentTag [custom]→ numberedContent (#f8a5c2)
11. tags.atom                 → checkbox (#8BE9FD)
12. tags.quote                → blockquote (#E6DB74) ThinItalic(100i)
13. tags.contentSeparator     → horizontalRule (#93f9c6)
14. tags.link                 → linkText (#AB9DF2) Bold(700)
15. tags.special(content)     → superscript (#8BE9FD)
16. tags.comment              → comment (#6272A4) ThinItalic(100i)
17. tags.processingInstruction→ fencedCodeDelimiter (#6767fc)
18. tags.documentMeta         → frontmatter (#BD93F9)
19. Code block tokens         → 50+ individually mapped tags
20. tags.content              → fg (#e6e6e6) Medium(500)  ← LOSES ALL
```

In CSS cascade terms: **HIGH priority items are defined LAST** in the HighlightStyle array so their CSS rules appear later and win when two classes exist on the same span (`UPDATE_v2_1_0.md:734`).

**Known nested-emphasis bug** (still unresolved per `UPDATE_MAP.md:67`): Italics in bold doesn't apply; bold in italics does. **Like *this* line** vs *Like **this** line* — both should apply ExtraBoldItalic (800i) but the bold rule currently overrides italic when bold is the outer wrapper. Filed as v5 work; the tree-nesting magic from Option A (inner span renders over outer span) is the canonical fix per `OPTIONS.md:98`.

### Extended Font Weights for Emphasis

Sean's font weight system from `v2_0_0_FEEDBACK.md:346-377` — 9 weights from the JetBrains Mono NL family, each mapped to a semantic role. Family stack: `'JetBrains Mono NL', 'JetBrains Mono', monospace`. Base font size: 12px (Sean explicitly fixed from initial 16pt in v2.0.0 Phase 7). Line height: 1.5 (raised from 1.0 in v2.1.4).

The weight ladder is what gives Thot its visual "weight rhythm": ExtraBold for the structurally important elements (headings, bold), Medium for body, Thin for "ignore me" content (comments, strikethrough), and ThinItalic for "soft voice" blockquotes. This is part of the trade dress moat (per `OPTIONS.md:208` — palette + typography pairing as defensible visual product).

### Frontmatter / DocumentMeta Workaround (v4.0.0.3)

The behavior Sean reported (`v4_0_1_FEEDBACK.md:137-152`, screenshots `docs/archive/images/frontmatter-random-list-item-insert-{1..6}.jpg`): "in a numbered list, hit return for sub-bullet → delete auto-number → type `-` and space → the hyphen renders in the orange/bold frontmatter style."

**Two collapsed-into-one issues:**
1. `colors.frontmatter` was orange `#FF9D00`, identical to heading color, cascade-colliding with bold marker styling.
2. `@codemirror/lang-markdown` over-permissively assigns `tags.documentMeta` to bare hyphen lines in list-derived contexts; the parser does NOT anchor frontmatter to line 1 only.

**Two routes attempted** (`v4_0_1_IMPLEMENT.md:75-96`, `v4_0_0_BUILD.md:98-117`):
1. **Color change**: `frontmatter: '#F5F0B5'` (pale yellow), distinct from heading orange and bold yellow.
2. **Structural remap fallback**: `DocumentMeta: tags.processingInstruction` added to the styleTags block in `editor.ts`, routing mis-tagged hyphen lines to `#6767fc` (the processing-instruction blue) instead of orange.

**BUILD_REPORT v4.0.0 finding** (`BUILD_REPORT_v4_0_0.md:42`): The remap is **inert** at runtime. `@lezer/markdown` does not emit `DocumentMeta` for markdown content at all — that tag only fires for HTML/XML `DoctypeDecl`. The real root cause of Sean's bug is **SetextHeading2**: a `---` line after a paragraph promotes the paragraph to H2 per CommonMark spec.

**Open question (v5 work)**: Should Thot inhibit Setext promotion in favor of HorizontalRule for the `---` line? This is technically a UX preference, not a bug — CommonMark behaves correctly. Belongs in v5 scope research.

**Sean's preference call**: "leave as-is, fix properly in v5." The inert styleTag entry stays in the codebase so the intent is captured.

### Checked-Todo Differentiation (v4.0.0.4)

Lezer's `@lezer/markdown` GFM extension emits a single `TaskMarker` node for both `[ ]` and `[x]`, both styled as plain `tags.atom` (verified in `node_modules/@lezer/markdown/dist/index.js:2174-2175`). **Pure `HighlightStyle` cannot differentiate checked vs unchecked** because they're the same node type with no differentiating tag.

The v4.0.0.4 fix extends the existing `markerDecorations` ViewPlugin. Source: `v4_0_0_BUILD.md:122-149`.

Logic added in the `tree.iterate` enter callback:
```ts
if (node.name === 'TaskMarker') {
  const text = view.state.sliceDoc(node.from, node.to)
  if (text === '[x]' || text === '[X]') {
    decos.push({ from: node.from, to: node.to, deco: checkboxCheckedDeco })
  }
  return
}
```

Where `checkboxCheckedDeco = Decoration.mark({ attributes: { style: 'color: #5A7DB8' } })`.

**BUILD_REPORT v4.0.0 finding** (`BUILD_REPORT_v4_0_0.md:44`): Decoration code is structurally correct but live testing showed `[x]` does NOT visibly render the darker `#5A7DB8`. Root cause: the `tags.atom` HighlightStyle rule cascades on top of the inline-style decoration. Two fix paths for v5:
1. Move to a `.thot-checkbox-checked` class technique (gains CSS specificity).
2. Wait for v5 scope system where this becomes a config knob (the recommended path — `OPTIONS.md` § 4 confirms inner-span-over-outer-span tree-nesting magic resolves this class of bug structurally).

### List-Containment styleTags Fix (v4.0.0.7)

Sean's bug, two reproductions:
- **Case A**: `- one\n- two\n\nThis should not be cyan.` → "This should not be cyan." colored cyan.
- **Case B (immediate, no blank)**: `- one\n- two\nThis line should not be cyan.` → also cyan.

**Root cause**: In `editor.ts:191-194` the styleTags used the deep-inherit `/...` operator:

```ts
'BulletList/...': bulletContentTag,
'OrderedList/...': orderedContentTag,
```

The `/...` operator matches all descendants. CommonMark's lazy continuation makes paragraphs sometimes children of the list node, so the bleed propagates.

**Fix** (`v4_0_0_BUILD.md:246-266`): restrict to direct list-item paragraphs:

```ts
'BulletList/ListItem/Paragraph': bulletContentTag,
'OrderedList/ListItem/Paragraph': orderedContentTag,
```

**Side effect** (`BUILD_REPORT_v4_0_0.md:46`): tight lists (no blank lines between items) don't wrap inline content in `Paragraph`, so their list-item text loses the cyan/pink content tag and falls through to foreground. Sean's explicit call: **the bleed fix is the priority; the inline-color side effect is acceptable v5 work, do not revert.** v5 scope rebuild handles this cleanly.

### Indentation-Color CommonMark Behavior (deferred, intentional)

Per CommonMark spec, 4+ spaces of indent creates a code block. Sean accepts this as parser behavior. With correct code block colors (`#8989e3` light purple), the indent-becomes-code rendering "will look intentional rather than broken". Deeper fix would require custom parser modification — revisited in v5 scope work.

### Language-Specific Code-Block Highlighting (Shipped)

When fenced code blocks declare a language (```` ```javascript ````, ```` ```python ````), Thot pulls in `@codemirror/language-data` and the relevant per-language packages, hands the inner content to the matching parser, and the 50+ code-block token color mappings light up.

Implementation: `markdown({ codeLanguages: languages })` where `languages` comes from `@codemirror/language-data`. Sean's v2.0.0 question on Prism.js was answered by using CodeMirror's native mixed-language parsing instead — same outcome with no external dependency. Language identifier coloring uses `tags.labelName` → `#F1FA8C` yellow.

### v5 Scope-System Rewrite (Research locked; ready to plan)

This is the moat. The v5 work has two halves that ship together because they share infrastructure: the **proprietary scope/cascade rewrite** (here) and the **Intelligent Formatting dual-mode UI** (next H2 section). Both depend on `src/scopes.ts` — already drafted in the repo per `v4_0_1_IMPLEMENT.md:480`.

**Architecture decision (locked from research, `OPTIONS.md` § 4):**

> **Stay on Lezer**; rewrite the scope/cascade layer cleanly. Do NOT fork `@lezer/markdown` and do NOT write a custom incremental parser — both burn ~3 months for zero user-visible benefit. The defensible moat is the product layer above (dual-mode UX, prose-mode regex highlighter, palette+typography trade dress, customization surface), not the parser underneath.

**Concrete shape** (verbatim from `v4_0_1_IMPLEMENT.md:486-491`):

- A single `ViewPlugin` walks the syntax tree once per change. It produces decorations keyed off `src/scopes.ts` scope names, not Lezer tags.
- The current `theme.ts` tags-keyed `HighlightStyle` is replaced by a flat scope table; tree nesting handles priority cleanly without `combine()` / CSS-cascade-order trickery.
- The current sidecar ViewPlugin's three special cases (`ListMark` in `BulletList`, `ListMark` in `OrderedList`, `CodeMark` in `InlineCode`) fold into the same walker — they are no longer special.
- A separate **regex-based prose-mode highlighter** runs in parallel for content that doesn't look like markdown (no `#`, `-`, `>`, etc. — just paragraphs of prose). Different scope keys, same surface.

**`src/scopes.ts` design** (per the v3 Three-Track plan):

> We will create a single source of truth mapping Lezer node names directly to styling objects (e.g. `StrongEmphasis: { color: colors.bold, fontWeight: '800' }`). **Plain Text Support**: We will include a `PLAIN_TEXT_SCOPES` array (`{ pattern: /regex/, style: ... }`) evaluated through standard Regex matching on visible ranges.

The model becomes: **Pattern (= tree node selector) → Scope → {color, weight, style} → Priority**. Inner spans render visually over outer spans so nesting handles itself; no CSS cascade ordering games.

The `userCustomizable: true/false` flag in `src/scopes.ts` gates which scopes are user-editable in the v6 preferences UI.

**`src/highlighter.ts` design**:

- Generalize `buildMarkerDecorations` to handle ALL markdown highlighting.
- Build single-pass tree walker that reads visible ranges (`syntaxTree(view.state).iterate()` over `view.visibleRanges`).
- For every node, emit `Decoration.mark({ attributes: { style: ... } })` based on the scoped definitions.
- Remove `styleTags` and `HighlightStyle` from the original configuration **except** the code-block tag mapping (50+ language token types — `syntaxHighlighting(thotHighlightStyle)` stays scoped to code-block tags only because that's the one place the Lezer tag system actually pulls its weight via mixed-language parsing).
- Add mode detection (auto-detect markdown vs plain text).

**Tree depth as priority**: "Instead of CSS cascades, we use the fact that `StrongEmphasis` inside `BulletList` automatically overrides because inner spans render over outer ones visually." This cleanly resolves the bold-in-list, italic-in-bold, inline-code-overrides-everything class of bugs without `combine()` games.

**Scope-of-work (`OPTIONS.md:101-106`):**

- 1 new file `src/highlighter.ts` (~300–500 LOC) generalizing `buildMarkerDecorations`.
- 1 `src/scopes.ts` declaring the scope table (data, not logic).
- Strip `styleTags` blocks and most of `HighlightStyle.define()` from `editor.ts` and `theme.ts`.
- Keep `syntaxHighlighting()` only for code-block content.
- 1–2 weeks for one engineer including testing the nested-emphasis edge cases.
- Net result: ~200 fewer lines of code, no more cascade-ordering reasoning required, future color tweaks are a one-line edit in a flat data file.

**Open work before promoting to BUILD**:

- Sean's narrative in `docs/research/1_DEEP/feature-research/FORMATTING_UX.md` (currently 9 lead-in prompts awaiting fill-in).
- Phase-2 verification of research items flagged `VERIFY` in `OPTIONS.md`.
- Concrete migration plan for `theme.ts` tags-keyed → scope-keyed.
- Test corpus: a documented set of markdown files exercising every Lezer construct + every `auto.*` regex pattern.
- Confirm `ViewPlugin` highlighter and `syntaxHighlighting()` co-exist cleanly for code blocks.
- Performance budget for prose-mode regex pass.

### Lezer vs Custom-Parser — the IP-Honest Read (Research locked)

Sean's original gut was "build our own — IP moat" (`UPDATE_MAP.md:101`). The deep research closed this question explicitly. Verbatim summary from `OPTIONS.md` § 3.3:

> There is no IP moat in "ours instead of Lezer." Lezer is a parser; the parser is the commodity layer. The moat is product design — specifically the dual-mode UX, the editorial choices in prose mode, and the customization surface — and that moat is reachable on top of Lezer, on top of a fork, or on top of a from-scratch parser, with the same effort. The choice of parser substrate is therefore an engineering question (cost, maintenance, risk), not an IP question.

**What is actually defensible** (`OPTIONS.md` § 3.1):

1. Trade dress / brand identity — the *look* of Thot's specific palette + typography pairing as a distinctive visual product. **Brand moat, defended by being recognized, not by litigation.**
2. Trademark on the product name — "Thot," logo, wordmark.
3. Copyright on the source code itself — automatic; protects against literal copying, not against reimplementation.
4. **Curated content**: a wordlist for prose-mode highlighting, calibration tables for POS-color mapping, the *editorial* choices about which English words deserve which signal. Compilation copyright applies (thin but real). More importantly, this is the kind of thing competitors don't bother to recreate because it requires taste, not engineering.
5. A novel UX surface that lets users customize highlighting in a way other editors don't expose.

**What is NOT defensible**:
- Tokenization / parsing algorithms — published, in the literature for 50 years.
- Incremental parsing — published research (Wagner 1998), tree-sitter, Lezer, Roslyn.
- Scope/priority models — TextMate scope grammars (2004) are the de facto standard.
- Color palettes — not protectable.
- CSS class names / cascade tricks — implementation detail.

**The four options evaluated** (`OPTIONS.md` § 2):

| Option | Description                                                        | Cost                                    | IP-defensibility                           | Verdict                                                                                                               |
| ------ | ------------------------------------------------------------------ | --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| A      | Stay on Lezer, rewrite scope/cascade cleanly                       | 1-2 weeks                               | Low                                        | **Do this.** Code-health investment all other options either build on or replace.                                     |
| B      | Add second highlighter for semantic prose mode (B1/B2/B3 gradient) | 1-2 days / 1 week / 2-4 weeks           | Low to medium (curation is editorial moat) | **Do this. B2 is shipping target.** Actual product differentiator.                                                    |
| C      | Fork `@lezer/markdown`                                             | 2-3 weeks initial + ongoing rebase cost | Low                                        | **Don't.** `MarkdownConfig.parseInline`/`parseBlock` extensions do everything fork would buy.                         |
| D      | Write our own incremental tokenizer                                | 3-6 months                              | Low                                        | **Don't.** Same IP story as keeping Lezer (i.e. weak), quarter+ of engineering, zero user-visible benefit on day one. |

**Recommendation locked: A + B2.** "Do A + B2 in that order. Skip C and D entirely" (`OPTIONS.md:235`).

### TextMate-Rule Heritage (from v1, informs v5 scope naming)

Even though we don't ship TextMate-based highlighting, the v1 work was done in VS Code/Cursor using a hand-tuned TextMate JSON file (`docs/archive/resources/ThotMarkdownTheme.json`, mirrored in `TextMateRules.md`). The **scope naming convention** from those files is the informal precedent for the v5 scope vocabulary.

**TextMate scope structure**: dot-separated hierarchical names (e.g. `markup.heading.1.markdown`, `punctuation.definition.bold.markdown`). The OS-standard TextMate Grammar dates to 2004 — "every editor uses some variant" — VS Code, Atom, Sublime, GitHub.

**Inheritance via scope nesting**: A rule for `markup.list.unnumbered.markdown` matches any token whose scope ends with that exact suffix; a more specific rule like `markup.list.numbered.markdown markup.list.unnumbered.markdown punctuation.definition.list.begin.markdown` (the "bullet inside numbered list" case at `TextMateRules.md:285-294`) overrides because of longer-and-more-specific match. This is conceptually the same as Lezer's depth-1 path matching.

**Why this matters for v5**: When designing the flat scope table in `src/scopes.ts`, the dot-separated naming hierarchy is a strong precedent. It will read naturally to anyone coming from VS Code / Cursor / Sublime and survives in user-customization UIs because category prefixes group naturally (`markup.*`, `punctuation.*`, `meta.*`, `string.*`, `constant.*`, `entity.*`, `keyword.*`).

**Sean's original framing**: "After doing this, I finally think I understand TextMate and currently prefer it. When I use the 'Developer: Inspect Editor Tokens and Scopes' I can see the hierarchy and the one at the top is what highlights the tagged text" (`v2_0_0_FEEDBACK.md:71`). The TextMate inspector model — where a developer can click any character and see the cascading list of scopes resolved on it — is the gold-standard debugging affordance the v5 system should preserve.

### Open Questions / Items Carried Forward

1. **Customizable themes UI scope** — interacts with v5 scope-table flat data shape. Worth scoping together with v6 preferences UI.
2. **Mode-switch UX for prose vs markdown mode** — auto-detection threshold, toggle visibility, whether user always knows which mode they're in.
3. **Prose-mode lexicon source** — curate from scratch, license a wordlist, or seed from public sources.
4. **Frontmatter color final value** — reconciliation between `#BD93F9` and `#F5F0B5` planned values; SetextHeading2 promotion inhibition decision.
5. **Checked-todo color cascade fix** — move to class-based decoration, or wait for v5 scope system.
6. **Tight-list content tagging regression** — list-item text in tight lists falls back to foreground; v5 scope rebuild resolves cleanly.
7. **`->` autocorrect regex** — deferred from v4.0.0; `>` isn't in the trigger character class.
8. **Anchor-link slugifier edge cases** — emoji, non-ASCII, unusual punctuation in heading text.

---

## Intelligent Formatting / Dual-Mode UI

**Status**: **(Research locked; UX scaffold awaiting Sean's fill-in)**. The mechanics are spec'd via `FORMATTING.md` and the v3 Three-Track plan. The user-experience layer — what a non-markdown writer actually sees, how mode switching feels gesturally, what auto-detections feel right vs surprising — exists as a 9-prompt scaffold (`docs/research/1_DEEP/feature-research/FORMATTING_UX.md`) where Sean's brain-dump is captured before synthesis. Sean's original detailed UX pitch is **"lost"** per the `v4_0_0_CLARITY.md` note: "It would be great if we could find the actual user experience written description of how the interface worked... That was very well pitched... Perhaps you can find it."

This feature ships with the v5 scope-system rewrite because they share infrastructure (`src/scopes.ts` `auto.*` group, the same `ViewPlugin` walker).

### Vision and Market Rationale

The pitch in two parts — first in `v4_0_0_CLARITY.md` § Growth (the public framing), then in `FEATURES_BEHAVIORS.md` § "Don't Block Out Non-Markdown Writers" (the design intent).

**Public framing** (`v4_0_0_CLARITY.md:33-35`, verbatim):

> Beyond developers, Thot's aim is to bring the magic of modern IDE markdown editors, like syntax highlighting and tab auto-completion, to users who default to Apple Notes or Google Docs; the kind of users who aren't likely to be persuaded to jump into learning markdown. No matter how you write, Thot's interface instantly and intuitively adapts. Many of these users have no idea that you can format an entire 20 page document in minutes thanks to tab completion, which is frankly still magical. Combine that with customizing exactly what amount of syntax highlighting helps them most, and it won't take long before they see how these tools lessen the cognitive load they're used to, freeing up mental space to maximize creativity.
>
> AI tools continue to rapidly grow the development industry, pushing use toward more markdown-heavy, planning-centric workflows. This will increase the demand for collaborative markdown editors, of which there is a current shortage. But in Thot, it won't just be your colleagues editing markdown documents live, but direct access to Claude built right into your documents; no need to go anywhere for a quick web search or to confirm you have the latest API documentation.

**Cognitive-load framing** (`UPDATE_MAP.md:898`, Sean's voice): "I have trouble reading big documents, but when types of chunks of text are visually identified by color it somehow creates a cognitive load easing which is what all good design should be trying to do."

**Two user segments served simultaneously** (`UPDATE_MAP.md:495-503`):

1. **Markdown power users** — developers, writers, technical folks who love semantic highlighting.
2. **Normal text editor users** — people who just want to type and format without learning notation.

> By supporting both, we expand addressable market significantly. File operations make it a "real" editor, not just a scratchpad.
>
> **Market positioning**: "The only text editor with semantic highlighting that works like a normal note app"

**Key naming insight** (`UPDATE_MAP.md:930-931`):

> If they don't know what markdown is, I guarantee they don't know what RTF is and barely know what TXT is. They'd recognize .doc and .docx from childhood is all... all they care is that it opens and they can type the way they want.

**Translation**: Don't call it "RTF mode" or "Markdown mode" — just let users format text however they want. The mode names should be invisible or, at most, descriptive ("Visual" vs "Markdown").

### Auto-Detect Plain-Text-Mode Heuristics (the `auto.*` scope group)

The `src/scopes.ts` already-drafted `auto.*` group represents the "intelligent" half of intelligent formatting: rules that fire on patterns in plain text, with no markdown notation required. Per the scaffold prompt in `FORMATTING_UX.md:60-65` (verbatim):

> Some examples we've kicked around:
> - Auto-detects ALL CAPS as emphasis and highlights it like bold.
> - Auto-detects a short line ending in `:` as a section label.
> - Auto-detects parenthetical asides and dims them.
> - Auto-detects question marks → italic for questions.
> (These are already in `src/scopes.ts` under the `auto.*` group — this layer is partly drafted.)

**Mechanism for prose mode** (from `OPTIONS.md` § Option B, the B1/B2/B3 gradient):

- **B1 (cheap, ~200 LOC, 1-2 days)**: Punctuation, numbers, ALL CAPS, capitalization runs. Pure regex evaluated per visible line.
- **B2 (medium, ~500 LOC + JSON wordlist, ~1 week)**: Adds curated lexical dictionary (hedges, absolutes, transition words) plus first-word-of-sentence detection.
- **B3 (ambitious, 2-4 weeks)**: Lightweight POS tagging via `compromise.cool` (MIT, ~250KB gzipped) or similar. Tag verbs/nouns/adjectives. This is real "semantic" highlighting.

**Recommendation locked**: B2 as the shipping target with B3 as a follow-up.

**Concrete signals captured so far**:

| Pattern                                                                         | Signal                                    | Spec note                                                                    |
| ------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------- |
| **ALL CAPS** word/phrase                                                        | Emphasis (similar to bold)                | Already in `auto.*`. TextMate had `keyword.other.uppercase` → `#00ffaa` bold |
| Short line ending in `:`                                                        | Section label (like a header without `#`) | Already in `auto.*`                                                          |
| Parenthetical asides `(like this)`                                              | Dimmed                                    | Already in `auto.*`. Standalone parens color `#ff9e64`                       |
| Question marks / interrogative lines                                            | Italic for questions                      | Already in `auto.*`                                                          |
| Numbers and units (`42`, `42%`, `$3.50`, `2026-05-06`)                          | Colored                                   |                                                                              |
| First-word emphasis (sentence start)                                            | "Topic" hint                              | B2-tier                                                                      |
| End-of-sentence terminator                                                      | Colored or dimmed                         | B1-tier                                                                      |
| Em-dash/parenthetical clauses                                                   | Dimmed                                    | B1-tier                                                                      |
| Capitalization runs (Title Case sequences)                                      | Likely proper nouns / titles              | B1-tier                                                                      |
| Quotation marks                                                                 | Distinct treatment                        | B1-tier (already exists as `quotedText` color `#c792ea`)                     |
| Hedges (`maybe`, `should`, `might`), absolutes (`always`, `never`), transitions | Lexical highlight                         | B2-tier                                                                      |
| Action verbs at clause-start                                                    | Bold/emphasized                           | B2/B3-tier                                                                   |

**Curated wordlist lives in** `src/prose-lexicon.json` per `OPTIONS.md:250` — "this is the thing future Thot will iterate on for years and where the actual editorial-product investment goes."

**What auto-behaviors would be WRONG (negative space, `FORMATTING_UX.md:67`)**: open question awaiting Sean's fill-in. Examples that come to mind for the eventual answer: a user typing in all caps as a stylistic choice and not wanting the editor to "interpret" it; a user using parentheticals as core content not asides; questions used as section headers that shouldn't be italicized.

### Notation Hiding via `Decoration.replace()` + Floating Context Menu

**Visual mode mechanism** (`v3_THREE_TRACK_IMPL.md:57-63`, `FORMATTING.md:14-22`, verbatim):

> CodeMirror 6 can hide underlying document characters visually without deleting them. We will use `Decoration.replace({})` with an empty replacement over specifically parsed Markdown syntax nodes (like `EmphasisMark` or `HeaderMark`). This allows `**text**` to simply render as **text** in the viewport while mathematically remaining `**text**` under the hood for clean export.

So when in visual mode and the cursor is OUTSIDE a region of bold text, the `**` markers are visually replaced by an empty span (`Decoration.replace({})`). When the cursor enters the region, the markers reappear so the user can edit them.

**Floating context menu mechanism** (`v3_THREE_TRACK_IMPL.md:61-63`, `FORMATTING.md:19-23`, verbatim):

> We will build this using CodeMirror's `showTooltip` facet.
> **Implementation**: We will attach a `StateField` that watches `view.state.selection`. When standard text is highlighted (`selection.main.empty === false`), it returns a `Tooltip` object containing our custom DOM elements (toolbar buttons mapped to formatting commands). This correctly links the popup to the active selection cursor viewport coordinates.

> Build a floating popup element that anchors to the viewport selection bounding box. Include buttons for B, I, H1-H6, List, Link, Code. Provide progressive disclosure so users learn keyboard shortcuts over time.

### Dual-Mode (Option A) vs Hybrid Single-Mode (Option B) — Decision Open

Sean has not chosen. The framing comes from `UPDATE_MAP.md:186-198` (verbatim):

> **Two Possible Approaches:**
>
> **Option A: Dual Mode (simpler)**
> - Document is either "Markdown" or "Visual" mode
> - Visual mode: formatting toolbar/context menu, notation hidden
> - Markdown mode: notation visible, semantic highlighting
> - Toggle between modes
>
> **Option B: Hybrid Mode (innovative)**
> - Single mode supporting both input methods
> - Type notation → it works
> - Use formatting UI → notation added but can be hidden
> - Smart detection of user preference

**Strategic recommendation in v3** (`UPDATE_MAP.md:206-207`): "Start with Dual Mode (v3.0.0), add Hybrid Mode later (v3.1.0) if demand exists."

**The v5 stance** (`v4_0_1_IMPLEMENT.md:493-498`, verbatim):

> - **Markdown-visible mode** (current behavior): syntax notation visible, fully highlighted.
> - **Visual mode**: notation hidden via `Decoration.replace()`; reappears when the cursor enters the region. (e.g., the `*` markers around bold text disappear; click into the bold span and they come back so you can edit them.)
> - **Auto-detection layer** (the `auto.*` scope group in `scopes.ts`): ALL CAPS → emphasis, lines ending with `:` → section labels, parenthetical asides dimmed, etc.
> - **Mode switching**: explicit (toggle in command palette / preferences) and gestural (TBD — needs research, likely a top-bar control).

**Open questions for the decision** (`FORMATTING_UX.md:33-43`, scaffold prompts awaiting Sean's narrative):

> From the user's perspective, what are these called? What does each one *look like*? Is one the default? Why?
>
> Some sub-questions to anchor:
> - In markdown-visible mode: do the `**` and `#` show up colored, or are they just there with the rest of the text?
> - In visual mode: is the `**` invisible? Does the bold text just appear bold? What happens when the cursor enters a region of bold text — do the `**` reappear?
> - Is the mode global (whole document) or local (current paragraph)?

**Explicit-vs-auto-detect interaction** (`FORMATTING_UX.md:75-77`):

> A user types `IMPORTANT` and it gets ALL CAPS emphasis automatically. Then they decide they want to actually emphasize a word with markdown — they type `**word**`. Both are now visible. Do they conflict? Does the explicit markdown override the auto-detection? Are auto-detections "softer" visually than explicit markdown so explicit always wins?

This is the cleanest "softer auto vs explicit always wins" framing — a likely default but explicit Sean decision still pending.

### RTF-Mode Toolbar (Legacy v2 Concept, Maps Forward)

From `v2_0_0_FEEDBACK.md:315-318` (verbatim, Sean's original phrasing):

> ### Standard RTF Option
>
> + Somewhere along the line it would make sense to give users who don't like markdown an option to use the app too
> + It would be really fun to sort of try and reinvent a UI that is as convenient as markdown for formatting plain text
> + Almost like a little context menu but with super prominent keyboard shortcuts written on the places that a RTF user would otherwise click to make something a heading or bold, etc.

**The terminology shift**: by v4.0/v5 framing this is no longer "RTF mode" — per Sean's `UPDATE_MAP.md:930` ("they barely know what TXT is"), the explicit mode label is **not** "RTF." It's just "Visual" or no label at all (users who don't know markdown never see the distinction).

**The UI surface that survives**: the floating/contextual formatting toolbar with **prominent keyboard shortcuts written on the buttons**. From `FORMATTING.md:11-12` (verbatim):

> The menu will contain buttons for common tools, highly prioritizing the display of keyboard shortcuts (e.g., `⌘B` for bold).

**The four UI variants explored** (`UPDATE_MAP.md:938-963`, verbatim):

> 1. **Toolbar** (traditional) — Always visible at top. Pro: Familiar. Con: Takes up space.
> 2. **Context menu** (right-click) — Appears on text selection. Pro: Hidden until needed. Con: Not discoverable on mobile.
> 3. **Floating button** (innovative) — Transparent dot that stays out of cursor's way. Tap/click to open formatting menu. Pro: Works on mobile, novel UX. Con: Needs smart positioning logic.
> 4. **Keyboard shortcuts only** (power users) — CMD+B for bold, etc. Pro: Fast, no UI clutter. Con: Not discoverable for normal users.
>
> **Strategic recommendation**: Start with #2 (context menu) for v3.0.0, add #3 (floating button) for mobile in v3.1.0.

Current recommendation: **#2 (context menu via `showTooltip` facet)** as the shipping target.

**Anticipated keyboard shortcuts** (from the SwiftUI menu sketch in `UPDATE_MAP.md:1278-1322`):

- Heading 1-6: `CMD+H+1` through `CMD+H+6`
- Italic: `CMD+I`
- Bold: `CMD+B`
- Bulleted List: `CMD+Shift+7`
- Dashed List: `CMD+Shift+8`
- Numbered List: `CMD+Shift+9`
- Block Quote: `CMD+Shift+.`
- Checklist: `CMD+Shift+L`
- Mark as Checked: `CMD+Shift+U`
- Table: `CMD+Shift+T`

Some of these shortcuts conflict (CMD+Shift+C, CMD+Shift+L, CMD+Shift+T). Need to resolve before implementation.

### Selection Auto-Wrap (Shipped behavior; relates to formatting UI)

A related-but-separately-implemented behavior worth surfacing here because it's part of the formatting-without-knowing-markdown idea. From `v2_0_0_FEEDBACK.md:240-253` (verbatim):

> #### Adding " " or ** ** Shortcut from Markdown UI
>
> + When you highlight a word in markdown and then hit SHIFT-* for example
>   - It adds the * to both sides of the word automatically
>   - Click a second * and it adds two to either side of highlighted region
>
> + It does this for all characters that have one on either side — you have to click the first of the two
>   - 'Single quotes' / "Double quotes" / (Parenthesis) / {Brackets} / `delimiter tick marks`
>
> + This is a feature I use CONSTANTLY and would love it in this update

**Status**: Shipped in v3.1.0 via `@codemirror/autocomplete` `closeBrackets()` extension. The relevance to Intelligent Formatting: this is **already a step toward "format without knowing markdown"** — a user who selects "important word" and types `*` gets `*important word*` without ever having known the asterisk was the bold/italic syntax. The future formatting toolbar layers on top of this with explicit B/I/etc. buttons.

### Recipe Auto-Formatting (Legacy Concept, Future)

From `UPDATE_MAP.md:1505-1517` (verbatim):

> **Recipe formatting:**
> - Paste recipe basics
> - AI cleans up and formats beautifully
> - Export to recipe app of choice

And the broader concept:

> **Tab-style auto-formatting** (like Cursor/Anti-Gravity):
> - Format entire 10-page document with styles in minutes
> - Google Docs users don't know this is possible
> - Bring this UX to note-taking

**Status**: vNext concept (AI integration phase), not v5. Tab autocompletion is named in `v4_0_1_IMPLEMENT.md:547` as part of the `@claude` AI integration milestone.

### Declarative AI Customization (Legacy v1, Maps Forward)

From `v2_0_0_FEEDBACK.md:406-411` (verbatim):

> #### Declarative Customization via AI
>
> + Config files (`PreferencesModel`/ JSON) that defines
>   - Layout (columns, panes)
>   - Editor preferences (font, theme, behaviors)
>   - Note metadata (tags, pinned/priority)
> - An AI layer that translates natural language → config changes

**Status**: vNext. The natural language → config changes idea ("make headings blue", "show word count in the corner") lives alongside the `@claude` integration phase, but the underlying JSON-config preferences model is the v6 work.

**Why this matters for Intelligent Formatting**: the auto-detection rules in `auto.*` are themselves customizable. The user-customizable scope flag (`userCustomizable: true/false` in `src/scopes.ts`) gates which scopes are user-editable in v6. A natural language layer on top of that gives users non-technical access to: "turn off the question-mark italic thing", "make ALL CAPS green instead of bold-yellow", "stop dimming my parentheticals". The v1 concept folds in cleanly.

### Research Pointers and Open Work

**Locked research artifacts**:
- `docs/research/1_DEEP/highlighter-architecture/OPTIONS.md` — comprehensive architecture options with locked Option A + B2 recommendation.
- `docs/archive/research/1_DEEP/feature-research/FORMATTING.md` — original mechanics spec (Decoration.replace, showTooltip facet, context menu).
- `docs/archive/v3_0/v3_THREE_TRACK_IMPL.md` § Track 3 — verified technical specifications for dual-mode formatting UI.

**Awaiting Sean's narrative fill-in**:
- `docs/research/1_DEEP/feature-research/FORMATTING_UX.md` — 9 lead-in prompts:
  1. Who is using this? (target user's actual writing workflow)
  2. First contact — what does a brand-new user see?
  3. The dual mode — what are the two modes, exactly?
  4. Discovery and switching modes — what is the gesture?
  5. The "intelligent" part — what does the editor do automatically?
  6. Relationship between auto-detection and explicit markdown
  7. The customization layer — what can the user change?
  8. What this feature is NOT
  9. Free space — anything else

**What this feature is NOT** (anticipated):
- Not a WYSIWYG renderer (the doc is still markdown under the hood; visual mode is presentation, not storage).
- Not Notion (no databases, no nested pages, no block-based content model).
- Not a full IDE (no LSP, no code intelligence beyond syntax coloring).
- Not Apple Notes (no rich-media embeds, no handwriting, no cross-device-with-Apple-account magic — that comes later via auth + sync).

---

## Heading Stacking / Sticky Scroll

**Status**: **(Spec'd, not shipped)**. UX captured in Sean's narrative + 7 reference screenshots (`docs/archive/v4_0/processed/FEAT_HEADING_STACK.md`). Implementation spec needs a planning round before BUILD. Scheduled as v4.2.0.

### The Spec — Sean's Narrative (verbatim, full)

From `docs/archive/v4_0/processed/FEAT_HEADING_STACK.md` (single-paragraph spec; reproduced in full because every clause matters):

> In every IDE markdown editor I've used, the headings stack at the top of the page as you scroll down through them so then when you peek up, you don't need to scroll up at all to recall what section of the, typically massive, document you're in. I've taken a series of screenshots that depict this as I'm scrolling down a file to illustrate so we're definitely on the same page. The H1 stays at the top the entire time (unless there was another H1 that scrolled up), and the H2 stays just below the H1 until it is replaced with a smooth scroll by the next H2 in the document. The same happens for the H3 and all the other headings. No matter how deep in the hierarchy you are, just looking up shows you the entire flow of steps down and in. Please examine the images closely and confirm you understand the effect I'm describing and the degree of smooth, UX pleasing experience it creates by being convenient and animated perfectly. I'm hoping that might be something we can recreate as well. Not only is it something that the developer users would have come to expect if we're going to be able to entice them to move away from an IDE for markdown editing, but it is also one of those really great features that standard text writers with no markdown understanding have no idea this level of helpful convenience exists as such a norm. It seems like one of those must-haves for that reason, that would set us ahead of other markdown apps that half-assed their user experience.

**Reference screenshots**:

- `docs/archive/images/markdown-heading-stack-by-h-type-1.jpg` through `-7.jpg`

### Expected Behaviors (extracted from Sean's narrative)

1. **H1 pins to the top of the viewport** the entire time the user is scrolling within the H1's section. Stays there until another H1 is scrolled past, at which point the new H1 replaces it.
2. **H2 stays just below the H1** until it is replaced — via **smooth scroll** — by the next H2 in the document.
3. **The same cascade continues for H3, H4, H5, H6.** No matter how deep the hierarchy, looking up the viewport shows the full breadcrumb of section-path from H1 down to the current heading's parent.
4. **Smooth animation** — "the degree of smooth, UX pleasing experience it creates by being convenient and animated perfectly." Replacement should not be a discrete jump; the outgoing heading slides up/out as the incoming heading slides into position. The framerate target is 60fps consistent with Thot's 100K-line scroll perf guarantee.

**Implicit behaviors derived from the spec**:
- Stack only shows headings whose section the user is currently within.
- When the user scrolls UP past the section start, the heading should leave the stack (revealing the previous H1 that scrolled out earlier).
- When the user clicks anywhere in the document body, no change to the stack.
- The active line/cursor section is what determines the stack, not the topmost viewport edge — but the screenshots are needed to confirm. (Open question.)

### IDE-Standard Rationale (Why It's Table-Stakes)

From `v4_0_1_IMPLEMENT.md:444-448` (verbatim):

> ### Why this matters
>
> Per Sean's framing in `FEAT_HEADING_STACK.md`: this is a must-have for moving developer-users away from their current IDE-based markdown editing, AND it surfaces a UX convenience that non-developer writers don't even know to ask for. Strong differentiator for both audiences.

**Translation**: heading stacking is not a luxury feature. VS Code, Cursor, Antigravity, Obsidian, modern web-based markdown editors all have it. For Thot to credibly pitch itself as "use this instead of opening your IDE just to edit markdown," it needs feature parity on the obvious-to-developers conveniences.

**The non-developer angle** (Sean's narrative again): "It is also one of those really great features that standard text writers with no markdown understanding have no idea this level of helpful convenience exists as such a norm."

### Implementation Directions (Open Questions Before BUILD)

From `v4_0_1_IMPLEMENT.md:450-462` (verbatim):

> ### Implementation framing (needs planning round)
>
> This is a CodeMirror layer overlaid on the scroller — likely a `ViewPlugin` plus a fixed-position absolute container. Open questions before BUILD:
>
> 1. **Render approach** — pure DOM overlay synchronized with scroll events, or CodeMirror's `Panel` API used in a non-standard way?
> 2. **Heading-tree maintenance** — recomputed from `syntaxTree` on every viewport change, or memoized at document parse?
> 3. **Smooth-scroll animation** — match the screenshots' "smooth slide" of the active H-level when it transitions, or jump?
> 4. **Interaction with line wrap** — heading text in the stack: wrap or truncate?
> 5. **Color and weight parity** — does the stacked heading use the same color (`#FF9D00`) and weight as it does in the document? Background opacity to keep it readable over scrolling content?
> 6. **Performance** — confirm zero impact on the 100K+ line scroll perf that's a Thot guarantee.

#### Direction A — viewport-aware `ViewPlugin` with absolute-positioned overlay

The likely default. A `ViewPlugin` subscribes to `EditorView` `update` events (which fire on viewport changes, scroll, and document edits). On every update:

1. Walk the `syntaxTree` (or a memoized heading list) to find all `ATXHeading*` and `SetextHeading*` nodes preceding the current top-of-viewport position.
2. For each H-level (1 through 6), find the most-recent heading at that level whose position is ≤ the top-of-viewport.
3. Build a small DOM overlay (a fixed-position div anchored to the scroller) that renders one row per active H-level, in order, with the heading text.
4. On scroll between sections (transition where the active H-level heading changes), animate the swap via CSS transition (`translate-y` slide of ~one-row height with 200ms ease).

**Pros**: Full control over animation, exact match to screenshots' smooth replacement. Integrates with line-wrap.
**Cons**: Requires getting scroll-sync right.

#### Direction B — CSS `position: sticky` on heading elements directly

The naively-simple approach. Mark each heading line with `position: sticky; top: 0`.

**Cons**: CodeMirror renders the editor as a virtualized scroller — non-visible lines are not in the DOM at all. `position: sticky` requires the sticky element to be IN the DOM during scroll. As the H1 line scrolls out of the visible range, CodeMirror will unmount it. Multiple sticky headings (H1, H2, H3 all visible at once) require nested stacking contexts that CSS sticky doesn't handle smoothly. Smooth animation between heading transitions is hard with `position: sticky` alone.

**Verdict**: probably not workable for the multi-level smooth-animation requirement. Direction A is the path.

### Detailed Open Questions Mapped to Decisions

| Open question                                                  | Likely answer                                                                                           | Confidence                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Render approach                                                | Direction A: ViewPlugin + absolute-positioned overlay                                                   | High                            |
| Heading-tree maintenance                                       | Memoized at document parse; invalidate on edits that change heading set                                 | Medium-high                     |
| Smooth-scroll animation                                        | Match screenshots' smooth slide (CSS `transform: translate-y` with 200ms ease)                          | High                            |
| Line-wrap interaction                                          | Truncate heading text in stack (ellipsis)                                                               | Medium; needs Sean confirmation |
| Color & weight parity                                          | Yes — `#FF9D00` orange + ExtraBold (800), matching document, with background opacity ~0.95              | Medium-high                     |
| Performance budget                                             | 60fps on 100K+ line file                                                                                | High (this is the guarantee)    |
| Determination basis: top-of-viewport vs. cursor line           | Top-of-viewport                                                                                         | Medium; needs Sean confirmation |
| Click on a stacked heading → action                            | Scroll to that heading's first occurrence (consistency with v4.1.0 CMD+Click anchor behavior)           | High                            |
| Heading stack visible in visual mode (Intelligent Formatting)? | Yes — works the same regardless of mode                                                                 | Medium                          |
| Heading stack on narrow viewports                              | Should not break layout — collapse to single-line if too narrow, or hide on viewports below a threshold | Medium                          |

### Status Summary

- **Spec**: complete and clear (Sean's narrative + 7 screenshots).
- **Implementation direction**: locked in principle (Direction A — ViewPlugin + overlay), 4-5 open detail questions before BUILD.
- **Branch**: `feat/v4-heading-stack` from `dev`.
- **Scheduled**: v4.2.0, after v4.1.0 (shipped 2026-05-11) and before v5.0 (the big highlight + dual-mode rewrite).
- **Files anticipated**: new `src/heading-stack.ts` (~250-400 LOC ViewPlugin + DOM management); minor additions to `src/theme.ts` for overlay styling; potentially modifications to `src/click-handlers.ts` to share the heading-resolution logic between stacked-heading clicks and in-document anchor clicks.
- **Inter-feature dependencies**: integrates cleanly with v4.1.0 URL clickability (shared anchor-resolution logic); will need to be re-validated when v5 scope-system lands.

<!-- ============================================================ -->
<!-- WRITER C OUTPUT — Persistence & State, File Mgmt & I/O,      -->
<!-- Cross-Device Sync, Real-Time Collaboration, Auth & Accounts  -->
<!-- ============================================================ -->

## Persistence & State

Thot's persistence story is the most heavily-iterated part of the application. It started as a macOS filesystem model (v1), pivoted to localStorage when the project went web (v2), grew a URL-partitioned multi-window scheme (v3.1.1), survived its own collapse on macOS Safari, and landed in the **single persistent main draftpad + ephemeral temp windows** shape that ships today. Anyone proposing to revisit this architecture should read this entire section first — the collapse narrative is preserved because the failure mode is non-obvious and easy to walk back into.

### Current shipping behavior **(Shipped v4.1.0)**

Thot persists one canonical writing surface — the **main draftpad** — to browser `localStorage`, partitioned by a `windowId` that is reflected in the URL as `?id=<id>`. The bootloader normalizes the URL on every cold launch so the partition is predictable; secondary windows live in a parallel `temp-*` namespace that never collides with the primary pad.

  + **The main draftpad**
    - On first load with no `?id=` URL parameter, the bootloader sets `?id=main` via `history.replaceState()` and reads/writes `localStorage` key `thot:content:main`
    - State (caret + scroll) lives at `localStorage` key `thot:state:main`
    - Because the PWA always cold-launches at `/`, this always predictably routes back to the user's permanent `main` draftpad storage partition
    - (source: `docs/archive/v3_0/v3_MULTI_WINDOW_CANCELED.md:52-60`; `docs/THOT_APP.md:129-137`)

  + **Ephemeral temp windows (CMD+N)**
    - When the user presses **CMD+N** or invokes Share → New Window, `file-system.newWindow()` explicitly sets `.searchParams.set('id', 'temp-' + random)` so the spawned window is isolated from the permanent `main` draftpad
    - Temp window IDs are 6-character random suffixes (e.g. `?id=temp-xyz123`)
    - Closing a temp window does not affect `main`
    - (source: `docs/archive/v3_0/v3_MULTI_WINDOW_CANCELED.md:60-68`; `docs/THOT_APP.md:131-137`)

  + **localStorage key map**

| Key                      | Stores                                           |
| ------------------------ | ------------------------------------------------ |
| `thot:content:main`      | Main draftpad markdown text                      |
| `thot:state:main`        | Main draftpad `{ cursorPos, scrollTop }`         |
| `thot:content:temp-<id>` | Ephemeral temp-window text                       |
| `thot:state:temp-<id>`   | Ephemeral temp-window `{ cursorPos, scrollTop }` |

  (source: `docs/THOT_APP.md:628-637`)

  + **Autosave debounce**
    - All content writes are **debounced at 500ms** after the last keystroke
    - Cursor/scroll state writes follow the same 500ms debounce pattern
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:135-141`; `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:303-308` — original 500–1000ms target from v1 spec; v1 actually shipped 500ms)

  + **Force-save triggers (immediate, no debounce)**
    - `beforeunload` — user closes tab / window / browser
    - `visibilitychange` — user switches tab or task
    - **CMD+S** — keymap intercept calls `forceSave()` instead of opening the browser's "Save Page" dialog
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:138-141, 170` — Phase 7; `docs/THOT_APP.md:287-290`)

  + **Caret + scroll restoration**
    - On boot, after content load, the editor restores `selection.main` to the saved `cursorPos` and `view.scrollDOM.scrollTop` to the saved `scrollTop`
    - This was a v2 Phase 4 deliverable and has been preserved through every subsequent iteration
    - Goal phrasing from v1: relaunch should "feel telepathic" — same text, same scroll, same caret
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:139-142`; `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:97-114`)

  + **Legacy migration hook**
    - If the old global `thot:content` key (pre-partition, v3.1.0) still exists at boot, the bootloader silently copies its data into `thot:content:main`, then deletes the legacy key
    - Was added during v3.1.1 to migrate existing users without prompting; preserved in the v3.1.2 single-draftpad pivot
    - (source: `docs/archive/v3_0/v3_MULTI_WINDOW_CANCELED.md:50`; `docs/archive/v3_0/v3_RECOVERY_FINALIZATION.md:35-37`)

  + **Implementation files**
    - `src/main.ts` — bootloader, parses `?id=`, calls `setPersistenceId(id)` and `setStateId(id)`
    - `src/persistence.ts` — `setPersistenceId(id)`, `saveContent`, `loadContent`, `forceSave`, `hasSavedContent`, `clearContent` — all keyed off `thot:content:<id>`
    - `src/state.ts` — same shape for caret/scroll under `thot:state:<id>`
    - `src/file-system.ts:newWindow()` — sets `?id=temp-<random>` and `window.open()`s the new partition
    - (source: `docs/THOT_APP.md:425-440`)

  + **Persistence flow (verbatim)**
    ```
    Bootloader → resolves windowId from ?id= URL param (default 'main')
              → setPersistenceId(windowId) configures key 'thot:content:<id>'
              → setStateId(windowId) configures key 'thot:state:<id>'

    User types → onChange callback → saveContent() (500ms debounce) → localStorage
    User closes tab → beforeunload → forceSave() (immediate) → localStorage
    User switches tab → visibilitychange → forceSave() (immediate) → localStorage
    User presses CMD+S → keymap intercept → forceSave() (immediate) → localStorage
    User presses CMD+N → file-system.newWindow() → opens ?id=temp-xyz (ephemeral)
    ```
    (source: `docs/THOT_APP.md:282-291`)

### Design rationale (why localStorage and not IndexedDB)

  + **Synchronous, simple, fast** — sufficient for single-document scratchpad use
  + **No permissions needed** — works in private windows, no quota prompts
  + Trade-off: 5–10MB origin quota per browser; not an issue for a markdown notepad but would matter if we ever stored binaries
  + (source: `docs/THOT_APP.md:244`; `docs/archive/v2_0/UPDATES_v2_0_0.md:62-64`)

### The multi-window history — CANCELLED, narrative preserved

**Status: (Cancelled — see v3.1.1/v3.1.2 narrative below; single-draftpad fallback is the shipping model)**

This sub-section captures the failed v3.1.1 multi-window-partitioning feature and the v3.1.2 fallback in full. **This is a "carry forward forever" piece — anyone proposing a multi-window architecture in the future should encounter this story.** The architectural appeal is real; the platform constraint that defeats it is non-obvious; rediscovering the failure mode in production is expensive.

#### What was planned (v3.1.1)

  + **Branch**: `feat/v3-multi-window` (branching from `main`)
  + **Architecture change: unique window IDs**
    - LocalStorage is shared across the entire origin (`thots.august.style`). If three windows are open, they all fight over the `thot:content` key, and the last window to autosave obliterates the others.
    - To fix this, we planned **Local Storage Partitioning via URL Parameters**.

  + **How it would work (verbatim, source: `docs/archive/v3_0/v3_MULTI_WINDOW_CANCELED.md:11-23`)**:
    1. **Window Boot**: `main.ts` boots up. It checks the URL parameters for `?id=XYZ`.
    2. **First Load**: If there is no `id` parameter (e.g., you just launch the PWA from the dock), Thot generates a random 6-character ID (like `a9f3k2`) and immediately updates the URL to `/?id=a9f3k2` using `history.replaceState()`.
    3. **Partitioned Storage Keys**: Instead of saving everything to `thot:content`, the app dynamically appends the ID to the storage keys: `thot:content:a9f3k2` and `thot:state:a9f3k2`.
    4. **New Windows**: When you trigger `newWindow()` (typically CMD+N or the Share menu), Thot generates a fresh ID and opens `/?id=newabc` in the new window, isolating its storage instance from the parent.
    5. **Session Safety**: Now, every single window has its own dedicated silo in localStorage. They save independently, and upon computer restart, the OS restores the windows exactly to their unique URL IDs, cleanly loading their respective content.
    6. **"Main" Deskpad Reference**: The user wanted a concept of a "main" fallback. `thot:content:main` was established as the default. If a user hit the base `/` URL, that would force-resolve to the `main` ID partition, protecting the primary deskpad. (If they launched a *second* window from `/`, the base code would realize the window was standalone and redirect to a random ID to prevent a collision.)

  + **Shipped at**: commit `fb425e9`, tagged `v3.1.1-multi-window` (source: `docs/archive/v4_0/processed/SNAPSHOT_v3_1_2_.md:95-100`)

#### What went wrong on macOS Safari

  + **macOS Safari actively strips dynamic PWA launch parameters down to the manifest's base `/` start URL on restart.**
    - This was discovered in production after the v3.1.1 ship.
    - The v3.1.1 bootloader was triggered to endlessly spawn infinite random isolated IDs instead of restoring previous contexts. Every cold launch generated a fresh `?id=<random>`, which loaded an empty partition, which was then autosaved as the user typed — but the user's *previous* content was stranded in an older random-ID partition that the new boot would never re-discover.
    - (source: `docs/archive/v3_0/v3_RECOVERY_FINALIZATION.md:40-43`)
  + Effectively: **URL state does not survive a Safari standalone PWA cold launch.** Sessions in `localStorage` (or `IndexedDB`) survive; URL state does not necessarily. (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:183-185`)
  + Production users were silently losing work on every device restart, which forced the pivot.

#### The fallback decision (v3.1.2)

**Branch**: `fix/v3-pwa-state-restore` (branching from `dev`).

Per Sean's request: "Instead of trying to orchestrate an inherently incompatible multi-window environment within Safari's PWA constraints, we are pivoting to a single-draftpad approach." (source: `docs/archive/v3_0/v3_MULTI_WINDOW_CANCELED.md:54-56`)

  + **How it now works (verbatim)**:
    1. **The Core Draftpad**: when Thot boots up without an `?id=` parameter in the URL (which always happens on a fresh PWA OS restart), the bootloader simply defaults the `windowId` to `"main"`.
    2. **URL Correction**: it instantly `replaceState`s the URL to `?id=main`. Because the PWA always restarts at `/`, it will always predictably route back to the user's permanent `main` draftpad storage partition.
    3. **Disposable Temp Windows**: when the user presses **CMD+N** or Share → New Window, the `newWindow()` function explicitly overwrites the URL parameter with a new randomly generated string prefixed with `temp-` (e.g. `?id=temp-xyz123`). This safely isolates the secondary windows while ensuring they don't clobber the primary `main` working document.

  + **Proposed (and shipped) changes**:
    - `src/main.ts`: instead of generating a 6-character random string in the fallback block, hardcode the `windowId` generation to `'main'`.
    - `src/file-system.ts`: alter `newWindow()` — instead of stripping parameters completely, explicitly `.searchParams.set('id', 'temp-' + random)` so spawned windows are isolated from the permanent `main` draftpad.
  + (source: `docs/archive/v3_0/v3_MULTI_WINDOW_CANCELED.md:62-68`)

#### Why this is the right call (user-decision rationale)

  + The v3.1.1 multi-window machinery is **still in the code** — it wasn't ripped out, it was repurposed. The `setPersistenceId(id)` / `setStateId(id)` partition primitives now support the `main` default + `temp-*` window pattern. (source: `docs/archive/v4_0/processed/SNAPSHOT_v3_1_2_.md:105-106`; `docs/THOT_APP.md:158-160`)
  + The "single permanent draftpad, plus disposable scratch windows" model **matches the original v1 mental model** anyway: "Thot v1.0.0_deskpad is not a knowledge management system, it's a single legal notepad on a desk" (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:37`). The persistence pivot accidentally restored the v1 intent.
  + Cross-device sync — the actual end-goal that multi-window was a sloppy proxy for — is a fundamentally different problem and is handled in the Cross-Device Sync section below, not by URL-partitioned localStorage.

#### Open thread (deferred from v3.4.0 planning, never implemented)

  + Track A.4 of `RE_ORIENT_v3_4_0.md` proposed an additional layer: **maintaining a `thot:open-windows` registry in `localStorage` listing every active `?id=*` window. On app launch with no `?id=` URL parameter, re-open the registry's entries (the main pad + each surviving temp window) as separate PWA windows / tabs.** Macros around macOS Safari's PWA launch-param stripping (the v3.1.1 lesson) would apply: keep the registry as the source of truth, not URLs. (source: `docs/archive/v4_0/processed/RE_ORIENT_v3_4_0.md:101-108`)
  + This was *not* shipped. **Status: (Spec'd in v3.4.0 plan, not shipped — deferred indefinitely)**. Anyone considering it must contend with the same Safari PWA launch-param stripping the v3.1.1 architecture died on.

### v1-era macOS file-system model (preserved for posterity)

**Status: (Cancelled — abandoned at v2 pivot to web; persistence model superseded)**

Before the web pivot, v1's persistence model was a real `.md` file on disk. Captured here because (a) it informs the eventual native-wrapper persistence layer, and (b) it's the original "single legal pad on a desk" implementation.

  + **Scratchpad file location**
    - Directory: `~/Library/Application Support/Thot/`
    - File: `deskpad.md`
    - Full path: `~/Library/Application Support/Thot/deskpad.md`
    - (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:290-294`)

  + **Behavior**
    - On app launch: if `deskpad.md` exists, read contents as UTF-8 string. If not, create an empty file and treat as blank pad.
    - On text changes: mark as dirty, debounced autosave (500–1000ms after last change).
    - On app background / termination: ensure latest text state is saved.
    - **No versioning, no backups, no multi-file logic in v1.**
    - (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:296-309`)

  + **Future-proof metadata file (the seed of `thot:state:<id>`)**
    - File: `~/Library/Application Support/Thot/state.json`
    - Fields: `caretPosition: Int` (UTF-16 offset), `scrollOffset: Double`, `createdAt`, `updatedAt` timestamps
    - "Optional for v1 but extremely cheap and makes UX feel 'telepathic' on relaunch. It also gives future AI features a place to store non-text preferences without polluting the markdown file."
    - (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:312-321`)

  + **v1 modules that mapped one-to-one onto current code**
    - `ScratchpadStorage` (Swift) → `src/persistence.ts` (TS)
    - `StateStorage` (Swift) → `src/state.ts` (TS)
    - Both were Swift actors for thread safety; `ScratchpadStorage` used atomic writes for safety; `StateStorage` saved JSON with `caretPosition`, `scrollOffset`, `updatedAt`; debounce interval 500ms for saves, 100ms for highlighting.
    - (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:539-559`)

  + **Why the pivot away from this model**: SwiftUI + NSTextStorage was architecturally unsuited for responsive text editors (per the v2 retrospective). VS Code, Cursor, and modern editors use web technologies for exactly this reason. CodeMirror 6 solved the highlighting performance problem out of the box. PWA gave a single codebase across platforms. (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:12-18`)

  + **Forward implication**: when native wrappers ship (vNext, Capacitor + native Swift hosts), the v1 filesystem model is the natural pattern for native persistence — `~/Library/Application Support/Thot/` (macOS) or the iOS app-group container, with the same caret/scroll metadata sidecar.

### Recovery work — Anti-Gravity session loss

**Status: (Historical — successfully recovered)**

A v3.1.0 session was lost mid-flight due to an Anti-Gravity agent UI bug that wiped Sean's access to conversation history. Sean documented the state in `docs/archive/v3/PICKUP.md` and a recovery happened in a follow-on session. The recovery succeeded; v3.1.0 (autocorrect engine), v3.1.1 (multi-window — later cancelled), and v3.1.2 (single-draftpad fallback) all shipped within a single weekend after the recovery. (source: `docs/archive/resources/Restoring-Lost-Conversation-History.md:1-100`; `docs/archive/v3_0/v3_RECOVERY_FINALIZATION.md`)

Lessons carried forward: docs from mid-flight Anti-Gravity sessions describe work as if final — be skeptical. State authority lives in SNAPSHOT documents written after testing.

### Service Worker / PWA cache (relevant to persistence UX)

  + **Service Worker**: shipped in v2.0.0 Phase 5 via vite-plugin-pwa, primarily for offline support and caching.
  + **Aggressive caching gotcha**: changed a source file but `npm run preview` shows the old version? You forgot to `npm run build` first, OR the service worker cached the old version — incognito or `Cmd+Shift+R`. (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:106-109`)
  + **No PWA install promotion**: per Sean's locked stance, the PWA install button/banner should be suppressed. Real native shells come in vNext; PWA muddies the upgrade narrative. (source: project memory `feedback_no_pwa_install_until_native.md`; flagged in `BUILD_REPORT_v4_0_0.md:58` as a v4.0.1 candidate)

### Open Questions — Persistence & State

  + **Should `thot:open-windows` window-restore registry get built?** Spec exists (v3.4.0 plan); never shipped. Solves "PWA always reopens all open windows" but inherits the Safari URL-stripping problem.
  + **localStorage quota at scale**: a single 5–10MB origin quota across all `temp-*` partitions could become a problem if temp windows accumulate. No GC policy exists today. Open whether temp partitions should auto-expire after N days, or whether the user gets a "you have N old temp windows, clean up?" UX.
  + **How does persistence cooperate with cross-device sync (v1 single-user sync) once it ships?** localStorage stays as the primary cache; Postgres is the canonical store; conflict UX is open (see Cross-Device Sync section).
  + **How does persistence cooperate with collab CRDT once it ships?** Yjs has its own IndexedDB persistence layer (`y-indexeddb`). The current `localStorage` model and a future `y-indexeddb` model can coexist (collab-mode docs go through Yjs; solo-mode docs stay in `localStorage`), but the boundary and the "this doc just became a collab doc" upgrade path are unspecified.

---

## File Management & I/O

Thot's file management story is intentionally light — there is no document model, no Finder hierarchy, no sidebar. The app exposes three operations against the underlying filesystem: **Open**, **Save / Save As**, and **Share**. The implementation lives in `src/file-system.ts` as a feature-detected abstraction that uses the modern File System Access API where supported and falls back to standard input/anchor element flows on Safari and iOS.

### Current shipping behavior **(Shipped, with known gaps)**

  + **File System Access API + iOS fallback abstraction**
    - File operations are abstracted into `src/file-system.ts`
    - **Progressive enhancement** for Desktop Chrome users: `showOpenFilePicker` / `showSaveFilePicker` — saves directly back to an active file handle
    - **Polyfill fallback** for iOS Safari: `<input type="file">` element for importing files into memory, and `<a download="filename.md" href="blob:...">` approach for exporting/saving
    - The modern `showOpenFilePicker` / `showSaveFilePicker` APIs are **NOT** supported on iOS or Mac Safari — fallback is mandatory there
    - Wrapped in feature-detect `if ('showOpenFilePicker' in window)`
    - (source: `docs/archive/v3_0/v3_THREE_TRACK_IMPL.md:25-32`; `docs/archive/v3_0/v3_USABILITY_TESTING.md:18-22`; `docs/THOT_APP.md:436-440`)

  + **Keyboard shortcuts**
    - `Mod-o` (CMD+O on Mac, Ctrl+O elsewhere) — open file
    - `Mod-Shift-s` (CMD+Shift+S) — save as
    - `Mod-s` (CMD+S) — intercept browser save dialog and call `forceSave()` to localStorage (this is *not* file-save — it's a force-flush of the autosave queue)
    - (source: `docs/archive/v3_0/v3_USABILITY_TESTING.md:22, 95-97`; `docs/archive/v2_0/UPDATES_v2_0_0.md:170`)

  + **CMD+S intercept (v2.0.0 Phase 7)**
    - Triggers `forceSave()` instead of opening the browser save dialog
    - This is documented separately from "Save As" because the user's intuition for CMD+S is "save my work" — in a localStorage app, the relevant flush is the autosave queue, not a file write
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:170`)

  + **Share button (Web Share API)**
    - Custom "Share" UI button in the top-right calls `navigator.share({ title, text, url })`
    - Built because standalone iOS PWAs lose the native Safari share button
    - Strictly scoped to supported environments (PWA on iOS, modern desktop browsers)
    - Wired to `shareDocument()` in `src/file-system.ts`
    - (source: `docs/archive/v3_0/v3_THREE_TRACK_IMPL.md:31`; `docs/archive/v3_0/v3_USABILITY_TESTING.md:29-30`; `docs/THOT_APP.md:439`)

  + **`src/file-system.ts` API surface**
    - `openFile()` — File System Access API where supported, falls back to `<input type="file">` for Safari/iOS
    - `saveFileAs()` — `showSaveFilePicker` with download fallback
    - `shareDocument()` — `navigator.share` for PWA share sheet, alert fallback
    - `newWindow()` — opens a new tab at `?id=temp-<random>` for ephemeral scratch (covered in Persistence section)
    - (source: `docs/THOT_APP.md:436-440`; `docs/archive/v4_0/processed/SNAPSHOT_v3_1_2_.md:49-53`)

  + **PWA title bar deduplication (v4.0.0)**
    - In PWA standalone mode, the shell auto-appends the manifest `name` field (`Thot`). Combined with the app's own `document.title = "${filename} - Thot"`, this produced `"filename - Thot - Thot"`.
    - Fix in `src/file-system.ts`: all three title assignments now set just the filename. `index.html`'s static `<title>Thot</title>` is the bootstrap title before any file is loaded.
    - Result: opening `daily-planner.md` reads `Thot - daily-planner.md` (one suffix from the PWA shell, not two).
    - (source: `docs/archive/v4_0/v4_0_0_BUILD.md:218-242`; `docs/archive/v4_0/BUILD_REPORT_v4_0_0.md:71`)

### Known gaps and testing results

  + **File save sync is broken across windows/tabs.** Per v3.1.0 usability testing: "There are some oddities... I think these bugs will be eliminated with other fixes. Once the new windows and new tabs show new content instead of duplicate content they should behave cleaner — and will test again after that fix." Sean's read: the file I/O bugs are likely downstream of the (then-buggy) cross-window content sync behavior; should not be assessed until that's fixed. (source: `docs/archive/v3_0/v3_USABILITY_TESTING.md:50-62, 90-94`)
  + **AirDrop / Share from iOS Safari sends only the URL, not the content.** Tested on iOS: pressing Share → AirDrop just opened the IP URL on the recipient computer with no content. Same behavior for email. Same in Chrome on mobile. (source: `docs/archive/v3_0/v3_USABILITY_TESTING.md:225-247`)
  + **Share button works on desktop localhost, not on mobile IP preview.** `http://localhost:4173` shows the share button and shares content; `http://192.168.0.36:5173` (the mobile testing IP) doesn't display the custom share button at all. On mobile, Safari's native share button takes over and sends only the URL. (source: `docs/archive/v3_0/v3_USABILITY_TESTING.md:248-260`)
  + **Mobile cursor and selection are very hard to use.** "Every tap it responds by either entering into edit text or exiting the text editing stance." The only way to paste was to type random letters, double-tap to highlight, then use the paste option from the highlight menu. (source: `docs/archive/v3_0/v3_USABILITY_TESTING.md:262-264`)
  + **Highlighted text color (light green on charcoal) is very hard to see on mobile.** Possible v5+ polish item. (source: `docs/archive/v3_0/v3_USABILITY_TESTING.md:271-272`)

### Legacy concepts — potential future polish

These come from v2 forward-looking sections. They have not been formally re-scoped for v4+ but are captured here so they don't fall out of the picture.

  + **Export to simple PDF (v2 forward item #7)** **(Concept, needs research)**
    - "Markdown rendered without markup notation. Solid text colors, different size for headers. No need for fancy spacing or font changes initially."
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:222-226`)

  + **Print functionality (v2 forward item #8)** **(Concept, needs research)**
    - "Print the markdown as you see it in the app. Start simple — just the rendered view."
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:228-231`)

  + **Auto-Import from Apple Notes (legacy concept, native-wrapper era)** **(Concept, needs research — needs native wrapper)**
    - Implicit in the v2/v3 "native benefits" inventory: "file system access, spellcheck, speech-to-text, haptics, Share sheet, Reminders integration, @date notation for notifications"
    - The Apple Notes auto-import was discussed as an automation hook within the native shell — the PWA layer would not have direct access. Lives downstream of the Capacitor/Native phases (vNext).
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:244-249`; native intent in `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:179-213`)

  + **Clear content / Export / Import / Save / Open consolidation** **(Speculative — future watching)**
    - From v2 feedback: "'Clear content' button feels weird. 'Export' and 'Import' are confusing without a save/open plan. May make more sense to use native file system tools in SwiftUI wrapper (v3)."
    - This concern was partially resolved by the v3.1 file-system abstraction, but the larger question — whether Thot eventually has a real document model with a sidebar / Finder-column-view organization — remains open.
    - (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:237-241`; open question in `docs/archive/v4_0/processed/SNAPSHOT_v3_1_2_.md:155-156`)

  + **Local file paths as clickable links** **(Spec'd, deferred)**
    - The v4.1.0 URL clickability spec **explicitly excludes local file paths**, "deferred until/unless we ship a native shell that can resolve them."
    - (source: `docs/archive/v4_0/v4_1_0_BUILD.md:9`; `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:343`)

### Mobile / iOS file I/O constraints

  + iOS Safari does not support `showOpenFilePicker` / `showSaveFilePicker`. The `<input type="file" accept=".md, .txt">` fallback works but the UX is rougher.
  + Standalone iOS PWAs lose the native Safari share button — the custom Share button is required.
  + iOS Safari's PWA shell strips dynamic URL parameters on cold launch (see the v3.1.1 cancellation narrative in Persistence & State).
  + Predictive text bar on iOS: disabled via `EditorView.contentAttributes.of({autocorrect: "off", autocapitalize: "off"})` — this is editor-side, not file-system-side, but it crosses with the share button experience because iOS treats the editor as a form field.
  + (source: `docs/archive/v3_0/v3_THREE_TRACK_IMPL.md:29-32`; `docs/archive/v3_0/v3_USABILITY_TESTING.md:213-221`)

### Open Questions — File Management & I/O

  + **Does v5+ introduce a real document model?** Sidebar, Finder-column-view, tags (`#ProjectTag`), `@mention` linking between notes by title — all surfaced as v3.x / v4.x ideas. **CONFLICT**: The v2.0.0 forward-looking section listed Finder-column navigation as a v3.x deliverable (source: `docs/archive/v2_0/UPDATES_v2_0_0.md:283-287`), but every subsequent doc has either deferred this to vNext (columns + sticky-notes scaffold) or left it explicitly open. Current canonical position: vNext direction, not promised.
  + **What happens when a temp window has an open file?** When you `openFile()` in a `?id=temp-xyz` window, do file edits write back to disk on `forceSave`, or only to localStorage? Today the file handle is held in memory only; the relationship between file-handle persistence and the temp-partition isn't specified.
  + **AirDrop / Share content vs URL on iOS** — there's a mobile-only bug where Web Share API sends only the URL. Worth investigating whether `text:` field actually carries doc content on iOS 18+.
  + **PDF export and Print** — not scoped, not implemented. v2 carryover items.
  + **Auto-Import from Apple Notes** — requires native wrapper; not in current roadmap.

---

## Cross-Device Sync

Cross-device sync is the most explicitly **broken/blocked** aspect of Thot in its current shape. The desire is concrete and oft-repeated; the architecture has been researched to a locked recommendation; nothing is shipped yet because (a) it forces an auth decision, (b) it forces a backend decision, and (c) it cross-cuts collaboration and monetization in ways that would have been premature to commit to before v4. The path is now clear.

### The desire (clear and unambiguous)

  + "Documents written on the laptop should appear on the phone, and vice versa, without manual copy-paste. This is a prerequisite for serious daily use — currently `localStorage` is per-device, so the same user has fragmented state across devices."
  + (source: `docs/archive/research/1_DEEP/sync-and-cross-device/1_REVIEW.md:11-14`)
  + Sean's clarification during v3 testing: "I did mention that it would be helpful if we could edit the same document on mobile and desktop. However that functionality does not work; every browser and app silos contents. This across device note taking could be solved by Saving and Opening files." (source: `docs/archive/v3_0/v3_USABILITY_TESTING.md:55-58`)

### Current state **(Broken/blocked — no sync today)**

  + There is no backend. Every Thot instance is independent localStorage state.
  + Cross-device editing today requires the user to manually `saveFileAs()` on one device and `openFile()` on another — which is itself buggy (see File Management § Known gaps).
  + The v3.1.1 multi-window attempt at "same content across windows" was the wrong substrate (URL-partitioned localStorage in the same browser cannot reach a different device's browser) and was cancelled — see Persistence § The multi-window history.

### Architecture options (**Research locked; ready to plan**)

The research bucket `docs/research/1_DEEP/auth-and-sync/OPTIONS.md` produced a comparative matrix and a locked recommendation. The sync question splits into two regimes that shouldn't be conflated:

  1. **Per-user device sync** — same user editing the same doc on phone and laptop, *not concurrently*, but expecting "what I wrote on phone shows up on laptop." Last-writer-wins per-doc is sufficient. Simple Postgres rows with `updated_at` timestamps + a pull-on-focus + a debounced push handle this.
  2. **Concurrent multi-user collaboration** — two humans (or a human and a Claude agent) typing in the same doc simultaneously. This requires a CRDT or OT, a presence channel, and a transport. Last-writer-wins corrupts data here.

  *Treating these as the same problem leads people to over-engineer v1 (Yjs from day one) or under-engineer v3 (LWW on a collab editor → silent data loss).* (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:130-138`)

### Sync option comparison (verbatim from research)

  + **Yjs (CRDT, OSS)** — The de-facto JS CRDT library. Battle-tested in BlockNote, Tiptap, JupyterLab. Fit with CodeMirror 6: excellent (`y-codemirror.next` is a maintained, first-party-quality binding). Transport: BYO (`y-websocket`, `y-webrtc`, or Supabase Broadcast / a custom WS server / Liveblocks). Persistence: BYO (`y-indexeddb` for offline). Lock-in: none.
  + **Liveblocks** — Hosted realtime infrastructure with a Yjs-compatible API and presence/awareness primitives. Drops into CodeMirror via `@liveblocks/yjs` + `y-codemirror.next`. Free tier: MAU-style limits, **VERIFY**. Pros: managed transport + persistence; presence and comments come free. Cons: hosted dependency; cost scales with active rooms. Lock-in: moderate — Yjs document format is portable but the room/presence API is theirs.
  + **Automerge** — Rust core, stronger story for local-first / offline-first apps. Fit with CodeMirror 6: `@automerge/automerge-codemirror` exists, ecosystem thinner than Yjs's. Pros: best-in-class for local-first; the `@automerge/automerge-repo` model handles offline-edit-then-reconcile elegantly. Cons: smaller ecosystem; CodeMirror integration not as polished.
  + **Supabase Realtime (Broadcast / Presence / Postgres CDC)** — Three primitives: Postgres CDC, Broadcast (ephemeral pub/sub), Presence (who's-online). Excellent for regime 1 (per-device sync). For regime 2 (collab), Broadcast is the transport but Yjs/Automerge on top is still required.
  + **Custom CRDT** — "Don't. Building a correct CRDT is a research-grade undertaking. Yjs and Automerge exist for a reason."
  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:141-177`)

### Locked recommendation

```
v1 (per-device sync, single user):
  Vercel Postgres / Neon with a `documents` table keyed by `user_id`
  and `document_id`. Push on debounced editor change; pull on focus
  / `visibilitychange`. No realtime needed. Last-writer-wins per-doc,
  with a soft conflict UI ("this doc was edited on another device,
  want to reload?") if `updated_at` mismatches.

v2 (collab):
  Yjs + `y-codemirror.next`, with Liveblocks as the hosted transport.
  Liveblocks gives presence and persistence out of the box and is the
  cheapest path to "two cursors in one doc." Yjs documents stay
  portable — if Liveblocks costs become uncomfortable, swap the
  transport for self-hosted `y-websocket` on a small VPS without
  changing application code.
```
(source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:242-260`)

  + **Why not Supabase Realtime as the v1 sync transport.** Real per-device sync at v1 doesn't need pub/sub. A polling-on-focus pull is simpler, cheaper, and doesn't add a connection limit to worry about. Reach for Realtime when the use case actually demands it (collab cursor presence), and at that point Yjs/Liveblocks is a more direct fit.
  + **Why not Automerge.** Architecturally most elegant for a local-first PWA, but the CodeMirror binding ecosystem is thinner than Yjs's. Revisit at v3+ if local-first becomes the product's wedge.

### CRDT vs LWW — the open question

The research treats CRDT vs LWW as **a regime split, not an architectural choice**. v1 sync is LWW; v2 collab is CRDT. The question Sean's original seed asked — "should v4 commit to CRDT from day one to avoid a rewrite, or LWW first then layer CRDT later?" — has a locked answer: **LWW first**. Reasons:

  + Per-user device sync at v1 doesn't benefit from CRDT — there is no concurrent edit case to merge.
  + The Postgres-LWW v1 layer is cheap to build and cheap to throw away when v2 collab lands.
  + Yjs replaces the LWW layer cleanly: the `localStorage` cache becomes `y-indexeddb`, the Postgres push becomes a Yjs update broadcast, no application-code rewrite if the Liveblocks transport is chosen.
  + The risk of "we should have CRDT'd from day one" is mitigated by Yjs's portability — there is no Yjs-shaped lock-in to regret missing.

### iOS Safari constraints (critical)

  + **Passkey + PWA cold launch**: iOS PWA cold launches strip URL parameters (the v3.1.1 lesson). Any sync flow that depends on URL state surviving a cold launch is suspect. Sessions in `localStorage` or `IndexedDB` survive.
  + **Background sync is hostile on iOS Safari**: the sync model must work entirely on foreground events (focus, visibilitychange).
  + **OAuth redirect flows touch iOS Safari quirks** — for passkey/magic-link the JS-only flow is clean inside a PWA.
  + **Cross-origin auth redirects from standalone PWA on iOS** historically opened SFAuthenticationSession / SFSafariViewController, losing session cookies back in the PWA. JS-only flows are safer than hosted-page redirects for iOS PWAs. **VERIFY** current iOS 18/19 behavior.
  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:182-185`)

### Recovery UX (open)

  + Conflict UX is named but unspecified: "soft conflict UI ('this doc was edited on another device, want to reload?') if `updated_at` mismatches."
  + Worst case to design for: user edited on phone offline, then on laptop, then phone comes back online. LWW means one wins. The conflict UI must let the user see both versions and pick.
  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:244`; `docs/archive/research/1_DEEP/sync-and-cross-device/1_REVIEW.md:35-36`)

### Dependency relationships

Cross-device sync is **the most cross-cutting feature in the roadmap**. The order of operations matters:

  + **Sync requires auth.** No user identity, no way to know whose docs to sync where. → Auth & Accounts section.
  + **Sync is the substrate for collab.** v1 sync (LWW) → v2 collab (CRDT). → Real-Time Collaboration section.
  + **Sync touches monetization.** Free tier vs paid tier line is "what's accessible without an account / with a free account / with a paid subscription." Sync may be the upgrade trigger.
  + **Sync affects native wrappers.** Native shells inherit the sync layer; the macOS file-system model (`~/Library/Application Support/Thot/deskpad.md`) becomes a local cache backed by the sync layer.
  + **Sync interacts with the v3.4.0 `thot:open-windows` registry idea.** If multi-window restore ever happens, it should resolve from the sync layer, not from URL state — because URL state doesn't survive Safari cold launches.

### Existing-data migration

Every current Thot user has docs in `localStorage` (`thot:content:main` + `thot:content:temp-*`). First-time-after-account-creation needs to upload those without losing them. The legacy migration hook precedent from v3.1.1 (silent copy of pre-partition `thot:content` into `thot:content:main`) is the model.

### Open Questions — Cross-Device Sync

  + **End-to-end encryption?** If document content is encrypted with a user-derived key, the server never sees plaintext. Search across docs becomes hard; password recovery becomes catastrophic. Sean's privacy lineage favors E2E if feasible.
  + **`VERIFY` items in `OPTIONS.md`** still open: Liveblocks pricing for small-team collab, Supabase passkey-as-primary status, iOS Safari 18/19 passkey + PWA behavior, Yjs binding compatibility with Thot's existing `styleTags` + `ViewPlugin` setup.
  + **Multi-doc model**: today there is one main doc + N temp docs. Sync presumes a `documents` table with a `document_id`. The data model for "which docs sync, by what name, in what namespace" is unspecified — needs to land before the v1 sync IMPLEMENT.
  + **Sync vs collab transition**: when a doc moves from solo to collab, does its persistence representation change (LWW row → Yjs document)? Needs a clean upgrade flow.
  + **Free vs paid tier line for sync**: is single-device-only the free tier, with sync gated to paid? Or is basic sync free and "team collab" the paid line? Touches monetization.

---

## Real-Time Collaboration

Real-time collaboration is the **strategic wedge** Sean has named most explicitly as Thot's defining differentiator. The market thesis is sharp; the spec is thin. This section captures the market pitch, the competitive context, the research seed questions, and the architectural shape the research has reached — and stops short of pretending detail exists where it doesn't.

### The market pitch **(Concept — strategic intent)**

From the canonical strategic framing in `FEATURES_BEHAVIORS.md` (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:57-64`):

> **Real-Time Collaboration**
>
> Allow for real-time collaboration between users as they edit and iterate on plans. We want them to be able to login on the web app using a passkey, and interact with the document in a way that feels like Google Docs, but catered to developers.
>
>   - This is core to the market opportunity that is visible in the rapidly growing developer scene
>   - Planning for this should therefore be from the ground up and use the modern methods they're used to
>   - **This does mean the bar is high**: Google Docs (and Figma) have amazing collaborative features
>   - **The opportunities are also large**: Many of the best features haven't been offered outside of the IDE

Strategic framing from the IDE-for-Markdown Replacement pillar (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:50-55`):

> Development is moving to terminals and further away from directly needing to edit code all the time, and the bulk of programming work is shifting from coding to planning. These users are iterating on plans repeatedly, collaborating with other humans and with AI. This denotes a market opportunity for an app that offers at minimum the same experience when developing a Markdown-based implementation plan, without having to even open a full IDE.

And the broader strategic frame from the 2026-04-27 session (source: `docs/archive/v4_0/processed/RE_ORIENT_v3_4_0.md:20`):

> Adjacent strategic gap: there is no good real-time collaborative editor for teams writing markdown together (the way marketing teams use Google Docs); given how much modern work is "iterate on a doc with humans + AI," this is a market opportunity worth investigating, not just a feature.

### Competitive context (from the research seed)

The collab-for-markdown research bucket exists to validate the gap as a real product opportunity or show why others have already solved it. Tools named in the research seed (source: `docs/archive/research/1_DEEP/collab-for-markdown/1_REVIEW.md:18-29`):

  + **HedgeDoc** — open-source real-time collaborative markdown editor; closest existing example of the target shape
  + **Etherpad** — generic real-time collab text; not markdown-specific
  + **GitHub.dev / Codespaces** — VS Code in the browser; collab via Live Share
  + **VS Code Live Share** — developer-focused real-time pair programming; markdown only by coincidence
  + **Notion** — proprietary block structure, not markdown
  + **Coda** — proprietary block structure, not markdown
  + **ClickUp Docs** — proprietary, productivity-suite focused
  + **Google Docs** — rich text, not markdown; the experiential bar
  + **Figma** — design tool; the experiential bar for cursors, presence, comments

The seed question reframes the status quo: *"How do dev teams currently collaborate on markdown? Git PRs on text documents (the absurd-but-real status quo), or something else? What does this actually look like in practice for non-dev teams using markdown?"*

### "Developers iterate on plans collaborating with humans and AI" — market thesis

This is the **load-bearing positioning sentence** for the collab feature. It does three things at once:

  1. **Establishes the user activity**: developers iterating on plans (not writing prose, not coding directly — planning).
  2. **Names the collaborators**: humans AND AI. AI is not a downstream feature; it's a co-equal participant.
  3. **Locates the market opportunity**: the shift from coding to planning is happening *right now*, and the existing tools for collaborative planning are not markdown-native.

From the locked auth-and-sync research (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:195-197`):

> This is a sync-layer concern, not an auth concern. The cleanest pattern is: Claude is "another collaborator" on a Yjs document, with a service account, writing through the same CRDT mutations a human would. This works identically whether the transport is Liveblocks, custom WS over Supabase, or self-hosted `y-websocket`. It does not constrain the auth choice.

So the architecture is: **AI is just another Yjs participant.** No special protocol, no inline-LLM shim. `@claude` in a doc is a service account that mutates the CRDT the same way a human cursor does.

### Paywall stance — free tier must be useful

The stance Sean has expressed: **single-user solo writing remains free and account-less** (see Auth section). Sync and collab are the natural paywall lines. But "free tier must be useful" — the free tier cannot be "look but don't write."

### Architecture shape (from the locked research)

  + **Transport**: Yjs + `y-codemirror.next` for the editor binding; Liveblocks as the hosted transport for v2 ship; self-hosted `y-websocket` as the escape hatch if Liveblocks pricing becomes uncomfortable.
  + **Presence**: comes free with Liveblocks (cursor positions, user avatars, who's-online).
  + **Comments**: not currently spec'd as a separate feature; presumed to ride on Liveblocks' built-in comment primitives or live in a Yjs sub-document. **Open**.
  + **Permissions**: not currently spec'd. The auth-and-accounts seed names "share-link permissions" as table stakes. **Open**.
  + **AI as participant**: Claude as a Yjs service account; same channel as humans.
  + **Conflict resolution**: handled by Yjs's CRDT semantics — no application-level merge logic required for concurrent edits.
  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:142-156, 195-197, 254-260`)

### Research questions raised (seed bucket)

From `docs/archive/research/1_DEEP/collab-for-markdown/1_REVIEW.md` — **the bucket is open; these questions are not yet answered**:

  1. How do dev teams currently collaborate on markdown? (Status quo: git PRs on text documents — absurd-but-real.)
  2. What real-time collab solutions exist for plain text / markdown today? Which support markdown specifically vs. rich text only? Open-source vs. proprietary? Who uses each, and why?
  3. **CRDT vs. OT for plain-text editing** — current state of the art? Yjs, Automerge, Diamond Types, Loro. Cost (latency, complexity, infrastructure)? Architectural constraints?
  4. **What would "Google Docs for markdown" look like as a product?** Sketch the user surface: cursors visible to peers, comments, suggestions/edits, version history, share-link permissions. Table-stakes vs. differentiating?
  5. **Audience reality check** — do non-dev markdown users actually exist in teams (not solo)? Or is "team markdown" mostly devs writing READMEs in PR review? If audience is small, wedge is weaker.
  6. **Backend implications** — real-time collab forces a server (or peer-to-peer with relay). What's the smallest viable backend? (Touches `sync-and-cross-device` and `monetization`.)
  7. **Privacy/sovereignty** — for the kind of writers Thot wants to attract (privacy-conscious, cognitive-load-conscious), what's the trust model for a hosted collab service? Self-host option needed?

### Priors and known constraints (verbatim)

  + Thot's current persistence is `localStorage`-only. Adding collab is not incremental — it forces a backend decision.
  + Sean has a privacy-conscious branding lineage (Web3 privacy DAO experience). Trust/sovereignty positioning matters.
  + The collab story directly affects `monetization` (live multi-user editing is something teams pay for) and `auth-and-accounts` (you need user identity to attribute edits and cursors).
  + (source: `docs/archive/research/1_DEEP/collab-for-markdown/1_REVIEW.md:32-39`)

### What has been seeded (in the live research folder)

The collab bucket exists in `docs/archive/research/1_DEEP/collab-for-markdown/1_REVIEW.md` as a seed only. It has NOT been promoted to `docs/research/1_DEEP/` for protocol-driven research because the auth-and-sync bucket subsumed enough of the architecture decisions to unblock both v1 sync and v2 collab without further bucket work. The remaining collab-specific questions (UX surface, comment model, permissions, version history, audience reality) are awaiting a dedicated research session.

### OPEN — needs research/spec

This section is **deliberately thin on implementation detail** because the implementation detail does not yet exist. The architecture transport (Yjs + Liveblocks) is locked; everything above the transport — the presence UX, the comments UX, the permissions model, the version-history UX, the share-link flow, the AI-as-participant interaction language, the free/paid tier line — is open.

**Anyone proposing a collab BUILD packet before these are spec'd should be redirected to the collab-for-markdown research bucket first.** Don't fabricate detail; the cost of getting the collab feel wrong is high (Google Docs and Figma have set a punishing bar) and the cost of researching properly is two sessions of work.

### Open Questions — Real-Time Collaboration

  + **Comment model**: Liveblocks-native? Yjs sub-doc? Markdown-flavored inline annotations?
  + **Permissions model**: per-doc roles (owner / editor / commenter / viewer)? Share links with embedded permissions? Org-scoped (workspaces)?
  + **Version history UX**: Yjs gives you the snapshot history primitives but the user-facing "Revert to 3pm yesterday" surface is yours to build.
  + **Suggestions / track-changes**: Google Docs has "suggesting mode" — is this on the v2 ship list?
  + **`@claude` and `@mention` of humans**: same syntax surface, different semantics — what does the @ menu look like? Does it auto-complete from the doc's collaborator list?
  + **AI participation latency budget**: if Claude is a Yjs participant writing the same way a human does, what's the streaming model? Token-at-a-time mutations? Whole-paragraph mutations on completion?
  + **Self-host story**: stated preference for sovereignty (Sean's privacy lineage). Liveblocks is hosted. The "swap to `y-websocket` on a small VPS" escape hatch is real but requires us to actually build that VPS bundle. Open whether v2 ships self-host as a first-class option.
  + **Audience reality check**: does the team-markdown audience actually exist outside dev teams writing READMEs in PR review? Open and load-bearing for the business case.
  + **Privacy model**: is collab E2E-encrypted (in which case Liveblocks sees opaque blobs and presence/comments need to ride on a different layer)? Or is collab plaintext-on-server with a trust-the-vendor stance?

---

## Authentication & Accounts

Authentication for Thot has one hard constraint and a lot of secondary preferences. The hard constraint: **passkey-first is non-negotiable**. The research bucket has produced a locked recommendation: **Clerk**. This section captures the constraint, the comparative research, the recommendation rationale, and the open `VERIFY` items that still need a Phase 2 pass before any auth code lands.

### The non-negotiable: passkey-first **(Sean's locked constraint)**

> **Passkey-first** is non-negotiable per Sean's product values; password+social are fallback only.
> (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:17`)

> BUT THE MOST IMPORTANT IS PASSKEY
> (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:161`)

This is the constraint that filters every provider option. Providers that treat passkeys as a second-factor (MFA) layer on top of email/OTP do not meet the bar. The user should be able to tap "Sign in with passkey," touch their device's biometric, and be in — without ever typing an email.

### Current state **(Not implemented)**

  + There is no auth today. Thot is account-less local-mode only.
  + The PWA has no login surface, no user identity, no per-user state.
  + Adding accounts is *additive*, not replacement — the account-less local mode must remain a first-class path (source: `docs/archive/research/1_DEEP/auth-and-accounts/1_REVIEW.md:34`).

### What an account would store (from the research seed)

When auth ships, an account holds:
  + **User identity** — for collab attribution (cursor names, comment authorship).
  + **Sync token / encrypted-doc keys** — for cross-device persistence.
  + **Subscription state** — for monetization gating.
  + **User preferences** — post-v6 Preferences UI (`thot:prefs`).
  + (source: `docs/archive/research/1_DEEP/auth-and-accounts/1_REVIEW.md:26-29`)

### Provider options — comparative research

The full comparative matrix from `docs/research/1_DEEP/auth-and-sync/OPTIONS.md`:

| Option                 | Passkey-first DX | iOS PWA fit | Free tier (early) | Sync included | Vite/SPA fit  | Lock-in  |
| ---------------------- | ---------------- | ----------- | ----------------- | ------------- | ------------- | -------- |
| Supabase Auth          | Good (MFA-ish)   | Good        | Generous*         | Yes (no CRDT) | Excellent     | Low-Mod  |
| Clerk                  | Excellent        | Good        | 10K MAU           | No            | Good          | Moderate |
| Auth.js                | Decent           | N/A         | Free OSS          | No            | Poor (no SSR) | Low      |
| WorkOS                 | Strong           | OK (redir.) | Very generous*    | No            | Good          | Moderate |
| Stytch                 | Excellent        | Good        | Modest            | No            | Excellent     | Moderate |
| Custom WebAuthn + Neon | As-built         | Excellent   | Generous          | DIY           | Excellent     | None     |
| Hanko                  | Excellent        | Good        | Generous (OSS)    | No            | Good          | Low      |

*subject to project pause / cold-start tradeoffs

(source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:201-213`)

### Option-by-option rationale (summary; see OPTIONS.md for full text)

  + **Supabase Auth** — Passkey support is currently MFA-shaped, not primary-shaped (as of late 2025 / early 2026). "Passkey-first sign-in" — where a returning user taps "Sign in with passkey" and never types an email — is not the native happy path. **VERIFY** whether Supabase has shipped passkey-as-primary by Q2 2026. Free tier: 50K MAU, 500 MB Postgres, 2 GB bandwidth, projects pause after 7 days. Sync story is native (Postgres CDC, Broadcast, Presence). Choose if the auth+DB bundle is compelling and the passkey gap closes; otherwise pass.
  + **Clerk** **(Recommended)** — Shipped passkey GA in 2024 and treats them as a first-class primary factor — users can sign up *with* a passkey and sign in with it as the sole credential. **This is probably the cleanest passkey-first developer experience in the market.** Free tier: 10K MAU. Above 10K it jumps to ~$25/month + $0.02/MAU. PWA-wise, sessions are JWT-cookie based; the `routerPush`/`routerReplace` props let you intercept iOS-specific redirect-back URL issues. Sync story: none — bring your own DB + sync layer.
  + **Auth.js** — V5 added a WebAuthn provider in 2024, but Auth.js's branding is Next.js-first. There is no first-class plain-Vite/SPA adapter. Thot is a non-Next Vite SPA with no server runtime. Auth.js is the wrong tool until Thot adopts a server framework.
  + **WorkOS / Stytch** — Both ship strong passkey-first flows. WorkOS made User Management free up to 1M MAU as a deliberate stake against Clerk. **VERIFY** current ceiling. Stytch's pure-JS SDK is well-suited to Vite SPAs. Neither ships a sync layer.
  + **Custom WebAuthn + Vercel/Neon Postgres** — As good as you build it. `@simplewebauthn/browser` and `@simplewebauthn/server` are the de-facto libraries. Complexity: **high for v1.** The bug surface for "passkey + email recovery + lost-device flow + account-recovery email-deliverability" is substantial. Choose when you've outgrown a provider or when compliance demands it.
  + **Other** — Hanko (OSS passkey-first, smaller ecosystem, **VERIFY** 2026 maturity), Logto (OSS Auth0 alternative), Kinde (newer entrant), Auth0 (legacy giant, pricing escalates fast — not recommended).
  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:29-126`)

### Locked recommendation: Clerk

> **Why.** Passkey-first is non-negotiable for Sean, and Clerk has the cleanest passkey-primary developer story in the market. Their free tier (10K MAU at cutoff) is more than enough for the foreseeable Thot user base. The `@clerk/clerk-js` vanilla SDK fits a Vite SPA without forcing a framework rewrite. The drop-in UI handles the lost-device / passkey-recovery edge cases that would otherwise cost weeks. And Clerk is a Vercel Marketplace-native integration, which means env-var provisioning is one click rather than a config drift hazard.
>
> **Why not Supabase Auth (the other strong contender).** Supabase's value proposition is the bundle: auth + Postgres + Realtime in one console. That's compelling. But the passkey story today is MFA-shaped, not primary-shaped, and Sean's "passkeys MOST IMPORTANT" framing makes that gap costly.
>
> **Why not Auth.js.** Vite SPA without a Next.js/SvelteKit-shaped server runtime makes Auth.js the wrong tool.
>
> **Why not custom WebAuthn at v1.** The auth surface is implementable but the bug surface around recovery, rate limiting, and email deliverability is real. Defer until there's a forcing function.

  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:230-240`)

### Stack at a glance

```
Auth:        Clerk (passkey-primary, magic-link fallback, Sign in with Apple)
DB:          Vercel Postgres / Neon (per-user docs, soft tier)
v1 Sync:     pull-on-focus + push-on-change (no realtime needed)
v2 Sync:     Yjs + y-codemirror.next + Liveblocks transport
AI:          Claude as a Yjs participant via service account; same channel as humans
Hosting:     Vercel (current)
```
(source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:253-261`)

### iOS Safari passkey behavior — critical platform note

  + Passkeys work in Safari iOS 16+. The platform passkey is stored in iCloud Keychain and syncs across the user's Apple devices automatically. **This is the best-case experience for "I made a passkey on my iPhone and now I'm signing in on my MacBook."**
  + The PWA-specific failure mode that bit Thot at v3.1.1 was `manifest_url` overrides and `?id=` parameter loss on cold-launch. Auth flows should not rely on URL parameters surviving a Safari standalone PWA cold launch.
  + Cross-origin auth redirects from a standalone PWA on iOS historically opened SFAuthenticationSession / SFSafariViewController, losing the session cookie back in the PWA. JS-only flows (Supabase magic link processed in the SPA, Clerk's `clerk-js` UI components) are safer than hosted-page redirects (Auth0 Universal Login, WorkOS AuthKit redirect mode) for iOS PWAs. **VERIFY** current iOS 18/19 behavior.
  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:182-185`)

### Account recovery

  + Passkey-only accounts have a recovery problem the moment the user loses all their devices. Standard pattern: (a) require an email on signup so a recovery magic-link works, or (b) provide one-time recovery codes at passkey creation time.
  + Every provider above supports (a). Only some make (b) easy. **Worth a Phase 2 verification.**

### Social / magic-link fallback stance

  + Sean's stated reluctance to "login with Google, etc." is real, but on iOS in particular, **Sign in with Apple is socially the lowest-friction non-passkey path and is required by App Store policy for any app offering third-party sign-in.** Adding it costs ~30 minutes via any of the providers above.
  + **Locked recommendation: passkey primary, magic-link email fallback, Sign in with Apple as the one social option. Skip Google for now** (avoid the consent-screen verification overhead until there's revenue).

### Local-mode preservation for no-account users

  + The account-less local mode must remain a **first-class path**. How do we keep "open `thots.august.style`, type, save to localStorage" exactly as-is for users who never sign in?
  + Forward implication: the auth surface is **opt-in upgrade**, not a forced wall. The first-run experience for an anonymous user should be identical to today — open the URL, type, autosave to localStorage. Sign-in is the path to sync/collab/AI features, not the path to the editor.

### Privacy posture (open)

E2E encryption with user-derived keys gives the strongest privacy story but trades off: search across docs becomes impossible (server can't index plaintext); password recovery becomes catastrophic; collab requires every collaborator to share the key; AI integration becomes hard if Claude can't see plaintext. **Probably not E2E for v1 of accounts.** Worth revisiting when sovereignty positioning becomes a marketing wedge.

### What triggers a re-evaluation of Clerk

  + **Clerk pricing changes** that move the free tier below ~5K MAU, or that gate passkey behind Pro.
  + **Supabase ships passkey-primary GA** with a clean Vite-friendly SDK. The simplicity of "one vendor for auth + DB + Realtime" becomes very tempting if the passkey gap closes.
  + **Liveblocks pricing** crossing the threshold where self-hosting Yjs is cheaper. Likely happens around several hundred concurrent collab rooms.
  + **Thot adopts a server framework** (Next.js, SvelteKit, Hono on Vercel Functions). At that point Auth.js + custom WebAuthn becomes viable as a zero-vendor option.
  + **iOS Safari regression** in passkey or PWA behavior that breaks Clerk's drop-in flow.

### Open `VERIFY` items (from research, Phase 2 needed)

  1. **Supabase passkey-as-primary status.** Has "passkey-first sign-in (no email step)" shipped?
  2. **Clerk pricing structure as of Q2 2026.** Free MAU, paid jump, organizations gating.
  3. **WorkOS User Management free MAU ceiling.** Was 1M at announcement; verify current.
  4. **iOS Safari 18/19 passkey + standalone PWA behavior.** Redirects, cookie persistence after passkey ceremony, `navigator.credentials.create` from a standalone PWA installed via "Add to Home Screen" vs. from Mobile Safari.
  5. **Liveblocks pricing for "small team" (5–25 collaborators).** Whether per-MAU or per-room pricing applies.
  6. **Hanko production readiness in 2026.**
  7. **Whether Clerk's `@clerk/clerk-js` (vanilla) covers passkey UX as cleanly as `@clerk/clerk-react`.** Thot is plain Vite TS, not React.
  8. **`y-codemirror.next` compatibility** with the current CodeMirror 6 ecosystem package versions Thot uses, especially around the custom `styleTags` + `ViewPlugin` setup.
  + (source: `docs/research/1_DEEP/auth-and-sync/OPTIONS.md:217-227`)

### Open Questions — Authentication & Accounts

  + **Vanilla-Clerk passkey UX parity.** `VERIFY` item #7 above. Open whether `@clerk/clerk-js` ships the same drop-in passkey components as `@clerk/clerk-react`. If not, we either re-architect to React or build the passkey ceremony ourselves on top of Clerk's session APIs.
  + **iOS Safari 18/19 passkey + standalone PWA cold-launch behavior.** `VERIFY` #4. Load-bearing — if there's a regression we don't know about, Clerk's drop-in may fail on the platform that matters most.
  + **Account recovery codes** — standard among providers? Worth Phase 2.
  + **Sign in with Apple integration timing**. App Store policy makes it required if we ship a native iOS shell that also offers third-party sign-in. The 30-minute integration cost makes it a no-brainer for v1 of auth.
  + **Anonymous → authenticated upgrade flow**. User has been using Thot account-less for 6 months with a `main` doc full of notes. They sign in. What happens to the existing local content? Most likely: claim the local content as their first doc on the server. Needs UX spec.
  + **Multi-account on the same device**. Not addressed in research. Probably out of scope for v1 of accounts.
  + **Organization / team accounts**. Clerk gates orgs behind Pro. The collab story implies teams eventually. Open whether teams are part of v1 of auth or wait for v2 (collab) of auth.
  + **AI billing identity**. Stripe billing-by-token model is named in vNext AI integration plans. The account-level Stripe customer is the natural place to hang token spend — does Clerk's Stripe integration meet this or do we wire Stripe ourselves?
  + **Privacy / E2E encryption**. Probably not E2E for v1.

<!-- ============================================================ -->
<!-- WRITER D OUTPUT — Interactive Markdown, AI Integration,      -->
<!-- Preferences UI, Workspace & Multi-Note, Native Wrappers,     -->
<!-- Monetization                                                 -->
<!-- ============================================================ -->

## Interactive Markdown (Links / Anchors / References)

This section captures everything in the corpus about clickable, navigable, cross-referencing behavior in the editor surface: URLs, inline markdown links, in-document anchor jumps, local file path handling, touch/long-press equivalents, the `@noteName` cross-document link concept, and the `#ProjectTag` auto-sectioning concept. The first three are partially shipped; the rest are deferred / concept-level.

### Strategic frame

  + **Why it matters** — Clickable URLs and anchor links were called out from the v4.0 reorientation as part of the "rounding out the basics" track. Sean's framing in v4 planning: *"A handful of simple, UX that users would expect of any application, like clickable URL likes, URL preview, anchor links, and a standard flow for saving and opening files; consider these us rounding out the basics."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:21`)
  + **Why it's NOT optional** — *"Obviously a must have for a functioning app."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:63`)
  + **Where the original spec lived** — `docs/archive/v4_0/processed/FEAT_URLS_ANCHORS.md`, originally drafted under the `v3.2.0` numbering and re-folded into v4 as `v4.1.0`.

### URL clickability — CMD/Ctrl+Click **(Shipped v4.1.0)**

  + **Behavior shipped**
    - Holding CMD (macOS) or Ctrl (Windows/Linux) and clicking a bare URL (`https://...`) opens it in a new browser tab.
    - Holding CMD/Ctrl and clicking anywhere inside a `[text](url)` inline link opens the destination URL in a new browser tab. The follow-up commit `13031ac` made *every* position inside the markdown link clickable: label text, `[`, `]`, `(`, `)`, and the URL token itself.
    - A plain (non-modified) click places the cursor as normal — the editor stays a writing surface first.
    - URLs hover with a `cursor: pointer` affordance regardless of modifier, supplied by the `.thot-url-link` CSS class on the `tags.url` HighlightStyle entry.
    - (source: `docs/archive/v4_0/v4_1_0_BUILD.md:5-9`, `docs/archive/v4_0/BUILD_REPORT_v4_1_0.md:10-23`)

  + **Why CMD/Ctrl gate, not bare click**
    - *"Optional UX choice: CMD+Click vs normal Click — Let's assume standard click for now, but maybe require CMD/Ctrl to avoid accidental clicks while editing"* (source: `docs/archive/v4_0/processed/FEAT_URLS_ANCHORS.md:33-34`)
    - The BUILD locked the CMD/Ctrl gate: *"Only act on CMD/Ctrl+Click; bare clicks place the cursor as normal"* (source: `docs/archive/v4_0/v4_1_0_BUILD.md:34`)
    - This is the same convention every modern IDE markdown editor uses.

  + **Implementation mechanism**
    - `src/click-handlers.ts` (new in v4.1.0) exports `interactiveLinks()`, an extension built on `EditorView.domEventHandlers({ mousedown(...) })`.
    - On `mousedown`, if `metaKey || ctrlKey` is held: resolve `view.posAtCoords({ x, y })` → `syntaxTree.resolveInner(pos)` → dispatch based on node name.
    - Plain URL token (`node.name === 'URL'`): slice the doc range, `window.open(urlText, '_blank')`, `event.preventDefault()`, `return true`.
    - Inline-link descendants (`LinkMark`, `LinkTitle`, `LinkLabel`): walk to `node.parent` if it's a `Link`, grab the `URL` child via `parent.getChild('URL')`, dispatch.
    - (source: `docs/archive/v4_0/v4_1_0_BUILD.md:31-75`, `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:353-397`)

  + **Lezer node-name verification**
    - Verified against `node_modules/@lezer/markdown/dist/index.js` lines 65–83: `URL`, `Link`, `LinkMark`, `LinkTitle`, `LinkLabel` all emitted.
    - Heading nodes are `ATXHeading1–6` and `SetextHeading1–2`, all matched by `node.name.includes('Heading')`.
    - (source: `docs/archive/v4_0/v4_1_0_BUILD.md:24`)

  + **The deviation that mattered — clicks inside `[Example]` label text**
    - The original BUILD only matched `LinkMark`, `LinkTitle`, `LinkLabel` as the directly-clicked node. That covers clicks on `[`, `]`, `(`, `)`, and link titles, but NOT clicks on the visible link text inside `[Example]`. In `@lezer/markdown` the inline label text has no named child node — `resolveInner(pos)` on a click inside `[Example]` returns the parent `Link` node itself.
    - **Fix shipped in `13031ac`**: walk up from any clicked node to find a `Link` ancestor, then dispatch from the Link's `URL` child. Now all positions inside `[text](url)` (label text, brackets, parens, URL) dispatch uniformly.
    - (source: `docs/archive/v4_0/BUILD_REPORT_v4_1_0.md:21-25`)

  + **Visual feedback (CSS)**
    - In `src/theme.ts`, the `tags.url` HighlightStyle entry was given `class: 'thot-url-link'`.
    - The class rule lives in `thotEditorTheme`: `'.thot-url-link': { cursor: 'pointer' }`.
    - Note on UX: pure-CSS detection of "modifier key held" is not reliable — defaulting to pointer cursor on URLs (regardless of modifier) is acceptable given the modifier requirement only governs the click *action*, not the visual affordance.
    - (source: `docs/archive/v4_0/v4_1_0_BUILD.md:121-133`)

  + **Cross-browser**
    - Handler checks both `event.metaKey` (Safari/macOS) and `event.ctrlKey` (Firefox/Chrome on Windows/Linux). CodeMirror's mousedown event surface is consistent across browsers, so cross-browser parity is expected.
    - Confirmed working on Chrome (macOS `metaKey`) via Sean's preview environment. Safari `metaKey` and Firefox `ctrlKey` not separately verified in the BUILD_REPORT — *"expected but not proven."* (source: `docs/archive/v4_0/BUILD_REPORT_v4_1_0.md:45`)

  + **Verification matrix (post-ship)**
    - Plain URL CMD+Click: confirmed (opens in new tab; bare click places cursor)
    - Inline link `[text](url)`: confirmed (both halves dispatch after `13031ac`)
    - Anchor link `[label](#heading)`: confirmed (both halves dispatch; viewport scrolls)
    - Cursor pointer on URL hover: confirmed
    - No v4.0.0 regression: confirmed
    - (source: `docs/archive/v4_0/BUILD_REPORT_v4_1_0.md:37-43`)

### Anchor link navigation — in-document jumps **(Shipped v4.1.0)**

  + **Behavior shipped**
    - `[Go to Conclusion](#conclusion)` — CMD/Ctrl+Click scrolls the CodeMirror viewport so the heading whose slugified text matches `conclusion` (e.g., `# Conclusion`) is at the top of the viewport.
    - Works for both `ATXHeading` (`#` prefix) and `SetextHeading` (underline-style) headings, all six levels.
    - Sets cursor selection at the heading start position and dispatches `EditorView.scrollIntoView(foundPos, { y: 'start' })`.
    - (source: `docs/archive/v4_0/processed/FEAT_URLS_ANCHORS.md:16-19`, `docs/archive/v4_0/v4_1_0_BUILD.md:77-101`)

  + **Slugify algorithm**
    - Strip the leading `#` from the anchor: `anchor.slice(1)`.
    - Lowercase: `.toLowerCase()`.
    - Collapse any non-alphanumeric run into a single `-`: `.replace(/[^a-z0-9]+/g, '-')`.
    - Identical algorithm applied to candidate heading text: strip `^#+\s+`, strip everything after the first `\r`/`\n` (so wrapped/multiline headings only match by their first line), lowercase, slugify.
    - Linear walk of the syntax tree via `syntaxTree.iterate()`, short-circuit on first match by returning `false` from `enter`.
    - Code:
      ```ts
      const targetSlug = anchor.slice(1).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      // for each Heading node:
      const textOnly = headingText.replace(/^#+\s+/, '').replace(/[\r\n].*$/s, '')
      const slug = textOnly.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      if (slug === targetSlug) { foundPos = node.from; return false }
      ```
    - (source: `docs/archive/v4_0/v4_1_0_BUILD.md:77-101`)

  + **Scroll dispatch**
    ```ts
    view.dispatch({
      selection: { anchor: foundPos },
      effects: EditorView.scrollIntoView(foundPos, { y: 'start' })
    })
    ```
    - The `y: 'start'` option pins the matched heading to the top of the viewport — same behavior as IDE markdown previews.
    - (source: `docs/archive/v4_0/v4_1_0_BUILD.md:95-100`)

  + **Anchor slug coverage — known gap** **(Shipped, with known gaps)**
    - The slugifier (`lowercase + non-alphanumeric → -`) handles ASCII headings cleanly. Edge cases with emoji, non-ASCII (CJK, Cyrillic, accents), or unusual punctuation in heading text were not exercised in testing — could surface in v4.1.x if a user reports a missed match.
    - (source: `docs/archive/v4_0/BUILD_REPORT_v4_1_0.md:47`)
    - **Open question for future**: should the slug algorithm match GitHub's exactly? GitHub strips emoji, lowercases, replaces spaces with hyphens, but also has specific behavior around multiple identical headings (appending `-1`, `-2`). Thot's current algorithm short-circuits on first match — duplicate-heading disambiguation is not implemented.

### Local file path resolution — `/Users/...`, relative paths **(Spec'd, not shipped — deferred to native shell)**

  + **Original spec ambition**
    - *"Clicking a valid URL `https://...` or an absolute file path `/Users/...` opens it. If a URL, it opens in a new browser tab. If a local file path (and supported by environment), it will attempt to handle it gracefully (e.g., if we build out an Electron/Native shell later, but for the web app, it will primarily focus on `http`/`https` URLs)."* (source: `docs/archive/v4_0/processed/FEAT_URLS_ANCHORS.md:10-13`)

  + **Status: deferred**
    - *"Local file paths are out of scope (deferred until/unless we ship a native shell that can resolve them)."* (source: `docs/archive/v4_0/v4_1_0_BUILD.md:9`)
    - *"Local file paths — out of scope for v4.1.0 (deferred until/unless we ship a native shell that can resolve them)."* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:343-344`)
    - Browser security model means `window.open('/Users/seanivore/...')` cannot open files. A native shell (Capacitor / custom WKWebView) using the `Filesystem` plugin or a custom URL scheme handler is the only realistic path.

  + **What native resolution would look like (vNext)**
    - Native shell intercepts a special `thot://` or `file://` scheme via the JS↔Swift bridge.
    - Swift side validates path, checks sandbox entitlements, opens the file (either inside Thot if `.md` or via Launch Services for other types).
    - Implementation cost: small Capacitor plugin (~50 lines Swift) once the shell exists.

### Touch / long-press context menu — mobile equivalent **(Spec'd, not shipped — deferred to vNext)**

  + **Why it's needed**
    - *"iOS/touch has no concept of CMD+Click. Long-press → context menu with 'Open Link' is the canonical mobile pattern."* (source: `docs/archive/v4_0/v4_1_0_BUILD.md:209-211`)
    - On touch devices, the entire interaction model differs: tap places cursor, long-press surfaces an OS-level context menu. The current handler is `mousedown`-gated, which fires on tap but the modifier-key check fails.

  + **Status: deferred to vNext mobile UX bucket**
    - *"Out of scope for v4.1.0; capture in the vNext mobile UX bucket if not already there."* (source: `docs/archive/v4_0/v4_1_0_BUILD.md:211`)
    - *"Out of scope for v4.1.0; capture in a vNext mobile UX bucket."* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:454-456`)

  + **Implementation sketch (when ready)**
    - Listen for `touchstart` + `touchend` with a delta threshold (~500ms) to detect long-press.
    - On long-press over a Link/URL node, show a custom context menu with: "Open Link," "Copy Link Address," "Cancel."
    - Alternatively, allow plain tap on a URL to open it (no modifier needed on touch) — the cursor-placement concern doesn't apply since touch already has different cursor semantics.
    - This needs explicit research per device class (iPad with mouse/trackpad vs phone touch vs Apple Pencil tap).

### `@noteName` cross-document links **(Concept, needs research)**

  + **Origin** — v1 future-evolution hook
    - *"v2 – Organization & Column View: Workspace as a folder of `.md` files. Finder-style column navigation. Configurable 'post-it' preview snippets per note."* (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:677-680`)
    - The `@noteName` mechanic was paired with `#ProjectTag` in v2 feedback: *"We'd use tags to somehow allow for connecting content as well so that certain drill-down spots would be 'auto' created based on the #ProjectTag and then when writing a note within a #ProjectTag you could @tag different notes based on their title."* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:403`)

  + **Cross-reference in v4 docs**
    - *"Not sure where the original description of the UI was but found this in v1 doc — Finder-style column navigation — Column panes 'drill down' into the note and each note detail — Instead of auto preview like 'Notes' app (and only one awkward column in Apple Notes app): Configurable 'post-it' preview snippets per note so you can preview what you want specifically so that, at a high level the app works as a quick reference tool, but the drill down and multi layers makes it a really powerful planning tool. We'd use tags to somehow allow for connecting content as well so that certain drill-down spots would be 'auto' created based on the #ProjectTag and then when writing a note within a #ProjectTag you could @tag different notes based on their title."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:250-252`)

  + **What it would do**
    - Typing `@` in the editor opens a fuzzy-match autocomplete over all note titles in the workspace.
    - Selecting one inserts `@SomeNoteTitle` as a typed link.
    - CMD+Click on `@SomeNoteTitle` opens that note (in the multi-note workspace UI — see **Workspace & Multi-Note** section).
    - Editing the linked note's title propagates the rename to all `@SomeNoteTitle` references. (Implementation requires a workspace-level index of note titles + reference graph.)

  + **Open questions**
    - Where does workspace state live? `localStorage` for v1 multi-note, eventually backed by Vercel Postgres / Neon for cross-device sync.
    - Does `@noteName` work without the columns/workspace UI? Probably not — needs an "open this note" target, which only exists if the workspace exists.
    - Conflict with email-style `@mention` collaboration syntax? When real-time collab lands (vNext), `@username` will probably refer to a *user*, not a note. Possible disambiguation: `@@noteName` for notes, `@username` for users. Or rely on context (collab session vs solo).
    - Should `@noteName` autocomplete also surface aliases? (e.g., note titled "Q4 Planning Draft" matches typing `@q4`).

### `#ProjectTag` auto-sectioning **(Concept, needs research)**

  + **Origin** — v1 / v2 sketch
    - Same source as `@noteName`. The pitch is that writing a note tagged with `#ProjectTag` automatically groups it in the columns/Finder-style workspace under a "Project" section.
    - *"...certain drill-down spots would be 'auto' created based on the #ProjectTag..."* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:403`)

  + **What it would do**
    - Add `#ProjectThot` anywhere in a note → that note appears in a `#ProjectThot` column/group in the workspace.
    - Multiple `#tags` per note → note appears in all tag groups.
    - Tag groups appear as auto-generated columns/folders in the Finder-style navigation; no manual organization required.

  + **Relationship to file system**
    - In a local-files workspace, tags are a *virtual* organization layer above the physical filesystem. The same `.md` file appears in multiple tag groups without being physically duplicated.
    - This is how Bear, Obsidian, and Notion-style tag systems work. Thot's twist is the columns-layout surfacing.

  + **Open questions**
    - Tag syntax — does `#tag` conflict with markdown headings? Headings start with `#` at line-start; tags are inline. Parser needs to distinguish.
    - Auto-complete for existing tags as the user types `#`.
    - Hierarchical tags (`#Project/Subproject`)? Bear and Obsidian both support nesting.
    - Tag rename propagation — same problem as `@noteName` rename propagation.

### Cross-cutting note: where Interactive Markdown sits in the moat

  + URL clickability and anchor links are table-stakes — every IDE markdown editor has them; shipping them was about closing the "obviously a must have for a functioning app" gap (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:63`), not differentiation.
  + The `@noteName` + `#ProjectTag` + columns combo is the differentiator — and it's the *opposite* of an IDE feature. IDEs don't ship workspace navigation like this. This is the prose-writer / planner / Apple-Notes-migrant pull.
  + Touch long-press is a vNext native-wrapper concern, not a web concern (the web app stays browser-default).

---

## AI Integration (AI-First Design)

This section captures everything in the corpus about AI integration: predictive tab completion, format-on-save, model architecture choices, latency budgets, the `@claude` invocation pattern, declarative customization via natural language ("Make headings blue" → config mutation), the AI-first design philosophy, what NOT to build, and the market thesis underneath.

### AI-first design philosophy

  + **Core stance from v4 planning**
    - *"Many of the best IDE markdown tools require AI. This is being called out specifically because the tendency is to push AI integration off until later stages of app version releases. This needs to be integrated from the start to ensure the best user experience."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:82-84`)
    - *"Implementing AI from the ground up is to create the best UX, but there are risks"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:86`)
    - *"Must always find the most 'light weight' and best 'bang for buck' method when it comes to AI"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:87`)
    - *"We should think of our planning as **AI-first designing**"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:88`)
    - *"Always ask: **Can we do this without AI**? Resist temptation to put AI in everything"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:89`)

  + **The tension this captures**
    - AI is a *first-class concern in design* — every feature considers whether it should have an AI affordance, where the AI surface lives, how state flows.
    - AI is NOT a *default implementation* — adding a chat sidebar is not a substitute for actually thinking about the user's workflow. The "ambient AI vs. foreground AI" axis matters.
    - Per the AI Features research bucket: *"Sean's instinct (per `UPDATE_v4_0_0.md`): the goal is *ambient* AI that reduces cognitive load, not *foreground* AI that interrupts thought."* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:12`)

### Predictive tab completion (Cursor / Anti-Gravity reference) **(Concept, needs research)**

  + **The vision**
    - *"And of course, our **MUST HAVE** tab auto-completion"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:170`)
    - *"The amazing AI integration for tab completion, autocompletion, and auto-formatting that occurs in some markdown editors is still something that non-IDE users have very little experience with."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:77`)
    - *"People who use Google Docs have no idea that they can format a 10 page document with so many styles in just minutes — they have NO IDEA that is even a thing yet — how do we capitalize since idk why GoogleDocs hasn't when their markdown Anti-gravity one works great"* (source: `docs/archive/resources/SWIFTUI.md:107`)
    - *"What kept me was consistently being in awe of learning features that are great for writing, but exist nowhere else"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:79`)
    - *"**OPPORTUNITY**: Bring the magic of those markdown features to standard text writing"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:80`)

  + **What it does (canonical Cursor model)**
    - As the user types, the model predicts the next 5–50 chars in light gray "ghost text" inline.
    - Tab accepts the suggestion; any other keystroke dismisses it.
    - Trained against the *current document context*, not just a language model's general priors — meaning Cursor's predictions adapt to the doc's own style, terminology, formatting patterns.
    - For markdown specifically: predicts the next bullet in a list with parallel structure, the next column in a table, the rest of a heading, the closing of a code block.

  + **Architecture hooks in CodeMirror**
    - Per the AI Features bucket: *"Thot's editor is CodeMirror 6 — predictive completion has reasonable hooks via `ViewPlugin` + autocomplete extensions."* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:33`)
    - `@codemirror/autocomplete` is already a dependency (used for paired delimiters `closeBrackets()`). The autocomplete API supports async sources that return completion lists — but ghost-text inline completion is a slightly different surface (typically a `ViewPlugin` with `Decoration.widget` for the ghost preview).
    - Two implementation patterns:
      1. **Inline ghost text** (Cursor-style): `ViewPlugin` watches edits, debounces, calls model, renders ghost via `Decoration.widget(side: 1)` after cursor. Tab key intercepted to accept.
      2. **Popup completion** (LSP-style): `@codemirror/autocomplete`'s `CompletionSource` returns a list of options; user picks with arrow + Tab. Less invisible, more familiar.
    - Sean's reference is Cursor — implies pattern 1.

  + **Open research questions from the bucket**
    - *"Predictive tab completion in normal prose — Cursor/Anti-Gravity-style. What's the user experience when this is good vs. bad? Cost per completion? Latency budget? How is it disabled gracefully?"* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:17`)
    - *"Latency budget for predictive features — at what response time does a tab-completion stop feeling helpful and start feeling laggy? (Reference: Cursor's threshold is ~200ms.)"* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:24`)
    - Latency at >300ms degrades to "I notice the lag" territory; >500ms degrades to "this is annoying"; >1s degrades to "I'd rather it not be on."

  + **Graceful disable**
    - User-toggleable in Preferences (see Preferences section).
    - Auto-disable when offline, when API quota exhausted, when model latency exceeds threshold.
    - Per-doc or per-mode toggle (e.g., off in private/locked notes).

### Format-on-save (Anti-Gravity reference) **(Concept, needs research)**

  + **Origin**
    - *"Anti-Gravity's chart cleanup is the canonical example: messy ASCII tree → perfect tree on save."* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:18`)
    - *"Auto-Formatting Scopes — Example: Recipes — You paste in the basics of a recipe and BOOM it cleans it up all pretty for you — Bonus points if we figure out where they'd want to export them to then — General word processor formatting that is like Cursor/Anti-Gravity's Tab model"* (source: `docs/archive/resources/SWIFTUI.md:103-106`)
    - *"Subtle AI integrations — I'm also really into the idea of even more subtle things like automatic formatting"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:168-169`)

  + **What gets formatted on save**
    - From the AI Features bucket: *"What other 'tidy this up for me' actions are valuable in a markdown editor? (Heading hierarchy normalization, list nesting cleanup, table column alignment, link reference de-duplication.)"* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:19`)
    - Concrete candidates:
      - Table column alignment (pipe characters aligned, padding even).
      - Heading hierarchy normalization (no `# H1` then `### H3` skipping `## H2`).
      - List indentation normalization (consistent 2-space or 4-space).
      - Reference-style link consolidation (dedupe `[text][1]` references, sort them).
      - Trailing-whitespace strip, final-newline enforcement.
      - ASCII tree / diagram cleanup (Anti-Gravity's canonical demo).
      - Numbered-list renumbering (if user inserted a `2.` between `1.` and `3.`, fix the sequence).

  + **Open question: deterministic vs LLM-driven**
    - Most of the above are deterministic — they can be done by a Prettier-style markdown formatter without invoking an LLM at all.
    - The LLM-driven cases are the ones where structure isn't obvious from the source: "rewrite this paragraph as a bulleted list," "convert this prose to a table." These are *more powerful* but also *more cost* and *more risk* (LLM hallucinating content during cleanup).
    - **CONFLICT** Sean wants subtle AI but also wants "BOOM it cleans it up all pretty for you" — the second framing implies LLM-driven structural rewrite, which contradicts "always ask: can we do this without AI?" The resolution probably is: deterministic by default, LLM-driven on explicit invocation (right-click → "AI clean this up").

### Model choice (local vs hosted) **(Open — needs research)**

  + **Options matrix from the bucket**
    - *"Predictive completion provider/model choice — local model (small, free, private) vs. hosted (better, costs $/token, requires server). What are 2026 options at each end? (Claude Haiku, GPT-4o-mini, Llama 3, Gemini Nano on-device.)"* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:20`)

  + **Architectural axis**
    - *"Where does AI live architecturally?"* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:21-22`)
      - **Client-side**: privacy-positive, latency-positive, capability-limited. WebGPU-based on-device models are improving but markdown-quality prediction on-device in 2026 still trails hosted models.
      - **Server-side**: capability-positive, requires backend, costs money. Thot has no backend today (`localStorage` only); adding one is its own project (auth, infra, billing).
      - **User-BYOK (bring-your-own-key)**: capability-positive, no per-user cost, friction. User pastes their Anthropic/OpenAI API key; Thot proxies (or calls direct from browser, accepting the CORS+exposed-key tradeoffs).

  + **Sean's reference points**
    - *"Apps that are not affiliated with Anthropic allow users to login using Claude subscription; example: `https://www.pencil.dev`"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:176`)
    - This is the "use your Claude.ai subscription quota through a third-party UI" pattern — different from BYOK API. It depends on Anthropic eventually offering OAuth-style auth for Claude subscribers; pencil.dev's mechanism is the reference.
    - *"Stripe billing has LLM token that adjusts for model"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:177`) — relevant for the paid-tier hosted-AI billing surface; see Monetization section.

  + **Latency budget**
    - Cursor's threshold: ~200ms.
    - On-device Llama-3-8B-quantized: ~100ms first-token on M-series Macs but much slower on phones.
    - Claude Haiku via API: ~150–400ms first-token depending on region/load.
    - GPT-4o-mini via API: similar.
    - Gemini Nano on-device (Chrome/Android): ~50–100ms first-token but limited token budget per call and limited model size.

### Cost / Stripe AI billing coupling **(Open — needs research)**

  + **Why it's coupled to monetization**
    - From the AI Features bucket: *"Cost model directly affects `monetization` bucket — paid tier likely centers on AI affordances."* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:35`)
    - From the Monetization bucket: *"Stripe AI billing for token usage — Sean noted Stripe has tools now for charging-or-being-charged for AI tokens. Investigate: how does this work in practice? Does it support per-user metering and a sane UX?"* (source: `docs/archive/research/1_DEEP/monetization/1_REVIEW.md:26-27`)
    - Stripe's AI-token billing primitive: per-user metered subscription where each AI call (sized in tokens × model rate) bills against a usage quota. Stripe handles the meter + invoice; Thot just reports usage.

  + **The hard cost floor**
    - *"AI features have a hard cost floor (tokens cost money). Ignoring this is how products go bankrupt."* (source: `docs/archive/research/1_DEEP/monetization/1_REVIEW.md:42`)
    - A user typing aggressively in tab-completion mode generates ~5–20 model calls per minute. At Claude Haiku $1/M input + $5/M output, ~500 tokens per call, that's $0.001–0.003/minute = $0.06–0.18/hour of active typing. Over a 40-hour workweek of constant typing: $2.40–7.20/user/week, $124–374/year. The free tier must not enable unbounded tab completion.

  + **Free tier constraint** (links to Monetization section)
    - *"Sean's instinct: the free tier must remain genuinely useful (not a 3-day trial with paywalls); the paid tier earns its money by unlocking real value (sync, collab, AI affordances)."* (source: `docs/archive/research/1_DEEP/monetization/1_REVIEW.md:12`)
    - Likely shape: free tier = no hosted AI (or BYOK only), paid tier = bundled hosted AI tokens, top-up via Stripe metered billing.

### Declarative customization via AI — "Make headings blue" → config mutation **(Concept, needs research — Sean's pet idea from v1)**

This is one of Sean's earliest and most-returned-to ideas. Surface it deeply.

  + **v1 origin (verbatim)**
    - *"v3 – Declarative Customization via AI: Config files (`PreferencesModel` / JSON) that define: Layout (columns, panes). Editor preferences (font, theme, behaviors). Note metadata (tags, pinned/priority). An AI layer that translates natural language → config changes."* (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:682-687`)
    - *"The current modular architecture and directory structure are designed so these can be added without major refactors."* (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:689`)

  + **v2 restatement (verbatim)**
    - *"#### Declarative Customization via AI"*
    - *"+ Config files (`PreferencesModel`/ JSON) that defines"*
    - *"  - Layout (columns, panes)"*
    - *"  - Editor preferences (font, theme, behaviors)"*
    - *"  - Note metadata (tags, pinned/priority)"*
    - *"- An AI layer that translates natural language → config changes"*
    - (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:405-411`)

  + **v4 cross-reference**
    - The v4 features doc keeps the bullet alive: *"+ Declarative Customization via AI"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:253`)

  + **What it does — the "Make headings blue" loop**
    - User types into a settings-prompt textbox (or invokes via `@claude make headings blue`): "Make headings blue."
    - LLM receives: (a) the user's prompt, (b) the current `thot:prefs` JSON, (c) the schema of preference keys with their valid value shapes (color hex, font-weight number, boolean toggle, etc.).
    - LLM returns: a structured diff against the JSON — e.g., `{ "scope.heading.color": "#3B82F6" }`.
    - Thot validates the diff against the schema, applies it, persists.
    - Live preview shows the change immediately — *"Live preview"* (source: `docs/archive/v4_0/processed/FEAT_PREFERENCES.md` § Preferences Modal).
    - If the user doesn't like it, undo reverts the preference change.

  + **Why this is interesting (Sean's framing)**
    - It collapses the discoverability problem of preference UIs. A naive Preferences modal has 50 sliders and pickers; most users don't know which knob does what. *"Make my code blocks easier to read on tired eyes"* should translate to a change in code-block background, foreground, line-height, possibly font size — without the user knowing those are the relevant knobs.
    - It scales with preference surface. Adding new preferences doesn't require new UI — just expanding the schema the LLM gets.
    - It's a *cheap* AI feature — one prompt + one response per user request, not continuous (unlike tab completion). Cost per use is trivial.
    - It's a *delightful* AI feature — the gap between "I want my notes to feel more focused" and the actual config change is large and currently bridged manually; closing it feels like magic.

  + **Implementation sketch**
    - System prompt: "You are a preference editor for Thot. Given a user's natural-language request and the current preferences JSON, output a JSON Patch (RFC 6902) that achieves the request. Only modify documented preference keys. If the request is ambiguous, output a single best-guess patch and a one-sentence explanation."
    - Tool call (Anthropic / OpenAI tool-use APIs): structured output enforced as JSON Patch shape.
    - User-facing: a "preview" of the proposed change with Accept / Reject / Edit-the-patch.
    - Audit trail: every AI-applied preference change is logged so user can see "I changed this 3 weeks ago via 'make headings less yellow'."

  + **Schema requirements**
    - Every preference must have a documented key, type, valid range, and human-readable label/description so the LLM can map natural language to keys.
    - This couples directly to the `userCustomizable` flag system in `src/scopes.ts` (see Preferences section) — the same flag that gates UI exposure also gates AI-editability.

  + **Edge cases / open questions**
    - Ambiguous requests: "Make it pretty." LLM can't possibly know what "pretty" means without more context. UX: clarifying question? Or a "surprise me" mode that applies a vetted preset?
    - Destructive changes: "Reset everything." Should require confirmation.
    - Adversarial/silly requests: "Make every word a different color." Should still produce a valid patch (per-word coloring would need a new feature, so the LLM would return "I can't do that yet" — or, gracefully, "Here's the closest I can get: random colors per heading.")
    - Privacy: the user's preferences JSON might contain sensitive info if extended (e.g., API keys, file paths). Schema design must keep secrets out of the LLM context.

  + **Strategic note**
    - This is *not* a v5 feature. The scope system (v5) and the preferences UI (v6) must ship first to give the AI editor something to mutate. Declarative AI becomes valuable in late v6 or vNext.
    - The interesting moat layer: once preferences are AI-editable, the *same* surface can edit *any* config — column layouts, autocorrect rules, note metadata. The original v1 vision extends naturally.

### `@claude` invocation points **(Concept, needs research)**

  + **Origin**
    - *"Answer questions posed just by typing '@claude please check to make sure that these are the most up-to-date API doc information for Stripe'"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:164`)
    - *"Even possibly '@claude will you sketch out the function for this...'"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:165`)
    - *"Possibly live chatbot flow, as well as commenting and feedback annotations"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:166`)
    - *"`@claude` AI integration — inline LLM access (answer questions, sketch functions, content-aware suggestions, tab autocompletion, automatic format suggestions). Stripe billing-by-token model."* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:773`)

  + **Invocation surface**
    - Inline typing: `@claude <prompt>` in any document.
    - Triggers a side panel? An inline response? A replace-this-block? Open.
    - Possible patterns:
      1. **Replace-prompt-with-response**: user types `@claude summarize this section`, hits a trigger key, the `@claude ...` line is replaced with the response.
      2. **Inline ghost-text response**: response appears below the prompt as ghost text; Tab accepts and inserts.
      3. **Side panel**: response opens in a sidebar; user manually copies relevant bits into the doc.
    - Sean's "subtle / ambient AI" preference probably rules out (3) (too sidebar-y, too chat-y).

  + **Context window**
    - Per-prompt: the user's prompt + nearby document context (configurable window).
    - For workspace-aware questions ("check this against my other notes"): full workspace context = expensive; needs RAG or doc-summarization layer.

  + **Commenting and feedback annotations**
    - The "feedback annotations" phrase implies Claude can leave inline marginalia: "this paragraph could be clearer," "this claim is unsupported."
    - Closer to a Google-Docs-comment-style UX than a chat UX — fits the "writing-flow affordance" framing.

### What NOT to build

  + **From the AI Features bucket (verbatim)**
    - *"What NOT to build — chat sidebars, ghostwriting tools, image generation. Stay focused on writing-flow affordances."* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:27`)

  + **Expanded**
    - **No chat sidebars** — every AI app has a chat sidebar. It's the path-of-least-resistance product decision and it's wrong for Thot. Chat sidebars context-switch the user out of writing into "conversing about writing"; the affordance Thot wants is the *opposite*.
    - **No ghostwriting tools** — "write a 500-word blog post about X" features. These exist everywhere and don't differentiate. Thot's user is *already* a writer; they want amplification, not replacement.
    - **No image generation** — completely tangential to the markdown editor concept. If a user wants images, they have Midjourney / DALL-E / etc.
    - **No "AI everywhere" feature creep** — the AI-first design philosophy explicitly resists this: *"Always ask: Can we do this without AI? Resist temptation to put AI in everything."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:89`)

### Market thesis — bring IDE AI tools to mainstream non-markdown users

  + **The core observation**
    - *"The amazing AI integration for tab completion, autocompletion, and auto-formatting that occurs in some markdown editors is still something that non-IDE users have very little experience with. We also want to share the magic of having complete control over customizing semantic highlighting because it helps users, especially visual thinkers, manage and navigate their documents with a bit more cognitive ease."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:77`)
    - *"AI tools continue to rapidly grow the development industry, pushing use toward more markdown-heavy, planning-centric workflows. This will increase the demand for collaborative markdown editors, of which there is a current shortage. But in Thot, it won't just be your colleagues editing markdown documents live, but direct access to Claude built right into your documents; no need to go anywhere for a quick web search or to confirm you have the latest API documentation."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:35`)

  + **The migration target**
    - Apple Notes users. Google Docs users. *Not* a Cursor-replacing-Cursor play.
    - *"Beyond developers, Thot's aim is to bring the magic of modern IDE markdown editors, like syntax highlighting and tab auto-completion, to users who default to Apple Notes or Google Docs; the kind of users who aren't likely to be persuaded to jump into learning markdown."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:33`)
    - *"No matter how you write, Thot's interface instantly and intuitively adapts. Many of these users have no idea that you can format an entire 20 page document in minutes thanks to tab completion, which is frankly still magical."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:33`)

  + **The educational moment as marketing**
    - Tab completion in particular is *under-discovered* among non-developer writers. The marketing surface is "you didn't know this existed, here's what it does, watch your document compose itself."
    - Format-on-save is similarly invisible — Anti-Gravity's tree-cleanup demo is the canonical example: paste in messy ASCII, hit save, the tree snaps to perfect. Users will share this.

  + **AI affordances for the wider audience**
    - From the AI Features bucket: *"AI affordances for the wider audience (non-dev markdown writers) — what AI feature would matter to a Google Docs migrant? Probably *not* 'complete my code.' Maybe 'rewrite this paragraph in active voice,' 'summarize this section,' 'find the heading I'm looking for.'"* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:25`)

  + **Apple Intelligence overlap**
    - iOS 18+ ships Writing Tools (proofread, rewrite, summarize, refine) system-wide. *"Apple Intelligence-powered writing features — Proofread, refine, rewrite, summarize are available in PWA with right click — But iOS 18+ Writing Tools supposedly are only available native"* (source: `docs/archive/resources/SWIFTUI.md:50-52`)
    - Strategic implication: on macOS/iOS, leveraging Apple's free system tools for the common "rewrite/summarize/proofread" flows lets Thot focus AI spend on the things Apple doesn't do (tab completion, format-on-save, declarative customization, `@claude` workspace-aware queries).

  + **Stripe AI billing surface**
    - *"Stripe AI billing for token usage"* couples directly to the paid tier; see Monetization section.

### Tab Groups auto-naming reference (Dia browser)

  + **Origin**
    - *"Oh and I really love in Dia when the Tab Groups automatically name themselves based on content -- anything smart like that"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:172`)

  + **Translation to Thot**
    - In the columns workspace, untitled notes / new docs could auto-title based on first few lines of content. LLM call per new doc when first content appears + on save if title is still default.
    - Same pattern for `#ProjectTag` summarization: auto-generate a short description of what a tag's notes are about, surfaced in the tag's column header.

### Subagent crawlers (background AI tasks)

  + **Origin**
    - *"Triggering subagent crawlers to look for gaps and work on the implementation plan loop iteration in general"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:171`)
    - This is more of a *Thot-for-Thot's-development* idea than a user-facing feature — but the underlying pattern (background AI tasks that surface findings into the doc) generalizes.

  + **User-facing pattern**
    - Background agent watches a doc and surfaces inline annotations: "I notice you mentioned X three times — should I make a sticky for it?" (from `COLUMNS_LAYOUT.md` § 5)
    - Always opt-in, always dismissible.

---

## Preferences UI

This section consolidates every "this should be settable" mention across the corpus into a single picture. The goal: when Sean is ready to architect preferences, every dial is visible here, so the architecture decisions (where state lives, how preferences are surfaced, how AI declarative editing intersects) can be made with the full surface in view.

### Strategic frame

  + **v6 is when this ships**
    - *"Milestone v6.0.0 — User preferences UI"* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:738`)
    - *"Once v5's scope system is in place, expose it. Full settings panel: pick the color, weight, and style of every scope. Toggle auto-detect rules on/off per scope. Live preview. The `userCustomizable: true/false` flag in `src/scopes.ts` gates which scopes are user-editable."* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:744-745`)
    - **(Spec'd, not shipped — depends on v5 shipping first)**

  + **Why preferences are central to the moat**
    - *"Choosing the color of the syntax highlighting is really important to us visual writers. We should give them normal language labeled access to every single scope we have; this will help us close current gaps I've been trying to close for a while now."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:123`)
    - *"As we update and build out features, we need to make sure we are actively setting ourselves up to be able to easily wire up a UI where they'll be able to change the colors of the syntax highlighting, bullet points, list markers, etc."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:131`)
    - *"This is the moment Thot becomes a tool a non-developer would actually customize, which is the prerequisite for the wider audience CLARITY § Growth describes."* (source: `docs/THOT_APP.md:91`)
    - *"This frankly I would love. The user could even create 'project themes' or maybe different sections of the column view drill-down would be give different scope highlight colors so that it is immediately recognizable if you're in the right section of your notepad"* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:308-311`)

  + **The `userCustomizable` flag system**
    - In `src/scopes.ts` (already drafted): every scope carries a `userCustomizable: true | false` flag.
    - `true` → scope appears in the preferences UI; user can change its color/weight/style.
    - `false` → scope is system-managed (e.g., cursor color, selection color, scrollbar thumb); not exposed.
    - The same flag also gates whether the declarative-AI customization layer can target the scope.

### Right-click (context menu) extensions

  + **Source**: `docs/archive/v4_0/processed/FEAT_PREFERENCES.md:9-23` (verbatim below)

  + **Maintain the OS standard initial contextual menu with the following additions:**
    - **Add word to dictionary**
    - **Create Autocorrect Rule** → opens preferences modal to Autocorrect Rules List
      - There are two empty text fields next to each other or stacked.
      - The left field has a placeholder, "Type the word you want to autocorrect."
      - The right field has a placeholder, "Type the word you want to autocorrect to."
      - There are two buttons below the text fields, "Cancel" and "Save."
      - If the word is already in dictionary, then the modal should load with the word already in the 'Correct word to' field.
      - If the word is not in the dictionary, then the modal should load the word in the 'Word to correct' field.
      - Regardless of this load placement, user can edit either field.

### Preferences modal — sections

  + **Theme** — per-scope color, font-weight, font-style picker for every `userCustomizable: true` scope in `src/scopes.ts`.
    - Each scope row: scope name (human label), current color swatch + hex picker, font-weight dropdown (100–900), font-style dropdown (regular/italic/etc.), preview snippet of how text looks with the current setting.
    - Live preview surface — change the picker, the preview updates instantly.
    - (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:751-752`)

  + **Autocorrect rules** — list with add/edit/delete; the "Type the word you want to autocorrect" / "Type the word you want to autocorrect to" two-field row described above.
    - Existing autocorrect dictionary (`src/autocorrect.ts` `AUTOCORRECT_DICTIONARY`) is the default set; user-added rules layer on top.
    - Support for: simple find/replace (`->` → `→`), markdown symbol mappings (`:moon:` → `☽`), and case-preserving replacements (`teh` → `the` but `Teh` → `The`).
    - Per-rule enable/disable toggle (rather than delete) for trying-out.

  + **Editor behavior** — boolean and numeric toggles. (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:752`)

  + **Reset to defaults**, **Export/Import preferences** — top-level buttons.

  + **Persistence** — `localStorage` key `thot:prefs`, per the existing window-id partition pattern.

### Editor behavior toggles — full surface

The following is the aggregated list of every "this should be a setting" mention across the corpus. Each item should be a row in the preferences UI's Editor Behavior section unless flagged otherwise.

  + **Line wrap on/off** (source: implied by v4.0.0.9 line-wrap bug fix — `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:281`; currently `EditorView.lineWrapping` is unconditional)
    - Per `THOT_APP.md`: line wrapping is the always-on default; toggle should let power users turn it off.

  + **Line numbers visibility** (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:752`)
    - Toggle: show/hide the line numbers gutter entirely.
    - Width is already tokenized as CSS custom property `--thot-line-number-width` (default `16px`) for future width-adjust control. (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:73-86`)

  + **Line number column width** (source: same)
    - Numeric value `--thot-line-number-width`. The v4 polish chunk tokenized this specifically *so the v6 preferences UI can adjust it.* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:73-79`)
    - The adaptive-spacing behavior (1–3 digits = static width, 4+ digits nudges wider) described in `FEATURES_BEHAVIORS.md:108-126` is the runtime behavior; the preference governs the *base* width for 1–3 digit case.

  + **Font size** (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:327-340`; currently 12px per `THOT_APP.md:489`)
    - Numeric. Sean's `v2_0_0_FEEDBACK.md` records 16pt being "HUGE" and wanting it set reliably to 12pt; the inconsistency he encountered while trying to change it himself is a strong argument for putting this in a UI.
    - *"I went to change it back to 12pt, ran `npm run preview`, tried incognito, tried hard refresh and nothing — SO — it is still all TINY and I can't get it to change"* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:337-339`)

  + **Line height** (source: `docs/THOT_APP.md:489`; currently 1.5)
    - Numeric (line-height multiplier).

  + **Font family** (source: `docs/THOT_APP.md:692`; currently JetBrains Mono NL)
    - Probably *not* user-selectable in v6 (JetBrains Mono is intentional brand), but worth flagging.

  + **Theme switcher — light / dark / system / custom**
    - Currently dark-only. Light mode is mentioned as a future direction: *"Light view"* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:433`)
    - System mode: follow OS color preference via `prefers-color-scheme`.
    - Custom themes: see "project themes" below.

  + **Spellcheck toggle** (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:278-280`)
    - Shipped in v3.1.0 via `spellcheck: "true"`. Toggle would let users disable.
    - Per `docs/THOT_APP.md:143`: *"Enabled browser spellcheck via `spellcheck: 'true'`"*

  + **Auto-detect rule toggle (per rule)**
    - From the `auto.*` scope group in `src/scopes.ts` (v5+): each prose-mode detection rule has a toggle.
    - Examples: "ALL CAPS → emphasis," "lines ending with `:` → section labels," "parenthetical asides dimmed."
    - (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:722-723`)

  + **PWA install prompt visibility** **(Cancelled / suppress)**
    - *"PWA install prompt — flagged as v4.0.1 candidate to remove (Thot stays browser-only until native shells in vNext)."* (source: `docs/THOT_APP.md:127`)
    - Per user memory `feedback_no_pwa_install_until_native.md`: suppress PWA install button/banner; real native shells come in vNext.
    - Not a user preference — a permanent suppression. Listed here only because it appears as a "setting-like" thing in other docs.

  + **Counter visibility (words, characters, tokens)** (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:255-275`)
    - *"Word count, Character count with spaces, Token count (probably the most important these days)"*
    - *"It would should all four count types at onces nicely labeled and separated. Nothing else in that menu. Updates live so anytime User looks it would be accurate. Clicking on any one of the four counts would copy that number"*
    - User toggle to show/hide the counter UI, plus toggles for which counts to show.

  + **Customizable highlight colors per scope** (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:308-312`)
    - This is the core Preferences feature — see Theme section above.

  + **Project themes / per-folder themes** (source: same)
    - *"The user could even create 'project themes' or maybe different sections of the column view drill-down would be give different scope highlight colors so that it is immediately recognizable if you're in the right section of your notepad"*
    - Saved theme presets the user can name and switch between.
    - Per-folder / per-`#ProjectTag` theme association — entering Project X automatically loads its theme.
    - Depends on the columns workspace shipping first.

  + **Frontmatter color** (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:106`)
    - *"Open Sean call (BUILD does NOT block on this): Sean may also want to recolor `colors.frontmatter` itself for genuine line-1 frontmatter rendering (current `#BD93F9` purple is fine; some users prefer pale yellow `#F5F0B5` or similar). This is a preference, not a fix"*
    - Once preferences UI exists, this becomes user-editable.

  + **Auto-capitalization (sentence start)** (source: `docs/THOT_APP.md:156`)
    - Currently always-on in `src/autocorrect.ts`. Toggle to disable.

  + **Autocorrect engine toggle** (source: implied by autocorrect being a defined feature)
    - Master on/off for the autocorrect engine itself, in case a user wants no automatic correction at all.

  + **Smart-quote normalization on paste toggle** (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:142-178`)
    - Currently always-on via `src/paste-handler.ts`. Toggle for users who paste content where curly quotes are intentional.

  + **Paste-as-plain-text toggle** (source: same)
    - Currently always strips formatting on paste. Toggle for users who want rich-text paste preserved (probably rare for a markdown editor but worth supporting).

  + **CMD+N behavior** (source: `docs/THOT_APP.md:291`)
    - Currently opens an ephemeral temp window at `?id=temp-<random>`. Toggle: maybe some users prefer CMD+N to do nothing, or to open a fresh "main" instead of temp.

  + **Apple Pencil mode / annotation overlay toggle** (vNext, iPad-only)
    - When/where Pencil capture is active. See Native Wrappers section.

  + **Biometric lock per-note** (vNext, native-only) (source: `docs/archive/resources/SWIFTUI.md:54-57`)
    - *"Create locked sections or notes. Keep your diary truly personal."*
    - Per-note setting; flag here as a preference-like concept even though it's per-document.

  + **Reminders integration trigger syntax toggle** (vNext, native-only) (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:397`)
    - *"How could would it be if on any not just writing @02/14/2026-7pm and BOOM you get a reminder (or at the very least, notification)"*
    - Toggle: detect date-time literals and offer to create Reminders.

  + **Heading stacking visibility** (v4.2.0+)
    - Toggle the sticky-heading overlay on/off. (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:462-485` — feature itself)
    - Configurable max-depth (only show H1+H2, vs all six levels).

  + **Line edit indicator colors** (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:163-183`)
    - Colors for added-line indicator and edited-line indicator in the line-number gutter.
    - Whether the indicator persists across reload or only until manual save (per Sean: only until manual save). This is a behavior setting, not a color setting.

  + **Save semantics** (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:172-174`)
    - *"We want these line indicators to show until a manual save. Manual save should be defined as a save from the menu or command+S. However, they should not persist after a fresh app re-open."*
    - Probably not user-toggleable but worth flagging.

  + **List Enter behavior** (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:233-278`, `FEATURES_BEHAVIORS.md:189-225`)
    - The desired behavior is locked in v4.0.x: Enter after content = new bullet; Enter on empty bullet = exit list; manual blanks don't auto-propagate.
    - Probably not user-toggleable, but if it ends up being controversial, this is where a toggle would live.

  + **Hanging indent on wrapped lines** (source: `src/hanging-indent.ts`, `docs/THOT_APP.md:420-424`)
    - Currently always-on; toggle for users who prefer flush wrapping.

  + **RTF / plain-text mode toggle** (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:313-318`)
    - *"Somewhere along the line it would make sense to give users who don't like markdown an option to use the app too. It would be really fun to sort of try and reinvent a UI that is as convenient as markdown for formatting plain text. Almost like a little context menu but with super prominent keyboard shortcuts written on the places that a RTF user would otherwise click to make something a heading or bold, etc."*
    - This is more than a toggle — it's a *mode* with its own toolbar surface. But the entry point (which mode the doc opens in) is a preference.
    - Strongly related to v5's Intelligent Formatting dual-mode UI. Maybe the RTF mode *is* the visual mode? Open.

  + **Heading font sizes** (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:323-325`)
    - *"I changed the headings so that they're the same size as the rest of the document. Please leave them this way"*
    - Headings being same-size-as-body is a current intentional design choice (per `THOT_APP.md:503-504`). A power-user might want larger headings; preference setting.

  + **Print / Export to PDF settings** (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:301-306`)
    - *"Eventually it would be nice to have it print too; to start, not anything other than actually printing the markdown just like you see it in the app"*
    - *"I want to start this off SUPER simple by basically making it the markdown without the markup notation, solid text colors, different siz for headers — But otherwise we don't really need to mess with spacing or even the font"*
    - Export settings: with/without markdown notation, color preservation, page size.

  + **Headings stacking max-level**
    - Numeric (1–6). How deep the sticky-heading overlay cascades.

  + **CodeMirror gutter visibility** (line numbers, fold gutter, indicator gutter)
    - Each gutter toggle-able.

### Theme presets / theme switcher

  + **From the v6 spec**
    - *"Theme preset library (light mode, dark mode, system, plus user themes)."* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:761-762`)

  + **Project themes** — already mentioned above. Per-folder/per-tag association.

  + **Decision: native `<dialog>` element vs. custom modal vs. CodeMirror panel** (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:759`)
    - Open. The settings modal needs to live somewhere; the v6 spec leaves the surface unresolved.

### Open work for v6 (before promoting to BUILD)

From `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:759-762`:

  - Full UX flow (modal layout, settings hierarchy, live preview surface).
  - Decision: native `<dialog>` element vs. custom modal vs. CodeMirror panel.
  - Theme preset library (light mode, dark mode, system, plus user themes).

### Cross-references to AI Integration

  + Once preferences are in place, the **Declarative AI customization** layer (see AI Integration section) becomes the alternative UI for the same surface.
  + The `userCustomizable` flag in `src/scopes.ts` gates both the visible UI and the AI-mutation surface.
  + Saved theme presets become the natural target of "save my current setup as 'focused-writing' theme" AI commands.

---

## Workspace & Multi-Note

This section captures everything about the multi-document UI: Finder-style column navigation, post-it preview snippets, `#ProjectTag` auto-sections, `@noteName` inter-note links, sticky-note layouts, mobile column collapse, and AI-populated columns content. Nothing in this section is shipped; the entire concept space is **(Concept, needs research)**. The scaffolds in `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md` capture what we know we don't yet have.

### Strategic frame

  + **Why a workspace UI matters**
    - Today, Thot is a single-document scratchpad (`?id=main` + ephemeral temp windows via CMD+N). To grow past developer-power-users into Apple-Notes / Google-Docs migrants, multi-note organization is table-stakes.
    - The workspace is also the *differentiation surface*: column navigation + post-it previews + AI-populated detail is a structurally different UI from Notion's database/page model, Bear's tag-tree, or Obsidian's graph.
    - The columns workspace is named in vNext, not v5. v5 ships the highlighter rebuild + dual-mode UI; columns is a separate vNext track.
    - (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:774`, `docs/THOT_APP.md:100`)

### Finder-style column navigation **(Concept, needs research)**

  + **v1 origin (verbatim)**
    - *"v2 – Organization & Column View: Workspace as a folder of `.md` files. Finder-style column navigation. Configurable 'post-it' preview snippets per note."* (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:677-680`)

  + **v2 restatement (verbatim)**
    - *"Finder-style column navigation"*
    - *"Column panes 'drill down' into the note and each note detail"*
    - *"Instead of auto preview like 'Notes' app (and only one awkward column in Apple Notes app): Configurable 'post-it' preview snippets per note so you can preview what you want specifically so that, at a high level the app works as a quick reference tool, but the drill down and multi layers makes it a really powerful planning tool. We'd use tags to somehow allow for connecting content as well so that certain drill-down spots would be 'auto' created based on the #ProjectTag and then when writing a note within a #ProjectTag you could @tag different notes based on their title"* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:400-403`)

  + **v4 reference**
    - *"Not sure where the original description of the UI was but found this in v1 doc — Finder-style column navigation — Column panes 'drill down' into the note and each note detail — Instead of auto preview like 'Notes' app (and only one awkward column in Apple Notes app): Configurable 'post-it' preview snippets per note so you can preview what you want specifically..."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:250-252`)
    - Note Sean's frustration in this v4 doc: he's searching for original notes that have been lost. The UI was *well-pitched* at some point; the verbatim is lost.

  + **What it does (model)**
    - Leftmost column: top-level navigation — folders, project tags, recent notes.
    - Clicking an item in the left column shows its contents in the next column to the right.
    - For a folder: lists its notes.
    - For a `#ProjectTag`: lists notes tagged with it.
    - Clicking a note in column 2 opens its content (or a configurable preview snippet) in column 3. Drilling further into a note section opens column 4. And so on.
    - Mirrors macOS Finder's column view, but for notes instead of files.

  + **Open questions from `COLUMNS_LAYOUT.md`**

    **§ 1. The layout itself — what does the screen look like?**
    - *"Describe the columns. How many? Does the user choose how many? Is one column the 'main editor' and the others are auxiliary? Or are all columns equal? What's in each column by default?"*
    - *"Finder-style was the analogy — does each column show a list, or each column show a single document?"*
    - *"Is this a separate 'view' the user opens, or is it the always-on layout?"*
    - *"What happens on mobile / narrow viewports — does the columns view collapse, scroll horizontally, or get hidden?"*
    - **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:18-27`)

### Post-it preview snippets per note **(Concept, needs research)**

  + **v1 / v2 origin**
    - *"Configurable 'post-it' preview snippets per note"* (source: `docs/archive/v1_0/v1_0_0_DEV_PLANNING.md:680`)
    - *"Instead of auto preview like 'Notes' app (and only one awkward column in Apple Notes app): Configurable 'post-it' preview snippets per note so you can preview what you want specifically so that, at a high level the app works as a quick reference tool, but the drill down and multi layers makes it a really powerful planning tool."* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:402`)

  + **What "configurable" means**
    - Not auto-extracted (Apple Notes shows the first few lines and you can't change it).
    - User picks: maybe a heading, maybe a `[summary]` frontmatter field, maybe a specific tagged region (`<!-- post-it: -->` to `<!-- /post-it -->`).
    - Sean's wording is "preview what you want specifically" — the user has explicit control.

  + **At-a-glance + drill-down model**
    - *"at a high level the app works as a quick reference tool, but the drill down and multi layers makes it a really powerful planning tool"* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:402`)
    - The columns layout serves two distinct modes: quick reference (read post-its in column 2 without opening anything) and deep planning (drill all the way to the right).

  + **Native surface extensions**
    - Post-it visible text isn't just an in-app concept — it extends to native surfaces (lock-screen widgets, dynamic island, Apple Watch glances).
    - *"Our UI layout allowing users to set 'post-it' visible text — It could extend that feature to even more helpful locations — Lock-screen notes, etc."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:191-194`)
    - See Native Wrappers section for the lock-screen widget realization.

  + **Open questions from `COLUMNS_LAYOUT.md`**

    **§ 2. Sticky notes — what are they, exactly?**
    - *"A 'sticky note' in this product is what? A small text snippet pinned to a document? A floating annotation overlaid on the editor? A tile in a column? A reusable piece of text the user drags between documents?"*
    - **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:30-34`)

    **§ 3. Where does a sticky note live?**
    - *"When a user creates a sticky note, where does it appear? Is it associated with one specific document, or does it live independently? If associated, does it follow the document around (e.g., shows up in a sidebar when that doc is open) or does it float separately?"*
    - **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:38-42`)

    **§ 4. Creating and editing a sticky note**
    - *"How does a user create a sticky note? (Right-click? Keyboard shortcut? Drag from text? Always-visible '+ note' button?) What does editing one look like — inline in the column, or pop-up?"*
    - **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:46-50`)

### AI-populated detail in columns **(Concept, needs research)**

  + **Origin in CLARITY**
    - *"post-it visible text"* with *"AI populated details in some cases"* (paraphrased from `docs/archive/v4_0/processed/v4_0_0_CLARITY.md`, also cross-referenced in `COLUMNS_LAYOUT.md:54-55`)

  + **What an AI-populated sticky note looks like**
    - When a user opens a `#ProjectTag` column, alongside the user-pinned post-its, AI-generated summary post-its appear: "This project has been discussed across 4 notes over the last 2 weeks. Themes: X, Y, Z."
    - Per-note AI post-its: a one-sentence "what's this note about?" surfaced as a preview when no user-defined post-it exists.
    - Cross-note AI post-its: "I notice you mentioned X three times — should I make a sticky for it?"

  + **Visual distinction**
    - User-created vs AI-created notes need a clear affordance. Probably a small icon or a different background tint.
    - Per `COLUMNS_LAYOUT.md:60-62`: *"Is there a visual distinction between user-created and AI-created notes?"* (open)

  + **Open questions from `COLUMNS_LAYOUT.md` § 5**

    *"CLARITY mentions 'post-it visible text' with 'AI populated details in some cases.' Walk through that — what does an AI-populated sticky note look like? When does the AI populate one (automatically, on request, both)? What's the user's mental model of 'this note came from the AI' vs. 'this note is mine'?"*

    Sub-questions:
    - *"Does the user prompt the AI for a specific note, or does the AI surface notes proactively (e.g., 'I notice you mentioned X three times — should I make a sticky for it?')?"*
    - *"If the AI is surfacing, what's the UX for accept/dismiss?"*
    - *"Is there a visual distinction between user-created and AI-created notes?"*

    **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:54-63`)

  + **Cost / latency implications**
    - AI-populated post-its are expensive: one LLM call per note for the auto-summary, one per tag-group for the "themes" surface, ongoing calls for proactive "should I make a sticky" prompts.
    - Probably gated to the paid tier (free tier shows user-defined post-its only).
    - Background-task pattern: AI-populated content updates async, not on every doc edit. Debounce to "after 5 minutes of no edits" or "on save."

### `#ProjectTag` auto-sections in columns **(Concept, needs research)**

(Cross-references Interactive Markdown section — same tag system.)

  + **What it does in the workspace**
    - `#ProjectTag` lines in any note auto-add that note to the project's tag-group in the columns navigation.
    - The tag-group appears as an automatically-created column entry, no manual organization required.
    - Note can have multiple tags → appears in multiple groups.
    - (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:403`)

  + **Hierarchy in tags**
    - Open: does `#Project/Subproject` create a nested tag-group? Bear and Obsidian both support this.

  + **Tag-group AI surfaces**
    - Auto-summarize what a tag-group is about, displayed in its column header.
    - "Recently active" indicator on tag-groups with new edits.
    - See AI-populated detail section above.

### `@noteName` inter-note links in columns **(Concept, needs research)**

(Cross-references Interactive Markdown section.)

  + **In-workspace behavior**
    - Typing `@` in a note opens autocomplete over all notes in the workspace.
    - Selecting one inserts `@SomeNoteTitle` as a typed link.
    - CMD+Click on the `@SomeNoteTitle` reveals that note in the columns view, sliding to its column position and highlighting it.
    - Backlinks: the linked note has a "linked from" indicator showing which notes reference it (Obsidian-style backlinks).

  + **Open behavioral question**
    - Does CMD+Click open the note in a new column to the right (Finder-drill-down model), or does it replace the current view (single-document focus model)? The former is more "spatial," the latter is more "linear."

### Sticky-note layout (v3+ concept)

  + **Where the "sticky note" framing comes from**
    - Originally `post-it preview snippets` (v1/v2) — the per-note preview surface.
    - Evolved in v3+ planning to include free-floating sticky notes that aren't tied to a single document.
    - The `COLUMNS_LAYOUT.md` scaffold notes both meanings need disambiguation (per the § 2 question).

  + **Two possible meanings**
    1. **Per-note preview** — the post-it lives in a note's metadata and shows in the columns navigation when that note is visible.
    2. **Free-floating workspace stickies** — independent of any note; pinned to the workspace itself; visible across all notes. (Think: a workspace-wide whiteboard of pinned thoughts.)

  + **Resolution depends on Sean's fill-in of `COLUMNS_LAYOUT.md` § 2.**

### Columns mobile collapse **(Concept, needs research)**

  + **Open question from scaffold**
    - *"What happens on mobile / narrow viewports — does the columns view collapse, scroll horizontally, or get hidden?"* (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:25`)

  + **Three patterns from prior art**
    1. **Hidden** — on mobile, columns collapse entirely; you only see the current document. A hamburger menu surfaces a flat list of notes. Apple Notes does this. Loses spatial context.
    2. **Scroll horizontally** — columns remain but you scroll/swipe between them. iOS Files app does this for column view in landscape. Preserves spatial context, requires more swipes.
    3. **Stacked-card** — most recent column on top, swipe right to peel back. iOS-native pattern, fits Apple platforms specifically.
    - Open which pattern Thot adopts.

### Use cases for the workspace **(Concept, needs research)**

  + **Open question from scaffold (§ 6)**
    - *"Walk through 2–3 concrete scenarios. A user is working on X document, and they use this columns + sticky-note layout to do Y. What does the workflow look like start-to-finish?"*
    - **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:66-71`)

### Relationship to lock-screen "always-available notepad"

  + **Open question from scaffold (§ 7)**
    - *"CLARITY § 'Native App Wrapper Opportunities' mentions tap-the-Dynamic-Island for a quick notepad, lock-screen note widgets, 'post-it' lock-screen previews. Are those the same sticky notes from the columns layout, or a separate concept that happens to share the 'post-it' name? If the same: how does syncing between in-editor and lock-screen work?"*
    - **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:75-79`)

  + **My read** — the "post-it on the lock screen" concept and the "post-it preview in the columns view" concept *should* be the same data, surfaced in two places. Otherwise the user has to maintain two parallel post-it surfaces. Architecturally: post-its are first-class entities (own metadata, own storage); the columns UI and the lock-screen widget are two readers of the same data.

### What this is NOT **(Concept, needs research)**

  + **Open question from scaffold (§ 8)**
    - *"What's the negative space? Not a kanban board (that's Trello/Linear). Not a Roam-style block reference system. Not? Not?"*
    - **AWAITING SEAN'S FILL-IN** (source: `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:83-87`)

  + **From elsewhere in the corpus**
    - Not a Notion-style database UI. Sean has explicit Notion-skepticism: *"Ringing in my head is 'How can you win over the Notion cult?' — Because just like taking notes in an IDE taking notes in Notion sucks there's no 'draftpad' vibe it forces organization. Their API is actually really great though so maybe there was some way for people to use it for notes that they can send to Notion for organization when ready. This is like the 'pre-planning' space of the brain where if you try to do it too soon in Notion it just takes forever"* (source: `docs/archive/resources/SWIFTUI.md:98-101`)
    - So the workspace is a *pre-planning / draftpad-first* surface that doesn't force organization. Tags + columns + post-its are *lightweight* surfacing, not enforced taxonomy.

### Open Research Items from `COLUMNS_LAYOUT.md`

From `docs/research/1_DEEP/feature-research/COLUMNS_LAYOUT.md:99-105`:

  - Does this ship in v5 alongside the highlighter rebuild and intelligent formatting, or is it its own major (v6/v7)?
  - Does this require a backend (sticky notes synced across devices) or can v1 be local-only?
  - Does this interact with the persistence model (currently localStorage, partitioned by `?id=`)?

### Persistence implications

  + The current persistence model is `localStorage` per window-id (`thot:content:<id>`, `thot:state:<id>`).
  + Multi-note workspace needs at least:
    - A note registry (`thot:notes:<workspace-id>` → array of note metadata).
    - Per-note content + state (existing pattern, scaled up).
    - Workspace-level metadata (tags, post-its, column layout state).
  + `localStorage` quota (~5–10MB depending on browser) becomes a constraint with many notes; eventual migration to IndexedDB likely.
  + Cross-device sync (vNext) requires server-side backing — Vercel Postgres / Neon per the v4 roadmap (source: `docs/THOT_APP.md:97-98`).

---

## Native Wrappers

This section captures the entire native wrapper strategy: locked architecture decision (Capacitor + native Swift hybrid), the full capability matrix from the OPTIONS.md research, drop-in modularity goal, iOS-specific affordances, WatchOS plan, macOS approach, visionOS speculative direction, Apple Wallet speculative direction, App Intents / Reminders, Share Sheet, native file system, app distribution strategy, and the rationale for "hybrid, not lite."

### Strategic frame

  + **Web app is canonical**
    - *"Thot should primarily be designed and developed as a web app. We do not want to promote the ability to install as a PWA because we will be using native app wrappers to have macOS and iOS apps with the same core functionality, only adding OS-specific features and behaviors that make sense for the platform."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:40-41`)
    - *"For scaling purposes, I was thinking that we should make the PWA the primary focus of Thot; where all the expected features life and what we'd update the most frequently. I don't want us to think of it as 'the App Store version is the full featured version, and the PWA is trimmed down' — it seems much smarter to do the opposite: less effort for technically two more impressive products."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:140`)
    - *"The PWA will be the most robust version of Thot, with all the features that people would expect from a modern markdown editor. The wrapper would be bit more than a novelty because we can add additional features that are *only* available in that version. We can charge more for the app store version"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:142-145`)
    - **Status**: locked direction. *"We would focus on building the web app first."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:147`)

  + **Don't promote PWA install**
    - *"Also, I don't even want to present web users with the option to download the web app. After exploring online, there is just a lot of irrational dislike for PWAs so no need to draw attention to it when everyone works in their browser tabs anyway."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:149`)
    - *"Plus, when releasing a macOS/iOS/iPadOS app, there wouldn't be any confusion with people using a lower quality UX from the PWA download."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:151`)
    - Per user memory `feedback_no_pwa_install_until_native.md`: suppress PWA install button/banner; real native shells come in vNext; PWA muddies the upgrade narrative.

  + **Why hybrid, not "lite"**
    - The non-obvious framing: *most* products treat the App Store version as the full-featured version and the web app as a lite trial. Sean inverts: web = full features, App Store = same features + platform-specific bonuses. Marketing positioning: "you're not losing anything by using the web."
    - Apps that *only* exist in the App Store are stuck in App Store distribution gates (review delays, 30% Apple cut, no live updates without re-submission). Putting the canonical product on the web removes those gates from the critical path.

### Locked architecture decision

  + **Recommendation from `docs/research/1_DEEP/native-wrapper/OPTIONS.md` (verbatim § 9)**
    - *"Adopt Capacitor as the host shell for iOS, iPadOS, and macOS (Catalyst). Write WatchOS as a separate native SwiftUI target sharing the same App Group. Implement Apple Pencil annotation as a native PencilKit overlay inside the Capacitor shell."*
    - *"Rationale: Capacitor packages the WKWebView host plumbing you'd otherwise write from scratch. The features Sean cares about (Live Activities, App Intents, WidgetKit, Pencil) all require native Swift regardless of host — Capacitor just gives you a clean place to put it. WatchOS can't be hosted by any wrapper structurally. PWABuilder is too bare. Tauri is too immature on iOS for a one-developer project. A pure custom shell costs more code without delivering more capability than Capacitor + the same native plugins."*
    - **(Research locked; ready to plan)**

  + **Phase order**
    - A (current PWA) → B (Capacitor + App Intents + Widgets) → C (Live Activities) → D (Pencil) → E (WatchOS) → F (Mac native shell, optional).
    - (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:237`)

  + **Unlocks per phase**
    - B requires App Group plumbing (~1 week) + iOS dev account.
    - C reuses B's App Group plumbing; ActivityKit widget target is incremental.
    - D is independent of B/C; can run parallel with C.
    - E requires a sync story (`auth-and-sync/` bucket is a near-blocker for E being useful).
    - F only if Catalyst proves insufficient.
    - (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:239-244`)

### Drop-in modularity goal

  + **Sean's framing**
    - *"Plan and design the PWA and then the core native app wrapper so that we can update the web app as frequently as we want and essentially just 'drop' the update into the wrapper and have all the necessary connections still valid. This will become important particularly in those areas where the functionality must be translated to a native feature, like adjusting settings."* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:43-45`)
    - *"Though, yes, with this setup the ideas is that we'd be able to build the PWA architecture in a sort of way that we would be able to just 'DROP' in the PWA when we have an update, ensuring that all the necessary connections still exist, and keeping specific track of updates that have changes requiring adjustments from this kind of 'plug-and-play'."* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:181`)
    - *"Lay out exactly what the architecture will be, end-to-end"* (source: `docs/archive/v4_0/FEATURES_BEHAVIORS.md:47`)

  + **How it works with Capacitor**
    - Point Capacitor's `server.url` at `https://thots.august.style` (loads remote site, no rebuild) → every web push to Vercel automatically picks up in the native shell.
    - Or use Capacitor Live Updates / open-source Capgo for OTA web-bundle deltas (if a bundled offline path is desired).
    - (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:80-81`)

  + **Re-submit only when native plugins change**
    - *"For Thot: point Capacitor's `server.url` at `https://thots.august.style`. Re-submit the binary only when native plugins change. The App Store binary becomes a thin shell over the same website you already control — literal 'PWA is canonical.'"* (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:158`)

  + **Offline caveat**
    - *"Pure remote-URL apps lose offline unless the WKWebView's Service Worker survives across cold starts. Service Workers run inside WKWebView since iOS 14, but lifecycle inside a native host is finicky. **VERIFY** If 'open instantly on a plane' is mandatory, bundle a `dist/` snapshot as the offline fallback and use `server.url` only when network is up — Capacitor supports the pattern."* (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:160`)

  + **Connections that need preservation**
    - `localStorage` keys (`thot:content:*`, `thot:state:*`) — both sides of the bridge read these.
    - App Group container for native-side reads (widgets, intents).
    - URL params (`?id=...` for window partitioning).
    - Any new persistence keys added on the web side must be reflected in the native bridge's read paths.

### Full capability matrix (from `docs/research/1_DEEP/native-wrapper/OPTIONS.md` § 3)

  | Want                                   | Capacitor                    | PWABuilder iOS                                             | Custom WKWebView                     | Tauri 2.0 Mobile         |
  | -------------------------------------- | ---------------------------- | ---------------------------------------------------------- | ------------------------------------ | ------------------------ |
  | macOS shell (parity with PWA)          | Yes (Mac Catalyst)           | Limited (iPad-on-Mac path)                                 | Yes (AppKit or Catalyst)             | Yes (native, mature)     |
  | iOS / iPadOS shell                     | Yes (mature)                 | Yes (auto-generated)                                       | Yes                                  | Yes (newer)              |
  | Live Activities                        | Via custom plugin            | No (out of the box)                                        | Yes (direct ActivityKit)             | Custom plugin **VERIFY** |
  | Dynamic Island                         | Via custom plugin            | No                                                         | Yes (ActivityKit, same as Live Acts) | Custom plugin **VERIFY** |
  | App Intents / Shortcuts                | Via custom plugin            | No (community only)                                        | Yes                                  | Custom plugin **VERIFY** |
  | Lock-screen / Home widgets (WidgetKit) | Via custom plugin **VERIFY** | No                                                         | Yes                                  | Custom plugin **VERIFY** |
  | Apple Pencil (annotation overlay)      | Hybrid: native overlay       | No                                                         | Hybrid: native overlay               | Hybrid: native overlay   |
  | WatchOS app                            | **No** (companion only)      | No                                                         | Companion native target              | **No**                   |
  | Siri / dictation in WatchOS            | n/a                          | n/a                                                        | Yes (native Watch app)               | n/a                      |
  | Live PWA reload (no rebuild required)  | Yes (Live Updates / Capgo)   | Yes (loads remote URL)                                     | Yes (load remote URL)                | Yes (config option)      |
  | App Store review friction              | Low (well-trodden)           | Higher (apps that are "just a website" risk 4.2 rejection) | Lowest (acts like native app)        | Newer; **VERIFY**        |
  | Maintenance burden (code volume)       | Low                          | Lowest                                                     | Highest                              | Medium                   |

  + **Key reading**: No option ships Live Activities, Dynamic Island, App Intents, or WidgetKit "for free." Every wrapper requires a native-Swift plugin (or app extension target) to expose those frameworks to the web layer — because all four are *app extensions* that compile separately and run outside the WKWebView process. The wrapper choice doesn't determine *whether* you write Swift; it determines *how much* Swift glue you write and what shape the bridge takes. (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:70`)

### Phase A — macOS PWA installable (current state)

  + Safari → Add to Dock. Zero-effort path; ship messaging that points Mac users here rather than waiting for a wrapper.
  + Already in flight; no work needed.
  + (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:210`)

### Phase B — iOS/iPadOS via Capacitor + App Intents + Widgets **(Research locked; ready to plan)**

From `docs/research/1_DEEP/native-wrapper/OPTIONS.md:212-219` (verbatim):

  1. **Capacitor shell loading `https://thots.august.style` with bundled offline fallback.**
  2. **App Group container; web layer writes latest note + cursor state.**
  3. **App Intents target**: "Add to Thot," "Read my last note," "Open at draft X" — Siri/Shortcuts-discoverable.
  4. **WidgetKit target**: lock-screen + home-screen "last note preview" reading from App Group.
  5. **Push subscription** for cross-device sync once `auth-and-sync/` lands.

  + *"Unlocks the post-it-on-lock-screen and 'Siri, add to Thot' features — the most distinctive differentiators for a markdown app."*

### Phase C — Live Activities + Dynamic Island

From `docs/research/1_DEEP/native-wrapper/OPTIONS.md:221`:

  + *"ActivityKit widget extension on the same Capacitor shell. Long-running Live Activity registered per 'thinking session'; Dynamic Island compact view shows title + cursor indicator; tap opens at the current note (in-island editing isn't possible — Live Activities are read-only surfaces with limited button interactions). Geo-tag in `ActivityAttributes`. Ship after B because the App Group plumbing is shared."*

  + **Why Sean wants this**
    - *"I **LOVE** the idea of there just always being a little 'notepad' available by tapping the dynamic Island — Tap when you have an idea but are in the flow — Quick jot whatever it was down and keep working — *Opportunity* to even have AI organize or otherwise manage these one-off notes — Lock-screen live activities and app intents for shortcuts — Data-at-a-glance on Lock Screen, Home Screen, note to self in dynamic island (or many reminders kept there)"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:194-199`)
    - *"This has potential — Our UI layout allowing users to set 'post-it' visible text — It could extend that feature to even more helpful locations. — I love the idea of it being sort of like an interactive journal if you wanted — It can see when you get home and prompt you about what to journal — Create different 'schemas' or vibes like therapy, and creative writing, and memior writer — Full, immediate integration with Widgets, Lock Screen Live Activities, and App Intents for Shortcuts — Glanceable data on the Lock Screen, Home Screen, and Dynamic Island"* (source: `docs/archive/resources/SWIFTUI.md:60-67`)

### Phase D — iPadOS Apple Pencil annotation

From `docs/research/1_DEEP/native-wrapper/OPTIONS.md:223`:

  + *"Native PencilKit overlay + Vision OCR (per §7.2). iPadOS-only 'annotate mode' toggle inside the Capacitor shell. OCR'd handwriting flows into the doc as text; raw strokes persist as a separate ink layer alongside the markdown. Most code per feature, but a named differentiator — don't cut."*

  + **Why through WKWebView is not enough (§ 7.2 verbatim)**
    - *"WKWebView delivers `PointerEvent` data (since iOS 13, `pointerType: 'pen'` indicates Pencil) with pressure, tilt, and azimuth. A web app can render strokes onto an HTML5 `<canvas>`. For *casual* annotation, this works."*
    - *"Why it's insufficient for Thot: **Latency.** Native PencilKit uses Apple's predictive low-latency pipeline (~9ms perceived). WKWebView pointer events route through JS + DOM and land closer to 60–120ms. Users notice immediately; serious annotation feels broken."* (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:191-194`)
    - *"**Pencil Pro gestures.** Squeeze, double-tap, hover, barrel roll surface through native `UIPencilInteraction`. WKWebView exposes some via standardized pointer events; newer gestures are inconsistent."*
    - *"**Scribble.** Apple's Scribble (handwriting-to-text in *any* text input) works in WKWebView text fields. So Pencil-as-keyboard is free. But Thot wants *annotation overlay* — different feature."*
    - *"**Vision OCR** for handwriting → text requires processing strokes natively. You can capture in the web layer and forward to Swift, but at that point the web layer adds nothing."*

  + **The shape that works**
    - *"A native `PKCanvasView` overlay above the WKWebView, bound to an 'annotate mode' toggle. When on, WKWebView interaction disables; PencilKit captures strokes; Vision OCRs; results post back to the web layer as text edits or as a stored ink layer on the document. ~200–500 lines of Swift plus a small Capacitor plugin for the toggle/OCR mediation."* (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:200`)

  + **Sean's framing**
    - *"And I am also very much an iPadOS Apple Pencil lover — Apple Notes does it too but they're so clunky and it goes no where — Ours would be more like actual feedback being given on a document with a red pen — We'd offer Standard blue/black/red pen or black Sharpie — Offer to convert handwritten messages to actual text"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:207-212`)
    - *"Here's some value! — Apple Notes does it too but that app is so clunky — We'll consciously be simple in how we integrate tools like this — Standard blue/black/red pen or black Sharpie — Also offer to convert handwritten messages to actual text — Let you red pen edit a document"* (source: `docs/archive/resources/SWIFTUI.md:76-81`)

### Phase E — WatchOS companion

From `docs/research/1_DEEP/native-wrapper/OPTIONS.md:225`:

  + *"Separate SwiftUI Watch target in the same Xcode project. Voice → transcription → `WatchConnectivity` → phone → App Group. MVP: tap-to-dictate, see in iPhone Thot. Stretch: complications, watch reading of recent notes. Ship last because sync infrastructure (App Group + cloud sync) is what makes a watch note useful."*

  + **Why WatchOS can't go through a wrapper (§ 7.1 verbatim)**
    - *"**No, not realistically.** Three structural reasons:"*
    - *"1. WatchOS doesn't host WKWebView. Watch apps run in a constrained SwiftUI runtime; Apple has not exposed a general-purpose web view on the watch."*
    - *"2. Wrappers don't cross targets. Capacitor/Tauri/PWABuilder all generate iOS app targets, never WatchOS."*
    - *"3. The watch use case is voice + glance, not editor. CodeMirror on a watch screen wouldn't be useful even hypothetically; the watch wants a capture surface that ports to the phone."*
    - (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:181-183`)

  + **The shape that works**
    - *"A small native SwiftUI Watch target inside the same Xcode project as the iOS Capacitor shell. Watch handles voice capture (`SFSpeechRecognizer` live, or local-audio + on-phone transcription for higher quality), pushes transcript to phone over `WatchConnectivity`, phone app writes it into the App Group container the web layer reads. Bounded native scope — the Watch UI is one or two views; data flow is one-way (watch → phone) for the MVP."* (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:185`)

  + **Sean's framing**
    - *"I personally find it crazy when apps don't have a WatchOS app because huge missed opportunities — I'd love if you WatchOS Thot App let you record voice messages that WhisperAI changed to text — This could be extended to sort of more advanced 'automatic AI note takers' — You could hit a button on the watch and get all the meeting notes from the Watch listening"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:201-205`)
    - *"This wasn't listed but I hate when Apps don't think of anything to go on the watch; huge missed opportunities — I'd love if you WatchOS Thot App let you record voice messages that WhisperAI changed to text — This could be extended to sort of more advanced 'automatic AI note takers' — You could hit a button on the watch and get all the meeting notes from the Watch listening"* (source: `docs/archive/resources/SWIFTUI.md:69-73`)

  + **Transcription provider open question**
    - *"`SFSpeechRecognizer` adequate, or does audio need to round-trip to phone/server for Whisper-quality? Latency vs quality."* (source: `docs/research/1_DEEP/native-wrapper/OPTIONS.md:258`)
    - Sean's reference is "WhisperAI changed to text" — implies he wants Whisper-quality. SFSpeechRecognizer is on-device and free; Whisper via API costs money but is better.

### Phase F — macOS native shell (optional)

From `docs/research/1_DEEP/native-wrapper/OPTIONS.md:227`:

  + *"Only if Catalyst (free from B–E) proves insufficient for window management, multi-window, or menubar work. Tauri is a candidate; maintenance of a second codebase is real. Default: stick with Catalyst."*

  + **The macOS menubar jot pad**
    - From the Native Apps research bucket: *"macOS toolbar/notch jot pad — Sean's 'lives in the menubar, hover to capture' idea. Quick-capture surface that doesn't context-switch the user out of their workflow. SwiftUI menubar apps are well-supported. What's the data model — does the jot pad write to the same persistence layer as the web app?"* (source: `docs/archive/research/1_DEEP/native-apps/1_REVIEW.md:21`)
    - Cross-references: a SwiftUI menubar app shipping the same `localStorage` content (via App Group) is the obvious shape.
    - This is likely a separate Mac-native target *not* served by Catalyst — Catalyst gives you a windowed iPad-app-on-Mac, not a menubar utility. Phase F or a separate parallel track.

  + **Notarized DMG distribution (no App Store)**
    - From Native Apps research: *"Native-without-App-Store paths — does every macOS app require App Store submission and a paid developer account? Or can a SwiftUI wrapper be distributed as a notarized DMG outside the store? (For macOS yes; for iOS no.)"* (source: `docs/archive/research/1_DEEP/native-apps/1_REVIEW.md:18-19`)
    - macOS allows DMG distribution outside the App Store with notarization (paid Developer ID, free notarization service). Avoids the 30% cut for direct-download buyers.
    - iOS requires App Store (or TestFlight, or enterprise distribution — none of which are general-distribution paths).

### iOS-specific affordances (full list)

#### Live Activities & Widgets

  + *"Live Activities & Widgets — This has potential — Our UI layout allowing users to set 'post-it' visible text — It could extend that feature to even more helpful locations."* (source: `docs/archive/resources/SWIFTUI.md:59-62`)
  + *"Full, immediate integration with Widgets, Lock Screen Live Activities, and App Intents for Shortcuts — Glanceable data on the Lock Screen, Home Screen, and Dynamic Island."* (source: `docs/archive/resources/SWIFTUI.md:66-67`)
  + Capacitor: via custom plugin (no first-party ActivityKit plugin as of late 2025 per OPTIONS.md `VERIFY`).
  + Implementation: separate Widget Extension target reading from a shared App Group container; web layer writes via thin Capacitor plugin.

#### App Intents (Siri / Shortcuts)

  + *"Lock-screen live activities and app intents for shortcuts"* (source: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:198`)
  + Examples: "Hey Siri, add to Thot." "Hey Siri, read my last note." "Hey Siri, open my Q4 planning Thot."
  + Implementation: `AppIntent` struct declared in iOS target, Siri/Spotlight-discoverable. Calls Capacitor bridge or deep-links the app.

#### Apple Pencil (PencilKit overlay)

  + Detailed above under Phase D. Native PencilKit overlay above WKWebView.

#### Writing Tools (iOS 18+)

  + *"Apple Intelligence-powered writing features — Proofread, refine, rewrite, summarize are available in PWA with right click — But iOS 18+ Writing Tools supposedly are only available native"* (source: `docs/archive/resources/SWIFTUI.md:50-52`)
  + Native shell unlocks iOS 18+ Writing Tools system-wide on selected text. Reduces the AI surface Thot has to build itself for the "rewrite paragraph" / "summarize section" case.

#### Biometric (Face ID / Touch ID)

  + *"Biometric Security — Create locked sections or notes — Keep your diary truly personal — Actually this would be sort of essential in that we'd be setting up passkey login anyway; I'm assuming that the native app biometric would just make that faster and just not a login screen."* (source: `docs/archive/resources/SWIFTUI.md:54-57`)
  + Implementation: `LocalAuthentication` framework (`LAContext`). Per-note lock flag stored alongside the note metadata; on open, prompt for biometric.
  + Couples to the `auth-and-sync/` research bucket — passkey login (web) + biometric unlock (native) should share auth state.

#### Share Sheet

  + *"'share sheet' — Send Apple notes app, etc. text to Thot, and vice versa; send the text to any app, messages, etc. — Could this be fashioned into an 'Import my notes from Apple Notes' onboarding feature?"* (source: `docs/archive/resources/SWIFTUI.md:18-21`)
  + Implementation: declare share extension intent; receive shared text; route into a new Thot note (or append to the active one).
  + Onboarding angle: "share all your Apple Notes to Thot" import path on first launch.

#### Native file system access

  + *"file system access would be there"* (paraphrased from v2 SwiftUI wrap-up; source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:395`)
  + Capacitor `Filesystem` plugin gives read/write to the app's container, plus user-picker access via the `Documents` directory.
  + Resolves the local file path clickability deferral from Interactive Markdown — once native shell exists, clicking `/Users/me/notes.md` can open via Launch Services.

#### System-Level Integrations (Siri, Maps, Calendar, Camera, Contacts)

  + *"System-Level Integrations — Direct interaction with Siri, Apple Maps, Calendar, Camera flash, and Contacts without permission friction — Background processing; e.g., syncing, location tracking in the background; 'location tracking' always gets my attention"* (source: `docs/archive/resources/SWIFTUI.md:22-25`)
  + Most are out-of-scope for v1 native. Calendar / Reminders integration is in-scope (see below).

#### Advanced Haptics & UI

  + *"Advanced Haptics & UI — Custom haptic feedback (Haptic Engine) — System-level animations that create a 'signature Apple feel'"* (source: `docs/archive/resources/SWIFTUI.md:27-29`)
  + Polish; not a feature differentiator. Save the cycles for Phase B–E core features.

#### Platform-Specific UI Components

  + *"Platform-Specific UI Components — Accessing exclusive SwiftUI views and modifiers like NavigationSplitView for iPad/Mac — Material backgrounds, and SwiftCharts"* (source: `docs/archive/resources/SWIFTUI.md:31-33`)
  + If the columns workspace UI uses native chrome, `NavigationSplitView` is the iPad/Mac primitive that matches Finder-style columns. Possible long-term architecture direction.

#### Push Notification Reliability

  + *"Push Notification Reliability — Consistently reliable push notifications without browser dependence — To be fair, I've literally never gotten a PWA notification before"* (source: `docs/archive/resources/SWIFTUI.md:35-37`)
  + Native APNs vs Web Push. Native more reliable; Web Push exists on iOS 16.4+ but still spotty.

#### Reminders integration (`@2026-05-15-7pm` notation)

  + **The vision (verbatim)**
    - *"How could would it be if on any not just writing @02/14/2026-7pm and BOOM you get a reminder (or at the very least, notification)"* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:397`)
    - *"We could easily take things a step further with things in integrating with reminders, porting over from Notes App"* (source: `docs/archive/v2_0/v2_0_0_FEEDBACK.md:396`)

  + **What it does**
    - Detect a date-time literal anywhere in a note: `@2026-05-15-7pm`, `@2026-05-15 7pm`, `@May 15 7pm`, etc.
    - Highlight the literal as a clickable date-time entity.
    - On click (or auto on save), offer to create a Reminders.app entry: title = surrounding sentence or heading, due = parsed date-time.
    - Two-way: edits to the Reminder reflect back to the note? Probably one-way (note → reminder) for v1.

  + **Implementation**
    - Web side: regex-based date-time detection extension; renders detected literals with a special CSS class.
    - Native side: `EventKit` framework, `EKEventStore`, `EKReminder` creation. Capacitor plugin exposes a `createReminder({title, dueDate})` call.

  + **Privacy / permissions**
    - Requires Reminders access permission. First-time triggers permission prompt.

### visionOS — speculative future watching

  + **Origin**
    - *"Spatial Computing (visionOS) — This just needs to be on the radar — Creating native visionOS apps with 3D elements, volumetric windows, and RealityKit integration — People could probably 'Go to the beach to write' 'Sit under a tree and draw' — I've been fascinated with the idea of development in visionOS"* (source: `docs/archive/resources/SWIFTUI.md:38-42`)

  + **Status: speculative — future watching**
    - Not a v1 native target. Not in any current phase. Mentioned as something to watch as visionOS adoption grows.

  + **Translation of the writing pad to visionOS**
    - Volumetric windows (a floating window in space) hosting the markdown editor.
    - Environment-aware: detect you're in a beach scene, suggest "beach writing" theme or prompt.
    - This is speculative product design; nothing concrete.

### Apple Wallet — speculative (LLM token purchases)

  + **Origin**
    - *"Apple Wallet — Because how cool would it be to be the person who made it normal to buy things from your notes app — IDK what yet tho lol ... LLM tokens haha"* (source: `docs/archive/resources/SWIFTUI.md:43-46`)

  + **Status: speculative — future watching**
    - Sean's joking framing, but the idea sticks: in-Wallet payment for AI token top-ups would be a frictionless monetization surface (Apple Pay, no card entry).
    - Practical implementation: would require server-side billing flow with Apple Pay tokenization. Not v1.

### macOS-specific affordances

  + **Mac Catalyst (Phase B–E gives this for free)**
    - The same Capacitor iOS app, built with Catalyst, runs on macOS. Window resize, Mac-style menus, file dialogs, etc. all work.
    - Limitation: not menubar-friendly. Catalyst apps are *windowed* apps, not menubar utilities.

  + **macOS menubar jot pad (Phase F or separate track)**
    - *"macOS toolbar/notch jot pad — Sean's 'lives in the menubar, hover to capture' idea. Quick-capture surface that doesn't context-switch the user out of their workflow. SwiftUI menubar apps are well-supported."* (source: `docs/archive/research/1_DEEP/native-apps/1_REVIEW.md:21`)
    - Separate SwiftUI app (`MenuBarExtra` in SwiftUI 4+) sharing the same App Group as the main Capacitor app.
    - Tap menubar icon → small floating window → type → it persists to the main pad.
    - Sean's writeup (Notes Collected Over Time) flagged this as a "must-have" feel; no concrete implementation has been planned.

  + **Notarized DMG distribution (no App Store)**
    - Covered above under Phase F. macOS allows DMG distribution outside the App Store with notarization.

### App distribution strategy

  + **macOS**
    - **Primary**: Mac App Store via Catalyst build (low friction for users).
    - **Secondary**: notarized DMG download from `thots.august.style` (avoids 30% cut, faster updates).
    - Both supported simultaneously.

  + **iOS / iPadOS**
    - App Store only (Apple's policy). Capacitor build, App Intents + Widgets + Live Activities + Pencil overlays as native targets.
    - TestFlight for beta users.

  + **WatchOS**
    - Bundled with the iOS app on the App Store (Watch apps cannot be standalone distributed separately — they ship as part of an iPhone app).

  + **visionOS**
    - Speculative; would be App Store if/when shipped.

### Open Research Items from `OPTIONS.md`

From `docs/research/1_DEEP/native-wrapper/OPTIONS.md:250-263` (Phase 2 should target these directly):

  1. **VERIFY Capacitor plugin status for ActivityKit, App Intents, WidgetKit** — community plugin maintenance, license, dependency profile. If none are usable, scope custom-plugin work explicitly.
  2. **VERIFY PWABuilder iOS template in 2026** — officially supported, maintenance mode, or abandoned. If abandoned, drop from candidate set.
  3. **VERIFY Tauri 2.0 iOS plugin ecosystem** — basics (Camera, Filesystem, Push, Haptics, Share) shipped or theoretical?
  4. **VERIFY Guideline 4.2 rejection trends 2025–2026** — practitioner reports, updated rejection language.
  5. **VERIFY Service Worker reliability in Capacitor's WKWebView on iOS 17/18** — lifecycle, storage quotas, cold-start persistence. Affects offline-on-airplane.
  6. **VERIFY PencilKit + WKWebView coexistence in shipped apps** — real overlay examples, glitch rate, toggle UX.
  7. **VERIFY On-device Watch transcription quality** — `SFSpeechRecognizer` adequate, or does audio need to round-trip to phone/server for Whisper-quality? Latency vs quality.
  8. **VERIFY Pencil Pro gesture exposure through WKWebView pointer events** — how much of squeeze/barrel-roll is reachable without a native overlay. If most works, Pencil overlay scope shrinks.
  9. **App Group container size + write-frequency limits.** iOS throttles widget refresh; informs how often the web layer should write "latest note."
  10. **Sync architecture dependency.** WatchOS phase presumes a sync story; `auth-and-sync/` needs to land first or in parallel. Flag as cross-bucket dependency.
  11. **All cited sources need re-verification** — the original draft was written without live web access. Phase 2 must re-fetch Capacitor, Apple Developer, and PWABuilder docs and add direct quotes / version numbers.

### Why "hybrid" not "lite"

  + **Standard industry framing** — App Store version = full features (charged), web version = lite trial.
  + **Sean's inversion** — web = full features (always), App Store = same features + platform bonuses (charged).
  + **Why this works for Thot specifically**
    - Single codebase reduces maintenance — the web app *is* the App Store app's content.
    - Live updates without App Store re-submission for non-native changes.
    - Web-first messaging: "no install required, use it now." Removes the friction barrier that kills most note-app adoption.
    - App Store version sells the *bonuses*: Live Activities, Widgets, Pencil, Watch, Reminders. Each is a real platform-unique value, not a re-skin.
  + **What this avoids**
    - The Notion / Bear / iA Writer model of "the web version is a watered-down preview." That model loses prospects who want to evaluate seriously without installing.
    - The Obsidian model of "no web version, only desktop install." Excludes the casual writer entirely.

### Cross-references

  + **Auth & sync research bucket** (`docs/research/1_DEEP/auth-and-sync/`) — gates Phase E (WatchOS) usefulness and Phase B (iOS) push subscription. Recommendation locked: Yjs + Liveblocks for collab, Clerk for auth, Vercel Postgres / Neon for single-user device sync v1, multi-user collab v2.
  + **AI Integration** — `@claude` in native shell can access Apple Intelligence (Writing Tools) for the rewrite/summarize flows. Reduces hosted-AI cost.
  + **Preferences UI** — native-only preferences (biometric lock, Reminders trigger syntax, Pencil mode) need bridges from web preference UI to native config.
  + **Interactive Markdown** — local file path resolution becomes feasible in native shell. URL clickability already works through the WKWebView (just opens via `window.open` and the shell routes to Safari).
  + **Workspace & Multi-Note** — App Group container is the sync surface for native widgets and Watch. Multi-note state must be reflected outside `localStorage` for native readers.

---

## Monetization & Pricing Posture

This is the business-track section; it stays brief. The detailed work happens in a parallel track (per the "Parallel Track — Business Plan Kickoff" framing in `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:778-810`). What's captured here is the seed-question surface from `docs/archive/research/1_DEEP/monetization/1_REVIEW.md`, the free-tier UX constraint, the trust posture, and the Stripe AI billing coupling — enough that future business-plan work doesn't have to re-derive the framing.

### Strategic frame

  + **Why monetization needs to be decided before public launch**
    - *"Thot is approaching the public-release line (v5.0). A real business plan — positioning, audience tiers, monetization model, competitive landscape, GTM — needs to be in place before the soft launch, not improvised at it."* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:782`)
    - *"Sean has noted that the recent shift away from Cursor / Antigravity back to terminal-native AI coding has clarified Thot's positioning specifically, which is signal that the messaging surface is ready to be formalized."* (source: `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:784`)

  + **Sean's instinct (verbatim)**
    - *"Sean's instinct: the free tier must remain genuinely useful (not a 3-day trial with paywalls); the paid tier earns its money by unlocking real value (sync, collab, AI affordances)."* (source: `docs/archive/research/1_DEEP/monetization/1_REVIEW.md:12`)

### Seed questions awaiting business-plan research

From `docs/archive/research/1_DEEP/monetization/1_REVIEW.md:17-32` (verbatim):

  + **Tier structure** — what's free, what's paid?
    - Candidate free: full local editor, one-device localStorage, no AI, no collab.
    - Candidate paid: cross-device sync, AI affordances, multi-user collab, file management UI.
    - Where does the User Preferences UI (v3.5.0, later renumbered to v6.0) sit? Probably free — it's a usability baseline.

  + **Pricing model:**
    - Flat monthly subscription (Notion-style).
    - Usage-based for AI (tokens charged through, see Stripe AI billing).
    - Hybrid: flat for sync+collab, metered for AI.
    - Lifetime license (Bear-style) — minority of buyers but non-trivial.

  + **Stripe AI billing for token usage**
    - *"Sean noted Stripe has tools now for charging-or-being-charged for AI tokens. Investigate: how does this work in practice? Does it support per-user metering and a sane UX?"*
    - Cross-reference: `docs/archive/v4_0/processed/v4_0_0_CLARITY.md:177` — *"Stripe billing has LLM token that adjusts for model"*.

  + **Agent payment systems**
    - *"Sean mentioned articles about Stripe building purchase systems specifically for AI agents. Probably not relevant for Thot v4 directly, but worth noting if Thot eventually has agent integrations."*

  + **Free tier limits that don't feel hostile**
    - Devices? Word count? Doc count? Feature gating?
    - *"The pattern matters more than the limit."*

  + **Trust posture and pricing**
    - *"Sean's privacy/sovereignty lineage. Self-hosting option for paid users? Bring-your-own-AI-key as a fallback (avoids charging for AI tokens but still requires paying for sync)?"*

  + **Competitive pricing landscape**
    - *"Notion, Bear, iA Writer, Ulysses, Craft, Obsidian Sync. What do they charge? What do they include in free?"*

### Free-tier UX constraint

  + **The constraint (verbatim)**
    - *"Sean's instinct: the free tier must remain genuinely useful (not a 3-day trial with paywalls)"* (source: `docs/archive/research/1_DEEP/monetization/1_REVIEW.md:12`)

  + **What this rules out**
    - 3-day trials with paywalls.
    - Feature drip ("you used the editor 5 times — upgrade now").
    - Aggressive limits (word counts, doc counts that cap normal usage).

  + **What this allows**
    - Disabling AI tab completion on free tier (because AI has hard cost floor).
    - Disabling cloud sync on free tier (because sync requires backend infrastructure).
    - Disabling multi-user collab on free tier (because it requires backend + auth).

  + **Why this constraint matters**
    - Most note apps die because their free tier is so painful that prospects bounce before evaluating seriously.
    - Thot's pitch — "the IDE markdown editor for everyone, not just devs" — requires that "everyone" can try it for free, fully featured, single-device. Without that, the conversion funnel never starts.

### Trust / sovereignty posture

  + **From the bucket**
    - *"Sean's privacy/sovereignty lineage."* (source: `docs/archive/research/1_DEEP/monetization/1_REVIEW.md:31`)

  + **What this means practically**
    - Self-hosting option for paid users (avoid vendor lock-in).
    - BYOK (bring-your-own-AI-key) as a fallback to bundled AI billing — user pays the model provider directly, Thot just provides the UI surface.
    - End-to-end encryption posture for synced docs (when sync ships).
    - Clear data export / portability story — never trap a user's notes.

  + **Why this matters strategically**
    - The "AI-skeptical" audience (the privacy-conscious, the sovereignty-leaning) is a real and growing segment.
    - Most AI note apps lock users into the vendor's AI provider, hosting, and account system. Thot can position as the trusted alternative.

### Stripe AI billing coupling

  + **From the AI Features bucket** (already captured in AI Integration section)
    - *"Cost model directly affects `monetization` bucket — paid tier likely centers on AI affordances."* (source: `docs/archive/research/1_DEEP/ai-features/1_REVIEW.md:35`)

  + **How it works (sketch)**
    - Stripe's AI-token billing primitive: per-user metered subscription.
    - Each LLM call: usage = tokens × model rate. Recorded against the user's Stripe meter.
    - Monthly invoice consolidates fixed subscription + metered usage.
    - User-facing: in-app token balance display, configurable cap to prevent runaway spend.

### Competitive pricing context (placeholder)

  + Notion: ~$10/user/month (Plus), $15/user/month (Business). Free for personal.
  + Bear: $2.99/month, $29.99/year, also lifetime ~$200. Subscription unlocks sync, themes, export.
  + iA Writer: one-time $50 (desktop) / $30 (iOS) per platform.
  + Ulysses: $5.99/month, $49.99/year. Subscription includes all platforms.
  + Craft: ~$5/month, $44.99/year. Free for personal.
  + Obsidian Sync: $4/month or $48/year (separate from the free Obsidian app).
  + **None of the above include hosted AI tokens** as of late 2025. AI add-ons are typically extra ($10/month for Notion AI, ~$20/month for Craft AI).
  + Numbers are rough indicators; verify in business-plan research.

### How this section interacts with product spec

  + Monetization is a *business-track* concern; this section flags it for the parallel business-plan track per `docs/archive/v4_0/v4_1_0_IMPLEMENT.md:778-810`.
  + Product decisions that materially affect monetization (AI on/off in free tier, sync architecture, multi-user collab) are captured in the relevant product sections (AI Integration, Native Wrappers, Workspace & Multi-Note).
  + **This section is brief intentionally** — it's a placeholder for the business plan, not a product spec section.

### Flag: needs business-plan research, not product spec work

This section is **(Concept, needs research)** and explicitly **not** a product-spec section. The seed questions above are the input to a separate research stream. Outputs of that stream — pricing, tier definitions, GTM positioning, monetization mechanics — will eventually flow back into the product spec where they affect feature gating, but the *business* decisions belong in `docs/BUSINESS_PLAN.md` (per `.agent/DEV_RULES.md` § Non-Archive Doc Directories) and the research feeders in `docs/research/`.

---

## Open Questions & Unresolved Designs

To be compiled in Pass 3 from each section's local `### Open Questions` subsections.

---

## Document Provenance & Source Map

To be compiled in Pass 3. Will list every source file that contributed to each section, so future agents can audit and so we know which archive docs are now fully drained vs still holding unmined detail.
