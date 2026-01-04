import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GestureState, HandData } from '../types';
import { TAROT_DECK, CARD_WIDTH, CARD_HEIGHT, COLORS } from '../constants';

const damp = THREE.MathUtils.damp;

// ✅ Back-of-card image URL
const BACK_CARD_URL = "https://i.postimg.cc/tgL068f6/BACKCARD.jpg";

const Card: React.FC<{
  data: any;
  index: number;
  state: GestureState;
  handData: HandData;
  isSelected: boolean;
  totalCards: number;
}> = ({ data, index, state, handData, isSelected, totalCards }) => {
  const meshRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3());
  const targetRot = useRef(new THREE.Euler());

  const noiseOffset = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 5,
      rotX: (Math.random() - 0.5) * 0.5,
      rotY: (Math.random() - 0.5) * 0.5,
      rotZ: (Math.random() - 0.5) * 0.2,
    }),
    []
  );

  useFrame((stateFrame, delta) => {
    if (!meshRef.current) return;

    const time = stateFrame.clock.getElapsedTime();
    const lerpSpeed = state === GestureState.INITIAL ? 5 : 3.5;

    if (state === GestureState.INITIAL) {
      // Stacked deck with slight natural imperfection
      const jitterX = Math.sin(time * 0.2 + index) * 0.05;
      const jitterY = Math.cos(time * 0.2 + index) * 0.05;
      targetPos.current.set(jitterX, jitterY, -index * 0.02);
      targetRot.current.set(0, 0, 0);
    } else if (state === GestureState.SHUFFLE) {
      // Chaotic but graceful vortex
      const angle = (index / totalCards) * Math.PI * 2 + time * 0.8;
      const radius = 6 + Math.sin(time * 0.5 + index) * 2;
      const handInfluenceX = (handData.x - 0.5) * 15;
      const handInfluenceY = (handData.y - 0.5) * 10;

      targetPos.current.set(
        Math.cos(angle) * radius + handInfluenceX,
        Math.sin(angle) * radius + handInfluenceY,
        -5 + Math.sin(time + index) * 3
      );
      targetRot.current.set(angle, angle * 0.5, 0);
    } else if (state === GestureState.DRAWING) {
      // Spread cards in a fan for selection
      const spreadWidth = 12;
      const fanIndex = index - totalCards / 2;
      const fanX = (fanIndex / totalCards) * spreadWidth;
      const fanY = -Math.abs(fanIndex / totalCards) * 2 - 1;
      const fanRotZ = -(fanIndex / totalCards) * 0.8;

      if (isSelected) {
        targetPos.current.set(fanX, fanY + 2.5, 2);
        targetRot.current.set(-0.2, 0, 0);
      } else {
        targetPos.current.set(fanX, fanY, 0);
        targetRot.current.set(0, 0, fanRotZ);
      }
    } else if (state === GestureState.REVEALED) {
      if (isSelected) {
        targetPos.current.set(0, 0.5, 5);
        targetRot.current.set(0, Math.PI, 0);
      } else {
        targetPos.current.set(noiseOffset.x * 3, noiseOffset.y * 3, -20);
        targetRot.current.set(
          noiseOffset.rotX * 2,
          noiseOffset.rotY * 2,
          noiseOffset.rotZ
        );
      }
    }

    // Smooth physics transition
    meshRef.current.position.x = damp(meshRef.current.position.x, targetPos.current.x, lerpSpeed, delta);
    meshRef.current.position.y = damp(meshRef.current.position.y, targetPos.current.y, lerpSpeed, delta);
    meshRef.current.position.z = damp(meshRef.current.position.z, targetPos.current.z, lerpSpeed, delta);

    meshRef.current.rotation.x = damp(meshRef.current.rotation.x, targetRot.current.x, lerpSpeed, delta);
    meshRef.current.rotation.y = damp(meshRef.current.rotation.y, targetRot.current.y, lerpSpeed, delta);
    meshRef.current.rotation.z = damp(meshRef.current.rotation.z, targetRot.current.z, lerpSpeed, delta);
  });

  // Front texture (card face)
  const frontTexture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(data.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [data.image]);

  // Back texture (your back design)
  const backTexture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(BACK_CARD_URL);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Back of card (image) */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial map={backTexture} roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Front of card (image) */}
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial map={frontTexture} roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};

const FlowParticles: React.FC<{ handData: HandData }> = ({ handData }) => {
  const count = 3000;
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speed: 0.005 + Math.random() / 500,
        xFactor: (Math.random() - 0.5) * 60,
        yFactor: (Math.random() - 0.5) * 40,
        zFactor: (Math.random() - 0.5) * 40,
      });
    }
    return temp;
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(() => {
    if (!mesh.current) return;

    const handX = (handData.x - 0.5) * 20;
    const handY = (handData.y - 0.5) * 15;

    particles.forEach((p, i) => {
      p.t += p.speed;
      positions[i * 3] = p.xFactor + Math.cos(p.t) * 2 + handX * 0.05;
      positions[i * 3 + 1] = p.yFactor + Math.sin(p.t) * 2 + handY * 0.05;
      positions[i * 3 + 2] = p.zFactor + Math.sin(p.t * 0.5);
    });

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={COLORS.mysticCyan}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

interface SceneProps {
  handData: HandData;
  selectedIndex: number;
}

const Scene: React.FC<SceneProps> = ({ handData, selectedIndex }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#120124]">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={35} />
        <color attach="background" args={['#120124']} />

        <ambientLight intensity={0.4} />
        <spotLight position={[15, 20, 15]} angle={0.2} intensity={1.5} color={COLORS.goldLight} />
        <pointLight position={[-15, -15, -5]} color={COLORS.primaryPurple} intensity={4} />

        <FlowParticles handData={handData} />
        <Environment preset="night" />

        <group>
          {TAROT_DECK.map((card, idx) => (
            <Card
              key={card.id}
              data={card}
              index={idx}
              state={handData.gesture}
              handData={handData}
              isSelected={idx === selectedIndex}
              totalCards={TAROT_DECK.length}
            />
          ))}
        </group>

        <fog attach="fog" args={['#120124', 15, 60]} />
      </Canvas>
    </div>
  );
};

export default Scene;