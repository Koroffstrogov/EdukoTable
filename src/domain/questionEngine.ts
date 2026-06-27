import { getOperationProduct } from "./operations";
import { buildOperationPool } from "./tableSelection";
import {
  FACTORS,
  type Operation,
  type OperationStats,
  type Question,
  type QuestionHistoryItem,
  type SessionConfig,
} from "./types";

export type RandomGenerator = () => number;

const DEFAULT_QUESTION_COUNT = 10;
const MAX_OPERATION_ATTEMPTS = 81;
const MAX_CHOICE_ATTEMPTS = 24;
const MIN_WRONG_CHOICES = 3;

export function createSessionConfig(
  config: Partial<SessionConfig> & Pick<SessionConfig, "mode" | "selectedTables">,
): SessionConfig {
  return {
    questionCount: DEFAULT_QUESTION_COUNT,
    ...config,
  };
}

export function getChoicesFingerprint(choices: number[]): string {
  return [...choices].sort((a, b) => a - b).join("|");
}

export function getTrainingWeight(stats?: OperationStats): number {
  if (!stats || stats.attempts === 0) return 4;

  const rate = stats.correct / stats.attempts;
  let weight = 1;

  if (stats.attempts < 3) weight += 2;

  if (rate < 0.6) weight += 5;
  else if (rate < 0.8) weight += 3;
  else if (rate < 0.95) weight += 1;

  if (stats.lastResult === "wrong") weight += 2;

  return weight;
}

export function pickRandomOperation(
  pool: Operation[],
  history: QuestionHistoryItem[],
  rng: RandomGenerator = Math.random,
): Operation {
  return pickOperationFromCandidates(pool, history, rng);
}

export function pickTrainingOperation(
  pool: Operation[],
  history: QuestionHistoryItem[],
  statsByKey: Record<string, OperationStats>,
  rng: RandomGenerator = Math.random,
): Operation {
  const candidates = getAntiRepeatCandidates(pool, history);
  return weightedRandomItem(
    candidates,
    (operation) => getTrainingWeight(statsByKey[operation.key]),
    rng,
  );
}

export function generateChoices(
  operation: Operation,
  history: QuestionHistoryItem[] = [],
  rng: RandomGenerator = Math.random,
): number[] {
  const correctAnswer = getOperationProduct(operation);
  const wrongChoices = pickWrongChoices(operation, rng);
  const recentIndexes = history.slice(-2).map((item) => item.correctChoiceIndex);
  const blockedIndex =
    recentIndexes.length === 2 && recentIndexes[0] === recentIndexes[1]
      ? recentIndexes[0]
      : null;
  const allowedIndexes = [0, 1, 2, 3].filter((index) => index !== blockedIndex);
  const correctChoiceIndex = randomItem(allowedIndexes, rng);
  const shuffledWrongChoices = shuffle(wrongChoices, rng);
  const choices: number[] = [];
  let wrongIndex = 0;

  for (let index = 0; index < 4; index += 1) {
    choices.push(
      index === correctChoiceIndex
        ? correctAnswer
        : shuffledWrongChoices[wrongIndex++],
    );
  }

  return choices;
}

export function generateQuestion(
  config: SessionConfig,
  statsByKey: Record<string, OperationStats>,
  history: QuestionHistoryItem[] = [],
  rng: RandomGenerator = Math.random,
): Question {
  const pool = buildOperationPool(config.selectedTables);
  const triedOperationKeys = new Set<string>();
  let fallbackQuestion: Question | null = null;
  const operationAttemptLimit = Math.min(pool.length, MAX_OPERATION_ATTEMPTS);

  for (
    let operationAttempt = 0;
    operationAttempt < operationAttemptLimit;
    operationAttempt += 1
  ) {
    const availablePool = pool.filter(
      (operation) => !triedOperationKeys.has(operation.key),
    );
    const operation = pickOperationForMode(
      availablePool.length > 0 ? availablePool : pool,
      config.mode,
      history,
      statsByKey,
      rng,
    );
    triedOperationKeys.add(operation.key);

    for (
      let choiceAttempt = 0;
      choiceAttempt < MAX_CHOICE_ATTEMPTS;
      choiceAttempt += 1
    ) {
      const choices = generateChoices(operation, history, rng);
      const question = {
        operation,
        choices,
        correctAnswer: getOperationProduct(operation),
      };

      if (!fallbackQuestion) {
        fallbackQuestion = question;
      }

      if (isAcceptableQuestion(question, history, pool.length)) {
        return question;
      }
    }
  }

  if (fallbackQuestion) return fallbackQuestion;

  const operation = pickOperationForMode(
    pool,
    config.mode,
    history,
    statsByKey,
    rng,
  );

  return {
    operation,
    choices: generateChoices(operation, history, rng),
    correctAnswer: getOperationProduct(operation),
  };
}

