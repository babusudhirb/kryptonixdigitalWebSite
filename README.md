# KRYPTONIX — Digital & AI Solutions

Marketing homepage for Kryptonix, built to match the supplied design reference
(`../final webiste.png`) using the supplied Kryptonix image assets.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run lint
```

> Port 3000 was already in use on the machine this was built on, so QA ran
> against `npx next start -p 4321`. Change the port with `-p <port>` if needed.

## Stack

- **Next.js 15** (App Router) — static prerender, `next/image` optimisation,
  Metadata API for SEO/OpenGraph, JSON-LD.
- **TypeScript**, **CSS Modules** + CSS custom properties. No utility framework:
  the design is a bespoke match to a raster reference, so tokens live in
  `src/app/globals.css` and each section owns a co-located `.module.css`.
- **lucide-react** for outline icons; every other graphic (logo, growth chart,
  rocket, curly arrow, dashed connectors) is hand-authored inline SVG.
- Fonts: **Plus Jakarta Sans** (display) + **Inter** (body), self-hosted at
  build time via `next/font/google`.

## Structure

```
src/
  app/          layout (fonts, metadata, JSON-LD) · page · globals.css
                icon.png (tab icon, cropped from the logo mark)
                privacy/ · terms/ — placeholder legal routes
                api/lead/route.ts    — strategy-call intake
                api/careers/route.ts — job application intake (multipart)
  content/      site.ts — every string, link and data row on the page
  lib/          mailer.ts · validate.ts (shared rules) · links.ts
  components/
    layout/     Header (sticky + mobile drawer) · Footer · Logo · LegalPage
    sections/   Hero · MetricStrip · Services · SoftwareSolutions
                GrowthChannels (SEO/Ads/Automation) · CaseStudies
                ProcessResults · Careers · FinalCta
    ui/         Reveal · SpriteImage · FlowSteps · Icons · useTilt
                DialogProvider · Modal · ComingSoon · LeadForm · ApplicationForm
    graphics/   RocketChart · CurlyArrow · ServiceVisual (unused, kept)
