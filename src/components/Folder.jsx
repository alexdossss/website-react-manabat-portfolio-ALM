import { useState, useEffect } from 'react';
import './Folder.css';

const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder = ({ 
  color = '#0066ff', 
  size = 1, 
  items = [], 
  className = '', 
  onClick = null, 
  isSelected = false, 
  open: controlledOpen = null,
  isImage = false // <-- Added this prop
}) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== null ? controlledOpen : internalOpen;
  
  const [paperOffsets, setPaperOffsets] = useState(Array.from({ length: papers.length }, () => ({ x: 0, y: 0 })));

  useEffect(() => {
    setPaperOffsets(Array.from({ length: papers.length }, () => ({ x: 0, y: 0 })));
  }, [papers.length]);

  const activeColor = isSelected ? '#6f9cde' : color;
  const folderBackColor = darkenColor(activeColor, 0.08);
  
  const paper1 = darkenColor('#ffffff', 0.1);
  const paper2 = darkenColor('#ffffff', 0.05);
  const paper3 = '#ffffff';

  const handleClick = () => {
    const newOpen = !open;
    if (controlledOpen === null) {
      setInternalOpen(newOpen);
    }
    if (onClick) {
      onClick(newOpen);
    }
    if (newOpen) {
      setPaperOffsets(Array.from({ length: papers.length }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e, index) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      if (newOffsets[index]) {
        newOffsets[index] = { x: offsetX, y: offsetY };
      }
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (e, index) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      if (newOffsets[index]) {
        newOffsets[index] = { x: 0, y: 0 };
      }
      return newOffsets;
    });
  };

  const folderStyle = {
    '--folder-color': activeColor,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3
  };

  const folderClassName = `folder ${open ? 'open' : ''} ${isSelected ? 'selected' : ''}`.trim();
  const scaleStyle = { transform: `scale(${size})` };

  return (
    <div style={scaleStyle} className={className}>
      <div className={folderClassName} style={folderStyle} onClick={handleClick}>
        <div className="folder__back">
        {papers.map((item, i) => (
          <div
            key={i}
            className={`paper paper-${i + 1}`}
            onMouseMove={e => handlePaperMouseMove(e, i)}
            onMouseLeave={e => handlePaperMouseLeave(e, i)}
            style={
              open
                ? {
                    '--magnet-x': `${paperOffsets[i]?.x || 0}px`,
                    '--magnet-y': `${paperOffsets[i]?.y || 0}px`,
                    // This combines the CSS centering with the magnet effect
                    transform: i === 0 
                      ? `translate(calc(-120% + var(--magnet-x)), calc(-70% + var(--magnet-y))) rotateZ(-15deg)`
                      : i === 1
                      ? `translate(calc(10% + var(--magnet-x)), calc(-70% + var(--magnet-y))) rotateZ(15deg)`
                      : `translate(calc(-50% + var(--magnet-x)), calc(-100% + var(--magnet-y))) rotateZ(5deg)`
                  }
                : {}
            }
          >
            <div className="paper-content" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isImage ? (
                <img 
                  src={item} 
                  alt="" 
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
        ))}
          <div className="folder__front"></div>
          <div className="folder__front right"></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;