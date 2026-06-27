import { STICKERS } from "../domain/rewards";
import type { RewardState, Sticker } from "../domain/types";

type StickerAlbumProps = {
  rewards: RewardState;
  latestStickerId: string | null;
  onBack: () => void;
};

type StickerGroup = {
  collectionId: string;
  label: string;
  stickers: Sticker[];
};

const collectionLabels: Record<string, string> = {
  forest: "Forêt Eduko",
  space: "Espace Eduko",
  ocean: "Océan Eduko",
  machine: "Machines",
  special: "Spéciaux",
  mastery: "Tables maîtrisées",
};

export function StickerAlbum({
  rewards,
  latestStickerId,
  onBack,
}: StickerAlbumProps) {
  const unlocked = new Set(rewards.stickersUnlocked);
  const groups = buildStickerGroups();
  const latestSticker = STICKERS.find((sticker) => sticker.id === latestStickerId);

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
        <p>{rewards.stickersUnlocked.length} stickers débloqués</p>
      </div>

      {latestSticker && (
        <div className="latest-reward is-featured">
          <span className="reward-token">{latestSticker.symbol}</span>
          <span>Dernier sticker : {latestSticker.label}</span>
        </div>
      )}

      {groups.map((group) => (
        <section className="album-section" key={group.collectionId}>
          <h2>{group.label}</h2>
          <div className="sticker-grid">
            {group.stickers.map((sticker) => {
              const isUnlocked = unlocked.has(sticker.id);
              const isLatest = sticker.id === latestStickerId;

              return (
                <div
                  className={`sticker-card ${isUnlocked ? "is-unlocked" : "is-locked"} ${
                    isLatest ? "is-latest" : ""
                  }`}
                  key={sticker.id}
                  aria-label={
                    isUnlocked
                      ? `Sticker ${sticker.label}`
                      : "Sticker verrouillé"
                  }
                >
                  <span className="sticker-symbol">
                    {isUnlocked ? sticker.symbol : "?"}
                  </span>
                  <span className="sticker-label">
                    {isUnlocked ? sticker.label : "Verrouillé"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}

function buildStickerGroups(): StickerGroup[] {
  const groups = new Map<string, Sticker[]>();

  for (const sticker of STICKERS) {
    groups.set(sticker.collectionId, [
      ...(groups.get(sticker.collectionId) ?? []),
      sticker,
    ]);
  }

  return Array.from(groups.entries()).map(([collectionId, stickers]) => ({
    collectionId,
    label: collectionLabels[collectionId] ?? collectionId,
    stickers,
  }));
}
