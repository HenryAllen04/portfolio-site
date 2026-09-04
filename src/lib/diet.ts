/**
 * Information diet — what goes in, grouped by theme. Each theme can open
 * with a quote, then lists the things worth their place.
 * NOTE: entries marked "Placeholder" are for Henry to replace.
 */

export interface DietQuote {
  text: string;
  attribution: string;
}

export interface DietEntry {
  title: string;
  /** Author, host, or source. */
  by?: string;
  /** One-line takeaway — why it earned its place. */
  note?: string;
  href?: string;
}

export interface DietTheme {
  theme: string;
  quote?: DietQuote;
  entries: DietEntry[];
}

export const dietThemes: DietTheme[] = [
  {
    theme: "History",
    quote: {
      text: "Those who cannot remember the past are condemned to repeat it.",
      attribution: "George Santayana",
    },
    entries: [
      {
        title: "The Lessons of History",
        by: "Will & Ariel Durant",
        note: "Placeholder — swap in your two history books.",
      },
      {
        title: "Founders Podcast",
        by: "David Senra",
        note: "Placeholder — biographies of history's greatest entrepreneurs.",
        href: "https://www.founderspodcast.com/",
      },
    ],
  },
  {
    theme: "Psychology",
    entries: [
      {
        title: "Influence",
        by: "Robert Cialdini",
        note: "Placeholder — the mechanics of persuasion.",
      },
      {
        title: "Thinking, Fast and Slow",
        by: "Daniel Kahneman",
        note: "Placeholder — how judgement actually works.",
      },
    ],
  },
];
