# Feedback After First Planning Session 

**Created**: 2026-05-07
**Version**: Driving v4.0.0 -> v4.0.1

## Overview 

We has a session yesterday taking my attempt at clean-up `docs/archive/v4_0/v4_0_0_CLARITY.md` a step further `docs/archive/v4_0/v4_0_0_DEV_PLANNING.md`. I'm still processing through things and honestly still trying to find a way for this project directory to not feel so chaotic. Just a few notes on the `docs/archive/v4_0/v4_0_0_IMPLEMENT.md` we created during the session, as well as general workflow thoughts. 

---

**FYI: SYNC COMMAND UPDATE**

I expanded the command we were using to sync `.agent/DEV_RULES.md` after updates, and updated those notes on the DEV_RULES.md document. It is now `filemgmt` and while some more logical arguments have been added, we also managed to maintain the previous logic since it was also sound. Full details are here — `/Users/seanivore/Development/scripts/README.md` — I needed a way to also add new documents to the `.agent/` directory and it turned into a more sensible, comprehensive update to the command. 

---



  - I'm still trying to find a way for this project directory to not feel chaotic. 
  - I don't think that making `docs/THOT_APP.md` stand as the roadmap/update plan is the right way to do it anymore 
    - That file has it's purpose, which is significant, and we shouldn't mess with that 
    - I added the template for the PROJECT_NAME.md document to our `.agent/` directory 
    - We should keep it updated as we evolve what works best in our architecture/tech doc/agent primer that is PROJECT_NAME.md 
    - Please review it, make any necessary changes, and then run `frdoc` to 


---

## "Investigation" & "Quick Fixes"

Adding some clarity and fuller detail to the issues that are to be fixed in this implementation plan. 

I'm also curious why we're not fixing the URLs and Anchors. It seems like we should have reviewed the previously created plan and have added it to the build — `docs/archive/v4_0/FEAT_URLS_ANCHORS.md` — since we're going to have feedback to integrate, let's add it to the plan, as well as trying to identify some of the bugs below just like we would gaps. 

This implementation plan seems rather sparse, and generally, I think in the future we should be creating new versions with much larger implementation plans that create features and, if applicable, address bugs. In this way, we would want to be doing the same kind of research and investigation *during* the writing of the implementation plan for bugs, exactly as we would for any feature. This ensures that our implementation plan continues to be exclusively implementable. 

In reading the current plan it seems like we broke the `.agent/DEV_RULES.md` that we just clarified that same session, don't you think? Just as we would fully research integration of a service, and confirm that we have the accurate and most up-to-date API information, we should be investigating the bug so that we can more clearly define in the plan what exactly should be done to fix the issue. This will keep us a step ahead when issues end up being much larger or more problematic than we expected. Otherwise, we end up doubling the number of sessions spent trying to fix a particularly problematic bug. 

### Re: `docs/archive/v4_0/v4_0_0_IMPLEMENT.md:39` "0.2 Frontmatter detection — single hyphen line should not trigger"

Okay this is a strange one but I'm fairly certain it must have to do with frontmatter in general. I don't know how else to even show other than with images. 

  1. I have a sorted list with three items; this bug does not occur with unsorted lists 
     `docs/archive/images/frontmatter-random-list-item-insert-1.jpg`
  2. I hit return after an item to add a bullet point associated with this numbered list item 
     `docs/archive/images/frontmatter-random-list-item-insert-2.jpg` 
  3. I hit delete to remove the auto-created number, so far so good 
     `docs/archive/images/frontmatter-random-list-item-insert-3.jpg` 
  4. I type a hyphen as the first bullet point and get the same orange bold as in frontmatter 
     `docs/archive/images/frontmatter-random-list-item-insert-4.jpg`
  5. I hit space after the bullet point and it maintains the orange bold frontmatter styling 
     `docs/archive/images/frontmatter-random-list-item-insert-5.jpg` 
  6. When I type the first letter of the list item to go with that bullet point, it changes to proper bullet list color 
     `docs/archive/images/frontmatter-random-list-item-insert-6.jpg`

### Re: `docs/archive/v4_0/v4_0_0_IMPLEMENT.md:130` "1.7 List formatting bleed onto next line"

I noticed this section. 

    Add a regression test by typing:
    ```
    - one
    - two

    This should not be cyan.
    ```
    Confirm "This should not be cyan." renders in foreground color.

And wanted to first point out that this should also be true. 

    Immediate return line should not be cyan either. 
    ```
    - one
    - two 
    This line should not be cyan.
    ```

We are good with the double return behavior, in that, the first return creates the third line with a bullet point and if you hit return again, it removes the bullet 
point and continues on that same line. The issue is that this immediate return line is cyan as well. 

### Re: `docs/archive/v4_0/v4_0_0_IMPLEMENT.md:149` "1.8 List blank-line propagation"

**NOTE**: I'm not clear what exactly is being reported as a bug based on the way this section is written in the implementation plan. Below better explains the actual issue, which also happens to continue from the notes in the above feedback. 

However, there is an oddity that I think has to do with another quirk that I'd like to get rid of. When you only have one bulleted list item and you hit return, it creates the next line with bullet point as expected, but then if you hit return again, it creates a line break space between the two bullet points. 

    Immediate double return after just one bulleted list item should also end the list by removing the bullet point and using plain text. 
    ```
    - one

    - 
    ```
    That is the current behavior. It should simply be the same as if it was any number of items in the list long. 

I bring this up particularly because the other issue is that when you have a sorted or unsorted list with line breaks between each list item, no matter how many list items there are, the text editor tries automatically adds a line break before the next bullet point you try to create. This seems like it would be helpful, because in a Word Processor, it is, but in markdown where the user wants more control, they don't want that kind of persistent creation of line breaks between list items. 

    Line breaks / skipping lines in any list of any length should never persist. 
    ```
    - first line, and i hit return then return again because I want to add two separate points 

    - the second point here, but now when I hit return, it automatically jumps a line and places the bullet point as shown below 

    - 
    ```
    Instead, the return after the second point should behave like a normal list by creating a bullet point, but then allowing the user to hit return again to eliminate that bullet point and immediately start typing in plain text directly below the second bullet point.
    ```
    - first line 

    - second with break 
    The bullet was created here after hitting return. I hit return again, and it went away and allowed me to continue typing in the same line with plain text. 

