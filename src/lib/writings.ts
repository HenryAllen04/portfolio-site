/**
 * Registry of essays. Each essay lives at src/app/writing/<slug>/page.tsx,
 * composed from the primitives in src/components/essay/Essay.tsx.
 * Add an entry here and create the matching page to publish.
 */

import type { Metadata } from "next";

export interface Writing {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  summary?: string;
}

const SITE_URL = "https://henryallen.me";

/** Per-essay metadata, exported from each essay route's server layout. */
export function essayMetadata(slug: string): Metadata {
  const w = writings.find((x) => x.slug === slug);
  if (!w) return {};
  const title = `${w.title} | Henry Allen`;
  return {
    title,
    description: w.summary,
    openGraph: {
      title,
      description: w.summary,
      type: "article",
      url: `${SITE_URL}/writing/${w.slug}`,
      siteName: "Henry Allen",
    },
    twitter: { card: "summary", title, description: w.summary },
  };
}

export const writings: Writing[] = [
  {
    slug: "an-allergy-to-neuroticism",
    title: "An Allergy to Neuroticism",
    date: "2026-11-13",
    summary:
      "A neurotic environment is one where the anxiety is ambient rather than authored.",
  },
  {
    // TODO(henry): confirm the exact hackathon date (Lovable x Project
    // Europe, Stockholm — winners announced ~13 Aug 2025)
    slug: "the20hr-co",
    title: "The20hr.co",
    date: "2025-08-09",
    summary:
      "Europe's fastest startup exit - built, launched, and sold in 20 hours.",
  },
];
