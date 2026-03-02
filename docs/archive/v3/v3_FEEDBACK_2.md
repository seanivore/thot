# AutoCorrect Build Test

Let's 
Seen how this goes. Does it do we'll?

+ Note that it used `we'll` instead of `well` — we should make a few changes to improve the UX

## Managing Autocorrections Without Breaking Flow  

When an auto-correct is made it sometimes needs to be undone. We need this to be an easy and natural fix for users. There are also a couple specific situations where autocorrect triggers do not apply a change. 

### Changing An Autocorrect Back 

  1. **User types word** — well
  2. **User add autocorrect trigger character after word, like a space, punctuation, or a return** — we'll
  3. **Undo the autocorrect...** 

*IMMEDIATELY WHILE IN THE FLOW OF TYPING*

  1. Immediately type `backspace`/`delete` once to remove character immediately after the corrected word, and it reverts to pre-corrected state. 
     - *FOR EXAMPLE*, you type w-e-l-l
     - It changes to we'll
     - You delete the space after "we'll" and it changes back to "well"
     - You type a new space to continue writing and the autocorrect is NOT TRIGGERED this time

  2. Immediately type undo shortcut `COMMAND + Z` and the autocorrect change is undone, but the character you typed that triggered the autocorrect remains. Typing that `space` after the word is not undone so you can just continue writing.
     - *FOR EXAMPLE*, you type c-a-n-t
     - It changes to can't
     - You hit `cmd-Z`
     - It changes back to cant
     - you still have a space you created after the word cant and continue writing

*LATER YOU COME BACK TO ADJUST THE WORD*

  3. At any point after an autocorrect, if the user intentionally deletes the changed word, and types it again, it does not allow for an autocorrect trigger
     - *FOR EXAMPLE*, I wrote "He likes it a lot."
     - Tomorrow I return and delete the space after `a` and the word `lot`
     - Then directly after the `a` I add `lot` again for the desired misspelled word `alot`
     - The word is left as is even if user types a space or other trigger after the word 

  4. At any point you can manually delete a character added by autocorrect, and any would-be trigger immediately following the edit does not trigger and change the edited would be autocorrected word back again
     - *FOR EXAMPLE*, I remove the apostrophe from can't
     - Then I add a space after the `t` in the word and keep typing
     - The word remains `cant`

### Using Formatting That Disallows Autocorrect 

**Auto-correct does not apply when:**

  1. Writing in `inline code` markers
  2. When writing...
```plaintext
inside a code block
```
  3. When writing a URL: www.cantchangeit.com
  4. When placing a word in linking markdown of a URL, path, or page anchor 

[in the URL of hyperlink markdown](www.urlofhyperlinkmarkdown.com) 
[In PAGE_PATH.md](/docs/PAGE_PATH.md) 
[In Markdown Page Anchor](#in-hyperlink-markdown-anchor)

## Notes 

  1. All corrections or no-autocorrect-allowed formatting includes autocapitalization
  2. I cannot think of other formatting that should block autocorrect but please add other logical inclusions when reviewing this document

---
*Created by Sean August Horvath on 2026-03-02 as feedback to an update that added autocorrecting and autocapitalization to Thot app*