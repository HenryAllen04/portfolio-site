"use client";

/**
 * Essay primitives — the shared editorial language for /writing.
 * Manifesto-style motion (intro stagger above the fold, scroll reveals
 * below, drawn dividers) in the site's monochrome palette. Each essay is
 * its own page composed from these pieces, so any essay can break the
 * mould without touching the others.
 */

import React from "react";
import Link from "next/link";
import {
  AnimatedDivider,
  Intro,
  IntroItem,
  ScrollFade,
} from "@/components/reveal/Reveal";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Page shell: title + date stagger in on load, body follows. */
export function Essay({
  title,
  date,
  intro,
  children,
}: {
  title: string;
  date: string;
  /** Paragraphs revealed as part of the page-load intro, before the fold. */
  intro?: React.ReactNode[];
  children?: React.ReactNode;
}) {
  const introCount = 2 + (intro?.length ?? 0);

  return (
    <Intro storageKey={`essay-${title}`} count={introCount}>
      <article className="essay">
        <header>
          <IntroItem index={0}>
            <p className="essay-date">{formatDate(date)}</p>
          </IntroItem>
          <IntroItem index={1} as="h1">
            {title}
          </IntroItem>
        </header>
        {intro?.map((node, i) => (
          <IntroItem index={2 + i} key={i} className="essay-intro-para">
            {node}
          </IntroItem>
        ))}
        {children}
        <ScrollFade className="essay-end" threshold={0.1}>
          <Link href="/writing" className="essay-back">
            ← All writing
          </Link>
        </ScrollFade>
      </article>
    </Intro>
  );
}

/** Numbered section: divider draws in, heading then paragraphs stagger. */
export function EssaySection({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="essay-section">
      <AnimatedDivider />
      <ScrollFade className="essay-section-heading">
        <h2>{title}</h2>
        {number && <span className="essay-section-number">{number}</span>}
      </ScrollFade>
      {React.Children.map(React.Children.toArray(children), (child, i) => (
        <ScrollFade key={i} delay={i * 100}>
          {child}
        </ScrollFade>
      ))}
    </section>
  );
}

/** Centered pull-quote with attribution. */
export function EssayQuote({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <div className="essay-quote">
      <ScrollFade>
        <blockquote>{children}</blockquote>
      </ScrollFade>
      {attribution && (
        <ScrollFade delay={100}>
          <cite>{attribution}</cite>
        </ScrollFade>
      )}
    </div>
  );
}
