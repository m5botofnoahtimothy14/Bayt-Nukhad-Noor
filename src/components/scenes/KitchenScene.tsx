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

      {/* Room shell */}
      <RoomShell tint="#e8dcc4" floorTint="#8a6a4a" width={8} depth={6} height={3} />

      {/* ── Counter L-shape ── */}
      <mesh position={[0, 0.45, -2.4]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.9, 0.8]} />
        <meshStandardMaterial color="#c8b088" roughness={0.5} />
      </mesh>
      <mesh position={[-2.8, 0.45, -1]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.9, 2.8]} />
        <meshStandardMaterial color="#c8b088" roughness={0.5} />
      </mesh>
      {/* Counter top (dark stone) */}
      <mesh position={[0, 0.92, -2.4]} receiveShadow>
        <boxGeometry args={[6.05, 0.05, 0.85]} />
        <meshStandardMaterial color="#2a2620" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-2.8, 0.92, -1]} receiveShadow>
        <boxGeometry args={[0.85, 0.05, 2.85]} />
        <meshStandardMaterial color="#2a2620" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* ── Upper cabinets ── */}
      {[-2.5, -1.5, -0.5, 0.5].map((x, i) => (
        <group key={`ucab-${i}`} position={[x, 2.0, -2.65]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.8, 0.35]} />
            <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
          </mesh>
          {/* Door panel detail */}
          <mesh position={[0, 0, 0.18]}>
            <boxGeometry args={[0.75, 0.7, 0.01]} />
            <meshStandardMaterial color="#c8b898" roughness={0.6} />
          </mesh>
          {/* Handle */}
          <mesh position={[0.3, 0, 0.2]}>
            <boxGeometry args={[0.02, 0.12, 0.02]} />
            <meshStandardMaterial color="#a08060" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* ── Stove / Oven ── */}
      <group position={[1.5, 0, -2.4]}>
        {/* Oven body */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.8, 0.9, 0.75]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Oven door */}
        <mesh position={[0, 0.35, 0.38]}>
          <boxGeometry args={[0.7, 0.5, 0.02]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Oven window */}
        <mesh position={[0, 0.38, 0.395]}>
          <boxGeometry args={[0.5, 0.3, 0.005]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.1} metalness={0.3} />
        </mesh>
        {/* Oven handle */}
        <mesh position={[0, 0.55, 0.4]}>
          <boxGeometry args={[0.4, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Stovetop burners */}
        {[[-0.2, -0.15], [-0.2, 0.15], [0.2, -0.15], [0.2, 0.15]].map(([x, z], i) => (
          <mesh key={`burner-${i}`} position={[x, 0.95, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.08, 16]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── Sink ── */}
      <group position={[-0.5, 0.92, -2.4]}>
        {/* Basin */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.35]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.6} />
        </mesh>
        {/* Faucet */}
        <mesh position={[0, 0.15, -0.15]}>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
          <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Faucet spout */}
        <mesh position={[0, 0.26, 0]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.15, 6]} />
          <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Fridge ── */}
      <mesh position={[2.8, 1, -2.6]} castShadow>
        <boxGeometry args={[1, 2, 0.7]} />
        <meshStandardMaterial color="#dcdcdc" roughness={0.35} metalness={0.5} />
      </mesh>
      {/* Fridge handle */}
      <mesh position={[2.35, 1.2, -2.25]}>
        <boxGeometry args={[0.02, 0.5, 0.03]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Fridge divider line */}
      <mesh position={[2.8, 0.5, -2.25]}>
        <boxGeometry args={[0.95, 0.01, 0.01]} />
        <meshStandardMaterial color="#bbbbbb" roughness={0.4} />
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

      {/* ── Kitchen table — round with pedestal base ── */}
      <group position={[1.5, 0, 1]}>
        {/* Table top */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.04, 24]} />
          <meshStandardMaterial color="#8a6a4a" roughness={0.5} />
        </mesh>
        {/* Pedestal */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#7a5a3a" roughness={0.6} />
        </mesh>
        {/* Base feet */}
        {[0, 1.57, 3.14, 4.71].map((angle, i) => (
          <mesh
            key={`foot-${i}`}
            position={[Math.cos(angle) * 0.2, 0.02, Math.sin(angle) * 0.2]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.04, 0.04, 0.2]} />
            <meshStandardMaterial color="#7a5a3a" roughness={0.6} />
          </mesh>
        ))}
        {/* Tablecloth edge */}
        <mesh position={[0, 0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.62, 24]} />
          <meshStandardMaterial color="#e8d8c8" roughness={0.9} side={2} />
        </mesh>
      </group>

      {/* ── Chairs (detailed with legs and backrest) ── */}
      {[
        { pos: [1.0, 0, 1.3] as [number, number, number], rot: 0.3 },
        { pos: [2.0, 0, 0.7] as [number, number, number], rot: -0.5 },
        { pos: [1.8, 0, 1.6] as [number, number, number], rot: 0.8 },
      ].map((chair, i) => (
        <group key={`chair-${i}`} position={chair.pos} rotation={[0, chair.rot, 0]}>
          {/* Seat */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.04, 0.38]} />
            <meshStandardMaterial color="#6a4a30" roughness={0.5} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.55, -0.17]} castShadow>
            <boxGeometry args={[0.35, 0.45, 0.04]} />
            <meshStandardMaterial color="#6a4a30" roughness={0.5} />
          </mesh>
          {/* Legs */}
          {[[-0.15, -0.15], [-0.15, 0.15], [0.15, -0.15], [0.15, 0.15]].map(([x, z], j) => (
            <mesh key={j} position={[x, 0.15, z]}>
              <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
              <meshStandardMaterial color="#5a3a20" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Hanging pots and pans ── */}
      {([-1.5, -0.8, -0.1] as const).map((x, i) => (
        <group key={`pot-${i}`}>
          {/* Hook */}
          <mesh position={[x, 2.6, -2.4]}>
            <cylinderGeometry args={[0.005, 0.005, 0.3, 3]} />
            <meshStandardMaterial color="#555555" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Pot */}
          <mesh position={[x, 2.42, -2.4]} castShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.14, 10]} />
            <meshStandardMaterial
              color={i === 1 ? "#8a7a6a" : "#6a6a6a"}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          {/* Handle */}
          <mesh position={[x + 0.14, 2.45, -2.4]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 4]} />
            <meshStandardMaterial color="#555555" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Counter clutter ── */}
      {/* Bread loaf */}
      <mesh position={[1, 0.97, -2.4]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.12]} />
        <meshStandardMaterial color="#c8a060" roughness={0.7} />
      </mesh>
      {/* Cutting board */}
      <mesh position={[-0.2, 0.96, -2.3]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshStandardMaterial color="#b08050" roughness={0.6} />
      </mesh>
      {/* Knife block */}
      <group position={[2, 0.96, -2.3]}>
        <mesh>
          <boxGeometry args={[0.12, 0.2, 0.08]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
        </mesh>
        {/* Knife handles */}
        {[0, 0.03, 0.06].map((y, i) => (
          <mesh key={i} position={[0, 0.12 + y, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.02]} />
            <meshStandardMaterial color="#2a1a0a" roughness={0.5} />
          </mesh>
        ))}
      </group>
      {/* Salt & pepper */}
      <mesh position={[-1, 0.97, -2.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.4} />
      </mesh>
      <mesh position={[-0.9, 0.97, -2.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
      </mesh>
      {/* Teapot */}
      <group position={[-2, 0.97, -0.8]}>
        <mesh>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#c8a060" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Spout */}
        <mesh position={[0.08, 0.02, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.01, 0.015, 0.08, 6]} />
          <meshStandardMaterial color="#c8a060" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.08, 0.03, 0]} rotation={[0, 0, -0.3]}>
          <torusGeometry args={[0.04, 0.008, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#c8a060" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* ── Curtains near window area (right wall) ── */}
      {[-1, 0].map((z, i) => (
        <group key={`curtain-${i}`} position={[3.9, 1.8, z]}>
          <mesh>
            <boxGeometry args={[0.02, 1.2, 0.4]} />
            <meshStandardMaterial color="#d8c8b0" roughness={0.6} />
          </mesh>
          {/* Fold detail */}
          <mesh position={[0.015, 0, 0]}>
            <boxGeometry args={[0.008, 1.2, 0.03]} />
            <meshStandardMaterial color="#c8b8a0" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Animated candle on table */}
      <AnimatedCandle position={[1.5, 0.55, 1]} height={0.12} />

      {/* Ceiling pendant light */}
      <group position={[1.5, 2.6, 1]}>
        {/* Cord */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.4, 3]} />
          <meshStandardMaterial color="#333333" roughness={0.5} />
        </mesh>
        {/* Shade */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.18, 0.22, 10]} />
          <meshStandardMaterial
            color="#e8d8c0"
            roughness={0.8}
            side={2}
            transparent
            opacity={0.9}
          />
        </mesh>
        <pointLight position={[0, -0.05, 0]} color={0xffeedd} intensity={0.4} distance={4} decay={2} />
      </group>

      {/* ── Animated cat ── */}
      <RealCat location="kitchen" />
    </group>
  );
}
