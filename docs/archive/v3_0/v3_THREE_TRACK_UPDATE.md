# v3 Development Updates 

**Created**: 2026-03-02 
**Version**: v3.0 
**Status**: Planning and researching for implementation of updates 
**Branch**: `v3-rainbow-moat` (main v3 product branch that all v3.1, v3.2, etc. updates will be merged into; stable builds well be sent to `main` whenever makes sense)

---

## Current State

### Previous Session Documenting

- Created **BRANCH** that we're currently on: `v3-rainbow-moat`
- The **PLANNING & RESEARCH** document seems to have been kept up to date: `docs/archive/v3/v3_UPDATE.md`
- Document created to **PREVIEW** to human might not still be relevant: `docs/archive/v3/v3_SCOPE_DEFINITIONS.md`

### Stopped Session Status

+ I need help understanding what the actual current state. 
+ I stopped the session's progress because it seemed we were getting off track in a few ways. 

  1. We want to create our own **proprietary highlighting system**. The plan started that way, but then based on `v3_UPDATE.md`, it looks like the agent decided that one of the existing systems from the multiple layers would work for everything. Not only am I extremely hesitant to believe that to be true, considering we started out with one layer and added layers to make the systems accommodate our needs, but I still don't know why we are diverging from creating our own system. 
  2. The planning for the **Intelligent Formatting UI** seems to have been lumped into this same update document. While I am okay with both of these items being part of the v3 product, I think that they should be developed completely separately. Ideally we'll be able to create a highlighting system that will be able to be applied to the current build, or any text editor, really. 
  3. Lastly, I'd like to make a few of the **current build update** needs so that the tool I'm using all day every day (yay) can be leveled up a bit. We can look at what is on the update list and figure out what exactly those are. 

## Next Steps 

+ I would like to plan those three updates so that they can all be done separately. 
  
  1. We can create the exclusively executable implementation guide for the **CURRENT BUILD UPDATES**, then set it up to work on a sub branch using Claude Code so that we can keep working in here. 
  2. Then we can work on a new exclusively executable implementation guide for the **PROPRIETARY HIGHLIGHTING SYSTEM**. This time I think we need to give far less context because it seems like the agent took that as a sign that it should also continue to "figure things out". We can use the research from before to inform our plan, but I think we should also create our own logic for the plan and then build the implementation plan off of that. I'm hoping that if we frame this is pretty much a completely separate project, it doesn't even need to be related to this project to be created, then hopefully it will seem less like there is room to adjust the plan and make it more complex while thinking they're making it way simpler; like you can see the previous agent had been doing by running with a LOT of planning that was not done in a pragmatic way leaving me completely clueless as to what was going on. 
  3. Finally, we can work on a clean, more complete, exclusively executable implementation guide for the **INTELLIGENT FORMATTING UI**. Just like the above two, it can also be done on its own branch so that in all cases things can be perfected until they are functional and then brought in and merged with the main build. 

+ I'm not sure how much of the last was planned, so in general I think we'll want to start by separating out the current documents into three update documents. 
+ Then we can add notes to those documents that they should be made into exclusively executable implementation guides, doing all necessary research needed to get there. 
+ Once each document is self contained enough for it to make sense to if we hand it off to a new agent, we can create the branches. 
+ Then I'll activate all agents with each project update so that they can finish up the planning with a solid document. 
+ Then a new instance will be able to execute each plan. In this way we can expedite the updates and not need to wait on even our own ability to create all of the complete implementation documents. 

