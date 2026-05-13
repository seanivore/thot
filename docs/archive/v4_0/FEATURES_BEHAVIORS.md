# Thot App Features & Behaviors

**Version**: N/A 
**Created**: 2026-05-12
**Updated**: 2026-05-12
**Status**: Planning

---

## Overview

This document outlines the current and to be implemented features, behaviors, and functionality for Thot. It is a living document that will be updated as needed. All desired features are documented here and then as sessions continue, feedback is received, research is completed, or ideas come up, things should be updated accordingly. The goal is to have a single source of truth for all things Thot. 

### Conceptual Process 

  1. The document will initially be sentence and paragraph heavy, and poorly grouped, as I describe the necessary UI designs and UX expectations.
  2. These described features should be better isolated and organized so they may then be given robust implementation-needed details.
  3. Areas that need research before locked-in decisions should get a section that directs us to those research documents.
  4. Over time, sections and grouping should be optimized and writing may become more concise and bulleted. 
  5. The document must always offer the best understanding of the full picture by clean instance agents by cutting fat or elaborating.
  6. Planning builds will flow as we'll naturally recognize when we've reached that point, don't try to start there.
  7. Feature planning must reach an exclusively executable state to consider building, which will happen in very few, large tracks.
  8. Only when this map feels more "whole" will we move to the running IMPLEMENT.md document flow.

### High-Level Tasks

  1. Process through all prior documents and pull in every concept and design request to this document.
  2. Start to delineate what needs research and take initiative to prep and plan for those research tasks.
  3. Keep our architecture, tech documentation, agent-primary document `docs/THOT_APP.md` always up-to-date.
  4. Treat documentation from this state forward as starting from a clean slate, wiping current THOT_APP and README.
  5. Create a section near the top of this document for immediate todo lists.

---

## High-Level Requirements 

The following must be researched and then locked-in decisions must be made. The specifics of these features should have sections later in this planning document that detail everything needed to implement, and showing that all initially presumed or already understood concepts have been validated to still be current and today's best practices. It is important for us to plan out the entire picture here in one document because of the way that different features intertwine with each other in ways that might otherwise be overlooked. This document will go through feedback loops specifically looking for these kinds of oversights, as well as other gaps in planning, or lack of sufficient detail to produce an implementation plan that is truly exclusively executable. 

### Web App Focused

Thot should primarily be designed and developed as a web app. We do not want to promote the ability to install as a PWA because we will be using native app wrappers to have macOS and iOS apps with the same core functionality, only adding OS-specific features and behaviors that make sense for the platform.

#### Drop-In Modularity for Native App Updates

Plan and design the PWA and then the core native app wrapper so that we can update the web app as frequently as we want and essentially just "drop" the update into the wrapper and have all the necessary connections still valid. This will become important particularly in those areas where the functionality must be translated to a native feature, like adjusting settings.

  - Lay out exactly what the architecture will be, end-to-end
  - Review research findings, discuss options, and then document finalized approaches

### IDE-for-Markdown Replacement 

Replicate as many of the core features of writing Markdown in today's popular IDEs as possible. Development is moving to terminals and further away from directly needing to edit code all the time, and the bulk of programming work is shifting from coding to planning. These users are iterating on plans repeatedly, collaborating with other humans and with AI. This denotes a market opportunity for an app that offer at minimum the same experience when developing a Markdown-based implementation plan, without having to even open a full IDE. 

  - Understand that many of the UX/UI feedback requests are not "Sean's quirks" but are the norm in all of today's VSC-based IDEs
  - There will be a number of items to address in the current live build that we've held off on because of upcoming development 

#### Real-Time Collaboration 

Allow for real-time collaboration between users as they edit and iterate on plans. We want them to be able to login on the web app using a passkey, and interact with the document in a way that feels like Google Docs, but catered to developers. 

  - This is core to the market opportunity that is visible in the rapidly growing developer scene 
  - Planning for this should therefore be from the ground up and use the modern methods they're used to
  - **This does mean the bar is high**: Google Docs (and Figma) have amazing collaborative features
  - **The opportunities are also large**: Many of the best features haven't been offered outside of the IDE

### Don't Block Out Non-Markdown Writers

