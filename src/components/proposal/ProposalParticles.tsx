import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Ambient dust — subtle drifting sparkle ─── */
export function ProposalDust({ count = 40, active = false }: { count?: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 8,
        y: 0.5 + Math.random() * 3,
        z: (Math.random() - 0.5) * 6 - 2,
        speed: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.3,
        p.y + Math.sin(t * p.speed * 0.5 + p.phase) * 0.2,
        p.z + Math.cos(t * p.speed * 0.3 + p.phase) * 0.15,
      );
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.01, 3, 3]} />
      <meshBasicMaterial color="#ffeecc" transparent opacity={0.25} />
    </instancedMesh>
  );
}

/* ─── Falling rose petals — drift down slowly, sway side to side ─── */
export function FallingPetals({ count = 45, active = false }: { count?: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 10,
        y: 3 + Math.random() * 3,
        z: (Math.random() - 0.5) * 8 - 2,
        fall: 0.15 + Math.random() * 0.25,
        sway: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.2,
        tone: Math.random(),
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.y - t * p.fall) % 6 + 6) % 6 - 0.4;
      const swayX = Math.sin(t * p.sway + p.phase) * 0.35;
      const swayZ = Math.cos(t * p.sway * 0.7 + p.phase) * 0.2;
      dummy.position.set(p.x + swayX, y, p.z + swayZ);
      dummy.rotation.set(t * p.spin * 0.5, t * p.spin, Math.sin(t + p.phase) * 0.4);
      dummy.scale.setScalar(0.9 + Math.sin(t * 0.6 + p.phase) * 0.1);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[0.045, 0.06]} />
      <meshBasicMaterial color="#f2a6b8" transparent opacity={0.85} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

/* ─── Rising warm embers — glow up from the stage like candlelight ─── */
export function RisingEmbers({ count = 30, active = false }: { count?: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 3.6,
        z: (Math.random() - 0.5) * 3.6 - 4,
        y0: Math.random() * 3,
        rise: 0.25 + Math.random() * 0.3,
        wobble: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const life = ((p.y0 + t * p.rise) % 4);
      const y = 0.1 + life;
      const alphaScale = Math.max(0, 1 - life / 4);
      dummy.position.set(
        p.x + Math.sin(t * p.wobble + p.phase) * 0.15,
        y,
        p.z + Math.cos(t * p.wobble * 0.6 + p.phase) * 0.1,
      );
      dummy.scale.setScalar(0.6 + alphaScale * 0.7);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.018, 4, 4]} />
      <meshBasicMaterial color="#ffd48a" transparent opacity={0.85} />
    </instancedMesh>
  );
}

/* ─── Pulsing stage halo — soft glow ring around the pedestal ─── */
export function StageHalo({ active = false }: { active?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 0.6) * 0.06;
    ref.current.scale.set(s, s, 1);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + Math.sin(t * 0.9) * 0.06;
  });
  if (!active) return null;
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -4]}>
      <ringGeometry args={[1.9, 3.2, 48]} />
      <meshBasicMaterial color="#ff9ab0" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}
