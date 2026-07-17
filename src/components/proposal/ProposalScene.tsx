import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { CandlePath } from "./CandlePath";
import { StageArea } from "./StageArea";
import { ProposalDust, FallingPetals, RisingEmbers, StageHalo } from "./ProposalParticles";

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

/* ── Glowing lantern dot ── */
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
  const glowRef = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delay;
    if (ref.current) {
      ref.current.position.y = baseY + Math.sin(t * 0.5) * 0.1;
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.6 + Math.sin(t * 2.5) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.position.y = baseY + Math.sin(t * 0.5) * 0.1;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 2.5) * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Camera rig — smooth cinematic walk ── */
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

    const breathing = walkProgress < 0.05 ? Math.sin(t * 0.8) * 0.003 : 0;
    const targetTilt = Math.sin(t * 0.9) * 0.004 * shake;
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

/* ── Marble floor with subtle veining ── */
function MarbleFloor() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Subtle shimmer on the floor
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.01 + Math.sin(t * 0.3) * 0.005;
  });

  return (
    <group>
      {/* Main floor */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 22]} />
        <meshStandardMaterial
          color="#d8d0c8"
          roughness={0.25}
          metalness={0.05}
          emissive="#ffeedd"
          emissiveIntensity={0.01}
        />
      </mesh>

      {/* Floor edge lines — subtle marble veins */}
      {[-2.5, -1, 0.5, 2].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, 0]}>
          <planeGeometry args={[0.008, 22]} />
          <meshBasicMaterial color="#c0b8b0" transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Floor reflection plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
        <planeGeometry args={[6, 22]} />
        <meshStandardMaterial
          color="#e0d8d0"
          roughness={0.1}
          metalness={0.15}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

/* ── Scattered rose petals along the walkway ── */
function ScatteredPetals() {
  const petals = useMemo(() =>
    Array.from({ length: 35 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 3.5,
        0.008,
        (Math.random() - 0.5) * 14,
      ] as [number, number, number],
      rot: Math.random() * Math.PI * 2,
      color: i % 4 === 0 ? "#cc2244" : i % 4 === 1 ? "#dd4466" : i % 4 === 2 ? "#ee8899" : "#f0c0c0",
      size: 0.02 + Math.random() * 0.03,
    })),
    [],
  );

  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const petal = petals[i];
      if (!petal) return;
      child.rotation.z = petal.rot + Math.sin(t * 0.2 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {petals.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, p.rot]}>
          <circleGeometry args={[p.size, 5]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.6} side={2} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Ambient dust particles floating in candlelight ── */
function AmbientDust() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() =>
    Array.from({ length: 40 }).map(() => ({
      x: (Math.random() - 0.5) * 5,
      y: 0.5 + Math.random() * 3,
      z: (Math.random() - 0.5) * 14,
      speed: 0.05 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      drift: 0.3 + Math.random() * 0.5,
    })),
    [],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    data.forEach((d, i) => {
      dummy.position.set(
        d.x + Math.sin(t * d.speed + d.phase) * d.drift,
        d.y + Math.sin(t * d.speed * 0.7 + d.phase) * 0.3,
        d.z + Math.cos(t * d.speed * 0.5 + d.phase) * d.drift * 0.5,
      );
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 40]} frustumCulled={false}>
      <sphereGeometry args={[0.012, 4, 4]} />
      <meshBasicMaterial color="#ffeedd" transparent opacity={0.2} />
    </instancedMesh>
  );
}

/* ── Star ceiling — deep night sky ── */
function StarCeiling() {
  return (
    <group>
      <Stars radius={35} depth={25} count={1200} factor={2.5} saturation={0.15} fade speed={0.2} />
      <mesh position={[0, 4.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 28]} />
        <meshBasicMaterial color="#030308" />
      </mesh>
    </group>
  );
}

/* ── Walkway lanterns — upgraded with glow halos ── */
function WalkwayLanterns() {
  const lanterns: { pos: [number, number, number]; color: string; delay: number }[] = [];
  const colors = ["#ffe0a0", "#ffd080", "#ffb050"];
  for (let i = 0; i < 8; i++) {
    const z = 6 - i * 1.5;
    lanterns.push({ pos: [-1.8, 0.55, z], color: colors[i % 3], delay: i * 0.6 });
    lanterns.push({ pos: [1.8, 0.55, z], color: colors[(i + 1) % 3], delay: i * 0.6 + 0.3 });
  }
  return (
    <group>
      {lanterns.map((l, i) => (
        <LanternDot key={i} position={l.pos} color={l.color} delay={l.delay} />
      ))}
    </group>
  );
}

/* ── Main scene ── */
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
      camera={{ position: [0, 1.3, 8], fov: 50, near: 0.1, far: 60 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "default",
      }}
      dpr={[1, 1.25]}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#040408"]} />
      <fog attach="fog" args={["#040408", 6, 22]} />

      <CameraRig walkProgress={walkProgress} shake={cameraShake} />

      <ambientLight intensity={0.12} color="#f0eeff" />

      {/* Spotlight when room awakens */}
      {spotlightOn && (
        <spotLight
          position={[0, 5, -3]}
          target-position={[0, 0, -4]}
          angle={0.5}
          penumbra={0.8}
          intensity={0.8}
          color="#fff5e0"
          castShadow
        />
      )}

      <StarCeiling />
      <MarbleFloor />
      <ScatteredPetals />
      <AmbientDust />
      <CandlePath ignitedCount={candlesLit} totalCandles={24} />
      <WalkwayLanterns />
      <StageArea
        onScrollClick={onScrollClick}
        scrollOpening={scrollOpening}
        sparklesActive={sparklesActive}
      />

      {/* Romantic particle stack — sparkles, embers, petals, halo, dust */}
      {sparklesActive && (
        <>
          <StageHalo active />
          <Sparkles count={80} scale={[7, 3.5, 12]} size={1.6} speed={0.22} color="#ffcbd8" opacity={0.5} />
          <group position={[0, 0, -4]}>
            <Sparkles count={55} scale={[4.5, 2.4, 4.5]} size={2} speed={0.28} color="#ffb890" opacity={0.65} />
          </group>
          <RisingEmbers count={36} active />
          <FallingPetals count={55} active />
          <ProposalDust count={70} active />
        </>
      )}

      {/* Minimal postprocessing — bloom for warm glow */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.55}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.55} />
      </EffectComposer>

    </Canvas>
  );
}
