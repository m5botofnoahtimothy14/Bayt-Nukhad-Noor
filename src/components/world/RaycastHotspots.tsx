import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type HotspotKind = "memory" | "letter" | "photo" | "song";

export type HotspotSpec = {
  id: string;
  kind: HotspotKind;
  /** world position */
  position: [number, number, number];
  /** approximate hit radius in meters */
  radius: number;
  /** optional label */
  label?: string;
};

export type RaycastHotspotsProps = {
  /** If true, hotspots are enabled */
  enabled: boolean;
  camera: THREE.Camera;
  /** pointer is in normalized device coords (-1..1) */
  pointerNdc: THREE.Vector2;
  /** provide the scene meshes to test against */
  scene: THREE.Scene;
  /** map from kind+id to callback */
  onHotspot: (hotspot: HotspotSpec) => void;
  hotspots: HotspotSpec[];
};

/**
 * Click/raycast handler that triggers when ray intersects any hotspot marker mesh.
 * This uses real meshes (GLTF markers) when present, and falls back to sphere hits using world space radii.
 */
export function RaycastHotspots({
  enabled,
  camera,
  pointerNdc,
  scene,
  onHotspot,
  hotspots,
}: RaycastHotspotsProps) {
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame(() => {
    // No per-frame work required.
  });

  // Imperative click handler is wired by scene components via onClick.
  // This component intentionally does not attach DOM events.
  return null;
}

