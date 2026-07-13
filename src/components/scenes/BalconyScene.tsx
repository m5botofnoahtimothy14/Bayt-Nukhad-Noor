import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { Season } from "@/hooks/useSeason";
import { TwinklingStars, LanternGlow } from "@/components/world/AnimatedElements";
import { Html } from "@react-three/drei";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

export function BalconyScene({ season: _season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("balcony");
  const moonLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (moonLightRef.current) {
      const t = clock.getElapsedTime();
      moonLightRef.current.intensity = 0.15 + Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.06} />

      {/* Balcony floor — stone/tile */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#6a6060" roughness={0.75} />
      </mesh>

      {/* Railing */}
      {Array.from({ length: 9 }).map((_i, i) => (
        <mesh key={i} position={[-4 + i, 0.5, 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
          <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Railing top bar */}
      <mesh position={[0, 1, 2]}>
        <boxGeometry args={[8.5, 0.05, 0.05]} />
        <meshStandardMaterial color="#999" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Telescope — right side, aimed up */}
      <group position={[2.5, 0, -1]} rotation={[0, -0.3, 0]}>
        <GltfModel url="/models/telescope/scene.gltf" scale={1.5} rotation={[0.3, 0, 0]} />
        <Html position={[0, 2.2, 0]} distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div className="text-[9px] text-blue-300/40 serif italic">look through</div>
        </Html>
      </group>

      {/* Lanterns hanging */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, 2.5, -0.5]}>
          <GltfModel url="/models/lantern/scene.gltf" scale={0.2} />
          <LanternGlow position={[0, -0.2, 0]} intensity={0.3} />
        </group>
      ))}

      {/* Houseplants */}
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[-3.5, 0, 0]}
        scale={0.5}
        rotation={[0, 0.5, 0]}
      />
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[3.5, 0, -0.5]}
        scale={0.4}
        rotation={[0, -0.3, 0]}
      />

      {/* Stars (night sky background) */}
      <TwinklingStars count={100} radius={15} />

      {/* Moon */}
      <mesh position={[3, 4.5, -6]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ffeecc" />
      </mesh>
      <pointLight
        ref={moonLightRef}
        position={[3, 4.5, -5]}
        intensity={0.15}
        color={0xffeecc}
        distance={10}
        decay={2}
      />

      {/* Memory stars */}
      {items?.slice(0, 8).map((m, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 2 + (i % 3) * 0.5;
        return (
          <group
            key={m.id}
            position={[Math.cos(angle) * r, 2.5 + Math.sin(i * 1.3) * 0.8, -2 - (i % 3)]}
          >
            <mesh onClick={() => onView(m)}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshBasicMaterial color="#ffdd88" transparent opacity={0.7} />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="max-w-[60px] truncate text-[8px] text-amber-200/60 serif">
                {m.title}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Bistro table */}
      <group position={[-1.5, 0, 0.5]}>
        {/* Table top */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.03, 12]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Table leg */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Wine glass stem */}
        <mesh position={[0, 0.76, 0]}>
          <cylinderGeometry args={[0.015, 0.01, 0.08, 6]} />
          <meshStandardMaterial color="#ccccdd" transparent opacity={0.5} roughness={0.1} metalness={0.2} />
        </mesh>
        {/* Wine glass bowl */}
        <mesh position={[0, 0.81, 0]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#ccccdd" transparent opacity={0.5} roughness={0.1} metalness={0.2} />
        </mesh>
      </group>

      {/* Chair 1 */}
      <group position={[-2, 0, 0.8]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.3]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.55, 0.15]}>
          <boxGeometry args={[0.3, 0.35, 0.03]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Chair 2 */}
      <group position={[-1, 0, 0.2]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.3]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.55, -0.15]}>
          <boxGeometry args={[0.3, 0.35, 0.03]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Curtains / drapes */}
      <mesh position={[-4, 2, 0]}>
        <boxGeometry args={[0.02, 1.5, 0.4]} />
        <meshStandardMaterial color="#5a4a5a" roughness={0.8} />
      </mesh>
      <mesh position={[4, 2, 0]}>
        <boxGeometry args={[0.02, 1.5, 0.4]} />
        <meshStandardMaterial color="#5a4a5a" roughness={0.8} />
      </mesh>

      {/* Click sky to add memory */}
      <mesh position={[0, 3, -4]} onClick={() => onAdd({ x: 0.5, y: 0.3 })} visible={false}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
