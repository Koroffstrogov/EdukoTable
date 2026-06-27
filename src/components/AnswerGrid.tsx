import type { Question } from "../domain/types";

type FeedbackState = {
  wasCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
};

type AnswerGridProps = {
  question: Question;
  feedback: FeedbackState | null;
  onAnswer: (answer: number) => void;
};

export function AnswerGrid({ question, feedback, onAnswer }: AnswerGridProps) {
  return (
    <div className="answer-grid">
      {question.choices.map((choice) => {
        const isCorrectChoice = choice === question.correctAnswer;
        const wasSelected = choice === feedback?.selectedAnswer;
        const stateClass = feedback
          ? isCorrectChoice
            ? "is-correct"
            : wasSelected
              ? "is-wrong"
              : "is-muted"
          : "";

        return (
          <button
            className={`answer-button ${stateClass}`}
            type="button"
            key={choice}
            aria-label={`Réponse ${choice}`}
            disabled={feedback !== null}
            onClick={() => onAnswer(choice)}
          >
            <span className="answer-value">{choice}</span>
            {feedback && isCorrectChoice && (
              <span className="answer-caption">Bonne réponse</span>
            )}
            {feedback && wasSelected && !isCorrectChoice && (
              <span className="answer-caption">À revoir</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
