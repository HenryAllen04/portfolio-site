"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CornerKey = "top-left" | "top-right" | "bottom-right" | "bottom-left";

type Radius = {
  x: number;
  y: number;
};

type CornerResult = {
  key: CornerKey;
  label: string;
  actual: Radius;
  expected: Radius;
  difference: Radius;
  matches: boolean;
};

type Inspection = {
  element: HTMLElement;
  parent: HTMLElement;
  selector: string;
  parentSelector: string;
  rect: DOMRect;
  parentRect: DOMRect;
  insets: { top: number; right: number; bottom: number; left: number };
  corners: CornerResult[];
  matches: boolean;
};

type PageScan = {
  inspections: Inspection[];
  roundedCount: number;
};

const CORNERS: Array<{
  key: CornerKey;
  label: string;
  property: keyof Pick<
    CSSStyleDeclaration,
    | "borderTopLeftRadius"
    | "borderTopRightRadius"
    | "borderBottomRightRadius"
    | "borderBottomLeftRadius"
  >;
  horizontalInset: "left" | "right";
  verticalInset: "top" | "bottom";
}> = [
  {
    key: "top-left",
    label: "TL",
    property: "borderTopLeftRadius",
    horizontalInset: "left",
    verticalInset: "top",
  },
  {
    key: "top-right",
    label: "TR",
    property: "borderTopRightRadius",
    horizontalInset: "right",
    verticalInset: "top",
  },
  {
    key: "bottom-right",
    label: "BR",
    property: "borderBottomRightRadius",
    horizontalInset: "right",
    verticalInset: "bottom",
  },
  {
    key: "bottom-left",
    label: "BL",
    property: "borderBottomLeftRadius",
    horizontalInset: "left",
    verticalInset: "bottom",
  },
];

const MATCH_TOLERANCE = 0.5;

function resolveLength(value: string, axisSize: number) {
  const trimmed = value.trim();
  if (trimmed.endsWith("%")) {
    return (Number.parseFloat(trimmed) / 100) * axisSize;
  }

  return Number.parseFloat(trimmed) || 0;
}

function readRadius(
  style: CSSStyleDeclaration,
  property: (typeof CORNERS)[number]["property"],
  rect: DOMRect,
): Radius {
  const [horizontal, vertical = horizontal] = style[property]
    .trim()
    .split(/\s+/);

  return {
    x: resolveLength(horizontal, rect.width),
    y: resolveLength(vertical, rect.height),
  };
}

function radiiFor(element: HTMLElement, rect = element.getBoundingClientRect()) {
  const style = window.getComputedStyle(element);
  return CORNERS.map((corner) => readRadius(style, corner.property, rect));
}

function hasRadius(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return radiiFor(element, rect).some((radius) => radius.x > 0 || radius.y > 0);
}

function roundedAncestor(element: HTMLElement) {
  let candidate = element.parentElement;

  while (candidate && candidate !== document.body && candidate !== document.documentElement) {
    if (
      !candidate.closest("[data-radius-inspector-ui]") &&
      hasRadius(candidate)
    ) {
      return candidate;
    }
    candidate = candidate.parentElement;
  }

  return null;
}

function compactNumber(value: number) {
  const normalized = Math.abs(value) < 0.05 ? 0 : value;
  return Number.isInteger(normalized)
    ? String(normalized)
    : normalized.toFixed(1).replace(/\.0$/, "");
}

function radiusText(radius: Radius) {
  return radius.x === radius.y
    ? `${compactNumber(radius.x)}px`
    : `${compactNumber(radius.x)} × ${compactNumber(radius.y)}px`;
}

function escapeSelector(value: string) {
  return typeof CSS !== "undefined" && CSS.escape
    ? CSS.escape(value)
    : value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function selectorFor(element: HTMLElement) {
  if (element.id) return `${element.tagName.toLowerCase()}#${escapeSelector(element.id)}`;

  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body && parts.length < 4) {
    let part = current.tagName.toLowerCase();
    const classes = [...current.classList]
      .filter((name) => !name.startsWith("ri-"))
      .slice(0, 2);

    if (classes.length) {
      part += classes.map((name) => `.${escapeSelector(name)}`).join("");
    } else if (current.parentElement) {
      const siblings = [...current.parentElement.children].filter(
        (sibling) => sibling.tagName === current?.tagName,
      );
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
    }

    parts.unshift(part);
    current = current.parentElement;
  }

  return parts.join(" > ");
}

