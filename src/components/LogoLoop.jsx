import React, { useCallback, useMemo, useRef } from 'react';
import '../styles/logo-loop.css';

const LogoLoop = ({ languages = [], direction = 'right', speed = 30, gap = 65, logoHeight = 55 }) => {
  const scrollRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, scrollLeft: 0 });

  const loopLanguages = useMemo(() => [...languages, ...languages], [languages]);
  const animationDuration = useMemo(() => `${(100 - speed) / 2}s`, [speed]);
  const scrollStyle = useMemo(() => ({
    '--animation-duration': animationDuration,
    '--gap': `${gap}px`,
    '--logo-height': `${logoHeight}px`,
    '--scroll-direction': direction === 'left' ? 'reverse' : 'normal',
  }), [animationDuration, direction, gap, logoHeight]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (!scrollRef.current) return;
    scrollRef.current.style.animationPlayState = 'paused';
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    isDraggingRef.current = false;
    if (!scrollRef.current) return;
    scrollRef.current.style.animationPlayState = 'running';
    scrollRef.current.style.cursor = 'grab';
  }, []);

  const handleMouseDown = useCallback((event) => {
    const scrollElement = scrollRef.current;
    if (!isHoveredRef.current || !scrollElement) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      startX: event.pageX - scrollElement.offsetLeft,
      scrollLeft: scrollElement.scrollLeft,
    };
    scrollElement.style.cursor = 'grabbing';
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    if (!scrollRef.current) return;
    scrollRef.current.style.cursor = 'grab';
  }, []);

  const handleMouseMove = useCallback((event) => {
    const scrollElement = scrollRef.current;
    if (!isDraggingRef.current || !scrollElement) return;

    event.preventDefault();
    const x = event.pageX - scrollElement.offsetLeft;
    const walk = (x - dragStartRef.current.startX) * 2;
    scrollElement.scrollLeft = dragStartRef.current.scrollLeft - walk;
  }, []);

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
        style={scrollStyle}
      >
        <div className="logo-loop-content">
          {loopLanguages.map((lang, index) => (
            <div key={`${lang.name}-${index}`} className="logo-item">
              <img src={lang.img} alt={lang.name} loading="lazy" decoding="async" />
              <p>{lang.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LogoLoop);
