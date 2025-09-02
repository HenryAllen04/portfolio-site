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
                  onMouseEnter={(e) => e.target.style.color = 'var(--mono9)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--mono7)'}
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
                  20 hours. 20k exit. 20 years old.
                </p>
                
                <p>
                  Looking back, this was one of the most audacious things we&apos;ve ever attempted. The question seemed impossible: 
                  Could we build, launch, and sell a company in just 20 hours?
                </p>
                
                <p>
                  I assembled the best hackathon winners I knew - Charlie Cheesman, David Gelberg, Leo Camacho, and Luke Tervit. 
                  Together, we set out to prove that Europe could do the impossible, that young founders could achieve what 
                  seemed unreasonable if only they were ambitious enough.
                </p>
                
                <p>
                  The challenge was clear: Build, Launch, Sell - all within 20 hours. 
                  What followed was one of the greatest and most stressful experiences of my life, but I loved every second of it.
                </p>
                
                <p>
                  We didn&apos;t just meet the challenge - we smashed it. <a href="https://the20hr.co" rel="noopener" target="_blank">The20hr.co</a> became 
                  Europe&apos;s fastest startup exit, acquired by Revel in record time.
                </p>
                
                <p>
                  But this story is really about gratitude. None of this would have been possible without incredible support:
                </p>
                
                <p>
                  The organisers who created this audacious hackathon: Project Europe, 20VC, Creandum, and Lovable - 
                  Kitty Mayo, Harry Stebbings, Filip Mark, and Anton Osika. Brian Walker, who believed in us and made the acquisition happen. 
                  Anna Walker, who changed her birthday plans for us.
                </p>
                
                <p>
                  Eric Davison provided legal advice on &apos;this crazy idea&apos;. Ashkan Dabbagh stayed up all night video editing with us. 
                  Marcus Grip stitched everything together at the last minute. The list goes on - Laura Normand answering 2am phone calls, 
                  Alexa Kayman and Ben delivering the fastest Cluely UGC turnaround I&apos;ve ever seen, Katie Schlager providing incredible late-night feedback.
                </p>
                
                <p>
                  To everyone who said &quot;Sorry... you&apos;re doing what exactly?&quot; and to everyone who sent messages of support - 
                  you backed us before anyone else would, and that means the world.
                </p>
                
                <p>
                  What we proved is that Europe can compete on the largest stage. That impossible things become possible when you&apos;re 
                  ambitious enough and surround yourself with the right people. Our team demonstrated that together, we can do the impossible.
                </p>
                
                <p>
                  Now the question is: What will you build? Because Europe - it&apos;s time to build.
                </p>
                
                <p>
                  We can&apos;t wait to do it again. Next time, we&apos;re going to build even better, even faster. 
                  Because things like this aren&apos;t possible... until they are.
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
