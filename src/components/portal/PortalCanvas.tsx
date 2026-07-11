import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Lantern({ position, scale = 1, hue = 0.06 }: { position: [number, number, number]; scale?: number; hue?: number }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 0.6 + position[0]) * 0.15;
      group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.4 + position[0]) * 0.05;
    }
    if (light.current) {
      light.current.intensity = 2.5 + Math.sin(s.clock.elapsedTime * 3 + position[0]) * 0.5;
    }
  });
  const color = new THREE.Color().setHSL(hue, 0.9, 0.6);
  return (
    <group ref={group} position={position} scale={scale}>
      {/* string */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.5, 6]} />
        <meshBasicMaterial color="#3a2418" />
      </mesh>
      {/* top cap */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.08, 12]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      {/* glass body — emissive glow */}
      <mesh>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          transparent
          opacity={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* bottom cap */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.16, 0.1, 0.1, 12]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      <pointLight ref={light} color={color} intensity={2.5} distance={6} decay={2} />
    </group>
  );
}

function Petals() {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const n = 200;
    const positions = new Float32Array(n * 3);
    const speeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions, speeds };
  }, []);
  useFrame((s, dt) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < speeds.length; i++) {
      arr[i * 3 + 1] -= speeds[i] * dt * 0.4;
      arr[i * 3] += Math.sin(s.clock.elapsedTime * 0.6 + i) * dt * 0.15;
      if (arr[i * 3 + 1] < -3) arr[i * 3 + 1] = 10;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#f5b8a8"
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
      camera={{ position: [0, 0.5, 5], fov: 55 }}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.2 }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#0a0510"]} />
      <fog attach="fog" args={["#0a0510", 8, 22]} />
      <ambientLight intensity={0.15} />
      <hemisphereLight args={["#f5b8a8", "#1a0a1a", 0.25]} />

      <Stars radius={40} depth={30} count={2500} factor={3} saturation={0.6} fade speed={0.5} />

      {/* Warm distant glow */}
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial color="#3a1420" transparent opacity={0.6} />
      </mesh>

      {/* Floating lanterns */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <Lantern position={[-3.2, 1.2, -2]} scale={1} hue={0.04} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
        <Lantern position={[3.5, 0.5, -3]} scale={1.2} hue={0.08} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <Lantern position={[-2.4, -0.8, -1]} scale={0.7} hue={0.02} />
      </Float>
      <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.7}>
        <Lantern position={[2.6, 1.6, -4]} scale={0.9} hue={0.06} />
      </Float>
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.6}>
        <Lantern position={[0.2, 2.2, -5]} scale={0.8} hue={0.05} />
      </Float>

      <Sparkles count={80} scale={[12, 8, 6]} size={2.5} speed={0.3} color="#ffb997" opacity={0.6} />
      <Petals />

      <Environment preset="night" />
    </Canvas>
  );
}
