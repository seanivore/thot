# Thot v2.0.0 "First Thots" Feedback

**Version**: 2.0.0
**Dated**: February 13, 2026

  + This is responding to the build as we work through, and have almost finished: `docs/archive/v2/v2_0_0_UPDATES.md` 
    - Previously named file `docs/FIRST_THOTS.md` now `v2_0_0_UPDATES.md`
    - Will need a completed and extended version of that architecture and more all-purpose document 
    - That should be here: `docs/THOT_APP.md` (currently just a template)

---

## Summary

  1. Git branch protocol planning and implementation 
  2. Indentation not holding on natural line wrapping of paragraph or lists 
  3. Plain color wipe out too early on indent, should wait until tabbed past initial start of first line 
  4. Theme tag label highlights in `theme.ts` are incomplete and inaccurate as compared to `theme-reference.ts` and updates below 
  5. Hierarchial tag label rules seem to be missing completely, have been created for implementation below 
  6. Code language highlighting in code blocks not working (no highlighting at all, though this much might be the hierarchy) 

---

## Git Branching Protocol

* **Professional versioning & repository hygiene details**

  > Git flow: `main` is default with **no direct commits** and `v2-first-thots` is all v2 product line 

  + Completed builds moved to protected, only fast-forwarded, branch `main` 
    - Use semantic tags with version number e.g. `v2.0.0`, `v2.1.0` once stable
    - E.g. `v2.X.X-first-thots` – whatever version the first fully shippable build is 

  + `v2-first-thots` primary active dev for this product phase and 'First Thot' product line 
    - Future major phases can branch off, e.g. `v3-organization`, `v4-ai-customization`
    - Short-lived feature branches prefixed `feat/` or `fix/`; merged into `v2-first-thots` via PRs
    - E.g. `feat/spell-check`, `feat/export-save`, `feat/counter`
    - Good practice for when we already have a working solid build like right now 

  + Docs discipline, have any non-trivial changes that alter behavior paired with 
    - An update to `v2_0_0_UPDATES.md` (if it changes the version updates), or
    - An entry in a future `docs/CHANGELOG.md` to be created 
    - And the main -single-source-of-truth `docs/THOT_APP.md` 

---

## Indentation Issues 

### 1. Text Wrapping Not Maintaining Indentation

  + When typing in a block of text — standard paragraph or either types of lists with really long items that wrap — the wrapped next lines must adhere to the indentation at which the first line in the block of text started. Let me know if you need pictures of what I'm talking about. 
  + This is **NOT** how a normal word processor would work which is maybe why it doesn't, but since markdown it traditionally written in an IDE, the text is treated more like code. 

    - Plain text in a long paragraph
    - An unordered list item that is long and wraps around 
    - An ordered list item that is long and wraps around 

### 2. Text Block Indentation Far Past First Line Changes Color 

  + Traditionally in markdown, when you highlight a block of text, that could be a list of either kind or just a paragraph, it changes to the same color as 'plain text' in a code block, when you tab too far past the first line of text 
  + In the app, the change to a solid color happens when you are AT the indent of the line or line with return in-between you and the line you are trying to indent 
  + It is the wrong color, green like everything else wrong, but that is because of all the incorrect highlight colors in the next number
  + It needs to be able to tab over about two past the line above in case your creating a sublist 

--- 

## Highlight Issues 

### Highlight Tag Prioritization 

- After doing this, I finally think I understand TextMate and currently prefer it. When I use the "Developer: Inspect Editor Tokens and Scopes" I can see the hierarchy and the one at the top is what highlights the tagged text.
- I'm pretty sure that is the main problem with the tags highlight colors. There are one or two missing, but other than that it just looks like they are not prioritized correctly.

* **CREATED FROM TOP TO BOTTOM, IN ORDER OF PRIORITY**

  + The highlighting and styling of those at the top (closer to 1) overpowers any lower ranking label
  + Color always follows this rule
  + Styling has two categories:
    - Some FULL overpower only showing their style
    - Some BLEND applying their style but retaining the lower ranking label's color 
    - Example: A bold text that is crossed out still maintains bold font but with the new color and additional new formatting applied (blended)
    - Example: No matter where inline text is placed, even in a header that is also bold, the inline text eliminates the bold to apply both color and formatting of the inline code text only (full)

