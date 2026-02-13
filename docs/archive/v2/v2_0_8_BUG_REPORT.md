# Bug Report for v2.0.8 (Eight issues below)

> Please see the image located here: `docs/images/bugs/IMG_bug_v2_0_8.jpg`
> When applying solutions, please create a `docs/archive/v2/v2_0_8_BUG_LOG.md` detailing the issues and the fixes since these are now ongoing as of the previous feedback found. 

## Thoughts 

+ For 1 through 5, I can't help but wonder what the change was that made the highlighting work for the headingMarker, so that it matches the headingContent? Because just like the bold, the italic, and the blockquote — their highlighting tag labels that have only the one tag label (no separation between the marker and content) it worked. And then for the ordered and unordered lists that do have a content and a marker tag label, how do we get it to work there too?

+ For all of these, being that they are repeats of the same issues from the feedback, I labeled them as bugs. Please if you could make sure to do any necessary research needed as to the creation of custom highlighting for some of these cases where it appears that our needs are outside of the default of the highlighter default, or just to look up if perhaps the tagging label is different. I did a quick web search and the AI replied the following. As with our implementation plans, please make sure that the next plan has been fully research and leaves no lingering questions; we want to be sure we are fully avoiding trial and error and not assuming that we know the answer to fix something as LLMs often don't know they don't have a solution until they are in the process of implementing the solution. Let's back that process up to make sure that realization happens during planning for the next round of updates to fix these lingering errors. I cannot tell if it is not applying a hierarchy and prioritizing things at all, or if things are just not labeled or defined properly for the tool we are using to do highlighting. Thank you for your help figuring this out. 

  ```plaintext 
  Custom highlighting in CodeMirror, particularly in the modern CodeMirror 6 (CM6) version, is achieved through extensions and relies on two main components: defining a parser to tokenize the code and a highlight style to map those tokens to visual styles. [1, 2, 3, 4, 5]  
  Methods for Custom Highlighting 
  Here are the primary methods for implementing custom highlighting in CodeMirror 6: 

  • Custom  (Styling Existing Tags): This is the simplest way to modify the appearance of tokens that are already recognized by an existing language parser (e.g., changing the color of keywords). 

    • You define an array of objects that associate  (from ) with specific CSS properties like  or . 
    • This custom style is then wrapped in the  function to create an editor extension. 

  • Extending an Existing Language (Adding New Keywords/Tags): To make an existing language parser recognize new specific keywords or types, you can configure its parser using the Lezer grammar system. 

    • This involves defining a new  based on an existing one and using  to associate your custom keywords with specific  objects. 
    • This approach requires understanding the syntax tree structure emitted by the parser. 

  • Using  for Arbitrary Patterns: If you need to highlight arbitrary text patterns (like specific substrings or values inside custom delimiters, e.g.,  as green), you can create a view plugin with a . 

    • This method uses regular expressions to find and decorate text outside of the main syntax tree logic. The CodeMirror discussion forum has examples for this, such as the "zebra stripes" demo. 

  • Writing a Full Custom Language Package: For a completely new or specialized language, you can write a full custom parser, typically using the Lezer parser generator system. This is the most involved method but provides the most robust and structured highlighting, suitable for features like auto-indentation and code folding. [1, 2, 6, 7, 8, 9]  

  Key Concepts 

  • Extensions: In CodeMirror 6, almost all functionality, including syntax highlighting, is added via extensions. 
  • Tags: Highlighting works by associating parsed syntactic elements with generic  objects (e.g., , ). 
  • Theming vs. Highlighting: Highlighting styles token types (the what it is), while general themes style the editor's overall look (the how it looks, e.g., background color, font). [1, 6, 10, 11, 12]  

  AI responses may include mistakes.

  [1] https://codemirror.net/examples/styling/
  [2] https://codemirror.net/examples/lang-package/
  [3] https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide
  [4] https://www.codiga.io/blog/implement-codemirror-6-in-react/
  [5] https://core.trac.wordpress.org/ticket/35395
  [6] https://www.bayanbennett.com/posts/styling-codemirror-v6-with-material-ui-devlog-005/
  [7] https://discuss.codemirror.net/t/custom-syntax-highlighting-of-text/4335
  [8] https://discuss.codemirror.net/t/best-way-to-highlight-specific-keywords/3771
  [9] https://discuss.codemirror.net/t/custom-syntax-highlighting-not-working/8569
  [10] https://codemirror.net/examples/basic/
  [11] https://blazor.syncfusion.com/documentation/rich-text-editor/style
  [12] https://www.telerik.com/blogs/code-like-never-before-winforms-syntax-editor
  ```
