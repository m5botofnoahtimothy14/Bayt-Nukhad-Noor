import { GltfModel } from "./GltfModel";

type Props = {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  onClick?: (e: any) => void;
};

export function TelescopeModel({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  onClick,
}: Props) {
  return (
    <GltfModel
      url="/models/telescope/scene.gltf"
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={onClick}
    />
  );
}
