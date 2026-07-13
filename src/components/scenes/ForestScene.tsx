import { GltfModel } from "@/components/models/GltfModel";
import { Fireflies, SnowFall, FallingLeaves } from "@/components/world/AnimatedElements";
import { useMemories, type Memory } from "@/components/world/memories";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function DriftingMist() {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref1.current) ref1.current.position.x = Math.sin(t * 0.1) * 2;
    if (ref2.current) ref2.current.position.x = Math.cos(t * 0.08) * 2.5;
  });
  return (
    <>
      <mesh ref={ref1} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 10]} />
        <meshBasicMaterial color="#aabbcc" transparent opacity={0.08} />
      </mesh>
      <mesh ref={ref2} position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial color="#99aabb" transparent opacity={0.05} />
      </mesh>
    </>
  );
}

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

const GROUND: Record<Season, string> = {
  spring: "#3a6a3a",
  summer: "#2a5a2a",
  autumn: "#5a4a2a",
  winter: "#b8c0c8",
};

const TREE_LAYOUT = [
  { x: -4, z: -4, scale: 0.1 },
  { x: -2, z: -5, scale: 0.12 },
  { x: 0, z: -6, scale: 0.14 },
  { x: 2, z: -4.5, scale: 0.11 },
  { x: 4, z: -5.5, scale: 0.13 },
  { x: -3, z: -3, scale: 0.09 },
  { x: 3, z: -3.5, scale: 0.1 },
  { x: -5, z: -5, scale: 0.11 },
  { x: 5, z: -4, scale: 0.09 },
  { x: 0, z: -3, scale: 0.08 },
];

export function ForestScene({ season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("forest");
  const lanternLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lanternLightRef.current) {
      const t = clock.getElapsedTime();
      lanternLightRef.current.intensity = 0.5 + Math.sin(t * 3) * 0.08 + Math.sin(t * 7.3) * 0.04;
    }
  });

  return (
    <group>
      <ambientLight intensity={season === "winter" ? 0.15 : 0.08} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color={GROUND[season]} roughness={0.95} />
      </mesh>

      {/* Forest path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[1.5, 10]} />
        <meshStandardMaterial color="#6a5a40" roughness={0.9} />
      </mesh>

      {/* Trees — polytree instances at varied positions */}
      {TREE_LAYOUT.map((t, i) => (
        <GltfModel
          key={i}
          url="/models/polytree/scene.gltf"
          position={[t.x, 0, t.z]}
          scale={t.scale}
          rotation={[0, i * 1.3, 0]}
        />
      ))}

      {/* Houseplants — undergrowth */}
      <GltfModel url="/models/houseplants/scene.gltf" position={[-1.5, 0, -1]} scale={0.3} />
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[1.8, 0, -2]}
        scale={0.25}
        rotation={[0, 1.2, 0]}
      />
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[-3, 0, -2.5]}
        scale={0.35}
        rotation={[0, -0.5, 0]}
      />

      {/* Lantern along path */}
      <group position={[0, 0, -1]}>
        <GltfModel url="/models/lantern/scene.gltf" scale={0.2} />
        <pointLight ref={lanternLightRef} intensity={0.5} color={0xff9944} distance={3} decay={2} />
      </group>

      {/* Mushrooms (small bumps) */}
      {Array.from({ length: 6 }).map((_i, i) => (
        <mesh key={i} position={[-2 + i * 0.8, 0.06, 0.5 + Math.sin(i * 2) * 0.5]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#cc4444" : "#ddaa66"} roughness={0.6} />
        </mesh>
      ))}

      {/* Ground mist */}
      {season !== "winter" && <DriftingMist />}

      {/* Sunbeams (day) */}
      {(season === "spring" || season === "summer") && (
        <>
          {[-2, 0, 2].map((x, i) => (
            <mesh key={i} position={[x, 2.5, -4]} rotation={[0, 0, 0.3 + i * 0.2]}>
              <planeGeometry args={[0.3, 5]} />
              <meshBasicMaterial color="#ffffcc" transparent opacity={0.03} side={2} />
            </mesh>
          ))}
        </>
      )}

      {/* Snow (winter) */}
      {season === "winter" && <SnowFall count={50} height={6} />}

      {/* Falling leaves (autumn) */}
      {season === "autumn" && <FallingLeaves count={20} />}

      {/* Fireflies (night, warm seasons) */}
      {season !== "winter" && <Fireflies count={25} area={[8, 4, 6]} color="#ffee44" />}

      {/* Memory glows */}
      {items?.slice(0, 6).map((m, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 1.5 + (i % 2);
        return (
          <group key={m.id} position={[Math.cos(angle) * r, 0.3, -2 + Math.sin(angle) * r]}>
            <mesh onClick={() => onView(m)}>
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshBasicMaterial color="#ffdd66" transparent opacity={0.6} />
            </mesh>
            <pointLight intensity={0.15} color={0xffdd66} distance={1.5} decay={2} />
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="max-w-[60px] truncate text-[8px] text-amber-200/50 serif">
                {m.title}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Click to add */}
      <mesh
        position={[0, 0.01, 0]}
        onClick={() => onAdd({ x: 0.5, y: 0.5 })}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
