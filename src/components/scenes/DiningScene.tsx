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

      {/* Room shell */}
      <RoomShell tint="#3a2a2a" floorTint="#5a3d2d" width={8} depth={6} height={3.2} />

      {/* ── Dining table (detailed with edge profile) ── */}
      <group position={[0, 0, -1]}>
        {/* Table top with beveled edge */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.08, 1.4]} />
          <meshStandardMaterial color="#5a3520" roughness={0.55} />
        </mesh>
        {/* Edge trim */}
        <mesh position={[0, 0.73, 0]}>
          <boxGeometry args={[3.04, 0.02, 1.44]} />
          <meshStandardMaterial color="#4a2a15" roughness={0.6} />
        </mesh>
        {/* Table legs — turned style with taper */}
        {[
          [-1.3, -0.5],
          [1.3, -0.5],
          [-1.3, 0.5],
          [1.3, 0.5],
        ].map(([x, z], i) => (
          <group key={`leg-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 0.37, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.75, 8]} />
              <meshStandardMaterial color="#3a2415" roughness={0.7} />
            </mesh>
            {/* Foot */}
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.07, 0.05, 0.02, 8]} />
              <meshStandardMaterial color="#3a2415" roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Cross stretcher */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.03, 0.03]} />
          <meshStandardMaterial color="#3a2415" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.8, 0.03, 0.03]} />
          <meshStandardMaterial color="#3a2415" roughness={0.7} />
        </mesh>
      </group>

      {/* ── Table runner (detailed with drape) ── */}
      <mesh position={[0, 0.8, -1]} receiveShadow>
        <boxGeometry args={[0.3, 0.005, 1.5]} />
        <meshStandardMaterial color="#8a3a3a" roughness={0.5} />
      </mesh>
      {/* Runner drape ends */}
      <mesh position={[0, 0.72, -1.72]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.005]} />
        <meshStandardMaterial color="#8a3a3a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.72, -0.28]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.005]} />
        <meshStandardMaterial color="#8a3a3a" roughness={0.5} />
      </mesh>

      {/* ── Animated candles ── */}
      <AnimatedCandle position={[-0.6, 0.79, -1]} height={0.2} />
      <AnimatedCandle position={[0.6, 0.79, -1]} height={0.2} />

      {/* ── Wine glasses (detailed with stem and base) ── */}
      {[
        { pos: [-0.3, 0.87, -0.8] as [number, number, number], rot: 0 },
        { pos: [0.3, 0.87, -1.2] as [number, number, number], rot: 0.1 },
      ].map((g, i) => (
        <group key={`glass-${i}`} position={g.pos} rotation={[g.rot, 0, 0]}>
          {/* Base */}
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.005, 12]} />
            <meshStandardMaterial color="#ccccdd" transparent opacity={0.5} roughness={0.1} metalness={0.3} />
          </mesh>
          {/* Stem */}
          <mesh castShadow>
            <cylinderGeometry args={[0.005, 0.008, 0.12, 8]} />
            <meshStandardMaterial color="#ccccdd" transparent opacity={0.6} roughness={0.1} />
          </mesh>
          {/* Bowl */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial color="#ccccdd" transparent opacity={0.5} roughness={0.1} />
          </mesh>
          {/* Wine inside */}
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#7a1a2a" roughness={0.3} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Plates (2 settings) ── */}
      {[[-0.7, -0.8], [0.7, -1.2]].map(([x, z], i) => (
        <group key={`plate-${i}`} position={[x, 0.8, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.11, 0.01, 16]} />
            <meshStandardMaterial color="#f0ece4" roughness={0.3} />
          </mesh>
          {/* Inner ring */}
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.08, 16]} />
            <meshStandardMaterial color="#e8e0d4" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* ── Napkins ── */}
      {[[-0.7, -0.65], [0.7, -1.35]].map(([x, z], i) => (
        <mesh key={`napkin-${i}`} position={[x, 0.81, z]} rotation={[0, i * 0.5, 0]}>
          <boxGeometry args={[0.08, 0.005, 0.08]} />
          <meshStandardMaterial color="#c8b8a0" roughness={0.7} />
        </mesh>
      ))}

      {/* ── Dining chairs — front side (z=0) with detailed legs ── */}
      {[-1, 0, 1].map((x, i) => (
        <group key={`chair-front-${i}`} position={[x, 0, 0]}>
          {/* Seat with cushion */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.06, 0.38]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.49, 0]}>
            <boxGeometry args={[0.34, 0.02, 0.34]} />
            <meshStandardMaterial color="#6a4a30" roughness={0.5} />
          </mesh>
          {/* Backrest with panel detail */}
          <mesh position={[0, 0.75, -0.17]} castShadow>
            <boxGeometry args={[0.35, 0.5, 0.04]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.75, -0.155]}>
            <boxGeometry args={[0.28, 0.4, 0.01]} />
            <meshStandardMaterial color="#4a2a15" roughness={0.6} />
          </mesh>
          {/* Legs */}
          {[[-0.15, -0.15], [-0.15, 0.15], [0.15, -0.15], [0.15, 0.15]].map(([lx, lz], j) => (
            <mesh key={j} position={[lx, 0.22, lz]}>
              <cylinderGeometry args={[0.012, 0.015, 0.44, 6]} />
              <meshStandardMaterial color="#3a2415" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Dining chairs — back side (z=-2) ── */}
      {[-1, 0, 1].map((x, i) => (
        <group key={`chair-back-${i}`} position={[x, 0, -2]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.06, 0.38]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.49, 0]}>
            <boxGeometry args={[0.34, 0.02, 0.34]} />
            <meshStandardMaterial color="#6a4a30" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.75, 0.17]} castShadow>
            <boxGeometry args={[0.35, 0.5, 0.04]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.75, 0.155]}>
            <boxGeometry args={[0.28, 0.4, 0.01]} />
            <meshStandardMaterial color="#4a2a15" roughness={0.6} />
          </mesh>
          {[[-0.15, -0.15], [-0.15, 0.15], [0.15, -0.15], [0.15, 0.15]].map(([lx, lz], j) => (
            <mesh key={j} position={[lx, 0.22, lz]}>
              <cylinderGeometry args={[0.012, 0.015, 0.44, 6]} />
              <meshStandardMaterial color="#3a2415" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Curtains — right wall with folds and rod ── */}
      <group position={[3.9, 1.8, 0]}>
        {/* Curtain rod */}
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.2, 8]} />
          <meshStandardMaterial color="#5a4a3a" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Rod finials */}
        <mesh position={[0, 0.75, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#5a4a3a" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.75, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#5a4a3a" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Left curtain panel */}
        <mesh position={[0, 0, -0.5]} castShadow>
          <boxGeometry args={[0.02, 1.4, 0.5]} />
          <meshStandardMaterial color="#7a3a3a" roughness={0.7} />
        </mesh>
        {/* Right curtain panel */}
        <mesh position={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.02, 1.4, 0.5]} />
          <meshStandardMaterial color="#7a3a3a" roughness={0.7} />
        </mesh>
        {/* Fold details */}
        {[-0.35, -0.15, 0.15, 0.35].map((z, i) => (
          <mesh key={i} position={[0.015, 0, z]}>
            <boxGeometry args={[0.008, 1.3, 0.025]} />
            <meshStandardMaterial color="#6a2a2a" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ── Sideboard (detailed with doors and drawers) ── */}
      <group position={[-3.5, 0, -1]}>
        {/* Body */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.8, 0.45]} />
          <meshStandardMaterial color="#4a2a15" roughness={0.6} />
        </mesh>
        {/* Top surface */}
        <mesh position={[0, 0.82, 0]} receiveShadow>
          <boxGeometry args={[1.25, 0.04, 0.5]} />
          <meshStandardMaterial color="#5a3520" roughness={0.5} />
        </mesh>
        {/* Door panels */}
        {[-0.35, 0.35].map((x, i) => (
          <group key={`door-${i}`}>
            <mesh position={[x, 0.4, 0.23]}>
              <boxGeometry args={[0.5, 0.65, 0.01]} />
              <meshStandardMaterial color="#3a2010" roughness={0.6} />
            </mesh>
            {/* Handle */}
            <mesh position={[x + 0.15, 0.45, 0.24]}>
              <boxGeometry args={[0.02, 0.06, 0.02]} />
              <meshStandardMaterial color="#a08060" metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Drawer */}
        <mesh position={[0, 0.65, 0.23]}>
          <boxGeometry args={[1.1, 0.12, 0.01]} />
          <meshStandardMaterial color="#3a2010" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.65, 0.24]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#a08060" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Legs */}
        {[[-0.5, -0.18], [-0.5, 0.18], [0.5, -0.18], [0.5, 0.18]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.03, z]}>
            <cylinderGeometry args={[0.025, 0.02, 0.06, 6]} />
            <meshStandardMaterial color="#3a2010" roughness={0.7} />
          </mesh>
        ))}
        {/* Decorative vase */}
        <group position={[0, 0.86, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.04, 0.18, 10]} />
            <meshStandardMaterial color="#6a4a2a" roughness={0.4} />
          </mesh>
          {/* Flowers in vase */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i / 5) * Math.PI * 2;
            const spread = 0.04;
            return (
              <group key={`flower-${i}`}>
                <mesh position={[Math.cos(angle) * spread * 0.5, 0.12 + i * 0.02, Math.sin(angle) * spread * 0.5]}>
                  <cylinderGeometry args={[0.002, 0.002, 0.1, 3]} />
                  <meshStandardMaterial color="#4a7a4a" roughness={0.7} />
                </mesh>
                <mesh position={[Math.cos(angle) * spread, 0.17 + i * 0.02, Math.sin(angle) * spread]}>
                  <sphereGeometry args={[0.015, 6, 6]} />
                  <meshStandardMaterial color={i % 2 === 0 ? "#cc6688" : "#ee8899"} roughness={0.5} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      <GltfModel url="/models/houseplants/scene.gltf" position={[-3, 0, 1.5]} scale={0.4} />

      {/* ── Chandelier (detailed with arms and candles) ── */}
      <group position={[0, 2.8, -1]}>
        {/* Canopy */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 8]} />
          <meshStandardMaterial color="#8a7a60" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Chain links */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 3]} />
          <meshStandardMaterial color="#8a7a60" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.06, 8]} />
          <meshStandardMaterial color="#8a7a60" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Arms with candle holders */}
        {[0, 1.05, 2.09, 3.14, 4.19, 5.24].map((angle, i) => (
          <group key={`arm-${i}`} position={[Math.cos(angle) * 0.2, 0.28, Math.sin(angle) * 0.2]}>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[Math.cos(angle) * 0.05, 0, Math.sin(angle) * 0.05]}>
              <cylinderGeometry args={[0.006, 0.006, 0.12, 4]} />
              <meshStandardMaterial color="#8a7a60" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Candle */}
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.06, 6]} />
              <meshStandardMaterial color="#f5f0e0" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Ceiling light ── */}
      <pointLight
        position={[0, 3, -1]}
        intensity={isNight ? 0.4 : 0.15}
        color={0xffeedd}
        distance={6}
        decay={2}
      />

      {/* Candle accent lights */}
      <pointLight
        position={[-0.8, 1.2, -1]}
        intensity={isNight ? 0.25 : 0.08}
        color={0xffaa55}
        distance={2.5}
        decay={2}
      />
      <pointLight
        position={[0.8, 1.2, -1]}
        intensity={isNight ? 0.2 : 0.06}
        color={0xffaa55}
        distance={2}
        decay={2}
      />

      {/* ── Fireplace mantel — back wall ── */}
      <group position={[0, 0, -2.8]}>
        {/* Mantel shelf */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.06, 0.3]} />
          <meshStandardMaterial color="#5a3520" roughness={0.5} />
        </mesh>
        {/* Brackets */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 1.08, 0.12]}>
            <boxGeometry args={[0.04, 0.18, 0.04]} />
            <meshStandardMaterial color="#4a2a15" roughness={0.6} />
          </mesh>
        ))}
        {/* Candlesticks on mantel */}
        {[-0.5, 0.5].map((x, i) => (
          <group key={`mcandle-${i}`} position={[x, 1.25, 0]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.02, 0.1, 8]} />
              <meshStandardMaterial color="#c8a878" roughness={0.4} />
            </mesh>
            <AnimatedCandle position={[0, 0.07, 0]} height={0.06} />
          </group>
        ))}
        {/* Decorative plate */}
        <mesh position={[0, 1.35, 0.08]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.005, 16]} />
          <meshStandardMaterial color="#e8dcd0" roughness={0.3} />
        </mesh>
      </group>

      {/* ── Area rug under table ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -1]} receiveShadow>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#5a2a2a" roughness={0.9} />
      </mesh>
      {/* Rug border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -1]}>
        <ringGeometry args={[1.3, 1.5, 4]} />
        <meshStandardMaterial color="#4a1a1a" roughness={0.9} transparent opacity={0.6} />
      </mesh>

      {/* ── Wall art — back wall ── */}
      <mesh position={[-2.5, 2, -2.95]}>
        <boxGeometry args={[0.5, 0.4, 0.03]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.5} />
      </mesh>
      <mesh position={[-2.5, 2, -2.93]}>
        <boxGeometry args={[0.4, 0.3, 0.01]} />
        <meshStandardMaterial color="#8a6a4a" roughness={0.6} />
      </mesh>
      <mesh position={[2.5, 2, -2.95]}>
        <boxGeometry args={[0.5, 0.4, 0.03]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.5} />
      </mesh>
      <mesh position={[2.5, 2, -2.93]}>
        <boxGeometry args={[0.4, 0.3, 0.01]} />
        <meshStandardMaterial color="#6a8a6a" roughness={0.6} />
      </mesh>

      {/* ── Memory frames on wall ── */}
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

      {/* Fireflies — warm ambient glow */}
      <Fireflies count={6} area={[3, 1.5, 2]} color="#ffdd88" />

      {/* ── China cabinet / display hutch ── */}
      <group position={[-3.5, 0, -2.3]}>
        {/* Cabinet body */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.0, 2.4, 0.5]} />
          <meshStandardMaterial color="#4a3020" roughness={0.8} />
        </mesh>
        {/* Glass doors (upper) */}
        {[-0.22, 0.22].map((x, i) => (
          <mesh key={`china-door-${i}`} position={[x, 1.5, 0.26]}>
            <boxGeometry args={[0.38, 0.9, 0.02]} />
            <meshStandardMaterial color="#aabbcc" transparent opacity={0.15} roughness={0.1} metalness={0.2} />
          </mesh>
        ))}
        {/* Shelves inside */}
        {[1.1, 1.5, 1.9].map((y, i) => (
          <mesh key={`china-shelf-${i}`} position={[0, y, 0]}>
            <boxGeometry args={[0.9, 0.02, 0.4]} />
            <meshStandardMaterial color="#5a4030" roughness={0.8} />
          </mesh>
        ))}
        {/* Plates on shelves */}
        {[1.15, 1.55].map((y, i) =>
          [-0.2, 0, 0.2].map((x, j) => (
            <mesh key={`plate-${i}-${j}`} position={[x, y, 0.05]} rotation={[0.1, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.005, 12]} />
              <meshStandardMaterial color="#f5f0e8" roughness={0.3} />
            </mesh>
          ))
        )}
        {/* Lower cabinet doors */}
        {[-0.22, 0.22].map((x, i) => (
          <mesh key={`china-lower-${i}`} position={[x, 0.55, 0.26]}>
            <boxGeometry args={[0.38, 0.8, 0.02]} />
            <meshStandardMaterial color="#4a3020" roughness={0.8} />
          </mesh>
        ))}
        {/* Door handles */}
        {[-0.08, 0.08].map((x, i) => (
          <mesh key={`china-handle-${i}`} position={[x, 0.55, 0.28]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial color="#8a7a5a" metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── Wall clock (back wall, right side) ── */}
      <group position={[3, 2.3, -2.9]}>
        {/* Clock face */}
        <mesh>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial color="#f5f0e0" roughness={0.5} />
        </mesh>
        {/* Clock rim */}
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.19, 0.22, 32]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.6} />
        </mesh>
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          return (
            <mesh key={`marker-${i}`} position={[Math.cos(angle) * 0.16, Math.sin(angle) * 0.16, 0.01]}>
              <sphereGeometry args={[0.008, 4, 4]} />
              <meshBasicMaterial color="#4a3a2a" />
            </mesh>
          );
        })}
        {/* Clock hands */}
        <mesh position={[0, 0, 0.015]} rotation={[0, 0, -0.8]}>
          <boxGeometry args={[0.005, 0.12, 0.005]} />
          <meshBasicMaterial color="#3a2a1a" />
        </mesh>
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, -2.1]}>
          <boxGeometry args={[0.003, 0.15, 0.003]} />
          <meshBasicMaterial color="#3a2a1a" />
        </mesh>
        {/* Center dot */}
        <mesh position={[0, 0, 0.025]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshBasicMaterial color="#8a7a5a" />
        </mesh>
      </group>

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
