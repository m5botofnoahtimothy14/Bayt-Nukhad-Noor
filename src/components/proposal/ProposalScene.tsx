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
  /** scroll opening animation playing */
  scrollOpening: boolean;
  /** sparkles active around stage */
  sparklesActive: boolean;
  onScrollClick: () => void;
};

/* Smooth exponential ease — feels like a real person walking */
function smoothStep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function CameraRig({
  walkProgress,
  shake,
}: {
  walkProgress: number;
  shake: number;
}) {
  const { camera } = useThree();
  const smoothPos = useRef(new THREE.Vector3(0, 1.3, 8));
  const smoothLook = useRef(new THREE.Vector3(0, 0.85, 0));
  const currentTilt = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    /* ── Target positions with cinematic easing ── */
    // Walk from z=8 to z=-1.5 (close to the scroll for intimacy)
    const easedProgress = smoothStep(0, 1, walkProgress);
    const targetZ = 8 - easedProgress * 9.5;
    // Gentle height shift: starts at 1.3, dips slightly mid-walk, rises to 1.2 at end
    const targetY = 1.3 - Math.sin(easedProgress * Math.PI) * 0.1 + easedProgress * 0.05;

    /* ── Handheld camera wobble — organic, not mechanical ── */
    // Multiple sine waves at different frequencies for natural feel
    const wobbleX = (
      Math.sin(t * 1.1) * 0.6 +
      Math.sin(t * 2.3 + 1.2) * 0.25 +
      Math.sin(t * 0.7 + 0.5) * 0.15
    ) * 0.012 * shake;
    const wobbleY = (
      Math.sin(t * 1.5 + 0.8) * 0.5 +
      Math.sin(t * 3.1 + 2.0) * 0.3
    ) * 0.008 * shake;

    /* ── Subtle breathing when stationary ── */
    const breathing = walkProgress < 0.05
      ? Math.sin(t * 0.8) * 0.003
      : 0;

    /* ── Camera tilt — slight roll during lateral movement ── */
    const targetTilt = Math.sin(t * 0.9) * 0.003 * shake;
    currentTilt.current += (targetTilt - currentTilt.current) * 0.03;

    /* ── Smooth interpolation (lerp factor 0.035 = buttery smooth) ── */
    const lerpFactor = 0.035;
    smoothPos.current.x += (wobbleX - smoothPos.current.x + 0) * lerpFactor;
    smoothPos.current.y += ((targetY + wobbleY + breathing) - smoothPos.current.y) * lerpFactor;
    smoothPos.current.z += (targetZ - smoothPos.current.z) * lerpFactor;

    camera.position.set(smoothPos.current.x, smoothPos.current.y, smoothPos.current.z);

    /* ── Look-at target — smooth transition to scroll ── */
    // When arrived, look directly at the scroll (world z=-5, y=1.1)
    const lookZ = -5 + (1 - easedProgress) * 5;
    const lookY = easedProgress > 0.9
      ? 0.9 + Math.sin(t * 0.6) * 0.003 // subtle pulse when arrived
      : 0.8 + easedProgress * 0.1;

    smoothLook.current.x += (wobbleX * 0.2 - smoothLook.current.x) * lerpFactor;
    smoothLook.current.y += (lookY - smoothLook.current.y) * lerpFactor;
    smoothLook.current.z += (lookZ - smoothLook.current.z) * lerpFactor;

    camera.lookAt(smoothLook.current);

    /* ── Apply subtle roll for cinematic feel ── */
    camera.rotation.z = currentTilt.current;
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
  scrollOpening,
  sparklesActive,
  onScrollClick,
}: ProposalSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.3, 8], fov: 50, near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.5 + brightness * 0.5,
      }}
      dpr={[1, 1.5]}
      shadows
      className="!absolute inset-0"
    >
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 6, 22]} />

      <CameraRig walkProgress={walkProgress} shake={cameraShake} />

      {/* Slightly brighter ambient for base fill */}
      <ambientLight intensity={0.04 + brightness * 0.06} color="#f0eeff" />

      {/* Directional key — subtle overall fill from above-front */}
      <directionalLight
        position={[2, 6, 4]}
        intensity={0.15 + brightness * 0.2}
        color="#fff8f0"
      />

      <StarCeiling />
      <MarbleFloor />
      <CandlePath ignitedCount={candlesLit} totalCandles={24} />
      <StageArea
        onScrollClick={onScrollClick}
        scrollOpening={scrollOpening}
        sparklesActive={sparklesActive}
      />

      {/* Particles */}
      <CherryBlossoms active={blossomsActive} count={80} />
      <RosePetals active={particlesActive} count={50} />
      <GlowingHearts active={heartsActive} count={15} />
      <ProposalDust active={particlesActive} count={40} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.15 + brightness * 0.1}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.4}
          kernelSize={KernelSize.MEDIUM}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.4} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
