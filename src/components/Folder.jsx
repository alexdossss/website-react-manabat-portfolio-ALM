import React, { useCallback, useMemo, useState } from 'react';
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
  size = 1,
  items = [],
  className = '',
  onClick = null,
  isSelected = false,
  open: controlledOpen = null,
  isImage = false
}) => {
  const maxItems = 3;
  const papers = useMemo(() => items.slice(0, maxItems), [items]);
  const [internalOpen, setInternalOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(() => createOffsets(papers.length));
  const open = controlledOpen !== null ? controlledOpen : internalOpen;
  const activeColor = isSelected ? '#6f9cde' : color;
  const folderBackColor = useMemo(() => darkenColor(activeColor, 0.08), [activeColor]);
  const paper1 = useMemo(() => darkenColor('#ffffff', 0.1), []);
  const paper2 = useMemo(() => darkenColor('#ffffff', 0.05), []);
  const paper3 = '#ffffff';

  const handleClick = useCallback(() => {
    const nextOpen = !open;

    if (controlledOpen === null) {
      setInternalOpen(nextOpen);
    }

    onClick?.(nextOpen);

    if (nextOpen) {
      setPaperOffsets(createOffsets(papers.length));
    }
  }, [controlledOpen, onClick, open, papers.length]);

  const handlePaperMouseMove = useCallback((event, index) => {
    if (!open) return;

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
  }, [open]);

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

  const folderClassName = `folder ${open ? 'open' : ''} ${isSelected ? 'selected' : ''}`.trim();
  const scaleStyle = useMemo(() => ({ transform: `scale(${size})` }), [size]);

  return (
    <div style={scaleStyle} className={className}>
      <div className={folderClassName} style={folderStyle} onClick={handleClick}>
        <div className="folder__back">
          {papers.map((item, index) => {
            const offset = paperOffsets[index] ?? { x: 0, y: 0 };

            return (
              <div
                key={`${item}-${index}`}
                className={`paper paper-${index + 1}`}
                onMouseMove={(event) => handlePaperMouseMove(event, index)}
                onMouseLeave={() => handlePaperMouseLeave(index)}
                style={
                  open
                    ? {
                        '--magnet-x': `${offset.x}px`,
                        '--magnet-y': `${offset.y}px`,
                        transform: getPaperTransform(index)
                      }
                    : {}
                }
              >
                <div className="paper-content" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isImage ? (
                    <img
                      src={item}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{
                        maxWidth: '80%',
                        maxHeight: '80%',
                        objectFit: 'contain',
                        pointerEvents: 'none'
                      }}
                    />
                  ) : (
                    item
                  )}
                </div>
              </div>
            );
          })}
          <div className="folder__front"></div>
          <div className="folder__front right"></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Folder);
