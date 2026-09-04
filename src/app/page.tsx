"use client";

import Link from "next/link";
import {
  AnimatedDivider,
  Intro,
  IntroItem,
  ScrollFade,
} from "@/components/reveal/Reveal";
import { writings } from "@/lib/writings";
import { dietSections } from "@/lib/diet";

const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/henryallen" },
  { label: "GitHub", href: "https://github.com/HenryAllen04" },
  { label: "X", href: "https://x.com/henry01allen" },
  { label: "Email", href: "mailto:Henry01Allen@gmail.com" },
];

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function DietRow({
  item,
}: {
  item: { title: string; by?: string; note?: string; href?: string };
}) {
  return (
    <li
      className={item.note ? "diet-item has-note" : "diet-item"}
      tabIndex={item.note ? 0 : undefined}
    >
      <span className="diet-item-title">
        {item.href ? (
          <a
            href={item.href}
            rel="noopener"
            target="_blank"
            className="link-reveal"
          >
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </span>
      {item.by && <span className="diet-item-by">{item.by}</span>}
      {item.note && <span className="diet-item-note">{item.note}</span>}
    </li>
  );
}

export default function Home() {
  const sortedWritings = [...writings].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <main className="one-page">
      <Intro storageKey="home-intro" count={3}>
        {/* ─── Me ─── */}
        <section id="me" className="op-section op-hero">
          <IntroItem index={0} as="h1">
            Henry Allen
          </IntroItem>
          <IntroItem index={1}>
            {/* TODO(henry): replace with the rewritten half-paragraph */}
            <p className="home-bio">
              <em>Building AI solutions.</em> Self-taught AI engineer turning
              wild ideas into scalable products. Currently building Vultur to
              make relationship capital visible.
            </p>
          </IntroItem>
          <IntroItem index={2}>
            <ul className="home-links">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    rel="noopener"
                    target={
                      link.href.startsWith("http") ? "_blank" : undefined
                    }
                    className="link-reveal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </IntroItem>
        </section>

        {/* ─── Writings ─── */}
        <section id="writings" className="op-section">
          <AnimatedDivider />
          <ScrollFade className="op-heading">
            <h2>Writings</h2>
          </ScrollFade>
          <ul className="index-list">
            {sortedWritings.map((w, i) => (
              <ScrollFade key={w.slug} delay={i * 80}>
                <li>
                  <Link href={`/writing/${w.slug}`} className="index-item">
                    <span className="index-item-title">{w.title}</span>
                    <span className="index-item-date">
                      {formatDate(w.date)}
                    </span>
                  </Link>
                </li>
              </ScrollFade>
            ))}
          </ul>
        </section>

        {/* ─── Information Diet ─── */}
        <section id="information-diet" className="op-section">
          <AnimatedDivider />
          <ScrollFade className="op-heading">
            <h2>Information Diet</h2>
          </ScrollFade>
          <ScrollFade>
            <p className="op-lede">
              {/* TODO(henry): link the LLM wiki if/when it's public */}
              <em>You are what you consume.</em> Everything I take in ends up
              in my LLM wiki — a personal knowledge base of what I&apos;ve
              read, heard, and learned.
            </p>
          </ScrollFade>

          {dietSections.map((section) => (
            <div key={section.id} id={section.id} className="diet-section-block">
              <ScrollFade threshold={0.05}>
                <h3 className="diet-section-title">{section.title}</h3>
                {section.blurb && (
                  <p className="diet-blurb">{section.blurb}</p>
                )}
              </ScrollFade>
              {section.groupByYear ? (
                [...new Set(section.items.map((b) => b.year))]
                  .sort((a, b) => (b ?? 0) - (a ?? 0))
                  .map((year) => (
                    <ScrollFade key={year} threshold={0.05}>
                      <div className="diet-year-block">
                        <h4 className="diet-year">{year}</h4>
                        <ul className="diet-grid">
                          {section.items
                            .filter((b) => b.year === year)
                            .map((item) => (
                              <DietRow key={item.title} item={item} />
                            ))}
                        </ul>
                      </div>
                    </ScrollFade>
                  ))
              ) : (
                <ScrollFade threshold={0.05}>
                  <ul className="diet-grid">
                    {section.items.map((item) => (
                      <DietRow key={item.title} item={item} />
                    ))}
                  </ul>
                </ScrollFade>
              )}
            </div>
          ))}
        </section>

        <footer className="op-footer">
          <AnimatedDivider />
          <ScrollFade threshold={0.1}>
            <p>
              <a href="mailto:Henry01Allen@gmail.com" className="link-reveal">
                Henry01Allen@gmail.com
              </a>
              <span className="op-footer-sep">·</span>
              <a href="/rss.xml" className="link-reveal">
                RSS
              </a>
              <span className="op-footer-sep">·</span>
              <span>Set in Söhne, Inter &amp; Newsreader</span>
            </p>
          </ScrollFade>
        </footer>
      </Intro>
    </main>
  );
}
