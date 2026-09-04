"use client";

import Link from "next/link";
import { Intro, IntroItem } from "@/components/reveal/Reveal";
import { writings } from "@/lib/writings";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export default function WritingIndex() {
  const sorted = [...writings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="index-page">
      <Intro storageKey="writing-index" count={2 + sorted.length}>
        <IntroItem index={0} as="h1">
          Writings
        </IntroItem>
        <IntroItem index={1}>
          <p className="index-lede">
            <em>Essays and thoughts</em> — written to sharpen them.
          </p>
        </IntroItem>
        <ul className="index-list">
          {sorted.map((w, i) => (
            <IntroItem index={2 + i} key={w.slug} as="li">
              <Link href={`/writing/${w.slug}`} className="index-item">
                <span className="index-item-title">{w.title}</span>
                <span className="index-item-date">{formatDate(w.date)}</span>
              </Link>
            </IntroItem>
          ))}
        </ul>
      </Intro>
    </main>
  );
}
