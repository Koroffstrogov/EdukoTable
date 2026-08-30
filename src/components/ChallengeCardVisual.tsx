import { getStickerRarityLabel } from "../domain/rewards";
import type { ChallengeCard } from "../domain/types";

type ChallengeCardVisualProps = {
  card: ChallengeCard;
  locked?: boolean;
  size?: "normal" | "large";
};

export function ChallengeCardVisual({
  card,
  locked = false,
  size = "normal",
}: ChallengeCardVisualProps) {
  return (
    <div
      className={`challenge-card challenge-card-${card.rarity} challenge-card-${size} ${
        locked ? "is-locked" : "is-unlocked"
      }`}
      aria-hidden="true"
    >
      <span className="challenge-card-topline">Défi 6</span>
      <span className="challenge-card-symbol">{locked ? "?" : card.symbol}</span>
      <span className="challenge-card-name">
        {locked ? "Carte à trouver" : card.label}
      </span>
      <span className="challenge-card-rarity">
        {getStickerRarityLabel(card.rarity)}
      </span>
    </div>
  );
}
