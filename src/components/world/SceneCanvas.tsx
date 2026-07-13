import { Suspense, useMemo, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { LightingController } from "./LightingController";
import { RainSystem } from "./RainSystem";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import type { Weather } from "@/hooks/useWeather";

type Props = {
  phase: TimePhase;
  weather: Weather;
  children?: React.ReactNode;
};

const PHASE_PRESET = {
  dawn: "dawn",
  day: "sunset",
  dusk: "sunset",
  night: "night",
} as const satisfies Record<TimePhase, "dawn" | "sunset" | "night">;

const CAM_BASE = new THREE.Vector3(0, 2.2, 5);
const CAM_LOOK = new THREE.Vector3(0, 1.0, 0);
const PARALLAX_STRENGTH = 0.4;

function CameraRig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    target.current.set(
      CAM_BASE.x + pointer.x * PARALLAX_STRENGTH,
      CAM_BASE.y + pointer.y * PARALLAX_STRENGTH * 0.5,
      CAM_BASE.z,
    );
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(CAM_LOOK);
  });

  return null;
}

export function SceneCanvas({ phase, weather, children }: Props) {
  const envKey = useMemo(() => `${phase}-${weather}`, [phase, weather]);

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
          <PerspectiveCamera makeDefault position={CAM_BASE.toArray()} fov={45} />
          <CameraRig />

          <Environment preset={PHASE_PRESET[phase]} background={false} />
          <LightingController phase={phase} weather={weather} />
          <RainSystem weather={weather} intensityBucket={phase === "night" ? "night" : "day"} />

          {children}

          <fog attach="fog" args={[new THREE.Color(0x1a0f1f), 8, 22]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