export function toQuestionHistoryItem(question: Question): QuestionHistoryItem {
  return {
    operationKey: question.operation.key,
    pairKey: question.operation.pairKey,
    correctAnswer: question.correctAnswer,
    choicesFingerprint: getChoicesFingerprint(question.choices),
    correctChoiceIndex: question.choices.indexOf(question.correctAnswer),
  };
}

function pickOperationForMode(
  pool: Operation[],
  mode: SessionConfig["mode"],
  history: QuestionHistoryItem[],
  statsByKey: Record<string, OperationStats>,
  rng: RandomGenerator,
): Operation {
  if (pool.length === 0) {
    throw new Error("Cannot generate a question without operations.");
  }

  if (mode === "training" || mode === "difficult") {
    const difficultPool =
      mode === "difficult"
        ? pool.filter((operation) => {
            const stats = statsByKey[operation.key];
            return stats && stats.attempts >= 3 && stats.correct / stats.attempts < 0.8;
          })
        : [];

    return pickTrainingOperation(
      difficultPool.length >= 4 ? difficultPool : pool,
      history,
      statsByKey,
      rng,
    );
  }

  return pickRandomOperation(pool, history, rng);
}

function pickOperationFromCandidates(
  pool: Operation[],
  history: QuestionHistoryItem[],
  rng: RandomGenerator,
): Operation {
  return randomItem(getAntiRepeatCandidates(pool, history), rng);
}

function getAntiRepeatCandidates(
  pool: Operation[],
  history: QuestionHistoryItem[],
): Operation[] {
  const last = history.at(-1);
  const recentKeys = new Set(history.slice(-3).map((item) => item.operationKey));
  const preferred = pool.filter((operation) => {
    if (recentKeys.has(operation.key)) return false;
    if (last && operation.pairKey === last.pairKey) return false;
    return true;
  });
  const preferredWithAnswerVariety = avoidCorrectAnswerRun(preferred, history);

  if (preferredWithAnswerVariety.length > 0) {
    return preferredWithAnswerVariety;
  }

  if (preferred.length > 0) {
    return preferred;
  }

  const notSameAsLast = pool.filter(
    (operation) => operation.key !== last?.operationKey,
  );
  const notSameWithAnswerVariety = avoidCorrectAnswerRun(notSameAsLast, history);

  if (notSameWithAnswerVariety.length > 0) {
    return notSameWithAnswerVariety;
  }

  if (notSameAsLast.length > 0) {
    return notSameAsLast;
  }

  return pool;
}

function avoidCorrectAnswerRun(
  pool: Operation[],
  history: QuestionHistoryItem[],
): Operation[] {
  const lastTwo = history.slice(-2);

  if (
    lastTwo.length < 2 ||
    lastTwo[0].correctAnswer !== lastTwo[1].correctAnswer
  ) {
    return pool;
  }

  const varied = pool.filter(
    (operation) => getOperationProduct(operation) !== lastTwo[0].correctAnswer,
  );

  return varied.length > 0 ? varied : pool;
}

function isAcceptableQuestion(
  question: Question,
  history: QuestionHistoryItem[],
  poolSize: number,
): boolean {
  const last = history.at(-1);
  const fingerprint = getChoicesFingerprint(question.choices);

  if (poolSize > 1 && question.operation.key === last?.operationKey) {
    return false;
  }

  if (poolSize > 1 && fingerprint === last?.choicesFingerprint) {
    return false;
  }

  return true;
}

