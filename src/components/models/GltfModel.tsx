import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  onClick?: (e: THREE.Event) => void;
};

export function GltfModel({
  url,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onClick,
}: Props) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });
    return s;
  }, [scene, castShadow, receiveShadow]);

  return (
    <group position={position} scale={scale} rotation={rotation} onClick={onClick}>
      <primitive object={cloned} />
    </group>
  );
}
