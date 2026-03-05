# Thot Update Adjustments

**Created**: 2026-03-05
**Version**: v3.1.2
**Updates**: Autocorrect, System File Operations, Persistence Fixes

---

## Styling & Design

### PWA Desktop App Title Bar 

This is regarding the app's Title Bar on the app after installing it to macOS, where the normal, unsaved text editor window says just `Thot`

**Actual Behavior**
  + When saved, 'Thot' is written twice
    `Thot - daily-planner.md - Thot`

**Expected Behavior**: 
  + We want to remove the first 'Thot -' or the second '- Thot'
    `daily-planner.md - Thot`
    `Thot - daily-planner.md`

In the browser the web app's SEO Title on the tab is accurate and says just `daily-planner.md - Thot`

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

## Persistence & Saving Files

### New Unsaved Windows 

### Managing Saved Files 

## Share Links

### Convenience

### Collaboration 