import { Component, Suspense, useMemo, type ReactNode } from "react";
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

class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    // Missing asset / LFS stub / decode failure — swallow so the scene stays alive.
    console.warn("[GltfModel] load failed, skipping:", err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Inner({ url, castShadow, receiveShadow, onClick, ...rest }: Props) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow ?? true;
        child.receiveShadow = receiveShadow ?? true;
      }
    });
    return s;
  }, [scene, castShadow, receiveShadow]);

  return (
    <group
      position={rest.position ?? [0, 0, 0]}
      scale={rest.scale ?? 1}
      rotation={rest.rotation ?? [0, 0, 0]}
      onClick={onClick}
    >
      <primitive object={cloned} />
    </group>
  );
}

export function GltfModel(props: Props) {
  return (
    <ModelBoundary>
      <Suspense fallback={null}>
        <Inner {...props} />
      </Suspense>
    </ModelBoundary>
  );
}
