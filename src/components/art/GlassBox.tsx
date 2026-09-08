"use client";

/**
 * The site mark: a wireframe glass box with a smaller box stored inside —
 * the "storage unit designed to be a glass box" line from the bio, drawn.
 * Hairline edges draw in on mount (skipped on revisit / reduced motion, via
 * the Intro gate); yaw follows scroll and pointer so it never sits still
 * while you read, but never moves on its own either.
 */

import { useEffect, useRef } from "react";
import { useIntroSkipped } from "@/components/reveal/Reveal";

type V = [number, number, number];
const CUBE: V[] = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];
const INNER = 0.42; // the stored thing, relative to the outer box
const PITCH = -0.42; // fixed elevation, radians
const BASE_YAW = 0.62;

function project(v: V, yaw: number, s: number, c: number, oy = 0) {
  const [x0, y0, z0] = v;
  const x1 = x0 * Math.cos(yaw) - z0 * Math.sin(yaw);
  const z1 = x0 * Math.sin(yaw) + z0 * Math.cos(yaw);
  const y2 = y0 * Math.cos(PITCH) - z1 * Math.sin(PITCH);
  const z2 = y0 * Math.sin(PITCH) + z1 * Math.cos(PITCH);
  return { x: c + x1 * s, y: c + (y2 + oy) * s, z: z2 };
}

export function GlassBox({ size = 40, className }: { size?: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const skip = useIntroSkipped();
  const s = size * 0.28;
  const c = size / 2;

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const outer = Array.from(svg.querySelectorAll<SVGLineElement>("[data-outer]"));
    const inner = Array.from(svg.querySelectorAll<SVGLineElement>("[data-inner]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointer = 0;
    let raf = 0;

    const set = (el: SVGLineElement, a: { x: number; y: number }, b: { x: number; y: number }) => {
      el.setAttribute("x1", a.x.toFixed(2));
      el.setAttribute("y1", a.y.toFixed(2));
      el.setAttribute("x2", b.x.toFixed(2));
      el.setAttribute("y2", b.y.toFixed(2));
    };

    const paint = () => {
      raf = 0;
      const yaw = BASE_YAW + (reduce ? 0 : window.scrollY * 0.0025 + pointer * 0.35);
      const pts = CUBE.map((v) => project(v, yaw, s, c));
      outer.forEach((el, i) => {
        const [a, b] = EDGES[i];
        set(el, pts[a], pts[b]);
        el.setAttribute("class", (pts[a].z + pts[b].z) / 2 < 0 ? "glass-edge-back" : "glass-edge-front");
      });
      const ipts = CUBE.map((v) => project(v.map((n) => n * INNER) as V, yaw + 0.3, s, c, 1 - INNER));
      inner.forEach((el, i) => {
        const [a, b] = EDGES[i];
        set(el, ipts[a], ipts[b]);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const move = (e: PointerEvent) => {
      pointer = (e.clientX / window.innerWidth - 0.5) * 2;
      schedule();
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    if (!reduce) window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [s, c]);

  return (
    <svg
      ref={ref}
      className={className ? `glass-box ${className}` : "glass-box"}
      data-draw={skip ? undefined : ""}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      {EDGES.map((_, i) => (
        <line key={`o${i}`} data-outer="" pathLength={1} style={{ "--i": i } as React.CSSProperties} />
      ))}
      {EDGES.map((_, i) => (
        <line key={`i${i}`} data-inner="" className="glass-edge-inner" pathLength={1} style={{ "--i": i + 8 } as React.CSSProperties} />
      ))}
    </svg>
  );
}
