# Bug Report v2.1.4

## Summary 

+ Great improvement! Here are the few I see that aren't quite there yet for whatever reason. 
+ Please see the screenshot to see what is being referenced visually: `docs/archive/v2/IMG_BUGS/IMG_bug_v2_1_4.jpg`

### Admin Update Details 

+ Can you please also include in simple terms where I would be able to go to if I was going to change the color for a tag's highlighting myself? 
+ The TS I pasted below is from our old `docs/archive/v2/old-theme-ref.ts` just because I wanted to share the accurate colors. 

### Inline Code Tick-marks 

1. The inlineCodeDelimiter and inlineCode 

**Tick marks for inline code should be the same color as the actual inline code. I think you said it doesn't need a separate tag? I don't quite understand how that works yet. Was it that they have the same name, but the system references what the punctuation is for to pull the color — like it does for ** in **bold** and * in italics. Well, the tick-mark should be re-orange as well. The "fencedCodeDelimiter" (or whatever the new name is) staying blue-purple is accurate. It is only the inline delimiters that should adopt the inlineCode and they are not currently doing that.**

```ts
  inlineCode: '#F34D3E',     // Red-orange
  fencedCodeDelimiter: '#6767fc',  // Blue-purple
  codeBlockContent: '#8989e3',     // Light purple
  codeLanguage: '#F1FA8C',   // Yellow
```

### Ordered and Unordered List Content & Markers 

2. The bulletMarker and bulletContent 
3. The numberedMarker and numberedContent 

**Below again is pasted from the old reference document just to show the colors that they should be. The content color is infecting the marker.**

```ts
  bulletMarker: '#dfc532',   // Gold, bold
  numberedMarker: '#ff6b6b', // Red, bold
  bulletContent: '#8aeefb',  // Cyan
  numberedContent: '#f8a5c2', // Pink
```

### URL Link Highlighting 

4. The linkText and linkURL 

**This was looking great before so I'm not sure what went wrong. For reference, you can see it on the image from our previous round of bugs here: `docs/archive/v2/IMG_BUGS/IMG_bug_v2_0_8.jpg`

```ts
  linkText: '#AB9DF2',       // Purple
  linkUrl: '#8BE9FD',        // Cyan
  referenceLink: '#50FA7B',  // Green
```