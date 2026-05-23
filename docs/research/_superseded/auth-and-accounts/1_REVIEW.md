# Auth and Accounts — Phase 1 Review

**Created**: 2026-04-27
**Version**: v0.1 (seed)
**Status**: Research Phase — open
**Wave**: 2

---

## Bucket Purpose

Decide whether Thot needs user accounts, and if so, what the auth surface looks like. Sean's instinct (per `UPDATE_v4_0_0.md`): account-less local mode must remain the default; auth unlocks sync, collab, and paid AI features but is not required for the basic writing experience.

---

## Initial Research Questions

1. **Does the v4.0.0 minimum-viable scope require accounts?** Probably yes (sync, collab, AI gating). But is there a smaller v4 cut that doesn't?
2. **Auth provider choice for 2026:**
   - Passkeys (WebAuthn) — friction-low, modern, privacy-positive. Browser/device support landscape?
   - Sign in with Apple — clean for iOS/macOS users, provides email-relay privacy.
   - Sign in with Google — broadest reach, most users already have it, less privacy-positive.
   - Email magic-link — simplest, slow but reliable, no third-party dependency.
   - Multiple — common but expensive in dev/UI overhead.
3. **What does an account *actually store* for Thot?**
   - User identity (for collab attribution).
   - Sync token / encrypted-doc keys.
   - Subscription state (for monetization).
   - User preferences (post-v3.5.0 Preferences UI).
4. **Privacy posture** — Sean's branding lineage values privacy. Can accounts be designed so the *server never sees document content* (E2E-encrypted with user-derived keys)? What's the cost (sync complexity, search across docs, password recovery)?
5. **Free tier vs. paid tier line** — what's accessible without an account? With a free account? With a paid subscription? (Touches `monetization`.)
6. **Account-less local mode** — must remain a first-class path. How do we keep "open `thots.august.style`, type, save to localStorage" exactly as-is for users who never sign in?

---

## Priors / Known Constraints

- Current persistence is `localStorage`-only. Adding accounts is additive, not replacement.
- Stripe-Atlas-style integrations exist for managing accounts + billing in one stack; investigate whether Stripe handles auth or only billing.
- Browser-native passkey support is broad in 2026 but mobile Safari has historically had quirks.
- Constraints downstream: `sync-and-cross-device` needs whatever auth provides; `collab-for-markdown` needs identity for cursors and comments.

---

## Source Pointers

- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Notes Collected Over Time" — passkey, Google login, Apple login mentions
- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Forward Thinking Becoming More Urgent" — login/auth feature ask

---

## Open Items

- All. Seed only.
