"use client";

import { Intro, IntroItem } from "@/components/reveal/Reveal";

const LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/henryallen" },
  { label: "GitHub", href: "https://github.com/HenryAllen04" },
  { label: "X", href: "https://x.com/henry01allen" },
  { label: "Email", href: "mailto:Henry01Allen@gmail.com" },
];

export default function Home() {
  return (
    <main className="home">
      <Intro storageKey="home-intro" count={4}>
        <IntroItem index={0}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/halogo.svg" alt="" className="home-logo" />
        </IntroItem>
        <IntroItem index={1} as="h1">
          Henry Allen
        </IntroItem>
        <IntroItem index={2}>
          {/* TODO(henry): replace with the rewritten half-paragraph */}
          <p className="home-bio">
            <em>Building AI solutions.</em> Self-taught AI engineer turning
            wild ideas into scalable products. Currently building Vultur to
            make relationship capital visible.
          </p>
        </IntroItem>
        <IntroItem index={3}>
          <ul className="home-links">
            {LINKS.map((link) => (
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
      </Intro>
    </main>
  );
}
