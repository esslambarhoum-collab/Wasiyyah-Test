# Wasiyyah Site — Handoff

## 1) Goal
buildmywasiyyah.com, a free Islamic will builder. Static HTML/CSS/JS, GitHub Pages, cream/white/gold theme (Fraunces serif + Inter sans + Amiri for Arabic). No build process, single file per page. User (Esslam) is a Salafi Muslim in Cairo, voice-to-text input (expect rambling/repetition), no em dashes in copy, wants zero "AI generated" feel, prefers surgical CSS-only edits over risky HTML restructuring, especially in wasiyyah.html (~134KB, ~480 divs, complex JS — treat with care).

## 2) Current state (after round 2)
Round 1 (items A-G) and round 2 (the full redesign correction below, plus a Layer 1/2 build+audit pass) are both done. Verified: div-tag balance, JS syntax on every `<script>` block (excluding `ld+json`), and Playwright screenshots at 1440x900, 1366x768, and 390x844 mobile for every page. `sw.js` cache bumped to v6.

## 3) Round 2 — why it happened
Round 1 technically satisfied "fit one screen, no scrolling" on journey/document/story/faq by pinning nav+footer with flexbox and letting only `main` scroll internally. The user disliked the actual result: it read as "the footer is fixed," looked cramped, and two round-1 bugs (CSS multi-column filling top-to-bottom instead of row-by-row) caused document.html's asymmetric 2-and-3 list split and, separately, wasiyyah.html's "scroll down then scroll up" form bug and a message-alignment glitch in Section 6. Round 2 reverted the fixed-chrome architecture everywhere and fixed the underlying causes instead of compressing around them.

## 4) Round 2 changes, file by file

**Sitewide (index, journey, document, story, faq, reviews, privacy, terms, disclaimer):**
- Nav CTA renamed "Begin free" → "Begin My Wasiyyah" (desktop nav pill + mobile nav link), and a pre-existing bug fixed: `.nav-cta` never had `text-decoration:none`, so it always rendered underlined. Added `text-decoration:none!important`.
- Removed all `@media(min-width:901px)` fixed-chrome blocks (the `html,body{height:100%};overflow:hidden` pattern) from journey/document/story/faq. Pages now scroll normally like any static page; nothing is pinned.

**journey.html** — `.j-list` rebuilt as a spacious 2-column grid (1-col on mobile) of `.j-card` boxes with generous padding/hover-lift, replacing the cramped 3-col compressed rows. Removed the redundant "Begin my wasiyyah" button at the bottom (the nav CTA already covers it).

**document.html** — removed the `column-count:2` override that caused the asymmetric 5-item split; the original single-column `.doc-item` flex-row list now renders symmetrically. Removed the redundant "Begin my wasiyyah" button below the list. `.doc-sample` preview box left untouched per the user's explicit call.

**story.html** — full redesign. The eyebrow ("A letter from the founder") and h1 ("I built this because I was scared.") are now overlaid directly on the photo (a dark gradient scrim over a shorter 21:9 image) instead of stacked above it as separate elements. Body text restored to a comfortable serif size (18.5px/1.85 line-height, was compressed to 12.5px in round 1). Content column widened from 680px to 1040px, closer to the nav's 1160px margins. Verses reduced from 3 to 2 (kept the Surah An-Nisa 4:58 trust ayah and the Sahih al-Bukhari 6416 hadith; dropped the 4:78 ayah as the more repetitive of the three, per the user's "remove one or two" and the confirmed AskUserQuestion answer). Image and heading are visible without scrolling on both 1440x900 and 1366x768.

**faq.html** — enlarged `.faq-q` (15.5px→21px) and `.faq-btn` padding (1.5rem→1.875rem row height), enlarged the answer body text too (14.5px→16px). Accordion JS (`toggleFaq`, one-open-at-a-time) untouched, exactly as the user asked.

**reviews.html** — `#reviewsArea` (grid/empty-state) still spans full width on top. Below it, "Leave a review" (`.submit-card`) and "Support this work" (`.donate-card`) now sit side by side in a `.support-row` 2-column grid (stacks to 1 column under 900px), instead of one below the other with donate at the very bottom.

