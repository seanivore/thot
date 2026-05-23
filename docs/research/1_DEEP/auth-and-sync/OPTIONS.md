# Auth & Sync Options for Thot

**Created**: 2026-05-06
**Version**: v1.0
**Status**: Research Phase (Phase 1, `1_DEEP/`)

---

## Tooling Note (read first)

This document was produced under a constraint: live web search and external doc fetching were not available in the session. Findings below rely on the agent's knowledge through January 2026 plus the project's existing context. Vendor-specific claims (free-tier MAU thresholds, exact passkey GA dates, pricing line items) are flagged inline as **VERIFY** wherever a number or status could shift quarter-to-quarter. Phase 2 should re-verify each VERIFY tag against the cited canonical URLs before any architectural lock-in. The framing, comparative shape, and recommendation are robust to expected drift; the exact dollar amounts and "is feature X GA today?" answers are not.

---

## Project Constraints (from context)

1. **Passkey-first** is non-negotiable per Sean's product values; password+social are fallback only.
2. **PWA** — currently a Vite + TypeScript + CodeMirror 6 PWA at `thots.august.style`. Single-page, no Next.js, no SSR. Service worker via Workbox. Content saved to `localStorage`.
3. **Vercel-deployed** — current host. Stack decisions should be Vercel-friendly.
4. **No backend yet.** Greenfield from the persistence layer outward. No legacy schema to honor.
5. **Free tier matters** for early stage; product is single-user today, "small team" eventually.
6. **Future direction**: per-user document sync across devices → eventual real-time collaboration on documents → AI integrations (`@claude` mentions inside docs).
7. **iOS Safari PWA** is critical and historically painful — v3.1.2's persistence model exists *because* iOS Safari strips dynamic PWA launch parameters. Any auth flow that relies on a redirect after `window.open` or third-party cookies on iOS is suspect.

---

## Part 1 — Auth Provider Options

### A. Supabase Auth (with Postgres + Realtime)

**Passkey support quality**: Supabase Auth supports WebAuthn through its MFA factor system. As of late 2025 / early 2026, passkeys in Supabase are exposed primarily as a **second-factor (MFA) WebAuthn factor**, layered on top of email/OTP or OAuth as the primary identifier. This means "passkey-first sign-in" — where a returning user taps "Sign in with passkey" and never types an email — is **not the native happy path**. You can build passkey-primary on top of Supabase by treating the passkey as a custom credential and using Supabase's session JWT, but you'd be writing the WebAuthn ceremony yourself with `supabase.auth.admin.*` issuing the session — which gets you 80% of the way to "custom WebAuthn + Supabase as DB" rather than a true Supabase-native flow. **VERIFY** whether Supabase has shipped passkey-as-primary by Q2 2026 — this was on the roadmap at cutoff.
- Source: https://supabase.com/docs/guides/auth/auth-mfa (MFA WebAuthn factor)

**PWA / iOS Safari quirks**: Supabase Auth uses `@supabase/supabase-js` with sessions stored in `localStorage` (or a custom storage adapter). No third-party cookies needed for the JS SDK flow. OAuth redirect flows do touch the iOS Safari quirks — but for passkey/magic-link the JS-only flow is clean inside a PWA. This is one of the cleaner stories on iOS.

**Free tier**: Two organizations free, projects pause after 7 days of inactivity (a real concern for a side project), 50K MAU, 500 MB Postgres, 2 GB bandwidth, 5 GB egress, 50K Realtime concurrent connection-minutes (or similar tiered limits). **VERIFY** — these have shifted at least once a year. Generous compared to Clerk for hobby use; the auto-pause is the real catch.
- Source: https://supabase.com/pricing

**Sync / realtime story**: Native — Supabase Realtime offers Postgres CDC ("listen to row changes"), Broadcast (pub/sub channels), and Presence. Postgres CDC is the obvious fit for "document changes broadcast to the user's other devices." For genuine concurrent collab editing (multiple cursors in the same doc), Realtime Broadcast is the transport but you still need a CRDT/OT layer on top — Supabase doesn't ship that.
- Source: https://supabase.com/docs/guides/realtime

