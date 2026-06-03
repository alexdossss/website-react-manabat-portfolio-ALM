/* eslint-disable react/no-unknown-property */
'use client';
import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

function Lanyard({ position = [0, 0, 20], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const wrapperRef = useRef(null);
  const [ropeWidth, setRopeWidth] = useState(2.5);
  const [hitScale, setHitScale] = useState(1);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const syncFromCSS = () => {
      if (typeof window === 'undefined' || !wrapperRef.current) return;
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
    <div className="lanyard-wrapper" ref={wrapperRef}>
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Suspense fallback={null}>
            <Band isMobile={isMobile} ropeWidth={ropeWidth} hitScale={hitScale} />
          </Suspense>
        </Physics>

        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, ropeWidth = 2.5, hitScale = 1 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  /* FRONT IMAGE */
  const profileTexture = useLoader(THREE.TextureLoader, '/images/manabat_full_body.jpg');
  profileTexture.colorSpace = THREE.SRGBColorSpace;

  /* BACK TEXTURE (CARD) */
/* BACK TEXTURE (CARD) */
const backTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0066ff'; 
    ctx.fillRect(0, 0, 512, 512);

    // REMOVED: ctx.translate(512, 0);
    // REMOVED: ctx.scale(-1, 1);

     // Text Styling
     ctx.textAlign = 'center'; 
    ctx.textBaseline = 'middle'; 
    ctx.fillStyle = 'white';
     ctx.font = 'bold 42px Inter, Arial'; 
    ctx.fillText('WEB DEVELOPER', 256, 260);
    ctx.font = '32px Inter, Arial'; 
     ctx.fillText('UI/UX DESIGNER', 256, 200);

     const tex = new THREE.CanvasTexture(canvas);
     tex.colorSpace = THREE.SRGBColorSpace;
     return tex;
  }, []);

  useRopeJoint(fixed, j1, [[0,0,0],[0,0,0],0.7]);
  useRopeJoint(j1, j2, [[0,0,0],[0,0,0],0.7]);
  useRopeJoint(j2, j3, [[0,0,0],[0,0,0],0.7]);
  useSphericalJoint(j3, card, [[0,0,0],[0,1.1,0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card,j1,j2,j3,fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1,j2].forEach(ref => {
        if(!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1,Math.min(1,ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta*(minSpeed+clampedDistance*(maxSpeed-minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel()); rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  const canvasTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(createLanyardTexture());
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }, []);

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0,4,0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0,4.5,0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1,0,0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5,0,0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2,0,0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.95,1.25,0.01]} />
          <group
            scale={2.25}
            position={[0,-1.2,-0.15]}
            onPointerOver={()=>hover(true)}
            onPointerOut={()=>hover(false)}
            onPointerUp={(e)=>(e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e)=>(e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
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
          resolution={isMobile ? [1000,2000] : [1000,1000]} 
          useMap 
          map={canvasTexture} 
          repeat={[1, 1]} 
          lineWidth={ropeWidth} 
        />
      </mesh>
    </>
  );
}

function createLanyardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; 
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#0066ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Woven Pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 4;
  for (let i = 0; i < canvas.width; i += 25) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 12, canvas.height / 2);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }

  // FIX: Reset and Flip Logic
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  // Flip the context so it appears correctly on the 3D rope
  // We flip X and then rotate 180 (which is effectively flipping Y)
  ctx.scale(-1, 1); 
  ctx.rotate(Math.PI); 

  ctx.fillStyle = 'white';
  ctx.font = 'bold 60px Inter, Arial'; 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = "FULL STACK WEB DEVELOPER  •  UI/UX DESIGNER  •  FULL STACK WEB DEVELOPER  •  UI/UX DESIGNER";
  
  ctx.fillText(text, 0, 0);
  ctx.restore();
  
  return canvas;
}

export default React.memo(Lanyard);
