import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type CandlePathProps = {
  ignitedCount: number;
  totalCandles?: number;
};

function Candle({
  position,
  lit,
  delay,
}: {
  position: [number, number, number];
  lit: boolean;
  delay: number;
}) {
  const flameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!lit) return;
    const t = clock.getElapsedTime() + delay;

    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 6) * 0.18 + Math.sin(t * 9.7) * 0.06;
      flameRef.current.scale.x = 1 + Math.sin(t * 4.5) * 0.12;
      flameRef.current.position.y = 0.24 + Math.sin(t * 5) * 0.012;
      flameRef.current.rotation.z = Math.sin(t * 3.2) * 0.08;
    }

    if (glowRef.current) {
      const pulse = 0.35 + Math.sin(t * 3.5) * 0.12 + Math.sin(t * 7.1) * 0.05;
      glowRef.current.scale.setScalar(pulse);
    }

    if (smokeRef.current) {
      const smokeY = ((t * 0.3) % 1) * 0.5;
      const smokeOpacity = 0.12 * (1 - smokeY);
      smokeRef.current.position.y = 0.32 + smokeY;
      smokeRef.current.scale.setScalar(0.5 + smokeY * 1.5);
      (smokeRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, smokeOpacity);
    }

    if (matRef.current) {
      matRef.current.opacity = 0.8 + Math.sin(t * 4) * 0.15;
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity = 0.25 + Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Candle body — taller, with slight taper */}
      <mesh>
        <cylinderGeometry args={[0.014, 0.02, 0.22, 8]} />
        <meshStandardMaterial color="#f5f0dc" roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Wax drip detail */}
      <mesh position={[0.008, 0.06, 0.005]}>
        <sphereGeometry args={[0.006, 4, 4]} />
        <meshStandardMaterial color="#ece5d0" roughness={0.6} />
      </mesh>

      {/* Base holder */}
      <mesh position={[0, -0.13, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.03, 8]} />
        <meshStandardMaterial color="#8a7a60" roughness={0.4} metalness={0.3} />
      </mesh>

      {lit && (
        <>
          {/* Flame — layered for realism: outer orange, inner yellow, core white */}
          <mesh ref={flameRef} position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              ref={matRef}
              color="#ffcc55"
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Inner flame core */}
          <mesh position={[0, 0.235, 0]}>
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshBasicMaterial color="#fff8ee" transparent opacity={0.95} />
          </mesh>

          {/* Glow halo */}
          <mesh ref={glowRef} position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial
              ref={glowMatRef}
              color="#ffaa44"
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>

          {/* Warm point light */}
          <pointLight
            position={[0, 0.25, 0]}
            color={0xffaa44}
            intensity={0.35}
            distance={2.2}
            decay={2}
          />

          {/* Smoke wisp */}
          <mesh ref={smokeRef} position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.008, 4, 4]} />
            <meshBasicMaterial color="#888888" transparent opacity={0.1} depthWrite={false} />
          </mesh>
        </>
      )}
    </group>
  );
}

export function CandlePath({ ignitedCount, totalCandles = 24 }: CandlePathProps) {
  const candles = useMemo(() => {
    const arr: { pos: [number, number, number]; side: number }[] = [];
    for (let i = 0; i < totalCandles; i++) {
      const z = 6 - (i / (totalCandles - 1)) * 12;
      const wobble = Math.sin(i * 0.7) * 0.15;
      arr.push({ pos: [-1.2 + wobble, 0, z], side: -1 });
      arr.push({ pos: [1.2 - wobble, 0, z], side: 1 });
    }
    return arr;
  }, [totalCandles]);

  return (
    <group>
      {candles.map((c, i) => (
        <Candle
          key={i}
          position={c.pos}
          lit={i < ignitedCount * 2}
          delay={i * 0.25}
        />
      ))}

      {/* Warm ground glow from candle path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[4, 14]} />
        <meshBasicMaterial
          color="#ff9944"
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
