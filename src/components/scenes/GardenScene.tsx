import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";
import { useMemo } from "react";

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

  const grassBlades = useMemo(
    () =>
      Array.from({ length: 40 }).map((_i, i) => ({
        x: -5 + Math.random() * 10,
        z: -2 + Math.random() * 5,
        height: 0.2 + Math.random() * 0.4,
      })),
    [],
  );

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
          <pointLight
            intensity={phase === "night" ? 0.4 : 0.1}
            color={0xff9944}
            distance={2.5}
            decay={2}
          />
        </group>
      ))}

      {/* Grass blades */}
      {grassBlades.map((g, i) => (
        <mesh key={i} position={[g.x, g.height / 2, g.z]}>
          <boxGeometry args={[0.03, g.height, 0.02]} />
          <meshStandardMaterial color="#5a8a4a" roughness={0.9} />
        </mesh>
      ))}

      {/* Flowers (spring/summer) */}
      {(season === "spring" || season === "summer") &&
        flowers.map((f, i) => (
          <group key={i} position={[f.x, 0.15, f.z]}>
            <mesh>
              <sphereGeometry args={[0.08 * f.scale, 8, 8]} />
              <meshStandardMaterial color={f.color} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
              <meshStandardMaterial color="#4a6a3a" roughness={0.8} />
            </mesh>
          </group>
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
      {items?.slice(0, 6).map((_m, i) => {
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
    </group>
  );
}
