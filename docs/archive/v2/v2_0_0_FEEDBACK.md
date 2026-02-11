# v2.0.0 Feedback

## Overview 

  1. Inaccurate and incomplete highlighting labels  
    + The `src/theme.ts` document is inaccurate and incomplete 
    + This is causing a number of issues; compare to `src/theme-reference.ts` and update 
    + I made some changes that were wrong from the dated original TextMate it was copied from 
  2. Tag highlight label missing hierarchy  
    + It doesn't seem like they are behaving in a logical order of priority 
    + This and a completely list should fix most issues 

### Highlight Tag Prioritization 

- After doing this, I finally think I understand TextMate and currently prefer it. When I use the "Developer: Inspect Editor Tokens and Scopes" I can see the hierarchy and the one at the top is what highlights the tagged text.
- I'm pretty sure that is the main problem with the tags highlight colors. There are one or two missing, but other than that it just looks like they are not prioritized correctly.

* **IN ORDER OF PRIORITY**

  + The highlighting and styling of those at the top (closer to 1) overpowers any lower ranking label
  + Color always follows this rule
  + Styling has two categories:
    - Some FULL overpower only showing their style
    - Some BLEND applying their style but retaining the lower ranking label's color 

  1. strikethroughMarker, and strikethroughContent (previously just strikethrough) **BLENDS**
  2. inlineCode, inlineCodeDelimiter, and blockCodeDelimiter (previously just codeDelimiter) **FULL** 
  3. codeBlockContent and checkbox **BLENDS**
  4. boldMarker, bold, italicMarker, and italic (previously just bold and italic) **FULL**
  6. tableMarker and tableContents (previously just table) **FULL** 
  7. headingMarker and headingContent (previouly just heading) **FULL**
  8. bulletMarker, bulletContent, numberedMarker, and numberedContent (previously listMarker and listContent) **FULL**
  9. blockquoteMarker and blockquoteContent (previously just blockquote) **FULL**
  10. foreground 

--- 

## Annotated Images 

+ I used images of IDE compared to the Thot theme to show visually the mistakes. 
+ It resulted in much clearer need for priority and for missing tags 
+ I've not done all of the images I took 
  - Stopped when it became clear that `src/theme.ts` was not accurately created 
  - An agent must have thought they could simplify and have creative freedom 
  - This broke the logic and the very carefully created pattern 
  - The colors and number of tagged highlights should be the same 

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

### 3. Missing List Type Labeles & Foreground Given Priority 
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

### 4. Code Tickmarks Behave Two Ways 
`docs/images/bugs/IMG_bug-v2-review_1.jpg`

`codeDelimiter` on `inlineCode` should match 
`codeDelimiter` on `codeBlockContent` holds its color 

  + This means we need to create two labeles for ticks used for code
    - `inlineCodeDelimiter` should be #F34D3E red-orange, just like `inlineCode`
    - `blockCodeDelimiter` uses the same `codeBlockContent` as plaintext, #8989e3 a light-purple 

### 5. Code Blocks Never Change from Defaul Plaintext 
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

### 7. Horizontal Rule Pagebreak Is Not In Theme 
`docs/images/bugs/IMG_bug-v2-review_2.jpg`

`horizontalRule` is on `src/theme-reference.ts` but not `src/theme.ts`

  + It should be listed as #93f9c6 in mint
  + Hyphen characters should change when applied in 3
    - If you add ---- then it does not render a full horizontal bar from L to R
    - When you add --- normally they clamp together, indicating it worked

---

### General Feedback

  1. Get spell check working
  2. I removed the header size increase and made the font 12px
    - I ran `run npm preview` and hit refresh and it didn't work 
    - I repeated it making it 10px, used incognito, and tried again and it didn't work at first then did 
    - Now it is tiny; I tried to fix it back to 12px and I can't get it to actually change again 
  3. **IMPORTANT**: We want to be pushing final production builds with tagging to a main branch 
    - I just coped and slightly updated the "Branching" section from the v1 documentation 
    - It is kind of repetitive, right? Will you please simplify it

---

