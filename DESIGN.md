# Design system

Henry's house style: quiet warm paper (night in dark mode), hairline
structure, and three type registers. Serif (Newsreader) is for what you
read, sans (Inter) for what you operate, mono (JetBrains Mono) for what is
measured. Color is a 12-step warm grey scale plus one Vermilion accent that
marks the live thing and nothing else. Motion is fade-up reveals from
`Reveal.tsx`; if something animates, it goes through there. The source of
truth for the style is the `henry-allen-style` skill. This file is how it
maps onto this codebase.

## How styling works here

Plain CSS. Every style is a semantic class in `src/app/globals.css`
(`.essay-date`, `.shelf-spine`), grouped under the banner comments. To style
something new, add a class there; inline `style` is only for values React
computes at runtime (the Reveal transforms, shelf spine heights).

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

Tokens in `globals.css` `:root`: `--bg`, `--fg`, `--accent`,
`--on-accent`, `--mono1` … `--mono12`. Light is paper `#f4f2ed` on ink
`#151413`; dark is the night surface (`#121110`, paper text). Every grey sits
on the same slightly warm axis. A cool neutral grey like `#888` breaks it.
The mono number means distance from the background, not lightness: the
whole scale flips in dark mode, so `mono3` is always a hairline and `mono9`
always readable secondary text. Write with tokens and both themes work;
write a hex value and one theme breaks. No hex, rgb, or named colors in
components or new CSS.

`--mono8` is deliberately darker than the lab's mute (`#8c887f`, which is
`--mono7`), so that 12px metadata passes WCAG AA on paper. Use `--mono7` only
for large text or non-text marks.

`--accent` (Vermilion `#e4471b`) marks state: the thing that is live right
now. On this site that means exactly these places:
- the guide on the hovered writing entry (`.reader-item::before`)
- the underline under the hovered link (`.link-reveal::after`, the hover
  underline on `.watch-story-link`)
- the selected book on the shelf (`.shelf-spine.is-selected` top bar)
- keyboard focus rings and text selection

It is never a ground and never a second hue. Keep it to roughly 3% of
anything on screen: 1–2px lines, single dots. An accent button or an accent
link at rest dilutes the one signal it carries.

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
 └── Drawn divider → --mono4
Surfaces
 ├── Page → --bg (there are no cards or panels)
 ├── Recessed step → --mono2 (paper-2)
 └── Inverted tooltip → bg --mono12, text --mono1
```

Nothing else exists. If a new element seems to need a color outside this
tree, it's a new decision for Henry, not a new hex value.

## Typography

Three families, three jobs. A reader can tell what a piece of text is for
before reading it:

```
Is it something you read (essay copy, a heading, a name, the bio, a quote)?
 ├── Yes → --font-serif / --font-essay (Newsreader, variable via next/font)
 └── No
      ├── Is it something you press or operate (nav, links, labels)?
      │    └── Yes → --font-ui (Inter; weight 500 for anything pressable)
      └── Is it a measurement (date, year, count, index number, path, hint)?
           └── Yes → --font-mono (JetBrains Mono, 400)
