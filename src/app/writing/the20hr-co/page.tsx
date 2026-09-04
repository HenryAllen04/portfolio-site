"use client";

/**
 * The20hr.co — Henry's original piece, copy verbatim from the original
 * /the20hr-co page. This essay keeps its own shape (lede, Watch-the-Story
 * jump, portrait video + photo + documentary): the reveal primitives only
 * provide motion, they don't dictate structure.
 */

import Link from "next/link";
import {
  AnimatedDivider,
  Intro,
  IntroItem,
  ScrollFade,
} from "@/components/reveal/Reveal";

export default function The20hrCoPage() {
  return (
    <Intro storageKey="essay-the20hr-co" count={4}>
      <article className="essay">
        <header>
          <IntroItem index={0}>
            {/* TODO(henry): confirm the exact hackathon date */}
            <p className="essay-date">9 August 2025</p>
          </IntroItem>
          <IntroItem index={1} as="h1">
            The20hr.co
          </IntroItem>
        </header>

        <IntroItem index={2} className="essay-intro-para">
          <p>
            <em>Europe&apos;s fastest startup exit</em> - Built, launched, and
            sold in 20 hours.
          </p>
        </IntroItem>

        <IntroItem index={3}>
          <button
            type="button"
            className="watch-story-link"
            onClick={() =>
              document
                .getElementById("story-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Watch the Story
          </button>
        </IntroItem>

        <div className="essay-body">
          <ScrollFade>
            <p>
              Looking back, this was one of the most audacious things
              I&apos;ve ever attempted. We were challenged by{" "}
              <a
                href="https://www.linkedin.com/in/antonosika/"
                rel="noopener"
                target="_blank"
                className="link-reveal"
              >
                Anton Osika
              </a>{" "}
              to build something totally unreasonable.
            </p>
          </ScrollFade>

          <ScrollFade>
            <p>
              I assembled my friends, and together we chose our challenge:
              Build, Launch, Sell, all within 20 hours. What followed was one
              of the greatest and most stressful experiences of my life, but
              I loved every second of it.
            </p>
          </ScrollFade>

          <ScrollFade>
            <p>
              <a
                href="https://the20hr.co"
                rel="noopener"
                target="_blank"
                className="link-reveal"
              >
                The20hr.co
              </a>{" "}
              became Europe&apos;s fastest startup exit, acquired by Revel in
              record time.
            </p>
          </ScrollFade>

          <ScrollFade>
            <p>
              It was my first time in Sweden, and also my first hackathon
              where I was picking up the phone, getting on calls, and selling
              instead of being 100% heads down in coding. As a result, we
              scaled to €10k in revenue from the sponsors we secured for the
              project.
            </p>
          </ScrollFade>

          <ScrollFade>
            <p>
              So, what did we build? A hyper personalised LinkedIn automation
              outreach tool, which we also used to land Cluely a client so
              that they would sponsor us.
            </p>
          </ScrollFade>

          <ScrollFade>
            <p>
              I learned a lot from this short but intense experience. It
              truly reinforced the idea that nothing is too audacious when
              you bring together the right people and give it everything
              you&apos;ve got.
            </p>
          </ScrollFade>
        </div>

        <section id="story-section" className="essay-story">
          <AnimatedDivider />
          <ScrollFade className="essay-section-heading">
            <h2>The Story</h2>
          </ScrollFade>
          <ScrollFade threshold={0.1}>
            <div className="story-media">
              <iframe
                src="https://drive.google.com/file/d/1lJQK-9V0qY0TzbLzzS_dzWqm9z-v_SgP/preview?embedded=true"
                width="280"
                height="500"
                className="story-media-portrait"
                title="The20hr.co Story - Europe's Fastest Startup Exit"
              />
              <div className="story-media-stack">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/LovableHackphoto.jpeg"
                  alt="Henry Allen and The20hr.co team with Brian Walker who made the acquisition - celebrating Europe's fastest startup exit at Lovable hackathon in Sweden"
                  loading="lazy"
                />
                <iframe
                  src="https://www.youtube.com/embed/NFlOEW9kEfk?controls=0&modestbranding=1&rel=0"
                  title="The20hr.co documentary - Building Europe's fastest startup exit in 20 hours"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollFade>
          <ScrollFade>
            <p className="essay-media-caption">
              <a
                href="https://the20hr.co"
                rel="noopener"
                target="_blank"
                className="link-reveal"
              >
                Visit the20hr.co
              </a>
            </p>
          </ScrollFade>
        </section>

        <ScrollFade className="essay-end" threshold={0.1}>
          <Link href="/writing" className="essay-back">
            ← All writing
          </Link>
        </ScrollFade>
      </article>
    </Intro>
  );
}
