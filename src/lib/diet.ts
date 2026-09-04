/**
 * Information diet — a heading with sections inside it. Books are listed
 * by year (title + author, note revealed on hover); other sections are
 * simple lists. Sections also drive the sidebar drill-down.
 * NOTE: entries marked "Placeholder" are for Henry to replace.
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
  /** Optional one-liner under the section heading. */
  blurb?: string;
  groupByYear?: boolean;
  items: DietItem[];
}

export const dietIntro =
  "You are what you consume. Everything I take in ends up in my LLM wiki — a personal knowledge base of what I've read, heard, and learned.";

export const dietSections: DietSection[] = [
  {
    id: "diet-books",
    title: "Books",
    groupByYear: true,
    items: [
      {
        title: "The Lessons of History",
        by: "Will & Ariel Durant",
        year: 2026,
        note: "Placeholder — swap in your real books and notes.",
      },
      {
        title: "Influence",
        by: "Robert Cialdini",
        year: 2025,
        note: "Placeholder — the mechanics of persuasion.",
      },
      {
        title: "Thinking, Fast and Slow",
        by: "Daniel Kahneman",
        year: 2024,
      },
      {
        title: "Sapiens",
        by: "Yuval Noah Harari",
        year: 2023,
      },
    ],
  },
  {
    id: "diet-podcasts",
    title: "Podcasts",
    items: [
      {
        title: "Founders",
        by: "David Senra",
        note: "Placeholder — biographies of history's greatest entrepreneurs.",
        href: "https://www.founderspodcast.com/",
      },
    ],
  },
  {
    id: "diet-design-courses",
    title: "Design Courses",
    items: [
      {
        title: "Animations on the Web",
        by: "Emil Kowalski",
        note: "Placeholder — add the design courses you rate.",
        href: "https://animations.dev/",
      },
    ],
  },
];
