/**
 * Purpose: Experience page for The20hr.co - Europe's fastest startup exit
 * Detailed story and insights from building, launching and selling in 20 hours
 */

"use client";

import { useEffect } from "react";
import Footer from "@/components/Footer";
import BackNavigation from "@/components/BackNavigation";

export default function The20hrCoPage() {
  useEffect(() => {
    // Set up stagger animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((el, index) => {
      const htmlElement = el as HTMLElement;
      const stagger = htmlElement.getAttribute('style')?.match(/--stagger:(\d+)/)?.[1] || index;
      htmlElement.style.setProperty('--stagger', stagger.toString());
    });
  }, []);

  return (
    <>
      <BackNavigation />
      <div className="blur" aria-hidden="true"></div>
      <main>
        <div className="main-grid">
          <article data-animation-controller="true">
            <div className="prose">
              <h1 data-animate="" style={{ "--stagger": 1 } as React.CSSProperties}>
                The20hr.co
              </h1>
              
              <p data-animate="" style={{ "--stagger": 2 } as React.CSSProperties}>
                <em>Europe&apos;s fastest startup exit</em> - Built, launched, and sold in 20 hours.
              </p>

              {/* Content will be added here */}
              <div data-animate="" style={{ "--stagger": 3 } as React.CSSProperties}>
                <p>Content coming soon...</p>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
