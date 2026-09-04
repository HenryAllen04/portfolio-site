"use client";

/**
 * Purpose: Overlay navigation. A toggle in the top-left slides the sidebar
 * over the page. On the one-page home, a scrollspy tracks which section is
 * in view and the active (orange) indicator moves between Me, Writings and
 * Information Diet.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeft, X } from "lucide-react";
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

  // Close the overlay on route navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scrollspy — only meaningful on the one-page home
  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      // Active = section crossing a band in the upper-middle of the viewport
      { rootMargin: "-30% 0px -55% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
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
        {open ? <X size={18} /> : <PanelLeft size={18} />}
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
                onClick={() => setOpen(false)}
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
