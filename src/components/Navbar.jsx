import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
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
  const linkRefs = useRef([]);
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState({});
  const [hoverIndicatorStyle, setHoverIndicatorStyle] = useState({});

  const activeIndex = useMemo(() => {
    return navItems.findIndex(item => location.pathname === item.path);
  }, [location.pathname]);

  const updateActiveIndicator = useCallback(() => {
    if (activeIndex === -1 || !linkRefs.current[activeIndex]) {
      setActiveIndicatorStyle({ opacity: 0 });
      return;
    }

    const link = linkRefs.current[activeIndex];
    setActiveIndicatorStyle({
      left: `${link.offsetLeft}px`,
      width: `${link.offsetWidth}px`,
      opacity: 1,
    });
  }, [activeIndex]);

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
          tl.to(label, { y: -(h + 8), duration: 0.4, ease: 'power2.easeOut', overwrite: 'auto' }, 0);
        }

        if (hoverLabel) {
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.easeOut', overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layoutLabels();

    const onResize = () => layoutLabels();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useLayoutEffect(() => {
    const frameId = requestAnimationFrame(updateActiveIndicator);
    document.fonts?.ready?.then(updateActiveIndicator);
    window.addEventListener('resize', updateActiveIndicator);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateActiveIndicator);
    };
  }, [updateActiveIndicator]);

  useEffect(() => {
    if (hoveredIndex !== null && linkRefs.current[hoveredIndex]) {
      const link = linkRefs.current[hoveredIndex];
      setHoverIndicatorStyle({
        left: `${link.offsetLeft}px`,
        width: `${link.offsetWidth}px`,
        opacity: 1,
      });
    } else {
      setHoverIndicatorStyle({
        opacity: 0,
      });
    }
  }, [hoveredIndex]);

  const handleEnter = (index) => {
    setHoveredIndex(index);
    const tl = tlRefs.current[index];
    if (!tl) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.4,
      ease: 'power2.easeOut',
      overwrite: 'auto'
    });
  };

  const handleLeave = (index) => {
    setHoveredIndex(null);
    const tl = tlRefs.current[index];
    if (!tl) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.3,
      ease: 'power2.easeOut',
      overwrite: 'auto'
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-indicator navbar-indicator-active" style={activeIndicatorStyle} />
        <div className="navbar-indicator navbar-indicator-hover" style={hoverIndicatorStyle} />
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${activeIndex === index ? 'active' : ''}`}
            ref={(el) => {
              linkRefs.current[index] = el;
            }}
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
