# henryallen.dev

One-page personal site (Me / Writings / Information Diet) with an overlay
"dial" navigation. Next.js 15 App Router, plain CSS in
`src/app/globals.css` (Tailwind is NOT wired up — don't add utility
classes), fonts: Söhne + Inter (UI) and Newsreader variable (essays,
display). Monochrome; the single orange accent (`--accent`) is reserved
for the dial's active indicator.

Dev server: `npm run dev` — do NOT use port 3000 (taken by another
project); use e.g. `npx next dev --turbopack -p 3105`.

## Design system

Read `DESIGN.md` before writing any UI or CSS — it has the token rules
(which mono step for what, the accent ban), typography and motion decision
trees, and the list of components that exist. Highlights:

- Motion comes from `src/components/reveal/Reveal.tsx` (ported from
  Vultur-ai/manifesto): `Intro`/`IntroItem` for page-load stagger,
  `ScrollFade` + `AnimatedDivider` for scroll reveals. All of it respects
  prefers-reduced-motion.
- The sidebar dial lives in `src/components/sidebar/` (mechanics ported
  from unlumen sidebar-001; toggle icon from Vultur-ai/ontology).
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
The index on the home page, sidebar drill-down, older/newer footer nav,
and RSS feed all update automatically from the registry.

### Information diet entry
Append to `src/lib/diet.ts` — instructions are at the top of that file.
Books auto-group by year; new sections auto-appear in the sidebar.

## Content that is Henry's to write (leave TODOs, don't invent)
- Real book entries (current ones are placeholders; podcasts/courses are real)
- The20hr.co exact date (`TODO(henry)` in `src/lib/writings.ts`)
