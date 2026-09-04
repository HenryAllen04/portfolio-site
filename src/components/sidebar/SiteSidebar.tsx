"use client";

/**
 * Purpose: Overlay navigation. The animated toggle (from Vultur-ai/ontology)
 * slides the sidebar over the page — same background as the page, no
 * darkening. Clicking the page (outside the sidebar) dismisses it;
 * navigating between pieces keeps it open. On the one-page home a
 * scrollspy moves the orange active indicator between sections.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarToggleIcon } from "./SidebarToggleIcon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  useSidebarEffects,
} from "./Sidebar";

const SECTIONS = [
  { id: "me", label: "Me" },
  { id: "writings", label: "Writings" },
  { id: "information-diet", label: "Information Diet" },
] as const;

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
  const [activeSection, setActiveSection] = useState<string>("me");

  // Scrollspy — only meaningful on the one-page home. Deterministic:
  // active = last section whose top has crossed a line 35% down the
  // viewport (an IntersectionObserver misfires here because the long
  // final section overlaps the band at the same time as short ones).
  useEffect(() => {
    if (pathname !== "/") return;
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current: string = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const active = pathname.startsWith("/writing")
    ? "writings"
    : pathname === "/"
      ? activeSection
      : "";

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

      <Sidebar defaultWidth={260} className={open ? "is-open" : undefined}>
        <SidebarHeader>
          <span className="sb-brand-name">Henry Allen</span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarSection>
            {SECTIONS.map(({ id, label }) => (
              <SidebarItem
                key={id}
                href={`/#${id}`}
                label={label}
                isActive={active === id}
              />
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
