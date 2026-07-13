import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Rose (simple glowing dot with color ring) ── */
function Rose({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3 + seed) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.004, 0.005, 0.08, 3]} />
        <meshBasicMaterial color="#3a6a3a" />
      </mesh>
      {/* Bloom */}
      <mesh position={[0, 0.09, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Petal ring */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.02, 0.085, Math.sin(a) * 0.02]}
          >
            <sphereGeometry args={[0.012, 4, 4]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Fairy light — just a glowing dot ── */
function FairyLightDot({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + Math.sin(clock.getElapsedTime() * 2.5 + index * 0.8) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.012, 4, 4]} />
      <meshBasicMaterial color="#fff8ee" transparent opacity={0.7} />
    </mesh>
  );
}

/* ── Scroll with open animation ── */
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
  const openTime = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 1.1 + Math.sin(t * 1.2) * 0.012;
      ref.current.rotation.y = Math.sin(t * 0.25) * 0.06;
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
    <group ref={ref} position={[0, 1.1, -1]} onClick={opening ? undefined : onClick}>
      <mesh ref={parchmentLeftRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.45, 10]} />
        <meshBasicMaterial color="#e8d8b8" />
      </mesh>
      <mesh ref={parchmentRightRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.45, 10]} />
        <meshBasicMaterial color="#e8d8b8" />
      </mesh>
      <mesh ref={capLeftRef} position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.12, 10]} />
        <meshBasicMaterial color="#d8c8a8" />
      </mesh>
      <mesh ref={capRightRef} position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.12, 10]} />
        <meshBasicMaterial color="#d8c8a8" />
      </mesh>
      <group ref={ribbonRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.018, 4, 16]} />
          <meshBasicMaterial color="#6a1a2a" />
        </mesh>
      </group>
      <group ref={bowRef} position={[0, 0.12, 0]}>
        <mesh position={[-0.035, 0, 0]} rotation={[0.3, 0, 0.2]}>
          <torusGeometry args={[0.03, 0.008, 4, 8]} />
          <meshBasicMaterial color="#6a1a2a" />
        </mesh>
        <mesh position={[0.035, 0, 0]} rotation={[0.3, 0, -0.2]}>
          <torusGeometry args={[0.03, 0.008, 4, 8]} />
          <meshBasicMaterial color="#6a1a2a" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#5a1525" />
        </mesh>
      </group>
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
  return (
    <group position={[0, 0, -4]}>
      {/* Circular marble stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshBasicMaterial color="#e8e0d8" />
      </mesh>
      {/* Stage rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.75, 1.88, 32]} />
        <meshBasicMaterial color="#d0c8c0" />
      </mesh>
      {/* Inner decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[1.2, 1.23, 24]} />
        <meshBasicMaterial color="#c8c0b8" transparent opacity={0.5} />
      </mesh>

      {/* Pedestal */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.8, 8]} />
          <meshBasicMaterial color="#5a4030" />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.04, 8]} />
          <meshBasicMaterial color="#5a4030" />
        </mesh>
        <Scroll onClick={onScrollClick} opening={scrollOpening} />
      </group>

      {/* White roses ring */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 1.5;
        return (
          <Rose
            key={`w${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#f0e8e8"
          />
        );
      })}

      {/* Red roses ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const r = 1.3;
        return (
          <Rose
            key={`r${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#cc2244"
          />
        );
      })}

      {/* Fairy lights — glowing dots around stage edge */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 1.8;
        return (
          <FairyLightDot
            key={i}
            index={i}
            position={[Math.cos(angle) * r, 0.15, Math.sin(angle) * r]}
          />
        );
      })}
    </group>
  );
}
