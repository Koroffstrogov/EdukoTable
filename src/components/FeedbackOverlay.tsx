import type { Operation } from "../domain/types";

type FeedbackOverlayProps = {
  operation: Operation;
  wasCorrect: boolean;
  correctAnswer: number;
};

export function FeedbackOverlay({
  operation,
  wasCorrect,
  correctAnswer,
}: FeedbackOverlayProps) {
  return (
    <div className={`feedback ${wasCorrect ? "is-happy" : "is-soft"}`} aria-live="polite">
      <strong>{wasCorrect ? "Bravo !" : "Presque !"}</strong>
      <span>
        {operation.a} x {operation.b} = {correctAnswer}
      </span>
      <span>{wasCorrect ? "+1 etoile" : "On la reverra bientot."}</span>
    </div>
  );
}
