import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { LightingController } from "./LightingController";
import { RainSystem } from "./RainSystem";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import type { Weather } from "@/hooks/useWeather";

type Props = {
  phase: TimePhase;
  weather: Weather;
  /** optional HDRI URL in /public or absolute */
  hdrSrc?: string;
  /** children are GLTF scene nodes */
  children?: React.ReactNode;
};

export function SceneCanvas({ phase, weather, hdrSrc, children }: Props) {
  const envKey = useMemo(() => {
    // force re-render when we change time-of-day buckets
    return `${phase}-${weather}`;
  }, [phase, weather]);

  return (
    <div className="absolute inset-0">
      <Canvas
        key={envKey}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2.2, 5]} fov={45} />

          {/* Default HDRI if provided; otherwise just Environment preset */}
          {hdrSrc ? (
            <Environment files={hdrSrc} background={false} />
          ) : (
            <Environment preset={phase === "night" ? "city" : "sunset"} background={false} />
          )}

          <LightingController phase={phase} weather={weather} />

          {/* Real rain */}
          <RainSystem weather={weather} intensityBucket={phase === "night" ? "night" : "day"} />

          {children}

          {/* Subtle fog for depth */}
          <fog attach="fog" args={[new THREE.Color(0x1a0f1f), 6, 16]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
