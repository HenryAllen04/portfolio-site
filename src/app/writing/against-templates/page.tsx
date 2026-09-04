"use client";

/**
 * DRAFT — seeded from Henry's own words on why this site avoids templates.
 * Edit freely; this doubles as the reference essay for the template system.
 */

import { Essay, EssaySection } from "@/components/essay/Essay";

export default function AgainstTemplates() {
  return (
    <Essay
      title="Against Templates"
      date="2026-09-04"
      intro={[
        <p key={1}>
          Templates remove the unique context and alpha that lives in a piece
          of work. They recycle past thinking, limiting the chance to
          improve on it.
        </p>,
        <p key={2}>
          They discount originality. They mute the distinctive beliefs and
          personality that make communication compelling.
        </p>,
      ]}
    >
      <EssaySection number="01" title="What a template optimises for">
        <p>
          A template optimises for the average case. It encodes the decisions
          someone else made for a problem that was almost, but not quite,
          yours. Every default you accept is a decision you did not make —
          and the decisions you do not make are exactly where the
          distinctiveness would have lived.
        </p>
        <p>
          This site is built without one. The conventions it borrows — a
          readable measure, a dated index — are borrowed because they serve
          the reader, not because they shipped in a starter kit.{" "}
          <strong>Everything else is a decision.</strong>
        </p>
      </EssaySection>
    </Essay>
  );
}
