import React, { useState, useRef, useCallback } from 'react';
import CardSwap, { Card } from '../components/CardSwap';
import Folder from '../components/Folder';
import FloatingBlobBackground from '../components/FloatingBlobBackground';
import '../styles/pages.css';

const Experiences = ({ projects = [], workExp = [], certificates = [] }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [folderNavigation, setFolderNavigation] = useState(['root', 'work-exp']); // Default to work experience
  const [isHovered, setIsHovered] = useState(false);
  const infoSectionRef = useRef(null);
  const cardSwapRef = useRef(null);
  const folderContainerRef = useRef(null);

  // Determine current view based on folder navigation
  const currentView = folderNavigation[folderNavigation.length - 1];
  const [currentExpIndex, setCurrentExpIndex] = useState(0);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);

  const handleCardChange = useCallback((cardIndex) => {
    setCurrentCardIndex(cardIndex);
  }, []);

  const handleNext = () => {
    cardSwapRef.current?.animateNext();
  };

  const handlePrevious = () => {
    cardSwapRef.current?.animatePrevious();
  };

  const currentProject = projects[currentCardIndex];

  return (
    <div className="page experiences-page">
      <FloatingBlobBackground />
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
                    {currentProject.stack.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-badge">{tech}</span>
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
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`experiences-indicator ${index === currentCardIndex ? 'active' : ''}`}
                  onClick={() => setCurrentCardIndex(index)}
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
              delay={10000}
              pauseOnHover={true}
              pauseOnHoverRefs={[infoSectionRef]}
              width={580}
              height={420}
              activeIndex={currentCardIndex}
              onCardChange={handleCardChange}
            >
              {projects.map((project) => (
                <Card key={project.name}>
                  <img 
                    src={project.img} 
                    alt={project.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>

      {/* FOLDER SECTION - EXPERIENCE AND CERTIFICATES */}
      <div 
        className="folder-section"
        ref={folderContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="folder-layout">
          {/* Left Side - Folder Navigation */}
          <div className="folders-column">
            <div className="folders-container">
              {/* Work Folder */}
              <div 
                className={`folder-item ${currentView === 'work-exp' ? 'selected' : ''}`}
                onClick={() => setFolderNavigation(['root', 'work-exp'])}
              >
                <Folder 
                  color="#2e77e5"
                  size={1.2}
                  isSelected={currentView === 'work-exp'}
                  open={currentView === 'work-exp'}
                  items={workExp.map(exp => exp.img)} // Pass logo image paths
                  isImage={true} // New prop to tell Folder to render images
                />
                <p className="folder-label">Work</p>
              </div>

              {/* Certificates Folder */}
              <div 
                className={`folder-item ${currentView === 'certificates' ? 'selected' : ''}`}
                onClick={() => setFolderNavigation(['root', 'certificates'])}
              >
                <Folder 
                  color="#2e77e5"
                  size={1.2}
                  isSelected={currentView === 'certificates'}
                  open={currentView === 'certificates'}
                  items={[...new Set(certificates.map(cert => cert.image))]}
                  
                  isImage={true} // New prop to tell Folder to render images
                />
                <p className="folder-label">Certs</p>
              </div>
            </div>
          </div>

          {/* Right Side - Content Display */}
          <div className="folder-content-column">
            {currentView === 'work-exp' && workExp.length > 0 && (
              <div className="folder-content experience-content">
                <h3>Work Experience</h3>
                <div className="carousel-container">
                  <div className="carousel-content">
                    <div className="carousel-item active">
                      <div className="exp-header">
                        {workExp[currentExpIndex].img && (
                          <img src={workExp[currentExpIndex].img} alt={workExp[currentExpIndex].companyName} className="exp-logo" />
                        )}
                        <div className="exp-title-group">
                          <h4 className="exp-company">{workExp[currentExpIndex].companyName}</h4>
                          <p className="exp-role">{workExp[currentExpIndex].role}</p>
                        </div>
                      </div>
                      <div className="exp-details">
                        <p><span className="detail-label">Type:</span> {workExp[currentExpIndex].type}</p>
                        <p><span className="detail-label">Date:</span> {workExp[currentExpIndex].date}</p>
                      </div>
                      <p className="exp-description">{workExp[currentExpIndex].description}</p>
                    </div>
                  </div>

                  {workExp.length > 1 && (
                    <div className="carousel-nav">
                      <button 
                        onClick={() => setCurrentExpIndex(Math.max(0, currentExpIndex - 1))}
                        disabled={currentExpIndex === 0}
                        className="carousel-nav-btn prev-btn"
                      >
                        Previous
                      </button>
                      <div className="carousel-indicators">
                        {workExp.map((_, index) => (
                          <button
                            key={index}
                            className={`carousel-indicator ${index === currentExpIndex ? 'active' : ''}`}
                            onClick={() => setCurrentExpIndex(index)}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setCurrentExpIndex(Math.min(workExp.length - 1, currentExpIndex + 1))}
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

            {currentView === 'certificates' && certificates.length > 0 && (
              <div className="folder-content certificates-content">
                <h3>Certificates</h3>
                <div className="carousel-container">
                  <div className="carousel-content">
                    <div className="carousel-item active">
                      <div className="cert-header">
                        <img 
                          src={certificates[currentCertIndex].image} 
                          alt={certificates[currentCertIndex].title}
                          className="cert-logo" 
                        />
                        <div className="cert-title-group">
                          <h4 className="cert-title">{certificates[currentCertIndex].title}</h4>
                          <p className="cert-date">{certificates[currentCertIndex].date}</p>
                        </div>
                      </div>
                      <p className="cert-description">{certificates[currentCertIndex].description}</p>
                      <a href={certificates[currentCertIndex].url} target="_blank" rel="noopener noreferrer" className="cert-link">
                        View Certificate →
                      </a>
                    </div>
                  </div>

                  {certificates.length > 1 && (
                    <div className="carousel-nav">
                      <button 
                        onClick={() => setCurrentCertIndex(Math.max(0, currentCertIndex - 1))}
                        disabled={currentCertIndex === 0}
                        className="carousel-nav-btn prev-btn"
                      >
                        Previous
                      </button>
                      <div className="carousel-indicators">
                        {certificates.map((_, index) => (
                          <button
                            key={index}
                            className={`carousel-indicator ${index === currentCertIndex ? 'active' : ''}`}
                            onClick={() => setCurrentCertIndex(index)}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setCurrentCertIndex(Math.min(certificates.length - 1, currentCertIndex + 1))}
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

            {/* Empty State Handlers */}
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

export default Experiences;