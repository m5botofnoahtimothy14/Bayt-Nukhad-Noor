import { GltfModel } from "@/components/models/GltfModel";
import { RoomShell } from "@/components/world/RoomShell";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatedCandle, Fireflies, FallingLeaves } from "@/components/world/AnimatedElements";
import { RealCat } from "@/components/world/RealCat";

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

/* ── Detailed procedural bookshelf ── */
function Bookshelf({ position }: { position: [number, number, number] }) {
  const bookColors = useMemo(() => [
    "#8a3a2a", "#2a4a6a", "#4a6a3a", "#6a4a2a", "#5a3a5a",
    "#3a5a5a", "#7a5a3a", "#4a3a6a", "#6a2a3a", "#2a5a4a",
    "#8a5a4a", "#3a4a7a", "#5a6a3a", "#7a3a4a", "#4a6a5a",
  ], []);

  return (
    <group position={position}>
      {/* Frame */}
      {[0, 1, 2, 3].map((shelf) => (
        <mesh key={`shelf-${shelf}`} position={[0, shelf * 0.55 + 0.1, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.35]} />
          <meshStandardMaterial color="#4a3020" roughness={0.75} />
        </mesh>
      ))}
      {/* Side panels */}
      {[-0.58, 0.58].map((x, i) => (
        <mesh key={`side-${i}`} position={[x, 1.0, 0]}>
          <boxGeometry args={[0.04, 2.0, 0.35]} />
          <meshStandardMaterial color="#3a2515" roughness={0.8} />
        </mesh>
      ))}
      {/* Back panel */}
      <mesh position={[0, 1.0, -0.16]}>
        <boxGeometry args={[1.2, 2.0, 0.02]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.9} />
      </mesh>
      {/* Books on shelves */}
      {[0, 1, 2].map((shelf) =>
        Array.from({ length: 6 + shelf }).map((_, i) => {
          const h = 0.3 + Math.random() * 0.15;
          const w = 0.04 + Math.random() * 0.03;
          const x = -0.45 + i * 0.14 + (Math.random() - 0.5) * 0.02;
          return (
            <mesh
              key={`book-${shelf}-${i}`}
              position={[x, shelf * 0.55 + 0.12 + h / 2, 0.02]}
            >
              <boxGeometry args={[w, h, 0.2]} />
              <meshStandardMaterial
                color={bookColors[(shelf * 6 + i) % bookColors.length]}
                roughness={0.85}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

/* ── Floor lamp ── */
function FloorLamp({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.04, 12]} />
        <meshStandardMaterial color="#2a1a10" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.3, 6]} />
        <meshStandardMaterial color="#3a2a1a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.2, 12, 1, true]} />
        <meshStandardMaterial
          color="#f5e8d0"
          roughness={0.9}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Bulb glow */}
      <pointLight
        ref={lightRef}
        position={[0, 1.35, 0]}
        color={0xffeedd}
        intensity={0.6}
        distance={4}
        decay={2}
      />
    </group>
  );
}

/* ── Fireplace mantel with decorations ── */
function Fireplace({ phase }: { phase: TimePhase }) {
  const fireLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!fireLightRef.current) return;
    const t = clock.getElapsedTime();
    if (phase === "night") {
      fireLightRef.current.intensity = 1.15 + Math.sin(t * 3) * 0.35 + Math.sin(t * 7.3) * 0.1;
    } else if (phase === "dusk" || phase === "dawn") {
      fireLightRef.current.intensity = 0.6 + Math.sin(t * 2) * 0.15;
    } else {
      fireLightRef.current.intensity = 0.4 + Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group position={[0, 0, -2.7]}>
      {/* Hearth base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.0, 0.5]} />
        <meshStandardMaterial color="#2a1a14" roughness={0.9} />
      </mesh>
      {/* Fire opening */}
      <mesh position={[0, 0.4, 0.26]}>
        <boxGeometry args={[1.4, 0.7, 0.05]} />
        <meshStandardMaterial
          color="#ff7733"
          emissive="#ff5522"
          emissiveIntensity={phase === "night" ? 1.4 : 0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Mantel shelf */}
      <mesh position={[0, 1.05, 0.1]} castShadow>
        <boxGeometry args={[2.4, 0.08, 0.35]} />
        <meshStandardMaterial color="#3a2515" roughness={0.7} />
      </mesh>
      {/* Mantel supports */}
      {[-1.0, 1.0].map((x, i) => (
        <mesh key={i} position={[x, 0.75, 0.1]}>
          <boxGeometry args={[0.12, 0.55, 0.3]} />
          <meshStandardMaterial color="#2a1a10" roughness={0.8} />
        </mesh>
      ))}
      {/* Decorative items on mantel */}
      {/* Small framed photo */}
      <mesh position={[-0.5, 1.15, 0.1]}>
        <boxGeometry args={[0.15, 0.2, 0.02]} />
        <meshStandardMaterial color="#5a3a2a" roughness={0.6} />
      </mesh>
      <mesh position={[-0.5, 1.15, 0.115]}>
        <boxGeometry args={[0.11, 0.15, 0.005]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.4} />
      </mesh>
      {/* Candlestick */}
      <mesh position={[0.6, 1.15, 0.1]}>
        <cylinderGeometry args={[0.02, 0.025, 0.15, 8]} />
        <meshStandardMaterial color="#c0a060" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, 1.25, 0.1]}>
        <cylinderGeometry args={[0.01, 0.012, 0.06, 6]} />
        <meshStandardMaterial color="#f5f0dc" roughness={0.6} />
      </mesh>
      {/* Fire glow */}
      <pointLight
        ref={fireLightRef}
        position={[0, 0.6, 0.8]}
        intensity={phase === "night" ? 1.2 : 0.4}
        color={WARM}
        distance={6}
        decay={2}
      />
    </group>
  );
}

