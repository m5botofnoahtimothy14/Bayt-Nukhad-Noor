import { GltfModel } from "@/components/models/GltfModel";
import { useMemories, type Memory } from "@/components/world/memories";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import type { Season } from "@/hooks/useSeason";
import { Html } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  phase: TimePhase;
  season?: Season;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
};

const WATER_COLOR: Record<TimePhase, number> = {
  dawn: 0x556688,
  day: 0x3366aa,
  dusk: 0x554466,
  night: 0x111122,
};

function WaterPlane({ phase }: { phase: TimePhase }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const geo = ref.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 1.5 + t * 0.8) * 0.04 + Math.cos(y * 2 + t * 0.6) * 0.03);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -3]} receiveShadow>
      <planeGeometry args={[14, 8, 32, 32]} />
      <meshStandardMaterial
        color={WATER_COLOR[phase]}
        roughness={0.1}
        metalness={0.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function LilyPad({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + index * 1.5) * 0.02;
    ref.current.rotation.z = Math.sin(t * 0.3 + index) * 0.05;
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 12, 0, Math.PI * 1.7]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.6} side={2} />
      </mesh>
    </group>
  );
}

function StringLight({
  position,
  isNight,
  index,
}: {
  position: [number, number, number];
  isNight: boolean;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = isNight
      ? 0.6 + Math.sin(t * 2 + index * 1.2) * 0.4
      : 0.2 + Math.sin(t * 1.5 + index * 1.2) * 0.1;
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color={isNight ? "#ffcc66" : "#ffffee"}
          transparent
          opacity={isNight ? 0.8 : 0.3}
        />
      </mesh>
      {isNight && <pointLight intensity={0.15} color={0xffcc66} distance={2} decay={2} />}
    </group>
  );
}

function PaperBoat({
  memory,
  index,
  onAdd,
  onView,
}: {
  memory: Memory;
  index: number;
  onAdd: (p: { x: number; y: number }) => void;
  onView: (m: Memory) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = -0.02 + Math.sin(t * 0.4 + index * 1.3) * 0.015;
    ref.current.rotation.y = Math.sin(t * 0.2 + index * 0.7) * 0.15;
  });
  return (
    <group ref={ref} position={[-1.5 + index * 0.8, -0.02, -1.5 - index * 0.3]}>
      <mesh onClick={() => onView(memory)} rotation={[-Math.PI / 2, 0, index * 0.3]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.5} />
      </mesh>
      <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="max-w-[50px] truncate text-[7px] text-amber-100/50 serif">
          {memory.title}
        </div>
      </Html>
    </group>
  );
}

export function LakeScene({ phase, season = "summer", onAdd, onView }: Props) {
  const { items } = useMemories("lake");
  const isNight = phase === "night" || phase === "dusk";

  const stars = useMemo(
    () =>
      isNight
        ? Array.from({ length: 50 }).map((_i, i) => ({
            x: -6 + Math.random() * 12,
            y: 2 + Math.random() * 5,
            z: -5 - Math.random() * 3,
            size: 0.015 + Math.random() * 0.03,
            opacity: 0.3 + Math.random() * 0.5,
          }))
        : [],
    [isNight],
  );

  return (
    <group>
      <ambientLight intensity={isNight ? 0.05 : 0.2} />

      {/* Ground — shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]} receiveShadow>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color={season === "winter" ? "#d0d8e0" : "#5a6a4a"} roughness={0.9} />
      </mesh>

      {/* Water surface */}
      <WaterPlane phase={phase} />

      {/* Dock */}
      <mesh position={[0, 0.1, -0.5]} castShadow>
        <boxGeometry args={[1.5, 0.08, 4]} />
        <meshStandardMaterial color="#6a5040" roughness={0.8} />
      </mesh>
      {/* Dock posts */}
      {[
        [-0.6, 0, 0.8],
        [0.6, 0, 0.8],
        [-0.6, 0, -2.2],
        [0.6, 0, -2.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
          <meshStandardMaterial color="#5a4030" roughness={0.85} />
        </mesh>
      ))}

      {/* Outdoor couch on shore */}
      <GltfModel
        url="/models/outdoor-couch/scene.gltf"
        position={[-2, 0, 1.5]}
        scale={0.8}
        rotation={[0, 0.5, 0]}
      />

      {/* Lantern on dock */}
      <group position={[0, 0.3, 0]}>
        <GltfModel url="/models/lantern/scene.gltf" scale={0.3} />
        <pointLight intensity={isNight ? 0.6 : 0.15} color={0xff9944} distance={4} decay={2} />
      </group>

      {/* String lights on dock */}
      {[
        [-0.5, 1.2, 0.5],
        [0, 1.3, 0],
        [0.5, 1.2, -0.5],
      ].map((pos, i) => (
        <StringLight key={i} position={pos as [number, number, number]} isNight={isNight} index={i} />
      ))}

      {/* Trees on shore */}
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[-4, 0, 2]}
        scale={0.15}
        rotation={[0, 1, 0]}
      />
      <GltfModel
        url="/models/polytree/scene.gltf"
        position={[4, 0, 2]}
        scale={0.12}
        rotation={[0, -0.8, 0]}
      />

      {/* Houseplant near couch */}
      <GltfModel url="/models/houseplants/scene.gltf" position={[-3.5, 0, 2]} scale={0.4} />

      {/* Lily pads on water */}
      {Array.from({ length: 6 }).map((_i, i) => (
        <LilyPad
          key={i}
          position={[-2 + i * 0.8, -0.05, -2 - (i % 3) * 0.5]}
          index={i}
        />
      ))}

      {/* Moon reflection (night) */}
      {isNight && (
        <mesh position={[2, -0.05, -5]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial color="#ffeecc" transparent opacity={0.15} />
        </mesh>
      )}

      {/* Stars */}
      {stars.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <sphereGeometry args={[s.size, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={s.opacity} />
        </mesh>
      ))}

      {/* Moon */}
      {isNight && (
        <mesh position={[3, 5, -7]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#ffeecc" />
        </mesh>
      )}

      {/* Mountains in background */}
      <mesh position={[-3, 1.5, -6]}>
        <coneGeometry args={[2.5, 3, 4]} />
        <meshStandardMaterial color={season === "winter" ? "#8899aa" : "#3a4a3a"} roughness={0.9} />
      </mesh>
      <mesh position={[2, 1.8, -7]}>
        <coneGeometry args={[3, 3.5, 4]} />
        <meshStandardMaterial color={season === "winter" ? "#7788aa" : "#2a3a2a"} roughness={0.9} />
      </mesh>

      {/* Paper boat memories */}
      {items?.slice(0, 5).map((m, i) => (
        <PaperBoat key={m.id} memory={m} index={i} onAdd={onAdd} onView={onView} />
      ))}

      {/* Click water to add */}
      <mesh
        position={[0, -0.05, -2]}
        onClick={() => onAdd({ x: 0.5, y: 0.6 })}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
