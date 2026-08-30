# Job Tracker — Design System

## Brand lane

A personal job-search command center: quiet, editorial, and operational — not a recruiting marketplace, and not a purple-gradient SaaS dashboard.

## Type

- Display face (headlines): **Newsreader** — serif with a workshop / editorial register
- Body face (UI, forms, labels): **Geist** — readable, modern, not Inter-as-default
- Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64
- Line-height: 1.15 display, 1.55 body
- Max line length for body copy: 62ch

## Color

- Background (base): `#F4EFE6` warm paper
- Background (raised/surface): `#FFFBF4`
- Foreground (primary text): `#1C1915` ink
- Foreground (muted/secondary text): `#5C564C`
- Accent (primary): `#B45309` burnt amber — CTAs only
- Accent (secondary): `#1F3D2B` deep forest, used sparingly for success / applied
- Semantic: success `#1F3D2B` / warning `#92400E` / error `#9F1239` / info `#1E3A5F`
- Contrast: ink on paper and amber-on-paper labels meet WCAG AA. Primary CTA is amber fill + paper text at large size, or ink fill if a pairing fails 4.5:1.

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

Editorial ops tools (paper ground, ink type, a single amber mark) rather than marketplace ATS templates. Tokens stay locked so later surfaces do not drift.

## Marketing landing (public homepage)

A second register for acquisition only. The signed-in product stays paper/ink. The landing is night-ops: zinc black, one orange signal, Newsreader + Geist so it is still Bombardier and not a Vercel clone.

Borrowed with intent:

- Linear — sticky blurred nav, one accent, no chrome noise
- Vercel — split hero with the product artifact on the right
- Cloudflare — globe as the product story, not a stock illustration
- Stripe — large operational numbers instead of lifestyle photography

### Landing tokens

- Background: `#09090B`
- Surface: `#111113`
- Border: `#27272A`
- Accent: `#F97316`
- Text: white / zinc-400
- Primary CTA: orange fill + near-black label (white-on-orange fails WCAG AA)
- Motion: hero fade/slide only on load; sections fade-up on scroll; card hover is a 150ms lift
- Reduced motion: static globe, final stat numbers, no float/auto-rotate
