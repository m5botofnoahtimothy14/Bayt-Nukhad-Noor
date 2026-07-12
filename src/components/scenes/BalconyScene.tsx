import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";

type Props = {
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

export function BalconyScene({ season: _season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("balcony");

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
          <pointLight intensity={0.3} color={0xff9944} distance={3} decay={2} />
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
      {Array.from({ length: 80 }).map((_i, i) => {
        const x = -5 + Math.random() * 10;
        const y = 2 + Math.random() * 4;
        const z = -5 - Math.random() * 3;
        const size = 0.02 + Math.random() * 0.03;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3 + Math.random() * 0.6} />
          </mesh>
        );
      })}

      {/* Moon */}
      <mesh position={[3, 4.5, -6]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ffeecc" />
      </mesh>
      <pointLight
        position={[3, 4.5, -5]}
        intensity={0.15}
        color={0xffeecc}
        distance={10}
        decay={2}
      />

      {/* Memory stars */}
      {items?.slice(0, 8).map((_m, i) => {
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

      {/* Click sky to add memory */}
      <mesh position={[0, 3, -4]} onClick={() => onAdd({ x: 0.5, y: 0.3 })} visible={false}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