public/assets/  the supplied Kryptonix images (originals unmodified)
```

Section order on the home page: Hero → MetricStrip → Services → SoftwareSolutions
→ GrowthChannels → **CaseStudies** → ProcessResults → **Careers** → FinalCta.
Case Studies sits immediately before the process band and Careers immediately
after it, because that band is what the nav labels "About Us".

## Dialogs and lead capture

Nothing on the page is a dead link. `DialogProvider` wraps the whole page in
`app/page.tsx` and exposes `useDialog().open(kind)`; every CTA is a `<button>`
rather than an `<a href="#contact">`:

| Trigger | Opens |
|---|---|
| "Book a Strategy Call" (header, drawer, hero, services, final CTA) | `LeadForm` |
| the three channel CTAs in `GrowthChannels` | `LeadForm` |
| "Explore Salon Software" / "Explore Gym Software" | `ComingSoon` |
| "Talk to Us" inside a coming-soon dialog | `LeadForm` |
| "Follow this project" in Case Studies | `LeadForm` |
| every "Apply" / "Send Your Resume" in Careers | `ApplicationForm` |

`open()` takes an optional payload, used by the Careers role rows to
pre-select the role in the application form.

`Modal` is the shared shell — `aria-modal`, Escape, backdrop click, a Tab focus
trap and focus restored to the trigger, lifted from the drawer logic already in
`Header.tsx`. **Neither XING product has shipped**, so `ComingSoon` deliberately
lists no features; keep it that way until they do.

`LeadForm` validates in the browser (values survive a failed submit — it never
reloads) and posts to `app/api/lead/route.ts`, which re-validates and emails.
**That route is the one place to wire an email service or CRM** — no other file
changes. Phone validation accepts the formats Indian users actually type
(`9876543210`, `+91 98765 43210`, `098765 43210`); email is optional and only
checked when non-empty. The success state says the request was *received* — do
not upgrade that wording to a booking confirmation unless real scheduling exists.

### Job applications

`ApplicationForm` mirrors `LeadForm` field-for-field, but posts
**`multipart/form-data`** to `app/api/careers/route.ts` because of the resume.
That route re-validates everything, caps the upload at 5 MB, and mails it to the
same `TRIAL_RECEIVER_EMAIL` inbox with the file as a real attachment and a
distinct subject (`New application — <name> (<role>)`).

Validation rules live in `lib/validate.ts` and are imported by the browser *and*
both API routes, so the two copies can never drift.

⚠️ **`.env.local` is configured, so submitting this form really sends mail.**
Use `resumeProblem`-failing fixtures if you want to exercise the form without
delivering to the live inbox.

### Mail configuration and spam protection

Both routes need `EMAIL_USER`, `EMAIL_APP_PASSWORD` and `TRIAL_RECEIVER_EMAIL`
(`.env.local` locally, the hosting panel in production). If any is missing the
route answers **503** and logs the submission plus the *names* of the missing
variables — it never tells a visitor their request went through when no email
was sent.

`lib/spam.ts` rate-limits each route (5 per IP per 10 min, 20 per route per
hour — answered with 429) and both forms carry a hidden honeypot field
(`components/ui/Honeypot.tsx`). A filled honeypot gets a silent success, no
email, and a log line. The counters are in memory: they reset on restart and
are per process.

## Deployment

`npm run build`, then `npm start`. The start script is plain `next start`, so
it listens on the `PORT` the host provides (3000 when unset). `SITE_URL` in
`src/content/site.ts` drives canonical/Open Graph URLs, JSON-LD,
`/robots.txt` and `/sitemap.xml`.

### Open roles

Everything in the Careers section is driven by `careers.roles` in `site.ts`.
Add or remove an entry and the rows update; empty the array entirely and the
section automatically falls back to a "no open roles — send us your resume"
card. No component edit is needed either way.

## Card tilt

`ui/useTilt.ts` is a small ref-free hook (no dependency) spread onto the service,
case-study and solution cards for one consistent intensity site-wide:

- fine pointer → rotates toward the cursor, capped at ±6°, one write per frame;
- coarse pointer → no rotation, a brief `scale(0.985)` on press instead;
- `prefers-reduced-motion: reduce` → returns no handlers at all.

## The three supplied `.svg` files are not vectors

`kryptonix_logo.svg`, `kryptonix_seo_girl_cutout footer.svg` and
`kryptonix_services_section.svg` (in the repo root) are each a **PNG wrapped in
an `<svg><image href="data:...">`** element. They are not scalable, so they are
not referenced directly — `next/image` will not optimise an SVG without
`dangerouslyAllowSVG`, and even then it would ship a ~2 MB base64 blob. Each was
base64-decoded and cropped to its alpha bounding box:

| Source | Extracted to | Size |
|---|---|---|
| `kryptonix_logo.svg` | `public/assets/kryptonix-logo.png` | 1950 × 631 (3.09:1) |
| `kryptonix_seo_girl_cutout footer.svg` | `public/assets/cta-person.png` | 1235 × 1153 |
| `kryptonix_services_section.svg` | not shipped — design reference only | 1536 × 1024 |

The logo carries the mark, the KRYPTONIX wordmark **and** the strapline, so
`Logo.tsx` sets no type of its own. It is sized by height with `width: auto` off
the intrinsic ratio: never set both dimensions, never `object-fit: cover`, and
never wrap it in a fixed-height box with `overflow: hidden`.

`cta-person.png` is a genuine cut-out (43% transparent). It replaced a crop of
`kryptonix-people.png` that rendered at well under 1× and looked blurry. It
needs **no `clip-path` and no `filter`** — anything applied there only softens
it again.

Every supplied reference PNG is treated the same way: **the artwork is the only
raster.** Headings, service titles, blurbs, checklists, chips and buttons are
all live HTML, so nothing is a screenshot of a design and nothing is lost to
search or a screen reader.

The services board is a reference for composition only; the section is built as
real HTML/CSS. Its six cards are salon/gym specific, which the six services on
this site are not — the card anatomy was reproduced, the copy was not. The
board's per-card product photography was never supplied, so each card's visual
well holds a hand-authored vignette (`graphics/ServiceVisual.tsx`) rather than
invented stock imagery. Its bottom stats strip is deliberately omitted: the
`MetricStrip` two sections above already carries the numbers.

## Working with the supplied imagery

All six photographic/product assets come from `C:\KYPTO\` and are used
**as-is** — nothing is regenerated, recoloured or replaced. Two things are
worth knowing before editing them:

1. **The people photos are opaque rectangles, not cut-outs.** Each has a flat
   background baked in, and the card behind it is painted the *same* colour so
   the photo reads as a cut-out. These pairs must stay in sync:

   | Asset | Baked background | Token |
   |---|---|---|
   | `hero-orbit.png` | `#F7F2FC` | `--asset-hero` |
   | `seo-specialist.png` | `#F5F0FA` | `--asset-seo` |
   | `ads-specialist.png` | `#F5F1FA` | `--asset-ads` |

   Change a card background without changing its token and a grey rectangle
   appears around the photo. (The salon and gym cards are exempt: their
   dashboards are cropped tight and framed in CSS, so they sit on
   `--asset-salon` / `--asset-gym` as deliberate floating panels.)

