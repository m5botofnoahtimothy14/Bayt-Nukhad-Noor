import { useEffect, useState } from "react";

export type Season = "spring" | "summer" | "autumn" | "winter";

const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

function seasonFor(d: Date): Season {
  const m = d.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

export function useSeason() {
  const [season, setSeason] = useState<Season>(() => seasonFor(new Date()));
  useEffect(() => {
    const t = setInterval(() => setSeason(seasonFor(new Date())), 60_000);
    return () => clearInterval(t);
  }, []);
  return season;
}

export function nextSeason(current: Season): Season {
  const i = SEASON_ORDER.indexOf(current);
  return SEASON_ORDER[(i + 1) % 4];
}

export const SEASON_PALETTE: Record<
  Season,
  {
    grass: string;
    grassLight: string;
    treeFoliage: string;
    flowerAccent: string;
    skyTint: string;
    leafColor: string;
    label: string;
  }
> = {
  spring: {
    grass: "oklch(0.55 0.14 145)",
    grassLight: "oklch(0.65 0.15 140)",
    treeFoliage: "oklch(0.50 0.13 150)",
    flowerAccent: "oklch(0.78 0.16 350)",
    skyTint: "oklch(0.82 0.08 230 / 10%)",
    leafColor: "oklch(0.60 0.15 145)",
    label: "Spring",
  },
  summer: {
    grass: "oklch(0.48 0.12 148)",
    grassLight: "oklch(0.58 0.13 142)",
    treeFoliage: "oklch(0.42 0.12 155)",
    flowerAccent: "oklch(0.82 0.14 55)",
    skyTint: "oklch(0.85 0.06 230 / 8%)",
    leafColor: "oklch(0.45 0.14 152)",
    label: "Summer",
  },
  autumn: {
    grass: "oklch(0.50 0.10 80)",
    grassLight: "oklch(0.58 0.12 65)",
    treeFoliage: "oklch(0.45 0.12 55)",
    flowerAccent: "oklch(0.70 0.16 25)",
    skyTint: "oklch(0.80 0.08 55 / 8%)",
    leafColor: "oklch(0.55 0.15 40)",
    label: "Autumn",
  },
  winter: {
    grass: "oklch(0.38 0.05 180)",
    grassLight: "oklch(0.50 0.04 200)",
    treeFoliage: "oklch(0.30 0.04 200)",
    flowerAccent: "oklch(0.85 0.03 240)",
    skyTint: "oklch(0.80 0.04 240 / 10%)",
    leafColor: "oklch(0.25 0.03 200)",
    label: "Winter",
  },
};
