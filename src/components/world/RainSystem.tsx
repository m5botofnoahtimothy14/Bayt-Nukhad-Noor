import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Weather } from "@/hooks/useWeather";

type Props = {
  weather: Weather;
  intensityBucket: "day" | "night";
};

function isRainLike(w: Weather) {
  return w === "rain" || w === "heavy-rain" || w === "storm";
}

function rainCount(w: Weather) {
  if (w === "heavy-rain" || w === "storm") return 5500;
  if (w === "rain") return 3200;
  return 0;
}

export function RainSystem({ weather, intensityBucket }: Props) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = rainCount(weather);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    // Spawn rain volume in view space; camera is fixed in SceneCanvas.
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 7; // wide
      const y = Math.random() * 6 + 1; // height
      const z = (Math.random() - 0.5) * 6; // depth
      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      vel[i] = (2.2 + Math.random() * 2.8) * (intensityBucket === "night" ? 1.15 : 1.0);
    }

    return { positions: pos, velocities: vel };
  }, [weather, intensityBucket]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.visible = isRainLike(weather);
  }, [weather]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points || !isRainLike(weather)) return;

    const geom = points.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const drift = weather === "storm" ? 0.9 : 0.5;
    const wind = drift * delta;

    for (let i = 0; i < velocities.length; i++) {
      const idx = i * 3;
      // move down
      arr[idx + 1] -= velocities[i] * delta;
      // move slightly sideways
      arr[idx + 0] += wind * (i % 2 === 0 ? 1 : -1);

      if (arr[idx + 1] < 0.2) {
        arr[idx + 1] = Math.random() * 6 + 5.5;
        arr[idx + 0] = (Math.random() - 0.5) * 7;
        arr[idx + 2] = (Math.random() - 0.5) * 6;
      }
    }

    posAttr.needsUpdate = true;
  });

  const count = rainCount(weather);
  if (count === 0) {
    return null;
  }

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={new THREE.Color("#d6e7ff")}
        transparent
        opacity={weather === "heavy-rain" || weather === "storm" ? 0.35 : 0.25}
        depthWrite={false}
      />
    </points>
  );
}
