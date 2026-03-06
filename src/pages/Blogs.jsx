import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

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
      <h1>Blog</h1>
      <p className="blogs-intro">I created this blog page to share my learning journey, insights, and experiences in software development. It serves as a space where I document concepts I've studied, challenges I've encountered, and solutions I've discovered while building projects. Through these posts, I aim to reinforce my understanding while also helping others who may be learning similar technologies.</p>
      <div className="blog-list">
        {blogs.map((post) => (
          <Link key={post.id} to={`/blogs/${post.id}`} className="blog-post-card">
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
