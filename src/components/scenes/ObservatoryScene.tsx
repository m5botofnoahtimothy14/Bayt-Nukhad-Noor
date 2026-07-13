import { GltfModel } from "@/components/models/GltfModel";
import { TwinklingStars } from "@/components/world/AnimatedElements";
import { useMemories, type Memory } from "@/components/world/memories";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, PointLight } from "three";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

function ConstellationStar({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const s = 0.8 + Math.sin(t * 2.5 + position[0]) * 0.4;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffdd88" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export function ObservatoryScene({ season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("observatory");

  const telescopeRef = useRef<Group>(null);
  const nebula1Ref = useRef<PointLight>(null);
  const nebula2Ref = useRef<PointLight>(null);

  useFrame((_, dt) => {
    if (telescopeRef.current) {
      telescopeRef.current.rotation.y += dt * 0.02;
    }
    if (nebula1Ref.current) {
      const t = performance.now() * 0.001;
      nebula1Ref.current.intensity = 0.08 + Math.sin(t * 0.7) * 0.03;
    }
    if (nebula2Ref.current) {
      const t = performance.now() * 0.001;
      nebula2Ref.current.intensity = 0.06 + Math.sin(t * 0.9 + 1) * 0.025;
    }
  });

  const constellationPositions: [number, number, number][] = [
    [-2, 3.5, -5],
    [-1.2, 4, -5.2],
    [0, 3.8, -5],
    [0.8, 4.3, -5.3],
    [1.5, 3.6, -5.1],
    [2.2, 4.1, -5],
  ];

  return (
    <group>
      <ambientLight intensity={0.04} />

      {/* Observatory platform — circular */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#555560" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Telescope — center, aimed up */}
      <group position={[0, 0.5, 0]} ref={telescopeRef}>
        <GltfModel url="/models/telescope/scene.gltf" scale={2} rotation={[0.4, 0, 0]} />
      </group>

      {/* Telescope base light */}
      <pointLight position={[0, 2, 0]} intensity={0.2} color={0x8899cc} distance={3} decay={2} />

      {/* Books — star charts on platform edge */}
      <GltfModel
        url="/models/books/scene.gltf"
        position={[-2, 0.15, 1]}
        scale={0.7}
        rotation={[0, 0.5, 0]}
      />

      {/* Star chart stand */}
      <mesh position={[-2, 0.4, 1]}>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
      </mesh>
      <mesh position={[-2.2, 0.21, 1.12]}>
        <boxGeometry args={[0.04, 0.38, 0.04]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
      </mesh>
      <mesh position={[-1.8, 0.21, 1.12]}>
        <boxGeometry args={[0.04, 0.38, 0.04]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
      </mesh>

      {/* Railing */}
      {Array.from({ length: 16 }).map((_i, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 3.8, 0.5, Math.sin(angle) * 3.8]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1, 6]} />
            <meshStandardMaterial color="#777" metalness={0.5} roughness={0.3} />
          </mesh>
        );
      })}

      {/* Starfield — animated twinkling */}
      <TwinklingStars count={250} radius={20} />

      {/* Constellation lines — "our constellation" */}
      {constellationPositions.map((pos, i) => (
        <group key={i}>
          <ConstellationStar position={pos} />
          {i < 5 && (
            <mesh
              position={[(pos[0] + constellationPositions[5][0]) / 2, (pos[1] + constellationPositions[5][1]) / 2, -5.05]}
              visible={false}
            >
              <boxGeometry args={[0.01, 0.01, 1]} />
            </mesh>
          )}
        </group>
      ))}

      {/* Nebula glow — pulsing */}
      <pointLight ref={nebula1Ref} position={[-3, 5, -7]} intensity={0.08} color={0xaa44cc} distance={8} decay={2} />
      <pointLight ref={nebula2Ref} position={[4, 4, -8]} intensity={0.06} color={0x4488cc} distance={8} decay={2} />

      {/* Moon */}
      <mesh position={[-4, 5, -7]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#ffeecc" />
      </mesh>
      <mesh position={[-4, 5, -7]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#ffeecc" transparent opacity={0.15} />
      </mesh>

      {/* Memory stars */}
      {items?.slice(0, 6).map((m, i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.5;
        const r = 2 + (i % 2);
        return (
          <group key={m.id} position={[Math.cos(angle) * r, 2 + Math.sin(i) * 0.5, -3 - (i % 2)]}>
            <mesh onClick={() => onView(m)}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshBasicMaterial color="#ffcc44" transparent opacity={0.7} />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="max-w-[70px] truncate text-[8px] text-amber-200/50 serif italic">
                {m.title}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Click sky to add */}
      <mesh position={[0, 4, -4]} onClick={() => onAdd({ x: 0.5, y: 0.2 })} visible={false}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
