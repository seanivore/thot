# Thot App Developmental Roadmap & Update Planning 
`thots.august.style`
**Thot v2.1.4** — launched ✅

## Development Process Upgrade Thoughts 

Can we develop features in parallel? 
  - Updates that agents build in parallel using different branches 
  - All testing is completed as part of that process 
  - Best used when there is already a working build, like this first `Thot` version pushed 

Surely companies must already have been doing this for years with various employees 
  - What is their protocol, generally? 
  - What would merging finished updates together look like? 
    - Agent protocol to keep highly detailed change logs 
    - Confirm changes against git 

Let's expand this to multiple ongoing projects 
  - I'm paying for Claude monthly, upgraded Anti-Gravity Google 1 subscription, and have a paid subscription to Cursor 
  - This happened because of a deadline I needed to finish but kept running out of usage 
  - I'd like to be smarter about using all of these tools before I just cancel them all 

Presumably we'd need to create various protocol to follow 
  - Before starting a project, making sure there is adequate research to get to a point of an exclusively executable implementation plan 
  - Manage the steps or larger phases, or rather versions I guess, at very top level in a way that the agents don't need to know 
  - Whatever protocol is needed for developing different features for the same product in parallel 
  - Protocol for how we set up git, github, directories, etc. 
  - Setting up development directory from my starter clone directory (add .agent directory in there and also my system message)
  - As much as is needed to make this as autonomous building as possible including visual design testing and checking work 

* **Let's plan this out first** 

  + Should it be an IDE workspace first? 
  + I just made a note below about wanting the documentation to represent the full concept but maybe that isn't best for agents doing each build 
  + Meaning we'd want a different space for that information, as well as the rest of the general planning 
  + Yeah — please pull that first note below and keep it and start the planning sub-directory for Thot within this pitched full directory for overhead planning 

---

## Documentation Updates for Full Product Expectations  

**NOTE**: I think it is important that we update the `docs/THOT_APP.md` document's 'about' type section at the top so that it is representative of the entire vision of the project instead of just the first version of the project. The same thing should be done to the `README.md` file. 

  1. Let's pull from here to build out those details for those requested document updates. 
  2. We then needs to organize this roadmap document; there are currently a bunch of duplicate information form my consolidating 
  3. I'd like to try to see if we can organize things so that there are two parallel development opportunities 
  4. Set ourselves up so that an agent can come through later and do research and everything else necessary to turn this document into separate UPDATE documents that are exclusively executable, with all details figured out down to the smallest details; the highlighting was a perfect example of a failure to do this well for this project because our v2.1.0 update was a complete revamp of how they are applied after the agent did research to figure out what we 'thought' were bugs but really were a result of us guessing at how things get put together instead of doing research and confirming everything from the start. We could have saved half of a day sorting out those bugs if we had done the research from the start. Not sure where the best place to put this information is, but it is just too perfect of an example of why this is so important. LLMs presume they have the knowledge-base and use common solutions, but so often the reality is that there are many details that need to be sorted beforehand for us to be truly effective.  

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

### Thot v2.x (Upcoming)

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

---

# Notes from iPad Testing of PWA 
`/Users/seanivore/Downloads/IMG_0028.PNG`

WOAH super weird-- rightnow the document goes below the fold, out of the bottomn of the screen 
when i pulled down to see the top of the document it kept stopping at line 4 
it only showed me the rest of the contents when i clicked into the text area, aka our whole app 
yeah this seems to happen almost every time 
luckily it does show the top when i pull down enough for the page to reload 
------- 
What is ithis weird behavior with adding hyphens after text at the top of the page? it also happens if 
1. I'm writing a list and in the next list item
2. I delete the number and add a hyphen
   -
It goes away as soon as I write a character (not including space) after the hyphen but until this it treats the text above the - as if it is a heading 
OH is this YAML related? We should change the color and with YAML rules doesnt it need to be a certain number of hyphens? and only at the top of a page, not when following a list item 
- list
- item
  1. Which only happen when transitioning from numbered list to bulleted sublist
  2. If it is YAML releated you'd think it would misbehave after headings, but it doesn't, just after numbered list item, when new list item has number deleted and starts with a hyphen and has no other content


