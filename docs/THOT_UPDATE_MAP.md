# Thot App Developmental Roadmap 
`thots.august.style`

## Project Vision 

The organization of Finder column view + the convenience of Apple Notes + the flexibility of markdown + the document exports of Google Docs + the cognitive load easing nature of syntax highlighting. 

* **User-friendly notes app that you actually want to use** 

  + Persistent, always-on writing tool; scratchpad that meets you where you are
    - Markdown, fully tunable syntax highlighting 
    - Innovative rich text formatting interface 
    - Auto-saves with cursor and scroll position preserved 
  + Natural drill-down note organization from high level to small
    - Task note organization modeled after Finder column view 
    - Top-level overview of types of notes 
    - Project and concept level overview with
    - 'Post-it Note' style cards visible at each level 

---

## Design & Development Principles 

  + Build AI-ready modularity into codebase at every turn 
    - Under the hood, editor is real .md or .rft file, that's it 
    - Future features (multi-note, export, web clients, AI) will build around this file, not replace it 
  + Edit = product 
    - It should feel like there is no 'shell app' with an editor inside (even though there is)
    - Editor surface is the product 
  + Semantic calm 
    - This is where we bring in the pinnacle design principle: LESSENING COGNITIVE LOAD 
    - The styling is expressive but not noisy, easy to scan 
  + All design decisions prioritize 
    - The feel of typing and reading over features
    - Communicating and gathering knowledge over hunting and organizing 
  + Frictionless entry 
    - Open, type 
    - No modals, no "New document" prompts or chooser screens 
    - AI can organize on exit or when user runs <kbd>⌘ + R</kbd> 

### Modular Parallel Development Opportunity 

* **Build SwiftUI wrap so that PWA text-editing can be further developed simultaneously with SwiftUI interface and integration** 

  1. v2 text edit PWA 
     - Build starts as a single scratchpad markdown editor 
     - Add functionality that is related to text-editing specifically 
  2. v3+ SwiftUI interface and integration 
     - Wraps the PWA with SwiftUI for macOS, iPadOS, iOS app 
     - Build our UI and integrate additional functionality  
  
+ "How to Publish a Progressive Web App (PWA) on the iOS App Store Using SuperPWA – Super PWA Docs" `https://superpwa.com/docs/article/how-to-publish-a-progressive-web-app-pwa-on-the-ios-app-store-using-superpwa/`
  - I've seen users on Twitter trying to build SwiftUI only markdown apps (like we tried for v1 and failed) 
  - Re: Apple App Stores T&C — as long as we add value beyond a standard webpage, wrapping PWA is okay 

### v2.x — Pre-UI Updates 

1. **Icons cleanup**
     - Duplicate icons in `public/icons/` and `src/assets/icons/`
     - Fresh favicon batch in `docs/favicon-and-other-icons/` (HTML package + Next.js package)
     - Need to consolidate, pick correct set, update `index.html` and manifest references
     - `manifest.json` file noted as missing from `public/`

2. **Mobile/iPad responsiveness**
     - No mobile test environment yet
     - iPad is WAY more important than phone
     - Defer until test environment exists

---

## PWA Development 

### Thot v2.1.4 (Current build)

* **Problem**: Existing markdown editors are either too simple (no highlighting) or too complex (full IDEs with irrelevant features)
* **Solution**: A single-purpose scratchpad that opens instantly, highlights beautifully, and never loses your work

  + Open the app, start typing, see instant highlighting
  + Close the browser, come back later, everything is exactly where you left it
  + Install as a PWA for an app-like experience without the App Store

### Thot v2.X.X (Upcoming)

#### Paired-Delimiters Behavior

**Implement: pair insertion, wrap-selection, skip-over, pair deletion**

