import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GestureState, HandData } from '../types';
import { TAROT_DECK, CARD_WIDTH, CARD_HEIGHT, COLORS } from '../constants';

const damp = THREE.MathUtils.damp;

// back-of-card image URL
const BACK_CARD_URL = "https://i.postimg.cc/tgL068f6/BACKCARD.jpg";

type LayoutCfg = {
  cardScale: number;
  spreadWidth: number;
  selectedLiftY: number;
  selectedLiftZ: number;
  revealedZ: number;
  revealedY: number;
  shuffleHandInfluenceX: number;
  shuffleHandInfluenceY: number;
};

const Card: React.FC<{
  data: any;
  index: number;
  state: GestureState;
  handData: HandData;
  isSelected: boolean;
  totalCards: number;
  cfg: LayoutCfg;
}> = ({ data, index, state, handData, isSelected, totalCards, cfg }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3());
  const targetRot = useRef(new THREE.Euler());

  const noiseOffset = useMemo(() => ({
    x: (Math.random() - 0.5) * 15,
    y: (Math.random() - 0.5) * 10,
    z: (Math.random() - 0.5) * 5,
    rotX: (Math.random() - 0.5) * 0.5,
    rotY: (Math.random() - 0.5) * 0.5,
    rotZ: (Math.random() - 0.5) * 0.2,
  }), []);

  // Front texture
  const frontTexture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(data.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [data.image]);

  // Back texture
  const backTexture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(BACK_CARD_URL);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((stateFrame, delta) => {
    if (!groupRef.current) return;

    const time = stateFrame.clock.getElapsedTime();
    const lerpSpeed = state === GestureState.INITIAL ? 5 : 3.5;

    if (state === GestureState.INITIAL) {
      const jitterX = Math.sin(time * 0.2 + index) * 0.05;
      const jitterY = Math.cos(time * 0.2 + index) * 0.05;
      targetPos.current.set(jitterX, jitterY, -index * 0.02);
      targetRot.current.set(0, 0, 0);
    } else if (state === GestureState.SHUFFLE) {
      const angle = (index / totalCards) * Math.PI * 2 + time * 0.8;
      const radius = 6 + Math.sin(time * 0.5 + index) * 2;

      const handInfluenceX = (handData.x - 0.5) * cfg.shuffleHandInfluenceX;
      const handInfluenceY = (handData.y - 0.5) * cfg.shuffleHandInfluenceY;

      targetPos.current.set(
        Math.cos(angle) * radius + handInfluenceX,
        Math.sin(angle) * radius + handInfluenceY,
        -5 + Math.sin(time + index) * 3
      );
      targetRot.current.set(angle, angle * 0.5, 0);
    } else if (state === GestureState.DRAWING) {
      // Fan spread (responsive)
      const fanIndex = index - (totalCards / 2);
      const fanX = (fanIndex / totalCards) * cfg.spreadWidth;
      const fanY = -Math.abs(fanIndex / totalCards) * 2 - 1;
      const fanRotZ = -(fanIndex / totalCards) * 0.8;

      if (isSelected) {
        targetPos.current.set(fanX, fanY + cfg.selectedLiftY, cfg.selectedLiftZ);
        targetRot.current.set(-0.2, 0, 0);
      } else {
        targetPos.current.set(fanX, fanY, 0);
        targetRot.current.set(0, 0, fanRotZ);
      }
    } else if (state === GestureState.REVEALED) {
      if (isSelected) {
        // Keep it centered + not too close on mobile
        targetPos.current.set(0, cfg.revealedY, cfg.revealedZ);
        targetRot.current.set(0, Math.PI, 0);
      } else {
        targetPos.current.set(noiseOffset.x * 3, noiseOffset.y * 3, -20);
        targetRot.current.set(noiseOffset.rotX * 2, noiseOffset.rotY * 2, noiseOffset.rotZ);
      }
    }

    groupRef.current.position.x = damp(groupRef.current.position.x, targetPos.current.x, lerpSpeed, delta);
    groupRef.current.position.y = damp(groupRef.current.position.y, targetPos.current.y, lerpSpeed, delta);
    groupRef.current.position.z = damp(groupRef.current.position.z, targetPos.current.z, lerpSpeed, delta);

    groupRef.current.rotation.x = damp(groupRef.current.rotation.x, targetRot.current.x, lerpSpeed, delta);
    groupRef.current.rotation.y = damp(groupRef.current.rotation.y, targetRot.current.y, lerpSpeed, delta);
    groupRef.current.rotation.z = damp(groupRef.current.rotation.z, targetRot.current.z, lerpSpeed, delta);
  });

  return (
    <group ref={groupRef} scale={[cfg.cardScale, cfg.cardScale, cfg.cardScale]}>
      {/* Card Back */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial map={backTexture} roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Card Front */}
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
        factor: 20 + Math.random() * 100,
        speed: 0.005 + Math.random() / 500,
        xFactor: (Math.random() - 0.5) * 60,
        yFactor: (Math.random() - 0.5) * 40,
        zFactor: (Math.random() - 0.5) * 40,
      });
    }
    return temp;
  }, []);

  const dummyPos = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(() => {
    if (!mesh.current) return;

    const handX = (handData.x - 0.5) * 20;
    const handY = (handData.y - 0.5) * 15;

    particles.forEach((p, i) => {
      p.t += p.speed;
      dummyPos[i * 3] = p.xFactor + Math.cos(p.t) * 2 + handX * 0.05;
      dummyPos[i * 3 + 1] = p.yFactor + Math.sin(p.t) * 2 + handY * 0.05;
      dummyPos[i * 3 + 2] = p.zFactor + Math.sin(p.t * 0.5);
    });

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={dummyPos} itemSize={3} />
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

// Inner scene so we can read canvas size
const SceneInner: React.FC<SceneProps> = ({ handData, selectedIndex }) => {
  const { size } = useThree();
  const isMobile = size.width < 768;

  const cfg: LayoutCfg = useMemo(() => {
    if (isMobile) {
      return {
        cardScale: 0.78,
        spreadWidth: 6.8,
        selectedLiftY: 1.7,
        selectedLiftZ: 1.2,
        revealedZ: 4.2,
        revealedY: 0.3,
        shuffleHandInfluenceX: 9,
        shuffleHandInfluenceY: 6,
      };
    }
    return {
      cardScale: 1,
      spreadWidth: 12,
      selectedLiftY: 2.5,
      selectedLiftZ: 2,
      revealedZ: 5,
      revealedY: 0.5,
      shuffleHandInfluenceX: 15,
      shuffleHandInfluenceY: 10,
    };
  }, [isMobile]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, isMobile ? 22 : 18]}
        fov={isMobile ? 42 : 35}
      />

      <color attach="background" args={[COLORS.background]} />
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
            cfg={cfg}
          />
        ))}
      </group>

      <fog attach="fog" args={[COLORS.background, 15, 60]} />
    </>
  );
};

const Scene: React.FC<SceneProps> = ({ handData, selectedIndex }) => {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: COLORS.background }}>
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <SceneInner handData={handData} selectedIndex={selectedIndex} />
      </Canvas>
    </div>
  );
};

export default Scene;
