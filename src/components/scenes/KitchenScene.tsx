import { GltfModel } from "@/components/models/GltfModel";
import { RoomShell } from "@/components/world/RoomShell";
import { useMemories, type Memory } from "@/components/world/memories";
import { useSharedState } from "@/hooks/useSharedState";
import { useVinylAudio } from "@/hooks/useVinylAudio";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { AnimatedCandle } from "@/components/world/AnimatedElements";
import { RealCat } from "@/components/world/RealCat";
import { Html } from "@react-three/drei";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (_m: Memory) => void;
};

type VinylState = { trackIdx: number; playing: boolean; startedAt: string };

const TRACKS = [
  "Moonlight Sonata",
  "Clair de Lune",
  "Nuvole Bianche",
  "Comptine d'un autre ete",
  "River Flows in You",
  "Gymnopedie No.1",
];

export function KitchenScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("kitchen");
  const { value: vinyl, setValue: setVinyl } = useSharedState<VinylState>("house.vinyl", {
    trackIdx: 0,
    playing: false,
    startedAt: new Date().toISOString(),
  });
  const { playing: audioPlaying, toggle: toggleAudio } = useVinylAudio();

  const isNight = phase === "night" || phase === "dusk";

  const cycleTrack = () => {
    const nextIdx = (vinyl.trackIdx + 1) % TRACKS.length;
    setVinyl((prev) => ({
      ...prev,
      trackIdx: nextIdx,
      playing: true,
      startedAt: new Date().toISOString(),
    }));
    toggleAudio(nextIdx);
  };

  return (
    <group>
      <ambientLight intensity={isNight ? 0.08 : 0.2} />

      {/* Procedural kitchen shell + counters */}
      <RoomShell tint="#e8dcc4" floorTint="#8a6a4a" width={8} depth={6} height={3} />
      {/* Counter L-shape */}
      <mesh position={[0, 0.45, -2.4]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.9, 0.8]} />
        <meshStandardMaterial color="#c8b088" roughness={0.5} />
      </mesh>
      <mesh position={[-2.8, 0.45, -1]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.9, 2.8]} />
        <meshStandardMaterial color="#c8b088" roughness={0.5} />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, 0.92, -2.4]} receiveShadow>
        <boxGeometry args={[6.05, 0.05, 0.85]} />
        <meshStandardMaterial color="#2a2620" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Fridge */}
      <mesh position={[2.8, 1, -2.6]} castShadow>
        <boxGeometry args={[1, 2, 0.7]} />
        <meshStandardMaterial color="#dcdcdc" roughness={0.35} metalness={0.5} />
      </mesh>
      <GltfModel url="/models/vinyl-player/scene.gltf" position={[-1.5, 0.95, -2.4]} scale={0.3} />

      {/* Vinyl player accent light when playing */}
      <pointLight
        position={[-1.5, 1.2, 0]}
        intensity={vinyl.playing ? 0.5 : 0.1}
        color={vinyl.playing ? 0xff6644 : 0x666666}
        distance={3}
        decay={2}
      />

      {/* Ceiling light */}
      <pointLight
        position={[0, 3, -1]}
        intensity={isNight ? 0.5 : 0.2}
        color={0xffeedd}
        distance={5}
        decay={2}
      />

      {/* Now-playing label */}
      {vinyl.playing && (
        <Html position={[-1.5, 2, 0]} distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-[10px] text-amber-200 backdrop-blur-sm">
            ♪ {TRACKS[vinyl.trackIdx]}
          </div>
        </Html>
      )}

      {/* Click to cycle vinyl track */}
      <mesh position={[-1.5, 1, 0]} onClick={cycleTrack}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Memory — fridge magnet style */}
      <mesh position={[2.8, 1.5, -1]} onClick={() => onOpen("memory")}>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshStandardMaterial color="#cc3333" roughness={0.6} />
      </mesh>

      {/* Memories on fridge */}
      {items?.slice(0, 3).map((m, i) => (
        <group key={m.id} position={[2.2 + i * 0.5, 1.5, -0.95]}>
          <mesh onClick={() => onView(m)}>
            <boxGeometry args={[0.35, 0.4, 0.04]} />
            <meshStandardMaterial
              color={m.kind === "photo" ? "#4488cc" : "#ddaa44"}
              roughness={0.5}
            />
          </mesh>
          <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
            <div className="max-w-[80px] truncate rounded bg-black/60 px-1.5 py-0.5 text-[8px] text-white/80">
              {m.title}
            </div>
          </Html>
        </group>
      ))}

      {/* Kitchen table — small round table in center */}
      <mesh position={[1.5, 0.5, 1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.04, 16]} />
        <meshStandardMaterial color="#8a6a4a" roughness={0.5} />
      </mesh>
      <mesh position={[1.5, 0.25, 1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#8a6a4a" roughness={0.5} />
      </mesh>

      {/* Chair 1 */}
      <group position={[1.0, 0, 1.2]}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.04, 0.35]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.5, -0.155]} castShadow>
          <boxGeometry args={[0.35, 0.4, 0.04]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.5} />
        </mesh>
      </group>

      {/* Chair 2 */}
      <group position={[2.0, 0, 0.8]}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.04, 0.35]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.5, 0.155]} castShadow>
          <boxGeometry args={[0.35, 0.4, 0.04]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.5} />
        </mesh>
      </group>

      {/* Hanging pots above counter */}
      {([-1, -0.5, 0] as const).map((x, i) => (
        <group key={`pot-${i}`}>
          <mesh position={[x, 2.5, -2.4]} castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.12, 8]} />
            <meshStandardMaterial color="#8a7a6a" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[x, 2.66, -2.4]}>
            <cylinderGeometry args={[0.005, 0.005, 0.3, 3]} />
            <meshStandardMaterial color="#555555" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Bread loaf on counter */}
      <mesh position={[1, 0.97, -2.4]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.12]} />
        <meshStandardMaterial color="#c8a060" roughness={0.7} />
      </mesh>

      {/* Curtains near window area (right wall) */}
      <mesh position={[3.9, 1.8, -1]} castShadow>
        <boxGeometry args={[0.02, 1.2, 0.4]} />
        <meshStandardMaterial color="#d8c8b0" roughness={0.6} />
      </mesh>
      <mesh position={[3.9, 1.8, 0]} castShadow>
        <boxGeometry args={[0.02, 1.2, 0.4]} />
        <meshStandardMaterial color="#d8c8b0" roughness={0.6} />
      </mesh>

      {/* Animated candle on table */}
      <AnimatedCandle position={[1.5, 0.55, 1]} height={0.12} />

      {/* Ceiling lamp — decorative lampshade (inverted cone) */}
      <mesh position={[0, 2.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.15, 0.2, 8]} />
        <meshStandardMaterial color="#3a3020" roughness={0.6} />
      </mesh>

      {/* ── Animated cat ── */}
      <RealCat position={[-2, 0, 0]} />
    </group>
  );
}
