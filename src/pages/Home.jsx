import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoLoop from '../components/LogoLoop';
import '../styles/pages.css';

const Home = ({ codingLanguages, projects, certificates, workExp }) => {
  const bentoItemsRef = useRef([]);
  const tooltipRef = useRef(null);
  const tickingRef = useRef(false);
  const hoveringRef = useRef(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const projectsList = useMemo(() => projects ?? [], [projects]);
  const certificatesList = useMemo(() => certificates ?? [], [certificates]);
  const workExperience = useMemo(() => workExp?.[0] ?? null, [workExp]);
  const currentProject = projectsList.length > 0 ? projectsList[currentProjectIndex % projectsList.length] : null;
  const currentCertificate = certificatesList.length > 0 ? certificatesList[currentCertIndex % certificatesList.length] : null;
  const currentCertificateTitle = useMemo(() => (
    currentCertificate
      ? currentCertificate.title
          .replace(' CERTIFICATION', '')
          .replace(' Certification', '')
          .split(' ')
          .slice(0, 4)
          .join(' ')
      : ''
  ), [currentCertificate]);

  useEffect(() => {
    if (isHovering || (projectsList.length < 2 && certificatesList.length < 2)) return;

    const carouselInterval = setInterval(() => {
      setCurrentProjectIndex((previousIndex) =>
        projectsList.length > 0 ? (previousIndex + 1) % projectsList.length : 0
      );
      setCurrentCertIndex((previousIndex) =>
        certificatesList.length > 0 ? (previousIndex + 1) % certificatesList.length : 0
      );
    }, 950);

    return () => clearInterval(carouselInterval);
  }, [projectsList.length, certificatesList.length, isHovering]);

  useEffect(() => {
    const setHovering = (nextValue) => {
      if (hoveringRef.current === nextValue) return;
      hoveringRef.current = nextValue;
      setIsHovering(nextValue);
    };

    const hideTooltip = () => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      tooltip.classList.remove('active');
    };

    const handleMouseMove = (event) => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const hoveredItem = event.target.closest('a.bento-item');
        const tooltip = tooltipRef.current;

        if (hoveredItem && tooltip) {
          const path = hoveredItem.getAttribute('href');
          const labelName = path.replace('/', '') || 'home';
          tooltip.textContent = `view ${labelName}`;
          tooltip.style.left = `${event.clientX}px`;
          tooltip.style.top = `${event.clientY}px`;
          tooltip.classList.add('active');
          setHovering(true);
        } else {
          hideTooltip();
          setHovering(false);
        }

        bentoItemsRef.current.forEach((item) => {
          if (!item) return;

          const rect = item.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const tX = ((x - centerX) / centerX) * 8;
          const tY = ((y - centerY) / centerY) * 8;
          const rotateX = ((y - centerY) / centerY) * 10;
          const rotateY = ((centerX - x) / centerX) * 10;

          item.style.setProperty('--mouse-x', `${x}px`);
          item.style.setProperty('--mouse-y', `${y}px`);
          item.style.setProperty('--rotate-x', `${rotateX}deg`);
          item.style.setProperty('--rotate-y', `${rotateY}deg`);
          item.style.setProperty('--t-x', `${tX}px`);
          item.style.setProperty('--t-y', `${tY}px`);
        });

        tickingRef.current = false;
      });
    };

    const handleMouseLeave = () => {
      hideTooltip();
      setHovering(false);

      bentoItemsRef.current.forEach((item) => {
        if (!item) return;
        item.style.setProperty('--rotate-x', '0deg');
        item.style.setProperty('--rotate-y', '0deg');
        item.style.setProperty('--t-x', '0px');
        item.style.setProperty('--t-y', '0px');
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="page home-page">
      <div
        ref={tooltipRef}
        className="bento-cursor-tooltip"
      />

      <div className="bento-grid">
        <Link to="/about" className="bento-item bento-profile" ref={(element) => (bentoItemsRef.current[0] = element)}>
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <img src="/images/manabat_picture.jpg" alt="Alexander Manabat" className="profile-image profile-placeholder" />

          <div className="profile-text-content">
            <p className="profile-subtitle">WEBSITE DEVELOPER &<br />UI / UX DESIGNER</p>
            <h1 className="profile-name">Alexander<br />Manabat</h1>
          </div>

          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        <Link
          to="/experiences"
          className="bento-item bento-top-right-container"
          ref={(element) => (bentoItemsRef.current[1] = element)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>

          <div className="bento-projects-inner">
            <div className="section-header">PROJECTS</div>
            <div className="projects-card-carousel">
              {currentProject && (
                <div className="project-card-display">
                  <img src={currentProject.img} alt={currentProject.name} className="project-card-image" />
                  <p className="project-card-name">{currentProject.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bento-certifications-inner">
            <div className="section-header-right">CERTIFICATIONS</div>
            <div className="certs-list">
              {currentCertificate && (
                <div className="cert-item">
                  <div className="cert-logo-wrapper">
                    <img
                      src={currentCertificate.image}
                      alt={currentCertificate.title}
                      className="cert-logo"
                    />
                  </div>
                  <div className="cert-info">
                    <p className="cert-title">{currentCertificateTitle}</p>
                    <p className="cert-date">{currentCertificate.date}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        <Link
          to="/blogs"
          className="bento-item bento-blog"
          ref={(element) => (bentoItemsRef.current[2] = element)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <div className="blog-content-wrapper">
            <img src="/images/blogs-logo.png" alt="blogs" className="blog-logo" />
            <h2 className="blog-label">READ BLOG</h2>
          </div>
          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        <div
          className="bento-item bento-skills"
          ref={(element) => (bentoItemsRef.current[3] = element)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <LogoLoop languages={codingLanguages} speed={30} gap={65} logoHeight={55} />
        </div>

        <Link
          to="/experiences"
          className="bento-item bento-experience"
          ref={(element) => (bentoItemsRef.current[4] = element)}
        >
          <div className="bento-spotlight"></div>
          <div className="bento-stars"></div>
          <div className="exp-content">
            {workExperience && (
              <div className="exp-item">
                <div className="exp-logo-wrapper">
                  <img
                    src={workExperience.img}
                    alt={workExperience.companyName}
                    className="exp-logo"
                  />
                </div>
                <div className="exp-info">
                  <p className="exp-company">{workExperience.companyName}</p>
                  <p className="exp-role">{workExperience.role}</p>
                  <p className="exp-date">{workExperience.date}</p>
                </div>
              </div>
            )}
          </div>
          <img src="/images/external-link.png" alt="external link" className="external-link-icon" />
        </Link>

        <div
          className="bento-item bento-stats"
          ref={(element) => (bentoItemsRef.current[5] = element)}
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

        <Link
          to="/contact"
          className="bento-item bento-motto"
          ref={(element) => (bentoItemsRef.current[6] = element)}
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

export default React.memo(Home);
