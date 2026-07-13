import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import type { Weather } from "@/hooks/useWeather";

type Props = {
  phase: TimePhase;
  weather: Weather;
};

function exposureFor(phase: TimePhase) {
  switch (phase) {
    case "dawn":
      return 0.95;
    case "day":
      return 0.85;
    case "dusk":
      return 1.0;
    case "night":
      return 1.1;
  }
}

export function LightingController({ phase, weather }: Props) {
  const { keyLightColor, fillColor, exposure, ambientIntensity } = useMemo(() => {
    const isNight = phase === "night";
    const isDusk = phase === "dusk";

    const baseExposure = exposureFor(phase);
    const extra = weather === "heavy-rain" || weather === "storm" ? 0.05 : 0;

    return {
      exposure: baseExposure + extra,
      keyLightColor: new THREE.Color(isNight ? 0x9aa7ff : isDusk ? 0xffa36a : 0xfff1cf),
      fillColor: new THREE.Color(isNight ? 0x2f3b5f : 0x7aa0ff),
      ambientIntensity: isNight ? 0.08 : isDusk ? 0.1 : 0.16,
    };
  }, [phase, weather]);

  useFrame(({ gl }) => {
    // keep tone mapping exposure stable
    gl.toneMappingExposure = exposure;
  });

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={0xffffff} />

      {/* Key light */}
      <directionalLight
        position={[2.5, 3.5, 1.8]}
        intensity={phase === "night" ? 0.55 : phase === "dusk" ? 0.75 : 0.95}
        color={keyLightColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Fill light */}
      <hemisphereLight
        color={fillColor}
        groundColor={phase === "night" ? 0x0b0710 : 0x1a0f1f}
        intensity={phase === "night" ? 0.25 : 0.4}
      />

      {/* Weather-specific accents */}
      {(weather === "rain" || weather === "heavy-rain" || weather === "storm") && (
        <pointLight intensity={0.35} color={0x9bb3ff} position={[-2, 2.0, 2]} />
      )}

      {/* Simple fill accent */}
      <pointLight intensity={0.05} color={0xffffff} position={[0, -1, 0]} />
    </>
  );
}