### New Session Documents 

  + In creating the following, please pull all details from and then delete these older versions: 
    - `docs/archive/v3/v3_UPDATE.md`
    - `docs/archive/v3/v3_SCOPE_DEFINITIONS.md`
    - `docs/archive/v3/v3_PLANNING_NOTES.md` 

  1. For the **CURRENT BUILD UPDATES**, we can create `docs/archive/v3/v3_USABILITY.md` for the implementation planning, and then set it off on a similarly named feature branch off the main v3-rainbow-moat product branch that we will merge all the v3.1, v3.2, etc. updates into the v3 updates. 
  2. For the **PROPRIETARY HIGHLIGHTING SYSTEM**, we can create `docs/archive/v3/v3_HIGHLIGHTING.md` for the implementation planning, and then set it off on a similarly named feature branch off the main v3-rainbow-moat product branch that we will merge all the v3.1, v3.2, etc. updates into the v3 updates. 
  3. For the **INTELLIGENT FORMATTING UI**, we can create `docs/archive/v3/v3_FORMATTING.md` for the implementation planning, and then set it off on a similarly named feature branch off the main v3-rainbow-moat product branch that we will merge all the v3.1, v3.2, etc. updates into the v3 updates. 

  + You may need both of these documents for details as well: 
    - `docs/THOT_APP.md`
    - `docs/UPDATE_MAP.md`

### Flow, Branching Specifics 

  - We should create feat/ branches off of our main v3 branch 
  - Start with our usability UX issues which I've detailed better at the bottom of this document 
  - Move to that branch 
  - Do all that can be done preparing that document 
  - Then move to the next update on a new feat/ branch off of our main v3 branch again 
    - Meanwhile I'll have the first feat/ branch we created started 
    - We can run agents working on non-local branches through Claude Code and using Cursor 
  - Continue for all three 

---
*End of planning document by Sean created 2026-03-01* 

--- 

**Below is a bit of information that I had started writing out for the highlighting system in case it is helpful. I stopped once I realized how far the previous session actually had gotten.**

# Highlighting System 

List of must-have functional requirements for highlighted text in Thot while developing our own highlighting system. This is not a design document, but a list of requirements that must be setup and tested for before implementation. 

## Methodology 

We will be using a **Priority-based, Multi-Tag System** of our own creation. This system will include a ranked list of "tags" — a bit of text syntax and the color to highlight that text — along with the logic for how the highlighting of text with multiple applied tags should behave. 

### Prioritized Tag List 

  - Tag list contains every tag (every combination of text characters, words, or syntax) that we want to highlight.
  - Tags are ordered by priority, from highest to lowest.
  - When applying tags to text in the editor, the lowest priority are applied "first" and the highest priority are applied "last".

### Multi-Tag Application

  - When text has multiple tags applied to it, the highest priority tag will be the only one that is visually applied to the text.

---

**USING UPDATES FOR USABILITY BUILD VERSION**

---

# v3-USABILITY 

## Summary 

I have been using Thot on all devices, particularly on my desktop, all day every day. The follow are the biggest UX struggles I have encountered. 

### Process 

  1. Move to new branch (we are on v3-rainbow-moat so can we create a feature update that is related to this? We can consider v3-rainbow-moat the name of the FULL v3 product)
  2. Every update must be THOROUGHLY researched; this includes already understood concepts, they must all be confirmed accurate and up to date.
  3. Group or separate the feature updates however makes sense based on the complexity of each change. 
  4. Create exclusively executable implementation guides for each update or group of updates and name it appropriately, adding a v3.1 or v3.2 etc. based on the order they will be addressed — at, for example, `docs/archive/v3/v3_1-UPDATE-USABILITY.md`

### Not In This Update 

  + The highlight issues can be skipped 
    - Skip the "bugs" needed for "polish" as well 
    - Re: `docs/UPDATE_MAP.md`
  + Ignore "Icons Consolidation" 
  + Skip "iPad/Mobile Viewport Issues" 
  + Skip "YAML Highlighting Bug" and "Undo/Redo Issue (iPad)" 

---

## Thot Feature & Usability Updates 

### Spellcheck, Autocorrect (Native Browser)

  * **What exactly**: Writing on Apple devices, no matter where the text field is, any blogging website, etc. it *autocorrects* like automatically capitalizes the first word of every line, makes sure I'm using periods, makes small spelling errors like plurals and fixes misuse of "their" or "there" and so much more. It is very hard to type on a mobile or tablet device without this. And then *spellcheck* is similarly needed but it is noticeably missing even on desktop. Really, these features being **ON** is very likely to be a default that got turned off somewhere. 

  * **Why now**: It is expected and absence feels broken and increases UX frustration 10X. 

  * **Implementation**: Enable browser's built-in spellcheck
    - Add `spellcheck="true"` attribute to CodeMirror
    - Respects user's system preferences automatically
    - Works on desktop, iPad, mobile

  * **Research needed**: How to toggle on/off (menu item or settings)

