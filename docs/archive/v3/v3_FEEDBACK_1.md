# Thot "v3 Usability" Update 

**Created**: 2026-03-02 
**Version**: v3.1.0
**Status**: Testing

---

## Changes Implemented

  1. **Native Browser Spellcheck**:
     - Integrated via `EditorView.contentAttributes.of({spellcheck: "true"})`
     - The state defaults to true, falls back onto `localStorage`
     - Wired to `Mod-Shift-c` to dynamically reconfigure the compartment
  3. **Paired Delimiters**:
     - Installed `@codemirror/autocomplete`
     - Injected the `closeBrackets()` extension into the core extensions array
  5. **File System Access API**:
     - Abstracted file management to `src/file-system.ts`
     - Built out the polyfill fallback (`<input type="file">` & blob downloads) for iOS Safari
     - Progressive enhancement (`showOpenFilePicker`/`showSaveFilePicker`) for Desktop Chrome users
     - Mapped to `Mod-o` and `Mod-Shift-s`
  7. **Mobile Layout Constraints**:
     - Injected `autocorrect: "off"` and `autocapitalize: "off"` attributes to avoid iOS predictive text UI shifting
     - Added padding buffer at the bottom of the viewport using `padding-bottom: 30vh !important`
     - Forced left gutter minimum width (`min-width: 40px`)
  9. **Cross-Window UX**:
      - Bound the native `StorageEvent` listener to intercept multi-tab/window activity
      - Attached the Web Share API payload to a newly created top-right floating "Share" utility button
      - Strictly scoped to supported environments (PWA on iOS) 

### Validation Methods 

Manual verification because of the projects highly visual UI/UX behaviors across devices. 

### Testing Checklist 

  - [x] Type an open bracket `(` or quote `"` to confirm pair insertion triggers correctly.
  - [x] Highlight a word and press `CMD+Shift+C` to ensure spellcheck red lines disappear immediately.
  - [x] Click the new "Share" dot in the top right to verify the iOS Share pane surfaces successfully.
  - [x] Press `CMD+Shift+S` to export the current view into a downloaded Markdown file on Mac.
  - [x] Open second a window (`CMD+N`) and type a sentence. Swap back to the first window to ensure the state is synced dynamically without reloading.

---

## Test Validation Results 

