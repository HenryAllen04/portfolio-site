"use client";

/**
 * Purpose: Site navigation sidebar — three pieces: Me, Writings,
 * Information Diet. Wraps the ported unlumen sidebar-001 component and
 * handles the mobile slide-in.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
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
        defaultWidth={220}
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
            <SidebarItem href="/" label="Me" isActive={pathname === "/"} />
            <SidebarItem
              href="/writing"
              label="Writings"
              isActive={pathname.startsWith("/writing")}
            />
            <SidebarItem
              href="/information-diet"
              label="Information Diet"
              isActive={pathname === "/information-diet"}
            />
          </SidebarSection>
        </SidebarContent>

        <SidebarFooter>
          <EffectsToggle />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
