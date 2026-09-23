import { ChallengeCardVisual } from "./ChallengeCardVisual";
import { StickerVisual } from "./StickerVisual";
import { FairyAlbum } from "./FairyAlbum";
import {
  CHALLENGE_CARDS,
  getChallengeCardProgress,
  STICKER_COLLECTIONS,
  getStickerById,
  getStickerRarityLabel,
  getStickersByCollection,
  getUnlockedCountForCollection,
} from "../domain/rewards";
import type { FairyFamilyId, RewardState, Sticker, StickerCollection } from "../domain/types";

type StickerAlbumProps = {
  rewards: RewardState;
  latestStickerId: string | null;
  animationsEnabled: boolean;
  onBack: () => void;
  onChooseCompanion: (familyId: FairyFamilyId) => void;
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
  onChooseCompanion,
}: StickerAlbumProps) {
  const unlocked = new Set(rewards.stickersUnlocked);
  const groups = buildStickerGroups();
  const latestSticker = latestStickerId ? getStickerById(latestStickerId) : null;
  const challengeCardsUnlocked = new Set(rewards.challengeCardsUnlocked);
  const nextChallengeCard = CHALLENGE_CARDS.find(
    (card) => !challengeCardsUnlocked.has(card.id),
  );
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
        <h1 className="album-page-title">Mon album</h1>
      </div>

      <FairyAlbum collection={rewards.fairyCollection} animationsEnabled={animationsEnabled}
        onChooseCompanion={onChooseCompanion} />

      <div className="screen-title-block">
        <h2>Mes stickers</h2>
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

      <section className="album-section challenge-card-section">
        <div className="album-section-head">
          <div>
            <h2>La Bande des Six</h2>
            <p>Des cartes à gagner en relevant les défis à 6 choix.</p>
          </div>
          <strong>
            {rewards.challengeCardsUnlocked.length}/{CHALLENGE_CARDS.length}
          </strong>
        </div>
        <p className="challenge-card-progress-copy">
          {rewards.challengeSix.sessionsCompleted} défi
          {rewards.challengeSix.sessionsCompleted > 1 ? "s" : ""} terminé
          {rewards.challengeSix.sessionsCompleted > 1 ? "s" : ""} · {rewards.challengeSix.correctAnswers} bonne
          {rewards.challengeSix.correctAnswers > 1 ? "s" : ""} réponse
          {rewards.challengeSix.correctAnswers > 1 ? "s" : ""}
        </p>
        <div className="challenge-card-grid">
          {CHALLENGE_CARDS.map((card) => {
            const isUnlocked = challengeCardsUnlocked.has(card.id);
            const isNext = nextChallengeCard?.id === card.id;
            const progress = getChallengeCardProgress(
              card,
              rewards.challengeSix,
            );

            return (
              <article
                className={`challenge-card-entry ${
                  isUnlocked ? "is-unlocked" : "is-locked"
                } ${isNext ? "is-next" : ""}`}
                key={card.id}
                aria-label={
                  isUnlocked
                    ? `Carte ${card.label}`
                    : `Carte verrouillée : ${card.requirement.label}`
                }
              >
                <ChallengeCardVisual card={card} locked={!isUnlocked} />
                {isUnlocked ? (
                  <span className="challenge-card-tagline">{card.tagline}</span>
                ) : (
                  <>
                    <span className="challenge-card-unlock-label">
                      {isNext ? "Prochaine carte" : "À débloquer"}
                    </span>
                    <span className="challenge-card-unlock-hint">
                      {progress.current}/{progress.target} · {progress.label}
                    </span>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>

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
