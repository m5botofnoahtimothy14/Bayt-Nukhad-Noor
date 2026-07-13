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
  const lightRef = useRef<THREE.PointLight>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!lit) return;
    const t = clock.getElapsedTime() + delay;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 6) * 0.15;
      flameRef.current.scale.x = 1 + Math.sin(t * 4.5) * 0.1;
      flameRef.current.position.y = 0.22 + Math.sin(t * 5) * 0.01;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.6 + Math.sin(t * 5 + delay) * 0.15;
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.7 + Math.sin(t * 4) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Candle body */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.018, 0.18, 6]} />
        <meshStandardMaterial color="#f5f0dc" roughness={0.6} />
      </mesh>
      {/* Flame (only when lit) */}
      {lit && (
        <>
          <mesh ref={flameRef} position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial
              ref={materialRef}
              color="#ffaa44"
              transparent
              opacity={0.8}
            />
          </mesh>
          <pointLight
            ref={lightRef}
            position={[0, 0.25, 0]}
            color={0xffaa44}
            intensity={0.6}
            distance={2}
            decay={2}
          />
        </>
      )}
    </group>
  );
}

export function CandlePath({ ignitedCount, totalCandles = 24 }: CandlePathProps) {
  const candles = useMemo(() => {
    const arr: { pos: [number, number, number]; side: "left" | "right" }[] = [];
    for (let i = 0; i < totalCandles; i++) {
      const z = 6 - (i / (totalCandles - 1)) * 12;
      arr.push({ pos: [-1.2, 0, z], side: "left" });
      arr.push({ pos: [1.2, 0, z], side: "right" });
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
          delay={i * 0.3}
        />
      ))}
    </group>
  );
}
