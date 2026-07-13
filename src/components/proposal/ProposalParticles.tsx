import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Cherry Blossom Petals ─── */
export function CherryBlossoms({ count = 80, active = false }: { count?: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 10,
        y: 2 + Math.random() * 4,
        z: (Math.random() - 0.5) * 8 - 2,
        rotSpeed: 0.5 + Math.random() * 1.5,
        fallSpeed: 0.15 + Math.random() * 0.35,
        swayAmp: 0.3 + Math.random() * 0.6,
        swayFreq: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.02,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    particles.forEach((p, i) => {
      const y = p.y - t * p.fallSpeed;
      const wrapped = ((y % 6) + 6) % 6 + 1;
      dummy.position.set(
        p.x + Math.sin(t * p.swayFreq + p.phase) * p.swayAmp,
        wrapped,
        p.z + Math.cos(t * p.swayFreq * 0.7 + p.phase) * p.swayAmp * 0.5,
      );
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.6, t * p.rotSpeed * 0.3);
      dummy.scale.setScalar(p.scale * 100);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      const pinkness = 0.7 + Math.sin(i * 0.5) * 0.3;
      color.setRGB(1, 0.7 * pinkness, 0.8 * pinkness);
      ref.current!.setColorAt(i, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffb0c0" transparent opacity={0.7} side={2} />
    </instancedMesh>
  );
}

/* ─── Rose Petals (deeper red, larger) ─── */
export function RosePetals({ count = 50, active = false }: { count?: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 8,
        y: 1.5 + Math.random() * 3,
        z: (Math.random() - 0.5) * 6 - 3,
        rotSpeed: 0.3 + Math.random() * 1,
        fallSpeed: 0.1 + Math.random() * 0.25,
        swayAmp: 0.2 + Math.random() * 0.4,
        swayFreq: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.03 + Math.random() * 0.02,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    particles.forEach((p, i) => {
      const y = p.y - t * p.fallSpeed;
      const wrapped = ((y % 5) + 5) % 5 + 1;
      dummy.position.set(
        p.x + Math.sin(t * p.swayFreq + p.phase) * p.swayAmp,
        wrapped,
        p.z + Math.cos(t * p.swayFreq * 0.5 + p.phase) * p.swayAmp * 0.4,
      );
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.8, 0);
      dummy.scale.setScalar(p.scale * 100);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      color.setRGB(0.8 + Math.sin(i) * 0.2, 0.15, 0.2 + Math.sin(i * 2) * 0.1);
      ref.current!.setColorAt(i, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#cc2244" transparent opacity={0.6} side={2} />
    </instancedMesh>
  );
}

/* ─── Glowing Heart Shapes (elegant, not cartoon) ─── */
export function GlowingHearts({ count = 15, active = false }: { count?: number; active?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 6,
        y: 0.5 + Math.random() * 2.5,
        z: (Math.random() - 0.5) * 4 - 2,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        life: 0,
        maxLife: 3 + Math.random() * 4,
        scale: 0.03 + Math.random() * 0.03,
      })),
    [count],
  );

  useFrame(({ clock }, dt) => {
    if (!ref.current || !active) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    data.forEach((p, i) => {
      p.life += dt;
      if (p.life > p.maxLife) {
        p.life = 0;
        p.x = (Math.random() - 0.5) * 6;
        p.y = 0.5 + Math.random() * 2.5;
        p.z = (Math.random() - 0.5) * 4 - 2;
      }
      const progress = p.life / p.maxLife;
      const fadeIn = Math.min(progress * 5, 1);
      const fadeOut = Math.max(1 - (progress - 0.7) / 0.3, 0);
      const opacity = fadeIn * (progress > 0.7 ? fadeOut : 1);
      dummy.position.set(
        p.x + Math.sin(t * 0.5 + p.phase) * 0.2,
        p.y + p.life * p.speed * 0.3,
        p.z + Math.cos(t * 0.3 + p.phase) * 0.15,
      );
      dummy.scale.setScalar(p.scale * 100 * opacity);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      color.setRGB(1, 0.4 + opacity * 0.3, 0.5 + opacity * 0.2);
      ref.current!.setColorAt(i, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshBasicMaterial color="#ff8899" transparent opacity={0.5} />
    </instancedMesh>
  );
}

/* ─── Floating Dust Particles ─── */
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

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.01, 3, 3]} />
      <meshBasicMaterial color="#ffeecc" transparent opacity={0.2} />
    </instancedMesh>
  );
}