function inspectElement(element: HTMLElement, parent = roundedAncestor(element)): Inspection | null {
  if (!parent) return null;

  const rect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const actualRadii = radiiFor(element, rect);
  const parentRadii = radiiFor(parent, parentRect);
  const insets = {
    top: rect.top - parentRect.top,
    right: parentRect.right - rect.right,
    bottom: parentRect.bottom - rect.bottom,
    left: rect.left - parentRect.left,
  };

  const corners = CORNERS.map((corner, index): CornerResult => {
    const actual = actualRadii[index];
    const outer = parentRadii[index];
    const expected = {
      x: Math.max(0, outer.x - insets[corner.horizontalInset]),
      y: Math.max(0, outer.y - insets[corner.verticalInset]),
    };
    const difference = {
      x: actual.x - expected.x,
      y: actual.y - expected.y,
    };
    const matches =
      Math.abs(difference.x) <= MATCH_TOLERANCE &&
      Math.abs(difference.y) <= MATCH_TOLERANCE;

    return { ...corner, actual, expected, difference, matches };
  });

  return {
    element,
    parent,
    selector: selectorFor(element),
    parentSelector: selectorFor(parent),
    rect,
    parentRect,
    insets,
    corners,
    matches: corners.every((corner) => corner.matches),
  };
}

function nearestInspectable(target: HTMLElement) {
  let candidate: HTMLElement | null = target;

  while (candidate && candidate !== document.body && candidate !== document.documentElement) {
    if (candidate.closest("[data-radius-inspector-ui]")) return null;
    if (hasRadius(candidate)) {
      const inspection = inspectElement(candidate);
      if (inspection) return inspection;
    }
    candidate = candidate.parentElement;
  }

  return null;
}

function scanPage() {
  const roundedElements = [...document.body.querySelectorAll<HTMLElement>("*")]
    .filter(
      (element) =>
        !element.closest("[data-radius-inspector-ui]") && hasRadius(element),
    );

  return {
    inspections: roundedElements
      .map((element) => inspectElement(element))
      .filter((inspection): inspection is Inspection => Boolean(inspection)),
    roundedCount: roundedElements.length,
  };
}

