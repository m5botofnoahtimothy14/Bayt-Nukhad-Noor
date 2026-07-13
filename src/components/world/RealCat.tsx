import { useEffect, useMemo, useRef, useState } from "react";
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

type Mood = "idle" | "loafing" | "sleeping" | "loved";

const LOCATION_MOODS: Record<string, Mood[]> = {
  house: ["loafing", "idle", "loafing"],
  garden: ["idle", "loafing", "loafing"],
  balcony: ["idle", "loafing", "idle"],
  observatory: ["idle", "loafing", "sleeping"],
  lake: ["idle", "loafing", "sleeping"],
  forest: ["idle", "loafing", "sleeping"],
  meadow: ["idle", "loafing", "sleeping"],
  kitchen: ["idle", "loafing", "idle"],
  dining: ["idle", "loafing", "idle"],
  bedroom: ["sleeping", "loafing", "idle"],
};

const CAT_GLTf_PATH = "/gltf/cat/scene.gltf";

function nextMood(location: string, moods?: Mood[]): Mood {
  const list = moods && moods.length ? moods : LOCATION_MOODS[location] ?? ["idle"];
  return list[Math.floor(Math.random() * list.length)];
}

export function RealCat({ location, phase, season, weather }: Props) {
  const doorOpened = useMemo(() => isDoorOpened(), [phase]);

  const { scene, animations } = useGLTF(CAT_GLTf_PATH) as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  const root = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});

  const [catName, setCatName] = useState(getStoredCatName);
  const [nameInput, setNameInput] = useState(catName);
  const [editingName, setEditingName] = useState(false);
  const [mood, setMood] = useState<Mood>("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [sleeping, setSleeping] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [pos, setPos] = useState({ x: 0.7, y: 0.75 });
  const [tailPhase, setTailPhase] = useState(0);

  // Clone the GLTF scene so we can safely attach animations.
  const catScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    // doorOpened gates ability to start name editing.
    if (!doorOpened && editingName) setEditingName(false);
  }, [doorOpened, editingName]);

  useEffect(() => {
    const wantsSleep = phase === "night";
    if (wantsSleep) {
      const shouldSleep = Math.random() > 0.4;
      setSleeping(shouldSleep);
      if (shouldSleep) setMood("sleeping");
    } else {
      setSleeping(false);
    }
  }, [phase, location]);

  useEffect(() => {
    // Initialize mixer+actions once.
    if (!root.current) return;

    const mixer = new THREE.AnimationMixer(root.current);
    mixerRef.current = mixer;

    // Many GLTFs use action names; we attempt common ones.
    const clips = animations ?? [];
    const desired = ["Idle", "loaf", "Loaf", "Sleep", "sleep", "Loved", "love", "Pet"];

    const actions: Record<string, THREE.AnimationAction> = {};
    clips.forEach((clip) => {
      const name = clip.name;
      const lower = name.toLowerCase();
      const key = desired.find((d) => lower.includes(String(d).toLowerCase())) ?? name;
      actions[key] = mixer.clipAction(clip, root.current!);
    });

    // Fallback: if no named clips, mixer will still advance but we can't switch.
    actionsRef.current = actions;

    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [animations]);

  const setAction = (m: Mood) => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    const actions = actionsRef.current;
    const keys = {
      idle: ["Idle", "idle"],
      loafing: ["Loaf", "loaf"],
      sleeping: ["Sleep", "sleep"],
      loved: ["Loved", "love", "Pet"],
    }[m];

    const all = Object.values(actions);
    all.forEach((a) => {
      a.fadeOut(0.15);
    });

    let picked: THREE.AnimationAction | undefined;
    for (const k of keys) {
      // exact match or substring match
      picked = actions[k] ?? Object.entries(actions).find(([ak]) => ak.toLowerCase().includes(k.toLowerCase()))?.[1];
      if (picked) break;
    }

    if (picked) {
      picked.reset();
      picked.fadeIn(0.2);
      picked.play();
    }
  };

  useEffect(() => {
    if (mood === "sleeping") setAction("sleeping");
    else if (mood === "loved") setAction("loved");
    else if (mood === "loafing") setAction("loafing");
    else setAction("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  useEffect(() => {
    const wander = () => {
      const nx = 0.12 + Math.random() * 0.76;
      const ny = 0.55 + Math.random() * 0.35;
      setFacing(nx > pos.x ? 1 : -1);
      setPos({ x: nx, y: ny });
      setMood(nextMood(location));
      setTailPhase((p) => p + 1);
      if (phase === "night" && Math.random() > 0.5) {
        setSleeping(true);
        setMood("sleeping");
      }
    };

    const t = setTimeout(wander, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, phase]);

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
    setMood("loved");
    setSleeping(false);
    setTimeout(() => setMsg(null), 2800);

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

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);

    if (!root.current) return;

    // lightweight idle motion (loaf/sleep tilt)
    const t = performance.now() / 1000;
    const sway = mood === "sleeping" ? 0 : 0.08;
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, facing * sway * Math.sin(t * 0.9), 0.1);
  });

  // Keep a DOM overlay for name/editor and mood label; GLTF handles the cat model itself.
  // Placement uses the old 2D coordinates mapped into an orthographic-ish feel.
  const worldX = (pos.x - 0.5) * 6;
  const worldY = (pos.y - 0.5) * 3;

  return (
    <group ref={root} position={[worldX, worldY, 0]}>
      {/* Cat clickable mesh proxy: use a simple box if the GLTF has no pointer events */}
      <primitive object={catScene} />

      {/* Interaction capture: R3F pointer events */}
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
        <boxGeometry args={[1.0, 0.8, 1.0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Name editor overlay */}
      {editingName && (
        <HtmlLabel
          facing={facing}
          onSave={saveName}
          nameInput={nameInput}
          setNameInput={setNameInput}
          onCancel={() => setEditingName(false)}
        />
      )}

      {/* Name tag */}
      {!editingName && (
        <HtmlTag
          facing={facing}
          text={`${catName} · ${sleeping ? "sleeping" : mood}`}
          hidden={false}
        />
      )}

      {/* Speech bubble */}
      {msg && <HtmlBubble facing={facing} text={msg} />}

      {/* Summer/winter particles not implemented in GLTF phase; keep existing visuals later if needed */}
    </group>
  );
}