**wasiyyah.html** (CSS/HTML edits only, JS untouched):
- Removed the `column-width:420px;column-gap:2.5rem` CSS multi-column layout on `.section-card.active` that caused the "scroll down, then scroll up" bug when filling in the form, and the "Message to your children"/"final reminder" half-centimetre misalignment in Section 6 (both were the same root cause). Desktop is now a normal single column; verified via screenshot that Section 6's message fields line up exactly.
- All 9 `.daleel` hadith/ayah evidence boxes converted to click-to-reveal: each now sits behind a "Show the evidence (dalil)" pill button (reusing the existing `toggleHelp()` function and `.help-panel`-style open/close pattern already used elsewhere in the form), instead of always being visible and potentially reading as confusing/cluttered.
- Completion screen (`#completeScreen`) reordered: success header → reference number → "What to do next" checklist → "More options" (annual reminder, add location, print card, leave a review, share, support this work) → a "Scroll down to download" cue → the Download section → Edit/Return home buttons. Guidance now appears before the download button instead of after. The separate `#pdfPopup` modal (shown after clicking Download, with its own What-to-do-next + Share + Review + Donate) was kept unchanged, per the user's explicit choice to keep both.

## 5) Layer 1 / Layer 2 audit pass (user-supplied build + audit standards)
Ran the site through the two uploaded master-prompt checklists as far as they apply to a static, no-backend, no-build site. Findings:

**Checked and clean:** no broken internal links or missing image assets (scripted check across all `href`/`src` in every HTML file); every `<img>` has `alt` text; sitemap.xml and robots.txt match the actual page set; manifest.json icons exist on disk; 404.html exists with `noindex` and a real "not found" design (not a generic host page); privacy.html already discloses Supabase as the third-party data processor for reviews and mentions the GA opt-out; terms.html and disclaimer.html both carry an explicit "not legal advice, consult a local attorney / scholar" clause and a "last updated" date; Arabic text uses `lang="ar" dir="rtl"` correctly; no lorem ipsum, fabricated stats, fake testimonials, or leftover placeholder copy anywhere; div-tag balance and JS syntax clean on every page.

**Flagged, not touched (needs your input or is out of scope for a code change):**
- **Google Analytics is not actually configured.** Every page ships the GA4 gtag snippet with the literal placeholder `G-XXXXXXXXXX`. Per Layer 1 rule 19/28, this must not be presented as "done" until you drop in a real GA4 Measurement ID. Nothing to fix code-side, just flagging so it's not mistaken for working analytics.
- **Supabase Row Level Security can't be verified from here.** The reviews feature POSTs to a Supabase REST endpoint with a public anon key in the client (normal for this architecture), but whether your RLS policies actually restrict what that anon key can read/write has to be checked in your Supabase dashboard, not from the static files.
- **Form labels use styled `<div class="field-label">` rather than `<label for="...">`** across wasiyyah.html (~30 fields). Screen readers can still usually infer the association from proximity, but it's not a strict `for`/`id` link. I did not mass-convert this: the file is large and fragile, several field-groups share one label across multiple inputs (e.g. the three ghusl-preference boxes), and a wrong automated pass risked breaking the existing `oninput`/`onclick` wiring for a cosmetic-only accessibility gain. Flagging as a genuine but lower-risk-to-leave item rather than guessing at 30 individual fixes.
- **`assets/hero-archway.jpg` is still dead weight on disk** (unused since round 1's hero rebuild). Harmless, but noted again in case you want it deleted next time you're in the repo.

## 6) Notes for continuation
- Always verify after any edit: div tag balance (`grep -o '<div'` vs `</div>` count) and a JS-syntax check on every `<script>` block that isn't `type="application/ld+json"` or has a `src=`, especially for wasiyyah.html given its size.
- The CSS-cascade gotcha from round 1 (a `@media` block earlier in the stylesheet loses to a later unconditional rule with equal specificity) no longer applies anywhere, since all the fixed-chrome media blocks it was hiding in were removed in round 2. Still worth remembering for any future page-specific override.
- CSS multi-column (`column-width`/`column-count`) fills top-to-bottom-then-next-column, not row-by-row like a grid. This caused two separate bugs this project (document.html's list, wasiyyah.html's form) before being removed both places. Prefer CSS grid for anything meant to read left-to-right, row-by-row.
- Bump `sw.js` CACHE version string after any sitewide HTML change (now at v6).
- No em dashes anywhere in copy, this has been fully cleaned sitewide, just don't reintroduce any in new copy.
- Screenshot-driven verification (Playwright + headless Chromium) is what actually caught round 1's cascade bug and confirmed round 2's fixes; div-balance/JS-syntax checks alone would have missed both.
