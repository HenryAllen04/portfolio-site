"use client";

/**
 * Age ruler — the mark after "22, English" (decided in /proto/line-icon,
 * 2026-11-16; see DESIGN.md).
 *
 * A strip of every month since BIRTHDAY slides under a fixed accent
 * hairline in the centre, like a slide-rule cursor: the month under the
 * hairline is the one being read. Ticks are uniform months — lived ones in
 * ink, future ones faint; milestones live only in the readout. The secret:
 * drag it like film (1px = 1 month, no easing) and it scrubs back through
 * the years; release and it eases home. A click without a drag opens ← →
 * year controls under the ruler; while they're open the arrow keys work
 * page-wide and the ruler stays where you leave it until they close
 * (Escape, click outside, or click the ruler again).
 *
 * The ends push back: scrub or step past now (or birth) and the strip
 * leans a month or two against the edge and settles. Dragged past now the
 * readout says "not yet"; the → step at now only leans and keeps its label.
 * Resistance, not a bounce.
 *
 * The page is prerendered, so the date is read on the client after mount;
 * until then the box is reserved at its final size (no layout shift).
 * Frames write the strip transform and readout text directly — no React
 * render per frame.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { BIRTHDAY, MILESTONES, NOW } from "@/lib/life";

const PX_PER_MONTH = 4;
const WIDTH = 49;
const HEIGHT = 12;
/** The fixed hairline sits on this x; the strip slides under it. */
const CENTER = 24.5;
const DRAG_THRESHOLD = 3; // px of movement before a press counts as a drag
/** Furthest the strip can lean past an end, in months. */
const LEAN = 3;
const NOT_YET = "not yet";

/**
 * Write the readout as "age ·" plus a label whose phrases never split:
 * a long milestone wraps between phrases first, and the wrapped line hangs
 * under the label, clear of the → arrow. Skips frames where nothing changed.
 */
function writeReadout(el: HTMLElement | null, text: string) {
  if (!el || el.dataset.text === text) return;
  el.dataset.text = text;
  const at = text.indexOf(" · ");
  const parts: Node[] = [];
  if (at > -1) {
    const age = document.createElement("span");
    age.className = "ruler-age";
    age.textContent = `${text.slice(0, at)} · `;
    parts.push(age);
  }
  const label = document.createElement("span");
  label.className = "ruler-label";
  const rest = text.slice(at > -1 ? at + 3 : 0);
  // Split into sentences if there are any ("rejected by the Army: |
  // ADHD"); otherwise at commas ("first company, | school on…")
  rest
    .split(/[.:] /.test(rest) ? /(?<=[.:]) / : /(?<=,) /)
    .forEach((phrase, i) => {
      if (i) label.append(" ");
      const span = document.createElement("span");
      span.className = "ruler-phrase";
      span.textContent = phrase;
      label.append(span);
    });
  parts.push(label);
  el.replaceChildren(...parts);
}

// Rubber band: any overshoot maps to a lean that never reaches LEAN
const rubber = (x: number) =>
  Math.sign(x) * LEAN * (1 - 1 / (1 + Math.abs(x) / LEAN));

type Age = { years: number; months: number };

function ageNow(now = new Date()): Age {
  const birth = new Date(`${BIRTHDAY}T00:00:00`);
  let years = now.getFullYear() - birth.getFullYear();
  const last = new Date(birth);
  last.setFullYear(birth.getFullYear() + years);
  if (last > now) {
    years -= 1;
    last.setFullYear(last.getFullYear() - 1);
  }
  const months =
    (now.getFullYear() - last.getFullYear()) * 12 +
    now.getMonth() -
    last.getMonth() -
    (now.getDate() < last.getDate() ? 1 : 0);
  return { years, months: Math.max(0, Math.min(11, months)) };
}

