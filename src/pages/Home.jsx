import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoLoop from '../components/LogoLoop';
import '../styles/pages.css';

const Home = ({ codingLanguages, projects, certificates, workExp }) => {
  const bentoItemsRef = useRef([]);
  // State for the custom cursor tooltip
  const [cursorData, setCursorData] = useState({ x: 0, y: 0, label: '', visible: false });
  // State for carousel cycling
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);



  // Carousel effect - cycle every 10 seconds (paused on hover)
  useEffect(() => {
    if (isHovering) return; // Don't cycle when hovering
    
    const carouselInterval = setInterval(() => {
      setCurrentProjectIndex((prevIndex) => 
        projects && projects.length > 0 ? (prevIndex + 1) % projects.length : 0
      );
      setCurrentCertIndex((prevIndex) => 
        certificates && certificates.length > 0 ? (prevIndex + 1) % certificates.length : 0
      );
    }, 950);

    return () => clearInterval(carouselInterval);
  }, [projects, certificates, isHovering]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // 1. TOOLTIP LOGIC: Detect if hovering over a link
      const hoveredItem = e.target.closest('a.bento-item');
      if (hoveredItem) {
        const path = hoveredItem.getAttribute('href');
        // Clean up path name for the label (e.g., /about -> about)
        const labelName = path.replace('/', '') || 'home';
        setCursorData({
          x: e.clientX,
          y: e.clientY,
          label: `view ${labelName}`,
          visible: true
        });
      } else {
        setCursorData(prev => ({ ...prev, visible: false }));
      }

      // 2. BENTO EFFECTS: Spotlight, Tilt, and Magnetism
      bentoItemsRef.current.forEach((item) => {
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update Mouse Position for Spotlight & Border Glow
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Magnetism: Subtle translation towards mouse
        const tX = ((x - centerX) / centerX) * 8;
        const tY = ((y - centerY) / centerY) * 8;

        // Tilt: Rotation based on mouse position
        const rotateX = ((y - centerY) / centerY) * 10; 
        const rotateY = ((centerX - x) / centerX) * 10;

        item.style.setProperty('--rotate-x', `${rotateX}deg`);
        item.style.setProperty('--rotate-y', `${rotateY}deg`);
        item.style.setProperty('--t-x', `${tX}px`);
        item.style.setProperty('--t-y', `${tY}px`);
      });
    };

    const handleMouseLeave = () => {
      // Reset Tooltip
      setCursorData(prev => ({ ...prev, visible: false }));
      setIsHovering(false);

      // Reset Bento Transforms
      bentoItemsRef.current.forEach((item) => {
        if (!item) return;
        item.style.setProperty('--rotate-x', '0deg');
        item.style.setProperty('--rotate-y', '0deg');
        item.style.setProperty('--t-x', '0px');
        item.style.setProperty('--t-y', '0px');
      });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleClick = (e) => {
      bentoItemsRef.current.forEach((item) => {
        if (item && item.contains(e.target)) {
          const rect = item.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const ripple = document.createElement('div');
          ripple.className = 'click-ripple';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          item.appendChild(ripple);

          setTimeout(() => ripple.remove(), 600);
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="page home-page">
      {/* Custom Cursor Tooltip Layer */}
      <div 
        className={`bento-cursor-tooltip ${cursorData.visible ? 'active' : ''}`}
        style={{ 
          left: `${cursorData.x}px`, 
          top: `${cursorData.y}px` 
        }}
      >
        {cursorData.label}
      </div>

      <div className="bento-grid">
        {/* Profile Section - Top Left */}
        <Link to="/about" className="bento-item bento-profile" ref={(el) => (bentoItemsRef.current[0] = el)}>
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <div className="profile-placeholder"></div>
          
          <div className="profile-text-content">
            <p className="profile-subtitle">WEBSITE DEVELOPER &<br />UI / UX DESIGNER</p>
            <h1 className="profile-name">Alexander<br />Manabat</h1>
          </div>

          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        {/* Projects & Certifications Container - Top Right */}
        <Link
          to="/experiences"
          className="bento-item bento-top-right-container"
          ref={(el) => (bentoItemsRef.current[1] = el)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          
          <div className="bento-projects-inner">
            <div className="section-header">PROJECTS</div>
            <div className="projects-card-carousel">
              {projects && projects.length > 0 && (
                <div className="project-card-display">
                  <img src={projects[currentProjectIndex].img} alt={projects[currentProjectIndex].name} className="project-card-image" />
                  <p className="project-card-name">{projects[currentProjectIndex].name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bento-certifications-inner">
            <div className="section-header-right">CERTIFICATIONS</div>
            <div className="certs-list">
              {certificates && certificates.length > 0 && (
                <div className="cert-item">
                  <div className="cert-logo-wrapper">
                    <img 
                      src={certificates[currentCertIndex].image} 
                      alt={certificates[currentCertIndex].title} 
                      className="cert-logo" 
                    />
                  </div>
                  <div className="cert-info">
                    <p className="cert-title">{certificates[currentCertIndex].title.replace(' CERTIFICATION', '').replace(' Certification', '').split(' ').slice(0, 4).join(' ')}</p>
                    <p className="cert-date">{certificates[currentCertIndex].date}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        {/* Read Blog - Middle Left Small */}
        <Link
          to="/blogs"
          className="bento-item bento-blog"
          ref={(el) => (bentoItemsRef.current[2] = el)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <div className="blog-content-wrapper">
            <img src="/images/blogs-logo.png" alt="blogs" className="blog-logo" />
            <h2 className="blog-label">READ BLOG</h2>
          </div>
          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        {/* Coding Languages - Middle Center Large */}
        <div
          className="bento-item bento-skills"
          ref={(el) => (bentoItemsRef.current[3] = el)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <LogoLoop languages={codingLanguages} speed={30} gap={65} logoHeight={55} />
        </div>

        {/* Work Experience - Middle Right */}
        <Link
          to="/experiences"
          className="bento-item bento-experience"
          ref={(el) => (bentoItemsRef.current[4] = el)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <div className="exp-content">
            {workExp && workExp.length > 0 && (
              <div className="exp-item">
                <div className="exp-logo-wrapper">
                  <img 
                    src={workExp[0].img} 
                    alt={workExp[0].companyName} 
                    className="exp-logo" 
                  />
                </div>
                <div className="exp-info">
                  <p className="exp-company">{workExp[0].companyName}</p>
                  <p className="exp-role">{workExp[0].role}</p>
                  <p className="exp-date">{workExp[0].date}</p>
                </div>
              </div>
            )}
          </div>
          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        {/* Stats - Bottom Left */}
        <div
          className="bento-item bento-stats"
          ref={(el) => (bentoItemsRef.current[5] = el)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <div className="stats-placeholder">
            <div className="stat-item">
              <div className="stat-number">6+</div>
              <div className="stat-label">Projects<br/>Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Years of<br/>Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6+</div>
              <div className="stat-label">Frameworks<br/>Learned</div>
            </div>
          </div>
        </div>

        {/* Motto/CTA - Bottom Right */}
        <Link
          to="/contact"
          className="bento-item bento-motto"
          ref={(el) => (bentoItemsRef.current[6] = el)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <div className="motto-content">
            <h2 className="motto-title">You <span className="motto-accent">Dream it</span></h2>
            <p className="motto-subtitle">I Design and Develop it</p>
          </div>
          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>
      </div>
    </div>
  );
};

export default Home;