function HtmlTag({ text, facing, hidden }: { text: string; facing: 1 | -1; hidden: boolean }) {
  return (
    <Html
      position={[0, 1.0, 0]}
      center
      distanceFactor={5}
      style={{ pointerEvents: "none", transform: `scaleX(${facing})` }}
    >
      <div
        className={`whitespace-nowrap rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 text-[10px] text-white/70 backdrop-blur-sm transition-opacity duration-300 serif ${hidden ? "opacity-0" : "opacity-100"}`}
      >
        {text}
      </div>
    </Html>
  );
}

function HtmlBubble({ facing, text }: { facing: 1 | -1; text: string }) {
  return (
    <Html
      position={[0, 1.4, 0]}
      center
      distanceFactor={5}
      style={{ pointerEvents: "none", transform: `scaleX(${facing})` }}
    >
      <div className="animate-[fade-up_0.3s_ease-out_both] whitespace-nowrap rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] text-white/80 shadow-lg backdrop-blur-md serif italic">
        {text}
      </div>
    </Html>
  );
}

function HtmlLabel({
  facing,
  onSave,
  nameInput,
  setNameInput,
  onCancel,
}: {
  facing: 1 | -1;
  onSave: () => void;
  nameInput: string;
  setNameInput: (v: string) => void;
  onCancel: () => void;
}) {
  return (
    <Html
      position={[0, 1.2, 0]}
      center
      distanceFactor={5}
      style={{ pointerEvents: "auto", transform: `scaleX(${facing})` }}
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

