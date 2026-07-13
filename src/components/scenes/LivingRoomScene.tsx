import { GltfModel } from "@/components/models/GltfModel";
import { RoomShell } from "@/components/world/RoomShell";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { Html } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatedCandle, Fireflies, FallingLeaves } from "@/components/world/AnimatedElements";

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
  const fireLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!fireLightRef.current) return;
    const t = clock.getElapsedTime();
    if (phase === "night") {
      fireLightRef.current.intensity = 1.15 + Math.sin(t * 3) * 0.35;
    } else if (phase === "dusk" || phase === "dawn") {
      fireLightRef.current.intensity = 0.6 + Math.sin(t * 2) * 0.15;
    } else {
      fireLightRef.current.intensity = 0.4 + Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group>
      <ambientLight intensity={lights.ambient} />

      {/* Procedural room shell (full GLB unavailable) */}
      <RoomShell tint="#3a2620" floorTint="#5a3d2d" width={9} depth={6} height={3.2} />

      {/* Fireplace hearth — simple procedural block since GLB is unavailable */}
      <mesh position={[0, 0.5, -2.7]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 0.5]} />
        <meshStandardMaterial color="#2a1a14" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, -2.45]}>
        <boxGeometry args={[1.4, 0.7, 0.1]} />
        <meshStandardMaterial
          color="#ff7733"
          emissive="#ff5522"
          emissiveIntensity={phase === "night" ? 1.4 : 0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Working props */}
      <GltfModel url="/models/houseplants/scene.gltf" position={[-3.5, 0, 1.5]} scale={0.45} />
      <GltfModel url="/models/bookshelf/scene.glb" position={[3.5, 0, -2.5]} scale={1} />
      <GltfModel url="/models/vinyl-player/scene.gltf" position={[-2.8, 0.5, -2]} scale={0.4} />

      {/* Fireplace warm glow — animated */}
      <pointLight
        ref={fireLightRef}
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

      {/* ── Sofa ── */}
      <group position={[0, 0, 0.5]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.8, 0.3, 0.8]} />
          <meshStandardMaterial color="#5a3a2a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.65, -0.35]}>
          <boxGeometry args={[1.8, 0.5, 0.15]} />
          <meshStandardMaterial color="#4a2a1a" roughness={0.85} />
        </mesh>
        {[-0.85, 0.85].map((x, i) => (
          <mesh key={`arm-${i}`} position={[x, 0.5, 0]}>
            <boxGeometry args={[0.15, 0.3, 0.8]} />
            <meshStandardMaterial color="#4a2a1a" roughness={0.85} />
          </mesh>
        ))}
        {[-0.4, 0.4].map((x, i) => (
          <mesh key={`cushion-${i}`} position={[x, 0.52, 0]}>
            <boxGeometry args={[0.5, 0.08, 0.4]} />
            <meshStandardMaterial color="#8a6a5a" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ── Coffee table ── */}
      <group position={[0, 0, 1.5]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.0, 0.06, 0.5]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.7} />
        </mesh>
        {[[-0.4, -0.2], [-0.4, 0.2], [0.4, -0.2], [0.4, 0.2]].map(([x, z], i) => (
          <mesh key={`leg-${i}`} position={[x, 0.16, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.2, 0.04, 0.15]} />
          <meshStandardMaterial color="#6a5a4a" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Rug ── */}
      <mesh position={[0, 0.01, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.02, 32]} />
        <meshStandardMaterial color="#8a5a4a" roughness={0.95} />
      </mesh>

      {/* ── Curtains ── */}
      {[-4.4, 4.4].map((x) =>
        [-0.5, 0.5].map((z, i) => (
          <mesh key={`curtain-${x}-${i}`} position={[x, 1.8, z]}>
            <boxGeometry args={[0.02, 1.5, 0.5]} />
            <meshStandardMaterial color="#6a4a4a" roughness={0.9} />
          </mesh>
        ))
      )}
      <AnimatedCandle position={[-4.2, 1.5, 0]} />
      <AnimatedCandle position={[4.2, 1.5, 0]} />

      {/* ── Fireflies near ceiling ── */}
      <Fireflies count={12} area={[5, 2, 4]} color="#ffcc66" />

      {/* ── Hanging picture frames ── */}
      {[-1.5, 0, 1.5].map((x, i) => {
        const innerColors = ["#8a6a5a", "#6a8a6a", "#6a6a8a"];
        return (
          <group key={`frame-${i}`} position={[x, 2.2, -2.9]}>
            <mesh>
              <boxGeometry args={[0.4, 0.3, 0.02]} />
              <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.011]}>
              <boxGeometry args={[0.32, 0.22, 0.005]} />
              <meshStandardMaterial color={innerColors[i]} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