Anyway I jumped up there because after opening this in a new tab i learned that the "doesn't scroll all way" behavior also happens to the bottom of the document when first entering it before I've clicked into the doc to type. We should research this since it is iOS / iPadOS related 

weird okay it happens to the bottom even when i still have an active cursor in the document. right now i can swipe down with my finger to see the bottom of the document and it only goes to line 122 but document lines continue down to 125 

---


Wtf hitting ctrl-z doesn't undo my deletion of the full page!! 

I wanted to see in what circumstances the numbered list is pink because in the first test they were both cyan and I even started with the numbered list. 

# Testing Tablet Use 

* **Oh! I didn't realize before but I *DID* start the section (or page) with this kind of bold subheading as I like to do**

  1. Because it makes the numbered list cyan instead of pink like it should be
  2. But this doesn't happen if you start the page with a numbered list and then transition to a (separated) bullet list

## Second Heading 

  1. Okay this second numbered list is nice and pink
     - I'm adding a sublist
     - And it is nice and cyan
  2. And it returns to pink when I return to numbered list

## Third Heading 

  1. Okay, I think I need to have a model like Codex that **REALLY** seems to have a strong grasp on complex logic, sort out the heirachy -- **REQUIRES**: full list of all issues; circle back after addressing question below about in-house created highlighter logic 
  2. I also need it explained to me like a baby (lol) how it works
  3. And then regarding *HOW* it is applying the logic, how can we have more control over this

If I remember correctly it was something about CSS and then another location ... but isn't there a way to write some kind of superceeding script that controls how it applies the highlighting logic? I guess I just mean, are we stuck with this methodology? What are our options to break away so that we have (A) More control, and (B) Simplicity — for example, how are the TextMateRules applied -- it seems like it is also heirarchical but in a way that it is only coming from one source, and it is whatver the last applied rule is wins. We need this figured out because we need complete contol over it to be able to make a simple UI for users to control their own themes in different section so of the notes app. 

## Other Issues 

  + Change the cyan currently being used by bullet markers and bullet content to be the italic marker and italic content
  + Apply the gold that is currently set for the bullet marker but not working, and apply it to the bullet contents (which will apply it to both because it is broken right now)
  + We need padding on the left side of the screen that accounts for the increase in line numbering taking up more width space because when it increases it is jarring
  + We need padding on the right because, as you can see in the screenshot, the font at 12pt makes crossing a really wide screen sort of strange (this needs a simple UI on/off switch)
  + Start making a list of simple UI setting preferences
  + When *a **BOLD** word is in a line of italics* both work, but **when there is *italic words in bold like these* then the bold overrides the italic** and we don't want that
  + Start making a list of the logic that
    1. Explains it as we currently understand it, much like the current list in the primary tech doc where we say "BLEND" versus "FULL" override
    2. Integrate and come up with new terminology for this list, adding the bold-word-in-italic-string / italic-word-in-bold-string situations
    3. make sure this is SUPER easy for future AI to understand; we should understand how TextMate does it, how we do it now first to be able to ideate the best methodology because I remember that TextMate was also complicated
  + Make a list that breaks down all of the necessary lingo
    1. I don't know if we use tags like i saw in code, or labels, or scopes
    2. In this list make sure we annotate what other populate systems use
    3. What other systems are there out there?
    4. This number is cyan
  5. this number is pink because it has broken from the list
     - What is it that is in the logic that make it work to add a sublist under a number item and have them appropriately highlighted
     - But not the reverse -- a bullet point that has a numbered sublist
  + **BASICALLY** I would like to understand the system, and other systems, because I have a feeling I could come up with a modern, more sensible version
    - In that light, how complicated would it be to create our only highlighting script?
    - Are there different methods that one might want to take to try doing this?
    - Can we detail out these different approaches as an exclusively executable implemenation plan
    - Then let's set up a directory that contains all the pre-fab materials it needs to do this (as much of this, our working product, without the highlighting defined)
    - **SIDEBAR**: can we further define the branching protocol, like I remember to make sub branches for new features in the same product version like feat/product-line-alias but what other than "feat" is there, e.g. what would this highlighting test be called? a feature but this is like we're trying to home grow our own replacement feaure; anyway i'll say feat for now
    - Set up sub-branches for feat/highlighter-WORD.REPRESENTING.METHODOLOGY for each method
    - Then lets set them to work
