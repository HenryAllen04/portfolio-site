"use client";

/**
 * Home: one screen. The composition is the message, so the page carries
 * only five things — name, one line, essay titles, the shelf, contact.
 * Anything new has to earn a place against that list.
 */

import Link from "next/link";
import { Intro, IntroItem } from "@/components/reveal/Reveal";
import { BookShelf } from "@/components/shelf/BookShelf";
import { AgeRuler } from "@/components/life/AgeRuler";
import { writings } from "@/lib/writings";
import { books } from "@/lib/diet";

const CONTACT = [
  { label: "Email", href: "mailto:Henry01Allen@gmail.com" },
  { label: "X", href: "https://x.com/henry01allen" },
  { label: "LinkedIn", href: "https://linkedin.com/in/henryallen" },
  { label: "GitHub", href: "https://github.com/HenryAllen04" },
];

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const sortedWritings = [...writings].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <main className="home">
      <Intro storageKey="home-intro" count={3}>
        <IntroItem index={0} className="home-main">
          <h1>Henry Allen</h1>
          <p className="home-intro">
            22, English
            <AgeRuler />
          </p>
        </IntroItem>

        <IntroItem index={1} as="nav" className="home-contact">
          <ul className="home-links" aria-label="Contact">
            {CONTACT.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  rel="noopener"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  className="link-reveal"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </IntroItem>

        <IntroItem index={2} className="home-side">
          {/* Line reader: hovering lights one title, dims the rest, and
              snaps the accent guide to its edge */}
          <ol id="writings" className="reader" aria-label="Writing">
            {sortedWritings.map((w) => (
              <li key={w.slug}>
                <Link href={`/writing/${w.slug}`} className="reader-item">
                  <span className="reader-title">{w.title}</span>{" "}
                  <span className="reader-date">{formatDate(w.date)}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div id="books" className="home-shelf">
            <BookShelf books={books} />
          </div>
        </IntroItem>
      </Intro>
    </main>
  );
}
