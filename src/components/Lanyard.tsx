/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

function Band({ maxSpeed = 50, minSpeed = 10, onDismiss, scrollJolt, clickJolt, onDragStart, onDragEnd, onPositionUpdate, onSnap, onSnapWarning }: { maxSpeed?: number; minSpeed?: number; onDismiss: () => void; scrollJolt: number; clickJolt: number; onDragStart: () => void; onDragEnd: () => void; onPositionUpdate: (x: number, y: number) => void; onSnap: () => void; onSnapWarning: (show: boolean) => void; }) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 5,
    linearDamping: 5
  };

  const { nodes, materials } = useGLTF('/card.glb') as any;
  const texture = useTexture('/lanyard.png');
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const lastPointerY = useRef(0);
  const pointerYBeforeLast = useRef(0);
  const vel = useRef([0, 0, 0]);
  const lastPos = useRef([0, 0, 0]);
  const dragStartScreenY = useRef(0);
  const initialCardScreenY = useRef(0); // Card's Y position when grabbed
  const maxStretchPercent = useRef(0);
  const maxPullDistance = useRef(0); // How far user pulled from grab point
  const screenHeight = useRef(0);
  const dragInitialized = useRef(false);
  const holdTimeAboveThreshold = useRef(0); // Track how long held above snap threshold
  const SNAP_HOLD_DURATION = 7; // Seconds to hold before auto-snap
  const SNAP_WARNING_START = 2; // Seconds before showing warning messages
  const [snapped, setSnapped] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useEffect(() => {
    if (scrollJolt !== 0 && j1.current) {
      j1.current.applyImpulse({ x: scrollJolt * 0.02, y: 0, z: 0 }, true);
    }
  }, [scrollJolt]);

  useEffect(() => {
    if (clickJolt !== 0 && j1.current && card.current) {
      console.log('Band: clickJolt received:', clickJolt);
      // Random direction for more natural shake
      const randomX = (Math.random() - 0.5) * 2;
      const randomZ = (Math.random() - 0.5) * 0.5;
      j1.current.applyImpulse({ x: randomX * 1.5, y: -0.5, z: randomZ }, true);
      card.current.applyImpulse({ x: randomX * 0.8, y: -0.3, z: randomZ * 0.5 }, true);
    }
  }, [clickJolt]);

  useFrame((state, delta) => {
    if (dragged) {
      // Initialize drag values on first frame of dragging
      if (!dragInitialized.current && fixed.current && card.current) {
        screenHeight.current = state.size.height;
        // Use the FIXED anchor point as reference for stretch calculation
        const fixedPos = fixed.current.translation();
        const fixedScreenPos = new THREE.Vector3(fixedPos.x, fixedPos.y, fixedPos.z);
        fixedScreenPos.project(state.camera);
        dragStartScreenY.current = (-fixedScreenPos.y * 0.5 + 0.5) * state.size.height;

        // Also record the card's INITIAL position when grabbed (to calculate pull distance)
        const cardPos = card.current.translation();
        const cardScreenPos = new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z);
        cardScreenPos.project(state.camera);
        initialCardScreenY.current = (-cardScreenPos.y * 0.5 + 0.5) * state.size.height;

        dragInitialized.current = true;
        console.log('Drag initialized - Fixed anchor Y:', dragStartScreenY.current, 'Initial card Y:', initialCardScreenY.current);
      }

      pointerYBeforeLast.current = lastPointerY.current;
      lastPointerY.current = state.pointer.y;
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      if (lastPos.current) {
        const [lx, ly, lz] = lastPos.current;
        const newVelX = (vec.x - lx) / delta;
        const newVelY = (vec.y - ly) / delta;
        const newVelZ = (vec.z - lz) / delta;
        vel.current = [newVelX, newVelY, newVelZ];
      }
      lastPos.current = [vec.x, vec.y, vec.z];

      // Track maximum stretch as percentage of screen height
      if (card.current && screenHeight.current > 0) {
        const worldPos = card.current.translation();
        const screenPos = new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z);
        screenPos.project(state.camera);
        const currentScreenY = (-screenPos.y * 0.5 + 0.5) * state.size.height;

        // Calculate stretch as percentage of screen height (from fixed anchor)
        const stretchPixels = currentScreenY - dragStartScreenY.current;
        const stretchPercent = (stretchPixels / screenHeight.current) * 100;

        // Calculate pull distance - how far user pulled from where they grabbed
        const pullPixels = currentScreenY - initialCardScreenY.current;
        const pullPercent = (pullPixels / screenHeight.current) * 100;

        if (stretchPercent > maxStretchPercent.current) {
          maxStretchPercent.current = stretchPercent;
        }
        if (pullPercent > maxPullDistance.current) {
          maxPullDistance.current = pullPercent;
        }

        // Track hold time above snap threshold (100% PULL from grab point)
        // Debug: Log pull percent (how far user pulled from where they grabbed)
        if (pullPercent > 10) {
          console.log('Pull:', pullPercent.toFixed(1) + '%', 'Hold time:', holdTimeAboveThreshold.current.toFixed(2) + 's');
        }

        // Use pullPercent for all thresholds - measures how far user PULLED
        if (pullPercent > 30 && !snapped) {
          holdTimeAboveThreshold.current += delta;

          // Show warning messages after SNAP_WARNING_START seconds
          if (holdTimeAboveThreshold.current >= SNAP_WARNING_START) {
            onSnapWarning(true);
          }

          // Auto-snap if held too long above threshold
          if (holdTimeAboveThreshold.current >= SNAP_HOLD_DURATION) {
            console.log('🔥 AUTO-SNAP TRIGGERED! Held above 100% pull for', SNAP_HOLD_DURATION, 'seconds');
            onSnapWarning(false);
            setSnapped(true);
            onSnap();
            // Release the drag
            drag(false);
          }
        } else if (pullPercent <= 30) {
          // Reset hold time if below threshold
          holdTimeAboveThreshold.current = 0;
          onSnapWarning(false);
        }
      }

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }

    if (fixed.current) {
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });

      if (card.current) {
        const worldPos = card.current.translation();
        const screenPosition = new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z);
        screenPosition.project(state.camera);
        const x = (screenPosition.x * 0.5 + 0.5) * state.size.width;
        const y = (-screenPosition.y * 0.5 + 0.5) * state.size.height;
        onPositionUpdate(x, y);
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[6, 6, 0]}>
        <RigidBody ref={fixed} type="fixed" {...segmentProps} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.08]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              onDragEnd();
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              drag(false);

              const [vx, vy, vz] = vel.current;

              console.log('Max Pull %:', maxPullDistance.current.toFixed(1));

              // Snap only happens via auto-snap (50% + 7s hold)
              // No manual snap on release anymore

              card.current.applyImpulse({ x: vx * 2, y: vy * 2, z: vz * 2 }, true);

              // Dismiss if user pulled more than 30%
              if (maxPullDistance.current > 30) {
                onDismiss();
              }
            }}
            onPointerDown={(e) => {
              onDragStart();
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              // Reset stretch tracking - values will be initialized in useFrame
              maxStretchPercent.current = 0;
              maxPullDistance.current = 0;
              dragInitialized.current = false;
              holdTimeAboveThreshold.current = 0;
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      {!snapped && (
        <mesh ref={band}>
          <meshLineGeometry />
          <meshLineMaterial
            color="white"
            depthTest={false}
            resolution={[1024, 1024]}
            useMap
            map={texture}
            repeat={[-3, 1]}
            lineWidth={1}
          />
        </mesh>
      )}
    </>
  );
}

