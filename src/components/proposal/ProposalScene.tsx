import { useRef, useMemo } from "react";
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

/* ── Floating Lantern — warm paper lantern along the walkway ── */
function WalkwayLantern({
  position,
  hue = "warm",
  delay = 0,
}: {
  position: [number, number, number];
  hue?: "warm" | "gold" | "amber";
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const baseY = position[1];

  const color = useMemo(() => {
    if (hue === "gold") return new THREE.Color("#ffd080");
    if (hue === "amber") return new THREE.Color("#ffb050");
    return new THREE.Color("#ffe0a0");
  }, [hue]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delay;
    if (groupRef.current) {
      groupRef.current.position.y = baseY + Math.sin(t * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.03;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.8 + Math.sin(t * 2.5) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Lantern body — warm glowing orb */}
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.025, 8]} />
        <meshStandardMaterial color="#8a7a60" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.05, 0.03, 0.02, 8]} />
        <meshStandardMaterial color="#8a7a60" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Hanging wire */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.08, 3]} />
        <meshStandardMaterial color="#6a6050" roughness={0.5} />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1.8} distance={3.5} decay={2} />
    </group>
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

    /* Handheld wobble — scales with shake */
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

    /* Smoother lerp — higher factor = snappier tracking */
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[6, 20]} />
      <meshStandardMaterial color="#d8d0c8" roughness={0.15} metalness={0.08} />
    </mesh>
  );
}

function StarCeiling() {
  return (
    <group>
      <Stars radius={30} depth={20} count={2000} factor={2.5} saturation={0.3} fade speed={0.3} />
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 24]} />
        <meshBasicMaterial color="#050508" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

/* ── Walkway Lanterns — placed along both sides of the path ── */
function WalkwayLanterns() {
  const lanterns = useMemo(() => {
    const items: { pos: [number, number, number]; hue: "warm" | "gold" | "amber"; delay: number }[] = [];
    // Left side
    const leftX = -1.8;
    const rightX = 1.8;
    const hues: ("warm" | "gold" | "amber")[] = ["warm", "gold", "amber"];
    for (let i = 0; i < 8; i++) {
      const z = 6 - i * 1.1;
      const hue = hues[i % 3];
      items.push({ pos: [leftX, 0.6, z], hue, delay: i * 0.8 });
      items.push({ pos: [rightX, 0.6, z], hue, delay: i * 0.8 + 0.4 });
    }
    return items;
  }, []);

  return (
    <group>
      {lanterns.map((l, i) => (
        <WalkwayLantern key={i} position={l.pos} hue={l.hue} delay={l.delay} />
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

      <ambientLight intensity={0.04 + brightness * 0.06} color="#f0eeff" />
      <directionalLight position={[2, 6, 4]} intensity={0.15 + brightness * 0.2} color="#fff8f0" />

      <StarCeiling />
      <MarbleFloor />
      <CandlePath ignitedCount={candlesLit} totalCandles={24} />
      <WalkwayLanterns />
      <StageArea
        onScrollClick={onScrollClick}
        scrollOpening={scrollOpening}
        sparklesActive={sparklesActive}
      />

      {/* Subtle floating particles — small, non-intrusive */}
      <ProposalDust active={particlesActive} count={15} />

      {/* Sparkles — like the portal scene, along the walkway */}
      {sparklesActive && (
        <>
          <Sparkles count={40} scale={[5, 3, 10]} size={1.5} speed={0.2} color="#ffe8c0" opacity={0.4} />
          <Sparkles count={20} scale={[4, 2, 8]} size={1.2} speed={0.15} color="#ffd080" opacity={0.35} />
        </>
      )}

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
