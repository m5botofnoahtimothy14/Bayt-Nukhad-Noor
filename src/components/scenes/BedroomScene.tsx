import { GltfModel } from "@/components/models/GltfModel";
import { RoomShell } from "@/components/world/RoomShell";
import { useMemories, type Memory } from "@/components/world/memories";
import { useSharedState } from "@/hooks/useSharedState";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  phase: TimePhase;
  onOpen: (k: "memory" | "letter" | "photo" | "song") => void;
  onView: (m: Memory) => void;
};

type LampState = { noah: boolean; khadija: boolean };

export function BedroomScene({ phase, onOpen, onView }: Props) {
  const { items } = useMemories("bedroom");
  const { value: lamps, setValue: setLamps } = useSharedState<LampState>("bedroom.lamps", {
    noah: true,
    khadija: true,
  });

  const isNight = phase === "night";
  const bothOff = !lamps.noah && !lamps.khadija;

  const toggleLamp = (person: "noah" | "khadija") => {
    setLamps((prev) => ({ ...prev, [person]: !prev[person] }));
  };

  return (
    <group>
      <ambientLight intensity={isNight ? (bothOff ? 0.03 : 0.08) : 0.2} />

      {/* Procedural room shell + bed */}
      <RoomShell tint="#2a2038" floorTint="#3a2f45" width={8} depth={6} height={3} />
      {/* Bed frame */}
      <mesh position={[0, 0.35, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.7, 2.2]} />
        <meshStandardMaterial color="#4a3a5a" roughness={0.7} />
      </mesh>
      {/* Mattress / duvet */}
      <mesh position={[0, 0.78, -1.2]} castShadow>
        <boxGeometry args={[2.9, 0.2, 2.1]} />
        <meshStandardMaterial color="#e8d8e0" roughness={0.6} />
      </mesh>
      {/* Pillows */}
      <mesh position={[-0.7, 0.95, -1.9]} castShadow>
        <boxGeometry args={[1, 0.15, 0.5]} />
        <meshStandardMaterial color="#f5eef2" roughness={0.5} />
      </mesh>
      <mesh position={[0.7, 0.95, -1.9]} castShadow>
        <boxGeometry args={[1, 0.15, 0.5]} />
        <meshStandardMaterial color="#f5eef2" roughness={0.5} />
      </mesh>
      {/* Nightstands */}
      <mesh position={[-2.2, 0.4, -1.5]} castShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial color="#3a2a20" roughness={0.8} />
      </mesh>
      <mesh position={[2.2, 0.4, -1.5]} castShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial color="#3a2a20" roughness={0.8} />
      </mesh>

      {/* Noah's lamp — left nightstand area */}
      <group position={[-2.2, 0.8, -1.5]}>
        {lamps.noah && (
          <>
            <GltfModel url="/models/lantern/scene.gltf" scale={0.25} />
            <pointLight
              position={[0, 0.3, 0]}
              intensity={0.6}
              color={0xff9944}
              distance={3}
              decay={2}
            />
          </>
        )}
        <mesh onClick={() => toggleLamp("noah")} visible={false}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <Html position={[0, 0.7, 0]} distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div className="text-[9px] text-white/40 serif italic">Noah</div>
        </Html>
      </group>

      {/* Khadija's lamp — right nightstand area */}
      <group position={[2.2, 0.8, -1.5]}>
        {lamps.khadija && (
          <>
            <GltfModel url="/models/lantern/scene.gltf" scale={0.25} />
            <pointLight
              position={[0, 0.3, 0]}
              intensity={0.6}
              color={0xff9944}
              distance={3}
              decay={2}
            />
          </>
        )}
        <mesh onClick={() => toggleLamp("khadija")} visible={false}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <Html position={[0, 0.7, 0]} distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div className="text-[9px] text-white/40 serif italic">Khadija</div>
        </Html>
      </group>

      {/* Moon light through window (night) */}
      {isNight && (
        <>
          <MoonSpotlight />
          {Array.from({ length: 15 }).map((_v, i) => (
            <mesh key={i} position={[-4 + (i % 5) * 1, 3 + Math.floor(i / 5) * 0.5, -4]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3 + Math.random() * 0.4} />
            </mesh>
          ))}
        </>
      )}

      {/* Sleep indicator */}
      {bothOff && isNight && (
        <Html position={[0, 2, -1]} distanceFactor={6} center style={{ pointerEvents: "none" }}>
          <div className="rounded-full bg-black/40 px-3 py-1 text-[10px] text-blue-200/50 backdrop-blur-sm serif italic">
            we're both asleep
          </div>
        </Html>
      )}

      {/* Dream journal hotspot */}
      <mesh position={[-1.5, 1.2, 0.5]} onClick={() => onOpen("memory")}>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshStandardMaterial color="#8866aa" roughness={0.5} />
      </mesh>
      <Html position={[-1.5, 1.4, 0.5]} distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="text-[9px] text-purple-300/60 serif italic">dream journal</div>
      </Html>

      {/* Pillow letter hotspot */}
      <mesh position={[1.5, 0.8, -0.5]} onClick={() => onOpen("letter")}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.5} />
      </mesh>

      {/* Memory origami diamonds */}
      {items?.slice(0, 4).map((m, i) => (
        <group key={m.id} position={[-2.5 + i * 1.7, 2.5, -2.5]}>
          <mesh onClick={() => onView(m)} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.3, 0.3, 0.02]} />
            <meshStandardMaterial
              color={["#aa66cc", "#66aacc", "#ccaa66", "#66ccaa"][i % 4]}
              roughness={0.4}
            />
          </mesh>
          <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
            <div className="max-w-[70px] truncate text-[8px] text-white/50 serif italic">
              {m.title}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

function MoonSpotlight() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetObj = useRef(new THREE.Object3D());

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.target = targetObj.current;
    }
  }, []);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[4, 4, 2]}
        angle={0.4}
        penumbra={0.9}
        intensity={0.3}
        color={0x8899cc}
      />
      <primitive object={targetObj.current} position={[0, 0.3, -2]} />
    </>
  );
}