### Misunderstandings or Miscommunications 

  1. `autocorrect` and `autocapitalize`
     - The update document detailed how *desperately* we need both of these on mobile and tablet, which you'll see in the notes below
     - We *also* want them *on* for the desktop app; in various settings (browsers, desktop app) the settings do not reflect actual settings
  2. New window and tabs should be for **NEW** different content
     - Syncing content in new tabs of the same browser or new windows of the desktop app was the previous behavior which has no use-case I can think of
     - *Do not sync dynamically*
     - This might have been confused because I did mention that it would be helpful if we could edit the same document on mobile and desktop
     - However that functionality does not work; every browser and app silos contents
     - This across device note taking could be solved by Saving and Opening files
     - That functionality has bugs
     - But are probably because of the tabs and window syncing dynamically 
     - Should not be assess until after that is fixed
  3. The issue with the numbered lines nudging over with each new number is ALL DEVICES
     - Re: "Forced left gutter minimum width (`min-width: 40px`)"
     - This is listed under the "Mobile Layout Constraints" heading
     - But it is notable on desktop
     - (However, see below as the mobile fix didn't work either)

### Native Spellchecking 

  - Functioning as expected 
  - Does need rest of the spelling functionality: autocorrect and autocapitalize
  - CMD+Shift+C works and the one case it did not work, I just changed the browser (Dia) shortcuts to make CMD+Shift+C available and now it works

### Paired Delimiters 

Almost all features function as expected. 

  * **Typing any delimiter creates both, like it should**

    + Highlighting a word and then typing either `"` or `'` places the double or single quotes around the word, as expected
    + Highlighting a word and then typing `(` or `{` or `[` all places the set of delimiters around the word, as expected

  * **Adding delimiters to a highlighted word only half works**

    + However, none of the other delimiters can be applied by highlighting and tapping the delimiter
    + This should also work for adding `inline code markers to a word`, *italics* and **bold** asterisks, <carrots>, or ~~strikeout~~ 

### File System Access 

  + This seems to work as expected
  + There are some oddities
    - But I think these bugs will be eliminated with other fixes
    - Once the new windows and new tabs show new content instead of duplicate content they should behave cleaner 
    - And will test again after that fix
  + Shortcuts work
    - `Command + Shift + S` works
    - `Command + O` works 

### Mobile Layout Constraints

  * **DIDN'T WORK: Forced left gutter minimum width (`min-width: 40px`)**
    `docs/archive/v3/FEEDBACK_IMG/IMG_SCREENSHOT_LINE_NUMBER_ALIGNMENT.jpg`

    + This is not the right property to adjust to stop the numbers from shifting over as they grow in width
    + Looks like it added space next to the number
    + The `class="cm-gutterElement"` class looks like a smaller item around just that number

  * **THIS WORKS**

  1. To the first class (`class="cm-gutter cm-lineNumbers"`)
     - I added to `.ͼ1 .cm-gutter` three properties 
  ```css
  align-items: flex-end;
  align-content: flex-end;
  flex-wrap: wrap;
  ```

  1. To the second class (`class="cm-gutterElement"`)
     - I removed from `.ͼ5 .cm-lineNumbers .cm-gutterElement` the `padding: 0 8px 0 16px`
     - And added instead these two properties 
  ```css
  width: 16px;
  align-content: flex-end;
  ```

--- 

  1. So the first change now looks like this on my end: 
  
  - This is the line I highlighted in the HTML to edit:
  
  ```html
  class="cm-gutter cm-lineNumbers"
  ```
  
  - This is the full CSS properties for that line's class:
  
  ```css
  .ͼ1 .cm-gutter {
      display: flex !important;
      flex-direction: column;
      flex-shrink: 0;
      box-sizing: border-box;
      min-height: 100%;
      overflow: hidden;
      align-items: flex-end; 
      align-content: flex-end;
      flex-wrap: wrap;
  ```
  
  2. And the second change now looks like this on my end: 
  
  - This is the line I highlighted in the HTML to edit:
  
  ```html
  class="cm-gutterElement"
  ```
  
  - This is the full CSS properties for that line's class:
  
  ```css
  .ͼ5 .cm-lineNumbers .cm-gutterElement {
      /* padding: 0 8px 0 16px; */
      width: 16px;
      align-content: flex-end;
  ```


### Share Button 

  + I can confirm this works on desktop where I could use the local host: http://localhost:4173
  + When testing on mobile (or using this on desktop) this URL doesn't give complete functionality: http://192.168.0.36:5173


### Mobile iOS Safari 

  + These are my notes from testing on mobile. I don't know what they say and honestly I'm just including them to be thorough because I'm certain that all of the important information was part of the rest of the feedback above. 

```plaintext
# Hello 

there nott autocorrectting at all still on movilw 

weird 

it wants 

it foesnf inderline mispellings 
but quen i tap one i can change it
not that that is helpful inless it is an obvious misspelling 

what we really need though is the autocorrwct. 

i had noted soecifically in the uodate that we needed NOT JUST spelling tirned on but also auto corrwct 

but inhave a screen shot where it fidnt work on desktop wither and yoi can see it is turned off 

im leaving my text like this not to ve dramatic 

but because this is how i always text on my ohome and this is appamdeltu how much autocorret on movile is helpingme beciaee when i send messages woth mobile three are never any spellong or grammar issues 

most notable is of course the lack of the initial capa for a new sentence. 

maybe this is jist tirned off becaise it is a “code” editor ans we jist happen to be using it more specifically for work processing 

regardless. vsry necessary. 

—- agh
annoyinglu whwn i try to type a horizontal line it DOES auto correct and it tirns my hyphen hypen into one m-dash 

- - - 

srill got this weird bar above the predictive text options

it is usualy onky for filling out FORMS
the up ans down arrows on the left to choose between emails
and the check mark to approve the form field text entered and move on 

so iy aeems like for some trasok on mobile safari it thinks this text field is being treated like a form field

- - - 

interesting 
OK, I’m going to talk to text because I cannot read anything. I’m typing hopefully AI will be able to.

I just tried using the share button from mobile Safari and AirDrop to my computer and it just opened the IPURL and it doesn’t have any of the content that I was typing… But I think that might be related to a bigger issue that was potentially a misunderstanding because there are issues with the way it handles saved files across tabs and even saved file and then another tab opened that isn’t a saved file. It will automatically update the saved file.

- - - 

The behavior we wanted correct? Is that the same way a new window when the app is downloaded should open a fresh instance that I could edit and have two different documents going at the same time.

we instead have them as indicated on the validation sheet up updating dynamically across instances

This behavior is the same between tabs in your browser

And the behavior causes issues with managing saved, and opening saved files. I won’t detail the issues with the same files because I think that if we fix the functionality so that it can hold multiple instances open in two windows or two tabs then it will probably also fix the issue with the saved and opened files 

And then, it should hopefully also fix it the issue that started this note where I shared via AirDrop and it didn’t send content and only sent URL. I’ll try Share. to other devices now.

- - - 

very weird. So I did try the Share button on desktop and it seemed to work fine. I’ll have to try it again just to be sure. But the first time it shared the content of the note and placed it into the Messages app on desktop.

I just went to do the same thing on mobile and the behavior is the same as when I shared using AirDrop. It just placed the link to the URL in the message. The behavior was the same for an email.

So the weirdness is that the Share button is working as expected on desktop but not on mobile

 - - - 

 OK, actually this might have something to do with the URL that it uses when Preview viewing the app on mobile devices 

 http://192.168.0.36:5173/

 because when I go to that URL on the computer, I don’t have a share icon either however the local host

(http://localhost:4173/

is where the Share button actually works

So on mobile, there’s always a share button whereas the share button we added isn’t being displayed, which is why on mobile it wouldn’t be working correctly because it isn’t working correctly from the IP preview, but is working correctly from the local host

- - - 

I don’t know if there’s anything we can do about this, but it is incredibly difficult to paste or even hold down and move the cursor on mobile. Every tap it responds by either entering in to edit text or exiting the text editing stance. So the only way I was able to paste something on mobile was to type random letters, then double tap those random letters to highlight them and then  , then double tap those random letters to highlight them and then use the paste option that comes up when you highlight. just like you would copy or cut.

- - - 

this is random, but I clicked the reader button on Safari on my mobile device and it displayed really nicely. It removed the highlighting, but it still made the headers bigger et.

---

I just opened it in chrome, the earlier testing was in Safari, and I think that it is just this Preview URL because it has the same strange experience. There is a bar in intended for entering form field data again. It’s equally as difficult to highlight and navigate. I wonder if that could be handled by just creating some type of delay where instead of just clicking once into the text to edit it or tapping once to be done and exit editing the text, is it possible for us to change that so that you have to tap three times   is it possible for us to change that so that you have to tap three times. I don’t know if three times is the norm in other applications I do know that I always tap it three times. or at least twice. Also, we should change the highlight color because it is this very transparent faded green on top of the charcoal background so when text is highlighted, it is very difficult to see if it highlighted the whole word or not on mobile especially

The behavior with the sharing is the same in chrome on mobile. Again, this is likely because of the testing IP address.
```