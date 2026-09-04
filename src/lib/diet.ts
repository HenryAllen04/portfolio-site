/**
 * Information diet — what goes in. Append entries; the page groups by
 * category and shows them newest-first within each group.
 * NOTE: sample entries below are placeholders for Henry to replace.
 */

export type DietCategory = "Books" | "Podcasts" | "Newsletters & Blogs" | "Watching";

export interface DietEntry {
  title: string;
  /** Author, host, or source. */
  by?: string;
  category: DietCategory;
  /** One-line takeaway — why it earned its place. */
  note?: string;
  href?: string;
}

export const diet: DietEntry[] = [
  {
    title: "The Second Mountain",
    by: "David Brooks",
    category: "Books",
    note: "Placeholder — replace with what you're actually reading.",
  },
  {
    title: "Founders Podcast",
    by: "David Senra",
    category: "Podcasts",
    note: "Placeholder — biographies of history's greatest entrepreneurs.",
    href: "https://www.founderspodcast.com/",
  },
  {
    title: "Stratechery",
    by: "Ben Thompson",
    category: "Newsletters & Blogs",
    note: "Placeholder — strategy and the business of tech.",
    href: "https://stratechery.com/",
  },
  {
    title: "How to Build the Future",
    by: "Y Combinator",
    category: "Watching",
    note: "Placeholder — founder interviews.",
  },
];