## Code Blocks 

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

### Branching  

  * **The project is organized around a *single top-level folder and repo name***
    + Local project folder: `thot`
    + Git repository name: `thot`
    + Primary active branch for this build: `v2-first-thots` 
      - This branch represents the entire "Desk Pad" product line for v1.
      - Future major phases can branch off this (e.g., `v3-organization`, `v4-ai-customization`)
      - Completed builds will be moved to branch `main` and tagged with the version number

  > Git flow:
  > - Default branch can be `main` with **no direct commits**; `v2-first-thots` is the working branch.
  > - Feature branches (if needed) should be prefixed with `feat/` or `fix/` and merged into `v2-first-thots` via PRs, even if the PRs are AI-authored.

  * **Professional versioning / repo hygiene details**
    + Branching:
      - `main`: protected, only fast-forwarded from tagged, stable milestones (e.g., `v2.0.0`, `v2.1.0`).
      - `v2-first-thots`: active development branch for this entire product phase.
      - Short-lived feature branches off `v2-first-thots`:
        `fix/highlighting`
        `feat/spell-check`
        `feat/export-md`
        `feat/counter`
    + Tagging:
      - Use semantic tags on `main` and optionally on `v2-first-thots` once stable:
        `v2.0.0-first-thots` – first fully shippable build.
        `v2.1.0-first-thots` – minor enhancements within v1 scope (no new product surface).
    + Docs discipline:
      - Any non-trivial code change that alters behavior should be paired with:
      - An update to `v2_0_0_UPDATES.md` (if it changes the spec/contract), or
      - An entry in a future `docs/CHANGELOG_v2.md` if it's purely internal.

This structure keeps the name surface constant (`thot` everywhere), signals clearly that `v2-first-thots` is the canonical "First Thots" implementation branch, and **gives both humans and agents a predictable map of where things live and where to evolve them next.**

---

### Formatting Issues 

**NOTE:** Question about "inspecting" in developer panel — how do I get it to show me the scopes and info when clicking each word? It did it for a second but I can't figure out how to get the context pop-up to work again. I had never seen it before but it made the *ACTUAL* class and style names so simple to read. 

  1. Text Wrapping Not Maintaining Indentation

     + When typing in a block of text — standard paragraph or either types of lists with really long items that wrap — the wrapped next lines must adhere to the indentation at which the first line in the block of text started. Let me know if you need pictures of what I'm talking about. 
     + This is **NOT** how a normal word processor would work which is maybe why it doesn't, but since markdown it traditionally written in an IDE, the text is treated more like code. 

       - Plain text in a long paragraph
       - An unordered list item that is long and wraps around 
       - An ordered list item that is long and wraps around 

  2. Text Block Indentation Far Past First Line Changes Color 

    + Traditionally in markdown, when you highlight a block of text, that could be a list of either kind of just a paragraph, it changes to the same color as 'plain text' in a code block. 
    + In the app, the change to a solid color happens when you are AT the indent of the line or line with return in-between you and the line you are trying to indent 
    + It is the wrong color, green like everything else wrong, but that is because of all the incorrect highlight colors in the next number
    + It needs to be able to tab over about two past the line above in case your creating a sublist 

  3. Missing and Inaccurate Scope Highlighting 
   
    + If it helps, I pasted the "STYLES" section from the inspector's HTML below under the headline `From HTML Style Section When Using "inspect"`
    + Otherwise **THIS SHOULD ALREADY HAVE BEEN COVERED BY THE TOP MESSAGE**

### From HTML Style Section When Using "inspect"

