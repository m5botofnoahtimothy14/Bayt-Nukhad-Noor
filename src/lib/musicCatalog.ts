/* ═══════════════════════════════════════════════════════
   Music Catalog — songs for every scene in The Enchanted Nest
   ═══════════════════════════════════════════════════════ */

const M = (file: string) => `/music/${file}`;

/** All available songs */
export const SONGS = {
  moonlightSonata: M("Beethoven - Moonlight Sonata  Piano & Orchestra.mp3"),
  comptine: M("Andrea Vanzo - Amelie - Comptine dun autre ete, lapres-midi (reimagined) (Official Video).mp3"),
  canonInD: M("Canon in D (Pachelbel's Canon) - Cello & Piano [BEST WEDDING VERSION].mp3"),
  tumHiHo: M("tumhiho.mp3"),
  goodnessOfGod: M("Imagine 'Goodness Of God X Oceans' as a wedding entrance.mp3"),
  joTumMereHo: M("jotummereho.mp3"),
  riverFlowsInYou: M("Yiruma - River Flows in You.mp3"),
  kalHoNaaHo: M("kalhonaho.mp3"),
  myLoveMineAllMine: M("mylovemineallmine.mp3"),
  clairDeLune: M("Clair de Lune (Studio Version).mp3"),
  carryYouHome: M("Alex Warren - Carry You Home (Official Video).mp3"),
  nuvoleBianche: M("Ludovico Einaudi - Nuvole Bianche (Official Visualiser).mp3"),
  harleysInHawaii: M("harleysinhawaii.mp3"),
  kesariya: M("kesariya.mp3"),
  stargazing: M("stargazing.mp3"),
} as const;

export type SongKey = keyof typeof SONGS;

/** Scene music profiles — each scene gets up to 2 songs that loop/crossfade */
export type SceneMusicProfile = {
  songs: SongKey[];
  /** Crossfade duration between songs in ms */
  crossfadeMs: number;
  /** Base volume for this scene */
  volume: number;
  /** How long before first song starts (cinematic delay) */
  entryDelayMs: number;
};

/** Opening scene music — sacred, slow reveal */
export const OPENING_MUSIC: SceneMusicProfile = {
  songs: ["goodnessOfGod"],
  crossfadeMs: 4000,
  volume: 0.25,
  entryDelayMs: 2000,
};

/** Proposal scene music — emotional, cinematic */
export const PROPOSAL_MUSIC: {
  ambience: SongKey;
  piano: SongKey;
  climax: SongKey;
  volume: number;
} = {
  ambience: "myLoveMineAllMine",
  piano: "clairDeLune",
  climax: "kesariya",
  volume: 0.3,
};

/** Vinyl player tracks — piano/instrumental classics */
export const VINYL_TRACKS: { key: SongKey; title: string }[] = [
  { key: "moonlightSonata", title: "Moonlight Sonata" },
  { key: "clairDeLune", title: "Clair de Lune" },
  { key: "comptine", title: "Comptine d'un autre été" },
  { key: "riverFlowsInYou", title: "River Flows in You" },
  { key: "nuvoleBianche", title: "Nuvole Bianche" },
  { key: "canonInD", title: "Canon in D" },
];

/** Room scene music — 2 songs per room, crossfading */
export const SCENE_MUSIC: Record<string, SceneMusicProfile> = {
  house: {
    songs: ["joTumMereHo", "carryYouHome"],
    crossfadeMs: 5000,
    volume: 0.22,
    entryDelayMs: 1500,
  },
  kitchen: {
    songs: ["tumHiHo", "harleysInHawaii"],
    crossfadeMs: 4000,
    volume: 0.2,
    entryDelayMs: 1000,
  },
  dining: {
    songs: ["kalHoNaaHo", "canonInD"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 1500,
  },
  bedroom: {
    songs: ["riverFlowsInYou", "clairDeLune"],
    crossfadeMs: 7000,
    volume: 0.18,
    entryDelayMs: 2000,
  },
  garden: {
    songs: ["kesariya", "myLoveMineAllMine"],
    crossfadeMs: 5000,
    volume: 0.22,
    entryDelayMs: 1500,
  },
  balcony: {
    songs: ["stargazing", "nuvoleBianche"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
  observatory: {
    songs: ["stargazing", "myLoveMineAllMine"],
    crossfadeMs: 7000,
    volume: 0.18,
    entryDelayMs: 2500,
  },
  lake: {
    songs: ["clairDeLune", "riverFlowsInYou"],
    crossfadeMs: 7000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
  forest: {
    songs: ["moonlightSonata", "nuvoleBianche"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
  meadow: {
    songs: ["canonInD", "carryYouHome"],
    crossfadeMs: 5000,
    volume: 0.22,
    entryDelayMs: 1500,
  },
  "memory-of-memories": {
    songs: ["comptine", "riverFlowsInYou"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
};