export function LivingRoomScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("house");
  const lights = phaseLight(phase);

  return (
    <group>
      <ambientLight intensity={lights.ambient} />

      {/* Room shell */}
      <RoomShell tint="#3a2620" floorTint="#5a3d2d" width={9} depth={6} height={3.2} />

      {/* Fireplace */}
      <Fireplace phase={phase} />

      {/* GLTF props */}
      <GltfModel url="/models/houseplants/scene.gltf" position={[-3.5, 0, 1.5]} scale={0.45} />
      <GltfModel url="/models/vinyl-player/scene.gltf" position={[-2.8, 0.5, -2]} scale={0.4} />

      {/* Procedural bookshelf (replaces broken GLB) */}
      <Bookshelf position={[3.5, 0, -2.5]} />

      {/* Floor lamps */}
      <FloorLamp position={[-3.8, 0, -1]} />
      <FloorLamp position={[3.8, 0, 0.5]} />

      {/* Ceiling light */}
      <pointLight position={[0, 3, 0]} intensity={0.2} color={0xffeedd} distance={5} decay={2} />

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

      {/* ── Sofa (detailed with rolled arms and tufted back) ── */}
      <group position={[0, 0, 0.5]}>
        {/* Seat base */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.8, 0.2, 0.8]} />
          <meshStandardMaterial color="#5a3a2a" roughness={0.85} />
        </mesh>
        {/* Back cushion */}
        <mesh position={[0, 0.6, -0.32]}>
          <boxGeometry args={[1.7, 0.45, 0.18]} />
          <meshStandardMaterial color="#4a2a1a" roughness={0.85} />
        </mesh>
        {/* Rolled armrests */}
        {[-0.85, 0.85].map((x, i) => (
          <group key={`arm-${i}`} position={[x, 0.45, 0]}>
            <mesh>
              <boxGeometry args={[0.18, 0.35, 0.8]} />
              <meshStandardMaterial color="#4a2a1a" roughness={0.85} />
            </mesh>
            {/* Armrest top roll */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.18, 8]} />
              <meshStandardMaterial color="#5a3a2a" roughness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Seat cushions (tufted look) */}
        {[-0.42, 0.42].map((x, i) => (
          <mesh key={`cushion-${i}`} position={[x, 0.43, 0.05]} castShadow>
            <boxGeometry args={[0.55, 0.06, 0.5]} />
            <meshStandardMaterial color="#8a6a5a" roughness={0.9} />
          </mesh>
        ))}
        {/* Back buttons (tufted detail) */}
        {[-0.4, 0, 0.4].map((x, i) => (
          <mesh key={`btn-${i}`} position={[x, 0.6, -0.22]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
          </mesh>
        ))}
        {/* Decorative throw pillow */}
        <mesh position={[-0.55, 0.52, -0.15]} rotation={[0.1, 0.2, 0.15]}>
          <boxGeometry args={[0.25, 0.25, 0.08]} />
          <meshStandardMaterial color="#c4956a" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Coffee table (detailed with lower shelf) ── */}
      <group position={[0, 0, 1.5]}>
        {/* Top surface */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.0, 0.06, 0.5]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.7} />
        </mesh>
        {/* Lower shelf */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.85, 0.04, 0.4]} />
          <meshStandardMaterial color="#5a3a20" roughness={0.8} />
        </mesh>
        {/* Legs (turned style) */}
        {[[-0.42, -0.2], [-0.42, 0.2], [0.42, -0.2], [0.42, 0.2]].map(([x, z], i) => (
          <mesh key={`leg-${i}`} position={[x, 0.16, z]}>
            <cylinderGeometry args={[0.025, 0.03, 0.32, 8]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.8} />
          </mesh>
        ))}
        {/* Coffee cup */}
        <group position={[0.15, 0.41, 0]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.03, 0.06, 12]} />
            <meshStandardMaterial color="#f5f0e8" roughness={0.3} />
          </mesh>
        </group>
        {/* Book on table */}
        <mesh position={[-0.2, 0.4, 0.05]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.18, 0.03, 0.13]} />
          <meshStandardMaterial color="#6a3a2a" roughness={0.8} />
        </mesh>
      </group>

      {/* ── Area rug (with border detail) ── */}
      <group position={[0, 0.005, 1.2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.015, 48]} />
          <meshStandardMaterial color="#8a5a4a" roughness={0.95} />
        </mesh>
        {/* Border ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[1.5, 1.75, 48]} />
          <meshStandardMaterial color="#6a3a2a" roughness={0.95} />
        </mesh>
        {/* Inner medallion */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <circleGeometry args={[0.6, 32]} />
          <meshStandardMaterial color="#7a4a3a" roughness={0.95} />
        </mesh>
      </group>

      {/* ── Curtains (with folds) ── */}
      {[-4.4, 4.4].map((x) =>
        [-0.5, 0.5].map((z, i) => (
          <group key={`curtain-${x}-${i}`} position={[x, 1.8, z]}>
            {/* Main curtain panel */}
            <mesh>
              <boxGeometry args={[0.02, 1.5, 0.5]} />
              <meshStandardMaterial color="#6a4a4a" roughness={0.9} />
            </mesh>
            {/* Fold details */}
            {[-0.15, 0, 0.15].map((dz, j) => (
              <mesh key={j} position={[0.015, 0, dz]}>
                <boxGeometry args={[0.01, 1.5, 0.04]} />
                <meshStandardMaterial color="#5a3a3a" roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))
      )}

      {/* ── Side table with plant ── */}
      <group position={[-3.2, 0, -0.5]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#5a3a20" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
          <meshStandardMaterial color="#4a2a15" roughness={0.8} />
        </mesh>
      </group>

      <AnimatedCandle position={[-4.2, 1.5, 0]} />
      <AnimatedCandle position={[4.2, 1.5, 0]} />

      {/* ── Fireflies near ceiling ── */}
      <Fireflies count={12} area={[5, 2, 4]} color="#ffcc66" />

      {/* ── Hanging picture frames (with matting) ── */}
      {[-1.5, 0, 1.5].map((x, i) => {
        const innerColors = ["#8a6a5a", "#6a8a6a", "#6a6a8a"];
        return (
          <group key={`frame-${i}`} position={[x, 2.2, -2.9]}>
            {/* Frame */}
            <mesh>
              <boxGeometry args={[0.45, 0.35, 0.025]} />
              <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
            </mesh>
            {/* Mat */}
            <mesh position={[0, 0, 0.013]}>
              <boxGeometry args={[0.38, 0.28, 0.003]} />
              <meshStandardMaterial color="#e8e0d0" roughness={0.6} />
            </mesh>
            {/* Art */}
            <mesh position={[0, 0, 0.016]}>
              <boxGeometry args={[0.3, 0.2, 0.003]} />
              <meshStandardMaterial color={innerColors[i]} roughness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* ── Window with light spill ── */}
      {phase === "day" || phase === "dawn" ? (
        <spotLight
          position={[-4.3, 2.5, 0]}
          target-position={[-2, 0, 1]}
          angle={0.6}
          penumbra={0.8}
          intensity={0.5}
          color="#fff5e0"
        />
      ) : null}

      {/* ── Animated cat ── */}
      <RealCat location="livingroom" />
    </group>
  );
}
