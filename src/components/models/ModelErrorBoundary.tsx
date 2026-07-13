import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  url?: string;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Class-based error boundary that catches GLTF/model loading failures
 * inside the R3F canvas. Without this, a single broken model URL crashes
 * the entire 3D scene.
 */
export class ModelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn(
      `[ModelErrorBoundary] Model failed to load: ${this.props.url ?? "unknown"}`,
      error.message,
      info.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ModelFallback url={this.props.url} />;
    }
    return this.props.children;
  }
}

/**
 * Invisible placeholder so the scene keeps rendering even when
 * a model is missing. Zero visual footprint.
 */
function ModelFallback({ url }: { url?: string }) {
  return (
    <mesh visible={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
}

/**
 * Scene-level error boundary. Wraps an entire room scene so that
 * if anything inside throws (model loads, effect crashes, etc.),
 * the canvas stays alive and shows a graceful fallback instead
 * of a white screen.
 */
export class SceneErrorBoundary extends Component<
  { children: ReactNode; sceneName: string },
  State
> {
  constructor(props: { children: ReactNode; sceneName: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[SceneErrorBoundary] Scene "${this.props.sceneName}" crashed:`,
      error.message,
      info.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          <ambientLight intensity={0.15} />
          <mesh position={[0, 1, -2]}>
            <boxGeometry args={[2, 1.5, 0.1]} />
            <meshStandardMaterial color="#2a1f2e" roughness={0.8} />
          </mesh>
        </group>
      );
    }
    return this.props.children;
  }
}
