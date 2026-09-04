"use client";

/**
 * The20hr.co — ported from the original /the20hr-co page into the essay
 * system. Europe's fastest startup exit: built, launched, sold in 20 hours.
 */

import { Essay, EssayQuote, EssaySection } from "@/components/essay/Essay";

export default function The20hrCo() {
  return (
    <Essay
      title="The20hr.co"
      date="2025-06-14"
      intro={[
        <p key={1}>
          Looking back, this was one of the most audacious things I&apos;ve
          ever attempted. We were challenged by{" "}
          <a
            href="https://www.linkedin.com/in/antonosika/"
            rel="noopener"
            target="_blank"
            className="link-reveal"
          >
            Anton Osika
          </a>{" "}
          to build something totally unreasonable.
        </p>,
        <p key={2}>
          I assembled my friends, and together we chose our challenge: build,
          launch, sell, all within 20 hours. What followed was one of the
          greatest and most stressful experiences of my life, but I loved
          every second of it.
        </p>,
      ]}
    >
      <EssaySection number="01" title="Europe's fastest exit">
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
        <p>
          It was my first time in Sweden, and also my first hackathon where I
          was picking up the phone, getting on calls, and selling instead of
          being 100% heads down in coding. As a result, we scaled to €10k in
          revenue from the sponsors we secured for the project.
        </p>
        <p>
          So, what did we build? A hyper personalised LinkedIn automation
          outreach tool, which we also used to land Cluely a client so that
          they would sponsor us.
        </p>
      </EssaySection>

      <EssayQuote>
        Nothing is too audacious when you bring together the right people and
        give it everything you&apos;ve got.
      </EssayQuote>

      <EssaySection number="02" title="The story">
        <div className="essay-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/LovableHackphoto.jpeg"
            alt="Henry Allen and The20hr.co team with Brian Walker, who made the acquisition, at the Lovable hackathon in Sweden"
          />
          <iframe
            src="https://www.youtube.com/embed/NFlOEW9kEfk?controls=0&modestbranding=1&rel=0"
            title="The20hr.co documentary — building Europe's fastest startup exit in 20 hours"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
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
      </EssaySection>
    </Essay>
  );
}
