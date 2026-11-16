/**
 * Books — the data file IS the CMS. Each entry is a spine on the home-page
 * shelf (BookShelf):
 *
 *   { title: "…", by: "…", year: 2026 }
 *
 * Years group newest-first, left to right; within a year, the order written
 * here. Add `note: "…"` and it appears in the shelf readout when that spine
 * is selected. `year` is required — a book without one has nowhere to stand.
 *
 * Only things Henry has read belong here. Podcasts and courses were removed
 * on 2026-11-16: listed beside his own writing they read as his work.
 */

export interface Book {
  title: string;
  /** Author. */
  by?: string;
  /** Optional note — shown in the shelf readout when selected. */
  note?: string;
  /** Year read. */
  year: number;
}

export const books: Book[] = [
  { title: "Churchill", by: "Paul Johnson", year: 2026 },
  // TODO(henry): title as dictated; confirm the exact title on Goodreads
  { title: "Roll the Calls", by: "Ari Emanuel", year: 2026 },
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
];
