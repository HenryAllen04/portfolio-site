# henryallen.me

One-screen personal site that proves taste to someone doing due diligence
(usually an investor). Home carries five things only: name, one line, essay
titles, the book shelf, contact. No site navigation beyond that; essays
link home through their `henryallen.me / writing` path. Next.js 15 App
Router, plain CSS in
`src/app/globals.css` (Tailwind is NOT wired up — don't add utility
classes). Styled in Henry's house style (the `henry-allen-style` skill):
warm paper/ink (night in dark mode), square corners, hairlines, no shadows.
Fonts: Newsreader variable (reading), Inter (operating), JetBrains Mono
(measuring). One Vermilion accent (`--accent`) marks state only: the selected
book, the writing guide, hover underlines, focus.

Dev server: `npm run dev` — do NOT use port 3000 (taken by another
project); use e.g. `npx next dev --turbopack -p 3105` (other workspace
checkouts may already hold 3105; pick another free port if so).

## Design system

Read `DESIGN.md` before writing any UI or CSS — it has the token rules
(which mono step for what, where the accent may appear), typography and motion decision
trees, and the list of components that exist. Highlights:

- Motion comes from `src/components/reveal/Reveal.tsx` (ported from
  Vultur-ai/manifesto): `Intro`/`IntroItem` for page-load stagger,
  `ScrollFade` + `AnimatedDivider` for scroll reveals. All of it respects
  prefers-reduced-motion.
- Essay primitives: `src/components/essay/Essay.tsx`. Essays are real
  pages, not rendered markdown — any essay may break the mould. Never
  rewrite Henry's essay copy; port it verbatim.

## Adding content (the data files are the CMS)

### Essay
1. Add an entry to `src/lib/writings.ts` (slug, title, date, summary).
2. Create `src/app/writing/<slug>/page.tsx` — either compose from the
   `Essay` primitives or build a custom layout with Reveal primitives
   (see `the20hr-co` for a custom one).
3. Create `src/app/writing/<slug>/layout.tsx`:
   `export const metadata = essayMetadata("<slug>")` (see existing ones).
The index on the home page, older/newer footer nav,
and RSS feed all update automatically from the registry.

### Book
Append to `books` in `src/lib/diet.ts` (`title`, `by`, `year`, optional
`note`). It lands on the shelf in its year group automatically. Only things
Henry has read: podcasts and courses were removed because, beside his
writing, they read as his own work.

### Age ruler
Birthday, milestones and the resting "now · …" label live in
`src/lib/life.ts`. Add a milestone as `age: "label"` (about 30 characters
max, so it fits one line); it shows in the
ruler's readout as that year scrolls past.

### Home copy
The line under the name ("22, English") is Henry's. Don't add a bio,
summaries or labels back: Henry chose the five-item page on 2026-11-16.

## Content that is Henry's to write (leave TODOs, don't invent)
- Confirm the book entries are real and the years right (an earlier note
  called them placeholders; the year `TODO(henry)`s are in `diet.ts`)
- A third article still to port (Henry to supply)
- The20hr.co exact date (`TODO(henry)` in `src/lib/writings.ts`)
