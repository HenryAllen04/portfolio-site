"use client";

/**
 * DialKit editor UI — the parameter panel and the timeline dock. Only
 * imported in development (see layout.tsx); the hooks that feed them keep
 * running in production with their baked-in values.
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
