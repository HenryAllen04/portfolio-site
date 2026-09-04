/**
 * Information diet — a heading with real sections inside it (Books,
 * Podcasts, Design Courses). Books are grouped under year headers in a
 * two-column grid; a note on an item surfaces on hover (inline on touch).
 * NOTE: every entry below is a placeholder for Henry to replace with the
 * real log — titles chosen only to shape the layout.
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

export const dietSections: DietSection[] = [
  {
    id: "diet-books",
    title: "Books",
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
    id: "diet-podcasts",
    title: "Podcasts",
    items: [
      {
        title: "Founders",
        by: "David Senra",
        note: "Placeholder — biographies of history's greatest entrepreneurs.",
        href: "https://www.founderspodcast.com/",
      },
      { title: "Lex Fridman Podcast", by: "Lex Fridman" },
      { title: "20VC", by: "Harry Stebbings" },
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
      { title: "Interface Craft", by: "Josh Puckett" },
    ],
  },
];

export const dietIntro =
  "You are what you consume. Everything I take in ends up in my LLM wiki — a personal knowledge base of what I've read, heard, and learned.";
