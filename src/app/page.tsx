"use client";

import { useId } from "react";
import Link from "next/link";
import { Intro, IntroItem, ScrollFade } from "@/components/reveal/Reveal";
import { GlassBox } from "@/components/art/GlassBox";
import { TickRule } from "@/components/art/TickRule";
import { writings } from "@/lib/writings";
import { dietSections } from "@/lib/diet";

const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/henryallen" },
  { label: "GitHub", href: "https://github.com/HenryAllen04" },
  { label: "X", href: "https://x.com/henry01allen" },
  { label: "Email", href: "mailto:Henry01Allen@gmail.com" },
];

const FACTS = [
  "21 years old, British; yes I have the terrible accent and the great humour.",
  "Spent time recruiting for AI labs.",
  "Won many hackathons; also sold a company in a hackathon.",
  "I now enjoy getting to judge events like TreeHacks at Stanford!",
  "First company at 17.",
  "Never went to university.",
  "Got a job as an AI engineer at 19.",
  "I consider myself an artist in the Rick Rubin fashion.",
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
  const noteId = useId();
  // The note reveals on hover/focus. A linked title carries the focus and
  // is described by the note; only an unlinked row needs to be focusable
  // itself so keyboard users can still reach the note.
  return (
    <li
      className={item.note ? "diet-item has-note" : "diet-item"}
      tabIndex={item.note && !item.href ? 0 : undefined}
      aria-describedby={item.note && !item.href ? noteId : undefined}
    >
      <span className="diet-item-title">
        {item.href ? (
          <a
            href={item.href}
            rel="noopener"
            target="_blank"
            className="link-reveal"
            aria-describedby={item.note ? noteId : undefined}
          >
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </span>
      {item.by && <span className="diet-item-by">{item.by}</span>}
      {item.note && (
        <span id={noteId} className="diet-item-note">
          {item.note}
        </span>
      )}
    </li>
  );
}

export default function Home() {
  const sortedWritings = [...writings].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <main className="one-page">
      <Intro storageKey="home-intro" count={4}>
        {/* ─── Me ─── */}
        <section id="me" className="op-section op-hero">
          <IntroItem index={0} className="home-title">
            <h1>Henry Allen</h1>
            <GlassBox />
          </IntroItem>
          <IntroItem index={1}>
            <p className="home-bio">
              <em>Welcome to my storage unit</em>, only that it&apos;s
              designed to be a glass box. The content I share here aims to be
              the purest expression of myself. I&apos;m currently enthralled by
              how shared opportunity will evolve; I&apos;m building Vultur to
              steer this.
            </p>
          </IntroItem>
          <IntroItem index={2}>
            <ul className="home-facts">
              {FACTS.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </IntroItem>
          <IntroItem index={3}>
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
          <TickRule />
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
          <TickRule />
          <ScrollFade className="op-heading">
            <h2>Information Diet</h2>
          </ScrollFade>
          <ScrollFade>
            <p className="op-lede">
              <em>
                Sometimes the best way to understand a person is from what they
                choose to absorb.
              </em>{" "}
              Here&apos;s what I&apos;ve read, what I love to listen to, and
              what I choose to learn.
            </p>
          </ScrollFade>

          {dietSections.map((section) => (
            <div key={section.id} id={section.id} className="diet-section-block">
              <ScrollFade threshold={0.05}>
                <div className="diet-section-heading">
                  <h3 className="diet-section-title">{section.title}</h3>
                  {section.link && (
                    <a
                      href={section.link.href}
                      rel="noopener"
                      target="_blank"
                      className="diet-heading-link"
                    >
                      {section.link.label}
                    </a>
                  )}
                </div>
                {section.blurb &&
                  (Array.isArray(section.blurb)
                    ? section.blurb
                    : [section.blurb]
                  ).map((para) => (
                    <p key={para} className={`diet-blurb${section.blurbIsDraft ? " draft-copy" : ""}`}>
                      {para}
                    </p>
                  ))}
                {section.quote && (
                  <blockquote className="diet-quote" cite={section.quote.source}>
                    <p>“{section.quote.text}”</p>
                    <footer><cite>{section.quote.by}</cite></footer>
                  </blockquote>
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
              ) : section.items.length > 0 ? (
                <ScrollFade threshold={0.05}>
                  <ul className="diet-grid">
                    {section.items.map((item) => (
                      <DietRow key={item.title} item={item} />
                    ))}
                  </ul>
                </ScrollFade>
              ) : null}
            </div>
          ))}
        </section>

        <footer className="op-footer">
          <TickRule />
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
