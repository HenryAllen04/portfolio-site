/**
 * Purpose: Layout for The20hr.co experience page with SEO metadata
 * Handles server-side metadata while allowing client components
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The20hr.co - Europe's Fastest Startup Exit | Henry Allen",
  description: "The story of building, launching, and selling The20hr.co in just 20 hours - Europe's fastest startup exit. A hyper-personalized LinkedIn automation tool that scaled to €10k revenue.",
  keywords: "startup exit, The20hr.co, Henry Allen, 20 hour startup, Europe fastest exit, LinkedIn automation, hackathon winner, startup story",
  authors: [{ name: "Henry Allen" }],
  creator: "Henry Allen",
  publisher: "Henry Allen",
  robots: "index, follow",
  openGraph: {
    title: "The20hr.co - Europe's Fastest Startup Exit",
    description: "The incredible story of building, launching, and selling a startup in just 20 hours. From hackathon challenge to €10k revenue and acquisition by Revel.",
    url: "https://henryallen.me/the20hr-co",
    siteName: "Henry Allen Portfolio",
    type: "article",
    images: [
      {
        url: "/images/LovableHackphoto.jpeg",
        width: 1200,
        height: 630,
        alt: "Henry Allen and The20hr.co team with Brian Walker who made the acquisition - celebrating Europe's fastest startup exit at Lovable hackathon in Sweden"
      }
    ],
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "The20hr.co - Europe's Fastest Startup Exit",
    description: "The story of building, launching, and selling a startup in just 20 hours - Europe's fastest exit.",
    images: ["/images/LovableHackphoto.jpeg"],
    creator: "@henryallen"
  },
  alternates: {
    canonical: "https://henryallen.me/the20hr-co"
  }
};

export default function The20hrCoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The20hr.co - Europe's Fastest Startup Exit",
            "description": "The story of building, launching, and selling The20hr.co in just 20 hours - Europe's fastest startup exit.",
            "author": {
              "@type": "Person",
              "name": "Henry Allen",
              "url": "https://henryallen.me"
            },
            "publisher": {
              "@type": "Person",
              "name": "Henry Allen",
              "url": "https://henryallen.me"
            },
            "datePublished": "2024-01-01",
            "dateModified": "2024-01-01",
            "image": {
              "@type": "ImageObject",
              "url": "https://henryallen.me/images/LovableHackphoto.jpeg",
              "width": 1200,
              "height": 630
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://henryallen.me/the20hr-co"
            },
            "about": {
              "@type": "Organization",
              "name": "The20hr.co",
              "description": "Hyper-personalized LinkedIn automation tool built, launched, and sold in 20 hours"
            }
          })
        }}
      />
      {children}
    </>
  );
}
