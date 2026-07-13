import { lazy } from "react";

export const LazyLivingRoomScene = lazy(() =>
  import("@/components/scenes/LivingRoomScene").then((m) => ({ default: m.LivingRoomScene })),
);
export const LazyKitchenScene = lazy(() =>
  import("@/components/scenes/KitchenScene").then((m) => ({ default: m.KitchenScene })),
);
export const LazyDiningScene = lazy(() =>
  import("@/components/scenes/DiningScene").then((m) => ({ default: m.DiningScene })),
);
export const LazyBedroomScene = lazy(() =>
  import("@/components/scenes/BedroomScene").then((m) => ({ default: m.BedroomScene })),
);
export const LazyGardenScene = lazy(() =>
  import("@/components/scenes/GardenScene").then((m) => ({ default: m.GardenScene })),
);
export const LazyBalconyScene = lazy(() =>
  import("@/components/scenes/BalconyScene").then((m) => ({ default: m.BalconyScene })),
);
export const LazyObservatoryScene = lazy(() =>
  import("@/components/scenes/ObservatoryScene").then((m) => ({ default: m.ObservatoryScene })),
);
export const LazyLakeScene = lazy(() =>
  import("@/components/scenes/LakeScene").then((m) => ({ default: m.LakeScene })),
);
export const LazyForestScene = lazy(() =>
  import("@/components/scenes/ForestScene").then((m) => ({ default: m.ForestScene })),
);
export const LazyMeadowScene = lazy(() =>
  import("@/components/scenes/MeadowScene").then((m) => ({ default: m.MeadowScene })),
);
export const LazyMemoryOfMemoriesScene = lazy(() =>
  import("@/components/scenes/MemoryOfMemoriesScene").then((m) => ({ default: m.MemoryOfMemoriesScene })),
);
