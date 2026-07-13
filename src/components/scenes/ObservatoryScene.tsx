import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";
import { useMemo } from "react";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

export function ObservatoryScene({ season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("observatory");

  const stars = useMemo(
    () =>
      Array.from({ length: 200 }).map((_i, i) => ({
        x: -6 + Math.random() * 12,
        y: 1 + Math.random() * 6,
        z: -4 - Math.random() * 5,
        size: 0.015 + Math.random() * 0.035,
        opacity: 0.2 + Math.random() * 0.7,
      })),
    [],
  );

  return (
    <group>
      <ambientLight intensity={0.04} />

      {/* Observatory platform — circular */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#555560" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Telescope — center, aimed up */}
      <group position={[0, 0.5, 0]}>
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

      {/* Starfield */}
      {stars.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <sphereGeometry args={[s.size, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={s.opacity} />
        </mesh>
      ))}

      {/* Constellation lines — "our constellation" */}
      {[
        [-2, 3.5, -5],
        [-1.2, 4, -5.2],
        [0, 3.8, -5],
        [0.8, 4.3, -5.3],
        [1.5, 3.6, -5.1],
        [2.2, 4.1, -5],
      ].map((pos, i) => (
        <group key={i}>
          <mesh position={pos as [number, number, number]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#ffdd88" transparent opacity={0.8} />
          </mesh>
          {i < 5 && (
            <mesh
              position={[(pos[0] + [2.2, 4.1, -5][0]) / 2, (pos[1] + [2.2, 4.1, -5][1]) / 2, -5.05]}
              visible={false}
            >
              <boxGeometry args={[0.01, 0.01, 1]} />
            </mesh>
          )}
        </group>
      ))}

      {/* Nebula glow */}
      <pointLight position={[-3, 5, -7]} intensity={0.08} color={0xaa44cc} distance={8} decay={2} />
      <pointLight position={[4, 4, -8]} intensity={0.06} color={0x4488cc} distance={8} decay={2} />

      {/* Moon */}
      <mesh position={[-4, 5, -7]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffeecc" />
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