function buildReport(scan: PageScan) {
  const { inspections, roundedCount } = scan;
  const issues = inspections.filter((inspection) => !inspection.matches);
  const lines = [
    "# Nested border-radius audit",
    "",
    `- Page: ${window.location.href}`,
    `- Viewport: ${window.innerWidth} × ${window.innerHeight}`,
    `- Rounded elements found: ${roundedCount}`,
    `- Nested pairs checked: ${inspections.length}`,
    `- Issues: ${issues.length}`,
    `- Rule: inner corner radius = max(0, outer corner radius − corresponding inset)`,
    `- Tolerance: ±${MATCH_TOLERANCE}px per axis`,
  ];

  if (!inspections.length) {
    lines.push(
      "",
      roundedCount
        ? `Found ${roundedCount} rounded ${roundedCount === 1 ? "element" : "elements"}, but none are nested inside another rounded element.`
        : "No rounded elements were found on this page.",
    );
    return lines.join("\n");
  }

  if (!issues.length) {
    lines.push("", "All nested radii match the expected geometry.");
    return lines.join("\n");
  }

  issues.forEach((inspection, index) => {
    const { insets } = inspection;
    lines.push(
      "",
      `## ${index + 1}. ${inspection.selector}`,
      "",
      `- Outer: ${inspection.parentSelector}`,
      `- Insets (T/R/B/L): ${compactNumber(insets.top)} / ${compactNumber(insets.right)} / ${compactNumber(insets.bottom)} / ${compactNumber(insets.left)}px`,
      "- Corners:",
    );

    inspection.corners.forEach((corner) => {
      const status = corner.matches ? "match" : "mismatch";
      lines.push(
        `  - ${corner.label}: actual ${radiusText(corner.actual)}; expected ${radiusText(corner.expected)}; delta ${radiusText(corner.difference)} (${status})`,
      );
    });
  });

  return lines.join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function rectStyle(rect: DOMRect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export default function RadiusInspector() {
  const [enabled, setEnabled] = useState(true);
  const [active, setActive] = useState<Inspection | null>(null);
  const [scan, setScan] = useState<PageScan | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshInspection = useCallback((inspection: Inspection) => {
    return inspectElement(inspection.element, inspection.parent);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const handlePointerOver = (event: PointerEvent) => {
      const target =
        event.target instanceof HTMLElement
          ? event.target
          : event.target instanceof Element
            ? event.target.parentElement
            : null;
      if (!target) return;
      const inspection = nearestInspectable(target);
      setActive((current) => {
        if (current?.element === inspection?.element) return current;
        return inspection;
      });
    };

    const refresh = () => {
      setActive((current) => (current ? refreshInspection(current) : null));
      setScan((current) =>
        current
          ? {
              ...current,
              inspections: current.inspections
                .map((inspection) => refreshInspection(inspection))
                .filter((inspection): inspection is Inspection => Boolean(inspection)),
            }
          : null,
      );
    };

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, [enabled, refreshInspection]);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const issues = useMemo(
    () => scan?.inspections.filter((inspection) => !inspection.matches) ?? [],
    [scan],
  );

  const handleScan = () => {
    setScan(scanPage());
    setCopied(false);
  };

  const handleCopy = async () => {
    const source =
      scan ??
      (active
        ? { inspections: [active], roundedCount: 1 }
        : scanPage());
    if (!scan) setScan(source);

    await copyText(buildReport(source));
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  const tooltipPosition = active
    ? {
        left: Math.min(
          Math.max(12, active.rect.left),
          Math.max(12, window.innerWidth - 356),
        ),
        top:
          active.rect.bottom + 12 + 250 < window.innerHeight
            ? active.rect.bottom + 12
            : Math.max(12, active.rect.top - 262),
      }
    : undefined;

  return (
    <div className="ri-root" data-radius-inspector-ui>
      {enabled && active && (
        <>
          <div
            className="ri-outline ri-outline-outer"
            style={rectStyle(active.parentRect)}
            aria-hidden="true"
          />
          <div
            className={`ri-outline ri-outline-inner${active.matches ? " is-match" : " is-issue"}`}
            style={rectStyle(active.rect)}
            aria-hidden="true"
          />
          <aside className="ri-inspection" style={tooltipPosition} aria-live="polite">
            <div className="ri-inspection-heading">
              <span className="ri-kicker">Nested radius</span>
              <span className="ri-status">
                {active.matches ? "Matches" : "Mismatch"}
              </span>
            </div>
            <p className="ri-selector" title={active.selector}>
              {active.selector}
            </p>
            <p className="ri-parent" title={active.parentSelector}>
              inside {active.parentSelector}
            </p>
            <div className="ri-table" role="table" aria-label="Corner radius comparison">
              <div className="ri-table-row ri-table-header" role="row">
                <span role="columnheader">Corner</span>
                <span role="columnheader">Actual</span>
                <span role="columnheader">Expected</span>
              </div>
              {active.corners.map((corner) => (
                <div className="ri-table-row" role="row" key={corner.key}>
                  <span role="cell" className={corner.matches ? "" : "is-issue"}>
                    {corner.label}
                  </span>
                  <span role="cell">{radiusText(corner.actual)}</span>
                  <span role="cell">{radiusText(corner.expected)}</span>
                </div>
              ))}
            </div>
            <p className="ri-insets">
              Inset T/R/B/L&nbsp; {compactNumber(active.insets.top)} /{" "}
              {compactNumber(active.insets.right)} / {compactNumber(active.insets.bottom)} /{" "}
              {compactNumber(active.insets.left)}px
            </p>
          </aside>
        </>
      )}

      {enabled &&
        issues.map((inspection, index) => (
          <div
            className="ri-scan-outline"
            style={rectStyle(inspection.rect)}
            key={`${inspection.selector}-${index}`}
            aria-hidden="true"
          />
        ))}

      {scan && (
        <div className="ri-scan-notice" role="status">
          <span className="ri-scan-notice-title">Scan complete</span>
          <span>
            {scan.inspections.length === 0
              ? scan.roundedCount === 0
                ? "No rounded elements found. A nested pair needs two rounded elements."
                : `${scan.roundedCount} rounded ${scan.roundedCount === 1 ? "element" : "elements"} found, but none sit inside another rounded element.`
              : issues.length === 0
                ? `${scan.inspections.length} nested ${scan.inspections.length === 1 ? "pair" : "pairs"} checked. Everything matches.`
                : `${issues.length} ${issues.length === 1 ? "issue" : "issues"} found across ${scan.inspections.length} nested ${scan.inspections.length === 1 ? "pair" : "pairs"}.`}
          </span>
        </div>
      )}

      <div className="ri-toolbar" role="toolbar" aria-label="Border radius inspector">
        <button
          type="button"
          className={`ri-button ri-toggle${enabled ? " is-active" : ""}`}
          aria-pressed={enabled}
          onClick={() => setEnabled((value) => !value)}
        >
          <span className="ri-toggle-mark" aria-hidden="true" />
          Inspect
        </button>
        <span className="ri-toolbar-divider" aria-hidden="true" />
        <button type="button" className="ri-button" onClick={handleScan}>
          {scan ? "Scan again" : "Scan page"}
        </button>
        <button type="button" className="ri-button" onClick={handleCopy}>
          {copied ? "Copied" : "Copy report"}
        </button>
        {scan && (
          <span className="ri-summary" aria-live="polite">
            {scan.inspections.length} {scan.inspections.length === 1 ? "pair" : "pairs"} ·{" "}
            {issues.length} {issues.length === 1 ? "issue" : "issues"}
          </span>
        )}
      </div>
    </div>
  );
}
