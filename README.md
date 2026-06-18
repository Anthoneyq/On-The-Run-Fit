---
type: website-direction
project: On The Run Fit
status: 6 versions built — Lindsey leaning to V6 "Refined" (V1 + Sanctuary elegance, secular); awaiting final pick + real form/checkout URLs
last_updated: 2026-06-15
---

# On The Run Fit — Website (DIRECTION for the next AI)

Read this before you touch anything here. **Right now there are SIX complete website
versions** for Lindsey (the coach) to choose from, plus a chooser landing page.
**Front-runner: `v6-refined.html`** — Lindsey said she likes V1 + the Sanctuary
version's elegance, with NO faith content. V6 is that blend. Each version
is a single self-contained file (inline CSS + vanilla JS, no build step, no framework). The
only exception: V1 loads GSAP/Lenis from a CDN.

## Files
| File | What it is |
|---|---|
| `index.html` | **Chooser page** — shows all 3 with thumbnails so Lindsey can preview & pick. Not the real site. |
| `v1-classic.html` | **Option 1 · Classic** — the ORIGINAL look Anthoney liked (Schibsted Grotesk + Inter, pink, rounded cards, GSAP). Restored, with real photos + real testimonials wired in. |
| `v2-journal.html` | **Option 2 · Journal** — warm editorial "training journal" (Fraunces + Hanken + IBM Plex Mono, oat paper, hand-drawn marker accents, taped polaroids). The most distinctive. Passed a 13-point a11y/perf/QA audit. |
| `v3-cinematic.html` | **Option 3 · Cinematic** — bold dark "Golden Hour" (Anton + Hanken, dusk-ink, full-bleed photo, sunset gradient, lane-line grid). |
| `v4-rustic.html` | **Option 4 · Sanctuary** — modern, elegant, faith-forward "country bible study" (Cormorant Garamond + Mulish; airy cream + soft ink + antique-gold hairlines & ornaments; **Isaiah 40:31** as the still point; lots of white space, very simple). Built WCAG-AA. _(Filename kept; refined from the earlier chunkier rustic version per Anthoney's note.)_ |
| `v5-track.html` | **Option 5 · Track** — athletic, fast, track-themed (Saira Condensed + Saira; charcoal `#16171B` + electric hot pink `#FF2E6E` + near-white; lane-line motifs, lane numbers, stopwatch splits, skewed/oblique type). Dark text on pink for AA. |
| `v6-refined.html` | **Option 6 · Refined** ★ **FRONT-RUNNER** — Lindsey's stated blend: Classic (V1) warmth + Sanctuary elegance, **fully secular, no faith**. Cormorant Garamond + Inter; warm bright cream + raspberry rose `#C42A5E`; delicate rose hairlines & ornaments; airy white space; rounded pink buttons. Vanilla-JS reveal (no GSAP), WCAG-AA. Accent is pink (not gold) by choice — easy to swap to gold/neutral if she prefers. |
| `assets/img/` | 12 shared web-optimized WebP photos + `thumbs/` (chooser thumbnails) + `lqip/` (blur-up data). |

### When Lindsey picks one
Promote the winner to be the live site: copy the chosen `vX-*.html` to `index.html` (overwriting
the chooser), then archive the other two + the old chooser (move to a `versions/` subfolder — do
NOT delete; Anthoney may want to revisit). Update this README's status line.

## The header photo (IMPORTANT history)
The hero/header across all three is `assets/img/hero-run.webp` — the **"Lindsey at canyon lake
Dam"** running shot (source: `../Photos/Website photos/`). Anthoney **deleted** the original
golden-hour sunset *track* photo (`lindsey croped on track.png`) on 2026-06-15 and asked for a
different header; this canyon-lake shot replaced it everywhere. (`hero-track.webp` and
`run-lake.webp` were the old assets — now removed.) If swapping the header again, pick from
`../Photos/`, `../Program pics/`, or pull from Instagram `@ontherunfit`; regenerate with
`cwebp -q 85 -resize 1900 0 SOURCE -o assets/img/hero-run.webp` and update the blur-up LQIP +
alt text in each file.

## Hero headlines (each version is intentionally unique — don't homogenize)
Classic: "Your plan. Your goals. Your coach." · Journal: "You bring the heart. I'll bring the plan." ·
Cinematic: "Outrun yesterday." · Sanctuary: "Run, and not grow weary." (ties to the Isaiah band) ·
Track: "Find your fast." · Refined: "Your plan. Your goals. Your coach."
Each fits its own tone; if you add a version, give it its own line too.

## Shared across all six
- **Real photos** in `assets/img/` (hero-run, band-tahoe, coach-portrait, strength, mobility,
  meet, + 6 `client-*` athlete results). Every `<img>` has exact width/height (no layout shift).
- **Real copy in Lindsey's voice.** Testimonials are REAL named athletes (Katie = Boston
  qualifier 3:12:01; Rebecca = first half; Mary = first 8K; Kim = triathlon; John = comeback) on
  their real photos — never invent quotes or use "Sample Athlete."
- **Real plans/prices.** Premium $149 · Pro+ $279 · Strength $70 · In-Person $400 · XC $1,198/season.
- **Graceful funnel.** The application form's `FORM_ENDPOINT` constant is empty in every file →
  it falls back to a pre-filled email to `ontherunfit@gmail.com` (never a dead end). Paste a real
  Formspree URL or GHL webhook to receive applications directly. Self-guided program CTAs (5K /
  Mobility / Recipes) point to `#apply` — search `WIRE:` and drop in real checkout URLs.
- **Accessibility/motion:** all three degrade with JS off and honor `prefers-reduced-motion`.
  V2 + V3 had their button/badge/text contrast hardened to WCAG AA (the sunset gradient was
  failing white text, so primary buttons use solid `#C42A5E`). Keep contrast AA if you edit.

## Preview / screenshot (headless Chrome quirk)
Headless `--screenshot` can't paint scrolled content and the `100svh` hero defeats tall-window
capture. To full-page shot V2/V3: make a throwaway `_preview.html` copy that overrides
`.hero,.hero-media{min-height:560px!important}`, capture with a tall `--window-size`, slice with
`ffmpeg crop`, then delete the preview. (That's how these were verified.)

## If you change one thing, change it here too
This file. Keep it honest about which version is live and what still needs wiring.
