import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../styles/header.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/experiences', label: 'Experiences' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/contact', label: 'Contact' }
];

const Header = () => {
  const location = useLocation();
  const [isCompactNav, setIsCompactNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const triggerRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const itemRefs = useRef([]);
  const tlRef = useRef(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const sync = () => setIsCompactNav(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(frameId);
  }, [location.pathname]);

  useEffect(() => {
    if (isCompactNav) return;

    const frameId = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(frameId);
  }, [isCompactNav]);

  useEffect(() => {
    if (!isCompactNav) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCompactNav]);

  useEffect(() => {
    if (!isCompactNav) return;

    const overlayEl = overlayRef.current;
    const panelEl = panelRef.current;
    const closeEl = closeRef.current;
    const items = itemRefs.current.filter(Boolean);

    if (!overlayEl || !panelEl) return;

    tlRef.current?.kill();
    tlRef.current = null;

    if (menuOpen) {
      hasOpenedRef.current = true;
      const prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';

      gsap.set(overlayEl, { display: 'block', autoAlpha: 1 });
      gsap.set(panelEl, { xPercent: 100 });
      gsap.set(items, { opacity: 0, y: 10, x: 12 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          closeEl?.focus?.();
        }
      });

      tlRef.current = tl;

      tl.to(panelEl, { xPercent: 0, duration: 0.45 }, 0);
      tl.to(items, { opacity: 1, y: 0, x: 0, duration: 0.35, stagger: 0.06 }, 0.12);

      return () => {
        document.documentElement.style.overflow = prevOverflow;
      };
    }

    if (!hasOpenedRef.current) {
      gsap.set(overlayEl, { display: 'none', autoAlpha: 0 });
      gsap.set(panelEl, { xPercent: 100 });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        gsap.set(overlayEl, { display: 'none', autoAlpha: 0 });
        triggerRef.current?.focus?.();
      }
    });

    tlRef.current = tl;
    tl.to(panelEl, { xPercent: 100, duration: 0.35 }, 0);
    tl.to(items, { opacity: 0, y: 8, duration: 0.2, stagger: 0.03 }, 0);
  }, [isCompactNav, menuOpen]);

  return (
    <header className="upper-header">
      <div className="header-left">
        <div className="logo">
            <Link to="/">
                <img src="/images/logo_manabat.png" alt="Manabat Logo" className='upper-header-logo'/>
            </Link>
        </div>
        <div className="social-links">
          <a
            href="https://www.facebook.com/alexander.manabat.3726"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Facebook"
            title="Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/alexander-manabat-8206002a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </a>
          <a
            href="https://github.com/alexdossss"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="header-right">
        {!isCompactNav ? (
          <a
            href="/resume/Alexander_Manabat_Resume.pdf"
            download="Alexander_Manabat_Resume.pdf"
            className="download-btn"
          >
            Download Resume
          </a>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            className="menu-trigger"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="menu-trigger-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        )}
      </div>

      {isCompactNav && (
        <div
          ref={overlayRef}
          className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            ref={panelRef}
            id="mobile-menu"
            className="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <button
              ref={closeRef}
              type="button"
              className="mobile-menu-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <span className="mobile-menu-close-icon" aria-hidden="true" />
            </button>
            <nav className="mobile-menu-nav">
              {navItems.map((item, i) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="mobile-menu-link"
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                className="mobile-menu-link mobile-menu-resume"
                ref={(el) => {
                  itemRefs.current[navItems.length] = el;
                }}
                href="/resume/Alexander_Manabat_Resume.pdf"
                download="Alexander_Manabat_Resume.pdf"
                onClick={() => setMenuOpen(false)}
              >
                Download Resume
              </a>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
};

export default React.memo(Header);
