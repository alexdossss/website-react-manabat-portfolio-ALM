import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import FloatingBlobBackground from './FloatingBlobBackground';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const mainContentRef = useRef(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const mainNode = mainContentRef.current;
    if (!mainNode) return;

    const SELECTORS = [
      '.header-h1-h2-layered',
      '.about-me-inner-contents',
      '.skill-card-item',
      '.sanlorenzo',
      '.holyangeluni',
      '.short-bio-about',
      '.blog-post-card',
      '.contact-form-card',
      '.contact-info-card',
      '.blogs-intro',
      '.blogs-filter-bar',
      '.experience-item',
      '.experiences-card-swap-wrapper',
      '.folder-section',
      '.logo-loop-wrapper',
      '.capabilities-parent-container',
      '.education-background-container',
    ].join(', ');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          } else {
            entry.target.classList.remove('reveal-visible');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );

    const observed = new Set();

    const processElements = () => {
      const elements = mainNode.querySelectorAll(SELECTORS);
      elements.forEach((el) => {
        if (!observed.has(el)) {
          el.classList.add('reveal-element');
          revealObserver.observe(el);
          observed.add(el);
        }
      });
    };

    processElements();

    const mutationObserver = new MutationObserver(() => {
      processElements();
    });

    mutationObserver.observe(mainNode, {
      childList: true,
      subtree: true,
    });

    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="app-container">
      <FloatingBlobBackground />
      <Header />
      <main className="main-content" ref={mainContentRef}>
        <div className="page-transition">
          {children}
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default React.memo(Layout);
