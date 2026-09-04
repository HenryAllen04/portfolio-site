"use client";

/**
 * Sidebar — ported from unlumen ui sidebar-001 (https://ui.unlumen.com/components/sidebar-001)
 * Restyled with the site's plain-CSS design system (see globals.css "Sidebar" section).
 * Spring hover highlight, animated active bar, per-item dash pattern, collapsible
 * groups, and a drag-to-resize handle.
 */

import * as React from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";

const MotionChevron = motion.create(ChevronRight);

const EFFECTS_KEY = "sidebar-effects";

const EffectsContext = createContext<{ enabled: boolean; toggle: () => void }>({
  enabled: true,
  toggle: () => {},
});

function EffectsProvider({
  children,
  defaultEnabled = true,
}: {
  children: React.ReactNode;
  defaultEnabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return defaultEnabled;
    const stored = localStorage.getItem(EFFECTS_KEY);
    return stored !== null ? stored === "true" : defaultEnabled;
  });

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(EFFECTS_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return (
    <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>
  );
}

export function useSidebarEffects() {
  return useContext(EffectsContext);
}

/* ─── Hover context ─────────────────────────────────────────────────────── */

interface HoverRect {
  top: number;
  height: number;
  left: number;
}

const HoverContext = createContext<{
  hovered: string | null;
  hoverRect: HoverRect | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setHovered: (id: string | null, rect?: HoverRect | null) => void;
}>({
  hovered: null,
  hoverRect: null,
  containerRef: { current: null },
  setHovered: () => {},
});

function HoverProvider({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHoveredId] = useState<string | null>(null);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);

  const setHovered = useCallback(
    (id: string | null, rect?: HoverRect | null) => {
      setHoveredId(id);
      setHoverRect(rect ?? null);
    },
    [],
  );

  const value = useMemo(
    () => ({ hovered, hoverRect, containerRef, setHovered }),
    [hovered, hoverRect, containerRef, setHovered],
  );

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

/* ─── HoverHighlight ────────────────────────────────────────────────────── */

function HoverHighlight() {
  const { hoverRect, hovered } = useContext(HoverContext);
  const { enabled } = useContext(EffectsContext);

  return (
    <AnimatePresence>
      {enabled && hovered && hoverRect && (
        <motion.div
          key="sb-hover-bg"
          className="sb-hover-bg"
          style={{ right: 0 }}
          initial={false}
          animate={{
            top: hoverRect.top + 2,
            height: hoverRect.height - 4,
            left: hoverRect.left,
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </AnimatePresence>
  );
}

/* ─── SidebarItem ───────────────────────────────────────────────────────── */

export interface SidebarItemProps {
  href: string;
  label: React.ReactNode;
  isActive?: boolean;
  isNew?: boolean;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const SidebarItem = memo(function SidebarItem({
  href,
  label,
  isActive = false,
  isNew,
  external,
  onClick,
}: SidebarItemProps) {
  const { hovered, setHovered, containerRef } = useContext(HoverContext);
  const isHovered = hovered === href;
  const itemRef = useScrollToActive(isActive);

  const opacity = isActive
    ? 1
    : hovered !== null
      ? isHovered
        ? 1
        : 0.3
      : 0.55;
  const x = isActive ? 8 : isHovered ? 6 : 0;

  const handleMouseEnter = () => {
    const el = itemRef.current;
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setHovered(href, {
        top: elRect.top - containerRect.top,
        height: elRect.height,
        left: 25,
      });
    } else {
      setHovered(href);
    }
  };

  const linkProps = {
    onClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: () => setHovered(null),
    className: "sb-item-link",
  };

  const content = (
    <>
      <span className="sb-item-label">{label}</span>
      {isNew && <span className="sb-item-dot" />}
    </>
  );

  return (
    <div className="sb-item">
      {isActive && (
        <motion.span
          layoutId="sb-active-bar"
          className="sb-active-bar"
          animate={{ width: 23 }}
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
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

/* ─── SidebarSeparator ──────────────────────────────────────────────────── */

export function SidebarSeparator({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="sb-separator">{children}</div>;
}

/* ─── SidebarGroup ──────────────────────────────────────────────────────── */

export interface SidebarGroupProps {
  label: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export function SidebarGroup({
  label,
  children,
  defaultOpen = false,
  icon,
}: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const { setHovered, containerRef } = useContext(HoverContext);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(defaultOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = buttonRef.current;
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setHovered(id, {
        top: elRect.top - containerRect.top,
        height: elRect.height,
        left: 0,
      });
    } else {
      setHovered(id);
    }
  }, [id, setHovered, containerRef]);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, [setHovered]);

  return (
    <div className="sb-group">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="sb-group-trigger"
      >
        {icon ? (
          <>
            <span className="sb-group-icon">{icon}</span>
            <span className="sb-group-label sb-group-label-grow">{label}</span>
            <MotionChevron
              size={14}
              strokeWidth={2.5}
              className="sb-group-chevron sb-group-chevron-end"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </>
        ) : (
          <>
            <MotionChevron
              size={11}
              strokeWidth={2.5}
              className="sb-group-chevron"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            <span className="sb-group-label">{label}</span>
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            style={{ overflow: "hidden" }}
          >
            <div className="sb-group-items">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SidebarSection ────────────────────────────────────────────────────── */

export function SidebarSection({
  label,
  children,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="sb-section">
      {label && <SidebarSeparator>{label}</SidebarSeparator>}
      {children}
    </div>
  );
}

/* ─── SidebarContent ────────────────────────────────────────────────────── */

export function SidebarContent({ children }: { children: React.ReactNode }) {
  const containerRef = useContext(HoverContext).containerRef;

  return (
    <div className="sb-content" data-scroll-viewport>
      <div ref={containerRef} className="sb-content-inner">
        <HoverHighlight />
        {children}
      </div>
    </div>
  );
}

/* ─── Sidebar (with resize) ─────────────────────────────────────────────── */

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  defaultEffectsEnabled?: boolean;
  /** Initial width in px. Default: 240 */
  defaultWidth?: number;
  /** Min resize width in px. Default: 160 */
  minWidth?: number;
  /** Max resize width in px. Default: 400 */
  maxWidth?: number;
}

export function Sidebar({
  children,
  className,
  defaultEffectsEnabled = true,
  defaultWidth = 240,
  minWidth = 160,
  maxWidth = 400,
}: SidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [width],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const next = Math.min(
        maxWidth,
        Math.max(minWidth, startW.current + e.clientX - startX.current),
      );
      setWidth(next);
    },
    [minWidth, maxWidth],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <EffectsProvider defaultEnabled={defaultEffectsEnabled}>
      <HoverProvider containerRef={containerRef}>
        <aside
          className={className ? `sb-root ${className}` : "sb-root"}
          style={{ "--sb-width": `${width}px` } as React.CSSProperties}
        >
          {children}

          <div
            className="sb-resize-handle"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="sb-resize-line" />
          </div>
        </aside>
      </HoverProvider>
    </EffectsProvider>
  );
}

/* ─── SidebarHeader / SidebarFooter ─────────────────────────────────────── */

export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return <div className="sb-header">{children}</div>;
}

export function SidebarFooter({ children }: { children?: React.ReactNode }) {
  return <div className="sb-footer">{children}</div>;
}
