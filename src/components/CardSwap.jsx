import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import '../styles/card-swap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 1,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = forwardRef(({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  pauseOnHoverRefs = [],
  onCardClick,
  onCardChange,
  activeIndex = 0,
  skewAmount = 6,
  easing = 'elastic',
  children
}, ref) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const lastActiveIndexRef = useRef(-1);

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);
  const tiltTweensRef = useRef({});
  const pendingActiveIndexRef = useRef(null);
  const hoverCountRef = useRef(0);

  useEffect(() => {
    const total = refs.length;
    
    // Always reorder when activeIndex changes OR on initial mount (when lastActiveIndexRef is -1)
    if (activeIndex !== lastActiveIndexRef.current && refs.length > 0) {
      // If an animation is currently running:
      // - Ignore the update if it's the index we just animated to.
      // - Otherwise, interrupt the animation and snap to the requested index.
      if (tlRef.current) {
        if (pendingActiveIndexRef.current === activeIndex) {
          lastActiveIndexRef.current = activeIndex;
          return;
        }
        tlRef.current.kill();
        tlRef.current = null;
        pendingActiveIndexRef.current = null;
      }

      lastActiveIndexRef.current = activeIndex;
      const newOrder = Array.from({ length: refs.length }, (_, i) => (activeIndex + i) % refs.length);
      order.current = newOrder;
      
      // Position refs according to newOrder: refs[newOrder[i]] goes to slot i
      refs.forEach((_, slotIndex) => {
        const refIndex = newOrder[slotIndex];
        placeNow(refs[refIndex].current, makeSlot(slotIndex, cardDistance, verticalDistance, total), skewAmount);
      });
    }
  }, [activeIndex, cardDistance, verticalDistance, skewAmount, onCardChange, refs.length]);

  useEffect(() => {
    const total = refs.length;

    // Initial positioning on mount (BEFORE auto-cycling starts)
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;
      if (tlRef.current?.isActive?.()) return;

      const [front, ...rest] = order.current;

      // ensure refs exist
      if (!refs[front]?.current) return;

      // kill any running timeline to avoid overlap
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      // ensure starting positions are correct (use current order)
      order.current.forEach((idx, slotIndex) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length);
        placeNow(el, slot, skewAmount);
      });

      // Determine the next front index but DO NOT mutate order yet
      const nextFront = rest[0];

      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Drop front card with slight z-index lift so it looks above others while dropping
      tl.set(elFront, { zIndex: refs.length + 1 });
      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      // While front drops, promote remaining cards forward with stagger
      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      tl.call(() => {
        pendingActiveIndexRef.current = nextFront;
        onCardChange?.(nextFront);
      }, undefined, 'promote');
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        // update zIndex at promote so stacking looks correct
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.12}`
        );
      });

      // Return front to back position
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, 'return');
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      // After animation completes, commit the new order
      tl.call(() => {
        order.current = [...rest, front];
        pendingActiveIndexRef.current = null;
      });
    };

    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If delay is <= 0, autoplay is disabled and the parent is expected to drive transitions.
    if (!delay || delay <= 0) return;

    // Start interval WITHOUT calling swap() immediately - let initial positioning take effect first
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover && container.current) {
      const nodesToMonitor = [
        container.current,
        ...pauseOnHoverRefs
          .filter(ref => ref && ref.current)
          .map(ref => ref.current)
      ];

      const pause = () => {
        hoverCountRef.current += 1;
        tlRef.current?.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      const resume = () => {
        hoverCountRef.current = Math.max(0, hoverCountRef.current - 1);
        if (hoverCountRef.current !== 0) return;
        tlRef.current?.play();
        if (!intervalRef.current) intervalRef.current = window.setInterval(swap, delay);
      };

      nodesToMonitor.forEach(node => {
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
      });

      return () => {
        nodesToMonitor.forEach(node => {
          node.removeEventListener('mouseenter', pause);
          node.removeEventListener('mouseleave', resume);
        });
        hoverCountRef.current = 0;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [delay, pauseOnHover, cardDistance, verticalDistance, skewAmount, pauseOnHoverRefs, onCardChange, refs.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // kill any tilt tweens
      Object.values(tiltTweensRef.current).forEach(t => t?.kill && t.kill());
    };
  }, []);

  // Expose animation functions to parent
  useImperativeHandle(ref, () => ({
    animateNext: () => {
      if (order.current.length < 2) return;
      if (tlRef.current?.isActive?.()) {
        try {
          tlRef.current.progress(1);
        } catch (err) {
          // ignore
        }
        tlRef.current.kill();
        tlRef.current = null;
        pendingActiveIndexRef.current = null;
      }

      const [front, ...rest] = order.current;

      // Determine the next front index, but only notify when the swap visually starts.
      const nextFront = rest[0];

      const elFront = refs[front].current;

      // kill any running timeline
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      // ensure starting positions
      order.current.forEach((idx, slotIndex) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length);
        placeNow(el, slot, skewAmount);
      });

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.set(elFront, { zIndex: refs.length + 1 });
      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      tl.call(() => {
        pendingActiveIndexRef.current = nextFront;
        onCardChange?.(nextFront);
      }, undefined, 'promote');
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.12}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      }, undefined, 'return');
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      // Commit order after animation
      tl.call(() => {
        order.current = [...rest, front];
        pendingActiveIndexRef.current = null;
      });
    },

    animatePrevious: () => {
      if (order.current.length < 2) return;
      if (tlRef.current?.isActive?.()) {
        try {
          tlRef.current.progress(1);
        } catch (err) {
          // ignore
        }
        tlRef.current.kill();
        tlRef.current = null;
        pendingActiveIndexRef.current = null;
      }

      const [front, ...rest] = order.current;
      const back = order.current[order.current.length - 1];

      // Determine new front (back). Notify when the reverse animation starts so React
      // doesn't snap the stack to the new index before GSAP animates.
      const nextFront = back;

      // ensure back ref exists
      if (!refs[back]?.current) return;

      // kill any running timeline
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      // ensure starting positions
      order.current.forEach((idx, slotIndex) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length);
        placeNow(el, slot, skewAmount);
      });

      const elBack = refs[back].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Reverse of Next:
      // 1) Lift the back card up (mirror of front dropping down)
      // 2) Shift the stack backward while the lift is happening (mirrors "promote")
      // 3) Settle the lifted card into the front slot (mirrors "return")
      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      tl.set(elBack, { zIndex: refs.length + 1 });
      tl.to(elBack, {
        y: '-=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      tl.call(() => {
        pendingActiveIndexRef.current = nextFront;
        onCardChange?.(nextFront);
      }, undefined, 'promote');

      const shiftOrder = [front, ...rest.slice(0, -1)];
      shiftOrder.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i + 1, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.12}`
        );
      });

      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elBack, { zIndex: frontSlot.zIndex }), undefined, 'return');
      tl.to(
        elBack,
        {
          x: frontSlot.x,
          y: frontSlot.y,
          z: frontSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      // Commit order after animation
      tl.call(() => {
        order.current = [back, front, ...rest.slice(0, -1)];
        pendingActiveIndexRef.current = null;
      });
    }
  }), [onCardChange, refs, cardDistance, verticalDistance, config, skewAmount]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
          onMouseMove: e => {
            child.props.onMouseMove?.(e);
            // only tilt the front card's container
            try {
              if (order.current[0] !== i) return;
              const el = refs[i]?.current;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const relX = e.clientX - rect.left;
              const relY = e.clientY - rect.top;
              const px = (relX / rect.width - 0.5) * 2; // -1 .. 1
              const py = (relY / rect.height - 0.5) * 2; // -1 .. 1
              const maxRot = 12;
              const rotY = px * maxRot;
              const rotX = -py * maxRot;
              // kill previous tilt tween for this card
              tiltTweensRef.current[i]?.kill?.();
              tiltTweensRef.current[i] = gsap.to(el, {
                rotationY: rotY,
                rotationX: rotX,
                scale: 1.03,
                duration: 0.28,
                ease: 'power3.out',
                transformPerspective: 800,
                transformOrigin: 'center center'
              });
            } catch (err) {
              // ignore
            }
          },
          onMouseEnter: e => {
            child.props.onMouseEnter?.(e);
            try {
              if (order.current[0] !== i) return;
              const el = refs[i]?.current;
              if (!el) return;
              // bring slightly forward
              tiltTweensRef.current[i]?.kill?.();
              tiltTweensRef.current[i] = gsap.to(el, {
                scale: 1.02,
                duration: 0.2,
                ease: 'power3.out'
              });
            } catch (err) {}
          },
          onMouseLeave: e => {
            child.props.onMouseLeave?.(e);
            try {
              const el = refs[i]?.current;
              if (!el) return;
              tiltTweensRef.current[i]?.kill?.();
              tiltTweensRef.current[i] = gsap.to(el, {
                rotationY: 0,
                rotationX: 0,
                scale: 1,
                duration: 0.45,
                ease: 'power3.out'
              });
            } catch (err) {}
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
});
CardSwap.displayName = 'CardSwap';

export default React.memo(CardSwap);