We want to make sure that it is just as comfortable for those who don't write using markdown notation as those who do. This means we shouldn't make markdown usage the default experience or an unavoidable one. It should be optional and use an intelligent behavior to recognize what the user is writing in. Ideally a user could switch back and forth in a single document and the writing experience would be seamless and intuitive. 

  - It took me at least 5 years of knowing that markdown was a think before I even attempted it
  - Markdown is deceptively simple, so it is too easy to assume everyone will just try it 
  - Even after being forced to try it, which was because of "vibe coding", it took me a while to understand 
  - **IMPORTANT**: We aren't trying to convert users

#### Bring Best Of Markdown To The Mainstream

The amazing AI integration for tab completion, autocompletion, and auto-formatting that occurs in some markdown editors is still something that non-IDE users have very little experience with. We also want to share the magic of having complete control over customizing semantic highlighting because it helps users, especially visual thinkers, manage and navigate their documents with a bit more cognitive ease. 

  - What kept me was consistently being in awe of learning features that are great for writing, but exist nowhere else
  - **OPPORTUNITY**: Bring the magic of those markdown features to standard text writing

### AI Integration

Many of the best IDE markdown tools require AI. This is being called out specifically because the tendency is to push AI integration off until later stages of app version releases. This needs to be integrated from the start to ensure the best user experience. 

  - Implementing AI from the ground up is to create the best UX, but there are risks 
  - Must always find the most "light weight" and best "bang for buck" method when it comes to AI 
  - We should think of our planning as "**AI-first designing**"
  - Always ask: **Can we do this without AI**? Resist temptation to put AI in everything 

---

## Detailing Features & Defining Behavior

### File Management 

### Cross-Device Sync Persistence

### Settings Management

  - Fully Customizable Settings

---

## Line Count Numbers Column

### Selective Digit-Responsive Spacing Behavior

  + **Static Spacing**
    - For 1-digit, 2-digit, 3-digit line count numbers 
    - Maintain current width/display/behavior up to 3-digit line count
    - The spacing is already there to accommodate 3-digit numbers
    - The same spacing remains for 1-digit and 2-digit numbers
  
  + **Adaptive Spacing**
    - For 3-digit or more line count numbers 
    - Each line count digit added after this point should nudge the width the column takes up wider
    - This should push the text over to make room for all 4-digits and comma to be visible
  
  + **Logic Note**
    - This is not the behavior we have now or want for line digit count through any 3-digit line count totals
    - This shift is not a pleasant UX that we'd want to occur regularly
    - Only when moving from 3-digit (999) to 4-digit (1,000), then 4-digit to 5-digit, etc. forever up higher
    - These are infrequent UX instances due to the quantity of lines required
    - Acceptably infrequent UX that is preferable to the alternative(s)
    - Alternatives being either keeping a huge margin or text body shifting for every digit-wide count 

  + **SEE SCREENSHOT**
    - Shows current visibility of any line count number with 4 or more digits
    - `docs/archive/images/4-digit-line-count-number.jpg`

### Left & Right Padding

  + **Left Padding**
    - The spacing with padding behavior right now is perfect
    - This is the space between 1, 2, 3-digit line count numbers
    - When the above adaptive behavior occurs, this left padding stays the same
    - Meaning the space for even 4-digit and wider line count numbers have same left padding
    - This is referencing space all the way to the edge of the app container
  
  + **Right Padding**
    - There is currently very little space between line numbers column and text editor column
    - We should add about as much space as is maintained on the left of the line number column
    - This space is maintained in higher 4+ digit line count number shifts that nudge editor over
    - This space looks empty but upon hover at certain lines, an upside-down carrot v-shape dropdown opener

  + **SEE SCREENSHOT**
    - Current padding in live app
      `docs/archive/images/line-count-column-padding-1-current-space.jpg`
    - Example of padding after change
      `docs/archive/images/line-count-column-padding-2-desired-after-update.jpg`

### Collapsing Range Of Lines 

  - On desktop, only appears when cursor hovers next to applicable line with range
  - Lines with range include headings or the list item of a parent-list with any number of sub-lists
  - Clicking the icon collapses the range, hiding it from view
  - Icon remains visible only for collapsed ranges

  + **SEE SCREENSHOTS**
    - Shows different types of sublists with range, icon visible, and collapsed ranges
    - `docs/archive/images/collapsing-range-of-lines-{1-7}.jpg`

