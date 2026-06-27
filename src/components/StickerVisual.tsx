import { EdukoAnimation } from "./EdukoAnimation";
import type { Sticker } from "../domain/types";

type StickerVisualProps = {
  sticker: Sticker;
  unlocked: boolean;
  animated: boolean;
  animationsEnabled: boolean;
  size?: "normal" | "large";
};

export function StickerVisual({
  sticker,
  unlocked,
  animated,
  animationsEnabled,
  size = "normal",
}: StickerVisualProps) {
  const visual = (
    <span
      className={`sticker-visual sticker-visual-${size} sticker-theme-${sticker.collectionId} sticker-rarity-${sticker.rarity} ${
        unlocked ? "is-unlocked" : "is-locked"
      }`}
    >
      <span className="sticker-visual-glow" />
      <span className="sticker-visual-shape" />
      <span className="sticker-visual-symbol">
        {unlocked ? sticker.symbol : "?"}
      </span>
    </span>
  );

  if (!animated || !sticker.animationId) {
    return (
      <span className="sticker-visual-wrap" aria-hidden="true">
        {visual}
      </span>
    );
  }

  return (
    <EdukoAnimation
      animationId={sticker.animationId}
      className={`sticker-visual-wrap sticker-visual-animation sticker-visual-animation-${size}`}
      enabled={animationsEnabled}
      fallback={visual}
    />
  );
}