// The site's one curve, cubic-bezier(.2,.7,.2,1), approximated
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AgeRuler() {
  const [age, setAge] = useState<Age | null>(null);
  const [open, setOpen] = useState(false);

  const wrap = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLButtonElement>(null);
  const strip = useRef<SVGGElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLSpanElement>(null);
  const p = useRef(0); // months scrolled back from now, clamped
  const raw = useRef(0); // the same, unclamped (what drags and tweens move)
  const raf = useRef(0);
  const earlier = useRef<HTMLButtonElement>(null);
  const later = useRef<HTMLButtonElement>(null);
  const press = useRef<{ x: number; p: number; dragged: boolean } | null>(
    null,
  );
  const openRef = useRef(false);
  openRef.current = open;

  useEffect(() => setAge(ageNow()), []);

  // Months since birth today; scrolling back can reach the birth month.
  const nowMonth = age ? age.years * 12 + age.months : 0;
  const max = nowMonth;

  const label = useCallback(
    (months: number) => {
      if (!age || months < 0.5) return `now · ${NOW}`;
      const years = Math.max(0, Math.floor((nowMonth - months) / 12 + 1e-6));
      return MILESTONES[years] ? `${years} · ${MILESTONES[years]}` : `${years}`;
    },
    [age, nowMonth],
  );

  const draw = useCallback(
    (months: number, notYet = true) => {
      raw.current = months;
      p.current = Math.max(0, Math.min(max, months));
      const over = months - p.current;
      const shown = p.current + rubber(over);
      // Put month (now − shown) under the centre hairline
      const x = CENTER - 0.5 - (nowMonth - shown) * PX_PER_MONTH;
      strip.current?.setAttribute("transform", `translate(${x} 0)`);
      writeReadout(
        readout.current,
        notYet && over < -0.5 ? NOT_YET : label(p.current),
      );
      earlier.current?.classList.toggle("is-limit", p.current >= max);
      later.current?.classList.toggle("is-limit", p.current <= 0);
    },
    [label, max, nowMonth],
  );

  const setScrubbing = (on: boolean) =>
    wrap.current?.classList.toggle("is-scrubbing", on);

  const stop = () => cancelAnimationFrame(raf.current);

  const tween = useCallback(
    (to: number, ms: number, done?: () => void) => {
      stop();
      const from = raw.current;
      const dur = reducedMotion() ? 0 : ms;
      const t0 = performance.now();
      const step = (t: number) => {
        const k = dur === 0 ? 1 : Math.min(1, (t - t0) / dur);
        draw(from + (to - from) * easeOut(k));
        if (k < 1) raf.current = requestAnimationFrame(step);
        else done?.();
      };
      raf.current = requestAnimationFrame(step);
    },
    [draw],
  );

  const home = useCallback(
    (ms = 350) => tween(0, ms, () => setScrubbing(false)),
    [tween],
  );

  const announce = (text = label(p.current)) => {
    if (live.current) live.current.textContent = text;
  };

  /** At an end: lean against it and settle (no overshoot past rest). */
  const refuse = (dir: 1 | -1) => {
    stop();
    setScrubbing(true);
    const edge = p.current;
    const dur = reducedMotion() ? 0 : 320;
    const t0 = performance.now();
    // The label holds through the lean: at now it stays "now · …"
    const frame = (t: number) => {
      const k = dur === 0 ? 1 : Math.min(1, (t - t0) / dur);
      draw(edge + dir * LEAN * Math.sin(Math.PI * k), false);
      if (k < 1) raf.current = requestAnimationFrame(frame);
      else {
        draw(edge);
        announce();
        if (edge === 0 && !openRef.current) setScrubbing(false);
      }
    };
    raf.current = requestAnimationFrame(frame);
  };

  /** Step a whole year from now (whole-year offsets). */
  const step = (dir: 1 | -1) => {
    if ((dir === -1 && p.current <= 0) || (dir === 1 && p.current >= max))
      return refuse(dir);
    setScrubbing(true);
    const target = Math.round((p.current + dir * 12) / 12) * 12;
    tween(Math.max(0, Math.min(max, target)), 300, () => {
      announce();
      if (p.current === 0 && !openRef.current) setScrubbing(false);
    });
  };
  const stepRef = useRef(step);
  stepRef.current = step;

  const close = useCallback(() => {
    setOpen(false);
    home(300);
  }, [home]);

  // Draw the resting state once the date is known
  useEffect(() => {
    if (age) draw(0);
    return stop;
  }, [age, draw]);

  // While the controls are open: clicking outside closes them, and the
  // arrow keys work page-wide (some browsers, Safari especially, don't
  // focus a clicked button, so a focus-scoped handler would never fire).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        stepRef.current(e.key === "ArrowLeft" ? 1 : -1);
      } else if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Mark the arrow that would run off an end once the controls mount
  useEffect(() => {
    if (open) draw(raw.current);
  }, [open, draw]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!age) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    stop();
    press.current = { x: e.clientX, p: p.current, dragged: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = press.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (!s.dragged && Math.abs(dx) < DRAG_THRESHOLD) return;
    if (!s.dragged) setScrubbing(true);
    s.dragged = true;
    draw(s.p + dx); // drag right = further back; 1px = 1 month
  };

  const onPointerUp = () => {
    const s = press.current;
    press.current = null;
    if (!s) return;
    if (s.dragged) {
      // Open: stay where you left it (easing back off an end). Closed: home.
      if (!openRef.current) home();
      else if (raw.current !== p.current) tween(p.current, 250, announce);
      else announce();
    } else if (openRef.current) {
      close();
    } else {
      setOpen(true);
      setScrubbing(true);
    }
  };

  // Focus-scoped keys for the closed state; the open state's keys are
  // handled page-wide above, so skip here to avoid double steps.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (open) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      step(e.key === "ArrowLeft" ? 1 : -1);
    } else if (e.key === "Escape") {
      close();
    }
  };

  // Birth month through half a window of future, so the right half of
  // the ruler shows faint months still to come.
  const ticks = age ? nowMonth + Math.ceil(CENTER / PX_PER_MONTH) + 1 : 0;

  return (
    <span
      ref={wrap}
      className={open ? "ruler is-open" : "ruler"}
      onKeyDown={onKeyDown}
    >
      <button
        ref={mark}
        type="button"
        className="ruler-mark"
        aria-label={`Timeline, ${label(0)}`}
        aria-expanded={open}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          press.current = null;
          if (!openRef.current) home();
        }}
        // Keyboard activation (Enter/Space) arrives as a click with detail 0
        onClick={(e) => {
          if (e.detail === 0) (open ? close : () => setOpen(true))();
        }}
      >
        <svg
          className="ruler-svg"
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          aria-hidden="true"
        >
          <line x1="0" y1="11.5" x2={WIDTH} y2="11.5" className="ruler-axis" />
          <g ref={strip}>
            {Array.from({ length: ticks }, (_, m) => (
              <line
                key={m}
                x1={m * PX_PER_MONTH + 0.5}
                x2={m * PX_PER_MONTH + 0.5}
                y1="7"
                y2="11"
                className={m <= nowMonth ? "ruler-tick is-past" : "ruler-tick"}
              />
            ))}
          </g>
          {age && (
            <line
              x1={CENTER}
              x2={CENTER}
              y1="1"
              y2="11"
              className="ruler-now"
            />
          )}
        </svg>
      </button>

      {open && (
        <span className="ruler-controls">
          <button
            type="button"
            ref={earlier}
            className="ruler-step"
            aria-label="Earlier year"
            onClick={() => step(1)}
          >
            ←
          </button>
          <button
            type="button"
            ref={later}
            className="ruler-step"
            aria-label="Later year"
            onClick={() => step(-1)}
          >
            →
          </button>
        </span>
      )}

      <span className="ruler-readout" ref={readout} aria-hidden="true" />
      <span className="ruler-sr" ref={live} aria-live="polite" />
    </span>
  );
}
