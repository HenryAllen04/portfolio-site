"use client";

import { Intro, IntroItem, ScrollFade, AnimatedDivider } from "@/components/reveal/Reveal";
import { diet, type DietCategory } from "@/lib/diet";

const CATEGORIES: DietCategory[] = [
  "Books",
  "Podcasts",
  "Newsletters & Blogs",
  "Watching",
];

export default function InformationDiet() {
  return (
    <main className="index-page">
      <Intro storageKey="information-diet" count={2}>
        <IntroItem index={0} as="h1">
          Information Diet
        </IntroItem>
        <IntroItem index={1}>
          <p className="index-lede">
            <em>You are what you consume.</em> The books, podcasts, and
            writing currently shaping how I think.
          </p>
        </IntroItem>
        {CATEGORIES.map((category) => {
          const entries = diet.filter((d) => d.category === category);
          if (entries.length === 0) return null;
          return (
            <section key={category} className="diet-section">
              <AnimatedDivider />
              <ScrollFade>
                <h2>{category}</h2>
              </ScrollFade>
              <ul className="diet-list">
                {entries.map((entry, i) => (
                  <ScrollFade key={entry.title} delay={i * 80}>
                    <li className="diet-item">
                      <span className="diet-item-title">
                        {entry.href ? (
                          <a
                            href={entry.href}
                            rel="noopener"
                            target="_blank"
                            className="link-reveal"
                          >
                            {entry.title}
                          </a>
                        ) : (
                          entry.title
                        )}
                        {entry.by && (
                          <span className="diet-item-by"> — {entry.by}</span>
                        )}
                      </span>
                      {entry.note && (
                        <p className="diet-item-note">{entry.note}</p>
                      )}
                    </li>
                  </ScrollFade>
                ))}
              </ul>
            </section>
          );
        })}
      </Intro>
    </main>
  );
}
