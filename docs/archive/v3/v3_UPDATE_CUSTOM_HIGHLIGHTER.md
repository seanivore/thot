# v3.0.0: Custom Highlighting System & Intelligent Formatting UI

**Branch**: `v3-rainbow-moat`
**Status**: Research & Planning Phase
**Updated**: 2026-02-20

---

## Executive Summary

**What**: Build custom highlighting system from scratch for markdown AND plain text, with intelligent formatting UI

**Why**: Current CodeMirror/Lezer system is overcomplicated, fragile, and impossible to extend for user-customizable themes or plain text highlighting

**Strategic Importance**: 
- This IS the moat — semantic highlighting for plain text that nobody else does
- Enables user-customizable themes (future revenue feature)
- Makes formatting UI possible (hide notation, show formatting)
- Serves both markdown power users AND normal text editor users

---

## Table of Contents

1. [The Problem: Current System Complexity](#the-problem-current-system-complexity)
2. [The Vision: Simple Custom System](#the-vision-simple-custom-system)
3. [Research Phase](#research-phase)
4. [Implementation Approach](#implementation-approach)
5. [Formatting UI Research](#formatting-ui-research)
6. [Success Criteria](#success-criteria)
7. [Rollback Plan](#rollback-plan)

---

## The Problem: Current System Complexity

### What We Discovered

**Investigation findings** (2026-02-20):

The current highlighting system requires coordination across multiple systems:

1. **Custom tags defined** in `src/highlight-tags.ts`:
   - `bulletMarkTag`, `orderedMarkTag` (for markers)
   - `bulletContentTag`, `orderedContentTag` (for content)
   - Only content tags are imported into `editor.ts` — marker tags are NEVER USED

2. **Decorations created** in `src/editor.ts` (lines 48-50):
   - `bulletMarkDeco` uses `colors.bulletMarker`
   - `numberMarkDeco` uses `colors.numberedMarker`
   - `inlineCodeMarkDeco` uses `colors.inlineCode`
   - Applied via inline styles (highest CSS specificity)

3. **ViewPlugin manually applies** decorations (lines 52-126):
   - Walks syntax tree for visible ranges
   - Tracks list context via stack
   - Applies decorations based on parent context
   - This is a WORKAROUND for Lezer's depth-based rule system

4. **styleTags** in `editor.ts` (lines 156-194):
   - Simple marker overrides (HeaderMark, QuoteMark, etc.)
   - Inherit rules for content (BulletList/..., OrderedList/...)
   - Uses content tags but not marker tags

5. **HighlightStyle** in `src/theme.ts`:
   - Maps all tags to colors
   - CSS cascade order matters (low priority first, high priority last)
   - Must coordinate with ViewPlugin inline styles

### The Disconnect

**Quote from investigation**:
> "WHY ALIAS IN THE FIRST PLACE? CAN THE COLOR NOT BE THE CONST? AND THEN, I JUST SEARCHED, AND THE CONTENT TAGS AKA THE WORKING COLORS, ARE NOT MENTIONED ANYWHERE EXCEPT THE ONE, SIMPLE src/highlight-tag.ts DOCUMENT. MEANWHILE, NO IDEA WHY AFTER THE CONST AND COLOR ARE CONNECTED IN THE CODE WE HAVE TO LATER BUILD A markerDecorations AT ALL."

**The issue**:
- Define custom tags → don't use them
- Import content tags → but markers are the problem
- Create decorations → apply via ViewPlugin workaround
- Also use styleTags → different system
- Also use HighlightStyle → third system
- CSS cascade ordering matters
- Extension ordering matters

**It's a house of cards.**

### Why This Blocks Everything

1. **User-customizable themes**: Impossible to build UI for this complexity
2. **Plain text highlighting**: Can't extend Lezer markdown parser to plain text
3. **Formatting UI**: Can't hide notation without understanding the system
4. **Maintenance**: Every bug fix is a minefield
5. **Future features**: Any highlighting change requires understanding 3+ systems

### Current Bugs Caused by This Complexity

1. Inline code tick marks don't match content color
2. Bullet markers infected by content color (gold → cyan)
3. Numbered markers infected by content color (red → pink)
4. Link URLs not differentiating from link text
5. Nested emphasis doesn't work (italic in bold fails)

**Decision**: Don't fix these bugs in the current system. Build new system instead.

---

## The Vision: Simple Custom System

### What We Want

**Quote from investigation**:
> "I WANT TO USE CODE TO DEFINE CHARACTER PATTERNS, GIVE THAT TAG ONE NAME, DEFINE THE COLOR. NOTHING MORE. NO MULTIPLE PLUGINS AND FILES AND CSS STUFF. JUST NAMES AND A PRIORITY LIST"

### The Ideal System

```
Pattern → Scope → Color → Priority
```

**That's it.**

### Terminology: Scopes (Not Tags)

Using "scopes" terminology (like TextMate) instead of "tags" because:
- It's the standard terminology
- TextMate's system is well-understood
- Easier to explain to users

### TextMate-Style Priority

**From TextMate reference** (see `docs/archive/v1/TextMateRules.md`):

Scopes that override others are placed "on top" in the list. This is intuitive:
- Top of list = highest priority
- Bottom of list = lowest priority
- Later scopes override earlier ones

**Example**:
```
1. strikethrough (highest priority - always wins)
2. inline-code (overrides everything except strikethrough)
3. bold
4. italic
5. list-content
6. foreground (lowest priority - fallback)
```

### Combo Scopes

**User note**: "i like how textmaterules works where it puts the one that 'overrides' on top of the other one it is part of -- it allows you to define combo scopes"

**Example**: Strikethrough mixes formatting (line-through) and color in weird ways
- Can apply to bold text
- Can apply to italic text
- Can apply to list items
- Needs special handling

**Solution**: Define combo scopes explicitly:
- `bold.strikethrough`
- `italic.strikethrough`
- `list.strikethrough`

### What This Enables

1. **User-customizable themes**
   - Simple UI: "Make headings blue"
   - Just change the color in the scope list
   - No understanding of CSS cascade or ViewPlugins needed

2. **Plain text highlighting**
   - Define scopes for plain text elements
   - Sentence types, paragraph types, etc.
   - Same system, different patterns

3. **Formatting UI**
   - Hide notation by removing scope decorations
   - Show formatting by applying styles
   - Toggle between modes easily

4. **Workspace-specific themes**
   - Different color schemes per workspace
   - Just swap the scope color list
   - Future premium feature

---

## Research Phase

### Questions to Answer

#### 1. How Do Other Systems Work?

**Systems to study:**

- **TextMate** (see `docs/archive/v1/TextMateRules.md`)
  - Scope-based system
  - Priority via ordering
  - Combo scopes supported
  - How do they handle patterns?

- **Prism.js**
  - Token-based highlighting
  - Regex patterns
  - Simple priority system
  - Performance characteristics?

- **Monarch** (VS Code)
  - State machine approach
  - How complex is it?
  - Why did VS Code choose this?

- **highlight.js**
  - Auto-detection
  - Language definitions
  - Relevant for code blocks?

- **Custom solutions**
  - What have other apps built?
  - Typora, iA Writer, Bear
  - How do they handle highlighting?

**Deliverable**: Comparison matrix with pros/cons/complexity

#### 2. What Are the Different Approaches?

**Approach A: Pure Regex + Decoration**
- Define regex patterns for each scope
- Walk document, apply decorations
- Simple priority list
- No parser needed

**Approach B: Lezer Parser + Custom Styling**
- Keep Lezer for markdown structure
- Build simple decoration layer on top
- Single-pass tree walk
- Direct color application

**Approach C: Custom Parser + Styling**
- Build lightweight markdown parser
- Combined parsing and styling
- Full control, more work

**Approach D: Hybrid**
- Use Lezer for structure
- Use regex for plain text
- Unified decoration system

**Deliverable**: Prototype each on test branches, measure complexity and performance

#### 3. How to Handle Plain Text?

**Questions:**
- What are the "scopes" in plain text?
- Sentence types? (declarative, question, exclamation)
- Paragraph types? (heading-like, body, list-like)
- User-defined patterns?
- AI-assisted categorization?

**Approach ideas:**

**Pattern-based:**
- Lines ending with `:` → heading-like (gold)
- Lines starting with `-` or `*` → list-like (cyan)
- ALL CAPS → emphasis (yellow)
- Lines ending with `?` → question (purple)
- Indented text → sub-content (different color)

**Semantic-based:**
- First line of paragraph → topic sentence (bold)
- Short lines (< 50 chars) → heading-like
- Long paragraphs → body text
- Repeated patterns → lists

**User-defined:**
- Let users define their own patterns
- "Color lines starting with 'TODO:' red"
- Simple regex or keyword matching

**Deliverable**: Prototype plain text highlighting with 2-3 approaches

#### 4. How to Build the Simplest Possible System?

**Core requirements:**
1. Define patterns (regex or tree nodes)
2. Assign scopes (names)
3. Assign colors (hex values)
4. Set priority (ordered list)
5. Apply to visible text only (performance)

**Implementation sketch:**

```typescript
// Simple scope definition
interface Scope {
  name: string           // e.g., "heading", "bold", "inline-code"
  pattern: RegExp | TreePattern
  color: string          // hex color
  fontWeight?: number
  fontStyle?: 'italic'
  priority: number       // higher = wins in conflicts
}

// Priority list (highest first)
const scopes: Scope[] = [
  { name: 'strikethrough', pattern: /~~.*?~~/g, color: '#6272A4', priority: 100 },
  { name: 'inline-code', pattern: /`.*?`/g, color: '#F34D3E', priority: 90 },
  { name: 'bold', pattern: /\*\*.*?\*\*/g, color: '#FFD866', priority: 80 },
  // ... etc
]

// Apply decorations
function applyHighlighting(doc: string): Decoration[] {
  const decorations = []
  for (const scope of scopes) {
    // Find matches
    // Create decorations
    // Higher priority overwrites lower
  }
  return decorations
}
```

**Questions to answer:**
- Performance for large documents?
- How to handle overlapping patterns?
- How to handle nested patterns (bold inside italic)?
- CodeMirror integration approach?

**Deliverable**: Working prototype with 10-15 scopes

#### 5. How to Handle Combo Scopes?

**Examples:**
- Bold + italic = ExtraBoldItalic (800i)
- Bold + strikethrough = bold color + line-through
- Italic + strikethrough = italic color + line-through

**Approach ideas:**

**Explicit combo definitions:**
```typescript
{ name: 'bold.italic', pattern: /\*\*\*.*?\*\*\*/g, color: '#FFD866', fontStyle: 'italic', fontWeight: 800 }
```

**Priority-based merging:**
```typescript
// When bold and italic overlap, merge their styles
// Higher priority scope provides color
// Both provide font styles
```

**TextMate-style inheritance:**
```typescript
// Scope hierarchy
'text.markdown.bold.italic'
// Matches rules for: text, markdown, bold, italic
// Most specific wins
```

**Deliverable**: Recommendation with examples

---

## Implementation Approach

### Phase 1: Research (Current)

**Timeline**: Until research complete
**Deliverable**: This document with findings and recommended approach

**Tasks:**
1. Study TextMate, Prism.js, Monarch, highlight.js
2. Prototype 3-4 approaches on test branches
3. Test performance on large documents (100K+ lines)
4. Compare complexity, maintainability, extensibility
5. Recommend approach with reasoning

### Phase 2: Core System Implementation

**Timeline**: After research approved
**Deliverable**: Working custom highlighter for markdown

**Tasks:**
1. Build core highlighting engine
2. Define all markdown scopes
3. Implement priority system
4. Replace current system in `src/editor.ts`
5. Test all markdown elements
6. Verify performance

**Files to create/modify:**
- `src/highlighter.ts` (new - core engine)
- `src/scopes.ts` (new - scope definitions)
- `src/editor.ts` (modify - remove old system, integrate new)
- `src/theme.ts` (simplify - may not need HighlightStyle anymore)
- `src/highlight-tags.ts` (delete or repurpose)

### Phase 3: Plain Text Support

**Timeline**: After markdown working
**Deliverable**: Highlighting for plain text documents

**Tasks:**
1. Define plain text scopes
2. Implement pattern detection
3. Test with various plain text documents
4. Refine patterns based on testing

**New scopes to define:**
- Heading-like lines (short, ends with `:`)
- List-like lines (starts with `-`, `*`, `•`)
- Emphasis (ALL CAPS, "quoted text")
- Questions (ends with `?`)
- Indented content (sub-items)

### Phase 4: Mode Detection

**Timeline**: After plain text working
**Deliverable**: Auto-detect markdown vs plain text mode

**Tasks:**
1. Heuristics for mode detection
2. User override option (force markdown/plain text mode)
3. Smooth transition between modes

**Detection heuristics:**
- If document has `# headings`, `**bold**`, `[links]()` → markdown mode
- If document is plain text → plain text mode
- User can override via setting

---

## Formatting UI Research

**Note**: This is research only for v3.0.0. Implementation will be separate update (v3.1.0 or later).

### UI Concepts to Explore

#### 1. Floating Touch Shortcut (Adobe Fresco-style)

**Concept**: Circular button that stays out of typing path automatically

**Behavior:**
- Floats in corner (default: bottom-left)
- Auto-moves away from cursor as you type
- Can be manually positioned (drag and drop)
- Tap → opens formatting menu
- Context-aware: Different options based on mode

**Research questions:**
- Auto-positioning algorithm (stay away from cursor)
- Manual positioning (drag, snap to edges/corners)
- Menu layout (radial, list, grid)
- Animation/transitions
- Mobile vs desktop differences

**Strategic advantage**: Novel UI that works on mobile AND desktop

#### 2. Selection Context Menu (Notion-style)

**Concept**: Small popup when text is highlighted

**Behavior:**
- Highlight text → popup appears above selection
- Quick format buttons: B, I, H1, H2, List, etc.
- Keyboard shortcuts prominently displayed on buttons
- Click button OR press shortcut
- Disappears when selection cleared

**Research questions:**
- Positioning (above/below selection, avoid viewport edges)
- Button selection (which formats to show)
- Keyboard shortcut display design
- Mobile touch behavior

**Strategic advantage**: Teaches keyboard shortcuts while providing visual option

#### 3. Context-Aware Options

**Concept**: Menu adapts to how user is writing

**Markdown mode:**
- Show: "Add heading", "Make bold", "Create link"
- Clicking applies markdown notation
- Notation stays visible (or can be hidden)

**Plain text mode:**
- Show: "Highlight as heading", "Highlight as emphasis"
- Clicking applies color without notation
- Pure visual formatting

**Mixed mode:**
- Detect what user is doing
- Offer both options
- Learn user preference over time

**Research questions:**
- How to detect user's mode preference?
- Should modes be explicit or automatic?
- Can users switch mid-document?

#### 4. Keyboard-First Design

**Philosophy**: "Reinventing the formatting toolbar as keyboard-first"

**Approach:**
- Shortcuts are PRIMARY interface
- Visual buttons are SECONDARY (for discovery)
- Buttons show shortcuts prominently
- After using button once, user learns shortcut

**Example button design:**
```
[  B  ]
 ⌘+B
```

**Research questions:**
- Button layout that emphasizes shortcuts
- Progressive disclosure (show more shortcuts as user learns)
- Shortcut conflicts (some overlap in current menu plan)

### Formatting UI Deliverables (For Future Implementation)

1. **Design mockups** for each UI concept
2. **UX flow diagrams** showing user interactions
3. **Technical feasibility** assessment
4. **Implementation complexity** comparison
5. **Recommendation** with reasoning

**Note**: This research happens in parallel with highlighting system implementation. UI can be built after highlighter is working.

---

## Research Phase

### Current System Analysis

**Files to examine:**
- `src/editor.ts` — ViewPlugin, styleTags, extension ordering
- `src/highlight-tags.ts` — Custom tags, color definitions
- `src/theme.ts` — HighlightStyle, CSS cascade
- `docs/archive/v1/TextMateRules.md` — TextMate scope system reference
- `docs/archive/v1/ThotMarkdownTheme.json` — v1 TextMate theme

**Questions to answer:**
1. Why was ViewPlugin needed as workaround?
2. What are Lezer's depth-based rules?
3. Why do marker tags exist but aren't used?
4. Why do content tags work but marker tags don't?
5. What is `ruleNodeProp.combine()` doing?

**Deliverable**: "Current System Deep Dive" section in this document

### Alternative Approaches Investigation

#### Approach A: Pure Regex + CodeMirror Decorations

**Concept**: No parser, just pattern matching

**Pros:**
- Simplest possible approach
- Full control over patterns
- Easy to understand and maintain
- No external dependencies (beyond CodeMirror)
- Easy to extend to plain text

**Cons:**
- Regex can't handle nested structures well
- Performance concerns for large documents?
- May miss edge cases that parser catches

**Research tasks:**
1. Prototype regex patterns for 10-15 markdown elements
2. Test performance on 100K line document
3. Test edge cases (nested bold/italic, escaped characters)
4. Measure complexity (lines of code, maintainability)

**Test branch**: `research/regex-highlighter`

#### Approach B: Lezer Parser + Simple Decoration Layer

**Concept**: Keep Lezer for structure, simplify styling

**Pros:**
- Lezer parser is solid (handles edge cases)
- Just need simpler decoration system
- Leverages existing parser
- Handles nested structures correctly

**Cons:**
- Still dependent on Lezer
- May inherit some complexity
- Harder to extend to plain text

**Research tasks:**
1. Build single-pass tree walker
2. Apply decorations directly (no styleTags, no HighlightStyle)
3. Test if this is actually simpler
4. Measure complexity vs. current system

**Test branch**: `research/lezer-simple`

#### Approach C: Custom Lightweight Parser

**Concept**: Build our own markdown parser

**Pros:**
- Full control over parsing and styling
- Can optimize for our specific needs
- Same system for markdown and plain text
- No external parser dependencies

**Cons:**
- Most work upfront
- Need to handle all markdown edge cases
- Reinventing the wheel?

**Research tasks:**
1. Study markdown spec (CommonMark)
2. Prototype simple parser for basic elements
3. Test edge cases
4. Compare complexity to Approach A or B

**Test branch**: `research/custom-parser`

#### Approach D: Hybrid (Lezer + Regex)

**Concept**: Lezer for markdown structure, regex for plain text

**Pros:**
- Best of both worlds?
- Lezer handles complex markdown
- Regex handles simple plain text
- Unified decoration system

**Cons:**
- Two systems to maintain
- Complexity in mode switching

**Research tasks:**
1. Build unified decoration system
2. Test mode detection
3. Measure complexity

**Test branch**: `research/hybrid`

### Performance Requirements

**Must handle:**
- 100,000+ line documents
- Real-time highlighting as you type
- Smooth scrolling
- No flicker or lag

**Test documents:**
- Small (100 lines)
- Medium (1,000 lines)
- Large (10,000 lines)
- Huge (100,000 lines)

**Metrics to measure:**
- Initial render time
- Typing latency
- Scroll performance
- Memory usage

### Scope Definitions to Support

**Markdown scopes** (must support all current elements):

**Structure:**
- `heading.1` through `heading.6`
- `paragraph`
- `blockquote`
- `code-block`
- `horizontal-rule`

**Emphasis:**
- `bold`
- `italic`
- `bold.italic` (combo)
- `strikethrough`
- `strikethrough.bold` (combo)
- `strikethrough.italic` (combo)

**Code:**
- `inline-code`
- `inline-code.delimiter` (backticks)
- `code-block.delimiter` (```)
- `code-block.language` (language ID)
- `code-block.content` (fallback)
- `code-block.token.*` (language-specific tokens)

**Lists:**
- `list.bullet.marker`
- `list.bullet.content`
- `list.ordered.marker`
- `list.ordered.content`
- `list.checkbox`

**Links:**
- `link.text`
- `link.url`
- `link.title`
- `link.reference`
- `autolink`

**Special:**
- `yaml.frontmatter`
- `html.tag`
- `html.attribute`
- `comment`
- `escape`
- `emoji`

**Plain text scopes** (to be defined):
- `text.heading-like`
- `text.list-like`
- `text.emphasis`
- `text.question`
- `text.indented`
- `text.body` (fallback)

### Research Deliverables

**For each approach:**

1. **Prototype code** on test branch
2. **Complexity analysis**
   - Lines of code
   - Number of files
   - Conceptual complexity (how hard to explain?)
3. **Performance benchmarks**
   - Small/medium/large/huge documents
   - Typing latency
   - Scroll performance
4. **Maintainability assessment**
   - How easy to add new scopes?
   - How easy to change colors?
   - How easy for future agents to understand?
5. **Extensibility evaluation**
   - Can it handle plain text?
   - Can it support user-customizable themes?
   - Can it support workspace-specific themes?

**Final deliverable**: Recommendation with:
- Chosen approach and why
- Comparison matrix of all approaches
- Implementation plan for chosen approach
- Migration strategy from current system

---

## Implementation Approach

**Note**: This section will be filled in after research phase completes.

### Recommended Approach

[To be determined after research]

### Architecture

[Detailed architecture of chosen approach]

### File Structure

[New files to create, files to modify, files to delete]

### Migration Strategy

[How to transition from current system without breaking anything]

### Testing Strategy

[How to verify all markdown elements work correctly]

---

## Formatting UI Research

**Note**: This research happens in parallel with highlighting system. UI implementation comes after highlighter is working.

### UI Concept 1: Floating Touch Shortcut

#### Auto-Positioning Algorithm

**Goal**: Button stays out of typing path automatically

**Approach ideas:**

**Simple**: 
- Default position: bottom-left corner
- When cursor enters zone (e.g., bottom 30% of screen), move to top-left
- When cursor enters that zone, move to bottom-right
- Smooth animation

**Smart**:
- Track cursor position
- Calculate "safe zone" (far from cursor)
- Move to safe zone with smooth animation
- Hysteresis (don't move too frequently)

**Research questions:**
- How to track cursor position efficiently?
- What's the right "safe distance"?
- Animation duration/easing?
- Mobile vs desktop differences?

#### Manual Positioning

**Behavior:**
- Long-press button → enters drag mode
- Drag to new position
- Snaps to edges/corners
- Remembers position (localStorage)

**Research questions:**
- Touch vs mouse event handling?
- Snap zones (corners, edges, grid)?
- Visual feedback during drag?

#### Menu Layout

**When button tapped, what appears?**

**Option A: Radial menu**
- Buttons arranged in circle around touch point
- Fast access, no scrolling
- Limited space (6-8 buttons max)

**Option B: List menu**
- Vertical list of options
- More space, can scroll
- Traditional, familiar

**Option C: Grid menu**
- 3x3 or 4x4 grid
- Organized by category
- More options visible

**Research**: Prototype each, test on mobile and desktop

#### Context-Aware Options

**Markdown mode menu:**
- Add heading (H1-H6)
- Bold, Italic, Strikethrough
- Bullet list, Numbered list
- Link, Image
- Code block, Inline code
- Blockquote, Horizontal rule

**Plain text mode menu:**
- Highlight as heading
- Highlight as emphasis
- Highlight as list
- Highlight as quote
- Clear highlighting

**Research questions:**
- How to detect mode automatically?
- Should user be able to switch modes explicitly?
- What if document has both markdown and plain text?

### UI Concept 2: Selection Context Menu

#### Positioning

**Goal**: Popup appears near selection without covering it

**Approach:**
- Calculate selection bounding box
- Position popup above selection (if space)
- Position below if not enough space above
- Center horizontally on selection
- Handle viewport edges (don't go off-screen)

**Research questions:**
- How to get selection bounding box in CodeMirror?
- Mobile vs desktop positioning differences?
- Animation (fade in, slide in, instant)?

#### Button Design

**Goal**: Prominently display keyboard shortcuts

**Design concept:**
```
┌─────────────────────────────────────┐
│  [B]   [I]   [H1]  [•]   [1.]  [<>] │
│  ⌘B    ⌘I    ⌘H1   ⌘7    ⌘9    ⌘K   │
└─────────────────────────────────────┘
```

**Research questions:**
- Button size for touch targets (mobile)?
- Icon vs text labels?
- Shortcut display prominence?
- Color coding by category?

#### Strategic Button Selection

**Don't overwhelm users** — show most common formats only:
- Bold, Italic (always)
- Heading (if at line start)
- List (if at line start)
- Link (always)
- Code (always)

**Research questions:**
- Context-aware button visibility?
- "More options" button for advanced formats?
- User customization of visible buttons?

### UI Concept 3: Keyboard-First Philosophy

**Goal**: Teach users keyboard shortcuts through UI design

**Principles:**
1. Shortcuts are PRIMARY interface
2. Buttons are SECONDARY (for discovery)
3. After using button once, user learns shortcut
4. Progressive disclosure (show more as user learns)

**Research questions:**
- How to track which shortcuts user knows?
- How to progressively hide buttons as shortcuts learned?
- Tooltip system for shortcut hints?
- Shortcut cheat sheet (⌘? to show)?

### Formatting UI Deliverables

**For v3.0.0 (research only):**

1. **Design mockups** for each UI concept
2. **UX flow diagrams** showing interactions
3. **Technical feasibility** assessment
4. **Prototype** (basic version) on test branch
5. **Recommendation** for v3.1.0 implementation

**For v3.1.0+ (future implementation):**
- Full implementation of chosen UI concept
- Integration with highlighting system
- User preferences for UI behavior
- Mobile optimization

---

## Success Criteria

### For Custom Highlighting System

**Must achieve:**

1. **Simplicity**
   - Single file defining all scopes
   - Pattern → Scope → Color → Priority
   - No coordination across 3+ files
   - Easy for future agents to understand

2. **Correctness**
   - All markdown elements highlighted correctly
   - No bugs from current system
   - Nested emphasis works (bold in italic, italic in bold)
   - Combo scopes work (bold + strikethrough)

3. **Performance**
   - Handles 100K+ line documents smoothly
   - No typing lag
   - Smooth scrolling
   - Only processes visible lines

4. **Extensibility**
   - Easy to add new scopes
   - Easy to change colors
   - Supports plain text highlighting
   - Enables user-customizable themes

5. **Maintainability**
   - Clear, readable code
   - Well-documented
   - Easy to debug
   - Future-proof

### For Plain Text Highlighting

**Must achieve:**

1. **Useful patterns** that create cognitive load reduction
2. **Not annoying** — patterns make sense, don't feel arbitrary
3. **Customizable** — users can define their own patterns
4. **Performant** — no lag even with pattern matching

### For Formatting UI (Research Phase)

**Must deliver:**

1. **Clear recommendation** for which UI concept to implement
2. **Design mockups** showing the vision
3. **Technical feasibility** confirmed
4. **Implementation complexity** estimated
5. **User testing plan** defined

---

## Rollback Plan

### If Custom Highlighter Fails

**Scenario**: New system has critical bugs or performance issues

**Rollback steps:**

1. Keep current system in `src/editor-v2.ts` (rename, don't delete)
2. Test new system on `v3-rainbow-moat` branch
3. If issues found, revert to v2 system
4. Document what went wrong
5. Refine approach and try again

**Safety net**: Don't merge to `v2-first-thots` until thoroughly tested

### If Plain Text Highlighting Doesn't Work

**Scenario**: Plain text patterns are annoying or don't make sense

**Fallback**: 
- Ship markdown highlighting only
- Defer plain text to future version
- Collect user feedback on what patterns would be useful

### If Formatting UI Research Inconclusive

**Scenario**: Can't decide on UI approach

**Fallback**:
- Ship highlighting system without UI
- Markdown users still benefit from better system
- Defer formatting UI to v3.2.0

---

## Research Log

**Note**: This section will be updated as research progresses.

### 2026-02-20: Initial Investigation

**Findings:**

Current system complexity traced:
- Custom tags defined but not all used
- ViewPlugin as workaround for Lezer depth rules
- Coordination across 3 files required
- CSS cascade ordering matters
- Extension ordering matters

**Decision**: Build custom system from scratch

**Next steps:**
1. Study TextMate scope system
2. Prototype regex-based approach
3. Test performance
4. Compare to Lezer-based approach

### [Date]: [Research Update]

[To be filled in as research progresses]

---

## Related Documentation

- `docs/THOT_APP.md` — Current project reference
- `docs/UPDATE_MAP.md` — Strategic roadmap
- `docs/archive/v1/TextMateRules.md` — TextMate scope reference
- `docs/archive/v1/ThotMarkdownTheme.json` — v1 theme definition
- `docs/archive/v2/v2_0_8_UPDATES.md` — Previous highlighting system rewrite
- `.agent/DEV_RULES.md` — Development protocols

---

## Notes & Ideas

### Scope Naming Conventions

**Use dot notation for hierarchy:**
- `heading.1`, `heading.2`, etc.
- `list.bullet.marker`, `list.bullet.content`
- `code.inline`, `code.block`
- `emphasis.bold`, `emphasis.italic`, `emphasis.bold.italic`

**Benefits:**
- Clear hierarchy
- Easy to understand
- Matches TextMate convention
- Future-proof for extensions

### Color Palette Organization

**Keep current color palette** from `src/highlight-tags.ts`:
- Already well-designed
- Colors tested and refined
- Just need simpler application system

**Future enhancement**:
- Light theme colors
- User-customizable palettes
- Workspace-specific themes

### Plain Text Pattern Ideas

**Heading-like patterns:**
- Short lines (< 50 chars) followed by blank line
- Lines ending with `:`
- ALL CAPS lines
- Lines with only `# ` prefix (markdown-style in plain text)

**List-like patterns:**
- Lines starting with `-`, `*`, `•`, `–`, `—`
- Lines starting with `1.`, `2.`, etc.
- Indented lines (sub-items)

**Emphasis patterns:**
- ALL CAPS words or phrases
- "Quoted text"
- Text between parentheses (notes, asides)

**Question patterns:**
- Lines ending with `?`
- Lines starting with "What", "Why", "How", "When", "Where", "Who"

**Research needed**: Test these patterns with real documents, refine based on usefulness

---

*This document is a living research and implementation guide. It will be updated throughout the v3.0.0 development process.*
