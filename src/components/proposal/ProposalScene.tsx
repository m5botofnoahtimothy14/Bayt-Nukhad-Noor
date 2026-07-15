import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { CandlePath } from "./CandlePath";
import { StageArea } from "./StageArea";
import { ProposalDust } from "./ProposalParticles";

type ProposalSceneProps = {
  walkProgress: number;
  candlesLit: number;
  spotlightOn: boolean;
  particlesActive: boolean;
  cameraShake: number;
  brightness: number;
  scrollOpening: boolean;
  sparklesActive: boolean;
  onScrollClick: () => void;
};

function smoothStep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/* ── Glowing lantern dot — no point light, just emissive mesh ── */
function LanternDot({
  position,
  color,
  delay = 0,
}: {
  position: [number, number, number];
  color: string;
  delay?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delay;
    if (ref.current) {
      ref.current.position.y = baseY + Math.sin(t * 0.5) * 0.08;
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.6 + Math.sin(t * 2.5) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.06, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
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
    const easedProgress = smoothStep(0, 1, walkProgress);
    const targetZ = 8 - easedProgress * 9.5;
    const targetY = 1.3 - Math.sin(easedProgress * Math.PI) * 0.08 + easedProgress * 0.05;

    const wobbleX = (
      Math.sin(t * 1.1) * 0.6 +
      Math.sin(t * 2.3 + 1.2) * 0.25 +
      Math.sin(t * 0.7 + 0.5) * 0.15
    ) * 0.01 * shake;
    const wobbleY = (
      Math.sin(t * 1.5 + 0.8) * 0.5 +
      Math.sin(t * 3.1 + 2.0) * 0.3
    ) * 0.006 * shake;

    const breathing = walkProgress < 0.05 ? Math.sin(t * 0.8) * 0.002 : 0;
    const targetTilt = Math.sin(t * 0.9) * 0.003 * shake;
    currentTilt.current += (targetTilt - currentTilt.current) * 0.05;

    const lerpFactor = 0.06;
    smoothPos.current.x += (wobbleX - smoothPos.current.x) * lerpFactor;
    smoothPos.current.y += ((targetY + wobbleY + breathing) - smoothPos.current.y) * lerpFactor;
    smoothPos.current.z += (targetZ - smoothPos.current.z) * lerpFactor;

    camera.position.set(smoothPos.current.x, smoothPos.current.y, smoothPos.current.z);

    const lookZ = -5 + (1 - easedProgress) * 5;
    const lookY = easedProgress > 0.9
      ? 0.9 + Math.sin(t * 0.6) * 0.003
      : 0.8 + easedProgress * 0.1;

    smoothLook.current.x += (wobbleX * 0.2 - smoothLook.current.x) * lerpFactor;
    smoothLook.current.y += (lookY - smoothLook.current.y) * lerpFactor;
    smoothLook.current.z += (lookZ - smoothLook.current.z) * lerpFactor;

    camera.lookAt(smoothLook.current);
    camera.rotation.z = currentTilt.current;
  });

  return null;
}

function MarbleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[6, 20]} />
      <meshBasicMaterial color="#d8d0c8" />
    </mesh>
  );
}

function StarCeiling() {
  return (
    <group>
      <Stars radius={30} depth={20} count={800} factor={2} saturation={0.2} fade speed={0.3} />
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 24]} />
        <meshBasicMaterial color="#050508" />
      </mesh>
    </group>
  );
}

function WalkwayLanterns() {
  const lanterns: { pos: [number, number, number]; color: string; delay: number }[] = [];
  const colors = ["#ffe0a0", "#ffd080", "#ffb050"];
  for (let i = 0; i < 6; i++) {
    const z = 5 - i * 1.5;
    lanterns.push({ pos: [-1.8, 0.5, z], color: colors[i % 3], delay: i * 0.7 });
    lanterns.push({ pos: [1.8, 0.5, z], color: colors[(i + 1) % 3], delay: i * 0.7 + 0.35 });
  }
  return (
    <group>
      {lanterns.map((l, i) => (
        <LanternDot key={i} position={l.pos} color={l.color} delay={l.delay} />
      ))}
    </group>
  );
}

export function ProposalScene({
  walkProgress,
  candlesLit,
  spotlightOn,
  particlesActive,
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
        antialias: false,
        alpha: false,
        powerPreference: "default",
      }}
      dpr={[1, 1.25]}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 8, 20]} />

      <CameraRig walkProgress={walkProgress} shake={cameraShake} />

      <ambientLight intensity={0.15} color="#f0eeff" />

      <StarCeiling />
      <MarbleFloor />
      <CandlePath ignitedCount={candlesLit} totalCandles={24} />
      <WalkwayLanterns />
      <StageArea
        onScrollClick={onScrollClick}
        scrollOpening={scrollOpening}
        sparklesActive={sparklesActive}
      />

      {/* Sparkles + dust — dense around the stage */}
      {sparklesActive && (
        <>
          <Sparkles count={60} scale={[6, 3, 12]} size={1.4} speed={0.25} color="#ffe8c0" opacity={0.45} />
          <group position={[0, 0, -4]}>
            <Sparkles count={40} scale={[4, 2, 4]} size={1.6} speed={0.3} color="#ffd280" opacity={0.55} />
          </group>
          <ProposalDust count={60} active />
        </>
      )}

      {/* Minimal postprocessing — just bloom for the glow effect */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.5}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
