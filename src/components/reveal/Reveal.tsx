"use client";

/**
 * Reveal system — ported from the Vultur manifesto (Vultur-ai/manifesto,
 * src/components/vision-content.tsx) and generalised, monochrome.
 *
 * ── Page-load intro ──
 * <Intro> stage-gates its descendants: each <IntroItem index={n}> fades/
 * slides up n stagger-steps after mount. Double-RAF before the first stage
 * so the hidden state paints once (prevents the first-transition snap).
 * Skips on revisit within the session (sessionStorage) and for
 * prefers-reduced-motion.
 *
 * ── Scroll-linked ──
 * <ScrollFade> and <AnimatedDivider> reveal via one-shot
 * IntersectionObserver, gated on the intro finishing (IntroDoneContext) so
 * nothing below the fold reveals until the intro settles.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

const INTRO = {
  duration: 500, // ms per element fade
  stagger: 100, // ms between staggered items
  offsetY: 14, // px slide-up distance
};

/* ─── Intro gate ────────────────────────────────────────── */

const IntroDoneContext = createContext<boolean>(true);
const IntroStageContext = createContext<{ stage: number; skip: boolean }>({
  stage: Infinity,
  skip: true,
});

export function Intro({
  children,
  storageKey = "intro-seen",
  count,
  startDelay = 150,
}: {
  children: React.ReactNode;
  /** sessionStorage key — revisits within the session skip the intro */
  storageKey?: string;
  /** number of staggered stages (highest IntroItem index + 1) */
  count: number;
  startDelay?: number;
}) {
  const [stage, setStage] = useState(0);
  const [skip, setSkip] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const seen = sessionStorage.getItem(storageKey);

    if (prefersReduced || seen) {
      setSkip(true);
      setStage(count + 1);
      setIntroComplete(true);
      return;
    }

    sessionStorage.setItem(storageKey, "true");

    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf1 = 0;
    let raf2 = 0;

    // Double-RAF: force one paint at the hidden state before advancing,
    // otherwise a fast mount commits stage 0 and stage 1 in the same paint
    // and the browser silently skips the first transition.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        for (let i = 1; i <= count; i++) {
          timers.push(
            setTimeout(
              () => setStage(i),
              startDelay + (i - 1) * INTRO.stagger,
            ),
          );
        }
        const lastDelay = startDelay + (count - 1) * INTRO.stagger;
        timers.push(
          setTimeout(() => setIntroComplete(true), lastDelay + INTRO.duration),
        );
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      timers.forEach(clearTimeout);
    };
  }, [storageKey, count, startDelay]);

  return (
    <IntroStageContext.Provider value={{ stage, skip }}>
      <IntroDoneContext.Provider value={skip || introComplete}>
        {children}
      </IntroDoneContext.Provider>
    </IntroStageContext.Provider>
  );
}

/** A page-load-intro element: reveals at stage `index + 1`. */
export function IntroItem({
  index,
  children,
  className,
  as: Tag = "div",
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const { stage, skip } = useContext(IntroStageContext);
  const active = stage >= index + 1;

  const style: React.CSSProperties | undefined = skip
    ? undefined
    : {
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : `translateY(${INTRO.offsetY}px)`,
        transition: `opacity ${INTRO.duration}ms ${EASE_OUT_QUINT}, transform ${INTRO.duration}ms ${EASE_OUT_QUINT}`,
      };

  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
}

/* ─── Scroll reveal ─────────────────────────────────────── */

export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [hasIntersected, setHasIntersected] = useState(false);
  const introDone = useContext(IntroDoneContext);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!introDone) return; // wait for the intro to finish
    if (hasIntersected) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, introDone, hasIntersected]);

  return { ref, revealed: hasIntersected && introDone };
}

export function ScrollFade({
  children,
  className,
  duration = INTRO.duration,
  offsetY = INTRO.offsetY,
  delay = 0,
  threshold = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  offsetY?: number;
  delay?: number;
  threshold?: number;
}) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>(threshold);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : `translateY(${offsetY}px)`,
        transition: `opacity ${duration}ms ${EASE_OUT_QUINT} ${delay}ms, transform ${duration}ms ${EASE_OUT_QUINT} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/** Horizontal rule that draws in left → right when scrolled into view. */
export function AnimatedDivider({
  duration = 1150,
  threshold = 0.5,
  className,
}: {
  duration?: number;
  threshold?: number;
  className?: string;
}) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>(threshold);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <hr
        className="reveal-divider"
        style={{
          transform: revealed ? "scaleX(1)" : "scaleX(0)",
          transition: `transform ${duration}ms ${EASE_OUT_QUINT}`,
        }}
      />
    </div>
  );
}
