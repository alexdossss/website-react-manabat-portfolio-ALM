import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// Preload the profile image into the browser cache so it loads instantly
if (typeof window !== 'undefined') {
  const img = new Image();
  img.src = '/images/manabat_full_body.jpg';
}

function Lanyard({ position = [0, 0, 20], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  const wrapperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [ropeWidth, setRopeWidth] = useState(2.5);
  const [hitScale, setHitScale] = useState(1);

  const camera = useMemo(() => ({ position, fov }), [position, fov]);
  const dpr = useMemo(() => [1, isMobile ? 1.25 : 1.75], [isMobile]);
  const glConfig = useMemo(() => ({
    alpha: transparent,
    antialias: !isMobile,
    powerPreference: 'high-performance'
  }), [isMobile, transparent]);

  const handleCreated = useCallback(({ gl }) => {
    gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
  }, [transparent]);

  useLayoutEffect(() => {
    const syncMobile = () => setIsMobile(window.innerWidth < 768);
    syncMobile();
    window.addEventListener('resize', syncMobile);
    return () => window.removeEventListener('resize', syncMobile);
  }, []);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const checkSize = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setIsReady(true);
      } else {
        setIsReady(false);
      }
    };
    
    checkSize();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(checkSize);
    observer?.observe(wrapper);
    return () => observer?.disconnect();
  }, []);

  useLayoutEffect(() => {
    const syncFromCSS = () => {
      if (!wrapperRef.current) return;
      const styles = window.getComputedStyle(wrapperRef.current);
      const nextRopeWidth = parseFloat(styles.getPropertyValue('--lanyard-rope-width'));
      const nextHitScale = parseFloat(styles.getPropertyValue('--lanyard-hit-scale'));
      setRopeWidth(Number.isFinite(nextRopeWidth) ? nextRopeWidth : 2.5);
      setHitScale(Number.isFinite(nextHitScale) ? nextHitScale : 1);
    };
    syncFromCSS();
    window.addEventListener('resize', syncFromCSS);
    return () => window.removeEventListener('resize', syncFromCSS);
  }, []);

  return (
    <div className="lanyard-wrapper" ref={wrapperRef} style={{ width: '100%', height: '100%', minHeight: '100px' }}>
      {isReady && (
        <Canvas
          camera={camera}
          dpr={dpr}
          gl={glConfig}
          onCreated={handleCreated}
        >
          <ambientLight intensity={Math.PI} />
          {/* SUSPENSE WRAPS PHYSICS to prevent Rapier crash when Band suspends */}
          <Suspense fallback={null}>
            <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                <Band isMobile={isMobile} ropeWidth={ropeWidth} hitScale={hitScale} />
            </Physics>
          </Suspense>

          <Environment blur={0.75}>
            <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>
        </Canvas>
      )}
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, ropeWidth = 2.5, hitScale = 1 }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const segmentProps = useMemo(() => ({
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  }), []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]), []);

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const profileTexture = useLoader(THREE.TextureLoader, '/images/manabat_full_body.jpg');
  
  const backTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = '#0066ff';
    context.fillRect(0, 0, 512, 512);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'white';
    context.font = 'bold 42px Inter, Arial';
    context.fillText('WEB DEVELOPER', 256, 260);
    context.font = '32px Inter, Arial';
    context.fillText('UI/UX DESIGNER', 256, 200);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = '#0066ff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    context.lineWidth = 4;
    for (let index = 0; index < canvas.width; index += 25) {
      context.beginPath();
      context.moveTo(index, 0);
      context.lineTo(index + 12, canvas.height / 2);
      context.lineTo(index, canvas.height);
      context.stroke();
    }
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(-1, 1);
    context.rotate(Math.PI);
    context.fillStyle = 'white';
    context.font = 'bold 60px Inter, Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('FULL STACK WEB DEVELOPER - UI/UX DESIGNER - FULL STACK WEB DEVELOPER - UI/UX DESIGNER', 0, 0);
    context.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, []);

  profileTexture.colorSpace = THREE.SRGBColorSpace;
  curve.curveType = 'chordal';

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.7]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.7]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.7]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.1, 0]]);

  useEffect(() => {
    if (!hovered) return;

    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const fixedBody = fixed.current;
    const firstJoint = j1.current;
    const secondJoint = j2.current;
    const thirdJoint = j3.current;
    const cardBody = card.current;
    const bandMesh = band.current;

    if (!fixedBody || !firstJoint || !secondJoint || !thirdJoint || !cardBody || !bandMesh) return;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      cardBody.wakeUp();
      firstJoint.wakeUp();
      secondJoint.wakeUp();
      thirdJoint.wakeUp();
      fixedBody.wakeUp();
      cardBody.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (!firstJoint.lerped) firstJoint.lerped = new THREE.Vector3().copy(firstJoint.translation());
    if (!secondJoint.lerped) secondJoint.lerped = new THREE.Vector3().copy(secondJoint.translation());

    const firstDistance = Math.max(0.1, Math.min(1, firstJoint.lerped.distanceTo(firstJoint.translation())));
    const secondDistance = Math.max(0.1, Math.min(1, secondJoint.lerped.distanceTo(secondJoint.translation())));

    firstJoint.lerped.lerp(firstJoint.translation(), delta * (minSpeed + firstDistance * (maxSpeed - minSpeed)));
    secondJoint.lerped.lerp(secondJoint.translation(), delta * (minSpeed + secondDistance * (maxSpeed - minSpeed)));

    curve.points[0].copy(thirdJoint.translation());
    curve.points[1].copy(secondJoint.lerped);
    curve.points[2].copy(firstJoint.lerped);
    curve.points[3].copy(fixedBody.translation());
    bandMesh.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
    ang.copy(cardBody.angvel());
    rot.copy(cardBody.rotation());
    cardBody.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, 4.5, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.95, 1.25, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.15]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(event) => {
              event.target.releasePointerCapture(event.pointerId);
              drag(false);
            }}
            onPointerDown={(event) => {
              event.target.setPointerCapture(event.pointerId);
              drag(new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <group>
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[1.9 * hitScale, 2.4 * hitScale]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
              <mesh>
                <boxGeometry args={[1.9, 2.4, 0.02]} />
                <meshStandardMaterial color="#ffffff" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[1.8, 2.3]} />
                <meshStandardMaterial map={profileTexture} transparent toneMapped={false} />
              </mesh>
              <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[1.8, 2.3]} />
                <meshStandardMaterial map={backTexture} transparent />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.95, 2.45, 0.01]} />
                <meshStandardMaterial color="#0066ff" metalness={0.1} roughness={0.4} />
              </mesh>
            </group>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={canvasTexture}
          repeat={[1, 1]}
          lineWidth={ropeWidth}
        />
      </mesh>
    </>
  );
}

export default React.memo(Lanyard);
