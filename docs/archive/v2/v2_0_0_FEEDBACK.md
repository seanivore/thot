# v2.0.0 Feedback

## Overall Feelings 

This is awesome. I can't believe it only took a few hours to build and it is pretty much perfect. I did find some highlighting oddities that I listed below. Then the rest is just other updates I'd like us to make. 

---

### General Feedback 

  1. Get spell check working
  2. I removed the header size increase and made the font 12px
    - I ran `run npm preview` and hit refresh and it didn't work 
    - I repeated it making it 10px, used incognito, and tried again and it didn't work at first then did 
    - Now it is tiny; I tried to fix it back to 12px and I can't get it to actually change again 

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
   
    + I'll list the specifics below 
    + Also, highlighting does not match `src/theme.ts` 
    + If it helps, I pasted the "STYLES" section from the inspector's HTML below under the headline `From HTML Style Section When Using "inspect"` 
    + It seems like everything broken is turning a mint green — not the dark green that lists should be 
    + Please reference the `src/theme-reference.ts` again and update `src/theme.ts` for the missing scopes and because there are a few that are not the right color on `src/theme.ts` 
    + **THOUGH, NOTE** that even the incorrectly formatted in the list below that *DO* have a correct color listed in `src/theme.ts`, that doesn't work 

  **CORRECT** 
  
  - heading — just the text, not the pound signs 
  - *italic* — just the text, only when not in list item 
  - **bold** — just the text, only when not in list item 
  - codeLanguage — but the code language choice does not apply any code specific highlighting 
  - [link](https://www.google.com) — only when not in list item 
  - <html> or whatever this is 
    
  **INCORRECT**
  
  - **bold** - when in a list item the word and icons turn green; normally asterisks stay purple
  - *italic* - when in a list item the word and icons turn green; normally asterisks stay purple
  - ~~strikethrough~~ — no effect 
  - `inlineCode`, `codeDelimiter`, `codeContent` — same green as everything else 
  - [link](https://www.google.com) — green when in list item 
  - | Charts | Don't work | it says white, both text and lines = |
  - [ ] Checkbox — just white
  - listMarker — same green
  - > Blockquote text is white, blockquoteMarker highlighted but NOT if you tab the blockquote in at all 
  - `  ticks stay purple instead of changing with code
  - Code blocks — they do not highlight syntax at all, it just makes everything the same green as everything else broken 

**STRANGE BEHAVIOR** 

  + I'm not sure what the cause is yet, but at times, a unordered line item turns all green and MOST normal times the list marker is green but text is white 
    - I think it might be when following an ordered list because I also just tried to add an unordered sub-list to one of an ordered list's items and it turned that item and the sublist BOLD, a bit larger font, and the following sublist items did the same 
    - **This is probably biggest weird bug, SEE IMAGE** `docs/images/bugs/odd-sublist-behavior.png` 
    - It only does the bold if I hit return from the numbered item in the list, then delete the new item number, then add a bullet hyphen 
    - It doesn't happen when I use a + as the bullet icon 
    - When I backspace the list into the same sublist spot, it doesn't get bold, but the list is still entirely green. 

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
