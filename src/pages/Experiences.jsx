import React from 'react';
import '../styles/pages.css';

const Experiences = () => {
  const experiences = [
    {
      id: 1,
      title: 'Internship',
      company: 'A2K Group',
      duration: '2024 - Present',
      description: 'Working as an intern developer, contributing to web development projects and learning industry best practices from experienced mentors.',
    },
    {
      id: 2,
      title: 'Freelance Web Developer',
      company: 'Self-Employed',
      duration: '2022 - Present',
      description: 'Developing responsive web applications for clients, focusing on UI/UX design and modern web technologies.',
    },
    {
      id: 3,
      title: 'Student Developer',
      company: 'FreeCodeCamp',
      duration: '2023 - 2024',
      description: 'Completed Legacy Responsive Web Design certification, mastering HTML5, CSS3, and responsive design principles.',
    },
    {
      id: 4,
      title: 'Project Portfolio',
      company: 'Various Clients',
      duration: '2022 - Present',
      description: 'Completed 6+ web development projects, delivering professional and user-friendly digital solutions.',
    },
  ];

  return (
    <div className="page experiences-page">
      <h1>Work Experiences</h1>
      <div className="experiences-timeline">
        {experiences.map((exp) => (
          <div key={exp.id} className="experience-card">
            <div className="experience-marker"></div>
            <div className="experience-content">
              <h3>{exp.title}</h3>
              <p className="experience-company">{exp.company}</p>
              <p className="experience-duration">{exp.duration}</p>
              <p className="experience-description">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
