import { useGLTF } from "@react-three/drei";

/**
 * Preload ALL 3D models up front so scene switching is instant.
 * Called once in the World component on mount.
 */
export function usePreloadModels() {
  // Cat (always visible)
  useGLTF.preload("/gltf/cat/scene.gltf");

  // Props used across multiple scenes
  useGLTF.preload("/models/houseplants/scene.gltf");
  useGLTF.preload("/models/lantern/scene.gltf");
  useGLTF.preload("/models/polytree/scene.gltf");

  // Room-specific props
  useGLTF.preload("/models/vinyl-player/scene.gltf");
  useGLTF.preload("/models/telescope/scene.gltf");
  useGLTF.preload("/models/outdoor-couch/scene.gltf");
  useGLTF.preload("/models/books/scene.gltf");
}
