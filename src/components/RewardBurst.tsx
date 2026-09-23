import { EdukoAnimation } from "./EdukoAnimation";
import { ChallengeCardVisual } from "./ChallengeCardVisual";
import { StickerVisual } from "./StickerVisual";
import { FairyCardVisual } from "./FairyCardVisual";
import { getFairyCard, getFairyRarityLabel } from "../domain/fairyCards";
import {
  getChallengeCardById,
  getBadgeById,
  getStickerById,
  getStickerRarityLabel,
} from "../domain/rewards";
import type { RewardGrant } from "../domain/types";

type RewardBurstProps = {
  grant: RewardGrant;
  animationsEnabled: boolean;
};

export function RewardBurst({ grant, animationsEnabled }: RewardBurstProps) {
  const stickers = grant.stickerIds
    .map((stickerId) => getStickerById(stickerId))
    .filter((sticker) => sticker !== undefined);
  const badges = grant.badgeIds
    .map((badgeId) => getBadgeById(badgeId))
    .filter((badge) => badge !== undefined);
  const cards = grant.cardIds
    .map((cardId) => getChallengeCardById(cardId))
    .filter((card) => card !== undefined);
  const fairyCards = grant.fairyCardIds.map(getFairyCard).filter((card) => card !== undefined);

  return (
    <div className="reward-burst" aria-label="Récompenses gagnées">
      <div className="reward-line">
        <EdukoAnimation
          animationId="star-pop"
          className="reward-animation"
          enabled={animationsEnabled}
          fallback={<span className="reward-animation-fallback">+1</span>}
        />
        <span className="reward-token">+{grant.stars}</span>
        <span>étoiles gagnées</span>
      </div>

      {fairyCards.map((card) => (
        <div className="fairy-reveal" key={card.id}>
          <p className="fairy-kicker">{card.stage === 1 ? "Nouvelle Fabuleuse" : "Ton compagnon évolue !"}</p>
          <FairyCardVisual card={card} eager animated={animationsEnabled} />
          <strong>{card.name} · {card.title}</strong>
          <span className={`fairy-rarity rarity-${card.rarity}`}>{getFairyRarityLabel(card.rarity)}</span>
          <p>{card.power}</p>
        </div>
      ))}

      {cards.map((card) => (
        <div className="challenge-card-reveal" key={card.id}>
          <ChallengeCardVisual card={card} size="large" />
          <div>
            <span className="sticker-reveal-kicker">Nouvelle carte</span>
            <strong>{card.label}</strong>
            <span>{card.tagline}</span>
          </div>
        </div>
      ))}

      {stickers.map((sticker) => (
        <div className="sticker-reveal" key={sticker.id}>
          <EdukoAnimation
            animationId={sticker.animationId ?? "sticker-unlock"}
            className="sticker-reveal-animation"
            enabled={animationsEnabled}
            fallback={
              <StickerVisual
                sticker={sticker}
                unlocked
                animated={false}
                animationsEnabled={animationsEnabled}
                size="large"
              />
            }
          />
          <div>
            <span className="sticker-reveal-kicker">Nouveau sticker</span>
            <strong>Sticker : {sticker.label}</strong>
            <span>{getStickerRarityLabel(sticker.rarity)}</span>
          </div>
        </div>
      ))}

      {badges.map((badge) => (
        <div className="reward-line" key={badge.id}>
          <span className="reward-token">B</span>
          <span>Badge : {badge.label}</span>
        </div>
      ))}
    </div>
  );
}
