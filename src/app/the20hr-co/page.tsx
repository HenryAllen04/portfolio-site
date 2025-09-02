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
              
              <div data-animate="" style={{ "--stagger": 2.5 } as React.CSSProperties}>
                <button 
                  onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="watch-story-button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--mono7)',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '16px',
                    fontStyle: 'italic',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                    margin: '0.5rem 0 1rem 0',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = 'var(--mono9)'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'var(--mono7)'}
                >
                  Watch the Story
                </button>
              </div>

              <div data-animate="" style={{ "--stagger": 3 } as React.CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/LovableHackphoto.jpeg" 
                  alt="The20hr.co team at Lovable hackathon" 
                  className="hackathon-photo"
                  style={{ float: "right", margin: "0 0 1rem 1.5rem", maxWidth: "300px", borderRadius: "8px" }}
                />
                
                <p>
                  Looking back, this was one of the most audacious things I&apos;ve ever attempted. We were challenged by Anton Osika to build something totally unreasonable.
                </p>
                
                <p>
                  I assembled my friends, and together we chose our challenge: Build, Launch, Sell, all within 20 hours. What followed was one of the greatest and most stressful experiences of my life, but I loved every second of it.
                </p>
                
                <p>
                  <a href="https://the20hr.co" rel="noopener" target="_blank">The20hr.co</a> became Europe&apos;s fastest startup exit, acquired by Revel in record time.
                </p>
                
                <p>
                  It was my first time in Sweden, and also my first hackathon where I was picking up the phone, getting on calls, and selling instead of being 100% heads down in coding. As a result, we scaled to €10k in revenue from the sponsors we secured for the project.
                </p>
                
                <p>
                  So, what did we build? A hyper personalised LinkedIn automation outreach tool, which we also used to land Cluely a client so that they would sponsor us.
                </p>
                
                <p>
                  I learned a lot from this short but intense experience. It truly reinforced the idea that nothing is too audacious when you bring together the right people and give it everything you&apos;ve got.
                </p>
              </div>

              <div id="story-section" data-animate="" style={{ "--stagger": 4 } as React.CSSProperties}>
                <h2>The Story</h2>
                <div className="video-container" style={{ margin: "2rem 0", textAlign: "center" }}>
                  <iframe 
                    src="https://drive.google.com/file/d/1lJQK-9V0qY0TzbLzzS_dzWqm9z-v_SgP/preview" 
                    width="360" 
                    height="640" 
                    allow="autoplay"
                    style={{ borderRadius: "12px", maxWidth: "100%" }}
                    title="The20hr.co Story - Europe's Fastest Startup Exit"
                  ></iframe>
                </div>
                <p style={{ textAlign: "center", fontStyle: "italic", color: "var(--mono7)" }}>
                  The full story of how we built, launched, and sold Europe&apos;s fastest startup in 20 hours.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