**Complexity**: Low for auth + DB + per-user sync. Moderate when adding collaboration — you wire Yjs over Supabase Broadcast yourself.

**Lock-in risk**: Low-to-moderate. Postgres is portable; Auth tables and JWT structure are Supabase-specific but not unusual to migrate. Realtime is a custom protocol — replace with pure Postgres LISTEN/NOTIFY or another transport if needed.

---

### B. Clerk

**Passkey support quality**: Strong. Clerk shipped passkey GA in 2024 and treats them as a first-class primary factor — users can sign up *with* a passkey and sign in with it as the sole credential (subject to platform support). Add-passkey-after-signup is a one-line component. This is probably the cleanest passkey-first developer experience in the market.
- Source: https://clerk.com/docs/authentication/passkeys (**VERIFY** URL/path)

**PWA / iOS Safari quirks**: Clerk's drop-in components assume React or Next.js, but their `@clerk/clerk-js` core is framework-agnostic and works in plain Vite. PWA-wise, sessions are JWT-cookie based (HttpOnly, SameSite=Lax) by default — fine for same-origin PWAs. Their iOS-specific gotcha historically has been the `<ClerkProvider>` redirect-back URL on standalone PWAs; the `routerPush`/`routerReplace` props let you intercept this and use the in-app router instead of `window.location`.

**Free tier**: 10K MAU free as of cutoff. Above 10K it jumps to ~$25/month + $0.02/MAU. Passkeys, social login, magic links are all on free. Organizations / RBAC are on the paid Pro plan. **VERIFY** — Clerk has restructured tiers at least twice.
- Source: https://clerk.com/pricing

**Sync / realtime story**: None. Clerk is auth-only; you bring your own DB and sync layer. Clerk + Vercel Postgres (Neon) + your-choice-of-realtime is the typical pattern.

**Complexity**: Lowest of the auth-only options for getting passkey-first running. Highest "all-in" complexity because you still need a DB + sync stack.

**Lock-in risk**: Moderate. Clerk's user model and session JWTs are theirs; migration off requires re-issuing credentials (passkeys do not transfer between providers — this is a fundamental WebAuthn property, not a Clerk-specific flaw, but it's worth naming because users would have to re-enroll).

---

### C. Auth.js (formerly NextAuth)

**Passkey support quality**: Auth.js v5 added a WebAuthn provider in 2024 (experimental → stable somewhere in 2025). It works, but it's bring-your-own-storage and the maintainers have been clear it's a relatively thin wrapper over `@simplewebauthn/server`. You get the protocol; you wire the UX.
- Source: https://authjs.dev/getting-started/authentication/webauthn

**PWA / Vite fit**: Auth.js's branding is Next.js-first but the core is framework-agnostic — there are SvelteKit, Express, and SolidStart adapters. **There is no first-class plain-Vite/SPA adapter.** Thot is a non-Next Vite SPA with no server runtime. Using Auth.js means standing up a server (Vercel Functions, Hono on Vercel, etc.) just to host the Auth.js endpoints. That's not a deal-breaker, but it pushes Auth.js out of "drop-in" territory and into "you're now running a backend."

**Free tier**: Auth.js itself is free/OSS. You pay for whatever you store sessions in (Postgres, Redis, etc.).

**Lock-in**: Lowest of any option. Pure OSS, owns nothing.

**When to choose it**: When the project converts to Next.js or a framework with a first-class adapter. As of Thot's current Vite SPA shape, it's the wrong tool — you'd be building most of an auth server on top of it.

---

### D. WorkOS / Stytch

