import { useCallback, useEffect, useRef, useState } from "react";

export type Weather =
  "clear" | "cloudy" | "rain" | "heavy-rain" | "fog" | "snow" | "storm" | "mist";

export type WeatherState = {
  current: Weather;
  intensity: number; // 0-1
  windSpeed: number; // 0-1
};

const WEATHER_CYCLE_MS = 15 * 60 * 1000; // 15 minutes per change

function randomWeather(): Weather {
  const roll = Math.random();
  if (roll < 0.35) return "clear";
  if (roll < 0.55) return "cloudy";
  if (roll < 0.7) return "mist";
  if (roll < 0.82) return "rain";
  if (roll < 0.88) return "fog";
  if (roll < 0.93) return "heavy-rain";
  if (roll < 0.97) return "snow";
  return "storm";
}

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>(() => ({
    current: randomWeather(),
    intensity: 0.3 + Math.random() * 0.7,
    windSpeed: Math.random() * 0.6,
  }));
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      setState({
        current: randomWeather(),
        intensity: 0.3 + Math.random() * 0.7,
        windSpeed: Math.random() * 0.6,
      });
    }, WEATHER_CYCLE_MS);
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  const setWeather = useCallback((w: Weather) => {
    setState((prev) => ({ ...prev, current: w }));
  }, []);

  // Attach setter for programmatic use
  return { ...state, setWeather } as WeatherState & { setWeather: (w: Weather) => void };
}

export const WEATHER_OVERLAYS: Record<Weather, { opacity: number; label: string }> = {
  clear: { opacity: 0, label: "Clear" },
  cloudy: { opacity: 0.08, label: "Cloudy" },
  mist: { opacity: 0.12, label: "Mist" },
  fog: { opacity: 0.18, label: "Fog" },
  rain: { opacity: 0.15, label: "Rain" },
  "heavy-rain": { opacity: 0.25, label: "Heavy Rain" },
  snow: { opacity: 0.12, label: "Snow" },
  storm: { opacity: 0.3, label: "Storm" },
};
