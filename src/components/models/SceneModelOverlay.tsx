import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function SceneModelOverlay({ children, className }: Props) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className ?? ""}`}
      style={{ zIndex: 10 }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={45} />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
