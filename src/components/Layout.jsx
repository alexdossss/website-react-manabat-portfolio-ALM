import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import FloatingBlobBackground from './FloatingBlobBackground';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const mainContentRef = useRef(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <FloatingBlobBackground />
      <Header />
      <main className="main-content" ref={mainContentRef}>
        <div className="page-transition">
          {children}
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default React.memo(Layout);
