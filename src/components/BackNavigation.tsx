/**
 * Purpose: Reusable back navigation overlay component for experience pages
 * Provides consistent positioning and styling across all detail pages
 */

"use client";

import Link from "next/link";

interface BackNavigationProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackNavigation({ 
  href = "/", 
  label = "Back to Henry Allen",
  className = ""
}: BackNavigationProps) {
  return (
    <nav className={`back-navigation-overlay ${className}`}>
      <Link href={href} className="back-link">
        ← {label}
      </Link>
    </nav>
  );
}
