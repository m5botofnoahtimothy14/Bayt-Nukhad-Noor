import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import { Fireflies, AnimatedGrass, LanternGlow, FallingLeaves } from "@/components/world/AnimatedElements";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  phase: TimePhase;
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

const GROUND: Record<Season, string> = {
  spring: "#4a7a4a",
  summer: "#3a6a35",
  autumn: "#6a5a35",
  winter: "#c8d0d8",
};

const FLOWER_COLORS = [
  "#ff6688",
  "#ffaa44",
  "#cc66ff",
  "#ff4466",
  "#ffcc44",
  "#66ccff",
  "#ff88aa",
  "#aa88ff",
];

function AnimatedFlower({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => position[0] * 0.37 + position[2] * 0.73, [position]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 1.2 + seed) * 0.08;
    ref.current.rotation.x = Math.cos(t * 0.9 + seed) * 0.05;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.08 * scale, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
        <meshStandardMaterial color="#4a6a3a" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function GardenScene({ phase, season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("garden");
  const isDay = phase === "day" || phase === "dawn";

  const flowers = useMemo(
    () =>
      Array.from({ length: 12 }).map((_i, i) => ({
        x: -3 + Math.random() * 6,
        z: -1 + Math.random() * 3,
        color: FLOWER_COLORS[i % FLOWER_COLORS.length],
        scale: 0.3 + Math.random() * 0.3,
      })),
    [],
  );

  const grassBlades = useMemo(() => {
    const pseudo = (seed: number) => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: 40 }).map((_i, i) => ({
      x: -5 + pseudo(i * 1.1) * 10,
      z: -2 + pseudo(i * 2.3 + 100) * 5,
      h: 0.2 + pseudo(i * 3.7 + 200) * 0.4,
      color: "#5a8a4a",
    }));
  }, []);

  return (
    <group>
      <ambientLight intensity={isDay ? 0.25 : 0.08} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={GROUND[season]} roughness={0.95} />
      </mesh>

      {/* Main tree — polytree */}
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[-2, 0, -3]}
        scale={0.12}
        rotation={[0, 0.8, 0]}
      />

      {/* Second smaller tree */}
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[3, 0, -2.5]}
        scale={0.08}
        rotation={[0, -0.5, 0]}
      />

      {/* Garden path — stone stepping stones */}
      {Array.from({ length: 5 }).map((_i, i) => (
        <mesh
          key={i}
          position={[-1 + i * 0.6, 0.02, 1 + Math.sin(i) * 0.3]}
          rotation={[-Math.PI / 2, 0, i * 0.3]}
          receiveShadow
        >
          <circleGeometry args={[0.2, 8]} />
          <meshStandardMaterial color="#8a8070" roughness={0.8} />
        </mesh>
      ))}

      {/* Outdoor couch */}
      <GltfModel
        url="/models/outdoor-couch/scene.gltf"
        position={[2, 0, 1.5]}
        scale={0.7}
        rotation={[0, -0.5, 0]}
      />

      {/* Houseplants — scattered */}
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[-3.5, 0, 1]}
        scale={0.5}
        rotation={[0, 0.3, 0]}
      />
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[1, 0, -1.5]}
        scale={0.4}
        rotation={[0, -0.7, 0]}
      />

      {/* Lanterns — pathway */}
      {[-1.5, 0.5, 2.5].map((x, i) => (
        <group key={i} position={[x, 0, 0.5]}>
          <GltfModel url="/models/lantern/scene.gltf" scale={0.2} />
          <LanternGlow position={[0, 0.3, 0]} />
        </group>
      ))}

      {/* Animated grass */}
      <AnimatedGrass blades={grassBlades} />

      {/* Flowers (spring/summer) */}
      {(season === "spring" || season === "summer") &&
        flowers.map((f, i) => (
          <AnimatedFlower
            key={i}
            position={[f.x, 0.15, f.z]}
            color={f.color}
            scale={f.scale}
          />
        ))}

      {/* Fence — background */}
      {Array.from({ length: 11 }).map((_i, i) => (
        <mesh key={i} position={[-5 + i, 0.35, -4]} castShadow>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color="#c8b898" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0.55, -4]}>
        <boxGeometry args={[10, 0.05, 0.05]} />
        <meshStandardMaterial color="#c8b898" roughness={0.8} />
      </mesh>

      {/* Memory flowers */}
      {items?.slice(0, 6).map((m, i) => {
        const x = -2 + (i % 3) * 2;
        const z = 2 + Math.floor(i / 3);
        return (
          <group key={m.id} position={[x, 0.25, z]}>
            <mesh onClick={() => onView(m)}>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshStandardMaterial
                color={FLOWER_COLORS[i % FLOWER_COLORS.length]}
                emissive={FLOWER_COLORS[i % FLOWER_COLORS.length]}
                emissiveIntensity={0.3}
                roughness={0.4}
              />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="max-w-[60px] truncate text-[8px] text-white/60 serif">{m.title}</div>
            </Html>
          </group>
        );
      })}

      {/* Click meadow to add */}
      <mesh
        position={[0, 0.01, 1]}
        onClick={() => onAdd({ x: 0.5, y: 0.6 })}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[10, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Animated fireflies (non-winter) */}
      {season !== "winter" && <Fireflies count={20} area={[8, 3, 6]} color="#ffee44" />}

      {/* Falling leaves (autumn only) */}
      {season === "autumn" && <FallingLeaves count={15} />}

      {/* Stone path — small bushes */}
      {[-0.5, 0.7, 1.9].map((x, i) => (
        <mesh key={`bush-${i}`} position={[x + 0.25, 0.06, 1.2 + Math.sin(i) * 0.2]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#4a7a4a" roughness={0.9} />
        </mesh>
      ))}

      {/* Garden bench near the fence */}
      <group position={[0, 0, -3]}>
        {/* Seat */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.4]} />
          <meshStandardMaterial color="#8a7a5a" roughness={0.8} />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.55, -0.2]}>
          <boxGeometry args={[1.2, 0.4, 0.04]} />
          <meshStandardMaterial color="#7a6a4a" roughness={0.8} />
        </mesh>
        {/* Legs */}
        {[[-0.55, 0.175, 0.15], [0.55, 0.175, 0.15], [-0.55, 0.175, -0.15], [0.55, 0.175, -0.15]].map(
          (pos, i) => (
            <mesh key={`leg-${i}`} position={pos as [number, number, number]}>
              <boxGeometry args={[0.06, 0.35, 0.06]} />
              <meshStandardMaterial color="#8a7a5a" roughness={0.8} />
            </mesh>
          ),
        )}
      </group>
    </group>
  );
}
