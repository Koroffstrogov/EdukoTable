import {
  Component,
  Suspense,
  lazy,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { getAnimationAsset } from "../assets/animations/registry";
import { getAnimationDefinition } from "../domain/animations";

const Lottie = lazy(() => import("lottie-react"));

type EdukoAnimationProps = {
  animationId: string;
  enabled: boolean;
  className?: string;
  fallback?: ReactNode;
  loop?: boolean;
};

type AnimationErrorBoundaryProps = {
  children: ReactNode;
};

type AnimationErrorBoundaryState = {
  hasError: boolean;
};

export function getAnimationState(
  enabled: boolean,
  prefersReducedMotion: boolean,
  animationData: Record<string, unknown> | null,
): "active" | "disabled" | "missing" | "reduced" {
  if (!animationData) return "missing";
  if (!enabled) return "disabled";
  if (prefersReducedMotion) return "reduced";
  return "active";
}

export function EdukoAnimation({
  animationId,
  enabled,
  className = "",
  fallback = null,
  loop,
}: EdukoAnimationProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const definition = getAnimationDefinition(animationId);
  const animationData = getAnimationAsset(animationId);
  const state = getAnimationState(enabled, prefersReducedMotion, animationData);
  const shouldAnimate = state === "active";

  return (
    <span
      className={`eduko-animation ${className}`}
      data-animation-id={animationId}
      data-animation-state={state}
      aria-hidden="true"
    >
      <span className="eduko-animation-fallback">{fallback}</span>
      {shouldAnimate && (
        <span className="eduko-animation-layer">
          <AnimationErrorBoundary>
            <Suspense fallback={null}>
              <Lottie
                animationData={animationData}
                autoplay
                loop={loop ?? definition?.loop ?? false}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            </Suspense>
          </AnimationErrorBoundary>
        </span>
      )}
    </span>
  );
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

class AnimationErrorBoundary extends Component<
  AnimationErrorBoundaryProps,
  AnimationErrorBoundaryState
> {
  state: AnimationErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AnimationErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // The static fallback remains visible under the animation layer.
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
