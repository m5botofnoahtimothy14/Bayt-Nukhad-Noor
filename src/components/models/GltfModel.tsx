import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { ModelErrorBoundary } from "./ModelErrorBoundary";

type Props = {
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
};

function ModelInner({
  url,
  castShadow,
  receiveShadow,
}: {
  url: string;
  castShadow: boolean;
  receiveShadow: boolean;
}) {
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

  return <primitive object={cloned} />;
}

export function GltfModel({
  url,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onClick,
}: Props) {
  return (
    <group position={position} scale={scale} rotation={rotation} onClick={onClick}>
      <ModelErrorBoundary url={url}>
        <Suspense fallback={null}>
          <ModelInner url={url} castShadow={castShadow} receiveShadow={receiveShadow} />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
}
