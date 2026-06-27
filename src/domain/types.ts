export const FACTORS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type Factor = (typeof FACTORS)[number];

export type Operation = {
  a: Factor;
  b: Factor;
  key: string;
  pairKey: string;
};

export type OperationResult = "correct" | "wrong";

export type OperationStats = {
  attempts: number;
  correct: number;
  wrong: number;
  lastResult?: OperationResult;
  lastAnsweredAt?: string;
};

export type OperationStatus =
  | "new"
  | "discovering"
  | "difficult"
  | "fragile"
  | "strong";

export type TableProgressSummary = {
  table: Factor;
  attempts: number;
  correct: number;
  wrong: number;
  successRate: number | null;
};

export type OperationProgressSummary = {
  operation: Operation;
  stats: OperationStats;
  successRate: number | null;
  status: OperationStatus;
};

export type ProgressState = {
  version: number;
  operationStats: Record<string, OperationStats>;
};

export type Sticker = {
  id: string;
  collectionId: string;
  label: string;
  symbol: string;
  rarity: "common" | "special";
};

export type Badge = {
  id: string;
  label: string;
  starBonus: number;
};

export type RewardState = {
  stars: number;
  totalStarsEarned: number;
  stickersUnlocked: string[];
  badgesUnlocked: string[];
  sessionsCompleted: number;
  practiceDates: string[];
  lastPracticeDate?: string;
  dailyMissionCompletions: Record<string, string[]>;
};

export type SettingsState = {
  selectedTables: Factor[];
  soundEnabled: boolean;
  animationsEnabled: boolean;
};

export type AppState = {
  version: number;
  progress: ProgressState;
  rewards: RewardState;
  settings: SettingsState;
};

export type SessionMode = "random" | "training" | "difficult";

export type SessionConfig = {
  mode: SessionMode;
  selectedTables: Factor[];
  questionCount: number;
};

export type Question = {
  operation: Operation;
  choices: number[];
  correctAnswer: number;
};

export type QuestionHistoryItem = {
  operationKey: string;
  pairKey: string;
  correctAnswer: number;
  choicesFingerprint: string;
  correctChoiceIndex: number;
};

export type SessionAnswer = {
  operation: Operation;
  wasCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
  fixedDifficultOperation: boolean;
};

export type SessionResult = {
  total: number;
  correctCount: number;
  wrongOperations: Operation[];
  fixedDifficultOperations: Operation[];
};

export type RewardGrant = {
  stars: number;
  stickerIds: string[];
  badgeIds: string[];
};

export type MascotMood =
  | "idle"
  | "thinking"
  | "happy"
  | "encouraging"
  | "celebrating";
