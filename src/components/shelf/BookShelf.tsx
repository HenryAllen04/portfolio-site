"use client";

/**
 * Upright book shelf (lab tile 13). One plain hairline object holding real
 * data: each book is a spine standing on a ground line, grouped by year,
 * newest first. The live book lifts and takes the accent bar; nothing else
 * on the shelf is accented.
 *
 * Mouse: hovering previews a book; leaving the shelf returns it to rest.
 *        A click pins the selection.
 * Touch: press or drag along the shelf; the spine nearest the finger is
 *        selected, so a 16px spine is never the tap target. Vertical
 *        drags still scroll the page (touch-action: pan-y).
 * Keyboard: one tab stop (radio group); arrows / Home / End move,
 *        Escape returns to rest.
 *
 * The readout stacks every possible state in one grid cell, so it is
 * always as tall as its tallest entry and selecting never moves the page.
 */

import { useMemo, useRef, useState } from "react";
import type { Book } from "@/lib/diet";

/** Spine height follows title length, so the title has room to stand in. */
function spineHeight(title: string) {
  return Math.min(100, Math.max(60, 48 + title.length * 1.6));
}

export function BookShelf({ books }: { books: Book[] }) {
  // `pinned` is chosen (click, tap, keyboard); `preview` follows the mouse.
  const [pinned, setPinned] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Newest year first; within a year, the order written in diet.ts.
  const { groups, ordered } = useMemo(() => {
    const years = [...new Set(books.map((b) => b.year))].sort((a, b) => b - a);
    const ordered: Book[] = [];
    const groups = years.map((year) => ({
      year,
      books: books
        .filter((b) => b.year === year)
        .map((book) => ({ book, index: ordered.push(book) - 1 })),
    }));
    return { groups, ordered };
  }, [books]);

  const live = preview ?? pinned;

  const pinAndFocus = (i: number) => {
    const next = (i + ordered.length) % ordered.length;
    setPinned(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const current = pinned ?? 0;
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowDown: current + 1,
      ArrowLeft: current - 1,
      ArrowUp: current - 1,
      Home: 0,
      End: ordered.length - 1,
    };
    if (e.key in moves) {
      e.preventDefault();
      pinAndFocus(moves[e.key]);
    } else if (e.key === "Escape") {
      setPinned(null);
      setPreview(null);
    }
  };

  /** Touch/pen: select the spine whose column is nearest the finger. */
  const scrub = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    let best = -1;
    let bestDist = Infinity;
    refs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (best >= 0) setPinned(best);
  };

  return (
    <div className="shelf">
      <div
        className="shelf-groups"
        role="radiogroup"
        aria-label="Books"
        onKeyDown={onKeyDown}
        onPointerDown={scrub}
        onPointerMove={(e) => e.buttons > 0 && scrub(e)}
        onPointerLeave={() => setPreview(null)}
      >
        {groups.map((g) => (
          <div key={g.year} className="shelf-group">
            <div className="shelf-spines">
              {g.books.map(({ book, index }) => (
                <button
                  key={book.title}
                  ref={(el) => {
                    refs.current[index] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={pinned === index}
                  aria-label={[book.title, book.by, book.year]
                    .filter(Boolean)
                    .join(", ")}
                  tabIndex={index === (pinned ?? 0) ? 0 : -1}
                  className={
                    live === index ? "shelf-spine is-live" : "shelf-spine"
                  }
                  style={
                    { "--h": `${spineHeight(book.title)}%` } as React.CSSProperties
                  }
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setPreview(index);
                  }}
                  onFocus={() => setPinned(index)}
                  onClick={() => setPinned(index)}
                >
                  <span className="shelf-spine-title">{book.title}</span>
                </button>
              ))}
            </div>
            <span className="shelf-year">{g.year}</span>
          </div>
        ))}
      </div>

      <div className="shelf-readout" aria-live="polite">
        <div
          className={live === null ? "shelf-panel is-live" : "shelf-panel"}
          aria-hidden={live !== null}
        >
          <p className="shelf-hint">
            <span className="shelf-hint-pointer">hover a spine to read</span>
            <span className="shelf-hint-touch">tap a spine to read</span>
          </p>
        </div>
        {ordered.map((book, i) => (
          <div
            key={book.title}
            className={live === i ? "shelf-panel is-live" : "shelf-panel"}
            aria-hidden={live !== i}
          >
            <p className="shelf-readout-title">{book.title}</p>
            <p className="shelf-readout-meta">
              {[book.by, book.year].filter(Boolean).join(" · ")}
            </p>
            {book.note && <p className="shelf-readout-note">{book.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
