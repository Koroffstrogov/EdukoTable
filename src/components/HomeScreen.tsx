import { Mascot } from "./Mascot";
import type { Factor, MascotMood, RewardState, Sticker } from "../domain/types";

type HomeScreenProps = {
  rewards: RewardState;
  selectedTables: Factor[];
  latestSticker: Sticker | null;
  mascotMood: MascotMood;
  onStartRandom: () => void;
  onStartTraining: () => void;
  onOpenAlbum: () => void;
  onOpenProgress: () => void;
};

export function HomeScreen({
  rewards,
  selectedTables,
  latestSticker,
  mascotMood,
  onStartRandom,
  onStartTraining,
  onOpenAlbum,
  onOpenProgress,
}: HomeScreenProps) {
  return (
    <section className="screen home-screen">
      <div className="home-top">
        <div>
          <p className="eyebrow">Tables de multiplication</p>
          <h1>EdukoTable</h1>
        </div>
        <Mascot mood={mascotMood} />
      </div>

      <div className="home-stats" aria-label="Récompenses">
        <div>
          <span className="stat-value">{rewards.stars}</span>
          <span className="stat-label">étoiles</span>
        </div>
        <div>
          <span className="stat-value">{rewards.stickersUnlocked.length}</span>
          <span className="stat-label">stickers</span>
        </div>
        <div>
          <span className="stat-value">{rewards.badgesUnlocked.length}</span>
          <span className="stat-label">badges</span>
        </div>
      </div>

      {latestSticker && (
        <div className="latest-reward">
          <span className="reward-token">{latestSticker.symbol}</span>
          <span>Dernier sticker : {latestSticker.label}</span>
        </div>
      )}

      <div className="action-stack">
        <button className="button primary" type="button" onClick={onStartRandom}>
          Mission rapide
        </button>
        <button className="button secondary" type="button" onClick={onStartTraining}>
          Entraînement ciblé
        </button>
      </div>

      <div className="secondary-actions">
        <button className="button secondary" type="button" onClick={onOpenAlbum}>
          Album
        </button>
        <button className="button secondary" type="button" onClick={onOpenProgress}>
          Progression
        </button>
      </div>

      <p className="selection-note">
        Tables choisies : {selectedTables.join(", ")}
      </p>
    </section>
  );
}
