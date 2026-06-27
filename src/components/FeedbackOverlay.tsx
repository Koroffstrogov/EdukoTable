import { EdukoAnimation } from "./EdukoAnimation";
import type { Operation } from "../domain/types";

type FeedbackOverlayProps = {
  operation: Operation;
  wasCorrect: boolean;
  correctAnswer: number;
  animationsEnabled: boolean;
};

export function FeedbackOverlay({
  operation,
  wasCorrect,
  correctAnswer,
  animationsEnabled,
}: FeedbackOverlayProps) {
  return (
    <div
      className={`feedback has-animation ${wasCorrect ? "is-happy" : "is-soft"}`}
      aria-live="polite"
    >
      <EdukoAnimation
        animationId={wasCorrect ? "star-pop" : "mascot-encouraging"}
        className="feedback-animation"
        enabled={animationsEnabled}
        fallback={
          <span className="feedback-animation-fallback">
            {wasCorrect ? "+1" : "..."}
          </span>
        }
      />
      <div className="feedback-copy">
        <strong>{wasCorrect ? "Bravo !" : "Presque !"}</strong>
        <span>
          {operation.a} × {operation.b} = {correctAnswer}
        </span>
        <span>{wasCorrect ? "+1 étoile" : "On la reverra bientôt."}</span>
      </div>
    </div>
  );
}
