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

const WATER_COLOR: Record<TimePhase, number> = {
  dawn: 0x556688,
  day: 0x3366aa,
  dusk: 0x554466,
  night: 0x111122,
};

export function LakeScene({ phase, season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("lake");
  const isNight = phase === "night" || phase === "dusk";

  const stars = useMemo(
    () =>
      isNight
        ? Array.from({ length: 50 }).map((_i, i) => ({
            x: -6 + Math.random() * 12,
            y: 2 + Math.random() * 5,
            z: -5 - Math.random() * 3,
            size: 0.015 + Math.random() * 0.03,
            opacity: 0.3 + Math.random() * 0.5,
          }))
        : [],
    [isNight],
  );

  return (
    <group>
      <ambientLight intensity={isNight ? 0.05 : 0.2} />

      {/* Ground — shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]} receiveShadow>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color={season === "winter" ? "#d0d8e0" : "#5a6a4a"} roughness={0.9} />
      </mesh>

      {/* Water surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -3]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial
          color={WATER_COLOR[phase]}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Dock */}
      <mesh position={[0, 0.1, -0.5]} castShadow>
        <boxGeometry args={[1.5, 0.08, 4]} />
        <meshStandardMaterial color="#6a5040" roughness={0.8} />
      </mesh>
      {/* Dock posts */}
      {[
        [-0.6, 0, 0.8],
        [0.6, 0, 0.8],
        [-0.6, 0, -2.2],
        [0.6, 0, -2.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
          <meshStandardMaterial color="#5a4030" roughness={0.85} />
        </mesh>
      ))}

      {/* Outdoor couch on shore */}
      <GltfModel
        url="/models/outdoor-couch/scene.gltf"
        position={[-2, 0, 1.5]}
        scale={0.8}
        rotation={[0, 0.5, 0]}
      />

      {/* Lantern on dock */}
      <group position={[0, 0.3, 0]}>
        <GltfModel url="/models/lantern/scene.gltf" scale={0.3} />
        <pointLight intensity={isNight ? 0.6 : 0.15} color={0xff9944} distance={4} decay={2} />
      </group>

      {/* String lights on dock */}
      {[
        [-0.5, 1.2, 0.5],
        [0, 1.3, 0],
        [0.5, 1.2, -0.5],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              color={isNight ? "#ffcc66" : "#ffffee"}
              transparent
              opacity={isNight ? 0.8 : 0.3}
            />
          </mesh>
          {isNight && <pointLight intensity={0.15} color={0xffcc66} distance={2} decay={2} />}
        </group>
      ))}

      {/* Trees on shore */}
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[-4, 0, 2]}
        scale={0.15}
        rotation={[0, 1, 0]}
      />
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[4, 0, 2]}
        scale={0.12}
        rotation={[0, -0.8, 0]}
      />

      {/* Houseplant near couch */}
      <GltfModel url="/models/houseplants/scene.gltf" position={[-3.5, 0, 2]} scale={0.4} />

      {/* Lily pads on water */}
      {Array.from({ length: 6 }).map((_i, i) => (
        <mesh
          key={i}
          position={[-2 + i * 0.8, -0.05, -2 - (i % 3) * 0.5]}
          rotation={[-Math.PI / 2, 0, i * 0.5]}
        >
          <circleGeometry args={[0.15, 12, 0, Math.PI * 1.7]} />
          <meshStandardMaterial color="#3a6a3a" roughness={0.6} side={2} />
        </mesh>
      ))}

      {/* Moon reflection (night) */}
      {isNight && (
        <mesh position={[2, -0.05, -5]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial color="#ffeecc" transparent opacity={0.15} />
        </mesh>
      )}

      {/* Stars */}
      {stars.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <sphereGeometry args={[s.size, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={s.opacity} />
        </mesh>
      ))}

      {/* Moon */}
      {isNight && (
        <mesh position={[3, 5, -7]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#ffeecc" />
        </mesh>
      )}

      {/* Mountains in background */}
      <mesh position={[-3, 1.5, -6]}>
        <coneGeometry args={[2.5, 3, 4]} />
        <meshStandardMaterial color={season === "winter" ? "#8899aa" : "#3a4a3a"} roughness={0.9} />
      </mesh>
      <mesh position={[2, 1.8, -7]}>
        <coneGeometry args={[3, 3.5, 4]} />
        <meshStandardMaterial color={season === "winter" ? "#7788aa" : "#2a3a2a"} roughness={0.9} />
      </mesh>

      {/* Paper boat memories */}
      {items?.slice(0, 5).map((m, i) => (
        <group key={m.id} position={[-1.5 + i * 0.8, -0.02, -1.5 - i * 0.3]}>
          {/* Simple boat shape */}
          <mesh onClick={() => onView(m)} rotation={[-Math.PI / 2, 0, i * 0.3]}>
            <coneGeometry args={[0.08, 0.2, 4]} />
            <meshStandardMaterial color="#f5f0e0" roughness={0.5} />
          </mesh>
          <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
            <div className="max-w-[50px] truncate text-[7px] text-amber-100/50 serif">
              {m.title}
            </div>
          </Html>
        </group>
      ))}

      {/* Click water to add */}
      <mesh
        position={[0, -0.05, -2]}
        onClick={() => onAdd({ x: 0.5, y: 0.6 })}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
