"use client";

/**
 * Purpose: Overlay navigation dial. The animated toggle (from
 * Vultur-ai/ontology) slides the sidebar over the page — same background
 * as the page, no darkening. Clicking the page (outside the sidebar)
 * dismisses it; navigating between pieces keeps it open.
 *
 * The dial has FIXED geometry: every gap always shows its full run of
 * ticks (a few more than needed, by design), so nothing ever pushes the
 * other pieces around. Clicking a piece reveals its children ON the
 * existing ticks below it — labels load in with a snappy staggered
 * ease-out; collapsing just fades them off the ticks. Scroll progress
 * moves the orange indicator through the same ticks.
 */

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SidebarToggleIcon } from "./SidebarToggleIcon";
import { writings } from "@/lib/writings";
import { dietSections } from "@/lib/diet";
import {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarSection,
} from "./Sidebar";

const SECTIONS = [
  { id: "me", label: "Me" },
  { id: "writings", label: "Writings" },
  { id: "information-diet", label: "Information Diet" },
] as const;

// Ticks in the run below each labelled stop (more than we need — the
// spare ones are part of the instrument). The last section gets a
// trailing decorative run so its children have ticks to land on too.
const TICKS_PER_GAP = 5;
const STOPS_PER_GAP = TICKS_PER_GAP + 1;

// Viewport-y where a section is considered "arrived". Used as BOTH the
// scroll landing offset and the scrollspy line, so clicking a piece
// always parks its top exactly on the line → its label lights (not the
// first tick below it).
const ARRIVE_LINE = 96;

/** Scroll to a target y. Native smooth (compositor-driven, so it isn't
 *  throttled the way a rAF tween is); the CSS scroll-behavior that used
 *  to break programmatic scrollTo has been removed. Instant under
 *  prefers-reduced-motion. */
function smoothScrollTo(top: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = Math.max(0, Math.min(top, max));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
}

