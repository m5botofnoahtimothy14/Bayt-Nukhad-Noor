import { GltfModel } from "./GltfModel";

type Props = {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  onClick?: (e: any) => void;
};

export function LanternModel({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  onClick,
}: Props) {
  return (
    <GltfModel
      url="/models/lantern/scene.gltf"
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={onClick}
    />
  );
}
