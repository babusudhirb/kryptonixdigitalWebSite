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
                api/lead/route.ts — strategy-call intake
  content/      site.ts — every string, link and data row on the page
  components/
    layout/     Header (sticky + mobile drawer) · Footer · Logo
    sections/   Hero · MetricStrip · Services · SoftwareSolutions
                GrowthChannels (SEO/Ads/Automation) · ProcessResults · FinalCta
    ui/         Reveal · SpriteImage · FlowSteps · Icons
                DialogProvider · Modal · ComingSoon · LeadForm
    graphics/   RocketChart · CurlyArrow · ServiceVisual
public/assets/  the supplied Kryptonix images (originals unmodified)
```

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

`Modal` is the shared shell — `aria-modal`, Escape, backdrop click, a Tab focus
trap and focus restored to the trigger, lifted from the drawer logic already in
`Header.tsx`. **Neither XING product has shipped**, so `ComingSoon` deliberately
lists no features; keep it that way until they do.

`LeadForm` validates in the browser (values survive a failed submit — it never
reloads) and posts to `app/api/lead/route.ts`, which re-validates and logs.
**That route is the one place to wire an email service or CRM** — no other file
changes. Phone validation accepts the formats Indian users actually type
(`9876543210`, `+91 98765 43210`, `098765 43210`); email is optional and only
checked when non-empty. The success state says the request was *received* — do
not upgrade that wording to a booking confirmation unless real scheduling exists.

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

### Known asset limits

- On a DPR-3 phone the dashboards render at ~0.66x pixel density (desktop
  retina is a comfortable 1.16x). This is source-limited: the panel is 698px
  wide in the sheet, and a 350px slot on a 3x screen wants 1050. It is a 2.5x
  improvement on what preceded it; only a wider dashboard export reaches 1.0x.
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

- **Hero** — the ≤560px block in `Hero.module.css` exists purely to get the
  orbit into the first viewport: tighter leading, a 30px headline floor, 48px
  CTAs and the three proof points on **one** row instead of three. Measured
  orbit top: 514px at 390×844, 510px at 375×812, 506px at 360×800. If you add
  anything above the orbit, re-measure.
- **Services** — the six-card grid is `display: none` below 760px, replaced by a
  two-page snap carousel (three compact cards per page) so all six are covered
  in **two swipes**. Do not "fix" this into a column of six cards.
- **Drawer** — the closed off-canvas panel lives inside `.panelClip`, a fixed
  viewport-sized frame with `overflow: clip`. Without it the panel's resting
  position inflates `documentElement.scrollWidth` by ~340px even while hidden.
  `clip` rather than `hidden`: `hidden` would create a scroll container and
  break the sticky header.

Verified at 1440×900, 1280×800, 1024×1366, 768×1024, 390×844, 375×812 and
360×800: `scrollWidth - clientWidth === 0` at every one, and no console errors.

## Editing content

All copy is in `src/content/site.ts`. The metric-strip figures
(250+ / 50K+ / 98% / 24/7 / 10+) are **design values carried over from the
supplied concept**, not verified business numbers — replace them there.

`brand.email` is still the placeholder `hello@kryptonix.com` — the phone and
postal address are real, that address has not been confirmed.
