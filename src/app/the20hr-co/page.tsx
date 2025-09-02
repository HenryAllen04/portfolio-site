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
          <article data-animation-controller="true" itemScope itemType="https://schema.org/Article">
            <div className="prose">
              <header>
                <h1 data-animate="" style={{ "--stagger": 1 } as React.CSSProperties} itemProp="headline">
                  The20hr.co
                </h1>
              
                <p data-animate="" style={{ "--stagger": 2 } as React.CSSProperties} itemProp="description">
                  <em>Europe&apos;s fastest startup exit</em> - Built, launched, and sold in 20 hours.
                </p>
              </header>
              
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
                  aria-label="Scroll to watch the story video"
                >
                  Watch the Story
                </button>
              </div>

              <section data-animate="" style={{ "--stagger": 3 } as React.CSSProperties} itemProp="articleBody">
                <p>
                  Looking back, this was one of the most audacious things I&apos;ve ever attempted. We were challenged by <a href="https://www.linkedin.com/in/antonosika/" rel="noopener" target="_blank">Anton Osika</a> to build something totally unreasonable.
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
              </section>

              <section id="story-section" data-animate="" style={{ "--stagger": 4 } as React.CSSProperties}>
                <h2>The Story</h2>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", margin: "2rem 0" }}>
                  <div style={{ flex: "0 0 auto" }}>
                    <iframe 
                      src="https://drive.google.com/file/d/1lJQK-9V0qY0TzbLzzS_dzWqm9z-v_SgP/preview?embedded=true" 
                      width="280" 
                      height="500" 
                      style={{ 
                        borderRadius: "12px", 
                        border: "none"
                      }}
                      title="The20hr.co Story - Europe's Fastest Startup Exit"
                    ></iframe>
                  </div>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/images/LovableHackphoto.jpeg" 
                      alt="Henry Allen and The20hr.co team with Brian Walker who made the acquisition - celebrating Europe's fastest startup exit at Lovable hackathon in Sweden" 
                      style={{ 
                        width: "100%", 
                        maxWidth: "400px",
                        borderRadius: "8px"
                      }}
                      itemProp="image"
                      loading="lazy"
                    />
                    <iframe 
                      width="100%" 
                      height="225" 
                      src="https://www.youtube.com/embed/NFlOEW9kEfk?controls=0&modestbranding=1&rel=0" 
                      title="The20hr.co documentary - Building Europe's fastest startup exit in 20 hours" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                      style={{ 
                        borderRadius: "8px",
                        maxWidth: "400px"
                      }}
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
                
                <footer data-animate="" style={{ "--stagger": 5, textAlign: "center", marginTop: "2rem" } as React.CSSProperties}>
                  <a 
                    href="https://the20hr.co" 
                    rel="noopener" 
                    target="_blank"
                    style={{
                      color: 'var(--mono7)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '16px',
                      fontStyle: 'italic',
                      textDecoration: 'underline',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = 'var(--mono9)'}
                    onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'var(--mono7)'}
                    aria-label="Visit the20hr.co official website"
                  >
                    Visit the20hr.co
                  </a>
                </footer>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