```css
.ͼ1.cm-focused {outline: 1px dotted #212121;}
.ͼ1 {position: relative !important; box-sizing: border-box; display: flex !important; flex-direction: column;}
.ͼ1 .cm-scroller {display: flex !important; align-items: flex-start !important; font-family: monospace; line-height: 1.4; height: 100%; overflow-x: auto; position: relative; z-index: 0; overflow-anchor: none;}
.ͼ1 .cm-content[contenteditable=true] {-webkit-user-modify: read-write-plaintext-only;}
.ͼ1 .cm-content {margin: 0; flex-grow: 2; flex-shrink: 0; display: block; white-space: pre; word-wrap: normal; box-sizing: border-box; min-height: 100%; padding: 4px 0; outline: none;}
.ͼ1 .cm-lineWrapping {white-space: pre-wrap; white-space: break-spaces; word-break: break-word; overflow-wrap: anywhere; flex-shrink: 1;}
.ͼ2 .cm-content {caret-color: black;}
.ͼ3 .cm-content {caret-color: white;}
.ͼ1 .cm-line {display: block; padding: 0 2px 0 6px;}
.ͼ1 .cm-layer > * {position: absolute;}
.ͼ1 .cm-layer {position: absolute; left: 0; top: 0; contain: size style;}
.ͼ2 .cm-selectionBackground {background: #d9d9d9;}
.ͼ3 .cm-selectionBackground {background: #222;}
.ͼ2.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground {background: #d7d4f0;}
.ͼ3.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground {background: #233;}
.ͼ1 .cm-cursorLayer {pointer-events: none;}
.ͼ1.cm-focused > .cm-scroller > .cm-cursorLayer {animation: steps(1) cm-blink 1.2s infinite;}
@keyframes cm-blink {50% {opacity: 0;}}
@keyframes cm-blink2 {50% {opacity: 0;}}
.ͼ1 .cm-cursor, .ͼ1 .cm-dropCursor {border-left: 1.2px solid black; margin-left: -0.6px; pointer-events: none;}
.ͼ1 .cm-cursor {display: none;}
.ͼ3 .cm-cursor {border-left-color: #ddd;}
.ͼ1 .cm-dropCursor {position: absolute;}
.ͼ1.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor {display: block;}
.ͼ1 .cm-iso {unicode-bidi: isolate;}
.ͼ1 .cm-announced {position: fixed; top: -10000px;}
@media print {.ͼ1 .cm-announced {display: none;}}
.ͼ2 .cm-activeLine {background-color: #cceeff44;}
.ͼ3 .cm-activeLine {background-color: #99eeff33;}
.ͼ2 .cm-specialChar {color: red;}
.ͼ3 .cm-specialChar {color: #f78;}
.ͼ1 .cm-gutters {flex-shrink: 0; display: flex; height: 100%; box-sizing: border-box; z-index: 200;}
.ͼ1 .cm-gutters-before {inset-inline-start: 0;}
.ͼ1 .cm-gutters-after {inset-inline-end: 0;}
.ͼ2 .cm-gutters.cm-gutters-before {border-right-width: 1px;}
.ͼ2 .cm-gutters.cm-gutters-after {border-left-width: 1px;}
.ͼ2 .cm-gutters {background-color: #f5f5f5; color: #6c6c6c; border: 0px solid #ddd;}
.ͼ3 .cm-gutters {background-color: #333338; color: #ccc;}
.ͼ1 .cm-gutter {display: flex !important; flex-direction: column; flex-shrink: 0; box-sizing: border-box; min-height: 100%; overflow: hidden;}
.ͼ1 .cm-gutterElement {box-sizing: border-box;}
.ͼ1 .cm-lineNumbers .cm-gutterElement {padding: 0 3px 0 5px; min-width: 20px; text-align: right; white-space: nowrap;}
.ͼ2 .cm-activeLineGutter {background-color: #e2f2ff;}
.ͼ3 .cm-activeLineGutter {background-color: #222227;}
.ͼ1 .cm-panels {box-sizing: border-box; position: sticky; left: 0; right: 0; z-index: 300;}
.ͼ2 .cm-panels {background-color: #f5f5f5; color: black;}
.ͼ2 .cm-panels-top {border-bottom: 1px solid #ddd;}
.ͼ2 .cm-panels-bottom {border-top: 1px solid #ddd;}
.ͼ3 .cm-panels {background-color: #333338; color: white;}
.ͼ1 .cm-dialog label {font-size: 80%;}
.ͼ1 .cm-dialog {padding: 2px 19px 4px 6px; position: relative;}
.ͼ1 .cm-dialog-close {position: absolute; top: 3px; right: 4px; background-color: inherit; border: none; font: inherit; font-size: 14px; padding: 0;}
.ͼ1 .cm-tab {display: inline-block; overflow: hidden; vertical-align: bottom;}
.ͼ1 .cm-widgetBuffer {vertical-align: text-top; height: 1em; width: 0; display: inline;}
.ͼ1 .cm-placeholder {color: #888; display: inline-block; vertical-align: top; user-select: none;}
.ͼ1 .cm-highlightSpace {background-image: radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%); background-position: center;}
.ͼ1 .cm-highlightTab {background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>'); background-size: auto 100%; background-position: right 90%; background-repeat: no-repeat;}
.ͼ1 .cm-trailingSpace {background-color: #ff332255;}
.ͼ1 .cm-button {vertical-align: middle; color: inherit; font-size: 70%; padding: .2em 1em; border-radius: 1px;}
.ͼ2 .cm-button:active {background-image: linear-gradient(#b4b4b4, #d0d3d6);}
.ͼ2 .cm-button {background-image: linear-gradient(#eff1f5, #d9d9df); border: 1px solid #888;}
.ͼ3 .cm-button:active {background-image: linear-gradient(#111, #333);}
.ͼ3 .cm-button {background-image: linear-gradient(#393939, #111); border: 1px solid #888;}
.ͼ1 .cm-textfield {vertical-align: middle; color: inherit; font-size: 70%; border: 1px solid silver; padding: .2em .5em;}
.ͼ2 .cm-textfield {background-color: white;}
.ͼ3 .cm-textfield {border: 1px solid #555; background-color: inherit;}
.ͼ1.cm-focused .cm-matchingBracket {background-color: #328c8252;}
.ͼ1.cm-focused .cm-nonmatchingBracket {background-color: #bb555544;}
.ͼ6 {color: #FF9D00; font-weight: bold;}
.ͼ7 {color: #FF9D00; font-weight: bold; font-size: 1.4em;}
.ͼ8 {color: #FF9D00; font-weight: bold; font-size: 1.3em;}
.ͼ9 {color: #FF9D00; font-weight: bold; font-size: 1.2em;}
.ͼa {color: #FF9D00; font-weight: bold; font-size: 1.1em;}
.ͼb {color: #FF9D00; font-weight: bold;}
.ͼc {color: #FF9D00; font-weight: bold;}
.ͼd {color: #FFD866; font-weight: bold;}
.ͼe {color: #8aeefb; font-style: italic;}
.ͼf {color: #6272A4; text-decoration: line-through;}
.ͼg {color: #78de8c; font-family: "JetBrains Mono NL", monospace;}
.ͼh {color: #6767fc;}
.ͼi {color: #AB9DF2;}
.ͼj {color: #8BE9FD;}
.ͼk {color: #E6DB74; font-style: italic;}
.ͼl {color: #BD93F9;}
.ͼm {color: #5feda4;}
.ͼn {color: #93f9c6;}
.ͼo {color: #93f9c6;}
.ͼp {color: #6272A4; font-style: italic;}
.ͼq {color: #FF79C6;}
.ͼr {color: #FF79C6;}
.ͼs {color: #FFD866;}
.ͼt {color: #78de8c;}
.ͼu {color: #F1FA8C;}
.ͼv {color: #e6e6e6;}
.ͼw {color: #AB9DF2;}
.ͼx {color: #8BE9FD;}
.ͼy {color: #FF79C6;}
.ͼz {color: #e6e6e6;}
.ͼ10 {color: #78de8c;}
.ͼ11 {color: #50faad;}
.ͼ12 {color: #50faad;}
.ͼ13 {color: #6272A4;}
.ͼ14 {color: #FF79C6;}
.ͼ15 {color: #8aeefb;}
.ͼ16 {color: #FF79C6;}
.ͼ17 {color: #FF79C6;}
.ͼ18 {color: #e6e6e6;}
.ͼ19 {color: #FFD866;}
.ͼ1a {color: #AB9DF2;}
.ͼ1b {color: #8aeefb;}
.ͼ1c {color: #FF9D00;}
.ͼ1d {color: #FF9D00;}
.ͼ5 {background-color: #1a1a1a; color: #e6e6e6; height: 100%; font-size: 14px;}
.ͼ5 .cm-scroller {font-family: "JetBrains Mono NL", monospace; line-height: 1.6; padding: 16px;}
.ͼ5 .cm-content {caret-color: #e6e6e6;}
.ͼ5 .cm-cursor, .ͼ5 .cm-dropCursor {border-left-color: #e6e6e6; border-left-width: 2px;}
.ͼ5.cm-focused .cm-selectionBackground, .ͼ5 .cm-selectionBackground, .ͼ5 .cm-content ::selection {background-color: #44475a;}
.ͼ5 .cm-activeLine {background-color: rgba(68, 71, 90, 0.3);}
.ͼ5 .cm-gutters {background-color: #1a1a1a; color: #6272a4; border: none; padding-right: 8px;}
.ͼ5 .cm-activeLineGutter {background-color: transparent; color: #e6e6e6;}
.ͼ5 .cm-lineNumbers .cm-gutterElement {padding: 0 8px 0 16px;}
.ͼ5 .cm-line {padding: 0 2px;}
.ͼ4 .cm-line ::selection, .ͼ4 .cm-line::selection {background-color: transparent !important;}
.ͼ4 .cm-line {caret-color: transparent !important;}
.ͼ4 .cm-content :focus::selection, .ͼ4 .cm-content :focus ::selection {background-color: Highlight !important;}
.ͼ4 .cm-content :focus {caret-color: initial !important;}
.ͼ4 .cm-content {caret-color: transparent !important;}
```

