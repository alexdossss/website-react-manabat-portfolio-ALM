import '../styles/floating-blob-background.css';
import React, { useMemo } from 'react';

const BLOBS_DATA = [
  { id: 1, colors: ['#00C6FF', '#0072FF'], duration: '9s', delay: '0s' },
  { id: 2, colors: ['#00E0FF', '#005BEA'], duration: '11s', delay: '1s' },
  { id: 3, colors: ['#33D6FF', '#0061FF'], duration: '10s', delay: '2s' },
  { id: 4, colors: ['#00B4FF', '#0048FF'], duration: '12s', delay: '0.5s' },
];

function FloatingBlobBackground() {
  const blobs = useMemo(() => (
    BLOBS_DATA.map((blob) => ({
      ...blob,
      style: {
        background: `radial-gradient(circle at 30% 40%, ${blob.colors[0]}, ${blob.colors[1]})`,
        animation: `float-blob-${blob.id} ${blob.duration} ${blob.delay} infinite ease-in-out`,
      },
    }))
  ), []);

  return (
    <div className="floating-blobs-container">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className={`blob blob-${blob.id}`}
          style={blob.style}
        />
      ))}
    </div>
  );
}

export default React.memo(FloatingBlobBackground);
