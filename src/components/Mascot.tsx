import type { MascotMood } from "../domain/types";

type MascotProps = {
  mood: MascotMood;
};

const moodLabels: Record<MascotMood, string> = {
  idle: "Prêt",
  thinking: "Je réfléchis",
  happy: "Bravo",
  encouraging: "On continue",
  celebrating: "Mission finie",
};

export function Mascot({ mood }: MascotProps) {
  return (
    <div className={`mascot mascot-${mood}`} aria-label={`Eduko ${moodLabels[mood]}`}>
      <span className="mascot-face" aria-hidden="true">
        <span className="mascot-eye" />
        <span className="mascot-eye" />
        <span className="mascot-smile" />
      </span>
      <span className="mascot-label">{moodLabels[mood]}</span>
    </div>
  );
}
