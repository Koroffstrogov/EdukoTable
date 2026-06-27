import { getBadgeById, getStickerById } from "../domain/rewards";
import type { RewardGrant } from "../domain/types";

type RewardBurstProps = {
  grant: RewardGrant;
};

export function RewardBurst({ grant }: RewardBurstProps) {
  const stickers = grant.stickerIds
    .map((stickerId) => getStickerById(stickerId))
    .filter((sticker) => sticker !== undefined);
  const badges = grant.badgeIds
    .map((badgeId) => getBadgeById(badgeId))
    .filter((badge) => badge !== undefined);

  return (
    <div className="reward-burst" aria-label="Recompenses gagnees">
      <div className="reward-line">
        <span className="reward-token">+{grant.stars}</span>
        <span>etoiles gagnees</span>
      </div>

      {stickers.map((sticker) => (
        <div className="reward-line" key={sticker.id}>
          <span className="reward-token">{sticker.symbol}</span>
          <span>Sticker : {sticker.label}</span>
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
