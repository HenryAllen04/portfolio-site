"use client";

/**
 * Section divider made of ticks — the nav dial's tick vocabulary laid flat.
 * Draws in left → right when scrolled into view (through the Reveal gate,
 * so it waits for the intro and skips under reduced motion).
 *
 * Hover choreography (one shared DialKit timeline, tuned in the dock):
 *
 *    0ms   cursor enters the near band → ANTICIPATE: ticks lean *away*
 *   60ms   cursor crosses onto the rule → SWING: spring toward the cursor
 *  610ms   cursor leaves → RELEASE: settle back upright, overshooting
 *
 * The lean is a single scalar sampled from whichever clip the playhead is
 * in; each tick scales it by a ruler falloff from the cursor's x, so the
 * choreography is temporal and the shape stays spatial. Playback is state
 * driven: the playhead parks at the end of a clip until the cursor moves on.
 *
 * The "Tick rule" panel's `beats` toggles hide a clip from the dock and
 * switch that beat off, so each can be judged against its absence. `near`
 * is the approach band, `hold` the exit band: the swing survives until the
 * cursor is `hold` px past the rule, then releases.
 */

import { useEffect, useRef } from "react";
import { useDialKit, useDialTimeline, type TimelineConfig } from "dialkit";
import { useScrollReveal } from "@/components/reveal/Reveal";

const COLS = 61;
const GAP = 12;
const LEN = 8;
const WIDTH = (COLS - 1) * GAP;

type Zone = "far" | "near" | "over";

// All rules share one timeline (one dock row); only the rule the cursor last
// touched reads from it, so the others stay upright while it plays.
let owner: object | null = null;

const CLIPS = {
  anticipate: {
    at: 0,
    duration: 0.06,
    from: { lean: 0 },
    to: { lean: -12 },
    transition: { type: "easing", duration: 0.06, ease: [0.23, 1, 0.32, 1] },
  },
  swing: {
    at: 0.06,
    duration: 0.55,
    from: { lean: -10 },
    to: { lean: 40 },
    transition: { type: "spring", bounce: 0.4 },
  },
  release: {
    at: 0.61,
    duration: 0.45,
    from: { lean: 40 },
    to: { lean: 0 },
    // A spring so the ticks pass through upright and damp back — an easing
    // curve can only decelerate into zero and reads as stopping, not settling.
    transition: { type: "spring", bounce: 0.3 },
  },
} satisfies TimelineConfig;

type Clips = typeof CLIPS;

// Ripple: per-tick retiming of the release so the barely-bent edge ticks
// rest first and the ones under the cursor last.
const easeOut = (p: number) => 1 - (1 - p) ** 3;

