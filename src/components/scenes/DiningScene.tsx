import { GltfModel } from "@/components/models/GltfModel";
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

      {/* Full dining room environment from .blend */}
      <GltfModel url="/models/diningroom/scene.glb" position={[0, 0, 0]} scale={1} />

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
