import React, { useRef, useState } from 'react';
import '../styles/logo-loop.css';

const LogoLoop = ({ languages, direction = 'right', speed = 30, gap = 65, logoHeight = 55 }) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (scrollRef.current) {
      scrollRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.animationPlayState = 'running';
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseDown = (e) => {
    if (!isHovered) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const getAnimationDuration = (speed) => {
    return `${(100 - speed) / 2}s`;
  };

  return (
    <div 
      className="logo-loop-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={scrollRef}
        className="logo-loop-scroll"
        style={{
          '--animation-duration': getAnimationDuration(speed),
          '--gap': `${gap}px`,
          '--logo-height': `${logoHeight}px`,
        }}
      >
        <div className="logo-loop-content">
          {/* Original set */}
          {languages.map((lang, idx) => (
            <div key={idx} className="logo-item">
              <img src={lang.img} alt={lang.name} />
              <p>{lang.name}</p>
            </div>
          ))}
          {/* Duplicate for infinite scroll */}
          {languages.map((lang, idx) => (
            <div key={`duplicate-${idx}`} className="logo-item">
              <img src={lang.img} alt={lang.name} />
              <p>{lang.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LogoLoop);
