export const EDUKO_ANIMATION_IDS = [
  "mascot-idle",
  "mascot-happy",
  "mascot-encouraging",
  "star-pop",
  "sticker-unlock",
  "mission-complete",
] as const;

export type EdukoAnimationId = (typeof EDUKO_ANIMATION_IDS)[number];

export type EdukoAnimationDefinition = {
  id: EdukoAnimationId;
  label: string;
  durationMs: number;
  loop: boolean;
};

export const EDUKO_ANIMATIONS: Record<
  EdukoAnimationId,
  EdukoAnimationDefinition
> = {
  "mascot-idle": {
    id: "mascot-idle",
    label: "Mascotte au repos",
    durationMs: 900,
    loop: true,
  },
  "mascot-happy": {
    id: "mascot-happy",
    label: "Mascotte contente",
    durationMs: 700,
    loop: false,
  },
  "mascot-encouraging": {
    id: "mascot-encouraging",
    label: "Mascotte encourageante",
    durationMs: 700,
    loop: false,
  },
  "star-pop": {
    id: "star-pop",
    label: "Étoile gagnée",
    durationMs: 600,
    loop: false,
  },
  "sticker-unlock": {
    id: "sticker-unlock",
    label: "Sticker débloqué",
    durationMs: 1000,
    loop: false,
  },
  "mission-complete": {
    id: "mission-complete",
    label: "Mission terminée",
    durationMs: 1100,
    loop: false,
  },
};

export function getAnimationDefinition(
  animationId: string,
): EdukoAnimationDefinition | null {
  return isEdukoAnimationId(animationId)
    ? EDUKO_ANIMATIONS[animationId]
    : null;
}

export function isEdukoAnimationId(
  animationId: string,
): animationId is EdukoAnimationId {
  return EDUKO_ANIMATION_IDS.includes(animationId as EdukoAnimationId);
}
