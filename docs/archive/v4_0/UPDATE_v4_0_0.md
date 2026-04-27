# Thot Update Adjustments

**Created**: 2026-03-05
**Version**: v3.1.2 -> v3.3.0 -> v4.0.0
**Updates**: Autocorrect, System File Operations, Persistence Fixes
**Status**: Drafting before planning for implementing 

---

PS: I've moved a lot of files and renamed them in the project directory based on our `.agent/DEV_RULES.md` document that was recently updated. 

---

## Current State Exploration 

  + Recently explored current state documents 
    - High depth of detail needing to be processed `docs/archive/v3_3/v3_2_0_FEEDBACK.md`
    - Addressing most of that current state high detail `docs/archive/v3_3/v3_3_0_DEV_PLANNING.md`
  + Unclear of state 
    - Seems to have been planned, partially started, then fell off `docs/archive/resources/FORMATTING.md`
    - Also planned, started possibly, then fell off `docs/archive/resources/HIGHLIGHTING.md`
    - Thought to be handled but directory mentioned still exists `docs/archive/resources/ICONS.md`
  + Plan and update
    - Seems like some was started or completed `docs/UPDATE_MAP.md`
    - After full assessment must be keep up to date `docs/THOT_APP.md`
    - Should reflect full scope not just current state `README.md`
  + All needs to be synthesize 
    - Make it manageable
    - More focused on what needs to be done
    - What started but not finished
    - What still needs to be done
  + What I know and remember
    - Branches fixed during current state exploration
      - This should be explained in v3_2_0_FEEDBACK
      - And hopefully actual actions taken in v3_3_0_DEV_PLANNING
    - We had been considering building our own semantic highlighting system
      - Instead of dealing with patching together current tools
      - Must completely clear up understanding about how to make tiny changes desired
      - We want this to be for writing markdown and normal text, but both highlighted
      - Very soon we need a user settings UI to customize color on the fly; bullets=yellow, etc.
  + I use the PWA all day, every day
    - I don't like PWA apps and it seems that is also the sentiment online
    - Closing Chrome, when open, closes the app, though it opens without Chrome
    - I do not use Chrome, I use Dia, and the browser wars are on, are we relying on Chrome
    - I'm assuming people use them without knowing, but no one downloads them
    - The norm, and when 'web app' is used, is working in a browser tab, which is fine 
  + Realizing
    - Instances need to sync across devices
    - Web app is highest importance
    - Web app needs to maintain updates and, when it exists, OS/iOS apps need to sync updates easily
    - IDK much about SwiftUI and that CodeX is a horrible walled garden and the AI built in is dated
  + Desktop and Mobile Apps
    - When ready for them
    - It seems like we should be able to find OS-specific features
    - These would be add-on to otherwise great web app that aren't needed but are shiny
    - Other languages can apps that run on Apple devices be written in?
    - Be modular; Apple device app with shiny feature, 'drop' in web app when updated 
  + Ready for next update
    - I started feedback a while ago, restarted recently `docs/archive/v4_0/UPDATE_v4_0_0.md`
    - Brainstorm on SwiftUI `docs/archive/resources/SWIFTUI.md`
    - I keep seeing online from reputable sources "AI loves to write outdated SwiftUI code"

---

## Styling & Design

### PWA Desktop App Title Bar 

This is regarding the app's Title Bar on the app after installing it to macOS, where the normal, unsaved text editor window says just `Thot`

**Actual Behavior**
  + When saved, 'Thot' is written twice like this: 
    `Thot - daily-planner.md - Thot`

**Expected Behavior**: 
  + We want to remove the second '- Thot' leaving just: 
    `Thot - daily-planner.md`
  + Or even just the name of the file is common for other apps 
    `daily-planner.md`

In the browser the web app's SEO Title on the tab is accurate and says just `Thot - daily-planner.md` or otherwise. 

### Line Numbers

Currently the 3rd digit in 3-digit numbers is cut off and the number on wrapped lines of text sits at the bottom of the text wrapped gap in line numbers. Please make only the exact edits indicated below to the CSS. These are the changes I made using the browser/PWA development 'Elements' tool.

In the rendered HTML I selected one of the many lines containing only the `.cm-gutterElement` class, where "element" is referencing the actual line number text. A new line of this HTML is created with every new line added in the text editor.

The selected class in the editor targeted two CSS class groups with the class `.ͼ5` or `.ͼ1`. Both groups are edited in different ways. 

