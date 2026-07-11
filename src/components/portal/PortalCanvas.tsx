import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, Stars, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* Palette (matches CSS tokens):
   midnight  #0b1024
   indigo    #1a244a
   verdant   #1f7a52
   dark-red  #8a1e2b
*/

function Lantern({
  position,
  scale = 1,
  hue = "verdant",
}: {
  position: [number, number, number];
  scale?: number;
  hue?: "verdant" | "ember" | "moon";
}) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const color = useMemo(() => {
    if (hue === "verdant") return new THREE.Color("#3fbf82");
    if (hue === "moon") return new THREE.Color("#d8e4ff");
    return new THREE.Color("#e05464"); // ember / dark red glow
  }, [hue]);

  useFrame((s) => {
    if (group.current) {
      group.current.position.y =
        position[1] + Math.sin(s.clock.elapsedTime * 0.6 + position[0]) * 0.18;
      group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.4 + position[0]) * 0.05;
    }
    if (light.current) {
      light.current.intensity = 3.2 + Math.sin(s.clock.elapsedTime * 3 + position[0]) * 0.7;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.5, 6]} />
        <meshBasicMaterial color="#1a1120" />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.08, 16]} />
        <meshPhysicalMaterial color="#20141a" roughness={0.6} metalness={0.85} clearcoat={0.4} />
      </mesh>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.5}
          transmission={0.6}
          thickness={0.5}
          roughness={0.15}
          transparent
          opacity={0.9}
          ior={1.4}
        />
      </mesh>
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.1, 0.1, 16]} />
        <meshPhysicalMaterial color="#20141a" roughness={0.6} metalness={0.85} />
      </mesh>
      <pointLight ref={light} color={color} intensity={3.2} distance={7} decay={2} castShadow />
    </group>
  );
}

function GroundOrb() {
  // Distant swirling verdant/red aurora orb behind the doors
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (mesh.current) mesh.current.rotation.z = s.clock.elapsedTime * 0.05;
  });
  return (
    <mesh ref={mesh} position={[0, -0.5, -6]}>
      <sphereGeometry args={[3.5, 64, 64]} />
      <MeshDistortMaterial
        color="#1f7a52"
        emissive="#8a1e2b"
        emissiveIntensity={0.6}
        distort={0.35}
        speed={0.8}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  );
}

function Petals() {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const n = 260;
    const positions = new Float32Array(n * 3);
    const speeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions, speeds };
  }, []);
  useFrame((s, dt) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < speeds.length; i++) {
      arr[i * 3 + 1] -= speeds[i] * dt * 0.4;
      arr[i * 3] += Math.sin(s.clock.elapsedTime * 0.6 + i) * dt * 0.18;
      if (arr[i * 3 + 1] < -3) arr[i * 3 + 1] = 11;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#e0b090"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function PortalCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5.5], fov: 55 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      dpr={[1, 2]}
      shadows
      className="!absolute inset-0"
    >
      <color attach="background" args={["#08091a"]} />
      <fog attach="fog" args={["#08091a", 6, 22]} />

      <ambientLight intensity={0.18} color="#4a5a8a" />
      <hemisphereLight args={["#3fbf82", "#0b1024", 0.35]} />
      <directionalLight position={[3, 5, 2]} intensity={0.4} color="#d8e4ff" castShadow />

      <Stars radius={45} depth={35} count={3200} factor={3.5} saturation={0.7} fade speed={0.5} />

      <GroundOrb />

      {/* Warm distant crimson glow */}
      <mesh position={[0, -0.2, -9]}>
        <planeGeometry args={[36, 24]} />
        <meshBasicMaterial color="#3a0e1a" transparent opacity={0.55} />
      </mesh>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <Lantern position={[-3.4, 1.4, -2]} scale={1} hue="verdant" />
      </Float>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
        <Lantern position={[3.6, 0.6, -3]} scale={1.2} hue="ember" />
      </Float>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <Lantern position={[-2.6, -0.9, -1]} scale={0.75} hue="ember" />
      </Float>
      <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.7}>
        <Lantern position={[2.8, 1.8, -4]} scale={0.9} hue="verdant" />
      </Float>
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.6}>
        <Lantern position={[0.4, 2.4, -5]} scale={0.8} hue="moon" />
      </Float>

      <Sparkles count={120} scale={[14, 9, 7]} size={2.8} speed={0.35} color="#8fe4b8" opacity={0.55} />
      <Sparkles count={60} scale={[12, 8, 6]} size={2.2} speed={0.3} color="#e05464" opacity={0.45} />
      <Petals />

      <Environment preset="night" background={false} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0009)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
