import { StickerVisual } from "./StickerVisual";
import {
  STICKER_COLLECTIONS,
  getStickerById,
  getStickerRarityLabel,
  getStickersByCollection,
  getUnlockedCountForCollection,
} from "../domain/rewards";
import type { RewardState, Sticker, StickerCollection } from "../domain/types";

type StickerAlbumProps = {
  rewards: RewardState;
  latestStickerId: string | null;
  animationsEnabled: boolean;
  onBack: () => void;
};

type StickerGroup = {
  collection: StickerCollection;
  stickers: Sticker[];
};

export function StickerAlbum({
  rewards,
  latestStickerId,
  animationsEnabled,
  onBack,
}: StickerAlbumProps) {
  const unlocked = new Set(rewards.stickersUnlocked);
  const groups = buildStickerGroups();
  const latestSticker = latestStickerId ? getStickerById(latestStickerId) : null;
  const stickerTotal = groups.reduce(
    (total, group) => total + group.stickers.length,
    0,
  );

  return (
    <section className="screen album-screen">
      <div className="screen-header">
        <button className="button quiet" type="button" onClick={onBack}>
          Accueil
        </button>
        <p className="eyebrow">Album</p>
      </div>

      <div className="screen-title-block">
        <h1>Mes stickers</h1>
        <p>
          {rewards.stickersUnlocked.length} / {stickerTotal} stickers débloqués
        </p>
      </div>

      {latestSticker && (
        <div className="latest-reward is-featured latest-sticker-card">
          <StickerVisual
            sticker={latestSticker}
            unlocked
            animated
            animationsEnabled={animationsEnabled}
            size="large"
          />
          <span className="latest-sticker-copy">
            Dernier sticker : <strong>{latestSticker.label}</strong>
            <small>{getStickerRarityLabel(latestSticker.rarity)}</small>
          </span>
        </div>
      )}

      {groups.map((group) => {
        const unlockedCount = getUnlockedCountForCollection(
          group.collection.id,
          rewards.stickersUnlocked,
        );
        const progress = Math.round((unlockedCount / group.stickers.length) * 100);

        return (
          <section className="album-section" key={group.collection.id}>
            <div className="album-section-head">
              <div>
                <h2>{group.collection.label}</h2>
                <p>{group.collection.description}</p>
              </div>
              <strong>
                {unlockedCount}/{group.stickers.length}
              </strong>
            </div>
            <span
              className="collection-progress"
              aria-label={`Progression ${group.collection.label}`}
            >
              <span style={{ width: `${progress}%` }} />
            </span>
            <div className="sticker-grid">
              {group.stickers.map((sticker) => {
                const isUnlocked = unlocked.has(sticker.id);
                const isLatest = sticker.id === latestStickerId;
                const animated =
                  isLatest ||
                  (isUnlocked &&
                    sticker.rarity !== "common" &&
                    sticker.animationId !== undefined);

                return (
                  <div
                    className={`sticker-card sticker-card-${sticker.rarity} ${
                      isUnlocked ? "is-unlocked" : "is-locked"
                    } ${isLatest ? "is-latest" : ""}`}
                    key={sticker.id}
                    aria-label={
                      isUnlocked
                        ? `Sticker ${sticker.label}`
                        : "Sticker verrouillé"
                    }
                  >
                    <StickerVisual
                      sticker={sticker}
                      unlocked={isUnlocked}
                      animated={animated}
                      animationsEnabled={animationsEnabled}
                    />
                    <span className="sticker-label">
                      {isUnlocked ? sticker.label : "À trouver"}
                    </span>
                    <span className="sticker-rarity-label">
                      {getStickerRarityLabel(sticker.rarity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </section>
  );
}

function buildStickerGroups(): StickerGroup[] {
  return STICKER_COLLECTIONS.map((collection) => ({
    collection,
    stickers: getStickersByCollection(collection.id),
  }));
}
