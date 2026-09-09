"use client";

/**
 * DialKit editor UI — the parameter panel and the timeline dock. Both hide
 * themselves in production builds; the hooks that feed them keep running.
 */

import { DialRoot, DialTimeline } from "dialkit";
import "dialkit/styles.css";

export default function DialKitDock() {
  return (
    <>
      <DialRoot position="bottom-right" defaultOpen={false} />
      <DialTimeline defaultOpen={false} />
    </>
  );
}
