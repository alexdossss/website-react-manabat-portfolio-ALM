import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Folder.css';

const createOffsets = (length) => Array.from({ length }, () => ({ x: 0, y: 0 }));

const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;

  if (color.length === 3) {
    color = color.split('').map((character) => character + character).join('');
  }

  const colorValue = parseInt(color, 16);
  let red = (colorValue >> 16) & 0xff;
  let green = (colorValue >> 8) & 0xff;
  let blue = colorValue & 0xff;

  red = Math.max(0, Math.min(255, Math.floor(red * (1 - percent))));
  green = Math.max(0, Math.min(255, Math.floor(green * (1 - percent))));
  blue = Math.max(0, Math.min(255, Math.floor(blue * (1 - percent))));

  return '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1).toUpperCase();
};

const getPaperTransform = (index) => {
  if (index === 0) {
    return 'translate(calc(-120% + var(--magnet-x)), calc(-70% + var(--magnet-y))) rotateZ(-15deg)';
  }

  if (index === 1) {
    return 'translate(calc(10% + var(--magnet-x)), calc(-70% + var(--magnet-y))) rotateZ(15deg)';
  }

  return 'translate(calc(-50% + var(--magnet-x)), calc(-100% + var(--magnet-y))) rotateZ(5deg)';
};

const Folder = ({
  color = '#0066ff',
  items = [],
  className = '',
  onClick = null,
  isSelected = false,
  isImage = false,
  label = 'Folder'
}) => {
  const maxItems = 3;
  const papers = useMemo(() => items.slice(0, maxItems), [items]);
  const [paperOffsets, setPaperOffsets] = useState(() => createOffsets(papers.length));
  const [revealedCount, setRevealedCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const previewTimerRef = useRef(null);
  const activeColor = isSelected ? '#6f9cde' : color;
  const folderBackColor = useMemo(() => darkenColor(activeColor, 0.08), [activeColor]);
  const paper1 = useMemo(() => darkenColor('#ffffff', 0.1), []);
  const paper2 = useMemo(() => darkenColor('#ffffff', 0.05), []);
  const paper3 = '#ffffff';
  const visibleCount = isSelected
    ? isReady ? papers.length : 0
    : isHovered || isFocused ? revealedCount : 0;

  const startPreview = useCallback(() => {
    if (!papers.length) return;

    window.clearInterval(previewTimerRef.current);
    setPaperOffsets(createOffsets(papers.length));
    setRevealedCount(1);

    if (papers.length > 1) {
      previewTimerRef.current = window.setInterval(() => {
        setRevealedCount((currentCount) => {
          if (currentCount >= papers.length) {
            window.clearInterval(previewTimerRef.current);
            previewTimerRef.current = null;
            return currentCount;
          }

          return currentCount + 1;
        });
      }, 500);
    }
  }, [papers.length]);

  const stopPreview = useCallback(() => {
    window.clearInterval(previewTimerRef.current);
    previewTimerRef.current = null;
    setRevealedCount(isSelected ? Math.min(1, papers.length) : 0);
  }, [isSelected, papers.length]);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    startPreview();
  }, [startPreview]);

  const handlePointerLeave = useCallback((event) => {
    setIsHovered(false);
    if (!event.currentTarget.matches(':focus-visible')) setIsFocused(false);
    if (!event.currentTarget.matches(':focus-visible')) stopPreview();
  }, [stopPreview]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    startPreview();
  }, [startPreview]);

  const handleBlur = useCallback((event) => {
    setIsFocused(false);
    if (!isHovered && !event.currentTarget.matches(':hover')) stopPreview();
  }, [isHovered, stopPreview]);

  const handleClick = useCallback(() => {
    startPreview();
    onClick?.(!isSelected);
  }, [isSelected, onClick, startPreview]);

  useEffect(() => () => {
    window.clearInterval(previewTimerRef.current);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const handlePaperMouseMove = useCallback((event, index) => {
    if (index >= revealedCount) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (event.clientX - centerX) * 0.15;
    const offsetY = (event.clientY - centerY) * 0.15;

    setPaperOffsets((previousOffsets) => {
      const nextOffsets = [...previousOffsets];
      nextOffsets[index] = { x: offsetX, y: offsetY };
      return nextOffsets;
    });
  }, [revealedCount]);

  const handlePaperMouseLeave = useCallback((index) => {
    setPaperOffsets((previousOffsets) => {
      const nextOffsets = [...previousOffsets];
      nextOffsets[index] = { x: 0, y: 0 };
      return nextOffsets;
    });
  }, []);

  const folderStyle = useMemo(() => ({
    '--folder-color': activeColor,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3
  }), [activeColor, folderBackColor, paper1, paper2, paper3]);

  return (
    <button
      type="button"
      className={`folder ${visibleCount > 0 ? 'previewing' : ''} ${isSelected ? 'selected' : ''} ${className}`.trim()}
      style={folderStyle}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={`${label} folder`}
      aria-pressed={isSelected}
    >
      <span className="folder__art" aria-hidden="true">
        <span className="folder__back">
          {papers.map((item, index) => {
            const offset = paperOffsets[index] ?? { x: 0, y: 0 };
            const isRevealed = index < visibleCount;
            const image = typeof item === 'string' ? item : item.src;
            const imageAlt = typeof item === 'string' ? '' : item.alt;

            return (
              <span
                key={`${item}-${index}`}
                className={`paper paper-${index + 1} ${isRevealed ? 'is-revealed' : ''}`}
                onMouseMove={(event) => handlePaperMouseMove(event, index)}
                onMouseLeave={() => handlePaperMouseLeave(index)}
                style={{
                  '--magnet-x': `${offset.x}px`,
                  '--magnet-y': `${offset.y}px`,
                  '--paper-transform': getPaperTransform(index)
                }}
              >
                <span className="paper-content">
                    {isImage ? (
                      <img
                        src={image}
                        alt={imageAlt}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      item
                    )}
                </span>
              </span>
            );
          })}
          <span className="folder__front" />
          <span className="folder__front right" />
        </span>
      </span>
      <span className="folder__label">{label}</span>
    </button>
  );
};

export default React.memo(Folder);
