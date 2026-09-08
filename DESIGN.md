# Design system

Monochrome editorial site with two voices: Inter for UI chrome, Newsreader
for anything with a byline. Color is a 12-step grey scale plus one orange
accent that belongs to the nav dial and nothing else. Motion is fade-up
reveals from `Reveal.tsx`; if something animates, it goes through there.

## How styling works here

Plain CSS. Every style is a semantic class in `src/app/globals.css`
(`.essay-date`, `.diet-grid`), grouped under the banner comments. To style
something new, add a class there; inline `style` is only for values React
computes at runtime (the Reveal transforms, sidebar geometry).

Tailwind is not installed. Utility classes compile to nothing, and there
is no `components/ui` folder — the shadcn scaffold was deleted. Don't add
utility classes, and don't reintroduce shadcn.

```tsx
// Correct
<p className="op-lede">…</p>

// Incorrect — no Tailwind here, this renders unstyled
<p className="text-sm text-gray-500 mb-4">…</p>
```

## Color

Tokens in `globals.css` `:root`: `--bg`, `--fg`, `--accent`, `--mono1` …
`--mono12`. The mono number means distance from the background, not
lightness: the whole scale flips in dark mode, so `mono3` is always a faint
line and `mono9` always readable secondary text. Write with tokens and both
themes work; write a hex value and one theme breaks. No hex, rgb, or named
colors in components or new CSS.

`--accent` (orange) marks the current position in the sidebar dial
(`.sb-active-bar`, `.sb-tick.has-active-label`). That is its whole job. An
orange link or button anywhere else dilutes the one signal the accent
carries.

What do I color this?

```
Text
 ├── Primary copy, headings, titles → --fg
 ├── Secondary copy (ledes, blurbs, descriptions) → --mono9
 ├── Metadata (dates, years, footer text, quiet links) → --mono8
 └── Decorative/quiet (pull-quote body, italic asides) → --mono7
Lines
 ├── Hairline borders and dividers → --mono3
 ├── Homepage section-heading rules → --mono12
 └── Idle dial ticks / drawn divider → --mono4
Surfaces
 ├── Page and sidebar → --bg (there are no cards or panels)
 ├── Hover fill (sidebar rows) → --mono2
 └── Inverted tooltip → bg --mono12, text --mono1
```

Nothing else exists. If a new element seems to need a color outside this
tree, it's a new decision for Henry, not a new hex value.

## Typography

Three families, assigned by role:

```
Is it essay copy, a display heading, a pull quote, or an italic aside?
 ├── Yes → --font-essay (Newsreader; loaded variable via next/font)
 └── No
      ├── Is it a page h1 or prose h2 outside the essay/home systems?
      │    └── Yes → --font-sans (Söhne)
      └── Everything else (labels, dates, nav, footer) → --font-ui (Inter)
```

`em` inside body copy switches to the serif automatically (global rule);
that is the house move for emphasis in ledes and bios. Use `em`, not a
font-family override.

Sizes come from the classes, not ad hoc: essay/home h1 36px, section
display headings 24–26px, essay body 18px, UI body 15px, secondary 13–14px,
metadata 12px. Homepage section labels are 14px uppercase; 11px otherwise
exists only for uppercase eyebrow labels with `0.1em` tracking (`h2` base
style, `.essay-date`). Never set text below 11px.
Dates and years get `font-variant-numeric: tabular-nums` so lists don't
wobble.

## Spacing, radius, borders

Spacing steps: `--gap-s` 8, `--gap` 16, `--gap-2x` 32, `--gap-4x` 64,
`--gap-8x` 128. Radii: `--radius` 6 for small surfaces (tooltips, notes),
`--radius-l` 12 for media. Borders are always 1px `--mono3`; there are no
shadows anywhere on the site, so don't introduce one.

## Motion

Four primitives in `src/components/reveal/Reveal.tsx`. All of them respect
prefers-reduced-motion and gate scroll reveals behind the page intro, which
is why hand-rolled animation is banned: a bare CSS keyframe skips both.

