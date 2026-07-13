import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Flower({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3 + position[0]) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Stem */}
      <mesh>
        <cylinderGeometry args={[0.005, 0.005, 0.12, 4]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.8} />
      </mesh>
      {/* Petals (5 around center) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.025, 0.07, Math.sin(angle) * 0.025]}
            rotation={[0.3, angle, 0]}
          >
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        );
      })}
      {/* Center */}
      <mesh position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial color="#ffee88" roughness={0.4} />
      </mesh>
    </group>
  );
}

function FairyLight({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 0.3 + Math.sin(clock.getElapsedTime() * 3 + position[0] * 10) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshBasicMaterial color="#ffeeaa" transparent opacity={0.8} />
      </mesh>
      <pointLight ref={ref} color={0xffeeaa} intensity={0.3} distance={1} decay={2} />
    </group>
  );
}

function Scroll({ onClick }: { onClick: () => void }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.86 + Math.sin(clock.getElapsedTime() * 1.5) * 0.005;
    }
  });

  return (
    <group ref={ref} position={[0, 0.86, -1]} onClick={onClick}>
      {/* Parchment roll */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.22, 12]} />
        <meshStandardMaterial color="#e8d8b8" roughness={0.7} />
      </mesh>
      {/* Ribbon */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.03, 0.004, 6, 16]} />
        <meshStandardMaterial color="#6a1a2a" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function StageArea({ onScrollClick }: { onScrollClick: () => void }) {
  return (
    <group position={[0, 0, -4]}>
      {/* Circular marble stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[1.8, 48]} />
        <meshStandardMaterial
          color="#e8e0d8"
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>
      {/* Stage rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.75, 1.85, 48]} />
        <meshStandardMaterial color="#d0c8c0" roughness={0.3} />
      </mesh>

      {/* Pedestal */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#5a4030" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.16, 0.12, 0.04, 12]} />
          <meshStandardMaterial color="#5a4030" roughness={0.7} />
        </mesh>
        <Scroll onClick={onScrollClick} />
      </group>

      {/* Flowers around stage — white roses */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 1.5;
        return (
          <Flower
            key={`w${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#f8f0f0"
            scale={0.8 + Math.sin(i) * 0.2}
          />
        );
      })}

      {/* Red roses */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const r = 1.3;
        return (
          <Flower
            key={`r${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#cc2244"
            scale={0.7 + Math.sin(i * 2) * 0.15}
          />
        );
      })}

      {/* Baby's breath clusters */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.5;
        const r = 1.6;
        return (
          <group key={`b${i}`} position={[Math.cos(angle) * r, 0.08, Math.sin(angle) * r]}>
            {Array.from({ length: 4 }).map((_, j) => (
              <mesh
                key={j}
                position={[
                  (Math.random() - 0.5) * 0.06,
                  Math.random() * 0.04,
                  (Math.random() - 0.5) * 0.06,
                ]}
              >
                <sphereGeometry args={[0.012, 4, 4]} />
                <meshStandardMaterial color="#f8f8f0" roughness={0.6} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Fairy lights around stage edge */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 1.78;
        return (
          <FairyLight
            key={i}
            position={[Math.cos(angle) * r, 0.15, Math.sin(angle) * r]}
          />
        );
      })}

      {/* Spotlight on stage */}
      <spotLight
        position={[0, 5, -2]}
        target-position={[0, 0, -4]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        color="#ffeecc"
        castShadow
      />
    </group>
  );
}