---

## Bugs 

**NOTE**: That these should not be presumed to be the extent of the bugs. They are pulled from the introduction page when the app loads. If there are similar concepts to these bugs with other highlighting scenarios that we did not encounter here, please do due-diligence and proactively try to ensure that we have patched bugs for all cases. It is very likely, for example, that the BOLD in the list item would happen to most other highlighting that is higher priority, placing the list item priority inaccurately higher than the highlighted text in the list item. 

### Bold & Italic Marker Bugs 

1. The boldMarker versus boldContent (bold)
2. The italicMarker versus italicContent (italic)

**In both cases, the markers are showing the same purple that the marker from the, now fixed issue of, headingMarker versus headingContent, previously had**

From `src/theme.ts` 
```ts
  heading: '#FF9D00',
  bold: '#FFD866',
  italic: '#BF437F',
```

### List Marker Bugs 

3. The bulletMarker versus bulletContent 
4. The numberedMarker versus numberedContent 

**In both cases, the same 'Cyan' shown to just be used for bulletContent is being used for the bulletMarker as well as the numberedMarker, when it isn't appropriate to be used for either; additionally, there is no color being rendered onto the bulletContent or numberedContent, you can see this same issue in the Checkbox items because, if they didn't have a bullet point before them, then yes the the text after the Checkbox should be white, but since they have a bullet point before them then the writing after the checkbox is technically bulletContent**

From `src/theme.ts` 
```ts
  bulletMarker: '#dfc532',
  bulletContent: '#8aeefb',
  numberedMarker: '#ff6b6b',
  numberedContent: '#f8a5c2',
```

### Blockquote & Inline Code Marker Bugs 

5. The blockquoteMarker versus the blockquoteContent (blockquote)
8. The inlineCodeDelimiter versus the inlineCodeContent (inlineCode)

**Same type of issue as with the ordered and unordered list contents versus their markers. The highlighting is being applied (accurately) to the blockquoteMarker but not the content; this is similar to the issue happening with the inline code where, for only inline code, the delimiter should be red with the inlineCodeContent, you can note on the image that it IS accurate for the blockCodeDelimiter where it stayed purple but the codeBlockContent changed according to the codeLanguage defined** 

From `src/theme.ts`
```ts
  blockquote: '#E6DB74',
``` 
```ts
  inlineCode: '#F34D3E',
  blockCodeDelimiter: '#8989e3',
  codeBlockContent: '#8989e3',
  codeLanguage: '#F1FA8C',
```

### Prioritization Failure Bug(s)

6. The boldMarker and boldContent (bold) versus the bulletMarker 

**Bold (as well as italics and inline code) are all higher priority with full override of any type of list; note that it is interesting that, even though the color of the marker is not extended onto the content of lists normally, it is extended when the content is formatted bold**

From `src/theme.ts`
```ts
/**
 * Syntax highlighting styles
 * Order matters: HighlightStyle.define uses first-match-wins.
 * Hierarchy: strikethrough → inlineCode → codeBlock → checkbox →
 *            bold → italic → table → heading → list → blockquote → foreground
 */
```
```ts
  // 4. Bold — FULL
  { tag: tags.strong, color: colors.bold, fontWeight: '800' },
```
```ts
  // 16. Lists (fallback — ViewPlugin classes handle most list styling)
  { tag: tags.list, color: colors.bulletContent },
```

### Complete Highlighting Failure Bug 

7. The columnMarker and columnContent (column) 

**This has zero highlighting being applied. Note tha this was the same issue in the first round of feedback. I'm not sure why it is not recognizing the chart.** 

From `src/theme.ts` 
```ts
  checkbox: '#8BE9FD',
```
