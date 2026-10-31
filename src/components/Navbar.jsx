import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/experiences', label: 'Experiences' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/contact', label: 'Contact' }
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="pill-nav__surface">
        <div className="pill-nav__track">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === '/blogs' && location.pathname.startsWith('/blogs/'));

            return (
            <Link
              key={item.path}
              to={item.path}
              className="pill-nav__item"
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="pill-nav__label">{item.label}</span>
            </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
