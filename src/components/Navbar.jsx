import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../styles/navbar.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/experiences', label: 'Experiences' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/contact', label: 'Contact' }
];

const Navbar = () => {
  const location = useLocation();
  const labelRefs = useRef([]);
  const hoverLabelRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const layoutLabels = () => {
      labelRefs.current.forEach((label, index) => {
        if (!label) return;

        const hoverLabel = hoverLabelRefs.current[index];
        const pill = label.closest('.nav-link');
        if (!pill) return;

        const rect = pill.getBoundingClientRect();
        const h = rect.height;

        gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 8, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.4, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
        }

        if (hoverLabel) {
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layoutLabels();

    const onResize = () => layoutLabels();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleEnter = (index) => {
    const tl = tlRefs.current[index];
    if (!tl) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    });
  };

  const handleLeave = (index) => {
    const tl = tlRefs.current[index];
    if (!tl) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.2,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            onMouseEnter={() => handleEnter(index)}
            onMouseLeave={() => handleLeave(index)}
          >
            <span className="label-stack">
              <span
                className="pill-label"
                ref={(el) => {
                  labelRefs.current[index] = el;
                }}
              >
                {item.label}
              </span>
              <span
                className="pill-label-hover"
                ref={(el) => {
                  hoverLabelRefs.current[index] = el;
                }}
              >
                {item.label}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
