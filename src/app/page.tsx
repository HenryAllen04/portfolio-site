"use client";

import Link from "next/link";
import {
  AnimatedDivider,
  Intro,
  IntroItem,
  ScrollFade,
} from "@/components/reveal/Reveal";
import { writings } from "@/lib/writings";
import { dietThemes } from "@/lib/diet";

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
              <em>You are what you consume.</em> What currently goes in.
            </p>
          </ScrollFade>

          {dietThemes.map((group) => (
            <div key={group.theme} className="diet-theme">
              <ScrollFade>
                <h3>{group.theme}</h3>
              </ScrollFade>
              {group.quote && (
                <div className="diet-quote">
                  <ScrollFade>
                    <blockquote>{group.quote.text}</blockquote>
                  </ScrollFade>
                  <ScrollFade delay={100}>
                    <cite>{group.quote.attribution}</cite>
                  </ScrollFade>
                </div>
              )}
              <ul className="diet-list">
                {group.entries.map((entry, i) => (
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
            </div>
          ))}
        </section>
      </Intro>
    </main>
  );
}
