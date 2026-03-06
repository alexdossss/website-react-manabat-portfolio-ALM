import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="page-transition">
          {children}
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;
