# AI Features — Phase 1 Review

**Created**: 2026-04-27
**Version**: v0.1 (seed)
**Status**: Research Phase — open
**Wave**: 2 (depends on Wave 1 positioning)

---

## Bucket Purpose

Identify the small set of AI affordances that would meaningfully improve a writer's workflow in Thot — without turning Thot into "yet another AI chat sidebar." Sean's instinct (per `UPDATE_v4_0_0.md`): the goal is *ambient* AI that reduces cognitive load, not *foreground* AI that interrupts thought.

---

## Initial Research Questions

1. **Predictive tab completion in normal prose** — Cursor/Anti-Gravity-style. What's the user experience when this is good vs. bad? Cost per completion? Latency budget? How is it disabled gracefully?
2. **Format-on-save** — Anti-Gravity's chart cleanup is the canonical example: messy ASCII tree → perfect tree on save. What other "tidy this up for me" actions are valuable in a markdown editor? (Heading hierarchy normalization, list nesting cleanup, table column alignment, link reference de-duplication.)
3. **Predictive completion provider/model choice** — local model (small, free, private) vs. hosted (better, costs $/token, requires server). What are 2026 options at each end? (Claude Haiku, GPT-4o-mini, Llama 3, Gemini Nano on-device.)
4. **Where does AI live architecturally?**
   - Client-side (privacy-positive, latency-positive, capability-limited)
   - Server-side (capability-positive, requires backend, costs money)
   - User-BYOK (bring-your-own-key) (capability-positive, no per-user cost, friction)
5. **Latency budget for predictive features** — at what response time does a tab-completion stop feeling helpful and start feeling laggy? (Reference: Cursor's threshold is ~200ms.)
6. **AI affordances for the wider audience** (non-dev markdown writers) — what AI feature would matter to a Google Docs migrant? Probably *not* "complete my code." Maybe "rewrite this paragraph in active voice," "summarize this section," "find the heading I'm looking for."
7. **What NOT to build** — chat sidebars, ghostwriting tools, image generation. Stay focused on writing-flow affordances.

---

## Priors / Known Constraints

- Thot's editor is CodeMirror 6 — predictive completion has reasonable hooks via `ViewPlugin` + autocomplete extensions.
- Per `DEV_RULES.md`, training data ages fast; AI provider/model research must check 2026 reality, not pre-training assumptions.
- Cost model directly affects `monetization` bucket — paid tier likely centers on AI affordances.

---

## Source Pointers

- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Forward Thinking Becoming More Urgent" — Sean's notes on Cursor predictive completion, Dia tab grouping, recording-device formatting
- `docs/archive/v4_0/UPDATE_v4_0_0.md` mention of Stripe's AI billing tools

---

## Open Items

- All. Seed only.