**Passkey support quality**: Both ship strong passkey-first flows. Stytch has historically had the most polished passkey-only UX, with WebAuthn-only sign-up paths. WorkOS has acquired Warrant (authz) and grown its consumer-auth surface significantly through 2024–2025; AuthKit (their drop-in) supports passkeys.
- Sources: https://stytch.com/docs/passwordless/webauthn , https://workos.com/docs/user-management

**PWA / iOS Safari quirks**: Both work fine in PWAs. Stytch's pure-JS SDK is well-suited to Vite SPAs; WorkOS's AuthKit is a hosted page (redirect flow) which has the same iOS-PWA-redirect concerns as any OAuth-style hop.

**Free tier**: WorkOS made a notable move in 2024 making **User Management free up to 1 million MAU** for the consumer-auth product — it's a deliberate stake-in-the-ground vs. Clerk. **VERIFY** the current ceiling. Stytch has a free tier in the 5K–10K MAU range. **VERIFY**.
- Sources: https://workos.com/pricing , https://stytch.com/pricing

**Sync / realtime**: Neither ships a sync layer. Same situation as Clerk — bring your own DB + realtime.

**Complexity**: Stytch SDK is comparable to Clerk in DX; WorkOS AuthKit is slightly more "enterprise-shaped" but increasingly consumer-friendly.

**Lock-in**: Comparable to Clerk. WorkOS's positioning emphasizes "no lock-in" and they document the migration path.

---

### E. Custom WebAuthn + Vercel/Neon Postgres

**Passkey support quality**: As good as you build it. `@simplewebauthn/browser` and `@simplewebauthn/server` are the de-facto libraries. You own the ceremony, the credential storage table, the challenge nonces, the rate limiting.
- Source: https://simplewebauthn.dev/

**PWA / iOS quirks**: You control everything, so you can sidestep every iOS oddity that hits hosted-page providers. The flip side: when iOS 19/20 changes WebAuthn behavior (and it will), you handle the regression yourself.

**Free tier**: Whatever your Postgres/host costs. Neon free tier is generous (~0.5 GB storage, autosuspend); Vercel Postgres (now powered by Neon) similar. **VERIFY**.

**Sync**: Roll your own — most likely Postgres LISTEN/NOTIFY for cheap pub/sub, plus Server-Sent Events from Vercel Functions for the client side. Or layer Liveblocks / a hosted Yjs provider on top.

**Complexity**: High for v1. You're writing auth code that providers have written, audited, and battle-tested. The bug surface for "passkey + email recovery + lost-device flow + account-recovery email-deliverability" is substantial.

**Lock-in**: None. Maximum portability.

**When to choose it**: When you've outgrown a provider, when you have specific compliance needs no provider meets, or when the auth surface is so simple (passkey + magic link, no orgs, no MFA-beyond-passkey) that the provider's overhead exceeds the rolled-your-own work. Thot may eventually qualify under that last condition; not at v1.

---

### F. Other genuinely worth-considering options

- **Hanko** — open-source passkey-first auth, self-host or hosted cloud. Smaller ecosystem than the above but the cleanest "passkey is the product" positioning. **VERIFY** maturity in 2026.
  - Source: https://www.hanko.io/
- **Logto** — open-source Auth0 alternative; has WebAuthn. Self-host friendly.
  - Source: https://logto.io/
- **Kinde** — newer entrant with passkey support and a generous free tier.
  - Source: https://kinde.com/
- **Auth0** — the legacy giant. Passkeys supported, but pricing escalates fast above the small-team band. Not recommended here.

---

## Part 2 — Sync Layer Options (independent of auth)

The sync question splits into two regimes that shouldn't be conflated:

1. **Per-user device sync** — same user editing the same doc on phone and laptop, not concurrently, but expecting "what I wrote on phone shows up on laptop." Last-writer-wins per-doc is sufficient. Simple Postgres rows with `updated_at` timestamps + a pull-on-focus + a debounced push handle this.
2. **Concurrent multi-user collaboration** — two humans (or a human and a Claude agent) typing in the same doc simultaneously. This requires a CRDT or OT, a presence channel, and a transport. Last-writer-wins corrupts data here.

