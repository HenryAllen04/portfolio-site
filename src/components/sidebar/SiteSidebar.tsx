"use client";

/**
 * Purpose: Site navigation sidebar. Wraps the ported unlumen sidebar-001
 * component with Henry's nav structure, and handles the mobile slide-in.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FolderGit2, AtSign, PanelLeft, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  useSidebarEffects,
} from "./Sidebar";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="sb-mobile-toggle"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X size={18} /> : <PanelLeft size={18} />}
      </button>

      {mobileOpen && (
        <div
          className="sb-backdrop"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        defaultWidth={240}
        className={mobileOpen ? "is-mobile-open" : undefined}
      >
        <SidebarHeader>
          <Link href="/" className="sb-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/halogo.svg" alt="" className="sb-brand-logo" />
            <span className="sb-brand-name">Henry Allen</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarSection>
            <SidebarItem href="/" label="Home" isActive={pathname === "/"} />
            <SidebarItem
              href="/book"
              label="Book a Call"
              isActive={pathname === "/book"}
              isNew
            />
          </SidebarSection>

          <SidebarSection label="Work">
            <SidebarGroup label="Experience" icon={<Briefcase />} defaultOpen>
              <SidebarItem
                href="/the20hr-co"
                label="The20hr.co"
                isActive={pathname === "/the20hr-co"}
              />
              <SidebarItem
                href="https://www.fiftyfiveandfive.com/"
                label="Fifty Five and Five"
                external
              />
            </SidebarGroup>

            <SidebarGroup label="Projects" icon={<FolderGit2 />} defaultOpen>
              <SidebarItem
                href="https://github.com/mousberg/le-commit"
                label="Le Commit"
                external
              />
              <SidebarItem
                href="https://github.com/HenryAllen04/Veo3-Chain"
                label="Veo3-Chain"
                external
              />
              <SidebarItem
                href="https://github.com/dame-time/sav-quest"
                label="Sav Quest"
                external
              />
            </SidebarGroup>
          </SidebarSection>

          <SidebarSection label="Connect">
            <SidebarGroup label="Elsewhere" icon={<AtSign />} defaultOpen>
              <SidebarItem
                href="https://linkedin.com/in/henryallen"
                label="LinkedIn"
                external
              />
              <SidebarItem
                href="https://github.com/HenryAllen04"
                label="GitHub"
                external
              />
              <SidebarItem
                href="https://www.unicrnmafia.com/"
                label="Unicorn Mafia"
                external
              />
              <SidebarItem
                href="mailto:Henry01Allen@gmail.com"
                label="Email"
                external
              />
            </SidebarGroup>
          </SidebarSection>
        </SidebarContent>

        <SidebarFooter>
          <EffectsToggle />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
