import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { HomeScreen } from "../components/HomeScreen";
import { ProgressDashboard } from "../components/ProgressDashboard";
import { SettingsScreen } from "../components/SettingsScreen";
import { SessionSummary } from "../components/SessionSummary";
import { StickerAlbum } from "../components/StickerAlbum";
import { TablePicker } from "../components/TablePicker";
import { QuestionCard } from "../components/QuestionCard";
import { playSoundEffect } from "../audio/soundEffects";
import {
  buildSessionResult,
  finalizeAbandonedSessionRewards,
  finalizeSessionRewards,
  getChallengeCardById,
  getStickerById,
  grantAnswerReward,
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
  ChallengeCard,
  ChoiceCount,
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
  const [pendingChoiceCount, setPendingChoiceCount] =
    useState<ChoiceCount>(4);
  const [draftTables, setDraftTables] = useState<Factor[]>(
    appState.settings.selectedTables,
  );
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [summary, setSummary] = useState<SummaryState | null>(null);
  const [quitDialogOpen, setQuitDialogOpen] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);

  useEffect(() => {
    setStorageUnavailable(!saveAppState(appState));
  }, [appState]);

  const advanceSession = useCallback((activeSession: ActiveSession, currentState: AppState): void => {
    if (activeSession.answers.length >= activeSession.config.questionCount) {
      const result = buildSessionResult(activeSession.answers);
      const finalizedRewards = finalizeSessionRewards(
        currentState.rewards,
        currentState.progress,
        result,
        undefined,
        { choiceCount: activeSession.config.choiceCount, answerStarsAlreadyGranted: true },
      );

      playSoundEffect(
        finalizedRewards.grant.stickerIds.length > 0 || finalizedRewards.grant.cardIds.length > 0 || finalizedRewards.grant.fairyCardIds.length > 0
          ? "sticker-unlock"
          : "session-complete",
        currentState.settings.soundEnabled,
      );
      setAppState({ ...currentState, rewards: finalizedRewards.rewards });
      setSummary({
        config: activeSession.config,
        result,
        grant: finalizedRewards.grant,
        status: "completed",
      });
      setSession(null);
      setQuitDialogOpen(false);
      setScreen("summary");
      return;
    }

    setSession({
      ...activeSession,
      question: generateQuestion(
        activeSession.config,
        currentState.progress.operationStats,
        activeSession.history,
      ),
      feedback: null,
    });
  }, []);

  useEffect(() => {
    if (screen !== "session" || !session?.feedback || quitDialogOpen) return;

    const timer = window.setTimeout(() => {
      advanceSession(session, appState);
    }, FEEDBACK_DELAY_MS);
    // Opening the quit dialog pauses feedback; continuing starts a fresh delay.
    return () => window.clearTimeout(timer);
  }, [screen, session, appState, quitDialogOpen, advanceSession]);

  const latestStickerId = appState.rewards.stickersUnlocked.at(-1);
  const latestSticker = latestStickerId
    ? (getStickerById(latestStickerId) ?? null)
    : null;
  const latestChallengeCardId =
    appState.rewards.challengeCardsUnlocked.at(-1);
  const latestChallengeCard: ChallengeCard | null = latestChallengeCardId
    ? (getChallengeCardById(latestChallengeCardId) ?? null)
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

  function openTablePicker(
    mode: SessionMode,
    choiceCount: ChoiceCount = 4,
  ): void {
    setPendingMode(mode);
    setPendingChoiceCount(choiceCount);
    setDraftTables(appState.settings.selectedTables);
    setScreen("table-picker");
  }

  function startSession(
    mode: SessionMode,
    selectedTables: Factor[],
    choiceCount: ChoiceCount,
  ): void {
    const config = createSessionConfig({
      mode,
      selectedTables,
      questionCount: 10,
      choiceCount,
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
    if (!session || session.feedback || quitDialogOpen) return;

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
      rewards: grantAnswerReward(appState.rewards, wasCorrect),
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
    playSoundEffect(
      wasCorrect ? "answer-correct" : "answer-encouraging",
      appState.settings.soundEnabled,
    );

  }

  function requestQuitSession(): void {
    setQuitDialogOpen(true);
  }

  function continueSession(): void {
    setQuitDialogOpen(false);
  }

  function abandonSession(): void {
    if (!session) return;

    setQuitDialogOpen(false);

    if (session.answers.length >= session.config.questionCount) {
      advanceSession(session, appState);
      return;
    }

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
      { answerStarsAlreadyGranted: true },
    );

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
    setAppState((current) => resetResults(current));
    setSession(null);
    setSummary(null);
    setQuitDialogOpen(false);
  }

  function handleResetAdventure(): void {
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
      {storageUnavailable && (
        <p className="storage-status" role="status" aria-live="polite">
          La progression reste disponible maintenant, mais elle ne peut pas être
          enregistrée sur cet appareil pour le moment.
        </p>
      )}

      {screen === "home" && (
        <HomeScreen
          rewards={appState.rewards}
          selectedTables={appState.settings.selectedTables}
          latestSticker={latestSticker}
          latestChallengeCard={latestChallengeCard}
          mascotMood={mascotMood}
          animationsEnabled={appState.settings.animationsEnabled}
          onStartRandom={() => openTablePicker("random")}
          onStartTraining={() => openTablePicker("training")}
          onStartSixChoices={() => openTablePicker("random", 6)}
          onOpenAlbum={() => setScreen("album")}
          onOpenProgress={() => setScreen("progress")}
          onOpenSettings={() => setScreen("settings")}
        />
      )}

      {screen === "album" && (
        <StickerAlbum
          rewards={appState.rewards}
          latestStickerId={latestStickerId ?? null}
          onChooseCompanion={(familyId) => setAppState((current) => ({
            ...current,
            rewards: {
              ...current.rewards,
              fairyCollection: { ...current.rewards.fairyCollection, selectedFamilyId: familyId },
            },
          }))}
          animationsEnabled={appState.settings.animationsEnabled}
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
          choiceCount={pendingChoiceCount}
          selectedTables={draftTables}
          onChange={setDraftTables}
          onBack={() => setScreen("home")}
          onStart={() =>
            startSession(pendingMode, draftTables, pendingChoiceCount)
          }
        />
      )}

      {screen === "session" && session && (
        <QuestionCard
          question={session.question}
          questionIndex={
            session.feedback ? session.answers.length : session.answers.length + 1
          }
          totalQuestions={session.config.questionCount}
          sessionStars={session.sessionStars}
          feedback={session.feedback}
          mascotMood={mascotMood}
          animationsEnabled={appState.settings.animationsEnabled}
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
          animationsEnabled={appState.settings.animationsEnabled}
          onReplay={() =>
            startSession(
              summary.config.mode,
              appState.settings.selectedTables,
              summary.config.choiceCount,
            )
          }
          onHome={() => setScreen("home")}
          onOpenAlbum={() => setScreen("album")}
        />
      )}

      {quitDialogOpen && (
        <ConfirmDialog
          title="Arrêter la mission ?"
          description="Tes réponses déjà données seront gardées. Les cartes et stickers se gagnent quand les 10 questions sont terminées."
          cancelLabel="Continuer"
          confirmLabel="Arrêter"
          onCancel={continueSession}
          onConfirm={abandonSession}
        />
      )}
    </main>
  );
}