### Paired Delimiters Behavior

  * **What exactly**: 

    1. *Pair insertion* — Typing `(` inserts `()` with cursor between
     - Pairs: `() [] {} '' "" ` ` `
    2. *Skip-over* — Typing `)` when cursor is before auto-inserted `)` moves cursor past it
    3. *Wrap selection* — Highlight word, type `(`, wraps as `(word)`
    4. *Pair deletion* — Backspace on `(` deletes both `()` if empty

  * **Why now**: Standard text editor behavior; markdown users expect it, are it is frustrating to go to use it and end up deleting a word instead. 

  * **Files to modify**: `src/editor.ts` (keymap extensions)

  * **Research needed**: CodeMirror closeBrackets extension compatibility

### File Operations 

  * **What exactly**: Fundamental shift away from the "scratchpad" and to "markdown editor" because we need the following. 

    1. *Multiple windows* — CMD+N opens new window (not duplicate)
    2. *Edit files across devices* — just initial scratchpad is persistent, but also access to the Files app on mobile/tablet and then normal on desktop 
    3. *Auto-save to file* — Once file is opened, auto-save to that file (not just localStorage)
    4. *Save as* — CMD-SHIFT-S; save current content to new file name and location 
    5. *Open file* — Browse and open existing .md files
    6. *File name in title bar* — Show which file is open 

*NOTE* that contrary to the previous note here, we do NOT need backwards compatibility. I am the only user, and these are expected changes that are necessary to get the tool up to expected basics. We only did the scratch pad as a stepping stone. Plus, I'm fairly sure if I went to the GitHub and downloaded the tagged previous version, it would work; no backwards compatibility extra adjustments wanted or needed. 

  * **Why now**: Opening/saving .md files + multiple windows = table stakes for "normal users". This is 100% expected behavior of even just a simple notes app to some degree. 

  * **Research Questions:**

    1. *How does Google Docs handle this?* Is it possible that the TextEdit base tool we're using might have a similar system? 
    2. *File System Access API* — Browser support in 2026? Safari support?
    3. *Mobile/tablet Apple Files app* — Web apps have access to Files app on mobile?
    4. *Find comparable example* — When you go do download a PDF from any website, or save an image (on mobile or tablet), you can download it and then open it in Files or save it directly to Files 

  * **Behavior nuance**: 
    - When using the Text Edit tool, the 'untitled' document is automatically saved and persists even if you close and open the app. This is much like the current behavior of the scratchpad. 

#### Research File System Access API

* **Questions to answer:**

  1. **Browser support in 2026**
     - Chrome/Edge: Full support?
     - Safari: Support added when?
     - Firefox: Status?
     - Mobile browsers: iOS Safari, Chrome Mobile?

  2. **API capabilities**
     - Open file picker
     - Save file picker
     - Directory access (for relative paths)
     - Permissions model
     - Auto-save to open file

  3. **Fallback strategies**
     - Download/upload for unsupported browsers
     - localStorage as fallback
     - Graceful degradation

  4. **Multiple windows**
     - How to track which file is open in which window
     - localStorage key strategy
     - BroadcastChannel for sync?

  * **Deliverable**: Implementation plan with browser compatibility matrix and fallback strategy

### Mobile/Tablet UX Improvements

  * **Issues to address:**

    - Predictive text bar appearing above keyboard (weird form field with checkmark)
    - Lack of share buttons on iPhone PWA (no URL bar)
    - Different PWA behavior: iOS (no UI) vs. iPadOS (browser window)
    - Bottom padding when typing on last line (auto-grow buffer)

  * **Research needed**: PWA display modes, iOS standalone mode customization