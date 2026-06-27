import mascotEncouraging from "./mascot-encouraging.json";
import mascotHappy from "./mascot-happy.json";
import mascotIdle from "./mascot-idle.json";
import missionComplete from "./mission-complete.json";
import starPop from "./star-pop.json";
import stickerUnlock from "./sticker-unlock.json";
import {
  getAnimationDefinition,
  type EdukoAnimationId,
} from "../../domain/animations";

type LottieAnimationData = Record<string, unknown>;

const animationAssets: Record<EdukoAnimationId, LottieAnimationData> = {
  "mascot-idle": mascotIdle,
  "mascot-happy": mascotHappy,
  "mascot-encouraging": mascotEncouraging,
  "star-pop": starPop,
  "sticker-unlock": stickerUnlock,
  "mission-complete": missionComplete,
};

export function getAnimationAsset(
  animationId: string,
): LottieAnimationData | null {
  const definition = getAnimationDefinition(animationId);
  const animationData = definition ? animationAssets[definition.id] : null;

  return isLottieAnimationData(animationData) ? animationData : null;
}

export function isLottieAnimationData(
  value: unknown,
): value is LottieAnimationData {
  return (
    isRecord(value) &&
    typeof value.v === "string" &&
    typeof value.fr === "number" &&
    typeof value.ip === "number" &&
    typeof value.op === "number" &&
    typeof value.w === "number" &&
    typeof value.h === "number" &&
    Array.isArray(value.layers)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
