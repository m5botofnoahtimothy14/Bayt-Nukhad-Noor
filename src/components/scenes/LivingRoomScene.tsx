import { Html } from "@react-three/drei";
import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

const WARM = 0xff9944;
const COOL = 0x8899cc;

function phaseLight(phase: TimePhase) {
  switch (phase) {
    case "night":
      return { color: WARM, intensity: 0.3, ambient: 0.08 };
    case "dusk":
      return { color: WARM, intensity: 0.5, ambient: 0.15 };
    case "dawn":
      return { color: COOL, intensity: 0.4, ambient: 0.12 };
    default:
      return { color: 0xffffff, intensity: 0.6, ambient: 0.25 };
  }
}

export function LivingRoomScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("house");
  const lights = phaseLight(phase);

  return (
    <group>
      <ambientLight intensity={lights.ambient} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#2a1f1a" roughness={0.85} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#3d2e28" roughness={0.9} />
      </mesh>

      {/* Bookshelf — left side */}
      <GltfModel
        url="/models/books/scene.gltf"
        position={[-2.5, 0.9, -2.5]}
        scale={1.2}
        rotation={[0, 0.3, 0]}
      />

      {/* Bookshelf accent light */}
      <pointLight position={[-2.5, 1.5, -2]} intensity={0.4} color={WARM} distance={3} decay={2} />

      {/* Lantern on side table — center-right */}
      <group position={[1.5, 0.75, -1.5]}>
        <GltfModel url="/models/lantern/scene.gltf" scale={0.6} />
        <pointLight
          position={[0, 0.4, 0]}
          intensity={lights.intensity}
          color={lights.color}
          distance={4}
          decay={2}
        />
      </group>

      {/* Houseplant — far right corner */}
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[3, 0, -2.5]}
        scale={0.8}
        rotation={[0, -0.5, 0]}
      />

      {/* Vinyl player — left foreground */}
      <GltfModel
        url="/models/vinyl-player/scene.gltf"
        position={[-1.2, 0.6, 0.5]}
        scale={0.7}
        rotation={[0, 0.8, 0]}
      />

      {/* Fireplace glow (decorative point light) */}
      <pointLight
        position={[0, 0.5, -2.8]}
        intensity={phase === "night" ? 0.8 : 0.3}
        color={0xff6622}
        distance={5}
        decay={2}
      />

      {/* Ceiling light */}
      <pointLight position={[0, 3.5, 0]} intensity={0.2} color={0xffeedd} distance={6} decay={2} />

      {/* Memory hotspots — books */}
      <mesh position={[-2.5, 1.6, -2]} onClick={() => onOpen("memory")}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.5} />
      </mesh>

      {/* Memory hotspots — near lantern */}
      <mesh position={[1.5, 1.5, -1.5]} onClick={() => onOpen("letter")}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.4} />
      </mesh>

      {/* Existing memories as small glowing markers */}
      {items?.slice(0, 6).map((_m, i) => (
        <group key={m.id} position={[-3 + i * 1.1, 1.8 + Math.sin(i) * 0.3, -2.6]}>
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