2. **Several assets carry edge artifacts** from the wider compositions they were
   cropped out of. These are removed with `clip-path` at render time rather
   than by editing the originals — see the comments in
   `GrowthChannels.module.css` and `FinalCta.module.css`.

### Sprite sheets

Two source sheets are cropped with CSS at render time by
`components/ui/SpriteImage.tsx` — no derivative image files are produced, and
each sheet is downloaded once and shared by both of its crops. Crop boxes live
in `src/content/site.ts`:

| Sheet | Crops | Used by |
|---|---|---|
| `product-dashboards.png` 1536×1024 | `productCrops.salon` / `.gym` | the two software cards |
| `kryptonix-people.png` 1536×1024 | `peopleCrops.team` / `.pointing` | Strategy circle, final CTA |

The product crops are tight to each dashboard panel and deliberately exclude
the dark nav rail — in the source sheet the salon chair and the gym dumbbell
overlap that rail, so including it drags a slice of each prop in. The rounded
corners and shadow that frame the panel come from `.shotImage` in
`SoftwareSolutions.module.css`, not from the artwork.

### The services banner

**Two crops, one per breakpoint.** The two supplied boards are composed
differently — the desktop one is a wide band, the phone one is a portrait with
the figures centred — so each breakpoint gets its own file. Both are rendered by
`Services.tsx`; CSS lays out exactly one of them, and the hidden one is given
`sizes: 0px` so the browser never downloads it.

| Breakpoint | File | Size | Source |
|---|---|---|---|
| > 760px | `services-banner-desktop.png` | 1774×672 (2.64:1) | `../service image .png` (1774×887), band `y 40→712` |
| ≤ 760px | `services-banner.png` | 1199×842 (1.42:1) | `../new mobile image.png` (1199×1312) at `top: 226, height: 842` |

The phone source is flat `#f5f3fe` everywhere outside y 260–1033, so its crop
keeps ~34px of flat margin top and bottom — which is what the CSS edge-fade
dissolves into without ever touching artwork. The desktop source is full-bleed
photography with no flat margin at all, so its fade is only **3% left/right**
(4% top, 14% bottom): a deeper one eats the salon shelves and the dumbbell rack,
which are the whole point of those edges.

**2.64:1 is not a taste call — it is the tightest band that keeps everything.**
The approved board (`../service section in one screen .png`) puts the visual at
full width at exactly 2.64:1, and the artwork uses every millimetre of it: the
handwritten "Everything Your Salon or Gym Needs to Grow" sits at the very top,
and the "Local SEO" and "Growth Playbook" labels at the very bottom. Crop or
`object-fit: cover` a single percent off the height and lettering disappears —
a `max-height: min(42vh, 420px)` version was built and cut all three.

So `.bannerWide` is bounded by **width only**: `width: 100%; max-width: 1100px`,
no `max-height`, no `object-fit`. That renders **1100×417 at 1440×900** — 90% of
the 1216px container, with the 3% fade dissolving what is left, so there is no
floating rectangle and no side margin to notice. Below 1100px of container it is
simply full width (960×364 at 1024, 704×267 at 768).

An earlier build bounded it by height instead (`max-height: min(33vh, 300px)`
with `width: auto`) and it rendered **691×297 inside 1216** — a small centred
photo with 260px of blank either side. That is the failure mode; do not go back
to it.

The 1100px is a joint budget with the head block and the cards: at 1440×900 the
heading, the full-width visual and the first row of cards down to their bullets
land in one screen (first card top y≈646). Fitting the row's CTAs as well would
need a ~340px visual, which crops lettering — see above. **Both card rows in
900px is arithmetically impossible** (head 238 + visual 417 + 2×312 > 900) and
`min-height: 100vh` is not used anywhere.

The six cards were scaled down ~15% for that budget (padding 16/18/18, tile 44,
title 17.5px, body 13.5/1.55, bullets 13px, CTA 38px) with **nothing removed**.
Four of those properties — `.points { gap }`, `.points li { font-size }`,
`.body { line-height }` and `.cta { height }` — are the only ones the phone
layout did not already override, so they are restored inside the `≤760px` block.
That guard is load-bearing: the mobile Services section renders **pixel-identical
to before the change** at 430, 390, 375 and 360, which is a checked assertion,
not a hope.