+ When you've added the PWA to the homescreen
  - On iOS it opens in a window that has no UI buttons at all and no URL bar
  - on iPadOS it opens in a normal default web browser window?
  - is there a way to congtrol that?
  - how much control do we have there?
  - I'm curous because
    - in the iPad i have the share buttons making it easy to email myself this document or even airdrop it to another device
    - but on the iPhone you have zero buttons but for a really annoying big bar that usually only shows up to give you predictive form input like address
    - and i have a novel idea for mobile UI (and a philosophy) but want to know at what level to add it -- ideally we add as much as we can at this PWA level so that we can have a robust web app relatively easily to offer beside the downloadable SwiftUI app  

## Renaming 

* How complicated would it be to change the product name to 'thots'
* I keep seeing it and it just makes more sense than 'thot'
* I also really like it a lowercase not initial caps, but maybe that is just stylistic and not for formal documentation
* is there a way to manage 'thot' as formal documentation and 'thots' for stylistic that wouldn't cause more issues?
* I feels like the cleanest way would be fixing it from thot to thots everywhere
* Let's not do it yet, i just want to know because i keep thinking about it

## Highlighting Group Types 

  * These are the labeles and behavior properties needed for proper, full control, highlighting to work so that we can create a simplified system that is better than the current offerings
  * Things other systems can't [or can't easily] do but we want to
    - easily highlight brackets of either type, or any delimiter, separate from the content
    - Easily define different highlighting for different uses of syntax like delimiters
    - Example: Why is it that every delimiter seems to easily adopt the contents color except `for inline code tick marks?` even though

```
when used in code they DO maintain their purple
```

What is the contents of a code block called and let's change that color to a medium dark blue -- a blue that feels dark but can be read in darktheme of the app. And is it currently adopting the contents of inline code color? Which we do want to keep red because it is often used for emphasis instead of actual code -- it stands out even more than italics and bold do and we don't want to lose that. 

**TYPE A** 
Benign. This is plain type. There are no circumstances where it is not overridden that we currently are aware of. 

**TYPE B** 

[etc.] 

Ah looks like brackets only turn contents purple when [it is on its own line] oh that works so that means 
- it doesnt work when added [when in a list item] -- confirmed

---

I would love to be able to go @ai please organize these documents 
With Claude Code SKD how complicated would it be to create a version with that functionality? 
I'm trying to think of a really strong first version release where i could charge for a tier 
i had a client ghost and am strapped for cash and am seeing that it costs 100$ to put an app in the app store so seems like it would make sense to create a userbase before getting to that point because, strategically, then if enough go to download at onces, it could push the app to the top of recommendations 💯 

Since I know that 

