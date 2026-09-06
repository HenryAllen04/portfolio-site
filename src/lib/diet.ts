/**
 * Information diet — the data file IS the CMS. To add:
 *
 *   Book:    { title: "…", by: "…", year: 2026 }
 *            → drops into the right year group automatically (a new year
 *              creates its own header). Add `note: "…"` for a hover note,
 *              `href: "…"` to make the title a link.
 *   Podcast / Design course: same shape, minus `year`, in that section's
 *            `items` array.
 *   New section (e.g. Newsletters): copy a section object, give it a
 *            unique `id` (prefix "diet-") — it appears on the page AND
 *            in the sidebar drill-down automatically.
 *
 * Order within a year/section = the order written here.
 * NOTE: the BOOK entries below are placeholders shaping the layout until
 * Henry pours in the real log (~20 books). Podcasts and design courses
 * are real.
 */

export interface DietItem {
  title: string;
  /** Author, host, or source. */
  by?: string;
  /** Optional note — revealed on hover (always visible on touch). */
  note?: string;
  href?: string;
  /** Year consumed — used by sections that group by year (books). */
  year?: number;
}

export interface DietSection {
  id: string;
  title: string;
  /** Optional intro under the section heading — an array renders as multiple paragraphs. */
  blurb?: string | string[];
  groupByYear?: boolean;
  items: DietItem[];
}

export const dietSections: DietSection[] = [
  {
    id: "diet-books",
    title: "Books",
    blurb:
      "I mainly care for biographies and history. “History is but the biography of great men” — Thomas Carlyle — so really I only care to read about stories of greatness. Everything else bores me.",
    groupByYear: true,
    items: [
      { title: "The Lessons of History", by: "Will & Ariel Durant", year: 2026, note: "Placeholder — swap in your real books and notes." },
      { title: "Zero to One", by: "Peter Thiel", year: 2026 },
      { title: "Shoe Dog", by: "Phil Knight", year: 2026 },
      { title: "The Hard Thing About Hard Things", by: "Ben Horowitz", year: 2026 },
      { title: "Meditations", by: "Marcus Aurelius", year: 2026 },
      { title: "The Almanack of Naval Ravikant", by: "Eric Jorgenson", year: 2026 },
      { title: "The Psychology of Money", by: "Morgan Housel", year: 2026 },
      { title: "Steve Jobs", by: "Walter Isaacson", year: 2026 },
      { title: "Deep Work", by: "Cal Newport", year: 2026 },
      { title: "The Courage to Be Disliked", by: "Kishimi & Koga", year: 2026 },
      { title: "Influence", by: "Robert Cialdini", year: 2025, note: "Placeholder — the mechanics of persuasion." },
      { title: "Atomic Habits", by: "James Clear", year: 2025 },
      { title: "The Mom Test", by: "Rob Fitzpatrick", year: 2025 },
      { title: "Thinking, Fast and Slow", by: "Daniel Kahneman", year: 2024 },
      { title: "The 48 Laws of Power", by: "Robert Greene", year: 2024 },
      { title: "Sapiens", by: "Yuval Noah Harari", year: 2023 },
      { title: "Rich Dad Poor Dad", by: "Robert Kiyosaki", year: 2023 },
    ],
  },
  {
    id: "diet-llm-wiki",
    title: "LLM Wiki",
    // TODO(henry): add the link to the open-source repo ("try it for
    // yourself here!") — add an item with an `href` once you have the URL.
    blurb: [
      "Thought I'd share this one here too! I have a personal knowledge base of everything I enjoy or come across online — made with Obsidian clippings and ingested into frameworks by Claude.",
      "Created by Andrej Karpathy — it's open source, try it for yourself!",
    ],
    items: [],
  },
  {
    id: "diet-podcasts",
    title: "Podcasts",
    blurb: [
      "Learning to enjoy a podcast was one of the habits I picked up as a teenager that dramatically changed my life. I would drive to college at seventeen — an hour there and an hour back — and I replaced music with podcasts about health, entrepreneurship, philosophy. This period of my life gave me an acute awareness of the world's realities that I could not shy away from.",
      "My taste is very similar today, although I only really have time to listen to Founders and like to take notes.",
    ],
    items: [
      {
        title: "Founders",
        by: "David Senra",
        href: "https://www.founderspodcast.com/",
      },
      { title: "Naval", by: "Naval Ravikant" },
      { title: "Uncapped", by: "Jack Altman" },
      { title: "All-In", by: "Chamath, Jason, Sacks & Friedberg" },
      { title: "Huberman Lab", by: "Andrew Huberman" },
      { title: "The Diary of a CEO", by: "Steven Bartlett" },
    ],
  },
  {
    id: "diet-design-courses",
    title: "Design Courses",
    blurb: [
      "Studying what makes design great develops judgement, which creates my gut intuition, which is my taste. These models will never take my taste away from me!!",
      "Two courses I love, which are also required reading for my engineers.",
    ],
    items: [
      {
        title: "Animations on the Web",
        by: "Emil Kowalski",
        href: "https://animations.dev/",
      },
      { title: "Interface Craft", by: "Josh Puckett" },
    ],
  },
];

export const dietIntro =
  "Sometimes the best way to understand a person is from what they choose to absorb. Here's what I've read, what I love to listen to, and what I choose to learn.";
