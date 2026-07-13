import { useCallback, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { TimePhase } from "@/hooks/useTimeOfDay";
import type { Season } from "@/hooks/useSeason";
import type { Weather } from "@/hooks/useWeather";
import { useMemoryStrips, type MemoryStrip } from "@/components/memories-room/useMemoryStrips";
import { PhotoBooth } from "@/components/memories-room/PhotoBooth";
import { MemoryWall } from "@/components/memories-room/MemoryWall";
import { MemoryViewer } from "@/components/memories-room/MemoryViewer";
import { IdleMessage } from "@/components/memories-room/IdleMessage";

type Props = {
  phase: TimePhase;
  season: Season;
  weather: Weather;
};

/* ─── Dust particles (GPU-efficient) ─── */
function DustParticles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: -4 + Math.random() * 8,
        y: 0.5 + Math.random() * 3.5,
        z: -3 + Math.random() * 6,
        speed: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.3,
        p.y + Math.sin(t * p.speed * 0.5 + p.phase) * 0.2,
        p.z + Math.cos(t * p.speed * 0.3 + p.phase) * 0.15,
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.015, 4, 4]} />
      <meshBasicMaterial color="#ffeecc" transparent opacity={0.25} />
    </instancedMesh>
  );
}

/* ─── Fairy lights ─── */
function FairyLights() {
  const positions = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        x: -3.5 + (i / 11) * 7,
        y: 2.8 + Math.sin(i * 0.8) * 0.15,
        z: -2.9,
      })),
    [],
  );

  return (
    <>
      {positions.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]}>
          <mesh>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color={i % 3 === 0 ? "#ffcc66" : i % 3 === 1 ? "#ff9944" : "#ffdd88"} transparent opacity={0.8} />
          </mesh>
          <pointLight intensity={0.08} color={0xffcc66} distance={1.5} decay={2} />
        </group>
      ))}
    </>
  );
}

/* ─── Candle flames with flicker ─── */
function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + seed;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 6) * 0.15;
      flameRef.current.scale.x = 1 + Math.sin(t * 4.5) * 0.1;
      flameRef.current.position.y = 0.1 + Math.sin(t * 5) * 0.005;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.3 + Math.sin(t * 5) * 0.08;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.03, 0.15, 6]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.6} />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.9} />
      </mesh>
      <pointLight ref={lightRef} intensity={0.3} color={0xffaa44} distance={2.5} decay={2} />
    </group>
  );
}

function Candles() {
  return (
    <>
      <Candle position={[-2.5, 1.5, -2.5]} />
      <Candle position={[2.5, 1.5, -2.5]} />
      <Candle position={[-1.5, 0.8, -2.8]} />
      <Candle position={[1.5, 0.8, -2.8]} />
    </>
  );
}

/* ─── Curtain sway ─── */
function Curtains() {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (leftRef.current) {
      leftRef.current.rotation.y = Math.sin(t * 0.8) * 0.03;
      leftRef.current.rotation.z = Math.sin(t * 0.6 + 0.5) * 0.02;
    }
    if (rightRef.current) {
      rightRef.current.rotation.y = Math.sin(t * 0.8 + 1) * 0.03;
      rightRef.current.rotation.z = Math.sin(t * 0.6 + 1.5) * -0.02;
    }
  });

  const curtainColor = "#7a3a2a";
  return (
    <>
      {/* Left curtain */}
      <mesh ref={leftRef} position={[3.05, 2.2, -0.6]}>
        <boxGeometry args={[0.03, 1.8, 0.8]} />
        <meshStandardMaterial color={curtainColor} roughness={0.85} side={2} />
      </mesh>
      {/* Right curtain */}
      <mesh ref={rightRef} position={[3.05, 2.2, 0.6]}>
        <boxGeometry args={[0.03, 1.8, 0.8]} />
        <meshStandardMaterial color={curtainColor} roughness={0.85} side={2} />
      </mesh>
    </>
  );
}

