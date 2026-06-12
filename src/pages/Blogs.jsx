import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

const MagneticCard = React.memo(({ children, post }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((event) => {
    const item = cardRef.current;
    if (!item) return;

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    item.style.setProperty('--mouse-x', `${x}px`);
    item.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tX = ((x - centerX) / centerX) * 8;
    const tY = ((y - centerY) / centerY) * 8;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;

    item.style.setProperty('--rotate-x', `${rotateX}deg`);
    item.style.setProperty('--rotate-y', `${rotateY}deg`);
    item.style.setProperty('--t-x', `${tX}px`);
    item.style.setProperty('--t-y', `${tY}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const item = cardRef.current;
    if (!item) return;
    item.style.setProperty('--rotate-x', '0deg');
    item.style.setProperty('--rotate-y', '0deg');
    item.style.setProperty('--t-x', '0px');
    item.style.setProperty('--t-y', '0px');
  }, []);

  const handleClick = useCallback((event) => {
    const item = cardRef.current;
    if (!item) return;
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    item.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }, []);

  return (
    <Link
      ref={cardRef}
      to={`/blogs/${post.id}`}
      className="blog-post-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="bento-spotlight"></div>
      <div className="bento-stars"></div>
      {children}
    </Link>
  );
});

MagneticCard.displayName = 'MagneticCard';

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

const categories = ['All', 'UI/UX Design', 'Learning'];

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = useMemo(() => (
    selectedCategory === 'All'
      ? blogs
      : blogs.filter((post) => post.category === selectedCategory)
  ), [selectedCategory]);

  return (
    <div className="page blogs-page">
      <div className='upper-left-blogs'>
        <section className='blogs-top'>
          <div className='header-h1-h2-layered'>
            <h1>LATEST POSTS</h1>
            <h2>Blogs</h2>
          </div>
        </section>
        <p className="blogs-intro">I created this blog page to share my learning journey, insights, and experiences in software development. It serves as a space where I document concepts I've studied, challenges I've encountered, and solutions I've discovered while building projects.</p>
      </div>

      <div className="blogs-filter-bar">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="blog-list">
        {filteredBlogs.map((post) => (
          <MagneticCard key={post.id} post={post}>
            <div className="blog-image-container">
              <img src={post.image} alt={post.title} className="blog-card-image" loading="lazy" decoding="async" />
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

export default React.memo(Blogs);
