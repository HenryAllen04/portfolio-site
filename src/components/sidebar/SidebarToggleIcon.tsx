"use client";

/**
 * Sidebar toggle icon — ported from Vultur-ai/ontology
 * (apps/site/src/components/unlumen-ui/sidebar-toggle-icon.tsx),
 * recoloured to this site's monochrome tokens.
 *
 * A little window: outer body (the panel) + a left column (the sidebar).
 * The COLUMN is always present; its WIDTH carries the state:
 *
 *   open   →  bold column                ┌─┬────┐
 *   closed →  slim rail (a hint)         ┌╎─────┐
 */

import { motion, useReducedMotion } from "motion/react";

// Outer rounded rectangle — the panel body. Common to both states.
const OUTER =
  "M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.2288 21 5.3431 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z";

// The sidebar column; shrinks leftward (x fixed) to a slim rail when closed.
const COLUMN = {
  x: 6,
  y: 6,
  height: 12,
  rx: 1.5,
  openWidth: 5.5,
  closedWidth: 1.75,
};

export interface SidebarToggleIconProps {
  /** Whether the sidebar panel is open. Controls the column. */
  isOpen: boolean;
  strokeWidth?: number;
  className?: string;
}

export function SidebarToggleIcon({
  isOpen,
  strokeWidth = 1.5,
  className,
}: SidebarToggleIconProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer body — page surface + soft border */}
      <path
        d={OUTER}
        fill="var(--bg)"
        stroke="var(--mono8)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sidebar column — bold when open, slim rail when closed */}
      <motion.rect
        x={COLUMN.x}
        y={COLUMN.y}
        height={COLUMN.height}
        rx={COLUMN.rx}
        fill="var(--mono6)"
        initial={false}
        animate={{
          width: isOpen ? COLUMN.openWidth : COLUMN.closedWidth,
        }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
        }
      />
    </svg>
  );
}
