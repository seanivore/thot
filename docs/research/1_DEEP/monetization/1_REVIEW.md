# Monetization — Phase 1 Review

**Created**: 2026-04-27
**Version**: v0.1 (seed)
**Status**: Research Phase — open
**Wave**: 2

---

## Bucket Purpose

Decide how Thot generates revenue without kneecapping the product or breaking the trust posture. Sean's instinct: the free tier must remain genuinely useful (not a 3-day trial with paywalls); the paid tier earns its money by unlocking real value (sync, collab, AI affordances).

---

## Initial Research Questions

1. **Tier structure** — what's free, what's paid?
   - Candidate free: full local editor, one-device localStorage, no AI, no collab.
   - Candidate paid: cross-device sync, AI affordances, multi-user collab, file management UI.
   - Where does the User Preferences UI (v3.5.0) sit? Probably free — it's a usability baseline.
2. **Pricing model:**
   - Flat monthly subscription (Notion-style).
   - Usage-based for AI (tokens charged through, see Stripe AI billing).
   - Hybrid: flat for sync+collab, metered for AI.
   - Lifetime license (Bear-style) — minority of buyers but non-trivial.
3. **Stripe AI billing for token usage** — Sean noted Stripe has tools now for charging-or-being-charged for AI tokens. Investigate: how does this work in practice? Does it support per-user metering and a sane UX?
4. **Agent payment systems** — Sean mentioned articles about Stripe building purchase systems specifically for AI agents. Probably not relevant for Thot v4 directly, but worth noting if Thot eventually has agent integrations.
5. **Free tier limits that don't feel hostile** — devices? word count? doc count? feature gating? The pattern matters more than the limit.
6. **Trust posture and pricing** — Sean's privacy/sovereignty lineage. Self-hosting option for paid users? Bring-your-own-AI-key as a fallback (avoids charging for AI tokens but still requires paying for sync)?
7. **Competitive pricing landscape** — Notion, Bear, iA Writer, Ulysses, Craft, Obsidian Sync. What do they charge? What do they include in free?

---

## Priors / Known Constraints

- Sean is a designer and freelancer; the project must eventually generate enough revenue to justify continued development. "Open source forever, no monetization" is not the goal.
- Thot's existing user base is small and dev-leaning; pricing experiments can run with low blast radius.
- AI features have a hard cost floor (tokens cost money). Ignoring this is how products go bankrupt.

---

## Source Pointers

- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Forward Thinking Becoming More Urgent" — Stripe AI billing mention
- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Business Planning" — Sean's framing on roll-out

---

## Open Items

- All. Seed only.