/* ─── Seasonal accents ─── */
function SeasonalAccents({ season }: { season: Season }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = season === "winter" ? 40 : season === "autumn" ? 20 : 0;

  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 8,
        y: 1 + Math.random() * 3,
        z: (Math.random() - 0.5) * 6,
        speed: 0.1 + Math.random() * 0.3,
        sway: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current || count === 0) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    particles.forEach((p, i) => {
      const y = p.y - t * p.speed * 0.2;
      const wrapped = ((y % 4) + 4) % 4 + 0.5;
      dummy.position.set(
        p.x + Math.sin(t * 0.5 + p.phase) * p.sway,
        wrapped,
        p.z + Math.cos(t * 0.3 + p.phase) * p.sway * 0.3,
      );
      dummy.rotation.set(t * 0.5, t * 0.3, t * 0.2);
      dummy.scale.setScalar(0.02);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      if (season === "winter") {
        color.setRGB(0.9, 0.95, 1);
      } else {
        color.setRGB(0.8, 0.4, 0.2);
      }
      ref.current!.setColorAt(i, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={season === "winter" ? "#e8f0ff" : "#cc6633"}
        transparent
        opacity={season === "winter" ? 0.5 : 0.4}
        side={2}
      />
    </instancedMesh>
  );
}

/* ─── Window with light rays ─── */
function WindowLight({ phase }: { phase: TimePhase }) {
  const isDay = phase === "day" || phase === "dawn";
  return (
    <group position={[3.8, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[1.6, 2, 0.1]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.3, 1.7]} />
        <meshBasicMaterial
          color={isDay ? "#88aacc" : "#1a1a2e"}
          transparent
          opacity={isDay ? 0.4 : 0.8}
        />
      </mesh>
      {/* Light rays (day only) */}
      {isDay && (
        <mesh position={[0.5, 0, 0.5]} rotation={[0, 0, 0.3]}>
          <planeGeometry args={[0.8, 3]} />
          <meshBasicMaterial color="#ffffcc" transparent opacity={0.03} side={2} />
        </mesh>
      )}
    </group>
  );
}

/* ─── Reading chair ─── */
function ReadingChair() {
  return (
    <group position={[-3, 0, 1]} rotation={[0, 0.4, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#6a4a3a" roughness={0.85} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.7, -0.25]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.08]} />
        <meshStandardMaterial color="#6a4a3a" roughness={0.85} />
      </mesh>
      {/* Cushion */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#aa7755" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ─── Wooden desk with camera ─── */
function WoodenDesk({ onClickCamera }: { onClickCamera: () => void }) {
  return (
    <group position={[0, 0, -2.5]}>
      {/* Desk top */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 0.8]} />
        <meshStandardMaterial color="#7a5a40" roughness={0.75} />
      </mesh>
      {/* Legs */}
      {[[-0.8, 0.4, -0.3], [0.8, 0.4, -0.3], [-0.8, 0.4, 0.3], [0.8, 0.4, 0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.8} />
        </mesh>
      ))}
      {/* Vintage camera */}
      <group position={[0.3, 0.9, 0]} onClick={onClickCamera}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.12, 0.15]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0.08, 0.02, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Flash */}
        <mesh position={[-0.05, 0.07, 0]}>
          <boxGeometry args={[0.04, 0.03, 0.1]} />
          <meshStandardMaterial color="#ddd" roughness={0.2} metalness={0.1} />
        </mesh>
        <Html position={[0, 0.25, 0]} distanceFactor={4} style={{ pointerEvents: "none" }}>
          <div
            className="text-[11px] text-amber-200/90 serif italic whitespace-nowrap px-2 py-0.5 rounded"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              textShadow: "0 0 8px rgba(255,180,60,0.5)",
            }}
          >
            click to take a photo
          </div>
        </Html>
      </group>
      {/* Books stack */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.5, 0.85 + i * 0.04, 0]} castShadow>
          <boxGeometry args={[0.25, 0.03, 0.18]} />
          <meshStandardMaterial color={["#8a4444", "#44668a", "#557744"][i]} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Shelves with plants ─── */
function Shelves() {
  return (
    <>
      {/* Left wall shelves */}
      {[-1.8, -1.2].map((y, i) => (
        <group key={i} position={[-3.9, y, -1 + i * 1.5]}>
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[0.05, 0.4, 1]} />
            <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
          </mesh>
          {/* Small plant */}
          <group position={[0.1, 0.25, 0]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.05, 0.1, 6]} />
              <meshStandardMaterial color="#aa6644" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#4a7a4a" roughness={0.8} />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
}

/* ─── Main Scene ─── */
export function MemoryOfMemoriesScene({ phase, season, weather }: Props) {
  const [boothOpen, setBoothOpen] = useState(false);
  const [selectedStrip, setSelectedStrip] = useState<MemoryStrip | null>(null);
  const { strips } = useMemoryStrips();

  const isNight = phase === "night";
  const isDusk = phase === "dusk";

  const wallMessage = useMemo(() => {
    if (strips.length === 0) return null;
    const latest = new Date(strips[0].created_at);
    const daysSince = Math.floor((Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 7) return "It's been a while... Maybe we should make another memory.";
    if (daysSince <= 1) return "Yesterday was beautiful.";
    return null;
  }, [strips]);

  return (
    <group>
      <ambientLight intensity={isNight ? 0.06 : isDusk ? 0.1 : 0.15} />

      {/* Floor — wooden planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#6a5040" roughness={0.85} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -3]} receiveShadow>
        <planeGeometry args={[9, 4]} />
        <meshStandardMaterial color="#d4c8b8" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-4.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#ccc0b0" roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[4.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#ccc0b0" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#c8bca8" roughness={0.95} />
      </mesh>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#8a4444" roughness={0.9} />
      </mesh>

      {/* Furniture */}
      <WoodenDesk onClickCamera={() => setBoothOpen(true)} />
      <ReadingChair />
      <Shelves />
      <FairyLights />
      <Candles />
      <Curtains />
      <WindowLight phase={phase} />
      <DustParticles />
      <SeasonalAccents season={season} />

      {/* Ceiling light */}
      <pointLight
        position={[0, 3.2, 0]}
        intensity={isNight ? 0.4 : 0.15}
        color={isNight ? 0xffaa66 : 0xffeedd}
        distance={5}
        decay={2}
      />

      {/* Memory wall message */}
      {wallMessage && (
        <Html position={[0, 2.5, -2.9]} distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div
            className="max-w-[200px] text-center rounded-lg bg-amber-500/5 border border-amber-500/10 px-4 py-2 backdrop-blur-sm"
            style={{ animation: "fade-up 1s ease-out 1s both" }}
          >
            <p className="serif italic text-[11px] text-amber-200/40">{wallMessage}</p>
          </div>
        </Html>
      )}

      {/* ─── DOM Overlays ─── */}

      {/* Memory wall (pinned photos) */}
      <Html position={[0, 1.5, -2.95]} distanceFactor={4} style={{ pointerEvents: "none" }}>
        <div className="w-[500px] h-[300px] relative">
          <MemoryWall strips={strips.slice(0, 20)} onSelect={setSelectedStrip} />
        </div>
      </Html>

      {/* Idle message */}
      <IdleMessage />

      {/* Photo booth overlay */}
      {boothOpen && (
        <PhotoBooth
          onCapture={(strip) => setBoothOpen(false)}
          onClose={() => setBoothOpen(false)}
        />
      )}

      {/* Memory viewer */}
      <MemoryViewer strip={selectedStrip} onClose={() => setSelectedStrip(null)} />
    </group>
  );
}