export default function Lanyard({ onDismiss, scrollJolt, clickJolt, onSnap, language = 'tr' }: { onDismiss: () => void; scrollJolt: number; clickJolt: number; onSnap?: (message: string) => void; language?: 'tr' | 'en'; }) {
  const wittyMessages = language === 'tr' ? [
    'Hadi, daha hızlı fırlat!',
    'Yapabilirsin, az kaldı!',
    'Allync AI hizmetinizde.',
    'Beni göndermek için biraz daha salla!',
    'Hey, naber?',
    'Matrix\'e hoş geldin...',
    'Sıkı tut!'
  ] : [
    'Come on, throw faster!',
    'You can do it, almost there!',
    'Allync AI at your service.',
    'Shake me more to send me away!',
    'Hey, what\'s up?',
    'Welcome to the Matrix...',
    'Hold tight!'
  ];

  const clickHintMessages = language === 'tr' ? [
    'Beni aşağı çek!',
    'Hey, buraya bak!',
    'Beni gönder!',
    'Çek ve bırak!',
    'Hadi oyna benimle!',
    'Dikkatini çekeyim mi?',
    'Merak etme, kırılmam... belki 😏'
  ] : [
    'Pull me down!',
    'Hey, look here!',
    'Send me away!',
    'Pull and release!',
    'Come play with me!',
    'Should I get your attention?',
    'Don\'t worry, I won\'t break... maybe 😏'
  ];

  const snapMessages = language === 'tr' ? [
    'Al işte, gördün mü yaptığını koptu?',
    'Tebrikler, kırdın!',
    'Bunu sen istedin al koptu...',
    'Vay be, gerçekten kopardın!',
    'Houston, bir problemimiz var kopardın yani..',
    '💔 R.I.P. Allync',
  ] : [
    'See what you did? It broke!',
    'Congrats, you broke it!',
    'You asked for it, now it\'s broken...',
    'Wow, you really snapped it!',
    'Houston, we have a problem...',
    '💔 R.I.P. Allync',
  ];

  const snapWarningMessages = language === 'tr' ? [
    'Bırak artık!',
    'Kopartıcaksın!',
    'Bak kopucak!',
    'Az kaldı!',
    'Lütfen bırak!',
    'Ama kopucak!',
    'KOPACAK!',
    'Çok tuttun!',
    '😱 Dur!',
    'Son şansın!',
  ] : [
    'Let go already!',
    'You\'ll snap it!',
    'It\'s gonna break!',
    'Almost there!',
    'Please let go!',
    'It will break!',
    'IT\'S BREAKING!',
    'Too long!',
    '😱 Stop!',
    'Last chance!',
  ];

  const [bubble, setBubble] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [snapState, setSnapState] = useState({ snapped: false, message: '' });
  const [clickHintBubble, setClickHintBubble] = useState({ visible: false, text: '' });
  const [isSnapWarningMode, setIsSnapWarningMode] = useState(false);
  const snapWarningInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const clickHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWarningIndex = useRef(0);

  // Show hint message when clicked anywhere (but NOT during snap warning mode)
  useEffect(() => {
    if (clickJolt !== 0 && !snapState.snapped && !isSnapWarningMode) {
      const randomText = clickHintMessages[Math.floor(Math.random() * clickHintMessages.length)];
      console.log('Lanyard: showing click hint:', randomText, 'at position:', bubble.x, bubble.y);
      setClickHintBubble({ visible: true, text: randomText });
      // Clear any existing timer
      if (clickHintTimer.current) {
        clearTimeout(clickHintTimer.current);
      }
      // Hide after 2 seconds (if not in snap warning mode)
      clickHintTimer.current = setTimeout(() => {
        // Only hide if we're NOT in snap warning mode
        setClickHintBubble(prev => {
          // Check if this is still a click hint (not a snap warning)
          if (!snapWarningInterval.current) {
            return { visible: false, text: '' };
          }
          return prev; // Keep current state if snap warning is active
        });
        clickHintTimer.current = null;
      }, 2000);
      return () => {
        if (clickHintTimer.current) {
          clearTimeout(clickHintTimer.current);
          clickHintTimer.current = null;
        }
      };
    }
  }, [clickJolt, snapState.snapped, isSnapWarningMode]);

  const handleDragStart = () => {
    const randomText = wittyMessages[Math.floor(Math.random() * wittyMessages.length)];
    setBubble(prev => ({ ...prev, visible: true, text: randomText }));
  };

  const handleDragEnd = () => {
    setBubble(prev => ({ ...prev, visible: false }));
  };

  const handleCardPositionUpdate = (x: number, y: number) => {
    setBubble(prev => ({ ...prev, x, y }));
  };

  const handleSnap = () => {
    const randomMessage = snapMessages[Math.floor(Math.random() * snapMessages.length)];
    setSnapState({ snapped: true, message: randomMessage });
    setBubble(prev => ({ ...prev, visible: false }));
    setClickHintBubble({ visible: false, text: '' });
    setIsSnapWarningMode(false);
    // Clear warning interval
    if (snapWarningInterval.current) {
      clearInterval(snapWarningInterval.current);
      snapWarningInterval.current = null;
    }
    // Call parent's onSnap with the message - parent handles exit animation and message display
    if (onSnap) {
      onSnap(randomMessage);
    }
  };

  const handleSnapWarning = (show: boolean) => {
    if (show && !snapWarningInterval.current) {
      // Clear any pending click hint timer first
      if (clickHintTimer.current) {
        clearTimeout(clickHintTimer.current);
        clickHintTimer.current = null;
      }
      // Start showing warning messages - use the same clickHintBubble
      setIsSnapWarningMode(true);
      lastWarningIndex.current = 0;
      setClickHintBubble({
        visible: true,
        text: snapWarningMessages[0]
      });

      // Change message every 800ms
      snapWarningInterval.current = setInterval(() => {
        lastWarningIndex.current = (lastWarningIndex.current + 1) % snapWarningMessages.length;
        setClickHintBubble({
          visible: true,
          text: snapWarningMessages[lastWarningIndex.current]
        });
      }, 800);
    } else if (!show && snapWarningInterval.current) {
      // Stop showing warning messages
      clearInterval(snapWarningInterval.current);
      snapWarningInterval.current = null;
      setClickHintBubble({ visible: false, text: '' });
      setIsSnapWarningMode(false);
      lastWarningIndex.current = 0;
    }
  };

  return (
    <div className="w-full h-full pointer-events-none">
      {/* Bubble Message (during drag) - hidden when snap warning is active */}
      <AnimatePresence>
        {bubble.visible && !isSnapWarningMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              position: 'absolute',
              top: bubble.y,
              left: bubble.x,
              transform: 'translate(20px, -110%)',
              zIndex: 999,
            }}
            className="pointer-events-none"
          >
            <div className="relative bg-white text-black py-2 px-4 rounded-lg shadow-xl">
              <p className="whitespace-nowrap font-semibold">{bubble.text}</p>
              <div
                className="absolute left-0 bottom-0 w-0 h-0 border-8 border-transparent border-t-white border-l-white"
                style={{ transform: 'translate(20px, 8px) rotate(45deg)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Hint Bubble (when user clicks anywhere) OR Snap Warning (during drag above threshold) */}
      <AnimatePresence>
        {clickHintBubble.visible && (!bubble.visible || isSnapWarningMode) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              position: 'absolute',
              top: bubble.y,
              left: bubble.x,
              transform: 'translate(20px, -110%)',
              zIndex: 999,
            }}
            className="pointer-events-none"
          >
            <div className={`relative py-2 px-4 rounded-lg shadow-xl ${
              isSnapWarningMode
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                : 'bg-white text-black'
            }`}>
              <p className="whitespace-nowrap font-semibold">{clickHintBubble.text}</p>
              <div
                className={`absolute left-0 bottom-0 w-0 h-0 border-8 border-transparent ${
                  isSnapWarningMode
                    ? 'border-t-red-500 border-l-red-500'
                    : 'border-t-white border-l-white'
                }`}
                style={{ transform: 'translate(20px, 8px) rotate(45deg)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="lanyard-canvas w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 25 }}
          gl={{ alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(new THREE.Color('black'), 0)}
        >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band
            onDismiss={onDismiss}
            scrollJolt={scrollJolt}
            clickJolt={clickJolt}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onPositionUpdate={handleCardPositionUpdate}
            onSnap={handleSnap}
            onSnapWarning={handleSnapWarning}
          />
        </Physics>
        <Environment resolution={256}>
            <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
        </Canvas>
      </div>
    </div>
  );
}
