"use client";

/**
 * An Allergy to Neuroticism — Henry's piece, ported verbatim from his X
 * article (13 Nov 2026). Only the X chrome (handle, date line, author card)
 * was dropped; the quotes are set as pull-quotes with their attribution.
 */

import { ScrollFade } from "@/components/reveal/Reveal";
import { Essay, EssayQuote } from "@/components/essay/Essay";

const p = (text: string) => (
  <ScrollFade>
    <p>{text}</p>
  </ScrollFade>
);

export default function AnAllergyToNeuroticism() {
  return (
    <Essay
      title="An Allergy to Neuroticism"
      date="2026-11-13"
      slug="an-allergy-to-neuroticism"
      intro={[
        <p key={1}>
          {
            "A neurotic environment is one where the anxiety is ambient rather than authored. Where it doesn't belong to you, can't be discharged by your action, and has no baseline to return to."
          }
        </p>,
        <p key={2}>
          {
            "Your own restlessness can be turned into fuel. Somebody else's doubt, volatility and second-guessing are bad weather."
          }
        </p>,
      ]}
    >
      <div className="essay-body">
        {p(
          "Environments set the ceiling on what you can attempt. A volatile environment forces you to spend your intelligence predicting it.",
        )}
        {p(
          "Internal conflict holds you back. The environments you grow up in can be very neurotic; they lack congruence with your thoughts and beliefs. This dissonance is torturous.",
        )}
        {p(
          "Repeated dissonance will teach you to recoil from the environments that produce it. Seeking independence is also self-preservation. Out of repulsion I have quit jobs, gone broke, slept in offices and failed a lot.",
        )}

        <EssayQuote attribution="Charlie Munger">
          {
            "“An isolated example that's very rare is much easier to endure than a perfect sea of misery that never ceases.”"
          }
        </EssayQuote>

        {p(
          "The right environment reduces the amount of energy required to remain congruent with who you’re trying to become. If you're ambitious, the right environments for you will have as little neuroticism as possible.",
        )}

        <EssayQuote attribution="Paul Graham">
          {
            "“Very ambitious people probably need colleagues more than anyone else, because they're so starved for them in everyday life.”"
          }
        </EssayQuote>

        {p(
          "The best peers will share your environment. The best mentors can give you a glimpse of the next and a new bar to set.",
        )}
        {p(
          "The best teams understand the constant motion associated with aligning their habitus with their goals.",
        )}
        {p(
          "I believe an aversion to neuroticism is necessary for success. It is a catalyst for motion.",
        )}
        {p("The best-lived lives are philosophies in motion.")}

        {p("Also")}
        <EssayQuote attribution="Kevin Kelly">
          {
            "“If you meet a jerk, ignore them. If you meet jerks everywhere every day, look deeper into yourself.”"
          }
        </EssayQuote>
      </div>
    </Essay>
  );
}
