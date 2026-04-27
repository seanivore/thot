# Sync and Cross-Device — Phase 1 Review

**Created**: 2026-04-27
**Version**: v0.1 (seed)
**Status**: Research Phase — open
**Wave**: 2

---

## Bucket Purpose

Architect cross-device persistence. Sean's stated need (per `UPDATE_v4_0_0.md`): documents written on the laptop should appear on the phone, and vice versa, without manual copy-paste. This is a prerequisite for serious daily use — currently `localStorage` is per-device, so the same user has fragmented state across devices.

The architecture choice here cascades: it constrains `auth-and-accounts`, `collab-for-markdown`, `monetization`, and `native-apps`.

---

## Initial Research Questions

1. **Single-user multi-device first.** Skip live collab for the MVP — get docs to follow the user across devices. What's the minimum viable approach?
   - Append-only event log (CRDT-style) to a hosted KV.
   - Per-doc snapshot sync to object storage (S3-style).
   - Hosted relational DB (Postgres on Supabase, Neon, etc.).
   - Edge-distributed KV (Cloudflare Workers KV, D1).
2. **CRDT vs. last-write-wins** — for single-user multi-device, LWW is usually enough. CRDT becomes essential when adding multi-user collab. Should v4 commit to CRDT from day one to avoid a rewrite, or LWW first then layer CRDT later?
3. **2026 backend options for a small project:**
   - **Supabase** — Postgres + auth + storage + edge functions, reasonable free tier.
   - **Cloudflare Workers + D1 + R2** — edge-native, low latency, good free tier.
   - **Neon** — serverless Postgres, branching, generous free tier.
   - **Convex** — built for real-time apps, opinionated.
   - **Custom Vercel + KV** — already deploying on Vercel; minimum new infra.
   - Cost, vendor-lock, privacy posture, and operational complexity per option.
4. **End-to-end encryption?** If document content is encrypted with a user-derived key, the server never sees plaintext. Search across docs becomes hard; password recovery becomes catastrophic. Worth it?
5. **Conflict UX** — when a user edited the same doc on two devices while offline, what does the merge UI look like? CRDT auto-resolves; LWW shows a "your version vs. server version" picker. What does the audience expect?
6. **Mobile constraint** — iOS Safari is hostile to background sync. What sync model works under those constraints?
7. **Existing-data migration** — every current Thot user has docs in `localStorage`. First-time-after-account-creation needs to upload those without losing them.

---

## Priors / Known Constraints

- Thot already deploys on Vercel; Vercel-adjacent infra (Vercel Postgres, Vercel KV, Edge Config) is operationally simplest.
- Sean's privacy lineage favors E2E if feasible.
- The v3.1.2 single-draftpad model (`?id=main`) and v3.4.0 `thot:open-windows` registry are already partition-by-ID; sync layer needs to mirror this.
- Decision affects every other v4 bucket — this one needs to land before `auth-and-accounts` is finalized.

---

## Source Pointers

- `docs/archive/v4_0/UPDATE_v4_0_0.md` § "Realizing" — sync across devices ask
- `docs/THOT_APP.md` — current persistence architecture
- `docs/archive/v3_3/v3_2_0_FEEDBACK.md` § "Open Questions for Next Session" — cross-device persistence flagged

---

## Open Items

- All. Seed only.