+ When writting on the last line, can we make it so that it automatically has a buffer? the padding can be black and it would be nice if it grew really incrimentally so that if i was writing at the top of a long document it would show text on the edge of the canvas, but then as my active cursor was closer and closer to the last line (or list line visible) it would add a little bit of padding, bit by bit, so that it is almost unnoticable, that way it wont come out of no where but will still provide that breathing room -- note to self i should look at how google docs handles this first -- maybe it is just me but i keep finding myself adding a bunch of empty lines below my active last line just so that it is up higher and not crammed against the black bar of the device screen (or whatever the user has as the bottom of the screen. That said, on iPadOS I did just turn the window of the browser into an inset instead of it being full ipad screen, and then theygive it a natural padding -- it is there but when thel ine wraps it doesn't stay padding the text unless i manually scroll to the bottom again. i guess they think making it full screen "hides" this natural app padding.

Anyway, was just going to say, that I know that adding that kind of tag an AI in relay would be super fast and easy back when I was making scenarios in Make, that hopefully it will be an easy bug free implementation here too. because if so then we're basically alomst to a point where it could be released as a web app i'm loving it on my ipad. you could actually potentially get away with having many menu bars and such by having commands that jsut have the AI do whatever you needed. /print /save @ai/print maybe better but with predictive text 

We should do the same tactic as the feat/highlighter with maybe just two builds. i'm finding tht htis tactic often leads to a bug free build and want to explore that more. 

for this exclusively executable plan though we want to make sure we research the SDK as much as possible. i want us to know all the tips and tricks. For example, is there a way to be able to choose how they log into claude and choose between their subscription and API because that would be so glorious. 

---

okay at this point going to send to laptop for AI to organize with the mobile notes too 


oh last question -- why is it that some PWA still have the devices spell check and auto correct? the notes said to hold off until the swiftUI wrapper but i am missing it. all my starts to sentences are not capitalized and my i's are lowercase and then words that are ALMOTS right it doesn't fix -- i miss all those things. but am realizing that it seems like the systems auto correct is often added to text fields on normal websites, on other web apps, etc. meaning we probably want that at this level if possible because it will allow us to maintain a more viable web product even when wew get to launching actual OS apps which probably will come for adding note organization UI however i chose that because it seemeed the most logical way to show that we aren't just a website like their t&c specify about adding PWA apps to their store. but maybe we should reserch that because it would be nice to develop as much as possible for the web app

oh i'm also curious -- now that i'm writing with so much plain text in this doucment it makes me curious if there would be a way to *inteligently* add functionality for rich text formatting. like if anew doc could be eaither, and if you start using markdown notation it jakes it mark down. but if i highlight a word and then use some kind of little popup UI i could add bold that way instead and not need it to show the markdown symbols. actually we could potentially make it a setting that would essentially allow for both in a makrdown document. like if you turn it on it would just hide the notation but apply the effect to the markdown. we were already planning on this for a super simple way to print a nice version thatdoesn't require a style sheet to be perfected (because that was a pain in the butt before we have a mcp that tdoes markdown to Pdf and it is very MEH and was hard to get to look nice. but it seems like if we do it slowly and iteratively then we could more easily grow into a really typographically nice export. this doubling as an alternative purpose for the functionality in the early form). the only thing would be like if i was writing a markdown and highlighted a word, we would only want the pop up to show once. this could be simply implemented by the very first instance of it happening hte popup be something like "do you want to format without using markdown notation?" -- i was also thinking about how in Fresco and some other adobe apps on ipad, there is this transparent dot that you can hold down as an option so thatyou switch to an eraser to the pen instantly. and it can be moved. if we used that UI but had it inteligently stay away from the cursor (unless it was places intentionally) then it would be a really creative way to provide mobile/tablet users menus without needing the always visble UI. honestlywe could potentially even trythis for desktop. in future versions people could decide if and which menu choices they want/need always displayed and those could either be in top spots for first visible when you click the dot tap the dot the first time, or on thescreen on whatever side or edge they chose using an interface to make the choice. 

note that sharing this to desktop using airdrop doesn't send content. this makes sense for the current build but is something we'll need to be aware of and manage gracefully for future builds - - like perhaps if you title the doc is saves as unique and not your go to scratch pad. i wish title-saving could be as easy as using # Title but we don't want people doing it accidentally. I guess if it had a # Title and you go to share it could say "Do you want to share "# Title" or a blank notepad. 

---

# Notes from iPad Testing of PWA 
`/Users/seanivore/Downloads/IMG_5840.PNG` 
`/Users/seanivore/Downloads/IMG_5839.PNG`

## Notes 

**Let's see how well this works**

  - On a mobile device
  - i need autocorrect back on
  - ipad would need that too
  - and even on desktop the little things

## Good AutoCorrect 

**Mobile/Tablet**

  1. capitalization
  2. actually i could see people not wanting it
  3. it needs to be a super easy switch on and off
  4. actually that kind of UI if done smart, could set it apart
  5. there is a weird form field with check mark above the keyboard
  6. screenshot taken in iphone photo roll
  7. what kind of shortcuts do we have on mobile PWA hmm
  8. actually i guess we peobably wojld want to wait to have it in swiftui ao tjay it csn bd native
  9. what if it was like a smart dot that stays out of the eay automativallu but wuen younvlick it it opens
  10. thats tje key for mobile -- acknowledge the flaws and assume it wijldnt be ised the dame way on mobile and then creat a novel ise case for movile
  11. also notable thay this window has none of the normal mobile buttons like to share this or send it hmm