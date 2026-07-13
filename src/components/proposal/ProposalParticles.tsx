import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Floating Dust Particles — subtle ambient sparkle ─── */
export function ProposalDust({ count = 40, active = false }: { count?: number; active?: boolean }) {
  if (!active) return null;
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
