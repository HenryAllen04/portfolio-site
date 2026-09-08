"use client";

/**
 * Section divider made of ticks — the nav dial's tick vocabulary laid flat.
 * Draws in left → right when scrolled into view (through the Reveal gate,
 * so it waits for the intro and skips under reduced motion); ticks lean
 * toward the cursor with a ruler falloff, like the dial's.
 */

import { useEffect, useRef } from "react";
import { useScrollReveal } from "@/components/reveal/Reveal";

const COLS = 61;
const GAP = 12;
const LEN = 8;
const REACH = 120; // px of cursor influence
const WIDTH = (COLS - 1) * GAP;

export function TickRule() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>(0.5);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = Array.from(svg.querySelectorAll("line"));
    let raf = 0;
    let target: number | null = null;

    const paint = () => {
      raf = 0;
      const box = svg.getBoundingClientRect();
      const scale = box.width / WIDTH;
      lines.forEach((el) => {
        if (target === null) {
          el.style.transform = "";
          el.style.opacity = "";
          return;
        }
        const dx = target - box.left - Number(el.dataset.x) * scale;
        const k = Math.max(0, 1 - Math.abs(dx) / REACH);
        el.style.transform = `rotate(${-Math.sign(dx) * 40 * k}deg) scaleY(${1 + k * 1.2})`;
        el.style.opacity = String(0.6 + k * 0.4);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const move = (e: PointerEvent) => {
      target = e.clientX;
      schedule();
    };
    const leave = () => {
      target = null;
      schedule();
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerleave", leave);
    return () => {
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="tick-rule-wrap" role="separator">
      <svg
        ref={svgRef}
        className="tick-rule"
        data-draw={revealed ? "" : undefined}
        width="100%"
        height={LEN * 3}
        viewBox={`0 ${-LEN} ${WIDTH} ${LEN * 3}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {Array.from({ length: COLS }, (_, i) => (
          <line
            key={i}
            x1={i * GAP}
            x2={i * GAP}
            y1={0}
            y2={LEN}
            data-x={i * GAP}
            className={i % 5 === 0 ? "is-major" : undefined}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}
