# V3 Intelligent Formatting UI: Implementation Guide
**Branch**: `feat/v3-formatting`
**Target**: `v3-rainbow-moat`

## Goal
Provide a way for users who don't know markdown to format text visually (bold, italic, lists) while still seamlessly allowing markdown for power users. This establishes Thot as a general text editor.

## Approach
- **Dual Mode Approach**: We will first pursue a standard "Dual Mode" UI approach. 
  - *Visual mode*: formatting toolbar/context menu where notation is visually hidden.
  - *Markdown mode*: notation is visible alongside semantic highlighting.
- **UI Mechanism**: Implement a Selection Context Menu that pops up near selected text. The menu will contain buttons for common tools, highly prioritizing the display of keyboard shortcuts (e.g., `⌘B` for bold). 

## Tasks & Execution
### 1. Notation Visibility Toggle
- Use CodeMirror decorations to visually "hide" markdown notation chars (e.g. `**`) from the viewport when in 'Visual mode'.
- Need to account for cursor handling when moving into or selecting over hidden ranges.

### 2. Context Menu UI
- Build a floating popup element that anchors to the viewport selection bounding box.
- Include buttons for B, I, H1-H6, List, Link, Code.
- Provide progressive disclosure so users learn keyboard shortcuts over time.

### 3. Testing & Research Steps
- Build a sandbox testing the UX of hiding notation characters without stripping them from the actual document `doc`.
- Implement selection-box tracking.

## Verification
- Validate the context menu displays in bounds.
- Validate applying a style injects the required notation underlying the text.
- Verify the cursor behaves appropriately when navigating over hidden characters.
