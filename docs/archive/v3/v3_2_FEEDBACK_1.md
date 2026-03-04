# Thot UX Adjustments 

## Line Numbering CSS Styling 

Currently the numbering on the PWA app (and presumably other views) cuts off the 3 digit line numbers. I made two adjustments when inspecting elements to the CSS properties to get them to show properly and not shift at all when moving from 9 to 10 and from 99 to 100. Removing the padding allowed the front of the 3-digit numbers to be seen, but a tiny slice of the wider numbers, like those with zeros, e.g. 100, was hidden on the right side. Adjusting the width fixed that. Both adjustments were made while the same class element was selected for the gutter element and the property remained showing no matter what class element I selected (there was one for every numbered line). 

* **HTML Line & Class Selected when Changes Made**

```html
class="cm-gutterElement"
```

  1. Removed the padding completely from the following class styling.

```css
.ͼ1 .cm-lineNumbers .cm-gutterElement {
    /* padding: 0 3px 0 5px; */
    min-width: 20px;
    text-align: right;
    white-space: nowrap;
```

  2. Changed width from 18px to 25px in the following class styling. 

```css
.ͼ5 .cm-lineNumbers .cm-gutterElement {
    width: 25px;
    align-content: flex-end;
```
