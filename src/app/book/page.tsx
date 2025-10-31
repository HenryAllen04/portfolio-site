"use client";

import { useEffect } from "react";
import Script from "next/script";
import Footer from "@/components/Footer";
import BackNavigation from "@/components/BackNavigation";

declare global {
  interface Window {
    SavvyCal: any;
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
                style={{ "--stagger": 3 } as React.CSSProperties}
              >
                <div 
                  id="booking-page" 
                  style={{ 
                    minHeight: "600px",
                    width: "100%"
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

      {/* Load SavvyCal scripts */}
      <Script
        id="savvycal-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.SavvyCal=window.SavvyCal||function(){(SavvyCal.q=SavvyCal.q||[]).push(arguments)};
          `
        }}
      />
      <Script
        src="https://embed.savvycal.com/v1/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.SavvyCal) {
            window.SavvyCal('init');
            window.SavvyCal('inline', { 
              link: 'henryallen/book', 
              selector: '#booking-page' 
            });
          }
        }}
      />
    </>
  );
}