interface SubItem {
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/** One fixed-height tick row. `child` (when the piece above is expanded)
 *  renders as a label on this tick — absolutely positioned, so revealing
 *  or hiding it never moves the dial. */
function TickRow({
  stop,
  activeStop,
  child,
  index,
}: {
  /** Scroll stop this tick represents; -1 for trailing decorative ticks. */
  stop: number;
  activeStop: number;
  child?: SubItem;
  index: number;
}) {
  const d = stop < 0 ? 99 : Math.abs(stop - activeStop);
  const dashClass =
    "sb-tick-dash" + (d === 0 ? " is-active" : d === 1 ? " is-near" : "");

  return (
    <div
      className={
        "sb-tick" +
        (child ? " has-label" : "") +
        (child?.isActive ? " has-active-label" : "")
      }
    >
      {stop >= 0 && activeStop === stop && (
        <motion.span
          layoutId="sb-active-bar"
          className="sb-active-bar"
          animate={{ width: 20 }}
          transition={{ type: "spring", stiffness: 1100, damping: 50 }}
        />
      )}
      <span className={dashClass} aria-hidden="true" />
      {child && (
        <div
          className="sb-tick-label"
          style={{ "--i": index } as React.CSSProperties}
        >
          <Link
            href={child.href}
            onClick={child.onClick}
            className={child.isActive ? "sb-sublink is-active" : "sb-sublink"}
          >
            {child.label}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SiteSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Integer dial stop — updated ONLY when the stop actually changes, so
  // scrolling never re-renders the sidebar needlessly (no jitter)
  const [scrollStop, setScrollStop] = useState(0);
  // Drill-down is click-driven, never scroll-driven: scrolling moves the
  // indicator, only a click changes what the ticks display
  const [expanded, setExpanded] = useState<number | null>(null);
  // The sub-thing last clicked into — carries the orange; the scroll
  // indicator itself is black
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  // Keyboard: S toggles, Escape closes (as in unlumen sidebar-002)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;
      if (e.repeat) return;
      if (e.key === "s" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const onScroll = () => {
      const line = ARRIVE_LINE;
      const tops = SECTIONS.map(
        ({ id }) =>
          document.getElementById(id)?.getBoundingClientRect().top ?? Infinity,
      );
      let p = 0;
      for (let i = 0; i < tops.length - 1; i++) {
        if (line >= tops[i + 1]) {
          p = i + 1;
        } else if (line > tops[i]) {
          p = i + (line - tops[i]) / (tops[i + 1] - tops[i]);
          break;
        }
      }
      // Labels get a capture zone: landing on a section (which puts the
      // line a hair past its top) lights the label, not the first tick
      const sec = Math.min(Math.floor(p), SECTIONS.length - 1);
      const frac = p - sec;
      let stop: number;
      if (frac < 0.1) {
        stop = sec * STOPS_PER_GAP;
      } else if (frac > 0.92) {
        stop = (sec + 1) * STOPS_PER_GAP;
      } else {
        stop =
          sec * STOPS_PER_GAP +
          1 +
          Math.min(
            TICKS_PER_GAP - 1,
            Math.floor(((frac - 0.1) / 0.82) * TICKS_PER_GAP),
          );
      }
      setScrollStop((prev) => (prev === stop ? prev : stop));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Arriving on an essay page unfolds Writings (a navigation, not a scroll)
  useEffect(() => {
    if (pathname.startsWith("/writing")) setExpanded(1);
  }, [pathname]);

  // Dial clicks scroll to the section. We compute the target and use
  // window.scrollTo — element.scrollIntoView() is a no-op in this app
  // (some combination of the fixed overlay + Next patching), whereas
  // scrollTo works. -88px keeps the heading clear of the top edge.
  const goTo = useCallback(
    (id: string): React.MouseEventHandler<HTMLAnchorElement> =>
      (e) => {
        if (pathname !== "/") return; // real navigation to /#id
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        smoothScrollTo(
          window.scrollY + el.getBoundingClientRect().top - ARRIVE_LINE,
        );
      },
    [pathname],
  );

  const onEssayPage = pathname.startsWith("/writing");
  const activeStop = onEssayPage
    ? 1 * STOPS_PER_GAP
    : pathname === "/"
      ? scrollStop
      : -1;

  const totalStops = (SECTIONS.length - 1) * STOPS_PER_GAP + 1;

  /** Distance-based emphasis so the rail reads like a ruler. */
  const railTickClass = (stop: number, base: string) => {
    const d = Math.abs(stop - activeStop);
    return base + (d === 0 ? " is-active" : d === 1 ? " is-near" : "");
  };

  const subItemsFor = (main: number): SubItem[] => {
    if (main === 1) {
      return [...writings]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((w) => ({
          label: w.title,
          href: `/writing/${w.slug}`,
          isActive: pathname === `/writing/${w.slug}`,
        }));
    }
    if (main === 2) {
      return dietSections.map((s) => ({
        label: s.title,
        href: `/#${s.id}`,
        isActive: selectedSub === `/#${s.id}`,
        onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
          goTo(s.id)(e);
          setSelectedSub(`/#${s.id}`);
        },
      }));
    }
    return [];
  };

  return (
    <>
      <button
        type="button"
        className="sb-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((v) => !v)}
      >
        <SidebarToggleIcon isOpen={open} className="sb-toggle-icon" />
      </button>

      {open && (
        <div
          className="sb-backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Collapsed dial: a whisper of the tick rail on the page edge so
          scroll position stays visible without opening the sidebar */}
      {pathname === "/" && (
        <button
          type="button"
          className={open ? "sb-rail is-hidden" : "sb-rail"}
          aria-label="Open navigation"
          tabIndex={open ? -1 : 0}
          onClick={() => setOpen(true)}
        >
          {Array.from({ length: totalStops }).map((_, s) => (
            <span
              key={s}
              className={railTickClass(
                s,
                "sb-rail-tick" + (s % STOPS_PER_GAP === 0 ? " is-stop" : ""),
              )}
            />
          ))}
        </button>
      )}

      <Sidebar
        width={260}
        className={
          (open ? "is-open" : "") +
          // A sub-thing is the active one — on the home page that's a
          // clicked diet section; on an essay page it's the essay itself
          (selectedSub || onEssayPage ? " sub-selected" : "")
        }
      >
        <SidebarContent>
          <SidebarSection>
            {SECTIONS.map(({ id, label }, i) => {
              const subItems = subItemsFor(i);
              const isLast = i === SECTIONS.length - 1;
              return (
                <Fragment key={id}>
                  <SidebarItem
                    href={`/#${id}`}
                    label={label}
                    isActive={activeStop === i * STOPS_PER_GAP}
                    onClick={(e) => {
                      goTo(id)(e);
                      setExpanded(subItems.length > 0 ? i : null);
                      // Clicking a main piece hands the orange back
                      setSelectedSub(null);
                    }}
                  />
                  {/* The tick run below this piece — always rendered, so
                      expanding never moves anything. Trailing run after
                      the last piece is decorative (stop -1). */}
                  {Array.from({ length: TICKS_PER_GAP }).map((_, t) => (
                    <TickRow
                      key={t}
                      stop={isLast ? -1 : i * STOPS_PER_GAP + t + 1}
                      activeStop={activeStop}
                      child={expanded === i ? subItems[t] : undefined}
                      index={t}
                    />
                  ))}
                </Fragment>
              );
            })}
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
