# Items To Integrate Into Plan

**Created**: 2026-05-20
**Updated**: N/a
**Version**: v5.0.0 -> v5.0.1

## Overview 

This document is to record ideas, gaps, anything that comes to mind and you want to make sure it gets properly placed in the high level feature planning document. Use it until there is an updated `v5_0_1_IMPLEMENT.md` version or higher, then start a new document when ideas arise. 

--- 

## Traditional Outline Support 

Ideally be able to create this with very little effort. It did not take very little effort. Word used to be SO EASY to create beautiful outlines but even in G Docs it is difficult these days. 

**PETA Marketing & Social Media Achievements**

I.   SOCIAL STRATEGY & PRODUCTION
     A. __Our First Viral Moments__
        1. *Viral UGGs Image in Tweet Published in YahooNews* 
           (a) The strategy
           (b) The results 
           (c) Big picture
        2. *Witty Superbowl Tweet Goes Viral*
           (a) Why live coverage
           (b) Our process
           (c) Spotted an opportunity
           (d) The execution
        3. *The Same But Different*
     B. __Leveraging Engagement To Influence Culture__
        4. *Hijacking the #AskSeaWorld Online Campaign*
           (a) SeaWorld's dumbest PR campaign
           (b) Our opportunistic strategy
           (c) The results
        5. *Ranked #1 in Engagement Across All Industries*
           (a) Beating industry benchmarks
           (b) Getting personal recognition
           (c) How we achieved it
           (d) Important results
II.  STRATEGIC ARCHITECT & OPERATIONAL LEAD
     A. __Award Winning Viral Video Campaigns__
        1. *Cursing Vegan Grandma Is 'Funny For Good' Award Finalist*
           (a) Rare humor genre viral sensation
           (b) By the numbers
        2. *Graphic Horror For Luxury Shoppers Takes First Place*
           (a) Shoppers Horrified When They Realize Their Luxury Leather Purse Was Alive
           (b) By the numbers
III. MARKETING INNOVATIONS & PERFORMANCE OPTIMIZATION
     A. __Identifying Where To Improve The Organization Next__
        1. *Mobile App Optimization*
           (a) PETA's Direct Action iOS App
           (b) iOS Messages Sticker App
           (c) Cruelty-Free Product Database iOS App
        2. *Game Development Strategy Improvements*
           (a) Playstation-born
           (b) Game development agency consulting
           (c) UX strategy implementation

---

## Custom Highlight Delimiters 

Creating the outline above, particularly before it was in an actual outline form and was just tab indented, I find myself wanting to make multiple lines bold, but getting to visually confused when I do that. I tried using the __bold__ with the **bold** but we need something more than just *italics* and bold, and shouldn't have to resort to using `code` font to do this. It is cleaner to have something that isn't multi-use, and if users can pick their scope colors then there might as well be options to create custom scopes. Maybe •this• would do something. Or -this- might work. We would want to suggest some options just so they get it and don't need ot hunt for open characters to choose. +This+ and ,this, and well when you start looking at what comes up when holding down option and a character, that's a bit deep for most people to have any idea where to find the same character multiple times. 

---

## Declarative Everything 

*Three paragraphs later and Thot app is becoming something far more substantial* 

A bold move would be to lean hard into having users change settings and preferences, etc. by chatting AI, effectively pulling them out of the UI menus and options. This is starting to happen with Claude Code, but the flow isn't natural. Maybe it is a dedicated "subagent". Maybe you message specific subagents similar to how you would human coworkers, but tagging a handle. Something like `@config agent, can you change the default font to...`. Maybe even just `/config` could work. 

This could be built out and declaratively customized by the user for their specific needs, like, @config we need an SA that facilitates all of the necessary steps for our business planning research from `.agent/RESEARCH_PROTOCOL.md`; they should intelligently customize the needs and process rather than follow the protocol unthinkingly exact. This `@budget` agent should ping us with updates every time it is about to do something that costs money and is not in the existing budget plan. We also need to set up a `@daily` updates SA that pings us every morning with a news wrap that gives us tabs on all of the ongoing projects as well as all of the tasks running by various agents. Like a good manager, I'd also like to just generally know what all the SA are doing, so that we can get them a task if they need one. In fact, `@todo` could be used by everyone to add information that any SA can reference to find work. 

We need a middle management SA to maintain the document, prioritize it, nudge lazy SA, and generally keep things moving along. This SA would also be the one responsible for REVIEWING AND ASSIGNING the update of project documentation by an SA that makes sure everything is up to date, which would probably be on the @todo list. However, let's call them `@logist` (with full logistic alias setup for better UX). I would call them `@manager` but I feel like we should save that for now like what will we use for an agent who is handling one project specifically if not `@manager` because `@pm` is confusing (private message) and `@proj` is vague. I guess it could be `@pm-{project}` though. Anyway, 

---

## Document Maintenance 

### Document Templates 

For example, when we need a new document for these kind of notes, it would be nice to have a shortcut. Ideally these would be facilitated, created, maintained by AI. Perhaps the template is prepared in frontmatter and accessible in the Preferences UI to add/edit/delete them, but also easily accessible in the Project Directory. 

Perhaps we build out the usage of `.agents/...` for this purpose since it seems like all the new skills that come out are finally using that instead separate `.claude` and `.cursor` folders. I think that is accurate but I guess all I know 100% is that when I select to add a skill like we did `npx skills add heygen-com/hyperframes`, it walks you though a series of preference questions for global or just in that project, as well as for which AI model or tool you are using and when I selected Claude Code it created them in `.agents/` and notably NOT in `.claude/`. This is true globally as well, and we did use the skills already so it appears Claude Code does easily locate `.agents/` directory contents. 

### Auto-Archiving

We currently build our documents directly in an `.../archive/...` directory because it ensures that no one has to manage, and therefore change forgetting, moving documents when they have become outdated, merged into another document, etc. 

### Auto-Versioning 

The same could be done for document versioning. 

Additionally, a way to manage and prevent the conflicts that occur with GIT when you use `.` instead of `_` when adding version count to filenames. 

Perhaps there is even a method of smart but subtle UI that might make adding filename versioning unnecessary. This would need an option to turn it off for users who need to have it in their filename because of the rest of their workflow and team. 

### Optimized Resource Document Syncing 

We use `filemgmt` terminal command. How can this be easier. 

---

## Status Bar Defaults 

  - Character count with and without spaces 
  - Word count that adapts if something is selected 
  - Token count with options for different models 
  - Line and column count 
  - Tab width that doesnt keep resitting itself like AntiGravity is right now 

---

## Web App

Integrations for login, file directory

If Github is linked and used for login, can we actually write and edit files, too? How does claude.ai/code handle this because it seems to download a repo and I don't recall if it ever mentioned Git. 

Want the dev options available without confusing other users. 

Login with Apple or Google may ot may not mean to save files there. 

Consider how Google Docs function. Export brings up normal OS save Finder window. 

## Native App Wrapper Functionality

Set ourselves up to easily swap in device spelling and autocorrect 