```

Söhne is no longer in the system. The local file is a static 400 cut, and
with `font-synthesis: none` it can't carry a 400/500 distinction. Inter is
the operating sans; `--font-sans` is an alias for it.

`em` inside body copy switches to the serif automatically (global rule);
that is the house move for emphasis in ledes. Use `em`, not a font-family
override.

Newsreader is light at size: weight 300 at 20px and above, 400 below that.
Tracking tightens (−0.02em) only at display sizes; mono and labels stay at 0
or positive.

Sizes come from the classes, not ad hoc:
- **Display:** home h1 `clamp(40px, 4.6vw, 64px)`; essay h1 `clamp(40px, 5.4vw, 60px)`.
- **Headings:** essay section headings 30px; home name 34px.
- **Reading:** essay body 20px/1.6 (18px/400 under 768px); bio 22px.
- **Sans:** UI body 15px; secondary 13–14px.
- **Mono metadata:** 12px, UPPERCASE with `0.04em` for kickers (the bare `h2` style, `.essay-date`); lowercase for dates and hints, as written for paths (`HenryAllen.me / writing`, `hover a spine to read`).
- **Floor:** never set text below 11px.

Dates, years and counts get `font-variant-numeric: tabular-nums` so lists
don't wobble.

## Spacing, radius, borders

Spacing steps: `--gap-s` 8, `--gap` 16, `--gap-2x` 32, `--gap-4x` 64,
`--gap-8x` 128. Corners are square everywhere: `--radius` and `--radius-l`
are both 0 and exist only so older rules still resolve. The only curves are
functional ones, like rings and dots. Borders are 1px `--mono3` hairlines.
Solid lines mean structure; a dashed line means something absent or not yet
there. There are no shadows anywhere on the site, so don't introduce one.
Depth comes from layering `--bg` over `--mono2`.

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
 └── Hover/press feedback → CSS transition using --transition (150ms,
      colour/state) or --transition-med (300ms, physical moves). Both use
      --ease, cubic-bezier(.2,.7,.2,1). Nothing overshoots.
```

Never wrap the same element in both `IntroItem` and `ScrollFade`; the
intro gate already holds scroll reveals until it finishes. Don't reach
for `motion/react` in new work.

Inline text links over copy use `.link-reveal` (an accent underline draws
in on hover). Quiet nav links (`.essay-back`, `.home-links a`) go `--mono8` →
`--fg` on hover. In the writing list (`.reader`), hovering one row
dims its siblings to `--mono7`: the cursor decides what is lit. This is
hover-only, so touch and keyboard keep the full-contrast resting state. Bare `<a>` falls back to the global opacity fade, which
is fine for list rows but too subtle inside a paragraph.

## Components

- **Essays** — compose `Essay`, `EssaySection`, `EssayQuote` from
  `src/components/essay/Essay.tsx`. `Essay` renders the header, intro
  stagger, and footer nav; pass `slug` or the older/newer links go
  missing. A custom layout (see `the20hr-co`) is allowed, but it still
  builds on the Reveal primitives and still needs the registry entry and
  `layout.tsx` metadata (steps in CLAUDE.md).
- **Art** — `src/components/art/TickRule.tsx` (the old dial's ticks laid
  flat, leaning toward the cursor) is currently unused; it was removed from
  the one-screen home on 2026-11-16. Essays keep `AnimatedDivider`. The
  `GlassBox` cube mark and the sidebar dial were deleted the same day at
  Henry's request. Rejected in the 2026-09-08 art round: a large ghosted
  Newsreader glyph behind the hero, and a data-driven "ledger" punch card
  of the diet (pretty, purposeless). The art stays monochrome.
- **Home** — one screen (no scroll at 1024×768 and up), and it carries
  five things only: name, one line, essay titles, the shelf, contact. The
  composition is the message, so the name is small (34px) and nothing is
  labelled. `.home` is a grid:
  - **Top-left (`.home-main`):** name and the one line.
  - **Bottom-left (`.home-contact`):** contact links, aligned to the
    bottom of the shelf.
  - **Right (`.home-side`):** the writing titles (`.reader`), then the
    shelf (`.home-shelf`).
  - **Below 1000px** it stacks: name, line, contact, writing, shelf.
  - Anything new has to earn a place against those five.