export function TickRule() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>(0.5);
  const svgRef = useRef<SVGSVGElement>(null);

  const dials = useDialKit("Tick rule", {
    reach: [120, 40, 320, 1], // px of cursor influence along the rule
    near: [56, 0, 200, 1], // px above/below the rule that count as "nearby"
    hold: [40, 0, 240, 1], // px past the rule the swing survives before releasing
    stretch: [1.2, 0, 3, 0.05], // extra scaleY at the cursor
    ripple: [0, 0, 1, 0.05], // release stagger, edge → cursor (0 = all at once)
    beats: {
      anticipate: true,
      release: true,
    },
  }, { id: "tick-rule-dials" });

  // Hidden beats leave the config, so the dock hides their row too.
  const config: Partial<Clips> = {};
  if (dials.beats.anticipate) config.anticipate = CLIPS.anticipate;
  config.swing = CLIPS.swing;
  if (dials.beats.release) config.release = CLIPS.release;

  // TODO(production): DialKit's clip.current values are the scrubbable authoring preview.
  // Replace them with equivalent real Motion animations using the tuned timeline
  // timings and transitions, then remove useDialTimeline and <DialTimeline />.
  const tl = useDialTimeline("Tick rule", config as Clips, {
    id: "tick-rule",
    autoplay: false,
  });
  // Clip values are undefined when a beat is toggled off.
  const anticipate = tl.anticipate as typeof tl.anticipate | undefined;
  const release = tl.release as typeof tl.release | undefined;

  // Everything the per-frame painter needs, kept out of React state.
  const state = useRef({
    zone: "far" as Zone,
    x: null as number | null, // last cursor x (client px)
    y: null as number | null,
    armed: true, // anticipation re-arms only once the cursor has fully left the band
    lean: 0, // last painted lean, in degrees
    leaveLean: 0, // lean at the moment the cursor left, for the ripple
    offset: 0, // continuity offset applied when a clip is entered mid-motion
    silent: false, // release beat off: hold upright instead of sampling
    raf: 0,
  });

  // Latest sampled values from the timeline / panel, readable inside rAF.
  const live = useRef({ tl, anticipate, release, dials });
  live.current = { tl, anticipate, release, dials };
  const schedulePaint = useRef<() => void>(() => {});

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = Array.from(svg.querySelectorAll("line"));
    const s = state.current;

    // The clip under the playhead, plus the decaying continuity offset.
    const sample = () => {
      const { tl, anticipate, release } = live.current;
      if (s.silent) return { lean: 0, releasing: null };
      const clip = release?.started
        ? release
        : tl.swing.started
          ? tl.swing
          : anticipate?.started
            ? anticipate
            : null;
      if (!clip) return { lean: 0, releasing: null };
      const progress = Math.min(1, clip.progress);
      // A spring may not have fully damped by the clip's end; land exactly.
      const lean = progress >= 1 ? clip.to.lean : clip.current.lean + s.offset * (1 - progress);
      return { lean, releasing: clip === release ? progress : null };
    };

    const paint = () => {
      s.raf = 0;
      const { dials } = live.current;
      const { lean, releasing } = sample();
      s.lean = lean;
      const box = svg.getBoundingClientRect();
      const x = s.x ?? box.left + box.width / 2;
      const scale = box.width / WIDTH;
      const idle = s.zone === "far" && (owner !== s || Math.abs(lean) < 0.05);
      lines.forEach((el) => {
        if (idle) {
          el.style.transform = "";
          el.style.opacity = "";
          return;
        }
        const dx = x - box.left - Number(el.dataset.x) * scale;
        const k = Math.max(0, 1 - Math.abs(dx) / dials.reach);
        let tick = lean;
        if (releasing !== null && dials.ripple > 0) {
          // Delay this tick's release by up to 80% of the clip, by proximity.
          // While rippling, the dock's release curve is replaced by a plain
          // ease-out — per-tick springs are the production answer.
          const delay = dials.ripple * k * 0.8;
          const p = Math.max(0, (releasing - delay) / (1 - delay));
          tick = s.leaveLean * (1 - easeOut(p));
        }
        const grip = Math.min(1, Math.abs(tick) / 40); // stretch only once the swing lands
        el.style.transform = `rotate(${-Math.sign(dx) * tick * k}deg) scaleY(${1 + k * grip * dials.stretch})`;
        el.style.opacity = String(0.6 + k * grip * 0.4);
      });
    };
    const schedule = () => {
      if (!s.raf) s.raf = requestAnimationFrame(paint);
    };
    schedulePaint.current = schedule;

    // Jump the playhead to a clip's start, carrying the current lean across
    // so a mid-motion zone change never snaps.
    const enterClip = (at: number, from: number) => {
      const { tl } = live.current;
      owner = s;
      s.silent = false;
      s.offset = s.lean - from;
      tl.seek(at);
      tl.play();
    };

    const setZone = (zone: Zone) => {
      if (zone === s.zone) return;
      const { tl, anticipate, release } = live.current;
      s.zone = zone;
      if (zone === "near" && anticipate) enterClip(anticipate.at, anticipate.from.lean);
      if (zone === "over") enterClip(tl.swing.at, tl.swing.from.lean);
      if (zone === "far") {
        s.leaveLean = s.lean;
        if (release) enterClip(release.at, release.from.lean);
        else {
          tl.pause();
          s.silent = true;
        }
      }
      schedule();
    };

    // Which zone a client point is in, ignoring arming. While the swing is
    // on, the rule's edge extends by `hold` so a small drift off it doesn't
    // release — the cursor has to get properly away.
    const classify = (x: number, y: number): Zone => {
      const { dials } = live.current;
      const box = svg.getBoundingClientRect();
      if (x < box.left || x > box.right) return "far";
      const dy = y < box.top ? box.top - y : y - box.bottom;
      const edge = s.zone === "over" ? dials.hold : 0;
      return dy <= edge ? "over" : dy <= dials.near ? "near" : "far";
    };

    const move = (e: PointerEvent) => {
      const { anticipate } = live.current;
      s.x = e.clientX;
      s.y = e.clientY;
      const raw = classify(e.clientX, e.clientY);
      // Leaving the rule drops you into the band; that must read as a
      // release, not a second wind-up. Anticipation only re-arms once the
      // cursor has been fully outside the band.
      if (raw === "far") s.armed = true;
      if (raw === "over") s.armed = false;
      const zone: Zone = raw === "near" && (!s.armed || !anticipate) ? "far" : raw;
      setZone(zone);
      if (zone !== "far") schedule();
    };

    // Scrolling moves the rule under a stationary cursor. Release if it
    // slid away; never start a beat from a scroll, and don't let the band
    // it lands in re-arm anticipation.
    const scroll = () => {
      if (s.x === null || s.y === null) return;
      const raw = classify(s.x, s.y);
      s.armed = false;
      if (raw === "far" && s.zone !== "far") setZone("far");
    };
    const leave = () => setZone("far");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(s.raf);
    };
  }, []);

  // Park the playhead at the end of the zone's clip so the sequence waits for
  // the cursor rather than running on; repaint whenever the timeline moves.
  useEffect(() => {
    const s = state.current;
    if (tl.playing) {
      const swingEnd = tl.swing.at + tl.swing.duration;
      const end = s.zone === "near" ? tl.swing.at : s.zone === "over" ? swingEnd : tl.duration;
      if (tl.time >= end) {
        tl.pause();
        tl.seek(end);
        s.offset = 0; // the clip has landed; nothing left to carry
      }
    }
    schedulePaint.current();
  }, [tl]);

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
