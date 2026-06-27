import { useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { HomeScreen } from "../components/HomeScreen";
import { ProgressDashboard } from "../components/ProgressDashboard";
import { SettingsScreen } from "../components/SettingsScreen";
import { SessionSummary } from "../components/SessionSummary";
import { StickerAlbum } from "../components/StickerAlbum";
import { TablePicker } from "../components/TablePicker";
import { QuestionCard } from "../components/QuestionCard";
import {
  buildSessionResult,
  finalizeAbandonedSessionRewards,
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
  SettingsState,
} from "../domain/types";
import { loadAppState, saveAppState } from "../storage/localStore";

type Screen =
  | "home"
  | "table-picker"
  | "session"
  | "summary"
  | "album"
  | "progress"
  | "settings";

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
  status: "completed" | "abandoned";
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
  const [quitDialogOpen, setQuitDialogOpen] = useState(false);
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
      ? summary?.status === "abandoned"
        ? "encouraging"
        : "celebrating"
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
    setQuitDialogOpen(false);
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
      advanceTimerRef.current = null;

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
          status: "completed",
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

  function requestQuitSession(): void {
    setQuitDialogOpen(true);
  }

  function continueSession(): void {
    setQuitDialogOpen(false);
  }

  function abandonSession(): void {
    if (!session) return;

    clearAdvanceTimer();
    setQuitDialogOpen(false);

    if (session.answers.length === 0) {
      setSession(null);
      setSummary(null);
      setScreen("home");
      return;
    }

    const result = buildSessionResult(session.answers);
    const finalizedRewards = finalizeAbandonedSessionRewards(
      appState.rewards,
      result,
    );

    setAppState((current) => ({
      ...current,
      rewards: finalizeAbandonedSessionRewards(current.rewards, result).rewards,
    }));
    setSummary({
      config: session.config,
      result,
      grant: finalizedRewards.grant,
      status: "abandoned",
    });
    setSession(null);
    setScreen("summary");
  }

  function handleResetResults(): void {
    clearAdvanceTimer();
    setAppState((current) => resetResults(current));
    setSession(null);
    setSummary(null);
    setQuitDialogOpen(false);
  }

  function handleResetAdventure(): void {
    clearAdvanceTimer();
    const freshState = resetAdventure();

    setAppState(freshState);
    setDraftTables(freshState.settings.selectedTables);
    setSession(null);
    setSummary(null);
    setQuitDialogOpen(false);
    setScreen("home");
  }

  function updateSettings(settings: SettingsState): void {
    setAppState((current) => ({
      ...current,
      settings,
    }));
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
          onOpenSettings={() => setScreen("settings")}
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

      {screen === "settings" && (
        <SettingsScreen
          settings={appState.settings}
          onChange={updateSettings}
          onBack={() => setScreen("home")}
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
          onQuit={requestQuitSession}
        />
      )}

      {screen === "summary" && summary && (
        <SessionSummary
          result={summary.result}
          grant={summary.grant}
          status={summary.status}
          totalQuestions={summary.config.questionCount}
          mascotMood={mascotMood}
          onReplay={() =>
            startSession(summary.config.mode, appState.settings.selectedTables)
          }
          onHome={() => setScreen("home")}
        />
      )}

      {quitDialogOpen && (
        <ConfirmDialog
          title="Arrêter la mission ?"
          description="Tes réponses déjà données seront gardées. Le sticker est gagné seulement quand les 10 questions sont terminées."
          cancelLabel="Continuer"
          confirmLabel="Arrêter"
          onCancel={continueSession}
          onConfirm={abandonSession}
        />
      )}
    </main>
  );
}
