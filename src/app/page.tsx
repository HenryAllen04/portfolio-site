"use client";

import { useEffect } from "react";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import Footer from "@/components/Footer";

export default function Home() {
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
      <div className="blur" aria-hidden="true"></div>
      <main>
        <div className="main-grid">
          <article data-animation-controller="true">
            <div className="prose">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/halogo.svg" 
                alt="Henry Allen Logo" 
                className="logo"
                data-animate="" 
                style={{ "--stagger": 0 } as React.CSSProperties}
              />
              <h1 data-animate="" style={{ "--stagger": 1 } as React.CSSProperties}>
                Henry Allen
              </h1>
              <p data-animate="" style={{ "--stagger": 2 } as React.CSSProperties}>
                <em>Building AI solutions</em>. Self-taught AI engineer turning wild ideas into scalable products, 
                from voice systems and RAG pipelines to a 20-hour startup exit and GPU-powered avatars for 10,000+ London Marathon runners.
              </p>
              <p data-animate="" style={{ "--stagger": 3 } as React.CSSProperties}>
                I also lead London&apos;s largest developer community, running hackathons and partnerships, 
                and along the way I&apos;ve made enough API calls to make rate limiters cry.
              </p>
            </div>

            <div className="scroller" data-animate="" style={{ "--stagger": 4 } as React.CSSProperties}>
              <div className="stack">
                <div className="column">
                  <h2>Experience</h2>
                  <div className="item-block">
                    <a href="https://the20hr.co" rel="noopener" target="_blank">
                      The20hr.co
                      <ExternalLinkIcon />
                    </a>
                    <p>Co-Founder. Built, launched & sold in 20 hours. Europe&apos;s fastest exit.</p>
                  </div>
                  <div className="item-block">
                    <a>AI Engineer</a>
                    <p>Fifty Five And Five. Built AI solutions for TCS executives and London Marathon.</p>
                  </div>
                </div>

                <div className="column">
                  <h2>Projects</h2>
                  <div className="item-block">
                    <a href="https://github.com/mousberg/le-commit" rel="noopener" target="_blank">
                      Le Commit
                      <ExternalLinkIcon />
                    </a>
                    <p>1st place RAISE SUMMIT hackathon, Paris.</p>
                  </div>
                  <div className="item-block">
                    <a href="https://github.com/HenryAllen04/Veo3-Chain" rel="noopener" target="_blank">
                      Veo3-Chain
                      <ExternalLinkIcon />
                    </a>
                    <p>1st place Cursor&apos;s First London hackathon.</p>
                  </div>
                  <div className="item-block">
                    <a href="https://github.com/dame-time/sav-quest" rel="noopener" target="_blank">
                      Sav Quest
                      <ExternalLinkIcon />
                    </a>
                    <p>1st place Entrepreneur First X Builder League, Milan.</p>
                  </div>
                </div>

                <div className="column">
                  <h2>Other</h2>
                  <div className="item-block">
                    <a href="https://www.unicrnmafia.com/" rel="noopener" target="_blank">
                      Unicorn Mafia
                      <ExternalLinkIcon />
                    </a>
                    <p>Leading London&apos;s largest developer community, organising hackathons and partnerships!</p>
                  </div>
                  <div className="item-block">
                    <a>Open Water Diving License</a>
                    <p>Certified diver exploring underwater adventures.</p>
                  </div>
                  <div className="item-block">
                    <a>Travel & Exploration</a>
                    <p>I like to spend my spare time travelling and exploring new places.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose" data-animate="" style={{ "--stagger": 5 } as React.CSSProperties}>
              <h2>Now</h2>
              <p>
                Passionate about applying cutting-edge AI to solve real-world challenges, 
                driving both business impact and customer adoption. Committed to lifelong 
                learning and{" "}
                <em>continuously expanding knowledge in AI and related fields.</em>
              </p>
              <p>
                Building production-ready AI solutions that translate complex technical concepts 
                into client-ready outcomes. Utilizing modern tools like Cursor & Claude Code 
                to boost productivity and ship faster.
              </p>
              <p>
                Currently focused on AI system design, full-stack development, and helping 
                teams adopt AI technologies through clear technical communication and 
                iterative deployment strategies.
              </p>
            </div>

            <div className="prose" data-animate="" style={{ "--stagger": 6 } as React.CSSProperties}>
              <h2>Connect</h2>
              <p>
                Reach me at{" "}
                <a href="https://linkedin.com/in/henryallen" rel="noopener" target="_blank">
                  LinkedIn
                </a>{" "}
                or <a href="mailto:Henry01Allen@gmail.com" className="henry-email">Henry01Allen@gmail.com</a>.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}