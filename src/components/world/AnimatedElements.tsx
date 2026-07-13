import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Fireflies: drift randomly, pulse glow ─── */
export function Fireflies({ count = 20, color = "#ffee44", area = [6, 3, 6] }: {
  count?: number;
  color?: string;
  area?: [number, number, number];
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() =>
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * area[0],
      y: 0.5 + Math.random() * area[1],
      z: (Math.random() - 0.5) * area[2],
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseZ: Math.random() * Math.PI * 2,
      speedX: 0.2 + Math.random() * 0.4,
      speedY: 0.3 + Math.random() * 0.5,
      speedZ: 0.15 + Math.random() * 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 1 + Math.random() * 2,
      baseScale: 0.015 + Math.random() * 0.015,
    })), [count, area]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    data.forEach((d, i) => {
      dummy.position.set(
        d.x + Math.sin(t * d.speedX + d.phaseX) * 1.5,
        d.y + Math.sin(t * d.speedY + d.phaseY) * 0.5,
        d.z + Math.cos(t * d.speedZ + d.phaseZ) * 1.2,
      );
      const pulse = 0.5 + Math.sin(t * d.pulseSpeed + d.pulsePhase) * 0.5;
      dummy.scale.setScalar(d.baseScale * (0.6 + pulse * 0.4) * 100);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </instancedMesh>
  );
}

/* ─── Rain: fall straight down, loop ─── */
export function RainFall({ count = 60, speed = 2, height = 6 }: {
  count?: number;
  speed?: number;
  height?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() =>
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8,
      y: Math.random() * height,
      fallSpeed: speed * (0.6 + Math.random() * 0.8),
    })), [count, speed, height]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    data.forEach((d, i) => {
      d.y -= d.fallSpeed * dt;
      if (d.y < 0) d.y = height;
      dummy.position.set(d.x, d.y, d.z);
      dummy.scale.set(1, 3, 1);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <cylinderGeometry args={[0.003, 0.003, 0.1, 3]} />
      <meshBasicMaterial color="#aabbdd" transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ─── Snow: drift down with horizontal sway ─── */
export function SnowFall({ count = 50, height = 6 }: { count?: number; height?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() =>
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 10,
      y: Math.random() * height,
      fallSpeed: 0.3 + Math.random() * 0.5,
      swayAmp: 0.5 + Math.random() * 1,
      swayFreq: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    })), [count, height]);

  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    data.forEach((d, i) => {
      d.y -= d.fallSpeed * dt;
      if (d.y < 0) d.y = height;
      dummy.position.set(
        d.x + Math.sin(t * d.swayFreq + d.phase) * d.swayAmp,
        d.y,
        d.z + Math.cos(t * d.swayFreq * 0.7 + d.phase) * d.swayAmp * 0.5,
      );
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color="#e8eeff" transparent opacity={0.7} />
    </instancedMesh>
  );
}

/* ─── Falling Leaves: tumble down with rotation ─── */
export function FallingLeaves({ count = 15, colors = ["#cc6633", "#aa4422", "#dd8844", "#993311"] }: {
  count?: number;
  colors?: string[];
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() =>
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8,
      y: 1 + Math.random() * 5,
      fallSpeed: 0.15 + Math.random() * 0.3,
      swayAmp: 0.8 + Math.random() * 1.5,
      swayFreq: 0.2 + Math.random() * 0.4,
      rotSpeed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    })), [count, colors]);

  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    data.forEach((d, i) => {
      d.y -= d.fallSpeed * dt;
      if (d.y < -1) { d.y = 6; d.x = (Math.random() - 0.5) * 10; }
      dummy.position.set(
        d.x + Math.sin(t * d.swayFreq + d.phase) * d.swayAmp,
        d.y,
        d.z + Math.cos(t * d.swayFreq * 0.5 + d.phase) * d.swayAmp * 0.3,
      );
      dummy.rotation.set(t * d.rotSpeed, t * d.rotSpeed * 0.7, t * d.rotSpeed * 0.3);
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      color.set(d.color);
      ref.current!.setColorAt(i, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0.7} side={2} />
    </instancedMesh>
  );
}

/* ─── Grass Blades: sway in wind ─── */
export function AnimatedGrass({ blades }: { blades: { x: number; z: number; h: number; color: string }[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const blade = blades[i];
      if (!blade) return;
      const lean = Math.sin(t * 0.8 + blade.x * 0.5 + blade.z * 0.3) * 0.15;
      child.rotation.z = lean;
      child.rotation.x = lean * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[0.02, b.h, 0.01]} />
          <meshStandardMaterial color={b.color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Candle Flicker: reusable animated candle ─── */
export function AnimatedCandle({ position, height = 0.15 }: {
  position: [number, number, number];
  height?: number;
}) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + seed;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 6) * 0.15;
      flameRef.current.scale.x = 1 + Math.sin(t * 4.5) * 0.1;
      flameRef.current.position.y = height * 0.7 + Math.sin(t * 5) * 0.005;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + Math.sin(t * 5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.015, 0.02, height, 6]} />
        <meshStandardMaterial color="#f5f0dc" roughness={0.6} />
      </mesh>
      <mesh ref={flameRef} position={[0, height * 0.7, 0]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.85} />
      </mesh>
      <pointLight ref={lightRef} position={[0, height * 0.8, 0]} color={0xffaa44} intensity={0.4} distance={2.5} decay={2} />
    </group>
  );
}

/* ─── Lantern Glow: animated point light with flicker ─── */
export function LanternGlow({ position, color = 0xffaa44, intensity = 2 }: {
  position: [number, number, number];
  color?: number;
  intensity?: number;
}) {
  const ref = useRef<THREE.PointLight>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() + seed;
      ref.current.intensity = intensity + Math.sin(t * 3) * intensity * 0.15;
    }
  });

  return <pointLight ref={ref} position={position} color={color} intensity={intensity} distance={5} decay={2} />;
}

/* ─── Star Twinkle: animates opacity of star points ─── */
export function TwinklingStars({ count = 100, radius = 20 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.5 + Math.random() * 2;
    }
    return { positions, phases, speeds };
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const attr = ref.current.geometry.attributes.position;
    // We animate via the material opacity since PointsMaterial doesn't support per-vertex alpha easily
    // Instead we scale the points
    ref.current.material.size = 0.08 + Math.sin(t * 0.5) * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.08} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ─── Water Shimmer: animate a water plane with vertex displacement ─── */
export function WaterShimmer({ size = [10, 8], color = "#2a4a6a" }: {
  size?: [number, number];
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const geo = ref.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 2 + t * 1.5) * 0.03 + Math.cos(y * 3 + t) * 0.02);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <planeGeometry args={[size[0], size[1], 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} roughness={0.1} metalness={0.3} />
    </mesh>
  );
}
