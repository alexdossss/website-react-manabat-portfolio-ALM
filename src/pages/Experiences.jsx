import React, { useState, useRef, useCallback } from 'react';
import CardSwap, { Card } from '../components/CardSwap';
import '../styles/pages.css';

const Experiences = ({ projects }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const infoSectionRef = useRef(null);
  const cardSwapRef = useRef(null);

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
              ←
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
              →
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
    </div>
  );
};

export default Experiences;
