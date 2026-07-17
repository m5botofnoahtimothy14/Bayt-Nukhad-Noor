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

/** Opening scene music — sacred entrance, crossfades from Goodness Of God into Canon in D */
export const OPENING_MUSIC: SceneMusicProfile = {
  songs: ["goodnessOfGod", "canonInD"],
  crossfadeMs: 5000,
  volume: 0.25,
  entryDelayMs: 2000,
};

/** Proposal scene music — emotional, cinematic, multi-phase */
export const PROPOSAL_MUSIC: {
  ambience: SongKey;
  piano: SongKey;
  strings: SongKey;
  reading: SongKey;
  emotional: SongKey;
  climax: SongKey;
  volume: number;
} = {
  ambience: "myLoveMineAllMine",
  piano: "clairDeLune",
  strings: "canonInD",
  reading: "myLoveMineAllMine",
  emotional: "joTumMereHo",
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

/** Room scene music — multiple songs per room, continuous crossfade shuffle */
export const SCENE_MUSIC: Record<string, SceneMusicProfile> = {
  house: {
    songs: ["joTumMereHo", "carryYouHome", "myLoveMineAllMine", "stargazing"],
    crossfadeMs: 5000,
    volume: 0.22,
    entryDelayMs: 1500,
  },
  kitchen: {
    songs: ["tumHiHo", "harleysInHawaii", "joTumMereHo", "stargazing"],
    crossfadeMs: 4000,
    volume: 0.2,
    entryDelayMs: 1000,
  },
  dining: {
    songs: ["kalHoNaaHo", "canonInD", "comptine", "nuvoleBianche"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 1500,
  },
  bedroom: {
    songs: ["riverFlowsInYou", "clairDeLune", "nuvoleBianche", "moonlightSonata"],
    crossfadeMs: 7000,
    volume: 0.18,
    entryDelayMs: 2000,
  },
  garden: {
    songs: ["kesariya", "myLoveMineAllMine", "carryYouHome", "joTumMereHo"],
    crossfadeMs: 5000,
    volume: 0.22,
    entryDelayMs: 1500,
  },
  balcony: {
    songs: ["stargazing", "nuvoleBianche", "riverFlowsInYou", "clairDeLune"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
  observatory: {
    songs: ["stargazing", "myLoveMineAllMine", "moonlightSonata", "nuvoleBianche"],
    crossfadeMs: 7000,
    volume: 0.18,
    entryDelayMs: 2500,
  },
  lake: {
    songs: ["clairDeLune", "riverFlowsInYou", "comptine", "nuvoleBianche"],
    crossfadeMs: 7000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
  forest: {
    songs: ["moonlightSonata", "nuvoleBianche", "riverFlowsInYou", "comptine"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
  meadow: {
    songs: ["canonInD", "carryYouHome", "myLoveMineAllMine", "joTumMereHo"],
    crossfadeMs: 5000,
    volume: 0.22,
    entryDelayMs: 1500,
  },
  memories: {
    songs: ["comptine", "riverFlowsInYou", "clairDeLune", "nuvoleBianche"],
    crossfadeMs: 6000,
    volume: 0.2,
    entryDelayMs: 2000,
  },
  /* ── Family Chapter — per-chamber music profiles ── */
  "family-atrium": {
    songs: ["riverFlowsInYou", "carryYouHome", "myLoveMineAllMine", "stargazing"],
    crossfadeMs: 6000,
    volume: 0.20,
    entryDelayMs: 800,
  },
  "family-dreams": {
    songs: ["stargazing", "nuvoleBianche", "myLoveMineAllMine", "riverFlowsInYou"],
    crossfadeMs: 7000,
    volume: 0.18,
    entryDelayMs: 1200,
  },
  "family-little-family": {
    songs: ["harleysInHawaii", "comptine", "myLoveMineAllMine", "carryYouHome"],
    crossfadeMs: 5000,
    volume: 0.20,
    entryDelayMs: 800,
  },
  "family-bucket-list": {
    songs: ["joTumMereHo", "kesariya", "carryYouHome", "stargazing"],
    crossfadeMs: 6000,
    volume: 0.22,
    entryDelayMs: 1000,
  },
  "family-memory-booth": {
    songs: ["clairDeLune", "riverFlowsInYou", "comptine", "nuvoleBianche"],
    crossfadeMs: 7000,
    volume: 0.18,
    entryDelayMs: 1200,
  },
  "family-hidden-surprise": {
    songs: ["nuvoleBianche", "moonlightSonata", "stargazing", "clairDeLune"],
    crossfadeMs: 8000,
    volume: 0.16,
    entryDelayMs: 1500,
  },
  "family-reserved-home": {
    songs: ["carryYouHome", "myLoveMineAllMine", "riverFlowsInYou", "joTumMereHo"],
    crossfadeMs: 7000,
    volume: 0.18,
    entryDelayMs: 1000,
  },
  "family-observatory": {
    songs: ["stargazing", "moonlightSonata", "nuvoleBianche", "clairDeLune"],
    crossfadeMs: 8000,
    volume: 0.15,
    entryDelayMs: 1500,
  },
};