+ Typing an opening `() [] {} '' "" \` `pair` character inserts both
  - `(` → `()` with cursor between 
  - `[` → `[]`
  - `{` → `{}`
  - `'` → `''` 
  - `"` → `""`
  - Backtick → `` ` ` `` (inline code)
+ When cursor is directly before an auto-inserted closing character
  - Typing that closing character moves the cursor past it instead of duplicating
+ When word is highlighted and delimiters are selected, they are added to the word as a pair.
  - `word` → `(word)`
  - `word` → `[word]`
  - `word` → `{word}`
  - `word` → `'word'`
  - `word` → `"word"`
  - `word` → `` `word ` ``
+ Arrow keys allow moving "out of" pairs as usual; there's no special trap 

#### Editor surface's Light Theme option 

#### Exporting (HTML/PDF) for Print/Export 

* **PDF Exports** 

  1. Start with a simple export of the markdown document as-is, with notation (this would basically already work with a PRINT option because the print menu always has 'save as PDF)
  2. Then create export that simply applies that notation's formatting and removes the notation 
  3. No need to think about beautiful typography PDF exports any time soon 

* **Current Save Behavior is HTML** 

  + I'm not sure this is helpful for us at all? 

---

## SwiftUI Development 

The v3 line is a major step: wrapping the PWA in native SwiftUI for App Store distribution and building the multi-note column UI. Here's how the phases could break down logically:

  + **v3.0.0 — SwiftUI PWA Shell**
    - WKWebView wrapper that loads the PWA
    - Native window chrome (title bar, traffic lights)
    - File system access via SwiftUI (save/open .md files replaces localStorage-only model)
    - Native spellcheck integration (may make the v2.1.0 spellcheck implementation moot — worth considering whether to do spellcheck in v2.1.0 as a browser-native quick fix or wait for SwiftUI native)
    - App Store submission (one single-note scratchpad, but native)
    - Target platforms: macOS first, then iPad, then iPhone

  + **v3.1.0 — Multi-Note Foundation**
    - Data model: multiple notes with titles, metadata, tags
    - Storage migration: localStorage single-note → file system or CoreData multi-note
    - Sidebar or basic list view showing all notes
    - Create / delete / rename notes
    - CMD+N creates a new note (fixes the current duplicate-window behavior)

  + **v3.2.0 — Column Navigation UI**
    - Finder-style drill-down columns
    - Configurable "post-it" preview snippets per note
    - Note ordering, pinning, favorites

  + **v3.3.0 — Tags & Linking**
    - #ProjectTag for grouping notes
    - @mention linking between notes by title
    - Auto-generated tag sections in the column view
    - Search across all notes

  + **v3.4.0 — Native Integrations**
    - Share sheet (share to Mail, Messages, etc.)
    - @date notation → Reminders/notifications
    - Speech-to-text input
    - Haptic feedback (iPad)

  + **v3.5.0 — Preferences & Theming**
    - UI for changing highlight colors per element
    - "Project themes" — different color schemes per section/tag
    - Light mode theme
    - Font size / line height preferences

  + **v3.x.0 — RTF Mode**
    - Alternative to markdown for non-markdown users
    - Context menu with prominent keyboard shortcuts
    - Basically reinventing the formatting toolbar as keyboard-first

  + **v4.0.0 — AI Customization**
    - Config files (JSON) defining layout, editor prefs, note metadata
    - Natural language → config changes ("make headings blue", "show word count in the corner")

### Thot v3+ (Planned updates)

#### Native Standards 

+ SwiftUI Wrap for Native feel creating user legitimacy vibes 
  - Minimal macOS menus, no toolbars, no sidebars
  - Use macOS defaults and settings wherever possible
  - Multi-document support and integration with system files 

+ Standard keyboard behavior 
  - Arrow keys, Option-arrow for word navigation, Command-arrow for line start/end.
  - Shift + movement for selection.
  - Standard editing shortcuts: Cut/Copy/Paste, Undo/Redo, Select All.
  - `Tab` indents inserts 2 spaces 

+ Spellcheck uses Apple device native system 
  - Underline misspellings 
  - Auto-correct defaults off, unless OS Preferences has it turned on 
  - Toggled with standard "Check spelling while typing" menu item 

+ Native benefits: file system access, spellcheck, speech-to-text, haptics, Share sheet, Reminders integration, @date notation for notifications

#### Navigation UI 

+ Introduce a "Finder column view" style navigation UI in SwiftUI

  1. Workspace top level 
  2. Projects second level, etc. (these are "folders")

  - What are other terminologies for this kind of UI? 
  - I'd like it to be broader than "Projects" 
  - I'd like "workspaces" to make more sense for things like "life" and "work" and "school" 
  - I'd like to be able to drill down more than two levels in terminology 

+ Use #tagging for organization, @mention other notes for linking 

#### Preferences UI that makes changing highlight colors super easy

  + A must for user to see all the possible tag scopes and adjust for their own cognitive load lessening 
  + Let the user create 'workspace themes' 
    - They will immediately visually recognize if they are in the right note space 
    - We want to tempt RFT users towards highlighting even if they aren't up for learning how to write markdown notation  

#### Menus & Windows 

**Window**

  - No custom toolbar, no sidebar 
  - No title-bar buttons beyond the OS default traffic lights 

* **Menus**

+ App
  - About Thot 
  - Check for updates...
  - Settings <kbd>⌘ + '</kbd>  
  - Quit Thot <kbd>⌘ + Q</kbd> 
+ File 
  - New Window <kbd>⌘ + N</kbd> 
  - New Workspace <kbd>⌘ + Shift + N</kbd> 
  - Close <kbd>⌘ + W</kbd> 
  - Save <kbd>⌘ + S</kbd> 
  - Import from iPhone or iPad 
  - Export <kbd>⌘ + E</kbd> 
  - Share to...
  - Print <kbd>⌘ + P</kbd> 
+ Edit 
  - Undo <kbd>⌘ + Z</kbd> 
  - Redo <kbd>⌘ + Shift + Z</kbd> 
  - Cut <kbd>⌘ + X</kbd> 
  - Copy <kbd>⌘ + C</kbd> 
  - Paste <kbd>⌘ + V</kbd> 
  - Select All <kbd>⌘ + A</kbd> 
  - Find <kbd>⌘ + F</kbd> 
  - Replace <kbd>⌘ + Shift + F</kbd> 
+ View 
  - Toggle spellcheck <kbd>⌘ + Shift + C</kbd> 
  - Toggle line numbers <kbd>⌘ + Shift + L</kbd> 
  - Toggle word count <kbd>⌘ + Shift + W</kbd> 
  - Toggle character count <kbd>⌘ + Shift + C</kbd> 
  - Toggle token count <kbd>⌘ + Shift + T</kbd> 
+ Format 
  - Heading 1 <kbd>⌘ + H + 1</kbd> 
  - Heading 2 <kbd>⌘ + H + 2</kbd> 
  - Heading 3 <kbd>⌘ + H + 3</kbd> 
  - Heading 4 <kbd>⌘ + H + 4</kbd> 
  - Heading 5 <kbd>⌘ + H + 5</kbd> 
  - Heading 6 <kbd>⌘ + H + 6</kbd> 
  - Italic <kbd>⌘ + I</kbd> 
  - Bold <kbd>⌘ + B</kbd> 
  - Bulleted List <kbd>⌘ + Shift + 7</kbd> 
  - Dashed List <kbd>⌘ + Shift + 8</kbd> 
  - Numbered List <kbd>⌘ + Shift + 9</kbd> 
  - Block Quote <kbd>⌘ + Shift + .</kbd> 
  - Checklist <kbd>⌘ + Shift + L</kbd> 
  - Mark as Checked <kbd>⌘ + Shift + U</kbd> 
  - Table <kbd>⌘ + Shift + T</kbd> 

#### Future-proof Metadata 

* **Allow future enhancements:**

+ File: `~/Library/Application Support/Thot/state.json`
+ Fields:
  - `caretPosition: Int` (UTF-16 offset into text).
  - `scrollOffset: Double` (if necessary).
  - `createdAt`, `updatedAt` timestamps.


--- 

## AI Feature Integration 

* **Identify features to be able to identify if they're developed at PWA editor level or the SwiftUI level**

### AI Design UX Goals 

  + UX is using a single desk pad sheet, the AI organizes everything into a notebook 
  + 

### PWA Text Editor Development 

  + Chat, completion, and work simultaneously on the same document 
  + Lightning-speed Cursor-vibe document formatting 
  + Auto-organizing notes (UX desk pad, AI handles notebook)

### SwiftUI Integration Development 

  + Chat with your notes 
  + Rapid consolidation and summarization 
  + Pulling out action steps 
  + Declarative UI customization 
  + Settings UI beyond the minimal OS-default "Preferences" stub
