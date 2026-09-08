# Wasiyyah Site — Handoff

## 1) Goal
buildmywasiyyah.com, a free Islamic will builder. Static HTML/CSS/JS, GitHub Pages, cream/white/gold theme (Fraunces serif + Inter sans + Amiri for Arabic). No build process, single file per page. User (Esslam) is a Salafi Muslim in Cairo, voice-to-text input (expect rambling/repetition), no em dashes in copy, wants zero "AI generated" feel, prefers surgical CSS-only edits over risky HTML restructuring, especially in wasiyyah.html (~132KB, 480 divs, complex JS — treat with care).

## 2) Current state
Files in this upload = latest version. Nav/logo/font fixes (prior session) AND items A-G from the "next steps" list below (this session) are DONE and verified (div-tag balance, JS syntax, and Playwright screenshots at 1440x900 and 1366x768). Only item H (no more images) was a decision, not a task — still holds.

## 3) Active files
- `index.html`, `journey.html`, `document.html`, `story.html`, `faq.html`, `reviews.html` — shared nav/footer structure
- `wasiyyah.html` — the multi-step form, largest/most complex file, edit CSS-only where possible
- `privacy.html`, `terms.html`, `disclaimer.html`, `404.html` — stable, low priority (still got the sitewide footer update, see D below)
- `assets/` — logo-mark.png, hero-archway.jpg (now unused, kept on disk), hero-bg.jpg (NEW — homepage hero background), hero-hallway.jpg (story page), favicons, og-share.png
- `manifest.json`, `sw.js` (cache bumped to v5 this session), `sitemap.xml`, `robots.txt`

## 4) Changes made this session (confirmed working)

**A. Homepage hero → full-bleed background image**
`index.html` hero section rebuilt: `hero-grid` is now a single centered column (was a 2-col grid with a standalone portrait photo). New `assets/hero-bg.jpg` (the Gemini-generated mashrabiya-light-on-cream-wall image, 1584x672) sits behind the whole hero as a low-opacity background (`linear-gradient` cream overlay + `background-size:cover`). The old hadith quote card, previously overlaid on the standalone photo, is now a standalone `.hero-quote` card below the trust row. `hero-archway.jpg` is no longer referenced anywhere but was left on disk (unused) rather than deleted.

**B + C. Shahadah (declaration of faith) box redesign, `wasiyyah.html` Section 1**
The box now has a gold border + soft gradient background + shadow (stronger visual presence, was flat/thin before), and the Arabic line now explicitly uses `font-family:'Amiri',serif` at 26px with `dir="rtl"` (was falling back to system default at 22px, no font override). CSS/inline-style only, no div structure changes.

**D. Sitewide footer — blurb + donate link**
Applied identically to all 9 pages that share the footer markup (index, journey, document, story, faq, reviews, privacy, terms, disclaimer). Footer is now two columns: a `.footer-brand` block (logo + 2-sentence "what is this site" blurb + tagline + a pill-style Donate link to buymeacoffee.com/wasiyyah) on the left, the existing page/legal links unchanged on the right.

**E. `wasiyyah.html` form footer (`.mini-footer`) contrast**
Added `background:var(--cream2)` (was just a border-top on the page background, blended in).

**F. Journey/Document/Story/FAQ fit one screen on desktop, no scroll**
wasiyyah.html was deliberately left untouched (still normal per-section scroll, as instructed). The other four pages got a `@media(min-width:901px)` block making `body` a fixed-height flexbox (`html,body{height:100%}`, `body{overflow:hidden}`, `main{overflow-y:auto}` as a non-clipping safety net) plus per-page compression:
  - journey.html: `.j-list` is a 3-column grid (was a single vertical list) + tightened row padding/type.
  - document.html: `.doc-list` uses CSS multi-column (2 cols) + tightened padding.
  - story.html: image `aspect-ratio` widened to 34/9 (was 16/9), body copy shrunk, `.verse-list` is a 3-column grid (was 3 stacked rows).
  - faq.html: tightened accordion row padding only (content was already short enough).
  - All four: footer blurb hidden + gaps tightened, page-hero padding/font-size trimmed, to free up vertical space.
  - **Important CSS-cascade gotcha, already fixed but worth remembering**: the `@media(min-width:901px)` block MUST be the last thing before `</style>` in each file. These pages define page-specific classes (`.j-row`, `.doc-item`, `.story-body`, `.faq-btn`, etc.) *after* the old `@media(max-width:900px)` block, and CSS resolves same-specificity conflicts by source order — putting the new block earlier meant the later base rules silently won regardless of viewport width. Verified by screenshot at both 1440x900 and 1366x768 (no scrolling needed at either size) after moving the block to the end.
  - Mobile (`max-width:900px`) styles were not touched; these pages still scroll normally on phones.

**G. Donate section on `reviews.html`**
Added a `.donate-card` (icon + "Support this work" + 2-sentence blurb + Donate button to buymeacoffee.com/wasiyyah) right after the review-submission form, before the closing `</section>`.

**H. Picture placement (decision, unchanged)**
Still: nowhere else besides the homepage hero background (A) and the existing story.html photo.

## 5) Failed attempts / things NOT to redo
- Don't put page-specific desktop-fit media queries (or any override of a page-specific class) anywhere except at the very end of the `<style>` block, right before `</style>`. See the cascade gotcha under item F above — cost a full extra round of screenshot debugging this session.

## 6) Next steps
None currently queued. Handoff item A's dependency (user generating a new hero image via Gemini) is now resolved and applied. If the user wants further polish, natural next candidates would be: replacing `hero-archway.jpg` on disk (dead file, harmless but could be deleted), or extending the "fits one screen" treatment to `reviews.html` if the user later decides they want that too (currently reviews.html scrolls normally, matching its longer/dynamic review-list content, and was NOT included in item F's scope).

## Notes for continuation
- Always verify after edits: div tag balance (`grep -o '<div'` vs `</div>` count match) and `node --check` (or equivalent) on extracted `<script>` blocks, especially for wasiyyah.html given its size/complexity.
- For any CSS-only redesign touching a class also referenced elsewhere in the same file's stylesheet, check where in the cascade order the new rule lands — see the item F gotcha above.
- Bump `sw.js` CACHE version string after any sitewide HTML change (now at v5).
- No em dashes anywhere in copy (replace with period/comma/colon per context) — this has been fully cleaned sitewide already, just don't reintroduce any in new copy.
- Screenshot-driven verification (Playwright + headless Chromium) caught a real bug this session (the cascade issue in item F) that div-balance/JS-syntax checks alone would have missed. Worth doing for any layout-affecting change, not just markup-affecting ones.
