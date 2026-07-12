import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { Html } from "@react-three/drei";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

export function DiningScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("dining");
  const isNight = phase === "night" || phase === "dusk";
  const isDay = phase === "day";

  return (
    <group>
      <ambientLight intensity={isNight ? 0.08 : isDay ? 0.25 : 0.15} />

      {/* Floor — dark wood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#4a3828" roughness={0.9} />
      </mesh>

      {/* Dining table — center */}
      <mesh position={[0, 0.75, -1]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Table legs */}
      {[
        [-1, 0.37, -0.3],
        [1, 0.37, -0.3],
        [-1, 0.37, -1.7],
        [1, 0.37, -1.7],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.7} />
        </mesh>
      ))}

      {/* Books — table centerpiece */}
      <GltfModel url="/models/books/scene.gltf" position={[0, 0.85, -1]} scale={0.6} />

      {/* Candle lantern — on table */}
      <group position={[0.8, 0.9, -1]}>
        <GltfModel url="/models/lantern/scene.gltf" scale={0.3} />
        <pointLight intensity={isNight ? 0.8 : 0.2} color={0xff9944} distance={3} decay={2} />
      </group>

      {/* Second lantern — other end */}
      <group position={[-0.8, 0.9, -1]}>
        <GltfModel url="/models/lantern/scene.gltf" scale={0.3} />
        <pointLight intensity={isNight ? 0.6 : 0.15} color={0xffaa55} distance={2.5} decay={2} />
      </group>

      {/* Chandelier light */}
      <pointLight
        position={[0, 3, -1]}
        intensity={isNight ? 0.5 : 0.2}
        color={0xffeedd}
        distance={5}
        decay={2}
      />

      {/* Window light spill (day) */}
      {isDay && (
        <spotLight
          position={[3, 3, 0]}
          target-position={[1, 0, -1]}
          angle={0.5}
          penumbra={0.8}
          intensity={0.4}
          color={0xffffee}
        />
      )}

      {/* Sideboard — left */}
      <mesh position={[-3, 0.5, -2]} castShadow>
        <boxGeometry args={[1.2, 1, 0.5]} />
        <meshStandardMaterial color="#4a2e1e" roughness={0.7} />
      </mesh>

      {/* Memories — framed on wall */}
      {items?.slice(0, 4).map((_m, i) => (
        <group key={m.id} position={[-2 + i * 1.3, 2.2, -2.9]}>
          <mesh onClick={() => onView(m)}>
            <boxGeometry args={[0.8, 0.6, 0.05]} />
            <meshStandardMaterial color="#f5f0e8" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.65, 0.45, 0.01]} />
            <meshStandardMaterial
              color={m.kind === "photo" ? "#5577aa" : m.kind === "song" ? "#aa5577" : "#77aa55"}
              roughness={0.5}
            />
          </mesh>
          <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded bg-black/60 px-1.5 py-0.5 text-[8px] text-white/70">
              {m.title}
            </div>
          </Html>
        </group>
      ))}

      {/* Photo form hotspot — window area */}
      <mesh position={[3, 1.8, -2.5]} onClick={() => onOpen("photo")}>
        <boxGeometry args={[0.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#88aacc" transparent opacity={0.15} />
      </mesh>

      {/* Letter hotspot — sideboard */}
      <mesh position={[-3, 1.1, -1.8]} onClick={() => onOpen("letter")}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
