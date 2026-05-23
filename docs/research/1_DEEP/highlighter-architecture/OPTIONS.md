# Highlighter Architecture: The Options, Honestly

**Created**: 2026-05-06
**Version**: v1.0
**Status**: Research Phase — Phase 1 (`1_DEEP/`)

---

## Executive Summary

This doc looks at the spectrum of architectural choices for Thot's highlighter, from "keep what we have but rewrite the scope/cascade layer" to "write our own incremental tokenizer from scratch." For each option it gives concrete scope of work, what's actually defensible as IP (and what isn't), and what users would notice. It also addresses the second product requirement Sean has named: a **semantic prose mode** that highlights normal English without requiring markdown syntax.

The honest read up front, so the rest of this doc has somewhere to land:

- **Lezer is doing two things for us:** (1) an incremental block+inline parser that turns markdown text into a tagged tree as the user types, and (2) a tag/style cascade system that turns those tags into CSS classes. Job (1) is the load-bearing one. Job (2) is the part we keep fighting.
- **There is no IP moat in custom syntax tokenization.** Tokenizers, scope models, and color-priority cascades are not patentable, are widely published, and are trivially re-implementable. The moat — if there is one — is in product design: the dual-mode UX, the customization surface, and the curated palette/typography pairing.
- **The recommended path is B+A combined:** stay on Lezer for markdown mode, rewrite the scope/cascade layer cleanly so context-dependent rules don't need a sidecar `ViewPlugin`, and add a second highlighter — a regex/heuristic engine — that runs in **prose mode** when the buffer is detected as non-markdown. This ships the user-visible differentiator (semantic prose highlighting) without spending months reinventing the parser.

Skip to § 4 for the recommendation. The rest substantiates it.

---

## 1. What Lezer Actually Does (and Doesn't)

### 1.1 The two layers, named

The CodeMirror 6 stack used by Thot (per `package.json`, all MIT-licensed) decomposes into three concerns:

| Layer                        | Package              | Role                                                                                                                        |
| ---------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Tree / parser abstractions   | `@lezer/common`      | The `Tree`, `SyntaxNode`, `NodeType`, `NodeProp` data structures. Defines what an incremental parse *looks like*.            |
| Markdown parser              | `@lezer/markdown`    | A hand-written block + inline parser for CommonMark + GFM + Emoji/Sub/Sup. Emits `@lezer/common` trees. ~1,961 lines of TS. |
| Highlight tags + style cascade | `@lezer/highlight` | Defines `Tag`, `tags.*` (the ~87 built-in tag vocabulary), `styleTags()`, and the `HighlightStyle` → CSS-class machinery.   |

The CodeMirror `EditorView` then uses `syntaxTree(state)` to read the current parse, `Decoration` ranges to mark spans, and `ViewPlugin` to compute decorations against the visible viewport.

### 1.2 What `@lezer/markdown` emits, concretely

The parser's `Type` enum (verbatim from `node_modules/@lezer/markdown/src/markdown.ts:40-89`) is the literal vocabulary of node names we get to react to:

```
Block:   Document, CodeBlock, FencedCode, Blockquote, HorizontalRule,
         BulletList, OrderedList, ListItem,
         ATXHeading1..6, SetextHeading1..2, HTMLBlock,
         LinkReference, Paragraph, CommentBlock, ProcessingInstructionBlock
Inline:  Escape, Entity, HardBreak, Emphasis, StrongEmphasis, Link, Image,
         InlineCode, HTMLTag, Comment, ProcessingInstruction, Autolink
Marks:   HeaderMark, QuoteMark, ListMark, LinkMark, EmphasisMark,
         CodeMark, CodeText, CodeInfo, LinkTitle, LinkLabel, URL
```

That's it. ~50 node types. Plus what GFM adds (Table, TableRow, TableHeader, TableCell, TableDelimiter, Strikethrough, Task) and Subscript/Superscript/Emoji.

> Quote from `@lezer/markdown/README.md`:
> "This is an incremental Markdown ([CommonMark](https://commonmark.org/) with support for extension) parser that integrates well with the [Lezer](https://lezer.codemirror.net/) parser system. It does not in fact use the Lezer runtime (that runs LR parsers, and Markdown can't really be parsed that way), but it produces Lezer-style compact syntax trees and consumes fragments of such trees for its incremental parsing."

Two important consequences:

1. **`@lezer/markdown` is hand-written, not generated.** It's not an LR grammar. It's an idiomatic block-and-inline parser written like any other markdown library, with the wrinkle that it caches and reuses sub-trees from prior parses for incremental updates. This matters when we ask "how hard is forking it?"
2. **It's a parser, not a styler.** It hands you a tree of typed nodes with offsets. That's the boundary.

### 1.3 What Lezer's tag/style layer does

`@lezer/highlight` provides:

- `Tag.define()` — opaque tag identity values. A tag is a label, nothing more.
- `tags` — a built-in vocabulary (`tags.heading`, `tags.strong`, `tags.url`, …).
- `styleTags({ NodeName: tag, "Parent/...": tag })` — declarative rules attaching tags to node names, with two operators: an exact match and an "inherit through descendants" pattern.
- `HighlightStyle.define([{ tag, color, fontWeight, … }])` — turns tags into generated CSS class names; later array entries produce later CSS rules and therefore win the cascade.

The cute trick is that the same tag (`tags.heading`) can be assigned to many different node names by different language packages, and styles are written against tags, not nodes — so one theme works across markdown, JS, Python, etc.

### 1.4 Where Lezer's job ends and ours begins

Concretely, Lezer hands us a tree like this after every keystroke, incrementally:

```
Document → BulletList → ListItem → {ListMark "-", Paragraph → StrongEmphasis → {EmphasisMark "**", text, EmphasisMark "**"}}
```

What it does **not** give us:

1. **Context-aware tags.** "Is this `ListMark` inside a `BulletList` or an `OrderedList`?" The tree knows; the tag system doesn't. `editor.ts:31-129` documents why: `combine()` merges base and extension `styleTags` rules by depth, and the base's `depth=0` no-context rules fire first. That's the entire reason for the sidecar `ViewPlugin`.
2. **Prose semantics.** No "this is the topic," no "this is a proper noun," no "this is a verb." Lezer markdown returns `Paragraph → text` and stops.
3. **Style priority.** Whether bold-inside-list looks "bold" or "list-content" colored is a product decision; Lezer hands you both nested nodes.
4. **Decoration emission.** CodeMirror's `ViewPlugin` infrastructure renders decorations; the *policy* of which scope wins is ours.

The boundary: **Lezer answers "what is this byte range, syntactically?" — we answer "what should it look like, given context, mode, and user theme?"** The second job is roughly the same job whether we keep Lezer, fork it, or replace it. The thing we're tempted to "make proprietary" is mostly *not the parser*.

---

## 2. The Spectrum of Options

### Option A — Stay on Lezer, rewrite scope/cascade layer cleanly

**What it is:** Keep `@codemirror/lang-markdown`. Stop fighting the three-layer (`styleTags` + `HighlightStyle` cascade + sidecar `ViewPlugin`) approach. Replace it with a single `ViewPlugin`-based highlighter that walks the syntax tree top-down on visible ranges and emits `Decoration.mark()` ranges with explicit, ordered scope rules. This is essentially what the prior shallow draft `docs/archive/research/1_DEEP/feature-research/HIGHLIGHTING.md` proposed.

The model becomes: `Pattern (= tree node selector) → Scope → {color, weight, style} → Priority`. Inner spans render visually over outer spans so nesting handles itself; no CSS cascade ordering games.

**Scope of work:** Small to medium. Roughly:
- 1 new file `src/highlighter.ts` (~300–500 LOC) generalizing `buildMarkerDecorations`.
- 1 `src/scopes.ts` declaring the scope table (data, not logic).
- Strip `styleTags` blocks and most of `HighlightStyle.define()` from `editor.ts` and `theme.ts`.
- Keep `syntaxHighlighting()` only for code-block content, where Lezer's tag system does pull its weight (50+ language token types).
- 1–2 weeks for one engineer including testing the nested-emphasis edge cases.

**IP-defensibility:** Low. The architecture (tree-walk → decoration ranges) is the standard CodeMirror idiom; the priority/scope table is data. Nothing here is novel.

**User-visible benefit:** Modest but real. Eliminates the bug class around context-dependent markers, makes nested emphasis and bold-in-list reliably correct, makes future color/weight tweaks one-line edits in a flat data file. Same colors on screen.

**Verdict:** Worth doing regardless of what else we pick. It's a code-health investment that the other options either build on or replace.

---

### Option B — Add a second highlighter for "semantic prose mode"

**What it is:** Detect whether the buffer looks like markdown (presence of `#`, `**`, `[]()`, ` ``` `, fenced lists, etc.) versus plain prose. In prose mode, run a second highlighter that doesn't depend on the markdown parse tree. It emits decorations from heuristic and lexical signals such as:

- **Sentence structure**: first-word emphasis (the "topic" hint), end-of-sentence terminator, em-dash/parenthetical clauses dimmed.
- **Capitalization patterns**: ALL CAPS (emphasis), Title Case sequences (likely proper nouns / titles).
- **Punctuation classes**: quotation marks, parentheses, dashes get distinct treatment.
- **Numbers and units**: `42`, `42%`, `$3.50`, `2026-05-06` colored.
- **Tense or modal heuristics**: optionally, a small word-list highlighter for hedges (`maybe`, `should`, `might`), absolutes (`always`, `never`), action verbs at clause-start. (This is where it gets interesting and where the *product* differentiates.)

Implementation is regex-based per visible line plus a tiny bit of state for sentence boundaries — no parser, no incremental tree. CodeMirror ViewPlugin already runs these only against `view.visibleRanges`, so cost is bounded.

There's a gradient of how far to push this:
- **B1 (cheap):** Punctuation, numbers, ALL CAPS, capitalization runs. Pure regex. ~200 LOC.
- **B2 (medium):** Add a curated lexical dictionary (hedges, absolutes, transition words) plus first-word-of-sentence detection. ~500 LOC plus a JSON wordlist.
- **B3 (ambitious):** Add lightweight POS tagging (e.g. a tiny statistical tagger compiled to a few hundred KB of tables, or a `compromise.cool` integration which is MIT-licensed and ~250KB gzipped). Tag verbs/nouns/adjectives. This is real "semantic" highlighting.

**Scope of work:**
- B1: 1–2 days.
- B2: 1 week incl. wordlist curation.
- B3: 2–4 weeks incl. dependency vetting, performance testing on long buffers, and product calibration on what visual signal each POS gets.

**IP-defensibility:** Low to medium. The highlighter implementation is not defensible. The *curation* — which words map to which signals, which signal maps to which color/weight, the calibration that makes prose readable rather than psychedelic — is genuine product work and is moderately defensible *as trade dress / brand*, not as IP. POS-tagged prose highlighting in an editor would be unusual enough that it'd be noticed and described as "the Thot thing"; that's a brand moat, not a legal one.

**User-visible benefit:** This is the actual product differentiator. Markdown highlighting is widely available — every code-IDE-shaped editor has it. Semantic prose highlighting in a writing tool, especially with mode auto-detection, is uncommon. People who write in plain English and don't want to learn `# heading` get a visibly more interesting editor than Bear/iA Writer/Obsidian.

**Verdict:** This is the option that earns Thot the right to exist as a product separate from "another markdown editor." Recommend B2 as the shipping target with B3 as a follow-up.

---

### Option C — Fork `@lezer/markdown` and customize the parser

**What it is:** Vendor `@lezer/markdown`'s ~2,000 lines of source into Thot's repo and modify it to (a) emit additional node types we want (e.g. a real `Highlighted` node for `==text==`, a `CriticAdd`/`CriticDel` node for CriticMarkup, a `WikiLink` node for `[[…]]`), (b) optionally remove things we don't care about, (c) tag context-sensitive things at parse time so we wouldn't need the sidecar `ViewPlugin`.

The package is MIT-licensed, so vendor-and-modify is fully permitted. We'd lose upstream patches unless we periodically rebase.

**Scope of work:** Medium to large. The parser is hand-written, not grammar-generated, so modifying it means understanding ~2k lines of block-context state machine and inline scanner. New node types are not hard (the file already shows the `defineNodes` extension pattern); changing parse behavior is harder. Maintenance burden: every `@lezer/markdown` upstream release is now a manual rebase.

- 2–3 weeks initial fork + first round of additions.
- Ongoing: a few hours per upstream release, more if upstream refactors internals.

**IP-defensibility:** Low *for the parser itself* (CommonMark is a published spec; our edits are standard syntax extensions that already exist in other tools — Pandoc, Obsidian, Typora). Slightly higher if we add genuinely novel grammar (a "thot-specific" syntax like `{topic: …}` annotations), but novel-syntax-as-IP is dubious unless we file a trademark on the syntax name and even then it's weak.

**User-visible benefit:** New markdown features (==highlight==, footnotes, CriticMarkup, wiki-links) become first-class. That's a feature win. But every one of those features is achievable with `MarkdownConfig.parseInline` / `parseBlock` extensions on the *unforked* parser — no fork required. (See `@lezer/markdown/src/extension.ts`, 301 lines, which is the public extension API.)

**Verdict:** Don't fork. Use `MarkdownConfig.parseInline` and `parseBlock` extensions to add the syntax we want without forking. Forking pays the maintenance cost without buying anything that the extension API doesn't already give us.

---

### Option D — Write our own incremental tokenizer (no Lezer)

**What it is:** Replace `@lezer/markdown` (and its tree, and its tag system) with a from-scratch incremental parser. We'd be rewriting roughly the work the Lezer team did over multiple years.

**Scope of work:** Very large. To behave well on Sean's stated 100K-line target, a from-scratch incremental parser needs: (1) a block-level state machine for CommonMark + GFM (~2k LOC, validated against the 600+-test CommonMark conformance suite); (2) an inline scanner with the well-known emphasis edge cases (left/right-flanking delimiters, rule-of-three for `*`/`_`); (3) incremental fragment-reuse machinery — the genuinely hard part, reimplementing what `@lezer/common`'s `TreeBuffer` already provides; (4) a CodeMirror integration shim. And note: we still want JS-in-fenced-code-block highlighting via mixed-language parsing into the other Lezer parsers — so we don't actually escape Lezer, we just stop using it for the outer layer.

Honest estimate: 3–6 months of one engineer's time, with a long tail of edge-case bugs. CommonMark has been argued about for a decade; you find out which edges matter only after shipping.

**IP-defensibility:** Low. Same as forking — incremental parsers are a published research area going back to Tim Wagner's 1998 PhD thesis. Tree-sitter (Atom/GitHub), Lezer, IntelliJ's PSI all do this. There is no patentable novelty here that we'd plausibly originate.

**User-visible benefit:** Effectively zero, on day one. The user sees the same markdown highlighted the same way. The benefit is hypothetical: "we control everything." But control without a roadmap that requires control is just maintenance burden.

**Verdict:** Don't. The cost is a quarter or more of engineering, and the IP story is identical to keeping Lezer (i.e. weak). The only argument for D is "we want zero third-party code in the highlight path," and Sean has not articulated a reason that passes a cost-benefit test.

---

### Option E — Things worth a brief look

**E1. Tree-sitter instead of Lezer.** Cross-platform (it's a C library with WASM bindings), used by Atom/GitHub, Neovim, and others. Tree-sitter has a markdown grammar but it's notoriously fiddly because (as the Lezer README notes) markdown isn't naturally an LR/GLR grammar. Adopting tree-sitter just to highlight markdown trades one set of problems for another and adds a WASM dependency. **Pass.**

**E2. Pure regex highlighter for markdown.** Skip parsing entirely; use regex like `highlight.js` does. This works *visually* for shallow highlighting but breaks badly on nested emphasis, fenced code with embedded backticks, link/image disambiguation, and indented sublists. We'd ship the same bugs that drove Sean to CodeMirror in the first place. **Pass for markdown mode**, but this is essentially what Option B uses for *prose mode* — appropriate there because prose has no nesting.

**E3. Server-side parse with WASM in the worker.** Run `markdown-it` or `unified` in a Web Worker, ship results back as ranges. Loses incremental parsing entirely; round-trip latency on every keystroke. **Pass.**

**E4. LSP-style "semantic tokens."** Define our own protocol where a worker analyzes the document and returns a set of typed ranges, the editor renders them. This is essentially Option B with extra machinery. If we want POS tagging in a worker (Option B3) we'd end up here naturally. **Defer until B3 is in scope.**

---

## 3. The IP Read, Bluntly

Sean asked for the honest IP picture. Here it is.

### 3.1 What is actually defensible

Almost nothing in highlighter implementation is patentable, copyrightable, or trade-secret material in any meaningful way:

- **Tokenization / parsing algorithms**: published, in the literature for 50 years, every CS undergrad has implemented variants. CommonMark itself is a published spec.
- **Incremental parsing**: published research (Wagner, Ghezzi, Tichy 1998; later work at Microsoft and Google). Open-source implementations are the norm (tree-sitter, Lezer, Roslyn).
- **Scope/priority models**: TextMate scope grammars (2004) are the de facto standard reference; every editor uses some variant. Not novel.
- **Color palettes**: not protectable. Specific colors are not copyrightable; named themes (e.g. "Solarized," "Dracula") are at most weak trademarks.
- **CSS class names / cascade tricks**: implementation detail, not IP.

What *is* defensible, in roughly increasing strength:

1. **Trade dress / brand identity** — the *look* of Thot's specific palette + typography pairing as a distinctive visual product. This is a brand moat, defended by being recognized, not by litigation.
2. **Trademark on the product name** — "Thot," logo, wordmark. Standard.
3. **Copyright on the source code itself** — automatic; protects against literal copying, not against reimplementation.
4. **Curated content**: a wordlist for prose-mode highlighting, calibration tables for POS-color mapping, the *editorial* choices about which English words deserve which signal. Compilation copyright applies (thin but real). More importantly, this is the kind of thing competitors don't bother to recreate because it requires taste, not engineering.
5. **A novel UX surface** that lets users customize highlighting in a way other editors don't expose. The interaction patterns aren't patentable, but *being the editor known for this* is a market position.

### 3.2 What "fully proprietary" actually means in this domain

The phrase is doing a lot of work. Separating what it could mean:

- **(a) "We wrote the code ourselves, not derived from Lezer"** — possible (Option D), achieves nothing legally beyond what we already have. CodeMirror is MIT; the license is not the constraint.
- **(b) "User-visible behavior is unique to Thot"** — achievable without rewriting the parser, via Option B and a customization UI. This is the meaningful version of "proprietary."
- **(c) "Patentable"** — extremely unlikely for any tokenizer/highlighter design. Even if narrow novelty existed, software-patent enforcement against an open-source ecosystem is a brand-damage event, not an asset.
- **(d) "We can sell or license the engine"** — there is no market. The buyers all use CodeMirror, Monaco, tree-sitter, or write their own.

The trap: spending a quarter of engineering to achieve (a) under the belief it produces (c) or (d), when what users actually pay for is (b). (b) is reachable in weeks and doesn't require touching the parser.

### 3.3 The straight answer

There is no IP moat in "ours instead of Lezer." Lezer is a parser; the parser is the commodity layer. The moat is product design — specifically the dual-mode UX, the editorial choices in prose mode, and the customization surface — and that moat is reachable on top of Lezer, on top of a fork, or on top of a from-scratch parser, with the same effort. The choice of parser substrate is therefore an engineering question (cost, maintenance, risk), not an IP question.

If anyone — investor, advisor, future acquirer — frames "proprietary tech" as the value driver for an editor like this, they're wrong. The value is the writing experience. Optimizing for the wrong axis costs months.

---

## 4. Recommendation

**Do A + B2 in that order. Skip C and D entirely.**

### 4.1 What that looks like in shipping order

**v3.2 (or whatever's next): Clean rewrite of the markdown highlighter (Option A).**
- New `src/highlighter.ts` ViewPlugin that walks `syntaxTree` on `view.visibleRanges`, emits `Decoration.mark()` ranges from a flat scope table, and uses tree-nesting (inner span over outer span) for priority instead of CSS cascade ordering.
- New `src/scopes.ts` with the scope → style data, importing colors from `highlight-tags.ts`.
- Keep `syntaxHighlighting(thotHighlightStyle)` in place *only* for embedded code-block tokens (the 50+ language token types where the Lezer tag system actually pulls its weight via mixed-language parsing into `@codemirror/lang-javascript`, `lang-python`, etc.). Strip everything else.
- Delete the targeted ViewPlugin in `editor.ts:55-129` — its job folds into the new highlighter naturally.
- Net result: ~200 fewer lines of code, no more cascade-ordering reasoning required, future color tweaks are a one-line edit in a flat table.

**v3.3: Prose mode (Option B2).**
- Add mode detection: a small heuristic that scores the buffer for markdown markers (`#`, `**`, `` ` ``, `[]()`, fenced lists). Below threshold → prose mode.
- New `src/prose-highlighter.ts` ViewPlugin: regex-based, runs only when prose mode is active. Highlights numbers, ALL CAPS, sentence-starts, quoted text, parentheticals, em-dash clauses, and a curated wordlist (hedges, absolutes, transitions).
- A user-facing toggle (status-bar button or command palette) so detection can be overridden.
- Curated wordlist lives in `src/prose-lexicon.json` — this is the thing future Thot will iterate on for years and where the actual editorial-product investment goes.

**v3.4 (optional, ambitious): POS-tagged prose highlighting (Option B3).**
- Vet `compromise.cool` (MIT, ~250KB gzipped) or a similar lightweight POS tagger.
- Run it in a Web Worker on a debounced cadence (say, 200ms after typing stops). Worker returns typed ranges; main thread renders.
- Calibrate which POS gets which visual signal by hand. This is editorial work, not engineering.

### 4.2 What would change the recommendation

- **If we discover that `@lezer/markdown` produces wrong trees on a class of input we care about, and the fix is upstream-rejected.** Then Option C (fork) becomes warranted. We don't see this today.
- **If a strategic reason (sale to a competitor of CodeMirror, requirement from an enterprise customer) demands no GPL/MIT third-party code in the parse path.** MIT does not require this — it's compatible with proprietary distribution — but if such a constraint appeared, Option D (rewrite) would be on the table. No such constraint exists.
- **If the prose-mode product test fails** — i.e., users find semantic prose highlighting confusing rather than helpful. Then we deprioritize B2/B3 and the recommendation collapses to A alone, plus a cleanup pass on color palette / typography.
- **If a markdown extension we want (CriticMarkup, ==highlight==, wiki-links) is rejected as a `parseInline`/`parseBlock` extension.** Then a narrow fork of `@lezer/markdown` (Option C, scoped) becomes warranted. The extension API is documented and capable, so this is unlikely.

### 4.3 What this recommendation is *not*

- It's not "stay on Lezer forever." It's "the parser substrate is not where the product is. Don't burn engineering on it."
- It's not "skip the rewrite." The current three-layer architecture is genuinely fragile (see `editor.ts:31-129` and `theme.ts:78-86` for the cascade-ordering reasoning). Option A is the cost of admission to anything that comes next.
- It's not "ignore IP." It's a redirection: the IP that matters here is brand, trade dress, and editorial curation — built into the prose-mode lexicon and the customization UX, not the parser.

---

## Appendix A — Open Questions

1. **Mode-switch UX**: Auto-detection threshold. What ratio of markdown markers triggers markdown mode? What does the toggle look like? Does the user see *which* mode they're in? Should the toggle be visible at all in single-mode use? *Resolved at product-design phase.*
2. **Prose-mode lexicon source**: Curate from scratch, license a wordlist (some are CC-BY), or seed from public sources (CMU pronouncing dictionary, COCA frequency lists)? Editorial-judgment question.
3. **POS-tagger choice for B3**: `compromise.cool` is the obvious candidate but ships as a chunk. Alternatives: a tiny averaged-perceptron tagger trained on Brown corpus (~500KB tables), or punting POS to a server endpoint (loses offline guarantee). Defer until B3 scoping.
4. **Code-block highlighting**: Does the rewrite preserve the 50+ language-token colorings currently in `theme.ts:113-186`? Recommended: yes, keep `syntaxHighlighting(thotHighlightStyle)` scoped to code-block tags only. Validate that ViewPlugin highlighter and `syntaxHighlighting()` co-exist cleanly (they should — different tag spaces).
5. **`@lezer/markdown` extension capabilities**: Has anyone in the wild shipped CriticMarkup, ==highlight==, or wiki-links via `parseInline`/`parseBlock`? Quick literature/code search would confirm Option C is unnecessary.
6. **Performance budget for prose mode regex pass**: Current marker `ViewPlugin` runs on `view.visibleRanges` which is bounded. Same applies here, but the regex set is larger; sanity-check on a 100K-line buffer.
7. **Customization UI scope**: The user-customizable theme UI (mentioned in `highlight-tags.ts` as a future surface) interacts with the scope-table flat data shape from Option A. Worth scoping together.

---

## Appendix B — Sources

- `node_modules/@lezer/markdown/README.md` — package description and the "not LR, but produces Lezer trees" quote (§ 1.2).
- `node_modules/@lezer/markdown/src/markdown.ts:40-89` — the `Type` enum (canonical node names emitted by the parser, § 1.2).
- `node_modules/@lezer/markdown/src/extension.ts` — public extension API (`MarkdownConfig`, `BlockParser`, `InlineParser`), 301 lines (§ 2 Option C verdict).
- `node_modules/@lezer/markdown/LICENSE` — MIT, Marijn Haverbeke 2020 (relevant to fork-permissibility, § 3.2).
- `node_modules/@lezer/highlight/README.md` — confirms `@lezer/highlight` is the "highlighting framework for Lezer parse trees" (§ 1.1).
- `node_modules/@lezer/common/README.md` — confirms `@lezer/common` provides "the syntax tree data structure and parser abstractions" (§ 1.1).
- `src/editor.ts:31-129` — Thot's existing in-code documentation of why `combine()` blocks context-dependent `styleTags` overrides (§ 1.4).
- `src/theme.ts:78-86, 190-244` — Thot's existing documentation of CSS cascade ordering for priority (§ 2 Option A).
- `src/highlight-tags.ts:181-199` — the "Future Markdown Extensions" list (==highlight==, CriticMarkup, wiki-links) — direct input into the Option C analysis (§ 2).
- `docs/THOT_APP.md` § "Architectural Decisions" and § "How It Actually Works" — current design rationale (§ 1, § 2A).
- `docs/archive/research/1_DEEP/feature-research/HIGHLIGHTING.md` — prior shallow draft proposing Option A; partially superseded here (§ 2A).
- CommonMark spec, `https://commonmark.org/` — referenced by `@lezer/markdown` README (§ 1.2, § 2D).
- Tim Wagner, *Practical Algorithms for Incremental Software Development Environments*, PhD thesis, UC Berkeley 1998 — foundational incremental-parsing reference (§ 2D, § 3.1).

---

*End of Phase 1 deep-dive on highlighter architecture options.*

---

## Open sub-questions (added 2026-05-20 from session notes)

These came out of Sean's session notes (`docs/archive/v4_0/thots.md`) and concern VSCode `textMateRules` parity. They are open research questions, not yet answered — they sharpen the "Customization UI scope" thread in Appendix A item 7.

1. **Verbatim `textMateRules` apply.** Can Thot's scope system read and apply a VSCode `textMateRules` JSON block *exactly as the VSC forks (VS Code, Cursor, Antigravity) do* — i.e. the same rules produce the same colors? What would the v5 scope-system rewrite need in order to consume `textMateRules` faithfully? (Context: Sean handed in his saved `textMateRules` at the start of the project and the scopes did not highlight correctly — understanding *why* is part of this question.)
2. **Raw paste vs. import/export.** Should Thot support pasting raw `textMateRules` JSON directly into a settings field? If raw paste turns out to be unreliable, the fallback is an explicit import path — which then also requires an export path. Which is the right primary path, and is paste even viable?
3. **JSONC support.** The paste/import parser must accept JSONC (JSON-with-comments), not strict JSON only — Sean keeps a commented copy of his rules where comments label what each scope is for. Confirm the chosen JSON path tolerates comments.
4. **Coexistence of JSON and the friendly visual UI.** The developer-facing `textMateRules` paste/import path and the non-developer-facing visual scope-color UI (pickers + describers + live preview, per § Preferences UI) must drive the *same* underlying scope config without drift. How do the two surfaces stay in sync — does a JSON paste re-populate the visual UI, and does a visual edit round-trip back to exportable JSON?