- **AgeRuler** — `src/components/life/AgeRuler.tsx`, the mark after
  "22, English", fed by `src/lib/life.ts` (birthday, milestones, the "now"
  label). It's a 49×12 hairline ruler: a strip of every month since birth
  slides under a fixed accent hairline in the centre, like a slide-rule
  cursor, and the month under the hairline is the one being read.
  - **Ticks:** uniform months, with lived months in ink and future months
    faint. There are no year or milestone ticks; Henry found taller "event"
    ticks misleading, so milestones appear only in the readout.
  - **Rest / hover:** the readout shows "now · founder". The cursor is a
    plain pointer, not a drag cursor.
  - **The secret (drag):** drag it like film; 1px = 1 month with no
    easing. Release eases home in 350ms.
  - **Click:** opens ← → year controls centred under the ruler, each a 44px
    column, placed absolutely so nothing moves. While they're open, the
    arrow keys work page-wide and the ruler stays put. Escape, clicking
    outside, or clicking the ruler again closes them and eases home.
  - **Ends push back:** stepping or dragging past now or birth leans the
    strip up to 3 months against the edge (a rubber band, no overshoot back)
    and settles. Past now the readout says "not yet" for about a second.
    The arrow that would run off an end is drawn faint but still answers.
  - **Readout:** mono, its first line on the intro's baseline. "19 ·"
    holds a column and the label wraps beside it (hanging indent), so a
    wrapped line clears the → arrow. Lines break between phrases first:
    at sentences if the label has any, otherwise at commas. Width is 44ch
    where there's room (≥1200px, or stacked), 34ch in the narrow
    two-column range, and to the screen edge on phones. Keep milestones to
    about 30 characters. When stacked, contact sits 56px under the line to
    leave room for the arrows and a wrapped readout.
  - **No focus box** (Henry's call): keyboard focus shows the readout and
    darkens the axis; focused arrows go ink with an accent underline.
  - **Keyboard:** ←/→ step a year, Enter opens the controls, Escape returns
    to now. Screen readers hear each age, and "not yet" at the end.
  - The date is read on the client (the page is prerendered); frames write
    the transform directly, with no React render per frame.
  - **Decided 2026-11-16 in a prototype round, with these rejections:**
    - Hatched St George's cross: the hatching collapses into a grid below
      ~24px.
    - England locator: the coastline wobbles at 15px.
    - Rewind (press and hold): undiscoverable, and you can't stop on a year.
    - Reel (click plays birth to now): a performance rather than a tool;
      repeat visitors get the same show.
- **Reader** — `.reader` is a line reader of essay titles and dates.
  Hovering dims the other titles and snaps a 2px accent guide (140ms
  ease-out) to the hovered entry's edge; the guide hangs in the column gap
  so titles align with the shelf.
- **BookShelf** — `src/components/shelf/BookShelf.tsx` (lab tile 13), fed by
  `books` in `src/lib/diet.ts`.
  - **Drawing:** upright hairline spines on a ground line, grouped by year
    newest first, separated by a gap with no year labels (the year shows in
    the readout). Spine height follows
    title length.
  - **Mouse:** hover previews a book; leaving the shelf returns it to rest.
    A click pins the selection.
  - **Touch:** press or drag along the shelf; the spine nearest the finger
    is selected, so the narrow spine is never the tap target.
  - **Keyboard:** a radio group with one tab stop; arrows and Home/End
    move, Escape resets.
  - **Readout:** every state is stacked in one grid cell, so its height is
    always the tallest entry and selecting never moves the page. At rest it
    shows only the hint.
- **Page shells** — home in `.home`; essays in `.essay` (capped at
  `--content-width`, 720px). Don't invent a third shell for a new page;
  pick the one it reads most like.
- **Legacy** — `Footer`/`Clock` (only `/book` uses them),
  `BackNavigation`, `ExternalLinkIcon`. Don't use them in new work.

Placeholder copy Henry hasn't written yet gets the `.draft-copy` class
(renders blue in both themes, the one sanctioned non-mono color) plus a
`TODO(henry)` comment, so scaffolding never passes for his voice.

There are no Button, Card, Input, or Badge components in this system, and
the site has no forms. A new interactive element is a `<button>` or `<a>`
styled by a new semantic class, following `.shelf-spine` and
`.reader-item` as the reference.

```tsx
// Correct — the house essay shape
<Essay title="An Allergy to Neuroticism" date="2026-11-13" slug="an-allergy-to-neuroticism">
  <EssaySection number="01" title="What a template optimises for">
    <p>…</p>
  </EssaySection>
</Essay>

// Incorrect — Button doesn't exist in this system
<Button variant="ghost">Read more</Button>
```
