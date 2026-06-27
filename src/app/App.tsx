import { useEffect, useRef, useState } from "react";
import { HomeScreen } from "../components/HomeScreen";
import { ProgressDashboard } from "../components/ProgressDashboard";
import { SessionSummary } from "../components/SessionSummary";
import { StickerAlbum } from "../components/StickerAlbum";
import { TablePicker } from "../components/TablePicker";
import { QuestionCard } from "../components/QuestionCard";
import {
  buildSessionResult,
  finalizeSessionRewards,
  getStickerById,
} from "../domain/rewards";
import {
  createSessionConfig,
  generateQuestion,
  toQuestionHistoryItem,
} from "../domain/questionEngine";
import {
  isDifficultOperationFixed,
  recordOperationAnswer,
  resetAdventure,
  resetResults,
} from "../domain/progress";
import type {
  AppState,
  Factor,
  MascotMood,
  Question,
  QuestionHistoryItem,
  RewardGrant,
  SessionAnswer,
  SessionConfig,
  SessionMode,
  SessionResult,
} from "../domain/types";
import { loadAppState, saveAppState } from "../storage/localStore";

type Screen = "home" | "table-picker" | "session" | "summary" | "album" | "progress";

type FeedbackState = {
  wasCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
};

type ActiveSession = {
  config: SessionConfig;
  question: Question;
  history: QuestionHistoryItem[];
  answers: SessionAnswer[];
  sessionStars: number;
  feedback: FeedbackState | null;
};

type SummaryState = {
  config: SessionConfig;
  result: SessionResult;
  grant: RewardGrant;
};

const FEEDBACK_DELAY_MS = 700;

export function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [screen, setScreen] = useState<Screen>("home");
  const [pendingMode, setPendingMode] = useState<SessionMode>("random");
  const [draftTables, setDraftTables] = useState<Factor[]>(
    appState.settings.selectedTables,
  );
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [summary, setSummary] = useState<SummaryState | null>(null);
  const advanceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const latestStickerId = appState.rewards.stickersUnlocked.at(-1);
  const latestSticker = latestStickerId
    ? (getStickerById(latestStickerId) ?? null)
    : null;
  const mascotMood: MascotMood = session?.feedback
    ? session.feedback.wasCorrect
      ? "happy"
      : "encouraging"
    : screen === "summary"
      ? "celebrating"
      : screen === "session"
        ? "thinking"
        : "idle";

  function openTablePicker(mode: SessionMode): void {
    clearAdvanceTimer();
    setPendingMode(mode);
    setDraftTables(appState.settings.selectedTables);
    setScreen("table-picker");
  }

  function startSession(mode: SessionMode, selectedTables: Factor[]): void {
    clearAdvanceTimer();
    const config = createSessionConfig({
      mode,
      selectedTables,
      questionCount: 10,
    });
    const firstQuestion = generateQuestion(
      config,
      appState.progress.operationStats,
      [],
    );

    setAppState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        selectedTables,
      },
    }));
    setSession({
      config,
      question: firstQuestion,
      history: [],
      answers: [],
      sessionStars: 0,
      feedback: null,
    });
    setSummary(null);
    setScreen("session");
  }

  function handleAnswer(selectedAnswer: number): void {
    if (!session || session.feedback) return;

    const { question } = session;
    const wasCorrect = selectedAnswer === question.correctAnswer;
    const previousStats =
      appState.progress.operationStats[question.operation.key];
    const nextProgress = recordOperationAnswer(
      appState.progress,
      question.operation.key,
      wasCorrect,
    );
    const nextStats = nextProgress.operationStats[question.operation.key];
    const fixedDifficultOperation = nextStats
      ? isDifficultOperationFixed(previousStats, nextStats, wasCorrect)
      : false;
    const nextAnswer: SessionAnswer = {
      operation: question.operation,
      wasCorrect,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      fixedDifficultOperation,
    };
    const nextAnswers = [...session.answers, nextAnswer];
    const nextHistory = [...session.history, toQuestionHistoryItem(question)];
    const nextAppState = {
      ...appState,
      progress: nextProgress,
    };
    const feedback = {
      wasCorrect,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
    };
    const sessionWithFeedback = {
      ...session,
      answers: nextAnswers,
      history: nextHistory,
      sessionStars: session.sessionStars + (wasCorrect ? 1 : 0),
      feedback,
    };

    setAppState(nextAppState);
    setSession(sessionWithFeedback);

    advanceTimerRef.current = window.setTimeout(() => {
      if (nextAnswers.length >= session.config.questionCount) {
        const result = buildSessionResult(nextAnswers);
        const finalizedRewards = finalizeSessionRewards(
          nextAppState.rewards,
          nextAppState.progress,
          result,
        );
        const finalState = {
          ...nextAppState,
          rewards: finalizedRewards.rewards,
        };

        setAppState(finalState);
        setSummary({
          config: session.config,
          result,
          grant: finalizedRewards.grant,
        });
        setSession(null);
        setScreen("summary");
        return;
      }

      const nextQuestion = generateQuestion(
        session.config,
        nextProgress.operationStats,
        nextHistory,
      );

      setSession({
        ...sessionWithFeedback,
        question: nextQuestion,
        feedback: null,
      });
    }, FEEDBACK_DELAY_MS);
  }

  function clearAdvanceTimer(): void {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function handleResetResults(): void {
    clearAdvanceTimer();
    setAppState((current) => resetResults(current));
    setSession(null);
    setSummary(null);
  }

  function handleResetAdventure(): void {
    clearAdvanceTimer();
    const freshState = resetAdventure();

    setAppState(freshState);
    setDraftTables(freshState.settings.selectedTables);
    setSession(null);
    setSummary(null);
    setScreen("home");
  }

  return (
    <main
      className={`app-shell ${
        appState.settings.animationsEnabled ? "" : "reduce-motion"
      }`}
    >
      {screen === "home" && (
        <HomeScreen
          rewards={appState.rewards}
          selectedTables={appState.settings.selectedTables}
          latestSticker={latestSticker}
          mascotMood={mascotMood}
          onStartRandom={() => openTablePicker("random")}
          onStartTraining={() => openTablePicker("training")}
          onOpenAlbum={() => setScreen("album")}
          onOpenProgress={() => setScreen("progress")}
        />
      )}

      {screen === "album" && (
        <StickerAlbum
          rewards={appState.rewards}
          latestStickerId={latestStickerId ?? null}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "progress" && (
        <ProgressDashboard
          progress={appState.progress}
          onBack={() => setScreen("home")}
          onResetResults={handleResetResults}
          onResetAdventure={handleResetAdventure}
        />
      )}

      {screen === "table-picker" && (
        <TablePicker
          mode={pendingMode}
          selectedTables={draftTables}
          onChange={setDraftTables}
          onBack={() => setScreen("home")}
          onStart={() => startSession(pendingMode, draftTables)}
        />
      )}

      {screen === "session" && session && (
        <QuestionCard
          question={session.question}
          questionIndex={session.answers.length + 1}
          totalQuestions={session.config.questionCount}
          sessionStars={session.sessionStars}
          feedback={session.feedback}
          mascotMood={mascotMood}
          onAnswer={handleAnswer}
        />
      )}

      {screen === "summary" && summary && (
        <SessionSummary
          result={summary.result}
          grant={summary.grant}
          mascotMood={mascotMood}
          onReplay={() =>
            startSession(summary.config.mode, appState.settings.selectedTables)
          }
          onHome={() => setScreen("home")}
        />
      )}
    </main>
  );
}
