import { AnswerGrid } from "./AnswerGrid";
import { FeedbackOverlay } from "./FeedbackOverlay";
import { Mascot } from "./Mascot";
import type { MascotMood, Question } from "../domain/types";

type FeedbackState = {
  wasCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
};

type QuestionCardProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  sessionStars: number;
  feedback: FeedbackState | null;
  mascotMood: MascotMood;
  onAnswer: (answer: number) => void;
};

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  sessionStars,
  feedback,
  mascotMood,
  onAnswer,
}: QuestionCardProps) {
  return (
    <section className="screen question-screen">
      <div className="question-top">
        <div>
          <p className="eyebrow">
            Question {questionIndex} / {totalQuestions}
          </p>
          <div className="star-meter" aria-label={`${sessionStars} étoiles`}>
            {Array.from({ length: totalQuestions }, (_, index) => (
              <span
                className={index < sessionStars ? "star is-filled" : "star"}
                key={index}
                aria-hidden="true"
              >
                {index < sessionStars ? "*" : "."}
              </span>
            ))}
          </div>
        </div>
        <Mascot mood={mascotMood} />
      </div>

      <div className="question-card">
        <p>Combien font ?</p>
        <strong className="operation">
          {question.operation.a} × {question.operation.b}
        </strong>
      </div>

      <AnswerGrid question={question} feedback={feedback} onAnswer={onAnswer} />

      {feedback && (
        <FeedbackOverlay
          operation={question.operation}
          wasCorrect={feedback.wasCorrect}
          correctAnswer={feedback.correctAnswer}
        />
      )}
    </section>
  );
}
