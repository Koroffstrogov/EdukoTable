import { useEffect, useRef, useState } from "react";
import { FAIRY_CARDS, FAIRY_FAMILIES, FAIRY_RARITIES, getFairyProgress, getFairyRarityLabel } from "../domain/fairyCards";
import type { FairyCard, FairyCollection, FairyFamilyId } from "../domain/types";
import { FairyCardVisual } from "./FairyCardVisual";

type FairyAlbumProps = {
  collection: FairyCollection;
  animationsEnabled: boolean;
  onChooseCompanion: (familyId: FairyFamilyId) => void;
};

export function FairyAlbum({ collection, animationsEnabled, onChooseCompanion }: FairyAlbumProps) {
  const [familyId, setFamilyId] = useState(collection.selectedFamilyId);
  const [viewedCard, setViewedCard] = useState<FairyCard | null>(null);
  const family = FAIRY_FAMILIES.find((item) => item.id === familyId)!;
  const { cards, sessions, nextCard, remaining } = getFairyProgress(collection, familyId);
  const isCompanion = collection.selectedFamilyId === familyId;

  return (
    <section className="fairy-album" aria-labelledby="fairy-album-title">
      <div className="fairy-heading">
        <p className="fairy-kicker">Le Grand Bal des Merveilles</p>
        <h2 id="fairy-album-title">Les Fabuleuses d’Eduko</h2>
        <p>De petits compagnons. De très grands pouvoirs.</p>
        <span className="fairy-count">{collection.unlockedCardIds.length} / {FAIRY_CARDS.length} cartes gagnées</span>
      </div>

      <div className="fairy-family-picker" role="group" aria-label="Familles de Fabuleuses">
        {FAIRY_FAMILIES.map((item) => (
          <button key={item.id} type="button" aria-pressed={familyId === item.id}
            onClick={() => setFamilyId(item.id)}>
            <img src={`/cards/fabuleuses/thumbnails/${item.id}.webp`} alt="" width={42} height={56} />
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <button className="button fairy-primary" type="button" disabled={isCompanion}
        onClick={() => onChooseCompanion(familyId)}>
        {isCompanion ? `${family.name} t’accompagne` : `Choisir ${family.name}`}
      </button>

      <div className="fairy-card-grid">
        {cards.map((card) => {
          const owned = collection.unlockedCardIds.includes(card.id);
          return (
            <button key={card.id} type="button" className={`fairy-card-button ${owned ? "is-owned" : "is-preview"}`}
              aria-label={`Voir ${card.name} : ${card.title}, ${owned ? "carte gagnée" : "aperçu à débloquer"}`}
              onClick={(event) => {
                // Safari does not focus buttons on a pointer click by default.
                event.currentTarget.focus();
                setViewedCard(card);
              }}>
              <FairyCardVisual card={card} />
              <span className="fairy-card-status">{owned ? "Dans ton album" : "Aperçu · à débloquer"}</span>
              <strong>{card.title}</strong>
              <span className={`fairy-rarity rarity-${card.rarity}`}>{getFairyRarityLabel(card.rarity)}</span>
              <small>Évolution {card.stage}/4 · {card.requiredSessions} mission{card.requiredSessions > 1 ? "s" : ""}</small>
            </button>
          );
        })}
      </div>

      <div className="fairy-companion" aria-live="polite">
        <p className="fairy-kicker">{family.world}</p>
        <h3>{family.name}</h3>
        <p>{family.description}</p>
        {nextCard ? (
          <div className="fairy-next">
            <label htmlFor="fairy-progress">Encore {remaining} mission{remaining > 1 ? "s" : ""} avec {family.name}</label>
            <progress id="fairy-progress" value={sessions} max={nextCard.requiredSessions} />
            <p>Prochaine carte : <strong>{nextCard.title}</strong></p>
          </div>
        ) : <p className="fairy-complete">Les quatre évolutions sont à toi ! Tu peux choisir un autre compagnon.</p>}
        <p className="fairy-help">Chaque mission de 10 questions terminée fait grandir ton compagnon, même avec des erreurs. Tu gardes tes progrès en changeant de compagnon.</p>
      </div>

      <details className="fairy-rarity-guide">
        <summary>Les 8 raretés, du petit éclat au grand WOUAH</summary>
        <ol>{FAIRY_RARITIES.map((rarity) => <li key={rarity.id}><span className={`fairy-rarity rarity-${rarity.id}`}>{rarity.label}</span></li>)}</ol>
        <p>Les raretés racontent leur magie. Toutes les cartes se gagnent en terminant des missions.</p>
      </details>
      <p className="fairy-edition">Les {FAIRY_CARDS.length} premières Fabuleuses de la collection de 100 imaginée pour le Grand Bal.</p>

      {viewedCard && <FairyCardDialog card={viewedCard}
        owned={collection.unlockedCardIds.includes(viewedCard.id)}
        remaining={Math.max(0, viewedCard.requiredSessions - collection.sessionsByFamily[viewedCard.familyId])}
        animationsEnabled={animationsEnabled} onClose={() => setViewedCard(null)} />}
    </section>
  );
}

function FairyCardDialog({ card, owned, remaining, animationsEnabled, onClose }: {
  card: FairyCard; owned: boolean; remaining: number; animationsEnabled: boolean; onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="fairy-dialog" aria-labelledby="fairy-card-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="fairy-dialog-toolbar">
        <span>{owned ? "Ta Fabuleuse" : "Aperçu de la carte"}</span>
        <button className="button quiet" type="button" autoFocus onClick={onClose}>Fermer</button>
      </div>
      <FairyCardVisual card={card} eager animated={animationsEnabled} />
      <div className="fairy-story">
        <span className={`fairy-rarity rarity-${card.rarity}`}>{getFairyRarityLabel(card.rarity)}</span>
        <h2 id="fairy-card-title">{card.name} · {card.title}</h2>
        <p>{owned ? "Cette carte est dans ton album." : `À gagner : encore ${remaining} mission${remaining > 1 ? "s" : ""} avec ${card.name}.`}</p>
        <h3>Son pouvoir</h3><p>{card.power}</p>
        <h3>Son petit secret</h3><p>{card.secret}</p>
      </div>
    </dialog>
  );
}
