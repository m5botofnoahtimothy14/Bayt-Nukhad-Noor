import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

  const petals = useMemo(() => {
    const arr: { angle: number; tilt: number; r: number }[] = [];
    for (let ring = 0; ring < 3; ring++) {
      const count = 5 + ring * 2;
      for (let i = 0; i < count; i++) {
        arr.push({
          angle: (i / count) * Math.PI * 2 + ring * 0.3,
          tilt: 0.4 + ring * 0.25,
          r: 0.02 + ring * 0.012,
        });
      }
    }
    return arr;
  }, []);

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.004, 0.005, 0.14, 6]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.012, -0.02, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.025, 0.008, 0.003]} />
        <meshStandardMaterial color="#4a7a4a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.01, -0.05, 0.005]} rotation={[0.2, 0, -0.3]}>
        <boxGeometry args={[0.02, 0.007, 0.003]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.7} />
      </mesh>
      {petals.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * p.r,
            0.08 + (i < 5 ? 0.01 : 0),
            Math.sin(p.angle) * p.r,
          ]}
          rotation={[p.tilt, p.angle, 0]}
        >
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 0.085, 0]}>
        <sphereGeometry args={[0.01, 10, 10]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

function FairyLight({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 0.18 + Math.sin(clock.getElapsedTime() * 2.5 + index * 0.8) * 0.06;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshBasicMaterial color="#fff8ee" transparent opacity={0.7} />
      </mesh>
      <pointLight ref={ref} color={0xfff5ee} intensity={0.18} distance={0.8} decay={2} />
    </group>
  );
}

/* ─── Floating Lantern (like the opening scene) ─── */
function FloatingLantern({
  position,
  color,
  intensity = 3,
  delay = 0,
}: {
  position: [number, number, number];
  color: string;
  intensity?: number;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delay;
    if (groupRef.current) {
      groupRef.current.position.y = baseY + Math.sin(t * 0.6) * 0.15;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.04;
    }
    if (lightRef.current) {
      lightRef.current.intensity = intensity + Math.sin(t * 3) * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing orb */}
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Metal cap top */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.025, 0.04, 0.03, 8]} />
        <meshStandardMaterial color="#8a7a60" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Metal cap bottom */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.04, 0.025, 0.02, 8]} />
        <meshStandardMaterial color="#8a7a60" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Hanging wire */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.08, 3]} />
        <meshStandardMaterial color="#6a6050" roughness={0.5} />
      </mesh>
      {/* Point light */}
      <pointLight ref={lightRef} color={color} intensity={intensity} distance={4} decay={2} />
    </group>
  );
}