Treating these as the same problem leads people to over-engineer v1 (Yjs from day one) or under-engineer v3 (LWW on a collab editor → silent data loss).

### Sync option comparison

#### Yjs (CRDT, OSS)
- **What it is**: The de-facto JS CRDT library. Battle-tested in BlockNote, Tiptap, JupyterLab, etc.
- **Fit with CodeMirror 6**: Excellent. `y-codemirror.next` is a maintained, first-party-quality binding.
- **Transport**: BYO. `y-websocket`, `y-webrtc`, or layer over Supabase Broadcast / a custom WS server / Liveblocks (which uses Yjs under the hood).
- **Persistence**: BYO (`y-indexeddb` for offline, `y-leveldb` server-side, etc.).
- **Complexity**: Moderate to set up; cheap to maintain once running.
- **Lock-in**: None. Pure OSS, the document format is portable.
- Source: https://yjs.dev/ , https://github.com/yjs/y-codemirror.next

#### Liveblocks
- **What it is**: Hosted realtime infrastructure with a Yjs-compatible API and presence/awareness primitives.
- **Fit**: Drops into CodeMirror via `@liveblocks/yjs` + the same `y-codemirror.next`.
- **Free tier**: Generous for early stage — MAU-style limits, **VERIFY**.
- **Pros**: Managed transport + persistence; presence and comments come free; clean DX.
- **Cons**: Hosted dependency; cost scales with active rooms.
- **Lock-in**: Moderate — the Yjs document format is portable but the room/presence API is theirs.
- Source: https://liveblocks.io/

#### Automerge
- **What it is**: The other major CRDT, with Rust core and a stronger story for local-first / offline-first apps.
- **Fit with CodeMirror 6**: `@automerge/automerge-codemirror` exists and is maintained, though the ecosystem is thinner than Yjs's.
- **Transport / sync server**: Automerge Repo with `automerge-repo-network-websocket` or similar. They've also published an experimental sync server.
- **Pros**: Best-in-class for local-first; the `@automerge/automerge-repo` model handles offline-edit-then-reconcile elegantly, which matches a PWA's lifecycle better than Yjs's "you need to be connected to merge" mental model.
- **Cons**: Smaller ecosystem; the CodeMirror integration is not as polished as Yjs's.
- **Lock-in**: None.
- Source: https://automerge.org/

#### Supabase Realtime (Broadcast / Presence / Postgres CDC)
- **What it is**: Three primitives bundled into Supabase. Postgres CDC for "row changed → push to client"; Broadcast for ephemeral pub/sub; Presence for who's-online.
- **Fit**: Excellent for regime 1 (per-user device sync) — store doc as a row, listen for changes. For regime 2 (collab), Broadcast is the transport but you'd run Yjs/Automerge on top.
- **Pros**: Same vendor as auth and DB if Supabase is the auth choice; one less thing to configure.
- **Cons**: For collab, you'd still bring a CRDT.
- Source: https://supabase.com/docs/guides/realtime

#### Custom CRDT
- **Don't.** Building a correct CRDT is a research-grade undertaking. Yjs and Automerge exist for a reason.

---

## Part 3 — Crosscutting Concerns