### Changes to Formatting 

  1. The normal font size that is displayed is 16px — please make it 12px or equivalent rem
  2. Please make the headings retain the same size as the normal text — I tried to do this already 
  3. I'd like to add the following fonts for the indicated purposes
    - Normal font uses Medium `src/assets/fonts/JetBrainsMonoNL-Medium.ttf`
    - Standard bold uses ExtraBold `src/assets/fonts/JetBrainsMonoNL-ExtraBold.ttf`
    - Standard italic uses ExtraBoldItalic `src/assets/fonts/JetBrainsMonoNL-ExtraBoldItalic.ttf`
    - The blockquote uses ThinItalic `src/assets/fonts/JetBrainsMonoNL-ThinItalic.ttf`
    - The strikethrough, comment, frontmatter uses Thin `src/assets/fonts/JetBrainsMonoNL-Thin.ttf`
    - The standard quotedText, math, linkURL uses Italic  `src/assets/fonts/JetBrainsMonoNL-Italic.ttf`
    - The footnote, htmlTag, bulletContent, numberedContent, numberedMarker, bulletMarker all should be using Regular `src/assets/fonts/JetBrainsMonoNL-Regular.ttf` 
    - The linkText should use Bold `src/assets/fonts/JetBrainsMonoNL-Bold.ttf` for 
    - Anything that was otherwise using BoldItalic can still use it, not sure what is left `src/assets/fonts/JetBrainsMonoNL-BoldItalic.ttf`

