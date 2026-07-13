import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { CandlePath } from "./CandlePath";
import { StageArea } from "./StageArea";
import {
  CherryBlossoms,
  RosePetals,
  GlowingHearts,
  ProposalDust,
} from "./ProposalParticles";

type ProposalSceneProps = {
  /** 0–1 how far camera has walked down the path */
  walkProgress: number;
  /** number of candle pairs ignited */
  candlesLit: number;
  /** stage spotlight visible */
  spotlightOn: boolean;
  /** particles active */
  particlesActive: boolean;
  /** cherry blossoms active */
  blossomsActive: boolean;
  /** hearts active */
  heartsActive: boolean;
  /** camera shake intensity 0–1 */
  cameraShake: number;
  /** overall scene brightness multiplier 0–1 */
  brightness: number;
  onScrollClick: () => void;
};

function CameraRig({
  walkProgress,
  shake,
}: {
  walkProgress: number;
  shake: number;
}) {
  const { camera } = useThree();
  const basePos = useRef(new THREE.Vector3(0, 1.3, 8));
  const lookTarget = useRef(new THREE.Vector3(0, 0.8, -4));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Walk from z=8 to z=2
    const targetZ = 8 - walkProgress * 6;
    const targetY = 1.3 - walkProgress * 0.15;

    // Handheld camera wobble
    const wobbleX = Math.sin(t * 1.2) * 0.015 * shake;
    const wobbleY = Math.sin(t * 1.7) * 0.01 * shake;

    camera.position.set(
      basePos.current.x + wobbleX,
      targetY + wobbleY,
      targetZ,
    );

    // Look ahead — gradually shift focus toward stage
    const lookZ = -4 + (1 - walkProgress) * 4;
    camera.lookAt(
      wobbleX * 0.5,
      0.8 - walkProgress * 0.1,
      lookZ,
    );
  });

  return null;
}

function MarbleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[6, 20]} />
      <meshStandardMaterial
        color="#d8d0c8"
        roughness={0.15}
        metalness={0.08}
      />
    </mesh>
  );
}

function StarCeiling() {
  return (
    <group>
      <Stars
        radius={30}
        depth={20}
        count={2000}
        factor={2.5}
        saturation={0.3}
        fade
        speed={0.3}
      />
      {/* Invisible ceiling plane to hide fog above */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 24]} />
        <meshBasicMaterial color="#050508" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

export function ProposalScene({
  walkProgress,
  candlesLit,
  spotlightOn,
  particlesActive,
  blossomsActive,
  heartsActive,
  cameraShake,
  brightness,
  onScrollClick,
}: ProposalSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.3, 8], fov: 50, near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.3 + brightness * 1.2,
      }}
      dpr={[1, 1.5]}
      shadows
      className="!absolute inset-0"
    >
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 4, 18]} />

      <CameraRig walkProgress={walkProgress} shake={cameraShake} />

      {/* Very dim ambient — starts near zero */}
      <ambientLight intensity={0.02 + brightness * 0.08} color="#ffeecc" />

      <StarCeiling />
      <MarbleFloor />
      <CandlePath ignitedCount={candlesLit} totalCandles={24} />
      <StageArea onScrollClick={onScrollClick} />

      {/* Particles */}
      <CherryBlossoms active={blossomsActive} count={80} />
      <RosePetals active={particlesActive} count={50} />
      <GlowingHearts active={heartsActive} count={15} />
      <ProposalDust active={particlesActive} count={40} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.6 + brightness * 0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.4}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.3} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
