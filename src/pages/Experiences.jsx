import React, { useCallback, useMemo, useRef, useState } from 'react';
import CardSwap, { Card } from '../components/CardSwap';
import Folder from '../components/Folder';
import '../styles/pages.css';

const Experiences = ({ projects = [], workExp = [], certificates = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [folderNavigation, setFolderNavigation] = useState(['root', 'work-exp']);
  const [currentExpIndex, setCurrentExpIndex] = useState(0);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const infoSectionRef = useRef(null);
  const cardSwapRef = useRef(null);
  const projectsCount = projects.length;

  const pauseOnHoverRefs = useMemo(() => [infoSectionRef], []);
  const currentView = useMemo(() => folderNavigation[folderNavigation.length - 1], [folderNavigation]);
  const currentProject = useMemo(() => (
    projectsCount > 0 ? projects[Math.min(activeIndex, projectsCount - 1)] : null
  ), [projects, activeIndex, projectsCount]);
  const currentExperience = useMemo(() => (
    workExp.length > 0 ? workExp[Math.min(currentExpIndex, workExp.length - 1)] : null
  ), [workExp, currentExpIndex]);
  const currentCertificate = useMemo(() => (
    certificates.length > 0 ? certificates[Math.min(currentCertIndex, certificates.length - 1)] : null
  ), [certificates, currentCertIndex]);
  const certificateLogos = useMemo(() => (
    [...new Map(certificates.map((certificate) => [
      certificate.image,
      { src: certificate.image, alt: certificate.title }
    ])).values()]
  ), [certificates]);
  const workLogos = useMemo(() => workExp.map((experience) => ({
    src: experience.img,
    alt: experience.companyName
  })), [workExp]);

  const handleNext = useCallback(() => {
    if (projectsCount < 2) return;
    cardSwapRef.current?.animateNext();
  }, [projectsCount]);

  const handlePrevious = useCallback(() => {
    if (projectsCount < 2) return;
    cardSwapRef.current?.animatePrevious();
  }, [projectsCount]);

  const showWorkFolder = useCallback(() => {
    setFolderNavigation(['root', 'work-exp']);
  }, []);

  const showCertificatesFolder = useCallback(() => {
    setFolderNavigation(['root', 'certificates']);
  }, []);

  const showPreviousExperience = useCallback(() => {
    setCurrentExpIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }, []);

  const showNextExperience = useCallback(() => {
    setCurrentExpIndex((currentIndex) => Math.min(workExp.length - 1, currentIndex + 1));
  }, [workExp.length]);

  const showPreviousCertificate = useCallback(() => {
    setCurrentCertIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }, []);

  const showNextCertificate = useCallback(() => {
    setCurrentCertIndex((currentIndex) => Math.min(certificates.length - 1, currentIndex + 1));
  }, [certificates.length]);

  return (
    <div className="page experiences-page">
      <section className="experiences-header">
        <div className="header-h1-h2-layered">
          <h1>DEVELOPMENT</h1>
          <h2>Projects</h2>
        </div>
      </section>

      <div className="experiences-card-swap-wrapper">
        <div className="experiences-info-section" ref={infoSectionRef}>
          <div className="experiences-info">
            {currentProject && (
              <div className="experience-item">
                <h3 className="project-name">{currentProject.name}</h3>

                <div className="tech-stack">
                  <p className="stack-label">Tech Stack</p>
                  <div className="stack-tags">
                    {currentProject.stack.map((tech) => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="project-description-section">
                  <p className="project-description">{currentProject.description}</p>
                </div>

                <div className="project-actions">
                  <a href={currentProject.url} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                    View Project
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="experiences-nav-controls">
            <button
              className="experiences-nav-btn"
              onClick={handlePrevious}
              aria-label="Previous project"
            >
              Previous
            </button>
            <div className="experiences-indicators">
              {projects.map((project, index) => (
                <button
                  key={project.name}
                  className={`experiences-indicator ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
            <button
              className="experiences-nav-btn"
              onClick={handleNext}
              aria-label="Next project"
            >
              Next
            </button>
          </div>
        </div>

        <div className="experiences-card-container">
          <div style={{ height: '480px', position: 'relative' }}>
            <CardSwap
              ref={cardSwapRef}
              cardDistance={50}
              verticalDistance={60}
              delay={8000}
              pauseOnHover={false}
              pauseOnHoverRefs={pauseOnHoverRefs}
              width={580}
              height={420}
              activeIndex={activeIndex}
              onCardChange={setActiveIndex}
            >
              {projects.map((project) => (
                <Card key={project.name}>
                  <img
                    src={project.img}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>

      <div className="folder-section">
        <div className="folder-layout">
          <div className="folders-column">
            <div className="folders-container">
              <Folder
                color="#2e77e5"
                isSelected={currentView === 'work-exp'}
                items={workLogos}
                isImage
                label="Work"
                onClick={showWorkFolder}
              />
              <Folder
                color="#2e77e5"
                isSelected={currentView === 'certificates'}
                items={certificateLogos}
                isImage
                label="Certificates"
                onClick={showCertificatesFolder}
              />
            </div>
          </div>

          <div className="folder-content-column">
            {currentView === 'work-exp' && currentExperience && (
              <div className="folder-content experience-content">
                <h3>Work Experience</h3>
                <div className="carousel-container">
                  <div className="carousel-content">
                    <div className="carousel-item active">
                      <div className="exp-header">
                        {currentExperience.img && (
                          <img
                            src={currentExperience.img}
                            alt={currentExperience.companyName}
                            className="exp-logo"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <div className="exp-title-group">
                          <h4 className="exp-company">{currentExperience.companyName}</h4>
                          <p className="exp-role">{currentExperience.role}</p>
                        </div>
                      </div>
                      <div className="exp-details">
                        <p><span className="detail-label">Type:</span> {currentExperience.type}</p>
                        <p><span className="detail-label">Date:</span> {currentExperience.date}</p>
                      </div>
                      <p className="exp-description">{currentExperience.description}</p>
                    </div>
                  </div>

                  {workExp.length > 1 && (
                    <div className="carousel-nav">
                      <button
                        onClick={showPreviousExperience}
                        disabled={currentExpIndex === 0}
                        className="carousel-nav-btn prev-btn"
                      >
                        Previous
                      </button>
                      <div className="carousel-indicators">
                        {workExp.map((experience, index) => (
                          <button
                            key={`${experience.companyName}-${experience.role}-${index}`}
                            className={`carousel-indicator ${index === currentExpIndex ? 'active' : ''}`}
                            onClick={() => setCurrentExpIndex(index)}
                          />
                        ))}
                      </div>
                      <button
                        onClick={showNextExperience}
                        disabled={currentExpIndex === workExp.length - 1}
                        className="carousel-nav-btn next-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'certificates' && currentCertificate && (
              <div className="folder-content certificates-content">
                <h3>Certificates</h3>
                <div className="carousel-container">
                  <div className="carousel-content">
                    <div className="carousel-item active">
                      <div className="cert-header">
                        <img
                          src={currentCertificate.image}
                          alt={currentCertificate.title}
                          className="cert-logo"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="cert-title-group">
                          <h4 className="cert-title">{currentCertificate.title}</h4>
                          <p className="cert-date">{currentCertificate.date}</p>
                        </div>
                      </div>
                      <p className="cert-description">{currentCertificate.description}</p>
                      <a href={currentCertificate.url} target="_blank" rel="noopener noreferrer" className="cert-link">
                        View Certificate -&gt;
                      </a>
                    </div>
                  </div>

                  {certificates.length > 1 && (
                    <div className="carousel-nav">
                      <button
                        onClick={showPreviousCertificate}
                        disabled={currentCertIndex === 0}
                        className="carousel-nav-btn prev-btn"
                      >
                        Previous
                      </button>
                      <div className="carousel-indicators">
                        {certificates.map((certificate, index) => (
                          <button
                            key={certificate.title}
                            className={`carousel-indicator ${index === currentCertIndex ? 'active' : ''}`}
                            onClick={() => setCurrentCertIndex(index)}
                          />
                        ))}
                      </div>
                      <button
                        onClick={showNextCertificate}
                        disabled={currentCertIndex === certificates.length - 1}
                        className="carousel-nav-btn next-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {((currentView === 'work-exp' && workExp.length === 0) ||
              (currentView === 'certificates' && certificates.length === 0)) && (
              <div className="folder-content">
                <p className="no-data">No data available for this section.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Experiences);