Two rules make each read as part of the section rather than a pasted rectangle:

- **no frame** — no `border-radius`, no border, no shadow. The flat `#f5f3fe`
  the phone artwork sits on is within 5/255 of `--bg-page`, so that field is
  already invisible;
- **a `mask-image` edge fade**, composited with `mask-composite: intersect`. A
  *mask*, deliberately — no `blur`, no `opacity`, no `backdrop-filter`.
  "Submerged" here means the edges dissolve; the people stay exactly as sharp
  as the source.

Measured density, from the bytes actually served (not `naturalWidth` — see the
note below), with `quality={88}`; the default 75 visibly softens the faces and
the baked labels:

| Asset | DPR 1 | DPR 2 | DPR 3 |
|---|---|---|---|
| `services-banner.png` @390 | — | 1.06× | 1.02× |
| `services-banner-desktop.png` @1100 | 1.61× | **0.81×** | — |

The desktop 0.81× is **source-limited and expected**: the supplied board is
1774px wide, and 1100 CSS px on a retina screen wants 2200. There is no higher
resolution available — `../salons_gyms_services.svg` turns out to embed the
1226×1283 reference board, not an original. If the people read soft on a retina
desktop, that is the reason. Do **not** add a sharpening filter, and do not blur
anything to disguise it.

**Never `cover`-crop this into a box of a different ratio.** An earlier version
forced `aspect-ratio: 4/5` on a landscape crop, which scaled the artwork ~3× to
fill the box — the single biggest cause of the "blurry people" complaint.

### Image formats

`next.config.ts` serves **WebP only**. AVIF at the default quality came out 40%
smaller than WebP for the same banner, and it showed on faces and small baked
text. Sharpness is worth the bytes on this page.

> When comparing image sharpness, `naturalWidth` is **not** the file's pixel
> width for an image with `srcset`/`sizes`. The browser reports the
> density-corrected layout size, so a 1226px file under a `3840w` descriptor
> reads back as 388px. Fetch the `/_next/image?...` URL and measure the bytes
> if you need the real number.

### Known asset limits

- On a DPR-3 phone the dashboards render at ~0.66x pixel density (desktop
  retina is a comfortable 1.16x). This is source-limited: the panel is 698px
  wide in the sheet, and a 350px slot on a 3x screen wants 1050. It is a 2.5x
  improvement on what preceded it; only a wider dashboard export reaches 1.0x.
- The phone services banner clears 1× even on DPR 3 (1.02×). The desktop one
  does not: full-width costs density, and 1100 CSS px off a 1774px source is
  0.81× on retina. Only a wider export of `../service image .png` fixes it.
- The hero composite sits at 0.93–0.98x on retina — marginal, and left as-is by
  instruction. Its orbit labels are raster text, which is where that shows.
- The salon chair / plant and gym kettlebell / dumbbell are not in the card
  artwork. In the high-resolution sheet they sit against a *photographic* salon
  and gym interior that cannot blend into a flat card ground. Transparent
  cut-outs of those two props could be layered back in.
- `FOOTER 1 (1).png` is still unusable — as supplied it is fully opaque over a
  dark `#22201A` ground. It is also no longer needed: the final CTA now uses
  `cta-person.png`, extracted from the supplied cut-out SVG.

## Mobile

The phone layout is authored, not a scaled desktop.

- **Hero** — below 560px the orbit is **absolutely positioned beside the copy**,
  not stacked under it, which is what gets the whole hero into the first
  viewport (orbit top: 94px, down from 514px). The artwork is **62% wide, bled
  one gutter past the right edge**, and the copy is capped at `max-width: 53%`
  (headline) / `50%` (lead). The copy sits *over* the artwork's flat edge on
  purpose — that edge is exactly `--asset-hero`, so it reads as page background.
  Use `max-width`, never `padding-right`: these are shrink-to-fit flex items, and
  padding only widens the box while the text keeps its natural width. The two
  CTAs are **not** capped; they run the full width.

  **62% is a ceiling, not a preference — do not spend another pass trying to
  enlarge the orbit.** The six discs span 11%–89% of `hero-orbit.png`'s width, so
  for a box `w` bled `b` past the screen edge, keeping the last disc on screen
  needs `b ≤ 0.11w` and clearing the copy needs `0.89w − b ≤ 390 − (copy right +
  8)`. Adding them caps the *visible ring* at **0.78w ≤ 187px on a 390 screen**,
  whatever the box does — and the ring is square, so that caps its height too.
  The shipped 62%/one-gutter sits on that line at 189×193, with only the
  decorative squiggle past 90% falling off screen.

  Cropping the artwork's flat margins into a phone-only asset was tried and
  **reverted**: it appeared to give a 211×211 ring, but every extra pixel came
  from slicing the "Ads" and "Automation" discs at the viewport edge. The only
  real levers left are a narrower copy column (which wraps "Scale Smarter." onto
  a fourth line below 53%) or different artwork. For the record, the supplied
  mockup `../hero section in mobile view.png` has a **184×260 orbit — ring ratio
  0.71**, i.e. a taller re-arrangement of the same six nodes that does not exist
  in this asset; its type and its 34px-tall buttons are also smaller than the
  shipped, tappable ones, which is what buys it the extra room.