### iOS Safari PWA passkey behavior
- Passkeys work in Safari iOS 16+. The platform passkey is stored in iCloud Keychain and syncs across the user's Apple devices automatically. This is the best-case experience for "I made a passkey on my iPhone and now I'm signing in on my MacBook."
- The PWA-specific failure mode that bit Thot at v3.1.1 was `manifest_url` overrides and `?id=` parameter loss on cold-launch. Auth flows should not rely on URL parameters surviving a Safari standalone PWA cold launch. Sessions in `localStorage` (or `IndexedDB`) survive; URL state does not necessarily.
- Cross-origin auth redirects from a standalone PWA on iOS historically opened SFAuthenticationSession / SFSafariViewController, which loses the session cookie back in the PWA. This is why JS-only flows (Supabase magic link processed in the SPA, Clerk's `clerk-js` UI components) are safer than hosted-page redirects (Auth0 Universal Login, WorkOS AuthKit redirect mode) for iOS PWAs. **VERIFY** current iOS 18/19 behavior.

### "Login with Google/Apple" fallback
- Sean's stated reluctance is real, but on iOS in particular, **Sign in with Apple** is socially the lowest-friction non-passkey path and is required by App Store policy for any app offering third-party sign-in. Adding it costs ~30 minutes via any of the providers above and removes a significant fraction of "I lost my passkey, now what?" support emails.
- Recommendation: passkey primary, magic-link email fallback, Sign in with Apple as the one social option. Skip Google for now (avoid the consent-screen verification overhead until there's revenue).

### Account recovery
- Passkey-only accounts have a recovery problem the moment the user loses all their devices. The standard pattern is: (a) require an email on signup so a recovery magic-link works, or (b) provide one-time recovery codes at passkey creation time.
- Every provider above supports (a). Only some make (b) easy. Worth a Phase 2 verification.

### AI integration (`@claude` in docs)
- This is a sync-layer concern, not an auth concern. The cleanest pattern is: Claude is "another collaborator" on a Yjs document, with a service account, writing through the same CRDT mutations a human would. This works identically whether the transport is Liveblocks, custom WS over Supabase, or self-hosted `y-websocket`.
- It does not constrain the auth choice.

---

## Comparative Matrix

| Option                       | Passkey-first DX | iOS PWA fit | Free tier (early) | Sync included | Vite/SPA fit | Lock-in    |
| ---------------------------- | ---------------- | ----------- | ----------------- | ------------- | ------------ | ---------- |
| Supabase Auth                | Good (MFA-ish)   | Good        | Generous*         | Yes (no CRDT) | Excellent    | Low-Mod    |
| Clerk                        | Excellent        | Good        | 10K MAU           | No            | Good         | Moderate   |
| Auth.js                      | Decent           | N/A         | Free OSS          | No            | Poor (no SSR)| Low        |
| WorkOS                       | Strong           | OK (redir.) | Very generous*    | No            | Good         | Moderate   |
| Stytch                       | Excellent        | Good        | Modest            | No            | Excellent    | Moderate   |
| Custom WebAuthn + Neon       | As-built         | Excellent   | Generous          | DIY           | Excellent    | None       |
| Hanko                        | Excellent        | Good        | Generous (OSS)    | No            | Good         | Low        |

*subject to project pause / cold-start tradeoffs

---

## Open Research Items (to verify in Phase 2)

1. **Supabase passkey-as-primary status.** Has the "passkey-first sign-in (no email step)" path shipped, or is passkey still gated as an MFA factor on top of an email primary?
2. **Clerk pricing structure as of Q2 2026.** Free MAU, paid jump, organizations gating.
3. **WorkOS User Management free MAU ceiling.** Was 1M at announcement; verify current.
4. **iOS Safari 18/19 passkey + standalone PWA behavior.** Specifically: redirects, cookie persistence after passkey ceremony, `navigator.credentials.create` from a standalone PWA installed via "Add to Home Screen" vs. from Mobile Safari.
5. **Liveblocks pricing for "small team" (5–25 collaborators).** Whether per-MAU or per-room pricing applies and which dominates.
6. **Hanko production readiness in 2026.** Smaller team — verify funding, recent release cadence, customer references before betting on it.
7. **Whether Clerk's `@clerk/clerk-js` (vanilla) covers passkey UX as cleanly as `@clerk/clerk-react`.** Thot is plain Vite TS, not React. The vanilla SDK exists; the question is whether the passkey UI components ship in vanilla or only in the React package.
8. **`y-codemirror.next` compatibility with the current CodeMirror 6 ecosystem package versions Thot uses,** especially around the custom `styleTags` + `ViewPlugin` setup in `editor.ts`. Yjs binding intercepts transactions; the existing autocorrect filter and marker ViewPlugin must coexist.

---

## Recommendation

### Auth: Clerk

**Why.** Passkey-first is non-negotiable for Sean, and Clerk has the cleanest passkey-primary developer story in the market. Their free tier (10K MAU at cutoff) is more than enough for the foreseeable Thot user base. The `@clerk/clerk-js` vanilla SDK fits a Vite SPA without forcing a framework rewrite. The drop-in UI handles the lost-device / passkey-recovery edge cases that would otherwise cost weeks. And Clerk is a Vercel Marketplace-native integration, which means env-var provisioning is one click rather than a config drift hazard.

**Why not Supabase Auth (the other strong contender).** Supabase's value proposition is the bundle: auth + Postgres + Realtime in one console. That's compelling. But the passkey story today is MFA-shaped, not primary-shaped, and Sean's "passkeys MOST IMPORTANT" framing makes that gap costly. Choosing Supabase means either (a) accepting an email/OTP primary with passkey as 2FA, which is not what Sean said he wants, or (b) building a custom passkey-primary flow on top of Supabase, which negates Supabase's "easy auth" advantage.

**Why not Auth.js.** Vite SPA without a Next.js/SvelteKit-shaped server runtime makes Auth.js the wrong tool. Revisit if/when Thot adopts a server framework.

**Why not custom WebAuthn at v1.** The auth surface (passkey + magic link + Sign in with Apple) is implementable but the bug surface around recovery, rate limiting, and email deliverability is real. Defer until there's a forcing function.

### Sync: Postgres for v1, layered Yjs + Liveblocks (or Yjs + custom WS) when collab ships

**v1 (per-device sync, single user)**: Use **Vercel Postgres / Neon** with a `documents` table keyed by `user_id` and `document_id`. Push on debounced editor change; pull on focus / `visibilitychange`. No realtime needed. Last-writer-wins per-doc, with a soft conflict UI ("this doc was edited on another device, want to reload?") if `updated_at` mismatches.

**v2 (collab)**: Add **Yjs + `y-codemirror.next`**, with **Liveblocks** as the hosted transport. Liveblocks gives presence and persistence out of the box and is the cheapest path to "two cursors in one doc." Yjs documents stay portable — if Liveblocks costs become uncomfortable, swap the transport for self-hosted `y-websocket` on a small VPS without changing application code.

**Why not Supabase Realtime as the v1 sync transport.** Real per-device sync at v1 doesn't need pub/sub. A polling-on-focus pull is simpler, cheaper, and doesn't add a connection limit to worry about. Reach for Realtime when the use case actually demands it (collab cursor presence), and at that point Yjs/Liveblocks is a more direct fit.

**Why not Automerge.** It's the most architecturally elegant option for a local-first PWA, but the CodeMirror binding ecosystem is thinner than Yjs's. Revisit at v3+ if the local-first story becomes the product's wedge.

### Stack at a glance

```
Auth:        Clerk (passkey-primary, magic-link fallback, Sign in with Apple)
DB:          Vercel Postgres / Neon (per-user docs, soft tier)
v1 Sync:     pull-on-focus + push-on-change (no realtime needed)
v2 Sync:     Yjs + y-codemirror.next + Liveblocks transport
AI:          Claude as a Yjs participant via service account; same channel as humans
Hosting:     Vercel (current)
```

### What triggers a re-evaluation

- **Clerk pricing changes** that move the free tier below ~5K MAU, or that gate passkey behind Pro. Either makes WorkOS or Stytch the better choice.
- **Supabase ships passkey-primary GA** with a clean Vite-friendly SDK. Re-evaluate the bundle math; the simplicity of "one vendor for auth + DB + Realtime" becomes very tempting if the passkey gap closes.
- **Liveblocks pricing** crossing the threshold where self-hosting Yjs is cheaper. Likely happens around several hundred concurrent collab rooms — well past launch.
- **Thot adopts a server framework** (Next.js, SvelteKit, Hono on Vercel Functions). At that point Auth.js + custom WebAuthn becomes viable as a zero-vendor option.
- **iOS Safari regression** in passkey or PWA behavior that breaks Clerk's drop-in flow. Always possible after a major iOS release; if it happens, custom WebAuthn becomes the escape hatch.

---

## Sources Cited

- Supabase Auth MFA / WebAuthn: https://supabase.com/docs/guides/auth/auth-mfa
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- Supabase Pricing: https://supabase.com/pricing
- Clerk Authentication options: https://clerk.com/docs/authentication
- Clerk Pricing: https://clerk.com/pricing
- Auth.js WebAuthn: https://authjs.dev/getting-started/authentication/webauthn
- WorkOS User Management: https://workos.com/docs/user-management
- WorkOS Pricing: https://workos.com/pricing
- Stytch WebAuthn / Passkeys: https://stytch.com/docs/passwordless/webauthn
- Stytch Pricing: https://stytch.com/pricing
- SimpleWebAuthn: https://simplewebauthn.dev/
- Hanko: https://www.hanko.io/
- Logto: https://logto.io/
- Kinde: https://kinde.com/
- Yjs: https://yjs.dev/
- y-codemirror.next: https://github.com/yjs/y-codemirror.next
- Liveblocks: https://liveblocks.io/
- Automerge: https://automerge.org/
- Vercel Marketplace (Clerk integration): https://vercel.com/marketplace
- Neon (Vercel Postgres): https://neon.tech/

All cited URLs reflect canonical landing pages as of cutoff. Phase 2 must re-fetch these and verify the **VERIFY**-tagged claims inline above.

---

## Open sub-questions (added 2026-05-20 from session notes)

These came out of Sean's session notes (`docs/archive/v4_0/thots.md`) and concern passkey *UX* — distinct from the provider-choice analysis above. Passkey-first is already locked; these are the experience-pattern questions that need research, ideally by studying apps and services already doing passkeys flawlessly (Stripe is one reference Sean named). The overarching intent: passkey eliminates password friction — no difficult setup, details captured during first signup, login driven by device recognition.

1. **Account-creation timing — create-with vs. add-after.** Some apps create the account *with* a passkey up front; others let the user add a passkey *after* signup. Add-after is preferable for Thot — but only if frictionless. Research the patterns that make add-after painless: a checkbox during signup that opts into passkey creation, or a passkey-creation flow that also sets a password in the same step so the user never has to dig into settings later. The failure mode to avoid: forcing the user into settings to create a passkey after the fact.
2. **Cross-device passkey portability.** A passkey created on one device should work on the user's other devices — no separate per-device setup. Sean observed Stripe doing this (a Mac passkey and an iPhone passkey, either working on either device). What makes this work — is it iCloud Keychain passkey sync, the provider's own credential sync, or something else? What does Clerk (the locked provider) do here?
3. **Phone-as-authenticator for Touch-ID-less users.** For users without Touch ID (e.g. a Mac keyboard with no fingerprint sensor), the passkey can live on the phone: the web app prompts "use your phone," the user scans their face on the phone, and is logged in — with no native app required, even for a pure web app. Sean experienced this on a web app with no iOS/macOS app at all. Confirm this is the standard cross-device WebAuthn / hybrid-transport flow and that Clerk's drop-in supports it cleanly inside a PWA.
4. **Biometric-agnostic matching.** The system should match face *or* fingerprint for the same account — the user need not set up both. If the device unlocks, the account unlocks. Confirm this is inherent to platform authenticators (it generally is) and that nothing in the chosen provider's flow forces a specific biometric.
5. **Minimizing setup friction.** Passkey must not be *harder* than password or social login. Any details the system needs should be acquired during the first signup, not in a later setup step. Research the lowest-friction signup flows in the wild and confirm the recommended stack can match them.

