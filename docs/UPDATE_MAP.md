# Thot Development Roadmap & Strategic Planning
`thots.august.style`

**Updated**: 2026-02-20
**Current Version**: v2.1.4
**Current Branch**: `v2-first-thots`
**Status**: Strategic planning for parallel development

---

## Table of Contents

1. [Development Process & Protocols](#development-process--protocols) — See [`.agent/DEV_RULES.md`](/.agent/DEV_RULES.md)
2. [Priority-Based Update Tracking](#priority-based-update-tracking)
3. [Version Roadmap](#version-roadmap)
4. [Parallel Development Tracks](#parallel-development-tracks)
5. [Research Needs & Open Questions](#research-needs--open-questions)
6. [Consolidated Notes & Ideas](#consolidated-notes--ideas)
7. [Project Vision](#project-vision)
8. [Future Vision (v5.0+)](#future-vision-v50)

---

## Development Process & Protocols

**Note**: Full development protocols have been extracted to [`.agent/DEV_RULES.md`](/.agent/DEV_RULES.md) for reuse across projects. This section provides Thot-specific context.

### Thot-Specific Branching

- `main` — Protected, production-ready code
- `v2-first-thots` — Current primary dev branch
- Feature branches follow standard protocol (see DEV_RULES.md)

### Thot-Specific Documentation

- `docs/THOT_APP.md` — Main technical reference (update for architecture changes)
- `docs/UPDATE_MAP.md` — This file, strategic roadmap
- `docs/plans/` — Active feature implementation plans
- `docs/archive/vX/` — Completed update documentation

### Key Lesson from v2.0.8

The highlighting system rewrite could have been avoided with proper upfront research. Always verify assumptions about complex systems (like CodeMirror/Lezer) before implementing.

**For detailed protocols on git workflow, implementation plans, parallel development, and agent standards, see [`.agent/DEV_RULES.md`](/.agent/DEV_RULES.md).**

---

## Priority-Based Update Tracking

### CRITICAL — v2.2.0 (Bug Fixes)

**Status**: Next immediate work
**Goal**: Fix blocking issues preventing smooth user experience
**Timeline**: Complete before starting v3.0.0 features

**Strategic Note**: These bugs don't break core functionality but create "unpolished" feeling. Must fix before launching paid tiers.

#### 1. Highlighting Bugs (5 issues from v2.1.4_BUG_REPORT.md + nested emphasis)

**Issues:**

1. **Inline code tick marks** — Should be red-orange (#F34D3E) like inline code content, currently not matching
2. **Bullet markers** — Should be gold (#dfc532), currently infected by cyan content color
3. **Numbered markers** — Should be red (#ff6b6b), currently infected by pink content color
4. **Link URLs** — Should be cyan (#8BE9FD), currently not differentiating from link text
5. **Nested emphasis** — Italics in bold doesn't work, but bold in italics does; **Like *this* line** vs *Like **this** line* should work both ways (both should apply: ExtraBoldItalic 800i)

**Files to modify**: `src/highlight-tags.ts`, `src/theme.ts`, possibly `src/editor.ts`

**Reference**: `docs/archive/v2/v2_1_4_BUG_REPORT.md`

--- 

*EDIT:* **REGARDING INLINE TEXT DELIMITER NOT CHANGING COLOR OF INLINE TEXT**

+ First see `docs/THOT_APP.md` Line 158 in the extensions array ordered by priority 
  - Note that it says the tag `markerDecorations`, via ViewPlugin controls list markers + inline code marks (3 cases) 

+ Next see `src/highlight-tags.ts` Line 39 where the tag `color.inlineCode` indicated as the label and "color for inline code text and ` delimiters" 

+ Now go to `src/editor.ts` Line 13 we see that the color group from `src/highlight-tags.ts` is imported, good, and at Line 50 the `const inlineCodeMarkDeco` is being given the `colors.inlineCode`

  - In actuality the inline code delimiter remains the same color as code gating instead of turning the same color as the inline code content 
  - The `markerDecorations` will be 'built' and made further down on the `src/editor.ts` document 
  - I think that this mismatch of `markerDecorations` and `const inlineCodeMarkDeco` is causing the issue 

*EDIT:* **REGARDING ORDERED AND UNORDERED LIST MARKERS ADOPTING LIST CONTENT COLOR**

1. Next, staying with the `markerDecorations` for list markers, on `src/highlight-tags.ts` it lists `const bulletMarkTag` and `const orderedMarkTag` in Line 9 and 10 — then down further at Line 58 to 61 we are using `color.bulletMarker`, `color.bulletContent`, `color.numberedMarker`, and `color.numberedContent`

2. Now moving to `src/editor.ts` Line 15 and 16 we import from `src/highlight-tags.ts` a `const bulletContentTag` and a `const orderedContentTag` as well as the `colors` that included the four from 58 to 61 — this seems to become problematic when you continue down to Line 48 and 49 it is `const bulletMarkDeco` being applied to `color.bulletMarker` and `const numberMarkDeco` being applied to `color.numberedMarker`

- In actuality, the bulleted lists are using the blue from `color.bulletContent` on BOTH the unordered list marker and the unordered list item content, and the numbered lists are using the pink from `color.numberedContent` on BOTH the ordered list marker and ordered l ist content 
- I see a disconnect between `src/highlight-tag.ts` using `const bulletMarkTag` and `const orderedMarkTag` — BUT THEN  —  `src/editor.ts` using `const bulletContentTag` and `const orderedContentTag` 
- The "MarkTag" or "ContentTag" mismatch is probably allowing the "Content" colors to override them 
- 

**THIS IS TOO MUCH. WHY ALIAS IN THE FIRST PLACE? CAN THE COLOR NOT BE THE CONST? AND THEN, I JUST SEARCHED, AND I THE CONTENT TAGS AKA THE WORKING COLORS, ARE NOT MENTIONED ANYWHERE EXCEPT THE ONE, SIMPLE src/highlight-tag.ts DOCUMENT. MEANWHILE, NO IDEA WHY AFTER THE CONST AND COLOR ARE CONNECTED IN THE CODE WE HAVE TO LATER BUILD A markerDecorations AT ALL. I guess it doesn't recognize the markers to tag them but if it doesn't, which seems like a possible oversight because how and why would it be skipped out of all these tag scopes** 

**IN TRYING TO SORT THAT I WANT TO LOOK INTO BUILDING OUR OWN — we will need it for plain text anyway, plus it really is the only way we'll be able to have only one system. Bonus points = It is IP and we won't give it away for free. I THINK WHEN YOU SEE THE WEIRD HIERARCHY OF PLUGINS NEEDED AND THEN CSS ORDERING BY PRIORITY AND ALL THESE ALIAS NAMES you'll understand. WHY? I WANT TO USE CODE TO DEFINE CHARACTER PATTERNS, GIVE THAT TAG ONE NAME, DEFINE THE COLOR. NOTHING MORE. NO MULTIPLE PLUGINS AND FILES AND CSS STUFF. JUST NAMES AND A PRIORITY LISTS** 

*EDIT*: I also see "Autolinks" listed as a scope which reminds me that hyperlinks do not work at all, they get underlined but you cannot click them. 

---

#### 2. Icons Consolidation

**Problem**: Duplicate icons in multiple locations, missing manifest.json, inconsistent naming

**Current state:**
- `public/icons/` — 8 PNG files (16, 32, 64, 128, 192, 256, 512, 1024)
- `src/assets/icons/` — 7 PNG files (duplicate, missing 192)
- `docs/favicon-and-other-icons/html-package/` — Comprehensive new batch with proper names

**Action needed:**
- Use new comprehensive batch from `docs/favicon-and-other-icons/html-package/`
- Update `index.html` with proper favicon links
- Create/update `public/manifest.json` for PWA
- Remove duplicate icons from `src/assets/icons/`

**Reference**: `docs/archive/v2/v2_0_0_ICONS.md`

#### 3. iPad/Mobile Viewport Issues

**Issues from iPad testing:**

1. **Scrolling behavior** — Document doesn't scroll to top/bottom properly on initial load; requires clicking into text area to show full content
2. **Pull-to-refresh interference** — Pulling down stops at line 4 until text area is focused
3. **Bottom padding** — Last line cramped against screen edge when typing
4. **Viewport calculation** — Content goes below fold on initial load

**Likely causes**: CSS viewport units, touch event handling, iOS Safari quirks

**Files to investigate**: `src/theme.ts` (viewport/padding), `index.html` (meta viewport tag)

#### 4. YAML Highlighting Bug

**Issue**: Hyphens after numbered list items trigger heading style

**Behavior:**
1. Write numbered list
2. Delete number, add hyphen (for sub-list)
3. Text above hyphen turns heading color
4. Only happens after numbered list, not after headings
5. Goes away when character added after hyphen

**Likely cause**: YAML frontmatter detection (three hyphens at document start) incorrectly triggering after list items

**Fix needed**: YAML rules should only apply at document start, not after list items

**Files to investigate**: `src/editor.ts` (styleTags for YAML), possibly markdown parser configuration

#### 5. Undo/Redo Issue (iPad)

**Issue**: "Ctrl-Z doesn't undo my deletion of the full page!!"

**Investigation needed**: 
- Is this a CodeMirror history issue?
- iOS-specific behavior?
- Reproducible on desktop?

**Priority**: Critical if reproducible consistently, otherwise defer

**Files to investigate**: `src/editor.ts` (history extension configuration)

### HIGH — v3.0.0 (Monetization Ready)

**Status**: Planning phase
**Goal**: Feature-complete PWA ready for web app subscription launch
**Strategy**: Serve both markdown power users AND normal text editor users

**Strategic Reasoning**: This version makes Thot competitive with existing note apps while maintaining unique semantic highlighting advantage. By supporting both markdown and visual formatting, we capture two user segments instead of one.

#### 8. Intelligent Formatting Mode ⚠️ RESEARCH NEEDED

**Why now**: This is the killer feature that differentiates us from every other markdown editor

**User Experience Goals:**

- Users who don't know markdown can format text visually (bold, italic, lists)
- Markdown users can type notation as usual
- Both can coexist in the same document
- Optional: hide notation while preserving formatting (like Google Docs comment mode)

**Two Possible Approaches:**

**Option A: Dual Mode (simpler)**
- Document is either "Markdown" or "Visual" mode
- Visual mode: formatting toolbar/context menu, notation hidden
- Markdown mode: notation visible, semantic highlighting
- Toggle between modes

**Option B: Hybrid Mode (innovative)**
- Single mode supporting both input methods
- Type notation → it works
- Use formatting UI → notation added but can be hidden
- Smart detection of user preference

**Research Questions:**

1. Can CodeMirror hide specific characters while preserving them in the document?
2. How do we handle cursor positioning when notation is hidden?
3. Performance implications of real-time notation hiding?
4. What's the UX for the formatting UI? (toolbar, context menu, floating button)

**Strategic Note**: This is complex enough to warrant its own exclusively executable plan after research. Consider starting with Option A for v3.0.0, then Option B for v3.1.0.

#### 10. Light Theme Option

**Why now**: Some users prefer light backgrounds; accessibility consideration

**Implementation**: Duplicate color palette with light theme values

**Files to modify**: `src/highlight-tags.ts` (add light theme colors), `src/theme.ts` (theme toggle logic)

**Research needed**: Best practice for theme switching in CodeMirror 6

### MEDIUM — v3.1.0+ (Polish & Enhancement)

**Status**: Deferred until v3.0.0 complete

#### 11. Simple Export (HTML/PDF)

**Why later**: Not blocking monetization; users can copy/paste for now

**Implementation approach:**

1. **Phase 1**: Strip markdown notation, apply formatting, trigger browser print dialog (saves as PDF)
2. **Phase 2**: Use Typora CSS themes as reference for better typography
3. **Phase 3**: Export to .docx (if needed)

**Reference**: `docs/archive/v3/typora-app-css-themes/` — but verify these are for export, not editor highlighting

#### 13. Settings UI for Preferences

**Settings to expose:**

- Toggle spellcheck
- Toggle line numbers
- Toggle word/character/token count
- Font size adjustment
- Line height adjustment
- Max line width (for wide screens)
- Theme (light/dark)

**Implementation**: Settings panel (modal or sidebar)

#### 14. Clickable Paths & URLs

**Features:**

- Make file paths clickable (with directory access permission)
- Make URLs clickable (already styled, just need click handler)
- Setting to enable/disable
- Relative path support for allowed directories

#### 14. Anchor Links to Headings

**Feature**: Click heading to get anchor link, click anchor link to jump to heading

**Use case**: Long documents like this one

### RESEARCH TRACKS — Parallel Investigation

**Status**: Can be explored in parallel with v2.2.0/v3.0.0 work
**Goal**: Create exclusively executable implementation plans for future features

#### Research Track A: Custom Highlighting System

**Motivation**: 

- Current CodeMirror/Lezer system has limitations (context-dependent styling is complex)
- Want complete control for user-customizable themes
- Suspect it's easier than we think to build our own

**Questions to answer:**

1. What are the different approaches to syntax highlighting?
   - Token-based (like TextMate)
   - Parser-based (like Lezer)
   - Regex-based (simple but limited)
   - Custom tree-walker (full control)

2. What other systems exist?
   - TextMate grammar system
   - Monarch (VS Code)
   - Prism.js
   - highlight.js
   - Custom solutions

3. How do they handle priority/hierarchy?
   - CSS cascade
   - Explicit priority numbers
   - Tree depth
   - Last-match-wins

4. What would a modern, simplified system look like?
   - Designed for AI-generated themes
   - Simple priority rules (no depth complexity)
   - Easy to explain to non-technical users

5. How hard would it be to build our own?
   - Markdown parsing (we already have the tree from Lezer)
   - Applying styles (just CSS classes)
   - Performance (only visible lines)

**Deliverable**: Exclusively executable implementation plan comparing 3-4 approaches, with test branches for each

**Strategic Note**: This enables the "user-customizable themes per workspace" vision and makes highlighting work for plain text (non-markdown) mode.


#### Research Track C: Intelligent Formatting Implementation

**Questions to answer:**

1. **Notation hiding approaches**
   - CodeMirror decorations (hide specific ranges)
   - CSS (display: none on markers)
   - Virtual document (show formatted, store markdown)

2. **Cursor positioning**
   - How to handle cursor in hidden notation
   - Selection behavior across hidden ranges

3. **Formatting UI approaches**
   - Toolbar (traditional, always visible)
   - Context menu (right-click)
   - Floating button (mobile-friendly, stays out of way)
   - Keyboard shortcuts only (power users)

4. **Performance**
   - Real-time notation hiding/showing
   - Large document handling

**Deliverable**: Comparison of approaches with UX mockups and performance analysis

#### Research Track D: Export System

**Questions to answer:**

1. **Typora CSS themes analysis**
   - Which files are for editor highlighting vs. export?
   - How do they map markdown to styled HTML?
   - Can we adapt their approach?

2. **Export approaches**
   - Browser print dialog (simplest)
   - Generate HTML + CSS, open in new window
   - PDF generation library (pdf-lib, jsPDF)
   - Server-side rendering (overkill?)

3. **Typography considerations**
   - Font embedding in PDF
   - Page breaks
   - Margins and spacing

**Deliverable**: Simple export implementation plan (v1: strip notation + print)

**Strategic Note**: We overcomplicated this before. First version should be dead simple: remove markdown notation, apply basic formatting, trigger print dialog. Beautiful typography can come later.

### Parallel Development Best Practices

**Before starting parallel work:**

1. List all files each feature will modify
2. Check for overlaps
3. If overlap exists, sequence the work or refactor to separate concerns

**During parallel work:**

1. Each agent maintains detailed change log
2. Test in isolation on feature branch
3. Document any unexpected discoveries

**Merging finished updates:**

1. Merge first feature to `v2-first-thots`
2. Second feature rebases on updated branch
3. Resolve conflicts (should be minimal if planned well)
4. Run integration tests
5. Update UPDATE_MAP.md with completion status

**Example Scenario:**

- `feat/paired-delimiters` modifies `src/editor.ts` (keymap section)
- `feat/file-operations` modifies `src/editor.ts` (extensions array) and `src/main.ts`
- **Conflict potential**: Both touch `src/editor.ts`
- **Resolution**: Merge paired-delimiters first, file-operations rebases and adds its changes

---

## Priority-Based Update Tracking

### CRITICAL — v2.2.0: Bug Fixes & Polish

**Target**: Complete before starting v3.0.0
**Blocks**: User experience, monetization readiness

| Update                     | Status  | Blocks      | Notes                                             |
| -------------------------- | ------- | ----------- | ------------------------------------------------- |
| Fix inline code tick marks | Pending | UX          | Markers should match content color                |
| Fix bullet markers         | Pending | UX          | Gold color not applying                           |
| Fix numbered markers       | Pending | UX          | Red color not applying                            |
| Fix link URL highlighting  | Pending | UX          | Cyan not differentiating from link text           |
| Consolidate icons          | Pending | PWA install | Use new batch, update manifest                    |
| Fix iPad scrolling         | Pending | Mobile UX   | Content doesn't scroll to top/bottom on load      |
| Fix YAML highlighting      | Pending | UX          | Hyphens after numbered list trigger heading style |

**Strategic Note**: These bugs don't break core functionality but create "unpolished" feeling. Must fix before asking users to pay.

### HIGH — v3.0.0: Monetization Ready

**Target**: Web app subscription launch
**Strategy**: Feature parity with basic note apps + unique semantic highlighting

| Update                      | Status  | Research Needed | Notes                                 |
| --------------------------- | ------- | --------------- | ------------------------------------- |
| Native browser spellcheck   | Pending | No              | Enable spellcheck attribute           |
| Paired delimiters           | Pending | Minor           | Check CodeMirror closeBrackets        |
| File operations             | Pending | **YES**         | File System Access API research       |
| Multiple windows            | Pending | Minor           | window.open() + localStorage strategy |
| Intelligent formatting mode | Pending | **YES**         | Major research needed                 |
| Light theme                 | Pending | No              | Duplicate color palette               |

**Strategic Note**: File operations + formatting mode = competitive with Apple Notes, Google Keep, Notion (for basic use). Semantic highlighting = unique differentiator.

### MEDIUM — v3.1.0+: Enhancement & Polish

**Target**: After monetization launch
**Strategy**: Quality of life improvements based on user feedback

| Update                        | Status  | Priority | Notes                                      |
| ----------------------------- | ------- | -------- | ------------------------------------------ |
| Simple export (print/PDF)     | Pending | Medium   | Strip notation + browser print             |
| Bottom padding auto-grow      | Pending | Low      | Incremental padding as cursor nears bottom |
| Clickable paths/URLs          | Pending | Medium   | With permission settings                   |
| Anchor links to headings      | Pending | Low      | Jump to heading functionality              |
| Settings UI panel             | Pending | Medium   | Toggle preferences                         |
| Max line width setting        | Pending | Low      | For wide screens                           |
| Word/character/token counters | Pending | Low      | Toggle display                             |

### FUTURE — v4.0.0+: Native & AI Integration

**Target**: After PWA established
**Strategy**: Premium tier with native OS integration

| Update                  | Status  | Requires        | Notes                               |
| ----------------------- | ------- | --------------- | ----------------------------------- |
| SwiftUI wrapper         | Pending | v3.0.0 complete | Native wrapper only, not UI rebuild |
| Multi-note organization | Pending | SwiftUI         | Finder column view navigation       |
| System Share sheet      | Pending | SwiftUI         | Native iOS/macOS sharing            |
| Reminders integration   | Pending | SwiftUI         | @date notation → Reminders          |
| AI organization         | Pending | v3.0.0 + API    | Auto-organize notes                 |
| AI chat with notes      | Pending | Multi-note      | Query across documents              |
| Workspace themes        | Pending | Multi-note      | Different colors per workspace      |

---

## Version Roadmap

### v2.1.4 → v2.2.0: Bug Fixes

**What**: Fix 7 critical bugs blocking polish
**Why**: Can't launch subscription with obvious bugs
**When**: Immediate next work

**Includes:**
- 4 highlighting bugs (inline code, list markers, link URLs)
- Icons consolidation
- iPad scrolling fixes
- YAML highlighting fix

**Strategic reasoning**: These are "table stakes" — users expect text editors to work correctly. Bugs create impression of abandoned/unfinished product.

**Technical approach**: All highlighting bugs likely in `src/theme.ts` cascade order or `src/editor.ts` ViewPlugin logic. Icons are just file consolidation + manifest updates.

### v2.2.0 → v3.0.0: Monetization Ready

**What**: Feature-complete PWA for web app launch
**Why**: Competitive with existing note apps + unique highlighting
**When**: After v2.2.0 bugs fixed

**Includes:**
- Native browser spellcheck
- Paired delimiters
- File operations (open/save .md files)
- Multiple windows
- Intelligent formatting mode
- Light theme

**Strategic reasoning**: 

This version transforms Thot from "interesting prototype" to "viable product." Key insight: serve TWO user segments simultaneously:

1. **Markdown power users** — Developers, writers, technical folks who love semantic highlighting
2. **Normal text editor users** — People who just want to type and format without learning notation

By supporting both, we expand addressable market significantly. File operations make it a "real" editor, not just a scratchpad.

**Market positioning**: "The only text editor with semantic highlighting that works like a normal note app"

**Technical approach**: 

- Spellcheck: Simple attribute toggle
- Paired delimiters: CodeMirror extension (probably exists)
- File operations: File System Access API (research needed)
- Formatting mode: Complex, needs research (possibly custom solution)
- Light theme: Color palette duplication

**Research phase required**: File System Access API and Intelligent Formatting need investigation before creating implementation plans.

### v3.0.0 → v3.1.0: Polish & Export

**What**: Quality of life improvements
**Why**: User feedback and competitive feature parity
**When**: After v3.0.0 launched and user feedback collected

**Includes:**
- Simple export (HTML/PDF)
- Mobile UX improvements
- Settings UI
- Clickable paths/URLs
- Anchor links

**Strategic reasoning**: These are "nice to have" features that improve experience but aren't blocking launch. Export is surprisingly low priority because users can copy/paste for now.

**Technical approach**: All relatively straightforward implementations, no major research needed.

### v3.x.x → v4.0.0: SwiftUI Native Wrapper

**What**: Minimal SwiftUI wrapper for App Store distribution with native OS integration
**Why**: Premium tier that adds value only native apps can provide
**When**: After PWA established and user base exists

**Strategic reasoning**: 

Wait until PWA is proven and monetizing before investing in native wrapper. Why?

1. **Validate demand** — Confirm people will pay before App Store investment
2. **Avoid duplication** — PWA features work on web AND in wrapper
3. **Two revenue streams** — Web subscription + Native app premium
4. **Market positioning** — Web app for everyone, native app for OS integration features

**What SwiftUI adds** (and ONLY what it adds):

**Core wrapper:**
- WKWebView loading PWA
- Native window chrome (traffic lights, title bar)
- Native file picker (enhances File System Access API)

**Native integrations:**
- System Share sheet (share to Mail, Messages, other apps)
- Import from Apple Notes (via Share sheet)
- Reminders/Calendar integration (@date notation → native Reminders)
- Spotlight search integration
- Quick Look preview for .md files

**Platform-specific features:**
- Apple Pencil support (iPad)
  - Handwriting to text conversion
  - Red pen editing mode
  - Standard pen colors (blue, black, red, Sharpie)
- Biometric security (Face ID/Touch ID)
  - Locked notes or sections
  - Privacy for journal entries
- Apple Intelligence Writing Tools (iOS 18+)
  - Proofread, refine, rewrite, summarize
  - Available via right-click in native app only

**What SwiftUI does NOT rebuild**:
- Text editor UI (use PWA)
- Highlighting system (use PWA)
- File operations logic (use PWA, enhance with native picker)
- Multi-note organization UI (build in PWA if possible)

**Technical approach**: Minimal SwiftUI shell around WKWebView with bridges for native features. PWA remains the core product.

**Reference**: See `docs/archive/v4/v4_UPDATE_SWIFTUI.md` for detailed native feature exploration

### v4.0.0 → v4.x.x: Multi-Note Organization

**What**: Transform from single-note editor to multi-note system
**Why**: Competitive with Apple Notes, Google Keep
**When**: After native app launched

**Includes:**
- Multi-note storage and management
- Finder-style column view navigation
- Workspace/project hierarchy
- #tags for organization
- @mentions for linking between notes
- Search across all notes
- "Post-it note" preview cards

**Strategic reasoning**: This is a different product category (note-taking system vs. text editor). Only pursue if single-note editor proves successful. Consider building UI in PWA if performance allows, or in SwiftUI if needed.

### v4.x.x → v5.0.0: AI Integration

**What**: AI-powered organization and interaction
**Why**: Differentiate from traditional note apps
**When**: After multi-note system established

**Includes:**
- AI auto-organization (command: "@ai organize these documents")
- AI chat with notes (query across documents)
- Extract action items
- Summarize long documents
- Workspace-specific themes (AI-customizable)

**Strategic reasoning**: AI features require multi-note foundation. Premium tier feature that justifies subscription cost.

**Technical approach**: Claude Code SDK or similar for AI integration

---

## Parallel Development Tracks

### PWA Track (Primary Focus)

**Current priority**: v2.2.0 → v3.0.0
**Goal**: Feature-complete web app

**Active development:**
- Text editing features
- File operations
- Formatting modes
- Export functionality
- Mobile/tablet optimization

**Why PWA-first**: 
- Reaches widest audience (web, mobile, desktop)
- No app store barriers
- Faster iteration
- Features work in SwiftUI wrapper automatically

### Research Track (Parallel Investigation)

**Current priority**: Prepare for v3.0.0 and beyond
**Goal**: Create exclusively executable plans before implementation

**Active research:**
- File System Access API (blocks v3.0.0)
- Intelligent formatting approaches (blocks v3.0.0)
- Custom highlighting system (enables v4.x user themes)
- Export system architecture (for v3.1.0)

**Why parallel**: Research doesn't block bug fixes. Can investigate while fixing v2.2.0 bugs.

**Process**: Each research track creates its own `docs/plans/research_TOPIC.md` with findings and recommended approach.

### SwiftUI Track (Deferred)

**Current priority**: On hold until PWA ready
**Goal**: Native OS integration, not UI rebuild

**Future work:**
- WKWebView wrapper
- Native file picker
- Share sheet integration
- Reminders/Calendar bridge
- System keyboard shortcuts

**Why deferred**: 
- PWA must be monetization-ready first
- Avoid duplicating work
- Validate market demand before App Store investment

---

## Research Needs & Open Questions

### File System Access API (BLOCKS v3.0.0)

**Must answer before implementation:**

1. Browser support matrix (2026)
   - Chrome/Edge: Supported?
   - Safari desktop: Supported? (added recently)
   - Safari iOS: Supported?
   - Firefox: Status?

2. API capabilities
   - `showOpenFilePicker()` — open file dialog
   - `showSaveFilePicker()` — save as dialog
   - `showDirectoryPicker()` — folder access (for relative paths)
   - Permissions persistence

3. Implementation approach
   - How to track "current file" vs. "scratchpad mode"
   - Auto-save to file vs. localStorage
   - Multiple windows with different files

4. Fallback strategy
   - Download/upload for unsupported browsers
   - Feature detection
   - Graceful degradation

**Research method**: Web search for "File System Access API 2026 browser support", read MDN docs, test in Safari/Chrome

### Intelligent Formatting Mode (BLOCKS v3.0.0)

**Must answer before implementation:**

1. **Technical feasibility**
   - Can CodeMirror hide characters while preserving them?
   - Cursor positioning in hidden ranges?
   - Performance implications?

2. **UX approach**
   - Dual mode (markdown OR visual) vs. Hybrid mode (both simultaneously)?
   - Formatting UI: toolbar, context menu, floating button, keyboard shortcuts?
   - Mobile vs. desktop UX differences?

3. **Implementation complexity**
   - Dual mode: Probably straightforward
   - Hybrid mode: Probably complex but more innovative

4. **User expectations**
   - Do non-markdown users expect WYSIWYG?
   - Or is "notation hidden but present" acceptable?

**Research method**: 
- CodeMirror docs on decorations and hiding text
- Survey existing editors (Typora, iA Writer, Bear)
- Prototype both approaches on test branches

**Strategic recommendation**: Start with Dual Mode (v3.0.0), add Hybrid Mode later (v3.1.0) if demand exists.

### Custom Highlighting System (FUTURE)

**Must answer before implementation:**

1. **Feasibility**
   - How hard is it really? (Probably easier than we think)
   - What are the different approaches?
   - Performance implications for large documents?

2. **Plain text highlighting**
   - How to highlight plain text (non-markdown) semantically?
   - Sentence detection? Paragraph types?
   - User-defined rules?

3. **User-customizable themes**
   - How to make theme editing simple enough for non-technical users?
   - UI for "make headings blue"?
   - Per-workspace themes?

**Research method**: 
- Study TextMate, Monarch, Prism.js architectures
- Prototype simple token-based highlighter
- Test performance on 100K+ line documents

**Strategic note**: This is the "deep dive" you mentioned. Prepare it thoroughly so an agent can execute it later without blocking current work.

### Export System Architecture (MEDIUM PRIORITY)

**Must answer before implementation:**

1. **Typora CSS analysis**
   - Verify: Are these for export or editor highlighting?
   - Location: `docs/archive/v3/typora-app-css-themes/`
   - Can we adapt their approach?

2. **Simplest possible v1**
   - Strip markdown notation (regex or parser?)
   - Apply formatting (bold → `<strong>`, italic → `<em>`)
   - Trigger browser print dialog
   - User saves as PDF

3. **Future enhancements**
   - Beautiful typography (Typora CSS as reference)
   - Export to .docx (library needed?)
   - Custom styling per export

**Research method**: Examine Typora CSS files, prototype simple notation stripper

---

## Consolidated Notes & Ideas

### Text Editing Features (PWA Track)

#### Paired Delimiters (v3.0.0)

**Behavior:**
- Typing `(` inserts `()` with cursor between
- Pairs: `() [] {} '' "" ` ` `
- Typing `)` when cursor before auto-inserted `)` moves cursor past it (skip-over)
- Highlight word + type `(` wraps as `(word)`
- Backspace on `(` deletes both if empty
- Arrow keys work normally (no trap)

**User note**: "I keep accidentally deleting text by highlighting it then trying to add both delimiters with one action"

#### Native Spellcheck (v3.0.0)

**Why needed**: 
- "i need autocorrect back on" (iPad testing)
- "all my starts to sentences are not capitalized and my i's are lowercase"
- "words that are ALMOST right it doesn't fix"

**Implementation**: Enable browser's native spellcheck
- Respects system preferences
- Works on desktop, iPad, mobile
- Toggle on/off via menu or settings

**Previous confusion**: We thought this required SwiftUI wrapper, but browser spellcheck is a web feature. Native *system-level* autocorrect (with prediction bar) is different, but basic spellcheck works in PWA.

#### Bottom Padding Auto-Grow (v3.1.0)

**User note**: "when writing on the last line, can we make it so that it automatically has a buffer?"

**Behavior:**
- When cursor is near bottom of viewport, incrementally add padding
- Grows gradually so it's almost unnoticeable
- Prevents text from being cramped against screen edge
- Black padding blends with background

**Reference**: "i should look at how google docs handles this first"

#### Max Line Width Setting (v3.1.0)

**User note**: "the font at 12pt makes crossing a really wide screen sort of strange"

**Implementation**: 
- Setting to limit line width (e.g., 80ch, 100ch, unlimited)
- Center content on wide screens
- Simple on/off switch in settings

#### Left Padding for Line Numbers (v3.1.0)

**User note**: "We need padding on the left side of the screen that accounts for the increase in line numbering taking up more width space because when it increases it is jarring"

**Issue**: When line numbers go from 99 → 100, gutter width changes abruptly

**Solution**: Fixed-width gutter or smooth transition

### Highlighting System (Research Track)

#### Current System Understanding Needed

**User note**: "I would like to understand the system, and other systems, because I have a feeling I could come up with a modern, more sensible version"

**Questions to document:**

1. How does our current system work?
   - styleTags vs. ViewPlugin
   - CSS cascade priority
   - Depth-based rules
   - "BLEND" vs. "FULL" override terminology

2. How do other systems work?
   - TextMate grammar
   - Monarch (VS Code)
   - What terminology do they use? (tags, labels, scopes)

3. What are the limitations?
   - Why is context-dependent styling hard?
   - Why can't we easily differentiate delimiter color from content?

4. What would a better system look like?
   - Simpler priority rules
   - Easier to explain
   - Full control for user customization

**Deliverable**: `docs/plans/research_highlighting_systems.md` with:
- Glossary of terms (tags, scopes, tokens, etc.)
- Comparison of existing systems
- Analysis of our current system
- Proposed modern alternative
- Multiple implementation approaches on test branches

#### Nested Emphasis Behavior

**User note**: "When a **BOLD** word is in a line of italics both work, but **when there is *italic words in bold like these* then the bold overrides the italic** and we don't want that"

**Current behavior**: Bold overrides italic
**Desired behavior**: Both should apply (bold + italic = ExtraBoldItalic 800i)

**Priority**: Medium (not blocking, but would be nice)

#### Highlighting for Plain Text (Future)

**User note**: "i think the UI organization and the semantic highlighting is rad enough to draw people in who don't even know about markdown; i don't want to get limited by markdown at all"

**Vision**: Semantic highlighting for plain text (non-markdown) documents

**Questions:**
- How to identify "types" of text in plain documents?
- Sentence detection? Paragraph types?
- User-defined rules?
- AI-assisted categorization?

**Strategic note**: This requires custom highlighting system. Current CodeMirror/Lezer is markdown-specific.

**Why this matters**: "i have trouble reading big documents, but when types of chunks of text are visually identified by color it somehow creates a cognitive load easing which is what all good design should be trying to do"

### File Operations (v3.0.0 — HIGH Priority)

#### Open/Save Markdown Files

**Why critical**: "i could work on spec planning in my app on the go without an IDE!"

**Features needed:**
1. Open existing .md files
2. Save as new file
3. Auto-save to currently open file
4. File name in title bar/window

**Strategic note**: This is "table stakes for normal users" — transforms from scratchpad to actual editor.

#### Multiple Windows

**User note**: "I'm already ready to have multiple windows and/or tabs"

**Implementation approach:**
- CMD+N opens new window (not duplicate of current)
- Each window has own localStorage key or tracks open file
- BroadcastChannel for sync? (research needed)

**Why important**: Normal text editors have this; absence feels limiting.

### Intelligent Formatting Mode (v3.0.0 — HIGH Priority)

#### User Experience Vision

**User note**: "if they don't know what markdown is, i guarantee they don't know what RTF is and barely know what TXT is. they'd recognize .doc and .docx from childhood is all... all they care is that it opens and they can type the way they want"

**Key insight**: Don't call it "RTF mode" or "Markdown mode" — just let users format text however they want.

**Behavior:**
- Highlight text → formatting options appear (bold, italic, list, etc.)
- Click bold → text becomes bold
- Behind the scenes: markdown notation added
- Optional: hide notation, show formatted result
- Markdown users can still type notation directly

**UI Approaches:**

1. **Toolbar** (traditional)
   - Always visible at top
   - Standard buttons (B, I, U, etc.)
   - Pro: Familiar
   - Con: Takes up space

2. **Context menu** (right-click)
   - Appears on text selection
   - Pro: Hidden until needed
   - Con: Not discoverable on mobile

3. **Floating button** (innovative)
   - Transparent dot that stays out of cursor's way
   - Tap/click to open formatting menu
   - Can be positioned manually
   - Pro: Works on mobile, novel UX
   - Con: Needs smart positioning logic

4. **Keyboard shortcuts only** (power users)
   - CMD+B for bold, CMD+I for italic, etc.
   - Pro: Fast, no UI clutter
   - Con: Not discoverable for normal users

**Strategic recommendation**: Start with #2 (context menu) for v3.0.0, add #3 (floating button) for mobile in v3.1.0.

#### Notation Visibility Toggle

**Two modes:**

1. **Notation visible** (markdown users)
   - See `**bold**` with semantic highlighting
   - Type notation directly

2. **Notation hidden** (visual users)
   - See bold text without `**`
   - Use formatting UI
   - Notation still in document (for export, compatibility)

**Technical challenge**: How to hide characters in CodeMirror while preserving cursor positioning?

**Research needed**: CodeMirror decoration system, cursor position mapping

### Export Features (v3.1.0 — MEDIUM Priority)

#### Simple Export v1

**User note**: "bold markers? remove them and make the text bold. done. lol"

**Approach:**
1. Parse markdown (we already have Lezer tree)
2. Strip notation (`**bold**` → `bold`)
3. Apply HTML formatting (`<strong>bold</strong>`)
4. Open in new window with CSS
5. User triggers browser print → saves as PDF

**Why this is enough**: Users just need to get their text out. Beautiful typography can come later.

#### Typora CSS Themes Reference

**Location**: `docs/archive/v3/typora-app-css-themes/`

**Research needed**: 
- Are these for editor highlighting or export?
- Can we adapt for our export system?

**User note**: "Be careful with the 'Those Typora CSS themes' because i think they also have highlighting of the markdown too, not just the exported pdf"

**Action**: Examine files to determine what's applicable to export vs. editor

### Mobile/Tablet UX (v3.1.0 — MEDIUM Priority)

#### iPad Scrolling Issues (v2.2.0 — CRITICAL)

**Issues from testing:**

1. "document goes below the fold, out of the bottom of the screen"
2. "when i pulled down to see the top of the document it kept stopping at line 4"
3. "it only showed me the rest of the contents when i clicked into the text area"
4. "happens to the bottom even when i still have an active cursor in the document"

**Likely cause**: iOS Safari viewport calculation, touch event handling

**Files to check**: `index.html` (viewport meta tag), `src/theme.ts` (height/overflow CSS)

#### Predictive Text Bar

**User note**: "there is a weird form field with check mark above the keyboard"

**Issue**: iOS showing form autocomplete UI

**Research needed**: How to disable form autocomplete while keeping spellcheck?

#### PWA Display Mode Differences

**Observations:**
- iOS: Opens with no UI buttons, no URL bar (standalone mode)
- iPadOS: Opens in normal browser window

**Questions:**
- Can we control this behavior?
- How much control do we have?
- Should iOS have share buttons? (user wants them)

**Research needed**: PWA display modes, iOS standalone customization

#### YAML Highlighting Bug (v2.2.0 — CRITICAL)

**User note**: "What is this weird behavior with adding hyphens after text at the top of the page?"

**Behavior:**
1. Write numbered list
2. Delete number, add hyphen
3. Text above hyphen turns heading color
4. Only happens after numbered list, not after headings
5. Goes away when character added after hyphen

**Likely cause**: YAML frontmatter detection (three hyphens at document start)

**Fix needed**: YAML rules should only apply at document start, not after list items

### Settings & Preferences UI (v3.1.0)

**Settings to expose:**

**View toggles:**
- Toggle spellcheck (CMD+Shift+C)
- Toggle line numbers (CMD+Shift+L)
- Toggle word count (CMD+Shift+W)
- Toggle character count (CMD+Shift+C)
- Toggle token count (CMD+Shift+T)

**Appearance:**
- Theme (light/dark)
- Font size
- Line height
- Max line width (for wide screens)

**Behavior:**
- Paired delimiters (on/off)
- Clickable paths/URLs (on/off)
- Auto-save interval

**Implementation**: Settings panel (modal) with keyboard shortcut to open (CMD+,)

### Clickable Elements (v3.1.0)

#### Clickable Paths

**User note**: "Make paths clickable"

**Behavior:**
- File paths become clickable links
- Opens file in new window (if File System Access API available)
- Setting to enable/disable
- Directory access permission needed
- Relative paths supported for allowed directories

#### Clickable URLs

**User note**: "URLs aren't yet clickable"

**Current state**: URLs are styled (cyan) but not clickable

**Implementation**: Click handler on URL tokens, opens in new tab

#### Anchor Links to Headings

**User note**: "Ah, I really wish that anchor links to the headings worked too because these docs get so long"

**Behavior:**
- Click heading → copy anchor link
- Paste anchor link → click to jump to heading
- Useful for long documents

### Undo/Redo Issue (v2.2.0?)

**User note**: "Wtf hitting ctrl-z doesn't undo my deletion of the full page!!"

**Investigation needed**: 
- Is this a CodeMirror history issue?
- iOS-specific?
- Reproducible on desktop?

**Priority**: Critical if reproducible, otherwise defer

### Airdrop/Share Behavior (Future)

**User note**: "sharing this to desktop using airdrop doesn't send content. this makes sense for the current build but is something we'll need to be aware of and manage gracefully for future builds"

**Idea**: If document has `# Title`, prompt "Do you want to share '# Title' or a blank notepad"

**Priority**: Low, only relevant after multi-note support

---

## Consolidated Notes & Ideas

### UX Observations from iPad Testing

**Positive:**
- "i'm loving it on my ipad"
- Highlighting looks good on mobile
- PWA install works

**Issues:**
- Scrolling doesn't reach top/bottom on initial load
- No autocorrect/capitalization
- Weird form field above keyboard
- Text cramped at bottom when typing on last line
- YAML highlighting bug after numbered lists

**Strategic insight**: iPad is more important than iPhone for this use case. Prioritize tablet UX.

### Design Philosophy

**From Project Vision section:**

"The organization of Finder column view + the convenience of Apple Notes + the flexibility of markdown + the document exports of Google Docs + the cognitive load easing nature of syntax highlighting."

**Core principles:**
- Edit = product (no "shell app" feeling)
- Semantic calm (expressive but not noisy)
- Frictionless entry (open, type, done)
- Cognitive load reduction through visual differentiation

**User insight**: "when types of chunks of text are visually identified by color it somehow creates a cognitive load easing which is what all good design should be trying to do: lessen cognitive load"

### Monetization Strategy

**Current situation**: 
- Saw competitor showing interest
- Need cash (client ghosted)
- App Store costs $100
- Want to validate demand first

**Recommended path:**

1. **v2.2.0** — Fix bugs (free, build credibility)
2. **v3.0.0** — Launch web app with free tier
   - Free: Single scratchpad, localStorage only
   - Paid ($3-5/mo): File operations, multiple windows, export
3. **v4.0.0** — Launch native app (after user base exists)
   - One-time purchase ($10-15) or premium tier ($8-10/mo)
   - Includes native OS integration features

**Strategic advantage**: Two revenue streams, validate demand before App Store investment, web app reaches wider audience.

### Feature Ideas (Unsorted)

**From various notes:**

- Predictive text for math (e.g., "10+12=" suggests "22") — like TextEdit
- Smart floating button for mobile formatting (stays out of way automatically)
- Workspace-specific themes (different colors per project)
- AI organization via command (e.g., "@ai please organize these documents")
- Title auto-detection from first `# Heading`
- Share sheet integration (native only)
- Speech-to-text input (native only)
- Haptic feedback (iPad, native only)
- @date notation → Reminders (native only)
- Search across all notes (multi-note feature)
- #tags and @mentions for linking (multi-note feature)

### Renaming Consideration

**User note**: "How complicated would it be to change the product name to 'thots'"

**Considerations:**
- Lowercase "thots" for stylistic use
- "Thot" for formal documentation
- Or just fix everywhere to "thots"

**Decision**: Defer until after v3.0.0 launch. Renaming affects:
- Package.json name
- Domain name (thots.august.style already set)
- Documentation
- Marketing materials

**Recommendation**: Use "thots" everywhere (lowercase in casual, "Thots" in formal). Simpler than dual naming.

### SwiftUI Wrapper Scope

**What SwiftUI adds** (and ONLY what it adds):
- Native window chrome
- System file picker (replaces File System Access API)
- Share sheet integration
- Reminders/Calendar integration
- System-level keyboard shortcuts
- Spotlight search integration
- Quick Look preview

**What SwiftUI does NOT rebuild**:
- Text editor UI (use PWA)
- Highlighting system (use PWA)
- File operations logic (use PWA, just enhance with native picker)

**Strategic note**: "I think it makes the most sense to offer things that can only be offered with swiftui native integration because that adds distinct value that the web app can't have"

### Multi-Note Organization (v4.x)

**Vision**: Finder column view style navigation

**Hierarchy:**
- Workspace level (e.g., "Life", "Work", "School")
- Project level (folders)
- Note level (individual documents)
- "Post-it note" style preview cards at each level

**Terminology question**: "What are other terminologies for this kind of UI?"

**User note**: "I'd like it to be broader than 'Projects'; I'd like 'workspaces' to make more sense for things like 'life' and 'work' and 'school'; I'd like to be able to drill down more than two levels"

**Research needed**: 
- Standard terminology for hierarchical note organization
- How other apps handle this (Notion, Obsidian, Apple Notes)

### AI Features (v4.x)

#### AI Organization

**User note**: "I would love to be able to go @ai please organize these documents"

**Vision**: UX is using a single desk pad sheet, AI organizes everything into notebook

**Implementation**: Claude Code SDK integration

**Features:**
- Auto-organize notes by topic
- Extract action items
- Summarize long documents
- Chat with your notes

**Strategic note**: "With Claude Code SDK how complicated would it be to create a version with that functionality? I'm trying to think of a really strong first version release where i could charge for a tier"

**Recommendation**: This is premium tier feature for v4.0.0+. Requires multi-note support first.

### Menu Structure (SwiftUI — v4.0.0)

**From notes:**

**App menu:**
- About Thot
- Check for updates...
- Settings (CMD+,)
- Quit Thot (CMD+Q)

**File menu:**
- New Window (CMD+N)
- New Workspace (CMD+Shift+N)
- Close (CMD+W)
- Save (CMD+S)
- Import from iPhone or iPad
- Export (CMD+E)
- Share to...
- Print (CMD+P)

**Edit menu:**
- Standard: Undo, Redo, Cut, Copy, Paste, Select All
- Find (CMD+F)
- Replace (CMD+Shift+F)

**View menu:**
- Toggle spellcheck (CMD+Shift+C)
- Toggle line numbers (CMD+Shift+L)
- Toggle word count (CMD+Shift+W)
- Toggle character count (CMD+Shift+C)
- Toggle token count (CMD+Shift+T)

**Format menu:**
- Heading 1-6 (CMD+H+1 through CMD+H+6)
- Italic (CMD+I)
- Bold (CMD+B)
- Bulleted List (CMD+Shift+7)
- Dashed List (CMD+Shift+8)
- Numbered List (CMD+Shift+9)
- Block Quote (CMD+Shift+.)
- Checklist (CMD+Shift+L)
- Mark as Checked (CMD+Shift+U)
- Table (CMD+Shift+T)

**Note**: Some of these keyboard shortcuts conflict (CMD+Shift+C, CMD+Shift+L, CMD+Shift+T). Need to resolve before implementation.

---

## Project Vision

**Elevator pitch**: "The organization of Finder column view + the convenience of Apple Notes + the flexibility of markdown + the document exports of Google Docs + the cognitive load easing nature of syntax highlighting."

**User-friendly notes app that you actually want to use:**

- Persistent, always-on writing tool; scratchpad that meets you where you are
- Markdown with fully tunable syntax highlighting
- Innovative rich text formatting interface
- Auto-saves with cursor and scroll position preserved
- Natural drill-down note organization from high level to small
- Task note organization modeled after Finder column view
- 'Post-it Note' style cards visible at each level

**Design principles:**
- Build AI-ready modularity into codebase at every turn
- Under the hood, editor is real .md or .rtf file, that's it
- Future features build around this file, not replace it
- Editor surface IS the product (no "shell app" feeling)
- Semantic calm (expressive but not noisy, easy to scan)
- Prioritize feel of typing and reading over features
- Prioritize communicating and gathering knowledge over hunting and organizing
- Frictionless entry (open, type, done — no modals, no "New document" prompts)

---

## Next Steps

### Immediate (This Week)

1. **Fix v2.2.0 bugs** — 9 critical issues (5 highlighting + icons + iPad scrolling + YAML + undo/redo)
2. **Research File System Access API** — Browser support, implementation approach
3. **Research Intelligent Formatting** — Technical feasibility, UX approach

### Short Term (This Month)

1. **Complete v3.0.0 implementation plans** — After research complete
2. **Begin parallel development** — Multiple features on separate branches
3. **Launch web app beta** — Free tier for testing

### Medium Term (Next Quarter)

1. **Launch web app subscription** — Paid tier with file operations
2. **Collect user feedback** — Validate features, identify gaps
3. **Plan SwiftUI wrapper** — Only after PWA proven

---

## Document Maintenance

**How to use this document:**

- **Product manager view** — Understand overall strategy and priorities
- **Agent assignment** — Pick a specific update, create detailed implementation plan in `docs/plans/`
- **Progress tracking** — Update status as features complete
- **Strategic decisions** — Document reasoning for major changes

**When to update:**

- Feature completed → Mark status, move to archive
- New idea → Add to appropriate priority tier
- Research complete → Update research section with findings
- Strategy changes → Update roadmap with reasoning

**Related documentation:**
- `docs/THOT_APP.md` — Current project reference (update for architecture changes)
- `docs/plans/` — Feature-specific implementation plans
- `docs/archive/v2/` — Historical update logs
- `docs/archive/v3/` — Future update logs

---

## Future Vision (v5.0+)

**Note**: These are "dream big" ideas that are way out there — potentially v12 someday. They're captured here for inspiration but not actively planned.

### Live Activities & Widgets

**Potential**: Extend "post-it" preview concept to Lock Screen, Home Screen, Dynamic Island

**Ideas:**
- Interactive journal prompts when you get home
- Different "schemas" or vibes (therapy, creative writing, memoir)
- Glanceable data on Lock Screen
- Home Screen widgets showing recent notes
- Dynamic Island integration for quick capture

**Strategic note**: This has real potential for differentiation. Live Activities are uniquely native and could make note-taking more ambient/contextual.

### Apple Watch Integration

**Concept**: Voice-to-text note capture on the go

**Features:**
- Record voice messages → WhisperAI → text
- Automatic meeting notes (Watch listens, transcribes)
- Quick capture button on Watch
- Sync to main app automatically

**Strategic note**: Most apps don't think about Watch integration — huge missed opportunity for note-taking use case.

### Spatial Computing (visionOS)

**Vision**: Immersive writing environments

**Ideas:**
- "Go to the beach to write"
- "Sit under a tree and draw"
- 3D elements, volumetric windows
- RealityKit integration
- Development environment in visionOS

**Strategic note**: Keep on radar. visionOS is early but could be compelling for focused writing experiences.

### Advanced AI Integration Scopes

**Specialized AI assistants for different use cases:**

**Memoir Assistant/Journal Buddy:**
- Prompts and guidance for personal writing
- Memory organization
- Timeline generation

**SEO Buddy:**
- Type headline → get SEO keywords
- Paste image → generate caption
- Include caption → generate hashtags

**Completion Tasks:**
- Auto-formatting for specific content types (recipes, meeting notes, etc.)
- Paste basics → AI cleans up and formats
- Export to appropriate destination

**Meditation Buddy:**
- Guided journaling prompts
- Reflection exercises
- Mood tracking

### Notion Integration

**Concept**: Use Thot as "pre-planning" space, send to Notion when ready to organize

**Why**: "Taking notes in Notion sucks there's no 'draftpad' vibe it forces organization"

**Implementation**: 
- Thot = freeform thinking space
- Export to Notion when ready to organize
- Use Notion API for seamless integration

**Strategic note**: "How can you win over the Notion cult?" — This could be the answer.

### Social Media & Automation Features

**Ideas:**
- Social media post scheduling
- Integrated grocery list management
- Auto-formatting for specific content types
- Export to various platforms

**Strategic note**: Jump over the automation step and offer popular features directly.

### Apple Wallet Integration

**Wild idea**: "How cool would it be to be the person who made it normal to buy things from your notes app"

**Possibilities:**
- LLM token purchases
- Premium feature unlocks
- Subscription management

### MCP Server Integration

**Concept**: Where Apple restricts API access, use MCP tools as bridges

**Example**: Access Apple Notes data via local server-side scripting that bridges AI models and desktop Notes app

**Strategic note**: Future-proof by including MCP integration rather than relying on external tools.

### Advanced Formatting Features

**Tab-style auto-formatting** (like Cursor/Anti-Gravity):
- Format entire 10-page document with styles in minutes
- Google Docs users don't know this is possible
- Bring this UX to note-taking

**Recipe formatting:**
- Paste recipe basics
- AI cleans up and formats beautifully
- Export to recipe app of choice

### Push Notifications & Background Processing

**Native app benefits:**
- Reliable push notifications (without browser dependence)
- Background syncing
- Location-based prompts (e.g., "You're home, time to journal")

**Strategic note**: PWA notifications are unreliable. Native app makes this viable.

### Platform-Specific UI Components

**SwiftUI-exclusive features:**
- NavigationSplitView for iPad/Mac
- Material backgrounds
- SwiftCharts for data visualization
- Custom haptic feedback (Taptic Engine)
- System-level animations ("signature Apple feel")

---

*This document is the strategic roadmap for Thot development. It provides high-level organization and priority tracking. Detailed implementation plans live in `docs/plans/` to keep agent context focused.*
