import React from 'react';
import '../styles/pages.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'PureStrength Labs',
      description: 'A comprehensive fitness and exercise application with modern UI/UX design and responsive layout.',
      technologies: ['React', 'JavaScript', 'CSS3', 'UI/UX Design'],
      image: 'PureStrength Labs',
      link: '#',
    },
    {
      id: 2,
      title: 'Responsive Portfolio Website',
      description: 'Personal portfolio website showcasing projects and skills with a modern design approach.',
      technologies: ['React', 'Vite', 'Responsive Design'],
      image: 'Portfolio',
      link: '#',
    },
    {
      id: 3,
      title: 'Web App Dashboard',
      description: 'Interactive dashboard application with data visualization and user-friendly interface.',
      technologies: ['React', 'JavaScript', 'HTML5', 'CSS3'],
      image: 'Dashboard',
      link: '#',
    },
    {
      id: 4,
      title: 'E-Commerce Platform',
      description: 'Modern e-commerce solution with responsive design and smooth user experience.',
      technologies: ['React', 'Node.js', 'UI Design'],
      image: 'E-Commerce',
      link: '#',
    },
    {
      id: 5,
      title: 'Marketing Website',
      description: 'Professional marketing website with engaging design and effective call-to-action elements.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Design'],
      image: 'Marketing',
      link: '#',
    },
    {
      id: 6,
      title: 'Mobile-First Application',
      description: 'Responsive web application designed with mobile-first approach for optimal user experience.',
      technologies: ['React', 'Responsive Design', 'JavaScript'],
      image: 'Mobile App',
      link: '#',
    },
  ];

  return (
    <div className="page projects-page">
      <h1>Portfolio Projects</h1>
      <p className="projects-intro">
        Here are some of the projects I've worked on. Each represents a unique challenge and learning opportunity.
      </p>

      <div className="projects-grid-full">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.link}
            className="project-card-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="project-image-full">
              <div className="placeholder-image">{project.image}</div>
            </div>
            <div className="project-info-full">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-technologies">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Projects;
