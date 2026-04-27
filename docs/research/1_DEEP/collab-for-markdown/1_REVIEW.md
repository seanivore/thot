# Collab for Markdown — Phase 1 Review

**Created**: 2026-04-27
**Version**: v0.1 (seed)
**Status**: Research Phase — open
**Wave**: 1 (highest priority — strategic wedge)

---

## Bucket Purpose

Investigate the apparent gap: **there is no good real-time collaborative editor for teams writing markdown together** the way marketing teams use Google Docs. Sean's hypothesis (per session note 2026-04-27): given how much modern work is "iterate on a doc with humans + AI," this is potentially Thot's defining differentiator.

This bucket either validates that gap as a real product opportunity or shows why others have already solved it.

---

## Initial Research Questions

1. **How do dev teams currently collaborate on markdown?** Git PRs on text documents (the absurd-but-real status quo), or something else? What does this actually look like in practice for non-dev teams using markdown?
2. **What real-time collab solutions exist for plain text / markdown today?**
   - HedgeDoc, Etherpad, GitHub.dev, VS Code Live Share, GitHub.dev Codespaces, Notion (proprietary structure), Coda, ClickUp Docs.
   - Which support markdown specifically vs. rich text only? Which are open-source vs. proprietary?
   - Who uses each, and why?
3. **CRDT vs. OT for plain-text editing** — what's the current state of the art? Y.js, Automerge, Diamond Types, Loro. What do they cost (latency, complexity, infrastructure)? What does each constrain at the architecture level?
4. **What would "Google Docs for markdown" look like as a product?** Sketch the user surface: cursors visible to peers, comments, suggestions/edits, version history, share-link permissions. What's table-stakes vs. differentiating?
5. **Audience reality check** — do non-dev markdown users actually exist in teams (not solo)? Or is "team markdown" mostly devs writing READMEs in PR review? If the audience is small, the wedge is weaker.
6. **Backend implications** — real-time collab forces a server (or peer-to-peer with relay). What's the smallest viable backend? (Touches `sync-and-cross-device` and `monetization` buckets.)
7. **Privacy/sovereignty** — for the kind of writers Thot wants to attract (privacy-conscious, cognitive-load-conscious), what's the trust model for a hosted collab service? Self-host option needed?

---

## Priors / Known Constraints

- Thot's current persistence is `localStorage`-only. Adding collab is not incremental — it forces a backend decision.
- Sean has a privacy-conscious branding lineage (Web3 privacy DAO experience). Trust/sovereignty positioning matters.
- The collab story directly affects `monetization` (live multi-user editing is something teams pay for) and `auth-and-accounts` (you need user identity to attribute edits and cursors).

---

## Source Pointers

- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Collaboration" — Sean's first articulation of this opportunity
- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Forward Thinking Becoming More Urgent" — strategic framing
- The 2026-04-27 session note where Sean explicitly framed this as a market gap

---

## Open Items

- All. Seed only.
