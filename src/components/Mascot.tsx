import { EdukoAnimation } from "./EdukoAnimation";
import type { EdukoAnimationId } from "../domain/animations";
import type { MascotMood } from "../domain/types";

type MascotProps = {
  mood: MascotMood;
  animationsEnabled: boolean;
};

const moodLabels: Record<MascotMood, string> = {
  idle: "Prêt",
  thinking: "Je réfléchis",
  happy: "Bravo",
  encouraging: "On continue",
  celebrating: "Mission finie",
};

const moodAnimations: Record<MascotMood, EdukoAnimationId> = {
  idle: "mascot-idle",
  thinking: "mascot-idle",
  happy: "mascot-happy",
  encouraging: "mascot-encouraging",
  celebrating: "mission-complete",
};

export function Mascot({ mood, animationsEnabled }: MascotProps) {
  return (
    <div className={`mascot mascot-${mood}`} aria-label={`Eduko ${moodLabels[mood]}`}>
      <EdukoAnimation
        animationId={moodAnimations[mood]}
        className="mascot-animation"
        enabled={animationsEnabled}
        fallback={<MascotFallback mood={mood} />}
      />
      <span className="mascot-label">{moodLabels[mood]}</span>
    </div>
  );
}

function MascotFallback({ mood }: { mood: MascotMood }) {
  return (
    <span className={`mascot-face mascot-face-${mood}`} aria-hidden="true">
      <span className="mascot-brow mascot-brow-left" />
      <span className="mascot-brow mascot-brow-right" />
      <span className="mascot-eye" />
      <span className="mascot-eye" />
      <span className="mascot-smile" />
      <span className="mascot-cheek mascot-cheek-left" />
      <span className="mascot-cheek mascot-cheek-right" />
    </span>
  );
}
