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
  /** Marks rewritten wording in blue for review. */
  blurbIsDraft?: boolean;
  quote?: { text: string; by: string; source: string };
  /** Optional small link beside the section heading (e.g. Goodreads). */
  link?: { label: string; href: string };
  groupByYear?: boolean;
  items: DietItem[];
}

export const dietSections: DietSection[] = [
  {
    id: "diet-books",
    title: "Books",
    blurb:
      "I mainly care for biographies and history. I only care to read about stories of greatness. Everything else bores me.",
    blurbIsDraft: true,
    quote: {
      text: "The History of the world is but the Biography of great men.",
      by: "Thomas Carlyle",
      source: "https://www.gutenberg.org/files/1091/1091-h/1091-h.htm#link2H_4_0002",
    },
    link: {
      label: "Goodreads",
      href: "https://www.goodreads.com/henryallen",
    },
    groupByYear: true,
    items: [
      {
        title: "The Founders",
        by: "Jimmy Soni",
        year: 2026,
        note: "I reached out to someone mentioned in the book and got a personal tour of where the Confinity and X.com offices used to be, walking down University Avenue in Palo Alto together.",
      },
      { title: "Who Is Michael Ovitz?", by: "Michael Ovitz", year: 2026 },
      { title: "Finite and Infinite Games", by: "James P. Carse", year: 2026 },
      { title: "The Presentation of Self in Everyday Life", by: "Erving Goffman", year: 2026 },
      { title: "Why Fish Don't Exist", by: "Lulu Miller", year: 2026 },
      { title: "The Book of Elon", by: "Eric Jorgenson", year: 2026 },
      { title: "The Ancient City", by: "Numa Denis Fustel de Coulanges", year: 2026 },
      { title: "The Algorithm", by: "Jon McNeill", year: 2026 },
      { title: "The Creative Act", by: "Rick Rubin", year: 2026 },
      // TODO(henry): confirm these two belong in 2025 (on the Goodreads
      // read shelf without dates).
      { title: "Zero to One", by: "Peter Thiel", year: 2025 },
      { title: "The 48 Laws of Power", by: "Robert Greene", year: 2025 },
      // TODO(henry): some of these three were read in 2024 — move those
      // to `year: 2024` and a 2024 group will appear automatically.
      { title: "Atomic Habits", by: "James Clear", year: 2023 },
      { title: "The Art of War", by: "Sun Tzu", year: 2023 },
      { title: "Meditations", by: "Marcus Aurelius", year: 2023 },
    ],
  },
  {
    id: "diet-llm-wiki",
    title: "LLM Wiki",
    blurb: [
      "Thought I'd share this one here too! I have a personal knowledge base of everything I enjoy or come across online, made with Obsidian clippings and ingested into frameworks by Claude.",
      "Created by Andrej Karpathy. It's open source; try it for yourself:",
    ],
    items: [
      {
        title: "The idea file",
        by: "Andrej Karpathy",
        note: "The viral tweet + idea file: hand it to your agent and build your own.",
        href: "https://x.com/karpathy/status/2040470801506541998",
      },
    ],
  },
  {
    id: "diet-podcasts",
    title: "Podcasts",
    blurb: "I got into podcasts at seventeen. These days I mostly listen to Founders and take notes.",
    blurbIsDraft: true,
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
