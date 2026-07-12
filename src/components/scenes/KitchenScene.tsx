import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import { useSharedState } from "@/hooks/useSharedState";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { Html } from "@react-three/drei";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

type VinylState = { trackIdx: number; playing: boolean; startedAt: string };

const TRACKS = [
  "Moonlight Sonata",
  "Clair de Lune",
  "Nuvole Bianche",
  "Comptine d'un autre été",
  "River Flows in You",
  "Gymnopédie No.1",
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
      <ambientLight intensity={isNight ? 0.1 : 0.3} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.7} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#f0e6da" roughness={0.85} />
      </mesh>

      {/* Vinyl player — on counter */}
      <group position={[-1.5, 0.9, -2]}>
        <GltfModel
          url="/models/vinyl-player/scene.gltf"
          scale={0.8}
          rotation={[0, 0.5, 0]}
          onClick={cycleTrack}
        />
        <pointLight
          position={[0, 0.5, 0]}
          intensity={vinyl.playing ? 0.4 : 0.1}
          color={vinyl.playing ? 0xff6644 : 0x666666}
          distance={2}
          decay={2}
        />
      </group>

      {/* Now-playing label */}
      {vinyl.playing && (
        <Html position={[-1.5, 1.8, -2]} distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-[10px] text-amber-200 backdrop-blur-sm">
            ♪ {TRACKS[vinyl.trackIdx]}
          </div>
        </Html>
      )}

      {/* Houseplants — windowsill */}
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[2.5, 1.1, -2.7]}
        scale={0.5}
        rotation={[0, -0.3, 0]}
      />
      <GltfModel
        url="/models/houseplants/scene.gltf"
        position={[1.5, 1.1, -2.7]}
        scale={0.4}
        rotation={[0, 0.2, 0]}
      />

      {/* Lantern — ambient on shelf */}
      <group position={[0, 1.2, -2.8]}>
        <GltfModel url="/models/lantern/scene.gltf" scale={0.35} />
        <pointLight intensity={isNight ? 0.5 : 0.15} color={0xff9944} distance={3} decay={2} />
      </group>

      {/* Pendant light */}
      <pointLight
        position={[0, 3, -1]}
        intensity={isNight ? 0.6 : 0.2}
        color={0xffeedd}
        distance={5}
        decay={2}
      />

      {/* Stove glow */}
      {isNight && (
        <pointLight
          position={[-2.5, 0.6, -2.5]}
          intensity={0.3}
          color={0xff4400}
          distance={2}
          decay={2}
        />
      )}

      {/* Memory — fridge magnet style */}
      <mesh position={[2.8, 1.5, -2.9]} onClick={() => onOpen("memory")}>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshStandardMaterial color="#cc3333" roughness={0.6} />
      </mesh>

      {/* Memories on fridge */}
      {items?.slice(0, 3).map((_m, i) => (
        <group key={m.id} position={[2.2 + i * 0.5, 1.5, -2.85]}>
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
