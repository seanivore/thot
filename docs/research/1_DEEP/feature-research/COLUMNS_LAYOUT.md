# Columns + Sticky-Note Layout — UI/UX Description

**Created**: 2026-05-06
**Version**: draft-v1 (scaffold)
**Status**: Research Phase — awaiting Sean's narrative fill-in

---

## Why this document exists

This concept is named in `v4_0_0_CLARITY.md` § Growth ("UI layout allowing users to set 'post-it' visible text") and in v2's `UPDATES_v2_0_0.md` Phase 8 ("Finder-style column navigation UI" with "configurable post-it preview snippets per note") — but no document anywhere describes what the columns + sticky-notes layout actually *is*. No wireframe, no interaction flow, no description of when a sticky note is created vs. surfaced vs. dismissed.

This is the second of two missing UX writeups blocking v5 planning. Same approach as `FORMATTING_UX.md` — lead-ins below, you brain-dump, I clean up.

---

## 1. The layout itself — what does the screen look like?

Lead-in: Describe the columns. How many? Does the user choose how many? Is one column the "main editor" and the others are auxiliary? Or are all columns equal? What's in each column by default?

Anchor questions:
- Finder-style was the analogy — does each column show a list, or each column show a single document?
- Is this a separate "view" the user opens, or is it the always-on layout?
- What happens on mobile / narrow viewports — does the columns view collapse, scroll horizontally, or get hidden?

> *(Sean: write here.)*

---

## 2. Sticky notes — what are they, exactly?

Lead-in: A "sticky note" in this product is what? A small text snippet pinned to a document? A floating annotation overlaid on the editor? A tile in a column? A reusable piece of text the user drags between documents?

> *(Sean: write here.)*

---

## 3. Where does a sticky note live?

Lead-in: When a user creates a sticky note, where does it appear? Is it associated with one specific document, or does it live independently? If associated, does it follow the document around (e.g., shows up in a sidebar when that doc is open) or does it float separately?

> *(Sean: write here.)*

---

## 4. Creating and editing a sticky note

Lead-in: How does a user create a sticky note? (Right-click? Keyboard shortcut? Drag from text? Always-visible "+ note" button?) What does editing one look like — inline in the column, or pop-up?

> *(Sean: write here.)*

---

## 5. The AI-populated detail piece

Lead-in: CLARITY mentions "post-it visible text" with "AI populated details in some cases." Walk through that — what does an AI-populated sticky note look like? When does the AI populate one (automatically, on request, both)? What's the user's mental model of "this note came from the AI" vs. "this note is mine"?

Sub-questions:
- Does the user prompt the AI for a specific note, or does the AI surface notes proactively (e.g., "I notice you mentioned X three times — should I make a sticky for it?")?
- If the AI is surfacing, what's the UX for accept/dismiss?
- Is there a visual distinction between user-created and AI-created notes?

> *(Sean: write here.)*

---

## 6. Use cases — what does a user actually do with this?

Lead-in: Walk through 2–3 concrete scenarios. A user is working on X document, and they use this columns + sticky-note layout to do Y. What does the workflow look like start-to-finish?

> *(Sean: write here.)*

---

## 7. Relationship to the lock-screen "always-available notepad" concept

Lead-in: CLARITY § "Native App Wrapper Opportunities" mentions tap-the-Dynamic-Island for a quick notepad, lock-screen note widgets, "post-it" lock-screen previews. Are those the same sticky notes from the columns layout, or a separate concept that happens to share the "post-it" name? If the same: how does syncing between in-editor and lock-screen work?

> *(Sean: write here.)*

---

## 8. What this is NOT

Lead-in: What's the negative space? Not a kanban board (that's Trello/Linear). Not a Roam-style block reference system. Not? Not?

> *(Sean: write here.)*

---

## 9. Free space

Lead-in: Anything else. Sketches you can describe in words, products you've seen that did something close, things you've wished existed.

> *(Sean: write here.)*

---

## Open Research Items

*(Populated after Sean's fill-in.)*

- Does this ship in v5 alongside the highlighter rebuild and intelligent formatting, or is it its own major (v6/v7)?
- Does this require a backend (sticky notes synced across devices) or can v1 be local-only?
- Does this interact with the persistence model (currently localStorage, partitioned by `?id=`)?
