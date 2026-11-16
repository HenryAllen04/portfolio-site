/**
 * Life — the data behind the age ruler on the home page (AgeRuler).
 *
 * BIRTHDAY places every tick: the ruler is a window onto a strip of every
 * month since this date, and the ages you scrub through count from it.
 * MILESTONES label a year in the readout as it passes; NOW is the resting
 * label ("now · founder").
 *
 * Keep each milestone to about 30 characters: the readout is one mono line
 * beside a 49px ruler, and anything longer wraps or runs into the writing
 * column.
 */

export const BIRTHDAY = "2004-10-03";

/** Shown at rest, as "now · …". */
export const NOW = "founder";

// Henry's list (2026-11-16), trimmed to one idea each. His full wording:
//   17 Started first company, sales job & School on the side
//   19 AI Engineer, travelling the world. No thankyou university
//   20 The20hr.co, Living in London winning hacks
//   21 Founder, Judged treehacks, recruiting & more
export const MILESTONES: Record<number, string> = {
  0: "born",
  11: "built a Minecraft server",
  13: "moving between schools",
  14: "became an Army cadet",
  16: "rejected by the Army: ADHD",
  17: "first company, school on the side",
  18: "didnt go university",
  19: "AI engineer, travelling the world",
  20: "The20hr.co, winning hacks in London",
  21: "founder, judged TreeHacks",
};
