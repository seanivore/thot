# Phase 1 Review — v4.0.0 Research

**Created**: 2026-04-27
**Version**: v0.1 (seed)
**Status**: Research Phase — open

---

## Purpose

Top-level meta document for Phase 1 of the v4.0.0 research stream. Tracks which buckets are open, partially covered, or ready to consolidate into Phase 2. Updated as bucket research progresses.

This file pairs with `1_REFINE.md` (decisions on follow-ups and priority shifts) and ultimately with `final_recommendations.md` that closes Phase 1.

---

## Bucket Status

| Bucket                  | Status | Lead questions surfaced | Notes                              |
| ----------------------- | ------ | ----------------------- | ---------------------------------- |
| `market-positioning`    | open   | yes (seed)              | Wave 1 priority — see protocol B.3 |
| `collab-for-markdown`   | open   | yes (seed)              | Wave 1 priority — strategic wedge  |
| `ai-features`           | open   | yes (seed)              | Wave 2                             |
| `auth-and-accounts`     | open   | yes (seed)              | Wave 2                             |
| `sync-and-cross-device` | open   | yes (seed)              | Wave 2                             |
| `monetization`          | open   | yes (seed)              | Wave 2                             |
| `native-apps`           | open   | yes (seed)              | Downstream of architecture         |
| `feature-research`      | open   | yes (seed)              | Tactical, parallelizable           |

---

## Wave Sequencing (per `docs/archive/v3_4/v3_4_0_DEV_PLANNING.md` § B.3)

1. **Wave 1** — `market-positioning` + `collab-for-markdown`. These define *who Thot is for* and the differentiating wedge.
2. **Wave 2** — `ai-features` + `auth-and-accounts` + `sync-and-cross-device` + `monetization`. Constrain technical architecture.
3. **Wave 3** — `native-apps`. Downstream of architecture.
4. **Parallel anytime** — `feature-research`. Tactical, not strategic.

---

## Cross-cutting questions (touch multiple buckets)

These are flagged here because they don't belong to any single bucket but inform several:

- What is the smallest viable subset of v4.0.0 that ships before the full picture is locked? (touches every bucket)
- Are there any constraints from `thots.august.style` deployment / Vercel config that would limit architecture choices? (touches `sync`, `auth`, `native-apps`)
- Sean's existing user base from PWA — what do they want vs. what does the wider audience want? (touches `market-positioning`, `monetization`)

---

## Open Items

- No bucket has been worked on yet beyond seeding. This file gets meaningful content once at least one bucket reaches a `final_recommendations.md`-worthy state.