```html
class="cm-gutterElement"
```

  1. Adjustments to CSS class group `.ͼ5 .cm-lineNumbers .cm-gutterElement`
     - Change styling from **width: 18px;** to **width: 25px;** to make 3rd digits visible
     - Completely remove the **align-content: flex-end;** styling to keep line numbers at top of wrapped lines
     - Add new styling **padding-right: 5px;** to create space between line numbers and content on line 

```css
.ͼ5 .cm-lineNumbers .cm-gutterElement {
    width: 25px;
    /* align-content: flex-end; */
    padding-right: 5px;
```

  2. Adjustments to CSS class group `.ͼ1 .cm-lineNumbers .cm-gutterElement`
     - Completely delete the styling **padding: 0 3px 0 5px;** preventing partial line number clipping 

```css
.ͼ1 .cm-lineNumbers .cm-gutterElement {
    /* padding: 0 3px 0 5px; */
    min-width: 20px;
    text-align: right;
    white-space: nowrap;
```

---

## Persistence & Saving Files

### New Unsaved Windows 

We have one "draft pad" that works well in that it auto saves and you don't need to find the file. This doesn't work for new windows created and so they are just lost when the app is closed. Even if you save a window and keep working, you don't get auto-saves and it just is the state you had when you choose save from the menu. 

### Managing Saved Files 

I want to say, so let's make it so that new windows auto save just like the draft pad does. I'm not sure the interface for that yet. 

---

## Share Links 

### Convenience

These aren't helpful because they open, if they open, to a new instance of the app and not what you're sharing. In some devices it does open the text as if I copy and pasted the text to a new app. This is confusing and not what we want exclusively, but also probably do want, just not called sharing. 

### Collaboration 

I keep thinking about Google Docs. If we were the best semantic highlighting, markdown friendly, text editor out there, then they would be the competition. They are why users would expect the share links to work the way described above. They are also why users would expect live multi-user editing of the same document. 

---

## Vercel Updates 

Right now every time I push my changes to this document for example, I get an email saying that Vercel isn't working because of permissions. I looked generally and it doesn't have to do with my login and it is connected to the GitHub repository, so it might have to do with branches. I do know now from a different project that we could be using our custom URL with the prod env in Vercel and then set up a testing/dev env in Vercel and that sounds like what we need to do. 

    Set up Vercel env properly for prod and dev. Right now I get emails saying it fails to push. 
    Seems to have worked with dev pushes in the past (May 3) but now failed. 
    `https://thot-oynmtx739-seanivores-projects.vercel.app`

    Can we set it up so that prod only updates when something pushes to main branch and associate `thot.august.style` with that env. And then set it up so that dev pushes to a dev env and we can just use a Vercel created URL to test on HTTPS. 

---

## Notes Collected Over Time 

- Would it be possible to build the SwiftUI wrapper in a modular way to "drop" in updated PWA app over time

- Pasted curly single and double quotes are not changing to the "straight quotes" and 'straight single quotes' that we use when typing like they should. 

- Thot app idea — app lives in main desktop toolbar. User can hover over it → quick type a thought → get back to work. This way there is no context switching, just capture and move for flow. These would go to a master top-level draft-pad; a phase 1 of the "notes" flow that drills down deeper into projects and tasks using columns like in Finder  

- The "->" characters do not create a nice arrow like editor does in IDE, sort of like this emoji but not as short 

- Sync across devices
- Auto-save for any file
- New document titled with date and military HH:MM
- Settings option to change new note name
- App always reopens to all open windows and tabs
- Tab view on PWA with default setting option
- Setting space to choose new doc template
- New doc template has just date and time H1
- Share URL opens in app as read-only
- Passkey, G login, Apple login
- Option to share to user as editable
- All unsaved 

---

## Update Feedback 

  + Lines do not wrap consistently.
    - It appears they stop wrapping if the VW is under 1040 px.
    - To be clear: There is virtually no situation that we would want lines not to wrap, at least not as the default; this includes much more narrow widths, different devices, and when different formatting is applied, etc.

**Though we are creating a markdown app that has use cases that sit adjacent to development and using code, Thot App is intended and designed for use as a text editor that just happens to implement some of the functionality you find when writing in an IDE's editor, especially in Markdown.**

Let's make sure that things always paste as plain text without formatting or matching formatting 

Lines that follow a list directly are adopting the list formatting and shouldn't be. 

When making a list and a line break was added in the list, as you type and create more list it is adding line breaks before the next bullet. Let's adjust the list creation helper to stop this behavior; if the user wants a line break they can add a line break manually then start a new list. 

