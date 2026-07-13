import { useGLTF } from "@react-three/drei";

/**
 * Preload critical 3D models so they're ready before the user enters a scene.
 * Call once at app startup (e.g. in __root or World).
 */
export function usePreloadModels() {
  useGLTF.preload("/gltf/cat/scene.gltf");
  useGLTF.preload("/models/livingroom/scene.glb");
  useGLTF.preload("/models/fireplace/scene.glb");
  useGLTF.preload("/models/kitchen/scene.glb");
  useGLTF.preload("/models/bedroom/scene.glb");
  useGLTF.preload("/models/diningroom/scene.glb");
  useGLTF.preload("/models/lantern/scene.gltf");
  useGLTF.preload("/models/polytree/scene.gltf");
  useGLTF.preload("/models/houseplants/scene.gltf");
  useGLTF.preload("/models/telescope/scene.gltf");
  useGLTF.preload("/models/outdoor-couch/scene.gltf");
  useGLTF.preload("/models/books/scene.gltf");
  useGLTF.preload("/models/vinyl-player/scene.gltf");
}