/* ─── Stage Sparkle particles ─── */
function StageSparkles({ active = false }: { active?: boolean }) {
  if (!active) return null;
  const ref = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        x: (Math.random() - 0.5) * 5,
        y: 0.5 + Math.random() * 3.5,
        z: (Math.random() - 0.5) * 5 - 2,
        speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        life: Math.random() * 5,
        maxLife: 3 + Math.random() * 4,
        scale: 0.008 + Math.random() * 0.012,
      })),
    [],
  );

  useFrame(({ clock }, dt) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    particles.forEach((p, i) => {
      p.life += dt;
      if (p.life > p.maxLife) {
        p.life = 0;
        p.x = (Math.random() - 0.5) * 5;
        p.y = 0.5 + Math.random() * 3.5;
        p.z = (Math.random() - 0.5) * 5 - 2;
      }
      const progress = p.life / p.maxLife;
      const fadeIn = Math.min(progress * 4, 1);
      const fadeOut = Math.max(1 - (progress - 0.75) / 0.25, 0);
      const opacity = fadeIn * (progress > 0.75 ? fadeOut : 1);
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.3,
        p.y + Math.sin(t * p.speed * 0.4 + p.phase) * 0.2,
        p.z + Math.cos(t * p.speed * 0.5 + p.phase) * 0.2,
      );
      const s = p.scale * opacity * 80;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      const warmGold = 0.7 + Math.sin(i * 0.8) * 0.3;
      color.setRGB(1, 0.9 * warmGold, 0.6 * warmGold);
      ref.current!.setColorAt(i, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 40]} frustumCulled={false}>
      <sphereGeometry args={[0.05, 4, 4]} />
      <meshBasicMaterial color="#ffe8a0" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* ─── Scroll with bloom-open animation ─── */
function Scroll({
  onClick,
  visible,
  opening,
}: {
  onClick: () => void;
  visible?: boolean;
  opening?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const ribbonRef = useRef<THREE.Group>(null);
  const bowRef = useRef<THREE.Group>(null);
  const parchmentLeftRef = useRef<THREE.Mesh>(null);
  const parchmentRightRef = useRef<THREE.Mesh>(null);
  const capLeftRef = useRef<THREE.Mesh>(null);
  const capRightRef = useRef<THREE.Mesh>(null);
  const burstRef = useRef<THREE.PointLight>(null);
  const openTime = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 1.1 + Math.sin(t * 1.2) * 0.012;
      ref.current.rotation.y = Math.sin(t * 0.25) * 0.06;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 1.0 + Math.sin(t * 2) * 0.4;
    }

    if (opening) {
      openTime.current = Math.min(openTime.current + dt, 1.8);
      const p = openTime.current / 1.8;
      const ease = 1 - Math.pow(1 - p, 3);

      // Ribbon unties — shrinks away
      if (ribbonRef.current) {
        ribbonRef.current.scale.setScalar(1 - ease);
        ribbonRef.current.rotation.y = ease * 2;
      }
      // Bow shrinks and floats up
      if (bowRef.current) {
        bowRef.current.scale.setScalar(Math.max(0, 1 - ease * 1.5));
        bowRef.current.position.y = 0.12 + ease * 0.2;
      }
      // Parchment splits open — left half moves left, right half moves right
      if (parchmentLeftRef.current) {
        parchmentLeftRef.current.position.x = -ease * 0.5;
        parchmentLeftRef.current.rotation.z = ease * 0.3;
      }
      if (parchmentRightRef.current) {
        parchmentRightRef.current.position.x = ease * 0.5;
        parchmentRightRef.current.rotation.z = -ease * 0.3;
      }
      // End caps follow
      if (capLeftRef.current) {
        capLeftRef.current.position.x = -0.45 - ease * 0.5;
      }
      if (capRightRef.current) {
        capRightRef.current.position.x = 0.45 + ease * 0.5;
      }
      // Light burst during opening
      if (burstRef.current) {
        const burstIntensity = ease < 0.5
          ? ease * 2 * 8
          : (1 - ease) * 2 * 8;
        burstRef.current.intensity = burstIntensity;
      }
    }
  });

  const opacity = visible !== false ? 1 : 0.85;

  return (
    <group ref={ref} position={[0, 1.1, -1]} onClick={opening ? undefined : onClick}>
      {/* Parchment roll — splits into two halves */}
      <mesh
        ref={parchmentLeftRef}
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.45, 20]} />
        <meshStandardMaterial color="#e8d8b8" roughness={0.55} transparent opacity={opacity} />
      </mesh>
      <mesh
        ref={parchmentRightRef}
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.45, 20]} />
        <meshStandardMaterial color="#e8d8b8" roughness={0.55} transparent opacity={opacity} />
      </mesh>
      {/* End caps */}
      <mesh ref={capLeftRef} position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.12, 20]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.65} />
      </mesh>
      <mesh ref={capRightRef} position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.12, 20]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.65} />
      </mesh>
      {/* Burgundy ribbon wrap */}
      <group ref={ribbonRef}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.018, 8, 32]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
      </group>
      {/* Ribbon bow — two loops + tails */}
      <group ref={bowRef} position={[0, 0.12, 0]}>
        <mesh position={[-0.035, 0, 0]} rotation={[0.3, 0, 0.2]}>
          <torusGeometry args={[0.03, 0.008, 8, 12]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
        <mesh position={[0.035, 0, 0]} rotation={[0.3, 0, -0.2]}>
          <torusGeometry args={[0.03, 0.008, 8, 12]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#5a1525" roughness={0.4} />
        </mesh>
        <mesh position={[-0.02, -0.04, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.006, 0.003, 0.06, 4]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
        <mesh position={[0.02, -0.05, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.006, 0.003, 0.07, 4]} />
          <meshStandardMaterial color="#6a1a2a" roughness={0.35} />
        </mesh>
      </group>
      {/* Warm glow to draw the eye */}
      <pointLight ref={glowRef} color={0xfff0d8} intensity={1.2} distance={3} decay={2} />
      {/* Light burst during bloom-open */}
      {opening && (
        <pointLight ref={burstRef} color={0xfff5e0} intensity={0} distance={6} decay={1} />
      )}
    </group>
  );
}

function BabyBreathCluster({ position }: { position: [number, number, number] }) {
  const stems = useMemo(() =>
    Array.from({ length: 5 }).map((_, j) => ({
      x: (j - 2) * 0.015,
      y: j * 0.012,
      z: (j % 2) * 0.01,
      s: 0.006 + (j % 3) * 0.002,
    })), []);

  return (
    <group position={position}>
      {stems.map((s, j) => (
        <group key={j}>
          <mesh position={[s.x, s.y * 0.5, s.z]}>
            <cylinderGeometry args={[0.001, 0.001, s.y + 0.03, 3]} />
            <meshStandardMaterial color="#7a9a7a" roughness={0.8} />
          </mesh>
          <mesh position={[s.x, s.y + 0.015, s.z]}>
            <sphereGeometry args={[s.s, 8, 8]} />
            <meshStandardMaterial color="#f8f8f0" roughness={0.5} />
          </mesh>
        </group>
      ))}
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
  const babyBreathPositions = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2 + 0.5;
      const r = 1.6;
      return [Math.cos(angle) * r, 0.08, Math.sin(angle) * r] as [number, number, number];
    }), []);

  return (
    <group position={[0, 0, -4]}>
      {/* Circular marble stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[1.8, 64]} />
        <meshStandardMaterial
          color="#e8e0d8"
          roughness={0.15}
          metalness={0.08}
        />
      </mesh>
      {/* Stage rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.75, 1.88, 64]} />
        <meshStandardMaterial color="#d0c8c0" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Inner decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[1.2, 1.23, 48]} />
        <meshStandardMaterial color="#c8c0b8" roughness={0.3} metalness={0.05} transparent opacity={0.5} />
      </mesh>

      {/* Pedestal */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 0.8, 12]} />
          <meshStandardMaterial color="#5a4030" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.04, 16]} />
          <meshStandardMaterial color="#5a4030" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color="#4a3525" roughness={0.75} />
        </mesh>
        <Scroll
          onClick={onScrollClick}
          opening={scrollOpening}
        />
      </group>

      {/* Flowers around stage — roses */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 1.5;
        return (
          <Rose
            key={`w${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#f0e8e8"
            scale={0.9 + Math.sin(i * 0.8) * 0.15}
          />
        );
      })}

      {/* Red roses */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const r = 1.3;
        return (
          <Rose
            key={`r${i}`}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
            color="#cc2244"
            scale={0.75 + Math.sin(i * 1.5) * 0.1}
          />
        );
      })}

      {/* Baby's breath clusters */}
      {babyBreathPositions.map((pos, i) => (
        <BabyBreathCluster key={`b${i}`} position={pos} />
      ))}

      {/* Fairy lights around stage edge */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 1.8;
        return (
          <FairyLight
            key={i}
            index={i}
            position={[Math.cos(angle) * r, 0.18, Math.sin(angle) * r]}
          />
        );
      })}

      {/* Stage sparkles */}
      <StageSparkles active={sparklesActive} />

      {/* === Soft ambient stage lighting === */}
      <pointLight
        position={[0, 3, 0]}
        color="#fff8f0"
        intensity={0.8}
        distance={6}
        decay={2}
      />
    </group>
  );
}
