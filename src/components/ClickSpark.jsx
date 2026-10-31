import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ClickSpark = ({
  children,
  className = '',
  style,
  sparkColor = '#ffffff',
  sparkCount = 8,
  sparkSize = 14,
  sparkRadius = 30,
  sparkWidth = 2,
  duration = 500,
  spread = 360,
  direction = 0,
  disabled = false
}) => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    settingsRef.current = {
      colors: Array.isArray(sparkColor) ? sparkColor : [sparkColor],
      count: clamp(Math.round(sparkCount), 1, 64),
      size: Math.max(0, sparkSize),
      radius: Math.max(0, sparkRadius),
      width: Math.max(0.5, sparkWidth),
      duration: Math.max(60, duration),
      spread: clamp(spread, 0, 360),
      direction,
      disabled
    };
  }, [sparkColor, sparkCount, sparkSize, sparkRadius, sparkWidth, duration, spread, direction, disabled]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!root || !canvas || !context) return undefined;

    let frame = 0;
    let bursts = [];
    let width = 0;
    let height = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const bounds = root.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.ceil(width * pixelRatio);
      canvas.height = Math.ceil(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (timestamp) => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      bursts = bursts.filter((burst) => {
        const progress = (timestamp - burst.startedAt) / burst.duration;
        if (progress >= 1) return false;
        const eased = 1 - (1 - progress) ** 3;
        const fade = 1 - progress;

        burst.sparks.forEach((spark) => {
          const distance = burst.radius * spark.reach * eased;
          const length = burst.size * spark.scale * (1 - progress) ** 1.6;
          const x = burst.x + Math.cos(spark.angle) * distance;
          const y = burst.y + Math.sin(spark.angle) * distance;
          context.globalAlpha = fade;
          context.strokeStyle = spark.color;
          context.lineWidth = burst.width;
          context.lineCap = 'round';
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + Math.cos(spark.angle) * length, y + Math.sin(spark.angle) * length);
          context.stroke();
        });

        return true;
      });

      context.globalAlpha = 1;
      if (bursts.length) frame = requestAnimationFrame(draw);
    };

    const spawn = (event) => {
      const settings = settingsRef.current;
      if (settings.disabled || settings.colors.length === 0) return;

      const bounds = root.getBoundingClientRect();
      const arc = (settings.spread * Math.PI) / 180;
      const heading = ((settings.direction - 90) * Math.PI) / 180;
      const step = settings.count > 1 ? arc / (settings.count - 1) : 0;
      const full = settings.spread >= 359.5;
      const colorsStart = Math.floor(Math.random() * settings.colors.length);
      const sparks = Array.from({ length: settings.count }, (_, index) => {
        const angle = full
          ? heading + ((Math.PI * 2) / settings.count) * index
          : heading - arc / 2 + step * index;
        const color = settings.colors[(index + colorsStart) % settings.colors.length];

        return {
          angle: angle + (Math.random() - 0.5) * 0.12,
          color,
          reach: 0.82 + Math.random() * 0.36,
          scale: 0.75 + Math.random() * 0.5
        };
      });

      bursts.push({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        startedAt: performance.now(),
        duration: settings.duration,
        radius: settings.radius,
        size: settings.size,
        width: settings.width,
        sparks
      });
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    root.addEventListener('click', spawn);

    return () => {
      observer.disconnect();
      root.removeEventListener('click', spawn);
      cancelAnimationFrame(frame);
      bursts = [];
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <span
      ref={rootRef}
      className={className}
      style={{ position: 'relative', display: 'inline-flex', isolation: 'isolate', ...style }}
    >
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      />
    </span>
  );
};

export default ClickSpark;