* **THIS IS THE LOGICAL HIERARCHY WE NEED TO APPLY TO THE APP HIGHLIGHTING** 

  1. `strikethroughMarker`, and `strikethroughContent` (previously just strikethrough) **BLENDS**
  2. inlineCode, inlineCodeDelimiter, and blockCodeDelimiter (previously just codeDelimiter) **FULL** 
  3. codeBlockContent and checkbox **BLENDS**
  4. boldMarker, bold, italicMarker, and italic (previously just bold and italic) **FULL**
  6. tableMarker and tableContents (previously just table) **FULL** 
  7. headingMarker and headingContent (previously just heading) **FULL**
  8. bulletMarker, bulletContent, numberedMarker, and numberedContent (previously listMarker and listContent) **FULL**
  9. blockquoteMarker and blockquoteContent (previously just blockquote) **FULL**
  10. foreground 

---

## Highlight Annotated App Screenshots 

+ I used images of IDE compared to the Thot theme to show visually the mistakes. 
+ It resulted in much clearer need for priority and for missing tags 
+ I've not done all of the images I took 
  - Stopped when it became clear that `src/theme.ts` was not accurately created 
  - An agent must have thought they could simplify and have creative freedom 
  - This broke the logic and the very carefully created pattern 
  - The colors and number of tagged highlights should be the same 

* **While many of the issues will be fixed by applying the hierarchy above, there are still other changes to be made below such as new classes**

### 1. Heading Markers
`docs/images/bugs/IMG_bug-v2-review_1.jpg`

`headingMarker` should be same as `heading`
  + IDE scopes didn't appear to need a differentiating label for both
  + thot needs a label for both
  + "span.ͼ9.ͼh" is the ### pound notation or `headingMarker`
  + "span.ͼ9" is the heading or `headingContent`

### 2. Bold Markers 
`docs/images/bugs/IMG_bug-v2-review_1.jpg`

`boldMarker` should be same as `bold`
  + IDE scopes didn't appear to need a differentiating label for both
  + thot needs a label for both
  + **ADD** `boldMarker` to `src/theme.ts` and `src/theme-reference.ts`
  + Make it have ExtraHeavyBold styling in #FFD866
  + `bold` will need to be updated to the ExtraHeavyBold styling as well

### 3. Missing List Type Labels & Foreground Given Priority 
`docs/images/bugs/IMG_bug-v2-review_1.jpg`

* **Issue 1**: Add differentiation between ordered and unordered lists

  + Already exists on `src/theme-reference.ts`
  + Make edits to `src/theme.ts`
      - **REMOVE** listMarker: '#dfc532',   // Gold
      - **REMOVE** listContent: '#5feda4',  // Mint
      - **ADD** bulletMarker: '#dfc532',   // Gold, bold
      - **ADD** numberedMarker: '#ff6b6b', // Red, bold
      - **ADD** bulletContent: '#8aeefb',  // Cyan
      - **ADD** numberedContent: '#f8a5c2', // Pink

* **Issue 2**: Highlight rules are ignoring listContent for foreground

  + `listContent` needs to be replaced, per issue 1
    - Currently its class "span.ͼm.ͼz" showing #e6e6e6
  + `listMarker` needs to be replaced, per issue 1
    - But currently it is class "span.ͼm.ͼh" showing current accurate color 

### 4. Code Tick-marks Behave Two Ways 
`docs/images/bugs/IMG_bug-v2-review_1.jpg`

`codeDelimiter` on `inlineCode` should match 
`codeDelimiter` on `codeBlockContent` holds its color 

  + This means we need to create two labels for ticks used for code
    - `inlineCodeDelimiter` should be #F34D3E red-orange, just like `inlineCode`
    - `blockCodeDelimiter` uses the same `codeBlockContent` as plaintext, #8989e3 a light-purple 

