"use client";

/**
 * Sidebar — ported from unlumen ui sidebar-001 (https://ui.unlumen.com/components/sidebar-001)
 * Restyled with the site's plain-CSS design system (see globals.css "Sidebar" section).
 * Trimmed to what the site uses: hover dimming, animated active bar and
 * per-item dash pattern. Collapsible groups, the hover pill, the effects
 * toggle and drag-to-resize were dead here and have been removed.
 */

import * as React from "react";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";

/* ─── Hover context ─────────────────────────────────────────────────────── */

const HoverContext = createContext<{
  hovered: string | null;
  setHovered: (id: string | null) => void;
}>({
  hovered: null,
  setHovered: () => {},
});

function HoverProvider({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const value = useMemo(() => ({ hovered, setHovered }), [hovered]);
  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

/* ─── Scroll to active ──────────────────────────────────────────────────── */

function useScrollToActive(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolled = useRef(false);

  useEffect(() => {
    if (!active || scrolled.current || !ref.current) return;
    scrolled.current = true;
    const el = ref.current;
    const schedule =
      typeof requestIdleCallback !== "undefined"
        ? (cb: () => void) => requestIdleCallback(cb)
        : (cb: () => void) => setTimeout(cb, 100);
    const cancel =
      typeof cancelIdleCallback !== "undefined"
        ? cancelIdleCallback
        : clearTimeout;
    const id = schedule(() => {
      const viewport = el.closest("[data-scroll-viewport]");
      if (!(viewport instanceof HTMLElement)) return;
      const vpRect = viewport.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset =
        elRect.top - vpRect.top - vpRect.height / 2 + elRect.height / 2;
      if (Math.abs(offset) > 40)
        viewport.scrollBy({ top: offset, behavior: "smooth" });
    });
    return () => cancel(id as number);
  }, [active]);

  useEffect(() => {
    if (!active) scrolled.current = false;
  }, [active]);

  return ref;
}

/* ─── SidebarItem ───────────────────────────────────────────────────────── */

export interface SidebarItemProps {
  href: string;
  label: React.ReactNode;
  isActive?: boolean;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const SidebarItem = memo(function SidebarItem({
  href,
  label,
  isActive = false,
  external,
  onClick,
}: SidebarItemProps) {
  const { hovered, setHovered } = useContext(HoverContext);
  const isHovered = hovered === href;
  const itemRef = useScrollToActive(isActive);

  // Resting labels stay above 4.5:1 on white; dimmed siblings are a
  // transient hover state so they may sit lower
  const opacity = isActive
    ? 1
    : hovered !== null
      ? isHovered
        ? 1
        : 0.45
      : 0.7;
  // Active shift clears the 30px indicator bar with room to breathe
  const x = isActive ? 18 : isHovered ? 6 : 0;

  const linkProps = {
    onClick,
    onMouseEnter: () => setHovered(href),
    onMouseLeave: () => setHovered(null),
    className: "sb-item-link",
  };

  const content = <span className="sb-item-label">{label}</span>;

  return (
    <div className="sb-item">
      {isActive && (
        <motion.span
          layoutId="sb-active-bar"
          className="sb-active-bar"
          animate={{ width: 30 }}
          transition={{ type: "spring", stiffness: 1100, damping: 50 }}
        />
      )}

      <motion.span
        className="sb-dash sb-dash-mid"
        animate={{ width: isActive ? 0 : isHovered ? 26 : 18 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
      <span className="sb-dash sb-dash-quarter" />
      <span className="sb-dash sb-dash-top" />
      <span className="sb-dash sb-dash-threequarter" />

      <motion.div
        ref={itemRef}
        animate={{ opacity, x }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{ transformOrigin: "left center" }}
      >
        {external ? (
          <a href={href} rel="noopener" target="_blank" {...linkProps}>
            {content}
          </a>
        ) : (
          <Link href={href} {...linkProps}>
            {content}
          </Link>
        )}
      </motion.div>
    </div>
  );
});

/* ─── SidebarSection ────────────────────────────────────────────────────── */

export function SidebarSection({ children }: { children: React.ReactNode }) {
  return <div className="sb-section">{children}</div>;
}

/* ─── SidebarContent ────────────────────────────────────────────────────── */

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="sb-content" data-scroll-viewport>
      <div className="sb-content-inner">{children}</div>
    </div>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────────────────── */

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  /** Panel width in px. Default: 240 */
  width?: number;
}

export function Sidebar({ children, className, width = 240 }: SidebarProps) {
  return (
    // reducedMotion="user" makes every spring in here honour the OS
    // setting; the global CSS rule only reaches CSS transitions.
    <MotionConfig reducedMotion="user">
      <HoverProvider>
        <aside
          className={className ? `sb-root ${className}` : "sb-root"}
          style={{ "--sb-width": `${width}px` } as React.CSSProperties}
        >
          {children}
        </aside>
      </HoverProvider>
    </MotionConfig>
  );
}