function pickWrongChoices(
  operation: Operation,
  rng: RandomGenerator,
): number[] {
  const correctAnswer = getOperationProduct(operation);
  const candidates = buildDistractorCandidates(operation);
  const near = candidates.filter(
    (value) => Math.abs(value - correctAnswer) <= 10,
  );
  const medium = candidates.filter((value) => {
    const distance = Math.abs(value - correctAnswer);
    return distance > 10 && distance <= 25;
  });
  const far = candidates.filter((value) => Math.abs(value - correctAnswer) > 25);
  const selected: number[] = [];

  addRandomFromBucket(selected, near, rng);
  addRandomFromBucket(selected, medium, rng);
  addRandomFromBucket(selected, far, rng);

  const remaining = shuffle(candidates, rng).filter(
    (value) => !selected.includes(value),
  );

  while (selected.length < 3 && remaining.length > 0) {
    selected.push(remaining.shift() as number);
  }

  return selected.slice(0, 3);
}

function buildDistractorCandidates(operation: Operation): number[] {
  const { a, b } = operation;
  const correctAnswer = getOperationProduct(operation);
  const rawCandidates = new Map<number, number>();
  const addCandidate = (value: number, priority: number): void => {
    const currentPriority = rawCandidates.get(value);
    if (currentPriority === undefined || priority < currentPriority) {
      rawCandidates.set(value, priority);
    }
  };

  for (const factor of FACTORS) {
    addCandidate(a * factor, 0);
    addCandidate(factor * b, 0);
  }

  addCandidate(a * (b - 2), 0);
  addCandidate(a * (b - 1), 0);
  addCandidate(a * (b + 1), 0);
  addCandidate(a * (b + 2), 0);
  addCandidate((a - 2) * b, 0);
  addCandidate((a - 1) * b, 0);
  addCandidate((a + 1) * b, 0);
  addCandidate((a + 2) * b, 0);
  addCandidate(correctAnswer - a, 1);
  addCandidate(correctAnswer + a, 1);
  addCandidate(correctAnswer - b, 1);
  addCandidate(correctAnswer + b, 1);
  addCandidate(correctAnswer - 2 * a, 1);
  addCandidate(correctAnswer + 2 * a, 1);
  addCandidate(correctAnswer - 2 * b, 1);
  addCandidate(correctAnswer + 2 * b, 1);
  addCandidate(a + b, 2);

  for (const left of FACTORS) {
    for (const right of FACTORS) {
      const isNeighborProduct =
        Math.abs(left - a) <= 1 || Math.abs(right - b) <= 1;
      addCandidate(left * right, isNeighborProduct ? 2 : 3);
    }
  }

  const validCandidates = Array.from(rawCandidates.entries())
    .map(([value, priority]) => ({
      value,
      priority,
      distance: Math.abs(value - correctAnswer),
    }))
    .filter((candidate) => {
      return (
        Number.isInteger(candidate.value) &&
        candidate.value > 0 &&
        candidate.value <= 100 &&
        candidate.value !== correctAnswer
      );
    });
  const plausibleDistanceLimit = getPlausibleDistanceLimit(correctAnswer);
  const plausibleCandidates = validCandidates.filter(
    (candidate) => candidate.distance <= plausibleDistanceLimit,
  );
  const candidates =
    plausibleCandidates.length >= MIN_WRONG_CHOICES
      ? plausibleCandidates
      : validCandidates;

  return candidates
    .sort((left, right) => {
      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }

      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }

      return left.value - right.value;
    })
    .map((candidate) => candidate.value);
}

function getPlausibleDistanceLimit(correctAnswer: number): number {
  return Math.max(18, Math.min(36, Math.round(correctAnswer * 0.65)));
}

function addRandomFromBucket(
  selected: number[],
  bucket: number[],
  rng: RandomGenerator,
): void {
  const available = bucket.filter((value) => !selected.includes(value));
  if (available.length > 0) {
    selected.push(randomItem(available, rng));
  }
}

function randomItem<T>(items: T[], rng: RandomGenerator): T {
  if (items.length === 0) {
    throw new Error("Cannot pick a random item from an empty list.");
  }

  return items[Math.floor(rng() * items.length)];
}

function weightedRandomItem<T>(
  items: T[],
  getWeight: (item: T) => number,
  rng: RandomGenerator,
): T {
  const totalWeight = items.reduce((total, item) => total + getWeight(item), 0);
  let cursor = rng() * totalWeight;

  for (const item of items) {
    cursor -= getWeight(item);
    if (cursor <= 0) return item;
  }

  return items[items.length - 1];
}

function shuffle<T>(items: T[], rng: RandomGenerator): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}
