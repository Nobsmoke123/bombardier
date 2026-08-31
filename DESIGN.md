# Bombardier — Design System

## Brand lane

A personal job-search tracker: quiet, editorial, and operational — not a recruiting marketplace, and not a purple-gradient SaaS dashboard.

## Type

- Display face (headlines): **Newsreader** — serif with a workshop / editorial register
- Body face (UI, forms, labels): **Geist** — readable, modern, not Inter-as-default
- Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64
- Line-height: 1.15 display, 1.55 body
- Max line length for body copy: 62ch

## Color

Semantic tokens swap with the site theme (`html.dark` / light). One toggle controls landing, auth, and the product.

Light — optical white, not cream. Type is true black so it reads like Apple / Antigravity: one bright field, one ink, one accent.

- Background: `#FFFFFF` paper
- Surface: `#F5F5F7`
- Text: `#000000` / `#6E6E73`
- Accent: `#C2410C`
- Line: `#D2D2D7`

Dark

- Background: `#09090B`
- Surface: `#111113`
- Text: `#FAFAFA` / `#A1A1AA`
- Accent: `#F97316`
- Line: `#27272A`

Primary CTA: ink fill + paper label (black-on-white / white-on-black). Amber is the signal — globe, eyebrows, wordmark — not the button.

## Spacing

- Base unit: 4px
- Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

## Motion tokens

- Duration — micro: 150ms
- Duration — standard: 220ms
- Duration — hero/section: 480ms
- Easing — enter: `cubic-bezier(0.22, 1, 0.36, 1)`
- Easing — exit: `cubic-bezier(0.4, 0, 1, 1)`
- Reduced-motion fallback: opacity-only, no movement

## Components carrying brand identity (build from scratch)

- [x] Auth entry (login / register) — first surface a user meets
- [x] Dashboard command header
- [x] Daily queue (today's companies)
- [x] Primary navigation

## Reference sites studied

Borrowed with intent:

- apple.com — optical white ground, #000 type, hairline rules, frosted nav, black primary buttons
- antigravity.google.com — the same white/black punch, generous air, product artifact as the hero
- Linear — sticky blurred nav, one accent, no chrome noise
- Vercel — split hero with the product on the right
- Stripe — large operational numbers instead of lifestyle photography

## Marketing landing (public homepage)

Acquisition and product share one token set. Light is shiny white + black type. Dark is night-ops. Newsreader + Geist stay in both.

- Primary CTA: ink fill + paper label
- Motion: hero fade only on load. No scroll-triggered fade-up on section grids.
- Copy: name the thing (CSV, queue, resume version). No “command center,” “operating system,” or invented live metrics.
- Each landing section uses a different structure. Eyebrow + H2 + card grid is not a default.
- Product preview is labeled sample data and uses the same chrome as the signed-in app.
- Reduced motion: static globe, no float/auto-rotate
- Footer Privacy is a real page, not a hash.
