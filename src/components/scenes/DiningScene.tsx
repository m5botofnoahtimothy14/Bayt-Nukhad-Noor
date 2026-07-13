import { GltfModel } from "@/components/models/GltfModel";
import { AnimatedCandle, Fireflies } from "@/components/world/AnimatedElements";
import { RoomShell } from "@/components/world/RoomShell";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { Html } from "@react-three/drei";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (_m: Memory) => void;
};

export function DiningScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("dining");
  const isNight = phase === "night" || phase === "dusk";

  return (
    <group>
      <ambientLight intensity={isNight ? 0.06 : 0.2} />

      {/* Procedural dining shell + table */}
      <RoomShell tint="#3a2a2a" floorTint="#5a3d2d" width={8} depth={6} height={3.2} />
      {/* Table */}
      <mesh position={[0, 0.75, -1]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.08, 1.4]} />
        <meshStandardMaterial color="#5a3520" roughness={0.55} />
      </mesh>
      {/* Table legs */}
      {[
        [-1.3, 0.37, -0.5],
        [1.3, 0.37, -0.5],
        [-1.3, 0.37, -1.5],
        [1.3, 0.37, -1.5],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#3a2415" roughness={0.7} />
        </mesh>
      ))}
      {/* Animated candles */}
      <AnimatedCandle position={[-0.6, 0.79, -1]} height={0.2} />
      <AnimatedCandle position={[0.6, 0.79, -1]} height={0.2} />

      {/* Dining chairs — front side (z=0) */}
      {[-1, 0, 1].map((x, i) => (
        <group key={`chair-front-${i}`} position={[x, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.35, 0.04, 0.35]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.75, 0.16]} castShadow>
            <boxGeometry args={[0.35, 0.5, 0.04]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Dining chairs — back side (z=-2) */}
      {[-1, 0, 1].map((x, i) => (
        <group key={`chair-back-${i}`} position={[x, 0, -2]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.35, 0.04, 0.35]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.75, 0.16]} castShadow>
            <boxGeometry args={[0.35, 0.5, 0.04]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Curtains — right wall window */}
      <mesh position={[3.9, 1.8, -0.5]} castShadow>
        <boxGeometry args={[0.02, 1.4, 0.5]} />
        <meshStandardMaterial color="#7a3a3a" roughness={0.7} />
      </mesh>
      <mesh position={[3.9, 1.8, 0.5]} castShadow>
        <boxGeometry args={[0.02, 1.4, 0.5]} />
        <meshStandardMaterial color="#7a3a3a" roughness={0.7} />
      </mesh>

      {/* Table runner */}
      <mesh position={[0, 0.8, -1]} receiveShadow>
        <boxGeometry args={[0.3, 0.005, 1.2]} />
        <meshStandardMaterial color="#8a3a3a" roughness={0.5} />
      </mesh>

      {/* Wine glasses */}
      <group position={[-0.3, 0.87, -0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#ccccdd" transparent opacity={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#ccccdd" transparent opacity={0.6} roughness={0.2} />
        </mesh>
      </group>
      <group position={[0.3, 0.87, -1.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#ccccdd" transparent opacity={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#ccccdd" transparent opacity={0.6} roughness={0.2} />
        </mesh>
      </group>

      {/* Fireflies — warm ambient glow */}
      <Fireflies count={8} area={[4, 2, 3]} color="#ffdd88" />

      {/* Sideboard — left wall */}
      <mesh position={[-3.5, 0.4, -1]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 0.4]} />
        <meshStandardMaterial color="#4a2a15" roughness={0.6} />
      </mesh>
      {/* Decorative vase on sideboard */}
      <mesh position={[-3.5, 0.88, -1]} castShadow>
        <cylinderGeometry args={[0.06, 0.04, 0.15, 8]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.4} />
      </mesh>
      <GltfModel url="/models/houseplants/scene.gltf" position={[-3, 0, 1.5]} scale={0.4} />

      {/* Chandelier / overhead light */}
      <pointLight
        position={[0, 3, -1]}
        intensity={isNight ? 0.6 : 0.2}
        color={0xffeedd}
        distance={6}
        decay={2}
      />

      {/* Candle accent lights */}
      <pointLight
        position={[-0.8, 1.5, -1]}
        intensity={isNight ? 0.5 : 0.15}
        color={0xffaa55}
        distance={3}
        decay={2}
      />
      <pointLight
        position={[0.8, 1.5, -1]}
        intensity={isNight ? 0.4 : 0.1}
        color={0xffaa55}
        distance={2.5}
        decay={2}
      />

      {/* Memory frames on wall */}
      {items?.slice(0, 4).map((m, i) => (
        <group key={m.id} position={[-2 + i * 1.3, 2.2, -2.5]}>
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
      <mesh position={[3, 1.8, -2]} onClick={() => onOpen("photo")}>
        <boxGeometry args={[0.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#88aacc" transparent opacity={0.15} />
      </mesh>

      {/* Letter hotspot — sideboard */}
      <mesh position={[-3, 1.1, -1.5]} onClick={() => onOpen("letter")}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
