import type { FairyCard } from "../domain/types";
import { getFairyRarityLabel } from "../domain/fairyCards";

export function FairyCardVisual({ card, eager = false, animated = false }: {
  card: FairyCard;
  eager?: boolean;
  animated?: boolean;
}) {
  return (
    <img
      className={`fairy-art${animated ? " fairy-art-animated" : ""}`}
      src={card.artwork}
      alt={`${card.name}, ${card.title}. ${getFairyRarityLabel(card.rarity)}. Évolution ${card.stage} sur 4.`}
      width={768}
      height={1024}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
