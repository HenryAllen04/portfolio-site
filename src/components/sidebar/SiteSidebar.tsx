"use client";

/**
 * Purpose: Overlay navigation dial. The animated toggle (from
 * Vultur-ai/ontology) slides the sidebar over the page — same background
 * as the page, no darkening. Clicking the page (outside the sidebar)
 * dismisses it; navigating between pieces keeps it open.
 *
 * The dial: Me / Writings / Information Diet with tick marks between
 * them. Scroll progress on the one-page home moves the orange indicator
 * through the ticks, so it travels rather than hopping section to section.
 */

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SidebarToggleIcon } from "./SidebarToggleIcon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  SidebarSection,
  useSidebarEffects,
} from "./Sidebar";

const SECTIONS = [
  { id: "me", label: "Me" },
  { id: "writings", label: "Writings" },
  { id: "information-diet", label: "Information Diet" },
] as const;

// Ticks between each pair of labelled stops
const TICKS_PER_GAP = 4;
const STOPS_PER_GAP = TICKS_PER_GAP + 1;

function EffectsToggle() {
  const { enabled, toggle } = useSidebarEffects();
  return (
    <button type="button" onClick={toggle} className="sb-effects-toggle">
      <span className={enabled ? "sb-effects-dot is-on" : "sb-effects-dot"} />
      Effects {enabled ? "on" : "off"}
    </button>
  );
}

export default function SiteSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Fractional scroll position across sections: 0 = Me … 2 = Information Diet
  const [progress, setProgress] = useState(0);

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
      const line = window.innerHeight * 0.35;
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
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const activeStop = pathname.startsWith("/writing")
    ? 1 * STOPS_PER_GAP
    : pathname === "/"
      ? Math.round(progress * STOPS_PER_GAP)
      : -1;

  const totalStops = (SECTIONS.length - 1) * STOPS_PER_GAP + 1;

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
              className={
                "sb-rail-tick" +
                (s % STOPS_PER_GAP === 0 ? " is-stop" : "") +
                (s === activeStop ? " is-active" : "")
              }
            />
          ))}
        </button>
      )}

      <Sidebar defaultWidth={260} className={open ? "is-open" : undefined}>
        <SidebarContent>
          <SidebarSection>
            {SECTIONS.map(({ id, label }, i) => (
              <Fragment key={id}>
                <SidebarItem
                  href={`/#${id}`}
                  label={label}
                  isActive={activeStop === i * STOPS_PER_GAP}
                />
                {i < SECTIONS.length - 1 &&
                  Array.from({ length: TICKS_PER_GAP }).map((_, t) => {
                    const stop = i * STOPS_PER_GAP + t + 1;
                    return (
                      <div className="sb-tick" key={t} aria-hidden="true">
                        {activeStop === stop && (
                          <motion.span
                            layoutId="sb-active-bar"
                            className="sb-active-bar"
                            animate={{ width: 16 }}
                            transition={{
                              type: "spring",
                              stiffness: 800,
                              damping: 40,
                            }}
                          />
                        )}
                        <span className="sb-tick-dash" />
                      </div>
                    );
                  })}
              </Fragment>
            ))}
          </SidebarSection>
        </SidebarContent>

        <SidebarFooter>
          <EffectsToggle />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