**New fonts added bring total font list to the following**

  + They are all from the `JetBrainsMonoNL` family, appended using a hyphen with the following styles: 

    1. Bold
    2. BoldItalic
    3. ExtraBold 
    4. ExtraBoldItalic 
    5. Italic
    6. Medium 
    7. Regular
    8. Thin 
    9. ThinItalic 

---

## Regarding Icons 

**This is how they're listed in the `YOUR_THOTS.md` document**

  ```
  ├── public/
  │   ├── favicon.ico                    # From AppIcon (16x16)
  │   ├── apple-touch-icon.png           # From AppIcon (180x180)
  │   └── manifest.json                  # PWA manifest
  ```

  + But this not how they actually exist or how they're actually named
    - I added a new batch as well because I knew it would have the names with sizes
    - E.g. favicon.ico is actually 48x48 
  + **NOTE**: There is not a 'manifest.json` file in there at all

**Actual part 1: not sure why they are in both locations**

```
~/Development/thot/public/
└── icons
    ├── 1024.png
    ├── 128.png
    ├── 16.png
    ├── 192.png
    ├── 256.png
    ├── 32.png
    ├── 512.png
    └── 64.png
```

**Actual part 2: not sure where they are in both locations**

```
~/Development/thot/src/assets/icons
├── 1024.png
├── 128.png
├── 16.png
├── 256.png
├── 32.png
├── 512.png
└── 64.png
```

