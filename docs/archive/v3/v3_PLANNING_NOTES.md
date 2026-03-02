# Notes On v3 Development

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

  1. For the **CURRENT BUILD UPDATES**, we can create `docs/archive/v3/v3_USABILITY.md` for the implementation planning, and then set it off on a similarly named branch `v3-usability`.
  2. For the **PROPRIETARY HIGHLIGHTING SYSTEM**, we can create `docs/archive/v3/v3_HIGHLIGHTING.md` for the implementation planning, and then it can use this current branch that we're on now, which is branch `v3-rainbow-moat`. 
  3. For the **INTELLIGENT FORMATTING UI**, we can create `docs/archive/v3/v3_FORMATTING.md` for the implementation planning, and then set it off on a similarly named branch `v3-formatting`.

  + You may need both of these documents for details as well: 
    - `docs/THOT_APP.md`
    - `docs/UPDATE_MAP.md`

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
  - E.g. if 

## Requirements

### 

