# Intelligent Formatting — User Experience Description

**Created**: 2026-05-06
**Version**: draft-v1 (scaffold)
**Status**: Research Phase — awaiting Sean's narrative fill-in

---

## Why this document exists

`docs/archive/research/1_DEEP/feature-research/FORMATTING.md` covers the *mechanics* of the intelligent-formatting feature — `Decoration.replace()` to hide notation, CodeMirror tooltips for the context menu, dual visual/markdown mode. What it does not have is the **mental model**: what the user sees, how they discover the feature, what gestures shift between modes, and how a non-markdown writer perceives this without ever learning markdown.

This is the part that has to come from Sean. The lead-ins below are prompts — answer in your own voice. I'll clean up afterward into a tight UX spec that the v5 IMPLEMENT.md can reference. Don't worry about polish; brain-dump style.

---

## 1. Who is using this?

Lead-in: Describe the *user* this feature is for. Not a persona caricature — what's their actual writing workflow? Where do they currently write (Apple Notes? Google Docs? Notion?)? What frustrates them about those tools? What did they not know was possible?

> *(Sean: write here.)*

---

## 2. First contact — what does a brand-new user see?

Lead-in: They open Thot for the first time. They're a writer, not a developer. They don't know what markdown is. What's on screen? What do they type? What happens visually as they type? What's the first "oh!" moment?

> *(Sean: write here.)*

---

## 3. The dual mode — what are the two modes, exactly?

Lead-in: We've been calling it "dual mode" and "markdown visible" / "visual mode." From the user's perspective, what are these called? What does each one *look like*? Is one the default? Why?

Some sub-questions to anchor:
- In markdown-visible mode: do the `**` and `#` show up colored, or are they just there with the rest of the text?
- In visual mode: is the `**` invisible? Does the bold text just appear bold? What happens when the cursor enters a region of bold text — do the `**` reappear?
- Is the mode global (whole document) or local (current paragraph)?

> *(Sean: write here.)*

---

## 4. Discovery and switching modes — what is the gesture?

Lead-in: How does a user toggle between the modes? Is it a button? A keyboard shortcut? A right-click menu? Does the mode auto-switch based on what they're typing? When does it never auto-switch?

Anchor questions:
- The original `FORMATTING.md` describes a context menu via tooltips. What triggers that menu? Right-click? Hover? Selection?
- If a non-markdown user never opens the menu, do they ever know there's a markdown mode at all? (If no — that might be the right answer; the menu is for power users.)

> *(Sean: write here.)*

---

## 5. The "intelligent" part — what does the editor do automatically?

Lead-in: We've called this "intelligent formatting" and the system "adapting to how the user writes." Concretely, what does the editor *do on its own*? Some examples we've kicked around:
- Auto-detects ALL CAPS as emphasis and highlights it like bold.
- Auto-detects a short line ending in `:` as a section label.
- Auto-detects parenthetical asides and dims them.
- Auto-detects question marks → italic for questions.
(These are already in `src/scopes.ts` under the `auto.*` group — this layer is partly drafted.)

What other auto-detections matter to you? What auto-behaviors would be wrong (i.e., would surprise the user negatively)?

> *(Sean: write here.)*

---

## 6. The relationship between auto-detection and explicit markdown

Lead-in: A user types `IMPORTANT` and it gets ALL CAPS emphasis automatically. Then they decide they want to actually emphasize a word with markdown — they type `**word**`. Both are now visible. Do they conflict? Does the explicit markdown override the auto-detection? Are auto-detections "softer" visually than explicit markdown so explicit always wins?

> *(Sean: write here.)*

---

## 7. The customization layer — what can the user change?

Lead-in: `src/scopes.ts` has a `userCustomizable: true/false` flag on every scope. We've been planning a settings UI where users pick the colors of every scope. From the user's perspective:
- What does the settings UI look like? A panel? A modal? Live preview?
- What's the scope of customization — colors only? Weights too? Auto-detect on/off per scope?
- What's the *default* state — opinionated and beautiful (what we ship now), or neutral and let-them-customize?

> *(Sean: write here.)*

---

## 8. What this feature is NOT

Lead-in: Sometimes the clearest spec is the negative. What is intelligent formatting *not* trying to be? (E.g., not a WYSIWYG renderer. Not Notion. Not a full IDE. Etc.)

> *(Sean: write here.)*

---

## 9. Free space — anything else

Lead-in: Anything you've thought about that the prompts above didn't reach. Quirks, edge cases, "I once saw an editor do X and I want that," dreams, gripes.

> *(Sean: write here.)*

---

## Open Research Items

*(Populated after Sean's fill-in by the synthesizing agent.)*

- Does this feature ship as part of v5.0 or is it a v5.1 follow-on?
- Does the auto-detection layer require its own parser pass or does it live inside the existing CodeMirror extension chain?
- How does this feature interact with the future collab/AI integrations (`@claude` mentions, sticky-note layout)?
