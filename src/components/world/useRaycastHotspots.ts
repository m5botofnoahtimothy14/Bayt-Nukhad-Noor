import { useCallback, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import type { HotspotKind } from "./RaycastHotspots";
import * as THREE from "three";

export type RaycastTarget = {
  id: string;
  kind: HotspotKind;
  /** world position */
  position: THREE.Vector3;
  /** approximate hit radius */
  radius: number;
  /** optional */
  label?: string;
};

export function useRaycastHotspots({
  enabled,
  targets,
  onHit,
}: {
  enabled: boolean;
  targets: RaycastTarget[];
  onHit: (t: RaycastTarget) => void;
}) {
  const { camera } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useMemo(() => new THREE.Vector2(), []);

  const onPointerDown = useCallback(
    (e: { clientX: number; clientY: number; target: EventTarget | null }) => {
      if (!enabled) return;
      if (!"currentTarget" in e) {
        // tolerate unknown event shape
      }

      // SceneCanvas is responsible for setting pointerNdc; we compute defensively from DOM event
      // using the event target's bounding rect if available.
      const domTarget = e.target as HTMLElement | null;
      if (!domTarget || !domTarget.getBoundingClientRect) return;
      const rect = domTarget.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(pointerNdc, camera);

      // Sphere-hit fallback (works even without marker names).
      for (const t of targets) {
        const sphere = new THREE.Sphere(t.position, t.radius);
        if (raycaster.ray.intersectsSphere(sphere)) {
          onHit(t);
          return;
        }
      }
    },
    [camera, enabled, onHit, raycaster, targets, pointerNdc],
  );

  return { onPointerDown };
}



