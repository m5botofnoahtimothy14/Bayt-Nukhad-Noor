import { Suspense, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Memory } from "@/components/world/memories";
import { useMemories } from "@/components/world/memories";

type Props = {
  phase: "dawn" | "day" | "dusk" | "night";
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

type MarkerKind = "memory" | "letter" | "photo" | "song";

type MarkerProps = {
  kind: MarkerKind;
  onSelect: () => void;
  position: [number, number, number];
  /** approximate hit radius */
  radius?: number;
  gltfUrl: string;
};

function Marker({ kind, onSelect, position, radius = 0.28, gltfUrl }: MarkerProps) {
  const { scene } = useGLTF(gltfUrl);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Ensure marker responds to raycasts by being mesh-visible.
  useFrame(({ clock }) => {
    // subtle breathing so it feels clickable at night
    const s = 1 + (Math.sin(clock.getElapsedTime() * 2) * 0.02);
    cloned.scale.setScalar(s);
  });

  return (
    <group
      // marker visible for ray hit (not invisible proxies)
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <primitive object={cloned} />
      {/* store radius via metadata */}
      <mesh>
        <sphereGeometry args={[radius, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.001} />
      </mesh>
    </group>
  );
}

export function BedroomScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("bedroom");

  const bedroomUrl = "/models/bedroom.glb";
  const markerUrl = "/models/books/scene.gltf";

  const letterOn = phase === "night" || phase === "dusk";

  return (
    <Suspense fallback={null}>
      <BedroomModel url={bedroomUrl} />

      {/* Letter marker on/near nightstand */}
      <Marker
        kind="letter"
        gltfUrl={markerUrl}
        position={[-1.2, 0.55, 0.2]}
        onSelect={() => {
          if (!letterOn) return;
          onOpen("letter");
        }}
      />

      {/* Memory markers */}
      {items.map((m, idx) => (
        <Marker
          key={m.id}
          kind="memory"
          gltfUrl={markerUrl}
          position={[-0.7 + (idx % 3) * 0.35, 0.75 + (idx % 2) * 0.12, -0.6 + idx * -0.01]}
          onSelect={() => onView(m)}
        />
      ))}
    </Suspense>
  );
}

function BedroomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return <primitive object={cloned} />;
}


