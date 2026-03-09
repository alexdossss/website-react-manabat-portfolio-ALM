import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FloatingBlobBackground from '../components/FloatingBlobBackground';
import '../styles/pages.css';

const MagneticCard = ({ children, post }) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    // Calculate distance from center
    const x = (e.clientX - (left + width / 2)) * 0.15; // Strength multiplier
    const y = (e.clientY - (top + height / 2)) * 0.15;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Link
      ref={cardRef}
      to={`/blogs/${post.id}`}
      className="blog-post-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${position.x !== 0 ? 1.02 : 1})`,
      }}
    >
      {children}
    </Link>
  );
};

const Blogs = () => {
  const blogs = [
    {
      id: 'dashboard-interface',
      title: 'Designing an Intuitive Dashboard Interface',
      category: 'UI/UX Design',
      excerpt: 'Learn the best practices for creating dashboard interfaces that are intuitive and user-friendly. Explore layout patterns, information hierarchy, and interactive elements that enhance user experience.',
      image: '/images/blogs/Dashboard_Cover.jpg',
      date: 'February 23, 2026',
      readTime: '4 min read'
    },
    {
      id: 'ui-ux-design',
      title: 'UI and UX Designing',
      category: 'Learning',
      excerpt: 'Essential UI and UX design principles beginners should know. Master the fundamentals of visual design, user research, and interaction design to create compelling digital experiences.',
      image: '/images/blogs/UI_UX_Desigining.jpg',
      date: 'February 23, 2026',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="page blogs-page">
      <FloatingBlobBackground />
      <div className='upper-left-blogs'>
        <section className='blogs-top'>
          <div className='header-h1-h2-layered'>
            <h1>LATEST POSTS</h1>
            <h2>Blogs</h2>
          </div>
        </section>
        <p className="blogs-intro">I created this blog page to share my learning journey, insights, and experiences in software development. It serves as a space where I document concepts I've studied, challenges I've encountered, and solutions I've discovered while building projects.</p>
      </div>

      <div className="blog-list">
        {blogs.map((post) => (
          <MagneticCard key={post.id} post={post}>
            <div className="blog-image-container">
              <img src={post.image} alt={post.title} className="blog-card-image" />
            </div>
            <div className="blog-post-header">
              <span className="blog-category">{post.category}</span>
              <h3>{post.title}</h3>
            </div>
            <p className="blog-excerpt">{post.excerpt}</p>
            <div className="blog-meta">
              <span className="blog-date">{post.date}</span>
              <span className="blog-read-time">{post.readTime}</span>
            </div>
          </MagneticCard>
        ))}
      </div>
    </div>
  );
};

export default Blogs;