- **Services** — below 760px the section is the header, the illustration bled to
  the viewport edges at its natural ratio (~274px tall at 390, 32% of the
  screen), then **one 2×3 grid of compact cards**. Each card
  is a disclosure whose **only** control is the chevron: a dedicated 40×40
  `<button aria-expanded aria-controls>` parked at the card's right edge, with
  the heading beside it as plain text. Tapping the icon, the title, the blurb,
  a bullet or any empty part of the card does nothing. Do **not** re-attach the
  handler to the card or stretch a `::after { inset: 0 }` overlay from the
  button — an earlier version did both, and an open card then collapsed wherever
  you touched it. Opening a card makes it span the full row
  (`grid-column: 1 / -1`) so the bullets and CTA fit, and moves the chevron from
  the card's vertical centre to its top right. The collapse is a media-query
  default, not a JS one, so nothing flashes before hydration. Do not re-add a
  separate chips strip — these cards *are* the chips.
- **Process** — below 560px the four steps are a horizontal **snap rail**, not a
  stack. `min-width: 0` on both `.processCopy` and `.steps` is load-bearing:
  without it the flex row grows to its content width and gets clipped by
  `.card { overflow: hidden }` instead of scrolling, silently hiding steps 3
  and 4. The rail is `tabIndex={0}` + `role="group"` so its four-step count
  survives the scroll.
- **Drawer** — the closed off-canvas panel lives inside `.panelClip`, a fixed
  viewport-sized frame with `overflow: clip`. Without it the panel's resting
  position inflates `documentElement.scrollWidth` by ~340px even while hidden.
  `clip` rather than `hidden`: `hidden` would create a scroll container and
  break the sticky header.

  **The scrim and `.panelClip` are siblings of `<header>`, never children of
  it.** Past 24px of scroll the bar gains `.solid`, which sets
  `backdrop-filter` — and a filtered element becomes the containing block for
  its `position: fixed` descendants. Nested inside, the whole drawer was being
  laid out inside the 72px bar and clipped out of existence, so the burger
  worked at the top of the page and did nothing anywhere below it. Anything
  fixed that must survive scrolling belongs outside that element. The z-index
  tiers that follow from this are `.scrim: 90` < `.panelClip: 95` <
  `.header: 100` — the drawer clears every section (none exceeds 3) while the
  bar stays above it so the X remains clickable.

  The scroll lock swaps the scrollbar for an equal `padding-right`, so opening
  the menu cannot shift the page sideways, and a `(min-width: 1025px)` listener
  closes the drawer if the viewport crosses to desktop while it is open —
  otherwise the lock would outlive the panel that owns it.

Verified at 1440×900, 1280×800, 1024×1366, 768×1024, 430×932, 390×844, 375×812
and 360×800: `scrollWidth - clientWidth === 0` at every one — measured **with
`body { overflow-x }` neutralised**, so that backstop is not what is holding the
number down — and no console errors. Elements that *look* like overflow in a DOM
sweep (the hero orbit, the sprite crops, the process steps) all sit inside a
clip or scroll container.

The drawer is verified open-able from the top, the middle and the bottom of the
page at 390×844, 360×800 and 768×1024, closing on Escape, on the backdrop and on
a nav link (which then scrolls to its section), with `body.style.overflow`
restored each time. The accordion is verified to toggle from the chevron only —
by click, by tap and by Enter/Space — and to stay open when the icon, title,
blurb, bullets, card padding and card head are clicked.

## Editing content

All copy is in `src/content/site.ts`. The metric-strip figures
(250+ / 50K+ / 98% / 24/7 / 10+) are **design values carried over from the
supplied concept**, not verified business numbers — replace them there.

`brand.email` is `support@kryptonix.digital`, and the JSON-LD in `layout.tsx`
reads it from there.