### 5. Code Blocks Never Change from Default Plaintext 
`docs/images/bugs/IMG_bug-v2-review_1.jpg`

`codeBlockContent` should change based on type of `codeLanguage` 

  + I've updated `codeBlockContent` to #8989e3 a light-purple
    - This is the color it defaults to
    - This is the "plaintext" color
  + The problem is it doesn't adjust based on `codeLanguage`
    - It should change for language
    - Show HTML, CSS, bash, etc. all differently
  + I remember doing this in HTML for a project and it was super easy! It was my first portfolio

### 6. Chart Colors Never Change from White 
`docs/images/bugs/IMG_bug-v2-review_2.jpg`

`tableMarker` and `tableContents` should be changing #e2ff79 lime according to `src/theme.ts`

  + Based on other situations, we probably should change the old `table` label in to two

### 7. Horizontal Rule Page-break Is Not In Theme 
`docs/images/bugs/IMG_bug-v2-review_2.jpg`

`horizontalRule` is on `src/theme-reference.ts` but not `src/theme.ts`

  + It should be listed as #93f9c6 in mint
  + Hyphen characters should change when applied in 3
    - If you add ---- then it does not render a full horizontal bar from L to R
    - When you add --- normally they clamp together, indicating it worked

---

## Code Language Unique Highlights Not Working 

### Code Blocks Potential (?)

  + Does something like this from my old portfolio project's HTML that was added to highlight the code based on language help at all? 
  + How can we get various code languages highlighted properly in 'thot app'? 

```html
    <!-- Include prism for code snippets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />

        <div class="content-wrap">
            <div class="code-card">
                <pre class="language-javascript">
                <code>
                class MCPToolManager {
                    private tools: Map;
                
                    registerTool(tool: Tool): void {
                    this.validateTool(tool);
                    this.tools.set(tool.name, tool);
                    }
                
                    async executeTool(name: string, params: any): Promise {
                    const tool = this.tools.get(name);
                    if (!tool) throw new Error(\`Tool \${name} not found\`);
                    return await tool.handler(params);
                    }
                }
                </code>
                </pre>
            </div>
        </div>

    <!-- Include prism scripts for code snippets -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>  
```
---

## Tasks Update Assessment Notes 

  + To be organized into Phase 7
  + Others to be added to a new `docs/UPDATE_MAP.md` document 
  + Use the PWA SwiftUI wrapper note to help us decide what should be updated when 

### Definitely Add 

#### Adding " " or ** ** Shortcut from Markdown UI 

  + When you highlight a word in markdown and then hit SHIFT-* for example 
    - It adds the * to both sides of the word automatically 
    - Click a second * and it adds two to either side of highlighted region 
  
  + It does this for all characters that have one on either side — you have to click the first of the two 
    - 'Single quotes'
    - "Double quotes" 
    - (Parenthesis) 
    - {Brackets and curly brackets} 
    - `delimiter tick marks` 
  
  + This is a feature I use CONSTANTLY and would love it in this update 

#### Counter for Words, Characters, Tokens 