**These I created from my normal favicon site**

```
~/Development/thot/docs/favicon-and-other-icons/
├── html-package
│   ├── apple-touch-icon.png
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
├── next.js-app-files
│   ├── apple-icon.png
│   ├── favicon.ico
│   ├── icon0.svg
│   ├── icon1.png
│   └── manifest.json
└── next.js-public-files
    ├── web-app-manifest-192x192.png
    └── web-app-manifest-512x512.png
```

**I downloaded them for `next.js`** 

  + Step 1 batch was `docs/favicon-and-other-icons/next.js-app-files/...`
    - "Extract them to `<your next app>/src/app`"
    - "Because these files follow Next.js conventions, the corresponding HTML markups will be automatically generated."
  + Step 2 batch was `docs/favicon-and-other-icons/next.js-public-files/...`
    - "Extract them to `<your next app>/public`"
  + Step 3 "Insert the following code in the head section of `<your next app>/src/app/layout.tsx`:"
    `<meta name="apple-mobile-web-app-title" content="thots" />`

**Then I also downloaded the normal HTML batch**

  + It says `"After extracting step, it says "Insert the following code in the <head> section of your pages"`

  ```
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="thots" />
  <link rel="manifest" href="/site.webmanifest" />
  ```

---

## Future Updates 

### **macOS, iOS SwiftUI light wrapper**

  + I thought of this randomly the other day and quickly web searched it 
    - "How to Publish a Progressive Web App (PWA) on the iOS App Store Using SuperPWA – Super PWA Docs" 
    - `https://superpwa.com/docs/article/how-to-publish-a-progressive-web-app-pwa-on-the-ios-app-store-using-superpwa/`
  
  + Apple T&C 
    - I dug around this too, Re: PWA in the App Store 
    - Basically it just shouldn't be clearly just a website 
    - We already have more than that, and given we tried SwiftUI first, I'm betting we'd be good 
    - I want to discuss this because I saw someone last week on Twitter say they were building the EXACT same thing in SwiftUI
    - I just commented vaguely about 'ugh' the issues 
    - But it shows interest
  + Plus it would be super easy to find ways to use native functionality 
    - Obviously UI stuff and file system access would be there, spellcheck, speech-to-text, haptic feedback
    - We could easily take things a step further with things in integrating with reminders, porting over from Notes App 
    - How could would it be if on any not just writing @02/14/2026-7pm and BOOM you get a reminder (or at the very least, notification) 
    - All the "Share to" options for sharing directly to mail or messages, etc. 
  + Anyway, who knows, but basically the sooner it is in there, the more time there is for user-base to grow so that if we do have really distinct new features released that are fully integrated, we can paywall them; so we should be aware of it from the start 

### **Export to PDF - SIMPLE**

  + I want to start this off SUPER simple by basically making it the markdown without the markup notation, solid text colors, different siz for headers
  + But otherwise we don't really need to mess with spacing or even the font 

### **Preferences UI that makes changing highlight colors super easy**

  + This frankly I would love
  + The user could even create 'project themes' or maybe different sections of the column view drill-down would be give different scope highlight colors so that it is immediately recognizable if you're in the right section of your notepad 

### **Standard RTF Option** 

  + Somewhere along the line it would make sense to give users who don't like markdown an option to use the app too 
  + It would be really fun to sort of try and reinvent a UI that is as convenient as markdown for formatting plain text 
  + Almost like a little context menu but with super prominent keyboard shortcuts written on the places that a RTF user would otherwise click to make something a heading or bold, etc. 
