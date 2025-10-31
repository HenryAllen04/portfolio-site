"use client";

import { useEffect } from "react";
import Footer from "@/components/Footer";
import BackNavigation from "@/components/BackNavigation";

declare global {
  interface Window {
    SavvyCal: {
      (action: string, ...args: unknown[]): void;
      q?: unknown[];
    };
  }
}

export default function BookPage() {
  useEffect(() => {
    // Set up stagger animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((el, index) => {
      const htmlElement = el as HTMLElement;
      const stagger = htmlElement.getAttribute('style')?.match(/--stagger:(\d+)/)?.[1] || index;
      htmlElement.style.setProperty('--stagger', stagger.toString());
    });

    // Initialize SavvyCal
    window.SavvyCal = window.SavvyCal || function(...args: unknown[]) {
      (window.SavvyCal.q = window.SavvyCal.q || []).push(args);
    };

    // Load SavvyCal embed script
    const script = document.createElement('script');
    script.src = 'https://embed.savvycal.com/v1/embed.js';
    script.async = true;
    script.onload = () => {
      if (window.SavvyCal) {
        window.SavvyCal('init');
        window.SavvyCal('inline', { link: 'henryallen/chat-with-henry', selector: '#booking-page' });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <BackNavigation />
      <div className="blur" aria-hidden="true"></div>
      <main>
        <div className="main-grid">
          <article data-animation-controller="true">
            <div className="prose">
              <header>
                <h1 data-animate="" style={{ "--stagger": 1 } as React.CSSProperties}>
                  Book a Call
                </h1>
                <p data-animate="" style={{ "--stagger": 2 } as React.CSSProperties}>
                  <em>Let&apos;s chat!</em> Schedule a time that works for you.
                </p>
              </header>

              <div 
                data-animate="" 
                style={{ 
                  "--stagger": 3,
                  marginTop: "2rem",
                  marginBottom: "4rem"
                } as React.CSSProperties}
              >
                <div 
                  id="booking-page" 
                  style={{ 
                    minHeight: "1200px",
                    height: "auto",
                    width: "100%",
                    maxWidth: "100%"
                  }}
                >
                  {/* SavvyCal embed will be injected here */}
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