* **This is important for my normal use** 

  + It should include: 
    - Word count 
    - Character count with spaces (I've never encountered a need for without though if weird to do one and not the other then add both)
    - Token count (probably the most important these days)

* **Consider timing of means of adding based on PWA SwiftUI Wrapper note** 

  + I'm thinking we'll probably want to add the planned UI using SwiftUI because it add weight to our use of PWA 
    - So we should either just add the functionality and keep it out of the way 
    - Or place it on status bar as things stand now 

  + Out of way might look like a menu like "File" or "View" 
    - Could just be "Count"
    - It would should all four count types at onces nicely labeled and separated 
    - Nothing else in that menu 
    - Updates live so anytime User looks it would be accurate 
    - Clicking on any one of the four counts would copy that number 

### Spell Check

  + Need to add spellcheck urgently 
  + "subtle save indicator" can be delayed for SwiftUI 

### Improve Mobile Responsiveness 
  
  + We don't yet have a mobile test environment yet 
  + Should note that iPad is way more important than mobile 

### Clear Content; Export, Import versus Save, Open 

  + I'm not a fan of 'clear content'
    - Feels weird to have a "clear content" button at all 
    - "Export" and "Import" are just confusing and shouldn't be done until we plan save/open 

  + Does it make more sense to use native file system tools in SwiftUI wrapper 

  + **NOTE** Currently CMD-N opens new window that shows duplicate text 

  + **NOTE**: Right now though it would be great if we could make it so that <kbd>CMD + S</kbd> just nudges a normal auto-save 
    - Right now it opens a window more like save-as and you obviously can only save as HTML 
    - My main reason for mentioning this is because I compulsively hit CMD + S and it opens a window every time 

  - Eventually it would be nice to have it print too; to start, not anything other than actually printing the markdown just like you see it in the app

### Export to SIMPLE PDF

  + I want to start this off SUPER simple by basically making it the markdown without the markup notation, solid text colors, different siz for headers
  + But otherwise we don't really need to mess with spacing or even the font 

### Preferences UI that makes changing highlight colors super easy

  + This frankly I would love
  + The user could even create 'project themes' or maybe different sections of the column view drill-down would be give different scope highlight colors so that it is immediately recognizable if you're in the right section of your notepad 

### Standard RTF Option 

  + Somewhere along the line it would make sense to give users who don't like markdown an option to use the app too 
  + It would be really fun to sort of try and reinvent a UI that is as convenient as markdown for formatting plain text 
  + Almost like a little context menu but with super prominent keyboard shortcuts written on the places that a RTF user would otherwise click to make something a heading or bold, etc. 

### Formatting 

#### Font Sizes 

  + HEADINGS 
    - I changed the headings so that they're the same size as the rest of the document
    - Please leave them this way 

  + ALL TEXT FONT SIZE 
    - The normal font size displayed was 16pt which was HUGE 
    - We want to make sure it is 12pt or equivalent rem 

  + **NOTE**: I tried to change the font size myself; headings worked but the rest of the text size changes I can't seem to figure out how to get to change reliably; here is what happened, maybe you can explain why: 
    - I changed the font size to 12pt 
    - I ran `npm run preview` and hit refresh and it didn't work 
    - Thinking maybe I just missed it, I changed it to 10pt and tried again 
    - Used incognito window after `npm run preview` and nothing happened 
    - A minute later I hit refresh again, and suddenly it all changed from 16pt to 10pt — IDK why the delay and inconsistency that follows 
    - I went to change it back to 12pt, ran `npm run preview`, tried incognito, tried hard refresh and nothing 
    - SO — it is still all TINY and I can't get it to change 

  * **What would make it inconsistent in its application of changes?**

    - I know we keep /dist/ ignored and so it doesn't always update in the repository 
    - Maybe we should let it update so that we can reference it for things like this 
    - Then when a build it debugged and going to be pushed, we can hide it again 

#### Fonts Update 

  * **I'd like to add the following fonts for the indicated purposes** 

  + BASICS 
    - Make normal font use Medium `src/assets/fonts/JetBrainsMonoNL-Medium.ttf`
    - Standard bold should use ExtraBold `src/assets/fonts/JetBrainsMonoNL-ExtraBold.ttf`
    - Standard italic should use ExtraBoldItalic `src/assets/fonts/JetBrainsMonoNL-ExtraBoldItalic.ttf`

  + OTHER FORMATTING 
    - The blockquote should use ThinItalic `src/assets/fonts/JetBrainsMonoNL-ThinItalic.ttf`
    - The strikethrough, comment, frontmatter should use Thin `src/assets/fonts/JetBrainsMonoNL-Thin.ttf`
    - The standard quotedText, math, linkURL should use (regular) Italic `src/assets/fonts/JetBrainsMonoNL-Italic.ttf`
    - The footnote, htmlTag, bulletContent, numberedContent, numberedMarker, bulletMarker all should be using Regular 
      `src/assets/fonts/JetBrainsMonoNL-Regular.ttf` 
    - The linkText should use (regular) Bold `src/assets/fonts/JetBrainsMonoNL-Bold.ttf` 
    - Anything that was otherwise using BoldItalic can still use it, not sure what is left, if anything 
      `src/assets/fonts/JetBrainsMonoNL-BoldItalic.ttf`

  * **New fonts added bring total font list to the following**

  + They are all from the `JetBrainsMonoNL` family, appended using a hyphen with the following styles: 

    1. Bold — `src/assets/fonts/JetBrainsMonoNL-Bold.ttf`
    2. BoldItalic — `src/assets/fonts/JetBrainsMonoNL-BoldItalic.ttf` 
    3. ExtraBold — `src/assets/fonts/JetBrainsMonoNL-ExtraBold.ttf` 
    4. ExtraBoldItalic — `src/assets/fonts/JetBrainsMonoNL-ExtraBoldItalic.ttf` 
    5. Italic — `src/assets/fonts/JetBrainsMonoNL-Italic.ttf` 
    6. Medium — `src/assets/fonts/JetBrainsMonoNL-Medium.ttf` 
    7. Regular — `src/assets/fonts/JetBrainsMonoNL-Regular.ttf` 
    8. Thin — `src/assets/fonts/JetBrainsMonoNL-Thin.ttf` 
    9. ThinItalic — `src/assets/fonts/JetBrainsMonoNL-ThinItalic.ttf` 

### User Interface 

#### macOS, iOS, iPadOS SwiftUI light wrapper

  + I thought of this randomly the other day and quickly web searched it and it is apparently a thing 
    - "How to Publish a Progressive Web App (PWA) on the iOS App Store Using SuperPWA – Super PWA Docs" 
      `https://superpwa.com/docs/article/how-to-publish-a-progressive-web-app-pwa-on-the-ios-app-store-using-superpwa/`
  
  + Apple T&C 
    - I dug around this too, Re: PWA in the App Store and basically it just shouldn't be clearly just a website 
    - We already have more than that, and given we tried SwiftUI first, I'm betting we'd be good 
    - What if we built the actual "Column view" UI in SwiftUI with the PWA simple thing we have now just inserted as the screen

  + I saw someone last week on Twitter say they were building the EXACT same thing in SwiftUI that we tried — shows interest 

  + Plus it would be super easy to find ways to use native functionality 
    - Obviously UI stuff and file system access would be there, spellcheck, speech-to-text, haptic feedback
    - We could easily take things a step further with things in integrating with reminders, porting over from Notes App 
    - How could would it be if on any not just writing @02/14/2026-7pm and BOOM you get a reminder (or at the very least, notification) 
    - All the "Share to" options for sharing directly to mail or messages, etc. 

  + Not sure where the original description of the UI was but found this in v1 doc 
    - Finder-style column navigation 
    - Column panes "drill down" into the note and each note detail 
    - Instead of auto preview like "Notes" app (and only one awkward column in Apple Notes app): Configurable "post-it" preview snippets per note so you can preview what you want specifically so that, at a high level the app works as a quick reference tool, but the drill down and multi layers makes it a really powerful planning tool. We'd use tags to somehow allow for connecting content as well so that certain drill-down spots would be "auto" created based on the #ProjectTag and then when writing a note within a #ProjectTag you could @tag different notes based on their title 

#### Declarative Customization via AI 

  + Config files (`PreferencesModel`/ JSON) that defines 
    - Layout (columns, panes)
    - Editor preferences (font, theme, behaviors)
    - Note metadata (tags, pinned/priority)
  - An AI layer that translates natural language → config changes 

---

## Final Planning Thoughts 

+ v2.0.0 
  - Fix the highlighting with new additions and proper prioritization so it displays highlighting properly 
  - Fix the font size to 12pt 
  - Fix the indentation issue 

+ v2.1.0 
  - Spellcheck 
  - Counter 
  - Any updates unrelated to UI 

+ v2.x — any other rounds before UI 

+ v3.0.0 
  - SwiftUI wrapper 
  - Break down the UI plan in to logic sub-steps 
  - UI for changing colors of highlights etc. 
  - Light view 
  - Initial columns 
  - Etc. broken down into number of v3 updates 

---