### Colored Line Number Indicator

  + IDE standard behaviors
    - These are two of the various color and/or pattern indications that show up next to line number
    - They both remain showing an edited or added line until a git push
    - The editor in the IDE still auto-saves and if you close the app and reopen it, indicators persist 

  + For our app
    - We want these line indicators to show until a manual save
    - Manual save should be defined as a save from the menu or command+S
    - However, they should not persist after a fresh app re-open

  + Other indicators
    - This example shows green for added lines and another color/pattern for edited lines
    - Please research to see what other line indicators today's current IDEs use

  + **SEE SCREENSHOT**
    - Arrow with a circled 1 points to green color indicator for added lines
    - Arrow with a circled 2 points to blue striped indicator for editor lines
    - `docs/archive/images/line-edit-color-indicator-example.jpg`

---

## List Item Behavior 

### Line Spacing Variations

  - In various circumstances hitting return at end of list item adds double space
  - In other circumstances it adds single (good) but hitting return again moves list item bullet down a line (bad)
  - In every instance hitting return on the proposed auto next line of a list should remove bullet/number 
  - It is unclear why these three behaviors occur in the various instances they do inconsistently

  1. **List item end return adds single space**
     - Preferred *every instance* behavior
     - Return after any list item
     - Bullet point or number is initially presented
     - Hit return again and line changes to plain text
     - This means the second return makes the bullet point/number disappears
     - This means the second return doesn't move the cursor down a line
     - *EXCEPTION* when it is an ongoing list and cursor is ending a sub-list item
  2. **List item end return adds double space**
     - There is *NO instance* where this should happen
     - Hitting return at end of list item adds next bullet point/number with a line space between list items
     - Don't add if it is only one list item and return is ending it
     - Don't add even if there are double spaced lists in the document above
  3. **List item end return adds single space, but subsequent return adds double**
     - There is *NO instance* where this should happen
     - Hitting return at end of list item adds next bullet point/number with no line space as expected
     - Next return maintains the bullet point/number by adding a line space
     - This is when expected behavior is that the icon disappears or downgrades if in a sublist 

### *Exception* Rejoining Sub-Lists

  + **NOTE**: This behavior is currently functional and should not be lost when adjusting behavior to accommodate the above line-spacing issue. 

  - When creating lists with sub-lists that are each started on next line and a tab in from parent list
  - Hitting return to end a list item sub-list should downgrade hierarchy
  - Each downgrade to parent-lists change the indicator, bullet type or number, to match parent list
  - Behavior is that you are "rejoining" a parent list
  - Each time return demotes through hierarchy until top parent-list
  - Which is when the normal return list-end occurs

---

## Problems To Address

### Need for Highlighting Specifics

---

This came up during an update trying to give the todo checkbox a different color when empty versus when when checked, Re: "Now v4.0.0.4 — re-spec the checked-todo color as a ViewPlugin extension since the parser doesn't tag-differentiate", I noted "parser doesn't tag-differentiate" 

is not okay. Will it be something that will only cause 

Other items that we've tried to fix in past updates and the "bug" was never fixed. 

List item bullets or numbers a different color than the list item, and trying to give




Otherwise looks 

I'm searching for my original notes and am bumming the really detailed UI and UX writing I had is gone. I tried to go back in git to get them but in trying to formalize protocols and stuff so that things wouldn't get lost, we deleted branches lol aye. 

  + Not sure where the original description of the UI was but found this in v1 doc 
    - Finder-style column navigation 
    - Column panes "drill down" into the note and each note detail 
    - Instead of auto preview like "Notes" app (and only one awkward column in Apple Notes app): Configurable "post-it" preview snippets per note so you can preview what you want specifically so that, at a high level the app works as a quick reference tool, but the drill down and multi layers makes it a really powerful planning tool. We'd use tags to somehow allow for connecting content as well so that certain drill-down spots would be "auto" created based on the #ProjectTag and then when writing a note within a #ProjectTag you could @tag different notes based on their title
  + Declarative Customization via AI

---