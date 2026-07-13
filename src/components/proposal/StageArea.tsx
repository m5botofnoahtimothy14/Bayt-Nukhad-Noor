import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Rose({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3 + seed) * 0.08;
    }
  });

  const petals = useMemo(() => {
    const arr: { angle: number; tilt: number; r: number }[] = [];
    for (let ring = 0; ring < 3; ring++) {
      const count = 5 + ring * 2;
      for (let i = 0; i < count; i++) {
        arr.push({
          angle: (i / count) * Math.PI * 2 + ring * 0.3,
          tilt: 0.4 + ring * 0.25,
          r: 0.02 + ring * 0.012,
        });
      }
    }
    return arr;
  }, []);

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Stem */}
      <mesh>
        <cylinderGeometry args={[0.004, 0.005, 0.14, 6]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.8} />
      </mesh>
      {/* Leaves on stem */}
      <mesh position={[0.012, -0.02, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.025, 0.008, 0.003]} />
        <meshStandardMaterial color="#4a7a4a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.01, -0.05, 0.005]} rotation={[0.2, 0, -0.3]}>
        <boxGeometry args={[0.02, 0.007, 0.003]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.7} />
      </mesh>
      {/* Rose bloom — layered petals */}
      {petals.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * p.r,
            0.08 + (i < 5 ? 0.01 : 0),
            Math.sin(p.angle) * p.r,
          ]}
          rotation={[p.tilt, p.angle, 0]}
        >
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.45} />
        </mesh>
      ))}
      {/* Center bud */}
      <mesh position={[0, 0.085, 0]}>
        <sphereGeometry args={[0.01, 10, 10]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

function FairyLight({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 0.35 + Math.sin(clock.getElapsedTime() * 2.5 + index * 0.8) * 0.12;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#ffeeaa" transparent opacity={0.85} />
      </mesh>
      <pointLight ref={ref} color={0xffeeaa} intensity={0.35} distance={1.2} decay={2} />
    </group>
  );
}

function Scroll({ onClick, visible }: { onClick: () => void; visible?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 1.1 + Math.sin(t * 1.2) * 0.012;
      ref.current.rotation.y = Math.sin(t * 0.25) * 0.06;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 1.0 + Math.sin(t * 2) * 0.4;
    }
  });

  const opacity = visible !== false ? 1 : 0.85;

  return (
    <group ref={ref} position={[0, 1.1, -1]} onClick={onClick}>
      {/* Parchment roll — large and visible */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.9, 20]} />
        <meshStandardMaterial color="#e8d8b8" roughness={0.55} transparent opacity={opacity} />
      </mesh>
      {/* End caps */}
      <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.12, 20]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.65} />
      </mesh>
      <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.12, 20]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.65} />
      </mesh>
      {/* Burgundy ribbon wrap */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.018, 8, 32]} />
        <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
      </mesh>
      {/* Ribbon bow — two loops + tails */}
      <group position={[0, 0.12, 0]}>
        {/* Left loop */}
        <mesh position={[-0.035, 0, 0]} rotation={[0.3, 0, 0.2]}>
          <torusGeometry args={[0.03, 0.008, 8, 12]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
        {/* Right loop */}
        <mesh position={[0.035, 0, 0]} rotation={[0.3, 0, -0.2]}>
          <torusGeometry args={[0.03, 0.008, 8, 12]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
        {/* Center knot */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#5a1525" roughness={0.4} />
        </mesh>
        {/* Tails */}
        <mesh position={[-0.02, -0.04, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.006, 0.003, 0.06, 4]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
        <mesh position={[0.02, -0.05, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.006, 0.003, 0.07, 4]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
      </group>
      {/* Warm glow to draw the eye */}
      <pointLight ref={glowRef} color={0xffcc88} intensity={1.0} distance={3} decay={2} />
    </group>
  );
}

function BabyBreathCluster({ position }: { position: [number, number, number] }) {
  const stems = useMemo(() =>
    Array.from({ length: 5 }).map((_, j) => ({
      x: (j - 2) * 0.015,
      y: j * 0.012,
      z: (j % 2) * 0.01,
      s: 0.006 + (j % 3) * 0.002,
    })), []);

  return (
    <group position={position}>
      {stems.map((s, j) => (
        <group key={j}>
          <mesh position={[s.x, s.y * 0.5, s.z]}>
            <cylinderGeometry args={[0.001, 0.001, s.y + 0.03, 3]} />
            <meshStandardMaterial color="#7a9a7a" roughness={0.8} />
          </mesh>
          <mesh position={[s.x, s.y + 0.015, s.z]}>
            <sphereGeometry args={[s.s, 8, 8]} />
            <meshStandardMaterial color="#f8f8f0" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function StageArea({ onScrollClick }: { onScrollClick: () => void }) {
  const babyBreathPositions = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2 + 0.5;
      const r = 1.6;
      return [Math.cos(angle) * r, 0.08, Math.sin(angle) * r] as [number, number, number];
    }), []);

  return (
    <group position={[0, 0, -4]}>
      {/* Circular marble stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[1.8, 64]} />
        <meshStandardMaterial
          color="#e8e0d8"
          roughness={0.15}
          metalness={0.08}
        />
      </mesh>
      {/* Stage rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.75, 1.88, 64]} />
        <meshStandardMaterial color="#d0c8c0" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Inner decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[1.2, 1.23, 48]} />
        <meshStandardMaterial color="#c8c0b8" roughness={0.3} metalness={0.05} transparent opacity={0.5} />
      </mesh>

      {/* Pedestal */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 0.8, 12]} />
          <meshStandardMaterial color="#5a4030" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.04, 16]} />
          <meshStandardMaterial color="#5a4030" roughness={0.65} />
        </mesh>
        {/* Pedestal base */}
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color="#4a3525" roughness={0.75} />
        </mesh>
        <Scroll onClick={onScrollClick} />
      </group>

      {/* Flowers around stage — roses */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 1.5;
        return (
          <Rose
            key={`w${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#f0e8e8"
            scale={0.9 + Math.sin(i * 0.8) * 0.15}
          />
        );
      })}

      {/* Red roses */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const r = 1.3;
        return (
          <Rose
            key={`r${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#cc2244"
            scale={0.75 + Math.sin(i * 1.5) * 0.1}
          />
        );
      })}

      {/* Baby's breath clusters */}
      {babyBreathPositions.map((pos, i) => (
        <BabyBreathCluster key={`b${i}`} position={pos} />
      ))}

      {/* Fairy lights around stage edge */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 1.8;
        return (
          <FairyLight
            key={i}
            index={i}
            position={[Math.cos(angle) * r, 0.18, Math.sin(angle) * r]}
          />
        );
      })}

      {/* Spotlight on stage */}
      <spotLight
        position={[0, 5, -2]}
        target-position={[0, 0, -4]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.8}
        color="#ffeecc"
        castShadow
      />
    </group>
  );
}
