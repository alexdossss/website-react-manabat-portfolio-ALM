import React from 'react';
import FloatingBlobBackground from '../components/FloatingBlobBackground';
import '../styles/pages.css';

const Resume = () => {
  return (
    <div className="page resume-page">
      <FloatingBlobBackground />
      <div className="resume-container">
        <header className="resume-header">
          <h1>Alexander Manabat</h1>
          <p className="resume-subtitle">Website Developer & UI/UX Designer</p>
          <div className="resume-contact">
            <span>amanabat1927@gmail.com</span>
            <span>•</span>
            <span>Philippines</span>
            <span>•</span>
            <span><a href="https://github.com/alexdossss">GitHub</a></span>
          </div>
        </header>

        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p>
            Website Developer and UI/UX Designer with 3+ years of experience creating responsive and engaging digital solutions. 
            Passionate about building intuitive user interfaces and delivering exceptional user experiences. Skilled in modern web 
            technologies and design principles with a focus on clean code and professional aesthetics.
          </p>
        </section>

        <section className="resume-section">
          <h2>Technical Skills</h2>
          <div className="skills-columns">
            <div className="skill-column">
              <h3>Languages</h3>
              <ul>
                <li>JavaScript, TypeScript, HTML5, CSS3</li>
                <li>PHP, Python, Java, Dart</li>
              </ul>
            </div>
            <div className="skill-column">
              <h3>Frameworks & Libraries</h3>
              <ul>
                <li>React, Next.js, Angular</li>
                <li>Node.js, Express</li>
              </ul>
            </div>
            <div className="skill-column">
              <h3>Databases & Tools</h3>
              <ul>
                <li>MongoDB, MySQL</li>
                <li>Git, GitHub, VS Code</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="resume-section">
          <h2>Work Experience</h2>
          <div className="resume-entry">
            <div className="resume-entry-header">
              <h3>Internship</h3>
              <span className="resume-date">2024 - Present</span>
            </div>
            <p className="resume-company">A2K Group</p>
            <ul className="resume-list">
              <li>Developed and maintained responsive web applications</li>
              <li>Collaborated with design and development teams on project implementation</li>
              <li>Improved UI/UX design and implement best practices for web development</li>
            </ul>
          </div>

          <div className="resume-entry">
            <div className="resume-entry-header">
              <h3>Freelance Web Developer</h3>
              <span className="resume-date">2022 - Present</span>
            </div>
            <p className="resume-company">Self-Employed</p>
            <ul className="resume-list">
              <li>Designed and developed 6+ professional web projects</li>
              <li>Created responsive and user-friendly web interfaces</li>
              <li>Worked with clients to understand requirements and deliver quality solutions</li>
            </ul>
          </div>
        </section>

        <section className="resume-section">
          <h2>Education</h2>
          <div className="resume-entry">
            <div className="resume-entry-header">
              <h3>Certification: Legacy Responsive Web Design</h3>
              <span className="resume-date">September 5, 2024</span>
            </div>
            <p className="resume-company">FreeCodeCamp (FCC)</p>
          </div>
        </section>

        <section className="resume-section">
          <h2>Featured Projects</h2>
          <ul className="resume-list">
            <li><strong>PureStrength Labs</strong> - Full-featured fitness web application with modern UI/UX design</li>
            <li>Responsive website solutions for various clients</li>
            <li>6+ completed projects with focus on user experience and clean code</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default React.memo(Resume);
