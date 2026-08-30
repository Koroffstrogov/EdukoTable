import type {
  ChallengeCard,
  ChallengeSixProgress,
  StickerRarity,
} from "./types";

export const CHALLENGE_CARD_COLLECTION_ID = "challenge-six";

export const CHALLENGE_CARDS: ChallengeCard[] = [
  challengeCard(
    "hexa-firefly",
    "Hexa la Luciole",
    "💡",
    "common",
    "J’observe avant de choisir.",
    {
      kind: "sessions",
      threshold: 1,
      label: "Termine 1 défi 6 choix",
    },
  ),
  challengeCard(
    "tempo-turtle",
    "Tempo la Tortue",
    "🐢",
    "common",
    "Je prends le temps qu’il faut.",
    {
      kind: "sessions",
      threshold: 2,
      label: "Termine 2 défis 6 choix",
    },
  ),
  challengeCard(
    "prismo-chameleon",
    "Prismo le Caméléon",
    "🦎",
    "common",
    "Je compare les réponses proches.",
    {
      kind: "correct",
      threshold: 20,
      label: "Réussis 20 réponses en mode 6 choix",
    },
  ),
  challengeCard(
    "boulon-robot",
    "Boulon le Robot",
    "🤖",
    "rare",
    "Je vérifie mon calcul.",
    {
      kind: "sessions",
      threshold: 5,
      label: "Termine 5 défis 6 choix",
    },
  ),
  challengeCard(
    "manta-memo",
    "Manta-Mémo",
    "🌊",
    "rare",
    "Ma mémoire devient plus forte.",
    {
      kind: "correct",
      threshold: 40,
      label: "Réussis 40 réponses en mode 6 choix",
    },
  ),
  challengeCard(
    "nova-six",
    "Nova Six",
    "🌟",
    "epic",
    "Je continue et je progresse.",
    {
      kind: "perfect-or-sessions",
      perfectThreshold: 1,
      sessionsThreshold: 10,
      label: "Réussis un 10/10 ou termine 10 défis",
    },
  ),
];

export function getChallengeCardById(
  cardId: string,
): ChallengeCard | undefined {
  return CHALLENGE_CARDS.find((card) => card.id === cardId);
}

export function isChallengeCardUnlocked(
  card: ChallengeCard,
  progress: ChallengeSixProgress,
): boolean {
  if (card.requirement.kind === "sessions") {
    return progress.sessionsCompleted >= card.requirement.threshold;
  }

  if (card.requirement.kind === "correct") {
    return progress.correctAnswers >= card.requirement.threshold;
  }

  return (
    progress.perfectSessions >= card.requirement.perfectThreshold ||
    progress.sessionsCompleted >= card.requirement.sessionsThreshold
  );
}

/**
 * Returns the first card in album order that is both earned and not owned.
 * Keeping the order makes large jumps in progress reveal one understandable
 * card at a time instead of flooding the session summary.
 */
export function selectNextChallengeCard(
  unlockedCardIds: string[],
  progress: ChallengeSixProgress,
): ChallengeCard | null {
  const owned = new Set(unlockedCardIds);
  const nextCard = CHALLENGE_CARDS.find((card) => !owned.has(card.id));

  return nextCard && isChallengeCardUnlocked(nextCard, progress)
    ? nextCard
    : null;
}

export function getChallengeCardProgress(
  card: ChallengeCard,
  progress: ChallengeSixProgress,
): { current: number; target: number; percent: number; label: string } {
  if (card.requirement.kind === "sessions") {
    return progressValue(
      progress.sessionsCompleted,
      card.requirement.threshold,
      card.requirement.label,
    );
  }

  if (card.requirement.kind === "correct") {
    return progressValue(
      progress.correctAnswers,
      card.requirement.threshold,
      card.requirement.label,
    );
  }

  const perfectProgress =
    progress.perfectSessions >= card.requirement.perfectThreshold
      ? card.requirement.perfectThreshold
      : 0;
  const sessionProgress = Math.min(
    progress.sessionsCompleted,
    card.requirement.sessionsThreshold,
  );
  const usePerfectPath = perfectProgress > 0;
  const current = usePerfectPath ? perfectProgress : sessionProgress;
  const target = usePerfectPath
    ? card.requirement.perfectThreshold
    : card.requirement.sessionsThreshold;

  return {
    current,
    target,
    percent: Math.min(100, Math.round((current / target) * 100)),
    label: card.requirement.label,
  };
}

function challengeCard(
  id: string,
  label: string,
  symbol: string,
  rarity: StickerRarity,
  tagline: string,
  requirement: ChallengeCard["requirement"],
): ChallengeCard {
  return { id, label, symbol, rarity, tagline, requirement };
}

function progressValue(
  current: number,
  target: number,
  label: string,
): { current: number; target: number; percent: number; label: string } {
  return {
    current: Math.min(current, target),
    target,
    percent: Math.min(100, Math.round((current / target) * 100)),
    label,
  };
}
