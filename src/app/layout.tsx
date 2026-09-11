import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";
import SiteSidebar from "@/components/sidebar/SiteSidebar";
import "./globals.css";

// Dev-only: keeps dialkit (and its CSS) out of production bundles entirely.
const DialKitDock =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/dev/DialKitDock"))
    : null;

// Dev-only for the same reason — the inspector is an authoring tool.
const RadiusInspector =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/radius-inspector/RadiusInspector"))
    : null;

// Full variable Newsreader (weight + italic + optical size) for essays —
// the local woff2 subset stays as the fallback for instant first paint.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Henry Allen - AI Engineer",
  description: "Self-taught AI engineer with experience building, deploying, and scaling AI solutions across industries. Founded Europe's fastest startup exit in 20 hours.",
  openGraph: {
    title: "Henry Allen - AI Engineer",
    description: "Self-taught AI engineer with experience building, deploying, and scaling AI solutions across industries. Founded Europe's fastest startup exit in 20 hours.",
    url: "https://henryallen.dev",
    siteName: "Henry Allen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Henry Allen - AI Engineer",
    description: "Self-taught AI engineer with experience building, deploying, and scaling AI solutions across industries. Founded Europe's fastest startup exit in 20 hours.",
    site: "@henry01allen",
    creator: "@henry01allen",
  },
  authors: [{ name: "Henry Allen" }],
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={newsreader.variable}>
      <head>
        <link rel="icon" href="/halogo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/halogo.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <SiteSidebar />
        {children}
        {RadiusInspector ? <RadiusInspector /> : null}
        {DialKitDock ? <DialKitDock /> : null}
        <Analytics />
      </body>
    </html>
  );
}
