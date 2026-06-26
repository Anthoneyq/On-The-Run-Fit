---
type: website-direction
project: On The Run Fit
status: multipage site wired for GitHub + Vercel + ontherunfit.com; awaiting GoDaddy DNS cutover, Resend API key/domain verification, checkout URLs, analytics IDs, and proof confirmation
last_updated: 2026-06-26
---

# On The Run Fit — Website (DIRECTION for the next AI)

Read this before you touch anything here. The live site is now a static multipage site.
`index.html` remains the long-scroll homepage/overview, and the deeper pages live beside it:
`coaching.html`, `programs.html`, `results.html`, `about.html`, `faq.html`,
`apply.html`, and `privacy.html`.

The old version files are references only. Do not spend time keeping them in sync with the
live site.

## Files
| File | What it is |
|---|---|
| `index.html` | Live long-scroll homepage/overview. Header now links to real pages. |
| `coaching.html` | Deeper coaching offer page with plan ladder and comparison table. |
| `programs.html` | Self-guided 5K, mobility, and recipe product page. CTAs route to `apply.html` until real checkout links exist. |
| `results.html` | Results/process page. Do not add or amplify case-study details until Lindsey confirms testimonials and photo/result permission. |
| `about.html` | Coach bio and positioning page. |
| `faq.html` | Expanded FAQ plus FAQPage JSON-LD. |
| `apply.html` | Dedicated application page. Posts to `/api/lead`, with mailto fallback if Resend is not configured. |
| `api/lead.js` | Vercel function that validates applications and sends Lindsey a Resend notification when `RESEND_API_KEY` is configured. |
| `vercel.json` | Vercel redirect/headers config. `www.ontherunfit.com` redirects to `https://ontherunfit.com`. |
| `.vercelignore` | Keeps reference files, README, review artifacts, and local config out of deployments. |
| `privacy.html` | Lightweight privacy page required before analytics/pixel/retargeting. |
| `assets/pages.css` | Shared styling for the new multipage pages. |
| `assets/pages.js` | Mobile nav, year, plan prefill, and application fallback behavior for the new pages. |
| `robots.txt` / `sitemap.xml` | Basic discoverability files for the multipage site. |
| `v1-classic.html`, `v6-refined.html`, `versions.html` | Reference/stale files only. |
| `assets/img/` | Shared web-optimized WebP photos. |

## Remaining blockers

1. In GoDaddy DNS, remove Squarespace routing and point the domain to Vercel:
   - `A @ 76.76.21.21`
   - `A www 76.76.21.21` (or follow the current Vercel domain warning if it changes)
2. In Resend, add/verify `ontherunfit.com` or a sending subdomain such as `send.ontherunfit.com`, add the DNS records Resend provides in GoDaddy, then create an API key.
3. Add `RESEND_API_KEY` to Vercel production/preview/development and redeploy. `LEAD_TO_EMAIL` and `LEAD_FROM_EMAIL` are already set in Vercel.
4. Replace self-guided product request CTAs with real Stripe/Gumroad checkout links when those URLs exist.
5. Add GA4 and Meta Pixel only after the privacy page language is confirmed.
6. Verify testimonial, PR, credential, and "Since 2012" claims with Lindsey before adding deeper case studies or a results ledger.

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

## Shared across the live site
- **Real photos** in `assets/img/` (hero-run, band-tahoe, coach-portrait, strength, mobility,
  meet, + 6 `client-*` athlete results). Every `<img>` has exact width/height (no layout shift).
- **Real copy in Lindsey's voice.** Testimonials are REAL named athletes (Katie = Boston
  qualifier 3:12:01; Rebecca = first half; Mary = first 8K; Kim = triathlon; John = comeback) on
  their real photos — never invent quotes or use "Sample Athlete."
- **Real plans/prices.** Premium $149 · Pro+ $279 · Strength $70 · In-Person $400 · XC $1,198/season.
- **Graceful funnel.** The homepage and apply page post to `/api/lead`. Until `RESEND_API_KEY`
  is live in Vercel, failed submissions fall back to a pre-filled email to `ontherunfit@gmail.com`
  instead of a dead end.
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