```
What kind of entrance?
 ├── Above the fold on page load → <Intro count={n}> + <IntroItem index={i}>
 │    (count = highest index + 1; index order = reveal order)
 ├── Below the fold → <ScrollFade> (stagger lists with delay={i * 80})
 ├── Section separator → <AnimatedDivider />
 └── Hover/press feedback → CSS transition using --transition (200ms)
      or --transition-med (320ms)
```

Never wrap the same element in both `IntroItem` and `ScrollFade`; the
intro gate already holds scroll reveals until it finishes. `motion/react`
appears once, inside the sidebar; don't reach for it in new work.

Inline text links over copy use `.link-reveal` (underline draws in on
hover). Quiet nav links (`.essay-back`, `.op-footer a`) go `--mono8` →
`--fg` on hover. Bare `<a>` falls back to the global opacity fade, which
is fine for list rows but too subtle inside a paragraph.

## Components

- **Essays** — compose `Essay`, `EssaySection`, `EssayQuote` from
  `src/components/essay/Essay.tsx`. `Essay` renders the header, intro
  stagger, and footer nav; pass `slug` or the older/newer links go
  missing. A custom layout (see `the20hr-co`) is allowed, but it still
  builds on the Reveal primitives and still needs the registry entry and
  `layout.tsx` metadata (steps in CLAUDE.md).
- **SiteSidebar** — a singleton mounted in `layout.tsx`. It reads
  `writings.ts` and `diet.ts` on its own; never mount a second one and
  never hand it props. New home-page sections need an `id` that matches a
  `SECTIONS` entry in `SiteSidebar.tsx` or the dial won't track them, and
  Writings/Diet are pinned to `SECTIONS` indices 1 and 2 in four places
  (`setExpanded(1)`, `main === 1`, `main === 2`, `1 * STOPS_PER_GAP`), so
  inserting a section before them means updating those indices too.
- **Art** — two pieces, both in `src/components/art/`, decided from a
  prototype round on 2026-09-08. `GlassBox` is the site mark: a hairline
  wireframe cube with a smaller box inside (the "storage unit designed to
  be a glass box" line, drawn). It sits to the right of the name inside
  the first `IntroItem` (`.home-title`), draws in once on first visit, and
  its yaw follows scroll and pointer. `TickRule` is the home-page section
  divider: the dial's ticks laid flat, drawing in through `useScrollReveal`
  and leaning toward the cursor. Essays keep `AnimatedDivider`. Rejected in
  the same round: a large ghosted Newsreader glyph behind the hero, a
  data-driven "ledger" punch card of the diet (pretty, purposeless), the
  cube as list bullets (reads as icon clutter at 22px), the cube as a large
  set piece beside the hero, and an orange-tinted inner box (steals the
  dial's one colour). Colour stays monochrome.
- **Page shells** — home content in `.one-page` with `.op-section` blocks;
  essays in `.essay`. Both cap at `--content-width` (720px). Don't invent
  a third shell for a new page; pick the one it reads most like.
- **Legacy** — `Footer`/`Clock` (only `/book` uses them),
  `BackNavigation`, `ExternalLinkIcon`. Don't use them in new work; the
  home footer pattern is `.op-footer`.

Placeholder copy Henry hasn't written yet gets the `.draft-copy` class
(renders blue in both themes, the one sanctioned non-mono color) plus a
`TODO(henry)` comment, so scaffolding never passes for his voice.

There are no Button, Card, Input, or Badge components in this system, and
the site has no forms. A new interactive element is a `<button>` or `<a>`
styled by a new semantic class, following the sidebar's classes as the
reference.

```tsx
// Correct — the house essay shape
<Essay title="Against Templates" date="2026-09-04" slug="against-templates">
  <EssaySection number="01" title="What a template optimises for">
    <p>…</p>
  </EssaySection>
</Essay>

// Incorrect — Button doesn't exist in this system
<Button variant="ghost">Read more</Button>
```
