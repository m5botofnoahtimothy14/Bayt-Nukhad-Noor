import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Rose petal (scattered on floor) ── */
function RosePetal({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() + seed;
      ref.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.05;
      ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.002;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <circleGeometry args={[0.04, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} side={2} />
    </mesh>
  );
}

/* ── Rose (upgraded with more detail) ── */
function Rose({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3 + seed) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.004, 0.005, 0.1, 4]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.8} />
      </mesh>
      {/* Leaf */}
      <mesh position={[0.015, 0.04, 0]} rotation={[0.3, 0, 0.5]}>
        <circleGeometry args={[0.015, 5]} />
        <meshStandardMaterial color="#4a7a4a" roughness={0.8} side={2} />
      </mesh>
      {/* Bloom layers — outer petals */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.025, 0.1, Math.sin(a) * 0.025]}
            rotation={[0.3, a, 0]}
          >
            <circleGeometry args={[0.018, 5]} />
            <meshBasicMaterial color={color} transparent opacity={0.85} side={2} />
          </mesh>
        );
      })}
      {/* Inner petals */}
      {Array.from({ length: 4 }).map((_, i) => {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        return (
          <mesh
            key={`inner-${i}`}
            position={[Math.cos(a) * 0.012, 0.105, Math.sin(a) * 0.012]}
            rotation={[0.2, a, 0]}
          >
            <circleGeometry args={[0.012, 5]} />
            <meshBasicMaterial color={color} transparent opacity={0.95} side={2} />
          </mesh>
        );
      })}
      {/* Center bud */}
      <mesh position={[0, 0.11, 0]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ── Fairy light — warm floating dot ── */
function FairyLightDot({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.sin(t * 2.5 + index * 0.8) * 0.3;
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + index) * 0.03;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshBasicMaterial color="#fff8ee" transparent opacity={0.6} />
    </mesh>
  );
}

