import * as THREE from "three";

type Props = {
  tint?: string;
  floorTint?: string;
  width?: number;
  depth?: number;
  height?: number;
};

/** Simple procedural room shell — used when a full-room GLB is unavailable. */
export function RoomShell({
  tint = "#3a2a24",
  floorTint = "#4a352b",
  width = 8,
  depth = 6,
  height = 3.2,
}: Props) {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorTint} roughness={0.85} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={tint} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* left wall */}
      <mesh
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={tint} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* right wall */}
      <mesh
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={tint} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={tint} roughness={0.95} />
      </mesh>
    </group>
  );
}
