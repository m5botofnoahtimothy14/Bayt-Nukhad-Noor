import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "@/integrations/supabase/client";

const CAT_NAME_KEY = "bayt-cat-name";
const DOOR_OPENED_KEY = "bayt-door-opened";

function getStoredCatName(): string {
  try {
    return localStorage.getItem(CAT_NAME_KEY) || "Mochi";
  } catch {
    return "Mochi";
  }
}

function saveCatName(name: string) {
  try {
    localStorage.setItem(CAT_NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

function isDoorOpened(): boolean {
  try {
    return localStorage.getItem(DOOR_OPENED_KEY) === "true";
  } catch {
    return false;
  }
}

type Props = {
  location: string;
  phase?: string;
  season?: string;
  weather?: string;
};

type CatBehavior =
  | "idle"
  | "walking"
  | "sitting"
  | "sleeping"
  | "grooming"
  | "stretching"
  | "loved";

const CAT_GLTf_PATH = "/gltf/cat/scene.gltf";

/* ─── Smooth position helper ─── */
function lerpVec3(current: THREE.Vector3, target: THREE.Vector3, t: number) {
  current.lerp(target, t);
}

/* ─── Cat body parts for procedural animation ─── */
function CatTail({ color = "#e8a040" }: { color?: string }) {
  const segments = 6;
  const refs = useRef<THREE.Group[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((seg, i) => {
      if (!seg) return;
      const wave = Math.sin(t * 2.5 + i * 0.7) * 0.18 * (i / segments);
      const curl = Math.sin(t * 0.8) * 0.05;
      seg.rotation.z = wave + curl;
      seg.rotation.x = Math.sin(t * 1.5 + i * 0.5) * 0.06 * (i / segments);
    });
  });

  return (
    <group position={[0, 0.22, -0.25]}>
      {Array.from({ length: segments }).map((_, i) => (
        <group
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          position={[0, 0.02, -i * 0.04]}
        >
          <mesh>
            <boxGeometry args={[0.03 - i * 0.003, 0.03 - i * 0.003, 0.045]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CatEar({ side, color = "#e8a040" }: { side: "left" | "right"; color?: string }) {
  const ref = useRef<THREE.Group>(null);
  const x = side === "left" ? -0.06 : 0.06;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Ears twitch occasionally
    const twitch = Math.sin(t * 8 + (side === "left" ? 0 : 2)) > 0.92 ? 0.15 : 0;
    ref.current.rotation.z = (side === "left" ? -0.3 : 0.3) + twitch * (side === "left" ? -1 : 1);
  });

  return (
    <group ref={ref} position={[x, 0.08, -0.02]}>
      <mesh rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.025, 0.05, 4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Inner ear */}
      <mesh position={[0, 0, 0.005]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.015, 0.035, 4]} />
        <meshStandardMaterial color="#f0b8a0" roughness={0.5} />
      </mesh>
    </group>
  );
}

function CatEyes({ looking = false }: { looking?: boolean }) {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Blink every ~4 seconds
    const blinkCycle = t % 4;
    const blinkScale = blinkCycle > 3.85 && blinkCycle < 3.95 ? 0.1 : 1;
    if (leftRef.current) leftRef.current.scale.y = blinkScale;
    if (rightRef.current) rightRef.current.scale.y = blinkScale;
  });

  return (
    <>
      <mesh ref={leftRef} position={[-0.035, 0.04, -0.065]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#2a6a2a" roughness={0.3} />
      </mesh>
      <mesh ref={rightRef} position={[0.035, 0.04, -0.065]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#2a6a2a" roughness={0.3} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.015, -0.07]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#e88080" roughness={0.4} />
      </mesh>
      {/* Mouth line */}
      <mesh position={[0, 0.005, -0.07]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.02, 0.002, 0.001]} />
        <meshStandardMaterial color="#c07060" roughness={0.5} />
      </mesh>
    </>
  );
}

function CatWhiskers() {
  return (
    <group position={[0, 0.01, -0.06]}>
      {/* Left whiskers */}
      {[-0.01, 0, 0.01].map((y, i) => (
        <mesh key={`l${i}`} position={[-0.04, y, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.06, 0.001, 0.001]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Right whiskers */}
      {[-0.01, 0, 0.01].map((y, i) => (
        <mesh key={`r${i}`} position={[0.04, y, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.06, 0.001, 0.001]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function RealCat({ location, phase, season, weather }: Props) {
  const doorOpened = useMemo(() => isDoorOpened(), [phase]);

  const { scene, animations } = useGLTF(CAT_GLTf_PATH) as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  const rootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});

  const [catName, setCatName] = useState(getStoredCatName);
  const [nameInput, setNameInput] = useState(catName);
  const [editingName, setEditingName] = useState(false);
  const [behavior, setBehavior] = useState<CatBehavior>("idle");
  const [msg, setMsg] = useState<string | null>(null);

  // Smooth movement state
  const currentPos = useRef(new THREE.Vector3(0.7, 0, 0.3));
  const targetPos = useRef(new THREE.Vector3(0.7, 0, 0.3));
  const currentLookAngle = useRef(0);
  const targetLookAngle = useRef(0);
  const isWalking = useRef(false);
  const walkSpeed = useRef(0.6);
  const bodyBob = useRef(0);

  // Behavior timer
  const behaviorTimer = useRef(0);
  const meowTimer = useRef(0);
  const nextMeow = useRef(8 + Math.random() * 15);
  const nextBehavior = useRef(3 + Math.random() * 5);

  // Meow state
  const [isMeowing, setIsMeowing] = useState(false);

  // Clone the GLTF scene — keep Cat01 only
  const catScene = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((child) => {
      const name = child.name || "";
      if (
        name.includes("Cat02") ||
        name.includes("Cat03") ||
        name.includes("pCube") ||
        name.includes("fat_cat_white1") ||
        name.includes("fat_cat_white2")
      ) {
        child.visible = false;
      }
    });
    return s;
  }, [scene]);

  useEffect(() => {
    if (!doorOpened && editingName) setEditingName(false);
  }, [doorOpened, editingName]);

  // Initialize animation mixer
  useEffect(() => {
    if (!rootRef.current) return;

    const mixer = new THREE.AnimationMixer(rootRef.current);
    mixerRef.current = mixer;

    const clips = animations ?? [];
    const actions: Record<string, THREE.AnimationAction> = {};
    clips.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip, rootRef.current!);
    });
    actionsRef.current = actions;

    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [animations]);

  const playAnimation = useCallback((name: string) => {
    const actions = actionsRef.current;
    const mixer = mixerRef.current;
    if (!mixer) return;

    // Fade out all current
    Object.values(actions).forEach((a) => a.fadeOut(0.3));

    // Find matching action
    const action = actions[name] ??
      Object.entries(actions).find(([k]) => k.toLowerCase().includes(name.toLowerCase()))?.[1];

    if (action) {
      action.reset();
      action.fadeIn(0.3);
      action.play();
    }
  }, []);

  // ─── WANDER: pick a new destination ───
  const wander = useCallback(() => {
    // Pick a random spot within the room bounds
    const nx = (Math.random() - 0.5) * 3;
    const nz = (Math.random() - 0.5) * 2;
    targetPos.current.set(nx, 0, nz);

    // Face the target direction
    const dx = targetPos.current.x - currentPos.current.x;
    const dz = targetPos.current.z - currentPos.current.z;
    targetLookAngle.current = Math.atan2(dx, dz);

    isWalking.current = true;
    walkSpeed.current = 0.4 + Math.random() * 0.4;
    setBehavior("walking");
  }, []);

  // ─── MEOW ───
  const meow = useCallback(() => {
    setIsMeowing(true);
    const lines = ["meow~", "mrrp?", "mew!", "*stretches*", "prrrrt~", "meow!", "nya~"];
    setMsg(lines[Math.floor(Math.random() * lines.length)]);
    setTimeout(() => setIsMeowing(false), 800);
    setTimeout(() => setMsg(null), 2500);
  }, []);

  // ─── MAIN UPDATE LOOP ───
  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
    if (!rootRef.current) return;

    const t = performance.now() / 1000;

    // Update behavior timer
    behaviorTimer.current += delta;
    meowTimer.current += delta;

    // ─── Periodic meow ───
    if (meowTimer.current > nextMeow.current && behavior !== "sleeping") {
      meowTimer.current = 0;
      nextMeow.current = 10 + Math.random() * 20;
      meow();
    }

    // ─── Periodic behavior change ───
    if (behaviorTimer.current > nextBehavior.current && !isWalking.current) {
      behaviorTimer.current = 0;
      nextBehavior.current = 4 + Math.random() * 8;

      const roll = Math.random();
      if (phase === "night" && roll > 0.3) {
        setBehavior("sleeping");
      } else if (roll < 0.3) {
        wander();
      } else if (roll < 0.5) {
        setBehavior("grooming");
      } else if (roll < 0.65) {
        setBehavior("stretching");
      } else {
        setBehavior("sitting");
      }
    }

    // ─── WALKING: smooth movement toward target ───
    if (isWalking.current) {
      const dist = currentPos.current.distanceTo(targetPos.current);

      if (dist < 0.05) {
        // Arrived
        isWalking.current = false;
        const roll = Math.random();
        if (roll < 0.4) setBehavior("sitting");
        else if (roll < 0.6) setBehavior("grooming");
        else setBehavior("idle");
      } else {
        // Move toward target
        const step = walkSpeed.current * delta;
        currentPos.current.lerp(targetPos.current, Math.min(step / dist, 0.08));

        // Smoothly rotate to face movement direction
        const dx = targetPos.current.x - currentPos.current.x;
        const dz = targetPos.current.z - currentPos.current.z;
        targetLookAngle.current = Math.atan2(dx, dz);
      }
    }

    // ─── APPLY POSITION ───
    rootRef.current.position.x = currentPos.current.x;
    rootRef.current.position.z = currentPos.current.z;

    // ─── SMOOTH ROTATION ───
    const angleDiff = targetLookAngle.current - currentLookAngle.current;
    // Normalize angle difference
    const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
    currentLookAngle.current += normalizedDiff * Math.min(delta * 5, 1);
    rootRef.current.rotation.y = currentLookAngle.current;

    // ─── BODY ANIMATIONS ───
    if (bodyRef.current) {
      if (isWalking.current) {
        // Walking bob
        bodyBob.current = Math.sin(t * 10) * 0.015;
        bodyRef.current.position.y = bodyBob.current;
        bodyRef.current.rotation.z = Math.sin(t * 5) * 0.03;
      } else {
        // Gentle idle breathing
        bodyRef.current.position.y = Math.sin(t * 1.5) * 0.003;
        bodyRef.current.rotation.z *= 0.95;

        if (behavior === "sleeping") {
          // Sleeping: body rests on ground, gentle breathing
          bodyRef.current.position.y = -0.02 + Math.sin(t * 0.8) * 0.005;
          bodyRef.current.rotation.x = Math.sin(t * 0.8) * 0.01;
        } else if (behavior === "grooming") {
          // Grooming: head down, body rocks
          bodyRef.current.rotation.x = Math.sin(t * 3) * 0.05;
        } else if (behavior === "stretching") {
          // Stretch: body extends
          bodyRef.current.rotation.x = Math.sin(t * 2) * 0.08;
          bodyRef.current.position.y = Math.sin(t * 2) * 0.01;
        }
      }
    }

    // ─── HEAD ANIMATION ───
    if (headRef.current) {
      if (isWalking.current) {
        // Walking head bob
        headRef.current.rotation.x = Math.sin(t * 10 + 1) * 0.04;
        headRef.current.rotation.z = Math.sin(t * 5) * 0.02;
      } else if (behavior === "sitting" || behavior === "idle") {
        // Look around occasionally
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.15;
        headRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
        headRef.current.rotation.z = 0;
      } else if (behavior === "sleeping") {
        // Head rests down
        headRef.current.rotation.x = 0.3;
        headRef.current.rotation.y = Math.sin(t * 0.3) * 0.02;
        headRef.current.rotation.z = 0;
      } else if (behavior === "grooming") {
        // Head bobs while grooming
        headRef.current.rotation.x = 0.4 + Math.sin(t * 4) * 0.1;
        headRef.current.rotation.z = Math.sin(t * 3) * 0.1;
      }
    }
  });

  const pet = async () => {
    if (editingName) return;

    const lines = [
      "*purrs softly*",
      "*blinks slowly at you*",
      "*head-bumps your hand*",
      "*rolls belly-up*",
      "*chirps happily*",
      "*flicks tail contentedly*",
      "*nuzzles your wrist*",
      "*stretches luxuriously*",
      "*closes eyes in bliss*",
      "*wiggles with joy*",
      `*${catName} loves you*`,
    ];

    setMsg(lines[Math.floor(Math.random() * lines.length)]);
    setBehavior("loved");
    meowTimer.current = 0;
    nextMeow.current = 3 + Math.random() * 5;
    setTimeout(() => setMsg(null), 2800);
    setTimeout(() => {
      if (behavior === "loved") setBehavior("idle");
    }, 3000);

    try {
      await supabase
        .from("cat_state")
        .update({
          mood: "loved",
          location,
          last_touched: new Date().toISOString(),
        })
        .eq("id", 1);
    } catch {
      /* ignore */
    }
  };

  const saveName = () => {
    if (!doorOpened) return;
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== catName) {
      setCatName(trimmed);
      saveCatName(trimmed);
      setMsg(`*${trimmed} is happy with the new name*`);
      setTimeout(() => setMsg(null), 2800);
    }
    setEditingName(false);
  };

  const behaviorLabel = isMeowing
    ? "meowing"
    : isWalking.current
      ? "walking"
      : behavior === "loved"
        ? "loved"
        : behavior;

  return (
    <group ref={rootRef} position={[0.7, 0, 0.3]}>
      {/* Cat body group — animated by useFrame */}
      <group ref={bodyRef}>
        {/* GLTF Cat model */}
        <group scale={0.01}>
          <primitive object={catScene} />
        </group>

        {/* Procedural head group */}
        <group ref={headRef} position={[0, 0.28, -0.08]}>
          <CatEar side="left" />
          <CatEar side="right" />
          <CatEyes />
          <CatWhiskers />
        </group>

        {/* Procedural tail */}
        <CatTail />
      </group>

      {/* Interaction hit area */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          pet();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (!doorOpened) return;
          setEditingName(true);
          setNameInput(catName);
        }}
      >
        <boxGeometry args={[0.5, 0.4, 0.6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Name editor */}
      {editingName && (
        <HtmlLabel
          onSave={saveName}
          nameInput={nameInput}
          setNameInput={setNameInput}
          onCancel={() => setEditingName(false)}
        />
      )}

      {/* Name tag */}
      {!editingName && (
        <HtmlTag text={`${catName} · ${behaviorLabel}`} />
      )}

      {/* Speech bubble */}
      {msg && <HtmlBubble text={msg} />}
    </group>
  );
}

function HtmlTag({ text }: { text: string }) {
  return (
    <Html
      position={[0, 0.5, 0]}
      center
      distanceFactor={5}
      style={{ pointerEvents: "none" }}
    >
      <div className="whitespace-nowrap rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 text-[10px] text-white/70 backdrop-blur-sm transition-opacity duration-300 serif">
        {text}
      </div>
    </Html>
  );
}

function HtmlBubble({ text }: { text: string }) {
  return (
    <Html
      position={[0, 0.7, 0]}
      center
      distanceFactor={5}
      style={{ pointerEvents: "none" }}
    >
      <div className="animate-[fade-up_0.3s_ease-out_both] whitespace-nowrap rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] text-white/80 shadow-lg backdrop-blur-md serif italic">
        {text}
      </div>
    </Html>
  );
}

function HtmlLabel({
  onSave,
  nameInput,
  setNameInput,
  onCancel,
}: {
  onSave: () => void;
  nameInput: string;
  setNameInput: (v: string) => void;
  onCancel: () => void;
}) {
  return (
    <Html
      position={[0, 0.6, 0]}
      center
      distanceFactor={5}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/60 px-2 py-1 shadow-lg backdrop-blur-md">
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") onCancel();
          }}
          className="w-24 bg-transparent text-[11px] text-white/90 outline-none placeholder:text-white/30 serif"
          placeholder="name..."
          autoFocus
        />
        <button
          onClick={onSave}
          className="rounded-full bg-primary/80 px-2 py-0.5 text-[9px] text-primary-foreground transition-colors hover:bg-primary"
        >
          ✓
        </button>
      </div>
    </Html>
  );
}