/* ── Scroll with open animation (upgraded) ── */
function Scroll({
  onClick,
  opening,
}: {
  onClick: () => void;
  opening?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const ribbonRef = useRef<THREE.Group>(null);
  const bowRef = useRef<THREE.Group>(null);
  const parchmentLeftRef = useRef<THREE.Mesh>(null);
  const parchmentRightRef = useRef<THREE.Mesh>(null);
  const capLeftRef = useRef<THREE.Mesh>(null);
  const capRightRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const openTime = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 1.12 + Math.sin(t * 1.2) * 0.015;
      ref.current.rotation.y = Math.sin(t * 0.25) * 0.06;
    }

    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 1.5) * 0.04;
    }

    if (opening) {
      openTime.current = Math.min(openTime.current + dt, 1.8);
      const p = openTime.current / 1.8;
      const ease = 1 - Math.pow(1 - p, 3);

      if (ribbonRef.current) {
        ribbonRef.current.scale.setScalar(1 - ease);
        ribbonRef.current.rotation.y = ease * 2;
      }
      if (bowRef.current) {
        bowRef.current.scale.setScalar(Math.max(0, 1 - ease * 1.5));
        bowRef.current.position.y = 0.12 + ease * 0.2;
      }
      if (parchmentLeftRef.current) {
        parchmentLeftRef.current.position.x = -ease * 0.5;
        parchmentLeftRef.current.rotation.z = ease * 0.3;
      }
      if (parchmentRightRef.current) {
        parchmentRightRef.current.position.x = ease * 0.5;
        parchmentRightRef.current.rotation.z = -ease * 0.3;
      }
      if (capLeftRef.current) {
        capLeftRef.current.position.x = -0.45 - ease * 0.5;
      }
      if (capRightRef.current) {
        capRightRef.current.position.x = 0.45 + ease * 0.5;
      }
    }
  });

  return (
    <group ref={ref} position={[0, 1.12, -1]} onClick={opening ? undefined : onClick}>
      {/* Parchment body */}
      <mesh ref={parchmentLeftRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.45, 12]} />
        <meshStandardMaterial color="#e8d8b8" roughness={0.5} />
      </mesh>
      <mesh ref={parchmentRightRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.45, 12]} />
        <meshStandardMaterial color="#e8d8b8" roughness={0.5} />
      </mesh>

      {/* End caps */}
      <mesh ref={capLeftRef} position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.12, 12]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.6} />
      </mesh>
      <mesh ref={capRightRef} position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.12, 12]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.6} />
      </mesh>

      {/* Ribbon */}
      <group ref={ribbonRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.02, 6, 20]} />
          <meshStandardMaterial color="#8a1a2a" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>

      {/* Bow */}
      <group ref={bowRef} position={[0, 0.12, 0]}>
        <mesh position={[-0.04, 0, 0]} rotation={[0.3, 0, 0.2]}>
          <torusGeometry args={[0.035, 0.009, 6, 10]} />
          <meshStandardMaterial color="#8a1a2a" roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 0, 0]} rotation={[0.3, 0, -0.2]}>
          <torusGeometry args={[0.035, 0.009, 6, 10]} />
          <meshStandardMaterial color="#8a1a2a" roughness={0.4} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#6a1525" roughness={0.5} />
        </mesh>
      </group>

      {/* Ambient glow around scroll */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial
          color="#ffcc88"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function StageArea({
  onScrollClick,
  scrollOpening = false,
  sparklesActive = false,
}: {
  onScrollClick: () => void;
  scrollOpening?: boolean;
  sparklesActive?: boolean;
}) {
  /* Scattered rose petals on the stage floor */
  const petals = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 3,
        0.025,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      rot: [
        -Math.PI / 2 + (Math.random() - 0.5) * 0.3,
        Math.random() * Math.PI * 2,
        0,
      ] as [number, number, number],
      color: i % 3 === 0 ? "#cc2244" : i % 3 === 1 ? "#dd4466" : "#ee8899",
    })),
    [],
  );

  return (
    <group position={[0, 0, -4]}>
      {/* ── Circular marble stage ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.8, 48]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Stage rim — gold inlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[1.72, 1.82, 48]} />
        <meshStandardMaterial color="#c0a060" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Outer decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.85, 1.9, 48]} />
        <meshBasicMaterial color="#a08840" transparent opacity={0.3} />
      </mesh>

      {/* Inner decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <ringGeometry args={[1.2, 1.24, 32]} />
        <meshStandardMaterial color="#c0a060" roughness={0.3} metalness={0.3} transparent opacity={0.5} />
      </mesh>

      {/* ── Pedestal ── */}
      <group position={[0, 0, -1]}>
        {/* Base */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 0.12, 12]} />
          <meshStandardMaterial color="#5a4030" roughness={0.6} metalness={0.15} />
        </mesh>
        {/* Column */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.65, 10]} />
          <meshStandardMaterial color="#5a4030" roughness={0.6} metalness={0.15} />
        </mesh>
        {/* Capital */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.18, 0.12, 0.06, 10]} />
          <meshStandardMaterial color="#5a4030" roughness={0.6} metalness={0.15} />
        </mesh>
        {/* Top plate */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 12]} />
          <meshStandardMaterial color="#6a5040" roughness={0.5} metalness={0.2} />
        </mesh>
        <Scroll onClick={onScrollClick} opening={scrollOpening} />
      </group>

      {/* ── Scattered rose petals on stage floor ── */}
      {petals.map((p, i) => (
        <RosePetal key={`petal-${i}`} position={p.pos} rotation={p.rot} color={p.color} />
      ))}

      {/* ── Red roses ring (inner) ── */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 + 0.2;
        const r = 1.35;
        return (
          <Rose
            key={`r${i}`}
            position={[Math.cos(angle) * r, 0.06, Math.sin(angle) * r]}
            color="#cc2244"
            scale={1.1}
          />
        );
      })}

      {/* ── White roses ring (outer) ── */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const r = 1.55;
        return (
          <Rose
            key={`w${i}`}
            position={[Math.cos(angle) * r, 0.06, Math.sin(angle) * r]}
            color="#f0e8e8"
          />
        );
      })}

      {/* ── Fairy lights — warm floating dots around stage ── */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const r = 1.85 + Math.sin(i * 2.3) * 0.1;
        return (
          <FairyLightDot
            key={i}
            index={i}
            position={[Math.cos(angle) * r, 0.18 + Math.sin(i * 1.7) * 0.08, Math.sin(angle) * r]}
          />
        );
      })}

      {/* ── Warm stage uplight ── */}
      <pointLight position={[0, 0.3, 0]} intensity={0.15} color={0xffeedd} distance={4} decay={2} />
    </group>
  );
}
