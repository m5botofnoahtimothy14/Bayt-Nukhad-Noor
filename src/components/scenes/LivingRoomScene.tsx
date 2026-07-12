import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { Html } from "@react-three/drei";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (_m: Memory) => void;
};

const WARM = 0xff9944;

function phaseLight(phase: TimePhase) {
  switch (phase) {
    case "night":
      return { intensity: 0.15, ambient: 0.05 };
    case "dusk":
      return { intensity: 0.3, ambient: 0.1 };
    case "dawn":
      return { intensity: 0.25, ambient: 0.1 };
    default:
      return { intensity: 0.4, ambient: 0.2 };
  }
}

export function LivingRoomScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("house");
  const lights = phaseLight(phase);

  return (
    <group>
      <ambientLight intensity={lights.ambient} />

      {/* Full living room environment from .blend */}
      <GltfModel url="/models/livingroom/scene.glb" position={[0, 0, 0]} scale={1} />

      {/* Fireplace model */}
      <GltfModel url="/models/fireplace/scene.glb" position={[0, 0, -2]} scale={1} />

      {/* Fireplace warm glow */}
      <pointLight
        position={[0, 0.8, -1.5]}
        intensity={phase === "night" ? 1.2 : 0.4}
        color={WARM}
        distance={6}
        decay={2}
      />

      {/* Additional accent lighting */}
      <pointLight position={[0, 3, 0]} intensity={0.15} color={0xffeedd} distance={5} decay={2} />

      {/* Interactive hotspot — near fireplace area */}
      <mesh position={[-1.5, 1.2, 0]} onClick={() => onOpen("memory")}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
      </mesh>
      <Html position={[-1.5, 1.5, 0]} distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/60 px-2 py-0.5 text-[9px] text-white/80 backdrop-blur-sm serif italic">
          memory spot
        </div>
      </Html>

      {/* Letter hotspot */}
      <mesh position={[1.5, 1.0, -1]} onClick={() => onOpen("letter")}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.4} />
      </mesh>

      {/* Existing memories as floating markers */}
      {items?.slice(0, 6).map((m, i) => (
        <group key={m.id} position={[-3 + i * 1.1, 2 + Math.sin(i) * 0.3, -1]}>
          <mesh onClick={() => onView(m)}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial
              color={m.kind === "photo" ? "#66ccff" : m.kind === "song" ? "#ff66cc" : "#ffcc66"}
              transparent
              opacity={0.7}
            />
          </mesh>
          <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded bg-black/60 px-2 py-0.5 text-[9px] text-white/80 backdrop-blur-sm">
              {m.title}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
