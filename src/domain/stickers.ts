import { FACTORS, type Sticker, type StickerCollection, type StickerRarity } from "./types";

export const STICKER_COLLECTIONS: StickerCollection[] = [
  {
    id: "forest",
    label: "Forêt Eduko",
    description: "Feuilles, cabanes et petites lumières.",
  },
  {
    id: "space",
    label: "Espace Eduko",
    description: "Fusées, planètes et étoiles calmes.",
  },
  {
    id: "ocean",
    label: "Océan Eduko",
    description: "Coquillages, vagues et trésors bleus.",
  },
  {
    id: "machine",
    label: "Machines rigolotes",
    description: "Roues, boutons et inventions douces.",
  },
  {
    id: "creatures",
    label: "Créatures amies",
    description: "Compagnons spéciaux gagnés avec les progrès.",
  },
];

export const STICKERS: Sticker[] = [
  sticker("forest-leaf", "forest", "Feuille brillante", "🍃", "common"),
  sticker("forest-tree", "forest", "Grand arbre", "🌳", "common"),
  sticker("forest-mushroom", "forest", "Champignon doux", "🍄", "common"),
  sticker("forest-fern", "forest", "Fougère calme", "🌿", "common"),
  sticker("forest-acorn", "forest", "Graine dorée", "●", "common"),
  sticker("forest-cabin", "forest", "Cabane Eduko", "⌂", "common"),
  sticker("forest-firefly", "forest", "Lumière verte", "✦", "rare", "session", "sticker-unlock"),
  sticker("forest-bridge", "forest", "Petit pont", "∩", "common"),
  sticker("forest-crown", "forest", "Couronne de feuilles", "♢", "rare", "session", "star-pop"),
  sticker("forest-secret", "forest", "Clairière secrète", "✶", "epic", "session", "mission-complete"),

  sticker("space-rocket", "space", "Fusée Eduko", "🚀", "common"),
  sticker("space-planet", "space", "Planète calme", "🪐", "common"),
  sticker("space-moon", "space", "Lune ronde", "◐", "common"),
  sticker("space-comet", "space", "Comète rapide", "☄", "common"),
  sticker("space-satellite", "space", "Satellite ami", "◌", "common"),
  sticker("space-star-map", "space", "Carte étoilée", "✧", "common"),
  sticker("space-nebula", "space", "Nuage violet", "◇", "rare", "session", "sticker-unlock"),
  sticker("space-orbit", "space", "Orbite douce", "◎", "common"),
  sticker("space-super-star", "space", "Super étoile", "★", "rare", "session", "star-pop"),
  sticker("space-galaxy", "space", "Galaxie Eduko", "✺", "epic", "session", "mission-complete"),

  sticker("ocean-shell", "ocean", "Coquillage bleu", "◓", "common"),
  sticker("ocean-wave", "ocean", "Vague souriante", "≈", "common"),
  sticker("ocean-pearl", "ocean", "Perle douce", "○", "common"),
  sticker("ocean-coral", "ocean", "Corail rose", "♧", "common"),
  sticker("ocean-boat", "ocean", "Petit bateau", "△", "common"),
  sticker("ocean-bubble", "ocean", "Bulle claire", "◌", "common"),
  sticker("ocean-lighthouse", "ocean", "Phare brillant", "▴", "rare", "session", "sticker-unlock"),
  sticker("ocean-map", "ocean", "Carte marine", "□", "common"),
  sticker("ocean-current", "ocean", "Courant bleu", "∿", "rare", "session", "star-pop"),
  sticker("ocean-treasure", "ocean", "Trésor marin", "✹", "epic", "session", "mission-complete"),

  sticker("machine-gear", "machine", "Roue magique", "⚙", "common"),
  sticker("machine-button", "machine", "Bouton jaune", "●", "common"),
  sticker("machine-spring", "machine", "Ressort joyeux", "⌁", "common"),
  sticker("machine-bolt", "machine", "Éclair doux", "⌁", "common"),
  sticker("machine-cog-blue", "machine", "Roue bleue", "◍", "common"),
  sticker("machine-console", "machine", "Console calme", "▣", "common"),
  sticker("machine-lamp", "machine", "Lampe idée", "◉", "rare", "session", "sticker-unlock"),
  sticker("machine-pipe", "machine", "Tuyau malin", "└", "common"),
  sticker("machine-mini-bot", "machine", "Mini robot", "▦", "rare", "session", "star-pop"),
  sticker("machine-invention", "machine", "Grande invention", "✷", "epic", "session", "mission-complete"),

  sticker("perfect-spark", "creatures", "Session parfaite", "✦", "epic", "perfect", "mission-complete"),
  ...FACTORS.map((factor) =>
    sticker(
      `table-${factor}-spark`,
      "creatures",
      `Table ${factor} complice`,
      `${factor}`,
      factor >= 8 ? "epic" : "rare",
      "table",
      factor >= 8 ? "mission-complete" : "sticker-unlock",
    ),
  ),
];

export function getStickerById(stickerId: string): Sticker | undefined {
  return STICKERS.find((sticker) => sticker.id === stickerId);
}

export function getStickerCollectionById(
  collectionId: string,
): StickerCollection | undefined {
  return STICKER_COLLECTIONS.find((collection) => collection.id === collectionId);
}

export function getStickersByCollection(collectionId: string): Sticker[] {
  return STICKERS.filter((sticker) => sticker.collectionId === collectionId);
}

export function getUnlockedCountForCollection(
  collectionId: string,
  unlockedIds: string[],
): number {
  const unlocked = new Set(unlockedIds);
  return getStickersByCollection(collectionId).filter((sticker) =>
    unlocked.has(sticker.id),
  ).length;
}

export function selectNextSessionSticker(unlockedIds: string[]): Sticker | null {
  const unlocked = new Set(unlockedIds);
  return (
    STICKERS.find(
      (sticker) =>
        sticker.unlockKind === "session" && !unlocked.has(sticker.id),
    ) ?? null
  );
}

export function getStickerRarityLabel(rarity: StickerRarity): string {
  if (rarity === "epic") return "Épique";
  if (rarity === "rare") return "Rare";
  return "Commun";
}

function sticker(
  id: string,
  collectionId: string,
  label: string,
  symbol: string,
  rarity: StickerRarity,
  unlockKind: Sticker["unlockKind"] = "session",
  animationId?: string,
): Sticker {
  return {
    id,
    collectionId,
    label,
    symbol,
    rarity,
    unlockKind,
    animationId,
  };
}
