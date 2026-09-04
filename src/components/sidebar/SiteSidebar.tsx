"use client";

/**
 * Purpose: Overlay navigation dial. The animated toggle (from
 * Vultur-ai/ontology) slides the sidebar over the page — same background
 * as the page, no darkening. Clicking the page (outside the sidebar)
 * dismisses it; navigating between pieces keeps it open.
 *
 * The dial: Me / Writings / Information Diet with tick marks between
 * them. Scroll progress moves the orange indicator through the ticks.
 * The active piece unfolds its children (essays under Writings, sections
 * under Information Diet) — the drill-down.
 */

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
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

// Ticks between each pair of labelled stops
const TICKS_PER_GAP = 4;
const STOPS_PER_GAP = TICKS_PER_GAP + 1;

/** Children that unfold beneath the active dial stop — same dial
 *  language as the labelled pieces, mini scale: dash, hover extend +
 *  darken, orange bar when active, staggered entrance. */
function SubItems({
  items,
}: {
  items: { label: string; href: string; isActive?: boolean; onClick?: React.MouseEventHandler<HTMLAnchorElement> }[];
}) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
        style={{ overflow: "hidden" }}
      >
        <ul className="sb-subitems">
          {items.map((item, i) => (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
                delay: 0.1 + i * 0.07,
              }}
            >
              <Link
                href={item.href}
                onClick={item.onClick}
                className={
                  item.isActive ? "sb-subitem is-active" : "sb-subitem"
                }
              >
                <span className="sb-subitem-dash" aria-hidden="true" />
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}

export default function SiteSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Integer dial stop — updated ONLY when the stop actually changes, so
  // scrolling never re-renders the sidebar needlessly (no jitter)
  const [scrollStop, setScrollStop] = useState(0);
  // Drill-down is click-driven, never scroll-driven: scrolling moves the
  // indicator, only a click changes the sidebar's layout
  const [expanded, setExpanded] = useState<number | null>(null);

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
      // Just below where sections land after a dial click
      // (scroll-margin-top: 96px), so arriving at a section lights its
      // labelled stop exactly
      const line = 120;
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
      const stop = Math.round(p * STOPS_PER_GAP);
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

  // Hash links don't re-fire when the hash is unchanged — scroll manually
  // so a dial click always answers, then keep the URL in sync.
  const goTo = useCallback(
    (id: string): React.MouseEventHandler<HTMLAnchorElement> =>
      (e) => {
        if (pathname !== "/") return; // real navigation to /#id
        e.preventDefault();
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `/#${id}`);
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

  /** Distance-based emphasis so the dial reads like a ruler. */
  const tickClass = (stop: number, base: string) => {
    const d = Math.abs(stop - activeStop);
    return (
      base +
      (d === 0 ? " is-active" : d === 1 ? " is-near" : "")
    );
  };

  const subItemsFor = (main: number) => {
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
        onClick: goTo(s.id),
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
              className={tickClass(
                s,
                "sb-rail-tick" + (s % STOPS_PER_GAP === 0 ? " is-stop" : ""),
              )}
            />
          ))}
        </button>
      )}

      <Sidebar defaultWidth={260} className={open ? "is-open" : undefined}>
        <SidebarContent>
          <SidebarSection>
            {SECTIONS.map(({ id, label }, i) => {
              const subItems = subItemsFor(i);
              return (
                <Fragment key={id}>
                  <SidebarItem
                    href={`/#${id}`}
                    label={label}
                    isActive={activeStop === i * STOPS_PER_GAP}
                    onClick={(e) => {
                      goTo(id)(e);
                      setExpanded(subItems.length > 0 ? i : null);
                    }}
                  />
                  {expanded === i && subItems.length > 0 && (
                    <SubItems items={subItems} />
                  )}
                  {i < SECTIONS.length - 1 &&
                    Array.from({ length: TICKS_PER_GAP }).map((_, t) => {
                      const stop = i * STOPS_PER_GAP + t + 1;
                      return (
                        <div className="sb-tick" key={t} aria-hidden="true">
                          {activeStop === stop && (
                            <motion.span
                              layoutId="sb-active-bar"
                              className="sb-active-bar"
                              animate={{ width: 20 }}
                              transition={{
                                type: "spring",
                                stiffness: 1100,
                                damping: 50,
                              }}
                            />
                          )}
                          <span className={tickClass(stop, "sb-tick-dash")} />
                        </div>
                      );
                    })}
                </Fragment>
              );
            })}
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
