import { GltfModel } from "@/components/models/GltfModel";
import { RoomShell } from "@/components/world/RoomShell";
import { useMemories, type Memory } from "@/components/world/memories";
import { useSharedState } from "@/hooks/useSharedState";
import type { TimePhase } from "@/hooks/useTimeOfDay";
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

  const isNight = phase === "night" || phase === "dusk";

  const cycleTrack = () => {
    setVinyl((prev) => ({
      ...prev,
      trackIdx: (prev.trackIdx + 1) % TRACKS.length,
      playing: true,
      startedAt: new Date().toISOString(),
    }));
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
    </group>
  );
}
