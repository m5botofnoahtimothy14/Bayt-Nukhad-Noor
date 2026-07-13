import { AnimatedGrass, FallingLeaves, RainFall, SnowFall } from "@/components/world/AnimatedElements";
import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

const GROUND: Record<Season, string> = {
  spring: "#5a8a5a",
  summer: "#4a7a45",
  autumn: "#7a6a35",
  winter: "#c8d0d8",
};

const FLOWER_COLORS = ["#ff6688", "#ffaa44", "#cc66ff", "#ff4466", "#66ccff", "#ff88aa"];

export function MeadowScene({ season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("meadow");

  const grassBlades = useMemo(() => {
    const hash = (i: number) => {
      let h = (i * 2654435761) >>> 0;
      return (h & 0xffff) / 0xffff;
    };
    return Array.from({ length: 50 }).map((_i, i) => ({
      x: -5 + hash(i) * 10,
      z: -1 + hash(i + 100) * 5,
      h: 0.2 + hash(i + 200) * 0.4,
      color: "#5a8a4a",
    }));
  }, []);

  const flowers = useMemo(
    () =>
      season === "spring" || season === "summer"
        ? Array.from({ length: 14 }).map((_i, i) => ({
            x: -4 + Math.random() * 8,
            z: 0 + Math.random() * 4,
            color: FLOWER_COLORS[i % FLOWER_COLORS.length],
          }))
        : [],
    [season],
  );

  return (
    <group>
      <ambientLight intensity={season === "winter" ? 0.2 : 0.15} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color={GROUND[season]} roughness={0.95} />
      </mesh>

      {/* Rolling hills — background */}
      <mesh position={[-3, 0.4, -6]} receiveShadow>
        <sphereGeometry args={[4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GROUND[season]} roughness={0.95} side={2} />
      </mesh>
      <mesh position={[3, 0.3, -5]} receiveShadow>
        <sphereGeometry args={[3.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GROUND[season]} roughness={0.95} side={2} />
      </mesh>

      {/* Distant trees — polytree */}
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[-5, 0, -5]}
        scale={0.08}
        rotation={[0, 0.5, 0]}
      />
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[5, 0, -4.5]}
        scale={0.07}
        rotation={[0, -0.8, 0]}
      />
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[0, 0, -6]}
        scale={0.1}
        rotation={[0, 1.2, 0]}
      />

      {/* Houseplants — scattered wild growth */}
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[-2, 0, 1]}
        scale={0.3}
        rotation={[0, 0.7, 0]}
      />
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[3, 0, 2]}
        scale={0.25}
        rotation={[0, -0.4, 0]}
      />

      {/* Grass blades */}
      <AnimatedGrass blades={grassBlades} />

      {/* Flowers */}
      {flowers.map((f, i) => (
        <MeadowFlower key={i} position={[f.x, 0.12, f.z]} color={f.color} index={i} />
      ))}

      {/* Rain (spring/summer/autumn) */}
      {season !== "winter" && <RainFall count={70} speed={2.5} height={6} />}

      {/* Snow (winter) */}
      {season === "winter" && <SnowFall count={60} height={6} />}

      {/* Falling leaves (autumn) */}
      {season === "autumn" && <FallingLeaves count={15} />}

      {/* Fog layers */}
      <mesh position={[0, 0.4, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 4]} />
        <meshBasicMaterial color="#8899aa" transparent opacity={0.04} side={2} />
      </mesh>

      {/* Horizon glow */}
      <pointLight position={[0, 2, -8]} intensity={0.15} color={0xffeedd} distance={12} decay={2} />

      {/* Umbrella + figures silhouette */}
      <UmbrellaSway />

      {/* Memory leaves */}
      {items?.slice(0, 6).map((m, i) => {
        const x = -2.5 + (i % 3) * 2.5;
        const z = 1 + Math.floor(i / 3) * 1.5;
        return (
          <group key={m.id} position={[x, 0.2, z]}>
            <mesh onClick={() => onView(m)}>
              <boxGeometry args={[0.08, 0.1, 0.01]} />
              <meshStandardMaterial
                color={
                  season === "winter" ? "#ddeeff" : season === "autumn" ? "#cc6633" : "#66aa66"
                }
                roughness={0.5}
              />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="max-w-[60px] truncate text-[8px] text-white/50 serif">{m.title}</div>
            </Html>
          </group>
        );
      })}

      {/* Click meadow to add */}
      <mesh
        position={[0, 0.01, 2]}
        onClick={() => onAdd({ x: 0.5, y: 0.6 })}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function MeadowFlower({ position, color, index }: { position: [number, number, number]; color: string; index: number }) {
  const groupRef = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 1.2 + position[0] * 2 + index) * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.9 + position[2] * 1.5 + index * 0.5) * 0.05;
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.16, 4]} />
        <meshStandardMaterial color="#4a6a3a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function UmbrellaSway() {
  const groupRef = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.03;
    groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.02;
  });
  return (
    <group ref={groupRef} position={[0, 1.2, 0.5]}>
      {/* Umbrella canopy */}
      <mesh>
        <sphereGeometry args={[0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#cc3344" roughness={0.6} side={2} />
      </mesh>
      {/* Umbrella pole */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 4]} />
        <meshStandardMaterial color="#555" metalness={0.5} />
      </mesh>
      {/* Figure 1 */}
      <mesh position={[-0.15, -0.5, 0]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#334455" roughness={0.8} />
      </mesh>
      {/* Figure 2 */}
      <mesh position={[0.15, -0.5, 0]}>
        <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
        <meshStandardMaterial color="#443355" roughness={0.8} />
      </mesh>
    </group>
  );
}
