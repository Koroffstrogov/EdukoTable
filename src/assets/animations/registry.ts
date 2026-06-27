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

  return definition ? animationAssets[definition.id] : null;
}
