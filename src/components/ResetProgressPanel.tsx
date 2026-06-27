import { useState } from "react";

type ResetProgressPanelProps = {
  onResetResults: () => void;
  onResetAdventure: () => void;
};

type AdventureStep = "idle" | "warning" | "final";

export function ResetProgressPanel({
  onResetResults,
  onResetAdventure,
}: ResetProgressPanelProps) {
  const [confirmResults, setConfirmResults] = useState(false);
  const [adventureStep, setAdventureStep] = useState<AdventureStep>("idle");

  return (
    <section className="reset-panel">
      <h2>Réinitialisation</h2>

      <div className="reset-action">
        <div>
          <strong>Réinitialiser les résultats</strong>
          <p>Les statistiques sont effacées. Les étoiles, stickers et badges restent.</p>
        </div>
        {confirmResults ? (
          <div className="confirm-row">
            <button
              className="button danger compact"
              type="button"
              onClick={() => {
                onResetResults();
                setConfirmResults(false);
              }}
            >
              Confirmer
            </button>
            <button
              className="button quiet compact"
              type="button"
              onClick={() => setConfirmResults(false)}
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            className="button secondary compact"
            type="button"
            onClick={() => setConfirmResults(true)}
          >
            Réinitialiser les résultats
          </button>
        )}
      </div>

      <div className="reset-action reset-action-strong">
        <div>
          <strong>Recommencer toute l’aventure</strong>
          <p>Tout est effacé : progression, étoiles, stickers et badges.</p>
        </div>

        {adventureStep === "idle" && (
          <button
            className="button secondary compact"
            type="button"
            onClick={() => setAdventureStep("warning")}
          >
            Recommencer toute l’aventure
          </button>
        )}

        {adventureStep === "warning" && (
          <div className="confirm-row">
            <button
              className="button danger compact"
              type="button"
              onClick={() => setAdventureStep("final")}
            >
              Je comprends
            </button>
            <button
              className="button quiet compact"
              type="button"
              onClick={() => setAdventureStep("idle")}
            >
              Annuler
            </button>
          </div>
        )}

        {adventureStep === "final" && (
          <div className="confirm-row">
            <button
              className="button danger compact"
              type="button"
              onClick={onResetAdventure}
            >
              Tout effacer
            </button>
            <button
              className="button quiet compact"
              type="button"
              onClick={() => setAdventureStep("idle")}
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