When adding a hyphen directly under a line of text, it turns it all orange and bold. I think this has something to do with frontmatter, however it happens even with just one `-` when I believe frontmatter requires more than one hyphen. This should also be adjusted so that it only happen when at the top of a document/page. Change the color of frontmatter text to a pale yellow because right now it is the same orange as headings which is confusing. 

When a to do checkmark box is checked with `x` it should change to a darker blue than the current bullet point blue. 

---

## Sketch Of Characters Used In Markdown 

Found and want easy quick way to create branch trees but also flow charts that AI often makes in architecture documentation or technical docs. This needs to be discussed for specifics, of course. 

  ├── `OPTION + COMMAND + RIGHT ARROW`
  ├──
  └── 
      ├──
      └──


│ ─ ├ ┼ ┌ └ ┐ ┘ ┤

┌────────────┼────────────┐
└────────────┼────────────┘

---

## Save Updated 

I love in Anti-Gravity when you COMMAND-S and there's a messy chart made in the document, it automatically perfects it. Can we implement this into Thot's markdown 

---

## Forward Thinking Becoming More Urgent 

In updating my portfolio and working with recent clients I'm realizing that my selling point is creating tools that have some kind of AI element. Building a website for a client, we are making a custom AI pipeline that removes for her all friction for updating the website: `/Users/seanivore/Development/everlastings-website/assets/docs/archive/v1_4/v1_4_2_IMPL_GUIDE.md`. 

And so it is becoming clear that, particularly the web app, seems to need an AI element. 

I love tab predictive text in Cursor and Anti-Gravity when writing normal text documents in there like this one. Why Google doesn't have anything like that in Google Docs is beyond me. Right now, no one who doesn't use markdown, in a modern IDE, has any idea that you can fix the formatting of a document in under a minute instead of literally a half hour. 

There are so many other little element just like this popping up in apps I use everywhere. In Dia, when you open a new tab from inside of a page's link, and it recognizes that they are similar type of pages, it groups them in a tab group and even labels the tab group for you. 

Speaking to recording devices that people use during meetings, I've seen commercials now where even the formatting is already done for the user before they even open the notes. 

There are so many possibilities for what and how to use AI in Thot, and it is starting to seem like this is a ground-up type of feature build, unlike we had originally planned. There are so many other apps that are used historically and still by anyone not really trying to keep up with AI that have zero of these features. That kind of open market seems like a no brainer. 

An email from Stripe came through the other day saying they have tools now so that you can charge or be charged for token usage. There was even another article that came through about how they're setting up payment/purchase systems that are specifically for agents. Not sure the ladder is necessarily applicable here yet, but the former sounds possibly helpful. 

So this opens a lot of new things to explore that should be properly identified, researched, planned, and then written first into an implementation plan that is looped until we find all the gaps. 

For instance, does the web app have a login feature. Because if there is collab with other users and advanced AI tools to upgrade to, then yes. 

The collab with other users thing, as an alternative for opening an actual IDE, and having live editing in markdown with other humans in your office, seems like a huge feature that I would pay for as a service if I was a company, particularly if I was actively moving towards more AI focused teams. It begs the question, how do developers do this currently? Just with like PRs when editing an, essentially, text document? I guess, given my experience now using tools built by programmers who aren't designers, I shouldn't be surprised. Nonetheless the point is it is a huge opportunity. 

Okay lots of things, not just to think about, but to assess based on the current state, so I'll leave off here. 

---

## Business Planning 

Last note I just remembered to add is that we need to also be planning for roll out. I love how the research, rounds of iteration, and then final documents came out in my other project, which you can find in the directory here. 

`/Users/seanivore/Development/data-edger/docs/research/` 

We should plan how to do the same. I also think we could do it in a way that will help in the future by making a guide and putting it in `.agent/...`. In that DEV_RULES document there is a mention of the custom command and script set up to update any file based on args. We should investigate that tool because I tried it unrelated to when it was created, details for which might actually be in one of these two `docs/archive/v3_3/v3_2_0_FEEDBACK.md` and `docs/archive/v3_3/v3_3_0_DEV_PLANNING.md` documents. There might be next setup steps I'm missing. Anyway it came come mind because if we made a business plan protocol document with details on doing market research, etc. then we'd want to use that script command for that too. Actually I'm remembering that the agent DID use the command to update the DEV_RULES file, so I'm not sure what is wrong but I'm hoping, when helping me get through the massive amount of CURRENT STATE notes it reported, you can help me with that too. 